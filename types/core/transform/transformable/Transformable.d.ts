import SubjectModel from '../../SubjectModel';
import type Observable from '../../observable/Observable';
import type { DragOptions, ExeDragParams, ExeResizeParams, ExeRotateParams, TransformEventMap, TransformOriginParams } from '../../options';
import type { TransformStorage, TransformOptions, TransformProxyMethods } from './types';
export default abstract class Transformable<M = unknown, S extends TransformStorage<M> = TransformStorage<M>> extends SubjectModel<S, TransformProxyMethods, TransformEventMap> {
    /** Internal state. Its shape is not part of the public API and may change in any minor release. Prefer `handles`, `controls`, `getBoundingRect()` and `getDimensions()`. */
    storage: S;
    options: TransformOptions;
    private readonly observable;
    private rawOptions;
    private pendingOptions?;
    private initClasses?;
    private readonly observer;
    constructor(elements: Element[], options: DragOptions | undefined, observable: Observable);
    abstract getBoundingRect(elementOrMatrix?: Element | M | null, matrix?: M | null): number[][];
    abstract setTransformOrigin(params?: TransformOriginParams, pin?: boolean): void;
    private notifyMove;
    private notifyRotate;
    private notifyResize;
    private notifyApply;
    private notifyGetState;
    private subscribe;
    private unsubscribe;
    disable(): void;
    update(options?: DragOptions): void;
    exeDrag({ dx, dy }: ExeDragParams): void;
    exeResize({ dx, dy, revX, revY, doW, doH }: ExeResizeParams): void;
    exeRotate({ delta }: ExeRotateParams): void;
    resetTransformOrigin(): void;
    get controls(): S['wrapper'];
    get handles(): S['handles'];
}
