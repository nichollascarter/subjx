import { helper } from '../../Helper';
import Transformable from '../Transformable';
import { isDef, isUndef, isFunc } from '../../util/util';
import { floatToFixed } from '../common';
import { movePath, resizePath } from './path';
import { addClass } from '../../util/css-util';

import {
    checkChildElements,
    createSVGElement,
    createSVGMatrix,
    createPoint,
    isGroup,
    parsePoints,
    getTransformToElement,
    matrixToString,
    pointTo,
    isIdentity
} from './util';

const MIN_SIZE = 5;
const THEME_COLOR = '#00a8ff';

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

        const wrapper = createSVGElement('g');
        addClass(wrapper, 'sjx-svg-wrapper');
        container.appendChild(wrapper);

        const {
            width: boxWidth,
            height: boxHeight,
            x: cx,
            y: cy
        } = el.getBBox();

        const elCTM = getTransformToElement(el, container);
        const box = createSVGElement('rect');

        const attrs = [
            ['width', boxWidth],
            ['height', boxHeight],
            ['x', cx],
            ['y', cy],
            ['fill', THEME_COLOR],
            ['fill-opacity', 0.1],
            ['stroke', THEME_COLOR],
            ['stroke-dasharray', '3 3'],
            ['vector-effect', 'non-scaling-stroke'],
            ['transform', matrixToString(elCTM)]
        ];

        attrs.forEach(([key, value]) => {
            box.setAttribute(key, value);
        });

        const handlesGroup = createSVGElement('g'),
            normalLineGroup = createSVGElement('g'),
            group = createSVGElement('g');

        addClass(group, 'sjx-svg-box-group');
        addClass(handlesGroup, 'sjx-svg-handles');
        addClass(normalLineGroup, 'sjx-svg-normal-group');

        group.appendChild(box);
        wrapper.appendChild(group);
        wrapper.appendChild(normalLineGroup);
        wrapper.appendChild(handlesGroup);

        const bBox = box.getBBox(),
            {
                x: bX,
                y: bY,
                width: bW,
                height: bH
            } = bBox;

        const centerX = el.getAttribute('data-sjx-cx'),
            centerY = el.getAttribute('data-sjx-cy');

        const boxCTM = getTransformToElement(box, box.parentNode),
            boxCenter = pointTo(boxCTM, bX + bW / 2, bY + bH / 2),
            boxTL = pointTo(boxCTM, bX, bY),
            boxTR = pointTo(boxCTM, bX + bW, bY),
            boxMR = pointTo(boxCTM, bX + bW, bY + bH / 2),
            boxML = pointTo(boxCTM, bX, bY + bH / 2),
            boxTC = pointTo(boxCTM, bX + bW / 2, bY),
            boxBC = pointTo(boxCTM, bX + bW / 2, bY + bH),
            boxBR = pointTo(boxCTM, bX + bW, bY + bH),
            boxBL = pointTo(boxCTM, bX, bY + bH);

        const resizingHandles = {
            tl: boxTL,
            tr: boxTR,
            br: boxBR,
            bl: boxBL,
            tc: boxTC,
            bc: boxBC,
            ml: boxML,
            mr: boxMR
        };

        let rotationHandles = {},
            rotator = null;

        if (rotatable) {
            const anchor = {};
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n':
                    anchor.x = boxTC.x;
                    anchor.y = boxTC.y;
                    break;
                case 's':
                    anchor.x = boxBC.x;
                    anchor.y = boxBC.y;
                    factor = -1;
                    break;
                case 'w':
                    anchor.x = boxML.x;
                    anchor.y = boxML.y;
                    factor = -1;
                    break;
                case 'e':
                default:
                    anchor.x = boxMR.x;
                    anchor.y = boxMR.y;
                    break;

            }

            const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
                ? Math.atan2(
                    boxBL.y - boxTL.y,
                    boxBL.x - boxTL.x
                )
                : Math.atan2(
                    boxTL.y - boxTR.y,
                    boxTL.x - boxTR.x
                );

            rotator = {
                x: anchor.x - (rotatorOffset * factor) * Math.cos(theta),
                y: anchor.y - (rotatorOffset * factor) * Math.sin(theta)
            };

            const normalLine = showNormal ? createSVGElement('line') : null;

            if (showNormal) {
                normalLine.x1.baseVal.value = anchor.x;
                normalLine.y1.baseVal.value = anchor.y;
                normalLine.x2.baseVal.value = rotator.x;
                normalLine.y2.baseVal.value = rotator.y;

                setLineStyle(normalLine, THEME_COLOR);
                normalLineGroup.appendChild(normalLine);
            }
            let radius = null;

            if (rotationPoint) {
                radius = createSVGElement('line');

                addClass(radius, 'sjx-hidden');

                radius.x1.baseVal.value = boxCenter.x;
                radius.y1.baseVal.value = boxCenter.y;
                radius.x2.baseVal.value = centerX || boxCenter.x;
                radius.y2.baseVal.value = centerY || boxCenter.y;

                setLineStyle(radius, '#fe3232');
                radius.setAttribute('opacity', 0.5);

                normalLineGroup.appendChild(radius);
            }

            rotationHandles = {
                normal: normalLine,
                radius
            };
        }

        const handles = {
            ...(resizable && resizingHandles),
            rotator,
            center: rotationPoint && rotatable
                ? createPoint(container, centerX, centerY) || boxCenter
                : undefined
        };

        Object.keys(handles).forEach(key => {
            const data = handles[key];
            if (isUndef(data)) return;
            const { x, y } = data;
            const color = key === 'center'
                ? '#fe3232'
                : THEME_COLOR;

            if (isDef(custom) && isFunc(custom[key])) {
                handles[key] = custom[key](boxCTM, bBox, pointTo);
            } else {
                handles[key] = createHandler(
                    x,
                    y,
                    color,
                    key
                );
            }
            handlesGroup.appendChild(handles[key]);
        });

        this.storage = {
            wrapper,
            box,
            handles: {
                ...handles,
                ...rotationHandles
            },
            parent: el.parentNode,
            center: {
                isShifted: false
            }
        };

        helper(wrapper)
            .on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
    }

    _destroy() {
        const { wrapper } = this.storage;

        helper(wrapper)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);

        wrapper.parentNode.removeChild(wrapper);
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;

        return pointTo(
            container.getScreenCTM().inverse(),
            clientX,
            clientY
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
        const { transform: { boxCTM } } = this.storage;

        const matrix = boxCTM.inverse();
        matrix.e = matrix.f = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const { container } = this.options;

        const pt = container.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(matrix);
    }

    _apply(actionName) {
        const {
            el: element,
            storage,
            options,
            options: { 
                container, 
                scalable,
                applyTranslate: applyDragging
            }
        } = this;

        const {
            box,
            handles,
            cached,
            transform
        } = storage;

        const {
            matrix,
            boxCTM,
            bBox,
            ctm
        } = transform;

        const eBBox = element.getBBox();

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = eBBox;

        const { x: centerX, y: centerY } = isDef(handles.center)
            ? pointTo(
                boxCTM,
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
            const {
                x,
                y,
                width: newWidth,
                height: newHeight
            } = box.getBBox();

            applyTransformToHandles(
                storage,
                options,
                {
                    x,
                    y,
                    width: newWidth,
                    height: newHeight,
                    boxMatrix: null
                }
            );

            if (!scalable) {
                if (isGroup(element)) {
                    const els = checkChildElements(element);

                    els.forEach(child => {
                        if (!isGroup(child)) {
                            applyResize(child, {
                                scaleX,
                                scaleY,
                                defaultCTM: child.__ctm__,
                                bBox: bBox,
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
                        bBox: bBox,
                        container,
                        storage,
                        cached
                    });
                }

                element.setAttribute(
                    'transform',
                    matrixToString(matrix)
                );
            }
        }

        this.storage.cached = null;
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            options,
            options: { proportions, scalable }
        } = this;

        const {
            left,
            top,
            boxWidth,
            boxHeight,
            transform,
            revX,
            revY,
            doW,
            doH,
            box
        } = storage;

        const {
            rectMatrix,
            matrix,
            scMatrix,
            trMatrix,
            scaleX: ptX,
            scaleY: ptY,
            boxScaleX,
            boxScaleY
        } = transform;

        let {
            width: newWidth,
            height: newHeight
        } = el.getBBox();

        const ratio = doW || (!doW && !doH)
            ? (boxWidth + dx) / boxWidth
            : (boxHeight + dy) / boxHeight;

        newWidth = proportions ? boxWidth * ratio : boxWidth + dx;
        newHeight = proportions ? boxHeight * ratio : boxHeight + dy;

        if (Math.abs(newWidth) <= MIN_SIZE || Math.abs(newHeight) <= MIN_SIZE) return;

        const scaleX = newWidth / boxWidth,
            scaleY = newHeight / boxHeight;

        // setup scale matrix
        scMatrix.a = scaleX;
        scMatrix.b = 0;
        scMatrix.c = 0;
        scMatrix.d = scaleY;
        scMatrix.e = 0;
        scMatrix.f = 0;

        // translate compensation matrix
        trMatrix.e = ptX;
        trMatrix.f = ptY;

        //now must to do: translate(x y) scale(sx sy) translate(-x -y)
        const scaleMatrix = trMatrix
            .multiply(scMatrix)
            .multiply(trMatrix.inverse());

        const deltaW = newWidth - boxWidth,
            deltaH = newHeight - boxHeight;

        const newX = left - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = top - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        const finalValues = {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        };

        const resultMatrix = matrix.multiply(scaleMatrix);

        if (scalable) {
            trMatrix.e = boxScaleX;
            trMatrix.f = boxScaleY;

            const boxScaleMatrix = trMatrix
                .multiply(scMatrix)
                .multiply(trMatrix.inverse());

            const boxMatrix = rectMatrix.multiply(boxScaleMatrix);
            box.setAttribute(
                'transform',
                matrixToString(boxMatrix)
            );

            el.setAttribute(
                'transform',
                matrixToString(resultMatrix)
            );
        } else {
            updateBoxBoundaries(box, finalValues);
        }

        applyTransformToHandles(
            storage,
            options,
            {
                ...finalValues,
                boxMatrix: rectMatrix
            }
        );

        this.storage.cached = {
            scaleX,
            scaleY,
            resultMatrix: scaleMatrix
        };

        this._apply('resize');

        return finalValues;
    }

    _processMove(dx, dy) {
        const {
            transform,
            wrapper,
            center
        } = this.storage;

        const {
            matrix,
            trMatrix,
            scMatrix,
            wrapperMatrix,
            parentMatrix
        } = transform;

        scMatrix.e = dx;
        scMatrix.f = dy;

        const moveWrapperMtrx = scMatrix.multiply(wrapperMatrix);

        wrapper.setAttribute(
            'transform',
            matrixToString(moveWrapperMtrx)
        );

        parentMatrix.e = parentMatrix.f = 0;
        const { x, y } = pointTo(
            parentMatrix.inverse(),
            dx,
            dy
        );

        trMatrix.e = x;
        trMatrix.f = y;

        const moveElementMtrx = trMatrix.multiply(matrix);

        this.el.setAttribute(
            'transform',
            matrixToString(moveElementMtrx)
        );

        this.storage.cached = {
            dx: x,
            dy: y,
            ox: dx,
            oy: dy
        };

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
            center,
            transform,
            wrapper
        } = this.storage;

        const {
            matrix,
            wrapperMatrix,
            parentMatrix,
            trMatrix,
            scMatrix,
            rotMatrix
        } = transform;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        // rotate(a cx cy) is equivalent to translate(cx cy) rotate(a) translate(-cx -cy)
        trMatrix.e = center.x;
        trMatrix.f = center.y;

        rotMatrix.a = cos;
        rotMatrix.b = sin;
        rotMatrix.c = - sin;
        rotMatrix.d = cos;

        const wrapMatrix = trMatrix.multiply(rotMatrix)
            .multiply(trMatrix.inverse())
            .multiply(wrapperMatrix);

        wrapper.setAttribute(
            'transform',
            matrixToString(wrapMatrix)
        );

        scMatrix.e = center.elX;
        scMatrix.f = center.elY;

        parentMatrix.e = parentMatrix.f = 0;
        const resRotMatrix = parentMatrix.inverse()
            .multiply(rotMatrix)
            .multiply(parentMatrix);

        const rotateMatrix = scMatrix.multiply(resRotMatrix)
            .multiply(scMatrix.inverse());

        const elMatrix = rotateMatrix.multiply(matrix);

        this.el.setAttribute(
            'transform',
            matrixToString(elMatrix)
        );

        return elMatrix;
    }

    _getState({ revX, revY, doW, doH }) {
        const {
            el: element,
            storage,
            options: { container }
        } = this;

        const {
            box,
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

        const {
            width: boxWidth,
            height: boxHeight,
            x: boxLeft,
            y: boxTop
        } = box.getBBox();

        const elMatrix = getTransformToElement(element, parent),
            ctm = getTransformToElement(element, container),
            rectMatrix = getTransformToElement(box, box.parentNode),
            boxCTM = getTransformToElement(box.parentNode, container);

        const parentMatrix = getTransformToElement(parent, container);

        const scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);

        const boxScaleX = boxLeft + boxWidth * (doH ? 0.5 : revX ? 1 : 0),
            boxScaleY = boxTop + boxHeight * (doW ? 0.5 : revY ? 1 : 0);

        const transform = {
            matrix: elMatrix,
            ctm,
            boxCTM,
            rectMatrix,
            parentMatrix,
            wrapperMatrix: getTransformToElement(wrapper, wrapper.parentNode),
            trMatrix: createSVGMatrix(),
            scMatrix: createSVGMatrix(),
            rotMatrix: createSVGMatrix(),
            scaleX,
            scaleY,
            boxScaleX,
            boxScaleY,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
            bBox: eBBox
        };

        const boxCenterX = boxLeft + boxWidth / 2,
            boxCenterY = boxTop + boxHeight / 2;

        const centerX = cHandle
                ? cHandle.cx.baseVal.value
                : boxCenterX,
            centerY = cHandle
                ? cHandle.cy.baseVal.value
                : boxCenterY;

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
                elX + elW / 2,
                elY + elH / 2
            );

        // box's center coordinates
        const { x: rcx, y: rcy } = pointTo(
            getTransformToElement(box, container),
            boxCenterX,
            boxCenterY
        );

        storeElementAttributes(this.el);
        checkChildElements(element).forEach(child => {
            child.__ctm__ = getTransformToElement(child, container);
            storeElementAttributes(child);
        });

        return {
            transform,
            boxWidth,
            boxHeight,
            center: {
                x: cHandle ? bcx : rcx,
                y: cHandle ? bcy : rcy,
                elX: elcx,
                elY: elcy,
                hx: cHandle ? cHandle.cx.baseVal.value : null,
                hy: cHandle ? cHandle.cy.baseVal.value : null,
                isShifted: (floatToFixed(rcx, 3) !== floatToFixed(bcx, 3)) &&
                    (floatToFixed(rcy, 3) !== floatToFixed(bcy, 3))
            },
            left: boxLeft,
            top: boxTop,
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(x, y) {
        const {
            handles: { center, radius },
            center: { hx, hy }
        } = this.storage;

        if (isUndef(center)) return;

        const mx = hx + x,
            my = hy + y;

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
            storage: { box, wrapper },
            options: { container }
        } = this;

        const { width, height, x, y } = el.getBBox();

        const containerMatrix = getTransformToElement(
            el,
            container
        );

        wrapper.removeAttribute('transform');

        const boxAttrs = {
            x,
            y,
            width: Math.abs(width),
            height: Math.abs(height),
            transform: matrixToString(containerMatrix)
        };

        Object.entries(boxAttrs).forEach(([attr, value]) => {
            box.setAttribute(attr, value);
        });

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                x,
                y,
                width,
                height,
                boxMatrix: containerMatrix
            }
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
        box,
        handles,
        center
    } = storage;

    let {
        x,
        y,
        width,
        height,
        boxMatrix
    } = data;

    const hW = width / 2,
        hH = height / 2;

    const forced = boxMatrix !== null;

    const boxCTM = !forced
        ? getTransformToElement(
            box,
            box.parentNode
        )
        : boxMatrix;

    const boxCenter = pointTo(boxCTM, x + hW, y + hH);

    const attrs = {
        tl: pointTo(boxCTM, x, y),
        tr: pointTo(boxCTM, x + width, y),
        br: pointTo(boxCTM, x + width, y + height),
        bl: pointTo(boxCTM, x, y + height),
        tc: pointTo(boxCTM, x + hW, y),
        bc: pointTo(boxCTM, x + hW, y + height),
        ml: pointTo(boxCTM, x, y + hH),
        mr: pointTo(boxCTM, x + width, y + hH),
        center: isDef(handles.center) && !center.isShifted ? boxCenter : undefined
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
                anchor.x = attrs.tc.x;
                anchor.y = attrs.tc.y;
                break;
            case 's':
                anchor.x = attrs.bc.x;
                anchor.y = attrs.bc.y;
                factor = -1;
                break;
            case 'w':
                anchor.x = attrs.ml.x;
                anchor.y = attrs.ml.y;
                factor = -1;
                break;
            case 'e':
            default:
                anchor.x = attrs.mr.x;
                anchor.y = attrs.mr.y;
                break;

        }

        const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
            ? Math.atan2(
                attrs.bl.y - attrs.tl.y,
                attrs.bl.x - attrs.tl.x
            )
            : Math.atan2(
                attrs.tl.y - attrs.tr.y,
                attrs.tl.x - attrs.tr.x
            );

        const rotator = {
            x: anchor.x - (rotatorOffset * factor) * Math.cos(theta),
            y: anchor.y - (rotatorOffset * factor) * Math.sin(theta)
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

        attrs.rotator = rotator;
    }

    // x += width < 0 ? width : 0;
    // y += height < 0 ? height : 0;

    // const boxAttrs = {
    //     x,
    //     y,
    //     width: Math.abs(width),
    //     height: Math.abs(height)
    // };

    // Object.keys(boxAttrs).forEach(attr => {
    //     box.setAttribute(attr, boxAttrs[attr]);
    // });

    Object.keys(attrs).forEach(key => {
        const hdl = handles[key];
        const attr = attrs[key];
        if (isUndef(attr) || isUndef(hdl)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
    });
};

const createHandler = (left, top, color, key) => {
    const handler = createSVGElement('circle');
    addClass(handler, `sjx-svg-hdl-${key}`);

    const attrs = {
        cx: left,
        cy: top,
        r: 5.5,
        fill: color,
        stroke: '#fff',
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

const updateBoxBoundaries = (box, data) => {
    let {
        x,
        y,
        width,
        height
    } = data;

    x += width < 0 ? width : 0;
    y += height < 0 ? height : 0;

    const boxAttrs = {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height)
    };

    Object.keys(boxAttrs).forEach(attr => {
        box.setAttribute(attr, boxAttrs[attr]);
    });
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

            element.__data__ = { x, y };
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

    //  const ctm = getTransformToElement(element, container);

    const containerCTM = container.getScreenCTM() || createSVGMatrix();
    const elementMatrix = element.getScreenCTM().multiply(cached.resultMatrix);

    const resultCTM = containerCTM.inverse().multiply(elementMatrix);

    const localCTM = defaultCTM.inverse().multiply(resultCTM);

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const { x, y } = element.__data__;

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
                ['y', resY + (scaleY < 0 ? boxH : 0)]
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

            attrs.push(['d', resizePath(
                {
                    path,
                    localCTM
                }
            )]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};