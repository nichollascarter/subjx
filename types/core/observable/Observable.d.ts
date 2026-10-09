export interface Observer {
    notifyMove(data: any): void;
    notifyRotate(data: any): void;
    notifyResize(data: any): void;
    notifyApply(data: any): void;
    notifyGetState(data: any): void;
}
export default class Observable {
    observers: Record<string, Observer[]>;
    constructor();
    subscribe(eventName: string, sub: Observer): this;
    unsubscribe(eventName: string, f: Observer): this;
    notify(eventName: string, source: Observer, data: unknown): void;
}
