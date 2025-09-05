import JsDOM from 'jsdom';

const jsdom = new JsDOM.JSDOM('<html><head></head><body></body></html>');
window = jsdom.window;

global.window = window;
global.document = window.document;
global.SVGElement = window.SVGElement;
global.MouseEvent = window.MouseEvent;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;

window.requestAnimationFrame = function (f) {
    return window.setTimeout(f, 1000 / 60);
};

window.cancelAnimationFrame = function (requestID) {
    window.clearTimeout(requestID);
};

jest.setTimeout(10000);