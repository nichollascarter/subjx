export const requestAnimFrame = requestAnimationFrame ||
        mozRequestAnimationFrame ||
        webkitRequestAnimationFrame ||
        msRequestAnimationFrame ||
        function(f) {
            return setTimeout(f, 1000 / 60);
        };

export const cancelAnimFrame = cancelAnimationFrame ||
        mozCancelAnimationFrame ||
        function(requestID) {
            clearTimeout(requestID);
        };

export const forEach = Array.prototype.forEach,
        arrSlice = Array.prototype.slice,
        arrMap = Array.prototype.map,
        warn = console.warn;

export function isDef(val) {
    return val !== undefined && val !== null;
}

export function isUndef(val) {
    return val === undefined || val === null;
}

export function isFunc(val) {
    return typeof val === 'function';
}