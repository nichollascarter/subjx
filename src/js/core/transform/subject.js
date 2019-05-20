import { Helper } from '../helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    isFunc,
    warn
} from '../util/util'

import {
    addClass,
    removeClass
} from '../util/css-util'

import {
    snapToGrid,
    RAD
} from './common'

export default class Subject {

    constructor(el, Observable) {

        if (this.constructor === Subject) {
            throw new TypeError('Cannot construct Subject instances directly');
        }

        this.el = el;
        this.storage = null;
        this.Ob = Observable;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._animate = this._animate.bind(this);
    }

    enable(options) {

        if (isUndef(this.storage)) {
            this._load(options);
            this._init(this.el);
        } else {
            warn('Already enabled');
        }
    }

    disable() {

        const {
            storage,
            el
        } = this;

        if (isUndef(storage)) return;

        // unexpected case
        if (storage.onExecution) {
            this._end();
            Helper(document).off('mousemove', this._onMouseMove)
                            .off('mouseup', this._onMouseUp)
                            .off('touchmove', this._onTouchMove)
                            .off('touchend', this._onTouchEnd);  
        }

        removeClass(el, 'dg-drag');
        this._destroy();

        delete this.storage;  
    }

    _init() {}

    _destroy() {}

    _drag() {}

    _resize() {}

    _rotate() {}

    _cursorPoint() {}

    _load(options) {

        const { el, Ob } = this;

        addClass(el, 'dg-drag');

        const _snap = {
            x: 10,
            y: 10,
            angle: 10 * RAD
        };

        const _each = {
            move: false,
            resize: false,
            rotate: false
        };

        let _showHandles = true,
            _restrict = null,
            _drop = function() {};

        let _container = el.parentNode;

        let _proportions = false;

        if (isDef(options)) {

            const { 
                snap, 
                each, 
                showHandles,
                restrict,
                drop,
                container,
                proportions
            } = options;

            if (isDef(snap)) {

                const { x, y, angle } = snap;

                _snap.x = isUndef(x) ? 10 : x;
                _snap.y = isUndef(y) ? 10 : y;
                _snap.angle = isUndef(angle) 
                                ? _snap.angle 
                                : angle * RAD;
            }
            
            if (isDef(each)) {

                const { move, resize, rotate } = each;

                _each.move = move || false;
                _each.resize = resize || false;
                _each.rotate = rotate || false; 
            }

            if (isDef(restrict)) {
                _restrict = restrict === 'parent'
                    ? el.parentNode
                    : Helper(restrict)[0] || document
            }
            
            _drop = isFunc(options.drop)
                    ? function(e) {
                        drop(e, el);
                    } 
                    : _drop;

            _showHandles = isUndef(showHandles) ||
                            showHandles === true;
                            
            _container = Helper(container)[0] || _container;

            _proportions = proportions || false;
        }

        this.storage = {
            showHandles: _showHandles,
            restrict: _restrict,
            container: _container,
            drop: _drop,
            snap: _snap,
            each: _each,
            proportions: _proportions
        };

        if (_each.move || _each.resize || _each.rotate) {
            Ob.subscribe('ongetstate', this);
            Ob.subscribe('onapply', this);
        }

        if (_each.move) {
            Ob.subscribe('onmove', this);
        }
        if (_each.resize) {
            Ob.subscribe('onresize', this);
        }
        if (_each.rotate) {
            Ob.subscribe('onrotate', this);
        }
    }

    _draw() {
        this._animate();
    }

    _animate() {

        const ctx = this;
        const { storage } = ctx;

        if (isUndef(storage)) return;

        storage.frame = requestAnimFrame(ctx._animate);

        if (!storage.doDraw) return;
        storage.doDraw = false; 

        let {
            e,
            handle,
            handles,
            cx,
            cy,
            nx,
            ny,
            pressang,
            clientX,
            clientY,
            center,
            snap,
            doDrag,
            doResize,
            doRotate,
            revX,
            revY
        } = storage;

        const { 
            move: moveEach, 
            resize: resizeEach, 
            rotate: rotateEach
        } = storage.each;

        if (doResize) {

            const { x, y } = this._pointToElement(
                {
                    x: clientX,
                    y: clientY
                }
            );

            let dx = snapToGrid(x - cx, snap.x),
                dy = snapToGrid(y - cy, snap.y);

            const dox = handle.is(handles.ml) || 
                handle.is(handles.mr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tr) ||
                handle.is(handles.bl) ||
                handle.is(handles.br);

            const doy = handle.is(handles.br) ||
                handle.is(handles.bl) ||
                handle.is(handles.bc) ||
                handle.is(handles.tr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tc);

            dx = dox ? (revX ? - dx : dx) : 0,
            dy =  doy ? (revY ? - dy : dy) : 0;

            ctx._resize(
                dx,
                dy
            );

            if (resizeEach) {

                ctx.Ob.notify('onresize',
                    ctx,
                    {
                        dx,
                        dy
                    }
                );
            }
        }

        if (doDrag) {

            const dx = snapToGrid(clientX - nx, snap.x),
                dy = snapToGrid(clientY - ny, snap.y);

            ctx._drag(
                dx,
                dy
            );

            if (moveEach) {
                ctx.Ob.notify('onmove',
                    ctx,
                    {
                        dx,
                        dy
                    }
                );
            }
        }

        if (doRotate) {

            const radians = Math.atan2(
                clientY - center.y, 
                clientX - center.x
            ) - pressang;

            ctx._rotate(
                snapToGrid(radians, snap.angle)
            );

            if (rotateEach) {
                ctx.Ob.notify('onrotate',
                    ctx,
                    {
                        radians
                    }
                );
            }
        }
    }

    _start(e) {

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }
    
        const { storage } = this; 
        const computed = this._compute(e);

        Object.keys(computed).forEach(prop => {
            storage[prop] = computed[prop];
        });

        const {
            onRightEdge,
            onBottomEdge,
            onTopEdge,
            onLeftEdge,
            handle,
            factor,
            revX,
            revY
        } = computed;
    
        const doResize = onRightEdge ||
                        onBottomEdge ||
                        onTopEdge ||
                        onLeftEdge;

        const doRotate = handle.is(storage.handles.rotator);

        const {
            clientX,
            clientY,
            ctrlKey
        } = e;

        const { 
            x, 
            y 
        } = this._cursorPoint(
            {
                clientX, 
                clientY
            }
        );

        const { 
            x: nx, 
            y: ny 
        } = this._pointToElement({ x, y });
        
        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.nx = x;
        storage.ny = y;
        storage.cx = nx;
        storage.cy = ny;
        storage.ctrlKey = ctrlKey;
        storage.doResize = doResize;
        storage.doDrag = !doRotate && !doResize;
        storage.doRotate = doRotate;
        storage.onExecution = true;

        this.Ob.notify(
            'ongetstate',
            this,
            {
                factor,
                revX,
                revY
            }
        );

        this._draw();
    }

    _moving(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }
        
        const { storage } = this;

        const { x, y } = this._cursorPoint(e);

        storage.clientX = x;
        storage.clientY = y;
        storage.doDraw = true;
    }
    
    _end(e) {

        if (isDef(e) && e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }

        const { storage } = this;

        const action = storage.doResize 
            ? 'resize' 
            : (storage.doDrag ? 'drag' : 'rotate');

        storage.doResize = false;
        storage.doDrag = false;
        storage.doRotate = false;
        storage.doDraw = false;
        storage.onExecution = false;

        this._apply(action);

        this.Ob.notify(
            'onapply',
            this,
            action
        );

        cancelAnimFrame(storage.frame);
        storage.drop.call(this, e);
    }

    _onMouseDown(e) {
        this._start(e);
        Helper(document).on('mousemove', this._onMouseMove)
                        .on('mouseup', this._onMouseUp);
    }

    _onTouchStart(e) {
        this._start(e.touches[0]);
        Helper(document).on('touchmove', this._onTouchMove)
                        .on('touchend', this._onTouchEnd);
    }

    _onMouseMove(e) {
        this._moving(
            e, 
            this.el
        );
    }

    _onTouchMove(e) {
        this._moving(
            e.touches[0], 
            this.el
        );
    }

    _onMouseUp(e) {
        Helper(document).off('mousemove', this._onMouseMove)
                        .off('mouseup', this._onMouseUp);  
        this._end(e, this.el);                                      
    }

    _onTouchEnd(e) {
        Helper(document).off('touchmove', this._onTouchMove)
                        .off('touchend', this._onTouchEnd);
        if (e.touches.length === 0) {
            this._end(e.changedTouches[0], this.el);
        }
    }

    onMove(data) {

        const { 
            dx,
            dy 
        } = data;

        this._drag(
            dx,
            dy
        );
    }

    onRotate(data) {

        const {
            snap
        } = this.storage;

        this._rotate(
            snapToGrid(data.radians, snap.angle)
        );
    }

    onResize(data) {

        const {
            dx,
            dy,
            dox,
            doy
        } = data;

        this._resize(
            dx,
            dy,
            dox,
            doy
        );
    }

    onApply(actionName) {
        this._apply(actionName);
    }
}