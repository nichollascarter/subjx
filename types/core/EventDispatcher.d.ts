import type { Callback } from './types';
declare class Event {
    name: string;
    callbacks: Callback[];
    constructor(name: string);
    registerCallback(cb: Callback): void;
    removeCallback(cb: Callback): void;
}
export default class EventDispatcher {
    events: Record<string, Event>;
    constructor();
    registerEvent(eventName: string): void;
    emit(ctx: unknown, eventName: string, eventArgs?: unknown): void;
    addEventListener(eventName: string, cb: Callback): void;
    removeEventListener(eventName: string, cb: Callback): void;
}
export {};
