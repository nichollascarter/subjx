import { helper } from '../../Helper';
import Transformable from '../Transformable';
import { isDef, isUndef, warn } from '../../util/util';
import { floatToFixed, getMinMaxOfArray, DEG } from '../common';
import { movePath, resizePath } from './path';

import {
    THEME_COLOR,
    EVENT_EMITTER_CONSTANTS,
    CLIENT_EVENTS_CONSTANTS
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

const { keys, entries, values } = Object;

export default class DraggableSVG extends Transformable {

    _init(elements) {
        const {
            options: {
                container,
                controlsContainer,
                resizable,
                rotatable,
                showNormal,
                transformOrigin,
                restrict
            }
        } = this;

        const wrapper = createSVGElement('g', ['sjx-svg-wrapper']);
        const controls = createSVGElement('g', ['sjx-svg-controls']);

        const {
            rotator = null,
            anchor = null,
            ...nextVertices
        } = this._getVertices();

        const handles = {};
        let rotationHandles = {};

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

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (transformOrigin) {
                radius = createSVGElement('line', ['sjx-hidden']);

                radius.x1.baseVal.value = nextVertices.center.x;
                radius.y1.baseVal.value = nextVertices.center.y;
                radius.x2.baseVal.value = nextTransformOrigin.x;
                radius.y2.baseVal.value = nextTransformOrigin.y;

                setLineStyle(radius, '#fe3232');
                radius.setAttribute('opacity', 0.5);

                controls.appendChild(radius);
            }

            rotationHandles = {
                ...rotationHandles,
                normal: normalLine,
                radius
            };
        }

        const resizingHandles = resizable ?
            {
                tl: nextVertices.tl,
                tr: nextVertices.tr,
                br: nextVertices.br,
                bl: nextVertices.bl,
                tc: nextVertices.tc,
                bc: nextVertices.bc,
                ml: nextVertices.ml,
                mr: nextVertices.mr
            }
            : {};

        const resizingEdges = {
            te: [nextVertices.tl, nextVertices.tr],
            be: [nextVertices.bl, nextVertices.br],
            le: [nextVertices.tl, nextVertices.bl],
            re: [nextVertices.tr, nextVertices.br]
        };

        keys(resizingEdges).forEach(key => {
            const data = resizingEdges[key];
            if (isUndef(data)) return;

            handles[key] = renderLine(
                data,
                THEME_COLOR,
                key
            );

            controls.appendChild(handles[key]);
        });

        const allHandles = {
            ...resizingHandles,
            rotator,
            center: transformOrigin && rotatable
                ? nextTransformOrigin
                : undefined
        };

        keys(allHandles).forEach(key => {
            const data = allHandles[key];
            if (isUndef(data)) return;

            const { x, y } = data;
            const color = key === 'center'
                ? '#fe3232'
                : THEME_COLOR;

            handles[key] = createHandler(
                x,
                y,
                color,
                key
            );

            controls.appendChild(handles[key]);
        });

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        const data = new WeakMap();

        elements.map(element => (
            data.set(element, {
                parent: element.parentNode,
                transform: {
                    ctm: getTransformToElement(element, container)
                },
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
            }
        };

        [...elements, controls].map(target => (
            helper(target)
                .on(E_MOUSEDOWN, this._onMouseDown)
                .on(E_TOUCHSTART, this._onTouchStart)
        ));
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;

        return this._applyMatrixToPoint(
            container.getScreenCTM().inverse(),
            clientX,
            clientY
        );
    }

    _getRestrictedBBox(force = false) {
        const {
            storage: {
                transform: {
                    containerMatrix
                } = {}
            } = {},
            options: {
                container,
                restrict
            } = {}
        } = this;

        const restrictEl = restrict || container;

        return getBoundingRect(
            restrictEl,
            force ? getTransformToElement(restrictEl, container) : containerMatrix
        );
    }

    _pointToTransform({ x, y, matrix }) {
        const nextMatrix = matrix.inverse();
        nextMatrix.e = nextMatrix.f = 0;

        return this._applyMatrixToPoint(
            nextMatrix,
            x,
            y
        );
    }

    _pointToControls({ x, y }, transform = this.storage.transform) {
        const { controlsMatrix } = transform;

        const matrix = controlsMatrix.inverse();
        matrix.e = matrix.f = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const pt = createSVGElement('svg').createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(matrix);
    }

    _applyTransformToElement(element, actionName) {
        const {
            storage: {
                data,
                bBox
            } = {},
            options: {
                isGrouped,
                scalable,
                applyTranslate: applyDragging
            } = {}
        } = this;

        const {
            cached = {},
            ...nextData
        } = data.get(element);

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
            } = {},
            transformMatrix
        } = cached;

        if (actionName === E_DRAG) {
            if (!applyDragging || (!dx && !dy)) return;

            const eM = createTranslateMatrix(ox, oy);

            const translateMatrix = eM
                .multiply(matrix)
                .multiply(eM.inverse());

            this._updateElementView(['transform', translateMatrix]);

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

        data.set(element, { ...nextData });
    }

    _processActions(actionName) {
        const {
            storage: {
                transform: {
                    controlsMatrix
                },
                center: {
                    isShifted
                } = {}
            },
            options: {
                isGrouped
            }
        } = this;

        if (isGrouped && actionName === E_ROTATE) {
            this._applyTransformToHandles();

            const { x: dx, y: dy } = pointTo(controlsMatrix, 0, 0);

            if (isShifted) this._moveCenterHandle(dx, dy);

            this._updateControlsView();

            if (!isShifted) this.setTransformOrigin({ dx: 0, dy: 0 }, false);
        }
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
            cached = {}
        } = elementData;

        const getScale = (distX, distY) => {
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

        const getScaleMatrix = (scaleX, scaleY) => {
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

        if (scalable) this._updateElementView(element, ['transform', resultMatrix]);

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

        this._applyTransformToElement(element, E_RESIZE);

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            transform: resultMatrix
        };
    }

    _processMove(element, { dx, dy }) {
        const {
            storage: {
                data
            }
        } = this;

        const elementStorage = data.get(element);

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

        this._updateElementView(element, ['transform', moveElementMtrx]);

        return moveElementMtrx;
    }

    _processRotate(element, radians) {
        const {
            storage: {
                data
            } = {}
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
        } = data.get(element);

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

        this._updateElementView(element, ['transform', resultMatrix]);

        return resultMatrix;
    }

    _getElementState(element, { revX, revY, doW, doH }) {
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

        const elementData = data.get(element);

        const { __data__ } = elementData;

        storeElementAttributes(element, elementData, container);
        __data__.delete(element);
        checkChildElements(element).forEach(child => {
            __data__.delete(child);
            storeElementAttributes(child, elementData, element, isGrouped);
        });

        const bBox = this._getBBox();

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

    _getCommonState() {
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

        const bBox = this._getBBox();

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

    _getVertices(transformMatrix = createSVGMatrix()) {
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

        const { x, y, width, height } = this._getBBox();

        const hW = width / 2,
            hH = height / 2;

        const vertices = {
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

        const nextTransform = isGrouped
            ? transformMatrix
            : transformMatrix.multiply(getTransformToElement(elements[0], container));

        const nextVertices = entries(vertices)
            .reduce((nextRes, [key, [x, y]]) => {
                nextRes[key] = pointTo(
                    nextTransform,
                    x,
                    y
                );
                return nextRes;
            }, {});

        if (rotatable) {
            const anchor = {};
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

    _getBBox() {
        const {
            elements,
            options: {
                container,
                isGrouped
            }
        } = this;

        if (isGrouped) {
            const groupBBox = elements.reduce((result, element) => {
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

    _moveCenterHandle(dx, dy) {
        const {
            storage: {
                handles: { center, radius },
                center: prevCenterData,
                transform: {
                    controlsMatrix = createSVGMatrix()
                } = {},
                transformOrigin: {
                    x: originX,
                    y: originY
                } = {},
                cached
            }
        } = this;

        if (isUndef(center)) return;

        const nextX = originX + dx,
            nextY = originY + dy;

        center.cx.baseVal.value = nextX;
        center.cy.baseVal.value = nextY;

        radius.x2.baseVal.value = nextX;
        radius.y2.baseVal.value = nextY;

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
    }

    _processMoveRestrict(element, { dx, dy }) {
        const {
            storage: {
                data
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
            }
        } = elementStorage;

        parentMatrix.e = parentMatrix.f = 0;
        const { x, y } = pointTo(
            parentMatrix,
            dx,
            dy
        );

        const preTranslateMatrix = createTranslateMatrix(x, y).multiply(matrix);

        return this._restrictHandler(element, preTranslateMatrix);
    }

    _processRotateRestrict(element, radians) {
        const {
            storage: {
                data
            } = {}
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
        } = data.get(element);

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

        return this._restrictHandler(element, resultMatrix);
    }

    _processResizeRestrict(element, { dx, dy }) {
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

        const elementData = data.get(element);

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

        const getScale = (distX, distY) => {
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

        const getScaleMatrix = (scaleX, scaleY) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const preScaledMatrix = matrix.multiply(
            getScaleMatrix(...getScale(dx, dy))
        );

        return this._restrictHandler(element, preScaledMatrix);
    }

    _processControlsResize() {
        const {
            storage: {
                transform: {
                    controlsMatrix
                }
            } = {}
        } = this;

        this._applyTransformToHandles({
            boxMatrix: controlsMatrix.inverse()
        });
    }

    _processControlsMove({ dx, dy }) {
        const {
            storage: {
                transform: {
                    controlsMatrix,
                    controlsTranslateMatrix
                },
                center
            } = {}
        } = this;

        controlsTranslateMatrix.e = dx;
        controlsTranslateMatrix.f = dy;

        const moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);

        this._updateControlsView(moveControlsMtrx);

        if (center.isShifted) {
            const centerTransformMatrix = controlsMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;
            const { x: cx, y: cy } = pointTo(
                centerTransformMatrix,
                dx,
                dy
            );

            this._moveCenterHandle(-cx, -cy);
        }
    }

    _processControlsRotate({ radians }) {
        const {
            storage: {
                transform: {
                    controlsMatrix,
                    wrapperOriginMatrix
                }
            } = {}
        } = this;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const rotateMatrix = createRotateMatrix(sin, cos);

        const wrapperResultMatrix = wrapperOriginMatrix
            .multiply(rotateMatrix)
            .multiply(wrapperOriginMatrix.inverse())
            .multiply(controlsMatrix);

        this._updateControlsView(wrapperResultMatrix);
    }

    _updateElementView(element, [attr, value]) {
        if (attr === 'transform') {
            element.setAttribute(attr, matrixToString(value));
        }
    }

    _updateControlsView(matrix = createSVGMatrix()) {
        this.storage.controls.setAttribute(
            'transform',
            matrixToString(matrix)
        );
    }

    _applyTransformToHandles({ boxMatrix = createSVGMatrix() } = {}) {
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
        } = this._getVertices(boxMatrix);

        const resEdges = {
            te: [nextVertices.tl, nextVertices.tr],
            be: [nextVertices.bl, nextVertices.br],
            le: [nextVertices.tl, nextVertices.bl],
            re: [nextVertices.tr, nextVertices.br]
        };

        if (rotatable) {
            const { normal, radius } = handles;

            if (isDef(normal)) {
                normal.x1.baseVal.value = anchor.x;
                normal.y1.baseVal.value = anchor.y;
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
            }).map(([attr, value]) => hdl.setAttribute(attr, value));
        });

        const handlesVertices = {
            ...nextVertices,
            ...((!isShifted && Boolean(center)) && { center })
        };

        return keys(handlesVertices).reduce((result, key) => {
            const hdl = handles[key];
            const attr = handlesVertices[key];

            result[key] = attr;

            if (isUndef(attr) || isUndef(hdl)) return result;

            hdl.setAttribute('cx', attr.x);
            hdl.setAttribute('cy', attr.y);

            return result;
        }, {});
    }

    setCenterPoint(...args) {
        warn('"setCenterPoint" method is replaced by "setTransformOrigin" and would be removed soon');
        this.setTransformOrigin(...args);
    }

    setTransformOrigin({ x, y, dx, dy } = {}, pin = true) {
        const {
            elements,
            storage,
            storage: {
                controls,
                handles: {
                    center: handle,
                    radius
                } = {},
                center
            } = {},
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

        let newX, newY;

        if (isRelative) {
            const { x: bx, y: by, width, height } = this._getBBox();

            const hW = width / 2,
                hH = height / 2;

            newX = bx + hW + dx;
            newY = by + hH + dy;
        } else {
            newX = x;
            newY = y;
        }

        const { x: nextX, y: nextY } = pointTo(
            nextTransform,
            newX,
            newY
        );

        handle.cx.baseVal.value = nextX;
        handle.cy.baseVal.value = nextY;

        radius.x2.baseVal.value = nextX;
        radius.y2.baseVal.value = nextY;

        center.isShifted = pin;
        storage.transformOrigin = pointTo(
            createSVGMatrix(),
            nextX,
            nextY
        );
    }

    fitControlsToSize() {
        const {
            storage = {}
        } = this;

        const identityMatrix = createSVGMatrix();

        this.storage = {
            ...storage,
            transform: {
                ...(storage.transform || {}),
                controlsMatrix: identityMatrix
            }
        };

        this._updateControlsView(identityMatrix);
        this._applyTransformToHandles({ boxMatrix: identityMatrix });
    }

    getBoundingRect(element, transformMatrix = null) {
        const {
            options: {
                restrict,
                container
            } = {}
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

    applyAlignment(direction) {
        const {
            elements,
            options: { container }
        } = this;

        const {
            // eslint-disable-next-line no-unused-vars
            anchor, rotator, center,
            ...vertices
        } = this._getVertices();

        const restrictBBox = this._getRestrictedBBox(true);

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

            this._updateElementView(element, ['transform', moveElementMtrx]);
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

        const { x, y, width, height } = this._getBBox();

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
            .reduce((nextRes, [key, [x, y]]) => {
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

const applyTranslate = (element, { x, y }) => {
    const attrs = [];

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const resX = isDef(element.x.baseVal[0])
                ? element.x.baseVal[0].value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(element.y.baseVal[0])
                ? element.y.baseVal[0].value + y
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
            const resX = isDef(element.x.baseVal.value)
                ? element.x.baseVal.value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(element.y.baseVal.value)
                ? element.y.baseVal.value + y
                : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(
                ['x', resX],
                ['y', resY]
            );
            break;
        }
        case 'circle':
        case 'ellipse': {
            const resX = element.cx.baseVal.value + x,
                resY = element.cy.baseVal.value + y;

            attrs.push(
                ['cx', resX],
                ['cy', resY]
            );
            break;
        }
        case 'line': {
            const resX1 = element.x1.baseVal.value + x,
                resY1 = element.y1.baseVal.value + y,
                resX2 = element.x2.baseVal.value + x,
                resY2 = element.y2.baseVal.value + y;

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
            const points = parsePoints(element.getAttribute('points'));
            const result = points.map(item => {
                item[0] = Number(item[0]) + x;
                item[1] = Number(item[1]) + y;

                return item.join(' ');
            }).join(' ');

            attrs.push(
                ['points', result]
            );
            break;
        }
        case 'path': {
            const path = element.getAttribute('d');

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

    attrs.forEach(item => {
        element.setAttribute(item[0], item[1]);
    });
};

const applyResize = (element, data) => {
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

    const attrs = [];

    const storedData = __data__.get(element);

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
                ['textLength', Math.abs(scaleX * textLength)]
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

            const result = parsePoints(points).map(item => {
                const {
                    x,
                    y
                } = pointTo(
                    localCTM,
                    Number(item[0]),
                    Number(item[1])
                );

                item[0] = floatToFixed(x);
                item[1] = floatToFixed(y);

                return item.join(' ');
            }).join(' ');

            attrs.push(['points', result]);
            break;
        }
        case 'path': {
            const { path } = storedData;

            attrs.push(['d', resizePath({ path, localCTM })]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};

const createHandler = (left, top, color, key) => {
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
        handler.setAttribute(attr, value)
    ));

    return handler;
};

const setLineStyle = (line, color) => {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
};

const storeElementAttributes = (element, storage, container, isGrouped) => {
    let data = null;

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const x = isDef(element.x.baseVal[0])
                ? element.x.baseVal[0].value
                : (Number(element.getAttribute('x')) || 0);
            const y = isDef(element.y.baseVal[0])
                ? element.y.baseVal[0].value
                : (Number(element.getAttribute('y')) || 0);
            const textLength = isDef(element.textLength.baseVal)
                ? element.textLength.baseVal.value
                : (Number(element.getAttribute('textLength')) || null);

            data = { x, y, textLength };
            break;
        }
        case 'circle': {
            const r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;

            data = { r, cx, cy };
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            const width = element.width.baseVal.value,
                height = element.height.baseVal.value,
                x = element.x.baseVal.value,
                y = element.y.baseVal.value;

            data = { width, height, x, y };
            break;
        }
        case 'ellipse': {
            const rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;

            data = { rx, ry, cx, cy };
            break;
        }
        case 'line': {
            const resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;

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

const renderLine = ([b, e], color, key) => {
    const handler = createSVGElement(
        'line',
        ['sjx-svg-line', `sjx-svg-line-${key}`]
    );

    const attrs = {
        x1: b.x,
        y1: b.y,
        x2: e.x,
        y2: e.y,
        stroke: color,
        'stroke-width': 1,
        'vector-effect': 'non-scaling-stroke'
    };

    entries(attrs).forEach(([attr, value]) => (
        handler.setAttribute(attr, value)
    ));

    return handler;
};

const getBoundingRect = (element, ctm, bBox = element.getBBox()) => {
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