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

export type PointKey = 'p1' | 'p2';

export type ResizeHandleKey = Exclude<HandleKey, 'center' | 'rotator'> | EdgeKey | PointKey;

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
    /**
     * Snap step for x-axis in pixels, 0 disables snapping
     * @default 10
     */
    x?: number;
    /**
     * Snap step for y-axis in pixels, 0 disables snapping
     * @default 10
     */
    y?: number;
    /**
     * Snap step for rotation angle in degrees, 0 disables snapping
     * @default 10
     */
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
export type BoundingRect = number[][];

// Event arguments for drag callbacks
export interface DragEventArgs {
    /**
     * Pointer X in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientX: number;
    /**
     * Pointer Y in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientY: number;
    /** Distance along X since the action started, snapped to grid */
    dx: number;
    /** Distance along Y since the action started, snapped to grid */
    dy: number;
    /** Resulting element matrix: DOMMatrix for SVG, 4x4 matrix for HTML */
    transform: Matrix4x4 | DOMMatrix;
}

// Event arguments for resize callbacks
export interface ResizeEventArgs {
    /**
     * Pointer X in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientX: number;
    /**
     * Pointer Y in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientY: number;
    /** Resize distance along X in element coordinates, positive when the element grows */
    dx: number;
    /** Resize distance along Y in element coordinates, positive when the element grows */
    dy: number;
    /** Resulting element matrix: DOMMatrix for SVG, 4x4 matrix for HTML */
    transform: Matrix4x4 | DOMMatrix;
    /** Width after resizing */
    width: number;
    /** Height after resizing */
    height: number;
}

// Event arguments for rotate callbacks
export interface RotateEventArgs {
    /**
     * Pointer X in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientX: number;
    /**
     * Pointer Y in container coordinates.
     * Not set when the action comes from exe* methods or a synchronized instance
     */
    clientY: number;
    /** Rotation since the action started in radians, snapped to `snap.angle` */
    delta: number;
    /** Resulting element matrix: DOMMatrix for SVG, 4x4 matrix for HTML */
    transform: Matrix4x4 | DOMMatrix;
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
export type CloneDropEvent = MouseEvent | Touch | TouchEvent;

export type OnCloneDropCallback = (
    this: any,
    event: CloneDropEvent,
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
    /** Resize towards the left, keeping the right edge in place */
    revX?: boolean;
    /** Resize towards the top, keeping the bottom edge in place */
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

export interface GuidesOptions {
    /**
     * Elements to align with: a selector or a list.
     * Defaults to the siblings of the dragged elements
     */
    targets?: string | Element[];
    /**
     * Element whose edges and center are alignment targets too, or `false` to skip.
     * Defaults to the container
     */
    bounds?: string | Element | false;
    /**
     * Distance in screen pixels at which elements snap to an alignment
     * @default 6
     */
    threshold?: number;
    /**
     * Snap to the found alignment; `false` only shows the guides
     * @default true
     */
    snap?: boolean;
}

export interface DragOptions {
    /**
     * Mimic behavior with other `Subjx` instances for synchronized transformations
     */
    each?: MimicOptions;
    /**
     * Snapping to grid; missing values fall back to the defaults
     * @default { x: 10, y: 10, angle: 10 }
     */
    snap?: SnapOptions;
    /**
     * Constrain movement along an axis: 'x', 'y', or 'xy' (both)
     * @default 'xy'
     */
    axis?: Axis;
    /**
     * Cursor style during dragging
     * @default 'auto'
     */
    cursorMove?: string;
    /**
     * Cursor style during resizing / scaling
     * @default 'auto'
     */
    cursorResize?: string;
    /**
     * Cursor style during rotating
     * @default 'auto'
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
     * @default false
     */
    transformOrigin?: boolean | [number, number];
    /**
     * Restrict element transformations within the specified container.
     * Can be a CSS selector string, HTMLElement, or SVGElement;
     * a selector that matches nothing restricts to document.body
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
     * Resize handles to show: corners and edge midpoints (tl, tc, tr, ml, mr, bl, bc, br),
     * edges (te, be, le, re) and line endpoints (p1, p2). Edges left out stay visible
     * but ignore the pointer. Rotator and transform origin handles are controlled by
     * `rotatable` and `transformOrigin`
     * @default all handles
     */
    handles?: ResizeHandleKey[];
    /**
     * Extra grab area around handles and edges in screen pixels, independent of zoom.
     * SVG only. After zooming the container call `fitControlsToSize()` to update it
     * @default 0
     */
    hitRadius?: number;
    /**
     * Keep hit areas visible, e.g. to tune `hitRadius`; otherwise they are
     * highlighted on hover only. SVG only
     * @default false
     */
    showHitAreas?: boolean;
    /**
     * Snap to edges and centers of other elements and of the container while dragging,
     * showing alignment guides. `true` uses the defaults of GuidesOptions. SVG only
     * @default false
     */
    guides?: boolean | GuidesOptions;
    /**
     * Enable/disable rotation
     * @default true
     */
    rotatable?: boolean;
    /**
     * Scale through the transform instead of changing width/height (HTML)
     * or geometry attributes (SVG)
     * @default false
     */
    scalable?: boolean;
    /**
     * When dragging ends, move the element through CSS left/top (HTML)
     * or position attributes such as x/y, cx/cy, points, d (SVG) instead of the transform
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
     * Arbitrary user data, available as `options.custom`; non-objects become null
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
     * Drop target: `onDrop` fires only when the clone lies entirely within it.
     * Defaults to document.body
     */
    stack?: string | HTMLElement;
    /**
     * Callback fired when cloning is initialized
     */
    onInit?: OnInitCallback;
    /**
     * Callback fired when clone is dropped on stack target.
     * Receives the pointer event (a Touch on touch devices),
     * original elements array, and clone element
     */
    onDrop?(this: any, event: CloneDropEvent, elements: Element[], clone: Element): void;
    /**
     * Callback fired during clone dragging; receives only dx and dy
     */
    onMove?: OnMoveCallback;
    /**
     * Callback fired when cloning is disabled/destroyed
     */
    onDestroy?: OnDestroyCallback;
}
