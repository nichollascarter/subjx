import { 
    warn, 
    forEach,
    isUndef
} from './../../util/util';

const svgPoint = createSVGElement('svg').createSVGPoint();
const floatRE = /[+-]?\d+(\.\d+)?/g;

const ALLOWED_ELEMENTS = [
    'circle', 'ellipse',
    'image', 'line',
    'path', 'polygon',
    'polyline', 'rect',
    'text', 'g', 'foreignobject'
];

export function createSVGElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

export const checkChildElements = (element) => {
    const arrOfElements = [];

    if (isGroup(element)) {
        forEach.call(element.childNodes, item => {
            if (item.nodeType === 1) {
                const tagName = item.tagName.toLowerCase();

                if (ALLOWED_ELEMENTS.indexOf(tagName) !== -1) {
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

export const getTransformToElement = (toElement, g) => {
    const gTransform = g.getScreenCTM() || createSVGMatrix();
    return gTransform.inverse().multiply(
        toElement.getScreenCTM() || createSVGMatrix()
    );
};

export const matrixToString = (m) => {
    const { a, b, c, d, e, f } = m;
    return `matrix(${a},${b},${c},${d},${e},${f})`;
};

export const pointTo = (ctm, x, y) => {
    svgPoint.x = x;
    svgPoint.y = y;
    return svgPoint.matrixTransform(ctm);
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

export const checkElement = (el) => {
    const tagName = el.tagName.toLowerCase();

    if (ALLOWED_ELEMENTS.indexOf(tagName) === -1) {
        warn(
            `Selected element "${tagName}" is not allowed to transform. Allowed elements:\n
            circle, ellipse, image, line, path, polygon, polyline, rect, text, g`
        );
        return false;
    } else {
        return true;
    }
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

export const createPoint = (svg, x, y) => {
    if (isUndef(x) || isUndef(y)) {
        return null;
    }
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt;
};

export const isGroup = (element) => {
    return element.tagName.toLowerCase() === 'g';
};

export const parsePoints = (pts) => {
    return pts.match(floatRE).reduce(
        (result, value, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            return result;
        },
        []
    );
};