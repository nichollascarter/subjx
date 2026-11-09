import type { MimicOptions } from '../../options';
export interface ActionFlags {
    doResize?: boolean;
    doDrag?: boolean;
    doRotate?: boolean;
    doSetCenter?: boolean;
}
export declare const actionOf: ({ doResize, doDrag, doRotate, doSetCenter }: ActionFlags) => string;
export declare const isMimicked: ({ doResize, doDrag, doRotate }: ActionFlags, { move, resize, rotate }: MimicOptions) => boolean;
export declare const startEventOf: (action: string) => string | null;
export declare const endEventOf: (action: string) => string | null;
