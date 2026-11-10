import type Helper from '../../Helper';
import type { TransformHandles } from './types';
export declare const handleKey: (handles: TransformHandles, handle: Element | null) => string | null;
export declare const handleFlags: (handle: Helper, handles: TransformHandles) => {
    revX: boolean;
    revY: boolean;
    onTopEdge: boolean;
    onLeftEdge: boolean;
    onRightEdge: boolean;
    onBottomEdge: boolean;
    doW: boolean;
    doH: boolean;
    point: "p1" | "p2" | null;
};
export declare const resizeAxes: (handle: Helper, handles: TransformHandles) => {
    x: boolean;
    y: boolean;
};
