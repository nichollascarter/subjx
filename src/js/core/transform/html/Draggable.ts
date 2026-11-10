import { helper } from '../../Helper';
import Transformable from '../transformable';
import type { Point, Delta, ResizeFlags } from '../transformable';
import type { PointerInput } from '../../SubjectModel';
import type { Matrix, Vector } from '../../types';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
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
import { isDef, isUndef } from '../../util/util';
import { addClass, matrixToCSS, getScrollOffset, getElementOffset, getLayoutSize } from '../../util/css-util';
import { CLIENT_EVENTS_CONSTANTS } from '../../consts';

import {
    matrixInvert,
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
    getTransformOrigin,
    composeMatrix,
    createIdentityMatrix
} from '../matrix';
import { createElement, createHandler, lineStyle, renderLine } from './controls';
import {
    bBoxPoints,
    conjugate,
    mapVertices,
    pinnedMatrix,
    rotation,
    toPoints,
    toVectors
} from './geometry';
import type {
    BoxSize,
    HTMLBBox,
    HTMLElementTransform,
    HTMLHandles,
    HTMLStorage,
    HTMLOptions,
    VertexMap
} from './types';

const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;

const { entries, values } = Object;

const BOX_HANDLES = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];

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
                rotatable,
                restrict
            }
        } = this;

        const wrapper = createElement(['sjx-wrapper']);
        const controls = createElement(['sjx-controls']);

        const {
            rotator = null,
            anchor = null,
            ...vertices
        } = this.getVertices();

        const rotationHandles = rotatable
            ? this.renderRotationHandles(controls, anchor as Point | null, rotator, vertices.center)
            : {};

        const nextTransformOrigin: Vector = Array.isArray(transformOrigin)
            ? [...transformOrigin, 0, 1]
            : [...vertices.center, 0, 1];

        const edgeHandles = this.renderEdges(controls, vertices);

        const pointHandles = this.renderPoints(controls, {
            ...this.resizingPoints(vertices),
            center: transformOrigin && rotatable
                ? [...nextTransformOrigin].slice(0, 2)
                : undefined,
            rotator
        });

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data: HTMLStorage['data'] = new WeakMap();

        elements.forEach(element => (
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
                ...edgeHandles,
                ...pointHandles,
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

        [...elements, controls].forEach(target => (
            helper(target)
                .on(E_MOUSEDOWN, this.onMouseDown)
                .on(E_TOUCHSTART, this.onTouchStart)
        ));
    }

    /** @internal */
    private renderRotationHandles(
        controls: HTMLElement,
        anchor: Point | null,
        rotator: Vector | null,
        center: Vector
    ): HTMLHandles {
        const { showNormal, transformOrigin } = this.options;

        const normal = showNormal ? renderLine([[anchor!.x, anchor!.y], rotator!], 'normal') : null;

        if (normal) controls.appendChild(normal);

        let radius: HTMLElement | null = null;

        if (transformOrigin) {
            radius = renderLine([center, center], 'radius');
            addClass(radius, 'sjx-hidden');
            controls.appendChild(radius);
        }

        return { normal, radius };
    }

    /** @internal */
    private renderEdges(controls: HTMLElement, vertices: VertexMap): HTMLHandles {
        const handles: HTMLHandles = {};

        entries(edgeSegments<Vector>(vertices)).forEach(([key, segment]) => {
            const edge = renderLine(segment, key);

            if (!this.isHandleEnabled(key)) helper(edge).css({ pointerEvents: 'none' });

            controls.appendChild(edge);
            handles[key] = edge;
        });

        return handles;
    }

    /** @internal */
    private resizingPoints(vertices: VertexMap): Record<string, Vector> {
        if (!this.options.resizable) return {};

        return BOX_HANDLES
            .filter(key => this.isHandleEnabled(key))
            .reduce<Record<string, Vector>>((result, key) => {
                result[key] = vertices[key];
                return result;
            }, {});
    }

    /** @internal */
    private renderPoints(controls: HTMLElement, points: Record<string, Vector | null | undefined>): HTMLHandles {
        const handles: HTMLHandles = {};

        entries(points).forEach(([key, point]) => {
            if (isUndef(point)) return;

            const handle = createHandler(point, key);

            controls.appendChild(handle);
            handles[key] = handle;
        });

        return handles;
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
    protected pointToGroup(point: Point) {
        return this.pointToControls(point);
    }

    /** @internal */
    private getControlsMatrix() {
        const { controls } = this.storage || {};

        return controls
            ? getCurrentTransformMatrix(controls, controls.parentNode)
            : createIdentityMatrix();
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

        return bBoxPoints(
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
    private resizeResult(element: HTMLElement, { dx, dy }: Delta) {
        const {
            storage: {
                revX,
                revY,
                doW,
                doH,
                data,
                bBox: {
                    width,
                    height
                }
            },
            options: {
                proportions,
                scalable
            }
        } = this;

        const {
            matrix,
            auxiliary: {
                scale: {
                    translateMatrix
                }
            }
        } = data.get(element)!.transform;

        const [scaleX, scaleY, newWidth, newHeight] = resizeBox({ width, height, dx, dy, doW, doH, proportions, flip: false });

        const scaleMatrix = multiplyMatrix(
            multiplyMatrix(translateMatrix, createScaleMatrix(scaleX, scaleY)),
            matrixInvert(translateMatrix)
        );

        return {
            resultMatrix: scalable
                ? multiplyMatrix(scaleMatrix, matrix)
                : pinnedMatrix(scaleMatrix, matrix, revX, revY),
            newWidth,
            newHeight
        };
    }

    /** @internal */
    private cacheResize(element: HTMLElement, { dx, dy }: Delta, width: number, height: number) {
        const { data } = this.storage;
        const elementData = data.get(element)!;

        data.set(element, {
            ...elementData,
            cached: {
                ...elementData.cached,
                dx,
                dy,
                bBox: { width, height }
            }
        });
    }

    /** @internal */
    private rotatedMatrix(element: HTMLElement, radians: number) {
        const {
            matrix,
            auxiliary: {
                rotate: {
                    translateMatrix
                }
            }
        } = this.storage.data.get(element)!.transform;

        return multiplyMatrix(matrix, conjugate(rotation(radians), translateMatrix));
    }

    /** @internal */
    private translatedMatrix(element: HTMLElement, { dx, dy }: Delta) {
        const {
            matrix,
            auxiliary: {
                translate: {
                    parentMatrix
                }
            }
        } = this.storage.data.get(element)!.transform;

        const [nx, ny] = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]);

        return {
            matrix: multiplyMatrix(matrix, createTranslateMatrix(nx, ny)),
            nx,
            ny
        };
    }

    /** @internal */
    protected processResize(element: HTMLElement, delta: Delta) {
        if (this.options.isGrouped) return this.processGroupResize(element, delta);

        const { scalable } = this.options;
        const { resultMatrix, newWidth, newHeight } = this.resizeResult(element, delta);

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

        this.cacheResize(element, delta, newWidth, newHeight);

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    /** @internal */
    private processGroupResize(element: HTMLElement, { dx, dy }: Delta) {
        const {
            storage: {
                revX,
                revY,
                doW,
                doH,
                data,
                bBox: {
                    x: boxX = 0,
                    y: boxY = 0,
                    width: boxWidth,
                    height: boxHeight
                },
                transform: {
                    controlsMatrix
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
                ctm,
                origin
            },
            bBox: {
                width,
                height,
                offset: {
                    left = 0,
                    top = 0
                } = {}
            }
        } = elementData;

        const [
            scaleX,
            scaleY,
            newWidth,
            newHeight
        ] = resizeBox({ width: boxWidth, height: boxHeight, dx, dy, doW, doH, proportions, flip: false });

        const fixedX = boxX + boxWidth * (doH ? 0.5 : (revX ? 1 : 0)),
            fixedY = boxY + boxHeight * (doW ? 0.5 : (revY ? 1 : 0));

        const local = composeMatrix(
            matrixInvert(ctm),
            createTranslateMatrix(-left, -top),
            controlsMatrix,
            createTranslateMatrix(fixedX, fixedY),
            createScaleMatrix(scaleX, scaleY),
            createTranslateMatrix(-fixedX, -fixedY),
            matrixInvert(controlsMatrix),
            createTranslateMatrix(left, top),
            ctm
        );

        const toOrigin = createTranslateMatrix(origin[0], origin[1]),
            fromOrigin = createTranslateMatrix(-origin[0], -origin[1]);

        const isAxisAligned = local[0][0] > 0
            && local[1][1] > 0
            && Math.abs(local[0][1]) < 1e-4 * local[0][0]
            && Math.abs(local[1][0]) < 1e-4 * local[1][1];

        let resultMatrix: Matrix;

        if (scalable || !isAxisAligned) {
            resultMatrix = composeMatrix(matrix, fromOrigin, local, toOrigin);

            this.updateElementView(element, {
                ...matrixToCSS(flatMatrix(resultMatrix)),
                ...(!scalable && {
                    width: `${width}px`,
                    height: `${height}px`
                })
            });
        } else {
            this.updateElementView(element, {
                width: `${width * local[0][0]}px`,
                height: `${height * local[1][1]}px`
            });

            const [nextOriginX, nextOriginY] = getTransformOrigin(element, false);

            resultMatrix = composeMatrix(
                createTranslateMatrix(-nextOriginX, -nextOriginY),
                toOrigin,
                matrix,
                fromOrigin,
                createTranslateMatrix(local[0][3], local[1][3]),
                createTranslateMatrix(nextOriginX, nextOriginY)
            );

            this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
        }

        this.cacheResize(element, { dx, dy }, newWidth, newHeight);

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    /** @internal */
    protected processMove(element: HTMLElement, delta: Delta) {
        const { data } = this.storage;
        const elementStorage = data.get(element)!;
        const { matrix: moveElementMtrx, nx, ny } = this.translatedMatrix(element, delta);

        this.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)));

        data.set(element, {
            ...elementStorage,
            cached: {
                ...elementStorage.cached,
                dist: {
                    dx: floatToFixed(delta.dx),
                    dy: floatToFixed(delta.dy),
                    ox: floatToFixed(nx),
                    oy: floatToFixed(ny)
                }
            }
        });

        return moveElementMtrx;
    }

    /** @internal */
    protected processRotate(element: HTMLElement, radians: number) {
        const resultMatrix = this.rotatedMatrix(element, radians);

        if (this.options.restrict) {
            const { x, y } = this.restrictHandler(resultMatrix);

            if (isDef(x) || isDef(y)) return resultMatrix;
        }

        this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));

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
            offsetTop: elOffsetTop
        } = element;

        const { width: elWidth, height: elHeight } = getLayoutSize(element);

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
            origin: getTransformOrigin(element, false),
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
                wrapper,
                transformOrigin
            },
            options: {
                container,
                restrict,
                isGrouped
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

        const [globalCenterX, globalCenterY] = oldCenter && oldCenter.isShifted
            ? transformOrigin
            : isGrouped
                ? multiplyMatrixAndPoint(this.getControlsMatrix(), this.getGroupVertices().center)
                : [cenX + glLeft, cenY + glTop];

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
                offsetTop: elOffsetTop
            } = element;

            const { width: elWidth, height: elHeight } = getLayoutSize(element);

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
            const [hx, hy] = multiplyMatrixAndPoint(
                dropTranslate(matrixInvert(controlsMatrix)),
                [dx, dy, 0, 1]
            );

            this.moveCenterHandle(-hx, -hy, false);
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

        const transformMatrix = conjugate(rotation(radians), wrapperMatrix);

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
                transformOrigin,
                transform: {
                    controlsMatrix
                } = {} as HTMLStorage['transform']
            }
        } = this;

        const [originDx, originDy] = controlsMatrix
            ? multiplyMatrixAndPoint(dropTranslate(controlsMatrix), [x, y, 0, 1])
            : [x, y];

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
                        createTranslateMatrix(originDx, originDy),
                        transformOrigin
                    )
                }
            } : {})
        };
    }

    /** @internal */
    protected processMoveRestrict(element: HTMLElement, delta: Delta) {
        return this.restrictHandler(this.translatedMatrix(element, delta).matrix);
    }

    /** @internal */
    protected processRotateRestrict(element: HTMLElement, radians: number) {
        return this.restrictHandler(this.rotatedMatrix(element, radians));
    }

    /** @internal */
    protected processResizeRestrict(element: HTMLElement, delta: Delta) {
        return this.restrictHandler(this.resizeResult(element, delta).resultMatrix);
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

        const vertices: VertexMap = isGrouped
            ? this.getGroupVertices()
            : this.getElementVertices(element, transformMatrix);

        if (!rotatable) return vertices;

        const { anchor, rotator } = rotatorPlacement(toPoints(vertices), rotatorAnchor, rotatorOffset);

        vertices.rotator = [rotator.x, rotator.y];
        vertices.anchor = anchor as Point & Vector;

        return vertices;
    }

    /** @internal */
    private getElementVertices(element: HTMLElement, transformMatrix: Matrix): VertexMap {
        const { container } = this.options;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
        const { width, height } = getLayoutSize(element);
        const ctm = getCurrentTransformMatrix(element, container);

        return mapVertices(boxVertices({ x: 0, y: 0, width, height }), (vertex) => {
            const [x, y, z, w] = multiplyMatrixAndPoint(ctm, vertex);
            return multiplyMatrixAndPoint(transformMatrix, [x + offsetLeft, y + offsetTop, z, w]);
        });
    }

    /** @internal */
    private getGroupVertices(): VertexMap {
        return toVectors(boxVertices(this.getGroupBbox()));
    }

    /** @internal */
    private getGroupBbox() {
        const { elements, options: { container } } = this;

        const toControls = matrixInvert(this.getControlsMatrix());

        const points = elements
            .reduce<Vector[]>((result, element) => {
                const [left, top] = getAbsoluteOffset(element, container);

                return [
                    ...result,
                    ...bBoxPoints(element, container, getCurrentTransformMatrix(element, container), {
                        ...getLayoutSize(element),
                        offset: { left, top }
                    })
                ];
            }, [])
            .map(vertex => multiplyMatrixAndPoint(toControls, vertex));

        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(points);

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

        const {
            anchor = null,
            center,
            ...vertices
        } = this.getVertices(multiplyMatrix(boxMatrix, matrixInvert(controlsMatrix)));

        const normal = rotatable && showNormal
            ? [[anchor!.x, anchor!.y], vertices.rotator]
            : null;

        const lines: Record<string, Vector[]> = {
            ...edgeSegments<Vector>(vertices),
            ...(normal && { normal })
        };

        entries(lines).forEach(([key, [from, to]]) => helper(handles[key]!).css(lineStyle(from, to)));

        const allHandles: VertexMap = {
            ...(resizable && vertices),
            ...(rotatable && { rotator: vertices.rotator }),
            ...((!isShifted && Boolean(center)) && { center })
        };

        entries(allHandles as Record<string, Vector>).forEach(([key, point]) => {
            const hdl = handles[key];

            if (isUndef(point) || isUndef(hdl)) return;

            helper(hdl).css({
                transform: `translate(${point[0]}px, ${point[1]}px)`
            });
        });

        return allHandles;
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
        const [dx, dy] = multiplyMatrixAndPoint(controlsMatrix, [originX, originY, 0, 1]);

        this.updateControlsView();

        if (isShifted) {
            this.setTransformOrigin({ x: dx, y: dy }, true);
        } else {
            this.setTransformOrigin({ dx: 0, dy: 0 }, false);
        }

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

        return bBoxPoints(
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
            ? bBoxPoints(target as HTMLElement, container, getCurrentTransformMatrix(target, container))
            : this.getRestrictedBBox(true);

        const [offsetX, offsetY] = alignmentOffset(
            direction,
            getMinMaxOfArray(restrictBBox),
            getMinMaxOfArray(values(vertices))
        );

        const [x, y] = multiplyMatrixAndPoint(
            matrixInvert(
                dropTranslate(getCurrentTransformMatrix(elements[0].parentNode as Element, container))
            ),
            [offsetX, offsetY, 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            getTransform(elements[0]),
            createTranslateMatrix(x, y)
        );

        elements.forEach((element) => (
            this.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)))
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

        const vertices = isGrouped
            ? this.getGroupVertices()
            : this.getElementVertices(element, createIdentityMatrix());

        const controlsMatrix = this.getControlsMatrix();

        const [tl, tr, br] = [vertices.tl, vertices.tr, vertices.br].map(([x, y]) => (
            isGrouped ? multiplyMatrixAndPoint(controlsMatrix, [x, y, 0, 1]) : [x, y]
        ));

        return {
            x: floatToFixed(tl[0]),
            y: floatToFixed(tl[1]),
            width: floatToFixed(Math.sqrt(Math.pow(tl[0] - tr[0], 2) + Math.pow(tl[1] - tr[1], 2))),
            height: floatToFixed(Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2))),
            rotation: floatToFixed(Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * DEG)
        };
    }

}
