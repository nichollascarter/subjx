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

const RESIZE_CURSORS = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'];
const SECTOR = Math.PI / 4;

export const RESIZE_KEYS: ReadonlyArray<string> = [
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
    RIGHT_EDGE
];

const POINT_KEYS: ReadonlyArray<string> = [START_POINT, END_POINT];

export const POINT_CURSOR = 'crosshair';
export const ROTATE_CURSOR = 'grabbing';

const screenCenter = (element: Element): [number, number] => {
    const { left, top, width, height } = element.getBoundingClientRect();
    return [left + width / 2, top + height / 2];
};

export const cursorFromAngle = (radians: number) => (
    RESIZE_CURSORS[((Math.round(radians / SECTOR) % 4) + 4) % 4]
);

export const resizeCursor = (handles: TransformHandles, key: string): string | null => {
    const { [TOP_EDGE]: top, [BOTTOM_EDGE]: bottom, [key]: handle } = handles;

    if (!top || !bottom || !handle) return null;

    const [tx, ty] = screenCenter(top);
    const [bx, by] = screenCenter(bottom);
    const [hx, hy] = screenCenter(handle);

    return cursorFromAngle(Math.atan2(hy - (ty + by) / 2, hx - (tx + bx) / 2));
};

export const handleCursor = (handles: TransformHandles, key: string | null): string | null => {
    if (!key) return null;
    if (POINT_KEYS.includes(key)) return POINT_CURSOR;
    if (RESIZE_KEYS.includes(key)) return resizeCursor(handles, key);
    return null;
};
