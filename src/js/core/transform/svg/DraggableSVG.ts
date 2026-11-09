import { helper } from '../../Helper';
import Transformable from '../transformable';
import type { Point, Delta, ResizeFlags } from '../transformable';
import type { PointerInput } from '../../SubjectModel';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
import { isDef, isUndef } from '../../util/util';
import {
    floatToFixed,
    getMinMaxOfArray,
    DEG,
    resizeBox,
    rotatorPlacement,
    alignmentOffset,
    boxVertices,
    edgeSegments
} from '../common';
import { boxFromPoints, unionBoxes } from '../guides';
import type { Box, GuideLine, GuideState } from '../guides';
import type { Restriction } from '../restrict';
import { hitAreaOutline, outlineToPath } from './hit-areas';
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
    createRotationMatrix,
    getTransformToElement,
    matrixToString,
    pointTo,
    scaleAround
} from './util';
import {
    ORIGIN_COLOR,
    createGuideLine,
    createHandler,
    createHitArea,
    readCorners,
    renderLine,
    renderRadius,
    screenScale,
    setAttributes
} from './controls';
import { bBoxPoints, lineRotator, transformVertices } from './vertices';
import { readAttributes, resizeElement, translateElement } from './shapes';
import type {
    BBox,
    StoredAttributes,
    SVGElementData,
    SVGElementTransform,
    SVGHandles,
    SVGStorage,
    SVGOptions,
    Vertices
} from './types';

const { E_DRAG, E_RESIZE, E_ROTATE } = EVENT_EMITTER_CONSTANTS;
const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;
const { START_POINT, END_POINT } = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_POINT_KEYS;

const { entries, values } = Object;

const BOX_HANDLES = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];
const LINE_HANDLES = [START_POINT, END_POINT];

type HitAreas = SVGStorage['hitAreas'];

export default class DraggableSVG extends Transformable<DOMMatrix, SVGStorage> {

    elements!: SVGGraphicsElement[];
    options!: SVGOptions;

    /** @internal */
    protected init(elements: SVGGraphicsElement[]) {
        const {
            options: {
                container,
                controlsContainer,
                rotatable,
                transformOrigin,
                restrict,
                hitRadius,
                showHitAreas
            }
        } = this;

        const hitAreas: HitAreas = {};

        const wrapper = createSVGElement('g', showHitAreas
            ? ['sjx-svg-wrapper', 'sjx-show-hit']
            : ['sjx-svg-wrapper']);
        const controls = createSVGElement('g', ['sjx-svg-controls']);
        const hitOverlay = hitRadius && showHitAreas
            ? createSVGElement('path', ['sjx-svg-hit-overlay'])
            : undefined;

        if (hitOverlay) {
            hitOverlay.setAttribute('pointer-events', 'none');
            controls.appendChild(hitOverlay);
        }

        const {
            rotator = null,
            anchor = null,
            ...vertices
        } = this.getVertices();

        const origin = Array.isArray(transformOrigin)
            ? pointTo(createSVGMatrix(), transformOrigin[0], transformOrigin[1])
            : vertices.center;

        const rotationHandles = rotatable
            ? this.renderRotationHandles(controls, [anchor, rotator], vertices.center, origin)
            : {};

        const edgeHandles = this.renderEdges(controls, vertices, hitAreas);

        const pointHandles = this.renderPoints(controls, {
            ...this.resizingPoints(vertices),
            rotator,
            center: transformOrigin && rotatable ? origin : undefined
        }, hitAreas);

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data: SVGStorage['data'] = new WeakMap();

        elements.forEach(element => (
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
                ...edgeHandles,
                ...pointHandles,
                ...rotationHandles
            },
            data,
            center: {
                isShifted: Array.isArray(transformOrigin)
            },
            transformOrigin: origin,
            transform: {
                containerMatrix: getTransformToElement(restrictContainer, restrictContainer.parentNode)
            },
            cached: {},
            hitAreas,
            hitOverlay
        } as SVGStorage;

        this.syncHitAreas();

        [...elements, controls].forEach(target => (
            helper(target)
                .on(E_MOUSEDOWN, this.onMouseDown)
                .on(E_TOUCHSTART, this.onTouchStart)
        ));
    }

    /** @internal */
    private renderRotationHandles(
        controls: SVGGElement,
        normalPoints: (Point | null)[],
        center: Point,
        origin: Point
    ): SVGHandles {
        const { showNormal, transformOrigin } = this.options;

        const normal = showNormal ? renderLine(normalPoints, THEME_COLOR, 'normal') : null;

        if (normal) controls.appendChild(normal);

        const radius = transformOrigin ? renderRadius(center, origin) : null;

        if (radius) controls.appendChild(radius);

        return { normal, radius };
    }

    /** @internal */
    private renderEdges(controls: SVGGElement, vertices: Vertices, hitAreas: HitAreas): SVGHandles {
        const { hitRadius } = this.options;
        const line = this.getLine();
        const handles: SVGHandles = {};

        entries(edgeSegments(vertices)).forEach(([key, segment]) => {
            const edge = renderLine(segment, THEME_COLOR, key);
            const isEnabled = !line && this.isHandleEnabled(key);

            if (!isEnabled) edge.setAttribute('pointer-events', 'none');
            if (line) edge.setAttribute('visibility', 'hidden');

            if (hitRadius && isEnabled) {
                hitAreas[key] = createHitArea(key);
                controls.appendChild(hitAreas[key]);
            }

            controls.appendChild(edge);
            handles[key] = edge;
        });

        return handles;
    }

    /** @internal */
    private resizingPoints(vertices: Vertices): Record<string, Point> {
        if (!this.options.resizable) return {};

        return (this.getLine() ? LINE_HANDLES : BOX_HANDLES)
            .filter(key => this.isHandleEnabled(key))
            .reduce<Record<string, Point>>((result, key) => {
                result[key] = vertices[key];
                return result;
            }, {});
    }

    /** @internal */
    private renderPoints(
        controls: SVGGElement,
        points: Record<string, Point | null | undefined>,
        hitAreas: HitAreas
    ): SVGHandles {
        const { hitRadius } = this.options;
        const handles: SVGHandles = {};

        entries(points).forEach(([key, point]) => {
            if (!point) return;

            const handle = createHandler(
                point.x,
                point.y,
                key === 'center' ? ORIGIN_COLOR : THEME_COLOR,
                key
            );

            if (hitRadius) {
                hitAreas[key] = createHitArea(key);
                controls.appendChild(hitAreas[key]);
            }

            controls.appendChild(handle);
            handles[key] = handle;
        });

        return handles;
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

        return bBoxPoints(
            restrictEl,
            force ? getTransformToElement(restrictEl, container) : containerMatrix
        );
    }

    /** @internal */
    protected pointToTransform({ x, y, matrix }: Point & { matrix: DOMMatrix }) {
        const nextMatrix = matrix.inverse();
        nextMatrix.e = nextMatrix.f = 0;

        return this.applyMatrixToPoint(nextMatrix, x, y);
    }

    /** @internal */
    protected pointToControls({ x, y }: Point, transform = this.storage.transform) {
        const matrix = transform.controlsMatrix.inverse();
        matrix.e = matrix.f = 0;

        return this.applyMatrixToPoint(matrix, x, y);
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
                applyTranslate
            } = {} as SVGOptions
        } = this;

        const {
            cached = {},
            ...nextData
        } = data.get(element)!;

        const { transform, __data__ } = nextData;

        const {
            scaleX,
            scaleY,
            dist,
            transformMatrix
        } = cached as SVGElementData['cached'];

        if (actionName === E_DRAG) {
            if (!applyTranslate || !dist || (!dist.dx && !dist.dy)) return;

            translateElement(element, transform, dist);
        }

        if (actionName === E_RESIZE) {
            if (!transformMatrix) return;

            if (!scalable) {
                resizeElement(element, {
                    dx: dist?.dx,
                    dy: dist?.dy,
                    scaleX: scaleX!,
                    scaleY: scaleY!,
                    transformMatrix,
                    bBox,
                    __data__,
                    isGrouped
                });
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

        if (!isGrouped || actionName !== E_ROTATE) return;

        this.applyTransformToHandles();

        const { x: dx, y: dy } = pointTo(controlsMatrix, 0, 0);

        if (isShifted) this.moveCenterHandle(dx, dy);

        this.updateControlsView();

        if (!isShifted) this.setTransformOrigin({ dx: 0, dy: 0 }, false);
    }

    /** @internal */
    private resizeScale({ dx, dy }: Delta) {
        const {
            storage: {
                doW,
                doH,
                bBox: { width, height }
            },
            options: {
                proportions,
                flip
            }
        } = this;

        return resizeBox({ width, height, dx, dy, doW, doH, proportions, flip });
    }

    /** @internal */
    private scaleMatrixOf(element: SVGGraphicsElement, scaleX: number, scaleY: number) {
        const { translateMatrix } = this.storage.data.get(element)!.transform.auxiliary.scale;

        return scaleAround(translateMatrix, scaleX, scaleY);
    }

    /** @internal */
    private rotatedMatrix(element: SVGGraphicsElement, radians: number) {
        const {
            matrix,
            parentMatrix,
            auxiliary: {
                rotate: {
                    translateMatrix
                }
            }
        } = this.storage.data.get(element)!.transform;

        parentMatrix.e = parentMatrix.f = 0;

        const localRotation = parentMatrix.inverse()
            .multiply(createRotationMatrix(radians))
            .multiply(parentMatrix);

        return translateMatrix
            .multiply(localRotation)
            .multiply(translateMatrix.inverse())
            .multiply(matrix);
    }

    /** @internal */
    private parentDelta(element: SVGGraphicsElement, { dx, dy }: Delta) {
        const { parentMatrix } = this.storage.data.get(element)!.transform.auxiliary.translate;

        parentMatrix.e = parentMatrix.f = 0;

        return pointTo(parentMatrix, dx, dy);
    }

    /** @internal */
    protected processResize(element: SVGGraphicsElement, delta: Delta) {
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
                scalable
            }
        } = this;

        const elementData = data.get(element)!;

        const {
            transform: { matrix },
            cached = {}
        } = elementData;

        const [scaleX, scaleY, newWidth, newHeight] = this.resizeScale(delta);
        const scaleMatrix = this.scaleMatrixOf(element, scaleX, scaleY);

        const deltaW = newWidth - boxWidth,
            deltaH = newHeight - boxHeight;

        const newX = x - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = y - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        const resultMatrix = isGrouped
            ? scaleMatrix.multiply(matrix)
            : matrix.multiply(scaleMatrix);

        if (scalable) this.updateElementView(element, resultMatrix);

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
    protected processMove(element: SVGGraphicsElement, delta: Delta) {
        const { data } = this.storage;

        const elementStorage = data.get(element)!;

        const {
            transform: {
                matrix,
                auxiliary: {
                    translate: {
                        translateMatrix
                    }
                }
            },
            cached
        } = elementStorage;

        const { x: nx, y: ny } = this.parentDelta(element, delta);

        data.set(element, {
            ...elementStorage,
            cached: {
                ...cached,
                dist: {
                    dx: floatToFixed(delta.dx),
                    dy: floatToFixed(delta.dy),
                    ox: floatToFixed(nx),
                    oy: floatToFixed(ny)
                }
            }
        });

        translateMatrix.e = nx;
        translateMatrix.f = ny;

        const moveElementMtrx = translateMatrix.multiply(matrix);

        this.updateElementView(element, moveElementMtrx);

        return moveElementMtrx;
    }

    /** @internal */
    protected processRotate(element: SVGGraphicsElement, radians: number) {
        const resultMatrix = this.rotatedMatrix(element, radians);

        this.updateElementView(element, resultMatrix);

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

        __data__.delete(element);
        checkChildElements(element).forEach(child => (
            __data__.set(child, readAttributes(child, element, isGrouped))
        ));

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

        const local = boxVertices(this.getBBox());
        const line = this.getLine();

        if (line) {
            local[START_POINT] = [line.x1.baseVal.value, line.y1.baseVal.value];
            local[END_POINT] = [line.x2.baseVal.value, line.y2.baseVal.value];
        }

        const matrix = isGrouped
            ? transformMatrix
            : transformMatrix.multiply(getTransformToElement(elements[0], container));

        const vertices = transformVertices(local, matrix);

        if (!rotatable) return vertices;

        const { anchor, rotator } = line
            ? lineRotator(vertices[START_POINT], vertices[END_POINT], rotatorAnchor, rotatorOffset)
            : rotatorPlacement(vertices, rotatorAnchor, rotatorOffset);

        vertices.rotator = rotator;
        vertices.anchor = anchor;

        return vertices;
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

        if (!isGrouped) return elements[0].getBBox();

        const groupBBox = elements.reduce<number[][]>((result, element) => (
            [...result, ...bBoxPoints(element, getTransformToElement(element, container))]
        ), []);

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
                ...pointTo(controlsMatrix.inverse(), nextX, nextY)
            },
            cached: {
                ...cached,
                transformOrigin: pointTo(createSVGMatrix(), nextX, nextY)
            }
        };

        this.syncHitAreas();
    }

    /** @internal */
    protected processMoveRestrict(element: SVGGraphicsElement, delta: Delta) {
        const { matrix } = this.storage.data.get(element)!.transform;
        const { x, y } = this.parentDelta(element, delta);

        return this.restrictHandler(element, createTranslateMatrix(x, y).multiply(matrix));
    }

    /** @internal */
    protected processRotateRestrict(element: SVGGraphicsElement, radians: number) {
        return this.restrictHandler(element, this.rotatedMatrix(element, radians));
    }

    /** @internal */
    protected processResizeRestrict(element: SVGGraphicsElement, delta: Delta) {
        const { matrix } = this.storage.data.get(element)!.transform;
        const [scaleX, scaleY] = this.resizeScale(delta);

        return this.restrictHandler(element, matrix.multiply(this.scaleMatrixOf(element, scaleX, scaleY)));
    }

    /** @internal */
    protected processPointMove(element: SVGGraphicsElement, point: string, { dx, dy }: Delta) {
        const {
            storage: {
                data,
                restriction
            },
            options: {
                proportions
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

        if (restriction) {
            const { x, y } = pointTo(ctm, nextX, nextY);
            const { area } = restriction;
            const tolerance = 1e-6;

            if (
                x < area.left - tolerance || x > area.right + tolerance ||
                y < area.top - tolerance || y > area.bottom + tolerance
            ) return null;
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
            const wrapperResultMatrix = wrapperOriginMatrix
                .multiply(createRotationMatrix(radians))
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
    private updateElementView(element: Element, matrix: DOMMatrix) {
        element.setAttribute('transform', matrixToString(matrix));
    }

    /** @internal */
    private updateControlsView(matrix = createSVGMatrix()) {
        this.storage.controls.setAttribute('transform', matrixToString(matrix));
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

        entries(edgeSegments(nextVertices)).forEach(([key, [b, e]]) => {
            const hdl = handles[key];
            if (isUndef(b) || isUndef(hdl)) return;
            setAttributes(hdl, { x1: b.x, y1: b.y, x2: e.x, y2: e.y });
        });

        const handlesVertices: Vertices = {
            ...nextVertices,
            ...((!isShifted && Boolean(center)) && { center })
        };

        entries(handlesVertices).forEach(([key, point]) => {
            const hdl = handles[key];
            if (isUndef(point) || isUndef(hdl)) return;
            setAttributes(hdl, { cx: point.x, cy: point.y });
        });

        this.syncHitAreas();

        return handlesVertices;
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

        const isMoving = (element: Element) => elements.some(item => (
            item === element || item.contains(element) || element.contains(item)
        ));

        const candidates: Element[] = typeof targets === 'string'
            ? [...document.querySelectorAll(targets)]
            : (targets || [...(elements[0].parentNode as Element).children]);

        const targetBoxes = candidates.reduce<Box[]>((result, element) => {
            if (!('getBBox' in element) || isMoving(element) || wrapper.contains(element)) return result;

            try {
                result.push(this.getBoundsBox(element));
            } catch {
                return result;
            }

            return result;
        }, []);

        const boundsElement = bounds === false
            ? null
            : (bounds ? helper(bounds)[0] : container);

        if (boundsElement) targetBoxes.push(this.getBoundsBox(boundsElement));

        return {
            ...this.measure(),
            targets: targetBoxes,
            threshold: threshold / screenScale(container),
            snap
        };
    }

    /** @internal */
    protected prepareRestrict(): Restriction | null {
        const { restrict } = this.options;

        if (!restrict) return null;

        return {
            ...this.measure(),
            area: this.getBoundsBox(restrict)
        };
    }

    /** @internal */
    private measure() {
        const {
            elements,
            options: {
                container,
                isGrouped
            }
        } = this;

        const matrices = elements.map(element => getTransformToElement(element, container));
        const [firstMatrix] = matrices;

        const line = this.getLine();
        const { point } = this.storage;

        const pointPosition = line && point
            ? pointTo(
                firstMatrix,
                point === START_POINT ? line.x1.baseVal.value : line.x2.baseVal.value,
                point === START_POINT ? line.y1.baseVal.value : line.y2.baseVal.value
            )
            : null;

        return {
            box: unionBoxes(elements.map((element, index) => boxFromPoints(bBoxPoints(element, matrices[index])))),
            axisAligned: matrices.every(matrix => Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6),
            flipX: !isGrouped && firstMatrix.a < 0,
            flipY: !isGrouped && firstMatrix.d < 0,
            point: pointPosition && { x: pointPosition.x, y: pointPosition.y }
        };
    }

    /** @internal */
    private getBoundsBox(element: Element): Box {
        const { container } = this.options;

        if (element.tagName.toLowerCase() !== 'svg') {
            return boxFromPoints(
                bBoxPoints(element as SVGGraphicsElement, getTransformToElement(element, container))
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

        lines.forEach(guide => layer.appendChild(createGuideLine(guide)));
    }

    /** @internal */
    private syncHitAreas() {
        const {
            storage: {
                controls,
                handles,
                hitAreas,
                hitOverlay
            },
            options: {
                hitRadius
            }
        } = this;

        if (!hitAreas) return;

        const corners = readCorners(handles.te, handles.be);
        const radius = hitRadius / screenScale(controls);
        const outlines: string[] = [];

        entries(hitAreas).forEach(([key, area]) => {
            const hdl = handles[key];
            if (isUndef(hdl)) return;

            const center = {
                x: Number(hdl!.getAttribute('cx')) || 0,
                y: Number(hdl!.getAttribute('cy')) || 0
            };
            const path = outlineToPath(hitAreaOutline(key, center, corners, radius));

            area.setAttribute('d', path);
            outlines.push(path);
        });

        if (hitOverlay) hitOverlay.setAttribute('d', outlines.join(''));
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

        this.updateControlsView();

        if (isShifted) {
            this.setTransformOrigin({ x: dx, y: dy }, true);
        } else {
            this.setTransformOrigin({ dx: 0, dy: 0 }, false);
        }

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

        return bBoxPoints(element, nextTransform, element.getBBox());
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
            ? bBoxPoints(target as SVGGraphicsElement, getTransformToElement(target, container))
            : this.getRestrictedBBox(true);

        const [offsetX, offsetY] = alignmentOffset(
            direction,
            getMinMaxOfArray(restrictBBox),
            getMinMaxOfArray(values(vertices).map(({ x, y }) => [x, y]))
        );

        elements.forEach((element) => {
            const parentMatrix = getTransformToElement(element.parentNode, container);
            parentMatrix.e = parentMatrix.f = 0;

            const { x, y } = pointTo(parentMatrix.inverse(), offsetX, offsetY);

            const moveElementMtrx = createTranslateMatrix(x, y).multiply(
                getTransformToElement(element, element.parentNode)
            );

            this.updateElementView(element, moveElementMtrx);
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

        const nextTransform = isGrouped
            ? createSVGMatrix()
            : getTransformToElement(elements[0], container);

        const { tl, br, tr } = transformVertices(boxVertices(this.getBBox()), nextTransform);

        return {
            x: floatToFixed(tl.x),
            y: floatToFixed(tl.y),
            width: floatToFixed(Math.sqrt(Math.pow(tl.x - tr.x, 2) + Math.pow(tl.y - tr.y, 2))),
            height: floatToFixed(Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2))),
            rotation: floatToFixed(Math.atan2((tr.y - tl.y), (tr.x - tl.x)) * DEG)
        };
    }

}
