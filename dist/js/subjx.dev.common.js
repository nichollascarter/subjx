/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2020
* Karen Sarksyan
* nichollascarter@gmail.com
*/
'use strict';

const requestAnimFrame = 
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        return setTimeout(f, 1000 / 60);
    };

const cancelAnimFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (requestID) {
        clearTimeout(requestID);
    };

const {
    forEach,
    slice: arrSlice,
    map: arrMap,
    reduce: arrReduce
} = Array.prototype;
/* eslint-disable no-console */
const { warn } = console;
/* eslint-disable no-console */

const isDef = val => val !== undefined && val !== null;

const isUndef = val => val === undefined || val === null;

const isFunc = val => typeof val === 'function';

const createMethod = (fn) => {
    return isFunc(fn)
        ? function () {
            fn.call(this, ...arguments);
        }
        : () => { };
};

class Helper {

    constructor(params) {
        if (typeof params === 'string') {
            const selector = document.querySelectorAll(params);
            this.length = selector.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = selector[count];
            }
        } else if (typeof params === 'object' &&
            (params.nodeType === 1 || params === document)) {
            this[0] = params;
            this.length = 1;
        } else if (params instanceof Helper) {
            this.length = params.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = params[count];
            }
        } else if (isIterable(params)) {
            this.length = 0;
            for (let count = 0; count < this.length; count++) {
                if (params.nodeType === 1) {
                    this[count] = params[count];
                    this.length++;
                }
            }
        } else {
            throw new Error(`Passed parameter must be selector/element/elementArray`);
        }
    }

    css(prop) {
        const _getStyle = obj => {
            let len = obj.length;

            while (len--) {
                if (obj[len].currentStyle) {
                    return obj[len].currentStyle[prop];
                } else if (document.defaultView && document.defaultView.getComputedStyle) {
                    return document.defaultView.getComputedStyle(obj[len], '')[prop];
                } else {
                    return obj[len].style[prop];
                }
            }
        };

        const _setStyle = (obj, options) => {
            let len = obj.length;

            while (len--) {
                for (const property in options) {
                    obj[len].style[property] = options[property];
                }
            }
            return obj.style;
        };

        const methods = {
            setStyle(options) {
                return _setStyle(this, options);
            },
            getStyle() {
                return _getStyle(this);
            }
        };

        if (typeof prop === 'string') {
            return methods.getStyle.apply(this, arrSlice.call(arguments, 1));
        } else if (typeof prop === 'object' || !prop) {
            return methods.setStyle.apply(this, arguments);
        } else {
            warn(`Method ${prop} does not exist`);
        }
        return false;
    }

    on() {
        let len = this.length;

        while (len--) {
            if (!this[len].events) {
                this[len].events = {};
                this[len].events[arguments[0]] = [];
            }

            if (typeof (arguments[1]) !== 'string') {
                if (document.addEventListener) {
                    this[len].addEventListener(
                        arguments[0], 
                        arguments[1], 
                        arguments[2] || { passive: false }
                    );
                } else if (document.attachEvent) {
                    this[len].attachEvent(`on${arguments[0]}`, arguments[1]);
                } else {
                    this[len][`on${arguments[0]}`] = arguments[1];
                }
            } else {
                listenerDelegate(
                    this[len], 
                    arguments[0], 
                    arguments[1], 
                    arguments[2], 
                    arguments[3], 
                    true
                );
            }
        }
        return this;
    }

    off() {
        let len = this.length;

        while (len--) {
            if (!this[len].events) {
                this[len].events = {};
                this[len].events[arguments[0]] = [];
            }

            if (typeof (arguments[1]) !== 'string') {
                if (document.removeEventListener) {
                    this[len].removeEventListener(arguments[0], arguments[1], arguments[2]);
                } else if (document.detachEvent) {
                    this[len].detachEvent(`on${arguments[0]}`, arguments[1]);
                } else {
                    this[len][`on${arguments[0]}`] = null;
                }
            } else {
                listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], arguments[3], false);
            }
        }

        return this;
    }

    is(selector) {
        if (isUndef(selector)) return false;
        
        const _sel = helper(selector);
        let len = this.length;

        while (len--) {
            if (this[len] === _sel[len]) return true;
        }
        return false;
    }

}

function listenerDelegate(el, evt, sel, handler, options, act) {
    const doit = function (event) {
        let t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    };

    if (act === true) {
        if (document.addEventListener) {
            el.addEventListener(evt, doit, options || { passive: false });
        } else if (document.attachEvent) {
            el.attachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = doit;
        }
    } else {
        if (document.removeEventListener) {
            el.removeEventListener(evt, doit, options || { passive: false });
        } else if (document.detachEvent) {
            el.detachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = null;
        }
    }
}

function isIterable(obj) {
    return isDef(obj) &&
        typeof obj === 'object' &&
        (
            Array.isArray(obj) ||
            (
                isDef(window.Symbol) &&
                typeof obj[window.Symbol.iterator] === 'function'
            ) ||
            isDef(obj.forEach) ||
            (
                typeof (obj.length) === "number" &&
                (obj.length === 0 ||
                    (obj.length > 0 &&
                        (obj.length - 1) in obj)
                )
            )
        );
}

function helper(params) {
    return new Helper(params);
}

class Observable {

    constructor() {
        this.observers = {};
    }

    subscribe(eventName, sub) {
        const obs = this.observers;

        if (isUndef(obs[eventName])) {
            Object.defineProperty(obs, eventName, {
                value: []
            });
        }

        obs[eventName].push(sub);

        return this;
    }

    unsubscribe(eventName, f) {
        const obs = this.observers;

        if (isDef(obs[eventName])) {
            const index = obs[eventName].indexOf(f);
            obs[eventName].splice(index, 1);
        }

        return this;
    }

    notify(eventName, source, data) {
        if (isUndef(this.observers[eventName])) return;

        this.observers[eventName].forEach(observer => {
            if (source === observer) return;
            switch (eventName) {

                case 'onmove':
                    observer.notifyMove(data);
                    break;
                case 'onrotate':
                    observer.notifyRotate(data);
                    break;
                case 'onresize':
                    observer.notifyResize(data);
                    break;
                case 'onapply':
                    observer.notifyApply(data);
                    break;
                case 'ongetstate':
                    observer.notifyGetState(data);
                    break;
            
            }
        });
    }

}

class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(cb) {
        this.callbacks.push(cb);
    }

    removeCallback(cb) {
        const ix = this.callbacks(cb);
        this.callbacks.splice(ix, 1);
    }

}

class EventDispatcher {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName) {
        this.events[eventName] = new Event(eventName);
    }

    emit(ctx, eventName, eventArgs) {
        this.events[eventName].callbacks.forEach((cb) => {
            cb.call(ctx, eventArgs);
        });
    };
    
    addEventListener(eventName, cb) {
        this.events[eventName].registerCallback(cb);
    }

    removeEventListener(eventName, cb) {
        this.events[eventName].removeCallback(cb);
    }

}

class SubjectModel {

    constructor(el) {
        this.el = el;
        this.storage = null;
        this.proxyMethods = null;

        this.eventDispatcher = new EventDispatcher();

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._animate = this._animate.bind(this);
    }

    enable(options) {
        this._processOptions(options);
        this._init(this.el);
        this.proxyMethods.onInit.call(this, this.el);
    }

    disable() {
        throwNotImplementedError();
    }

    _init() {
        throwNotImplementedError();
    }

    _destroy() {
        throwNotImplementedError();
    }
    
    _processOptions() {
        throwNotImplementedError();
    }

    _start() {
        throwNotImplementedError();
    }

    _moving() {
        throwNotImplementedError();
    }

    _end() {
        throwNotImplementedError();
    }

    _animate() {
        throwNotImplementedError();
    }

    _drag({ dx, dy, ...rest }) {
        const transform = this._processMove(dx, dy);

        const finalArgs = {
            dx,
            dy,
            transform,
            ...rest
        };

        this.proxyMethods.onMove.call(this, finalArgs);
        this._emitEvent('drag', finalArgs);
    }

    _draw() {
        this._animate();
    }

    _onMouseDown(e) {
        this._start(e);
        helper(document)
            .on('mousemove', this._onMouseMove)
            .on('mouseup', this._onMouseUp);
    }

    _onTouchStart(e) {
        this._start(e.touches[0]);
        helper(document)
            .on('touchmove', this._onTouchMove)
            .on('touchend', this._onTouchEnd);
    }

    _onMouseMove(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(
            e,
            this.el
        );
    }

    _onTouchMove(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(
            e.touches[0],
            this.el
        );
    }

    _onMouseUp(e) {
        helper(document)
            .off('mousemove', this._onMouseMove)
            .off('mouseup', this._onMouseUp);

        this._end(
            e,
            this.el
        );
    }

    _onTouchEnd(e) {
        helper(document)
            .off('touchmove', this._onTouchMove)
            .off('touchend', this._onTouchEnd);

        if (e.touches.length === 0) {
            this._end(
                e.changedTouches[0],
                this.el
            );
        }
    }

    _emitEvent() {
        this.eventDispatcher.emit(this, ...arguments);
    }

    on(name, cb) {
        this.eventDispatcher.addEventListener(name, cb);
        return this;
    }

    off(name, cb) {
        this.eventDispatcher.removeEventListener(name, cb);
        return this;
    }

}

const throwNotImplementedError = () => {
    throw Error(`Method not implemented`);
};

const MIN_SIZE = 2;
const THEME_COLOR = '#00a8ff';

const EVENTS = [
    'dragStart',
    'drag',
    'dragEnd',
    'resizeStart',
    'resize',
    'resizeEnd',
    'rotateStart',
    'rotate',
    'rotateEnd',
    'setPointStart',
    'setPointEnd'
];

const cssPrefixes = [
    '-webkit-',
    '-moz-',
    '-ms-',
    '-o-'
];

const RAD = Math.PI / 180;

const snapCandidate = (value, gridSize) => {
    if (gridSize === 0) return value;
    return Math.round(value / gridSize) * gridSize;
};

const snapToGrid = (value, snap) => {
    if (snap === 0) {
        return value;
    } else {
        const result = snapCandidate(value, snap);

        if (result - value < snap) {
            return result;
        }
    }
};

const floatToFixed = (val, size = 6) => {
    return Number(val.toFixed(size));
};

const getMinMaxOf2DIndex = (arr, idx) => {
    const axisValues = arr.map(e => e[idx]);
    return [
        Math.min(...axisValues),
        Math.max(...axisValues)
    ];
};

const getOffset = node => node.getBoundingClientRect();

const addClass = (node, cls) => {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(cl => {
                return node.classList.add(cl);
            });
        } else {
            return node.classList.add(cls);
        }
    }
    return node;
};

const removeClass = (node, cls) => {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(cl => {
                return node.classList.remove(cl);
            });
        } else {
            return node.classList.remove(cls);
        }
    }
    return node;
};

const objectsCollide = (a, b) => {
    const {
            top: aTop,
            left: aLeft
        } = getOffset(a),
        {
            top: bTop,
            left: bLeft
        } = getOffset(b),
        _a = helper(a),
        _b = helper(b);

    return !(
        ((aTop < bTop) ||
            (aTop + parseFloat(_a.css('height'))) > (bTop + parseFloat(_b.css('height')))) ||
        ((aLeft < bLeft) ||
            (aLeft + parseFloat(_a.css('width'))) > (bLeft + parseFloat(_b.css('width'))))
    );
};

const matrixToCSS = (arr) => {
    const style = `matrix3d(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
    };
};

const getStyle = (el, property) => {
    const style = window.getComputedStyle(el);
    let value = null;

    for (const prefix of cssPrefixes) {
        value = style.getPropertyValue(`${prefix}${property}`) || value;
        if (value) break;
    }

    return value;
};

class Transformable extends SubjectModel {

    constructor(el, options, observable) {
        super(el);
        if (this.constructor === Transformable) {
            throw new TypeError('Cannot construct Transformable instances directly');
        }
        this.observable = observable;

        EVENTS.forEach((eventName) => {
            this.eventDispatcher.registerEvent(eventName);
        });

        this.enable(options);
    }

    _cursorPoint() {
        throw Error(`'_cursorPoint()' method not implemented`);
    }

    _rotate({ radians, ...rest }) {
        const resultMtrx = this._processRotate(radians);
        const finalArgs = {
            transform: resultMtrx,
            delta: radians,
            ...rest
        };
        this.proxyMethods.onRotate.call(this, finalArgs);
        this._emitEvent('rotate', finalArgs);
    }

    _resize({ dx, dy, ...rest }) {
        const finalValues = this._processResize(dx, dy);
        const finalArgs = {
            ...finalValues,
            dx,
            dy,
            ...rest
        };
        this.proxyMethods.onResize.call(this, finalArgs);
        this._emitEvent('resize', finalArgs);
    }

    _processOptions(options) {
        const { el } = this;

        addClass(el, 'sjx-drag');

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

        let _restrict = null,
            _proportions = false,
            _axis = 'xy',
            _cursorMove = 'auto',
            _cursorResize = 'auto',
            _cursorRotate = 'auto',
            _rotationPoint = false,
            _draggable = true,
            _resizable = true,
            _rotatable = true,
            _scalable = false,
            _applyTranslate = false,
            _rotatorAnchor = null,
            _rotatorOffset = 50,
            _showNormal = true,
            _custom = null,
            _onInit = () => { },
            _onMove = () => { },
            _onRotate = () => { },
            _onResize = () => { },
            _onDrop = () => { },
            _onDestroy = () => { };

        let _container = el.parentNode;

        if (isDef(options)) {
            const {
                snap,
                each,
                axis = 'xy',
                cursorMove = 'auto',
                cursorResize = 'auto',
                cursorRotate = 'auto',
                rotationPoint = false,
                restrict,
                draggable = true,
                resizable = true,
                rotatable = true,
                scalable = false,
                applyTranslate = false,
                onInit,
                onDrop,
                onMove,
                onResize,
                onRotate,
                onDestroy,
                container,
                proportions = false,
                custom,
                rotatorAnchor,
                rotatorOffset = 50,
                showNormal = true
            } = options;

            if (isDef(snap)) {
                const { 
                    x = 10, 
                    y = 10, 
                    angle 
                } = snap;

                _snap.x = x;
                _snap.y = y;
                _snap.angle = isUndef(angle)
                    ? _snap.angle
                    : angle * RAD;
            }

            if (isDef(each)) {
                const { 
                    move = false, 
                    resize = false, 
                    rotate = false
                } = each;

                _each.move = move;
                _each.resize = resize;
                _each.rotate = rotate;
            }

            if (isDef(restrict)) {
                _restrict = restrict === 'parent'
                    ? el.parentNode
                    : helper(restrict)[0] || document.body;
            }

            _cursorMove = cursorMove;
            _cursorResize = cursorResize;
            _cursorRotate = cursorRotate;
            _axis = axis;

            _container = isDef(container) && helper(container)[0]
                ? helper(container)[0]
                : _container;

            _rotationPoint = rotationPoint;
            _proportions = proportions;

            _draggable = draggable;
            _resizable = resizable;
            _rotatable = rotatable;
            _scalable = scalable;
            _applyTranslate = applyTranslate;

            _custom = (typeof custom === 'object' && custom) || null;
            _rotatorAnchor = rotatorAnchor || null;
            _rotatorOffset = rotatorOffset;
            _showNormal = showNormal;

            _onInit = createMethod(onInit);
            _onDrop = createMethod(onDrop);
            _onMove = createMethod(onMove);
            _onResize = createMethod(onResize);
            _onRotate = createMethod(onRotate);
            _onDestroy = createMethod(onDestroy);
        }

        this.options = {
            axis: _axis,
            cursorMove: _cursorMove,
            cursorRotate: _cursorRotate,
            cursorResize: _cursorResize,
            rotationPoint: _rotationPoint,
            restrict: _restrict,
            container: _container,
            snap: _snap,
            each: _each,
            proportions: _proportions,
            draggable: _draggable,
            resizable: _resizable,
            rotatable: _rotatable,
            scalable: _scalable,
            applyTranslate: _applyTranslate,
            custom: _custom,
            rotatorAnchor: _rotatorAnchor,
            rotatorOffset: _rotatorOffset,
            showNormal: _showNormal
        };

        this.proxyMethods = {
            onInit: _onInit,
            onDrop: _onDrop,
            onMove: _onMove,
            onResize: _onResize,
            onRotate: _onRotate,
            onDestroy: _onDestroy
        };

        this.subscribe(_each);
    }

    _animate() {
        const self = this;
        const {
            observable,
            storage,
            options
        } = self;

        if (isUndef(storage)) return;

        storage.frame = requestAnimFrame(self._animate);

        if (!storage.doDraw) return;
        storage.doDraw = false;

        let {
            dox,
            doy,
            clientX,
            clientY,
            doDrag,
            doResize,
            doRotate,
            doSetCenter,
            revX,
            revY
        } = storage;

        const {
            snap,
            each: {
                move: moveEach,
                resize: resizeEach,
                rotate: rotateEach
            },
            draggable,
            resizable,
            rotatable
        } = options;

        if (doResize && resizable) {
            const {
                transform: {
                    scX,
                    scY
                },
                cx,
                cy
            } = storage;

            const { x, y } = this._pointToElement(
                {
                    x: clientX,
                    y: clientY
                }
            );

            let dx = dox
                ? snapToGrid(x - cx, snap.x / scX)
                : 0;

            let dy = doy
                ? snapToGrid(y - cy, snap.y / scY)
                : 0;

            dx = dox ? (revX ? - dx : dx) : 0;
            dy = doy ? (revY ? - dy : dy) : 0;

            const args = {
                dx,
                dy,
                clientX,
                clientY
            };

            self._resize(args);

            if (resizeEach) {
                observable.notify(
                    'onresize',
                    self,
                    args
                );
            }
        }

        if (doDrag && draggable) {
            const { nx, ny } = storage;
            
            const dx = dox
                ? snapToGrid(clientX - nx, snap.x)
                : 0;

            const dy = doy
                ? snapToGrid(clientY - ny, snap.y)
                : 0;

            const args = {
                dx,
                dy,
                clientX,
                clientY
            };

            self._drag(
                args
            );

            if (moveEach) {
                observable.notify(
                    'onmove',
                    self,
                    args
                );
            }
        }

        if (doRotate && rotatable) {
            const {
                pressang,
                center
            } = storage;

            const delta = Math.atan2(
                clientY - center.y,
                clientX - center.x
            );
            const radians = delta - pressang;

            const args = {
                clientX,
                clientY
            };

            self._rotate(
                {
                    radians: snapToGrid(radians, snap.angle),
                    ...args
                }
            );

            if (rotateEach) {
                observable.notify(
                    'onrotate',
                    self,
                    {
                        radians,
                        ...args
                    }
                );
            }
        }

        if (doSetCenter && rotatable) {
            const {
                bx,
                by
            } = storage;

            const { x, y } = this._pointToControls(
                {
                    x: clientX,
                    y: clientY
                }
            );

            self._moveCenterHandle(
                x - bx,
                y - by
            );
        }
    }

    _start(e) {
        const { clientX, clientY } = e;
        const {
            observable,
            storage,
            storage: { handles },
            options: { axis, restrict, each },
            el
        } = this;

        const isTarget = Object.values(handles).some((hdl) => helper(e.target).is(hdl)) ||
            el.contains(e.target);
        
        storage.isTarget = isTarget;

        if (!isTarget) return;

        const computed = this._compute(e, el);

        Object.keys(computed).map(prop => storage[prop] = computed[prop]);

        const {
            onRightEdge,
            onBottomEdge,
            onTopEdge,
            onLeftEdge,
            handle,
            factor,
            revX,
            revY,
            doW,
            doH
        } = computed;

        const doResize =
            onRightEdge ||
            onBottomEdge ||
            onTopEdge ||
            onLeftEdge;

        const {
            rotator,
            center,
            radius
        } = handles;

        if (isDef(radius)) removeClass(radius, 'sjx-hidden');

        const doRotate = handle.is(rotator),
            doSetCenter = isDef(center)
                ? handle.is(center)
                : false;

        const doDrag = el.contains(e.target) && !(doRotate || doResize || doSetCenter);

        const { x, y } = this._cursorPoint({ clientX, clientY });
        const { x: ex, y: ey } = this._pointToElement({ x, y });
        const { x: bx, y: by } = this._pointToControls({ x, y });

        const nextStorage = {
            clientX,
            clientY,
            cx: ex,
            cy: ey,
            nx: x,
            ny: y,
            bx,
            by,
            doResize,
            doDrag,
            doRotate,
            doSetCenter,
            onExecution: true,
            cursor: null,
            elementOffset: getOffset(el),
            restrictOffset: isDef(restrict)
                ? getOffset(restrict)
                : null,
            dox: /\x/.test(axis) && (doResize
                ?
                handle.is(handles.ml) ||
                handle.is(handles.mr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tr) ||
                handle.is(handles.bl) ||
                handle.is(handles.br) ||
                handle.is(handles.le) ||
                handle.is(handles.re)
                : true),
            doy: /\y/.test(axis) && (doResize
                ?
                handle.is(handles.br) ||
                handle.is(handles.bl) ||
                handle.is(handles.bc) ||
                handle.is(handles.tr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tc) ||
                handle.is(handles.te) ||
                handle.is(handles.be)
                : true),
            cached: {}
        };

        this.storage = {
            ...storage,
            ...nextStorage
        };

        const eventArgs = {
            clientX,
            clientY
        };

        if (doResize) {
            this._emitEvent('resizeStart', eventArgs);
        } else if (doRotate) {
            this._emitEvent('rotateStart', eventArgs);
        } else if (doDrag) {
            this._emitEvent('dragStart', eventArgs);
        }

        const {
            move,
            resize,
            rotate
        } = each;

        const actionName = doResize
            ? 'resize'
            : (doRotate ? 'rotate' : 'drag');

        const triggerEvent =
            (doResize && resize) ||
            (doRotate && rotate) ||
            (doDrag && move);

        observable.notify(
            'ongetstate',
            this,
            {
                clientX,
                clientY,
                actionName,
                triggerEvent,
                factor,
                revX,
                revY,
                doW,
                doH
            }
        );

        this._draw();
    }

    _moving(e) {
        const { storage, options } = this;

        if (!storage.isTarget) return;

        const { x, y } = this._cursorPoint(e);

        storage.e = e;
        storage.clientX = x;
        storage.clientY = y;
        storage.doDraw = true;

        let {
            doRotate,
            doDrag,
            doResize,
            cursor
        } = storage;

        const {
            cursorMove,
            cursorResize,
            cursorRotate
        } = options;

        if (isUndef(cursor)) {
            if (doDrag) {
                cursor = cursorMove;
            } else if (doRotate) {
                cursor = cursorRotate;
            } else if (doResize) {
                cursor = cursorResize;
            }
            helper(document.body).css({ cursor });
        }
    }

    _end({ clientX, clientY }) {
        const {
            options: { each },
            observable,
            storage,
            storage: {
                doResize,
                doDrag,
                doRotate,
                //doSetCenter,
                frame,
                handles: { radius },
                isTarget
            },
            proxyMethods
        } = this;

        if (!isTarget) return;

        const actionName = doResize
            ? 'resize'
            : (doDrag ? 'drag' : 'rotate');

        storage.doResize = false;
        storage.doDrag = false;
        storage.doRotate = false;
        storage.doSetCenter = false;
        storage.doDraw = false;
        storage.onExecution = false;
        storage.cursor = null;

        this._apply(actionName);

        const eventArgs = {
            clientX,
            clientY
        };

        proxyMethods.onDrop.call(this, eventArgs);

        if (doResize) {
            this._emitEvent('resizeEnd', eventArgs);
        } else if (doRotate) {
            this._emitEvent('rotateEnd', eventArgs);
        } else if (doDrag) {
            this._emitEvent('dragEnd', eventArgs);
        }

        const {
            move,
            resize,
            rotate
        } = each;

        const triggerEvent =
            (doResize && resize) ||
            (doRotate && rotate) ||
            (doDrag && move);

        observable.notify(
            'onapply',
            this,
            {
                clientX,
                clientY,
                actionName,
                triggerEvent
            }
        );

        cancelAnimFrame(frame);

        helper(document.body).css({ cursor: 'auto' });
        if (isDef(radius)) {
            addClass(radius, 'sjx-hidden');
        }
    }

    _compute(e, el) {
        const { handles } = this.storage;

        const handle = helper(e.target);

        const {
            revX,
            revY,
            doW,
            doH,
            ...rest
        } = this._checkHandles(handle, handles);

        const _computed = this._getState({
            revX,
            revY,
            doW,
            doH
        });

        const { x: clientX, y: clientY } = this._cursorPoint(e);

        const pressang = Math.atan2(
            clientY - _computed.center.y,
            clientX - _computed.center.x
        );

        return {
            ..._computed,
            ...rest,
            handle: Object.values(handles).some((hdl) => helper(e.target).is(hdl)) 
                ? handle
                : helper(el),
            pressang
        };
    }

    _checkHandles(handle, handles) {
        const { tl, tc, tr, bl, br, bc, ml, mr, te, be, le, re } = handles;
        const isTL = isDef(tl) ? handle.is(tl) : false,
            isTC = isDef(tc) ? handle.is(tc) : false,
            isTR = isDef(tr) ? handle.is(tr) : false,
            isBL = isDef(bl) ? handle.is(bl) : false,
            isBC = isDef(bc) ? handle.is(bc) : false,
            isBR = isDef(br) ? handle.is(br) : false,
            isML = isDef(ml) ? handle.is(ml) : false,
            isMR = isDef(mr) ? handle.is(mr) : false,
            isTE = isDef(te) ? handle.is(te) : false,
            isBE = isDef(be) ? handle.is(be) : false,
            isLE = isDef(le) ? handle.is(le) : false,
            isRE = isDef(re) ? handle.is(re) : false;

        // reverse axis
        const revX = isTL || isML || isBL || isTC || isLE,
            revY = isTL || isTR || isTC || isML || isTE;

        const onTopEdge = isTC || isTR || isTL || isTE,
            onLeftEdge = isTL || isML || isBL || isLE,
            onRightEdge = isTR || isMR || isBR || isRE,
            onBottomEdge = isBR || isBC || isBL || isBE;

        const doW = isML || isMR || isLE || isRE,
            doH = isTC || isBC || isBE || isTE;

        return {
            revX,
            revY,
            onTopEdge,
            onLeftEdge,
            onRightEdge,
            onBottomEdge,
            doW,
            doH
        };
    }

    notifyMove() {
        this._drag(...arguments);
    }

    notifyRotate({ radians, ...rest }) {
        const {
            snap: { angle }
        } = this.options;

        this._rotate(
            {
                radians: snapToGrid(radians, angle),
                ...rest
            }
        );
    }

    notifyResize() {
        this._resize(...arguments);
    }

    notifyApply({ clientX, clientY, actionName, triggerEvent }) {
        this.proxyMethods.onDrop.call(this, { clientX, clientY });
        if (triggerEvent) {
            this._apply(actionName);
            this._emitEvent(`${actionName}End`, { clientX, clientY });
        }
    }

    notifyGetState({ clientX, clientY, actionName, triggerEvent, ...rest }) {
        if (triggerEvent) {
            const recalc = this._getState(rest);

            this.storage = {
                ...this.storage,
                ...recalc
            };
            this._emitEvent(`${actionName}Start`, { clientX, clientY });
        }
    }

    subscribe({ resize, move, rotate }) {
        const { observable: ob } = this;

        if (move || resize || rotate) {
            ob.subscribe('ongetstate', this)
                .subscribe('onapply', this);
        }

        if (move) {
            ob.subscribe('onmove', this);
        }
        if (resize) {
            ob.subscribe('onresize', this);
        }
        if (rotate) {
            ob.subscribe('onrotate', this);
        }
    }

    unsubscribe() {
        const { observable: ob } = this;

        [
            'ongetstate', 
            'onapply', 
            'onmove',
            'onresize',
            'onrotate'
        ].map(eventName => ob.unsubscribe(eventName, this));
    }

    disable() {
        const {
            storage,
            proxyMethods,
            el
        } = this;

        if (isUndef(storage)) return;

        removeClass(el, 'sjx-drag');

        this._destroy();
        this.unsubscribe();

        proxyMethods.onDestroy.call(this, el);
        delete this.storage;
    }

    exeDrag({ dx, dy }) {
        const { draggable } = this.options;
        if (!draggable) return;

        this.storage = {
            ...this.storage,
            ...this._getState({
                revX: false,
                revY: false,
                doW: false,
                doH: false
            })
        };

        this._drag({ dx, dy });
        this._apply('drag');
    }

    exeResize({
        dx,
        dy,
        revX = false,
        revY = false,
        doW = false,
        doH = false
    }) {
        const { resizable } = this.options;
        if (!resizable) return;

        this.storage = {
            ...this.storage,
            ...this._getState({
                revX,
                revY,
                doW,
                doH
            })
        };

        this._resize({ dx, dy });
        this._apply('resize');
    }

    exeRotate({ delta }) {
        const { rotatable } = this.options;
        if (!rotatable) return;

        this.storage = {
            ...this.storage,
            ...this._getState({
                revX: false,
                revY: false,
                doW: false,
                doH: false
            })
        };

        this._rotate({ radians: delta });
        this._apply('rotate');
    }

}

const cloneMatrix = m => m.map(item => [...item]);

const flatMatrix = (m) => (
    m.reduce((flat, _, i) => ([...flat, m[0][i], m[1][i], m[2][i], m[3][i]]), [])
);

const createIdentityMatrix = (n = 4) => (
    [...Array(n)].map((_, i, a) => a.map(() => +!i--))
);

const createTranslateMatrix = (x, y, z = 0) => (
    createIdentityMatrix().map((item, i) => {
        item[3] = [x, y, z, 1][i];
        return item;
    })
);

const createScaleMatrix = (x, y, z = 1, w = 1) => (
    createIdentityMatrix().map((item, i) => {
        item[i] = [x, y, z, w][i];
        return item;
    })
);

const createRotateMatrix = (sin, cos) => {
    const res = createIdentityMatrix();

    res[0][0] = cos;
    res[0][1] = -sin;
    res[1][0] = sin;
    res[1][1] = cos;

    return res;
};

const dropTranslate = (matrix, clone = true) => {
    const nextMatrix = clone ? cloneMatrix(matrix) : matrix;
    nextMatrix[0][3] = nextMatrix[1][3] = nextMatrix[2][3] = 0;
    return nextMatrix;
};

const multiplyMatrixAndPoint = (mat, point) => {
    const out = [];

    for (let i = 0, len = mat.length; i < len; ++i) {
        let sum = 0;
        for (let j = 0; j < len; ++j) {
            sum += +mat[i][j] * point[j];
        }
        out[i] = sum;
    }

    return out;
};

const multiplyMatrix = (m1, m2) => {
    const result = [];

    for (let j = 0; j < m2.length; j++) {
        result[j] = [];

        for (let k = 0; k < m1[0].length; k++) {
            let sum = 0;

            for (let i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
            result[j].push(sum);
        }
    }
    return result;
};

const matrixInvert = (matrix) => {
    const _A = cloneMatrix(matrix);

    let temp,
        N = _A.length,
        E = [];

    for (let i = 0; i < N; i++)
        E[i] = [];

    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
            E[i][j] = 0;
            if (i == j)
                E[i][j] = 1;
        }

    for (let k = 0; k < N; k++) {
        temp = _A[k][k];

        for (let j = 0; j < N; j++) {
            _A[k][j] /= temp;
            E[k][j] /= temp;
        }

        for (let i = k + 1; i < N; i++) {
            temp = _A[i][k];

            for (let j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (let k = N - 1; k > 0; k--) {
        for (let i = k - 1; i >= 0; i--) {
            temp = _A[i][k];

            for (let j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
            _A[i][j] = E[i][j];

    return _A;
};

const computeTransformMatrix = (tx, [x, y, z]) => {
    const preMul = createTranslateMatrix(-x, -y, -z);
    const postMul = createTranslateMatrix(x, y, z);

    return multiplyMatrix(
        multiplyMatrix(preMul, tx),
        postMul
    );
};

const getCurrentTransformMatrix = (el, container = document.body, newTransform) => {
    let matrix = createIdentityMatrix();
    let node = el;

    // set predefined matrix if we need to find new CTM
    let nodeTx = newTransform || getTransform(node);
    let allowBorderOffset = false;

    while (node && node instanceof Element) {
        //const nodeTx = getTransform(node);
        const nodeTxOrigin = getTransformOrigin(node, allowBorderOffset);

        matrix = multiplyMatrix(
            matrix,
            computeTransformMatrix(nodeTx, nodeTxOrigin)
        );

        allowBorderOffset = true;
        if (node === container || node.offsetParent === null) break;
        node = node.offsetParent;
        nodeTx = getTransform(node);
    }

    return matrix;
};

const decompose = (m) => {
    const sX = Math.sqrt(m[0][0] * m[0][0] + m[0][1] * m[0][1] + m[0][2] * m[0][2]),
        sY = Math.sqrt(m[1][0] * m[1][0] + m[1][1] * m[1][1] + m[1][2] * m[1][2]),
        sZ = Math.sqrt(m[2][0] * m[2][0] + m[2][1] * m[2][1] + m[2][2] * m[2][2]);

    let rX = Math.atan2(-m[3][0] / sZ, m[3][1] / sZ),
        rY = Math.asin(m[1][3] / sZ),
        rZ = Math.atan2(-m[0][3] / sY, m[0][0] / sX);

    if (m[1][0] === 1 || m[1][0] === -1) {
        rX = 0;
        rY = m[1][0] * -Math.PI / 2;
        rZ = m[1][0] * Math.atan2(m[1][1] / sY, m[1][0] / sY);
    }

    return {
        rotate: {
            x: rX,
            y: rY,
            z: rZ
        },
        translate: {
            x: m[3][0] / sX,
            y: m[3][1] / sY,
            z: m[3][2] / sZ
        },
        scale: {
            sX,
            sY,
            sZ
        }
    };
};

const getTransform = (el) => {
    const matrixString = getStyle(el, 'transform');
    const matrix = createIdentityMatrix();

    if (matrixString === 'none') return matrix;

    const values = matrixString.split(/\s*[(),]\s*/).slice(1, -1);

    if (values.length === 16) {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                matrix[j][i] = +values[i * 4 + j];
            }
        }
    } else {
        return [
            [+values[0], +values[2], 0, +values[4]],
            [+values[1], +values[3], 0, +values[5]],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    return matrix;
};

const getTransformOrigin = (el, allowBorderOffset) => {
    const transformOrigin = getStyle(el, 'transform-origin') || '';
    const values = transformOrigin.split(' ');

    const out = [
        allowBorderOffset ? -el.clientLeft : 0,
        allowBorderOffset ? -el.clientTop : 0,
        0,
        1
    ];

    for (let i = 0; i < values.length; ++i) {
        out[i] += parseFloat(values[i]);
    }

    return out;
};

const getAbsoluteOffset = (elem, container = document.body) => {
    let top = 0, left = 0;

    let allowBorderOffset = false;
    while (elem) {
        const parentTx = getCurrentTransformMatrix(elem.offsetParent);

        const [offsetLeft, offsetTop] = multiplyMatrixAndPoint(
            dropTranslate(parentTx, false),
            [
                elem.offsetLeft + (allowBorderOffset ? elem.clientLeft : 0),
                elem.offsetTop + (allowBorderOffset ? elem.clientTop : 0),
                0,
                1
            ]
        );

        left += offsetLeft;
        top += offsetTop;

        if (container === elem) break;
        allowBorderOffset = true;
        elem = elem.offsetParent;
    }

    return [left, top, 0, 1];
};

class Draggable extends Transformable {

    _init(el) {
        const {
            rotationPoint,
            container,
            resizable,
            rotatable,
            showNormal,
            rotatorOffset,
            rotatorAnchor
        } = this.options;

        const { offsetHeight, offsetWidth } = el;

        const wrapper = document.createElement('div');
        addClass(wrapper, 'sjx-wrapper');

        const controls = document.createElement('div');
        addClass(controls, 'sjx-controls');

        const handles = {};

        const matrix = getCurrentTransformMatrix(el, container);
        const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

        const vertices = {
            tl: [0, 0, 0, 1],
            bl: [0, offsetHeight, 0, 1],
            br: [offsetWidth, offsetHeight, 0, 1],
            tr: [offsetWidth, 0, 0, 1],
            tc: [offsetWidth / 2, 0, 0, 1],
            ml: [0, offsetHeight / 2, 0, 1],
            bc: [offsetWidth / 2, offsetHeight, 0, 1],
            mr: [offsetWidth, offsetHeight / 2, 0, 1],
            center: [offsetWidth / 2, offsetHeight / 2, 0, 1]
        };

        const finalVertices = Object.entries(vertices)
            .reduce((nextVerteces, [key, vertex]) => (
                [...nextVerteces, [key, multiplyMatrixAndPoint(matrix, vertex)]]
            ), [])
            .reduce((vertices, [key, [x, y, z, w]]) => {
                vertices[key] = [
                    x + offsetLeft,
                    y + offsetTop,
                    z,
                    w
                ];
                return vertices;
            }, {});

        let rotationHandles = {},
            rotator = null;

        if (rotatable) {
            const anchor = {};
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n':
                    anchor.x = finalVertices.tc[0];
                    anchor.y = finalVertices.tc[1];
                    break;
                case 's':
                    anchor.x = finalVertices.bc[0];
                    anchor.y = finalVertices.bc[1];
                    factor = -1;
                    break;
                case 'w':
                    anchor.x = finalVertices.ml[0];
                    anchor.y = finalVertices.ml[1];
                    factor = -1;
                    break;
                case 'e':
                default:
                    anchor.x = finalVertices.mr[0];
                    anchor.y = finalVertices.mr[1];
                    break;

            }

            const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
                ? Math.atan2(
                    finalVertices.bl[1] - finalVertices.tl[1],
                    finalVertices.bl[0] - finalVertices.tl[0]
                )
                : Math.atan2(
                    finalVertices.tl[1] - finalVertices.tr[1],
                    finalVertices.tl[0] - finalVertices.tr[0]
                );

            rotator = [
                anchor.x - (rotatorOffset * factor) * Math.cos(theta),
                anchor.y - (rotatorOffset * factor) * Math.sin(theta)
            ];

            const normalLine = showNormal
                ? renderLine([[anchor.x, anchor.y], rotator])
                : null;

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (rotationPoint) {
                radius = renderLine([finalVertices.center, finalVertices.center]);
                addClass(radius, 'sjx-hidden');

                controls.appendChild(radius);
            }

            rotationHandles = {
                ...rotationHandles,
                normal: normalLine,
                radius
            };
        }

        const resizingEdges = {
            te: [finalVertices.tl, finalVertices.tr],
            be: [finalVertices.bl, finalVertices.br],
            le: [finalVertices.tl, finalVertices.bl],
            re: [finalVertices.tr, finalVertices.br]
        };

        const resizingHandles = resizable ?
            {
                tl: finalVertices.tl,
                tr: finalVertices.tr,
                br: finalVertices.br,
                bl: finalVertices.bl,
                tc: finalVertices.tc,
                bc: finalVertices.bc,
                ml: finalVertices.ml,
                mr: finalVertices.mr
            }
            : {};

        const allHandles = {
            ...resizingHandles,
            center: rotationPoint && rotatable
                ? finalVertices.center
                : undefined,
            rotator
        };

        const mapHandlers = (obj, renderFunc) => (
            Object.keys(obj).map(key => {
                const data = obj[key];
                if (isUndef(data)) return;
                const handler = renderFunc(data, key);
                handles[key] = handler;
                controls.appendChild(handler);
            })
        );

        mapHandlers(resizingEdges, renderLine);
        mapHandlers(allHandles, createHandler);

        wrapper.appendChild(controls);
        container.appendChild(wrapper);

        this.storage = {
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            radius: undefined,
            parent: el.parentNode,
            wrapper,
            stored: {
                center: {
                    x: el.getAttribute('data-sjx-cx') || 0,
                    y: el.getAttribute('data-sjx-cy') || 0
                }
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

    _pointToElement({ x, y }) {
        const { transform: { ctm } } = this.storage;
        const matrix = matrixInvert(ctm);

        return this._applyMatrixToPoint(
            dropTranslate(matrix, false),
            x,
            y
        );
    }

    _pointToControls({ x, y }) {
        const { transform: { wrapperMatrix } } = this.storage;
        const matrix = matrixInvert(wrapperMatrix);

        return this._applyMatrixToPoint(
            dropTranslate(matrix, false),
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const [nx, ny] = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]);
        return {
            x: nx,
            y: ny
        };
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;
        const globalMatrix = getCurrentTransformMatrix(container);

        return this._applyMatrixToPoint(
            matrixInvert(globalMatrix),
            clientX,
            clientY
        );
    }

    _restrictHandler(matrix) {
        const {
            storage: {
                transform: {
                    containerMatrix
                }
            },
            options: {
                restrict,
                container
            }
        } = this;

        let restrictX = null,
            restrictY = null;

        const containerBox = getBoundingRect(restrict, container, containerMatrix);
        const elBox = this.getBoundingRect(matrix);

        const [minX, maxX] = getMinMaxOf2DIndex(containerBox, 0);
        const [minY, maxY] = getMinMaxOf2DIndex(containerBox, 1);

        for (let i = 0, len = elBox.length; i < len; i++) {
            const [x, y] = elBox[i];

            if (x < minX || x > maxX) {
                restrictX = x;
            }
            if (y < minY || y > maxY) {
                restrictY = y;
            }
        }

        return {
            x: restrictX,
            y: restrictY
        };
    }

    _apply() {
        const {
            el,
            storage,
            options: {
                applyTranslate
            }
        } = this;

        const {
            cached,
            controls,
            transform: { matrix }
            // handles
        } = storage;

        const $controls = helper(controls);

        // const cw = el.offsetWidth,
        //     ch = el.offsetHeight;

        // const { center: cHandle } = handles;

        // const isDefCenter = isDef(cHandle);

        if (isUndef(cached)) return;

        // const nextStoredCenter = {
        //     x: isDefCenter ? storage.stored.center.x + cached.centerOffset.x : 0,
        //     y: isDefCenter ? storage.stored.center.y + cached.centerOffset.y : 0
        // };

        // el.setAttribute('data-sjx-cx', nextStoredCenter.x);
        // el.setAttribute('data-sjx-cy', nextStoredCenter.y);

        // this.storage = {
        //     ...this.storage,
        //     stored: {
        //         ...this.storage.stored,
        //         center: {
        //             ...nextStoredCenter
        //         }
        //     }
        // };

        if (applyTranslate) {
            const $el = helper(el);

            const { dx, dy } = cached;

            const css = matrixToCSS(matrix);

            const left = parseFloat(
                el.style.left || $el.css('left')
            );

            const top = parseFloat(
                el.style.top || $el.css('top')
            );

            css.left = `${left + dx}px`;
            css.top = `${top + dy}px`;

            $el.css(css);
            $controls.css(css);
        }

        this.storage.cached = {};
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            storage: {
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
                } = {},
                box: {
                    width: cw,
                    height: ch
                },
                revX,
                revY,
                doW,
                doH
            },
            options: {
                proportions,
                scalable,
                restrict
            }
        } = this;

        const getScale = (distX, distY) => {
            const ratio = doW || (!doW && !doH)
                ? (cw + distX) / cw
                : (ch + distY) / ch;

            const newWidth = proportions ? cw * ratio : cw + distX,
                newHeight = proportions ? ch * ratio : ch + distY;

            const scaleX = newWidth / cw,
                scaleY = newHeight / ch;

            return [scaleX, scaleY];
        };

        const getScaleMatrix = (scaleX, scaleY) => {
            const scaleMatrix = createScaleMatrix(scaleX, scaleY);

            return multiplyMatrix(
                multiplyMatrix(translateMatrix, scaleMatrix),
                matrixInvert(translateMatrix)
            );
        };

        const preScaleMatrix = multiplyMatrix(
            getScaleMatrix(...getScale(dx, dy)),
            matrix
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preScaleMatrix)
            : { x: null, y: null };

        const newDx = ((restX !== null) || (proportions && restY !== null) && restrict)
            ? nextDx 
            : dx;
        const newDy = ((restY !== null) || (proportions && restX !== null) && restrict)
            ? nextDy 
            : dy;

        const [scaleX, scaleY] = getScale(newDx, newDy);
        const newWidth = proportions ? cw * scaleX : cw + newDx,
            newHeight = proportions ? ch * scaleY : ch + newDy;

        if (Math.abs(newWidth) <= MIN_SIZE || Math.abs(newHeight) <= MIN_SIZE) return;

        const scaleMatrix = getScaleMatrix(scaleX, scaleY);
        const resultMatrix = multiplyMatrix(scaleMatrix, matrix);

        if (scalable) {
            helper(el).css(
                matrixToCSS(flatMatrix(resultMatrix))
            );
        } else {
            const trMatrix = createTranslateMatrix(
                scaleMatrix[0][3],
                scaleMatrix[1][3]
            );

            const inverted = createTranslateMatrix(
                scaleMatrix[0][3] *= revX ? -1 : 1,
                scaleMatrix[1][3] *= revY ? -1 : 1
            );

            const result = multiplyMatrix(
                multiplyMatrix(inverted, matrix),
                matrixInvert(trMatrix)
            );

            helper(el).css({
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                ...matrixToCSS(flatMatrix(result))
            });
        }

        applyTransformToHandles(
            storage,
            this.options,
            {
                el,
                boxMatrix: resultMatrix
            }
        );

        storage.cached.dist = {
            dx: newDx,
            dy: newDy
        };

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    _processMove(dx, dy) {
        const {
            el,
            storage,
            storage: {
                wrapper,
                transform: {
                    matrix,
                    wrapperMatrix,
                    auxiliary: {
                        translate: {
                            parentMatrix
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
                restrict
            }
        } = this;

        const [x, y] = multiplyMatrixAndPoint(
            parentMatrix,
            [dx, dy, 0, 1]
        );

        const preTranslateMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix)
            : { x: null, y: null };

        const newDx = restX !== null && restrict ? nextDx : dx,
            newDy = restY !== null && restrict ? nextDy : dy;

        const [nx, ny] = multiplyMatrixAndPoint(
            parentMatrix,
            [newDx, newDy, 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            matrix,
            createTranslateMatrix(nx, ny)
        );

        const moveWrapperMtrx = multiplyMatrix(
            wrapperMatrix,
            createTranslateMatrix(newDx, newDy)
        );

        const elStyle = matrixToCSS(flatMatrix(moveElementMtrx));
        const wrapperStyle = matrixToCSS(flatMatrix(moveWrapperMtrx));

        helper(el).css(elStyle);
        helper(wrapper).css(wrapperStyle);

        storage.cached.dist = {
            dx: newDx,
            dy: newDy
        };

        return moveElementMtrx;
    }

    _processRotate(radians) {
        const {
            el,
            storage: {
                transform: {
                    matrix,
                    auxiliary: {
                        rotate: {
                            translateMatrix
                        }
                    }
                }
            },
            options: {
                restrict
            }
        } = this;

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

        const rotationMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix),
            translateMatrix
        );

        const resultMatrix = multiplyMatrix(matrix, transformMatrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(resultMatrix)
            : { x: null, y: null };

        if (isDef(restX) || isDef(restY)) return resultMatrix;

        helper(el).css(
            matrixToCSS(flatMatrix(resultMatrix))
        );

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                el,
                boxMatrix: resultMatrix
            }
        );

        return resultMatrix;
    }

    _getState({ revX, revY, doW, doH }) {
        const {
            el,
            storage: {
                handles: {
                    center: cHandle
                },
                parent,
                wrapper,
                stored: {
                    center: centerData
                }
            },
            options: {
                container,
                restrict,
                scalable
            }
        } = this;

        const {
            offsetWidth,
            offsetHeight
        } = restrict || container;

        const [glLeft, glTop] = getAbsoluteOffset(el, container);

        const {
            offsetLeft: elOffsetLeft,
            offsetTop: elOffsetTop,
            offsetWidth: elWidth,
            offsetHeight: elHeight
        } = el;

        const matrix = getTransform(el);
        const ctm = getCurrentTransformMatrix(el, container);
        const parentMatrix = getCurrentTransformMatrix(parent, container);
        const wrapperMatrix = getCurrentTransformMatrix(wrapper, container);
        const containerMatrix = restrict
            ? getCurrentTransformMatrix(restrict, restrict.parentNode)
            : getCurrentTransformMatrix(container, container.parentNode);

        const hW = elWidth / 2,
            hH = elHeight / 2;

        const scaleX = doH ? 0 : (revX ? -hW : hW),
            scaleY = doW ? 0 : (revY ? -hH : hH);

        const [cenX, cenY] = multiplyMatrixAndPoint(
            ctm,
            [
                hW,
                hH,
                0,
                1
            ]
        );

        const [elX, elY] = multiplyMatrixAndPoint(
            matrix,
            [
                centerData.x,
                centerData.y,
                0,
                1
            ]
        );

        const containerBox = multiplyMatrixAndPoint(
            dropTranslate(containerMatrix),
            [offsetWidth, offsetHeight, 0, 1]
        );

        const { 
            scale: { sX, sY }
        } = decompose(getCurrentTransformMatrix(el, el.parentNode));

        const transform = {
            auxiliary: {
                scale: {
                    translateMatrix: scalable 
                        ? createTranslateMatrix(
                            scaleX,
                            scaleY
                        )
                        : createTranslateMatrix(
                            doH ? 0 : hW,
                            doW ? 0 : hH
                        )  
                },
                translate: {
                    parentMatrix: matrixInvert(dropTranslate(parentMatrix))
                },
                rotate: {
                    translateMatrix: createTranslateMatrix(
                        elX,
                        elY
                    )
                }
            },
            scaleX,
            scaleY,
            matrix,
            ctm,
            parentMatrix,
            containerMatrix,
            wrapperMatrix,
            scX: sX,
            scY: sY,
            containerBox
        };

        return {
            transform,
            box: {
                width: elWidth,
                height: elHeight,
                left: elOffsetLeft,
                top: elOffsetTop,
                offset: {
                    left: glLeft,
                    top: glTop
                }
            },
            center: {
                x: cenX + glLeft,
                y: cenY + glTop,
                elX,
                elY,
                matrix: cHandle ? getTransform(cHandle) : null
            },
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(x, y) {
        const {
            storage: {
                handles: { center },
                center: { matrix }
            }
        } = this;

        const resultMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        helper(center).css({
            ...matrixToCSS(flatMatrix(resultMatrix))
        });

        this.storage.cached = {
            centerOffset: { x, y }
        };
    }

    resetCenterPoint() {
        const {
            el,
            el: {
                offsetHeight,
                offsetWidth
            },
            storage: {
                wrapper,
                handles: { center }
            },
            options: {
                container
            }
        } = this;

        if (!center) return;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

        const matrix = multiplyMatrix(
            getCurrentTransformMatrix(el, container),
            matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode))
        );

        const [x, y] = multiplyMatrixAndPoint(
            matrix,
            [offsetWidth / 2, offsetHeight / 2, 0, 1]
        );

        helper(center).css(
            { transform: `translate(${x + offsetLeft}px, ${y + offsetTop}px)` }
        );
    }

    fitControlsToSize() {
        const {
            el,
            storage: {
                wrapper
            }
        } = this;

        wrapper.removeAttribute('transform');

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                el
            }
        );
    }

    getBoundingRect(transformMatrix = null) {
        const {
            el,
            options: { 
                restrict
            },
            storage: {
                box
            }
        } = this;

        const matrix = getCurrentTransformMatrix(el, restrict, transformMatrix);
        return getBoundingRect(el, restrict, matrix, box);
    }

    get controls() {
        return this.storage.wrapper;
    }

}

const createHandler = ([x, y], key = 'handler', style = {}) => {
    const element = document.createElement('div');
    addClass(element, 'sjx-hdl');
    addClass(element, `sjx-hdl-${key}`);

    helper(element).css({
        transform: `translate(${x}px, ${y}px)`,
        ...style
    });
    return element;
};

const renderLine = ([pt1, pt2, thickness = 1], key) => {
    const {
        cx,
        cy,
        length,
        theta
    } = getLineAttrs(pt1, pt2, thickness);

    const line = document.createElement('div');

    helper(line).css({
        transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
        height: `${thickness}px`,
        width: `${length}px`
    });

    addClass(line, 'sjx-hdl-line');
    addClass(line, `sjx-hdl-${key}`);
    return line;
};

const getLineAttrs = (pt1, pt2, thickness = 1) => {
    const [x1, y1] = pt1;
    const [x2, y2] = pt2;

    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);

    const theta = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    return {
        cx,
        cy,
        thickness,
        theta,
        length
    };
};

const applyTransformToHandles = (storage, options, data) => {
    const {
        wrapper,
        handles,
        transform: {
            //ctm,
            wrapperMatrix = getCurrentTransformMatrix(wrapper, wrapper.parentNode)
        } = {}
    } = storage;

    const {
        rotationPoint,
        rotatable,
        resizable,
        showNormal,
        rotatorOffset,
        rotatorAnchor,
        container
    } = options;

    const {
        //boxMatrix,
        el
    } = data;

    const { offsetHeight, offsetWidth } = el;
    const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

    const matrix = multiplyMatrix(
        getCurrentTransformMatrix(el, container), // better to find result matrix instead of calculated
        matrixInvert(wrapperMatrix)
    );

    const vertices = {
        tl: [0, 0, 0, 1],
        tr: [offsetWidth, 0, 0, 1],
        bl: [0, offsetHeight, 0, 1],
        br: [offsetWidth, offsetHeight, 0, 1],
        tc: [offsetWidth / 2, 0, 0, 1],
        ml: [0, offsetHeight / 2, 0, 1],
        bc: [offsetWidth / 2, offsetHeight, 0, 1],
        mr: [offsetWidth, offsetHeight / 2, 0, 1],
        ...(rotationPoint && rotatable &&
            { center: [offsetWidth / 2, offsetHeight / 2, 0, 1] }
        )
    };

    const finalVertices = Object.entries(vertices)
        .reduce((nextVerteces, [key, vertex]) => (
            [...nextVerteces, [key, multiplyMatrixAndPoint(matrix, vertex)]]
        ), [])
        .reduce((vertices, [key, [x, y, z, w]]) => {
            vertices[key] = [
                x + offsetLeft,
                y + offsetTop,
                z,
                w
            ];
            return vertices;
        }, {});

    let normalLine = null;
    let rotationHandles = {};

    if (rotatable) {
        const anchor = {};
        let factor = 1;
        let rotator = [];

        switch (rotatorAnchor) {

            case 'n':
                anchor.x = finalVertices.tc[0];
                anchor.y = finalVertices.tc[1];
                break;
            case 's':
                anchor.x = finalVertices.bc[0];
                anchor.y = finalVertices.bc[1];
                factor = -1;
                break;
            case 'w':
                anchor.x = finalVertices.ml[0];
                anchor.y = finalVertices.ml[1];
                factor = -1;
                break;
            case 'e':
            default:
                anchor.x = finalVertices.mr[0];
                anchor.y = finalVertices.mr[1];
                break;

        }

        const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
            ? Math.atan2(
                finalVertices.bl[1] - finalVertices.tl[1],
                finalVertices.bl[0] - finalVertices.tl[0]
            )
            : Math.atan2(
                finalVertices.tl[1] - finalVertices.tr[1],
                finalVertices.tl[0] - finalVertices.tr[0]
            );

        const nextRotatorOffset = rotatorOffset * factor;

        rotator = [
            anchor.x - nextRotatorOffset * Math.cos(theta),
            anchor.y - nextRotatorOffset * Math.sin(theta)
        ];

        normalLine = showNormal
            ? [[anchor.x, anchor.y], rotator]
            : null;

        rotationHandles = {
            rotator
        };
    }

    const resizingHandles = {
        tl: finalVertices.tl,
        tr: finalVertices.tr,
        br: finalVertices.br,
        bl: finalVertices.bl,
        tc: finalVertices.tc,
        bc: finalVertices.bc,
        ml: finalVertices.ml,
        mr: finalVertices.mr,
        center: finalVertices.center
        // rotator
    };

    const resizingEdges = {
        te: [finalVertices.tl, finalVertices.tr],
        be: [finalVertices.bl, finalVertices.br],
        le: [finalVertices.tl, finalVertices.bl],
        re: [finalVertices.tr, finalVertices.br],
        ...(showNormal && normalLine && { normal: normalLine })
    };

    Object.keys(resizingEdges).forEach(key => {
        const [pt1, pt2] = resizingEdges[key];

        const {
            cx,
            cy,
            length,
            theta
        } = getLineAttrs(pt1, pt2);

        helper(handles[key]).css({
            transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
            width: `${length}px`
        });
    });

    const allHandles = {
        ...(resizable && resizingHandles),
        ...rotationHandles
    };

    Object.keys(allHandles).forEach(key => {
        const hdl = allHandles[key];
        if (!hdl) return;

        const [x, y] = hdl;
        helper(handles[key]).css({
            transform: `translate(${x}px, ${y}px)`
        });
    });
};

const getBoundingRect = (el, container, ctm, box) => {
    const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);
    const { 
        width, 
        height,
        offset: {
            left,
            top
        }
    } = box || { 
        width: el.offsetWidth, 
        height: el.offsetHeight,
        offset: {
            left: offsetLeft,
            top: offsetTop
        }
    };

    const vertices = [
        [0, 0, 0, 1],
        [width, 0, 0, 1],
        [0, height, 0, 1],
        [width, height, 0, 1]
    ];

    return vertices
        .reduce((nextVerteces, vertex) => (
            [...nextVerteces, multiplyMatrixAndPoint(ctm, vertex)]
        ), [])
        .map(([x, y, z, w]) => (
            [
                x + left,
                y + top,
                z,
                w
            ]
        ));
};

const svgPoint = createSVGElement('svg').createSVGPoint();
const floatRE = /[+-]?\d+(\.\d+)?/g;

const allowedElements = [
    'circle', 'ellipse',
    'image', 'line',
    'path', 'polygon',
    'polyline', 'rect',
    'text', 'g', 'foreignobject', 'use'
];

function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

const checkChildElements = (element) => {
    const arrOfElements = [];

    if (isGroup(element)) {
        forEach.call(element.childNodes, item => {
            if (item.nodeType === 1) {
                const tagName = item.tagName.toLowerCase();

                if (allowedElements.indexOf(tagName) !== -1) {
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
};

const createSVGMatrix = () => {
    return createSVGElement('svg').createSVGMatrix();
};

const createTranslateMatrix$1 = (x, y) => {
    const matrix = createSVGMatrix();
    matrix.e = x;
    matrix.f = y;

    return matrix;
};

const createRotateMatrix$1 = (sin, cos) => {
    const matrix = createSVGMatrix();

    matrix.a = cos;
    matrix.b = sin;
    matrix.c = - sin;
    matrix.d = cos;

    return matrix;
};

const createScaleMatrix$1 = (x, y) => {
    const matrix = createSVGMatrix();
    matrix.a = x;
    matrix.d = y;

    return matrix;
};

const getTransformToElement = (toElement, g) => {
    const gTransform = (g.getScreenCTM && g.getScreenCTM()) || createSVGMatrix();
    return gTransform.inverse().multiply(
        toElement.getScreenCTM() || createSVGMatrix()
    );
};

const matrixToString = (m) => {
    const { a, b, c, d, e, f } = m;
    return `matrix(${a},${b},${c},${d},${e},${f})`;
};

const pointTo = (ctm, x, y) => {
    svgPoint.x = x;
    svgPoint.y = y;
    return svgPoint.matrixTransform(ctm);
};

const cloneMatrix$1 = (b) => {
    const a = createSVGMatrix();

    a.a = b.a;
    a.b = b.b;
    a.c = b.c;
    a.d = b.d;
    a.e = b.e;
    a.f = b.f;

    return a;
};

const isIdentity = (matrix) => {
    const { a, b, c, d, e, f } = matrix;
    return a === 1 &&
        b === 0 &&
        c === 0 &&
        d === 1 &&
        e === 0 &&
        f === 0;
};

const createPoint = (_, x, y) => {
    if (isUndef(x) || isUndef(y)) {
        return null;
    }
    const pt = createSVGElement('svg').createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt;
};

const checkElement = (el) => {
    const tagName = el.tagName.toLowerCase();

    if (allowedElements.indexOf(tagName) === -1) {
        warn(
            `Selected element "${tagName}" is not allowed to transform. Allowed elements:\n
            circle, ellipse, image, line, path, polygon, polyline, rect, text, g`
        );
        return false;
    } else {
        return true;
    }
};

const isGroup = (element) => (
    element.tagName.toLowerCase() === 'g'
);

const parsePoints = (pts) => (
    pts.match(floatRE).reduce(
        (result, _, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            return result;
        },
        []
    )
);

const dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
const sepRE = /\s*,\s*|\s+/g;

const parsePath = (path) => {
    let match = dRE.lastIndex = 0;

    const serialized = [];

    while ((match = dRE.exec(path))) {
        const cmd = match[1];
        const upCmd = cmd.toUpperCase();

        // normalize the data
        const data = match[2]
            .replace(/([^e])-/g, '$1 -')
            .replace(/ +/g, ' ');

        serialized.push({
            relative: cmd !== upCmd,
            key: upCmd,
            cmd: cmd,
            values: data.trim().split(sepRE).map(val => {
                if (!isNaN(val)) {
                    return Number(val);
                }
            })
        });
    }

    return serialized;
};

const movePath = (params) => {
    const {
        path,
        dx,
        dy
    } = params;

    try {
        const serialized = parsePath(path);

        let str = '';
        let space = ' ';

        let firstCommand = true;

        for (let i = 0, len = serialized.length; i < len; i++) {
            const item = serialized[i];

            const {
                values,
                key: cmd,
                relative
            } = item;

            const coordinates = [];

            switch (cmd) {

                case 'M': {
                    for (let k = 0, len = values.length; k < len; k += 2) {
                        let [x, y] = values.slice(k, k + 2);

                        if (!(relative && !firstCommand)) {
                            x += dx;
                            y += dy;
                        }

                        coordinates.push(
                            x,
                            y
                        );

                        firstCommand = false;
                    }
                    break;
                }              
                case 'A': {
                    for (let k = 0, len = values.length; k < len; k += 7) {
                        const set = values.slice(k, k + 7);

                        if (!relative) {
                            set[5] += dx;
                            set[6] += dy;
                        }

                        coordinates.push(...set);
                    }
                    break;
                }
                case 'C': {
                    for (let k = 0, len = values.length; k < len; k += 6) {
                        const set = values.slice(k, k + 6);

                        if (!relative) {
                            set[0] += dx;
                            set[1] += dy;
                            set[2] += dx;
                            set[3] += dy;
                            set[4] += dx;
                            set[5] += dy;
                        }

                        coordinates.push(...set);
                    }
                    break;
                }
                case 'H': {
                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const set = values.slice(k, k + 1);

                        if (!relative) {
                            set[0] += dx;
                        }

                        coordinates.push(set[0]);
                    }

                    break;
                }
                case 'V': {
                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const set = values.slice(k, k + 1);

                        if (!relative) {
                            set[0] += dy;
                        }
                        coordinates.push(set[0]);
                    }

                    break;
                }
                case 'L':
                case 'T': {
                    for (let k = 0, len = values.length; k < len; k += 2) {
                        let [x, y] = values.slice(k, k + 2);

                        if (!relative) {
                            x += dx;
                            y += dy;
                        }

                        coordinates.push(
                            x,
                            y
                        );
                    }
                    break;
                }
                case 'Q':
                case 'S': {
                    for (let k = 0, len = values.length; k < len; k += 4) {
                        let [x1, y1, x2, y2] = values.slice(k, k + 4);

                        if (!relative) {
                            x1 += dx;
                            y1 += dy;
                            x2 += dx;
                            y2 += dy;
                        }

                        coordinates.push(
                            x1,
                            y1,
                            x2,
                            y2
                        );
                    }
                    break;
                }
                case 'Z': {
                    values[0] = '';
                    space = '';
                    break;
                }

            }

            str += item.cmd + coordinates.join(',') + space;
        }

        return str;
    } catch (err) {
        warn('Path parsing error: ' + err);
    }
};

const resizePath = (params) => {
    const {
        path,
        localCTM
    } = params;

    try {
        const serialized = parsePath(path);

        let str = '';
        let space = ' ';

        const res = [];

        let firstCommand = true;

        for (let i = 0, len = serialized.length; i < len; i++) {
            const item = serialized[i];

            const {
                values,
                key: cmd,
                relative
            } = item;

            switch (cmd) {

                case 'A': {
                //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 7) {
                        const [rx, ry, x_axis_rot, large_arc_flag, sweep_flag, x, y] =
                            values.slice(k, k + 7);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );

                        mtrx.e = mtrx.f = 0;

                        const {
                            x: newRx,
                            y: newRy
                        } = pointTo(
                            mtrx,
                            rx,
                            ry
                        );

                        coordinates.unshift(
                            floatToFixed(newRx),
                            floatToFixed(newRy),
                            x_axis_rot,
                            large_arc_flag,
                            sweep_flag
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'C': {
                //C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 6) {
                        const [x1, y1, x2, y2, x, y] = values.slice(k, k + 6);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,                          
                            x1,
                            y1
                        );

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX1),
                            floatToFixed(resY1),
                            floatToFixed(resX2),
                            floatToFixed(resY2),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                // this command makes impossible free transform within group
                // todo: use proportional resizing only or need to be converted to L
                case 'H': {
                // H x (or h dx)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [x] = values.slice(k, k + 1);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX
                        } = pointTo(
                            mtrx,
                            x,
                            0
                        );

                        coordinates.push(
                            floatToFixed(resX)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                // this command makes impossible free transform within group
                // todo: use proportional resizing only or need to be converted to L
                case 'V': {
                // V y (or v dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [y] = values.slice(k, k + 1);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            y: resY
                        } = pointTo(
                            mtrx,
                            0,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'T':
                case 'L': {
                // T x y (or t dx dy)
                // L x y (or l dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'M': {
                // M x y (or dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative && !firstCommand) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );

                        firstCommand = false;
                    }

                    res.push(coordinates);
                    break;
                }
                case 'Q': {
                //Q x1 y1, x y (or q dx1 dy1, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x1, y1, x, y] = values.slice(k, k + 4);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,
                            x1,
                            y1
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX1),
                            floatToFixed(resY1),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'S': {
                //S x2 y2, x y (or s dx2 dy2, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x2, y2, x, y] = values.slice(k, k + 4);

                        const mtrx = cloneMatrix$1(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX2),
                            floatToFixed(resY2),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'Z': {
                    res.push(['']);
                    space = '';
                    break;
                }

            }

            str += item.cmd + res[i].join(',') + space;
        }

        return str;
    } catch (err) {
        warn('Path parsing error: ' + err);
    }
};

class DraggableSVG extends Transformable {

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

        const controls = createSVGElement('g');
        addClass(controls, 'sjx-svg-controls');

        const centerX = el.getAttribute('data-sjx-cx'),
            centerY = el.getAttribute('data-sjx-cy');

        const elCTM = getTransformToElement(el, container);

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

        const nextVertices = Object
            .entries(vertices)
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
                ? renderLine$1([anchor, rotator], THEME_COLOR, 'norm')
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

            handles[key] = renderLine$1(
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
                handles[key] = createHandler$1(
                    x,
                    y,
                    color,
                    key
                );
            }

            controls.appendChild(handles[key]);
        });

        wrapper.appendChild(controls);
        container.appendChild(wrapper);

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
                    containerMatrix
                }
            },
            options: {
                restrict
            }
        } = this;

        let restrictX = null,
            restrictY = null;
       
        const containerBox = getBoundingRect$1(restrict, containerMatrix);
        const elBox = this.getBoundingRect(matrix);

        const [minX, maxX] = getMinMaxOf2DIndex(containerBox, 0);
        const [minY, maxY] = getMinMaxOf2DIndex(containerBox, 1);
        
        for (let i = 0, len = elBox.length; i < len; i++) {
            const [x, y] = elBox[i];

            if (x < minX || x > maxX) {
                restrictX = x;
            }
            if (y < minY || y > maxY) {
                restrictY = y;
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
                bBox,
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
            parentMatrix,
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
            oy,
            transformMatrix
        } = cached;

        if (actionName === 'drag') {
            if (!applyDragging || (dx === 0 && dy === 0)) return;

            const eM = createTranslateMatrix$1(dx, dy);

            const translateMatrix = eM
                .multiply(matrix)
                .multiply(eM.inverse());

            element.setAttribute(
                'transform',
                matrixToString(translateMatrix)
            );

            if (isGroup(element)) {
                const els = checkChildElements(element);

                els.forEach(child => {
                    const eM = createTranslateMatrix$1(dx, dy);

                    const translateMatrix = eM
                        .multiply(getTransformToElement(child, child.parentNode))
                        .multiply(eM.inverse());

                    if (!isIdentity(translateMatrix)) {
                        child.setAttribute(
                            'transform',
                            matrixToString(translateMatrix)
                        );
                    }

                    if (!isGroup(child)) {
                        const ctm = parentMatrix.inverse();
                        ctm.e = ctm.f = 0;
    
                        applyTranslate(child, {
                            ...pointTo(ctm, ox, oy)
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
            if (!transformMatrix) return;
            if (!scalable) {
                if (isGroup(element)) {
                    const els = checkChildElements(element);

                    els.forEach(child => {
                        if (!isGroup(child)) {
                            const childCTM = getTransformToElement(child, element);
                            const localCTM = childCTM.inverse()
                                .multiply(transformMatrix)
                                .multiply(childCTM);

                            applyResize(child, {
                                scaleX,
                                scaleY,
                                localCTM,
                                bBox,
                                container,
                                storage,
                                cached
                            });
                        }
                    });
                } else {
                    const containerCTM = container.getScreenCTM() || createSVGMatrix();
                    const elementMatrix = element.getScreenCTM().multiply(transformMatrix);
                
                    const resultCTM = containerCTM.inverse().multiply(elementMatrix);

                    const localCTM = ctm.inverse().multiply(resultCTM);

                    applyResize(element, {
                        scaleX,
                        scaleY,
                        localCTM,
                        bBox,
                        container,
                        storage,
                        cached
                    });
                }
            }

            applyTransformToHandles$1(
                storage,
                options,
                {
                    boxMatrix: scalable
                        ? ctm.multiply(transformMatrix)
                        : ctm,
                    element
                }
            );
        }
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            storage: {
                bBox: {
                    width: boxWidth,
                    height: boxHeight
                },
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
            const scaleMatrix = createScaleMatrix$1(scaleX, scaleY);

            return translateMatrix
                .multiply(scaleMatrix)
                .multiply(translateMatrix.inverse());
        };

        const preScaledMatrix = matrix.multiply(
            getScaleMatrix(...getScale(dx, dy))
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preScaledMatrix)
            : { x: null, y: null };

        const newDx = ((restX !== null) || (proportions && restY !== null) && restrict)
            ? nextDx 
            : dx;
        const newDy = ((restY !== null) || (proportions && restX !== null) && restrict)
            ? nextDy 
            : dy;

        const [scaleX, scaleY] = getScale(newDx, newDy);
        const newWidth = proportions ? boxWidth * scaleX : boxWidth + newDx,
            newHeight = proportions ? boxHeight * scaleY : boxHeight + newDy;

        if (Math.abs(newWidth) <= MIN_SIZE || Math.abs(newHeight) <= MIN_SIZE) return;

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

        storage.cached = {
            ...storage.cached,
            scaleX,
            scaleY,
            transformMatrix: scaleMatrix,
            resultMatrix,
            dist: {
                dx: newDx,
                dy: newDy
            }
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

        const preTranslateMatrix = createTranslateMatrix$1(x, y).multiply(matrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix)
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

        if (center.isShifted) {
            const centerTransformMatrix = wrapperMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;
            const { x: cx, y: cy } = pointTo(
                centerTransformMatrix,
                nextDx,
                nextDy
            );

            this._moveCenterHandle(-cx, -cy);
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
                    parentMatrix,
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

        const rotateMatrix = createRotateMatrix$1(sin, cos);

        parentMatrix.e = parentMatrix.f = 0;
        const resRotMatrix = parentMatrix.inverse()
            .multiply(rotateMatrix)
            .multiply(parentMatrix);

        const resRotateMatrix = translateMatrix
            .multiply(resRotMatrix)
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
            storage: {
                wrapper,
                parent,
                handles: {
                    center: cHandle
                }
            },
            options: {
                container,
                restrict,
                rotationPoint
            }
        } = this;

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

        const parentMatrixInverted = parentMatrix.inverse();

        const scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);

        const elCenterX = elX + elW / 2,
            elCenterY = elY + elH / 2;

        const centerX = rotationPoint
            ? cHandle.cx.baseVal.value
            : elCenterX;
        const centerY = rotationPoint
            ? cHandle.cy.baseVal.value
            : elCenterY;

        // c-handle's coordinates
        const { x: bcx, y: bcy } = pointTo(
            boxCTM,
            centerX,
            centerY
        );

        // element's center coordinates
        const { x: elcx, y: elcy } = rotationPoint
            ? pointTo(
                parentMatrixInverted,
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
            child.__ctm__ = getTransformToElement(child, child.parentNode);
            storeElementAttributes(child);
        });

        const center = {
            ...this.storage.center || {},
            x: rotationPoint ? bcx : rcx,
            y: rotationPoint ? bcy : rcy,
            elX: elcx,
            elY: elcy,
            hx: rotationPoint ? cHandle.cx.baseVal.value : null,
            hy: rotationPoint ? cHandle.cy.baseVal.value : null
        };

        const containerMatrix = restrict
            ? getTransformToElement(restrict, restrict.parentNode)
            : getTransformToElement(container, container.parentNode);

        const transform = {
            auxiliary: {
                scale: {
                    scaleMatrix: createSVGMatrix(),
                    translateMatrix: createTranslateMatrix$1(scaleX, scaleY)
                },
                translate: {
                    parentMatrix: parentMatrixInverted,
                    translateMatrix: createSVGMatrix(),
                    wrapperTranslateMatrix: createSVGMatrix()
                },
                rotate: {
                    translateMatrix: createTranslateMatrix$1(center.elX, center.elY),
                    wrapperTranslateMatrix: createTranslateMatrix$1(center.x, center.y)
                }
            },
            matrix: elMatrix,
            ctm,
            parentMatrix,
            wrapperMatrix,
            containerMatrix,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
            containerBox: container.getBBox()
        };

        return {
            transform,
            bBox: eBBox,
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
        this.storage.center.isShifted = true;
    }

    resetCenterPoint() {
        const {
            el,
            storage: {
                bBox: {
                    width: boxWidth,
                    height: boxHeight,
                    x: boxLeft,
                    y: boxTop
                },
                handles: { 
                    center,
                    radius 
                }
            }
        } = this;

        if (!center) return;

        const matrix = getTransformToElement(el, el.parentNode);

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

        const containerMatrix = getTransformToElement(el, container);

        const identityMatrix = createSVGMatrix();
        this.storage.transform.wrapperMatrix = identityMatrix;

        wrapper.setAttribute('transform', matrixToString(identityMatrix));
        applyTransformToHandles$1(
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
                bBox
            }
        } = this;

        return getBoundingRect$1(
            el,
            getTransformToElement(el.parentNode, container).multiply(transformMatrix),
            bBox
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

    }

    attrs.forEach(item => {
        element.setAttribute(item[0], item[1]);
    });
};

const applyResize = (element, data) => {
    const {
        scaleX,
        scaleY,
        localCTM,
        bBox: {
            width: boxW,
            height: boxH
        }
    } = data;

    const attrs = [];

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

    }

    attrs.forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};

const applyTransformToHandles$1 = (
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
        ...(!center.isShifted && { center: [x + hW, y + hH] })
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

const createHandler$1 = (left, top, color, key) => {
    const handler = createSVGElement('circle');
    addClass(handler, `sjx-svg-hdl`);
    addClass(handler, `sjx-svg-hdl-${key}`);

    const attrs = {
        cx: left,
        cy: top,
        r: 4,
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

    }
};

const renderLine$1 = ([b, e], color, key) => {
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
        'vector-effect': 'non-scaling-stroke'
    };

    Object.entries(attrs).forEach(([attr, value]) => {
        handler.setAttribute(attr, value);
    });

    return handler;
};

const getBoundingRect$1 = (el, ctm, bBox = el.getBBox()) => {
    const { x, y, width, height } = bBox;

    const vertices = [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height]
    ];

    return vertices.map(([l, t]) => {
        const { x: nx, y: ny } = pointTo(ctm, l, t);
        return [nx, ny];
    });
};

// factory method for creating draggable elements
function drag(options, obInstance) {
    if (this.length) {
        const Ob = (isDef(obInstance) && obInstance instanceof Observable)
            ? obInstance
            : new Observable();

        return arrReduce.call(this, (result, item) => {
            if (!(item instanceof SVGElement)) {
                result.push(
                    new Draggable(item, options, Ob)
                );
            } else {
                if (checkElement(item)) {
                    result.push(
                        new DraggableSVG(item, options, Ob)
                    );
                }
            }
            return result;
        }, []);
    }
}

class Cloneable extends SubjectModel {

    constructor(el, options) {
        super(el);
        this.enable(options);
    }

    _init() {
        const { 
            el, 
            options 
        } = this;
        const $el = helper(el);

        const {
            style,
            appendTo
        } = options;

        const css = {
            position: 'absolute',
            'z-index': '2147483647',
            ...style
        };

        this.storage = {
            css,
            parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
        };

        $el.on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);

        EVENTS.slice(0, 3).forEach((eventName) => {
            this.eventDispatcher.registerEvent(eventName);
        });
    }

    _processOptions(options) {
        let _style = {},
            _appendTo = null,
            _stack = document,
            _onInit = () => {},
            _onMove = () => {},
            _onDrop = () => {},
            _onDestroy = () => {};
        
        if (isDef(options)) {
            const {
                style,
                appendTo,
                stack,
                onInit,
                onMove,
                onDrop,
                onDestroy
            } = options;

            _style = (isDef(style) && typeof style === 'object') ? style : _style;
            _appendTo = appendTo || null;
    
            const dropZone = isDef(stack) 
                ? helper(stack)[0] 
                : document;
    
            _onInit = createMethod(onInit);
            _onMove = createMethod(onMove);
            _onDrop = isFunc(onDrop)
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
            _onDestroy = createMethod(onDestroy);
        }
        
        this.options = {
            style: _style,
            appendTo: _appendTo,
            stack: _stack
        };

        this.proxyMethods = {
            onInit: _onInit,
            onDrop: _onDrop,
            onMove: _onMove,
            onDestroy: _onDestroy
        };
    }

    _start({ clientX, clientY }) {
        const { 
            storage,
            el
        } = this;
    
        const {
            parent,
            css
        } = storage; 
    
        const { left, top } = getOffset(parent);
    
        css.left = `${(clientX - left)}px`;
        css.top = `${(clientY - top)}px`;
    
        const clone = el.cloneNode(true);
        helper(clone).css(css);
    
        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.cx = clientX;
        storage.cy = clientY;
        storage.clone = clone;
    
        helper(parent)[0].appendChild(clone);
        this._draw();
    }

    _moving({ clientX, clientY }) {    
        const { storage } = this;
    
        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.doDraw = true;
        storage.doMove = true;
    }
    
    _end(e) {
        const { storage } = this;
    
        const {
            clone,
            frameId
        } = storage;
    
        storage.doDraw = false;
        cancelAnimFrame(frameId);
    
        if (isUndef(clone)) return;
    
        this.proxyMethods.onDrop.call(this, e);
        clone.parentNode.removeChild(clone);
    
        delete storage.clone;
    }

    _animate() {
        const { storage } = this;
    
        storage.frameId = requestAnimFrame(this._animate);

        const {
            doDraw,
            clientX,
            clientY,
            cx,
            cy
        } = storage;

        if (!doDraw) return;
        storage.doDraw = false;

        this._drag(
            { 
                dx: clientX - cx,
                dy: clientY - cy
            }
        );
    }

    _processMove(dx, dy) {
        const {
            clone
        } = this.storage;

        const translate = `translate(${dx}px, ${dy}px)`;

        helper(clone).css({
            transform: translate,
            webkitTranform: translate,
            mozTransform: translate,
            msTransform: translate,
            otransform: translate 
        });
    }
    
    _destroy() {
        const {
            storage,
            proxyMethods,
            el
        } = this;

        if (isUndef(storage)) return;
        helper(el)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);

        proxyMethods.onDestroy.call(this, el);
        delete this.storage;
    }

    disable() {
        this._destroy();
    }

}

function clone(options) {
    if (this.length) {
        return arrMap.call(this, item => {
            return new Cloneable(item, options);
        });
    }
}

class Subjx extends Helper {

    drag() {
        return drag.call(this, ...arguments);
    }

    clone() {
        return clone.call(this, ...arguments);
    }

}

function subjx(params) {
    return new Subjx(params);
}

Object.defineProperty(subjx, 'createObservable', {
    value: () => {
        return new Observable();
    }
});

Object.defineProperty(subjx, 'Subjx', {
    value: Subjx
});

Object.defineProperty(subjx, 'Observable', {
    value: Observable
});

module.exports = subjx;
