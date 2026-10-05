export declare const requestAnimFrame: (callback: FrameRequestCallback) => number;
export declare const cancelAnimFrame: (requestID: number) => void;
export declare const forEach: (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void, arrSlice: (start?: number, end?: number) => any[], arrMap: <U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any) => U[], arrReduce: {
    (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any): any;
    (callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any;
    <U>(callbackfn: (previousValue: U, currentValue: any, currentIndex: number, array: any[]) => U, initialValue: U): U;
};
export declare const warn: (...data: any[]) => void;
export declare const noop: <T>(_: T) => T;
export declare const isDef: <T>(val: T) => val is NonNullable<T>;
export declare const isUndef: (val: unknown) => val is null | undefined;
export declare const isFunc: (val: unknown) => val is Function;
export declare const createMethod: (fn: unknown) => (this: unknown, ...args: unknown[]) => void;
