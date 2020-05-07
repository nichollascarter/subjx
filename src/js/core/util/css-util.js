import { helper } from '../Helper';

export const getOffset = (node) => {
    return node.getBoundingClientRect();
};

export const getTransform = (el) => {
    const transform = el.css('-webkit-transform') ||
        el.css('-moz-transform') ||
        el.css('-ms-transform') ||
        el.css('-o-transform') ||
        el.css('transform') ||
        'none';
    return transform;
};

export const parseMatrix = (value) => {
    const transform = value.match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);

    if (transform) {
        return transform.map(item => {
            return parseFloat(item);
        });
    } else {
        return [1, 0, 0, 1, 0, 0];
    }
};

export const addClass = (node, cls) => {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(cl => {
                return node.classList.add(cl);
            });
        } else {
            return node.classList.add(cls);
        }
    }
    return node;
};

export const removeClass = (node, cls) => {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(cl => {
                return node.classList.remove(cl);
            });
        } else {
            return node.classList.remove(cls);
        }
    }
    return node;
};

export const objectsCollide = (a, b) => {
    const {
            top: aTop,
            left: aLeft
        } = getOffset(a),
        {
            top: bTop,
            left: bLeft
        } = getOffset(b),
        _a = helper(a),
        _b = helper(b);

    return !(
        ((aTop < bTop) ||
            (aTop + parseFloat(_a.css('height'))) > (bTop + parseFloat(_b.css('height')))) ||
        ((aLeft < bLeft) ||
            (aLeft + parseFloat(_a.css('width'))) > (bLeft + parseFloat(_b.css('width'))))
    );
};

export const matrixToCSS = (arr) => {
    const style = `matrix(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
    };
};