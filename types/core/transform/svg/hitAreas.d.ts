export interface HitPoint {
    x: number;
    y: number;
}
export interface HitCorners {
    tl: HitPoint;
    tr: HitPoint;
    bl: HitPoint;
    br: HitPoint;
}
export declare const EDGE_KEYS: readonly string[];
export declare const hitAreaOutline: (key: string, center: HitPoint, corners: HitCorners | null, radius: number) => HitPoint[];
export declare const outlineToPath: (points: HitPoint[]) => string;
