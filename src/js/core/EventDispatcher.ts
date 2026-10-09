import type { Callback } from './types';

class Event {

    name: string;
    callbacks: Callback[];

    constructor(name: string) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(cb: Callback) {
        this.callbacks.push(cb);
    }

    removeCallback(cb: Callback) {
        const ix = this.callbacks.indexOf(cb);

        if (ix !== -1) {
            this.callbacks.splice(ix, 1);
        }
    }

}

export default class EventDispatcher {

    events: Record<string, Event>;

    constructor() {
        this.events = {};
    }

    registerEvent(eventName: string) {
        this.events[eventName] = new Event(eventName);
    }

    emit(ctx: unknown, eventName: string, eventArgs?: unknown) {
        this.events[eventName].callbacks.forEach((cb) => {
            cb.call(ctx, eventArgs);
        });
    }

    addEventListener(eventName: string, cb: Callback) {
        this.events[eventName].registerCallback(cb);
    }

    removeEventListener(eventName: string, cb: Callback) {
        this.events[eventName].removeCallback(cb);
    }

}