import { Helper } from '../helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    isFunc
} from '../util/util'

import {
    addClass,
    removeClass
} from '../util/css-util'

import {
    getRotatedPoint,
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

        removeClass(el, 'dg-drag');
        this._destroy(); 

        delete this.storage;  
    }

    _load(options) {
        loadOptions.call(this, options);
    }

    _draw() {

        const ctx = this;
    
        function animate() {
    
            const store = ctx.storage;
    
            store.frame = requestAnimFrame(animate);
    
            if (!store.doDraw) return;
            store.doDraw = false;
    
            let { 
                handle,
                handles,
                cx,
                cy,
                ch,
                cw,
                refang,
                pressang,
                pageX,
                pageY,
                center,
                snap,
                parentScale
            } = store;
    
            const scaleX = parentScale[0],
                scaleY = parentScale[1];
    
            let { 
                    move: moveEach, 
                    resize: resizeEach, 
                    rotate: rotateEach
                } = store.each;
    
            if (store.doResize) {
    
                let revX, revY, x, y, pos;
    
                let width = null,
                    height = null;
    
                if (handle.is(handles.br) || handle.is(handles.mr)) {
    
                    pos = getRotatedPoint(
                        cx, 
                        cy,
                        pageX,
                        pageY,
                        refang,
                        false, 
                        false
                    );
    
                    pageY = pos.top;
                    pageX = pos.left;
    
                    y = (pageY - cy) / scaleY;
                    x = (pageX - cx) / scaleX;
    
                    let doy = handle.is(handles.br);
    
                    if (doy) { height = y + ch; }
                    width = x + cw;
    
                    revX = false;
                    revY = false;
    
                } else if (handle.is(handles.tl) || handle.is(handles.ml)) {
    
                    pos = getRotatedPoint(
                        cx, 
                        cy, 
                        pageX, 
                        pageY, 
                        refang, 
                        false, 
                        false
                    );
    
                    pageY = pos.top;
                    pageX = pos.left;
    
                    y = - (pageY - cy) / scaleY;
                    x = - (pageX - cx) / scaleX;
    
                    let doy = handle.is(handles.tl);
    
                    width = x + cw;
                    if (doy) { height = y + ch; }
    
                    revX = true;
                    revY = true;
    
                } else if (handle.is(handles.tr) || handle.is(handles.tc)) {
    
                    let dox = handle.is(handles.tr);
                    let doy = handle.is(handles.tc);
    
                    pos = getRotatedPoint(
                        cx, 
                        cy, 
                        pageX, 
                        pageY, 
                        refang, 
                        dox, 
                        false
                    );
    
                    pageY = pos.top;
                    pageX = pos.left;
    
                    y = - (pageY - cy) / scaleY;
                    x = - (pageX - cx) / scaleX;
    
                    if (dox) { y = -y; }
    
                    height = y + ch;
                    if (dox) { width = x + cw; }
    
                    revX = doy;
                    revY = true;
    
                } else if (handle.is(handles.bl) || handle.is(handles.bc)) {
    
                    let dox = handle.is(handles.bl);
    
                    pos = getRotatedPoint(
                        cx, 
                        cy, 
                        pageX, 
                        pageY, 
                        refang, 
                        false, 
                        dox
                    );
    
                    pageY = pos.top;
                    pageX = pos.left;
    
                    y = (pageY - cy) / scaleY;
                    x = - (pageX - cx) / scaleX;
    
                    height = y + ch;
                    if (dox) { width = x + cw; }
    
                    revX = dox;
                    revY = false;
                }
    
                ctx._resize(
                    width,
                    height,
                    revX,
                    revY,
                    x,
                    y
                );
    
                if (resizeEach) { 
                    ctx.Ob.notify('onresize',
                        ctx,
                        {
                            width: width,
                            height: height,
                            x: x,
                            y: y,
                            revX: revX,
                            revY: revY,
                            snap: snap
                        }
                    );
                }
            }
    
            if (store.doDrag) {
    
                const diffTop = (pageY - cy) / scaleY, 
                    diffLeft = (pageX - cx) / scaleX; 

                ctx._drag(
                    diffTop, 
                    diffLeft,
                );
    
                if (moveEach) {
                    ctx.Ob.notify('onmove',
                        ctx,
                        {
                            diffTop: diffTop,
                            diffLeft: diffLeft
                        }
                    );
                }
            }
    
            if (store.doRotate) {
    
                const radians = Math.atan2(
                    pageY - center.y, 
                    pageX - center.x
                ) - pressang;
    
                ctx._rotate(
                    radians
                );
    
                if (rotateEach) {
                    ctx.Ob.notify('onrotate',
                        ctx,
                        {
                            radians: radians
                        }
                    );
                }
            }
        }
        animate();
    }

    _start(e) {

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }
    
        const store = this.storage; 
        const computed = this._compute(e);

        store.pageX = e.pageX;
        store.pageY = e.pageY;
        store.cx = e.pageX;
        store.cy = e.pageY;
        store.ctrlKey = e.ctrlKey;

        Object.keys(computed).forEach(prop => {
            store[prop] = computed[prop];
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

        const doRotate = handle.is(store.handles.rotator);
        
        store.doResize = doResize;
        store.doDrag = !doRotate && !doResize;
        store.doRotate = doRotate;

        if (this.Ob) {
            this.Ob.notify(
                'onrefreshstate',
                this,
                {
                    factor,
                    revX,
                    revY,
                    onTopEdge,
                    onLeftEdge,
                    onRightEdge,
                    onBottomEdge
                }
            );
        }

        this._draw();
    }

    _moving(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }
        
        const store = this.storage;
        store.pageX = e.pageX;
        store.pageY = e.pageY;
        store.doDraw = true;
    }
    
    _end(e) {

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }

        const store = this.storage;

        const action = store.doResize ? 'resize' : (store.doDrag ? 'drag' : 'rotate');

        store.doResize = false;
        store.doDrag = false;
        store.doRotate = false;
        store.doDraw = false;

        this._apply(action);

        if (this.Ob) {
            this.Ob.notify(
                'onapply',
                this,
                action
            );
        }

        cancelAnimFrame(store.frame);
        store.drop.call(this, e);
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
        this._moving(e, this.el);
    }

    _onTouchMove(e) {
        this._moving(e.touches[0], this.el);
    }

    _onMouseUp(e) {
        this._end(e, this.el);
        Helper(document).off('mousemove', this._onMouseMove)
                        .off('mouseup', this._onMouseUp);                        
    }

    _onTouchEnd(e) {
        if (e.touches.length === 0) {
            this._end(e.changedTouches[0], this.el);
        }
        Helper(document).off('touchmove', this._onTouchMove)
                        .off('touchend', this._onTouchEnd);

    }

    onMove(data) {

        this._drag(
            data.diffTop, 
            data.diffLeft
        );
    }

    onRotate(data) {

        this._rotate(
            data.radians
        );
    }

    onResize(data) {
    
        const w = data.width !== null ? this.storage.cw + data.x : null;
        const h = data.height !== null ? this.storage.ch + data.y : null;

       this._resize(
            w,
            h,
            data.revX,
            data.revY
        );
    }

    onApply(actionName) {
        this._apply(actionName);
    }
}

function loadOptions(options) {

    addClass(this.el, 'dg-drag');


    let snap = {
        x: 10,
        y: 10,
        angle: 10 * RAD
    };

    let each = {
        move: false,
        resize: false,
        rotate: false
    }

    if (isDef(options)) {

        if (isDef(options.snap)) {

            const { x, y, angle } = options.snap;

            snap.x = isUndef(x) ? 10 : x;
            snap.y = isUndef(y) ? 10 : y;
            snap.angle = isUndef(angle) ? 10 * RAD : angle * RAD;
        }
        
        if (isDef(options.each)) {

            const { move, resize, rotate } = options.each;

            each.move = move || false;
            each.resize = resize || false;
            each.rotate = rotate || false; 
        }    
    }

    const Ob = this.Ob;

    if (each.move || each.resize || each.rotate) {
        Ob.subscribe('onrefreshstate', this);
        Ob.subscribe('onapply', this);
    }

    if (each.move) {
        Ob.subscribe('onmove', this);
    }
    if (each.resize) {
        Ob.subscribe('onresize', this);
    }
    if (each.rotate) {
        Ob.subscribe('onrotate', this);
    }

    this.storage = {
        drop: options && isFunc(options.drop) 
                ? drop = function(e) {
                    store.drop(e, this.el);
                } 
                : function() {},
        snap,
        each
    };
}