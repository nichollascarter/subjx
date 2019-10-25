import { helper } from '../../Helper';
import Subject from '../Subject';

import {
    isDef,
    isUndef,
    forEach
} from '../../util/util';

import {
    floatToFixed
} from '../common';

import {
    movePath,
    resizePath
} from './path';

import {
    addClass
} from '../../util/css-util';

import {
    ALLOWED_ELEMENTS,
    createSVGElement,
    createSVGMatrix,
    getTransformToElement,
    matrixToString,
    pointTo,
    isIdentity
} from './util';

const MIN_SIZE = 5;
const ROT_OFFSET = 50;
const floatRE = /[+-]?\d+(\.\d+)?/g;

export default class DraggableSVG extends Subject {

    constructor(el, options, observable) {
        super(el, observable);
        this.enable(options);
    }

    _init(el) {
        const { options } = this;

        const {
            rotationPoint,
            container,
            themeColor
        } = options;

        const wrapper = createSVGElement('g');
        container.appendChild(wrapper);

        const {
            width: cw,
            height: ch,
            x: cx,
            y: cy
        } = el.getBBox();

        const elCTM = getTransformToElement(el, container);
        const box = createSVGElement('rect');

        const attrs = [
            ['width', cw],
            ['height', ch],
            ['x', cx],
            ['y', cy],
            ['fill', themeColor],
            ['fill-opacity', 0.1],
            ['stroke', themeColor],
            ['stroke-dasharray', '3 3'],
            ['vector-effect', 'non-scaling-stroke'],
            ['transform', matrixToString(elCTM)]
        ];

        attrs.forEach(item => {
            box.setAttribute(item[0], item[1]);
        });

        const handlesGroup = createSVGElement('g'),
            normalLineGroup = createSVGElement('g'),
            group = createSVGElement('g');

        group.appendChild(box);
        wrapper.appendChild(group);
        wrapper.appendChild(normalLineGroup);
        wrapper.appendChild(handlesGroup);

        const {
            x: bX,
            y: bY,
            width: bW,
            height: bH
        } = box.getBBox();

        const centerX = el.getAttribute('data-cx'),
            centerY = el.getAttribute('data-cy');

        const boxCTM = getTransformToElement(box, box.parentNode),
            boxCenter = pointTo(boxCTM, container, bX + bW / 2, bY + bH / 2);

        const handles = {
            tl: pointTo(boxCTM, container, bX, bY),
            tr: pointTo(boxCTM, container, bX + bW, bY),
            br: pointTo(boxCTM, container, bX + bW, bY + bH),
            bl: pointTo(boxCTM, container, bX, bY + bH),
            tc: pointTo(boxCTM, container, bX + bW / 2, bY),
            bc: pointTo(boxCTM, container, bX + bW / 2, bY + bH),
            ml: pointTo(boxCTM, container, bX, bY + bH / 2),
            mr: pointTo(boxCTM, container, bX + bW, bY + bH / 2),
            center: rotationPoint ? createPoint(container, centerX, centerY) || boxCenter : undefined,
            //...(rotationPoint ? { center: createPoint(container, centerX, centerY) || boxCenter }),
            rotator: {}
        };

        const theta = Math.atan2(
            handles.tl.y - handles.tr.y,
            handles.tl.x - handles.tr.x
        );

        handles.rotator.x = handles.mr.x - ROT_OFFSET * Math.cos(theta);
        handles.rotator.y = handles.mr.y - ROT_OFFSET * Math.sin(theta);

        const normalLine = createSVGElement('line');

        normalLine.x1.baseVal.value = handles.mr.x;
        normalLine.y1.baseVal.value = handles.mr.y;
        normalLine.x2.baseVal.value = handles.rotator.x;
        normalLine.y2.baseVal.value = handles.rotator.y;

        setLineStyle(normalLine, themeColor);

        normalLineGroup.appendChild(normalLine);

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

        Object.keys(handles).forEach(key => {
            const data = handles[key];
            if (isUndef(data)) return;
            const { x, y } = data;
            const color = key === 'center'
                ? '#fe3232'
                : themeColor;

            handles[key] = createHandler(
                x, 
                y, 
                color
            );
            handlesGroup.appendChild(handles[key]);
        });

        this.storage = {
            wrapper,
            box,
            handles,
            normalLine,
            radius: rotationPoint ? radius : undefined,
            //...(rotationPoint && { radius }),
            parent: el.parentNode
        };

        helper(wrapper)
            .on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
    }

    _destroy() {
        const {
            wrapper
        } = this.storage;

        helper(wrapper)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);

        wrapper.parentNode.removeChild(wrapper);
    }

    _compute(e) {
        const {
            storage
        } = this;

        const {
            handles
        } = storage;

        const handle = helper(e.target);

        const {
            revX,
            revY,
            onTopEdge,
            onLeftEdge,
            onRightEdge,
            onBottomEdge,
            doW,
            doH
        } = this._checkHandles(handle, handles);

        const _computed = this._getState({
            revX,
            revY,
            doW,
            doH
        });

        const {
            x: clientX,
            y: clientY
        } = this._cursorPoint(e);

        const pressang = Math.atan2(
            clientY - _computed.center.y,
            clientX - _computed.center.x
        );

        return {
            ..._computed,
            doW,
            doH,
            onTopEdge,
            onLeftEdge,
            onRightEdge,
            onBottomEdge,
            handle,
            pressang
        };
    }

    _cursorPoint({ clientX, clientY }) {
        const {
            container
        } = this.options;

        return pointTo(
            container.getScreenCTM().inverse(),
            container,
            clientX,
            clientY
        );
    }

    _pointToElement({ x, y }) {
        const {
            transform
        } = this.storage;

        const { ctm } = transform;
        const matrix = ctm.inverse();

        matrix.e = matrix.f = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _pointToControls({ x, y }) {
        const {
            transform
        } = this.storage;

        const { boxCTM } = transform;
        const matrix = boxCTM.inverse();

        matrix.e = matrix.f = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const {
            container
        } = this.options;

        const pt = container.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(matrix);
    }

    _apply(actionName) {
        const {
            el: element,
            storage,
            options
        } = this;

        const {
            container
        } = options;

        const {
            box,
            handles,
            cached,
            transform
        } = storage;

        const {
            matrix
        } = transform;

        const eBBox = element.getBBox();

        const {
            x: elX,
            y: elY,
            width: elW,
            height: elH
        } = eBBox;

        const rotationPoint = isDef(handles.center) 
            ? pointTo(
                transform.boxCTM,
                container,
                handles.center.cx.baseVal.value,
                handles.center.cy.baseVal.value,
            )
            : pointTo(
                matrix,
                container,
                elX + elW / 2,
                elY + elH / 2
            );

        element.setAttribute('data-cx', rotationPoint.x);
        element.setAttribute('data-cy', rotationPoint.y);

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
            if (dx === 0 && dy === 0) return;

            // create translate matrix for an element
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

                    // create translate matrix for an element
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
                {
                    x,
                    y,
                    width: newWidth,
                    height: newHeight
                },
                container
            );

            if (isGroup(element)) {
                const els = checkChildElements(element);

                els.forEach(child => {
                    if (!isGroup(child)) {
                        applyResize(child, {
                            scaleX,
                            scaleY,
                            defaultCTM: child.__ctm__,
                            bBox: transform.bBox,
                            container,
                            storage
                        });
                    }
                });
            } else {
                applyResize(element, {
                    scaleX,
                    scaleY,
                    defaultCTM: transform.ctm,
                    bBox: transform.bBox,
                    container,
                    storage
                });
            }

            element.setAttribute(
                'transform',
                matrixToString(matrix)
            );
        }

        this.storage.cached = null;
    }

    _processResize(dx, dy) {
        const { 
            el,
            storage,
            options
        } = this;

        const {
            container,
            proportions
        } = options;

        const {
            box,
            left,
            top,
            cw,
            ch,
            transform,
            revX,
            revY,
            doW,
            doH
        } = this.storage;

        const {
            matrix,
            scMatrix,
            trMatrix,
            scaleX: ptX,
            scaleY: ptY
        } = transform;

        let {
            width: newWidth,
            height: newHeight
        } = box.getBBox();

        const ratio = doW || (!doW && !doH)
            ? (cw + dx) / cw
            : (ch + dy) / ch;

        newWidth = proportions ? cw * ratio : cw + dx;
        newHeight = proportions ? ch * ratio : ch + dy;

        if (Math.abs(newWidth) < MIN_SIZE || Math.abs(newHeight) < MIN_SIZE) return;

        const scaleX = newWidth / cw,
            scaleY = newHeight / ch;

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

        const res = matrix.multiply(scaleMatrix);

        el.setAttribute(
            'transform',
            matrixToString(res)
        );

        this.storage.cached = {
            scaleX,
            scaleY
        };

        const deltaW = newWidth - cw,
            deltaH = newHeight - ch;

        const newX = left - deltaW * (doH ? 0.5 : (revX ? 1 : 0)),
            newY = top - deltaH * (doW ? 0.5 : (revY ? 1 : 0));

        applyTransformToHandles(
            storage,
            {
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            },
            container
        );
    }

    _processMove(dx, dy) {
        const {
            container
        } = this.options;

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

        const moveWrapper = scMatrix.multiply(wrapperMatrix);

        wrapper.setAttribute(
            'transform',
            matrixToString(moveWrapper)
        );

        parentMatrix.e = parentMatrix.f = 0;
        const { x, y } = pointTo(
            parentMatrix.inverse(),
            container,
            dx,
            dy
        );

        trMatrix.e = x;
        trMatrix.f = y;

        const moveElement = trMatrix.multiply(matrix);

        this.el.setAttribute(
            'transform',
            matrixToString(moveElement)
        );

        this.storage.cached = {
            dx: x,
            dy: y,
            ox: dx,
            oy: dy
        };

        if (!center.isShifted) return;

        const radiusMatrix = wrapperMatrix.inverse();
        radiusMatrix.e = radiusMatrix.f = 0;
        const { x: nx, y: ny } = pointTo(
            radiusMatrix,
            container,
            dx,
            dy
        );

        this._moveCenterHandle(-nx,-ny);
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

        scMatrix.e = center.el_x;
        scMatrix.f = center.el_y;

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
    }

    _getState({ revX, revY, doW, doH }) {
        const {
            el: element,
            storage,
            options
        } = this;

        const {
            container
        } = options;

        const {
            box,
            wrapper,
            parent,
            handles
        } = storage;

        const {
            center: cHandle
        } = handles;

        const eBBox = element.getBBox();

        const {
            x: el_x,
            y: el_y,
            width: el_w,
            height: el_h
        } = eBBox;

        const {
            width: cw,
            height: ch,
            x: c_left,
            y: c_top
        } = box.getBBox();

        const elMatrix = getTransformToElement(element, parent),
            ctm = getTransformToElement(element, container),
            boxCTM = getTransformToElement(box.parentNode, container);
        
        const parentMatrix = getTransformToElement(parent, container);

        const scaleX = el_x + el_w * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = el_y + el_h * (doW ? 0.5 : revY ? 1 : 0);

        const transform = {
            matrix: elMatrix,
            ctm,
            boxCTM,
            parentMatrix,
            wrapperMatrix: getTransformToElement(wrapper, wrapper.parentNode),
            trMatrix: createSVGMatrix(),
            scMatrix: createSVGMatrix(),
            rotMatrix: createSVGMatrix(),
            scaleX,
            scaleY,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
            bBox: eBBox
        };

        const boxCenterX =  c_left + cw / 2,
            boxCenterY = c_top + ch / 2;

        const centerX = cHandle 
                ? cHandle.cx.baseVal.value
                : boxCenterX,
            centerY = cHandle
                ? cHandle.cy.baseVal.value
                : boxCenterY;

        // c-handler's coordinates
        const { x: bcx, y: bcy } = pointTo(
            boxCTM,
            container,
            centerX,
            centerY
        );

        // element's center coordinates
        const { x: elcx, y: elcy } = isDef(cHandle)
            ? pointTo(
                parentMatrix.inverse(),
                container,
                bcx,
                bcy
            )
            : pointTo(
                elMatrix,
                container,
                el_x + el_w / 2,
                el_y + el_h / 2
            );

        // box's center coordinates
        const { x: rcx, y: rcy } = pointTo(
            getTransformToElement(box, container),
            container,
            boxCenterX,
            boxCenterY
        );

        checkChildElements(element).forEach(child => {
            child.__ctm__ = getTransformToElement(child, container);
        });

        return {
            transform,
            cw,
            ch,
            center: {
                x: cHandle ? bcx : rcx,
                y: cHandle ? bcy : rcy,
                el_x: elcx,
                el_y: elcy,
                hx: cHandle ? cHandle.cx.baseVal.value : null,
                hy: cHandle ? cHandle.cy.baseVal.value : null,
                isShifted: (floatToFixed(rcx, 3) !== floatToFixed(bcx, 3)) &&
                            (floatToFixed(rcy, 3) !== floatToFixed(bcy, 3))
            },
            left: c_left,
            top: c_top,
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(x, y) {
        const { 
            handles, 
            center, 
            radius 
        } = this.storage;

        if (isUndef(handles.center)) return;

        handles.center.cx.baseVal.value = center.hx + x;
        handles.center.cy.baseVal.value = center.hy + y;

        radius.x2.baseVal.value = center.hx + x;
        radius.y2.baseVal.value = center.hy + y;
    }

    resetCenterPoint() {
        const {
            box,
            handles,
            radius
        } = this.storage;

        const {
            center
        } = handles;

        const {
            container
        } = this.options;

        const {
            width: cw,
            height: ch,
            x: c_left,
            y: c_top
        } = box.getBBox();

        const matrix = getTransformToElement(box, box.parentNode);
        
        const { x: cx, y: cy } = pointTo(
            matrix,
            container,
            c_left + cw / 2,
            c_top + ch / 2
        );

        center.cx.baseVal.value = cx;
        center.cy.baseVal.value = cy;
        center.isShifted = false;

        radius.x2.baseVal.value = cx;
        radius.y2.baseVal.value = cy;
    }

    get controls() {
        return this.storage.wrapper;
    }

}

function applyTranslate(element, { x, y }) {
    const attrs = [];

    switch (element.tagName.toLowerCase()) {

        case 'use':
        case 'image':
        case 'text':
        case 'rect': {
            const resX = element.x.baseVal.value + x,
                resY = element.y.baseVal.value + y;

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
}

function applyResize(element, data) {
    const {
        scaleX,
        scaleY,
        bBox,
        defaultCTM,
        container
    } = data;

    const {
        width: boxW,
        height: boxH
    } = bBox;

    const attrs = [];

    const ctm = getTransformToElement(element, container);
    const localCTM = defaultCTM.inverse().multiply(ctm);

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const x = element.x.baseVal.value,
                y = element.y.baseVal.value;

            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                container,
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
            const r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                container,
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
        case 'image':
        case 'rect': {
            const width = element.width.baseVal.value,
                height = element.height.baseVal.value,
                x = element.x.baseVal.value,
                y = element.y.baseVal.value;

            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                container,
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
            const rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;

            const {
                x: cx1,
                y: cy1
            } = pointTo(
                localCTM,
                container,
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
                container,
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
            const resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;

            const {
                x: resX1_,
                y: resY1_
            } = pointTo(
                localCTM,
                container,
                resX1,
                resY1
            );

            const {
                x: resX2_,
                y: resY2_
            } = pointTo(
                localCTM,
                container,
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
            const points = parsePoints(element.getAttribute('points'));
            const result = points.map(item => {
                const {
                    x,
                    y
                } = pointTo(
                    localCTM,
                    container,
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
            const path = element.getAttribute('d');

            attrs.push(['d', resizePath(
                {
                    path,
                    localCTM,
                    container
                }
            )]);
            break;
        }
        default:
            break;
    
    }

    attrs.forEach(attr => {
        element.setAttribute(attr[0], attr[1]);
    });
}

function applyTransformToHandles(
    storage,
    data,
    container
) {
    const {
        box,
        handles,
        normalLine,
        radius,
        center
    } = storage;

    let {
        x,
        y,
        width,
        height
    } = data;

    const hW = width / 2,
        hH = height / 2;

    const boxCTM = getTransformToElement(
        box,
        box.parentNode
    );

    const boxCenter = pointTo(boxCTM, container, x + hW, y + hH);

    const attrs = {
        tl: pointTo(boxCTM, container, x, y),
        tr: pointTo(boxCTM, container, x + width, y),
        br: pointTo(boxCTM, container, x + width, y + height),
        bl: pointTo(boxCTM, container, x, y + height),
        tc: pointTo(boxCTM, container, x + hW, y),
        bc: pointTo(boxCTM, container, x + hW, y + height),
        ml: pointTo(boxCTM, container, x, y + hH),
        mr: pointTo(boxCTM, container, x + width, y + hH),
        rotator: {},
        center: !center.isShifted && isDef(handles.center) ? boxCenter : undefined
        //...(!center.isShifted && isDef(handles.center) && { center: boxCenter })
    };

    const theta = Math.atan2(
        attrs.tl.y - attrs.tr.y,
        attrs.tl.x - attrs.tr.x
    );

    attrs.rotator.x = attrs.mr.x - ROT_OFFSET * Math.cos(theta);
    attrs.rotator.y = attrs.mr.y - ROT_OFFSET * Math.sin(theta);

    normalLine.x1.baseVal.value = attrs.mr.x;
    normalLine.y1.baseVal.value = attrs.mr.y;
    normalLine.x2.baseVal.value = attrs.rotator.x;
    normalLine.y2.baseVal.value = attrs.rotator.y;

    if (isDef(radius)) {
        radius.x1.baseVal.value = boxCenter.x;
        radius.y1.baseVal.value = boxCenter.y;
        if (!center.isShifted) {
            radius.x2.baseVal.value = boxCenter.x;
            radius.y2.baseVal.value = boxCenter.y;
        }
    }

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

    Object.keys(attrs).forEach(key => {
        const hdl = handles[key];
        const attr = attrs[key];
        if (isUndef(attr)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
    });
}

function isGroup(element) {
    return element.tagName.toLowerCase() === 'g';
}

function checkChildElements(element) {
    const arrOfElements = [];

    if (isGroup(element)) {
        forEach.call(element.childNodes, item => {
            if (item.nodeType === 1) {
                const tagName = item.tagName.toLowerCase();

                if (ALLOWED_ELEMENTS.indexOf(tagName) !== -1) {
                    if (tagName === 'g') {
                        arrOfElements.push(...checkChildElements(item));
                    }
                    arrOfElements.push(item);
                }
            }
        });
    } else {
        arrOfElements.push(element);
    }

    return arrOfElements;
}

function parsePoints(pts) {
    return pts.match(floatRE).reduce(
        (result, value, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            return result;
        },
        []
    );
}

function createHandler(l, t, color) {
    const handler = createSVGElement('circle');
    addClass(handler, 'sjx-svg-hdl');

    const items = {
        cx: l,
        cy: t,
        r: 5.5,
        fill: color,
        stroke: '#fff',
        'fill-opacity': 1,
        'vector-effect': 'non-scaling-stroke',
        'stroke-width': 1
    };

    Object.keys(items).map(key => {
        handler.setAttribute(key, items[key]);
    });

    return handler;
}

function setLineStyle(line, color) {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
}

function createPoint(svg, x, y) {
    if (isUndef(x) || isUndef(y)) {
        return null;
    }
    const pt = svg.createSVGPoint();
    pt.x = x; 
    pt.y = y;
    return pt;
}