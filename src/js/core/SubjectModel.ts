import { helper } from './Helper';
import EventDispatcher from './EventDispatcher';
import { EVENT_EMITTER_CONSTANTS, CLIENT_EVENTS_CONSTANTS } from './consts';
import type { Callback } from './types';

const { E_DRAG } = EVENT_EMITTER_CONSTANTS;
const {
    E_MOUSEMOVE,
    E_MOUSEUP,
    E_TOUCHMOVE,
    E_TOUCHEND
} = CLIENT_EVENTS_CONSTANTS;

export interface PointerInput {
    clientX: number;
    clientY: number;
    target: EventTarget | null;
}

export interface MoveArgs {
    element: Element;
    dx: number;
    dy: number;
    [key: string]: unknown;
}

type ProxyMethod = (this: any, ...args: any[]) => void;

export interface ProxyMethods {
    onInit: ProxyMethod;
    onMove: ProxyMethod;
    onDrop: ProxyMethod;
    onDestroy: ProxyMethod;
}

export default abstract class SubjectModel<
    S extends object = object,
    P extends ProxyMethods = ProxyMethods,
    EM extends object = Record<string, unknown>
> {

    elements: Element[];
    storage?: S | null;
    /** @internal */
    proxyMethods: P | null;
    /** @internal */
    eventDispatcher: EventDispatcher;

    constructor(elements: Element[]) {
        this.elements = elements;
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

    enable(options?: object) {
        this._processOptions(options);
        this._init(this.elements);
        this.proxyMethods!.onInit.call(this, this.elements);
    }

    abstract disable(): void;

    /** @internal */
    abstract _init(elements: Element[]): void;

    /** @internal */
    abstract _destroy(): void;

    /** @internal */
    abstract _processOptions(options?: object): void;

    /** @internal */
    abstract _start(input: PointerInput): void;

    /** @internal */
    abstract _moving(input: PointerInput): void;

    /** @internal */
    abstract _end(input: PointerInput, elements: Element[]): void;

    /** @internal */
    abstract _animate(): void;

    /** @internal */
    abstract _processMove(element: Element, delta: { dx: number; dy: number }): unknown;

    /** @internal */
    _drag({ element, dx, dy, ...rest }: MoveArgs) {
        const transform = this._processMove(element, { dx, dy });

        const finalArgs = {
            dx,
            dy,
            transform,
            ...rest
        };

        this.proxyMethods!.onMove.call(this, finalArgs);
        this._emitEvent(E_DRAG, finalArgs);
    }

    /** @internal */
    _draw() {
        this._animate();
    }

    /** @internal */
    _onMouseDown(e: MouseEvent) {
        this._start(e);
        helper(document)
            .on(E_MOUSEMOVE, this._onMouseMove)
            .on(E_MOUSEUP, this._onMouseUp);
    }

    /** @internal */
    _onTouchStart(e: TouchEvent) {
        this._start(e.touches[0]);
        helper(document)
            .on(E_TOUCHMOVE, this._onTouchMove)
            .on(E_TOUCHEND, this._onTouchEnd);
    }

    /** @internal */
    _onMouseMove(e: MouseEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(e);
    }

    /** @internal */
    _onTouchMove(e: TouchEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(e.touches[0]);
    }

    /** @internal */
    _onMouseUp(e: MouseEvent) {
        helper(document)
            .off(E_MOUSEMOVE, this._onMouseMove)
            .off(E_MOUSEUP, this._onMouseUp);

        this._end(
            e,
            this.elements
        );
    }

    /** @internal */
    _onTouchEnd(e: TouchEvent) {
        helper(document)
            .off(E_TOUCHMOVE, this._onTouchMove)
            .off(E_TOUCHEND, this._onTouchEnd);

        if (e.touches.length === 0) {
            this._end(
                e.changedTouches[0],
                this.elements
            );
        }
    }

    /** @internal */
    _emitEvent(eventName: string, eventArgs?: unknown) {
        this.eventDispatcher.emit(this, eventName, eventArgs);
    }

    on<K extends keyof EM & string>(name: K, cb: (eventArgs: EM[K]) => void) {
        this.eventDispatcher.addEventListener(name, cb as Callback);
        return this;
    }

    off<K extends keyof EM & string>(name: K, cb: (eventArgs: EM[K]) => void) {
        this.eventDispatcher.removeEventListener(name, cb as Callback);
        return this;
    }

}