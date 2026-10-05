import { helper } from '../Helper';
import Transformable from './Transformable';
import type {
    Point,
    Delta,
    ResizeFlags,
    ElementData,
    TransformHandles,
    TransformOptions,
    TransformStorage
} from './Transformable';
import type { PointerInput } from '../SubjectModel';
import type { Matrix, Vector } from '../types';
import type { TransformOriginParams, AlignmentDirection } from '../options';
import { floatToFixed, getMinMaxOfArray, DEG } from './common';
import { isDef, isUndef, warn } from '../util/util';
import { addClass, matrixToCSS, getScrollOffset, getElementOffset } from '../util/css-util';
import { MIN_SIZE, CLIENT_EVENTS_CONSTANTS } from '../consts';

import {
    matrixInvert,
    createRotateMatrix,
    createTranslateMatrix,
    createScaleMatrix,
    multiplyMatrix,
    multiplyMatrixAndPoint,
    getTransform,
    getCurrentTransformMatrix,
    flatMatrix,
    dropTranslate,
    decompose,
    getAbsoluteOffset,
    createIdentityMatrix
} from './matrix';

const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;

const { keys, entries, values } = Object;

interface BoxSize {
    width: number;
    height: number;
}

interface HTMLBBox extends BoxSize {
    x?: number;
    y?: number;
    left?: number;
    top?: number;
    offset?: {
        left: number;
        top: number;
    };
}

interface HTMLElementTransform {
    ctm: Matrix;
    matrix: Matrix;
    parentMatrix: Matrix;
    auxiliary: {
        scale: {
            translateMatrix: Matrix;
        };
        translate: {
            parentMatrix: Matrix;
        };
        rotate: {
            translateMatrix: Matrix;
        };
    };
    scaleX: number;
    scaleY: number;
    scX: number;
    scY: number;
    [key: string]: unknown;
}

interface HTMLElementData extends ElementData<Matrix> {
    parent: Element;
    transform: HTMLElementTransform;
    bBox: HTMLBBox;
    __data__: WeakMap<Element, unknown>;
    cached?: {
        dx?: number;
        dy?: number;
        bBox?: BoxSize;
        dist?: Delta & { ox: number; oy: number };
    };
}

type HTMLHandles = TransformHandles & Record<string, HTMLElement | null | undefined>;

interface HTMLStorage extends TransformStorage<Matrix> {
    wrapper: HTMLElement;
    controls: HTMLElement;
    handles: HTMLHandles;
    data: WeakMap<Element, HTMLElementData>;
    transformOrigin: Vector;
    bBox: HTMLBBox;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        matrix?: Matrix;
    };
    transform: {
        containerMatrix: Matrix;
        controlsMatrix: Matrix;
        wrapperMatrix: Matrix;
    };
    cached: TransformStorage<Matrix>['cached'] & {
        transformOrigin?: Vector;
        bBox?: BoxSize;
    };
}

type HTMLOptions = TransformOptions & {
    container: HTMLElement;
    controlsContainer: HTMLElement;
    restrict: HTMLElement | null;
};

type VertexMap = Record<string, Vector> & { anchor?: Point };

export default class Draggable extends Transformable<Matrix, HTMLStorage> {

    elements!: HTMLElement[];
    options!: HTMLOptions;

    /** @internal */
    protected init(elements: HTMLElement[]) {
        const {
            options: {
                transformOrigin,
                container,
                controlsContainer,
                resizable,
                rotatable,
                showNormal,
                restrict
            }
        } = this;

        const wrapper = createElement(['sjx-wrapper']);
        const controls = createElement(['sjx-controls']);

        const handles: HTMLHandles = {};

        const {
            rotator = null,
            anchor = null,
            ...finalVertices
        } = this.getVertices();

        let rotationHandles: HTMLHandles = {};

        if (rotatable) {
            const normalLine = showNormal
                ? renderLine([[anchor!.x, anchor!.y], rotator!], 'normal')
                : null;

            if (showNormal) controls.appendChild(normalLine!);

            let radius: HTMLElement | null = null;

            if (transformOrigin) {
                radius = renderLine([finalVertices.center, finalVertices.center], 'radius');
                addClass(radius, 'sjx-hidden');

                controls.appendChild(radius);
            }

            rotationHandles = {
                ...rotationHandles,
                normal: normalLine,
                radius
            };
        }

        const resizingEdges: Record<string, Vector[]> = {
            te: [finalVertices.tl, finalVertices.tr],
            be: [finalVertices.bl, finalVertices.br],
            le: [finalVertices.tl, finalVertices.bl],
            re: [finalVertices.tr, finalVertices.br]
        };

        const boxHandles: Record<string, Vector> = {
            tl: finalVertices.tl,
            tr: finalVertices.tr,
            br: finalVertices.br,
            bl: finalVertices.bl,
            tc: finalVertices.tc,
            bc: finalVertices.bc,
            ml: finalVertices.ml,
            mr: finalVertices.mr
        };

        const resizingHandles = resizable
            ? keys(boxHandles)
                .filter(key => this.isHandleEnabled(key))
                .reduce<Record<string, Vector>>((result, key) => {
                    result[key] = boxHandles[key];
                    return result;
                }, {})
            : {};

        const nextTransformOrigin: Vector = Array.isArray(transformOrigin)
            ? [...transformOrigin, 0, 1]
            : [...finalVertices.center, 0, 1];

        const allHandles: Record<string, Vector | null | undefined> = {
            ...resizingHandles,
            center: transformOrigin && rotatable
                ? [...nextTransformOrigin].slice(0, 2)
                : undefined,
            rotator
        };

        const mapHandlers = (
            obj: Record<string, Vector | Vector[] | null | undefined>,
            renderFunc: (data: never, key: string) => HTMLElement
        ) => (
            keys(obj).map(key => {
                const data = obj[key];
                if (isUndef(data)) return;
                const handler = renderFunc(data as never, key);
                handles[key] = handler;
                controls.appendChild(handler);
            })
        );

        mapHandlers(resizingEdges, renderLine);

        keys(resizingEdges)
            .filter(key => !this.isHandleEnabled(key))
            .forEach(key => helper(handles[key]!).css({ pointerEvents: 'none' }));
        mapHandlers(allHandles, createHandler);

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data: HTMLStorage['data'] = new WeakMap();

        elements.map(element => (
            data.set(element, {
                parent: element.parentNode as Element,
                transform: {
                    ctm: getCurrentTransformMatrix(element, container)
                } as HTMLElementTransform,
                bBox: this.getBBox(),
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
                containerMatrix: getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode)
            },
            cached: {}
        } as unknown as HTMLStorage;

        [...elements, controls].map(target => (
            helper(target)
                .on(E_MOUSEDOWN, this.onMouseDown)
                .on(E_TOUCHSTART, this.onTouchStart)
        ));
    }

    /** @internal */
    protected pointToTransform({ x, y, matrix }: Point & { matrix: Matrix }) {
        const nextMatrix = matrixInvert(matrix);

        return this.applyMatrixToPoint(
            dropTranslate(nextMatrix, false),
            x,
            y
        );
    }

    /** @internal */
    protected pointToControls({ x, y }: Point, transform = this.storage.transform) {
        const { controlsMatrix } = transform;
        const matrix = matrixInvert(controlsMatrix);

        return this.applyMatrixToPoint(
            dropTranslate(matrix, false),
            x,
            y
        );
    }

    /** @internal */
    private applyMatrixToPoint(matrix: Matrix, x: number, y: number): Point {
        const [nx, ny] = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]);
        return {
            x: nx,
            y: ny
        };
    }

    /** @internal */
    protected cursorPoint({ clientX, clientY }: PointerInput) {
        const { container } = this.options;
        const globalMatrix = getCurrentTransformMatrix(container);

        const offset = getElementOffset(container);
        const { left, top } = getScrollOffset();
        const translateMatrix = createTranslateMatrix(
            offset.left - left,
            offset.top - top
        );

        return this.applyMatrixToPoint(
            matrixInvert(
                multiplyMatrix(
                    globalMatrix,
                    translateMatrix
                )
            ),
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
                }
            },
            options: {
                restrict,
                container
            }
        } = this;

        const restrictEl = restrict || container;

        return getBoundingRect(
            restrictEl,
            container,
            force ? getCurrentTransformMatrix(restrictEl, container) : containerMatrix
        );
    }

    /** @internal */
    protected applyTransformToElement(element: HTMLElement) {
        const {
            storage: {
                controls,
                data
            },
            options: {
                applyTranslate
            }
        } = this;

        const {
            cached,
            transform: { matrix }
        } = data.get(element)!;

        const $controls = helper(controls);

        if (isUndef(cached)) return;

        if (applyTranslate) {
            const $el = helper(element);

            const { dx, dy } = cached;

            const css: Record<string, string> = matrixToCSS(matrix as unknown as number[]);

            const left = parseFloat(
                element.style.left || $el.css('left')
            );

            const top = parseFloat(
                element.style.top || $el.css('top')
            );

            css.left = `${left + (dx as number)}px`;
            css.top = `${top + (dy as number)}px`;

            $el.css(css);
            $controls.css(css);
        }
    }

    /** @internal */
    protected processActions() { }

    /** @internal */
    protected processPointMove() {
        return null;
    }

    /** @internal */
    protected processResize(element: HTMLElement, { dx, dy }: Delta) {
        const {
            storage: {
                revX,
                revY,
                doW,
                doH,
                data,
                bBox: {
                    width: boxWidth,
                    height: boxHeight
                }
            },
            options: {
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
            cached
        } = elementData;

        const getScale = (distX: number, distY: number): [number, number, number, number] => {
            const ratio = doW || (!doW && !doH)
                ? (boxWidth + distX) / boxWidth
                : (boxHeight + distY) / boxHeight;

            const newWidth = proportions ? boxWidth * ratio : boxWidth + distX,
                newHeight = proportions ? boxHeight * ratio : boxHeight + distY;

            const scaleX = newWidth / boxWidth,
                scaleY = newHeight / boxHeight;

            return [scaleX, scaleY, newWidth, newHeight];
        };

        const getScaleMatrix = (scaleX: number, scaleY: number) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return multiplyMatrix(
                multiplyMatrix(translateMatrix, scaleMatrix),
                matrixInvert(translateMatrix)
            );
        };

        const getTranslateMatrix = (scM: Matrix, ctm: Matrix) => {
            const translateX = scM[0][3];
            const translateY = scM[1][3];

            const trMatrix = createTranslateMatrix(
                translateX,
                translateY
            );

            const inverted = createTranslateMatrix(
                translateX * (revX ? -1 : 1),
                translateY * (revY ? -1 : 1)
            );

            return multiplyMatrix(
                multiplyMatrix(inverted, ctm),
                matrixInvert(trMatrix)
            );
        };

        const [
            scaleX,
            scaleY,
            newWidth,
            newHeight
        ] = getScale(dx, dy);

        const scaleMatrix = getScaleMatrix(scaleX, scaleY);
        const resultMatrix = scalable
            ? multiplyMatrix(scaleMatrix, matrix)
            : getTranslateMatrix(scaleMatrix, matrix);

        if (newWidth <= MIN_SIZE || newHeight <= MIN_SIZE) {
            return {
                transform: resultMatrix,
                width: newWidth,
                height: newHeight
            };
        };

        this.updateElementView(
            element,
            {
                ...matrixToCSS(flatMatrix(resultMatrix)),
                ...(!scalable && {
                    width: `${newWidth}px`,
                    height: `${newHeight}px`
                })
            }
        );

        data.set(element, {
            ...elementData,
            cached: {
                ...cached,
                dx,
                dy,
                bBox: {
                    width: newWidth,
                    height: newHeight
                }
            }
        });

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    /** @internal */
    protected processMove(element: HTMLElement, { dx, dy }: Delta) {
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
            },
            cached = {}
        } = elementStorage;

        const [nx, ny] = multiplyMatrixAndPoint(
            parentMatrix,
            [dx, dy, 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            matrix,
            createTranslateMatrix(nx, ny)
        );

        const elStyle = matrixToCSS(flatMatrix(moveElementMtrx));

        this.updateElementView(element, elStyle);

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

        return moveElementMtrx;
    }

    /** @internal */
    protected processRotate(element: HTMLElement, radians: number) {
        const {
            storage: {
                data
            },
            options: {
                restrict
            }
        } = this;

        const {
            transform: {
                matrix,
                auxiliary: {
                    rotate: {
                        translateMatrix
                    }
                }
            }
        } = data.get(element)!;

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

        const rotationMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix),
            translateMatrix
        );

        const resultMatrix = multiplyMatrix(matrix, transformMatrix);

        const { x: restX, y: restY } = restrict
            ? this.restrictHandler(resultMatrix)
            : { x: null, y: null };

        if (isDef(restX) || isDef(restY)) return resultMatrix;

        this.updateElementView(
            element,
            matrixToCSS(flatMatrix(resultMatrix))
        );

        return resultMatrix;
    }

    /** @internal */
    protected getElementState(element: HTMLElement, { revX, revY, doW, doH }: Partial<ResizeFlags>) {
        const {
            storage: {
                handles: {
                    center: cHandle
                },
                data,
                transformOrigin
            },
            options: {
                container,
                scalable
            }
        } = this;

        const storage = data.get(element)!;

        const { parent } = storage;

        const [glLeft, glTop] = getAbsoluteOffset(element, container);

        const {
            offsetLeft: elOffsetLeft,
            offsetTop: elOffsetTop,
            offsetWidth: elWidth,
            offsetHeight: elHeight
        } = element;

        const matrix = getTransform(element);
        const ctm = getCurrentTransformMatrix(element, container);
        const parentMatrix = getCurrentTransformMatrix(parent, container);

        const hW = elWidth / 2,
            hH = elHeight / 2;

        // real element's center
        const [cenX, cenY] = multiplyMatrixAndPoint(
            ctm,
            [hW, hH, 0, 1]
        );

        const scaleX = doH ? 0 : (revX ? -hW : hW),
            scaleY = doW ? 0 : (revY ? -hH : hH);

        const globalCenterX = cenX + glLeft;
        const globalCenterY = cenY + glTop;

        const originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();

        // search distance between el's center and rotation handle
        const [distX, distY] = multiplyMatrixAndPoint(
            multiplyMatrix(
                matrixInvert(dropTranslate(ctm)),
                dropTranslate(originTransform)
            ),
            [
                transformOrigin[0] - globalCenterX,
                transformOrigin[1] - globalCenterY,
                0,
                1
            ]
        );

        // todo: check rotation origin with parent transform
        const [elX, elY] = multiplyMatrixAndPoint(
            matrix,
            [
                distX,
                distY,
                0,
                1
            ]
        );

        const {
            scale: { sX, sY }
        } = decompose(getCurrentTransformMatrix(element, element.parentNode));

        const transform = {
            auxiliary: {
                scale: {
                    translateMatrix: scalable
                        ? createTranslateMatrix(
                            scaleX,
                            scaleY
                        )
                        : createTranslateMatrix(
                            doH ? 0 : hW,
                            doW ? 0 : hH
                        )
                },
                translate: {
                    parentMatrix: matrixInvert(dropTranslate(parentMatrix))
                },
                rotate: {
                    translateMatrix: createTranslateMatrix(elX, elY)
                }
            },
            scaleX,
            scaleY,
            matrix,
            ctm,
            parentMatrix,
            scX: sX,
            scY: sY
        };

        return {
            transform,
            bBox: {
                width: elWidth,
                height: elHeight,
                left: elOffsetLeft,
                top: elOffsetTop,
                offset: {
                    left: glLeft,
                    top: glTop
                }
            }
        };
    }

    /** @internal */
    protected getCommonState() {
        const {
            elements,
            storage: {
                controls,
                handles: {
                    center: cHandle
                },
                center: oldCenter,
                wrapper
            },
            options: {
                container,
                restrict
            }
        } = this;

        const [glLeft, glTop] = getAbsoluteOffset(elements[0], container);
        const ctm = getCurrentTransformMatrix(elements[0], container);

        const restrictContainer = restrict || container;
        const containerMatrix = getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode);

        const {
            width: boxWidth,
            height: boxHeight
        } = this.getBBox();

        // real element's center
        const [cenX, cenY] = multiplyMatrixAndPoint(
            ctm,
            [
                boxWidth / 2,
                boxHeight / 2,
                0,
                1
            ]
        );

        const globalCenterX = cenX + glLeft;
        const globalCenterY = cenY + glTop;

        const originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();

        return {
            transform: {
                controlsMatrix: getCurrentTransformMatrix(controls, controls.parentNode),
                containerMatrix,
                wrapperMatrix: getCurrentTransformMatrix(wrapper, container)
            },
            bBox: {
                ...this.getBBox()
            },
            center: {
                ...oldCenter,
                x: globalCenterX,
                y: globalCenterY,
                matrix: originTransform
            }
        };
    }

    /** @internal */
    private getBBox() {
        const {
            elements: [element],
            options: {
                isGrouped,
                container
            }
        } = this;

        if (isGrouped) {
            return this.getGroupBbox();
        } else {
            const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

            const {
                offsetLeft: elOffsetLeft,
                offsetTop: elOffsetTop,
                offsetWidth: elWidth,
                offsetHeight: elHeight
            } = element;

            return {
                x: elOffsetLeft,
                y: elOffsetTop,
                width: elWidth,
                height: elHeight,
                offset: {
                    left: offsetLeft,
                    top: offsetTop
                }
            };
        }
    }

    /** @internal */
    protected processControlsResize() {
        const { center } = this.applyTransformToHandles();

        const {
            storage: {
                transform: {
                    controlsMatrix
                }
            }
        } = this;

        if (!center) return;

        this.storage = {
            ...this.storage,
            cached: {
                transformOrigin: multiplyMatrixAndPoint(
                    controlsMatrix,
                    center
                )
            }
        };
    }

    /** @internal */
    protected processControlsMove({ dx, dy }: Delta) {
        const {
            storage: {
                transform: {
                    controlsMatrix,
                    wrapperMatrix
                },
                center,
                transformOrigin
            }
        } = this;

        const moveControlsMtrx = multiplyMatrix(
            controlsMatrix,
            createTranslateMatrix(dx, dy)
        );

        this.updateControlsView(moveControlsMtrx);

        const centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));
        const [cx, cy] = multiplyMatrixAndPoint(
            centerTransformMatrix,
            [dx, dy, 0, 1]
        );

        if (center.isShifted) {
            this.moveCenterHandle(-cx, -cy, false);
        } else {
            const translateMatrix = createTranslateMatrix(cx, cy);

            this.storage = {
                ...this.storage,
                cached: {
                    transformOrigin: multiplyMatrixAndPoint(
                        translateMatrix,
                        transformOrigin
                    )
                }
            };
        }
    }

    /** @internal */
    protected processControlsRotate({ radians }: { radians: number }) {
        const {
            storage: {
                transform: {
                    wrapperMatrix,
                    controlsMatrix
                },
                transformOrigin: [
                    originX,
                    originY
                ]
            }
        } = this;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const rotateMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(wrapperMatrix), rotateMatrix),
            wrapperMatrix
        );

        const rotateResultMatrix = multiplyMatrix(
            multiplyMatrix(createTranslateMatrix(-originX, -originY), transformMatrix),
            createTranslateMatrix(originX, originY)
        );

        this.updateControlsView(
            multiplyMatrix(controlsMatrix, rotateResultMatrix)
        );
    }

    /** @internal */
    protected moveCenterHandle(x: number, y: number, updateTransformOrigin = true) {
        const {
            storage: {
                handles: { center },
                center: { matrix },
                center: prevCenterData,
                transformOrigin
            }
        } = this;

        const translateMatrix = createTranslateMatrix(x, y);

        const resultMatrix = multiplyMatrix(
            matrix!,
            translateMatrix
        );

        helper(center!).css({
            ...matrixToCSS(flatMatrix(resultMatrix))
        });

        this.storage = {
            ...this.storage,
            center: {
                ...prevCenterData,
                isShifted: true
            },
            ...(updateTransformOrigin ? {
                cached: {
                    transformOrigin: multiplyMatrixAndPoint(
                        translateMatrix,
                        transformOrigin
                    )
                }
            } : {})
        };
    }

    /** @internal */
    protected processMoveRestrict(element: HTMLElement, { dx, dy }: Delta) {
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

        const [x, y] = multiplyMatrixAndPoint(
            parentMatrix,
            [dx, dy, 0, 1]
        );

        const preTranslateMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        return this.restrictHandler(preTranslateMatrix);
    }

    /** @internal */
    protected processRotateRestrict(element: HTMLElement, radians: number) {
        const {
            storage: {
                data
            }
        } = this;

        const {
            transform: {
                matrix,
                auxiliary: {
                    rotate: {
                        translateMatrix
                    }
                }
            }
        } = data.get(element)!;

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

        const rotationMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix),
            translateMatrix
        );

        const resultMatrix = multiplyMatrix(matrix, transformMatrix);

        return this.restrictHandler(resultMatrix);
    }

    /** @internal */
    protected processResizeRestrict(element: HTMLElement, { dx, dy }: Delta) {
        const {
            storage: {
                revX,
                revY,
                doW,
                doH,
                data,
                bBox: {
                    width: boxWidth,
                    height: boxHeight
                }
            },
            options: {
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
            }
        } = elementData;

        const getScale = (distX: number, distY: number): [number, number, number, number] => {
            const ratio = doW || (!doW && !doH)
                ? (boxWidth + distX) / boxWidth
                : (boxHeight + distY) / boxHeight;

            const newWidth = proportions ? boxWidth * ratio : boxWidth + distX,
                newHeight = proportions ? boxHeight * ratio : boxHeight + distY;

            const scaleX = newWidth / boxWidth,
                scaleY = newHeight / boxHeight;

            return [scaleX, scaleY, newWidth, newHeight];
        };

        const getScaleMatrix = (scaleX: number, scaleY: number) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return multiplyMatrix(
                multiplyMatrix(translateMatrix, scaleMatrix),
                matrixInvert(translateMatrix)
            );
        };

        const getTranslateMatrix = (scM: Matrix, ctm: Matrix) => {
            const translateX = scM[0][3];
            const translateY = scM[1][3];

            const trMatrix = createTranslateMatrix(
                translateX,
                translateY
            );

            const inverted = createTranslateMatrix(
                translateX * (revX ? -1 : 1),
                translateY * (revY ? -1 : 1)
            );

            return multiplyMatrix(
                multiplyMatrix(inverted, ctm),
                matrixInvert(trMatrix)
            );
        };

        const [pScaleX, pScaleY] = getScale(dx, dy);

        const preScaleMatrix = getScaleMatrix(pScaleX, pScaleY);

        const preResultMatrix = scalable
            ? multiplyMatrix(preScaleMatrix, matrix)
            : getTranslateMatrix(preScaleMatrix, matrix);

        return this.restrictHandler(preResultMatrix);
    }

    /** @internal */
    private updateElementView(element: Element, css: Record<string, string>) {
        helper(element).css(css);
    }

    /** @internal */
    private updateControlsView(matrix = createIdentityMatrix()) {
        const cssStyle = matrixToCSS(flatMatrix(matrix));
        helper(this.storage.controls).css(cssStyle);

        this.storage.cached.controlsMatrix = matrix;
    }

    /**
     * Handle positions as [x, y, ...] arrays in container coordinates: box corners
     * and edge midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, and rotator
     * when rotatable; anchor, the rotator's base point, is { x, y }
     * @param transformMatrix matrix applied on top of the element transform
     */
    getVertices(transformMatrix = createIdentityMatrix()): VertexMap {
        const {
            elements: [element] = [],
            options: {
                isGrouped,
                rotatable,
                rotatorAnchor,
                rotatorOffset
            }
        } = this;

        const finalVertices: VertexMap = isGrouped
            ? this.getGroupVertices()
            : this.getElementVertices(element, transformMatrix);

        let rotator: Vector | null = null;

        if (rotatable) {
            const anchor = {} as Point;
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n':
                    anchor.x = finalVertices.tc[0];
                    anchor.y = finalVertices.tc[1];
                    break;
                case 's':
                    anchor.x = finalVertices.bc[0];
                    anchor.y = finalVertices.bc[1];
                    factor = -1;
                    break;
                case 'w':
                    anchor.x = finalVertices.ml[0];
                    anchor.y = finalVertices.ml[1];
                    factor = -1;
                    break;
                case 'e':
                default:
                    anchor.x = finalVertices.mr[0];
                    anchor.y = finalVertices.mr[1];
                    break;

            }

            const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
                ? Math.atan2(
                    finalVertices.bl[1] - finalVertices.tl[1],
                    finalVertices.bl[0] - finalVertices.tl[0]
                )
                : Math.atan2(
                    finalVertices.tl[1] - finalVertices.tr[1],
                    finalVertices.tl[0] - finalVertices.tr[0]
                );

            rotator = [
                anchor.x - (rotatorOffset * factor) * Math.cos(theta),
                anchor.y - (rotatorOffset * factor) * Math.sin(theta)
            ];

            finalVertices.rotator = rotator;
            finalVertices.anchor = anchor as Point & Vector;
        }

        return finalVertices;
    }

    /** @internal */
    private getElementVertices(element: HTMLElement, transformMatrix: Matrix): VertexMap {
        const {
            options: {
                container,
                isGrouped
            }
        } = this;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

        const {
            offsetWidth,
            offsetHeight
        } = element;

        const vertices = {
            tl: [0, 0, 0, 1],
            bl: [0, offsetHeight, 0, 1],
            br: [offsetWidth, offsetHeight, 0, 1],
            tr: [offsetWidth, 0, 0, 1],
            tc: [offsetWidth / 2, 0, 0, 1],
            ml: [0, offsetHeight / 2, 0, 1],
            bc: [offsetWidth / 2, offsetHeight, 0, 1],
            mr: [offsetWidth, offsetHeight / 2, 0, 1],
            center: [offsetWidth / 2, offsetHeight / 2, 0, 1]
        };

        const nextTransform = isGrouped
            ? transformMatrix
            : multiplyMatrix(getCurrentTransformMatrix(element, container), transformMatrix);

        return entries(vertices)
            .reduce<[string, Vector][]>((nextVertices, [key, vertex]) => (
                [
                    ...nextVertices,
                    [key, multiplyMatrixAndPoint(nextTransform, vertex)]
                ]
            ), [])
            .reduce<VertexMap>((vertices, [key, [x, y, z, w]]) => {
                vertices[key] = [
                    x + offsetLeft,
                    y + offsetTop,
                    z,
                    w
                ];
                return vertices;
            }, {});
    }

    /** @internal */
    private getGroupVertices(): VertexMap {
        const {
            x,
            y,
            width,
            height
        } = this.getGroupBbox();

        const hW = width / 2,
            hH = height / 2;

        return {
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
    }

    /** @internal */
    private getGroupBbox() {
        const {
            elements,
            options: {
                container
            }
        } = this;

        const vertices = elements.reduce<Vector[][]>((result, element) => {
            const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

            const {
                offsetWidth,
                offsetHeight
            } = element;

            const vertices = [
                [0, 0, 0, 1],
                [0, offsetHeight, 0, 1],
                [offsetWidth, offsetHeight, 0, 1],
                [offsetWidth, 0, 0, 1]
            ];

            const nextTransform = getCurrentTransformMatrix(element, container);

            const groupVertices = vertices
                .reduce<Vector[]>((nextVertices, vertex) => (
                    [
                        ...nextVertices,
                        multiplyMatrixAndPoint(nextTransform, vertex)
                    ]
                ), [])
                .map(([x, y, z, w]) => (
                    [
                        x + offsetLeft,
                        y + offsetTop,
                        z,
                        w
                    ]
                ));

            return [
                ...result,
                groupVertices
            ];
        }, []);

        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(vertices.reduce<Vector[]>((res, item) => [...res, ...item], []));

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /** @internal */
    private getElementBBox(element: HTMLElement) {
        const {
            options: {
                container
            }
        } = this;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

        const {
            offsetWidth,
            offsetHeight
        } = element;

        const vertices = [
            [0, 0, 0, 1],
            [0, offsetHeight, 0, 1],
            [offsetWidth, offsetHeight, 0, 1],
            [offsetWidth, 0, 0, 1]
        ];

        const nextTransform = getCurrentTransformMatrix(element, container);

        const nextVertices = vertices
            .reduce<Vector[]>((nextVertices, vertex) => (
                [
                    ...nextVertices,
                    multiplyMatrixAndPoint(nextTransform, vertex)
                ]
            ), [])
            .map(([x, y, z, w]) => (
                [
                    x + offsetLeft,
                    y + offsetTop,
                    z,
                    w
                ]
            ));


        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(nextVertices);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /** @internal */
    private applyTransformToHandles({ boxMatrix = createIdentityMatrix() }: { boxMatrix?: Matrix } = {}): VertexMap {
        const {
            options: {
                rotatable,
                resizable,
                showNormal
            },
            storage: {
                handles,
                controls,
                center: { isShifted = false } = {} as HTMLStorage['center'],
                transform: {
                    controlsMatrix = getCurrentTransformMatrix(controls, controls.parentNode)
                } = {} as HTMLStorage['transform']
            }
        } = this;

        const matrix = multiplyMatrix(
            boxMatrix, // better to find result matrix instead of calculated
            matrixInvert(controlsMatrix)
        );

        const {
            anchor = null,
            center,
            ...finalVertices
        } = this.getVertices(matrix);

        let normalLine: Vector[] | null = null;
        let rotationHandles: Record<string, Vector> = {};

        if (rotatable) {
            normalLine = showNormal
                ? [[anchor!.x, anchor!.y], finalVertices.rotator]
                : null;

            rotationHandles = {
                rotator: finalVertices.rotator
            };
        }

        const resizingEdges: Record<string, Vector[]> = {
            te: [finalVertices.tl, finalVertices.tr],
            be: [finalVertices.bl, finalVertices.br],
            le: [finalVertices.tl, finalVertices.bl],
            re: [finalVertices.tr, finalVertices.br],
            ...(showNormal && normalLine && { normal: normalLine })
        };

        keys(resizingEdges).forEach(key => {
            const [pt1, pt2] = resizingEdges[key];

            const {
                cx,
                cy,
                length,
                theta
            } = getLineAttrs(pt1, pt2);

            helper(handles[key]!).css({
                transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
                width: `${length}px`
            });
        });

        const allHandles: VertexMap = {
            ...(resizable && finalVertices),
            ...rotationHandles,
            ...((!isShifted && Boolean(center)) && { center })
        };

        return keys(allHandles).reduce<VertexMap>((result, key) => {
            const hdl = handles[key];
            const attr = allHandles[key];

            result[key] = attr;

            if (isUndef(attr) || isUndef(hdl)) return result;

            const [x, y] = attr;
            helper(hdl).css({
                transform: `translate(${x}px, ${y}px)`
            });

            return result;
        }, {});
    }

    setCenterPoint(...args: [TransformOriginParams?, boolean?]) {
        warn('"setCenterPoint" method is replaced by "setTransformOrigin" and would be removed soon');
        this.setTransformOrigin(...args);
    }

    setTransformOrigin({ x, y, dx, dy }: TransformOriginParams = {}, pin = true) {
        const {
            elements: [element] = [],
            storage,
            storage: {
                wrapper,
                handles: {
                    center: handle
                },
                center
            } = {} as HTMLStorage,
            options: {
                container
            } = {} as HTMLOptions
        } = this;

        const isRelative = isDef(dx) && isDef(dy),
            isAbsolute = isDef(x) && isDef(y);

        if (!handle || !center || !(isRelative || isAbsolute)) return;

        const matrix = multiplyMatrix(
            getCurrentTransformMatrix(element, container),
            matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode))
        );

        let newX: number, newY: number;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

        if (isRelative) {
            const { offsetHeight, offsetWidth } = element;

            const relX = -dx! + offsetWidth / 2;
            const relY = -dy! + offsetHeight / 2;

            [newX, newY] = multiplyMatrixAndPoint(
                matrix,
                [relX, relY, 0, 1]
            );
        } else {
            newX = x!;
            newY = y!;
        }

        helper(handle).css({
            transform: `translate(${newX + offsetLeft}px, ${newY + offsetTop}px)`
        });

        center.isShifted = pin;
        storage.transformOrigin = multiplyMatrixAndPoint(
            createIdentityMatrix(),
            [newX, newY, 0, 1]
        );
    }

    fitControlsToSize() {
        const {
            storage: {
                controls,
                center: {
                    isShifted
                } = {} as HTMLStorage['center'],
                transformOrigin: [
                    originX,
                    originY
                ]
            }
        } = this;

        const controlsMatrix = getCurrentTransformMatrix(controls, controls.parentNode);
        const [dx, dy] =  multiplyMatrixAndPoint(
            controlsMatrix,
            [originX, originY, 0, 1]
        );

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

    getBoundingRect(transformMatrix: Matrix | null = null) {
        const {
            elements: [element] = [],
            options: {
                scalable,
                restrict,
                container
            },
            storage: {
                bBox,
                bBox: {
                    width,
                    height
                } = {},
                cached: {
                    bBox: {
                        width: nextWidth = width,
                        height: nextHeight = height
                    } = {} as BoxSize
                } = {} as HTMLStorage['cached']
            }
        } = this;

        const nextBox = scalable
            ? bBox
            : {
                ...bBox,
                width: nextWidth,
                height: nextHeight
            } as HTMLBBox;

        const restrictEl = restrict || container;

        return getBoundingRect(
            element,
            restrictEl,
            getCurrentTransformMatrix(element, restrictEl, transformMatrix),
            nextBox
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
            ? getBoundingRect(target as HTMLElement, container, getCurrentTransformMatrix(target, container))
            : this.getRestrictedBBox(true);

        const nextVertices = values(vertices);

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

        const [x, y] = multiplyMatrixAndPoint(
            matrixInvert(
                dropTranslate(getCurrentTransformMatrix(elements[0].parentNode as Element, container))
            ),
            [getXDir(), getYDir(), 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            getTransform(elements[0]),
            createTranslateMatrix(x, y)
        );

        elements.map((element) => (
            this.updateElementView(
                element,
                matrixToCSS(flatMatrix(moveElementMtrx))
            )
        ));

        this.fitControlsToSize();
    }

    getDimensions() {
        const {
            elements: [element] = [],
            options: {
                isGrouped
            }
        } = this;

        const { tl, tr, br } = isGrouped
            ? this.getGroupVertices()
            : this.getElementVertices(element, createIdentityMatrix());

        return {
            x: floatToFixed(tl[0]),
            y: floatToFixed(tl[1]),
            width: floatToFixed(Math.sqrt(Math.pow(tl[0] - tr[0], 2) + Math.pow(tl[1] - tr[1], 2))),
            height: floatToFixed(Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2))),
            rotation: floatToFixed(Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * DEG)
        };
    }

}

const createHandler = ([x, y]: Vector, key = 'handler', style: Record<string, string> = {}) => {
    const element = createElement(['sjx-hdl', `sjx-hdl-${key}`]);

    helper(element).css({
        transform: `translate(${x}px, ${y}px)`,
        ...style
    });
    return element;
};

const renderLine = ([pt1, pt2, thickness = 1]: [Vector, Vector, number?], key: string) => {
    const {
        cx,
        cy,
        length,
        theta
    } = getLineAttrs(pt1, pt2, thickness);

    const line = createElement(['sjx-hdl-line', `sjx-hdl-${key}`]);

    helper(line).css({
        transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
        height: `${thickness}px`,
        width: `${length}px`
    });

    return line;
};

const getLineAttrs = (pt1: Vector, pt2: Vector, thickness = 1) => {
    const [x1, y1] = pt1;
    const [x2, y2] = pt2;

    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);

    const theta = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    return {
        cx,
        cy,
        thickness,
        theta,
        length
    };
};

const getBoundingRect = (element: HTMLElement, container: Element, ctm: Matrix, bBox?: HTMLBBox) => {
    const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
    const {
        width,
        height,
        offset: {
            left,
            top
        } = {} as NonNullable<HTMLBBox['offset']>
    } = bBox || {
        width: element.offsetWidth,
        height: element.offsetHeight,
        offset: {
            left: offsetLeft,
            top: offsetTop
        }
    };

    const vertices = [
        [0, 0, 0, 1],
        [width, 0, 0, 1],
        [0, height, 0, 1],
        [width, height, 0, 1]
    ];

    return vertices
        .reduce<Vector[]>((nextVerteces, vertex) => (
            [...nextVerteces, multiplyMatrixAndPoint(ctm, vertex)]
        ), [])
        .map(([x, y, z, w]) => (
            [
                x + left,
                y + top,
                z,
                w
            ]
        ));
};

const createElement = (classNames: string[] = []) => {
    const element = document.createElement('div');
    classNames.forEach(className => addClass(element, className));
    return element;
};