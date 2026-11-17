import { screenScale } from './controls';
import { padBBox } from './vertices';
import type { BBox } from './types';

const matrixScale = (matrix: DOMMatrix | null | undefined) => (
    matrix ? Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c)) || 1 : 1
);

const isHidden = (element: Element, root: Element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
        if (window.getComputedStyle(node).getPropertyValue('display') === 'none') return true;
        if (node === root) break;
    }
    return false;
};

const scaleWithin = (element: SVGGraphicsElement, root: SVGGraphicsElement) => {
    if (element === root) return 1;
    const own = element.getCTM?.();
    const base = root.getCTM?.();
    return own && base ? matrixScale(base.inverse().multiply(own)) : 1;
};

const halfStroke = (element: SVGGraphicsElement, root: SVGGraphicsElement) => {
    if (isHidden(element, root)) return 0;

    const style = window.getComputedStyle(element);
    const stroke = style.getPropertyValue('stroke');
    if (!stroke || stroke === 'none') return 0;

    const width = parseFloat(style.getPropertyValue('stroke-width')) || 0;
    const scale = style.getPropertyValue('vector-effect') === 'non-scaling-stroke'
        ? 1 / screenScale(root)
        : scaleWithin(element, root);

    return width / 2 * scale;
};

const NOT_PAINTED = 'defs, clipPath, mask, marker, pattern, symbol, title, desc, metadata';

const isPainted = (node: Element, root: Element): node is SVGGraphicsElement => {
    if (!('getBBox' in node)) return false;
    const holder = node.closest(NOT_PAINTED);
    return !holder || !root.contains(holder);
};

export const strokePadding = (element: SVGGraphicsElement) => (
    [element, ...Array.from(element.querySelectorAll('*'))]
        .filter((node): node is SVGGraphicsElement => node === element || isPainted(node, element))
        .reduce((max, node) => Math.max(max, halfStroke(node, element)), 0)
);

const nativeStrokeBBox = (element: SVGGraphicsElement, plain: BBox): BBox | null => {
    try {
        const box = element.getBBox({ stroke: true } as SVGBoundingBoxOptions);
        return box.width > plain.width || box.height > plain.height ? box : null;
    } catch {
        return null;
    }
};

export const strokeBBox = (element: SVGGraphicsElement): BBox => {
    const plain = element.getBBox();
    return nativeStrokeBBox(element, plain) ?? padBBox(plain, strokePadding(element));
};
