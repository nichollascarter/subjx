type Axis = 'x' | 'y' | 'xy';
type Direction = 'n' | 's' | 'w' | 'e';

declare function noop(): void;

type MimicOptions = {
    move?: boolean;
    resize?: boolean;
    rotate?: boolean;
}

type SnapOptions = {
    x?: number;
    y?: number;
    angle?: number;
}

export interface DragOptions {
    /**
     * Mimic behavior with other `Subjx` instances
    */
    each?: MimicOptions;
    /**
     * Snapping to grid
    */
    snap?: SnapOptions;
    /**
     * Constrain movement along an axis
    */
    axis?: Axis;
    /**
     * Cursor style on dragging
    */
    cursorMove?: string;
    /**
     * Cursor style on resizing / scaling
    */
    cursorResize?: string;
    /**
     * Cursor style on rotating
    */
    cursorRotate?: string;
    /**
     * The same as `transformOrigin`
    */
    rotationPoint?: boolean;
    /**
     * The origin of element's transformations
    */
    transformOrigin?: boolean;
    /**
     * Restrict element dragging / resizing / rotation within the target
    */
    restrict?: any;
    /**
     * Allow / deny an action
    */
    draggable?: boolean;
    /**
     * Allow / deny an action
    */
    resizable?: boolean;
    /**
     * Allow / deny an action
    */
    rotatable?: boolean;
    /**
     * Allow / deny an action
    */
    scalable?: boolean;
    /**
     * Allow / deny an action
    */
    applyTranslate?: boolean;
    /**
     * Function called on initialization
    */
    onInit?: Function | typeof noop;
    /**
     * Function called on target dropping
    */
    onDrop?: Function | typeof noop;
    /**
     * Function called on target dragging
    */
    onMove?: Function | typeof noop;
    /**
     * Function called on target resizing / scaling
    */
    onResize?: Function | typeof noop;
    /**
     * Function called on target rotating
    */
    onRotate?: Function | typeof noop;
    /**
     * Function called on disabling
    */
    onDestroy?: Function | typeof noop;
    /**
     * Transformation coordinate system
    */
    container?: string | HTMLElement;
    /**
     * Parent element for `controls`
    */
    controlsContainer?: string | HTMLElement;
    /**
     * Keeps aspect ratio on resizing
    */
    proportions?: boolean;
    /**
     * Rotator control direction
    */
    rotatorAnchor?: Direction;
    /**
     * Rotator control offset
    */
    rotatorOffset?: number;
    /**
     * Show normal line
    */
    showNormal?: boolean;
}

export interface CloneOptions {
    /**
     * Inline style object
    */
    style?: Object;
    /**
     * Parent element on cloning
    */
    appendTo?: string | HTMLElement;
    /**
     * Target element on dropping
    */
    stack?: string | HTMLElement;
    /**
     * Function called on initialization
    */
    onInit?: Function | typeof noop;
    /**
     * Function called on target dropping
    */
    onDrop?: Function | typeof noop;
    /**
     * Function called on target dragging
    */
    onMove?: Function | typeof noop;
    /**
     * Function called on disabling
    */
    onDestroy?: Function | typeof noop;
}
