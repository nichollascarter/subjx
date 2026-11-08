export interface NotifyMoveArgs {
    dx: number;
    dy: number;
}
export interface NotifyRotateArgs {
    radians: number;
    [key: string]: unknown;
}
export interface NotifyResizeArgs extends NotifyMoveArgs {
    revX: boolean;
    revY: boolean;
    dox: boolean;
    doy: boolean;
}
export interface NotifyActionArgs {
    clientX: number;
    clientY: number;
    actionName: string;
    triggerEvent: boolean;
}
export interface NotifyGetStateArgs extends NotifyActionArgs {
    revX?: boolean;
    revY?: boolean;
    doW?: boolean;
    doH?: boolean;
}
export interface Observer {
    notifyMove(data: NotifyMoveArgs): void;
    notifyRotate(data: NotifyRotateArgs): void;
    notifyResize(data: NotifyResizeArgs): void;
    notifyApply(data: NotifyActionArgs): void;
    notifyGetState(data: NotifyGetStateArgs): void;
}
declare const ON_GETSTATE: "ongetstate", ON_APPLY: "onapply", ON_MOVE: "onmove", ON_RESIZE: "onresize", ON_ROTATE: "onrotate";
export interface NotifierPayloads {
    [ON_GETSTATE]: NotifyGetStateArgs;
    [ON_APPLY]: NotifyActionArgs;
    [ON_MOVE]: NotifyMoveArgs;
    [ON_RESIZE]: NotifyResizeArgs;
    [ON_ROTATE]: NotifyRotateArgs;
}
export type NotifierEvent = keyof NotifierPayloads;
export default class Observable {
    observers: Partial<Record<NotifierEvent, Observer[]>>;
    constructor();
    subscribe(eventName: NotifierEvent, sub: Observer): this;
    unsubscribe(eventName: NotifierEvent, f: Observer): this;
    notify<K extends NotifierEvent>(eventName: K, source: Observer, data: NotifierPayloads[K]): void;
}
export {};
