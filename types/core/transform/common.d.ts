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
export {};
