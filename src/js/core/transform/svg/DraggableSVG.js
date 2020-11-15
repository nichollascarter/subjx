import { helper } from '../../Helper';
import Transformable from '../Transformable';
import { isDef, isUndef, isFunc } from '../../util/util';
import { floatToFixed } from '../common';
import { movePath, resizePath } from './path';
import { addClass } from '../../util/css-util';
import { MIN_SIZE, THEME_COLOR } from '../../consts';

import {
    checkChildElements,
    createSVGElement,
    createSVGMatrix,
    createPoint,
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

export default class DraggableSVG extends Transformable {

    _init(el) {
        const {
            rotationPoint,
            container,
            resizable,
            rotatable,
            rotatorAnchor,
            rotatorOffset,
            showNormal,
            custom
        } = this.options;

        const elBBox = el.getBBox();

        const {
            x: bX,
            y: bY,
            width: bW,
            height: bH
        } = elBBox;

        const wrapper = createSVGElement('g');
        addClass(wrapper, 'sjx-svg-wrapper');

        container.appendChild(wrapper);

        const elCTM = getTransformToElement(el, container);

        const controls = createSVGElement('g');
        addClass(controls, 'sjx-svg-controls');

        wrapper.appendChild(controls);

        const centerX = el.getAttribute('data-sjx-cx'),
            centerY = el.getAttribute('data-sjx-cy');

        const vertices = {
            tl: [bX, bY],
            tr: [bX + bW, bY],
            mr: [bX + bW, bY + bH / 2],
            ml: [bX, bY + bH / 2],
            tc: [bX + bW / 2, bY],
            bc: [bX + bW / 2, bY + bH],
            br: [bX + bW, bY + bH],
            bl: [bX, bY + bH],
            center: [bX + bW / 2, bY + bH / 2]
        };

        const nextVertices = Object.entries(vertices)
            .reduce((nextRes, [key, vertex]) => {
                nextRes[key] = pointTo(elCTM, vertex[0], vertex[1]);
                return nextRes;
            }, {});

        const handles = {};
        let rotationHandles = {},
            rotator = null;

        if (rotatable) {
            const anchor = {};
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n':
                    anchor.x = nextVertices.tc.x;
                    anchor.y = nextVertices.tc.y;
                    break;
                case 's':
                    anchor.x = nextVertices.bc.x;
                    anchor.y = nextVertices.bc.y;
                    factor = -1;
                    break;
                case 'w':
                    anchor.x = nextVertices.ml.x;
                    anchor.y = nextVertices.ml.y;
                    factor = -1;
                    break;
                case 'e':
                default:
                    anchor.x = nextVertices.mr.x;
                    anchor.y = nextVertices.mr.y;
                    break;

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

            rotator = {
                x: anchor.x - (rotatorOffset * factor) * Math.cos(theta),
                y: anchor.y - (rotatorOffset * factor) * Math.sin(theta)
            };

            const normalLine = showNormal
                ? renderLine([anchor, rotator], THEME_COLOR, 'norm')
                : null;

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (rotationPoint) {
                radius = createSVGElement('line');

                addClass(radius, 'sjx-hidden');

                radius.x1.baseVal.value = nextVertices.center.x;
                radius.y1.baseVal.value = nextVertices.center.y;
                radius.x2.baseVal.value = centerX || nextVertices.center.x;
                radius.y2.baseVal.value = centerY || nextVertices.center.y;

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
                ...nextVertices,
                rotator
            }
            : {};

        const resizingEdges = {
            te: [resizingHandles.tl, resizingHandles.tr],
            be: [resizingHandles.bl, resizingHandles.br],
            le: [resizingHandles.tl, resizingHandles.bl],
            re: [resizingHandles.tr, resizingHandles.br]
        };

        Object.keys(resizingEdges).forEach(key => {
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
            center: rotationPoint && rotatable
                ? createPoint(centerX, centerY) || nextVertices.center
                : undefined
        };

        Object.keys(allHandles).forEach(key => {
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

        this.storage = {
            wrapper,
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            parent: el.parentNode,
            center: {
                isShifted: false
            }
        };

        [el, controls].map(target => (
            helper(target)
                .on('mousedown', this._onMouseDown)
                .on('touchstart', this._onTouchStart)
        ));
    }

    _destroy() {
        const {
            el,
            storage: {
                controls,
                wrapper
            }
        } = this;

        [el, controls].map(target => (
            helper(target)
                .off('mousedown', this._onMouseDown)
                .off('touchstart', this._onTouchStart)
        ));

        wrapper.parentNode.removeChild(wrapper);
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;

        return this._applyMatrixToPoint(
            container.getScreenCTM().inverse(),
            clientX,
            clientY
        );
    }

    _restrictHandler(matrix) {
        const {
            storage: {
                transform: {
                    containerBox: {
                        width,
                        height
                    }
                }
            }
        } = this;

        let restrictX = null,
            restrictY = null;

        for (const point of this.getBoundingRect(matrix)) {
            const { x, y } = point;
            if (x < 0 || x > width) {
                restrictX = x || width;
            }
            if (y < 0 || y > height) {
                restrictY = y || height;
            }
        }

        return {
            x: restrictX,
            y: restrictY
        };
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
            storage,
            storage: {
                box,
                handles,
                cached,
                transform
            },
            options,
            options: {
                container,
                scalable,
                applyTranslate: applyDragging
            }
        } = this;

        const {
            matrix,
            bBox,
            ctm
        } = transform;

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = element.getBBox();

        const { x: centerX, y: centerY } = isDef(handles.center)
            ? pointTo(
                matrix,
                handles.center.cx.baseVal.value,
                handles.center.cy.baseVal.value
            )
            : pointTo(
                matrix,
                elX + elW / 2,
                elY + elH / 2
            );

        element.setAttribute('data-sjx-cx', centerX);
        element.setAttribute('data-sjx-cy', centerY);

        if (isUndef(cached)) return;

        const {
            scaleX,
            scaleY,
            dx,
            dy,
            ox,
            oy
        } = cached;

        if (actionName === 'drag') {
            if (!applyDragging || (dx === 0 && dy === 0)) return;

            const eM = createSVGMatrix();

            eM.e = dx;
            eM.f = dy;

            const translateMatrix = eM.multiply(matrix)
                .multiply(eM.inverse());

            element.setAttribute(
                'transform',
                matrixToString(translateMatrix)
            );

            if (isGroup(element)) {
                const els = checkChildElements(element);

                els.forEach(child => {
                    const pt = container.createSVGPoint();
                    const ctm = getTransformToElement(element.parentNode, container).inverse();
                    pt.x = ox;
                    pt.y = oy;
                    ctm.e = ctm.f = 0;
                    const newPT = pt.matrixTransform(ctm);

                    const eM = createSVGMatrix();

                    eM.e = dx;
                    eM.f = dy;

                    const translateMatrix = eM.multiply(
                        getTransformToElement(child, child.parentNode)
                    ).multiply(eM.inverse());

                    if (!isIdentity(translateMatrix)) {
                        child.setAttribute(
                            'transform',
                            matrixToString(translateMatrix)
                        );
                    }

                    if (!isGroup(child)) {
                        applyTranslate(child, {
                            x: newPT.x,
                            y: newPT.y
                        });
                    }
                });
            } else {
                applyTranslate(element, {
                    x: dx,
                    y: dy
                });
            }
        }

        if (actionName === 'resize') {
            if (!scalable) {
                if (isGroup(element)) {
                    const els = checkChildElements(element);

                    els.forEach(child => {
                        if (!isGroup(child)) {
                            applyResize(child, {
                                scaleX,
                                scaleY,
                                defaultCTM: child.__ctm__,
                                box,
                                bBox,
                                container,
                                storage,
                                cached
                            });
                        }
                    });
                } else {
                    applyResize(element, {
                        scaleX,
                        scaleY,
                        defaultCTM: ctm,
                        box,
                        bBox: bBox,
                        container,
                        storage,
                        cached
                    });
                }

                // element.setAttribute(
                //     'transform',
                //     matrixToString(matrix)
                // );
            }

            applyTransformToHandles(
                storage,
                options,
                {
                    boxMatrix: scalable
                        ? ctm.multiply(cached.transformMatrix)
                        : ctm,
                    element
                }
            );
        }

        //this.storage.cached = null;
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            storage: {
                boxWidth,
                boxHeight,
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

            return [scaleX, scaleY];
        };

        const getScaleMatrix = (scaleX, scaleY) => {
            const scaleMatrix = createScaleMatrix(
                scaleX,
                scaleY
            );

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const ratio = doW || (!doW && !doH)
            ? (boxWidth + dx) / boxWidth
            : (boxHeight + dy) / boxHeight;

        const newWidth = proportions ? boxWidth * ratio : boxWidth + dx;
        const newHeight = proportions ? boxHeight * ratio : boxHeight + dy;

        if (Math.abs(newWidth) <= MIN_SIZE || Math.abs(newHeight) <= MIN_SIZE) return;

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(getScaleMatrix(...getScale(dx, dy)))
            : { x: null, y: null };

        storage.cached.dist = {
            dx: restX !== null && restrict ? nextDx : dx,
            dy: restY !== null && restrict ? nextDy : dy
        };

        const [scaleX, scaleY] = getScale(nextDx, nextDy);

        const scaleMatrix = getScaleMatrix(scaleX, scaleY);
        const resultMatrix = matrix.multiply(scaleMatrix);

        const deltaW = newWidth - boxWidth,
            deltaH = newHeight - boxHeight;

        const newX = x - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = y - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        if (scalable) {
            el.setAttribute(
                'transform',
                matrixToString(resultMatrix)
            );
        }

        this.storage.cached = {
            ...this.storage.cached,
            scaleX,
            scaleY,
            transformMatrix: scaleMatrix,
            resultMatrix
        };

        this._apply('resize');

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
                wrapper,
                center,
                transform: {
                    matrix,
                    auxiliary: {
                        translate: {
                            translateMatrix,
                            wrapperTranslateMatrix
                        }
                    },
                    wrapperMatrix,
                    parentMatrix
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
            parentMatrix.inverse(),
            dx,
            dy
        );

        const preTranslateMatrix = createTranslateMatrix(x, y);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix.multiply(matrix))
            : { x: null, y: null };

        storage.cached.dist = {
            dx: restX !== null && restrict ? nextDx : dx,
            dy: restY !== null && restrict ? nextDy : dy
        };

        const { x: nx, y: ny } = pointTo(
            parentMatrix.inverse(),
            nextDx,
            nextDy
        );

        translateMatrix.e = nx;
        translateMatrix.f = ny;

        const moveElementMtrx = translateMatrix.multiply(matrix);

        wrapperTranslateMatrix.e = nextDx;
        wrapperTranslateMatrix.f = nextDy;

        const moveWrapperMtrx = wrapperTranslateMatrix.multiply(wrapperMatrix);

        wrapper.setAttribute(
            'transform',
            matrixToString(moveWrapperMtrx)
        );

        this.el.setAttribute(
            'transform',
            matrixToString(moveElementMtrx)
        );

        // this.storage.cached = {
        //     dx: dx,
        //     dy: dy,
        //     ox: x,
        //     oy: y
        // };

        if (center.isShifted) {
            const radiusMatrix = wrapperMatrix.inverse();
            radiusMatrix.e = radiusMatrix.f = 0;
            const { x: nx, y: ny } = pointTo(
                radiusMatrix,
                dx,
                dy
            );

            this._moveCenterHandle(-nx, -ny);
        }

        return moveElementMtrx;
    }

    _processRotate(radians) {
        const {
            storage: {
                wrapper,
                transform: {
                    matrix,
                    wrapperMatrix,
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

        const resRotateMatrix = translateMatrix
            .multiply(rotateMatrix)
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

        wrapper.setAttribute(
            'transform',
            matrixToString(wrapperResultMatrix)
        );

        this.el.setAttribute(
            'transform',
            matrixToString(resultMatrix)
        );

        return resultMatrix;
    }

    _getState({ revX, revY, doW, doH }) {
        const {
            el: element,
            storage,
            options: { container }
        } = this;

        const {
            wrapper,
            parent,
            handles: { center: cHandle }
        } = storage;

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
        const { x: elcx, y: elcy } = isDef(cHandle)
            ? pointTo(
                parentMatrix.inverse(),
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

        storeElementAttributes(this.el);
        checkChildElements(element).forEach(child => {
            child.__ctm__ = getTransformToElement(child, container);
            storeElementAttributes(child);
        });

        const center = {
            x: cHandle ? bcx : rcx,
            y: cHandle ? bcy : rcy,
            elX: elcx,
            elY: elcy,
            hx: cHandle ? cHandle.cx.baseVal.value : null,
            hy: cHandle ? cHandle.cy.baseVal.value : null,
            isShifted: (floatToFixed(elcx, 3) !== floatToFixed(bcx, 3)) &&
                (floatToFixed(elcy, 3) !== floatToFixed(bcy, 3))
        };

        const transform = {
            auxiliary: {
                scale: {
                    scaleMatrix: createSVGMatrix(),
                    translateMatrix: createTranslateMatrix(scaleX, scaleY)
                },
                translate: {
                    parentMatrix: parentMatrix.inverse(),
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
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
            bBox: eBBox,
            containerBox: container.getBBox()
        };

        return {
            transform,
            boxWidth: elW,
            boxHeight: elH,
            left: elX,
            top: elY,
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
    }

    resetCenterPoint() {
        const {
            box,
            handles: { center, radius }
        } = this.storage;

        if (!center) return;

        const {
            width: boxWidth,
            height: boxHeight,
            x: boxLeft,
            y: boxTop
        } = box.getBBox();

        const matrix = getTransformToElement(box, box.parentNode);

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
            storage: { wrapper },
            options: { container }
        } = this;

        const { width, height, x, y } = el.getBBox();

        const containerMatrix = getTransformToElement(
            el,
            container
        );

        wrapper.removeAttribute('transform');

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                x,
                y,
                width,
                height,
                boxMatrix: containerMatrix,
                element: el
            }
        );
    }

    getBoundingRect(transformMatrix) {
        const {
            el,
            options: {
                container
            },
            storage: {
                parent,
                transform: {
                    parentMatrix = getTransformToElement(parent, container)
                } = {}
            }
        } = this;

        return getBoundingRect(
            el,
            transformMatrix
                ? transformMatrix.multiply(parentMatrix)
                : getTransformToElement(el, container)
        );
    }

    get controls() {
        return this.storage.wrapper;
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
        bBox,
        defaultCTM,
        container,
        cached
    } = data;

    const {
        width: boxW,
        height: boxH
    } = bBox;

    const attrs = [];
    const containerCTM = container.getScreenCTM() || createSVGMatrix();
    const elementMatrix = element.getScreenCTM().multiply(cached.transformMatrix);

    const resultCTM = containerCTM.inverse().multiply(elementMatrix);
    const localCTM = defaultCTM.inverse().multiply(resultCTM);

    switch (element.tagName.toLowerCase()) {

        case 'text':
        case 'tspan': {
            const { x, y, textLength } = element.__data__;
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
            const { r, cx, cy } = element.__data__,
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
            const { width, height, x, y } = element.__data__;

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
            const { rx, ry, cx, cy } = element.__data__;

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
            const { resX1, resY1, resX2, resY2 } = element.__data__;

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
            const { points } = element.__data__;

            const result = parsePoints(points).map(item => {
                const {
                    x,
                    y
                } = pointTo(
                    localCTM,
                    Number(item[0]),
                    Number(item[1])
                );

                item[0] = x;
                item[1] = y;

                return item.join(' ');
            }).join(' ');

            attrs.push(['points', result]);
            break;
        }
        case 'path': {
            const { path } = element.__data__;

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

const applyTransformToHandles = (
    storage,
    options,
    data
) => {
    const {
        rotatable,
        rotatorAnchor,
        rotatorOffset
    } = options;

    const {
        wrapper,
        handles,
        center,
        transform: {
            wrapperMatrix = getTransformToElement(wrapper, wrapper.parentNode)
        } = {}
    } = storage;

    let {
        boxMatrix,
        element
    } = data;

    const {
        x,
        y,
        width,
        height
    } = element.getBBox();

    const hW = width / 2,
        hH = height / 2;

    //const forced = boxMatrix !== null;

    const resultTransform = wrapperMatrix.inverse().multiply(boxMatrix);

    const boxCenter = pointTo(resultTransform, x + hW, y + hH);

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

    const nextVertices = Object.entries(vertices)
        .reduce((nextRes, [key, vertex]) => {
            nextRes[key] = pointTo(resultTransform, vertex[0], vertex[1]);
            return nextRes;
        }, {});

    const resEdges = {
        te: [nextVertices.tl, nextVertices.tr],
        be: [nextVertices.bl, nextVertices.br],
        le: [nextVertices.tl, nextVertices.bl],
        re: [nextVertices.tr, nextVertices.br]
    };

    // if (forced) { 
    //     attrs.center = pointTo(
    //         boxCTM, 
    //         center.x, 
    //         center.y
    //     );
    //     console.log(attrs.center);
    // }

    if (rotatable) {
        const anchor = {};
        let factor = 1;

        switch (rotatorAnchor) {

            case 'n':
                anchor.x = nextVertices.tc.x;
                anchor.y = nextVertices.tc.y;
                break;
            case 's':
                anchor.x = nextVertices.bc.x;
                anchor.y = nextVertices.bc.y;
                factor = -1;
                break;
            case 'w':
                anchor.x = nextVertices.ml.x;
                anchor.y = nextVertices.ml.y;
                factor = -1;
                break;
            case 'e':
            default:
                anchor.x = nextVertices.mr.x;
                anchor.y = nextVertices.mr.y;
                break;

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

        const {
            normal,
            radius
        } = handles;

        if (isDef(normal)) {
            normal.x1.baseVal.value = anchor.x;
            normal.y1.baseVal.value = anchor.y;
            normal.x2.baseVal.value = rotator.x;
            normal.y2.baseVal.value = rotator.y;
        }

        if (isDef(radius)) {
            radius.x1.baseVal.value = boxCenter.x;
            radius.y1.baseVal.value = boxCenter.y;
            if (!center.isShifted) {
                radius.x2.baseVal.value = boxCenter.x;
                radius.y2.baseVal.value = boxCenter.y;
            }
        }

        nextVertices.rotator = rotator;
    }

    Object.keys(resEdges).forEach(key => {
        const hdl = handles[key];
        const [b, e] = resEdges[key];
        if (isUndef(b) || isUndef(hdl)) return;
        Object.entries({
            x1: b.x,
            y1: b.y,
            x2: e.x,
            y2: e.y
        }).map(([attr, value]) => hdl.setAttribute(attr, value));
    });

    Object.keys(nextVertices).forEach(key => {
        const hdl = handles[key];
        const attr = nextVertices[key];
        if (isUndef(attr) || isUndef(hdl)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
    });
};

const createHandler = (left, top, color, key) => {
    const handler = createSVGElement('circle');
    addClass(handler, `sjx-svg-hdl`);
    addClass(handler, `sjx-svg-hdl-${key}`);

    const attrs = {
        cx: left,
        cy: top,
        r: 5,
        fill: '#fff',
        stroke: color,
        'stroke-width': 1,
        'fill-opacity': 1,
        'vector-effect': 'non-scaling-stroke'
    };

    Object.entries(attrs).forEach(([attr, value]) => {
        handler.setAttribute(attr, value);
    });

    return handler;
};

const setLineStyle = (line, color) => {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
};

const storeElementAttributes = (element) => {
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

            element.__data__ = { x, y, textLength };
            break;
        }
        case 'circle': {
            const r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;

            element.__data__ = { r, cx, cy };
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            const width = element.width.baseVal.value,
                height = element.height.baseVal.value,
                x = element.x.baseVal.value,
                y = element.y.baseVal.value;

            element.__data__ = { width, height, x, y };
            break;
        }
        case 'ellipse': {
            const rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;

            element.__data__ = { rx, ry, cx, cy };
            break;
        }
        case 'line': {
            const resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;

            element.__data__ = { resX1, resY1, resX2, resY2 };
            break;
        }
        case 'polygon':
        case 'polyline': {
            const points = element.getAttribute('points');
            element.__data__ = { points };
            break;
        }
        case 'path': {
            const path = element.getAttribute('d');

            element.__data__ = { path };
            break;
        }
        default:
            break;

    }
};

const renderLine = ([b, e], color, key) => {
    const handler = createSVGElement('line');
    addClass(handler, `sjx-svg-line`);
    addClass(handler, `sjx-svg-line-${key}`);

    const attrs = {
        x1: b.x,
        y1: b.y,
        x2: e.x,
        y2: e.y,
        stroke: color,
        'stroke-width': 1,
        //'stroke-dasharray': '3 3',
        'vector-effect': 'non-scaling-stroke'
    };

    Object.entries(attrs).forEach(([attr, value]) => {
        handler.setAttribute(attr, value);
    });

    return handler;
};

const getBoundingRect = (el, ctm) => {
    const {
        x,
        y,
        width,
        height
    } = el.getBBox();

    return [
        pointTo(ctm, x, y),
        pointTo(ctm, x + width, y),
        pointTo(ctm, x + width, y + height),
        pointTo(ctm, x, y + height)
    ];
};