import { helper } from './Helper';
import EventDispatcher from './EventDispatcher';
import { EVENT_EMITTER_CONSTANTS, CLIENT_EVENTS_CONSTANTS } from './consts';
import type { Callback } from './types';

const { E_DRAG } = EVENT_EMITTER_CONSTANTS;
const {
    E_MOUSEDOWN,
    E_MOUSEMOVE,
    E_MOUSEUP,
    E_TOUCHSTART,
    E_TOUCHMOVE,
    E_TOUCHEND,
    E_TOUCHCANCEL
} = CLIENT_EVENTS_CONSTANTS;

const COMPAT_MOUSE_DELAY = 800;

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
    /** Internal state. Its shape is not part of the public API and may change in any minor release. */
    storage?: S | null;
    /** @internal */
    protected proxyMethods: P | null;
    /** @internal */
    protected eventDispatcher: EventDispatcher;
    /** @internal */
    protected activeTouch: number | null;
    /** @internal */
    protected lastTouchTime: number;
    /** @internal */
    private touchActions: Map<Element, string>;

    constructor(elements: Element[]) {
        this.elements = elements;
        this.storage = null;
        this.proxyMethods = null;

        this.eventDispatcher = new EventDispatcher();
        this.activeTouch = null;
        this.lastTouchTime = -Infinity;
        this.touchActions = new Map();

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
        this.afterInit();
        this.proxyMethods!.onInit.call(this, this.elements);
    }

    /** @internal */
    protected afterInit() { }

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
    protected bindPress(targets: Element[]) {
        targets.forEach((target) => {
            const { style } = target as HTMLElement;

            if (style && !this.touchActions.has(target)) {
                this.touchActions.set(target, style.getPropertyValue('touch-action'));
                style.setProperty('touch-action', 'none');
            }

            helper(target)
                .on(E_MOUSEDOWN, this.onMouseDown)
                .on(E_TOUCHSTART, this.onTouchStart);
        });
    }

    /** @internal */
    protected unbindPress(targets: Element[]) {
        targets.forEach((target) => {
            helper(target)
                .off(E_MOUSEDOWN, this.onMouseDown)
                .off(E_TOUCHSTART, this.onTouchStart);

            if (this.touchActions.has(target)) {
                const { style } = target as HTMLElement;
                const previous = this.touchActions.get(target);

                if (previous) {
                    style.setProperty('touch-action', previous);
                } else {
                    style.removeProperty('touch-action');
                }

                this.touchActions.delete(target);
            }
        });
    }

    /** @internal */
    protected releaseInput() {
        this.activeTouch = null;

        helper(document)
            .off(E_MOUSEMOVE, this.onMouseMove)
            .off(E_MOUSEUP, this.onMouseUp)
            .off(E_TOUCHMOVE, this.onTouchMove)
            .off(E_TOUCHEND, this.onTouchEnd)
            .off(E_TOUCHCANCEL, this.onTouchEnd);
    }

    /** @internal */
    private findActiveTouch(list: TouchList) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].identifier === this.activeTouch) return list[i];
        }
        return null;
    }

    /** @internal */
    protected onMouseDown(e: MouseEvent) {
        if (e.button !== 0) return;
        if (this.activeTouch !== null) return;
        if (Date.now() - this.lastTouchTime < COMPAT_MOUSE_DELAY) return;

        this.start(e);
        helper(document)
            .on(E_MOUSEMOVE, this.onMouseMove)
            .on(E_MOUSEUP, this.onMouseUp);
    }

    /** @internal */
    protected onTouchStart(e: TouchEvent) {
        this.lastTouchTime = Date.now();

        if (this.activeTouch !== null) return;

        const touch = e.changedTouches[0];

        this.activeTouch = touch.identifier;
        this.start(touch);
        helper(document)
            .on(E_TOUCHMOVE, this.onTouchMove)
            .on(E_TOUCHEND, this.onTouchEnd)
            .on(E_TOUCHCANCEL, this.onTouchEnd);
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

        const touch = this.findActiveTouch(e.changedTouches);

        if (touch) this.moving(touch);
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
        this.lastTouchTime = Date.now();

        const touch = this.findActiveTouch(e.changedTouches);

        if (!touch) return;

        this.releaseInput();
        this.end(touch, this.elements);
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