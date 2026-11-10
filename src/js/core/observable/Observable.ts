import { isDef, isUndef } from '../util/util';
import { NOTIFIER_CONSTANTS } from '../consts';

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

const {
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
} = NOTIFIER_CONSTANTS;

export interface NotifierPayloads {
    [ON_GETSTATE]: NotifyGetStateArgs;
    [ON_APPLY]: NotifyActionArgs;
    [ON_MOVE]: NotifyMoveArgs;
    [ON_RESIZE]: NotifyResizeArgs;
    [ON_ROTATE]: NotifyRotateArgs;
}

export type NotifierEvent = keyof NotifierPayloads;

const handlers: { [K in NotifierEvent]: (observer: Observer, data: NotifierPayloads[K]) => void } = {
    [ON_GETSTATE]: (observer, data) => observer.notifyGetState(data),
    [ON_APPLY]: (observer, data) => observer.notifyApply(data),
    [ON_MOVE]: (observer, data) => observer.notifyMove(data),
    [ON_RESIZE]: (observer, data) => observer.notifyResize(data),
    [ON_ROTATE]: (observer, data) => observer.notifyRotate(data)
};

export default class Observable {

    observers: Partial<Record<NotifierEvent, Observer[]>>;

    constructor() {
        this.observers = {};
    }

    subscribe(eventName: NotifierEvent, sub: Observer) {
        const obs = this.observers;

        if (isUndef(obs[eventName])) {
            Object.defineProperty(obs, eventName, {
                value: []
            });
        }

        obs[eventName]!.push(sub);

        return this;
    }

    unsubscribe(eventName: NotifierEvent, f: Observer) {
        const obs = this.observers;

        if (isDef(obs[eventName])) {
            const index = obs[eventName].indexOf(f);
            if (index !== -1) obs[eventName].splice(index, 1);
        }

        return this;
    }

    notify<K extends NotifierEvent>(eventName: K, source: Observer, data: NotifierPayloads[K]) {
        const observers = this.observers[eventName];
        const handler = handlers[eventName];

        if (isUndef(observers) || isUndef(handler)) return;

        observers.forEach(observer => {
            if (source !== observer) handler(observer, data);
        });
    }

}