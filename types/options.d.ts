// Axis constraint for movement
export type Axis = 'x' | 'y' | 'xy';

// Direction for rotator anchor
export type Direction = 'n' | 's' | 'w' | 'e';

// Alignment direction for applyAlignment method
export type AlignmentDirection = 'l' | 'r' | 't' | 'b' | 'h' | 'v' | 'tl' | 'tr' | 'bl' | 'br' | 'th' | 'bh' | 'lv' | 'rv';

// Handle keys for transform controls
export type HandleKey = 'tl' | 'tc' | 'tr' | 'bl' | 'br' | 'bc' | 'ml' | 'mr' | 'center' | 'rotator';

// Edge keys for transform controls
export type EdgeKey = 'te' | 'be' | 'le' | 're';

// 4x4 transformation matrix
export type Matrix4x4 = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
];

// Point with x and y coordinates
export interface Point {
    x: number;
    y: number;
}

// Vertex point as array [x, y, z, w]
export type Vertex = [number, number, number, number];

// Mimic behavior options for synchronizing multiple instances
export interface MimicOptions {
    /** Synchronize move operations */
    move?: boolean;
    /** Synchronize resize operations */
    resize?: boolean;
    /** Synchronize rotate operations */
    rotate?: boolean;
}

// Snapping configuration
export interface SnapOptions {
    /** Snap step for x-axis in pixels */
    x?: number;
    /** Snap step for y-axis in pixels */
    y?: number;
    /** Snap step for rotation angle in degrees */
    angle?: number;
}

// Bounding box dimensions
export interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
    offset?: {
        left: number;
        top: number;
    };
}

// Dimensions returned by getDimensions()
export interface Dimensions {
    /** X position of top-left corner */
    x: number;
    /** Y position of top-left corner */
    y: number;
    /** Width of the element */
    width: number;
    /** Height of the element */
    height: number;
    /** Current rotation angle in degrees */
    rotation: number;
}

// Bounding rectangle vertices
export type BoundingRect = Vertex[];

// Event arguments for drag callbacks
export interface DragEventArgs {
    /** Current client X coordinate */
    clientX: number;
    /** Current client Y coordinate */
    clientY: number;
    /** Delta X from start position */
    dx: number;
    /** Delta Y from start position */
    dy: number;
    /** Current transformation matrix */
    transform: Matrix4x4;
}

// Event arguments for resize callbacks
export interface ResizeEventArgs {
    /** Current client X coordinate */
    clientX: number;
    /** Current client Y coordinate */
    clientY: number;
    /** Delta X from start position */
    dx: number;
    /** Delta Y from start position */
    dy: number;
    /** Current transformation matrix */
    transform: Matrix4x4;
    /** Current width */
    width: number;
    /** Current height */
    height: number;
}

// Event arguments for rotate callbacks
export interface RotateEventArgs {
    /** Current client X coordinate */
    clientX: number;
    /** Current client Y coordinate */
    clientY: number;
    /** Rotation delta in radians */
    delta: number;
    /** Current transformation matrix */
    transform: Matrix4x4;
}

// Event arguments for drop callbacks
export interface DropEventArgs {
    /** Final client X coordinate */
    clientX: number;
    /** Final client Y coordinate */
    clientY: number;
}

// Event arguments for start events (dragStart, resizeStart, rotateStart)
export interface StartEventArgs {
    /** Client X coordinate at start */
    clientX: number;
    /** Client Y coordinate at start */
    clientY: number;
}

// Event arguments for end events (dragEnd, resizeEnd, rotateEnd)
export interface EndEventArgs {
    /** Client X coordinate at end */
    clientX: number;
    /** Client Y coordinate at end */
    clientY: number;
}

// Callback function types for Draggable
export type OnInitCallback = (this: any, elements: Element[]) => void;
export type OnMoveCallback = (this: any, eventArgs: DragEventArgs) => void;
export type OnResizeCallback = (this: any, eventArgs: ResizeEventArgs) => void;
export type OnRotateCallback = (this: any, eventArgs: RotateEventArgs) => void;
export type OnDropCallback = (this: any, eventArgs: DropEventArgs) => void;
export type OnDestroyCallback = (this: any, elements: Element[]) => void;

// Clone specific callbacks
export type OnCloneDropCallback = (
    this: any,
    event: MouseEvent | TouchEvent,
    elements: Element[],
    clone: Element
) => void;

// Event names for Draggable/DraggableSVG
export type DragEventName = 'dragStart' | 'drag' | 'dragEnd';
export type ResizeEventName = 'resizeStart' | 'resize' | 'resizeEnd';
export type RotateEventName = 'rotateStart' | 'rotate' | 'rotateEnd';
export type SetPointEventName = 'setPointStart' | 'setPointEnd';
export type TransformEventName = DragEventName | ResizeEventName | RotateEventName | SetPointEventName;

// Event names for Cloneable
export type CloneEventName = 'dragStart' | 'drag' | 'dragEnd';

// Event callback map for type-safe event handling
export interface TransformEventMap {
    dragStart: StartEventArgs;
    drag: DragEventArgs;
    dragEnd: EndEventArgs;
    resizeStart: StartEventArgs;
    resize: ResizeEventArgs;
    resizeEnd: EndEventArgs;
    rotateStart: StartEventArgs;
    rotate: RotateEventArgs;
    rotateEnd: EndEventArgs;
    setPointStart: StartEventArgs;
    setPointEnd: EndEventArgs;
}

// Parameters for exeDrag method
export interface ExeDragParams {
    /** Delta X to move */
    dx: number;
    /** Delta Y to move */
    dy: number;
}

// Parameters for exeResize method
export interface ExeResizeParams {
    /** Delta X for resize */
    dx: number;
    /** Delta Y for resize */
    dy: number;
    /** Reverse X direction */
    revX?: boolean;
    /** Reverse Y direction */
    revY?: boolean;
    /** Only resize width */
    doW?: boolean;
    /** Only resize height */
    doH?: boolean;
}

// Parameters for exeRotate method
export interface ExeRotateParams {
    /** Rotation delta in radians */
    delta: number;
}

// Parameters for setTransformOrigin method
export interface TransformOriginParams {
    /** Absolute X position */
    x?: number;
    /** Absolute Y position */
    y?: number;
    /** Relative delta X from center */
    dx?: number;
    /** Relative delta Y from center */
    dy?: number;
}

// Handles object containing DOM elements for controls
export interface TransformHandles {
    tl?: HTMLElement;
    tc?: HTMLElement;
    tr?: HTMLElement;
    bl?: HTMLElement;
    br?: HTMLElement;
    bc?: HTMLElement;
    ml?: HTMLElement;
    mr?: HTMLElement;
    center?: HTMLElement;
    rotator?: HTMLElement;
    normal?: HTMLElement;
    radius?: HTMLElement;
    te?: HTMLElement;
    be?: HTMLElement;
    le?: HTMLElement;
    re?: HTMLElement;
}

// Storage object for Draggable/DraggableSVG
export interface TransformStorage {
    wrapper: HTMLElement;
    controls: HTMLElement;
    handles: TransformHandles;
    data: WeakMap<Element, any>;
    center: {
        isShifted: boolean;
        x?: number;
        y?: number;
        matrix?: Matrix4x4;
    };
    transformOrigin: Vertex;
    transform: {
        containerMatrix: Matrix4x4;
        controlsMatrix?: Matrix4x4;
        wrapperMatrix?: Matrix4x4;
    };
    bBox?: BBox;
    cached: Record<string, any>;
}

export interface DragOptions {
    /**
     * Mimic behavior with other `Subjx` instances for synchronized transformations
     */
    each?: MimicOptions;
    /**
     * Snapping to grid configuration
     */
    snap?: SnapOptions;
    /**
     * Constrain movement along an axis: 'x', 'y', or 'xy' (both)
     */
    axis?: Axis;
    /**
     * Cursor style during dragging
     */
    cursorMove?: string;
    /**
     * Cursor style during resizing / scaling
     */
    cursorResize?: string;
    /**
     * Cursor style during rotating
     */
    cursorRotate?: string;
    /**
     * @deprecated Use `transformOrigin` instead
     * Show rotation point handle
     */
    rotationPoint?: boolean;
    /**
     * Show and enable custom transform origin handle.
     * Can be boolean or initial position as [x, y] array
     */
    transformOrigin?: boolean | [number, number];
    /**
     * Restrict element transformations within the specified container.
     * Can be a CSS selector string, HTMLElement, or SVGElement
     */
    restrict?: string | HTMLElement | SVGElement | null;
    /**
     * Enable/disable dragging
     * @default true
     */
    draggable?: boolean;
    /**
     * Enable/disable resizing
     * @default true
     */
    resizable?: boolean;
    /**
     * Enable/disable rotation
     * @default true
     */
    rotatable?: boolean;
    /**
     * Use CSS scale transform instead of changing width/height
     * @default false
     */
    scalable?: boolean;
    /**
     * Apply translation to CSS left/top properties instead of transform
     * @default false
     */
    applyTranslate?: boolean;
    /**
     * Callback fired when transformation is initialized
     */
    onInit?: OnInitCallback;
    /**
     * Callback fired when element is dropped (after any transformation ends)
     */
    onDrop?: OnDropCallback;
    /**
     * Callback fired during dragging
     */
    onMove?: OnMoveCallback;
    /**
     * Callback fired during resizing/scaling
     */
    onResize?: OnResizeCallback;
    /**
     * Callback fired during rotation
     */
    onRotate?: OnRotateCallback;
    /**
     * Callback fired when transformation is disabled/destroyed
     */
    onDestroy?: OnDestroyCallback;
    /**
     * Container element for coordinate system calculations.
     * Defaults to parent element
     */
    container?: string | HTMLElement | SVGElement | SVGSVGElement;
    /**
     * Parent element for controls. Defaults to container
     */
    controlsContainer?: string | HTMLElement | SVGElement;
    /**
     * Keep aspect ratio during resizing
     * @default false
     */
    proportions?: boolean;
    /**
     * Position of the rotation handle: 'n' (north), 's' (south), 'w' (west), 'e' (east)
     * @default 'e'
     */
    rotatorAnchor?: Direction | null;
    /**
     * Distance of rotation handle from the element edge in pixels
     * @default 50
     */
    rotatorOffset?: number;
    /**
     * Show the line connecting rotator to element
     * @default true
     */
    showNormal?: boolean;
    /**
     * Custom data object passed through transformation lifecycle
     */
    custom?: Record<string, any> | null;
}

export interface CloneOptions {
    /**
     * Inline CSS styles applied to the cloned element
     */
    style?: Partial<CSSStyleDeclaration> | Record<string, string>;
    /**
     * Parent element where clone will be appended during drag.
     * Defaults to document.body
     */
    appendTo?: string | HTMLElement | null;
    /**
     * Target element/area for drop detection.
     * Clone drop callback fires only when dropped on this element.
     * Defaults to document.body
     */
    stack?: string | HTMLElement;
    /**
     * Callback fired when cloning is initialized
     */
    onInit?: OnInitCallback;
    /**
     * Callback fired when clone is dropped on stack target.
     * Receives event, original elements array, and clone element
     */
    onDrop?: OnCloneDropCallback;
    /**
     * Callback fired during clone dragging
     */
    onMove?: OnMoveCallback;
    /**
     * Callback fired when cloning is disabled/destroyed
     */
    onDestroy?: OnDestroyCallback;
}
