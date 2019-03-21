export function getOffset(node) {
    return node.getBoundingClientRect();
}

export function getTransform(el) {
    const transform = el.css('-webkit-transform') ||
        el.css('-moz-transform') ||
        el.css('-ms-transform') ||
        el.css('-o-transform') ||
        el.css('transform') ||
        'none';
    return transform;
}

export function parseTransform(a) {
    const b = {};

    for (let i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*(?:,|\s)?)+\))+/g)) {
        const c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c.map(item => { return Number(item); });
    }
    return b;
}

export function parseMatrix(el) {
    // matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    const transform = getTransform(el).match(/-?\d+\.?\d+|-?\d+/g);

    if (transform) {
        return transform.map(item => {
            return parseFloat(item);
        });
    } else {
        return [1, 0, 0, 1, 0, 0];
    }
}

export function addClass(node, cls) {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(function(cl) {
                return node.classList.add(cl);
            });
        } else {
            return node.classList.add(cls);
        }
    }
    return node;
}

export function removeClass(node, cls) {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(function(cl) {
                return node.classList.remove(cl);
            });
        } else {
            return node.classList.remove(cls);
        }
    }
    return node;
}