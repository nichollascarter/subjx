import type { Matrix, Vector } from '../types';
export declare const cloneMatrix: (m: Matrix) => Matrix;
export declare const flatMatrix: (m: Matrix) => number[];
export declare const createIdentityMatrix: (n?: number) => Matrix;
export declare const createTranslateMatrix: (x: number, y: number, z?: number) => Matrix;
export declare const createScaleMatrix: (x: number, y: number, z?: number, w?: number) => Matrix;
export declare const createRotateMatrix: (sin: number, cos: number) => Matrix;
export declare const dropTranslate: (matrix: Matrix, clone?: boolean) => Matrix;
export declare const multiplyMatrixAndPoint: (mat: Matrix, point: Vector) => Vector;
export declare const multiplyMatrix: (m1: Matrix, m2: Matrix) => Matrix;
export declare const matrixInvert: (matrix: Matrix) => Matrix;
export declare const computeTransformMatrix: (tx: Matrix, [x, y, z]: Vector) => Matrix;
export declare const getCurrentTransformMatrix: (element: Element, container?: Node | null, newTransform?: Matrix | null) => Matrix;
export declare const decompose: (m: Matrix) => {
    rotate: {
        x: number;
        y: number;
        z: number;
    };
    translate: {
        x: number;
        y: number;
        z: number;
    };
    scale: {
        sX: number;
        sY: number;
        sZ: number;
    };
};
export declare const getTransform: (el: Element) => Matrix;
export declare const getTransformOrigin: (el: Element, allowBorderOffset: boolean) => Vector;
export declare const getAbsoluteOffset: (element: HTMLElement, container?: Element) => Vector;
