import Helper, { helper } from '../Helper';
import SubjectModel from '../SubjectModel';
import type { PointerInput, MoveArgs, ProxyMethods } from '../SubjectModel';
import type Observable from '../observable/Observable';
import type { Observer } from '../observable/Observable';
import { getMinMaxOfArray, snapToGrid, RAD } from './common';
import type {
    DragOptions,
    MimicOptions,
    Direction,
    ExeDragParams,
    ExeResizeParams,
    ExeRotateParams,
    TransformEventMap,
    ResizeHandleKey,
    GuidesOptions
} from '../options';
import { align, alignEdges } from './guides';
import type { GuideState, GuideLine } from './guides';
import { clampMove, clampEdge } from './restrict';
import type { Restriction } from './restrict';

import {
    LIB_CLASS_PREFIX,
    NOTIFIER_CONSTANTS,
    EVENT_EMITTER_CONSTANTS,
    TRANSFORM_HANDLES_CONSTANTS,
    CLIENT_EVENTS_CONSTANTS
} from '../consts';

import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef,
    createMethod,
    noop,
    warn
} from '../util/util';

import {
    addClass,
    removeClass
} from '../util/css-util';

const {
    NOTIFIER_EVENTS,
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
} = NOTIFIER_CONSTANTS;

const {
    EMITTER_EVENTS,
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
} = EVENT_EMITTER_CONSTANTS;

const { TRANSFORM_HANDLES_KEYS, TRANSFORM_EDGES_KEYS, TRANSFORM_POINT_KEYS } = TRANSFORM_HANDLES_CONSTANTS;
const {
    E_MOUSEDOWN,
    E_TOUCHSTART,
    E_MOUSEMOVE,
    E_MOUSEUP,
    E_TOUCHMOVE,
    E_TOUCHEND
} = CLIENT_EVENTS_CONSTANTS;

const {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    BOTTOM_CENTER,
    MIDDLE_LEFT,
    MIDDLE_RIGHT
} = TRANSFORM_HANDLES_KEYS;

const {
    TOP_EDGE,
    BOTTOM_EDGE,
    LEFT_EDGE,
    RIGHT_EDGE
} = TRANSFORM_EDGES_KEYS;

const { START_POINT, END_POINT } = TRANSFORM_POINT_KEYS;

const { keys, values } = Object;

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

export type NotifyGetStateArgs = NotifyActionArgs & Partial<ResizeFlags> & { factor?: number };

type ActiveSession = Required<Pick<TransformStorage,
    | 'clientX' | 'clientY' | 'relativeX' | 'relativeY' | 'bx' | 'by' | 'pressang'
    | 'dox' | 'doy' | 'revX' | 'revY' | 'mouseEvent'
    | 'doDrag' | 'doResize' | 'doRotate' | 'doSetCenter'
>> & {
    center: Point;
};

export default abstract class Transformable<
    M = unknown,
    S extends TransformStorage<M> = TransformStorage<M>
> extends SubjectModel<S, TransformProxyMethods, TransformEventMap> implements Observer {

    storage!: S;
    /** @internal */
    protected proxyMethods!: TransformProxyMethods;
    options!: TransformOptions;
    observable: Observable;

    constructor(elements: Element[], options: DragOptions | undefined, observable: Observable) {
        super(elements);
        if (this.constructor === Transformable) {
            throw new TypeError('Cannot construct Transformable instances directly');
        }
        this.observable = observable;

        EMITTER_EVENTS.forEach(eventName => this.eventDispatcher.registerEvent(eventName));
        super.enable(options);
    }

    /** @internal */
    protected abstract cursorPoint(input: PointerInput): Point;

    /** @internal */
    protected abstract pointToTransform(params: Point & { matrix: M }): Point;

    /** @internal */
    protected abstract pointToControls(point: Point, transform?: S['transform']): Point;

    /** @internal */
    protected abstract processRotate(element: Element, radians: number): unknown;

    /** @internal */
    protected abstract processResize(element: Element, delta: Delta): object;

    /** @internal */
    protected abstract processMoveRestrict(element: Element, delta: Delta): RestrictPoint;

    /** @internal */
    protected abstract processResizeRestrict(element: Element, delta: Delta): RestrictPoint;

    /** @internal */
    protected abstract processPointMove(element: Element, point: string, delta: Delta): object | null;

    /** @internal */
    protected abstract prepareGuides(): GuideState | null;

    /** @internal */
    protected abstract drawGuides(lines: GuideLine[]): void;

    /** @internal */
    protected abstract prepareRestrict(): Restriction | null;

    /** @internal */
    protected abstract processRotateRestrict(element: Element, radians: number): RestrictPoint;

    /** @internal */
    protected abstract processControlsMove(delta: Delta): void;

    /** @internal */
    protected abstract processControlsResize(delta: Delta): void;

    /** @internal */
    protected abstract processControlsRotate(params: { radians: number }): void;

    /** @internal */
    protected abstract moveCenterHandle(x: number, y: number): void;

    /** @internal */
    protected abstract applyTransformToElement(element: Element, actionName: string): void;

    /** @internal */
    protected abstract processActions(actionName: string): void;

    /** @internal */
    protected abstract getCommonState(): Partial<S> & { center: { x: number; y: number }; transform: S['transform'] };

    /** @internal */
    protected abstract getElementState(element: Element, flags: Partial<ResizeFlags> & { factor?: number }): Partial<ElementData<M>>;

    /** @internal */
    protected abstract getRestrictedBBox(): number[][];

    abstract getBoundingRect(elementOrMatrix?: Element | M | null, matrix?: M | null): number[][];

    abstract setCenterPoint(...args: unknown[]): void;

    abstract setTransformOrigin(params?: { x?: number; y?: number; dx?: number; dy?: number }, pin?: boolean): void;

    /** @internal */
    private rotate({ element, radians, ...rest }: { element: Element; radians: number; [key: string]: unknown }) {
        const resultMtrx = this.processRotate(element, radians);
        const finalArgs = {
            transform: resultMtrx,
            delta: radians,
            ...rest
        };
        this.proxyMethods.onRotate.call(this, finalArgs);
        super.emitEvent(E_ROTATE, finalArgs);
    }

    /** @internal */
    private resize({ element, dx, dy, ...rest }: MoveArgs) {
        const finalValues = this.processResize(element, { dx, dy });
        const finalArgs = {
            ...finalValues,
            dx,
            dy,
            ...rest
        };
        this.proxyMethods.onResize.call(this, finalArgs);
        super.emitEvent(E_RESIZE, finalArgs);
    }

    /** @internal */
    protected processOptions(options: DragOptions = {}) {
        const { elements } = this;

        [...elements].map(element => addClass(element, `${LIB_CLASS_PREFIX}drag`));

        const {
            each = {
                move: false,
                resize: false,
                rotate: false
            },
            snap: snapOptions,
            axis = 'xy',
            cursorMove = 'auto',
            cursorResize = 'auto',
            cursorRotate = 'auto',
            rotationPoint = false,
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
            onInit = noop,
            onDrop = noop,
            onMove = noop,
            onResize = noop,
            onRotate = noop,
            onDestroy = noop,
            container = elements[0].parentNode,
            controlsContainer = container,
            proportions = false,
            rotatorAnchor = null,
            rotatorOffset = 50,
            showNormal = true,
            custom
        } = options;

        const snap = {
            x: 10,
            y: 10,
            angle: 10,
            ...snapOptions
        };

        this.options = {
            axis,
            cursorMove,
            cursorRotate,
            cursorResize,
            rotationPoint,
            transformOrigin: transformOrigin || rotationPoint,
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

        this.proxyMethods = {
            onInit: createMethod(onInit),
            onDrop: createMethod(onDrop),
            onMove: createMethod(onMove),
            onResize: createMethod(onResize),
            onRotate: createMethod(onRotate),
            onDestroy: createMethod(onDestroy)
        };

        this.subscribe(each);
    }

    /** @internal */
    protected animate() {
        const self = this;
        const {
            observable,
            storage,
            options,
            elements
        } = self;

        if (isUndef(storage)) return;

        storage.frame = requestAnimFrame(self.animate);

        if (!storage.doDraw) return;
        storage.doDraw = false;

        let {
            dox,
            doy,
            clientX,
            clientY,
            relativeX,
            relativeY,
            doDrag,
            doResize,
            doRotate,
            doSetCenter,
            revX,
            revY,
            mouseEvent,
            data,
            point
        } = storage as S & ActiveSession;

        const {
            snap,
            each: {
                move: moveEach,
                resize: resizeEach,
                rotate: rotateEach
            },
            draggable,
            resizable,
            rotatable,
            isGrouped,
            restrict,
            proportions
        } = options;

        if (doResize && resizable && point) {
            const { dx, dy } = this.clampPoint(this.alignPoint(
                snapToGrid(clientX - relativeX, snap.x) as number,
                snapToGrid(clientY - relativeY, snap.y) as number
            ));

            const result = this.processPointMove(elements[0], point, { dx, dy });

            if (result) {
                const finalArgs = {
                    ...result,
                    dx,
                    dy,
                    clientX,
                    clientY,
                    mouseEvent
                };

                this.proxyMethods.onResize.call(this, finalArgs);
                super.emitEvent(E_RESIZE, finalArgs);
            }
        } else if (doResize && resizable) {
            const aligned = this.alignResize(
                snapToGrid(clientX - relativeX, snap.x) as number,
                snapToGrid(clientY - relativeY, snap.y) as number
            );

            const {
                dx: distX,
                dy: distY,
                clamped
            } = this.clampResize(aligned.dx, aligned.dy);

            const {
                cached,
                cached: {
                    dist: {
                        dx: prevDx = 0,
                        dy: prevDy = 0
                    } = {}
                } = {}
            } = storage;

            const args = {
                dx: distX,
                dy: distY,
                clientX,
                clientY,
                mouseEvent
            };

            const { x: restX, y: restY } = restrict && !(clamped && !proportions)
                ? elements.reduce<RestrictPoint>((res, element) => {
                    const {
                        transform: {
                            // scX,
                            // scY,
                            ctm
                        }
                    } = data.get(element)!;

                    const { x, y } = !isGrouped
                        ? this.pointToTransform(
                            {
                                x: distX,
                                y: distY,
                                matrix: ctm
                            }
                        )
                        : { x: distX, y: distY };

                    const dx = dox ? (revX ? -x : x) : 0;
                    const dy = doy ? (revY ? -y : y) : 0;

                    const { x: newX, y: newY } = this.processResizeRestrict(element, { dx, dy });

                    return {
                        x: newX !== null && res.x === null ? distX : res.x,
                        y: newY !== null && res.y === null ? distY : res.y
                    };
                }, { x: null, y: null })
                : { x: null, y: null };

            const isBounding = restrict && (restX !== null || restY !== null);

            const newDx = isBounding ? prevDx : distX;
            const newDy = isBounding ? prevDy : distY;

            const nextArgs = {
                ...args,
                dx: newDx,
                dy: newDy,
                revX,
                revY,
                dox,
                doy
            };

            elements.map((element) => {
                const {
                    transform: {
                        // scX,
                        // scY,
                        ctm
                    }
                } = data.get(element)!;

                const { x, y } = !isGrouped
                    ? this.pointToTransform(
                        {
                            x: newDx,
                            y: newDy,
                            matrix: ctm
                        }
                    )
                    : { x: newDx, y: newDy };

                const dx = dox ? (revX ? -x : x) : 0;
                const dy = doy ? (revY ? -y : y) : 0;

                self.resize({
                    ...nextArgs,
                    element,
                    dx,
                    dy
                });
            });

            this.storage.cached = {
                ...cached,
                dist: {
                    dx: newDx,
                    dy: newDy
                }
            };

            this.processControlsResize({ dx: newDx, dy: newDy });

            if (resizeEach) {
                observable.notify(
                    ON_RESIZE,
                    self,
                    nextArgs
                );
            }
        }

        if (doDrag && draggable) {
            const gridDx = dox
                ? snapToGrid(clientX - relativeX, snap.x) as number
                : 0;

            const gridDy = doy
                ? snapToGrid(clientY - relativeY, snap.y) as number
                : 0;

            const alignment = storage.guides
                ? align(storage.guides, gridDx, gridDy, { x: dox, y: doy })
                : null;

            const { dx, dy } = storage.restriction
                ? clampMove(
                    storage.restriction,
                    alignment ? alignment.dx : gridDx,
                    alignment ? alignment.dy : gridDy
                )
                : { dx: alignment ? alignment.dx : gridDx, dy: alignment ? alignment.dy : gridDy };

            if (alignment) this.drawGuides(alignment.lines);

            const {
                cached,
                cached: {
                    dist: {
                        dx: prevDx = 0,
                        dy: prevDy = 0
                    } = {}
                } = {}
            } = storage;

            const args = {
                dx,
                dy,
                clientX,
                clientY,
                mouseEvent
            };

            const { x: restX, y: restY } = restrict && !storage.restriction
                ? elements.reduce<RestrictPoint>((res, element) => {
                    const { x, y } = this.processMoveRestrict(element, args);

                    return {
                        x: res.x === null && restrict ? x : res.x,
                        y: res.y === null && restrict ? y : res.y
                    };
                }, { x: null, y: null })
                : { x: null, y: null };

            const newDx = restX !== null && restrict ? prevDx : dx;
            const newDy = restY !== null && restrict ? prevDy : dy;

            const nextArgs = {
                ...args,
                dx: newDx,
                dy: newDy
            };

            this.storage.cached = {
                ...cached,
                dist: {
                    dx: newDx,
                    dy: newDy
                }
            };

            elements.map((element) => (
                super.drag({
                    element,
                    ...nextArgs,
                    dx: newDx,
                    dy: newDy
                })
            ));

            this.processControlsMove({ dx: newDx, dy: newDy });

            if (moveEach) {
                observable.notify(
                    ON_MOVE,
                    self,
                    nextArgs
                );
            }
        }

        if (doRotate && rotatable) {
            const {
                pressang,
                center
            } = storage as S & ActiveSession;

            const delta = Math.atan2(
                clientY - center.y,
                clientX - center.x
            );
            const radians = snapToGrid(delta - pressang, snap.angle) as number;

            if (restrict) {
                const isBounding = elements.some((element) => {
                    const { x: restX, y: restY } = this.processRotateRestrict(element, radians);
                    return (restX !== null || restY !== null);
                });

                if (isBounding) return;
            }

            const args = {
                clientX,
                clientY,
                mouseEvent
            };

            elements.map((element) => (
                self.rotate({
                    element,
                    radians,
                    ...args
                })
            ));

            this.processControlsRotate({ radians });

            if (rotateEach) {
                observable.notify(
                    ON_ROTATE,
                    self,
                    {
                        radians,
                        ...args
                    }
                );
            }
        }

        if (doSetCenter && rotatable) {
            const {
                bx,
                by
            } = storage as S & ActiveSession;

            const { x, y } = this.pointToControls(
                {
                    x: clientX,
                    y: clientY
                }
            );

            self.moveCenterHandle(
                x - bx,
                y - by
            );
        }
    }

    /** @internal */
    protected start(e: PointerInput) {
        const { clientX, clientY } = e;
        const target = this.resolveHandle(e.target as Element);
        const {
            elements,
            observable,
            options: { axis, each },
            storage,
            storage: { handles }
        } = this;

        const isTarget = values(handles).some((hdl) => helper(target).is(hdl)) ||
            elements.some(element => element.contains(target));

        storage.isTarget = isTarget;

        if (!isTarget) return;

        const computed = this.compute(e, elements);

        keys(computed).map(prop => (storage as Record<string, unknown>)[prop] = (computed as Record<string, unknown>)[prop]);

        const {
            onRightEdge,
            onBottomEdge,
            onTopEdge,
            onLeftEdge,
            handle,
            factor,
            revX,
            revY,
            doW,
            doH,
            point
        } = computed;

        const doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge || Boolean(point);

        const {
            rotator,
            center,
            radius
        } = handles;

        if (isDef(radius)) removeClass(radius, `${LIB_CLASS_PREFIX}hidden`);

        const doRotate = handle.is(rotator),
            doSetCenter = isDef(center)
                ? handle.is(center)
                : false;

        const doDrag = isTarget && !(doRotate || doResize || doSetCenter);

        const nextStorage = {
            mouseEvent: e,
            clientX,
            clientY,
            doResize,
            doDrag,
            doRotate,
            doSetCenter,
            onExecution: true,
            guides: (doDrag || doResize) && this.options.guides ? this.prepareGuides() : null,
            restriction: (doDrag || doResize) && this.options.restrict ? this.prepareRestrict() : null,
            cursor: null,
            dox: /x/.test(axis) && (doResize
                ?
                Boolean(point) ||
                handle.is(handles.ml) ||
                handle.is(handles.mr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tr) ||
                handle.is(handles.bl) ||
                handle.is(handles.br) ||
                handle.is(handles.le) ||
                handle.is(handles.re)
                : true),
            doy: /y/.test(axis) && (doResize
                ?
                Boolean(point) ||
                handle.is(handles.br) ||
                handle.is(handles.bl) ||
                handle.is(handles.bc) ||
                handle.is(handles.tr) ||
                handle.is(handles.tl) ||
                handle.is(handles.tc) ||
                handle.is(handles.te) ||
                handle.is(handles.be)
                : true)
        };

        this.storage = {
            ...storage,
            ...nextStorage
        };

        if (doResize || doRotate || doSetCenter) {
            this.setActiveHandle(handle[0]);
        }

        const eventArgs = {
            clientX,
            clientY
        };

        if (doResize) {
            super.emitEvent(E_RESIZE_START, eventArgs);
        } else if (doRotate) {
            super.emitEvent(E_ROTATE_START, eventArgs);
        } else if (doDrag) {
            super.emitEvent(E_DRAG_START, eventArgs);
        }

        const {
            move,
            resize,
            rotate
        } = each;

        const actionName = doResize
            ? E_RESIZE
            : (doRotate ? E_ROTATE : E_DRAG);

        const triggerEvent =
            (doResize && resize) ||
            (doRotate && rotate) ||
            (doDrag && move);

        observable.notify(
            ON_GETSTATE,
            this,
            {
                clientX,
                clientY,
                actionName,
                triggerEvent,
                factor,
                revX,
                revY,
                doW,
                doH
            }
        );

        this.draw();
    }

    /** @internal */
    protected moving(e: PointerInput) {
        const { storage = {} as S, options } = this;

        if (!storage.isTarget) return;

        const { x, y } = this.cursorPoint(e);

        storage.mouseEvent = e;
        storage.clientX = x;
        storage.clientY = y;
        storage.doDraw = true;

        let {
            doRotate,
            doDrag,
            doResize,
            cursor
        } = storage;

        const {
            cursorMove,
            cursorResize,
            cursorRotate
        } = options;

        if (isUndef(cursor)) {
            if (doDrag) {
                cursor = cursorMove;
            } else if (doRotate) {
                cursor = cursorRotate;
            } else if (doResize) {
                cursor = cursorResize;
            }
            helper(document.body).css({ cursor });
        }
    }

    /** @internal */
    protected end({ clientX, clientY }: PointerInput) {
        const {
            elements,
            options: { each },
            observable,
            storage: {
                doResize,
                doDrag,
                doRotate,
                doSetCenter,
                frame,
                handles: { radius },
                isTarget
            },
            proxyMethods
        } = this;

        if (!isTarget) return;

        const { actionName = E_DRAG } = [
            {
                actionName: E_RESIZE,
                condition: doResize
            },
            {
                actionName: E_DRAG,
                condition: doDrag
            },
            {
                actionName: E_ROTATE,
                condition: doRotate
            },
            {
                actionName: E_SET_POINT,
                condition: doSetCenter
            }
        ].find((({ condition }) => condition)) || {};

        elements.map(element => this.applyTransformToElement(element, actionName));

        this.processActions(actionName);
        this.updateStorage();

        const eventArgs = {
            clientX,
            clientY
        };

        proxyMethods.onDrop.call(this, eventArgs);

        if (doResize) {
            super.emitEvent(E_RESIZE_END, eventArgs);
        } else if (doRotate) {
            super.emitEvent(E_ROTATE_END, eventArgs);
        } else if (doDrag) {
            super.emitEvent(E_DRAG_END, eventArgs);
        } else if (doSetCenter) {
            super.emitEvent(E_SET_POINT_END, eventArgs);
        }

        const {
            move,
            resize,
            rotate
        } = each;

        const triggerEvent =
            (doResize && resize) ||
            (doRotate && rotate) ||
            (doDrag && move);

        observable.notify(
            ON_APPLY,
            this,
            {
                clientX,
                clientY,
                actionName,
                triggerEvent
            }
        );

        cancelAnimFrame(frame as number);

        this.setActiveHandle(null);

        if (this.storage.guides) {
            this.drawGuides([]);
            this.storage.guides = null;
        }

        this.storage.restriction = null;

        helper(document.body).css({ cursor: 'auto' });
        if (isDef(radius)) {
            addClass(radius, `${LIB_CLASS_PREFIX}hidden`);
        }
    }

    /** @internal */
    protected setActiveHandle(handle: Element | null) {
        const {
            storage,
            storage: {
                wrapper,
                activeHandle
            }
        } = this;

        if (activeHandle) removeClass(activeHandle, `${LIB_CLASS_PREFIX}active`);

        if (handle) {
            addClass(handle, `${LIB_CLASS_PREFIX}active`);
            addClass(wrapper, `${LIB_CLASS_PREFIX}acting`);
        } else {
            removeClass(wrapper, `${LIB_CLASS_PREFIX}acting`);
        }

        storage.activeHandle = handle;
    }

    /** @internal */
    private compute(e: PointerInput, elements: Element[]) {
        const {
            storage: {
                handles,
                data
            } = {} as S
        } = this;

        const target = this.resolveHandle(e.target as Element);
        const handle = helper(target);

        const {
            revX,
            revY,
            doW,
            doH,
            ...rest
        } = this.checkHandles(handle, handles);

        const commonState = this.getCommonState();

        const { x, y } = this.cursorPoint(e);
        const { x: bx, y: by } = this.pointToControls({ x, y }, commonState.transform);

        elements.map(element => {
            const { transform, ...nextData } = this.getElementState(element, { revX, revY, doW, doH });
            const { x: ex, y: ey } = this.pointToTransform({ x, y, matrix: transform!.ctm });

            data.set(element, {
                ...data.get(element),
                ...nextData,
                transform: transform!,
                cx: ex,
                cy: ey
            });
        });

        const pressang = Math.atan2(
            y - commonState.center.y,
            x - commonState.center.x
        );

        return {
            data,
            ...rest,
            handle: values(handles).some(hdl => helper(target).is(hdl))
                ? handle
                : helper(elements[0]),
            pressang,
            ...commonState,
            revX,
            revY,
            doW,
            doH,
            relativeX: x,
            relativeY: y,
            bx,
            by
        };
    }

    /** @internal */
    private checkHandles(handle: Helper, handles: TransformHandles) {
        const checkIsHandle = (hdl?: Element | null) => isDef(hdl) ? handle.is(hdl) : false;
        const checkAction = (items: string[]) => items.some(key => checkIsHandle(handles[key]));

        const revX = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE]);
        const revY = checkAction([TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE]);

        const onTopEdge = checkAction([TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE]);
        const onLeftEdge = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE]);
        const onRightEdge = checkAction([TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE]);
        const onBottomEdge = checkAction([BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE]);

        const doW = checkAction([MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE]);
        const doH = checkAction([TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE]);

        const point = [START_POINT, END_POINT].find(key => checkIsHandle(handles[key])) || null;

        return {
            revX,
            revY,
            onTopEdge,
            onLeftEdge,
            onRightEdge,
            onBottomEdge,
            doW,
            doH,
            point
        };
    }

    /** @internal */
    private alignResize(dx: number, dy: number) {
        const {
            storage: {
                guides,
                doW,
                doH,
                dox,
                doy
            },
            options: {
                proportions
            }
        } = this;

        if (!guides || !guides.axisAligned) return { dx, dy };

        const { box } = guides;

        const { leftMoves, topMoves } = this.movingEdges(guides);
        const widthLeads = doW || !doH;

        const alignment = alignEdges(
            guides,
            {
                x: dox ? (leftMoves ? box.left : box.right) : null,
                y: doy ? (topMoves ? box.top : box.bottom) : null
            },
            (nextDx, nextDy) => ({
                left: box.left + (dox && leftMoves ? nextDx : 0),
                right: box.right + (dox && !leftMoves ? nextDx : 0),
                top: box.top + (doy && topMoves ? nextDy : 0),
                bottom: box.bottom + (doy && !topMoves ? nextDy : 0)
            }),
            dx,
            dy,
            {
                x: Boolean(dox) && (!proportions || widthLeads),
                y: Boolean(doy) && (!proportions || !widthLeads)
            }
        );

        this.drawGuides(alignment.lines);

        return alignment;
    }

    /** @internal */
    private movingEdges({ flipX, flipY }: { flipX?: boolean; flipY?: boolean }) {
        const { revX, revY } = this.storage;

        return {
            leftMoves: Boolean(revX) !== Boolean(flipX),
            topMoves: Boolean(revY) !== Boolean(flipY)
        };
    }

    /** @internal */
    private clampResize(dx: number, dy: number) {
        const {
            storage: {
                restriction,
                dox,
                doy
            }
        } = this;

        if (!restriction || !restriction.axisAligned) return { dx, dy, clamped: false };

        const { box, area } = restriction;
        const { leftMoves, topMoves } = this.movingEdges(restriction);

        return {
            dx: dox ? clampEdge(leftMoves ? box.left : box.right, area.left, area.right, dx) : dx,
            dy: doy ? clampEdge(topMoves ? box.top : box.bottom, area.top, area.bottom, dy) : dy,
            clamped: true
        };
    }

    /** @internal */
    private clampPoint({ dx, dy }: { dx: number; dy: number }) {
        const { restriction } = this.storage;

        if (!restriction || !restriction.point) return { dx, dy };

        const { point, area } = restriction;

        return {
            dx: clampEdge(point.x, area.left, area.right, dx),
            dy: clampEdge(point.y, area.top, area.bottom, dy)
        };
    }

    /** @internal */
    private alignPoint(dx: number, dy: number) {
        const {
            storage: {
                guides,
                dox,
                doy
            },
            options: {
                proportions
            }
        } = this;

        if (!guides || !guides.point || proportions) return { dx, dy };

        const { x, y } = guides.point;

        const alignment = alignEdges(
            guides,
            { x, y },
            (nextDx, nextDy) => ({
                left: x + nextDx,
                right: x + nextDx,
                top: y + nextDy,
                bottom: y + nextDy
            }),
            dx,
            dy,
            { x: dox, y: doy }
        );

        this.drawGuides(alignment.lines);

        return alignment;
    }

    /** @internal */
    protected resolveHandle(target: Element) {
        const key = target && target.getAttribute && target.getAttribute('data-sjx-handle');
        const handle = key ? this.storage.handles[key] : null;

        return handle || target;
    }

    /** @internal */
    protected isHandleEnabled(key: string) {
        const { handles } = this.options;

        return !handles || (handles as string[]).includes(key);
    }

    /** @internal */
    protected restrictHandler(element: Element | M, matrix?: M | null): RestrictPoint {
        let restrictX: number | null = null,
            restrictY: number | null = null;

        const elBox = this.getBoundingRect(element, matrix);

        const containerBBox = this.getRestrictedBBox();

        const [
            [minX, maxX],
            [minY, maxY]
        ] = getMinMaxOfArray(containerBBox);

        for (let i = 0, len = elBox.length; i < len; i++) {
            const [x, y] = elBox[i];

            if (x < minX || x > maxX) {
                restrictX = x;
            }
            if (y < minY || y > maxY) {
                restrictY = y;
            }
        }

        return {
            x: restrictX,
            y: restrictY
        };
    }

    /** @internal */
    protected destroy() {
        const {
            elements,
            storage: {
                controls,
                wrapper
            } = {} as S
        } = this;

        [...elements, controls].map(target => (
            helper(target)
                .off(E_MOUSEDOWN, this.onMouseDown)
                .off(E_TOUCHSTART, this.onTouchStart)
        ));

        wrapper.parentNode!.removeChild(wrapper);
    }

    /** @internal */
    private updateStorage() {
        const {
            storage,
            storage: {
                transformOrigin: prevTransformOrigin,
                transform: {
                    controlsMatrix: prevControlsMatrix
                } = {},
                cached: {
                    transformOrigin = prevTransformOrigin,
                    controlsMatrix = prevControlsMatrix
                } = {}
            }
        } = this;

        this.storage = {
            ...storage,
            doResize: false,
            doDrag: false,
            doRotate: false,
            doSetCenter: false,
            doDraw: false,
            onExecution: false,
            cursor: null,
            transformOrigin,
            controlsMatrix,
            cached: {}
        };
    }

    notifyMove({ dx, dy }: Delta) {
        this.elements.map((element) => super.drag({ element, dx, dy }));
        this.processControlsMove({ dx, dy });
    }

    notifyRotate({ radians, ...rest }: { radians: number; [key: string]: unknown }) {
        const {
            elements,
            options: {
                snap: { angle }
            } = {} as TransformOptions
        } = this;

        elements.map((element) => (
            this.rotate({
                element,
                radians: snapToGrid(radians, angle) as number,
                ...rest
            })
        ));

        this.processControlsRotate({ radians });
    }

    notifyResize({ dx, dy, revX, revY, dox, doy }: NotifyResizeArgs) {
        const {
            elements,
            storage: {
                data
            },
            options: {
                isGrouped
            }
        } = this;

        elements.map((element) => {
            const {
                transform: {
                    ctm
                }
            } = data.get(element)!;

            const { x, y } = !isGrouped
                ? this.pointToTransform(
                    {
                        x: dx,
                        y: dy,
                        matrix: ctm
                    }
                )
                : { x: dx, y: dy };

            this.resize({
                element,
                dx: dox ? (revX ? -x : x) : 0,
                dy: doy ? (revY ? -y : y) : 0
            });
        });

        this.processControlsResize({ dx, dy });
    }

    notifyApply({ clientX, clientY, actionName, triggerEvent }: NotifyActionArgs) {
        this.proxyMethods.onDrop.call(this, { clientX, clientY });
        if (triggerEvent) {
            this.elements.map((element) => this.applyTransformToElement(element, actionName));
            super.emitEvent(`${actionName}End`, { clientX, clientY });
        }
    }

    notifyGetState({ clientX, clientY, actionName, triggerEvent, ...rest }: NotifyGetStateArgs) {
        if (triggerEvent) {
            const {
                elements,
                storage: {
                    data
                }
            } = this;

            elements.map(element => {
                const nextData = this.getElementState(element, rest);

                data.set(element, {
                    ...data.get(element),
                    ...nextData
                } as ElementData<M>);
            });

            const recalc = this.getCommonState();

            this.storage = {
                ...this.storage,
                ...recalc
            };

            super.emitEvent(`${actionName}Start`, { clientX, clientY });
        }
    }

    subscribe({ resize, move, rotate }: MimicOptions) {
        const { observable: ob } = this;

        if (move || resize || rotate) {
            ob.subscribe(ON_GETSTATE, this)
                .subscribe(ON_APPLY, this);
        }

        if (move) {
            ob.subscribe(ON_MOVE, this);
        }
        if (resize) {
            ob.subscribe(ON_RESIZE, this);
        }
        if (rotate) {
            ob.subscribe(ON_ROTATE, this);
        }
    }

    unsubscribe() {
        const { observable: ob } = this;
        NOTIFIER_EVENTS.map(eventName => ob.unsubscribe(eventName, this));
    }

    disable() {
        const {
            storage,
            proxyMethods,
            elements
        } = this;

        if (isUndef(storage)) return;

        // unexpected case
        if (storage.onExecution) {
            helper(document)
                .off(E_MOUSEMOVE, this.onMouseMove)
                .off(E_MOUSEUP, this.onMouseUp)
                .off(E_TOUCHMOVE, this.onTouchMove)
                .off(E_TOUCHEND, this.onTouchEnd);
        }

        elements.map((element) => removeClass(element, `${LIB_CLASS_PREFIX}drag`));

        this.unsubscribe();
        this.destroy();

        proxyMethods.onDestroy.call(this, elements);
        delete (this as { storage?: S }).storage;
    }

    exeDrag({ dx, dy }: ExeDragParams) {
        const {
            elements,
            options: {
                draggable
            },
            storage,
            storage: {
                data
            }
        } = this;
        if (!draggable) return;

        const commonState = this.getCommonState();

        elements.map(element => {
            const nextData = this.getElementState(element, {
                revX: false,
                revY: false,
                doW: false,
                doH: false
            });

            data.set(element, {
                ...data.get(element),
                ...nextData
            } as ElementData<M>);
        });

        this.storage = {
            ...storage,
            ...commonState
        };

        const restriction = this.options.restrict ? this.prepareRestrict() : null;
        const delta = restriction ? clampMove(restriction, dx, dy) : { dx, dy };

        elements.map((element) => {
            super.drag({ element, ...delta });
            this.applyTransformToElement(element, E_DRAG);
        });

        this.processControlsMove(delta);
    }

    exeResize({
        dx,
        dy,
        revX = false,
        revY = false,
        doW = false,
        doH = false
    }: ExeResizeParams) {
        const {
            elements,
            options: {
                resizable
            },
            storage,
            storage: {
                data
            }
        } = this;
        if (!resizable) return;

        const commonState = this.getCommonState();

        elements.map(element => {
            const nextData = this.getElementState(element, {
                revX,
                revY,
                doW,
                doH
            });

            data.set(element, {
                ...data.get(element),
                ...nextData
            } as ElementData<M>);
        });

        this.storage = {
            ...storage,
            ...commonState
        };

        elements.map((element) => {
            this.resize({ element, dx, dy });
            this.applyTransformToElement(element, E_RESIZE);
        });

        this.processControlsMove({ dx, dy });
    }

    exeRotate({ delta }: ExeRotateParams) {
        const {
            elements,
            options: {
                rotatable
            },
            storage,
            storage: {
                data
            }
        } = this;
        if (!rotatable) return;

        const commonState = this.getCommonState();

        elements.map(element => {
            const nextData = this.getElementState(element, {
                revX: false,
                revY: false,
                doW: false,
                doH: false
            });

            data.set(element, {
                ...data.get(element),
                ...nextData
            } as ElementData<M>);
        });

        this.storage = {
            ...storage,
            ...commonState
        };

        elements.map(element => {
            this.rotate({ element, radians: delta });
            this.applyTransformToElement(element, E_ROTATE);
        });

        this.processControlsRotate({ radians: delta });
    }

    resetCenterPoint() {
        warn('"resetCenterPoint" method is replaced by "resetTransformOrigin" and would be removed soon');
        this.setTransformOrigin({ dx: 0, dy: 0 }, false);
    }

    resetTransformOrigin() {
        this.setTransformOrigin({ dx: 0, dy: 0 }, false);
    }

    get controls(): S['wrapper'] {
        return this.storage.wrapper;
    }

}