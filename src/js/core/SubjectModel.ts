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
    protected proxyMethods: P | null;
    /** @internal */
    protected eventDispatcher: EventDispatcher;

    constructor(elements: Element[]) {
        this.elements = elements;
        this.storage = null;
        this.proxyMethods = null;

        this.eventDispatcher = new EventDispatcher();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.animate = this.animate.bind(this);
    }

    enable(options?: object) {
        this.processOptions(options);
        this.init(this.elements);
        this.proxyMethods!.onInit.call(this, this.elements);
    }

    abstract disable(): void;

    /** @internal */
    protected abstract init(elements: Element[]): void;

    /** @internal */
    protected abstract destroy(): void;

    /** @internal */
    protected abstract processOptions(options?: object): void;

    /** @internal */
    protected abstract start(input: PointerInput): void;

    /** @internal */
    protected abstract moving(input: PointerInput): void;

    /** @internal */
    protected abstract end(input: PointerInput, elements: Element[]): void;

    /** @internal */
    protected abstract animate(): void;

    /** @internal */
    protected abstract processMove(element: Element, delta: { dx: number; dy: number }): unknown;

    /** @internal */
    protected drag({ element, dx, dy, ...rest }: MoveArgs) {
        const transform = this.processMove(element, { dx, dy });

        const finalArgs = {
            dx,
            dy,
            transform,
            ...rest
        };

        this.proxyMethods!.onMove.call(this, finalArgs);
        this.emitEvent(E_DRAG, finalArgs);
    }

    /** @internal */
    protected draw() {
        this.animate();
    }

    /** @internal */
    protected onMouseDown(e: MouseEvent) {
        this.start(e);
        helper(document)
            .on(E_MOUSEMOVE, this.onMouseMove)
            .on(E_MOUSEUP, this.onMouseUp);
    }

    /** @internal */
    protected onTouchStart(e: TouchEvent) {
        this.start(e.touches[0]);
        helper(document)
            .on(E_TOUCHMOVE, this.onTouchMove)
            .on(E_TOUCHEND, this.onTouchEnd);
    }

    /** @internal */
    protected onMouseMove(e: MouseEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.moving(e);
    }

    /** @internal */
    protected onTouchMove(e: TouchEvent) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.moving(e.touches[0]);
    }

    /** @internal */
    protected onMouseUp(e: MouseEvent) {
        helper(document)
            .off(E_MOUSEMOVE, this.onMouseMove)
            .off(E_MOUSEUP, this.onMouseUp);

        this.end(
            e,
            this.elements
        );
    }

    /** @internal */
    protected onTouchEnd(e: TouchEvent) {
        helper(document)
            .off(E_TOUCHMOVE, this.onTouchMove)
            .off(E_TOUCHEND, this.onTouchEnd);

        if (e.touches.length === 0) {
            this.end(
                e.changedTouches[0],
                this.elements
            );
        }
    }

    /** @internal */
    protected emitEvent(eventName: string, eventArgs?: unknown) {
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