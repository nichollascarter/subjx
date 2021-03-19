import {
    isDef,
    isUndef,
    isFunc,
    createMethod,
    requestAnimFrame,
    cancelAnimFrame
} from '../src/js/core/util/util';

describe('isDef func', () => {
    it('Check defined value returns true', () => {
        const value = 0;
        expect(isDef(value)).toBe(true);
    });

    it('Check undefined value returns false', () => {
        const value = undefined;
        expect(isDef(value)).toBe(false);
    });
});

describe('isUndef func', () => {
    it('Check undefined value returns true', () => {
        const value = undefined;
        expect(isUndef(value)).toBe(true);
    });

    it('Check undefined value returns false', () => {
        const value = 0;
        expect(isUndef(value)).toBe(false);
    });
});

describe('isFunc func', () => {
    it('Check isFunc returns true', () => {
        const fn = () => { };
        expect(isFunc(fn)).toBe(true);
    });

    it('Check isFunc returns false', () => {
        const fn = 0;
        expect(isFunc(fn)).toBe(false);
    });
});

describe('createMethod func', () => {
    it('Check method returns value', () => {
        const fn = function () { };
        const method = createMethod(fn);
        expect(typeof method).toBe('function');
    });
});

describe('animate func', () => {
    it('Check requestAnimFrame returns 1', () => {
        const frameId = requestAnimFrame(() => { });
        cancelAnimFrame(frameId);
        expect(frameId).toBe(17);
    });
});