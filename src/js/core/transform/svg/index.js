import { Helper } from '../../helper'
import Subject from '../subject'

import { 
    parseTransform,
    getOffset
} from '../../util/css-util'

import {
    DEG,
    snapToGrid,
    snapCandidate,
    rotatedTopLeft,
    recalcPoint
} from '../common'

import {
    movePath,
    resizePath,
    setCoord,
    getFactor
} from './path'
import { isUndef } from '../../util/util';

const MIN_SIZE = 2; 
const ROT_OFFSET = 25;
const floatRE = /[+-]?\d+(\.\d+)?/g; 
const translateRE = /translate\(.*\)(.*)translate\(.*\)|$/;

export default class DraggableSVG extends Subject {

    constructor(el, options, Observable) {
        super(el, Observable);
        this.enable(options);
    }

    _init(item, options) {
        _init.call(this, item, options);
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

    _apply(actionName) {

        const {
            box, 
            handles,
            refang,
            factor,
            wrapper,
            cached,
            transform
        } = this.storage;

        const translate = parseTransform(wrapper.getAttribute('transform') || 'translate(0 0)').translate;

        const { x, y, width: newWidth, height: newHeight } = box.getBBox();

        const dx = translate[0],
            dy = translate[1],
            resultX = x + dx,
            resultY = y + dy;

        const centerX = resultX + newWidth / 2,
            centerY = resultY + newHeight / 2;

        if (actionName !== 'rotate') {

            applyTransformToHandles(box, handles, {
                x: resultX,
                y: resultY,
                width: newWidth,
                height: newHeight,
                angle: refang * factor
            });
        }

        if (actionName === 'drag') {

            if (dx === 0 && dy === 0) return;
                
            wrapper.removeAttribute('transform');

            const els = [];

            if (this.el.tagName.toLowerCase() === 'g') {

                this.el.childNodes.forEach(item => {
                    if (item.nodeType === 1) {
                        els.push(item);
                    }
                });

                this.el.removeAttribute('transform');
            } else {
                els.push(this.el);
            }

            els.forEach((element) => {
                applyTranslate(element, {
                    x: dx,
                    y: dy,
                    angle: refang * factor * DEG,
                    centerX,
                    centerY
                });
            })
        }

        if (actionName === 'resize') {

            if (isUndef(cached)) return;

            const els = [];

            const {
                revX, 
                revY,
                scaleX,
                scaleY,
                diffX,
                diffY
            } = cached;
                
            let isGroup = false;

            if (this.el.tagName.toLowerCase() === 'g') {
                this.el.childNodes.forEach(item => {
                    if (item.nodeType === 1) {
                        els.push(item);
                    }
                });
                isGroup = true;
            } else {
                els.push(this.el);
            }

            els.forEach((element) => {

                applyResize(element, {
                    scaleX,
                    scaleY,
                    diffX: diffX * getFactor(revX),
                    diffY: diffY * getFactor(revY),
                    revX,
                    revY,
                    angle: refang * factor,
                    factor,
                    centerX,
                    centerY,    
                    bBox: isGroup === true 
                            ? transform.bBox 
                            : element.getBBox(),
                    store: this.storage
                });
            });

            this.storage.cached = null;
        }
    }

    onRefreshState(data) {

        const store = this.storage;

        const recalc = refreshState.call(
            this,
            data
        );

        Object.keys(data).forEach(key => {
            store[key] = data[key];
        });

        Object.keys(recalc).forEach(key => {
            store[key] = recalc[key];
        });
    }
}

function _init(sel) {

    const wrapper = createSVG('g');
    sel.parentNode.appendChild(wrapper);

    const {
        width: w, 
        height: h, 
        x, 
        y
    } = sel.getBBox();

    const transform = sel.getAttribute('transform') || 'translate(0 0)';

    const box = createSVG('rect');

    const attrs = [
        ['width', w],
        ['height', h],
        ['x', x],
        ['y', y],
        ['fill', 'transparent'],
        ['stroke', '#00a8ff'],
        ['stroke-dasharray', '3 3'],
        ['transform', transform]
    ];

    attrs.forEach(item => {
        box.setAttribute(item[0], item[1]);
    });

    let group = createSVG('g');
        group.appendChild(box);

    wrapper.appendChild(group);

    const handles = {
        tl: [x, y],
        tr: [x + w, y],
        br: [x + w, y + h],
        bl: [x, y + h],
        tc: [x + w / 2, y],
        bc: [x + w / 2, y + h],
        ml: [x, y + h / 2],
        mr: [x + w, y + h / 2],
        rotator: [x + w / 2, y - ROT_OFFSET]
    };

    Object.keys(handles).forEach(key => {
        const data = handles[key];
        handles[key] = createHandler(data[0], data[1], transform);
        wrapper.appendChild(
            createSVG('g').appendChild(handles[key]).parentNode
        );
    });

    Object.assign(this.storage, {
        wrapper,
        box,
        handles,
        parent: wrapper.parentNode
    });

    Helper(wrapper).on('mousedown', this._onMouseDown)
                    .on('touchstart', this._onTouchStart);
}

function _compute(e) {

    const {
        box,
        handles,
        snap,
        parent
    } = this.storage;

    const handle = Helper(e.target);

    let factor = 1;

    //reverse axis
    const revX = handle.is(handles.tl) ||
                handle.is(handles.ml) ||
                handle.is(handles.bl) ||
                handle.is(handles.tc);

    const revY = handle.is(handles.tl) || 
                handle.is(handles.tr) || 
                handle.is(handles.tc) || 
                handle.is(handles.ml);

    //reverse angle
    if (handle.is(handles.tr) || 
        handle.is(handles.bl)
    ) { 
        factor = -1;
    }

    const tl_off = getOffset(handles.tl),
        tr_off = getOffset(handles.tr);
        
    const refang = Math.atan2(
        tr_off.top - tl_off.top, 
        tr_off.left - tl_off.left
    ) * factor;

    const bBox = box.getBBox();

    const { width: cw, height: ch, x: c_left, y: c_top } = bBox;
                                                                                                
    const coords = rotatedTopLeft(
        c_left,
        c_top,
        cw,
        ch,
        refang,
        revX,
        revY
    );

    const boxOffset = getOffset(box);

    const center_x = boxOffset.left + cw / 2,
        center_y = boxOffset.top + ch / 2;

    const pressang = Math.atan2(
        e.pageY - center_y,
        e.pageX - center_x
    );

    const onTopEdge = handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.tr),
        onLeftEdge = handle.is(handles.tl) || handle.is(handles.ml) || handle.is(handles.bl),
        onRightEdge = handle.is(handles.tr) || handle.is(handles.mr) || handle.is(handles.br),
        onBottomEdge = handle.is(handles.br) || handle.is(handles.bc) || handle.is(handles.bl);

    const transform = {
        orig: this.el.getAttribute('transform'),
        value: box.getAttribute('transform'),
        scaleX: revX ? cw + c_left : c_left,
        scaleY: revY ? ch + c_top : c_top,
        bBox
    };

    return {
        transform,
        parentScale: parseTransform(parent.getAttribute('transform') || 'scale(1 1)').scale,
        cw,
        ch,
        center: {
            x: boxOffset.left + cw / 2,
            y: boxOffset.top + ch / 2,
            left: c_left + cw / 2,
            top: c_top + ch / 2
        },
        left: snapCandidate(c_left, snap.x),
        top: snapCandidate(c_top, snap.y),
        coordX: coords.left,
        coordY: coords.top,
        factor,
        pressang,
        refang,
        revX,
        revY,
        handle,
        onTopEdge,
        onLeftEdge,
        onRightEdge,
        onBottomEdge
    }
}

function _destroy() {

    const { wrapper } = this.storage;

    Helper(wrapper).off('mousedown', this._onMouseDown)
                    .off('touchstart', this._onTouchStart);

    this.el.parentNode.removeChild(wrapper);
}

function refreshState(params) {

    const { 
        factor, 
        revX, 
        revY,
    } = params;

    const { 
        box,
        handles,
        snap
    } = this.storage;

    const tl_off = getOffset(handles.tl),
        tr_off = getOffset(handles.tr);

    let refang = Math.atan2(
        tr_off.y - tl_off.y, 
        tr_off.x - tl_off.x
    ) * factor;

    const bBox = box.getBBox();

    const { width: cw, height: ch, x: c_left, y: c_top } = bBox;
                                                                                                 
    const coords = rotatedTopLeft(
        c_left,
        c_top,
        cw,
        ch,
        refang,
        revX,
        revY
    );

    const boxOffset = getOffset(box);

    const transform = {
        orig: this.el.getAttribute('transform'),
        value: box.getAttribute('transform'),
        scaleX: revX ? cw + c_left : c_left,
        scaleY: revY ? ch + c_top : c_top,
        bBox
    };

    return {
        transform,
        cw,
        ch,
        center: {
            x: boxOffset.left + cw / 2,
            y: boxOffset.top + ch / 2,
            left: c_left + cw / 2,
            top: c_top + ch / 2
        },
        left: snapCandidate(c_left, snap.x),
        top: snapCandidate(c_top, snap.y),
        coordX: coords.left,
        coordY: coords.top,
        factor,
        refang
    }
}

function processResize(
    width,
    height,
    revX, 
    revY
) {

    const {
        box,
        handles,
        snap,
        left,
        top,
        coordX,
        coordY,
        refang,
        factor,
        cw,
        ch,
        transform
    } = this.storage;
        
    const sel = this.el;
        
    let newWidth = Number(box.getAttribute('width')),
        newHeight = Number(box.getAttribute('height'));

    if (width !== null) {
        newWidth = snapToGrid(width, snap.x);
    }

    if (height !== null) {
        newHeight = snapToGrid(height, snap.y);
    }

    if (Math.abs(newWidth) < MIN_SIZE || Math.abs(newHeight) < MIN_SIZE) return;

    const coords = rotatedTopLeft(
        left,
        top,
        newWidth,
        newHeight,
        refang,
        revX,
        revY
    );

    const resultY = top - (coords.top - coordY),
        resultX = left - (coords.left - coordX);

    applyTransformToHandles(box, handles, {
        x: resultX,
        y: resultY,
        width: newWidth,
        height: newHeight,
        angle: refang * factor
    });

    const scaleX = newWidth / cw,
        scaleY = newHeight / ch;

    this.storage.cached = {
        scaleX: scaleX,
        scaleY: scaleY,
        diffX: newWidth - cw,
        diffY: newHeight - ch,
        revX: revX,
        revY: revY
    };

    const { scaleX: ptX, scaleY: ptY } = transform;

    const scaleString = `translate(${ptX} ${ptY}) scale(${scaleX} ${scaleY}) translate(${-ptX} ${-ptY})`;

    if (sel.tagName.toLowerCase() === 'g') {
        sel.childNodes.forEach(element => {

            if (element.nodeType !== 1) return;

            const oldTransform = element.getAttribute('transform') || '';
            element.setAttribute(
                'transform', 
                oldTransform.replace(translateRE, scaleString)
            );
        });
    } else {
        const oldTransform = sel.getAttribute('transform') || '';
        sel.setAttribute(
            'transform', 
            oldTransform.replace(translateRE, scaleString)
        );
    }
}

function processMove(
    top,
    left
) {
    let {
        snap,
        transform,
        wrapper
    } = this.storage;

    const originTransform = transform.orig || '';
    
    const x = snapToGrid(left, snap.x),
        y = snapToGrid(top, snap.y);

    const transformString = `translate(${x} ${y})`;
    const newTransform = originTransform.replace(/translate\(.+\)|^/, transformString);

    wrapper.setAttribute('transform', transformString);
    this.el.setAttribute('transform', newTransform);
}

function processRotate(radians) {

    const {
        refang,
        snap,
        center,
        box,
        handles
    } = this.storage;

    const angle = snapToGrid(refang + radians, snap.angle);

    const transform = `rotate(${angle * DEG} ${center.left} ${center.top})`;

    box.setAttribute('transform', transform);

    Object.keys(handles).forEach(hdl => {
        handles[hdl].setAttribute('transform', transform);
    });

    if (this.el.tagName.toLowerCase() === 'g') {
        this.el.childNodes.forEach((element) => {
            if (element.nodeType !== 1) return;
            element.setAttribute('transform', transform);
        });
    } else {
        this.el.setAttribute('transform', transform);
    }
}

function createSVG(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function createHandler(l, t, transform) {

    const handler = createSVG('circle');
    
    const items = {
        cx: l,
        cy: t,
        r: 6,
        fill: 'white',
        stroke: '#00a8ff',
        transform: transform
    };

    Object.keys(items).map(key => {
        handler.setAttribute(key, items[key]);
    });

    return handler;
}

function applyTranslate(element, data) {

    const {
        x,
        y,
        angle,
        centerX,
        centerY
    } = data;

    const attrs = [
        ['transform', `rotate(${angle} ${centerX} ${centerY})`]
    ];

    switch(element.tagName.toLowerCase()) {

        case 'text':
        case 'rect': {

                let resX = Number(element.getAttribute('x')) + x,
                    resY = Number(element.getAttribute('y')) + y;

                attrs.push(
                    ['x', resX],
                    ['y', resY]
                );
            }
            break;

        case 'circle':
        case 'ellipse': {

                let resX = Number(element.getAttribute('cx')) + x,
                    resY = Number(element.getAttribute('cy')) + y;

                attrs.push(
                    ['cx', resX],
                    ['cy', resY]
                );
            }
            break;
        
        case 'line': {

                let resX1 = Number(element.getAttribute('x1')) + x,
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
                        x, 
                        y
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
        diffX,
        diffY,
        revX,
        revY,
        angle,
        centerX,
        centerY,
        bBox,
        store
    } = data;

    const {
        onRightEdge,
        onLeftEdge,
        onTopEdge,
        onBottomEdge,
        center
    } = store;

    const { 
        x: boxX, 
        y: boxY, 
        width: boxW, 
        height: boxH
    } = bBox;

    let fixedX = 0, 
        fixedY = 0;
    
    if (onRightEdge) {
        fixedX = boxX;
    } 
    if (onLeftEdge) {
        fixedX = boxX + boxW;
    } 
    if (onTopEdge) {
        fixedY = boxY + boxH;
    } 
    if (onBottomEdge) {
        fixedY = boxY;
    }

    const baseData = {
        centerX: center.left,
        centerY: center.top,
        newCenterX: centerX,
        newCenterY: centerY,
        angle: angle
    };

    const attrs = [
        ['transform', `rotate(${angle * DEG} ${centerX} ${centerY})`]
    ];

    switch(element.tagName.toLowerCase()) {

        case 'text': {

            const x = Number(element.getAttribute('x')),
                y = Number(element.getAttribute('y'));

            const { resX, resY } = recalcPoint({
                x: setCoord(x, diffX, fixedX, boxW),
                y: setCoord(y, diffY, fixedY, boxH),
                ...baseData
            });

            attrs.push(
                ['x', resX + (scaleX < 0 ? boxW : 0)],
                ['y', resY + (scaleY < 0 ? boxH : 0)]
            );
        }
        break;

        case 'circle': {

                const r = Number(element.getAttribute('r')),
                    cx = Number(element.getAttribute('cx')),
                    cy = Number(element.getAttribute('cy')),
                    newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

                const { resX, resY } = recalcPoint({
                    x: setCoord(cx, diffX, fixedX, boxW),
                    y: setCoord(cy, diffY, fixedY, boxH),
                    ...baseData
                });

                attrs.push(
                    ['r', newR],
                    ['cx', resX],
                    ['cy', resY]
                );
            }
            break;

        case 'rect': {

                const width = Number(element.getAttribute('width')),
                    height = Number(element.getAttribute('height')),
                    x = Number(element.getAttribute('x')),
                    y = Number(element.getAttribute('y'));

                const { resX, resY } = recalcPoint({
                    x: setCoord(x, diffX, fixedX, boxW),
                    y: setCoord(y, diffY, fixedY, boxH),
                    ...baseData
                });

                const newWidth = width * Math.abs(scaleX),
                    newHeight = height * Math.abs(scaleY);

                attrs.push(
                    ['x', resX - (scaleX < 0 ? newWidth : 0)],
                    ['y', resY - (scaleY < 0 ? newHeight : 0)],
                    ['width', newWidth],
                    ['height', newHeight]
                );
            }
            break;
    
        case 'ellipse': {

                const rx = Number(element.getAttribute('rx')),
                    ry = Number(element.getAttribute('ry')),
                    cx = Number(element.getAttribute('cx')),
                    cy = Number(element.getAttribute('cy'));

                const { resX, resY } = recalcPoint({
                    x: setCoord(cx, diffX, fixedX, boxW),
                    y: setCoord(cy, diffY, fixedY, boxH),
                    ...baseData
                });

                attrs.push(
                    ['rx', rx * Math.abs(scaleX)],
                    ['ry', ry * Math.abs(scaleY)],
                    ['cx', resX],
                    ['cy', resY]
                );
            }
            break;
        
        case 'line': {

                const resX1 = Number(element.getAttribute('x1')),
                    resY1 = Number(element.getAttribute('y1')),
                    resX2 = Number(element.getAttribute('x2')),
                    resY2 = Number(element.getAttribute('y2'));

                const { resX : resX1_, resY: resY1_  } = recalcPoint({
                    x: setCoord(resX1, diffX, fixedX, boxW),
                    y: setCoord(resY1, diffY, fixedY, boxH),
                    ...baseData
                });

                const { resX : resX2_, resY: resY2_  } = recalcPoint({
                    x: setCoord(resX2, diffX, fixedX, boxW),
                    y: setCoord(resY2, diffY, fixedY, boxH),
                    ...baseData
                });

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

                    const { resX, resY } = recalcPoint({
                        x: setCoord(Number(item[0]), diffX, fixedX, boxW),
                        y: setCoord(Number(item[1]), diffY, fixedY, boxH),
                        ...baseData
                    });

                    item[0] = resX;
                    item[1] = resY;

                    return item.join(' ');

                }).join(' ');

                attrs.push(['points', result]);
            }
            break;
        
        case 'path': {

                const path = element.getAttribute('d');

                attrs.push(['d', resizePath(
                    {
                        bBox,
                        path,
                        baseData,
                        dx: diffX, 
                        dy: diffY,
                        revX,
                        revY,
                        fixedX,
                        fixedY
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

function applyTransformToHandles(box, handles, data) {

    let { x, y, width, height, angle } = data;

    const halfWidth = width / 2,
        halfHeight = height / 2;

    const newTransform = `rotate(${angle * DEG} ${x + halfWidth} ${y + halfHeight})`;

    const attrs = {
        tl: [x, y],
        ml: [x, y + halfHeight],
        bl: [x, y + height],
        tc: [x + halfWidth, y],
        tr: [x + width, y],
        mr: [x + width, y + halfHeight],
        br: [x + width, y + height],
        bc: [x + halfWidth, y + height],
        rotator: [x + halfWidth, y - ROT_OFFSET + (height < 0 ? height : 0)]
    };

    x = x + (width < 0 ? width : 0);
    y = y + (height < 0 ? height : 0);

    const boxAttrs = {
        x: x,
        y: y,
        width: Math.abs(width),
        height: Math.abs(height),
        transform: newTransform
    };

    Object.keys(boxAttrs).forEach(attr => {
        box.setAttribute(attr, boxAttrs[attr]);
    });

    Object.keys(handles).forEach(key => {
        const hdl = handles[key];
        hdl.setAttribute('cx', attrs[key][0]);
        hdl.setAttribute('cy', attrs[key][1]);
        hdl.setAttribute('transform', newTransform);
    });
}

function parsePoints(pts) {
    return pts.match(floatRE).reduce((result, value, index, array) => {
        if (index % 2 === 0) {
            result.push(array.slice(index, index + 2));
        } 
        return result; 
    }, []);
}