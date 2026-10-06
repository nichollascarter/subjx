export interface Box {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export interface GuideLine {
    axis: 'x' | 'y';
    value: number;
    from: number;
    to: number;
}
export interface GuideState {
    box: Box;
    targets: Box[];
    threshold: number;
    snap: boolean;
    axisAligned?: boolean;
    flipX?: boolean;
    flipY?: boolean;
    point?: {
        x: number;
        y: number;
    } | null;
}
export interface Alignment {
    dx: number;
    dy: number;
    lines: GuideLine[];
}
export interface Axes {
    x?: boolean;
    y?: boolean;
}
export declare const boxFromPoints: (points: number[][]) => Box;
export declare const unionBoxes: (boxes: Box[]) => Box;
export declare const align: (state: GuideState, dx: number, dy: number, axes?: Axes) => Alignment;
export declare const alignEdges: (state: GuideState, edges: {
    x?: number | null;
    y?: number | null;
}, extent: (dx: number, dy: number) => Box, dx: number, dy: number, axes?: Axes) => Alignment;
