export const requestAnimFrame = (callback: FrameRequestCallback): number =>
    typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame(callback)
        : setTimeout(callback, 1000 / 60) as unknown as number;

export const cancelAnimFrame = (requestID: number): void => {
    if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(requestID);
    } else {
        clearTimeout(requestID);
    }
};

export const {
    forEach,
    slice: arrSlice,
    map: arrMap,
    reduce: arrReduce
} = Array.prototype;

export const { warn } = console;

export const noop = <T>(_: T): T => _;

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