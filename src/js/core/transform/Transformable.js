import { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import { EVENTS } from '../consts';
import { snapToGrid, RAD } from './common';

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    createMethod
} from '../util/util';

import {
    addClass,
    removeClass,
    getOffset
} from '../util/css-util';

export default class Transformable extends SubjectModel {

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
            console.log(options)
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