import Transformable from './Transformable';
import type { Delta, ElementData, TransformHandles, TransformOptions, TransformStorage } from './Transformable';
import type { Matrix, Vector } from '../types';
import type { TransformOriginParams, AlignmentDirection } from '../options';
interface BoxSize {
    width: number;
    height: number;
}
interface HTMLBBox extends BoxSize {
    x?: number;
    y?: number;
    left?: number;
    top?: number;
    offset?: {
        left: number;
        top: number;
    };
}
interface HTMLElementTransform {
    ctm: Matrix;
    matrix: Matrix;
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
interface HTMLElementData extends ElementData<Matrix> {
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
type HTMLHandles = TransformHandles & Record<string, HTMLElement | null | undefined>;
interface HTMLStorage extends TransformStorage<Matrix> {
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
type HTMLOptions = TransformOptions & {
    container: HTMLElement;
    controlsContainer: HTMLElement;
    restrict: HTMLElement | null;
};
export default class Draggable extends Transformable<Matrix, HTMLStorage> {
    elements: HTMLElement[];
    options: HTMLOptions;
    setCenterPoint(...args: [TransformOriginParams?, boolean?]): void;
    setTransformOrigin({ x, y, dx, dy }?: TransformOriginParams, pin?: boolean): void;
    fitControlsToSize(): void;
    getBoundingRect(transformMatrix?: Matrix | null): number[][];
    applyAlignment(direction: AlignmentDirection, target?: Element | null): void;
    getDimensions(): {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    };
}
export {};
