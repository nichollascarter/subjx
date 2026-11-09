import type { Vector } from '../../types';
export declare const createElement: (classNames?: string[]) => HTMLDivElement;
export declare const lineStyle: ([x1, y1]: Vector, [x2, y2]: Vector, thickness?: number) => {
    transform: string;
    width: string;
};
export declare const createHandler: ([x, y]: Vector, key?: string) => HTMLDivElement;
export declare const renderLine: ([from, to]: Vector[], key: string) => HTMLDivElement;
