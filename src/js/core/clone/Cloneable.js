import { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import { EVENT_EMITTER_CONSTANTS, CLIENT_EVENTS_CONSTANTS } from '../consts';

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    isFunc,
    createMethod
} from '../util/util';

import {
    getOffset,
    objectsCollide
} from '../util/css-util';

const { EMITTER_EVENTS } = EVENT_EMITTER_CONSTANTS;
const { E_MOUSEDOWN, E_TOUCHSTART } = CLIENT_EVENTS_CONSTANTS;

export default class Cloneable extends SubjectModel {

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

        $el.on(E_MOUSEDOWN, this._onMouseDown)
            .on(E_TOUCHSTART, this._onTouchStart);

        EMITTER_EVENTS.slice(0, 3).forEach((eventName) => {
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
            .off(E_MOUSEDOWN, this._onMouseDown)
            .off(E_TOUCHSTART, this._onTouchStart);

        proxyMethods.onDestroy.call(this, el);
        delete this.storage;
    }

    disable() {
        this._destroy();
    }

}