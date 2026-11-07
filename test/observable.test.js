import Observable from '../src/js/core/observable/Observable';
import { NOTIFIER_CONSTANTS } from '../src/js/core/consts';

const { ON_MOVE } = NOTIFIER_CONSTANTS;

const createObserver = () => ({
    notifyMove: jest.fn(),
    notifyRotate: jest.fn(),
    notifyResize: jest.fn(),
    notifyApply: jest.fn(),
    notifyGetState: jest.fn()
});

describe('Observable', () => {
    it('keeps other observers when unsubscribing one that is not subscribed', () => {
        const observable = new Observable();
        const subscribed = createObserver();
        const stranger = createObserver();
        const source = createObserver();

        observable.subscribe(ON_MOVE, subscribed);
        observable.unsubscribe(ON_MOVE, stranger);
        observable.notify(ON_MOVE, source, { dx: 1, dy: 1 });

        expect(subscribed.notifyMove).toHaveBeenCalledWith({ dx: 1, dy: 1 });
    });

    it('stops notifying an unsubscribed observer', () => {
        const observable = new Observable();
        const first = createObserver();
        const second = createObserver();
        const source = createObserver();

        observable.subscribe(ON_MOVE, first).subscribe(ON_MOVE, second);
        observable.unsubscribe(ON_MOVE, first);
        observable.notify(ON_MOVE, source, {});

        expect(first.notifyMove).not.toHaveBeenCalled();
        expect(second.notifyMove).toHaveBeenCalledTimes(1);
    });
});
