export const MIN_SIZE = 2;
export const THEME_COLOR = '#00a8ff';
export const LIB_CLASS_PREFIX = 'sjx-';

const E_MOUSEDOWN = 'mousedown';
const E_MOUSEUP = 'mouseup';
const E_MOUSEMOVE = 'mousemove';
const E_TOUCHSTART = 'touchstart';
const E_TOUCHEND = 'touchend';
const E_TOUCHMOVE = 'touchmove';

const E_DRAG_START = 'dragStart';
const E_DRAG = 'drag';
const E_DRAG_END = 'dragEnd';
const E_RESIZE_START = 'resizeStart';
const E_RESIZE = 'resize';
const E_RESIZE_END = 'resizeEnd';
const E_ROTATE_START = 'rotateStart';
const E_ROTATE = 'rotate';
const E_ROTATE_END ='rotateEnd';
const E_SET_POINT_START = 'setPointStart';
const E_SET_POINT_END = 'setPointEnd';

const EMITTER_EVENTS = [
    E_DRAG_START,
    E_DRAG, ,
    E_DRAG_END,
    E_RESIZE_START,
    E_RESIZE,
    E_RESIZE_END,
    E_ROTATE_START,
    E_ROTATE,
    E_ROTATE_END,
    E_SET_POINT_START,
    E_SET_POINT_END
];

export const CSS_PREFIXES = [
    '',
    '-webkit-',
    '-moz-',
    '-ms-',
    '-o-'
];

const ON_GETSTATE = 'ongetstate';
const ON_APPLY = 'onapply';
const ON_MOVE = 'onmove';
const ON_RESIZE = 'onresize';
const ON_ROTATE = 'onrotate';

const NOTIFIER_EVENTS = [
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
];

export const NOTIFIER_CONSTANTS = {
    NOTIFIER_EVENTS,
    ON_GETSTATE,
    ON_APPLY,
    ON_MOVE,
    ON_RESIZE,
    ON_ROTATE
};

export const EVENT_EMITTER_CONSTANTS = {
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
    E_SET_POINT_START,
    E_SET_POINT_END
};

export const CLIENT_EVENTS_CONSTANTS = {
    E_MOUSEDOWN,
    E_MOUSEUP,
    E_MOUSEMOVE,
    E_TOUCHSTART,
    E_TOUCHEND,
    E_TOUCHMOVE
};

const TRANSFORM_HANDLES_KEYS = {
    TOP_LEFT: 'tl',
    TOP_CENTER: 'tc',
    TOP_RIGHT: 'tr',
    BOTTOM_LEFT: 'bl',
    BOTTOM_RIGHT: 'br',
    BOTTOM_CENTER: 'bc',
    MIDDLE_LEFT: 'ml',
    MIDDLE_RIGHT: 'mr',
    CENTER: 'center'
};

const TRANSFORM_EDGES_KEYS = {
    TOP_EDGE: 'te',
    BOTTOM_EDGE: 'be',
    LEFT_EDGE: 'le',
    RIGHT_EDGE: 're'
};

export const TRANSFORM_HANDLES_CONSTANTS = {
    TRANSFORM_HANDLES_KEYS,
    TRANSFORM_EDGES_KEYS
};