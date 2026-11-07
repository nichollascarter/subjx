import type { DragOptions } from '../../options';

const { keys } = Object;

export const RUNTIME_OPTIONS: ReadonlyArray<keyof DragOptions> = [
    'axis',
    'snap',
    'each',
    'proportions',
    'flip',
    'draggable',
    'scalable',
    'applyTranslate',
    'guides',
    'cursorMove',
    'cursorResize',
    'cursorRotate',
    'custom',
    'onInit',
    'onMove',
    'onResize',
    'onRotate',
    'onDrop',
    'onDestroy'
];

export const ORIGIN_OPTIONS: ReadonlyArray<keyof DragOptions> = ['transformOrigin', 'rotationPoint', 'container'];

const isPlainObject = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype
);

export const isSameOption = (a: unknown, b: unknown): boolean => {
    if (a === b) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((item, index) => item === b[index]);
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = keys(a);
        return aKeys.length === keys(b).length && aKeys.every(key => a[key] === b[key]);
    }

    return false;
};
