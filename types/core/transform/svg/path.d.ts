export interface PathSegment {
    key: string;
    values: number[];
    cmd?: string;
    relative?: boolean;
}
export declare const movePath: (params: {
    path: string;
    dx: number;
    dy: number;
}) => string | undefined;
export declare const resizePath: (params: {
    path: string;
    localCTM: DOMMatrix;
}) => string | undefined;
