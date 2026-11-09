import type { BBox, StoredAttributes } from '../types';
interface ResizeParams {
    dx?: number;
    dy?: number;
    scaleX: number;
    scaleY: number;
    localCTM: DOMMatrix;
    transformMatrix: DOMMatrix;
    bBox: BBox;
    __data__: WeakMap<Element, StoredAttributes>;
    isGrouped: boolean;
}
export declare const applyResize: (element: Element, data: ResizeParams) => void;
export declare const resizeElement: (element: Element, params: Omit<ResizeParams, "localCTM">) => void;
export {};
