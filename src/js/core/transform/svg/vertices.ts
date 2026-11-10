import type { Point } from '../transformable';
import { pointTo } from './util';
import type { BBox, Vertices } from './types';

const { entries } = Object;

export const transformVertices = (vertices: Record<string, number[]>, matrix: DOMMatrix): Vertices => (
    entries(vertices).reduce<Vertices>((result, [key, [x, y]]) => {
        result[key] = pointTo(matrix, x, y);
        return result;
    }, {})
);

export const bBoxPoints = (element: SVGGraphicsElement, ctm: DOMMatrix, bBox: BBox = element.getBBox()) => {
    const { x, y, width, height } = bBox;

    return [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height]
    ].map(([l, t]) => {
        const { x: nx, y: ny } = pointTo(ctm, l, t);
        return [nx, ny];
    });
};

export const lineRotator = (start: Point, end: Point, rotatorAnchor: string | null, rotatorOffset: number) => {
    const axisX = end.x - start.x,
        axisY = end.y - start.y;
    const length = Math.sqrt(axisX * axisX + axisY * axisY);

    const [normalX, normalY] = length
        ? [axisY / length, -axisX / length]
        : [0, -1];

    const side = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;

    const anchor = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
    };

    return {
        anchor,
        rotator: {
            x: anchor.x + normalX * rotatorOffset * side,
            y: anchor.y + normalY * rotatorOffset * side
        }
    };
};
