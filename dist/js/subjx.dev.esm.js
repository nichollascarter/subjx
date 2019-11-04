/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2019
* Karen Sarksyan
* nichollascarter@gmail.com
*/
const eventOptions = {
    passive: false
};

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
/* eslint-disable no-console */
const forEach = Array.prototype.forEach,
    arrSlice = Array.prototype.slice,
    arrMap = Array.prototype.map,
    arrReduce = Array.prototype.reduce,
    warn = console.warn;
/* eslint-disable no-console */

function isDef(val) {
    return val !== undefined && val !== null;
}

function isUndef(val) {
    return val === undefined || val === null;
}

function isFunc(val) {
    return typeof val === 'function';
}

function createMethod(fn) {
    return isFunc(fn)
        ? function () {
            fn.call(this, ...arguments);
        }
        : () => { };
}

class Helper {

    constructor(params) {
        if (typeof params === 'string') {
            let selector = document.querySelectorAll(params);
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
                for (let property in options) {
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
                    this[len].addEventListener(arguments[0], arguments[1], arguments[2]);
                } else if (document.attachEvent) {
                    this[len].attachEvent(`on${arguments[0]}`, arguments[1]);
                } else {
                    this[len][`on${arguments[0]}`] = arguments[1];
                }
            } else {
                listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], arguments[3], true);
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
            el.addEventListener(evt, doit, options || false);
        } else if (document.attachEvent) {
            el.attachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = doit;
        }
    } else {
        if (document.removeEventListener) {
            el.removeEventListener(evt, doit, options || false);
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

class SubjectModel {

    constructor(el) {
        this.el = el;
        this.storage = null;
        this.proxyMethods = null;

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

    _drag() {
        this._processMove(...arguments);
        this.proxyMethods.onMove.call(this, ...arguments);
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
            .on('touchmove', this._onTouchMove, eventOptions)
            .on('touchend', this._onTouchEnd, eventOptions);
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

}

function throwNotImplementedError() {
    throw Error(`Method not implemented`);
}

function getOffset(node) {
    return node.getBoundingClientRect();
}

function getTransform(el) {
    const transform = el.css('-webkit-transform') ||
        el.css('-moz-transform') ||
        el.css('-ms-transform') ||
        el.css('-o-transform') ||
        el.css('transform') ||
        'none';
    return transform;
}

function parseMatrix(value) {
    const transform = value.match(/-?\d+\.?\d+|-?\d+/g);

    if (transform) {
        return transform.map(item => {
            return parseFloat(item);
        });
    } else {
        return [1, 0, 0, 1, 0, 0];
    }
}

function addClass(node, cls) {
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
}

function removeClass(node, cls) {
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
}

function objectsCollide(a, b) {
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
}

const RAD = Math.PI / 180;

function snapToGrid(value, snap) {
    if (snap === 0) {
        return value;
    } else {
        const result = snapCandidate(value, snap);

        if (result - value < snap) {
            return result;
        }
    }
}

function snapCandidate(value, gridSize) {
    if (gridSize === 0) return value;
    return Math.round(value / gridSize) * gridSize;
}

function rotatedTopLeft(
    x,
    y,
    width,
    height,
    rotationAngle,
    revX,
    revY,
    doW,
    doH
) {
    const hw = parseFloat(width) / 2,
        hh = parseFloat(height) / 2;

    const cx = x + hw,
        cy = y + hh;

    const dx = x - cx,
        dy = y - cy;

    const originalTopLeftAngle = Math.atan2(doW ? 0 : dy, doH ? 0 : dx);
    const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

    const radius = Math.sqrt(Math.pow(doH ? 0 : hw, 2) + Math.pow(doW ? 0 : hh, 2));

    let cos = Math.cos(rotatedTopLeftAngle),
        sin = Math.sin(rotatedTopLeftAngle);

    cos = revX === true ? -cos : cos;
    sin = revY === true ? -sin : sin;

    const rx = cx + radius * cos,
        ry = cy + radius * sin;

    return {
        left: floatToFixed(rx),
        top: floatToFixed(ry)
    };
}

function floatToFixed(val, size = 6) {
    return Number(val.toFixed(size));
}

class Transformable extends SubjectModel {

    constructor(el, options, observable) {
        super(el);
        if (this.constructor === Transformable) {
            throw new TypeError('Cannot construct Transformable instances directly');
        }
        this.observable = observable;
        this.enable(options);
    }

    _cursorPoint() {
        throw Error(`'_cursorPoint()' method not implemented`);
    }

    

    _rotate() {
        this._processRotate(...arguments);
        this.proxyMethods.onRotate.call(this, ...arguments);
    }

    _resize() {
        this._processResize(...arguments);
        this.proxyMethods.onResize.call(this, ...arguments);
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
            _themeColor = '#00a8ff',
            _rotationPoint = false,
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
                axis,
                cursorMove,
                cursorResize,
                cursorRotate,
                rotationPoint,
                restrict,
                onInit,
                onDrop,
                onMove,
                onResize,
                onRotate,
                onDestroy,
                container,
                proportions,
                themeColor
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
                    : helper(restrict)[0] || document;
            }

            _themeColor = themeColor || '#00a8ff';
            _cursorMove = cursorMove || 'auto';
            _cursorResize = cursorResize || 'auto';
            _cursorRotate = cursorRotate || 'auto';
            _axis = axis || 'xy';

            _container = isDef(container) && helper(container)[0]
                ? helper(container)[0]
                : _container;

            _rotationPoint = rotationPoint || false;
            _proportions = proportions || false;

            _onInit = createMethod(onInit);
            _onDrop = createMethod(onDrop);
            _onMove = createMethod(onMove);
            _onResize = createMethod(onResize);
            _onRotate = createMethod(onRotate);
            _onDestroy = createMethod(onDestroy);
        }

        this.options = {
            axis: _axis,
            themeColor: _themeColor,
            cursorMove: _cursorMove,
            cursorRotate: _cursorRotate,
            cursorResize: _cursorResize,
            rotationPoint: _rotationPoint,
            restrict: _restrict,
            container: _container,
            snap: _snap,
            each: _each,
            proportions: _proportions
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
            revY,
            handle
        } = storage;

        const {
            snap,
            each,
            restrict
        } = options;

        const {
            move: moveEach,
            resize: resizeEach,
            rotate: rotateEach
        } = each;

        if (doResize) {
            const {
                transform,
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
                ? snapToGrid(x - cx, snap.x / transform.scX)
                : 0;

            let dy = doy
                ? snapToGrid(y - cy, snap.y / transform.scY)
                : 0;

            dx = dox ? (revX ? - dx : dx) : 0,
            dy = doy ? (revY ? - dy : dy) : 0;

            self._resize(
                dx,
                dy,
                handle[0]
            );

            if (resizeEach) {
                observable.notify(
                    'onresize',
                    self,
                    {
                        dx,
                        dy,
                        handle: handle[0]
                    }
                );
            }
        }

        if (doDrag) {
            const {
                restrictOffset,
                elementOffset,
                nx,
                ny
            } = storage;

            if (isDef(restrict)) {
                if ((clientX - restrictOffset.left) < nx - elementOffset.left) {
                    clientX = nx - elementOffset.left + restrictOffset.left;
                }

                if ((clientY - restrictOffset.top) < ny - elementOffset.top) {
                    clientY = ny - elementOffset.top + restrictOffset.top;
                }
            }

            const dx = dox
                ? snapToGrid(clientX - nx, snap.x)
                : 0;

            const dy = doy
                ? snapToGrid(clientY - ny, snap.y)
                : 0;

            self._drag(
                dx,
                dy
            );

            if (moveEach) {
                observable.notify('onmove',
                    self,
                    {
                        dx,
                        dy
                    }
                );
            }
        }

        if (doRotate) {
            const {
                pressang,
                center
            } = storage;

            const radians = Math.atan2(
                clientY - center.y,
                clientX - center.x
            ) - pressang;

            self._rotate(
                snapToGrid(radians, snap.angle)
            );

            if (rotateEach) {
                observable.notify('onrotate',
                    self,
                    {
                        radians
                    }
                );
            }
        }

        if (doSetCenter) {
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
        const {
            observable,
            storage,
            options,
            el
        } = this;

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
            handles,
            radius
        } = storage;

        const {
            axis,
            restrict
        } = options;

        if (isDef(radius)) {
            removeClass(radius, 'sjx-hidden');
        }

        const doRotate = handle.is(handles.rotator),
            doSetCenter = isDef(handles.center)
                ? handle.is(handles.center)
                : false;

        const {
            clientX,
            clientY
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

        const {
            x: bx,
            y: by
        } = this._pointToControls({ x, y });

        const newStorageValues = {
            clientX,
            clientY,
            nx: x,
            ny: y,
            cx: nx,
            cy: ny,
            bx,
            by,
            doResize,
            doDrag: !(doRotate || doResize || doSetCenter),
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
                handle.is(handles.br)
                : true),
            doy: /\y/.test(axis) && (doResize
                ?
                handle.is(handles.br) ||
                handle.is(handles.bl) ||
                handle.is(handles.bc) ||
                handle.is(handles.tr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tc)
                : true)
        };

        this.storage = {
            ...storage,
            ...newStorageValues
        };

        observable.notify(
            'ongetstate',
            this,
            {
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
        const {
            storage,
            options
        } = this;

        const {
            x,
            y
        } = this._cursorPoint(e);

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

    _end(e) {
        const {
            observable,
            storage,
            proxyMethods,
            el
        } = this;

        const {
            doResize,
            doDrag,
            frame,
            radius
        } = storage;

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
        proxyMethods.onDrop.call(this, e, el);

        observable.notify(
            'onapply',
            this,
            {
                actionName,
                e
            }
        );

        cancelAnimFrame(frame);

        helper(document.body).css({ cursor: 'auto' });
        if (isDef(radius)) {
            addClass(radius, 'sjx-hidden');
        }
    }

    _checkHandles(handle, handles) {
        const isTL = handle.is(handles.tl),
            isTC = handle.is(handles.tc),
            isTR = handle.is(handles.tr),
            isBL = handle.is(handles.bl),
            isBC = handle.is(handles.bc),
            isBR = handle.is(handles.br),
            isML = handle.is(handles.ml),
            isMR = handle.is(handles.mr);

        //reverse axis
        const revX = isTL || isML || isBL || isTC,
            revY = isTL || isTR || isTC || isML;

        const onTopEdge = isTC || isTR || isTL,
            onLeftEdge = isTL || isML || isBL,
            onRightEdge = isTR || isMR || isBR,
            onBottomEdge = isBR || isBC || isBL;

        const doW = isML || isMR,
            doH = isTC || isBC;

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

    notifyMove({ dx, dy }) {
        this._drag(
            dx,
            dy
        );
    }

    notifyRotate({ radians }) {
        const {
            snap
        } = this.options;

        this._rotate(
            snapToGrid(radians, snap.angle)
        );
    }

    notifyResize({ dx, dy }) {
        this._resize(
            dx,
            dy
        );
    }

    notifyApply({ e, actionName }) {
        this.proxyMethods.onDrop.call(this, e, this.el);
        this._apply(actionName);
    }

    notifyGetState(data) {
        const { storage } = this;

        const recalc = this._getState(
            data
        );

        this.storage = {
            ...storage,
            ...recalc
        };
    }

    subscribe(events) {
        const { observable: ob } = this;

        const {
            resize,
            move,
            rotate
        } = events;

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

        ob.unsubscribe('ongetstate', this)
            .unsubscribe('onapply', this)
            .unsubscribe('onmove', this)
            .unsubscribe('onresize', this)
            .unsubscribe('onrotate', this);
    }

    disable() {
        const {
            storage,
            proxyMethods,
            el
        } = this;

        if (isUndef(storage)) return;

        // unexpected case
        if (storage.onExecution) {
            this._end();
            helper(document)
                .off('mousemove', this._onMouseMove)
                .off('mouseup', this._onMouseUp)
                .off('touchmove', this._onTouchMove, eventOptions)
                .off('touchend', this._onTouchEnd, eventOptions);
        }

        removeClass(el, 'sjx-drag');

        this._destroy();
        this.unsubscribe();

        proxyMethods.onDestroy.call(this, el);
        delete this.storage;
    }

}

const MIN_SIZE = 2;
const CENTER_DELTA = 7;

class Draggable extends Transformable {

    constructor(el, options, Observable) {
        super(el, options, Observable);
    }

    _init(el) {
        const container = document.createElement('div');
        addClass(container, 'sjx-wrapper');

        el.parentNode.insertBefore(container, el);

        const { options } = this;

        const {
            rotationPoint,
        } = options;

        const {
            left,
            top,
            width,
            height
        } = el.style;

        const $el = helper(el);

        const w = width || $el.css('width'),
            h = height || $el.css('height'),
            t = top || $el.css('top'),
            l = left || $el.css('left');

        const css = {
            top: t,
            left: l,
            width: w,
            height: h,
            transform: getTransform($el)
        };

        const controls = document.createElement('div');
        addClass(controls, 'sjx-controls');

        const handles = {
            normal: ['sjx-normal'],
            tl: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-l', 'sjx-hdl-tl'],
            tr: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-r', 'sjx-hdl-tr'],
            br: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-r', 'sjx-hdl-br'],
            bl: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-l', 'sjx-hdl-bl'],
            tc: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-c', 'sjx-hdl-tc'],
            bc: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-c', 'sjx-hdl-bc'],
            ml: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-l', 'sjx-hdl-ml'],
            mr: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-r', 'sjx-hdl-mr'],
            center: rotationPoint ? ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc'] : undefined,
            //...(rotationPoint && { center: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc']}), IE11 not supports
            rotator: ['sjx-hdl', 'sjx-hdl-m', 'sjx-rotator']
        };

        Object.keys(handles).forEach(key => {
            const data = handles[key];
            if (isUndef(data)) return;
            const handler = createHandler(data);
            handles[key] = handler;
            controls.appendChild(handler);
        });

        if (isDef(handles.center)) {
            const cHandle = helper(handles.center);
            cHandle.css({
                left: `${el.getAttribute('data-cx')}px`,
                top: `${el.getAttribute('data-cy')}px`
            });
        }

        container.appendChild(controls);

        const $controls = helper(controls);
        $controls.css(css);

        this.storage = {
            controls,
            handles,
            radius: undefined,
            parent: el.parentNode
        };

        $controls
            .on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
    }

    _destroy() {
        const {
            controls
        } = this.storage;

        helper(controls)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);

        const wrapper = controls.parentNode;
        wrapper.parentNode.removeChild(wrapper);
    }

    _compute(e) {
        const {
            handles,
        } = this.storage;

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

        //reverse angle
        const factor = handle.is(handles.tr) ||
            handle.is(handles.bl)
            ? -1
            : 1;

        const _computed = this._getState({
            factor,
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
            onTopEdge,
            onLeftEdge,
            onRightEdge,
            onBottomEdge,
            handle,
            pressang
        };
    }

    _pointToElement({ x, y }) {
        const {
            transform,
        } = this.storage;

        const ctm = [...transform.matrix];
        ctm[4] = ctm[5] = 0;

        return this._applyMatrixToPoint(
            matrixInvert(ctm),
            x,
            y
        );
    }

    _pointToControls(data) {
        return this._pointToElement(data);
    }

    _applyMatrixToPoint(matrix, x, y) {
        return multiplyMatrixAndPoint(
            {
                x,
                y
            },
            matrix
        );
    }

    _cursorPoint({ clientX, clientY }) {
        const {
            container
        } = this.options;

        const globalMatrix = parseMatrix(
            getTransform(helper(container))
        );

        return multiplyMatrixAndPoint(
            {
                x: clientX,
                y: clientY
            },
            matrixInvert(
                globalMatrix
            )
        );
    }

    _apply() {
        const {
            el,
            storage
        } = this;

        const $el = helper(el);

        const {
            cached,
            controls,
            transform,
            handles
        } = storage;

        const $controls = helper(controls);

        const cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));

        const hW = cw / 2,
            hH = ch / 2;

        const {
            center: cHandle
        } = handles;

        const isDefCenter = isDef(cHandle);

        const centerX = isDefCenter
            ? parseFloat(helper(cHandle).css('left'))
            : hW;
        const centerY = isDefCenter
            ? parseFloat(helper(cHandle).css('top'))
            : hH;

        el.setAttribute('data-cx', centerX);
        el.setAttribute('data-cy', centerY);

        if (isUndef(cached)) return;

        const { dx, dy } = cached;

        const css = matrixToCSS(transform.matrix);

        const left = parseFloat(
            el.style.left || $el.css('left'),
        );

        const top = parseFloat(
            el.style.top || $el.css('top'),
        );

        css.left = `${left + dx}px`;
        css.top = `${top + dy}px`;

        $el.css(css);
        $controls.css(css);

        this.storage.cached = null;
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            options
        } = this;

        const {
            proportions
        } = options;

        const {
            controls,
            coords,
            cw,
            ch,
            transform,
            refang,
            revX,
            revY,
            doW,
            doH
        } = storage;

        const ratio = doW || (!doW && !doH)
            ? (cw + dx) / cw
            : (ch + dy) / ch;

        const newWidth = proportions ? cw * ratio : cw + dx,
            newHeight = proportions ? ch * ratio : ch + dy;

        if (newWidth < MIN_SIZE || newHeight < MIN_SIZE) return;

        const matrix = [...transform.matrix];

        const newCoords = rotatedTopLeft(
            matrix[4],
            matrix[5],
            newWidth,
            newHeight,
            refang,
            revX,
            revY,
            doW,
            doH
        );

        const nx = coords.left - newCoords.left,
            ny = coords.top - newCoords.top;

        matrix[4] += nx;
        matrix[5] += ny;

        const css = matrixToCSS(matrix);

        css.width = `${newWidth}px`;
        css.height = `${newHeight}px`;

        helper(controls).css(css);
        helper(el).css(css);

        storage.cached = {
            dx: nx,
            dy: ny
        };
    }

    _processMove(dx, dy) {
        const {
            el,
            storage
        } = this;

        const {
            controls,
            transform
        } = storage;

        const {
            matrix,
            parentMatrix
        } = transform;

        const pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;

        const n_matrix = [...matrix];

        n_matrix[4] = matrix[4] + dx;
        n_matrix[5] = matrix[5] + dy;

        const css = matrixToCSS(n_matrix);

        helper(controls).css(css);
        helper(el).css(css);

        storage.cached = {
            dx,
            dy
        };
    }

    _processRotate(radians) {
        const {
            el,
            storage
        } = this;

        const {
            controls,
            transform,
            center
        } = storage;

        const {
            matrix,
            parentMatrix
        } = transform;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const translateMatrix = [
            1,
            0,
            0,
            1,
            center.cx,
            center.cy
        ];

        const rotMatrix = [
            cos,
            sin,
            -sin,
            cos,
            0,
            0
        ];

        const pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;

        const resRotMatrix = multiplyMatrix(
            matrixInvert(pctm),
            multiplyMatrix(rotMatrix, pctm)
        );

        const nMatrix = multiplyMatrix(
            multiplyMatrix(translateMatrix, resRotMatrix),
            matrixInvert(translateMatrix)
        );

        const resMatrix = multiplyMatrix(nMatrix, matrix);

        const css = matrixToCSS(resMatrix);

        helper(controls).css(css);
        helper(el).css(css);
    }

    _getState(params) {
        const {
            factor,
            revX,
            revY,
            doW,
            doH
        } = params;

        const {
            el,
            storage,
            options
        } = this;

        const {
            container
        } = options;

        const {
            handles,
            controls,
            parent
        } = storage;

        const {
            center: cHandle,
            tl,
            tr
        } = handles;

        const tl_off = getOffset(tl),
            tr_off = getOffset(tr);

        const refang = Math.atan2(
            tr_off.top - tl_off.top,
            tr_off.left - tl_off.left
        ) * factor;

        const $controls = helper(controls);

        const containerMatrix = parseMatrix(
            getTransform(helper(container))
        );

        const matrix = parseMatrix(
            getTransform(helper(controls))
        );

        const pMatrix = parseMatrix(
            getTransform(helper(parent))
        );

        const parentMatrix = parent === container
            ? multiplyMatrix(
                pMatrix,
                containerMatrix
            )
            : containerMatrix;

        const transform = {
            matrix,
            parentMatrix,
            scX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
            scY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]),
        };

        const cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));

        // getting current coordinates considering rotation angle                                                                                                  
        const coords = rotatedTopLeft(
            matrix[4],
            matrix[5],
            cw,
            ch,
            refang,
            revX,
            revY,
            doW,
            doH
        );

        const hW = cw / 2,
            hH = ch / 2;

        const offset_ = getOffset(el),
            isDefCenter = isDef(cHandle);

        const centerX = isDefCenter
            ? parseFloat(helper(cHandle).css('left'))
            : hW;
        const centerY = isDefCenter
            ? parseFloat(helper(cHandle).css('top'))
            : hH;

        const cDelta = isDefCenter ? CENTER_DELTA : 0;

        return {
            transform,
            cw,
            ch,
            coords,
            center: {
                x: offset_.left + centerX - cDelta,
                y: offset_.top + centerY - cDelta,
                cx: -centerX + hW - cDelta,
                cy: -centerY + hH - cDelta,
                hx: centerX,
                hy: centerY
            },
            factor,
            refang,
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(x, y) {
        const { storage } = this;
        const { handles, center } = storage;

        const left = `${center.hx + x}px`,
            top = `${center.hy + y}px`;

        helper(handles.center).css(
            {
                left,
                top
            }
        );
    }

    resetCenterPoint() {
        const {
            handles,
        } = this.storage;

        helper(handles.center).css(
            {
                left: null,
                top: null
            }
        );
    }

    get controls() {
        return this.storage.controls;
    }

}

function matrixToCSS(arr) {
    const style = `matrix(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
    };
}

function multiplyMatrixAndPoint(point, matrix) {
    const {
        x, y
    } = point;

    const [a, b, c, d, e, f] = matrix;

    return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
    };
}

//http://blog.acipo.com/matrix-inversion-in-javascript/
function matrixInvert(ctm) {
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    const M = [
        [ctm[0], ctm[2], ctm[4]],
        [ctm[1], ctm[3], ctm[5]],
        [0, 0, 1]
    ];

    //if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
        return;
    }

    //create the identity matrix (I), and a copy (C) of the original
    const dim = M.length;

    const I = [],
        C = [];

    for (let i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];
        for (let j = 0; j < dim; j += 1) {
            //if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            }

            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }

    // Perform elementary row operations
    for (let i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        let e = C[i][i];

        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if (e === 0) {
            //look through every row below the i'th row
            for (let ii = i + 1; ii < dim; ii += 1) {
                //if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] !== 0) {
                    //it would make the diagonal have a non-0 so swap it
                    for (let j = 0; j < dim; j++) {
                        e = C[i][j]; //temp store i'th row
                        C[i][j] = C[ii][j]; //replace i'th row by ii'th
                        C[ii][j] = e; //repace ii'th by temp
                        e = I[i][j]; //temp store i'th row
                        I[i][j] = I[ii][j]; //replace i'th row by ii'th
                        I[ii][j] = e; //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if (e === 0) {
                return;
            }
        }

        // Scale this row down by e (so we have a 1 on the diagonal)
        for (let j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix
            I[i][j] = I[i][j] / e; //apply to identity
        }

        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for (let ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            }

            // We want to change this element to 0
            e = C[ii][i];

            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for (let j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix
                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    }

    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return [
        I[0][0], I[1][0],
        I[0][1], I[1][1],
        I[0][2], I[1][2]
    ];
}

function multiplyMatrix(mtrx1, mtrx2) {
    const m1 = [
        [mtrx1[0], mtrx1[2], mtrx1[4]],
        [mtrx1[1], mtrx1[3], mtrx1[5]],
        [0, 0, 1]
    ];

    const m2 = [
        [mtrx2[0], mtrx2[2], mtrx2[4]],
        [mtrx2[1], mtrx2[3], mtrx2[5]],
        [0, 0, 1]
    ];

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

    return [
        result[0][0], result[1][0],
        result[0][1], result[1][1],
        result[0][2], result[1][2]
    ];
}

function createHandler(classList) {
    const element = document.createElement('div');
    classList.forEach(cls => {
        addClass(element, cls);
    });
    return element;
}

const ALLOWED_ELEMENTS = [
    'circle', 'ellipse',
    'image', 'line',
    'path', 'polygon',
    'polyline', 'rect',
    'text', 'g'
];

function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function createSVGMatrix() {
    return createSVGElement('svg').createSVGMatrix();
}

function getTransformToElement(toElement, g) {
    const gTransform = g.getScreenCTM() || createSVGMatrix();
    return gTransform.inverse().multiply(
        toElement.getScreenCTM() || createSVGMatrix()
    );
}

function matrixToString(m) {
    return `matrix(${m.a},${m.b},${m.c},${m.d},${m.e},${m.f})`;
}

function pointTo(ctm, svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(ctm);
}

function cloneMatrix(b) {
    const a = createSVGMatrix();

    a.a = b.a;
    a.b = b.b;
    a.c = b.c;
    a.d = b.d;
    a.e = b.e;
    a.f = b.f;

    return a;
}

function checkElement(el) {
    const tagName = el.tagName.toLowerCase();

    if (ALLOWED_ELEMENTS.indexOf(tagName) === -1) {
        warn(
            'Selected element is not allowed to transform. Allowed elements:\n' +
            'circle, ellipse, image, line, path, polygon, polyline, rect, text, g'
        );
        return false;
    } else {
        return true;
    }
}

function isIdentity(matrix) {
    return matrix.a === 1 &&
        matrix.b === 0 &&
        matrix.c === 0 &&
        matrix.d === 1 &&
        matrix.e === 0 &&
        matrix.f === 0;
}

const dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
const sepRE = /\s*,\s*|\s+/g;

function parsePath(path) {
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
}

function movePath(params) {
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
                        const [x, y] = values.slice(k, k + 2);

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
                        const [x, y] = values.slice(k, k + 2);

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
                        const [x1, y1, x2, y2] = values.slice(k, k + 4);

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
}

function resizePath(params) {
    const {
        path,
        localCTM,
        container
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,
                            container,
                            x1,
                            y1
                        );

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            container,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative && !firstCommand) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,
                            container,
                            x1,
                            y1
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            container,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            container,
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
}

const MIN_SIZE$1 = 5;
const ROT_OFFSET = 50;
const floatRE = /[+-]?\d+(\.\d+)?/g;

class DraggableSVG extends Transformable {

    constructor(el, options, observable) {
        super(el, options, observable);
    }

    _init(el) {
        const { options } = this;

        const {
            rotationPoint,
            container,
            themeColor
        } = options;

        const wrapper = createSVGElement('g');
        addClass(wrapper, 'sjx-svg-wrapper');
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

            handles[key] = createHandler$1(
                x,
                y,
                color,
                key
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

        if (Math.abs(newWidth) < MIN_SIZE$1 || Math.abs(newHeight) < MIN_SIZE$1) return;

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

        this._moveCenterHandle(-nx, -ny);
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

        const boxCenterX = c_left + cw / 2,
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
            const x = isDef(element.x.baseVal[0])
                ? element.x.baseVal[0].value
                : (Number(element.getAttribute('x')) || 0);
            const y = isDef(element.y.baseVal[0])
                ? element.y.baseVal[0].value
                : (Number(element.getAttribute('y')) || 0);

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

    }

    attrs.forEach(([key, value]) => {
        element.setAttribute(key, value);
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

function createHandler$1(l, t, color, key) {
    const handler = createSVGElement('circle');
    addClass(handler, `sjx-svg-hdl-${key}`);

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
            //...((isDef(style) && typeof style === 'object') && style)
        };

        this.storage = {
            css,
            parent: isDef(appendTo) ? helper(appendTo)[0] : document.body,
        };

        $el.on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
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
            clientX - cx,
            clientY - cy
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

    constructor(params) {
        super(params);
    }

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

export default subjx;
