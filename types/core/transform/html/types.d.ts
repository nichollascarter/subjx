import type { Point, Delta, ElementData, TransformHandles, TransformOptions, TransformStorage } from '../transformable';
import type { Matrix, Vector } from '../../types';
export interface BoxSize {
    width: number;
    height: number;
}
export interface HTMLBBox extends BoxSize {
    x?: number;
    y?: number;
    left?: number;
    top?: number;
    offset?: {
        left: number;
        top: number;
    };
}
export interface HTMLElementTransform {
    ctm: Matrix;
    matrix: Matrix;
    origin: Vector;
    parentMatrix: Matrix;
    auxiliary: {
        scale: {
            translateMatrix: Matrix;
        };
        translate: {
            parentMatrix: Matrix;
        };
        rotate: {
            translateMatrix: Matrix;
        };
    };
    scaleX: number;
    scaleY: number;
    scX: number;
    scY: number;
    [key: string]: unknown;
}
export interface HTMLElementData extends ElementData<Matrix> {
    parent: Element;
    transform: HTMLElementTransform;
    bBox: HTMLBBox;
    __data__: WeakMap<Element, unknown>;
    cached?: {
        dx?: number;
        dy?: number;
        bBox?: BoxSize;
        dist?: Delta & {
            ox: number;
            oy: number;
        };
    };
}
export type HTMLHandles = TransformHandles & Record<string, HTMLElement | null | undefined>;
export interface HTMLStorage extends TransformStorage<Matrix> {
    wrapper: HTMLElement;
    controls: HTMLElement;
    handles: HTMLHandles;
    data: WeakMap<Element, HTMLElementData>;
    transformOrigin: Vector;
    bBox: HTMLBBox;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        matrix?: Matrix;
    };
    transform: {
        containerMatrix: Matrix;
        controlsMatrix: Matrix;
        wrapperMatrix: Matrix;
    };
    cached: TransformStorage<Matrix>['cached'] & {
        transformOrigin?: Vector;
        bBox?: BoxSize;
    };
}
export type HTMLOptions = TransformOptions & {
    container: HTMLElement;
    controlsContainer: HTMLElement;
    restrict: HTMLElement | null;
};
export type VertexMap = Record<string, Vector> & {
    anchor?: Point;
};
