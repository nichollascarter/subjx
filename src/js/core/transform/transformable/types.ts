import type Helper from '../../Helper';
import type { PointerInput, ProxyMethods } from '../../SubjectModel';
import type {
    Point,
    MimicOptions,
    Direction,
    ResizeHandleKey,
    GuidesOptions
} from '../../options';
import type { GuideState } from '../guides';
import type { Restriction } from '../restrict';

export type { Point };

export interface RestrictPoint {
    x: number | null;
    y: number | null;
}

export interface Delta {
    dx: number;
    dy: number;
}

export interface ResizeFlags {
    revX: boolean;
    revY: boolean;
    doW: boolean;
    doH: boolean;
}

export interface ElementData<M = unknown> {
    transform: {
        ctm: M;
        [key: string]: unknown;
    };
    cx?: number;
    cy?: number;
    [key: string]: unknown;
}

export type TransformHandles = Record<string, Element | null | undefined>;

export interface TransformStorage<M = unknown> {
    wrapper: Element;
    controls: Element;
    handles: TransformHandles;
    data: WeakMap<Element, ElementData<M>>;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        [key: string]: unknown;
    };
    transformOrigin: unknown;
    transform: {
        controlsMatrix?: M;
        containerMatrix?: M;
        [key: string]: unknown;
    };
    cached: {
        dist?: Delta;
        transformOrigin?: unknown;
        controlsMatrix?: M;
        [key: string]: unknown;
    };
    isTarget?: boolean;
    mouseEvent?: PointerInput;
    clientX?: number;
    clientY?: number;
    relativeX?: number;
    relativeY?: number;
    bx?: number;
    by?: number;
    pressang?: number;
    handle?: Helper;
    dox?: boolean;
    doy?: boolean;
    revX?: boolean;
    revY?: boolean;
    doW?: boolean;
    doH?: boolean;
    doResize?: boolean;
    point?: string | null;
    doDrag?: boolean;
    doRotate?: boolean;
    doSetCenter?: boolean;
    doDraw?: boolean;
    onExecution?: boolean;
    cursor?: string | null;
    activeHandle?: Element | null;
    guides?: GuideState | null;
    restriction?: Restriction | null;
    frame?: number;
    controlsMatrix?: M;
    [key: string]: unknown;
}

export interface TransformOptions {
    axis: string;
    cursorMove: string;
    cursorRotate: string;
    cursorResize: string;
    transformOrigin: boolean | [number, number];
    restrict: Element | null;
    container: Element;
    controlsContainer: Element;
    snap: {
        x: number;
        y: number;
        angle: number;
    };
    each: MimicOptions;
    proportions: boolean;
    flip: boolean;
    draggable: boolean;
    resizable: boolean;
    handles: ResizeHandleKey[] | null;
    hitRadius: number;
    showHitAreas: boolean;
    guides: GuidesOptions | null;
    rotatable: boolean;
    scalable: boolean;
    applyTranslate: boolean;
    custom: Record<string, unknown> | null;
    rotatorAnchor: Direction | null;
    rotatorOffset: number;
    showNormal: boolean;
    isGrouped: boolean;
}

export interface TransformProxyMethods extends ProxyMethods {
    onResize: ProxyMethods['onMove'];
    onRotate: ProxyMethods['onMove'];
}

export type ActiveSession = Required<Pick<TransformStorage,
    | 'clientX' | 'clientY' | 'relativeX' | 'relativeY' | 'bx' | 'by' | 'pressang'
    | 'dox' | 'doy' | 'revX' | 'revY' | 'mouseEvent'
    | 'doDrag' | 'doResize' | 'doRotate' | 'doSetCenter'
>> & {
    center: Point;
};
