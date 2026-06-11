import {
    DragOptions,
    CloneOptions,
    Dimensions,
    BoundingRect,
    Matrix4x4,
    TransformStorage,
    TransformEventName,
    TransformEventMap,
    CloneEventName,
    DragEventArgs,
    ExeDragParams,
    ExeResizeParams,
    ExeRotateParams,
    TransformOriginParams,
    AlignmentDirection
} from './options';

// Re-export all types from options
export * from './options';

/**
 * Target type for subjx function - accepts CSS selector, single element, or array of elements
 */
export type Target = string | Element | Element[];

/**
 * Helper class for DOM element manipulation
 */
declare class Helper {
    constructor(target: Target);

    /**
     * Get element at specified index
     */
    [index: number]: Element | undefined;

    /**
     * Number of matched elements
     */
    length: number;
}

/**
 * Observer interface for synchronized transformations
 */
interface Observer {
    /**
     * Called when move notification is received
     */
    notifyMove(data: { dx: number; dy: number }): void;

    /**
     * Called when resize notification is received
     */
    notifyResize(data: {
        dx: number;
        dy: number;
        revX: boolean;
        revY: boolean;
        dox: boolean;
        doy: boolean;
    }): void;

    /**
     * Called when rotate notification is received
     */
    notifyRotate(data: { radians: number }): void;

    /**
     * Called when apply notification is received
     */
    notifyApply(data: {
        clientX: number;
        clientY: number;
        actionName: string;
        triggerEvent: boolean;
    }): void;

    /**
     * Called when getState notification is received
     */
    notifyGetState(data: {
        clientX: number;
        clientY: number;
        actionName: string;
        triggerEvent: boolean;
        factor?: number;
        revX?: boolean;
        revY?: boolean;
        doW?: boolean;
        doH?: boolean;
    }): void;
}

/**
 * Observable class for managing synchronized transformations between multiple Draggable instances
 */
declare class Observable {
    constructor();

    /**
     * Internal observers storage
     */
    observers: Record<string, Observer[]>;

    /**
     * Subscribe an observer to an event
     * @param eventName - Event name to subscribe to
     * @param sub - Observer instance (Draggable/DraggableSVG)
     * @returns this for chaining
     */
    subscribe(eventName: string, sub: Observer): this;

    /**
     * Unsubscribe an observer from an event
     * @param eventName - Event name to unsubscribe from
     * @param sub - Observer instance to remove
     * @returns this for chaining
     */
    unsubscribe(eventName: string, sub: Observer): this;

    /**
     * Notify all observers except the source about an event
     * @param eventName - Event name
     * @param source - Source observer (will be excluded from notification)
     * @param data - Event data
     */
    notify(eventName: string, source: Observer, data: any): void;
}

/**
 * Base class for all subject models with event handling
 */
declare class SubjectModel {
    /**
     * Array of controlled elements
     */
    elements: Element[];

    /**
     * Internal storage for transformation state
     */
    storage: any;

    /**
     * Subscribe to events
     * @param name - Event name
     * @param cb - Callback function
     * @returns this for chaining
     */
    on(name: string, cb: (eventArgs: any) => void): this;

    /**
     * Unsubscribe from events
     * @param name - Event name
     * @param cb - Callback function to remove
     * @returns this for chaining
     */
    off(name: string, cb: (eventArgs: any) => void): this;
}

/**
 * Base class for transformable elements (Draggable and DraggableSVG)
 */
declare class Transformable extends SubjectModel {
    /**
     * Observable instance for synchronized transformations
     */
    observable: Observable;

    /**
     * Internal storage with transformation state and controls
     */
    storage: TransformStorage;

    /**
     * Subscribe to transformation events with type-safe callbacks
     * @param name - Event name
     * @param cb - Callback function
     * @returns this for chaining
     */
    on<K extends TransformEventName>(
        name: K,
        cb: (eventArgs: TransformEventMap[K]) => void
    ): this;

    /**
     * Unsubscribe from transformation events
     * @param name - Event name
     * @param cb - Callback function to remove
     * @returns this for chaining
     */
    off<K extends TransformEventName>(
        name: K,
        cb: (eventArgs: TransformEventMap[K]) => void
    ): this;

    /**
     * Initialize transformation with options
     * @param options - Transformation options
     */
    enable(options?: DragOptions): void;

    /**
     * Disable and cleanup transformation controls
     */
    disable(): void;

    /**
     * Execute drag programmatically
     * @param params - Drag parameters with dx and dy deltas
     */
    exeDrag(params: ExeDragParams): void;

    /**
     * Execute resize programmatically
     * @param params - Resize parameters
     */
    exeResize(params: ExeResizeParams): void;

    /**
     * Execute rotation programmatically
     * @param params - Rotation parameters with delta in radians
     */
    exeRotate(params: ExeRotateParams): void;

    /**
     * Set custom transform origin (rotation center)
     * @param params - Origin position (absolute x,y or relative dx,dy from center)
     * @param pin - If true, origin stays fixed during transformations
     */
    setTransformOrigin(params?: TransformOriginParams, pin?: boolean): void;

    /**
     * Reset transform origin to element center
     */
    resetTransformOrigin(): void;

    /**
     * @deprecated Use setTransformOrigin instead
     */
    setCenterPoint(params?: TransformOriginParams, pin?: boolean): void;

    /**
     * @deprecated Use resetTransformOrigin instead
     */
    resetCenterPoint(): void;

    /**
     * Update control positions after external changes (e.g., viewBox or scale changes)
     */
    fitControlsToSize(): void;

    /**
     * Align element within its container
     * @param direction - Alignment direction (l, r, t, b, h, v, or combinations)
     * @param target - Optional element whose box is used as the alignment frame,
     *   instead of `restrict`/`container`; does not constrain dragging
     */
    applyAlignment(direction: AlignmentDirection, target?: SVGGraphicsElement | HTMLElement): void;

    /**
     * Get current element dimensions and rotation
     * @returns Object with x, y, width, height, and rotation
     */
    getDimensions(): Dimensions;

    /**
     * Get bounding rectangle vertices in container coordinates
     * @param transformMatrix - Optional custom transformation matrix
     * @returns Array of vertex points [x, y, z, w]
     */
    getBoundingRect(transformMatrix?: Matrix4x4 | null): BoundingRect;

    /**
     * Get the controls wrapper element
     */
    get controls(): HTMLElement;
}

/**
 * Draggable class for HTML elements
 * Provides drag, resize, rotate functionality for regular DOM elements
 */
declare class Draggable extends Transformable {
    constructor(elements: Element[], options?: DragOptions, observable?: Observable);
}

/**
 * DraggableSVG class for SVG elements
 * Provides drag, resize, rotate functionality for SVG elements
 */
declare class DraggableSVG extends Transformable {
    constructor(elements: SVGElement[], options?: DragOptions, observable?: Observable);
}

/**
 * Cloneable class for creating draggable clones of elements
 */
declare class Cloneable extends SubjectModel {
    constructor(elements: Element[], options?: CloneOptions);

    /**
     * Initialize cloning with options
     * @param options - Clone options
     */
    enable(options?: CloneOptions): void;

    /**
     * Disable cloning functionality
     */
    disable(): void;

    /**
     * Subscribe to clone events
     * @param name - Event name ('dragStart' | 'drag' | 'dragEnd')
     * @param cb - Callback function
     * @returns this for chaining
     */
    on(name: CloneEventName, cb: (eventArgs: DragEventArgs) => void): this;

    /**
     * Unsubscribe from clone events
     * @param name - Event name
     * @param cb - Callback function to remove
     * @returns this for chaining
     */
    off(name: CloneEventName, cb: (eventArgs: DragEventArgs) => void): this;
}

/**
 * Main Subjx class extending Helper with transformation methods
 */
declare class Subjx extends Helper {
    /**
     * Enable drag/resize/rotate transformation on matched elements
     * @param options - Transformation options
     * @param observable - Optional Observable for synchronized transformations
     * @returns Draggable instance for HTML elements or DraggableSVG for SVG elements
     */
    drag(options?: DragOptions, observable?: Observable): Draggable | DraggableSVG;

    /**
     * Enable cloning functionality on matched elements
     * @param options - Clone options
     * @returns Cloneable instance
     */
    clone(options?: CloneOptions): Cloneable;
}

/**
 * Create an Observable instance for synchronizing multiple Draggable instances
 * @returns New Observable instance
 */
export function createObservable(): Observable;

/**
 * Factory function for handling target elements
 * @param target - CSS selector string, single Element, or array of Elements
 * @returns Subjx instance with drag and clone methods
 *
 * @example
 * // Using CSS selector
 * const draggable = subjx('.my-element').drag();
 *
 * @example
 * // Using DOM element
 * const element = document.getElementById('my-element');
 * const draggable = subjx(element).drag({ rotatable: true });
 *
 * @example
 * // Using multiple elements with synchronized transformations
 * const observable = subjx.createObservable();
 * const drag1 = subjx('#element1').drag({ each: { move: true } }, observable);
 * const drag2 = subjx('#element2').drag({ each: { move: true } }, observable);
 */
declare function subjx(target: Target): Subjx;

declare namespace subjx {
    /**
     * Create an Observable instance for synchronizing multiple Draggable instances
     * @returns New Observable instance
     */
    export function createObservable(): Observable;
}

export default subjx;

// Export classes for direct usage
export {
    Subjx,
    Helper,
    SubjectModel,
    Transformable,
    Draggable,
    DraggableSVG,
    Cloneable,
    Observable
};
