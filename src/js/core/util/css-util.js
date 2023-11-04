import { helper } from '../Helper';
import { CSS_PREFIXES } from '../consts';

const getOffset = node => node.getBoundingClientRect();

const addClass = (node, cls) => {
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

const removeClass = (node, cls) => {
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

const objectsCollide = (a, b) => {
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

const matrixToCSS = (arr) => {
    const style = `matrix3d(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
    };
};

const getStyle = (el, property) => {
    const style = window.getComputedStyle(el);
    let value = null;

    for (const prefix of CSS_PREFIXES) {
        value = style.getPropertyValue(`${prefix}${property}`) || value;
        if (value) break;
    }

    return value;
};

const getScrollOffset = () => {
    const doc = document.documentElement;
    return {
        left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        top: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
    };
};

const getElementOffset = (el) => {
    let left = 0;
    let top = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        left += el.offsetLeft - el.scrollLeft;
        top += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { left, top };
};

export {
    getOffset,
    addClass,
    removeClass,
    objectsCollide,
    matrixToCSS,
    getStyle,
    getScrollOffset,
    getElementOffset
};
