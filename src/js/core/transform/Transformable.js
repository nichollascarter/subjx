import { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import { getMinMaxOfArray, snapToGrid, RAD } from './common';

import {
    LIB_CLASS_PREFIX,
    NOTIFIER_CONSTANTS,
    EVENT_EMITTER_CONSTANTS,
    TRANSFORM_HANDLES_CONSTANTS,
    CLIENT_EVENTS_CONSTANTS
} from '../consts';

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    createMethod
} from '../util/util';

import {
    addClass,
    removeClass
} from '../util/css-util';

const {
    NOTIFIER_EVENTS,
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
} = NOTIFIER_CONSTANTS;

const {
    EMITTER_EVENTS,
    E_DRAG_START,
    E_DRAG,
    E_DRAG_END,
    E_RESIZE_START,
    E_RESIZE,
    E_RESIZE_END,
    E_ROTATE_START,
    E_ROTATE,
    E_ROTATE_END
} = EVENT_EMITTER_CONSTANTS;

const { TRANSFORM_HANDLES_KEYS, TRANSFORM_EDGES_KEYS } = TRANSFORM_HANDLES_CONSTANTS;
const {
    E_MOUSEDOWN,
    E_TOUCHSTART,
    E_MOUSEMOVE,
    E_MOUSEUP,
    E_TOUCHMOVE,
    E_TOUCHEND
} = CLIENT_EVENTS_CONSTANTS;

const {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    BOTTOM_CENTER,
    MIDDLE_LEFT,
    MIDDLE_RIGHT
} = TRANSFORM_HANDLES_KEYS;

const {
    TOP_EDGE,
    BOTTOM_EDGE,
    LEFT_EDGE,
    RIGHT_EDGE
} = TRANSFORM_EDGES_KEYS;

const { keys, values } = Object;

export default class Transformable extends SubjectModel {

    constructor(elements, options, observable) {
        super(elements);
        if (this.constructor === Transformable) {
            throw new TypeError('Cannot construct Transformable instances directly');
        }
        this.observable = observable;

        EMITTER_EVENTS.forEach(eventName => this.eventDispatcher.registerEvent(eventName));
        super.enable(options);
    }

    _cursorPoint() {
        throw Error(`'_cursorPoint()' method not implemented`);
    }

    _rotate({ element, radians, ...rest }) {
        const resultMtrx = this._processRotate(element, radians);
        const finalArgs = {
            transform: resultMtrx,
            delta: radians,
            ...rest
        };
        this.proxyMethods.onRotate.call(this, finalArgs);
        super._emitEvent(E_ROTATE, finalArgs);
    }

    _resize({ element, dx, dy, ...rest }) {
        const finalValues = this._processResize(element, { dx, dy });
        const finalArgs = {
            ...finalValues,
            dx,
            dy,
            ...rest
        };
        this.proxyMethods.onResize.call(this, finalArgs);
        super._emitEvent(E_RESIZE, finalArgs);
    }

    _processOptions(options = {}) {
        const { elements } = this;

        elements.map((element) => addClass(element, `${LIB_CLASS_PREFIX}drag`));

        const {
            each = {
                move: false,
                resize: false,
                rotate: false
            },
            snap = {
                x: 10,
                y: 10,
                angle: 10
            },
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
            onInit = () => { },
            onDrop = () => { },
            onMove = () => { },
            onResize = () => { },
            onRotate = () => { },
            onDestroy = () => { },
            container = elements[0].parentNode,
            controlsContainer = container,
            proportions = false,
            rotatorAnchor = null,
            rotatorOffset = 50,
            showNormal = true,
            custom
        } = options;

        this.options = {
            axis,
            cursorMove,
            cursorRotate,
            cursorResize,
            rotationPoint,
            restrict: restrict
                ? helper(restrict)[0] || document.body
                : null,
            container: helper(container)[0],
            controlsContainer: helper(controlsContainer)[0],
            snap: {
                ...snap,
                angle: snap.angle * RAD
            },
            each,
            proportions,
            draggable,
            resizable,
            rotatable,
            scalable,
            applyTranslate,
            custom: (typeof custom === 'object' && custom) || null,
            rotatorAnchor,
            rotatorOffset,
            showNormal,
            isGrouped: elements.length > 1
        };

        this.proxyMethods = {
            onInit: createMethod(onInit),
            onDrop: createMethod(onDrop),
            onMove: createMethod(onMove),
            onResize: createMethod(onResize),
            onRotate: createMethod(onRotate),
            onDestroy: createMethod(onDestroy)
        };

        this.subscribe(each);
    }

    _animate() {
        const self = this;
        const {
            observable,
            storage,
            options,
            elements
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
            relativeX,
            relativeY,
            doDrag,
            doResize,
            doRotate,
            doSetCenter,
            revX,
            revY,
            mouseEvent,
            data
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
            rotatable,
            isGrouped
        } = options;

        if (doResize && resizable) {
            const distX = snapToGrid(clientX - relativeX, snap.x);
            const distY = snapToGrid(clientY - relativeY, snap.y);

            const args = {
                distX,
                distY,
                clientX,
                clientY,
                mouseEvent
            };

            elements.map((element) => {
                const {
                    transform: {
                        scX,
                        scY,
                        ctm
                    }
                } = data.get(element);

                const { x, y } = !isGrouped
                    ? this._pointToTransform(
                        {
                            x: distX,
                            y: distY,
                            matrix: ctm
                        }
                    )
                    : { x: distX, y: distY };

                let dx = dox ? (revX ? -x : x) : 0;
                let dy = doy ? (revY ? -y : y) : 0;

                self._resize({
                    ...args,
                    element,
                    dx,
                    dy
                });
            });

            this._processControlsResize({ dx: distX, dy: distY });

            if (resizeEach) {
                observable.notify(
                    ON_RESIZE,
                    self,
                    args
                );
            }
        }

        if (doDrag && draggable) {
            const dx = dox
                ? snapToGrid(clientX - relativeX, snap.x)
                : 0;

            const dy = doy
                ? snapToGrid(clientY - relativeY, snap.y)
                : 0;

            const args = {
                dx,
                dy,
                clientX,
                clientY,
                mouseEvent
            };

            elements.map((element) => (
                super._drag({
                    element,
                    ...args
                })
            ));

            this._processControlsMove({ dx, dy });

            if (moveEach) {
                observable.notify(
                    ON_MOVE,
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
            const radians = snapToGrid(delta - pressang, snap.angle);

            const args = {
                clientX,
                clientY,
                mouseEvent
            };

            elements.map((element) => (
                self._rotate({
                    element,
                    radians,
                    ...args
                })
            ));

            this._processControlsRotate({ radians });

            if (rotateEach) {
                observable.notify(
                    ON_ROTATE,
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
            elements,
            observable,
            options: { axis, each },
            storage,
            storage: { handles }
        } = this;

        const isTarget = values(handles).some((hdl) => helper(e.target).is(hdl)) ||
            elements.some(element => element.contains(e.target));

        storage.isTarget = isTarget;

        if (!isTarget) return;

        const computed = this._compute(e, elements);

        keys(computed).map(prop => storage[prop] = computed[prop]);

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

        if (isDef(radius)) removeClass(radius, `${LIB_CLASS_PREFIX}hidden`);

        const doRotate = handle.is(rotator),
            doSetCenter = isDef(center)
                ? handle.is(center)
                : false;

        const doDrag = isTarget && !(doRotate || doResize || doSetCenter);

        const nextStorage = {
            mouseEvent: e,
            clientX,
            clientY,
            doResize,
            doDrag,
            doRotate,
            doSetCenter,
            onExecution: true,
            cursor: null,
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
                : true)
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
            super._emitEvent(E_RESIZE_START, eventArgs);
        } else if (doRotate) {
            super._emitEvent(E_ROTATE_START, eventArgs);
        } else if (doDrag) {
            super._emitEvent(E_DRAG_START, eventArgs);
        }

        const {
            move,
            resize,
            rotate
        } = each;

        const actionName = doResize
            ? E_RESIZE
            : (doRotate ? E_ROTATE : E_DRAG);

        const triggerEvent =
            (doResize && resize) ||
            (doRotate && rotate) ||
            (doDrag && move);

        observable.notify(
            ON_GETSTATE,
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
        const { storage = {}, options } = this;

        if (!storage.isTarget) return;

        const { x, y } = this._cursorPoint(e);

        storage.mouseEvent = e;
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
            elements,
            options: { isGrouped, each },
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
            ? E_RESIZE
            : (doDrag ? E_DRAG : E_ROTATE);

        storage.doResize = false;
        storage.doDrag = false;
        storage.doRotate = false;
        storage.doSetCenter = false;
        storage.doDraw = false;
        storage.onExecution = false;
        storage.cursor = null;

        elements.map((el) => this._applyTransformToElement(el, actionName));

        if (isGrouped && actionName === E_ROTATE) {
            this._applyTransformToHandles();
            this._updateControlsView();
        }

        const eventArgs = {
            clientX,
            clientY
        };

        proxyMethods.onDrop.call(this, eventArgs);

        if (doResize) {
            super._emitEvent(E_RESIZE_END, eventArgs);
        } else if (doRotate) {
            super._emitEvent(E_ROTATE_END, eventArgs);
        } else if (doDrag) {
            super._emitEvent(E_DRAG_END, eventArgs);
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
            ON_APPLY,
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
            addClass(radius, `${LIB_CLASS_PREFIX}hidden`);
        }
    }

    _compute(e, elements) {
        const { handles, data } = this.storage;

        const handle = helper(e.target);

        const {
            revX,
            revY,
            doW,
            doH,
            ...rest
        } = this._checkHandles(handle, handles);

        const { x, y } = this._cursorPoint(e);
        const { x: bx, y: by } = this._pointToControls({ x, y });

        elements.map(element => {
            const { transform, ...nextData } = this._getElementState(element, { revX, revY, doW, doH });
            const { x: ex, y: ey } = this._pointToTransform(
                { x, y, matrix: transform.ctm }
            );

            data.set(element, {
                ...data.get(element),
                ...nextData,
                transform,
                cx: ex,
                cy: ey
            });
        });

        const commonState = this._getCommonState();

        const pressang = Math.atan2(
            y - commonState.center.y,
            x - commonState.center.x
        );

        return {
            data,
            ...rest,
            handle: values(handles).some(hdl => helper(e.target).is(hdl))
                ? handle
                : helper(elements[0]),
            pressang,
            ...commonState,
            revX,
            revY,
            doW,
            doH,
            relativeX: x,
            relativeY: y,
            bx,
            by
        };
    }

    _checkHandles(handle, handles) {
        const checkIsHandle = hdl => isDef(hdl) ? handle.is(hdl) : false;
        const checkAction = items => items.some(key => checkIsHandle(handles[key]));

        const revX = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE]);
        const revY = checkAction([TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE]);

        const onTopEdge = checkAction([TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE]);
        const onLeftEdge = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE]);
        const onRightEdge = checkAction([TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE]);
        const onBottomEdge = checkAction([BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE]);

        const doW = checkAction([MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE]);
        const doH = checkAction([TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE]);

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

    _restrictHandler(matrix) {
        let restrictX = null,
            restrictY = null;

        const elBox = this.getBoundingRect(matrix);

        const containerBBox = this._getRestrictedBBox();

        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(containerBBox);

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

    _destroy() {
        const {
            elements,
            storage: {
                controls,
                wrapper
            }
        } = this;

        [...elements, controls].map(target => (
            helper(target)
                .off(E_MOUSEDOWN, this._onMouseDown)
                .off(E_TOUCHSTART, this._onTouchStart)
        ));

        wrapper.parentNode.removeChild(wrapper);
    }

    notifyMove() {
        super._drag(...arguments);
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
            this._applyTransformToElement(actionName);
            super._emitEvent(`${actionName}End`, { clientX, clientY });
        }
    }

    notifyGetState({ clientX, clientY, actionName, triggerEvent, ...rest }) {
        if (triggerEvent) {
            const recalc = this._getElementState(rest);

            this.storage = {
                ...this.storage,
                ...recalc
            };
            super._emitEvent(`${actionName}Start`, { clientX, clientY });
        }
    }

    subscribe({ resize, move, rotate }) {
        const { observable: ob } = this;

        if (move || resize || rotate) {
            ob.subscribe(ON_GETSTATE, this)
                .subscribe(ON_APPLY, this);
        }

        if (move) {
            ob.subscribe(ON_MOVE, this);
        }
        if (resize) {
            ob.subscribe(ON_RESIZE, this);
        }
        if (rotate) {
            ob.subscribe(ON_ROTATE, this);
        }
    }

    unsubscribe() {
        const { observable: ob } = this;
        NOTIFIER_EVENTS.map(eventName => ob.unsubscribe(eventName, this));
    }

    disable() {
        const {
            storage,
            proxyMethods,
            elements
        } = this;

        if (isUndef(storage)) return;

        // unexpected case
        if (storage.onExecution) {
            helper(document)
                .off(E_MOUSEMOVE, this._onMouseMove)
                .off(E_MOUSEUP, this._onMouseUp)
                .off(E_TOUCHMOVE, this._onTouchMove)
                .off(E_TOUCHEND, this._onTouchEnd);
        }

        elements.map((element) => removeClass(element, `${LIB_CLASS_PREFIX}drag`));

        this.unsubscribe();
        this._destroy();

        proxyMethods.onDestroy.call(this, elements);
        delete this.storage;
    }

    exeDrag({ dx, dy }) {
        const { draggable } = this.options;
        if (!draggable) return;

        this.storage = {
            ...this.storage,
            ...this._getElementState({
                revX: false,
                revY: false,
                doW: false,
                doH: false
            })
        };

        super._drag({ dx, dy });
        this._applyTransformToElement(E_DRAG);
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
            ...this._getElementState({
                revX,
                revY,
                doW,
                doH
            })
        };

        this._resize({ dx, dy });
        this._applyTransformToElement(E_RESIZE);
    }

    exeRotate({ delta }) {
        const { rotatable } = this.options;
        if (!rotatable) return;

        this.storage = {
            ...this.storage,
            ...this._getElementState({
                revX: false,
                revY: false,
                doW: false,
                doH: false
            })
        };

        this._rotate({ radians: delta });
        this._applyTransformToElement(E_ROTATE);
    }

    get controls() {
        return this.storage.wrapper;
    }

}