import { Helper } from '../helper'
import Subject from './subject'

import { 
    addClass,
    getTransform,
    parseMatrix,
    getOffset
} from '../util/css-util'

import {
    snapToGrid,
    snapCandidate,
    rotatedTopLeft,
    toPX,
    fromPX,
    getUnitDimension,
    floatToFixed
} from './common'

const brackets = '<div class="dg-hdl dg-rotator"></div>\
        <div class="dg-hdl dg-hdl-t dg-hdl-l dg-hdl-tl"></div>\
        <div class="dg-hdl dg-hdl-t dg-hdl-r dg-hdl-tr"></div>\
        <div class="dg-hdl dg-hdl-b dg-hdl-r dg-hdl-br"></div>\
        <div class="dg-hdl dg-hdl-b dg-hdl-l dg-hdl-bl"></div>\
        <div class="dg-hdl dg-hdl-t dg-hdl-c dg-hdl-tc"></div>\
        <div class="dg-hdl dg-hdl-b dg-hdl-c dg-hdl-bc"></div>\
        <div class="dg-hdl dg-hdl-m dg-hdl-l dg-hdl-ml"></div>\
        <div class="dg-hdl dg-hdl-m dg-hdl-r dg-hdl-mr"></div>';

export default class Draggable extends Subject {

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

    _apply() {

        const {
            storage,
            el
        } = this;

        const _el = Helper(el);

        const {
            cached,
            parent,
            dimens,
            controls
        } = storage;

        if (!cached) return;

        const matrix = [...cached];

        const diffLeft = matrix[4];
        const diffTop = matrix[5];

        matrix[4] = 0;
        matrix[5] = 0;

        const css = matrixToCSS(matrix);

        const pW = parent.css('width'),
                pH = parent.css('height');

        const left = parseFloat(
            toPX(_el.css('left'), pW)
        );
        const top = parseFloat(
            toPX(_el.css('top'), pH)
        );               

        css.left = fromPX(
            left + diffLeft + 'px', 
            pW,
            dimens.left
        );

        css.top = fromPX(
            top + diffTop + 'px', 
            pH,
            dimens.top
        );

        _el.css(css);
        Helper(controls).css(css);

        this.storage.cached = null;
    }

    onRefreshState(data) {

        const store = this.storage;

        const recalc = refreshState.call(this,
            data.factor, 
            data.revX, 
            data.revY
        );

        Object.keys(recalc).forEach(key => {
            store[key] = recalc[key];
        });
    }
}

function _init(sel) {

    const wrapper = document.createElement('div');

    addClass(wrapper, 'dg-wrapper');
    sel.parentNode.insertBefore(wrapper, sel);

    const container = wrapper;
    const _sel = Helper(sel);

    const w = _sel.css('width'),
        h = _sel.css('height'),
        t = _sel.css('top'),
        l = _sel.css('left');

    const _parent = Helper(container.parentNode);

    const css = {
        top: t,
        left: l,
        width: toPX(w, _parent.css('width')),
        height: toPX(h, _parent.css('height')),
        transform: getTransform(_sel)
    };

    const controls = document.createElement('div');
    controls.innerHTML = brackets;

    addClass(controls, 'dg-controls');

    container.appendChild(controls);

    const _controls = Helper(controls);
    _controls.css(css);

    const _container = Helper(container);

    Object.assign(this.storage, {
        controls: controls,
        handles: {
            tl: _container.find('.dg-hdl-tl'),
            tr: _container.find('.dg-hdl-tr'),
            br: _container.find('.dg-hdl-br'),
            bl: _container.find('.dg-hdl-bl'),
            tc: _container.find('.dg-hdl-tc'),
            bc: _container.find('.dg-hdl-bc'),
            ml: _container.find('.dg-hdl-ml'),
            mr: _container.find('.dg-hdl-mr'),
            rotator: _container.find('.dg-rotator')
        },
        parent: _parent
    });

    _controls.on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
}

function _destroy() {

    const { controls } = this.storage;

    Helper(controls).off('mousedown', this._onMouseDown)
                    .off('touchstart', this._onTouchStart);

    this.el.parentNode.removeChild(controls.parentNode);
}

function _compute(e) {

    const {
        el,
        storage
    } = this;

    const {
        handles,
        controls: ctrls,
        parent,
        snap
    } = storage;

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

    const tl_off = getOffset(handles.tl[0]),
        tr_off = getOffset(handles.tr[0]);

    const refang = Math.atan2(
        tr_off.top - tl_off.top, 
        tr_off.left - tl_off.left
    ) * factor;

    const cw = parseFloat(
        toPX(ctrls.style.width, parent.css('width'))
    );
    const ch = parseFloat(
        toPX(ctrls.style.height, parent.css('height'))
    );

    const transform = parseMatrix(Helper(ctrls));

    //getting current coordinates considering rotation angle                                                                                                  
    const coords = rotatedTopLeft(
        transform[4],
        transform[5],
        cw,
        ch,
        refang,
        revX,
        revY
    );

    const offset_ = getOffset(ctrls);

    const center_x = offset_.left + cw / 2,
        center_y = offset_.top + ch / 2;

    const pressang = Math.atan2(
        e.pageY - center_y, 
        e.pageX - center_x
    );

    const _el = Helper(el);
    const styleList = el.style;

    const dimens = {
        top: getUnitDimension(styleList.top || _el.css('top')),
        left: getUnitDimension(styleList.left || _el.css('left')),
        width: getUnitDimension(styleList.width || _el.css('width')),
        height: getUnitDimension(styleList.height || _el.css('height'))
    };

    const parentTransform = parseMatrix(parent);

    return {
        parentScale: [parentTransform[0], parentTransform[3]],
        transform,
        cw,
        ch,
        center: {
            x: center_x,
            y: center_y
        },
        left: snapCandidate(transform[4], snap.x),
        top: snapCandidate(transform[5], snap.y),
        coordY: coords.top,
        coordX: coords.left,
        factor,
        pressang,
        refang,
        revX,
        revY,
        handle,
        onTopEdge: handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.tr),
        onLeftEdge: handle.is(handles.tl) || handle.is(handles.ml) || handle.is(handles.bl),
        onRightEdge: handle.is(handles.tr) || handle.is(handles.mr) || handle.is(handles.br),
        onBottomEdge: handle.is(handles.br) || handle.is(handles.bc) || handle.is(handles.bl),
        dimens
    }
}

function refreshState(factor, revX, revY) {

    const {
        controls: ctrls,
        handles,
        parent,
        snap
    } = this.storage;

    const tl_off = getOffset(handles.tl[0]),
        tr_off = getOffset(handles.tr[0]);

    const refang = Math.atan2(
        tr_off.top - tl_off.top,
        tr_off.left - tl_off.left
    ) * factor;

    const cw = parseFloat(
        toPX(ctrls.style.width, parent.css('width'))
    );
    const ch = parseFloat(
        toPX(ctrls.style.height, parent.css('height'))
    );

    const transform = parseMatrix(Helper(ctrls));

    //getting current coordinates considering rotation angle                                                                                                  
    const coords = rotatedTopLeft(
        transform[4],
        transform[5],
        cw,
        ch,
        refang,
        revX,
        revY
    );

    const _sel = Helper(this.el);
    const styleList = this.el.style;

    return {
        transform: transform,
        parentTransform: parseMatrix(parent),
        left: snapCandidate(transform[4], snap.x),
        top: snapCandidate(transform[5], snap.y),
        coordX: coords.left,
        coordY: coords.top,
        refang: refang,
        cw: cw,
        ch: ch,
        dimens: {
            top: getUnitDimension(styleList.top || _sel.css('top')),
            left: getUnitDimension(styleList.left || _sel.css('left')),
            width: getUnitDimension(styleList.width || _sel.css('width')),
            height: getUnitDimension(styleList.height || _sel.css('height'))
        }
    }
}

function processResize(
    width,
    height,
    revX, 
    revY
) {

    const {
        el,
        storage
    } = this;

    const {
        controls,
        snap,
        left,
        top,
        coordX,
        coordY,
        refang,
        dimens,
        parent,
        transform
    } = storage;

    const { style } = controls;

    if (width !== null) {
        style.width = `${snapToGrid(width, snap.x)}px`;
    }

    if (height !== null) {
        style.height = `${snapToGrid(height, snap.y)}px`;
    }

    const coords = rotatedTopLeft(
        left,
        top,
        style.width,
        style.height,
        refang,
        revX,
        revY
    );

    const resultY = top - (coords.top - coordY),
        resultX = left - (coords.left - coordX);

    const matrix = [...transform];

    matrix[4] = resultX;
    matrix[5] = resultY;
    
    const css = matrixToCSS(matrix);

    Helper(controls).css(css);

    css.width = fromPX(
        style.width, 
        parent.css('width'), 
        dimens.width
    );

    css.height = fromPX(
        style.height, 
        parent.css('height'), 
        dimens.height
    );

    Helper(el).css(css);

    storage.cached = matrix;
}

function processMove(
    top,
    left
) {
    const {
        el,
        storage
    } = this;

    const {
        controls,
        transform,
        snap
    } = storage;

    const matrix = [...transform];

    matrix[4] = snapToGrid(transform[4] + left, snap.x);
    matrix[5] = snapToGrid(transform[5] + top, snap.y);
        
    const css = matrixToCSS(matrix);

    Helper(controls).css(css);
    Helper(el).css(css);

    storage.cached = matrix;
}

function processRotate(radians) {

    const {
        el,
        storage
    } = this;

    const {
        controls,
        transform,
        refang,
        snap
    } = storage;

    const matrix = [...transform];

    const angle = snapToGrid(refang + radians, snap.angle);

    //rotate(Xdeg) = matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
    matrix[0] = floatToFixed(Math.cos(angle));
    matrix[1] = floatToFixed(Math.sin(angle));
    matrix[2] = - floatToFixed(Math.sin(angle));
    matrix[3] = floatToFixed(Math.cos(angle));

    const css = matrixToCSS(matrix);

    Helper(controls).css(css);
    Helper(el).css(css);

    storage.cached = matrix;
}

function matrixToCSS(arr) {

    const style = `matrix(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style                     
    }
}