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

export const isDef = val => val !== undefined && val !== null;

export const isUndef = val => val === undefined || val === null;

export const isFunc = val => typeof val === 'function';

export const createMethod = (fn) => {
    return isFunc(fn)
        ? function () {
            fn.call(this, ...arguments);
        }
        : () => { };
};