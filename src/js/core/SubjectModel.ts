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
    P extends ProxyMethods = ProxyMethods
> {

    elements: Element[];
    storage?: S | null;
    proxyMethods: P | null;
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

    abstract _init(elements: Element[]): void;

    abstract _destroy(): void;

    abstract _processOptions(options?: object): void;

    abstract _start(input: PointerInput): void;

    abstract _moving(input: PointerInput): void;

    abstract _end(input: PointerInput, elements: Element[]): void;

    abstract _animate(): void;

    abstract _processMove(element: Element, delta: { dx: number; dy: number }): unknown;

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

    _draw() {
        this._animate();
    }

    _onMouseDown(e: MouseEvent) {
        this._start(e);
        helper(document)
            .on(E_MOUSEMOVE, this._onMouseMove)
            .on(E_MOUSEUP, this._onMouseUp);
    }

    _onTouchStart(e: TouchEvent) {
        this._start(e.touches[0]);
        helper(document)
            .on(E_TOUCHMOVE, this._onTouchMove)
            .on(E_TOUCHEND, this._onTouchEnd);
    }

    _onMouseMove(e: MouseEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(e);
    }

    _onTouchMove(e: TouchEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(e.touches[0]);
    }

    _onMouseUp(e: MouseEvent) {
        helper(document)
            .off(E_MOUSEMOVE, this._onMouseMove)
            .off(E_MOUSEUP, this._onMouseUp);

        this._end(
            e,
            this.elements
        );
    }

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

    _emitEvent(eventName: string, eventArgs?: unknown) {
        this.eventDispatcher.emit(this, eventName, eventArgs);
    }

    on(name: string, cb: Callback) {
        this.eventDispatcher.addEventListener(name, cb);
        return this;
    }

    off(name: string, cb: Callback) {
        this.eventDispatcher.removeEventListener(name, cb);
        return this;
    }

}