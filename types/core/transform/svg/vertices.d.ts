import type { Point } from '../transformable';
import type { BBox, Vertices } from './types';
export declare const transformVertices: (vertices: Record<string, number[]>, matrix: DOMMatrix) => Vertices;
export declare const bBoxPoints: (element: SVGGraphicsElement, ctm: DOMMatrix, bBox?: BBox) => number[][];
export declare const lineRotator: (start: Point, end: Point, rotatorAnchor: string | null, rotatorOffset: number) => {
    anchor: {
        x: number;
        y: number;
    };
    rotator: {
        x: number;
        y: number;
    };
};
