import {
    isDef,
    isUndef,
    warn
} from './util/util';

export type HelperTarget = Element | Document;

export type HelperParams<T extends HelperTarget = Element> =
    | string
    | T
    | Helper<T>
    | ArrayLike<T>;

type DelegatedHandler = (this: Element, event: Event) => void;

type Listener<E extends Event = Event> = (event: E) => void;

type LegacyTarget = any;

export default class Helper<T extends HelperTarget = Element> {

    [index: number]: T;

    length: number;

    constructor(params: HelperParams<T>) {
        if (typeof params === 'string') {
            const selector = document.querySelectorAll(params);
            this.length = selector.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = selector[count] as unknown as T;
            }
        } else if (typeof params === 'object' &&
            ((params as Node).nodeType === 1 || params === document)) {
            this[0] = params as T;
            this.length = 1;
        } else if (params instanceof Helper) {
            this.length = params.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = params[count];
            }
        } else if (isIterable(params)) {
            this.length = params.length;
            for (let count = 0; count < this.length; count++) {
                if ((params[count] as Node).nodeType === 1) {
                    this[count] = params[count];
                }
            }
        } else {
            throw new Error(`Passed parameter must be selector/element/elementArray`);
        }
    }

    css(prop: string): string;
    css(prop?: Record<string, string | number | null | undefined> | null): void;
    css(prop?: string | Record<string, string | number | null | undefined> | null) {
        const _getStyle = (obj: Helper<T>) => {
            let len = obj.length;

            while (len--) {
                const node: LegacyTarget = obj[len];

                if (node.currentStyle) {
                    return node.currentStyle[prop as string];
                } else if (document.defaultView && document.defaultView.getComputedStyle) {
                    return document.defaultView.getComputedStyle(node, '')[prop as never];
                } else {
                    return node.style[prop as string];
                }
            }
        };

        const _setStyle = (obj: Helper<T>, options?: Record<string, string | number | null | undefined> | null) => {
            let len = obj.length;

            while (len--) {
                for (const property in options) {
                    (obj[len] as LegacyTarget).style[property] = options[property];
                }
            }
            return (obj as LegacyTarget).style;
        };

        if (typeof prop === 'string') {
            return _getStyle(this);
        } else if (typeof prop === 'object' || !prop) {
            return _setStyle(this, prop);
        } else {
            warn(`Method ${prop} does not exist`);
        }
        return false;
    }

    on<E extends Event>(eventName: string, handler: Listener<E>, options?: AddEventListenerOptions | boolean): this;
    on(eventName: string, selector: string, handler: DelegatedHandler, options?: AddEventListenerOptions | boolean): this;
    on(
        eventName: string,
        handlerOrSelector: Listener | string,
        optionsOrHandler?: AddEventListenerOptions | boolean | DelegatedHandler,
        options?: AddEventListenerOptions | boolean
    ) {
        let len = this.length;

        while (len--) {
            const node: LegacyTarget = this[len];

            if (!node.events) {
                node.events = {};
                node.events[eventName] = [];
            }

            if (typeof (handlerOrSelector) !== 'string') {
                if ((document as LegacyTarget).addEventListener) {
                    node.addEventListener(
                        eventName,
                        handlerOrSelector,
                        optionsOrHandler || { passive: false }
                    );
                } else if ((document as LegacyTarget).attachEvent) {
                    node.attachEvent(`on${eventName}`, handlerOrSelector);
                } else {
                    node[`on${eventName}`] = handlerOrSelector;
                }
            } else {
                listenerDelegate(
                    node,
                    eventName,
                    handlerOrSelector,
                    optionsOrHandler as DelegatedHandler,
                    options,
                    true
                );
            }
        }
        return this;
    }

    off<E extends Event>(eventName: string, handler: Listener<E>, options?: EventListenerOptions | boolean): this;
    off(eventName: string, selector: string, handler: DelegatedHandler, options?: EventListenerOptions | boolean): this;
    off(
        eventName: string,
        handlerOrSelector: Listener | string,
        optionsOrHandler?: EventListenerOptions | boolean | DelegatedHandler,
        options?: EventListenerOptions | boolean
    ) {
        let len = this.length;

        while (len--) {
            const node: LegacyTarget = this[len];

            if (!node.events) {
                node.events = {};
                node.events[eventName] = [];
            }

            if (typeof (handlerOrSelector) !== 'string') {
                if ((document as LegacyTarget).removeEventListener) {
                    node.removeEventListener(eventName, handlerOrSelector, optionsOrHandler);
                } else if ((document as LegacyTarget).detachEvent) {
                    node.detachEvent(`on${eventName}`, handlerOrSelector);
                } else {
                    node[`on${eventName}`] = null;
                }
            } else {
                listenerDelegate(
                    node,
                    eventName,
                    handlerOrSelector,
                    optionsOrHandler as DelegatedHandler,
                    options,
                    false
                );
            }
        }

        return this;
    }

    is(selector?: HelperParams<T> | null) {
        if (isUndef(selector)) return false;

        const _sel = new Helper(selector);
        let len = this.length;

        while (len--) {
            if (this[len] === _sel[len]) return true;
        }
        return false;
    }

}

function listenerDelegate(
    el: LegacyTarget,
    evt: string,
    sel: string,
    handler: DelegatedHandler,
    options: AddEventListenerOptions | boolean | undefined,
    act: boolean
) {
    const doit = function (this: unknown, event: Event) {
        let t = event.target as Element | null;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode as Element | null;
        }
    };

    if (act === true) {
        if ((document as LegacyTarget).addEventListener) {
            el.addEventListener(evt, doit, options || { passive: false });
        } else if ((document as LegacyTarget).attachEvent) {
            el.attachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = doit;
        }
    } else {
        if ((document as LegacyTarget).removeEventListener) {
            el.removeEventListener(evt, doit, options || { passive: false });
        } else if ((document as LegacyTarget).detachEvent) {
            el.detachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = null;
        }
    }
}

function isIterable<T>(obj: unknown): obj is ArrayLike<T> {
    const o = obj as LegacyTarget;

    return isDef(o) &&
        typeof o === 'object' &&
        (
            Array.isArray(o) ||
            (
                isDef(window.Symbol) &&
                typeof o[window.Symbol.iterator] === 'function'
            ) ||
            isDef(o.forEach) ||
            (
                typeof (o.length) === 'number' &&
                (o.length === 0 ||
                    (o.length > 0 &&
                        (o.length - 1) in o)
                )
            )
        );
}

export function helper(params: Document): Helper<Document>;
export function helper<T extends Element = Element>(params: HelperParams<T>): Helper<T>;
export function helper(params: HelperParams<HelperTarget>) {
    return new Helper(params);
}