type LegacyWindow = Window & {
    mozRequestAnimationFrame?: typeof requestAnimationFrame;
    webkitRequestAnimationFrame?: typeof requestAnimationFrame;
    msRequestAnimationFrame?: typeof requestAnimationFrame;
    mozCancelAnimationFrame?: typeof cancelAnimationFrame;
};

const legacyWindow = window as LegacyWindow;

export const requestAnimFrame: (callback: FrameRequestCallback) => number =
    window.requestAnimationFrame ||
    legacyWindow.mozRequestAnimationFrame ||
    legacyWindow.webkitRequestAnimationFrame ||
    legacyWindow.msRequestAnimationFrame ||
    function (f: FrameRequestCallback) {
        return setTimeout(f, 1000 / 60);
    };

export const cancelAnimFrame: (requestID: number) => void =
    window.cancelAnimationFrame ||
    legacyWindow.mozCancelAnimationFrame ||
    function (requestID: number) {
        clearTimeout(requestID);
    };

export const {
    forEach,
    slice: arrSlice,
    map: arrMap,
    reduce: arrReduce
} = Array.prototype;
/* eslint-disable no-console */
export const { warn } = console;

export const noop = <T>(_: T): T => _;

/* eslint-disable no-console */

export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null;

export const isUndef = (val: unknown): val is null | undefined => val === undefined || val === null;

export const isFunc = (val: unknown): val is Function => typeof val === 'function';

export const createMethod = (fn: unknown) => {
    return isFunc(fn)
        ? function (this: unknown, ...args: unknown[]) {
            fn.call(this, ...args);
        }
        : noop;
};