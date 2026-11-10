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
export declare const clampMove: ({ box, area }: Restriction, dx: number, dy: number) => {
    dx: number;
    dy: number;
};
export declare const clampEdge: (edge: number, areaMin: number, areaMax: number, delta: number) => number;
export declare const overflowPoint: (points: number[][], bounds: number[][]) => {
    x: number | null;
    y: number | null;
};
