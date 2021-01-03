class Event {

    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(cb) {
        this.callbacks.push(cb);
    }

    removeCallback(cb) {
        const ix = this.callbacks(cb);
        this.callbacks.splice(ix, 1);
    }

}

export default class EventDispatcher {

    constructor() {
        this.events = {};
    }

    registerEvent(eventName) {
        this.events[eventName] = new Event(eventName);
    }

    emit(ctx, eventName, eventArgs) {
        this.events[eventName].callbacks.forEach((cb) => {
            cb.call(ctx, eventArgs);
        });
    };

    addEventListener(eventName, cb) {
        this.events[eventName].registerCallback(cb);
    }

    removeEventListener(eventName, cb) {
        this.events[eventName].removeCallback(cb);
    }

}