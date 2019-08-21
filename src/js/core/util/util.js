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
/* eslint-disable no-console */
export const forEach = Array.prototype.forEach,
    arrSlice = Array.prototype.slice,
    arrMap = Array.prototype.map,
    arrReduce = Array.prototype.reduce,
    warn = console.warn;
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