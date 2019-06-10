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
   getOffset,
   objectsCollide
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
        this._animate = this._animate.bind(this);

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

        const ctx = this;

        const sel = ctx.el;
        const _sel = Helper(sel);

        const {
            style,
            onDrop,
            appendTo,
            stack
        } = ctx.options;

        const css = {
            position: 'absolute',
            'z-index': '2147483647'
        };

        if (isDef(style) && typeof style === 'object') {
            Object.assign(css, style);
        }

        const dropZone = isDef(stack) 
                        ? Helper(stack)[0] 
                        : document;

        const _onDrop = isFunc(onDrop)
            ? function(evt) {

                const {
                    clone
                } = this.storage;

                const result = objectsCollide(
                    clone,
                    dropZone
                );

                if (result) {
                    onDrop.call(this, evt, this.el, clone);
                }
            }
            : () => {};

        ctx.storage = {
            onDrop: _onDrop,
            options: this.options,
            css,
            parent: Helper(appendTo)[0] || document.body,
            stack: dropZone
        };

        _sel.on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
    }

    _start(e) {

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }
        
        const { 
            storage,
            el
        } = this;
    
        const {
            parent,
            css
        } = storage; 
    
        const offset = getOffset(parent);
    
        const { 
            clientX, 
            clientY 
        } = e; 
    
        css.left = `${(clientX - offset.left)}px`;
        css.top = `${(clientY - offset.top)}px`;
    
        const clone = el.cloneNode(true);
        Helper(clone).css(css);
    
        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.cx = clientX;
        storage.cy = clientY;
        storage.clone = clone;
    
        Helper(parent)[0].appendChild(clone);
        this._draw();
    }

    _move(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }
    
        const { storage } = this;
    
        storage.clientX = e.clientX;
        storage.clientY = e.clientY;
        storage.doDraw = true;
        storage.doMove = true;
    }
    
    _end(e) {
    
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
    
    _draw() {
        this._animate();
    }

    _animate() {

        const { storage } = this;
    
        storage.frameId = requestAnimFrame(this._animate);

        const {
            doDraw,
            clientX,
            clientY,
            cx,
            cy,
            clone
        } = storage;

        if (!doDraw) return;
        storage.doDraw = false;

        const translate = `translate(${clientX - cx}px, ${clientY - cy}px)`;

        Helper(clone).css({
            transform: translate,
            webkitTranform: translate,
            mozTransform: translate,
            msTransform: translate,
            otransform: translate 
        });
    }
    
    _destroy() {
    
        if (isUndef(this.storage)) return;
        Helper(this.el)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);
        delete this.storage;
    }

    _onMouseDown(e) {
        this._start(e);
        Helper(document)
            .on('mousemove', this._onMouseMove)
            .on('mouseup', this._onMouseUp);
    }

    _onMouseMove(e) {
        this._move(e);
    }

    _onMouseUp(e) {
        this._end(e);
        Helper(document)
            .off('mousemove', this._onMouseMove)
            .off('mouseup', this._onMouseUp);
    }

    _onTouchStart(e) {
        this._start(e.touches[0]);
        Helper(document)
            .on('touchmove', this._onTouchMove)
            .on('touchend', this._onTouchEnd);
    }

    _onTouchMove(e) {
        this._move(e.touches[0]);
    }

    _onTouchEnd(e) {

        if (e.touches.length === 0) {
            this._end(e.changedTouches[0]);
        }
        Helper(document)
            .off('touchmove', this._onTouchMove)
            .off('touchend', this._onTouchEnd);
    }
}