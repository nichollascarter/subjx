import Transformable from '../Transformable';
import type { Point, Delta, ElementData, TransformHandles, TransformOptions, TransformStorage } from '../Transformable';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface StoredAttributes {
    x?: number;
    y?: number;
    textLength?: number | null;
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
interface SVGElementTransform {
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
interface SVGElementData extends ElementData<DOMMatrix> {
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
type SVGHandles = TransformHandles & {
    center?: SVGCircleElement;
    radius?: SVGLineElement | null;
    normal?: SVGLineElement | null;
};
interface SVGStorage extends TransformStorage<DOMMatrix> {
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
}
type SVGOptions = TransformOptions & {
    container: SVGGraphicsElement;
    controlsContainer: SVGGraphicsElement;
    restrict: SVGGraphicsElement | null;
};
type Vertices = Record<string, Point>;
export default class DraggableSVG extends Transformable<DOMMatrix, SVGStorage> {
    elements: SVGGraphicsElement[];
    options: SVGOptions;
    /**
     * Handle positions as { x, y } in container coordinates: box corners and edge
     * midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, line endpoints (p1, p2)
     * for a single <line>, and rotator with its anchor when rotatable
     * @param transformMatrix matrix applied on top of the element transform
     */
    getVertices(transformMatrix?: DOMMatrix): Vertices;
    setCenterPoint(...args: [TransformOriginParams?, boolean?]): void;
    setTransformOrigin({ x, y, dx, dy }?: TransformOriginParams, pin?: boolean): void;
    fitControlsToSize(): void;
    getBoundingRect(element: SVGGraphicsElement, transformMatrix?: DOMMatrix | null): number[][];
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
