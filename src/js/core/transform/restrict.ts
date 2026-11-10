import { getMinMaxOfArray } from './common';
import type { Box } from './guides';

export interface Restriction {
    box: Box;
    area: Box;
    axisAligned?: boolean;
    flipX?: boolean;
    flipY?: boolean;
    point?: {
        x: number;
        y: number;
    } | null;
}

const clampAxis = (min: number, max: number, areaMin: number, areaMax: number, delta: number) => {
    const low = Math.min(0, areaMin - min);
    const high = Math.max(0, areaMax - max);

    return Math.min(Math.max(delta, low), high);
};

export const clampMove = ({ box, area }: Restriction, dx: number, dy: number) => ({
    dx: clampAxis(box.left, box.right, area.left, area.right, dx),
    dy: clampAxis(box.top, box.bottom, area.top, area.bottom, dy)
});

export const clampEdge = (edge: number, areaMin: number, areaMax: number, delta: number) => (
    clampAxis(edge, edge, areaMin, areaMax, delta)
);

export const overflowPoint = (points: number[][], bounds: number[][]) => {
    const [
        [minX, maxX],
        [minY, maxY]
    ] = getMinMaxOfArray(bounds);

    let x: number | null = null,
        y: number | null = null;

    for (let i = 0, len = points.length; i < len; i++) {
        const [px, py] = points[i];

        if (px < minX || px > maxX) x = px;
        if (py < minY || py > maxY) y = py;
    }

    return { x, y };
};
