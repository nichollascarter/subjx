import type { MimicOptions } from '../../options';
import {
    E_DRAG_START,
    E_DRAG,
    E_DRAG_END,
    E_RESIZE_START,
    E_RESIZE,
    E_RESIZE_END,
    E_ROTATE_START,
    E_ROTATE,
    E_ROTATE_END,
    E_SET_POINT,
    E_SET_POINT_END
} from './consts';

export interface ActionFlags {
    doResize?: boolean;
    doDrag?: boolean;
    doRotate?: boolean;
    doSetCenter?: boolean;
}

const START_EVENTS: Record<string, string> = {
    [E_RESIZE]: E_RESIZE_START,
    [E_ROTATE]: E_ROTATE_START,
    [E_DRAG]: E_DRAG_START
};

const END_EVENTS: Record<string, string> = {
    [E_RESIZE]: E_RESIZE_END,
    [E_ROTATE]: E_ROTATE_END,
    [E_DRAG]: E_DRAG_END,
    [E_SET_POINT]: E_SET_POINT_END
};

export const actionOf = ({ doResize, doDrag, doRotate, doSetCenter }: ActionFlags): string => {
    if (doResize) return E_RESIZE;
    if (doDrag) return E_DRAG;
    if (doRotate) return E_ROTATE;
    if (doSetCenter) return E_SET_POINT;
    return E_DRAG;
};

export const isMimicked = (
    { doResize, doDrag, doRotate }: ActionFlags,
    { move, resize, rotate }: MimicOptions
): boolean => Boolean(
    (doResize && resize) ||
    (doRotate && rotate) ||
    (doDrag && move)
);

export const startEventOf = (action: string): string | null => START_EVENTS[action] ?? null;

export const endEventOf = (action: string): string | null => END_EVENTS[action] ?? null;
