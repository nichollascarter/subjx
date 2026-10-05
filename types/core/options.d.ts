export type Axis = 'x' | 'y' | 'xy';
export type Direction = 'n' | 's' | 'w' | 'e';
export type AlignmentDirection = 'l' | 'r' | 't' | 'b' | 'h' | 'v' | 'tl' | 'tr' | 'bl' | 'br' | 'th' | 'bh' | 'lv' | 'rv';
export type HandleKey = 'tl' | 'tc' | 'tr' | 'bl' | 'br' | 'bc' | 'ml' | 'mr' | 'center' | 'rotator';
export type EdgeKey = 'te' | 'be' | 'le' | 're';
export type PointKey = 'p1' | 'p2';
export type ResizeHandleKey = Exclude<HandleKey, 'center' | 'rotator'> | EdgeKey | PointKey;
export type Matrix4x4 = [
    [
        number,
        number,
        number,
        number
    ],
    [
        number,
        number,
        number,
        number
    ],
    [
        number,
        number,
        number,
        number
    ],
    [
        number,
        number,
        number,
        number
    ]
];
export interface Point {
    x: number;
    y: number;
}
export type Vertex = [number, number, number, number];
export interface MimicOptions {
    /** Synchronize move operations */
    move?: boolean;
    /** Synchronize resize operations */
    resize?: boolean;
    /** Synchronize rotate operations */
    rotate?: boolean;
}
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
export type BoundingRect = number[][];
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
export interface DropEventArgs {
    /** Final client X coordinate */
    clientX: number;
    /** Final client Y coordinate */
    clientY: number;
}
export interface StartEventArgs {
    /** Client X coordinate at start */
    clientX: number;
    /** Client Y coordinate at start */
    clientY: number;
}
export interface EndEventArgs {
    /** Client X coordinate at end */
    clientX: number;
    /** Client Y coordinate at end */
    clientY: number;
}
export type OnInitCallback = (this: any, elements: Element[]) => void;
export type OnMoveCallback = (this: any, eventArgs: DragEventArgs) => void;
export type OnResizeCallback = (this: any, eventArgs: ResizeEventArgs) => void;
export type OnRotateCallback = (this: any, eventArgs: RotateEventArgs) => void;
export type OnDropCallback = (this: any, eventArgs: DropEventArgs) => void;
export type OnDestroyCallback = (this: any, elements: Element[]) => void;
export type CloneDropEvent = MouseEvent | Touch | TouchEvent;
export type OnCloneDropCallback = (this: any, event: CloneDropEvent, elements: Element[], clone: Element) => void;
export type DragEventName = 'dragStart' | 'drag' | 'dragEnd';
export type ResizeEventName = 'resizeStart' | 'resize' | 'resizeEnd';
export type RotateEventName = 'rotateStart' | 'rotate' | 'rotateEnd';
export type SetPointEventName = 'setPointStart' | 'setPointEnd';
export type TransformEventName = DragEventName | ResizeEventName | RotateEventName | SetPointEventName;
export type CloneEventName = 'dragStart' | 'drag' | 'dragEnd';
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
export interface ExeDragParams {
    /** Delta X to move */
    dx: number;
    /** Delta Y to move */
    dy: number;
}
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
export interface ExeRotateParams {
    /** Rotation delta in radians */
    delta: number;
}
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
