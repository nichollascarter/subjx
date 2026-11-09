import type { Point } from '../../transformable';
import type { SVGElementTransform } from '../types';
interface Distance {
    dx: number;
    dy: number;
    ox: number;
    oy: number;
}
export declare const applyTranslate: (element: Element, { x, y }: Point) => void;
export declare const translateElement: (element: Element, { matrix, parentMatrix }: Pick<SVGElementTransform, "matrix" | "parentMatrix">, { dx, dy, ox, oy }: Distance) => void;
export {};
