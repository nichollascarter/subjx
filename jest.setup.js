window.requestAnimationFrame = function (f) {
    return setTimeout(f, 1000 / 60);
};

window.cancelAnimationFrame = function (requestID) {
    clearTimeout(requestID);
};

jest.setTimeout(10000);