import { helper } from '../Helper';
import Transformable from './Transformable';
import { floatToFixed, getMinMaxOfArray } from './common';
import { isDef, isUndef } from '../util/util';
import { addClass, matrixToCSS } from '../util/css-util';
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

export default class Draggable extends Transformable {

    _init(elements) {
        const {
            options: {
                rotationPoint,
                container,
                controlsContainer,
                resizable,
                rotatable,
                showNormal
            }
        } = this;

        const wrapper = createElement(['sjx-wrapper']);
        const controls = createElement(['sjx-controls']);

        const handles = {};

        //const matrix = getCurrentTransformMatrix(el, container);
        // const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

        // const originRotation = [
        //     'data-sjx-cx',
        //     'data-sjx-cy'
        // ].map(attr => {
        //     const val = el.getAttribute(attr);
        //     return isDef(val) ? Number(val) : undefined;
        // });

        // const hasOrigin = originRotation.every(val => !isNaN(val));

        const {
            rotator = null,
            anchor = null,
            ...finalVertices
        } = this._getVertices();

        let rotationHandles = {};

        if (rotatable) {
            const normalLine = showNormal
                ? renderLine([[anchor.x, anchor.y], rotator], 'normal')
                : null;

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (rotationPoint) {
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

        const resizingEdges = {
            te: [finalVertices.tl, finalVertices.tr],
            be: [finalVertices.bl, finalVertices.br],
            le: [finalVertices.tl, finalVertices.bl],
            re: [finalVertices.tr, finalVertices.br]
        };

        const resizingHandles = resizable ?
            {
                tl: finalVertices.tl,
                tr: finalVertices.tr,
                br: finalVertices.br,
                bl: finalVertices.bl,
                tc: finalVertices.tc,
                bc: finalVertices.bc,
                ml: finalVertices.ml,
                mr: finalVertices.mr
            }
            : {};

        const nextCenter = false
            ? [...[0, 0], 0, 1]
            : finalVertices.center;

        const allHandles = {
            ...resizingHandles,
            center: rotationPoint && rotatable
                ? nextCenter
                : undefined,
            rotator
        };

        const mapHandlers = (obj, renderFunc) => (
            keys(obj).map(key => {
                const data = obj[key];
                if (isUndef(data)) return;
                const handler = renderFunc(data, key);
                handles[key] = handler;
                controls.appendChild(handler);
            })
        );

        mapHandlers(resizingEdges, renderLine);
        mapHandlers(allHandles, createHandler);

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data = new WeakMap();

        elements.map(element => (
            data.set(element, {
                parent: element.parentNode,
                center: {
                    isShifted: false
                },
                transform: {
                    ctm: getCurrentTransformMatrix(element, container)
                },
                bBox: this._getBBox(),
                cached: {},
                __data__: new WeakMap()
            })
        ));

        this.storage = {
            wrapper,
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            data
        };

        [...elements, controls].map(target => (
            helper(target)
                .on(E_MOUSEDOWN, this._onMouseDown)
                .on(E_TOUCHSTART, this._onTouchStart)
        ));
    }

    _pointToTransform({ x, y, matrix }) {
        const nextMatrix = matrixInvert(matrix);

        return this._applyMatrixToPoint(
            dropTranslate(nextMatrix, false),
            x,
            y
        );
    }

    _pointToControls({ x, y }) {
        const { transform: { controlsMatrix } } = this._getCommonState();
        const matrix = matrixInvert(controlsMatrix);

        return this._applyMatrixToPoint(
            dropTranslate(matrix, false),
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const [nx, ny] = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]);
        return {
            x: nx,
            y: ny
        };
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;
        const globalMatrix = getCurrentTransformMatrix(container);

        return this._applyMatrixToPoint(
            matrixInvert(globalMatrix),
            clientX,
            clientY
        );
    }

    _getRestrictedBBox(force = false) {
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

    _applyTransformToElement(element) {
        const {
            storage: {
                controls,
                center,
                data
            },
            options: {
                applyTranslate
            }
        } = this;

        const {
            cached,
            transform: { matrix }
        } = data.get(element);

        const $controls = helper(controls);

        if (isUndef(cached)) return;

        element.setAttribute('data-sjx-cx', center.elX);
        element.setAttribute('data-sjx-cy', center.elY);

        if (applyTranslate) {
            const $el = helper(element);

            const { dx, dy } = cached;

            const css = matrixToCSS(matrix);

            const left = parseFloat(
                element.style.left || $el.css('left')
            );

            const top = parseFloat(
                element.style.top || $el.css('top')
            );

            css.left = `${left + dx}px`;
            css.top = `${top + dy}px`;

            $el.css(css);
            $controls.css(css);
        }

        this.storage.cached = {};
    }

    _processResize(element, { dx, dy }) {
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
                scalable,
                restrict
            }
        } = this;

        const elementData = data.get(element);

        const {
            transform: {
                matrix,
                auxiliary: {
                    scale: {
                        translateMatrix
                    }
                }
            },
            cached,
            cached: {
                dist: {
                    dx: nextDx = dx,
                    dy: nextDy = dy
                } = {}
            } = {}
        } = elementData;

        const getScale = (distX, distY) => {
            const ratio = doW || (!doW && !doH)
                ? (boxWidth + distX) / boxWidth
                : (boxHeight + distY) / boxHeight;

            const newWidth = proportions ? boxWidth * ratio : boxWidth + distX,
                newHeight = proportions ? boxHeight * ratio : boxHeight + distY;

            const scaleX = newWidth / boxWidth,
                scaleY = newHeight / boxHeight;

            return [scaleX, scaleY, newWidth, newHeight];
        };

        const getScaleMatrix = (scaleX, scaleY) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return multiplyMatrix(
                multiplyMatrix(translateMatrix, scaleMatrix),
                matrixInvert(translateMatrix)
            );
        };

        const getTranslateMatrix = (scM, ctm) => {
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
            pScaleX,
            pScaleY,
            pWidth,
            pHeight
        ] = getScale(dx, dy);

        const preScaleMatrix = getScaleMatrix(pScaleX, pScaleY);

        const preResultMatrix = scalable
            ? multiplyMatrix(preScaleMatrix, matrix)
            : getTranslateMatrix(preScaleMatrix, matrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preResultMatrix)
            : { x: null, y: null };

        const isBounding = (restX !== null || restY !== null) && restrict;

        const newDx = isBounding ? nextDx : dx;
        const newDy = isBounding ? nextDy : dy;

        const [
            scaleX,
            scaleY,
            newWidth,
            newHeight
        ] = getScale(newDx, newDy);

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

        this._updateElementView(
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
                dist: {
                    dx: newDx,
                    dy: newDy
                },
                bBox: {
                    width: pWidth,
                    height: pHeight
                }
            }
        });

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    _processMove(element, { dx, dy }) {
        const {
            storage: {
                data,
                center
            },
            options: {
                restrict
            }
        } = this;

        const elementStorage = data.get(element);

        const {
            transform: {
                matrix,
                auxiliary: {
                    translate: {
                        parentMatrix
                    }
                }
            },
            cached,
            cached: {
                dist: {
                    dx: nextDx = dx,
                    dy: nextDy = dy
                } = {}
            } = {}
        } = elementStorage;

        const [x, y] = multiplyMatrixAndPoint(
            parentMatrix,
            [dx, dy, 0, 1]
        );

        const preTranslateMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix)
            : { x: null, y: null };

        const newDx = restX !== null && restrict ? nextDx : dx,
            newDy = restY !== null && restrict ? nextDy : dy;

        const [nx, ny] = multiplyMatrixAndPoint(
            parentMatrix,
            [newDx, newDy, 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            matrix,
            createTranslateMatrix(nx, ny)
        );

        const elStyle = matrixToCSS(flatMatrix(moveElementMtrx));

        this._updateElementView(element, elStyle);

        data.set(element, {
            ...elementStorage,
            cached,
            dist: {
                dx: floatToFixed(newDx),
                dy: floatToFixed(newDy),
                ox: floatToFixed(nx),
                oy: floatToFixed(ny)
            }
        });

        if (center.isShifted) {
            // const centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));
            // const [cx, cy] = multiplyMatrixAndPoint(
            //     centerTransformMatrix,
            //     [nextDx, nextDy, 0, 1]
            // );

            // this._moveCenterHandle(-cx, -cy);
        }

        return moveElementMtrx;
    }

    _processRotate(element, radians) {
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
        } = data.get(element);

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

        const rotationMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix),
            translateMatrix
        );

        const resultMatrix = multiplyMatrix(matrix, transformMatrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(resultMatrix)
            : { x: null, y: null };

        if (isDef(restX) || isDef(restY)) return resultMatrix;

        this._updateElementView(
            element,
            matrixToCSS(flatMatrix(resultMatrix))
        );

        return resultMatrix;
    }

    _getElementState(element, { revX, revY, doW, doH }) {
        const {
            storage: {
                handles: {
                    center: cHandle
                },
                wrapper,
                data
            },
            options: {
                container,
                restrict,
                scalable
            }
        } = this;

        const storage = data.get(element);

        const {
            parent,
            center: oldCenter
        } = storage;

        const {
            offsetWidth,
            offsetHeight
        } = restrict || container;

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
        const wrapperMatrix = getCurrentTransformMatrix(wrapper, container);
        const containerMatrix = restrict
            ? getCurrentTransformMatrix(restrict, restrict.parentNode)
            : getCurrentTransformMatrix(container, container.parentNode);

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

        const {
            translate: {
                x: originX,
                y: originY
            }
        } = cHandle
            ? decompose(getCurrentTransformMatrix(cHandle))
            : { translate: { x: globalCenterX, y: globalCenterY } };

        // search distance between el's center and rotation handle
        const [distX, distY] = multiplyMatrixAndPoint(
            multiplyMatrix(
                matrixInvert(dropTranslate(ctm)),
                dropTranslate(originTransform)
            ),
            [
                originX - globalCenterX,
                originY - globalCenterY,
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

        const containerBox = multiplyMatrixAndPoint(
            dropTranslate(containerMatrix),
            [offsetWidth, offsetHeight, 0, 1]
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
            containerMatrix,
            wrapperMatrix,
            scX: sX,
            scY: sY,
            containerBox
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
            },
            center: {
                ...oldCenter,
                x: globalCenterX,
                y: globalCenterY,
                elX,
                elY,
                matrix: originTransform
            },
            revX,
            revY,
            doW,
            doH
        };
    }

    _getCommonState() {
        const {
            storage: {
                controls,
                handles: {
                    center: cHandle
                },
                center: oldCenter
            },
            options: {
                container,
                restrict
            }
        } = this;

        const [glLeft, glTop] = getAbsoluteOffset(controls, container);


        const boxCTM = getCurrentTransformMatrix(controls, container);

        // real element's center
        const [cenX, cenY] = multiplyMatrixAndPoint(
            boxCTM,
            [
                300,
                300,
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
                containerMatrix: restrict
                    ? getCurrentTransformMatrix(restrict, restrict.parentNode)
                    : getCurrentTransformMatrix(container, container.parentNode)
            },
            bBox: {
                ...this._getBBox()
            },
            center: {
                ...oldCenter,
                x: globalCenterX,
                y: globalCenterY,
                matrix: originTransform
            }
        };
    }

    _getBBox() {
        const {
            elements: [element],
            options: {
                isGrouped,
                container
            }
        } = this;

        if (isGrouped) {
            return this._getGroupBbox();
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

    _processControlsResize() {
        this._applyTransformToHandles({
            boxMatrix: createIdentityMatrix()
        });
    }

    _processControlsMove({ dx, dy }) {
        const {
            storage: {
                transform: {
                    controlsMatrix
                }
            }
        } = this;

        const moveControlsMtrx = multiplyMatrix(
            controlsMatrix,
            createTranslateMatrix(dx, dy)
        );

        const wrapperStyle = matrixToCSS(flatMatrix(moveControlsMtrx));

        this._updateControlsView(wrapperStyle);
    }

    _processControlsRotate() {
        this._applyTransformToHandles({
            boxMatrix: createIdentityMatrix()
        });
    }

    _moveCenterHandle(x, y) {
        const {
            storage: {
                handles: { center },
                center: { matrix }
            }
        } = this;

        const resultMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        helper(center).css({
            ...matrixToCSS(flatMatrix(resultMatrix))
        });

        this.storage.center.isShifted = true;
    }

    _updateElementView(element, css) {
        helper(element).css(css);
    }

    _updateControlsView(css) {
        helper(this.storage.controls).css(css);
    }

    _getVertices(transformMatrix = createIdentityMatrix()) {
        const {
            elements: [element] = [],
            options: {
                isGrouped,
                rotatable,
                rotatorAnchor,
                rotatorOffset
            }
        } = this;

        const finalVertices = isGrouped
            ? this._getGroupVertices()
            : this._getElementVertices(element, transformMatrix);

        let rotator = null;

        if (rotatable) {
            const anchor = {};
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
            finalVertices.anchor = anchor;
        }

        return finalVertices;
    }

    _getElementVertices(element, transformMatrix) {
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
            .reduce((nextVertices, [key, vertex]) => (
                [
                    ...nextVertices,
                    [key, multiplyMatrixAndPoint(nextTransform, vertex)]
                ]
            ), [])
            .reduce((vertices, [key, [x, y, z, w]]) => {
                vertices[key] = [
                    x + offsetLeft,
                    y + offsetTop,
                    z,
                    w
                ];
                return vertices;
            }, {});
    }

    _getGroupVertices() {
        const {
            x,
            y,
            width,
            height
        } = this._getGroupBbox();

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

    _getGroupBbox() {
        const {
            elements,
            options: {
                container
            }
        } = this;

        const vertices = elements.reduce((result, element) => {
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
                .reduce((nextVertices, vertex) => (
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
        ] = getMinMaxOfArray(vertices.reduce((res, item) => [...res, ...item], []));

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    _getElementBBox(element) {
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
            .reduce((nextVertices, vertex) => (
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

    _applyTransformToHandles({ boxMatrix = createIdentityMatrix() } = {}) {
        const {
            options: {
                rotatable,
                resizable,
                showNormal
            },
            storage: {
                handles,
                center: { isShifted },
                transform: {
                    controlsMatrix
                }
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
        } = this._getVertices(matrix);

        let normalLine = null;
        let rotationHandles = {};

        if (rotatable) {
            normalLine = showNormal
                ? [[anchor.x, anchor.y], finalVertices.rotator]
                : null;

            rotationHandles = {
                rotator: finalVertices.rotator
            };
        }

        const resizingEdges = {
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

            helper(handles[key]).css({
                transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
                width: `${length}px`
            });
        });

        const allHandles = {
            ...(resizable && finalVertices),
            ...rotationHandles,
            ...((!isShifted && Boolean(center)) && { center })
        };

        keys(allHandles).forEach(key => {
            const hdl = handles[key];
            const attr = allHandles[key];
            if (isUndef(attr) || isUndef(hdl)) return;

            const [x, y] = attr;
            helper(hdl).css({
                transform: `translate(${x}px, ${y}px)`
            });
        });
    }

    resetCenterPoint() {
        const {
            elements: [element] = [],
            el: {
                offsetHeight,
                offsetWidth
            },
            storage: {
                wrapper,
                handles: { center }
            },
            options: {
                container
            }
        } = this;

        if (!center) return;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);

        const matrix = multiplyMatrix(
            getCurrentTransformMatrix(element, container),
            matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode))
        );

        const [x, y] = multiplyMatrixAndPoint(
            matrix,
            [offsetWidth / 2, offsetHeight / 2, 0, 1]
        );

        helper(center).css(
            { transform: `translate(${x + offsetLeft}px, ${y + offsetTop}px)` }
        );
    }

    fitControlsToSize() {
        const identityMatrix = createIdentityMatrix();

        this.storage = {
            ...this.storage,
            transform: {
                ...(this.storage.transform || {}),
                controlsMatrix: identityMatrix
            }
        };

        this._updateControlsView(
            matrixToCSS(flatMatrix(identityMatrix))
        );
        this._applyTransformToHandles();
    }

    getBoundingRect(transformMatrix = null) {
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
                },
                cached: {
                    bBox: {
                        width: nextWidth = width,
                        height: nextHeight = height
                    } = {}
                } = {}
            }
        } = this;

        const nextBox = scalable
            ? bBox
            : {
                ...bBox,
                width: nextWidth,
                height: nextHeight
            };

        const restrictEl = restrict || container;

        return getBoundingRect(
            element,
            restrictEl,
            getCurrentTransformMatrix(element, restrictEl, transformMatrix),
            nextBox
        );
    }

    applyAlignment(direction) {
        const {
            options: { container }
        } = this;

        const {
            // eslint-disable-next-line no-unused-vars
            anchor, rotator, center,
            ...vertices
        } = this._calculateVertices();

        const restrictBBox = this._getRestrictedBBox(true);

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
                dropTranslate(getCurrentTransformMatrix(this.el.parentNode, container))
            ),
            [getXDir(), getYDir(), 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            getTransform(this.el),
            createTranslateMatrix(x, y)
        );

        this._updateElementView(
            matrixToCSS(flatMatrix(moveElementMtrx))
        );
        this.fitControlsToSize();
    }

}

const createHandler = ([x, y], key = 'handler', style = {}) => {
    const element = createElement(['sjx-hdl', `sjx-hdl-${key}`]);

    helper(element).css({
        transform: `translate(${x}px, ${y}px)`,
        ...style
    });
    return element;
};

const renderLine = ([pt1, pt2, thickness = 1], key) => {
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

const getLineAttrs = (pt1, pt2, thickness = 1) => {
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

const getBoundingRect = (element, container, ctm, bBox) => {
    const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
    const {
        width,
        height,
        offset: {
            left,
            top
        }
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
        .reduce((nextVerteces, vertex) => (
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

const createElement = (classNames = []) => {
    const element = document.createElement('div');
    classNames.forEach(className => addClass(element, className));
    return element;
};