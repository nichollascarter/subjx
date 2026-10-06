import EventDispatcher from '../src/js/core/EventDispatcher';

describe('EventDispatcher', () => {
    it('removes a registered listener', () => {
        const dispatcher = new EventDispatcher();
        const listener = jest.fn();

        dispatcher.registerEvent('drag');
        dispatcher.addEventListener('drag', listener);
        dispatcher.removeEventListener('drag', listener);
        dispatcher.emit(null, 'drag', {});

        expect(listener).not.toHaveBeenCalled();
    });

    it('keeps other listeners when removing an unknown one', () => {
        const dispatcher = new EventDispatcher();
        const listener = jest.fn();

        dispatcher.registerEvent('drag');
        dispatcher.addEventListener('drag', listener);
        dispatcher.removeEventListener('drag', jest.fn());
        dispatcher.emit(null, 'drag', {});

        expect(listener).toHaveBeenCalledTimes(1);
    });
});
