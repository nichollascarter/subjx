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
}
export interface Alignment {
    dx: number;
    dy: number;
    lines: GuideLine[];
}
export declare const boxFromPoints: (points: number[][]) => Box;
export declare const unionBoxes: (boxes: Box[]) => Box;
export declare const align: ({ box, targets, threshold, snap }: GuideState, dx: number, dy: number, { x: alignX, y: alignY }?: {
    x?: boolean;
    y?: boolean;
}) => Alignment;
