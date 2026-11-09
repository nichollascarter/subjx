import Transformable from '../transformable';
import type { Matrix, Vector } from '../../types';
import type { TransformOriginParams, AlignmentDirection } from '../../options';
import type { HTMLStorage, HTMLOptions, VertexMap } from './types';
export default class Draggable extends Transformable<Matrix, HTMLStorage> {
    elements: HTMLElement[];
    options: HTMLOptions;
    /**
     * Handle positions as [x, y, ...] arrays in container coordinates: box corners
     * and edge midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, and rotator
     * when rotatable; anchor, the rotator's base point, is { x, y }
     * @param transformMatrix matrix applied on top of the element transform
     */
    getVertices(transformMatrix?: Matrix): VertexMap;
    setTransformOrigin({ x, y, dx, dy }?: TransformOriginParams, pin?: boolean): void;
    fitControlsToSize(): void;
    getBoundingRect(transformMatrix?: Matrix | null): Vector[];
    applyAlignment(direction: AlignmentDirection, target?: Element | null): void;
    getDimensions(): {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    };
}
