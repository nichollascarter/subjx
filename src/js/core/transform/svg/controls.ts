import type { Point } from '../transformable';
import type { GuideLine } from '../guides';
import { EDGE_KEYS } from './hit-areas';
import type { HitCorners } from './hit-areas';
import { createSVGElement } from './util';

const { entries } = Object;

export const ORIGIN_COLOR = '#fe3232';

const GUIDE_COLOR = '#ff3d9a';

export const setAttributes = (element: Element, attrs: Record<string, string | number>) => {
    entries(attrs).forEach(([attr, value]) => element.setAttribute(attr, String(value)));
};

export const createHandler = (left: number, top: number, color: string, key: string) => {
    const handler = createSVGElement(
        'circle',
        ['sjx-svg-hdl', `sjx-svg-hdl-${key}`]
    );

    setAttributes(handler, {
        cx: left,
        cy: top,
        r: 4,
        fill: '#fff',
        stroke: color,
        'stroke-width': 1,
        'fill-opacity': 1,
        'vector-effect': 'non-scaling-stroke'
    });

    return handler;
};

export const renderLine = ([b, e]: (Point | null)[], color: string, key: string) => {
    const handler = createSVGElement(
        'line',
        ['sjx-svg-line', `sjx-svg-line-${key}`]
    );

    setAttributes(handler, {
        x1: b!.x,
        y1: b!.y,
        x2: e!.x,
        y2: e!.y,
        stroke: color,
        'stroke-width': 1,
        'vector-effect': 'non-scaling-stroke'
    });

    return handler;
};

export const setLineStyle = (line: Element, color: string) => {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
};

export const renderRadius = (from: Point, to: Point) => {
    const radius = createSVGElement('line', ['sjx-hidden']);

    radius.x1.baseVal.value = from.x;
    radius.y1.baseVal.value = from.y;
    radius.x2.baseVal.value = to.x;
    radius.y2.baseVal.value = to.y;

    setLineStyle(radius, ORIGIN_COLOR);
    radius.setAttribute('opacity', '0.5');

    return radius;
};

export const createHitArea = (key: string) => {
    const area = createSVGElement('path', [
        'sjx-svg-hit',
        `sjx-svg-hit-${key}`,
        EDGE_KEYS.includes(key) ? 'sjx-svg-hit-edge' : 'sjx-svg-hit-handle'
    ]);

    area.setAttribute('data-sjx-handle', key);
    area.setAttribute('fill', 'transparent');

    return area;
};

export const readCorners = (top?: Element | null, bottom?: Element | null): HitCorners | null => {
    if (!top || !bottom) return null;

    const point = (line: Element, n: 1 | 2) => ({
        x: Number(line.getAttribute(`x${n}`)) || 0,
        y: Number(line.getAttribute(`y${n}`)) || 0
    });

    return {
        tl: point(top, 1),
        tr: point(top, 2),
        bl: point(bottom, 1),
        br: point(bottom, 2)
    };
};

export const createGuideLine = ({ axis, value, from, to }: GuideLine) => {
    const line = createSVGElement('line', ['sjx-svg-guide']);
    const [x1, y1, x2, y2] = axis === 'x'
        ? [value, from, value, to]
        : [from, value, to, value];

    setAttributes(line, {
        x1,
        y1,
        x2,
        y2,
        stroke: GUIDE_COLOR,
        'stroke-width': 1,
        'vector-effect': 'non-scaling-stroke',
        'pointer-events': 'none'
    });

    return line;
};

export const screenScale = (element: SVGGraphicsElement) => {
    const matrix = element.getScreenCTM();

    return matrix
        ? Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c)) || 1
        : 1;
};
