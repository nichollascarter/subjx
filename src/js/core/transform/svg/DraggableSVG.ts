import { helper } from '../../Helper';
import Transformable from '../Transformable';
import type {
    Point,
    Delta,
    ResizeFlags,
    ElementData,
    TransformHandles,
    TransformOptions,
    TransformStorage
} from '../Transformable';
import type { PointerInput } from '../../SubjectModel';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
import { isDef, isUndef, warn } from '../../util/util';
import { floatToFixed, getMinMaxOfArray, DEG } from '../common';
import { movePath, resizePath } from './path';
import { boxFromPoints, unionBoxes } from '../guides';
import type { Box, GuideLine, GuideState } from '../guides';

import {
    THEME_COLOR,
    EVENT_EMITTER_CONSTANTS,
    CLIENT_EVENTS_CONSTANTS,
    TRANSFORM_HANDLES_CONSTANTS
} from '../../consts';

import {
    checkChildElements,
    createSVGElement,
    createSVGMatrix,
    createTranslateMatrix,
    createRotateMatrix,
    createScaleMatrix,
    isSVGGroup,
    parsePoints,
    getTransformToElement,
    matrixToString,
    pointTo,
    isIdentity
} from './util';

const { E_DRAG, E_RESIZE, E_ROTATE } = EVENT_EMITTER_CONSTANTS;
const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;
const { START_POINT, END_POINT } = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_POINT_KEYS;

const { keys, entries, values } = Object;

interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface StoredAttributes {
    x?: number;
    y?: number;
    textLength?: number | null;
    r?: number;
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
    width?: number;
    height?: number;
    resX1?: number;
    resY1?: number;
    resX2?: number;
    resY2?: number;
    points?: string | null;
    path?: string | null;
    matrix: DOMMatrix;
    ctm: DOMMatrix;
    childCTM: DOMMatrix;
}

interface SVGElementTransform {
    ctm: DOMMatrix;
    matrix: DOMMatrix;
    parentMatrix: DOMMatrix;
    auxiliary: {
        scale: {
            scaleMatrix: DOMMatrix;
            translateMatrix: DOMMatrix;
        };
        translate: {
            parentMatrix: DOMMatrix;
            translateMatrix: DOMMatrix;
        };
        rotate: {
            translateMatrix: DOMMatrix;
        };
    };
    scX: number;
    scY: number;
    [key: string]: unknown;
}

interface SVGElementData extends ElementData<DOMMatrix> {
    parent: ParentNode | null;
    transform: SVGElementTransform;
    bBox: BBox;
    __data__: WeakMap<Element, StoredAttributes>;
    cached: {
        scaleX?: number;
        scaleY?: number;
        dist?: Delta & { ox: number; oy: number };
        transformMatrix?: DOMMatrix;
        resultMatrix?: DOMMatrix;
    };
}

type SVGHandles = TransformHandles & {
    center?: SVGCircleElement;
    radius?: SVGLineElement | null;
    normal?: SVGLineElement | null;
};

interface SVGStorage extends TransformStorage<DOMMatrix> {
    wrapper: SVGGElement;
    controls: SVGGElement;
    handles: SVGHandles;
    data: WeakMap<Element, SVGElementData>;
    transformOrigin: DOMPoint;
    bBox: BBox;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        hx?: number | null;
        hy?: number | null;
    };
    transform: {
        containerMatrix: DOMMatrix;
        controlsMatrix: DOMMatrix;
        controlsTranslateMatrix: DOMMatrix;
        wrapperOriginMatrix: DOMMatrix;
    };
    cached: TransformStorage<DOMMatrix>['cached'] & {
        transformOrigin?: DOMPoint;
    };
    hitAreas: Record<string, SVGCircleElement | SVGLineElement>;
    guidesLayer?: SVGGElement;
}

type SVGOptions = TransformOptions & {
    container: SVGGraphicsElement;
    controlsContainer: SVGGraphicsElement;
    restrict: SVGGraphicsElement | null;
};

type Vertices = Record<string, Point>;

export default class DraggableSVG extends Transformable<DOMMatrix, SVGStorage> {

    elements!: SVGGraphicsElement[];
    options!: SVGOptions;

    /** @internal */
    protected init(elements: SVGGraphicsElement[]) {
        const {
            options: {
                container,
                controlsContainer,
                resizable,
                rotatable,
                showNormal,
                transformOrigin,
                restrict,
                hitRadius,
                showHitAreas
            }
        } = this;

        const hitAreas: SVGStorage['hitAreas'] = {};

        const wrapper = createSVGElement('g', showHitAreas
            ? ['sjx-svg-wrapper', 'sjx-show-hit']
            : ['sjx-svg-wrapper']);
        const controls = createSVGElement('g', ['sjx-svg-controls']);

        const line = this.getLine();

        const {
            rotator = null,
            anchor = null,
            ...nextVertices
        } = this.getVertices();

        const handles: SVGHandles = {};
        let rotationHandles: SVGHandles = {};

        const nextTransformOrigin = Array.isArray(transformOrigin)
            ? pointTo(
                createSVGMatrix(),
                transformOrigin[0],
                transformOrigin[1]
            )
            : nextVertices.center;

        if (rotatable) {
            const normalLine = showNormal
                ? renderLine([anchor, rotator], THEME_COLOR, 'normal')
                : null;

            if (showNormal) controls.appendChild(normalLine!);

            let radius: SVGLineElement | null = null;

            if (transformOrigin) {
                radius = createSVGElement('line', ['sjx-hidden']);

                radius.x1.baseVal.value = nextVertices.center.x;
                radius.y1.baseVal.value = nextVertices.center.y;
                radius.x2.baseVal.value = nextTransformOrigin.x;
                radius.y2.baseVal.value = nextTransformOrigin.y;

                setLineStyle(radius, '#fe3232');
                radius.setAttribute('opacity', '0.5');

                controls.appendChild(radius);
            }

            rotationHandles = {
                ...rotationHandles,
                normal: normalLine,
                radius
            };
        }

        const boxHandles = {
            tl: nextVertices.tl,
            tr: nextVertices.tr,
            br: nextVertices.br,
            bl: nextVertices.bl,
            tc: nextVertices.tc,
            bc: nextVertices.bc,
            ml: nextVertices.ml,
            mr: nextVertices.mr
        };

        const lineHandles = {
            [START_POINT]: nextVertices[START_POINT],
            [END_POINT]: nextVertices[END_POINT]
        };

        const resizingHandles = resizable
            ? entries(line ? lineHandles : boxHandles)
                .filter(([key]) => this.isHandleEnabled(key))
                .reduce<Record<string, Point>>((result, [key, point]) => {
                    result[key] = point;
                    return result;
                }, {})
            : {};

        const resizingEdges: Record<string, (Point | undefined)[]> = {
            te: [nextVertices.tl, nextVertices.tr],
            be: [nextVertices.bl, nextVertices.br],
            le: [nextVertices.tl, nextVertices.bl],
            re: [nextVertices.tr, nextVertices.br]
        };

        keys(resizingEdges).forEach(key => {
            const data = resizingEdges[key];
            if (isUndef(data)) return;

            handles[key] = renderLine(
                data as Point[],
                THEME_COLOR,
                key
            );

            if (line || !this.isHandleEnabled(key)) {
                handles[key]!.setAttribute('pointer-events', 'none');
            }

            if (line) {
                handles[key]!.setAttribute('visibility', 'hidden');
            }

            if (hitRadius && !line && this.isHandleEnabled(key)) {
                hitAreas[key] = createHitArea('line', key, hitRadius);
                controls.appendChild(hitAreas[key]);
            }

            controls.appendChild(handles[key]!);
        });

        const allHandles: Record<string, Point | null | undefined> = {
            ...resizingHandles,
            rotator,
            center: transformOrigin && rotatable
                ? nextTransformOrigin
                : undefined
        };

        keys(allHandles).forEach(key => {
            const data = allHandles[key];
            if (isUndef(data)) return;

            const { x, y } = data!;
            const color = key === 'center'
                ? '#fe3232'
                : THEME_COLOR;

            handles[key] = createHandler(
                x,
                y,
                color,
                key
            );

            if (hitRadius) {
                hitAreas[key] = createHitArea('circle', key, hitRadius);
                controls.appendChild(hitAreas[key]);
            }

            controls.appendChild(handles[key]!);
        });

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data: SVGStorage['data'] = new WeakMap();

        elements.map(element => (
            data.set(element, {
                parent: element.parentNode,
                transform: {
                    ctm: getTransformToElement(element, container)
                } as SVGElementTransform,
                bBox: element.getBBox(),
                __data__: new WeakMap(),
                cached: {}
            })
        ));

        const restrictContainer = restrict || container;

        this.storage = {
            wrapper,
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            data,
            center: {
                isShifted: Array.isArray(transformOrigin)
            },
            transformOrigin: nextTransformOrigin,
            transform: {
                containerMatrix: getTransformToElement(restrictContainer, restrictContainer.parentNode)
            },
            cached: {},
            hitAreas
        } as SVGStorage;

        this.syncHitAreas();

        [...elements, controls].map(target => (
            helper(target)
                .on(E_MOUSEDOWN, this.onMouseDown)
                .on(E_TOUCHSTART, this.onTouchStart)
        ));
    }

    /** @internal */
    protected cursorPoint({ clientX, clientY }: PointerInput) {
        const { container } = this.options;

        return this.applyMatrixToPoint(
            container.getScreenCTM()!.inverse(),
            clientX,
            clientY
        );
    }

    /** @internal */
    protected getRestrictedBBox(force = false) {
        const {
            storage: {
                transform: {
                    containerMatrix
                } = {} as SVGStorage['transform']
            } = {} as SVGStorage,
            options: {
                container,
                restrict
            } = {} as SVGOptions
        } = this;

        const restrictEl = restrict || container;

        return getBoundingRect(
            restrictEl,
            force ? getTransformToElement(restrictEl, container) : containerMatrix
        );
    }

    /** @internal */
    protected pointToTransform({ x, y, matrix }: Point & { matrix: DOMMatrix }) {
        const nextMatrix = matrix.inverse();
        nextMatrix.e = nextMatrix.f = 0;

        return this.applyMatrixToPoint(
            nextMatrix,
            x,
            y
        );
    }

    /** @internal */
    protected pointToControls({ x, y }: Point, transform = this.storage.transform) {
        const { controlsMatrix } = transform;

        const matrix = controlsMatrix.inverse();
        matrix.e = matrix.f = 0;

        return this.applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    /** @internal */
    private applyMatrixToPoint(matrix: DOMMatrix, x: number, y: number) {
        const pt = createSVGElement('svg').createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(matrix);
    }

    /** @internal */
    protected applyTransformToElement(element: SVGGraphicsElement, actionName: string) {
        const {
            storage: {
                data,
                bBox
            } = {} as SVGStorage,
            options: {
                isGrouped,
                scalable,
                applyTranslate: applyDragging
            } = {} as SVGOptions
        } = this;

        const {
            cached = {},
            ...nextData
        } = data.get(element)!;

        const {
            transform: {
                matrix,
                parentMatrix
            },
            __data__
        } = nextData;

        const {
            scaleX,
            scaleY,
            dist: {
                dx,
                dy,
                ox,
                oy
            } = {} as NonNullable<SVGElementData['cached']['dist']>,
            transformMatrix
        } = cached as Required<SVGElementData['cached']>;

        if (actionName === E_DRAG) {
            if (!applyDragging || (!dx && !dy)) return;

            const eM = createTranslateMatrix(ox, oy);

            const translateMatrix = eM
                .multiply(matrix)
                .multiply(eM.inverse());

            this.updateElementView(element, ['transform', translateMatrix]);

            if (isSVGGroup(element)) {
                checkChildElements(element)
                    .map(child => {
                        const eM = createTranslateMatrix(dx, dy);

                        const translateMatrix = eM
                            .multiply(getTransformToElement(child, child.parentNode))
                            .multiply(eM.inverse());

                        if (!isIdentity(translateMatrix)) {
                            child.setAttribute(
                                'transform',
                                matrixToString(translateMatrix)
                            );
                        }

                        if (!isSVGGroup(child)) {
                            const ctm = parentMatrix.inverse();
                            ctm.e = ctm.f = 0;

                            const { x, y } = pointTo(ctm, ox, oy);
                            applyTranslate(child, { x, y });
                        }
                    });
            } else {
                applyTranslate(element, { x: ox, y: oy });
            }
        }

        if (actionName === E_RESIZE) {
            if (!transformMatrix) return;
            if (!scalable) {
                if (isSVGGroup(element) || isGrouped) {
                    const elements = checkChildElements(element);

                    elements.forEach(child => {
                        if (!isSVGGroup(child)) {
                            const childCTM = getTransformToElement(
                                child,
                                isGrouped ? element.parentNode : element
                            );
                            const localCTM = childCTM.inverse()
                                .multiply(transformMatrix)
                                .multiply(childCTM);

                            applyResize(
                                child,
                                {
                                    dx,
                                    dy,
                                    scaleX,
                                    scaleY,
                                    localCTM,
                                    transformMatrix,
                                    bBox,
                                    __data__,
                                    isGrouped
                                }
                            );
                        }
                    });
                } else {
                    applyResize(
                        element,
                        {
                            dx,
                            dy,
                            scaleX,
                            scaleY,
                            localCTM: transformMatrix,
                            transformMatrix,
                            bBox,
                            __data__,
                            isGrouped
                        }
                    );
                }
            }
        }

        data.set(element, { ...nextData } as SVGElementData);
    }

    /** @internal */
    protected processActions(actionName: string) {
        const {
            storage: {
                transform: {
                    controlsMatrix
                },
                center: {
                    isShifted
                } = {} as SVGStorage['center']
            },
            options: {
                isGrouped
            }
        } = this;

        if (isGrouped && actionName === E_ROTATE) {
            this.applyTransformToHandles();

            const { x: dx, y: dy } = pointTo(controlsMatrix, 0, 0);

            if (isShifted) this.moveCenterHandle(dx, dy);

            this.updateControlsView();

            if (!isShifted) this.setTransformOrigin({ dx: 0, dy: 0 }, false);
        }
    }

    /** @internal */
    protected processResize(element: SVGGraphicsElement, { dx, dy }: Delta) {
        const {
            storage: {
                revX,
                revY,
                doW,
                doH,
                data,
                bBox: {
                    x,
                    y,
                    width: boxWidth,
                    height: boxHeight
                }
            },
            options: {
                isGrouped,
                proportions,
                scalable
            }
        } = this;

        const elementData = data.get(element)!;

        const {
            transform: {
                matrix,
                auxiliary: {
                    scale: {
                        translateMatrix
                    }
                }
            },
            cached = {}
        } = elementData;

        const getScale = (distX: number, distY: number): [number, number, number, number] => {
            const actualBoxWidth = Math.max(1, boxWidth);
            const actualBoxHeight = Math.max(1, boxHeight);

            const ratio = doW || (!doW && !doH)
                ? (actualBoxWidth + distX) / actualBoxWidth
                : (actualBoxHeight + distY) / actualBoxHeight;

            const newWidth = proportions ? actualBoxWidth * ratio : actualBoxWidth + distX,
                newHeight = proportions ? actualBoxHeight * ratio : actualBoxHeight + distY;

            const scaleX = newWidth / actualBoxWidth,
                scaleY = newHeight / actualBoxHeight;

            return [scaleX, scaleY, newWidth, newHeight];
        };

        const getScaleMatrix = (scaleX: number, scaleY: number) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const [
            scaleX,
            scaleY,
            newWidth,
            newHeight
        ] = getScale(dx, dy);

        const scaleMatrix = getScaleMatrix(scaleX, scaleY);

        const deltaW = newWidth - boxWidth,
            deltaH = newHeight - boxHeight;

        const newX = x - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = y - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        const resultMatrix = isGrouped
            ? scaleMatrix.multiply(matrix)
            : matrix.multiply(scaleMatrix);

        if (scalable) this.updateElementView(element, ['transform', resultMatrix]);

        data.set(element, {
            ...elementData,
            cached: {
                ...cached,
                scaleX,
                scaleY,
                transformMatrix: scaleMatrix,
                resultMatrix
            }
        });

        this.applyTransformToElement(element, E_RESIZE);

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            transform: resultMatrix
        };
    }

    /** @internal */
    protected processMove(element: SVGGraphicsElement, { dx, dy }: Delta) {
        const {
            storage: {
                data
            }
        } = this;

        const elementStorage = data.get(element)!;

        const {
            transform: {
                matrix,
                auxiliary: {
                    translate: {
                        translateMatrix,
                        parentMatrix
                    }
                }
            },
            cached
        } = elementStorage;

        parentMatrix.e = parentMatrix.f = 0;
        const { x: nx, y: ny } = pointTo(
            parentMatrix,
            dx,
            dy
        );

        data.set(element, {
            ...elementStorage,
            cached: {
                ...cached,
                dist: {
                    dx: floatToFixed(dx),
                    dy: floatToFixed(dy),
                    ox: floatToFixed(nx),
                    oy: floatToFixed(ny)
                }
            }
        });

        translateMatrix.e = nx;
        translateMatrix.f = ny;

        const moveElementMtrx = translateMatrix.multiply(matrix);

        this.updateElementView(element, ['transform', moveElementMtrx]);

        return moveElementMtrx;
    }

    /** @internal */
    protected processRotate(element: SVGGraphicsElement, radians: number) {
        const {
            storage: {
                data
            } = {} as SVGStorage
        } = this;

        const {
            transform: {
                matrix,
                parentMatrix,
                auxiliary: {
                    rotate: {
                        translateMatrix
                    }
                }
            }
        } = data.get(element)!;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const rotateMatrix = createRotateMatrix(sin, cos);

        parentMatrix.e = parentMatrix.f = 0;
        const resRotMatrix = parentMatrix.inverse()
            .multiply(rotateMatrix)
            .multiply(parentMatrix);

        const resRotateMatrix = translateMatrix
            .multiply(resRotMatrix)
            .multiply(translateMatrix.inverse());

        const resultMatrix = resRotateMatrix.multiply(matrix);

        this.updateElementView(element, ['transform', resultMatrix]);

        return resultMatrix;
    }

    /** @internal */
    protected getElementState(element: SVGGraphicsElement, { revX, revY, doW, doH }: Partial<ResizeFlags>) {
        const {
            options: {
                container,
                isGrouped
            },
            storage: {
                data,
                controls,
                handles: {
                    center: cHandle
                },
                transformOrigin: {
                    x: originX,
                    y: originY
                }
            }
        } = this;

        const elementData = data.get(element)!;

        const { __data__ } = elementData;

        storeElementAttributes(element, elementData, container);
        __data__.delete(element);
        checkChildElements(element).forEach(child => {
            __data__.delete(child);
            storeElementAttributes(child, elementData, element, isGrouped);
        });

        const bBox = this.getBBox();

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = bBox;

        const elMatrix = getTransformToElement(element, element.parentNode),
            ctm = getTransformToElement(element, container),
            parentMatrix = getTransformToElement(element.parentNode, container);

        const parentMatrixInverted = parentMatrix.inverse();

        const scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);

        const boxCTM = getTransformToElement(controls, container);

        const elCenterX = elX + elW / 2,
            elCenterY = elY + elH / 2;

        // c-handle's coordinates
        const { x: bcx, y: bcy } = pointTo(
            boxCTM,
            originX,
            originY
        );

        // element's center coordinates
        const { x: elcx, y: elcy } = cHandle
            ? pointTo(
                parentMatrixInverted,
                bcx,
                bcy
            )
            : pointTo(
                isGrouped ? parentMatrixInverted : elMatrix,
                elCenterX,
                elCenterY
            );

        const { x: nextScaleX, y: nextScaleY } = cHandle
            ? pointTo(
                isGrouped ? parentMatrixInverted : ctm.inverse(),
                bcx,
                bcy
            )
            : pointTo(
                isGrouped ? parentMatrixInverted : createSVGMatrix(),
                scaleX,
                scaleY
            );

        const transform = {
            auxiliary: {
                scale: {
                    scaleMatrix: createSVGMatrix(),
                    translateMatrix: createTranslateMatrix(nextScaleX, nextScaleY)
                },
                translate: {
                    parentMatrix: parentMatrixInverted,
                    translateMatrix: createSVGMatrix()
                },
                rotate: {
                    translateMatrix: createTranslateMatrix(elcx, elcy)
                }
            },
            matrix: elMatrix,
            ctm,
            parentMatrix,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
        };

        return {
            transform,
            bBox
        };
    }

    /** @internal */
    protected getCommonState() {
        const {
            elements,
            options: {
                isGrouped,
                container,
                restrict
            },
            storage: {
                controls,
                handles: {
                    center: cHandle
                }
            }
        } = this;

        const bBox = this.getBBox();

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = bBox;

        const elCenterX = elX + elW / 2,
            elCenterY = elY + elH / 2;

        const boxCTM = getTransformToElement(controls, container);

        const centerX = cHandle
            ? cHandle.cx.baseVal.value
            : elCenterX;
        const centerY = cHandle
            ? cHandle.cy.baseVal.value
            : elCenterY;

        // c-handle's coordinates
        const { x: bcx, y: bcy } = pointTo(
            boxCTM,
            centerX,
            centerY
        );

        // box's center coordinates
        const { x: rcx, y: rcy } = pointTo(
            isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container),
            elCenterX,
            elCenterY
        );

        const restrictContainer = restrict || container;
        const containerMatrix = getTransformToElement(restrictContainer, restrictContainer.parentNode);

        const center = {
            ...(this.storage.center || {}),
            x: cHandle ? bcx : rcx,
            y: cHandle ? bcy : rcy,
            hx: cHandle ? cHandle.cx.baseVal.value : null,
            hy: cHandle ? cHandle.cy.baseVal.value : null
        };

        return {
            transform: {
                containerMatrix,
                controlsMatrix: getTransformToElement(controls, controls.parentNode),
                controlsTranslateMatrix: createSVGMatrix(),
                wrapperOriginMatrix: createTranslateMatrix(center.x, center.y)
            },
            bBox,
            center
        };
    }

    /**
     * Handle positions as { x, y } in container coordinates: box corners and edge
     * midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, line endpoints (p1, p2)
     * for a single <line>, and rotator with its anchor when rotatable
     * @param transformMatrix matrix applied on top of the element transform
     */
    getVertices(transformMatrix = createSVGMatrix()): Vertices {
        const {
            elements,
            options: {
                isGrouped,
                rotatable,
                rotatorAnchor,
                rotatorOffset,
                container
            }
        } = this;

        const { x, y, width, height } = this.getBBox();

        const hW = width / 2,
            hH = height / 2;

        const vertices: Record<string, number[]> = {
            tl: [x, y],
            tr: [x + width, y],
            mr: [x + width, y + hH],
            ml: [x, y + hH],
            tc: [x + hW, y],
            bc: [x + hW, y + height],
            br: [x + width, y + height],
            bl: [x, y + height],
            center: [x + hW, y + hH]
        };

        const line = this.getLine();

        if (line) {
            vertices[START_POINT] = [line.x1.baseVal.value, line.y1.baseVal.value];
            vertices[END_POINT] = [line.x2.baseVal.value, line.y2.baseVal.value];
        }

        const nextTransform = isGrouped
            ? transformMatrix
            : transformMatrix.multiply(getTransformToElement(elements[0], container));

        const nextVertices = entries(vertices)
            .reduce<Vertices>((nextRes, [key, [x, y]]) => {
                nextRes[key] = pointTo(
                    nextTransform,
                    x,
                    y
                );
                return nextRes;
            }, {});

        if (rotatable && line) {
            const {
                [START_POINT]: start,
                [END_POINT]: end
            } = nextVertices;

            const axisX = end.x - start.x,
                axisY = end.y - start.y;
            const length = Math.sqrt(axisX * axisX + axisY * axisY);

            const [normalX, normalY] = length
                ? [axisY / length, -axisX / length]
                : [0, -1];

            const side = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;

            const anchor = {
                x: (start.x + end.x) / 2,
                y: (start.y + end.y) / 2
            };

            nextVertices.rotator = {
                x: anchor.x + normalX * rotatorOffset * side,
                y: anchor.y + normalY * rotatorOffset * side
            };
            nextVertices.anchor = anchor;
        } else if (rotatable) {
            const anchor = {} as Point;
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n': {
                    const { x, y } = nextVertices.tc;
                    anchor.x = x;
                    anchor.y = y;
                    break;
                }
                case 's': {
                    const { x, y } = nextVertices.bc;
                    anchor.x = x;
                    anchor.y = y;
                    factor = -1;
                    break;
                }
                case 'w': {
                    const { x, y } = nextVertices.ml;
                    anchor.x = x;
                    anchor.y = y;
                    factor = -1;
                    break;
                }
                case 'e':
                default: {
                    const { x, y } = nextVertices.mr;
                    anchor.x = x;
                    anchor.y = y;
                    break;
                }

            }

            const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
                ? Math.atan2(
                    nextVertices.bl.y - nextVertices.tl.y,
                    nextVertices.bl.x - nextVertices.tl.x
                )
                : Math.atan2(
                    nextVertices.tl.y - nextVertices.tr.y,
                    nextVertices.tl.x - nextVertices.tr.x
                );

            const nextRotatorOffset = rotatorOffset * factor;

            const rotator = {
                x: anchor.x - nextRotatorOffset * Math.cos(theta),
                y: anchor.y - nextRotatorOffset * Math.sin(theta)
            };

            nextVertices.rotator = rotator;
            nextVertices.anchor = anchor;
        }

        return nextVertices;
    }

    /** @internal */
    private getLine(): SVGLineElement | null {
        const {
            elements: [element],
            options: {
                isGrouped
            }
        } = this;

        return !isGrouped && element.tagName.toLowerCase() === 'line'
            ? element as unknown as SVGLineElement
            : null;
    }

    /** @internal */
    private getBBox(): BBox {
        const {
            elements,
            options: {
                container,
                isGrouped
            }
        } = this;

        if (isGrouped) {
            const groupBBox = elements.reduce<number[][]>((result, element) => {
                const elCTM = getTransformToElement(element, container);
                return [...result, ...getBoundingRect(element, elCTM)];
            }, []);

            const [
                [minX, maxX],
                [minY, maxY]
            ] = getMinMaxOfArray(groupBBox);

            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        } else {
            return elements[0].getBBox();
        }
    }

    /** @internal */
    protected moveCenterHandle(dx: number, dy: number) {
        const {
            storage: {
                handles: { center, radius },
                center: prevCenterData,
                transform: {
                    controlsMatrix = createSVGMatrix()
                } = {} as SVGStorage['transform'],
                transformOrigin: {
                    x: originX,
                    y: originY
                } = {} as DOMPoint,
                cached
            }
        } = this;

        if (isUndef(center)) return;

        const nextX = originX + dx,
            nextY = originY + dy;

        center.cx.baseVal.value = nextX;
        center.cy.baseVal.value = nextY;

        radius!.x2.baseVal.value = nextX;
        radius!.y2.baseVal.value = nextY;

        this.storage = {
            ...this.storage,
            center: {
                ...prevCenterData,
                isShifted: true,
                ...pointTo(
                    controlsMatrix.inverse(),
                    nextX,
                    nextY
                )
            },
            cached: {
                ...cached,
                transformOrigin: pointTo(
                    createSVGMatrix(),
                    nextX,
                    nextY
                )
            }
        };

        this.syncHitAreas();
    }

    /** @internal */
    protected processMoveRestrict(element: SVGGraphicsElement, { dx, dy }: Delta) {
        const {
            storage: {
                data
            }
        } = this;

        const elementStorage = data.get(element)!;

        const {
            transform: {
                matrix,
                auxiliary: {
                    translate: {
                        parentMatrix
                    }
                }
            }
        } = elementStorage;

        parentMatrix.e = parentMatrix.f = 0;
        const { x, y } = pointTo(
            parentMatrix,
            dx,
            dy
        );

        const preTranslateMatrix = createTranslateMatrix(x, y).multiply(matrix);

        return this.restrictHandler(element, preTranslateMatrix);
    }

    /** @internal */
    protected processRotateRestrict(element: SVGGraphicsElement, radians: number) {
        const {
            storage: {
                data
            } = {} as SVGStorage
        } = this;

        const {
            transform: {
                matrix,
                parentMatrix,
                auxiliary: {
                    rotate: {
                        translateMatrix
                    }
                }
            }
        } = data.get(element)!;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const rotateMatrix = createRotateMatrix(sin, cos);

        parentMatrix.e = parentMatrix.f = 0;
        const resRotMatrix = parentMatrix.inverse()
            .multiply(rotateMatrix)
            .multiply(parentMatrix);

        const resRotateMatrix = translateMatrix
            .multiply(resRotMatrix)
            .multiply(translateMatrix.inverse());

        const resultMatrix = resRotateMatrix.multiply(matrix);

        return this.restrictHandler(element, resultMatrix);
    }

    /** @internal */
    protected processResizeRestrict(element: SVGGraphicsElement, { dx, dy }: Delta) {
        const {
            storage: {
                doW,
                doH,
                data,
                bBox: {
                    width: boxWidth,
                    height: boxHeight
                }
            },
            options: {
                proportions
            }
        } = this;

        const elementData = data.get(element)!;

        const {
            transform: {
                matrix,
                auxiliary: {
                    scale: {
                        translateMatrix
                    }
                }
            }
        } = elementData;

        const getScale = (distX: number, distY: number): [number, number, number, number] => {
            const actualBoxWidth = Math.max(1, boxWidth);
            const actualBoxHeight = Math.max(1, boxHeight);

            const ratio = doW || (!doW && !doH)
                ? (actualBoxWidth + distX) / actualBoxWidth
                : (actualBoxHeight + distY) / actualBoxHeight;

            const newWidth = proportions ? actualBoxWidth * ratio : actualBoxWidth + distX,
                newHeight = proportions ? actualBoxHeight * ratio : actualBoxHeight + distY;

            const scaleX = newWidth / actualBoxWidth,
                scaleY = newHeight / actualBoxHeight;

            return [scaleX, scaleY, newWidth, newHeight];
        };

        const getScaleMatrix = (scaleX: number, scaleY: number) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const [scaleX, scaleY] = getScale(dx, dy);

        const preScaledMatrix = matrix.multiply(
            getScaleMatrix(scaleX, scaleY)
        );

        return this.restrictHandler(element, preScaledMatrix);
    }

    /** @internal */
    protected processPointMove(element: SVGGraphicsElement, point: string, { dx, dy }: Delta) {
        const {
            storage: {
                data
            },
            options: {
                proportions,
                restrict
            }
        } = this;

        const {
            transform: {
                ctm,
                matrix
            },
            __data__
        } = data.get(element)!;

        const {
            resX1,
            resY1,
            resX2,
            resY2
        } = __data__.get(element) as Required<StoredAttributes>;

        const isStart = point === START_POINT;

        const [baseX, baseY, otherX, otherY] = isStart
            ? [resX1, resY1, resX2, resY2]
            : [resX2, resY2, resX1, resY1];

        const toLocal = ctm.inverse();
        toLocal.e = toLocal.f = 0;

        let { x: localDx, y: localDy } = pointTo(toLocal, dx, dy);

        if (proportions) {
            const axisX = baseX - otherX,
                axisY = baseY - otherY;
            const axisLength = axisX * axisX + axisY * axisY;

            if (axisLength > 0) {
                const projection = (localDx * axisX + localDy * axisY) / axisLength;

                localDx = axisX * projection;
                localDy = axisY * projection;
            }
        }

        const nextX = baseX + localDx,
            nextY = baseY + localDy;

        if (restrict) {
            const { x, y } = pointTo(getTransformToElement(element, restrict), nextX, nextY);

            const [
                [minX, maxX],
                [minY, maxY]
            ] = getMinMaxOfArray(this.getRestrictedBBox());

            if (x < minX || x > maxX || y < minY || y > maxY) return null;
        }

        element.setAttribute(isStart ? 'x1' : 'x2', String(nextX));
        element.setAttribute(isStart ? 'y1' : 'y2', String(nextY));

        this.processControlsResize();

        const { width, height } = element.getBBox();

        return {
            width,
            height,
            transform: matrix
        };
    }

    /** @internal */
    protected processControlsResize() {
        const {
            storage: {
                transform: {
                    controlsMatrix
                }
            } = {} as SVGStorage
        } = this;

        this.applyTransformToHandles({
            boxMatrix: controlsMatrix.inverse()
        });
    }

    /** @internal */
    protected processControlsMove({ dx, dy }: Delta) {
        const {
            storage: {
                transform: {
                    controlsMatrix,
                    controlsTranslateMatrix
                },
                center
            } = {} as SVGStorage
        } = this;

        controlsTranslateMatrix.e = dx;
        controlsTranslateMatrix.f = dy;

        const moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);

        this.updateControlsView(moveControlsMtrx);

        if (center.isShifted) {
            const centerTransformMatrix = controlsMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;
            const { x: cx, y: cy } = pointTo(
                centerTransformMatrix,
                dx,
                dy
            );

            this.moveCenterHandle(-cx, -cy);
        }
    }

    /** @internal */
    protected processControlsRotate({ radians }: { radians: number }) {
        const {
            options: {
                isGrouped
            },
            storage: {
                transform: {
                    controlsMatrix,
                    wrapperOriginMatrix
                } = {} as SVGStorage['transform']
            } = {} as SVGStorage
        } = this;

        if (isGrouped) {
            const cos = floatToFixed(Math.cos(radians)),
                sin = floatToFixed(Math.sin(radians));

            const rotateMatrix = createRotateMatrix(sin, cos);

            const wrapperResultMatrix = wrapperOriginMatrix
                .multiply(rotateMatrix)
                .multiply(wrapperOriginMatrix.inverse())
                .multiply(controlsMatrix);

            this.updateControlsView(wrapperResultMatrix);
        } else {
            this.applyTransformToHandles({
                boxMatrix: controlsMatrix.inverse()
            });
        }
    }

    /** @internal */
    private updateElementView(element: Element, [attr, value]: [string, DOMMatrix]) {
        if (attr === 'transform') {
            element.setAttribute(attr, matrixToString(value));
        }
    }

    /** @internal */
    private updateControlsView(matrix = createSVGMatrix()) {
        this.storage.controls.setAttribute(
            'transform',
            matrixToString(matrix)
        );

        this.storage.cached.controlsMatrix = matrix;
    }

    /** @internal */
    private applyTransformToHandles({ boxMatrix = createSVGMatrix() } = {}) {
        const {
            options: {
                rotatable
            },
            storage: {
                handles,
                center: { isShifted }
            }
        } = this;

        const {
            anchor = null,
            center,
            ...nextVertices
        } = this.getVertices(boxMatrix);

        const resEdges: Record<string, Point[]> = {
            te: [nextVertices.tl, nextVertices.tr],
            be: [nextVertices.bl, nextVertices.br],
            le: [nextVertices.tl, nextVertices.bl],
            re: [nextVertices.tr, nextVertices.br]
        };

        if (rotatable) {
            const { normal, radius } = handles;

            if (isDef(normal)) {
                normal.x1.baseVal.value = anchor!.x;
                normal.y1.baseVal.value = anchor!.y;
                normal.x2.baseVal.value = nextVertices.rotator.x;
                normal.y2.baseVal.value = nextVertices.rotator.y;
            }

            if (isDef(radius)) {
                radius.x1.baseVal.value = center.x;
                radius.y1.baseVal.value = center.y;
                if (!isShifted) {
                    radius.x2.baseVal.value = center.x;
                    radius.y2.baseVal.value = center.y;
                }
            }
        }

        keys(resEdges).forEach(key => {
            const hdl = handles[key];
            const [b, e] = resEdges[key];
            if (isUndef(b) || isUndef(hdl)) return;
            entries({
                x1: b.x,
                y1: b.y,
                x2: e.x,
                y2: e.y
            }).map(([attr, value]) => hdl.setAttribute(attr, String(value)));
        });

        const handlesVertices: Vertices = {
            ...nextVertices,
            ...((!isShifted && Boolean(center)) && { center })
        };

        const result = keys(handlesVertices).reduce<Vertices>((result, key) => {
            const hdl = handles[key];
            const attr = handlesVertices[key];

            result[key] = attr;

            if (isUndef(attr) || isUndef(hdl)) return result;

            hdl.setAttribute('cx', String(attr.x));
            hdl.setAttribute('cy', String(attr.y));

            return result;
        }, {});

        this.syncHitAreas();

        return result;
    }

    /** @internal */
    protected prepareGuides(): GuideState | null {
        const {
            elements,
            storage: {
                wrapper
            },
            options: {
                container,
                guides
            }
        } = this;

        if (!guides) return null;

        const {
            targets,
            bounds,
            threshold = 6,
            snap = true
        } = guides;

        const toBox = (element: SVGGraphicsElement) => boxFromPoints(
            getBoundingRect(element, getTransformToElement(element, container))
        );

        const isMoving = (element: Element) => elements.some(item => (
            item === element || item.contains(element) || element.contains(item)
        ));

        const candidates: Element[] = typeof targets === 'string'
            ? [...document.querySelectorAll(targets)]
            : (targets || [...(elements[0].parentNode as Element).children]);

        const targetBoxes = candidates.reduce<Box[]>((result, element) => {
            if (!('getBBox' in element) || isMoving(element) || wrapper.contains(element)) return result;

            try {
                result.push(toBox(element as SVGGraphicsElement));
            } catch {
                return result;
            }

            return result;
        }, []);

        const boundsElement = bounds === false
            ? null
            : (bounds ? helper(bounds)[0] : container);

        if (boundsElement) targetBoxes.push(this.getBoundsBox(boundsElement));

        const screenMatrix = container.getScreenCTM();
        const scale = screenMatrix
            ? Math.sqrt(Math.abs(screenMatrix.a * screenMatrix.d - screenMatrix.b * screenMatrix.c)) || 1
            : 1;

        return {
            box: unionBoxes(elements.map(toBox)),
            targets: targetBoxes,
            threshold: threshold / scale,
            snap
        };
    }

    /** @internal */
    private getBoundsBox(element: Element): Box {
        const { container } = this.options;

        if (element.tagName.toLowerCase() !== 'svg') {
            return boxFromPoints(
                getBoundingRect(element as SVGGraphicsElement, getTransformToElement(element, container))
            );
        }

        const { left, top, right, bottom } = element.getBoundingClientRect();
        const toContainer = (container.getScreenCTM() || createSVGMatrix()).inverse();

        return boxFromPoints(
            [[left, top], [right, top], [right, bottom], [left, bottom]].map(([x, y]) => {
                const point = pointTo(toContainer, x, y);
                return [point.x, point.y];
            })
        );
    }

    /** @internal */
    protected drawGuides(lines: GuideLine[]) {
        const {
            storage,
            storage: {
                wrapper,
                guidesLayer
            },
            options: {
                container
            }
        } = this;

        if (guidesLayer) {
            while (guidesLayer.firstChild) guidesLayer.removeChild(guidesLayer.firstChild);
        }

        if (!lines.length) return;

        const layer = guidesLayer || createSVGElement('g', ['sjx-svg-guides']);

        if (!guidesLayer) {
            wrapper.insertBefore(layer, wrapper.firstChild);
            storage.guidesLayer = layer;
        }

        layer.setAttribute('transform', matrixToString(getTransformToElement(container, wrapper.parentNode)));

        lines.forEach(({ axis, value, from, to }) => {
            const line = createSVGElement('line', ['sjx-svg-guide']);
            const [x1, y1, x2, y2] = axis === 'x'
                ? [value, from, value, to]
                : [from, value, to, value];

            entries({
                x1,
                y1,
                x2,
                y2,
                stroke: '#ff3d9a',
                'stroke-width': 1,
                'vector-effect': 'non-scaling-stroke',
                'pointer-events': 'none'
            }).forEach(([attr, attrValue]) => line.setAttribute(attr, String(attrValue)));

            layer.appendChild(line);
        });
    }

    /** @internal */
    private syncHitAreas() {
        const {
            storage: {
                controls,
                handles,
                hitAreas
            },
            options: {
                hitRadius
            }
        } = this;

        if (!hitAreas) return;

        const screenMatrix = controls.getScreenCTM();
        const scale = screenMatrix
            ? Math.sqrt(Math.abs(screenMatrix.a * screenMatrix.d - screenMatrix.b * screenMatrix.c)) || 1
            : 1;

        entries(hitAreas).forEach(([key, area]) => {
            const hdl = handles[key];
            if (isUndef(hdl)) return;

            const isLine = area.tagName.toLowerCase() === 'line';
            const attrs = isLine ? ['x1', 'y1', 'x2', 'y2'] : ['cx', 'cy'];

            attrs.forEach(attr => area.setAttribute(attr, hdl!.getAttribute(attr) || '0'));

            if (!isLine) {
                area.setAttribute('r', String(hitRadius / scale));
            }
        });
    }

    setCenterPoint(...args: [TransformOriginParams?, boolean?]) {
        warn('"setCenterPoint" method is replaced by "setTransformOrigin" and would be removed soon');
        this.setTransformOrigin(...args);
    }

    setTransformOrigin({ x, y, dx, dy }: TransformOriginParams = {}, pin = true) {
        const {
            elements,
            storage,
            storage: {
                controls,
                handles: {
                    center: handle,
                    radius
                } = {} as SVGHandles,
                center
            } = {} as SVGStorage,
            options: {
                container,
                isGrouped
            }
        } = this;

        const isRelative = isDef(dx) && isDef(dy),
            isAbsolute = isDef(x) && isDef(y);

        if (!center || !handle || !radius || !(isRelative || isAbsolute)) return;

        const controlsTransformMatrix = getTransformToElement(controls, controls.parentNode).inverse();
        const nextTransform = isGrouped
            ? controlsTransformMatrix
            : controlsTransformMatrix.multiply(getTransformToElement(elements[0], container));

        let newX: number, newY: number;

        if (isRelative) {
            const { x: bx, y: by, width, height } = this.getBBox();

            const hW = width / 2,
                hH = height / 2;

            ({ x: newX, y: newY } = pointTo(
                nextTransform,
                bx + hW + dx,
                by + hH + dy
            ));
        } else {
            newX = x!;
            newY = y!;
        }

        handle.cx.baseVal.value = newX;
        handle.cy.baseVal.value = newY;

        radius.x2.baseVal.value = newX;
        radius.y2.baseVal.value = newY;

        center.isShifted = pin;
        storage.transformOrigin = pointTo(
            createSVGMatrix(),
            newX,
            newY
        );

        this.syncHitAreas();
    }

    fitControlsToSize() {
        const {
            storage: {
                controls,
                center: {
                    isShifted
                } = {} as SVGStorage['center'],
                transformOrigin: {
                    x: originX,
                    y: originY
                } = {} as DOMPoint
            }
        } = this;

        const controlsMatrix = getTransformToElement(controls, controls.parentNode);
        const { x: dx, y: dy } = pointTo(controlsMatrix, originX, originY);

        const { nextValues, pin } = [
            {
                nextValues: () => ({ x: dx, y: dy }),
                pin: true,
                condition: () => isShifted
            },
            {
                nextValues: () => ({ dx: 0, dy: 0 }),
                pin: false,
                condition: () => !isShifted
            }
        ].find(({ condition }) => condition())!;

        this.updateControlsView();

        this.setTransformOrigin({ ...nextValues() }, pin);
        this.applyTransformToHandles();
    }

    getBoundingRect(element: SVGGraphicsElement, transformMatrix: DOMMatrix | null = null) {
        const {
            options: {
                restrict,
                container
            } = {} as SVGOptions
        } = this;

        const restrictEl = restrict || container;

        const nextTransform = transformMatrix
            ? getTransformToElement(element.parentNode, restrictEl).multiply(transformMatrix)
            : getTransformToElement(element, restrictEl);

        return getBoundingRect(
            element,
            nextTransform,
            element.getBBox()
        );
    }

    applyAlignment(direction: AlignmentDirection, target: Element | null = null) {
        const {
            elements,
            options: { container }
        } = this;

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            anchor, rotator, center,
            ...vertices
        } = this.getVertices();

        const restrictBBox = target
            ? getBoundingRect(target as SVGGraphicsElement, getTransformToElement(target, container))
            : this.getRestrictedBBox(true);

        const nextVertices = values(vertices).map(({ x, y }) => [x, y]);

        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(restrictBBox);

        const [
            [elMinX, elMaxX],
            [elMinY, elMaxY]
        ] = getMinMaxOfArray(nextVertices);

        const getXDir = () => {
            switch (true) {

                case /[l]/.test(direction):
                    return minX - elMinX;
                case /[r]/.test(direction):
                    return maxX - elMaxX;
                case /[h]/.test(direction):
                    return ((maxX + minX) / 2) - ((elMaxX + elMinX) / 2);
                default:
                    return 0;

            }
        };

        const getYDir = () => {
            switch (true) {

                case /[t]/.test(direction):
                    return minY - elMinY;
                case /[b]/.test(direction):
                    return maxY - elMaxY;
                case /[v]/.test(direction):
                    return ((maxY + minY) / 2) - ((elMaxY + elMinY) / 2);
                default:
                    return 0;

            }
        };

        elements.map((element) => {
            const parentMatrix = getTransformToElement(element.parentNode, container);
            parentMatrix.e = parentMatrix.f = 0;

            const { x, y } = pointTo(
                parentMatrix.inverse(),
                getXDir(),
                getYDir()
            );

            const moveElementMtrx = createTranslateMatrix(x, y).multiply(
                getTransformToElement(element, element.parentNode)
            );

            this.updateElementView(element, ['transform', moveElementMtrx]);
        });

        this.fitControlsToSize();
    }

    getDimensions() {
        const {
            elements,
            options: {
                isGrouped,
                container
            }
        } = this;

        const { x, y, width, height } = this.getBBox();

        const vertices = {
            tl: [x, y],
            tr: [x + width, y],
            bl: [x, y + height],
            br: [x + width, y + height]
        };

        const nextTransform = isGrouped
            ? createSVGMatrix()
            : getTransformToElement(elements[0], container);

        const { tl, br, tr } = entries(vertices)
            .reduce<Vertices>((nextRes, [key, [x, y]]) => {
                nextRes[key] = pointTo(
                    nextTransform,
                    x,
                    y
                );
                return nextRes;
            }, {});

        return {
            x: floatToFixed(tl.x),
            y: floatToFixed(tl.y),
            width: floatToFixed(Math.sqrt(Math.pow(tl.x - tr.x, 2) + Math.pow(tl.y - tr.y, 2))),
            height: floatToFixed(Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2))),
            rotation: floatToFixed(Math.atan2((tr.y - tl.y), (tr.x - tl.x)) * DEG)
        };
    }

}

const applyTranslate = (element: Element, { x, y }: Point) => {
    const attrs: [string, string | number | undefined][] = [];

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const el = element as SVGTextElement;
            const resX = isDef(el.x.baseVal[0])
                ? el.x.baseVal[0].value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(el.y.baseVal[0])
                ? el.y.baseVal[0].value + y
                : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(
                ['x', resX],
                ['y', resY]
            );
            break;
        }
        case 'foreignobject':
        case 'use':
        case 'image':
        case 'rect': {
            const el = element as SVGRectElement | SVGImageElement | SVGUseElement | SVGForeignObjectElement;
            const resX = isDef(el.x.baseVal.value)
                ? el.x.baseVal.value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(el.y.baseVal.value)
                ? el.y.baseVal.value + y
                : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(
                ['x', resX],
                ['y', resY]
            );
            break;
        }
        case 'circle':
        case 'ellipse': {
            const el = element as SVGCircleElement | SVGEllipseElement;
            const resX = el.cx.baseVal.value + x,
                resY = el.cy.baseVal.value + y;

            attrs.push(
                ['cx', resX],
                ['cy', resY]
            );
            break;
        }
        case 'line': {
            const el = element as SVGLineElement;
            const resX1 = el.x1.baseVal.value + x,
                resY1 = el.y1.baseVal.value + y,
                resX2 = el.x2.baseVal.value + x,
                resY2 = el.y2.baseVal.value + y;

            attrs.push(
                ['x1', resX1],
                ['y1', resY1],
                ['x2', resX2],
                ['y2', resY2]
            );
            break;
        }
        case 'polygon':
        case 'polyline': {
            const points = parsePoints(element.getAttribute('points')!);
            const result = points.map(item => {
                item[0] = String(Number(item[0]) + x);
                item[1] = String(Number(item[1]) + y);

                return item.join(' ');
            }).join(' ');

            attrs.push(
                ['points', result]
            );
            break;
        }
        case 'path': {
            const path = element.getAttribute('d')!;

            attrs.push(['d', movePath(
                {
                    path,
                    dx: x,
                    dy: y
                }
            )]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};

interface ResizeParams {
    dx?: number;
    dy?: number;
    scaleX: number;
    scaleY: number;
    localCTM: DOMMatrix;
    transformMatrix: DOMMatrix;
    bBox: BBox;
    __data__: WeakMap<Element, StoredAttributes>;
    isGrouped: boolean;
}

const applyResize = (element: Element, data: ResizeParams) => {
    const {
        scaleX,
        scaleY,
        localCTM,
        bBox: {
            width: boxW,
            height: boxH
        },
        __data__,
        transformMatrix,
        isGrouped
    } = data;

    const attrs: [string, string | number | undefined][] = [];

    const storedData = __data__.get(element) as Required<StoredAttributes>;

    switch (element.tagName.toLowerCase()) {

        case 'text':
        case 'tspan': {
            const { x, y, textLength } = storedData;
            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                x,
                y
            );

            attrs.push(
                ['x', resX + (scaleX < 0 ? boxW : 0)],
                ['y', resY - (scaleY < 0 ? boxH : 0)],
                ['textLength', Math.abs(scaleX * (textLength as number))]
            );
            break;
        }
        case 'circle': {
            const { r, cx, cy } = storedData,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                cx,
                cy
            );

            attrs.push(
                ['r', newR],
                ['cx', resX],
                ['cy', resY]
            );
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            if (!isGrouped) {
                const { width, height, x, y } = storedData;

                const {
                    x: resX,
                    y: resY
                } = pointTo(
                    localCTM,
                    x,
                    y
                );

                const newWidth = Math.abs(width * scaleX),
                    newHeight = Math.abs(height * scaleY);

                attrs.push(
                    ['x', resX - (scaleX < 0 ? newWidth : 0)],
                    ['y', resY - (scaleY < 0 ? newHeight : 0)],
                    ['width', newWidth],
                    ['height', newHeight]
                );
            } else {
                const { matrix, childCTM } = storedData;
                const local = childCTM.inverse()
                    .multiply(transformMatrix)
                    .multiply(childCTM);

                const nextResult = matrix.multiply(local);
                // TODO: need to find how to resize rect within elements group but not to scale
                attrs.push(
                    ['transform', matrixToString(nextResult)]
                );
            }
            break;
        }
        case 'ellipse': {
            const { rx, ry, cx, cy } = storedData;

            const {
                x: cx1,
                y: cy1
            } = pointTo(
                localCTM,
                cx,
                cy
            );

            const scaleMatrix = createSVGMatrix();

            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;

            const {
                x: nRx,
                y: nRy
            } = pointTo(
                scaleMatrix,
                rx,
                ry
            );

            attrs.push(
                ['rx', Math.abs(nRx)],
                ['ry', Math.abs(nRy)],
                ['cx', cx1],
                ['cy', cy1]
            );
            break;
        }
        case 'line': {
            const { resX1, resY1, resX2, resY2 } = storedData;

            const {
                x: resX1_,
                y: resY1_
            } = pointTo(
                localCTM,
                resX1,
                resY1
            );

            const {
                x: resX2_,
                y: resY2_
            } = pointTo(
                localCTM,
                resX2,
                resY2
            );

            attrs.push(
                ['x1', resX1_],
                ['y1', resY1_],
                ['x2', resX2_],
                ['y2', resY2_]
            );
            break;
        }
        case 'polygon':
        case 'polyline': {
            const { points } = storedData;

            const result = parsePoints(points!).map(item => {
                const {
                    x,
                    y
                } = pointTo(
                    localCTM,
                    Number(item[0]),
                    Number(item[1])
                );

                item[0] = String(floatToFixed(x));
                item[1] = String(floatToFixed(y));

                return item.join(' ');
            }).join(' ');

            attrs.push(['points', result]);
            break;
        }
        case 'path': {
            const { path } = storedData;

            attrs.push(['d', resizePath({ path: path!, localCTM })]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};

const createHandler = (left: number, top: number, color: string, key: string) => {
    const handler = createSVGElement(
        'circle',
        ['sjx-svg-hdl', `sjx-svg-hdl-${key}`]
    );

    const attrs = {
        cx: left,
        cy: top,
        r: 4,
        fill: '#fff',
        stroke: color,
        'stroke-width': 1,
        'fill-opacity': 1,
        'vector-effect': 'non-scaling-stroke'
    };

    entries(attrs).forEach(([attr, value]) => (
        handler.setAttribute(attr, String(value))
    ));

    return handler;
};

const createHitArea = (tag: 'circle' | 'line', key: string, radius: number) => {
    const area = createSVGElement(tag, ['sjx-svg-hit', `sjx-svg-hit-${key}`]);

    area.setAttribute('data-sjx-handle', key);
    area.setAttribute('fill', 'transparent');

    if (tag === 'line') {
        area.setAttribute('stroke', 'transparent');
        area.setAttribute('stroke-width', String(radius * 2));
        area.setAttribute('vector-effect', 'non-scaling-stroke');
    }

    return area;
};

const setLineStyle = (line: Element, color: string) => {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
};

const storeElementAttributes = (
    element: Element,
    storage: SVGElementData,
    container: Node,
    isGrouped?: boolean
) => {
    let data: Partial<StoredAttributes> | null = null;

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const el = element as SVGTextElement;
            const x = isDef(el.x.baseVal[0])
                ? el.x.baseVal[0].value
                : (Number(element.getAttribute('x')) || 0);
            const y = isDef(el.y.baseVal[0])
                ? el.y.baseVal[0].value
                : (Number(element.getAttribute('y')) || 0);
            const textLength = isDef(el.textLength.baseVal)
                ? el.textLength.baseVal.value
                : (Number(element.getAttribute('textLength')) || null);

            data = { x, y, textLength };
            break;
        }
        case 'circle': {
            const el = element as SVGCircleElement;
            const r = el.r.baseVal.value,
                cx = el.cx.baseVal.value,
                cy = el.cy.baseVal.value;

            data = { r, cx, cy };
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            const el = element as SVGRectElement | SVGImageElement | SVGForeignObjectElement;
            const width = el.width.baseVal.value,
                height = el.height.baseVal.value,
                x = el.x.baseVal.value,
                y = el.y.baseVal.value;

            data = { width, height, x, y };
            break;
        }
        case 'ellipse': {
            const el = element as SVGEllipseElement;
            const rx = el.rx.baseVal.value,
                ry = el.ry.baseVal.value,
                cx = el.cx.baseVal.value,
                cy = el.cy.baseVal.value;

            data = { rx, ry, cx, cy };
            break;
        }
        case 'line': {
            const el = element as SVGLineElement;
            const resX1 = el.x1.baseVal.value,
                resY1 = el.y1.baseVal.value,
                resX2 = el.x2.baseVal.value,
                resY2 = el.y2.baseVal.value;

            data = { resX1, resY1, resX2, resY2 };
            break;
        }
        case 'polygon':
        case 'polyline': {
            const points = element.getAttribute('points');
            data = { points };
            break;
        }
        case 'path': {
            const path = element.getAttribute('d');

            data = { path };
            break;
        }
        default:
            break;

    }

    storage.__data__.set(element, {
        ...data,
        matrix: getTransformToElement(element, element.parentNode),
        ctm: getTransformToElement(element.parentNode, container),
        childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
    });
};

const renderLine = ([b, e]: (Point | null)[], color: string, key: string) => {
    const handler = createSVGElement(
        'line',
        ['sjx-svg-line', `sjx-svg-line-${key}`]
    );

    const attrs = {
        x1: b!.x,
        y1: b!.y,
        x2: e!.x,
        y2: e!.y,
        stroke: color,
        'stroke-width': 1,
        'vector-effect': 'non-scaling-stroke'
    };

    entries(attrs).forEach(([attr, value]) => (
        handler.setAttribute(attr, String(value))
    ));

    return handler;
};

const getBoundingRect = (element: SVGGraphicsElement, ctm: DOMMatrix, bBox: BBox = element.getBBox()) => {
    const { x, y, width, height } = bBox;

    const vertices = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height]
    ];

    return vertices.map(([l, t]) => {
        const { x: nx, y: ny } = pointTo(ctm, l, t);
        return [nx, ny];
    });
};