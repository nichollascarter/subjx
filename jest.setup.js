const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

window.requestAnimationFrame = function (f) {
    return setTimeout(f, 1000 / 60);
};

window.cancelAnimationFrame = function (requestID) {
    clearTimeout(requestID);
};

// eslint-disable-next-line no-unused-vars
document.createElementNS = (ns, name) => {
    const el = svg;

    el.createSVGPoint = () => {
        return {
            x: 0,
            y: 0,
            matrixTransform: () => {
                return el.createSVGPoint();
            }
        };
    };

    el.createSVGMatrix = () => {
        return {
            a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
        };
    };

    el.getScreenCTM = () => {
        return {
            a: 2, b: 0, c: 0, d: 2, e: 10, f: 10
        };
    };

    return el;
};

jest.setTimeout(10000);