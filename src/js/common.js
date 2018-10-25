export const storage = (function() {
    return `Subj${Math.random().toString(32).substr(2, 10)}`;
})();

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
        warn = console.warn;

export function offset(node) {
    return node.getBoundingClientRect();
}


