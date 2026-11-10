import type { Matrix, Vector } from '../../types';
import type { HTMLBBox, VertexMap } from './types';
export declare const rotation: (radians: number) => Matrix;
export declare const conjugate: (matrix: Matrix, pivot: Matrix) => Matrix;
export declare const pinnedMatrix: (scaleMatrix: Matrix, ctm: Matrix, revX?: boolean, revY?: boolean) => Matrix;
export declare const toVectors: (vertices: Record<string, number[]>) => VertexMap;
export declare const mapVertices: (vertices: Record<string, number[]>, map: (vertex: Vector) => Vector) => VertexMap;
export declare const toPoints: (vertices: Record<string, Vector>) => Record<string, {
    x: number;
    y: number;
}>;
export declare const bBoxPoints: (element: HTMLElement, container: Element, ctm: Matrix, bBox?: HTMLBBox) => Vector[];
