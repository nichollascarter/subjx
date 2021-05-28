import { warn, forEach } from './../../util/util';
import { addClass } from '../../util/css-util';

export const sepRE = /\s*,\s*|\s+/g;

const allowedElements = [
    'circle', 'ellipse',
    'image', 'line',
    'path', 'polygon',
    'polyline', 'rect',
    'text', 'g', 'foreignobject',
    'use'
];

export function createSVGElement(name, classNames = []) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    classNames.forEach(className => addClass(element, className));
    return element;
}

export const createSVGPoint = (x, y) => {
    const pt = createSVGElement('svg').createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt;
};

export const checkChildElements = (element) => {
    const arrOfElements = [];

    if (isSVGGroup(element)) {
        forEach.call(element.childNodes, item => {
            if (item.nodeType === 1) {
                const tagName = item.tagName.toLowerCase();

                if (allowedElements.indexOf(tagName) !== -1) {
                    if (tagName === 'g') {
                        arrOfElements.push(...checkChildElements(item));
                    }
                    arrOfElements.push(item);
                }
            }
        });
    } else {
        arrOfElements.push(element);
    }

    return arrOfElements;
};

export const createSVGMatrix = () => {
    return createSVGElement('svg').createSVGMatrix();
};

export const createTranslateMatrix = (x, y) => {
    const matrix = createSVGMatrix();
    matrix.e = x;
    matrix.f = y;

    return matrix;
};

export const createRotateMatrix = (sin, cos) => {
    const matrix = createSVGMatrix();

    matrix.a = cos;
    matrix.b = sin;
    matrix.c = - sin;
    matrix.d = cos;

    return matrix;
};

export const createScaleMatrix = (x, y) => {
    const matrix = createSVGMatrix();
    matrix.a = x;
    matrix.d = y;

    return matrix;
};

export const getTransformToElement = (toElement, g) => {
    const gTransform = (g.getScreenCTM && g.getScreenCTM()) || createSVGMatrix();
    return gTransform.inverse().multiply(
        toElement.getScreenCTM() || createSVGMatrix()
    );
};

export const matrixToString = (m) => {
    const { a, b, c, d, e, f } = m;
    return `matrix(${a},${b},${c},${d},${e},${f})`;
};

export const pointTo = (ctm, x, y) => {
    return createSVGPoint(x, y).matrixTransform(ctm);
};

export const cloneMatrix = (b) => {
    const a = createSVGMatrix();

    a.a = b.a;
    a.b = b.b;
    a.c = b.c;
    a.d = b.d;
    a.e = b.e;
    a.f = b.f;

    return a;
};

export const isIdentity = (matrix) => {
    const { a, b, c, d, e, f } = matrix;
    return a === 1 &&
        b === 0 &&
        c === 0 &&
        d === 1 &&
        e === 0 &&
        f === 0;
};

export const checkElement = (el) => {
    const tagName = el.tagName.toLowerCase();

    if (allowedElements.indexOf(tagName) === -1) {
        warn(
            `Selected element "${tagName}" is not allowed to transform. Allowed elements:\n
            circle, ellipse, image, line, path, polygon, polyline, rect, text, g`
        );
        return false;
    } else {
        return true;
    }
};

export const isSVGGroup = (element) => (
    element.tagName.toLowerCase() === 'g'
);

export const normalizeString = (str = '') => (
    str.replace(/[\n\r]/g, '')
        .replace(/([^e])-/g, '$1 -')
        .replace(/ +/g, ' ')
        .replace(/(\d*\.)(\d+)(?=\.)/g, '$1$2 ')
);

// example "101.3,175.5 92.3,162 110.3,162 		"
export const parsePoints = (pts) => (
    normalizeString(pts).trim().split(sepRE).reduce(
        (result, _, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            return result;
        },
        []
    )
);