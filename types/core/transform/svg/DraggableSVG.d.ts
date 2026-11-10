import Transformable from '../transformable';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
import type { SVGStorage, SVGOptions, Vertices } from './types';
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
