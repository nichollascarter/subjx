import type { DragOptions } from '../../options';
import type { TransformOptions, TransformProxyMethods } from './types';
export declare const RUNTIME_OPTIONS: ReadonlyArray<keyof DragOptions>;
export declare const ORIGIN_OPTIONS: ReadonlyArray<keyof DragOptions>;
export declare const isSameOption: (a: unknown, b: unknown) => boolean;
export declare const normalizeOptions: (options: DragOptions, elements: Element[]) => TransformOptions;
export declare const proxyMethodsOf: ({ onInit, onDrop, onMove, onResize, onRotate, onDestroy }: DragOptions) => TransformProxyMethods;
