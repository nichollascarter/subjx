export const requestAnimFrame = 
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        return setTimeout(f, 1000 / 60);
    };

export const cancelAnimFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (requestID) {
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
/* eslint-disable no-console */

export function isDef(val) {
    return val !== undefined && val !== null;
}

export function isUndef(val) {
    return val === undefined || val === null;
}

export function isFunc(val) {
    return typeof val === 'function';
}

export function createMethod(fn) {
    return isFunc(fn)
        ? function () {
            fn.call(this, ...arguments);
        }
        : () => { };
}