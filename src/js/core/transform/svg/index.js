import { Helper } from '../../helper'
import Subject from '../subject'

import { 
    isUndef
} from '../../util/util'

import {
    floatToFixed
} from '../common'

import {
    movePath,
    resizePath
} from './path'

import {
    ALLOWED_ELEMENTS,
    createSVGElement,
    createSVGMatrix,
    getTransformToElement,
    matrixToString,
    pointTo
} from './util'

const MIN_SIZE = 2;
const ROT_OFFSET = 50;
const floatRE = /[+-]?\d+(\.\d+)?/g;

export default class DraggableSVG extends Subject {

    constructor(el, options, Observable) {
        super(el, Observable);
        this.enable(options);
    }

    _init(item) {
        _init.call(this, item);
    }

    _destroy(item) {
        _destroy.call(this, item);
    }

    _drag() {
        processMove.call(this, ...arguments);
    }

    _rotate() {
        processRotate.call(this, ...arguments);
    }

    _resize() {
        processResize.call(this, ...arguments);
    }

    _compute() {
        return _compute.call(this, ...arguments);
    }

    _cursorPoint(e) {

        const { 
            container
        } = this.storage;

        return pointTo(
            container.getScreenCTM().inverse(), 
            container, 
            e.clientX, 
            e.clientY
        );
    }

    _pointToElement(data) {

        const {
            transform,
            container
        } = this.storage;

        const { 
            x, 
            y 
        } = data;

        const { ctm } = transform;
        const matrix = ctm.inverse();

        const pt = container.createSVGPoint();
        pt.x = x;
        pt.y = y;
        matrix.e = matrix.f = 0;

        return pt.matrixTransform(matrix);
    }

    _apply(actionName) {

        const { 
            el: element,
            storage
        } = this;

        const {
            container,
            box,
            handles,
            normalLine,
            cached,
            transform
        } = storage;

        if (isUndef(cached)) return;

        const {
            scaleX,
            scaleY,
            dx,
            dy,
            ox,
            oy
        } = cached;

        const {
            matrix
        } = transform;

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

                    child.setAttribute(
                        'transform', 
                        matrixToString(translateMatrix)
                    );   
                    
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
                box, 
                handles, 
                normalLine, 
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

    onGetState(data) {

        const store = this.storage;

        const recalc = getState.call(
            this,
            data
        );

        Object.keys(recalc).forEach(key => {
            store[key] = recalc[key];
        });
    }
}

function _init(sel) {

    const { storage } = this;

    const {
        showHandles,
        container
    } = storage;

    const wrapper = createSVGElement('g');
    container.appendChild(wrapper);

    const {
        width: cw,
        height: ch,
        x: cx,
        y: cy
    } = sel.getBBox();

    const elCTM = getTransformToElement(sel, container);
    const box = createSVGElement('rect');

    const attrs = [
        ['width', cw],
        ['height', ch],
        ['x', cx],
        ['y', cy],
        ['fill', 'rgba(0, 168, 255, 0.2)'],
        ['stroke', '#00a8ff'],
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

    const boxCTM = getTransformToElement(box, box.parentNode);

    const handles = {
        tl: pointTo(boxCTM, container, bX, bY),
        tr: pointTo(boxCTM, container, bX + bW, bY),
        br: pointTo(boxCTM, container, bX + bW, bY + bH),
        bl: pointTo(boxCTM, container, bX, bY + bH),
        tc: pointTo(boxCTM, container, bX + bW / 2, bY),
        bc: pointTo(boxCTM, container, bX + bW / 2, bY + bH),
        ml: pointTo(boxCTM, container, bX, bY + bH / 2),
        mr: pointTo(boxCTM, container, bX + bW, bY + bH / 2),
        //center: pointTo(boxCTM, container, bX + bW / 2, bY + bH / 2),
        rotator: {}
    };

    const theta = Math.atan2(
        handles.tl.y - handles.tr.y,
        handles.tl.x - handles.tr.x
    );

    handles.rotator.x = handles.mr.x - ROT_OFFSET * Math.cos(theta);
    handles.rotator.y = handles.mr.y - ROT_OFFSET * Math.sin(theta);

    const normalLine = createSVGElement('line');

    if (showHandles) {
        
        normalLine.x1.baseVal.value = handles.mr.x;
        normalLine.y1.baseVal.value = handles.mr.y;
        normalLine.x2.baseVal.value = handles.rotator.x;
        normalLine.y2.baseVal.value = handles.rotator.y;

        normalLine.setAttribute('stroke', '#00a8ff');
        normalLine.setAttribute('stroke-dasharray', '3 3');
        normalLine.setAttribute('vector-effect', 'non-scaling-stroke');

        normalLineGroup.appendChild(normalLine);
    }

    Object.keys(handles).forEach(key => {
        const data = handles[key];
        handles[key] = createHandler(data.x, data.y);
        if (showHandles) {
            handlesGroup.appendChild(handles[key])
        }
    });

    Object.assign(storage, {
        wrapper,
        box,
        handles,
        normalLine,
        parent: sel.parentNode
    });

    Helper(wrapper).on('mousedown', this._onMouseDown)
                    .on('touchstart', this._onTouchStart);               
}

function _compute(e) {

    const {
        storage
    } = this;

    const {
        handles
    } = storage;

    const handle = Helper(e.target);

    //reverse axis
    const revX = handle.is(handles.tl) ||
                handle.is(handles.ml) ||
                handle.is(handles.bl) ||
                handle.is(handles.tc);

    const revY = handle.is(handles.tl) || 
                handle.is(handles.tr) || 
                handle.is(handles.tc) || 
                handle.is(handles.ml);

    const onTopEdge = handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.tr),
        onLeftEdge = handle.is(handles.tl) || handle.is(handles.ml) || handle.is(handles.bl),
        onRightEdge = handle.is(handles.tr) || handle.is(handles.mr) || handle.is(handles.br),
        onBottomEdge = handle.is(handles.br) || handle.is(handles.bc) || handle.is(handles.bl);

    const _computed = getState.call(this, {
        revX, 
        revY
    });

    const { 
        x: clientX, 
        y: clientY
    } = this._cursorPoint(e);

    const pressang = Math.atan2(
        clientY - _computed.center.y,
        clientX - _computed.center.x
    );

    _computed.onTopEdge = onTopEdge;
    _computed.onLeftEdge = onLeftEdge;
    _computed.onRightEdge = onRightEdge;
    _computed.onBottomEdge = onBottomEdge;
    _computed.handle = handle;
    _computed.pressang = pressang;
   
    return _computed;
}

function _destroy() {

    const {
        wrapper, 
        container 
    } = this.storage;

    Helper(wrapper).off('mousedown', this._onMouseDown)
                    .off('touchstart', this._onTouchStart);

    container.removeChild(wrapper);
}

function getState(params) {

    const {
        revX,
        revY
    } = params;

    const { 
        el: element,
        storage
    } = this;

    const {
        container,
        box,
        wrapper,
        parent
    } = storage;

    const eBBox = this.el.getBBox();

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

    const elMatrix = getTransformToElement(element, parent);
    const boxGroup = box.parentNode;

    const transform = {
        matrix: elMatrix,
        ctm: getTransformToElement(element, container),
        wrapperMatrix: getTransformToElement(wrapper, wrapper.parentNode),
        boxCTM: getTransformToElement(boxGroup, container),
        boxMatrix: getTransformToElement(boxGroup, boxGroup.parentNode),
        parentMatrix: getTransformToElement(parent, container),
        trMatrix: createSVGMatrix(),
        scMatrix: createSVGMatrix(),
        rotMatrix: createSVGMatrix(),
        scaleX: (revX ? el_w + el_x : el_x),
        scaleY: (revY ? el_h + el_y : el_y),
        bBox: eBBox
    };

    const hW = cw / 2,
        hH = ch / 2;

    const boxCenter = pointTo(
        getTransformToElement(box, container), 
        container, 
        c_left + hW,
        c_top + hH
    );

    const elementCenter = pointTo(
        elMatrix, 
        container, 
        el_x + el_w / 2,
        el_y + el_h / 2
    );

    checkChildElements(element).forEach(child => {
        child.__ctm__ = getTransformToElement(child, container);
    });

    return {
        transform,
        cw,
        ch,
        center: {
            x: boxCenter.x,
            y: boxCenter.y,
            el_x: elementCenter.x,
            el_y: elementCenter.y
        },
        left: c_left,
        top: c_top,
        revX,
        revY
    };
}

function processResize(
    dx,
    dy
) {

    const {
        container,
        box,
        handles,
        normalLine,
        left,
        top,
        cw,
        ch,
        transform,
        revX,
        revY
    } = this.storage;

    const { 
        matrix,
        scMatrix,
        trMatrix,
        scaleX: ptX,
        scaleY: ptY
    } = transform;

    const { el } = this;

    let {
        width: newWidth,
        height: newHeight
    } = box.getBBox();

    newWidth = cw + dx;
    newHeight = ch + dy;

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
    const res = matrix.multiply(trMatrix)
                        .multiply(scMatrix)
                        .multiply(trMatrix.inverse());

    el.setAttribute(
        'transform', 
        matrixToString(res)
    );

    this.storage.cached = {
        scaleX,
        scaleY
    };

    applyTransformToHandles(
        box,
        handles,
        normalLine,
        {
            x: revX ? left - dx : left,
            y: revY ? top - dy : top,
            width: newWidth,
            height: newHeight,
        },
        container
    );
}

function processMove(
    dx,
    dy
) {
    const {
        container,
        transform,
        wrapper
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
    }
}

function processRotate(radians) {

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

function applyTranslate(element, data) {

    const {
        x,
        y
    } = data;

    const attrs = [];

    switch(element.tagName.toLowerCase()) {

        case 'use':
        case 'image':
        case 'text':
        case 'rect': {

                const resX = Number(element.getAttribute('x')) + x,
                    resY = Number(element.getAttribute('y')) + y;

                attrs.push(
                    ['x', resX],
                    ['y', resY]
                );
            }
            break;

        case 'circle':
        case 'ellipse': {

                const resX = Number(element.getAttribute('cx')) + x,
                    resY = Number(element.getAttribute('cy')) + y;

                attrs.push(
                    ['cx', resX],
                    ['cy', resY]
                );
            }
            break;
        
        case 'line': {

                const resX1 = Number(element.getAttribute('x1')) + x,
                    resY1 = Number(element.getAttribute('y1')) + y,
                    resX2 = Number(element.getAttribute('x2')) + x,
                    resY2 = Number(element.getAttribute('y2')) + y;

                attrs.push(
                    ['x1', resX1],
                    ['y1', resY1],
                    ['x2', resX2],
                    ['y2', resY2]
                );
            }
            break;

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
            }
            break;
        
        case 'path': {

                const path = element.getAttribute('d');

                attrs.push(['d', movePath(
                    {
                        path, 
                        dx: x, 
                        dy: y
                    }
                )]);
            }

            break;

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

    switch(element.tagName.toLowerCase()) {

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
        }
        break;

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
            }
            break;
  
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

                localCTM.e = localCTM.f = 0;

                const { 
                    x: newW,
                    y: newH
                } = pointTo(
                    localCTM, 
                    container, 
                    width,
                    height
                );

                const newWidth = Math.abs(newW),
                    newHeight = Math.abs(newH);

                attrs.push(
                    ['x', resX - (scaleX < 0 ? newWidth : 0)],
                    ['y', resY - (scaleY < 0 ? newHeight : 0)],
                    ['width', newWidth],
                    ['height', newHeight]
                );
            }
            break;
    
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

                localCTM.e = localCTM.f = 0;

                const { 
                    x: nRx,
                    y: nRy
                } = pointTo(
                    localCTM, 
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
            }
            break;
        
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
            }
            break;

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
            }
            break;
        
        case 'path': {

                const path = element.getAttribute('d');

                attrs.push(['d', resizePath(
                    {
                        path,
                        localCTM,
                        container
                    }
                )]);
            }
            break;

        default: {}
            break;
    }

    attrs.forEach(attr => {
        element.setAttribute(attr[0], attr[1]);
    });
}

function applyTransformToHandles(
    box, 
    handles, 
    normalLine, 
    data, 
    container
) {

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
        box.parentNode.parentNode
    );

    const attrs = {
        tl: pointTo(boxCTM, container, x, y),
        tr: pointTo(boxCTM, container, x + width, y),
        br: pointTo(boxCTM, container, x + width, y + height),
        bl: pointTo(boxCTM, container, x, y + height),
        tc: pointTo(boxCTM, container, x + hW, y),
        bc: pointTo(boxCTM, container, x + hW, y + height),
        ml: pointTo(boxCTM, container, x, y + hH),
        mr: pointTo(boxCTM, container, x + width, y + hH),
        //center: pointTo(boxCTM, container, x + hW, y + hH),
        rotator: {}
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

    x = x + (width < 0 ? width : 0);
    y = y + (height < 0 ? height : 0);

    const boxAttrs = {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height)
    };

    Object.keys(boxAttrs).forEach(attr => {
        box.setAttribute(attr, boxAttrs[attr]);
    });

    Object.keys(handles).forEach(key => {
        const hdl = handles[key];
        hdl.setAttribute('cx', attrs[key].x);
        hdl.setAttribute('cy', attrs[key].y);
    });
}

function isGroup(element) {
    return element.tagName.toLowerCase() === 'g';
}

function checkChildElements(element) {

    const arrOfElements = [];

    if (isGroup(element)) {

        element.childNodes.forEach(item => {

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

function createHandler(l, t) {

    const handler = createSVGElement('circle');
    
    const items = {
        cx: l,
        cy: t,
        r: '5',
        fill: 'rgba(0, 168, 255, 0.2)',
        stroke: '#00a8ff',
        'vector-effect': 'non-scaling-stroke'
    };

    Object.keys(items).map(key => {
        handler.setAttribute(key, items[key]);
    });

    return handler;
}