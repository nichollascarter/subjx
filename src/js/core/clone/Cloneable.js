import { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import { EVENT_EMITTER_CONSTANTS, CLIENT_EVENTS_CONSTANTS } from '../consts';

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    isFunc,
    createMethod,
    noop
} from '../util/util';

import {
    getOffset,
    objectsCollide
} from '../util/css-util';

const { EMITTER_EVENTS } = EVENT_EMITTER_CONSTANTS;
const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;

export default class Cloneable extends SubjectModel {

    constructor(elements, options) {
        super(elements);
        this.enable(options);
    }

    _init() {
        const {
            elements,
            options
        } = this;

        const {
            style,
            appendTo
        } = options;

        const nextStyle = {
            position: 'absolute',
            'z-index': '2147483647',
            ...style
        };

        const data = new WeakMap();

        elements.map(element => (
            data.set(element, {
                parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
            })
        ));

        this.storage = {
            style: nextStyle,
            data
        };

        helper(elements).on(E_MOUSEDOWN, this._onMouseDown)
            .on(E_TOUCHSTART, this._onTouchStart);

        EMITTER_EVENTS.slice(0, 3).forEach((eventName) => (
            this.eventDispatcher.registerEvent(eventName)
        ));
    }

    _processOptions(options = {}) {
        const {
            style = {},
            appendTo = null,
            stack = document.body,
            onInit = noop,
            onMove = noop,
            onDrop = noop,
            onDestroy = noop
        } = options;

        const dropable = helper(stack)[0];

        const _onDrop = isFunc(onDrop)
            ? function (evt) {
                const { storage: { clone } = {} } = this;

                const isCollide = objectsCollide(clone, dropable);

                if (isCollide) {
                    onDrop.call(this, evt, this.elements, clone);
                }
            }
            : noop;

        this.options = {
            style,
            appendTo,
            stack
        };

        this.proxyMethods = {
            onInit: createMethod(onInit),
            onDrop: _onDrop,
            onMove: createMethod(onMove),
            onDestroy: createMethod(onDestroy)
        };
    }

    _start({ target, clientX, clientY }) {
        const {
            elements,
            storage,
            storage: {
                data,
                style
            }
        } = this;

        const element = elements.find(el => el === target || el.contains(target));

        if (!element) return;

        const {
            parent = element.parentNode
        } = data.get(element) || {};

        const { left, top } = getOffset(parent);

        style.left = `${(clientX - left)}px`;
        style.top = `${(clientY - top)}px`;

        const clone = element.cloneNode(true);
        helper(clone).css(style);

        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.cx = clientX;
        storage.cy = clientY;
        storage.clone = clone;

        parent.appendChild(clone);
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
            cy,
            clone
        } = storage;

        if (!doDraw) return;
        storage.doDraw = false;

        this._drag(
            {
                element: clone,
                dx: clientX - cx,
                dy: clientY - cy
            }
        );
    }

    _processMove(_, { dx, dy }) {
        const {
            storage: {
                clone
            } = {}
        } = this;

        const transformCommand = `translate(${dx}px, ${dy}px)`;

        helper(clone).css({
            transform: transformCommand,
            webkitTranform: transformCommand,
            mozTransform: transformCommand,
            msTransform: transformCommand,
            otransform: transformCommand
        });
    }

    _destroy() {
        const {
            storage,
            proxyMethods,
            elements
        } = this;

        if (isUndef(storage)) return;

        helper(elements)
            .off(E_MOUSEDOWN, this._onMouseDown)
            .off(E_TOUCHSTART, this._onTouchStart);

        proxyMethods.onDestroy.call(this, elements);
        delete this.storage;
    }

    disable() {
        this._destroy();
    }

}