export declare const RAD: number;
export declare const DEG: number;
export declare const snapToGrid: (value: number, snap: number) => number | undefined;
export declare const floatToFixed: (val: number, size?: number) => number;
export declare const getMinMaxOfArray: (arr: number[][], length?: number) => [number, number][];
export declare const rotatorAngle: (alongX: number, alongY: number, acrossX: number, acrossY: number) => number;
interface ResizeBoxParams {
    width: number;
    height: number;
    dx: number;
    dy: number;
    doW?: boolean;
    doH?: boolean;
    proportions: boolean;
    flip: boolean;
}
export declare const resizeBox: ({ width, height, dx, dy, doW, doH, proportions, flip }: ResizeBoxParams) => [number, number, number, number];
interface XY {
    x: number;
    y: number;
}
export declare const rotatorPlacement: (vertices: Record<string, XY>, rotatorAnchor: string | null, rotatorOffset: number) => {
    anchor: XY;
    rotator: XY;
};
export declare const alignmentOffset: (direction: string, [[minX, maxX], [minY, maxY]]: [number, number][], [[elMinX, elMaxX], [elMinY, elMaxY]]: [number, number][]) => [number, number];
export interface BoxRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const boxVertices: ({ x, y, width, height }: BoxRect) => Record<string, number[]>;
export declare const edgeSegments: <T>({ tl, tr, bl, br }: Record<string, T>) => Record<string, T[]>;
export {};
