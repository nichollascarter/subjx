import type { Point, Delta, ElementData, TransformHandles, TransformOptions, TransformStorage } from '../transformable';
export interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface StoredAttributes {
    x?: number;
    y?: number;
    textLength?: number | null;
    fontSize?: number;
    textBox?: BBox;
    r?: number;
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
    width?: number;
    height?: number;
    resX1?: number;
    resY1?: number;
    resX2?: number;
    resY2?: number;
    points?: string | null;
    path?: string | null;
    matrix: DOMMatrix;
    ctm: DOMMatrix;
    childCTM: DOMMatrix;
}
export interface SVGElementTransform {
    ctm: DOMMatrix;
    matrix: DOMMatrix;
    parentMatrix: DOMMatrix;
    auxiliary: {
        scale: {
            scaleMatrix: DOMMatrix;
            translateMatrix: DOMMatrix;
        };
        translate: {
            parentMatrix: DOMMatrix;
            translateMatrix: DOMMatrix;
        };
        rotate: {
            translateMatrix: DOMMatrix;
        };
    };
    scX: number;
    scY: number;
    [key: string]: unknown;
}
export interface SVGElementData extends ElementData<DOMMatrix> {
    parent: ParentNode | null;
    transform: SVGElementTransform;
    bBox: BBox;
    __data__: WeakMap<Element, StoredAttributes>;
    cached: {
        scaleX?: number;
        scaleY?: number;
        dist?: Delta & {
            ox: number;
            oy: number;
        };
        transformMatrix?: DOMMatrix;
        resultMatrix?: DOMMatrix;
    };
}
export type SVGHandles = TransformHandles & {
    center?: SVGCircleElement;
    radius?: SVGLineElement | null;
    normal?: SVGLineElement | null;
};
export interface SVGStorage extends TransformStorage<DOMMatrix> {
    wrapper: SVGGElement;
    controls: SVGGElement;
    handles: SVGHandles;
    data: WeakMap<Element, SVGElementData>;
    transformOrigin: DOMPoint;
    bBox: BBox;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        hx?: number | null;
        hy?: number | null;
        local?: Point | null;
    };
    transform: {
        containerMatrix: DOMMatrix;
        controlsMatrix: DOMMatrix;
        controlsTranslateMatrix: DOMMatrix;
        wrapperOriginMatrix: DOMMatrix;
    };
    cached: TransformStorage<DOMMatrix>['cached'] & {
        transformOrigin?: DOMPoint;
    };
    hitAreas: Record<string, SVGPathElement>;
    hitOverlay?: SVGPathElement;
    guidesLayer?: SVGGElement;
}
export type SVGOptions = TransformOptions & {
    container: SVGGraphicsElement;
    controlsContainer: SVGGraphicsElement;
    restrict: SVGGraphicsElement | null;
};
export type Vertices = Record<string, Point>;
