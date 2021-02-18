import { isDef, isUndef } from '../util/util';
import { NOTIFIER_CONSTANTS } from '../consts';

const {
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
} = NOTIFIER_CONSTANTS;

export default class Observable {

    constructor() {
        this.observers = {};
    }

    subscribe(eventName, sub) {
        const obs = this.observers;

        if (isUndef(obs[eventName])) {
            Object.defineProperty(obs, eventName, {
                value: []
            });
        }

        obs[eventName].push(sub);

        return this;
    }

    unsubscribe(eventName, f) {
        const obs = this.observers;

        if (isDef(obs[eventName])) {
            const index = obs[eventName].indexOf(f);
            obs[eventName].splice(index, 1);
        }

        return this;
    }

    notify(eventName, source, data) {
        if (isUndef(this.observers[eventName])) return;

        this.observers[eventName].forEach(observer => {
            if (source === observer) return;
            switch (eventName) {

                case ON_MOVE:
                    observer.notifyMove(data);
                    break;
                case ON_ROTATE:
                    observer.notifyRotate(data);
                    break;
                case ON_RESIZE:
                    observer.notifyResize(data);
                    break;
                case ON_APPLY:
                    observer.notifyApply(data);
                    break;
                case ON_GETSTATE:
                    observer.notifyGetState(data);
                    break;
                default:
                    break;

            }
        });
    }

}