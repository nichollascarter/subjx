import Helper from '../Helper';
import SubjectModel from '../SubjectModel';
import type { PointerInput, ProxyMethods } from '../SubjectModel';
import type Observable from '../observable/Observable';
import type { Observer } from '../observable/Observable';
import type { DragOptions, MimicOptions, Direction, ExeDragParams, ExeResizeParams, ExeRotateParams, TransformEventMap, ResizeHandleKey } from '../options';
export interface Point {
    x: number;
    y: number;
}
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
    frame?: number;
    controlsMatrix?: M;
    [key: string]: unknown;
}
export interface TransformOptions {
    axis: string;
    cursorMove: string;
    cursorRotate: string;
    cursorResize: string;
    rotationPoint: boolean;
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
    draggable: boolean;
    resizable: boolean;
    handles: ResizeHandleKey[] | null;
    hitRadius: number;
    showHitAreas: boolean;
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
export interface NotifyResizeArgs extends Delta {
    revX: boolean;
    revY: boolean;
    dox: boolean;
    doy: boolean;
}
export interface NotifyActionArgs {
    clientX: number;
    clientY: number;
    actionName: string;
    triggerEvent: boolean;
}
export type NotifyGetStateArgs = NotifyActionArgs & Partial<ResizeFlags> & {
    factor?: number;
};
export default abstract class Transformable<M = unknown, S extends TransformStorage<M> = TransformStorage<M>> extends SubjectModel<S, TransformProxyMethods, TransformEventMap> implements Observer {
    storage: S;
    options: TransformOptions;
    observable: Observable;
    constructor(elements: Element[], options: DragOptions | undefined, observable: Observable);
    abstract getBoundingRect(elementOrMatrix?: Element | M | null, matrix?: M | null): number[][];
    abstract setCenterPoint(...args: unknown[]): void;
    abstract setTransformOrigin(params?: {
        x?: number;
        y?: number;
        dx?: number;
        dy?: number;
    }, pin?: boolean): void;
    notifyMove({ dx, dy }: Delta): void;
    notifyRotate({ radians, ...rest }: {
        radians: number;
        [key: string]: unknown;
    }): void;
    notifyResize({ dx, dy, revX, revY, dox, doy }: NotifyResizeArgs): void;
    notifyApply({ clientX, clientY, actionName, triggerEvent }: NotifyActionArgs): void;
    notifyGetState({ clientX, clientY, actionName, triggerEvent, ...rest }: NotifyGetStateArgs): void;
    subscribe({ resize, move, rotate }: MimicOptions): void;
    unsubscribe(): void;
    disable(): void;
    exeDrag({ dx, dy }: ExeDragParams): void;
    exeResize({ dx, dy, revX, revY, doW, doH }: ExeResizeParams): void;
    exeRotate({ delta }: ExeRotateParams): void;
    resetCenterPoint(): void;
    resetTransformOrigin(): void;
    get controls(): S['wrapper'];
}
