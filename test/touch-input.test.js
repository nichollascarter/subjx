import SubjectModel from '../src/js/core/SubjectModel';
import Subjx from '../src/js/core';

class Probe extends SubjectModel {

    constructor(element) {
        super([element]);
        this.log = [];
    }

    disable() { }
    init() { }
    destroy() { }
    processOptions() { }
    animate() { }
    processMove() { }

    start({ clientX }) {
        this.log.push(['start', clientX]);
    }

    moving({ clientX }) {
        this.log.push(['move', clientX]);
    }

    end({ clientX }) {
        this.log.push(['end', clientX]);
    }

}

const touch = (identifier, clientX, target = document.body) => ({ identifier, clientX, clientY: 0, target });

const touchEvent = (type, touches, changedTouches) => {
    const event = new window.Event(type, { bubbles: true, cancelable: true });

    event.touches = touches;
    event.changedTouches = changedTouches;

    return event;
};

const mouseEvent = (type, { clientX = 0, button = 0 } = {}) =>
    new MouseEvent(type, { clientX, button, bubbles: true, cancelable: true });

const trackStyle = (element, initial = {}) => {
    const props = { ...initial };
    const { style } = element;

    style.getPropertyValue = name => props[name] ?? '';
    style.setProperty = (name, value) => { props[name] = value; };
    style.removeProperty = (name) => { delete props[name]; };

    return props;
};

describe('touch input', () => {
    let element;
    let probe;

    beforeEach(() => {
        jest.useFakeTimers();
        element = document.createElement('div');
        document.body.appendChild(element);
        probe = new Probe(element);
        probe.bindPress([element]);
    });

    afterEach(() => {
        probe.releaseInput();
        probe.unbindPress([element]);
        element.remove();
        jest.useRealTimers();
    });

    it('ignores the compatibility mouse events that follow a tap', () => {
        const a = touch(0, 5);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        document.dispatchEvent(touchEvent('touchend', [], [a]));
        element.dispatchEvent(mouseEvent('mousedown', { clientX: 5 }));
        document.dispatchEvent(mouseEvent('mouseup', { clientX: 5 }));

        expect(probe.log).toEqual([['start', 5], ['end', 5]]);
    });

    it('accepts the mouse again once the touch is over', () => {
        const a = touch(0, 5);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        document.dispatchEvent(touchEvent('touchend', [], [a]));
        jest.advanceTimersByTime(1000);
        element.dispatchEvent(mouseEvent('mousedown', { clientX: 30 }));
        document.dispatchEvent(mouseEvent('mouseup', { clientX: 30 }));

        expect(probe.log).toEqual([['start', 5], ['end', 5], ['start', 30], ['end', 30]]);
    });

    it('follows the finger that started the gesture and ignores the others', () => {
        const a = touch(0, 10);
        const b = touch(1, 100);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        element.dispatchEvent(touchEvent('touchstart', [a, b], [b]));
        document.dispatchEvent(touchEvent('touchmove', [a, touch(1, 120)], [touch(1, 120)]));
        document.dispatchEvent(touchEvent('touchend', [a], [b]));
        document.dispatchEvent(touchEvent('touchmove', [touch(0, 20)], [touch(0, 20)]));
        document.dispatchEvent(touchEvent('touchend', [], [touch(0, 20)]));

        expect(probe.log).toEqual([['start', 10], ['move', 20], ['end', 20]]);
        expect(probe.activeTouch).toBeNull();
    });

    it('ends the gesture when the tracking finger lifts while another stays down', () => {
        const a = touch(0, 10);
        const b = touch(1, 100);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        document.dispatchEvent(touchEvent('touchend', [b], [a]));

        expect(probe.log).toEqual([['start', 10], ['end', 10]]);
    });

    it('ends the gesture on touchcancel and stops listening', () => {
        const a = touch(0, 10);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        document.dispatchEvent(touchEvent('touchcancel', [], [touch(0, 15)]));
        document.dispatchEvent(touchEvent('touchmove', [touch(0, 50)], [touch(0, 50)]));

        expect(probe.log).toEqual([['start', 10], ['end', 15]]);
        expect(probe.activeTouch).toBeNull();
    });

    it('prevents the default action of moves to keep the page from scrolling', () => {
        const a = touch(0, 10);

        element.dispatchEvent(touchEvent('touchstart', [a], [a]));

        const move = touchEvent('touchmove', [touch(0, 12)], [touch(0, 12)]);
        document.dispatchEvent(move);

        expect(move.defaultPrevented).toBe(true);
    });

    it('starts the mouse only on the primary button', () => {
        element.dispatchEvent(mouseEvent('mousedown', { button: 2 }));

        expect(probe.log).toEqual([]);
    });

    it('disables touch panning on bound targets and restores it on unbind', () => {
        const fresh = document.createElement('div');
        const other = document.createElement('div');
        const freshStyle = trackStyle(fresh);
        const otherStyle = trackStyle(other, { 'touch-action': 'pan-y' });

        probe.bindPress([fresh, other]);
        expect(freshStyle['touch-action']).toBe('none');
        expect(otherStyle['touch-action']).toBe('none');

        probe.bindPress([other]);
        probe.unbindPress([fresh, other]);
        expect('touch-action' in freshStyle).toBe(false);
        expect(otherStyle['touch-action']).toBe('pan-y');
    });

    it('stops reacting to presses after unbind', () => {
        const a = touch(0, 10);

        probe.unbindPress([element]);
        element.dispatchEvent(touchEvent('touchstart', [a], [a]));
        element.dispatchEvent(mouseEvent('mousedown'));

        expect(probe.log).toEqual([]);
    });
});

describe('touch input in cloneable', () => {
    it('restores touch-action when disabled', () => {
        const element = document.createElement('div');
        const style = trackStyle(element, { 'touch-action': 'manipulation' });
        document.body.appendChild(element);

        const cloneable = new Subjx(element).clone();
        expect(style['touch-action']).toBe('none');

        cloneable.disable();
        expect(style['touch-action']).toBe('manipulation');

        element.remove();
    });
});
