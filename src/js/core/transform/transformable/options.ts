import { helper } from '../../Helper';
import { RAD } from '../common';
import { createMethod, noop } from '../../util/util';
import type { DragOptions } from '../../options';
import type { TransformOptions, TransformProxyMethods } from './types';

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

export const ORIGIN_OPTIONS: ReadonlyArray<keyof DragOptions> = ['transformOrigin', 'container'];

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

export const normalizeOptions = (options: DragOptions, elements: Element[]): TransformOptions => {
    const {
        each = {
            move: false,
            resize: false,
            rotate: false
        },
        snap: snapOptions,
        axis = 'xy',
        cursorMove = 'auto',
        cursorResize = null,
        cursorRotate = null,
        transformOrigin = false,
        restrict,
        draggable = true,
        resizable = true,
        handles,
        hitRadius = 0,
        showHitAreas = false,
        guides = false,
        rotatable = true,
        scalable = false,
        applyTranslate = false,
        container = elements[0].parentNode,
        controlsContainer = container,
        proportions = false,
        flip = true,
        rotatorAnchor = null,
        rotatorOffset = 50,
        showNormal = true,
        custom
    } = options;

    const snap = {
        x: 0,
        y: 0,
        angle: 0,
        ...snapOptions
    };

    return {
        axis,
        cursorMove,
        cursorRotate,
        cursorResize,
        transformOrigin,
        restrict: restrict
            ? helper(restrict)[0] || document.body
            : null,
        container: helper(container as Element)[0],
        controlsContainer: helper(controlsContainer as Element)[0],
        snap: {
            ...snap,
            angle: snap.angle * RAD
        },
        each,
        proportions,
        flip,
        draggable,
        resizable,
        handles: Array.isArray(handles) ? handles : null,
        hitRadius: Math.max(0, Number(hitRadius) || 0),
        showHitAreas: Boolean(showHitAreas),
        guides: guides === true ? {} : (guides && typeof guides === 'object' ? guides : null),
        rotatable,
        scalable,
        applyTranslate,
        custom: (typeof custom === 'object' && custom) || null,
        rotatorAnchor,
        rotatorOffset,
        showNormal,
        isGrouped: elements.length > 1
    };
};

export const proxyMethodsOf = ({
    onInit = noop,
    onDrop = noop,
    onMove = noop,
    onResize = noop,
    onRotate = noop,
    onDestroy = noop
}: DragOptions): TransformProxyMethods => ({
    onInit: createMethod(onInit),
    onDrop: createMethod(onDrop),
    onMove: createMethod(onMove),
    onResize: createMethod(onResize),
    onRotate: createMethod(onRotate),
    onDestroy: createMethod(onDestroy)
});
