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
export default abstract class SubjectModel<S extends object = object, P extends ProxyMethods = ProxyMethods, EM extends object = Record<string, unknown>> {
    elements: Element[];
    storage?: S | null;
    constructor(elements: Element[]);
    enable(options?: object): void;
    abstract disable(): void;
    on<K extends keyof EM & string>(name: K, cb: (eventArgs: EM[K]) => void): this;
    off<K extends keyof EM & string>(name: K, cb: (eventArgs: EM[K]) => void): this;
}
export {};
