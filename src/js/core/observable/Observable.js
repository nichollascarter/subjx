import { isDef, isUndef } from '../util/util';

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

                case 'onmove':
                    observer.notifyMove(data);
                    break;
                case 'onrotate':
                    observer.notifyRotate(data);
                    break;
                case 'onresize':
                    observer.notifyResize(data);
                    break;
                case 'onapply':
                    observer.notifyApply(data);
                    break;
                case 'ongetstate':
                    observer.notifyGetState(data);
                    break;
                default:
                    break;
            
            }
        });
    }

}