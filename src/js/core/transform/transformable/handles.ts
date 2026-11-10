import type Helper from '../../Helper';
import { isDef } from '../../util/util';
import {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    BOTTOM_CENTER,
    MIDDLE_LEFT,
    MIDDLE_RIGHT,
    TOP_EDGE,
    BOTTOM_EDGE,
    LEFT_EDGE,
    RIGHT_EDGE,
    START_POINT,
    END_POINT
} from './consts';
import type { TransformHandles } from './types';

const { keys } = Object;

const REVERSE_X = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE];
const REVERSE_Y = [TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE];
const ON_TOP = [TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE];
const ON_LEFT = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE];
const ON_RIGHT = [TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE];
const ON_BOTTOM = [BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE];
const WIDTH_ONLY = [MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE];
const HEIGHT_ONLY = [TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE];
const POINTS = [START_POINT, END_POINT];

const RESIZE_X = [MIDDLE_LEFT, MIDDLE_RIGHT, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, LEFT_EDGE, RIGHT_EDGE];
const RESIZE_Y = [BOTTOM_RIGHT, BOTTOM_LEFT, BOTTOM_CENTER, TOP_RIGHT, TOP_LEFT, TOP_CENTER, TOP_EDGE, BOTTOM_EDGE];

const matcher = (handle: Helper, handles: TransformHandles) => {
    const isHandle = (key: string) => {
        const hdl = handles[key];
        return isDef(hdl) ? handle.is(hdl) : false;
    };

    return {
        isHandle,
        some: (items: string[]) => items.some(isHandle)
    };
};

export const handleKey = (handles: TransformHandles, handle: Element | null): string | null => (
    keys(handles).find(key => handles[key] === handle) ?? null
);

export const handleFlags = (handle: Helper, handles: TransformHandles) => {
    const { isHandle, some } = matcher(handle, handles);

    return {
        revX: some(REVERSE_X),
        revY: some(REVERSE_Y),
        onTopEdge: some(ON_TOP),
        onLeftEdge: some(ON_LEFT),
        onRightEdge: some(ON_RIGHT),
        onBottomEdge: some(ON_BOTTOM),
        doW: some(WIDTH_ONLY),
        doH: some(HEIGHT_ONLY),
        point: POINTS.find(isHandle) || null
    };
};

export const resizeAxes = (handle: Helper, handles: TransformHandles) => {
    const { some } = matcher(handle, handles);

    return {
        x: some(RESIZE_X),
        y: some(RESIZE_Y)
    };
};
