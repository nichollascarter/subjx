import { isUndef } from "../util/util";

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
    }
  
    unsubscribe(f) {
       this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    notify(eventName, source, data) {
        if (isUndef(this.observers[eventName])) return;

        this.observers[eventName].forEach(observer => {
            if (source === observer) return;
            switch (eventName) {
                case 'onmove':
                    observer.onMove(data);
                    break
                case 'onrotate':
                    observer.onRotate(data);
                    break
                case 'onresize':
                    observer.onResize(data);
                    break
                case 'onapply':
                    observer.onApply(data);
                    break
                case 'onrefreshstate':
                    observer.onRefreshState(data);
                    break
                default: 
                    break
            }
        });
    }
}