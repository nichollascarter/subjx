import { Helper } from '../helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    warn,
    isDef,
    isUndef,
    isFunc
} from '../util/util'

import {
   getOffset
} from '../util/css-util'


export default class Clone {

    constructor(el, options) {

        this.el = el;
        this.options = options || {};
        this.storage = null;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        this.enable();
    }

    enable() {
        if (isUndef(this.storage)) {
            this._init();
        }  else {
            warn('Already enabled');
        }
    }

    disable() {
        _destroy.call(this);
    }

    _init() {
        _init.call(this);
    }

    _draw(el) {
        _draw.call(this, el);
    }

    _onMouseDown(e) {
        _start.call(this, e);
        Helper(document).on('mousemove', this._onMouseMove)
                        .on('mouseup', this._onMouseUp);
    }

    _onMouseMove(e) {
        _move.call(this, e);
    }

    _onMouseUp(e) {
        _end.call(this, e);
        Helper(document).off('mousemove', this._onMouseMove)
                        .off('mouseup', this._onMouseUp);
    }

    _onTouchStart(e) {
        _start.call(this, e.touches[0]);
        Helper(document).on('touchmove', this._onTouchMove)
                        .on('touchend', this._onTouchEnd);
    }

    _onTouchMove(e) {
        _move.call(this, e.touches[0]);
    }

    _onTouchEnd(e) {

        if (e.touches.length === 0) {
            _end.call(this, e.changedTouches[0]);
        }
        Helper(document).off('touchmove', this._onTouchMove)
                        .off('touchend', this._onTouchEnd);
    }
}

function _init() {

    const ctx = this;

    const sel = ctx.el;
    const _sel = Helper(sel);

    const {
        style,
        drop,
        appendTo,
        stack
    } = ctx.options;

    let css = {
        width: _sel.css('width'),
        height: _sel.css('height'),
        margin: 0,
        padding: 0,
        position: 'absolute'
    };

    if (isUndef(style)) {
        css.border = '#32B5FE 1px dashed';
        css.background = 'transparent';
        css.transform = 'none';
    } else if (typeof style === 'object') {
        css = { ...style };
    }

    let onDrop = function() {};

    if (isFunc(drop)) {
        onDrop = function(evt) {
            const {
                clone,
                stack
            } = this.storage;

            let result = true;
            if (isDef(stack)) {
                result = objectsCollide(
                            clone, 
                            stack
                        );
            }
            if (result) {
                drop.call(this, evt, this.el, clone);
            }
        }
    }

    const storage = {
        onDrop,
        options: this.options,
        css,
        parent: Helper(appendTo || 'body')[0],
        stack: Helper(stack)[0]
    };

    ctx.storage = storage;

    _sel.on('mousedown', this._onMouseDown)
        .on('touchstart', this._onTouchStart);
}

function _start(e) {

    if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
    }
    
    const { 
        storage,
        el: sel
    } = this;

    const { 
        options,
        parent,
        css
    } = storage; 

    const clone = options.style === 'clone' 
                    ? sel.cloneNode(true)
                    : document.createElement('div');

    const offset = getOffset(parent);

    css.left = `${(e.pageX - offset.left)}px`;
    css.top = `${(e.pageY - offset.top)}px`;

    Helper(clone).css(css);

    storage.pageX = e.pageX;
    storage.pageY = e.pageY;
    storage.cx = e.pageX;
    storage.cy = e.pageY;
    storage.clone = clone;

    Helper(parent)[0].appendChild(clone);
    this._draw(clone);
}

function _move(e) {

    if (e.preventDefault) {
        e.preventDefault();
    }

    const { storage } = this;

    storage.pageX = e.pageX;
    storage.pageY = e.pageY;
    storage.doDraw = true;
    storage.doMove = true;
}

function _end(e) {

    if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
    }

    const { 
        storage
    } = this;

    const {
        clone,
        frameId,
        onDrop
    } = storage;

    storage.doDraw = false;
    cancelAnimFrame(frameId);

    if (isUndef(clone)) return;

    onDrop.call(this, e);
    clone.parentNode.removeChild(clone);

    delete storage.clone;
}

function _draw(clone) {

    const ctx = this;

    function animate() {

        const { storage } = ctx;

        storage.frameId = requestAnimFrame(animate);

        const {
            doDraw,
            pageX,
            pageY,
            cx,
            cy
        } = storage;

        if (!doDraw) return;
        storage.doDraw = false;

        const translate = `translate(${pageX - cx}px, ${pageY - cy}px)`;

        Helper(clone).css({
            transform: translate,
            webkitTranform: translate,
            mozTransform: translate,
            msTransform: translate,
            otransform: translate 
        });
    }

    animate();
}

function _destroy() {

    if (isUndef(this.storage)) return;
    Helper(this.el).off('mousedown', this._onMouseDown)
                    .off('touchstart', this._onTouchStart);
    delete this.storage;
}

function objectsCollide(a, b) {

    const { top: aTop, left: aLeft } = getOffset(a),
        { top: bTop, left: bLeft } = getOffset(b),
        _b = Helper(b);

    return !(
        (aTop < bTop) ||
        (aTop > (bTop + _b.css('height'))) ||
        (aLeft < bLeft) ||
        (aLeft > (bLeft + _b.css('width')))
    )
}