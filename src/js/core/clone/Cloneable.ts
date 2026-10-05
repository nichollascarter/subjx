import { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import type { PointerInput, ProxyMethods } from '../SubjectModel';
import type { CloneOptions, CloneEventName, DragEventArgs } from '../options';
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

interface CloneStorage {
    style: Record<string, string>;
    data: WeakMap<Element, { parent: Element }>;
    clientX?: number;
    clientY?: number;
    cx?: number;
    cy?: number;
    clone?: Element;
    doDraw?: boolean;
    doMove?: boolean;
    frameId?: number;
}

export type CloneEventMap = Record<CloneEventName, DragEventArgs>;

export default class Cloneable extends SubjectModel<CloneStorage, ProxyMethods, CloneEventMap> {

    options!: Required<Pick<CloneOptions, 'style' | 'appendTo' | 'stack'>>;

    constructor(elements: Element[], options?: CloneOptions) {
        super(elements);
        this.enable(options);
    }

    /** @internal */
    _init() {
        const {
            elements,
            options
        } = this;

        const {
            style,
            appendTo
        } = options;

        const nextStyle: Record<string, string> = {
            position: 'absolute',
            'z-index': '2147483647',
            ...style as Record<string, string>
        };

        const data: CloneStorage['data'] = new WeakMap();

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

    /** @internal */
    _processOptions(options: CloneOptions = {}) {
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
            ? function (this: Cloneable, evt: PointerInput) {
                const { clone } = this.storage!;

                const isCollide = objectsCollide(clone!, dropable);

                if (isCollide) {
                    onDrop.call(this, evt as MouseEvent | Touch, this.elements, clone!);
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

    /** @internal */
    _start({ target, clientX, clientY }: PointerInput) {
        const { elements } = this;
        const storage = this.storage!;
        const { data, style } = storage;

        const element = elements.find(el => el === target || el.contains(target as Node | null));

        if (!element) return;

        const {
            parent = element.parentNode
        } = data.get(element) || {};

        const { left, top } = getOffset(parent as Element);

        style.left = `${(clientX - left)}px`;
        style.top = `${(clientY - top)}px`;

        const clone = element.cloneNode(true) as Element;
        helper(clone).css(style);

        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.cx = clientX;
        storage.cy = clientY;
        storage.clone = clone;

        parent!.appendChild(clone);
        this._draw();
    }

    /** @internal */
    _moving({ clientX, clientY }: PointerInput) {
        const storage = this.storage!;

        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.doDraw = true;
        storage.doMove = true;
    }

    /** @internal */
    _end(e: PointerInput) {
        const storage = this.storage!;

        const {
            clone,
            frameId
        } = storage;

        storage.doDraw = false;
        cancelAnimFrame(frameId as number);

        if (isUndef(clone)) return;

        this.proxyMethods!.onDrop.call(this, e);
        clone.parentNode!.removeChild(clone);

        delete storage.clone;
    }

    /** @internal */
    _animate() {
        const storage = this.storage!;

        storage.frameId = requestAnimFrame(this._animate);

        const {
            doDraw,
            clientX,
            clientY,
            cx,
            cy,
            clone
        } = storage as Required<CloneStorage>;

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

    /** @internal */
    _processMove(_: Element, { dx, dy }: { dx: number; dy: number }) {
        const { clone } = this.storage!;

        const transformCommand = `translate(${dx}px, ${dy}px)`;

        helper(clone!).css({
            transform: transformCommand,
            webkitTranform: transformCommand,
            mozTransform: transformCommand,
            msTransform: transformCommand,
            otransform: transformCommand
        });
    }

    /** @internal */
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

        proxyMethods!.onDestroy.call(this, elements);
        delete this.storage;
    }

    disable() {
        this._destroy();
    }

}