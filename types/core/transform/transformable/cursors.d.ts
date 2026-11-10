import type { TransformHandles } from './types';
export declare const RESIZE_KEYS: ReadonlyArray<string>;
export declare const POINT_CURSOR = "crosshair";
export declare const ROTATE_CURSOR = "grabbing";
export declare const cursorFromAngle: (radians: number) => string;
export declare const resizeCursor: (handles: TransformHandles, key: string) => string | null;
export declare const handleCursor: (handles: TransformHandles, key: string | null) => string | null;
