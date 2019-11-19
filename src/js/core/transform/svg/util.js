import { warn } from './../../util/util';

const svgPoint = createSVGElement('svg').createSVGPoint();

export const ALLOWED_ELEMENTS = [
    'circle', 'ellipse',
    'image', 'line',
    'path', 'polygon',
    'polyline', 'rect',
    'text', 'g'
];

export function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

export function createSVGMatrix() {
    return createSVGElement('svg').createSVGMatrix();
}

export function getTransformToElement(toElement, g) {
    const gTransform = g.getScreenCTM() || createSVGMatrix();
    return gTransform.inverse().multiply(
        toElement.getScreenCTM() || createSVGMatrix()
    );
}

export function matrixToString(m) {
    const { a, b, c, d, e, f } = m;
    return `matrix(${a},${b},${c},${d},${e},${f})`;
}

export function pointTo(ctm, x, y) {
    svgPoint.x = x;
    svgPoint.y = y;
    return svgPoint.matrixTransform(ctm);
}

export function cloneMatrix(b) {
    const a = createSVGMatrix();

    a.a = b.a;
    a.b = b.b;
    a.c = b.c;
    a.d = b.d;
    a.e = b.e;
    a.f = b.f;

    return a;
}

export function checkElement(el) {
    const tagName = el.tagName.toLowerCase();

    if (ALLOWED_ELEMENTS.indexOf(tagName) === -1) {
        warn(
            'Selected element is not allowed to transform. Allowed elements:\n' +
            'circle, ellipse, image, line, path, polygon, polyline, rect, text, g'
        );
        return false;
    } else {
        return true;
    }
}

export function isIdentity(matrix) {
    const { a, b, c, d, e, f } = matrix;
    return a === 1 &&
        b === 0 &&
        c === 0 &&
        d === 1 &&
        e === 0 &&
        f === 0;
}