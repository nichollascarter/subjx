import { helper } from '../../Helper';
import SubjectModel from '../../SubjectModel';
import type { PointerInput, MoveArgs } from '../../SubjectModel';
import type Observable from '../../observable/Observable';
import type {
    Observer,
    NotifyRotateArgs,
    NotifyResizeArgs,
    NotifyActionArgs,
    NotifyGetStateArgs
} from '../../observable/Observable';
import { snapToGrid } from '../common';
import type {
    DragOptions,
    MimicOptions,
    ExeDragParams,
    ExeResizeParams,
    ExeRotateParams,
    TransformEventMap,
    TransformOriginParams
} from '../../options';
import { align } from '../guides';
import type { Alignment, GuideState, GuideLine } from '../guides';
import { clampMove, overflowPoint } from '../restrict';
import type { Restriction } from '../restrict';
import { LIB_CLASS_PREFIX } from '../../consts';
import {
    requestAnimFrame,
    cancelAnimFrame,
    isDef,
    isUndef
} from '../../util/util';
import { addClass, removeClass } from '../../util/css-util';
import type {
    RestrictPoint,
    Delta,
    ResizeFlags,
    ElementData,
    TransformStorage,
    TransformOptions,
    TransformProxyMethods,
    ActiveSession,
    Point
} from './types';
import {
    NOTIFIER_EVENTS,
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE,
    EMITTER_EVENTS,
    E_DRAG,
    E_RESIZE,
    E_ROTATE,
    E_MOUSEOVER
} from './consts';
import {
    RUNTIME_OPTIONS,
    ORIGIN_OPTIONS,
    isSameOption,
    normalizeOptions,
    proxyMethodsOf
} from './options';
import { adoptControls, readClasses } from './dom';
import type { ControlsClasses } from './dom';
import { RESIZE_KEYS, ROTATE_CURSOR, handleCursor, resizeCursor } from './cursors';
import { handleFlags, handleKey, resizeAxes } from './handles';
import { actionOf, isMimicked, startEventOf, endEventOf } from './actions';
import { alignResize, alignPoint, clampResize, clampPoint } from './alignment';

const { keys, values } = Object;

const NO_FLAGS: ResizeFlags = {
    revX: false,
    revY: false,
    doW: false,
    doH: false
};

interface ResizeAxes {
    revX?: boolean;
    revY?: boolean;
    dox?: boolean;
    doy?: boolean;
}

const overflows = ({ x, y }: RestrictPoint) => x !== null || y !== null;

export default abstract class Transformable<
    M = unknown,
    S extends TransformStorage<M> = TransformStorage<M>
> extends SubjectModel<S, TransformProxyMethods, TransformEventMap> {

    /** Internal state. Its shape is not part of the public API and may change in any minor release. Prefer `handles`, `controls`, `getBoundingRect()` and `getDimensions()`. */
    storage!: S;
    /** @internal */
    protected proxyMethods!: TransformProxyMethods;
    options!: TransformOptions;
    private readonly observable: Observable;
    private rawOptions!: DragOptions;
    private pendingOptions?: DragOptions | null;
    private initClasses?: ControlsClasses;

    private readonly observer: Observer = {
        notifyMove: data => this.notifyMove(data),
        notifyRotate: data => this.notifyRotate(data),
        notifyResize: data => this.notifyResize(data),
        notifyApply: data => this.notifyApply(data),
        notifyGetState: data => this.notifyGetState(data)
    };

    private readonly onControlsOver = (e: Event) => {
        const { storage } = this;

        if (isUndef(storage) || storage.onExecution) return;

        const target = e.target as Element;
        const handle = this.resolveHandle(target);
        const key = handleKey(storage.handles, handle);

        if (!key || !RESIZE_KEYS.includes(key)) return;

        const cursor = this.options.resizable ? resizeCursor(storage.handles, key) || '' : '';

        [handle, target].forEach((node) => {
            (node as HTMLElement).style.cursor = cursor;
        });
    };

    constructor(elements: Element[], options: DragOptions | undefined, observable: Observable) {
        super(elements);
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
    protected pointToGroup(point: Point): Point {
        return point;
    }

    /** @internal */
    protected abstract processRotate(element: Element, radians: number): unknown;

    /** @internal */
    protected abstract processResize(element: Element, delta: Delta): object;

    /** @internal */
    protected abstract processMoveRestrict(element: Element, delta: Delta): RestrictPoint;

    /** @internal */
    protected abstract processResizeRestrict(element: Element, delta: Delta): RestrictPoint;

    /** @internal */
    protected processPointMove?(element: Element, point: string, delta: Delta): object | null;

    /** @internal */
    protected prepareGuides(): GuideState | null {
        return null;
    }

    /** @internal */
    protected drawGuides(_lines: GuideLine[]): void { }

    /** @internal */
    protected prepareRestrict(): Restriction | null {
        return null;
    }

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
    protected processActions(_actionName: string): void { }

    /** @internal */
    protected abstract getCommonState(): Partial<S> & { center: { x: number; y: number }; transform: S['transform'] };

    /** @internal */
    protected abstract getElementState(element: Element, flags: Partial<ResizeFlags>): Partial<ElementData<M>>;

    /** @internal */
    protected abstract getRestrictedBBox(): number[][];

    abstract getBoundingRect(elementOrMatrix?: Element | M | null, matrix?: M | null): number[][];

    abstract setTransformOrigin(params?: TransformOriginParams, pin?: boolean): void;
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

        this.rawOptions = options;

        elements.forEach(element => addClass(element, `${LIB_CLASS_PREFIX}drag`));

        this.options = normalizeOptions(options, elements);
        this.proxyMethods = proxyMethodsOf(options);

        this.subscribe(this.options.each);
    }

    /** @internal */
    protected animate() {
        const { storage, options } = this;

        if (isUndef(storage)) return;

        storage.frame = requestAnimFrame(this.animate);

        if (!storage.doDraw) return;
        storage.doDraw = false;

        const { doDrag, doResize, doRotate, doSetCenter, point } = storage;
        const { draggable, resizable, rotatable } = options;

        if (doResize && resizable) {
            if (point) {
                this.drawPoint(point);
            } else {
                this.drawResize();
            }
        }

        if (doDrag && draggable) this.drawDrag();
        if (doRotate && rotatable) this.drawRotate();
        if (doSetCenter && rotatable) this.drawCenter();
    }

    /** @internal */
    private get session() {
        return this.storage as S & ActiveSession;
    }

    /** @internal */
    private pointerDelta(): Delta {
        const { session: { clientX, clientY, relativeX, relativeY }, options: { snap } } = this;

        return {
            dx: snapToGrid(clientX - relativeX, snap.x) as number,
            dy: snapToGrid(clientY - relativeY, snap.y) as number
        };
    }

    /** @internal */
    private pointerArgs() {
        const { clientX, clientY, mouseEvent } = this.session;

        return { clientX, clientY, mouseEvent };
    }

    /** @internal */
    private cachedDist(): Delta {
        const { dx = 0, dy = 0 } = this.storage.cached?.dist ?? {};

        return { dx, dy };
    }

    /** @internal */
    private cacheDist(dist: Delta) {
        this.storage.cached = {
            ...this.storage.cached,
            dist
        };
    }

    /** @internal */
    private guide(alignment: Alignment | null, delta: Delta): Delta {
        if (!alignment) return delta;

        this.drawGuides(alignment.lines);

        return alignment;
    }

    /** @internal */
    private localDelta(element: Element, { dx, dy }: Delta, { revX, revY, dox, doy }: ResizeAxes): Delta {
        const { x, y } = this.options.isGrouped
            ? this.pointToGroup({ x: dx, y: dy })
            : this.pointToTransform({ x: dx, y: dy, matrix: this.storage.data.get(element)!.transform.ctm });

        return {
            dx: dox ? (revX ? -x : x) : 0,
            dy: doy ? (revY ? -y : y) : 0
        };
    }

    /** @internal */
    private drawPoint(point: string) {
        const { storage, session, options: { proportions } } = this;
        const pointer = this.pointerDelta();

        const { dx, dy } = clampPoint(
            storage.restriction,
            this.guide(alignPoint(storage.guides, session, proportions, pointer), pointer)
        );

        const result = this.processPointMove?.(this.elements[0], point, { dx, dy });

        if (!result) return;

        const finalArgs = {
            ...result,
            dx,
            dy,
            ...this.pointerArgs()
        };

        this.proxyMethods.onResize.call(this, finalArgs);
        super.emitEvent(E_RESIZE, finalArgs);
    }

    /** @internal */
    private drawResize() {
        const {
            elements,
            observable,
            observer,
            storage,
            session,
            session: { revX, revY, dox, doy },
            options: { restrict, proportions, flip, each }
        } = this;

        const pointer = this.pointerDelta();
        const aligned = this.guide(alignResize(storage.guides, session, proportions, pointer, flip), pointer);
        const { dx, dy, clamped } = clampResize(storage.restriction, session, aligned);
        const dist = { dx, dy };

        const isBounding = Boolean(restrict) && !(clamped && !proportions) && elements
            .map(element => this.processResizeRestrict(element, this.localDelta(element, dist, session)))
            .some(overflows);

        const next = isBounding ? this.cachedDist() : dist;

        const nextArgs = {
            ...next,
            ...this.pointerArgs(),
            revX,
            revY,
            dox,
            doy
        };

        elements.forEach(element => this.resize({
            ...nextArgs,
            element,
            ...this.localDelta(element, next, session)
        }));

        this.cacheDist(next);
        this.processControlsResize(next);

        if (each.resize) observable.notify(ON_RESIZE, observer, nextArgs);
    }

    /** @internal */
    private drawDrag() {
        const {
            elements,
            observable,
            observer,
            storage: { guides, restriction },
            session: { dox, doy },
            options: { restrict, each }
        } = this;

        const pointer = this.pointerDelta();
        const grid = {
            dx: dox ? pointer.dx : 0,
            dy: doy ? pointer.dy : 0
        };

        const aligned = this.guide(guides ? align(guides, grid.dx, grid.dy, { x: dox, y: doy }) : null, grid);
        const delta = restriction ? clampMove(restriction, aligned.dx, aligned.dy) : { dx: aligned.dx, dy: aligned.dy };

        const args = {
            ...delta,
            ...this.pointerArgs()
        };

        const overflow = restrict && !restriction
            ? elements.map(element => this.processMoveRestrict(element, args))
            : [];

        const prev = this.cachedDist();
        const next = {
            dx: overflow.some(({ x }) => x !== null) ? prev.dx : delta.dx,
            dy: overflow.some(({ y }) => y !== null) ? prev.dy : delta.dy
        };

        const nextArgs = {
            ...args,
            ...next
        };

        this.cacheDist(next);

        elements.forEach(element => super.drag({ element, ...nextArgs }));

        this.processControlsMove(next);

        if (each.move) observable.notify(ON_MOVE, observer, nextArgs);
    }

    /** @internal */
    private drawRotate() {
        const {
            elements,
            observable,
            observer,
            session: { clientX, clientY, pressang, center },
            options: { snap, restrict, each }
        } = this;

        const angle = Math.atan2(clientY - center.y, clientX - center.x);
        const radians = snapToGrid(angle - pressang, snap.angle) as number;

        if (restrict && elements.some(element => overflows(this.processRotateRestrict(element, radians)))) return;

        const args = this.pointerArgs();

        elements.forEach(element => this.rotate({ element, radians, ...args }));

        this.processControlsRotate({ radians });

        if (each.rotate) observable.notify(ON_ROTATE, observer, { radians, ...args });
    }

    /** @internal */
    private drawCenter() {
        const { clientX, clientY, bx, by } = this.session;
        const { x, y } = this.pointToControls({ x: clientX, y: clientY });

        this.moveCenterHandle(x - bx, y - by);
    }

    /** @internal */
    protected start(e: PointerInput) {
        const { clientX, clientY } = e;
        const target = this.resolveHandle(e.target as Element);
        const {
            elements,
            observable,
            options: { axis, each, guides, restrict },
            storage,
            storage: { handles }
        } = this;

        const isTarget = values(handles).some((hdl) => helper(target).is(hdl)) ||
            elements.some(element => element.contains(target));

        storage.isTarget = isTarget;

        if (!isTarget) return;

        storage.handleCursor = handleCursor(handles, handleKey(handles, target));

        const computed = this.compute(e, elements);

        keys(computed).forEach(prop => (storage as Record<string, unknown>)[prop] = (computed as Record<string, unknown>)[prop]);

        const {
            onRightEdge,
            onBottomEdge,
            onTopEdge,
            onLeftEdge,
            handle,
            revX,
            revY,
            doW,
            doH,
            point
        } = computed;

        const { rotator, center, radius } = handles;

        if (isDef(radius)) removeClass(radius, `${LIB_CLASS_PREFIX}hidden`);

        const doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge || Boolean(point);
        const doRotate = handle.is(rotator);
        const doSetCenter = isDef(center) ? handle.is(center) : false;
        const doDrag = !(doRotate || doResize || doSetCenter);
        const flags = { doResize, doDrag, doRotate, doSetCenter };

        const axes = resizeAxes(handle, handles);
        const prepared = doDrag || doResize;

        this.storage = {
            ...storage,
            ...flags,
            mouseEvent: e,
            clientX,
            clientY,
            onExecution: true,
            guides: prepared && guides ? this.prepareGuides() : null,
            restriction: prepared && restrict ? this.prepareRestrict() : null,
            cursor: null,
            dox: /x/.test(axis) && (!doResize || Boolean(point) || axes.x),
            doy: /y/.test(axis) && (!doResize || Boolean(point) || axes.y)
        };

        if (!doDrag) this.setActiveHandle(handle[0]);

        const actionName = actionOf(flags);
        const startEvent = startEventOf(actionName);

        if (startEvent) super.emitEvent(startEvent, { clientX, clientY });

        observable.notify(
            ON_GETSTATE,
            this.observer,
            {
                clientX,
                clientY,
                actionName,
                triggerEvent: isMimicked(flags, each),
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

        if (!isUndef(storage.cursor)) return;

        const { doRotate, doDrag, doResize, handleCursor: pressedCursor } = storage;
        const { cursorMove, cursorResize, cursorRotate } = options;

        let cursor: string | null = null;

        if (doDrag) {
            cursor = cursorMove;
        } else if (doRotate) {
            cursor = cursorRotate ?? ROTATE_CURSOR;
        } else if (doResize) {
            cursor = cursorResize ?? pressedCursor ?? 'auto';
        }

        helper(document.body).css({ cursor });
        (storage.wrapper as HTMLElement).style.cursor = cursor || '';
    }

    /** @internal */
    protected end({ clientX, clientY }: PointerInput) {
        const {
            elements,
            options: { each },
            observable,
            storage,
            storage: {
                frame,
                handles: { radius },
                isTarget
            },
            proxyMethods
        } = this;

        if (!isTarget) return;

        const actionName = actionOf(storage);
        const triggerEvent = isMimicked(storage, each);

        elements.forEach(element => this.applyTransformToElement(element, actionName));

        this.processActions(actionName);
        this.updateStorage();

        const eventArgs = { clientX, clientY };

        proxyMethods.onDrop.call(this, eventArgs);

        const endEvent = endEventOf(actionName);

        if (endEvent) super.emitEvent(endEvent, eventArgs);

        observable.notify(
            ON_APPLY,
            this.observer,
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
        (this.storage.wrapper as HTMLElement).style.cursor = '';

        if (isDef(radius)) addClass(radius, `${LIB_CLASS_PREFIX}hidden`);

        const { pendingOptions } = this;

        if (pendingOptions) {
            this.pendingOptions = null;
            this.applyOptions(pendingOptions);
        }
    }

    /** @internal */
    protected afterInit() {
        this.initClasses = readClasses(this.storage);
        helper(this.storage.controls).on(E_MOUSEOVER, this.onControlsOver);
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
        } = handleFlags(handle, handles);

        const commonState = this.getCommonState();

        const { x, y } = this.cursorPoint(e);
        const { x: bx, y: by } = this.pointToControls({ x, y }, commonState.transform);

        elements.forEach(element => {
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
            handle: values(handles).some(hdl => handle.is(hdl))
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
        return overflowPoint(this.getBoundingRect(element, matrix), this.getRestrictedBBox());
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

        this.unbindPress([...elements, controls]);

        helper(controls).off(E_MOUSEOVER, this.onControlsOver);

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

    /** @internal */
    private prepareState(flags: ResizeFlags = NO_FLAGS) {
        const { elements, storage, storage: { data } } = this;

        const commonState = this.getCommonState();

        elements.forEach(element => {
            data.set(element, {
                ...data.get(element),
                ...this.getElementState(element, flags)
            } as ElementData<M>);
        });

        this.storage = {
            ...storage,
            ...commonState
        };
    }

    private notifyMove({ dx, dy }: Delta) {
        this.elements.forEach((element) => super.drag({ element, dx, dy }));
        this.processControlsMove({ dx, dy });
    }

    private notifyRotate({ radians, ...rest }: NotifyRotateArgs) {
        const {
            elements,
            options: {
                snap: { angle }
            } = {} as TransformOptions
        } = this;

        elements.forEach((element) => (
            this.rotate({
                element,
                radians: snapToGrid(radians, angle) as number,
                ...rest
            })
        ));

        this.processControlsRotate({ radians });
    }

    private notifyResize({ dx, dy, revX, revY, dox, doy }: NotifyResizeArgs) {
        this.elements.forEach(element => this.resize({
            element,
            ...this.localDelta(element, { dx, dy }, { revX, revY, dox, doy })
        }));

        this.processControlsResize({ dx, dy });
    }

    private notifyApply({ clientX, clientY, actionName, triggerEvent }: NotifyActionArgs) {
        this.proxyMethods.onDrop.call(this, { clientX, clientY });
        if (triggerEvent) {
            this.elements.forEach((element) => this.applyTransformToElement(element, actionName));
            super.emitEvent(`${actionName}End`, { clientX, clientY });
        }
    }

    private notifyGetState({ clientX, clientY, actionName, triggerEvent, ...rest }: NotifyGetStateArgs) {
        if (!triggerEvent) return;

        const { elements, storage: { data } } = this;

        elements.forEach(element => {
            data.set(element, {
                ...data.get(element),
                ...this.getElementState(element, rest)
            } as ElementData<M>);
        });

        this.storage = {
            ...this.storage,
            ...this.getCommonState()
        };

        super.emitEvent(`${actionName}Start`, { clientX, clientY });
    }

    private subscribe({ resize, move, rotate }: MimicOptions) {
        const { observable: ob, observer } = this;

        if (move || resize || rotate) {
            ob.subscribe(ON_GETSTATE, observer)
                .subscribe(ON_APPLY, observer);
        }

        if (move) {
            ob.subscribe(ON_MOVE, observer);
        }
        if (resize) {
            ob.subscribe(ON_RESIZE, observer);
        }
        if (rotate) {
            ob.subscribe(ON_ROTATE, observer);
        }
    }

    private unsubscribe() {
        const { observable: ob, observer } = this;
        NOTIFIER_EVENTS.forEach(eventName => ob.unsubscribe(eventName, observer));
    }

    disable() {
        const {
            storage,
            proxyMethods,
            elements
        } = this;

        if (isUndef(storage)) return;

        this.releaseInput();

        elements.forEach((element) => removeClass(element, `${LIB_CLASS_PREFIX}drag`));

        this.pendingOptions = null;
        this.unsubscribe();
        this.destroy();

        proxyMethods.onDestroy.call(this, elements);
        delete (this as { storage?: S }).storage;
    }

    update(options: DragOptions = {}) {
        const { storage } = this;

        if (isUndef(storage)) return;

        if (!storage.onExecution) {
            this.applyOptions(options);
            return;
        }

        const runtime: DragOptions = {};
        const structural: DragOptions = {};

        (keys(options) as (keyof DragOptions)[]).forEach((key) => {
            const target = RUNTIME_OPTIONS.includes(key) ? runtime : structural;
            (target as Record<string, unknown>)[key] = options[key];
        });

        if (keys(structural).length) {
            this.pendingOptions = { ...this.pendingOptions, ...structural };
        }

        this.applyOptions(runtime);
    }

    /** @internal */
    private applyOptions(options: DragOptions) {
        const { rawOptions, options: prevOptions } = this;

        const changed = (keys(options) as (keyof DragOptions)[])
            .filter(key => !isSameOption(options[key], rawOptions[key]));

        if (!changed.length) return;

        this.unsubscribe();
        this.processOptions({ ...rawOptions, ...options });

        const { options: nextOptions } = this;

        const structural = changed.filter(key => (
            !RUNTIME_OPTIONS.includes(key) &&
            !isSameOption(
                nextOptions[key as keyof TransformOptions],
                prevOptions[key as keyof TransformOptions]
            )
        ));

        if (structural.length) this.rebuildControls(structural);
    }

    /** @internal */
    private rebuildControls(changed: (keyof DragOptions)[]) {
        const {
            elements,
            storage: prev,
            initClasses
        } = this;

        const {
            wrapper,
            controls,
            transformOrigin,
            center
        } = prev;

        const owned = [
            ...values(prev.handles),
            ...values((prev.hitAreas || {}) as Record<string, Element>),
            prev.hitOverlay,
            prev.guidesLayer
        ].filter(isDef) as Element[];

        this.unbindPress([...elements, controls]);

        owned.forEach((node) => {
            if (node.parentNode) node.parentNode.removeChild(node);
        });

        this.init(elements);

        const fresh = this.storage;
        const freshClasses = readClasses(fresh);

        this.unbindPress([fresh.controls]);

        this.bindPress([controls]);

        adoptControls(prev, fresh, initClasses);

        this.storage = {
            ...fresh,
            wrapper,
            controls
        };

        this.initClasses = freshClasses;

        if (center.isShifted && !changed.some(key => ORIGIN_OPTIONS.includes(key))) {
            const [x, y] = Array.isArray(transformOrigin)
                ? transformOrigin
                : [(transformOrigin as Point).x, (transformOrigin as Point).y];

            this.setTransformOrigin({ x, y }, true);
            this.storage.transformOrigin = transformOrigin;
            this.storage.center.isShifted = true;
        }
    }

    exeDrag({ dx, dy }: ExeDragParams) {
        const { elements, options: { draggable, restrict } } = this;

        if (!draggable) return;

        this.prepareState();

        const restriction = restrict ? this.prepareRestrict() : null;
        const delta = restriction ? clampMove(restriction, dx, dy) : { dx, dy };

        elements.forEach((element) => {
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
        const { elements, options: { resizable } } = this;

        if (!resizable) return;

        this.prepareState({ revX, revY, doW, doH });

        elements.forEach((element) => {
            this.resize({ element, dx, dy });
            this.applyTransformToElement(element, E_RESIZE);
        });

        this.processControlsMove({ dx, dy });
    }

    exeRotate({ delta }: ExeRotateParams) {
        const { elements, options: { rotatable } } = this;

        if (!rotatable) return;

        this.prepareState();

        elements.forEach(element => {
            this.rotate({ element, radians: delta });
            this.applyTransformToElement(element, E_ROTATE);
        });

        this.processControlsRotate({ radians: delta });
    }

    resetTransformOrigin() {
        this.setTransformOrigin({ dx: 0, dy: 0 }, false);
    }

    get controls(): S['wrapper'] {
        return this.storage.wrapper;
    }

    get handles(): S['handles'] {
        return this.storage.handles;
    }

}
