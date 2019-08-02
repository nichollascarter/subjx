import { warn } from './../../util/util';

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
    return `matrix(${m.a},${m.b},${m.c},${m.d},${m.e},${m.f})`;
}

export function pointTo(ctm, svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(ctm);
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
    return matrix.a === 1 &&
        matrix.b === 0 &&
        matrix.c === 0 &&
        matrix.d === 1 &&
        matrix.e === 0 &&
        matrix.f === 0;
}