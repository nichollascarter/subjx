export type HelperTarget = Element | Document;
export type HelperParams<T extends HelperTarget = Element> = string | T | Helper<T> | ArrayLike<T>;
type DelegatedHandler = (this: Element, event: Event) => void;
type Listener<E extends Event = Event> = (event: E) => void;
export default class Helper<T extends HelperTarget = Element> {
    [index: number]: T;
    length: number;
    constructor(params: HelperParams<T>);
    css(prop: string): string;
    css(prop?: Record<string, string | number | null | undefined> | null): void;
    on<E extends Event>(eventName: string, handler: Listener<E>, options?: AddEventListenerOptions | boolean): this;
    on(eventName: string, selector: string, handler: DelegatedHandler, options?: AddEventListenerOptions | boolean): this;
    off<E extends Event>(eventName: string, handler: Listener<E>, options?: EventListenerOptions | boolean): this;
    off(eventName: string, selector: string, handler: DelegatedHandler, options?: EventListenerOptions | boolean): this;
    is(selector?: HelperParams<T> | null): boolean;
}
export declare function helper(params: Document): Helper<Document>;
export declare function helper<T extends Element = Element>(params: HelperParams<T>): Helper<T>;
export {};
