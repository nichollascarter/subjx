import { helper } from '../../Helper';
import Transformable from '../Transformable';
import { isDef, isUndef, isFunc } from '../../util/util';
import { floatToFixed, getMinMaxOfArray } from '../common';
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
    isGroup,
    parsePoints,
    getTransformToElement,
    matrixToString,
    pointTo,
    isIdentity
} from './util';

const { E_DRAG, E_RESIZE } = EVENT_EMITTER_CONSTANTS;
const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;

const { keys, entries, values } = Object;

export default class DraggableSVG extends Transformable {

    _init(el) {
        const {
            rotationPoint,
            container,
            controlsContainer,
            resizable,
            rotatable,
            showNormal,
            custom
        } = this.options;

        const elBBox = el.getBBox();

        const wrapper = createSVGElement('g', ['sjx-svg-wrapper']);
        const controls = createSVGElement('g', ['sjx-svg-controls']);

        const originRotation = [
            'data-sjx-cx',
            'data-sjx-cy'
        ].map(attr => {
            const val = el.getAttribute(attr);
            return isDef(val) ? Number(val) : undefined;
        });

        const hasOrigin = originRotation.every(val => !isNaN(val));

        const elCTM = getTransformToElement(el, container);

        const {
            rotator = null,
            anchor = null,
            ...nextVertices
        } = this._calculateVertices(elCTM);

        const handles = {};
        let rotationHandles = {};

        if (rotatable) {
            const normalLine = showNormal
                ? renderLine([anchor, rotator], THEME_COLOR, 'normal')
                : null;

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (rotationPoint) {
                radius = createSVGElement('line', ['sjx-hidden']);

                radius.x1.baseVal.value = nextVertices.center.x;
                radius.y1.baseVal.value = nextVertices.center.y;
                radius.x2.baseVal.value = originRotation[0] || nextVertices.center.x;
                radius.y2.baseVal.value = originRotation[1] || nextVertices.center.y;

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

        const nextCenter = hasOrigin
            ? pointTo(
                createSVGMatrix(),
                originRotation[0],
                originRotation[1]
            )
            : nextVertices.center;

        const allHandles = {
            ...resizingHandles,
            rotator,
            center: rotationPoint && rotatable
                ? nextCenter
                : undefined
        };

        keys(allHandles).forEach(key => {
            const data = allHandles[key];
            if (isUndef(data)) return;

            const { x, y } = data;
            const color = key === 'center'
                ? '#fe3232'
                : THEME_COLOR;

            if (isDef(custom) && isFunc(custom[key])) {
                handles[key] = custom[key](elCTM, elBBox, pointTo);
            } else {
                handles[key] = createHandler(
                    x,
                    y,
                    color,
                    key
                );
            }

            controls.appendChild(handles[key]);
        });

        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);

        this.storage = {
            wrapper,
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            parent: el.parentNode,
            center: {
                isShifted: hasOrigin
            },
            transform: {
                ctm: elCTM
            },
            bBox: elBBox,
            cached: {},
            __data__: new WeakMap()
        };

        [el, controls].map(target => (
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

    _pointToElement({ x, y }) {
        const { transform: { ctm } } = this.storage;

        const matrix = ctm.inverse();
        matrix.e = matrix.f = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _pointToControls({ x, y }) {
        const { transform: { wrapperMatrix } } = this.storage;

        const matrix = wrapperMatrix.inverse();
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

    _apply(actionName) {
        const {
            el: element,
            storage: {
                bBox,
                cached,
                transform,
                center,
                __data__
            },
            options: {
                container,
                scalable,
                applyTranslate: applyDragging
            }
        } = this;

        const {
            matrix,
            parentMatrix,
            ctm
        } = transform;

        element.setAttribute('data-sjx-cx', center.elX);
        element.setAttribute('data-sjx-cy', center.elY);

        if (isUndef(cached)) return;

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

            if (isGroup(element)) {
                const els = checkChildElements(element);

                els.forEach(child => {
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

                    if (!isGroup(child)) {
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
                if (isGroup(element)) {
                    const els = checkChildElements(element);

                    els.forEach(child => {
                        if (!isGroup(child)) {
                            const childCTM = getTransformToElement(child, element);
                            const localCTM = childCTM.inverse()
                                .multiply(transformMatrix)
                                .multiply(childCTM);

                            applyResize(child, {
                                scaleX,
                                scaleY,
                                localCTM,
                                bBox,
                                __data__
                            });
                        }
                    });
                } else {
                    const containerCTM = container.getScreenCTM() || createSVGMatrix();
                    const elementMatrix = element.getScreenCTM().multiply(transformMatrix);

                    const resultCTM = containerCTM.inverse().multiply(elementMatrix);

                    const localCTM = ctm.inverse().multiply(resultCTM);

                    applyResize(element, {
                        scaleX,
                        scaleY,
                        localCTM,
                        bBox,
                        __data__
                    });
                }
            }

            this._applyTransformToHandles({
                boxMatrix: scalable
                    ? ctm.multiply(transformMatrix)
                    : ctm
            });
        }
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            storage: {
                bBox: {
                    width: boxWidth,
                    height: boxHeight
                },
                revX,
                revY,
                doW,
                doH,
                transform: {
                    matrix,
                    auxiliary: {
                        scale: {
                            translateMatrix
                        }
                    }
                },
                cached: {
                    dist: {
                        dx: nextDx = dx,
                        dy: nextDy = dy
                    } = {}
                } = {}
            },
            options: {
                proportions,
                scalable,
                restrict
            }
        } = this;

        const { x, y } = el.getBBox();

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

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const preScaledMatrix = matrix.multiply(
            getScaleMatrix(...getScale(dx, dy))
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preScaledMatrix)
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
        const resultMatrix = matrix.multiply(scaleMatrix);

        const deltaW = newWidth - boxWidth,
            deltaH = newHeight - boxHeight;

        const newX = x - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = y - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        if (scalable) {
            this._updateElementView(['transform', resultMatrix]);
        }

        storage.cached = {
            ...storage.cached,
            scaleX,
            scaleY,
            transformMatrix: scaleMatrix,
            resultMatrix,
            dist: {
                dx: newDx,
                dy: newDy
            }
        };

        this._apply(E_RESIZE);

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            transform: resultMatrix
        };
    }

    _processMove(dx, dy) {
        const {
            storage,
            storage: {
                center,
                transform: {
                    matrix,
                    auxiliary: {
                        translate: {
                            translateMatrix,
                            wrapperTranslateMatrix,
                            parentMatrix
                        }
                    },
                    wrapperMatrix
                },
                cached: {
                    dist: {
                        dx: nextDx = dx,
                        dy: nextDy = dy
                    } = {}
                } = {}
            },
            options: {
                restrict
            }
        } = this;

        parentMatrix.e = parentMatrix.f = 0;
        const { x, y } = pointTo(
            parentMatrix,
            dx,
            dy
        );

        const preTranslateMatrix = createTranslateMatrix(x, y).multiply(matrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix)
            : { x: null, y: null };

        const newDx = restX !== null && restrict ? nextDx : dx;
        const newDy = restY !== null && restrict ? nextDy : dy;

        const { x: nx, y: ny } = pointTo(
            parentMatrix,
            newDx,
            newDy
        );

        storage.cached.dist = {
            dx: floatToFixed(newDx),
            dy: floatToFixed(newDy),
            ox: floatToFixed(nx),
            oy: floatToFixed(ny)
        };

        translateMatrix.e = nx;
        translateMatrix.f = ny;

        const moveElementMtrx = translateMatrix.multiply(matrix);

        wrapperTranslateMatrix.e = newDx;
        wrapperTranslateMatrix.f = newDy;

        const moveWrapperMtrx = wrapperTranslateMatrix.multiply(wrapperMatrix);

        this._updateWrapperView(moveWrapperMtrx);
        this._updateElementView(['transform', moveElementMtrx]);

        if (center.isShifted) {
            const centerTransformMatrix = wrapperMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;
            const { x: cx, y: cy } = pointTo(
                centerTransformMatrix,
                newDx,
                newDy
            );

            this._moveCenterHandle(-cx, -cy);
        }

        return moveElementMtrx;
    }

    _processRotate(radians) {
        const {
            storage: {
                transform: {
                    matrix,
                    wrapperMatrix,
                    parentMatrix,
                    auxiliary: {
                        rotate: {
                            translateMatrix,
                            wrapperTranslateMatrix
                        }
                    }
                }
            },
            options: {
                restrict
            }
        } = this;

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

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(resultMatrix)
            : { x: null, y: null };

        if (isDef(restX) || isDef(restY)) return resultMatrix;

        const wrapperResultMatrix = wrapperTranslateMatrix
            .multiply(rotateMatrix)
            .multiply(wrapperTranslateMatrix.inverse())
            .multiply(wrapperMatrix);

        this._updateWrapperView(wrapperResultMatrix);
        this._updateElementView(['transform', resultMatrix]);

        return resultMatrix;
    }

    _getState({ revX, revY, doW, doH }) {
        const {
            el: element,
            storage: {
                wrapper,
                parent,
                handles: {
                    center: cHandle
                },
                __data__
            },
            options: {
                container,
                restrict
            }
        } = this;

        const eBBox = element.getBBox();

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = eBBox;

        const elMatrix = getTransformToElement(element, parent),
            ctm = getTransformToElement(element, container),
            boxCTM = getTransformToElement(wrapper, container),
            parentMatrix = getTransformToElement(parent, container),
            wrapperMatrix = getTransformToElement(wrapper, wrapper.parentNode);

        const parentMatrixInverted = parentMatrix.inverse();

        const scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);

        const elCenterX = elX + elW / 2,
            elCenterY = elY + elH / 2;

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

        // element's center coordinates
        const { x: elcx, y: elcy } = cHandle
            ? pointTo(
                parentMatrixInverted,
                bcx,
                bcy
            )
            : pointTo(
                elMatrix,
                elCenterX,
                elCenterY
            );

        // box's center coordinates
        const { x: rcx, y: rcy } = pointTo(
            ctm,
            elCenterX,
            elCenterY
        );

        storeElementAttributes(this.el, this.storage);
        __data__.delete(element);
        checkChildElements(element).forEach(child => {
            __data__.delete(child);
            storeElementAttributes(child, this.storage);
        });

        const center = {
            ...(this.storage.center || {}),
            x: cHandle ? bcx : rcx,
            y: cHandle ? bcy : rcy,
            elX: elcx,
            elY: elcy,
            hx: cHandle ? cHandle.cx.baseVal.value : null,
            hy: cHandle ? cHandle.cy.baseVal.value : null
        };

        const containerMatrix = restrict
            ? getTransformToElement(restrict, restrict.parentNode)
            : getTransformToElement(container, container.parentNode);

        const transform = {
            auxiliary: {
                scale: {
                    scaleMatrix: createSVGMatrix(),
                    translateMatrix: createTranslateMatrix(scaleX, scaleY)
                },
                translate: {
                    parentMatrix: parentMatrixInverted,
                    translateMatrix: createSVGMatrix(),
                    wrapperTranslateMatrix: createSVGMatrix()
                },
                rotate: {
                    translateMatrix: createTranslateMatrix(center.elX, center.elY),
                    wrapperTranslateMatrix: createTranslateMatrix(center.x, center.y)
                }
            },
            matrix: elMatrix,
            ctm,
            parentMatrix,
            wrapperMatrix,
            containerMatrix,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
        };

        return {
            transform,
            bBox: eBBox,
            center,
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(dx, dy) {
        const {
            handles: { center, radius },
            center: { hx, hy }
        } = this.storage;

        if (isUndef(center)) return;

        const mx = hx + dx,
            my = hy + dy;

        center.cx.baseVal.value = mx;
        center.cy.baseVal.value = my;

        radius.x2.baseVal.value = mx;
        radius.y2.baseVal.value = my;
        this.storage.center.isShifted = true;
    }

    _updateElementView([attr, value]) {
        if (attr === 'transform') {
            this.el.setAttribute(attr, matrixToString(value));
        }
    }

    _updateWrapperView(matrix) {
        this.storage.wrapper.setAttribute(
            'transform',
            matrixToString(matrix)
        );
    }

    _calculateVertices(transform) {
        const {
            el: element,
            options: {
                rotatable,
                rotatorAnchor,
                rotatorOffset,
                container
            }
        } = this;

        const { x, y, width, height } = element.getBBox();

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

        const nextVertices = entries(vertices)
            .reduce((nextRes, [key, [x, y]]) => {
                nextRes[key] = pointTo(
                    transform || getTransformToElement(element, container),
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

    _applyTransformToHandles({ boxMatrix }) {
        const { el: element } = this;
        const { rotatable } = this.options;

        const {
            wrapper,
            handles,
            center: { isShifted },
            transform: {
                wrapperMatrix = getTransformToElement(wrapper, wrapper.parentNode)
            } = {}
        } = this.storage;

        const {
            x,
            y,
            width,
            height
        } = element.getBBox();

        const hW = width / 2,
            hH = height / 2;

        const resultTransform = wrapperMatrix.inverse().multiply(boxMatrix);

        const boxCenter = pointTo(resultTransform, x + hW, y + hH);

        const {
            anchor = null,
            center,
            ...nextVertices
        } = this._calculateVertices(resultTransform);

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
                radius.x1.baseVal.value = boxCenter.x;
                radius.y1.baseVal.value = boxCenter.y;
                if (!isShifted) {
                    radius.x2.baseVal.value = boxCenter.x;
                    radius.y2.baseVal.value = boxCenter.y;
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

        keys(handlesVertices).forEach(key => {
            const hdl = handles[key];
            const attr = handlesVertices[key];
            if (isUndef(attr) || isUndef(hdl)) return;

            hdl.setAttribute('cx', attr.x);
            hdl.setAttribute('cy', attr.y);
        });
    }

    resetCenterPoint() {
        const {
            el,
            storage: {
                bBox: {
                    width: boxWidth,
                    height: boxHeight,
                    x: boxLeft,
                    y: boxTop
                },
                handles: {
                    center,
                    radius
                }
            }
        } = this;

        if (!center) return;

        const matrix = getTransformToElement(el, el.parentNode);

        const { x: cx, y: cy } = pointTo(
            matrix,
            boxLeft + boxWidth / 2,
            boxTop + boxHeight / 2
        );

        center.cx.baseVal.value = cx;
        center.cy.baseVal.value = cy;
        center.isShifted = false;

        radius.x2.baseVal.value = cx;
        radius.y2.baseVal.value = cy;
    }

    fitControlsToSize() {
        const {
            el,
            options: { container }
        } = this;

        const elCTM = getTransformToElement(el, container);

        const identityMatrix = createSVGMatrix();

        this.storage = {
            ...this.storage,
            transform: {
                ...(this.storage.transform || {}),
                wrapperMatrix: identityMatrix
            }
        };

        this._updateWrapperView(identityMatrix);
        this._applyTransformToHandles({ boxMatrix: elCTM });
    }

    getBoundingRect(transformMatrix = null) {
        const {
            el,
            options: {
                restrict,
                container
            },
            storage: {
                bBox
            }
        } = this;

        const restrictEl = restrict || container;

        const nextTransform = transformMatrix
            ? getTransformToElement(el.parentNode, restrictEl).multiply(transformMatrix)
            : getTransformToElement(el, restrictEl);

        return getBoundingRect(
            el,
            nextTransform,
            bBox
        );
    }

    applyAlignment(direction) {
        const { options: { container } } = this;

        const {
            // eslint-disable-next-line no-unused-vars
            anchor, rotator, center,
            ...vertices
        } = this._calculateVertices();

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
            switch(true) {

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
            switch(true) {

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

        const parentMatrix = getTransformToElement(this.el.parentNode, container);
        parentMatrix.e = parentMatrix.f = 0;

        const { x, y } = pointTo(
            parentMatrix.inverse(),
            getXDir(),
            getYDir()
        );

        const moveElementMtrx = createTranslateMatrix(x, y).multiply(
            getTransformToElement(this.el, this.el.parentNode)
        );

        this._updateElementView(['transform', moveElementMtrx]);
        this.fitControlsToSize();
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
        __data__
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

const storeElementAttributes = (element, storage) => {
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

    storage.__data__.set(element, data);
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

const getBoundingRect = (el, ctm, bBox = el.getBBox()) => {
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