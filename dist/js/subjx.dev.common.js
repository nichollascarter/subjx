/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2025
* Karen Sarksyan
* nichollascarter@gmail.com
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const requestAnimFrame = callback => typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : setTimeout(callback, 1000 / 60);
const cancelAnimFrame = requestID => {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(requestID);
  } else {
    clearTimeout(requestID);
  }
};
const {
  forEach,
  map: arrMap} = Array.prototype;
const {
  warn
} = console;
const noop = _ => _;
const isDef = val => val !== undefined && val !== null;
const isUndef = val => val === undefined || val === null;
const isFunc = val => typeof val === 'function';
const createMethod = fn => {
  return isFunc(fn) ? function (...args) {
    fn.call(this, ...args);
  } : noop;
};

class Helper {
  constructor(params) {
    if (typeof params === 'string') {
      const selector = document.querySelectorAll(params);
      this.length = selector.length;
      for (let count = 0; count < this.length; count++) {
        this[count] = selector[count];
      }
    } else if (typeof params === 'object' && (params.nodeType === 1 || params === document)) {
      this[0] = params;
      this.length = 1;
    } else if (params instanceof Helper) {
      this.length = params.length;
      for (let count = 0; count < this.length; count++) {
        this[count] = params[count];
      }
    } else if (isIterable(params)) {
      this.length = params.length;
      for (let count = 0; count < this.length; count++) {
        if (params[count].nodeType === 1) {
          this[count] = params[count];
        }
      }
    } else {
      throw new Error(`Passed parameter must be selector/element/elementArray`);
    }
  }
  css(prop) {
    const _getStyle = obj => {
      let len = obj.length;
      while (len--) {
        const node = obj[len];
        if (node.currentStyle) {
          return node.currentStyle[prop];
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
          return document.defaultView.getComputedStyle(node, '')[prop];
        } else {
          return node.style[prop];
        }
      }
    };
    const _setStyle = (obj, options) => {
      let len = obj.length;
      while (len--) {
        for (const property in options) {
          obj[len].style[property] = options[property];
        }
      }
      return obj.style;
    };
    if (typeof prop === 'string') {
      return _getStyle(this);
    } else if (typeof prop === 'object' || !prop) {
      return _setStyle(this, prop);
    } else {
      warn(`Method ${prop} does not exist`);
    }
    return false;
  }
  on(eventName, handlerOrSelector, optionsOrHandler, options) {
    let len = this.length;
    while (len--) {
      const node = this[len];
      if (!node.events) {
        node.events = {};
        node.events[eventName] = [];
      }
      if (typeof handlerOrSelector !== 'string') {
        if (document.addEventListener) {
          node.addEventListener(eventName, handlerOrSelector, optionsOrHandler || {
            passive: false
          });
        } else if (document.attachEvent) {
          node.attachEvent(`on${eventName}`, handlerOrSelector);
        } else {
          node[`on${eventName}`] = handlerOrSelector;
        }
      } else {
        listenerDelegate(node, eventName, handlerOrSelector, optionsOrHandler, options, true);
      }
    }
    return this;
  }
  off(eventName, handlerOrSelector, optionsOrHandler, options) {
    let len = this.length;
    while (len--) {
      const node = this[len];
      if (!node.events) {
        node.events = {};
        node.events[eventName] = [];
      }
      if (typeof handlerOrSelector !== 'string') {
        if (document.removeEventListener) {
          node.removeEventListener(eventName, handlerOrSelector, optionsOrHandler);
        } else if (document.detachEvent) {
          node.detachEvent(`on${eventName}`, handlerOrSelector);
        } else {
          node[`on${eventName}`] = null;
        }
      } else {
        listenerDelegate(node, eventName, handlerOrSelector, optionsOrHandler, options, false);
      }
    }
    return this;
  }
  is(selector) {
    if (isUndef(selector)) return false;
    const _sel = new Helper(selector);
    let len = this.length;
    while (len--) {
      if (this[len] === _sel[len]) return true;
    }
    return false;
  }
}
function listenerDelegate(el, evt, sel, handler, options, act) {
  const doit = function (event) {
    let t = event.target;
    while (t && t !== this) {
      if (t.matches(sel)) {
        handler.call(t, event);
      }
      t = t.parentNode;
    }
  };
  if (act === true) {
    if (document.addEventListener) {
      el.addEventListener(evt, doit, options || {
        passive: false
      });
    } else if (document.attachEvent) {
      el.attachEvent(`on${evt}`, doit);
    } else {
      el[`on${evt}`] = doit;
    }
  } else {
    if (document.removeEventListener) {
      el.removeEventListener(evt, doit, options || {
        passive: false
      });
    } else if (document.detachEvent) {
      el.detachEvent(`on${evt}`, doit);
    } else {
      el[`on${evt}`] = null;
    }
  }
}
function isIterable(obj) {
  const o = obj;
  return isDef(o) && typeof o === 'object' && (Array.isArray(o) || isDef(window.Symbol) && typeof o[window.Symbol.iterator] === 'function' || isDef(o.forEach) || typeof o.length === 'number' && (o.length === 0 || o.length > 0 && o.length - 1 in o));
}
function helper(params) {
  return new Helper(params);
}

const MIN_SIZE = 2;
const THEME_COLOR = '#00a8ff';
const LIB_CLASS_PREFIX = 'sjx-';
const E_MOUSEDOWN$4 = 'mousedown';
const E_MOUSEUP$2 = 'mouseup';
const E_MOUSEMOVE$2 = 'mousemove';
const E_TOUCHSTART$4 = 'touchstart';
const E_TOUCHEND$2 = 'touchend';
const E_TOUCHMOVE$2 = 'touchmove';
const E_MOUSEOVER$1 = 'mouseover';
const E_DRAG_START$1 = 'dragStart';
const E_DRAG$3 = 'drag';
const E_DRAG_END$1 = 'dragEnd';
const E_RESIZE_START$1 = 'resizeStart';
const E_RESIZE$2 = 'resize';
const E_RESIZE_END$1 = 'resizeEnd';
const E_ROTATE_START$1 = 'rotateStart';
const E_ROTATE$2 = 'rotate';
const E_ROTATE_END$1 = 'rotateEnd';
const E_SET_POINT$1 = 'setPoint';
const E_SET_POINT_START = 'setPointStart';
const E_SET_POINT_END$1 = 'setPointEnd';
const EMITTER_EVENTS$2 = [E_DRAG_START$1, E_DRAG$3, E_DRAG_END$1, E_RESIZE_START$1, E_RESIZE$2, E_RESIZE_END$1, E_ROTATE_START$1, E_ROTATE$2, E_ROTATE_END$1, E_SET_POINT_START, E_SET_POINT_END$1];
const CSS_PREFIXES = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
const ON_GETSTATE$2 = 'ongetstate';
const ON_APPLY$2 = 'onapply';
const ON_MOVE$2 = 'onmove';
const ON_RESIZE$2 = 'onresize';
const ON_ROTATE$2 = 'onrotate';
const NOTIFIER_EVENTS$1 = [ON_GETSTATE$2, ON_APPLY$2, ON_MOVE$2, ON_RESIZE$2, ON_ROTATE$2];
const NOTIFIER_CONSTANTS = {
  NOTIFIER_EVENTS: NOTIFIER_EVENTS$1,
  ON_GETSTATE: ON_GETSTATE$2,
  ON_APPLY: ON_APPLY$2,
  ON_MOVE: ON_MOVE$2,
  ON_RESIZE: ON_RESIZE$2,
  ON_ROTATE: ON_ROTATE$2
};
const EVENT_EMITTER_CONSTANTS = {
  EMITTER_EVENTS: EMITTER_EVENTS$2,
  E_DRAG_START: E_DRAG_START$1,
  E_DRAG: E_DRAG$3,
  E_DRAG_END: E_DRAG_END$1,
  E_RESIZE_START: E_RESIZE_START$1,
  E_RESIZE: E_RESIZE$2,
  E_RESIZE_END: E_RESIZE_END$1,
  E_ROTATE_START: E_ROTATE_START$1,
  E_ROTATE: E_ROTATE$2,
  E_ROTATE_END: E_ROTATE_END$1,
  E_SET_POINT: E_SET_POINT$1,
  E_SET_POINT_END: E_SET_POINT_END$1
};
const CLIENT_EVENTS_CONSTANTS = {
  E_MOUSEDOWN: E_MOUSEDOWN$4,
  E_MOUSEUP: E_MOUSEUP$2,
  E_MOUSEMOVE: E_MOUSEMOVE$2,
  E_TOUCHSTART: E_TOUCHSTART$4,
  E_TOUCHEND: E_TOUCHEND$2,
  E_TOUCHMOVE: E_TOUCHMOVE$2,
  E_MOUSEOVER: E_MOUSEOVER$1
};
const TRANSFORM_HANDLES_KEYS$1 = {
  TOP_LEFT: 'tl',
  TOP_CENTER: 'tc',
  TOP_RIGHT: 'tr',
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
  BOTTOM_CENTER: 'bc',
  MIDDLE_LEFT: 'ml',
  MIDDLE_RIGHT: 'mr'};
const TRANSFORM_EDGES_KEYS$1 = {
  TOP_EDGE: 'te',
  BOTTOM_EDGE: 'be',
  LEFT_EDGE: 'le',
  RIGHT_EDGE: 're'
};
const TRANSFORM_POINT_KEYS$1 = {
  START_POINT: 'p1',
  END_POINT: 'p2'
};
const TRANSFORM_HANDLES_CONSTANTS = {
  TRANSFORM_HANDLES_KEYS: TRANSFORM_HANDLES_KEYS$1,
  TRANSFORM_EDGES_KEYS: TRANSFORM_EDGES_KEYS$1,
  TRANSFORM_POINT_KEYS: TRANSFORM_POINT_KEYS$1
};

const {
  ON_GETSTATE: ON_GETSTATE$1,
  ON_APPLY: ON_APPLY$1,
  ON_MOVE: ON_MOVE$1,
  ON_RESIZE: ON_RESIZE$1,
  ON_ROTATE: ON_ROTATE$1
} = NOTIFIER_CONSTANTS;
const handlers = {
  [ON_GETSTATE$1]: (observer, data) => observer.notifyGetState(data),
  [ON_APPLY$1]: (observer, data) => observer.notifyApply(data),
  [ON_MOVE$1]: (observer, data) => observer.notifyMove(data),
  [ON_RESIZE$1]: (observer, data) => observer.notifyResize(data),
  [ON_ROTATE$1]: (observer, data) => observer.notifyRotate(data)
};
class Observable {
  constructor() {
    this.observers = {};
  }
  subscribe(eventName, sub) {
    const obs = this.observers;
    if (isUndef(obs[eventName])) {
      Object.defineProperty(obs, eventName, {
        value: []
      });
    }
    obs[eventName].push(sub);
    return this;
  }
  unsubscribe(eventName, f) {
    const obs = this.observers;
    if (isDef(obs[eventName])) {
      const index = obs[eventName].indexOf(f);
      if (index !== -1) obs[eventName].splice(index, 1);
    }
    return this;
  }
  notify(eventName, source, data) {
    const observers = this.observers[eventName];
    const handler = handlers[eventName];
    if (isUndef(observers) || isUndef(handler)) return;
    observers.forEach(observer => {
      if (source !== observer) handler(observer, data);
    });
  }
}

class Event {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }
  registerCallback(cb) {
    this.callbacks.push(cb);
  }
  removeCallback(cb) {
    const ix = this.callbacks.indexOf(cb);
    if (ix !== -1) {
      this.callbacks.splice(ix, 1);
    }
  }
}
class EventDispatcher {
  constructor() {
    this.events = {};
  }
  registerEvent(eventName) {
    this.events[eventName] = new Event(eventName);
  }
  emit(ctx, eventName, eventArgs) {
    this.events[eventName].callbacks.forEach(cb => {
      cb.call(ctx, eventArgs);
    });
  }
  addEventListener(eventName, cb) {
    this.events[eventName].registerCallback(cb);
  }
  removeEventListener(eventName, cb) {
    this.events[eventName].removeCallback(cb);
  }
}

const {
  E_DRAG: E_DRAG$2
} = EVENT_EMITTER_CONSTANTS;
const {
  E_MOUSEMOVE: E_MOUSEMOVE$1,
  E_MOUSEUP: E_MOUSEUP$1,
  E_TOUCHMOVE: E_TOUCHMOVE$1,
  E_TOUCHEND: E_TOUCHEND$1
} = CLIENT_EVENTS_CONSTANTS;
class SubjectModel {
  /** Internal state. Its shape is not part of the public API and may change in any minor release. */

  /** @internal */

  /** @internal */

  constructor(elements) {
    this.elements = elements;
    this.storage = null;
    this.proxyMethods = null;
    this.eventDispatcher = new EventDispatcher();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.animate = this.animate.bind(this);
  }
  enable(options) {
    this.processOptions(options);
    this.init(this.elements);
    this.afterInit();
    this.proxyMethods.onInit.call(this, this.elements);
  }

  /** @internal */
  afterInit() {}

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */
  drag({
    element,
    dx,
    dy,
    ...rest
  }) {
    const transform = this.processMove(element, {
      dx,
      dy
    });
    const finalArgs = {
      dx,
      dy,
      transform,
      ...rest
    };
    this.proxyMethods.onMove.call(this, finalArgs);
    this.emitEvent(E_DRAG$2, finalArgs);
  }

  /** @internal */
  draw() {
    this.animate();
  }

  /** @internal */
  onMouseDown(e) {
    if (e.button !== 0) return;
    this.start(e);
    helper(document).on(E_MOUSEMOVE$1, this.onMouseMove).on(E_MOUSEUP$1, this.onMouseUp);
  }

  /** @internal */
  onTouchStart(e) {
    this.start(e.touches[0]);
    helper(document).on(E_TOUCHMOVE$1, this.onTouchMove).on(E_TOUCHEND$1, this.onTouchEnd);
  }

  /** @internal */
  onMouseMove(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    this.moving(e);
  }

  /** @internal */
  onTouchMove(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    this.moving(e.touches[0]);
  }

  /** @internal */
  onMouseUp(e) {
    helper(document).off(E_MOUSEMOVE$1, this.onMouseMove).off(E_MOUSEUP$1, this.onMouseUp);
    this.end(e, this.elements);
  }

  /** @internal */
  onTouchEnd(e) {
    helper(document).off(E_TOUCHMOVE$1, this.onTouchMove).off(E_TOUCHEND$1, this.onTouchEnd);
    if (e.touches.length === 0) {
      this.end(e.changedTouches[0], this.elements);
    }
  }

  /** @internal */
  emitEvent(eventName, eventArgs) {
    this.eventDispatcher.emit(this, eventName, eventArgs);
  }
  on(name, cb) {
    this.eventDispatcher.addEventListener(name, cb);
    return this;
  }
  off(name, cb) {
    this.eventDispatcher.removeEventListener(name, cb);
    return this;
  }
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const snapCandidate = (value, gridSize) => gridSize === 0 ? value : Math.round(value / gridSize) * gridSize;
const snapToGrid = (value, snap) => {
  if (snap === 0) {
    return value;
  } else {
    const result = snapCandidate(value, snap);
    if (result - value < snap) {
      return result;
    }
  }
};
const floatToFixed = (val, size = 6) => Number(val.toFixed(size));
const getMinMaxOfArray = (arr, length = 2) => {
  const res = [];
  for (let i = 0; i < length; i++) {
    const axisValues = arr.map(e => e[i]);
    res.push([Math.min(...axisValues), Math.max(...axisValues)]);
  }
  return res;
};
const rotatorAngle = (alongX, alongY, acrossX, acrossY) => Math.hypot(alongX, alongY) > 1e-6 ? Math.atan2(alongY, alongX) : Math.atan2(acrossY, acrossX) + Math.PI / 2;
const limitSize = (value, min, flip) => {
  if (!flip) return Math.max(value, min);
  return Math.abs(value) < min ? value < 0 ? -min : min : value;
};
const resizeBox = ({
  width,
  height,
  dx,
  dy,
  doW,
  doH,
  proportions,
  flip
}) => {
  const baseWidth = Math.max(1, width),
    baseHeight = Math.max(1, height);
  const minWidth = Math.min(MIN_SIZE, baseWidth),
    minHeight = Math.min(MIN_SIZE, baseHeight);
  let newWidth, newHeight;
  if (proportions) {
    const ratio = limitSize(doW || !doH ? (baseWidth + dx) / baseWidth : (baseHeight + dy) / baseHeight, Math.max(minWidth / baseWidth, minHeight / baseHeight), flip);
    newWidth = baseWidth * ratio;
    newHeight = baseHeight * ratio;
  } else {
    newWidth = limitSize(baseWidth + dx, minWidth, flip);
    newHeight = limitSize(baseHeight + dy, minHeight, flip);
  }
  return [newWidth / baseWidth, newHeight / baseHeight, newWidth, newHeight];
};
const ROTATOR_ANCHORS = {
  n: 'tc',
  s: 'bc',
  w: 'ml',
  e: 'mr'
};
const rotatorPlacement = (vertices, rotatorAnchor, rotatorOffset) => {
  const {
    tl,
    tr,
    bl
  } = vertices;
  const {
    x,
    y
  } = vertices[rotatorAnchor && ROTATOR_ANCHORS[rotatorAnchor] || 'mr'];
  const factor = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;
  const theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? rotatorAngle(bl.x - tl.x, bl.y - tl.y, tr.x - tl.x, tr.y - tl.y) : rotatorAngle(tl.x - tr.x, tl.y - tr.y, bl.x - tl.x, bl.y - tl.y);
  const offset = rotatorOffset * factor;
  return {
    anchor: {
      x,
      y
    },
    rotator: {
      x: x - offset * Math.cos(theta),
      y: y - offset * Math.sin(theta)
    }
  };
};
const axisOffset = (direction, rules) => {
  const rule = rules.find(([pattern]) => pattern.test(direction));
  return rule ? rule[1] : 0;
};
const alignmentOffset = (direction, [[minX, maxX], [minY, maxY]], [[elMinX, elMaxX], [elMinY, elMaxY]]) => [axisOffset(direction, [[/[l]/, minX - elMinX], [/[r]/, maxX - elMaxX], [/[h]/, (maxX + minX) / 2 - (elMaxX + elMinX) / 2]]), axisOffset(direction, [[/[t]/, minY - elMinY], [/[b]/, maxY - elMaxY], [/[v]/, (maxY + minY) / 2 - (elMaxY + elMinY) / 2]])];
const boxVertices = ({
  x,
  y,
  width,
  height
}) => {
  const hW = width / 2,
    hH = height / 2;
  return {
    tl: [x, y],
    tr: [x + width, y],
    mr: [x + width, y + hH],
    ml: [x, y + hH],
    tc: [x + hW, y],
    bc: [x + hW, y + height],
    br: [x + width, y + height],
    bl: [x, y + height],
    center: [x + hW, y + hH]
  };
};
const edgeSegments = ({
  tl,
  tr,
  bl,
  br
}) => ({
  te: [tl, tr],
  be: [bl, br],
  le: [tl, bl],
  re: [tr, br]
});

var common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEG: DEG,
    RAD: RAD,
    alignmentOffset: alignmentOffset,
    boxVertices: boxVertices,
    edgeSegments: edgeSegments,
    floatToFixed: floatToFixed,
    getMinMaxOfArray: getMinMaxOfArray,
    resizeBox: resizeBox,
    rotatorAngle: rotatorAngle,
    rotatorPlacement: rotatorPlacement,
    snapToGrid: snapToGrid
});

const EPSILON = 1e-6;
const xLines = ({
  left,
  right
}) => [left, (left + right) / 2, right];
const yLines = ({
  top,
  bottom
}) => [top, (top + bottom) / 2, bottom];
const shift = ({
  left,
  top,
  right,
  bottom
}, dx, dy) => ({
  left: left + dx,
  top: top + dy,
  right: right + dx,
  bottom: bottom + dy
});
const boxFromPoints = points => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    left: Math.min(...xs),
    top: Math.min(...ys),
    right: Math.max(...xs),
    bottom: Math.max(...ys)
  };
};
const unionBoxes = boxes => ({
  left: Math.min(...boxes.map(box => box.left)),
  top: Math.min(...boxes.map(box => box.top)),
  right: Math.max(...boxes.map(box => box.right)),
  bottom: Math.max(...boxes.map(box => box.bottom))
});
const nearestOffset = (moving, targets, threshold) => {
  let best = null;
  targets.forEach(values => values.forEach(target => moving.forEach(value => {
    const offset = target - value;
    if (Math.abs(offset) <= threshold && (best === null || Math.abs(offset) < Math.abs(best))) {
      best = offset;
    }
  })));
  return best;
};
const collectLines = (xs, ys, extent, targets, tolerance) => {
  const lines = [];
  const add = (axis, value, from, to) => {
    const same = lines.find(line => line.axis === axis && Math.abs(line.value - value) <= EPSILON);
    if (same) {
      same.from = Math.min(same.from, from);
      same.to = Math.max(same.to, to);
    } else {
      lines.push({
        axis,
        value,
        from,
        to
      });
    }
  };
  targets.forEach(target => {
    xLines(target).forEach(value => {
      if (xs.some(x => Math.abs(x - value) <= tolerance)) {
        add('x', value, Math.min(extent.top, target.top), Math.max(extent.bottom, target.bottom));
      }
    });
    yLines(target).forEach(value => {
      if (ys.some(y => Math.abs(y - value) <= tolerance)) {
        add('y', value, Math.min(extent.left, target.left), Math.max(extent.right, target.right));
      }
    });
  });
  return lines;
};
const alignProbes = ({
  targets,
  threshold,
  snap
}, xs, ys, extent, dx, dy, {
  x: alignX = true,
  y: alignY = true
}) => {
  const offsetX = snap && alignX && xs.length ? nearestOffset(xs.map(x => x + dx), targets.map(xLines), threshold) : null;
  const offsetY = snap && alignY && ys.length ? nearestOffset(ys.map(y => y + dy), targets.map(yLines), threshold) : null;
  const nextDx = dx + (offsetX || 0);
  const nextDy = dy + (offsetY || 0);
  return {
    dx: nextDx,
    dy: nextDy,
    lines: collectLines(xs.map(x => x + nextDx), ys.map(y => y + nextDy), extent(nextDx, nextDy), targets, snap ? EPSILON : threshold)
  };
};
const align = (state, dx, dy, axes = {}) => alignProbes(state, xLines(state.box), yLines(state.box), (nextDx, nextDy) => shift(state.box, nextDx, nextDy), dx, dy, axes);
const alignEdges = (state, edges, extent, dx, dy, axes = {}) => alignProbes(state, edges.x === null || edges.x === undefined ? [] : [edges.x], edges.y === null || edges.y === undefined ? [] : [edges.y], extent, dx, dy, axes);

const clampAxis = (min, max, areaMin, areaMax, delta) => {
  const low = Math.min(0, areaMin - min);
  const high = Math.max(0, areaMax - max);
  return Math.min(Math.max(delta, low), high);
};
const clampMove = ({
  box,
  area
}, dx, dy) => ({
  dx: clampAxis(box.left, box.right, area.left, area.right, dx),
  dy: clampAxis(box.top, box.bottom, area.top, area.bottom, dy)
});
const clampEdge = (edge, areaMin, areaMax, delta) => clampAxis(edge, edge, areaMin, areaMax, delta);
const overflowPoint = (points, bounds) => {
  const [[minX, maxX], [minY, maxY]] = getMinMaxOfArray(bounds);
  let x = null,
    y = null;
  for (let i = 0, len = points.length; i < len; i++) {
    const [px, py] = points[i];
    if (px < minX || px > maxX) x = px;
    if (py < minY || py > maxY) y = py;
  }
  return {
    x,
    y
  };
};

const getOffset = node => node.getBoundingClientRect();
const addClass = (node, cls) => {
  if (!cls) return;
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(cl => {
        return node.classList.add(cl);
      });
    } else {
      return node.classList.add(cls);
    }
  }
  return node;
};
const removeClass = (node, cls) => {
  if (!cls) return;
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(cl => {
        return node.classList.remove(cl);
      });
    } else {
      return node.classList.remove(cls);
    }
  }
  return node;
};
const objectsCollide = (a, b) => {
  const {
      top: aTop,
      left: aLeft
    } = getOffset(a),
    {
      top: bTop,
      left: bLeft
    } = getOffset(b),
    _a = helper(a),
    _b = helper(b);
  return !(aTop < bTop || aTop + parseFloat(_a.css('height')) > bTop + parseFloat(_b.css('height')) || aLeft < bLeft || aLeft + parseFloat(_a.css('width')) > bLeft + parseFloat(_b.css('width')));
};
const matrixToCSS = arr => {
  const style = `matrix3d(${arr.join()})`;
  return {
    transform: style,
    webkitTranform: style,
    mozTransform: style,
    msTransform: style,
    otransform: style
  };
};
const getStyle = (el, property) => {
  const style = window.getComputedStyle(el);
  let value = null;
  for (const prefix of CSS_PREFIXES) {
    value = style.getPropertyValue(`${prefix}${property}`) || value;
    if (value) break;
  }
  return value;
};
const getScrollOffset = () => {
  const doc = document.documentElement;
  return {
    left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
    top: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  };
};
const getElementOffset = el => {
  let left = 0;
  let top = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    left += el.offsetLeft - el.scrollLeft;
    top += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    left,
    top
  };
};
const sumPx = (...values) => values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
const getLayoutSize = el => {
  const {
    offsetWidth,
    offsetHeight
  } = el;
  const style = window.getComputedStyle(el);
  const isBorderBox = style.boxSizing === 'border-box';
  const width = parseFloat(style.width) + (isBorderBox ? 0 : sumPx(style.paddingLeft, style.paddingRight, style.borderLeftWidth, style.borderRightWidth));
  const height = parseFloat(style.height) + (isBorderBox ? 0 : sumPx(style.paddingTop, style.paddingBottom, style.borderTopWidth, style.borderBottomWidth));
  const isPrecise = (value, rounded) => Number.isFinite(value) && Math.abs(value - rounded) < 1;
  return {
    width: isPrecise(width, offsetWidth) ? width : offsetWidth,
    height: isPrecise(height, offsetHeight) ? height : offsetHeight
  };
};

const {
  NOTIFIER_EVENTS,
  ON_GETSTATE,
  ON_APPLY,
  ON_MOVE,
  ON_RESIZE,
  ON_ROTATE
} = NOTIFIER_CONSTANTS;
const {
  EMITTER_EVENTS: EMITTER_EVENTS$1,
  E_DRAG_START,
  E_DRAG: E_DRAG$1,
  E_DRAG_END,
  E_RESIZE_START,
  E_RESIZE: E_RESIZE$1,
  E_RESIZE_END,
  E_ROTATE_START,
  E_ROTATE: E_ROTATE$1,
  E_ROTATE_END,
  E_SET_POINT,
  E_SET_POINT_END
} = EVENT_EMITTER_CONSTANTS;
const {
  TRANSFORM_HANDLES_KEYS,
  TRANSFORM_EDGES_KEYS,
  TRANSFORM_POINT_KEYS
} = TRANSFORM_HANDLES_CONSTANTS;
const {
  E_MOUSEDOWN: E_MOUSEDOWN$3,
  E_TOUCHSTART: E_TOUCHSTART$3,
  E_MOUSEMOVE,
  E_MOUSEUP,
  E_TOUCHMOVE,
  E_TOUCHEND,
  E_MOUSEOVER
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
const {
  START_POINT: START_POINT$1,
  END_POINT: END_POINT$1
} = TRANSFORM_POINT_KEYS;

const {
  keys: keys$2
} = Object;
const RUNTIME_OPTIONS = ['axis', 'snap', 'each', 'proportions', 'flip', 'draggable', 'scalable', 'applyTranslate', 'guides', 'cursorMove', 'cursorResize', 'cursorRotate', 'custom', 'onInit', 'onMove', 'onResize', 'onRotate', 'onDrop', 'onDestroy'];
const ORIGIN_OPTIONS = ['transformOrigin', 'container'];
const isPlainObject = value => typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
const isSameOption = (a, b) => {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = keys$2(a);
    return aKeys.length === keys$2(b).length && aKeys.every(key => a[key] === b[key]);
  }
  return false;
};
const normalizeOptions = (options, elements) => {
  const {
    each = {
      move: false,
      resize: false,
      rotate: false
    },
    snap: snapOptions,
    axis = 'xy',
    cursorMove = 'auto',
    cursorResize = null,
    cursorRotate = null,
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
    container = elements[0].parentNode,
    controlsContainer = container,
    proportions = false,
    flip = true,
    rotatorAnchor = null,
    rotatorOffset = 50,
    showNormal = true,
    custom
  } = options;
  const snap = {
    x: 0,
    y: 0,
    angle: 0,
    ...snapOptions
  };
  return {
    axis,
    cursorMove,
    cursorRotate,
    cursorResize,
    transformOrigin,
    restrict: restrict ? helper(restrict)[0] || document.body : null,
    container: helper(container)[0],
    controlsContainer: helper(controlsContainer)[0],
    snap: {
      ...snap,
      angle: snap.angle * RAD
    },
    each,
    proportions,
    flip,
    draggable,
    resizable,
    handles: Array.isArray(handles) ? handles : null,
    hitRadius: Math.max(0, Number(hitRadius) || 0),
    showHitAreas: Boolean(showHitAreas),
    guides: guides === true ? {} : guides && typeof guides === 'object' ? guides : null,
    rotatable,
    scalable,
    applyTranslate,
    custom: typeof custom === 'object' && custom || null,
    rotatorAnchor,
    rotatorOffset,
    showNormal,
    isGrouped: elements.length > 1
  };
};
const proxyMethodsOf = ({
  onInit = noop,
  onDrop = noop,
  onMove = noop,
  onResize = noop,
  onRotate = noop,
  onDestroy = noop
}) => ({
  onInit: createMethod(onInit),
  onDrop: createMethod(onDrop),
  onMove: createMethod(onMove),
  onResize: createMethod(onResize),
  onRotate: createMethod(onRotate),
  onDestroy: createMethod(onDestroy)
});

const syncTransform = (target, source) => {
  const value = source.getAttribute('transform');
  if (value === null) {
    target.removeAttribute('transform');
  } else {
    target.setAttribute('transform', value);
  }
  const targetStyle = target.style;
  const sourceStyle = source.style;
  if (targetStyle && sourceStyle) targetStyle.transform = sourceStyle.transform;
};
const readClasses = ({
  wrapper,
  controls
}) => ({
  wrapper: Array.from(wrapper.classList),
  controls: Array.from(controls.classList)
});
const adoptControls = (target, fresh, previous) => {
  const {
    wrapper,
    controls
  } = target;
  const firstForeign = controls.firstChild;
  while (fresh.controls.firstChild) {
    controls.insertBefore(fresh.controls.firstChild, firstForeign);
  }
  Array.from(fresh.wrapper.childNodes).filter(node => node !== fresh.controls).forEach(node => wrapper.insertBefore(node, controls));
  [[wrapper, fresh.wrapper, previous === null || previous === void 0 ? void 0 : previous.wrapper], [controls, fresh.controls, previous === null || previous === void 0 ? void 0 : previous.controls]].forEach(([node, source, classes = []]) => {
    classes.forEach(name => removeClass(node, name));
    Array.from(source.classList).forEach(name => addClass(node, name));
    syncTransform(node, source);
  });
  const parent = fresh.wrapper.parentNode;
  if (wrapper.parentNode !== parent) parent.insertBefore(wrapper, fresh.wrapper);
  parent.removeChild(fresh.wrapper);
};

const RESIZE_CURSORS = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'];
const SECTOR = Math.PI / 4;
const RESIZE_KEYS = [TOP_LEFT, TOP_CENTER, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM_CENTER, MIDDLE_LEFT, MIDDLE_RIGHT, TOP_EDGE, BOTTOM_EDGE, LEFT_EDGE, RIGHT_EDGE];
const POINT_KEYS = [START_POINT$1, END_POINT$1];
const POINT_CURSOR = 'crosshair';
const ROTATE_CURSOR = 'grabbing';
const screenCenter = element => {
  const {
    left,
    top,
    width,
    height
  } = element.getBoundingClientRect();
  return [left + width / 2, top + height / 2];
};
const cursorFromAngle = radians => RESIZE_CURSORS[(Math.round(radians / SECTOR) % 4 + 4) % 4];
const resizeCursor = (handles, key) => {
  const {
    [TOP_EDGE]: top,
    [BOTTOM_EDGE]: bottom,
    [key]: handle
  } = handles;
  if (!top || !bottom || !handle) return null;
  const [tx, ty] = screenCenter(top);
  const [bx, by] = screenCenter(bottom);
  const [hx, hy] = screenCenter(handle);
  return cursorFromAngle(Math.atan2(hy - (ty + by) / 2, hx - (tx + bx) / 2));
};
const handleCursor = (handles, key) => {
  if (!key) return null;
  if (POINT_KEYS.includes(key)) return POINT_CURSOR;
  if (RESIZE_KEYS.includes(key)) return resizeCursor(handles, key);
  return null;
};

const {
  keys: keys$1
} = Object;
const REVERSE_X = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE];
const REVERSE_Y = [TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE];
const ON_TOP = [TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE];
const ON_LEFT = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE];
const ON_RIGHT = [TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE];
const ON_BOTTOM = [BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE];
const WIDTH_ONLY = [MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE];
const HEIGHT_ONLY = [TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE];
const POINTS = [START_POINT$1, END_POINT$1];
const RESIZE_X = [MIDDLE_LEFT, MIDDLE_RIGHT, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, LEFT_EDGE, RIGHT_EDGE];
const RESIZE_Y = [BOTTOM_RIGHT, BOTTOM_LEFT, BOTTOM_CENTER, TOP_RIGHT, TOP_LEFT, TOP_CENTER, TOP_EDGE, BOTTOM_EDGE];
const matcher = (handle, handles) => {
  const isHandle = key => {
    const hdl = handles[key];
    return isDef(hdl) ? handle.is(hdl) : false;
  };
  return {
    isHandle,
    some: items => items.some(isHandle)
  };
};
const handleKey = (handles, handle) => {
  var _keys$find;
  return (_keys$find = keys$1(handles).find(key => handles[key] === handle)) !== null && _keys$find !== void 0 ? _keys$find : null;
};
const handleFlags = (handle, handles) => {
  const {
    isHandle,
    some
  } = matcher(handle, handles);
  return {
    revX: some(REVERSE_X),
    revY: some(REVERSE_Y),
    onTopEdge: some(ON_TOP),
    onLeftEdge: some(ON_LEFT),
    onRightEdge: some(ON_RIGHT),
    onBottomEdge: some(ON_BOTTOM),
    doW: some(WIDTH_ONLY),
    doH: some(HEIGHT_ONLY),
    point: POINTS.find(isHandle) || null
  };
};
const resizeAxes = (handle, handles) => {
  const {
    some
  } = matcher(handle, handles);
  return {
    x: some(RESIZE_X),
    y: some(RESIZE_Y)
  };
};

const START_EVENTS = {
  [E_RESIZE$1]: E_RESIZE_START,
  [E_ROTATE$1]: E_ROTATE_START,
  [E_DRAG$1]: E_DRAG_START
};
const END_EVENTS = {
  [E_RESIZE$1]: E_RESIZE_END,
  [E_ROTATE$1]: E_ROTATE_END,
  [E_DRAG$1]: E_DRAG_END,
  [E_SET_POINT]: E_SET_POINT_END
};
const actionOf = ({
  doResize,
  doDrag,
  doRotate,
  doSetCenter
}) => {
  if (doResize) return E_RESIZE$1;
  if (doDrag) return E_DRAG$1;
  if (doRotate) return E_ROTATE$1;
  if (doSetCenter) return E_SET_POINT;
  return E_DRAG$1;
};
const isMimicked = ({
  doResize,
  doDrag,
  doRotate
}, {
  move,
  resize,
  rotate
}) => Boolean(doResize && resize || doRotate && rotate || doDrag && move);
const startEventOf = action => {
  var _START_EVENTS$action;
  return (_START_EVENTS$action = START_EVENTS[action]) !== null && _START_EVENTS$action !== void 0 ? _START_EVENTS$action : null;
};
const endEventOf = action => {
  var _END_EVENTS$action;
  return (_END_EVENTS$action = END_EVENTS[action]) !== null && _END_EVENTS$action !== void 0 ? _END_EVENTS$action : null;
};

const movingEdges = ({
  revX,
  revY
}, {
  flipX,
  flipY
}) => ({
  leftMoves: Boolean(revX) !== Boolean(flipX),
  topMoves: Boolean(revY) !== Boolean(flipY)
});
const room = size => size - Math.min(MIN_SIZE, size);
const sizeLimit = ({
  left,
  right,
  top,
  bottom
}, {
  dox,
  doy
}, {
  leftMoves,
  topMoves
}, flip) => ({
  dx,
  dy
}) => {
  if (flip) return {
    dx,
    dy
  };
  const width = room(right - left);
  const height = room(bottom - top);
  return {
    dx: !dox ? dx : leftMoves ? Math.min(dx, width) : Math.max(dx, -width),
    dy: !doy ? dy : topMoves ? Math.min(dy, height) : Math.max(dy, -height)
  };
};
const alignResize = (guides, session, proportions, delta, flip = true) => {
  if (!guides || !guides.axisAligned) return null;
  const {
    box
  } = guides;
  const {
    dox,
    doy,
    doW,
    doH
  } = session;
  const moving = movingEdges(session, guides);
  const {
    leftMoves,
    topMoves
  } = moving;
  const widthLeads = doW || !doH;
  const limit = sizeLimit(box, session, moving, flip);
  const {
    dx,
    dy
  } = limit(delta);
  const run = axes => alignEdges(guides, {
    x: dox ? leftMoves ? box.left : box.right : null,
    y: doy ? topMoves ? box.top : box.bottom : null
  }, (nextDx, nextDy) => ({
    left: box.left + (dox && leftMoves ? nextDx : 0),
    right: box.right + (dox && !leftMoves ? nextDx : 0),
    top: box.top + (doy && topMoves ? nextDy : 0),
    bottom: box.bottom + (doy && !topMoves ? nextDy : 0)
  }), dx, dy, axes);
  const axes = {
    x: Boolean(dox) && (!proportions || widthLeads),
    y: Boolean(doy) && (!proportions || !widthLeads)
  };
  const aligned = run(axes);
  const bounded = limit(aligned);
  if (bounded.dx === aligned.dx && bounded.dy === aligned.dy) return aligned;
  return run({
    x: axes.x && bounded.dx === aligned.dx,
    y: axes.y && bounded.dy === aligned.dy
  });
};
const alignPoint = (guides, {
  dox,
  doy
}, proportions, {
  dx,
  dy
}) => {
  if (!guides || !guides.point || proportions) return null;
  const {
    x,
    y
  } = guides.point;
  return alignEdges(guides, {
    x,
    y
  }, (nextDx, nextDy) => ({
    left: x + nextDx,
    right: x + nextDx,
    top: y + nextDy,
    bottom: y + nextDy
  }), dx, dy, {
    x: dox,
    y: doy
  });
};
const clampResize = (restriction, session, {
  dx,
  dy
}) => {
  if (!restriction || !restriction.axisAligned) return {
    dx,
    dy,
    clamped: false
  };
  const {
    box,
    area
  } = restriction;
  const {
    dox,
    doy
  } = session;
  const {
    leftMoves,
    topMoves
  } = movingEdges(session, restriction);
  return {
    dx: dox ? clampEdge(leftMoves ? box.left : box.right, area.left, area.right, dx) : dx,
    dy: doy ? clampEdge(topMoves ? box.top : box.bottom, area.top, area.bottom, dy) : dy,
    clamped: true
  };
};
const clampPoint = (restriction, {
  dx,
  dy
}) => {
  if (!restriction || !restriction.point) return {
    dx,
    dy
  };
  const {
    point,
    area
  } = restriction;
  return {
    dx: clampEdge(point.x, area.left, area.right, dx),
    dy: clampEdge(point.y, area.top, area.bottom, dy)
  };
};

const {
  keys,
  values: values$2
} = Object;
const NO_FLAGS = {
  revX: false,
  revY: false,
  doW: false,
  doH: false
};
const overflows = ({
  x,
  y
}) => x !== null || y !== null;
class Transformable extends SubjectModel {
  /** Internal state. Its shape is not part of the public API and may change in any minor release. Prefer `handles`, `controls`, `getBoundingRect()` and `getDimensions()`. */

  /** @internal */

  observer = {
    notifyMove: data => this.notifyMove(data),
    notifyRotate: data => this.notifyRotate(data),
    notifyResize: data => this.notifyResize(data),
    notifyApply: data => this.notifyApply(data),
    notifyGetState: data => this.notifyGetState(data)
  };
  onControlsOver = e => {
    const {
      storage
    } = this;
    if (isUndef(storage) || storage.onExecution) return;
    const target = e.target;
    const handle = this.resolveHandle(target);
    const key = handleKey(storage.handles, handle);
    if (!key || !RESIZE_KEYS.includes(key)) return;
    const cursor = this.options.resizable ? resizeCursor(storage.handles, key) || '' : '';
    [handle, target].forEach(node => {
      node.style.cursor = cursor;
    });
  };
  constructor(elements, options, observable) {
    super(elements);
    this.observable = observable;
    EMITTER_EVENTS$1.forEach(eventName => this.eventDispatcher.registerEvent(eventName));
    super.enable(options);
  }

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */
  pointToGroup(point) {
    return point;
  }

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */
  prepareGuides() {
    return null;
  }

  /** @internal */
  drawGuides(_lines) {}

  /** @internal */
  prepareRestrict() {
    return null;
  }

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */
  processActions(_actionName) {}

  /** @internal */

  /** @internal */

  /** @internal */

  /** @internal */
  rotate({
    element,
    radians,
    ...rest
  }) {
    const resultMtrx = this.processRotate(element, radians);
    const finalArgs = {
      transform: resultMtrx,
      delta: radians,
      ...rest
    };
    this.proxyMethods.onRotate.call(this, finalArgs);
    super.emitEvent(E_ROTATE$1, finalArgs);
  }

  /** @internal */
  resize({
    element,
    dx,
    dy,
    ...rest
  }) {
    const finalValues = this.processResize(element, {
      dx,
      dy
    });
    const finalArgs = {
      ...finalValues,
      dx,
      dy,
      ...rest
    };
    this.proxyMethods.onResize.call(this, finalArgs);
    super.emitEvent(E_RESIZE$1, finalArgs);
  }

  /** @internal */
  processOptions(options = {}) {
    const {
      elements
    } = this;
    this.rawOptions = options;
    elements.forEach(element => addClass(element, `${LIB_CLASS_PREFIX}drag`));
    this.options = normalizeOptions(options, elements);
    this.proxyMethods = proxyMethodsOf(options);
    this.subscribe(this.options.each);
  }

  /** @internal */
  animate() {
    const {
      storage,
      options
    } = this;
    if (isUndef(storage)) return;
    storage.frame = requestAnimFrame(this.animate);
    if (!storage.doDraw) return;
    storage.doDraw = false;
    const {
      doDrag,
      doResize,
      doRotate,
      doSetCenter,
      point
    } = storage;
    const {
      draggable,
      resizable,
      rotatable
    } = options;
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
  get session() {
    return this.storage;
  }

  /** @internal */
  pointerDelta() {
    const {
      session: {
        clientX,
        clientY,
        relativeX,
        relativeY
      },
      options: {
        snap
      }
    } = this;
    return {
      dx: snapToGrid(clientX - relativeX, snap.x),
      dy: snapToGrid(clientY - relativeY, snap.y)
    };
  }

  /** @internal */
  pointerArgs() {
    const {
      clientX,
      clientY,
      mouseEvent
    } = this.session;
    return {
      clientX,
      clientY,
      mouseEvent
    };
  }

  /** @internal */
  cachedDist() {
    var _this$storage$cached$, _this$storage$cached;
    const {
      dx = 0,
      dy = 0
    } = (_this$storage$cached$ = (_this$storage$cached = this.storage.cached) === null || _this$storage$cached === void 0 ? void 0 : _this$storage$cached.dist) !== null && _this$storage$cached$ !== void 0 ? _this$storage$cached$ : {};
    return {
      dx,
      dy
    };
  }

  /** @internal */
  cacheDist(dist) {
    this.storage.cached = {
      ...this.storage.cached,
      dist
    };
  }

  /** @internal */
  guide(alignment, delta) {
    if (!alignment) return delta;
    this.drawGuides(alignment.lines);
    return alignment;
  }

  /** @internal */
  localDelta(element, {
    dx,
    dy
  }, {
    revX,
    revY,
    dox,
    doy
  }) {
    const {
      x,
      y
    } = this.options.isGrouped ? this.pointToGroup({
      x: dx,
      y: dy
    }) : this.pointToTransform({
      x: dx,
      y: dy,
      matrix: this.storage.data.get(element).transform.ctm
    });
    return {
      dx: dox ? revX ? -x : x : 0,
      dy: doy ? revY ? -y : y : 0
    };
  }

  /** @internal */
  drawPoint(point) {
    var _this$processPointMov;
    const {
      storage,
      session,
      options: {
        proportions
      }
    } = this;
    const pointer = this.pointerDelta();
    const {
      dx,
      dy
    } = clampPoint(storage.restriction, this.guide(alignPoint(storage.guides, session, proportions, pointer), pointer));
    const result = (_this$processPointMov = this.processPointMove) === null || _this$processPointMov === void 0 ? void 0 : _this$processPointMov.call(this, this.elements[0], point, {
      dx,
      dy
    });
    if (!result) return;
    const finalArgs = {
      ...result,
      dx,
      dy,
      ...this.pointerArgs()
    };
    this.proxyMethods.onResize.call(this, finalArgs);
    super.emitEvent(E_RESIZE$1, finalArgs);
  }

  /** @internal */
  drawResize() {
    const {
      elements,
      observable,
      observer,
      storage,
      session,
      session: {
        revX,
        revY,
        dox,
        doy
      },
      options: {
        restrict,
        proportions,
        flip,
        each
      }
    } = this;
    const pointer = this.pointerDelta();
    const aligned = this.guide(alignResize(storage.guides, session, proportions, pointer, flip), pointer);
    const {
      dx,
      dy,
      clamped
    } = clampResize(storage.restriction, session, aligned);
    const dist = {
      dx,
      dy
    };
    const isBounding = Boolean(restrict) && !(clamped && !proportions) && elements.map(element => this.processResizeRestrict(element, this.localDelta(element, dist, session))).some(overflows);
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
  drawDrag() {
    const {
      elements,
      observable,
      observer,
      storage: {
        guides,
        restriction
      },
      session: {
        dox,
        doy
      },
      options: {
        restrict,
        each
      }
    } = this;
    const pointer = this.pointerDelta();
    const grid = {
      dx: dox ? pointer.dx : 0,
      dy: doy ? pointer.dy : 0
    };
    const aligned = this.guide(guides ? align(guides, grid.dx, grid.dy, {
      x: dox,
      y: doy
    }) : null, grid);
    const delta = restriction ? clampMove(restriction, aligned.dx, aligned.dy) : {
      dx: aligned.dx,
      dy: aligned.dy
    };
    const args = {
      ...delta,
      ...this.pointerArgs()
    };
    const overflow = restrict && !restriction ? elements.map(element => this.processMoveRestrict(element, args)) : [];
    const prev = this.cachedDist();
    const next = {
      dx: overflow.some(({
        x
      }) => x !== null) ? prev.dx : delta.dx,
      dy: overflow.some(({
        y
      }) => y !== null) ? prev.dy : delta.dy
    };
    const nextArgs = {
      ...args,
      ...next
    };
    this.cacheDist(next);
    elements.forEach(element => super.drag({
      element,
      ...nextArgs
    }));
    this.processControlsMove(next);
    if (each.move) observable.notify(ON_MOVE, observer, nextArgs);
  }

  /** @internal */
  drawRotate() {
    const {
      elements,
      observable,
      observer,
      session: {
        clientX,
        clientY,
        pressang,
        center
      },
      options: {
        snap,
        restrict,
        each
      }
    } = this;
    const angle = Math.atan2(clientY - center.y, clientX - center.x);
    const radians = snapToGrid(angle - pressang, snap.angle);
    if (restrict && elements.some(element => overflows(this.processRotateRestrict(element, radians)))) return;
    const args = this.pointerArgs();
    elements.forEach(element => this.rotate({
      element,
      radians,
      ...args
    }));
    this.processControlsRotate({
      radians
    });
    if (each.rotate) observable.notify(ON_ROTATE, observer, {
      radians,
      ...args
    });
  }

  /** @internal */
  drawCenter() {
    const {
      clientX,
      clientY,
      bx,
      by
    } = this.session;
    const {
      x,
      y
    } = this.pointToControls({
      x: clientX,
      y: clientY
    });
    this.moveCenterHandle(x - bx, y - by);
  }

  /** @internal */
  start(e) {
    const {
      clientX,
      clientY
    } = e;
    const target = this.resolveHandle(e.target);
    const {
      elements,
      observable,
      options: {
        axis,
        each,
        guides,
        restrict
      },
      storage,
      storage: {
        handles
      }
    } = this;
    const isTarget = values$2(handles).some(hdl => helper(target).is(hdl)) || elements.some(element => element.contains(target));
    storage.isTarget = isTarget;
    if (!isTarget) return;
    storage.handleCursor = handleCursor(handles, handleKey(handles, target));
    const computed = this.compute(e, elements);
    keys(computed).forEach(prop => storage[prop] = computed[prop]);
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
    const {
      rotator,
      center,
      radius
    } = handles;
    if (isDef(radius)) removeClass(radius, `${LIB_CLASS_PREFIX}hidden`);
    const doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge || Boolean(point);
    const doRotate = handle.is(rotator);
    const doSetCenter = isDef(center) ? handle.is(center) : false;
    const doDrag = !(doRotate || doResize || doSetCenter);
    const flags = {
      doResize,
      doDrag,
      doRotate,
      doSetCenter
    };
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
    if (startEvent) super.emitEvent(startEvent, {
      clientX,
      clientY
    });
    observable.notify(ON_GETSTATE, this.observer, {
      clientX,
      clientY,
      actionName,
      triggerEvent: isMimicked(flags, each),
      revX,
      revY,
      doW,
      doH
    });
    this.draw();
  }

  /** @internal */
  moving(e) {
    const {
      storage = {},
      options
    } = this;
    if (!storage.isTarget) return;
    const {
      x,
      y
    } = this.cursorPoint(e);
    storage.mouseEvent = e;
    storage.clientX = x;
    storage.clientY = y;
    storage.doDraw = true;
    if (!isUndef(storage.cursor)) return;
    const {
      doRotate,
      doDrag,
      doResize,
      handleCursor: pressedCursor
    } = storage;
    const {
      cursorMove,
      cursorResize,
      cursorRotate
    } = options;
    let cursor = null;
    if (doDrag) {
      cursor = cursorMove;
    } else if (doRotate) {
      cursor = cursorRotate !== null && cursorRotate !== void 0 ? cursorRotate : ROTATE_CURSOR;
    } else if (doResize) {
      var _ref;
      cursor = (_ref = cursorResize !== null && cursorResize !== void 0 ? cursorResize : pressedCursor) !== null && _ref !== void 0 ? _ref : 'auto';
    }
    helper(document.body).css({
      cursor
    });
    storage.wrapper.style.cursor = cursor || '';
  }

  /** @internal */
  end({
    clientX,
    clientY
  }) {
    const {
      elements,
      options: {
        each
      },
      observable,
      storage,
      storage: {
        frame,
        handles: {
          radius
        },
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
    const eventArgs = {
      clientX,
      clientY
    };
    proxyMethods.onDrop.call(this, eventArgs);
    const endEvent = endEventOf(actionName);
    if (endEvent) super.emitEvent(endEvent, eventArgs);
    observable.notify(ON_APPLY, this.observer, {
      clientX,
      clientY,
      actionName,
      triggerEvent
    });
    cancelAnimFrame(frame);
    this.setActiveHandle(null);
    if (this.storage.guides) {
      this.drawGuides([]);
      this.storage.guides = null;
    }
    this.storage.restriction = null;
    helper(document.body).css({
      cursor: 'auto'
    });
    this.storage.wrapper.style.cursor = '';
    if (isDef(radius)) addClass(radius, `${LIB_CLASS_PREFIX}hidden`);
    const {
      pendingOptions
    } = this;
    if (pendingOptions) {
      this.pendingOptions = null;
      this.applyOptions(pendingOptions);
    }
  }

  /** @internal */
  afterInit() {
    this.initClasses = readClasses(this.storage);
    helper(this.storage.controls).on(E_MOUSEOVER, this.onControlsOver);
  }

  /** @internal */
  setActiveHandle(handle) {
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
  compute(e, elements) {
    const {
      storage: {
        handles,
        data
      } = {}
    } = this;
    const target = this.resolveHandle(e.target);
    const handle = helper(target);
    const {
      revX,
      revY,
      doW,
      doH,
      ...rest
    } = handleFlags(handle, handles);
    const commonState = this.getCommonState();
    const {
      x,
      y
    } = this.cursorPoint(e);
    const {
      x: bx,
      y: by
    } = this.pointToControls({
      x,
      y
    }, commonState.transform);
    elements.forEach(element => {
      const {
        transform,
        ...nextData
      } = this.getElementState(element, {
        revX,
        revY,
        doW,
        doH
      });
      const {
        x: ex,
        y: ey
      } = this.pointToTransform({
        x,
        y,
        matrix: transform.ctm
      });
      data.set(element, {
        ...data.get(element),
        ...nextData,
        transform: transform,
        cx: ex,
        cy: ey
      });
    });
    const pressang = Math.atan2(y - commonState.center.y, x - commonState.center.x);
    return {
      data,
      ...rest,
      handle: values$2(handles).some(hdl => handle.is(hdl)) ? handle : helper(elements[0]),
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
  resolveHandle(target) {
    const key = target && target.getAttribute && target.getAttribute('data-sjx-handle');
    const handle = key ? this.storage.handles[key] : null;
    return handle || target;
  }

  /** @internal */
  isHandleEnabled(key) {
    const {
      handles
    } = this.options;
    return !handles || handles.includes(key);
  }

  /** @internal */
  restrictHandler(element, matrix) {
    return overflowPoint(this.getBoundingRect(element, matrix), this.getRestrictedBBox());
  }

  /** @internal */
  unbindPress(targets) {
    targets.forEach(target => helper(target).off(E_MOUSEDOWN$3, this.onMouseDown).off(E_TOUCHSTART$3, this.onTouchStart));
  }

  /** @internal */
  destroy() {
    const {
      elements,
      storage: {
        controls,
        wrapper
      } = {}
    } = this;
    this.unbindPress([...elements, controls]);
    helper(controls).off(E_MOUSEOVER, this.onControlsOver);
    wrapper.parentNode.removeChild(wrapper);
  }

  /** @internal */
  updateStorage() {
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
  prepareState(flags = NO_FLAGS) {
    const {
      elements,
      storage,
      storage: {
        data
      }
    } = this;
    const commonState = this.getCommonState();
    elements.forEach(element => {
      data.set(element, {
        ...data.get(element),
        ...this.getElementState(element, flags)
      });
    });
    this.storage = {
      ...storage,
      ...commonState
    };
  }
  notifyMove({
    dx,
    dy
  }) {
    this.elements.forEach(element => super.drag({
      element,
      dx,
      dy
    }));
    this.processControlsMove({
      dx,
      dy
    });
  }
  notifyRotate({
    radians,
    ...rest
  }) {
    const {
      elements,
      options: {
        snap: {
          angle
        }
      } = {}
    } = this;
    elements.forEach(element => this.rotate({
      element,
      radians: snapToGrid(radians, angle),
      ...rest
    }));
    this.processControlsRotate({
      radians
    });
  }
  notifyResize({
    dx,
    dy,
    revX,
    revY,
    dox,
    doy
  }) {
    this.elements.forEach(element => this.resize({
      element,
      ...this.localDelta(element, {
        dx,
        dy
      }, {
        revX,
        revY,
        dox,
        doy
      })
    }));
    this.processControlsResize({
      dx,
      dy
    });
  }
  notifyApply({
    clientX,
    clientY,
    actionName,
    triggerEvent
  }) {
    this.proxyMethods.onDrop.call(this, {
      clientX,
      clientY
    });
    if (triggerEvent) {
      this.elements.forEach(element => this.applyTransformToElement(element, actionName));
      super.emitEvent(`${actionName}End`, {
        clientX,
        clientY
      });
    }
  }
  notifyGetState({
    clientX,
    clientY,
    actionName,
    triggerEvent,
    ...rest
  }) {
    if (!triggerEvent) return;
    const {
      elements,
      storage: {
        data
      }
    } = this;
    elements.forEach(element => {
      data.set(element, {
        ...data.get(element),
        ...this.getElementState(element, rest)
      });
    });
    this.storage = {
      ...this.storage,
      ...this.getCommonState()
    };
    super.emitEvent(`${actionName}Start`, {
      clientX,
      clientY
    });
  }
  subscribe({
    resize,
    move,
    rotate
  }) {
    const {
      observable: ob,
      observer
    } = this;
    if (move || resize || rotate) {
      ob.subscribe(ON_GETSTATE, observer).subscribe(ON_APPLY, observer);
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
  unsubscribe() {
    const {
      observable: ob,
      observer
    } = this;
    NOTIFIER_EVENTS.forEach(eventName => ob.unsubscribe(eventName, observer));
  }
  disable() {
    const {
      storage,
      proxyMethods,
      elements
    } = this;
    if (isUndef(storage)) return;
    if (storage.onExecution) {
      helper(document).off(E_MOUSEMOVE, this.onMouseMove).off(E_MOUSEUP, this.onMouseUp).off(E_TOUCHMOVE, this.onTouchMove).off(E_TOUCHEND, this.onTouchEnd);
    }
    elements.forEach(element => removeClass(element, `${LIB_CLASS_PREFIX}drag`));
    this.pendingOptions = null;
    this.unsubscribe();
    this.destroy();
    proxyMethods.onDestroy.call(this, elements);
    delete this.storage;
  }
  update(options = {}) {
    const {
      storage
    } = this;
    if (isUndef(storage)) return;
    if (!storage.onExecution) {
      this.applyOptions(options);
      return;
    }
    const runtime = {};
    const structural = {};
    keys(options).forEach(key => {
      const target = RUNTIME_OPTIONS.includes(key) ? runtime : structural;
      target[key] = options[key];
    });
    if (keys(structural).length) {
      this.pendingOptions = {
        ...this.pendingOptions,
        ...structural
      };
    }
    this.applyOptions(runtime);
  }

  /** @internal */
  applyOptions(options) {
    const {
      rawOptions,
      options: prevOptions
    } = this;
    const changed = keys(options).filter(key => !isSameOption(options[key], rawOptions[key]));
    if (!changed.length) return;
    this.unsubscribe();
    this.processOptions({
      ...rawOptions,
      ...options
    });
    const {
      options: nextOptions
    } = this;
    const structural = changed.filter(key => !RUNTIME_OPTIONS.includes(key) && !isSameOption(nextOptions[key], prevOptions[key]));
    if (structural.length) this.rebuildControls(structural);
  }

  /** @internal */
  rebuildControls(changed) {
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
    const owned = [...values$2(prev.handles), ...values$2(prev.hitAreas || {}), prev.hitOverlay, prev.guidesLayer].filter(isDef);
    this.unbindPress([...elements, controls]);
    owned.forEach(node => {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
    this.init(elements);
    const fresh = this.storage;
    const freshClasses = readClasses(fresh);
    this.unbindPress([fresh.controls]);
    helper(controls).on(E_MOUSEDOWN$3, this.onMouseDown).on(E_TOUCHSTART$3, this.onTouchStart);
    adoptControls(prev, fresh, initClasses);
    this.storage = {
      ...fresh,
      wrapper,
      controls
    };
    this.initClasses = freshClasses;
    if (center.isShifted && !changed.some(key => ORIGIN_OPTIONS.includes(key))) {
      const [x, y] = Array.isArray(transformOrigin) ? transformOrigin : [transformOrigin.x, transformOrigin.y];
      this.setTransformOrigin({
        x,
        y
      }, true);
      this.storage.transformOrigin = transformOrigin;
      this.storage.center.isShifted = true;
    }
  }
  exeDrag({
    dx,
    dy
  }) {
    const {
      elements,
      options: {
        draggable,
        restrict
      }
    } = this;
    if (!draggable) return;
    this.prepareState();
    const restriction = restrict ? this.prepareRestrict() : null;
    const delta = restriction ? clampMove(restriction, dx, dy) : {
      dx,
      dy
    };
    elements.forEach(element => {
      super.drag({
        element,
        ...delta
      });
      this.applyTransformToElement(element, E_DRAG$1);
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
  }) {
    const {
      elements,
      options: {
        resizable
      }
    } = this;
    if (!resizable) return;
    this.prepareState({
      revX,
      revY,
      doW,
      doH
    });
    elements.forEach(element => {
      this.resize({
        element,
        dx,
        dy
      });
      this.applyTransformToElement(element, E_RESIZE$1);
    });
    this.processControlsMove({
      dx,
      dy
    });
  }
  exeRotate({
    delta
  }) {
    const {
      elements,
      options: {
        rotatable
      }
    } = this;
    if (!rotatable) return;
    this.prepareState();
    elements.forEach(element => {
      this.rotate({
        element,
        radians: delta
      });
      this.applyTransformToElement(element, E_ROTATE$1);
    });
    this.processControlsRotate({
      radians: delta
    });
  }
  resetTransformOrigin() {
    this.setTransformOrigin({
      dx: 0,
      dy: 0
    }, false);
  }
  get controls() {
    return this.storage.wrapper;
  }
  get handles() {
    return this.storage.handles;
  }
}

const cloneMatrix$1 = m => m.map(item => [...item]);
const flatMatrix = m => m.reduce((flat, _, i) => [...flat, m[0][i], m[1][i], m[2][i], m[3][i]], []);
const createIdentityMatrix = (n = 4) => [...Array(n)].map((_, i, a) => a.map(() => +!i--));
const createTranslateMatrix$1 = (x, y, z = 0) => createIdentityMatrix().map((item, i) => {
  item[3] = [x, y, z, 1][i];
  return item;
});
const createScaleMatrix$1 = (x, y, z = 1, w = 1) => createIdentityMatrix().map((item, i) => {
  item[i] = [x, y, z, w][i];
  return item;
});
const createRotateMatrix$1 = (sin, cos) => {
  const res = createIdentityMatrix();
  res[0][0] = cos;
  res[0][1] = -sin;
  res[1][0] = sin;
  res[1][1] = cos;
  return res;
};
const dropTranslate = (matrix, clone = true) => {
  const nextMatrix = clone ? cloneMatrix$1(matrix) : matrix;
  nextMatrix[0][3] = nextMatrix[1][3] = nextMatrix[2][3] = 0;
  return nextMatrix;
};
const multiplyMatrixAndPoint = (mat, point) => {
  const out = [];
  for (let i = 0, len = mat.length; i < len; ++i) {
    let sum = 0;
    for (let j = 0; j < len; ++j) {
      sum += +mat[i][j] * point[j];
    }
    out[i] = sum;
  }
  return out;
};
const multiplyMatrix = (m1, m2) => {
  const result = [];
  for (let j = 0; j < m2.length; j++) {
    result[j] = [];
    for (let k = 0; k < m1[0].length; k++) {
      let sum = 0;
      for (let i = 0; i < m1.length; i++) {
        sum += m1[i][k] * m2[j][i];
      }
      result[j].push(sum);
    }
  }
  return result;
};
const composeMatrix = (...matrices) => matrices.reduce((result, matrix) => multiplyMatrix(matrix, result));
const matrixInvert = matrix => {
  const A = cloneMatrix$1(matrix);
  const N = A.length;
  const E = A.map((_, i) => A.map((__, j) => i === j ? 1 : 0));
  for (let k = 0; k < N; k++) {
    let pivot = k;
    for (let i = k + 1; i < N; i++) {
      if (Math.abs(A[i][k]) > Math.abs(A[pivot][k])) pivot = i;
    }
    if (A[pivot][k] === 0) continue;
    [A[k], A[pivot]] = [A[pivot], A[k]];
    [E[k], E[pivot]] = [E[pivot], E[k]];
    const temp = A[k][k];
    for (let j = 0; j < N; j++) {
      A[k][j] /= temp;
      E[k][j] /= temp;
    }
    for (let i = 0; i < N; i++) {
      const factor = A[i][k];
      if (i === k || !factor) continue;
      for (let j = 0; j < N; j++) {
        A[i][j] -= A[k][j] * factor;
        E[i][j] -= E[k][j] * factor;
      }
    }
  }
  return E;
};
const computeTransformMatrix = (tx, [x, y, z]) => {
  const preMul = createTranslateMatrix$1(-x, -y, -z);
  const postMul = createTranslateMatrix$1(x, y, z);
  return multiplyMatrix(multiplyMatrix(preMul, tx), postMul);
};
const getCurrentTransformMatrix = (element, container = document.body, newTransform) => {
  let matrix = createIdentityMatrix();
  let node = element;

  // set predefined matrix if we need to find new CTM
  let nodeTx = newTransform || getTransform(node);
  let allowBorderOffset = false;
  while (node && node instanceof Element) {
    //const nodeTx = getTransform(node);
    const nodeTxOrigin = getTransformOrigin(node, allowBorderOffset);
    matrix = multiplyMatrix(matrix, computeTransformMatrix(nodeTx, nodeTxOrigin));
    allowBorderOffset = true;
    if (node === container || node.offsetParent === null) break;
    node = node.offsetParent;
    nodeTx = getTransform(node);
  }
  return matrix;
};
const decompose = m => {
  const sX = Math.sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0] + m[2][0] * m[2][0]),
    sY = Math.sqrt(m[0][1] * m[0][1] + m[1][1] * m[1][1] + m[2][1] * m[2][1]),
    sZ = Math.sqrt(m[0][2] * m[0][2] + m[1][2] * m[1][2] + m[2][2] * m[2][2]);
  let rX = Math.atan2(-m[0][3] / sZ, m[1][3] / sZ),
    rY = Math.asin(m[3][1] / sZ),
    rZ = Math.atan2(-m[3][0] / sY, m[0][0] / sX);
  if (m[0][1] === 1 || m[0][1] === -1) {
    rX = 0;
    rY = m[0][1] * -Math.PI / 2;
    rZ = m[0][1] * Math.atan2(m[1][1] / sY, m[0][1] / sY);
  }
  return {
    rotate: {
      x: rX,
      y: rY,
      z: rZ
    },
    translate: {
      x: m[0][3] / sX,
      y: m[1][3] / sY,
      z: m[2][3] / sZ
    },
    scale: {
      sX,
      sY,
      sZ
    }
  };
};
const getTransform = el => {
  const matrixString = getStyle(el, 'transform') || 'none';
  const matrix = createIdentityMatrix();
  if (matrixString === 'none') return matrix;
  const values = matrixString.split(/\s*[(),]\s*/).slice(1, -1);
  if (values.length === 16) {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        matrix[j][i] = +values[i * 4 + j];
      }
    }
  } else {
    return [[+values[0], +values[2], 0, +values[4]], [+values[1], +values[3], 0, +values[5]], [0, 0, 1, 0], [0, 0, 0, 1]];
  }
  return matrix;
};
const getTransformOrigin = (el, allowBorderOffset) => {
  const transformOrigin = getStyle(el, 'transform-origin');
  const values = transformOrigin ? transformOrigin.split(' ') : [];
  const out = [allowBorderOffset ? -el.clientLeft : 0, allowBorderOffset ? -el.clientTop : 0, 0, 1];
  for (let i = 0; i < values.length; ++i) {
    out[i] += parseFloat(values[i]);
  }
  return out;
};
const getAbsoluteOffset = (element, container = document.body) => {
  let top = 0,
    left = 0;
  let node = element;
  let allowBorderOffset = false;
  while (node && node.offsetParent) {
    const parentTx = getCurrentTransformMatrix(node.offsetParent);
    const [offsetLeft, offsetTop] = multiplyMatrixAndPoint(dropTranslate(parentTx, false), [node.offsetLeft + (allowBorderOffset ? node.clientLeft : 0), node.offsetTop + (allowBorderOffset ? node.clientTop : 0), 0, 1]);
    left += offsetLeft;
    top += offsetTop;
    if (container === node) break;
    allowBorderOffset = true;
    node = node.offsetParent;
  }
  return [left, top, 0, 1];
};

var matrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cloneMatrix: cloneMatrix$1,
    composeMatrix: composeMatrix,
    computeTransformMatrix: computeTransformMatrix,
    createIdentityMatrix: createIdentityMatrix,
    createRotateMatrix: createRotateMatrix$1,
    createScaleMatrix: createScaleMatrix$1,
    createTranslateMatrix: createTranslateMatrix$1,
    decompose: decompose,
    dropTranslate: dropTranslate,
    flatMatrix: flatMatrix,
    getAbsoluteOffset: getAbsoluteOffset,
    getCurrentTransformMatrix: getCurrentTransformMatrix,
    getTransform: getTransform,
    getTransformOrigin: getTransformOrigin,
    matrixInvert: matrixInvert,
    multiplyMatrix: multiplyMatrix,
    multiplyMatrixAndPoint: multiplyMatrixAndPoint
});

const createElement = (classNames = []) => {
  const element = document.createElement('div');
  classNames.forEach(className => addClass(element, className));
  return element;
};
const lineStyle = ([x1, y1], [x2, y2], thickness = 1) => {
  const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  const cx = (x1 + x2) / 2 - length / 2;
  const cy = (y1 + y2) / 2 - thickness / 2;
  const theta = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
  return {
    transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
    width: `${length}px`
  };
};
const createHandler$1 = ([x, y], key = 'handler') => {
  const element = createElement(['sjx-hdl', `sjx-hdl-${key}`]);
  helper(element).css({
    transform: `translate(${x}px, ${y}px)`
  });
  return element;
};
const renderLine$1 = ([from, to], key) => {
  const thickness = 1;
  const line = createElement(['sjx-hdl-line', `sjx-hdl-${key}`]);
  const {
    transform,
    width
  } = lineStyle(from, to, thickness);
  helper(line).css({
    transform,
    height: `${thickness}px`,
    width
  });
  return line;
};

const {
  entries: entries$4
} = Object;
const rotation = radians => createRotateMatrix$1(Math.sin(radians), Math.cos(radians));
const conjugate = (matrix, pivot) => multiplyMatrix(multiplyMatrix(matrixInvert(pivot), matrix), pivot);
const pinnedMatrix = (scaleMatrix, ctm, revX, revY) => {
  const translateX = scaleMatrix[0][3];
  const translateY = scaleMatrix[1][3];
  const inverted = createTranslateMatrix$1(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
  return multiplyMatrix(multiplyMatrix(inverted, ctm), matrixInvert(createTranslateMatrix$1(translateX, translateY)));
};
const toVectors = vertices => entries$4(vertices).reduce((result, [key, [x, y]]) => {
  result[key] = [x, y, 0, 1];
  return result;
}, {});
const mapVertices = (vertices, map) => entries$4(vertices).reduce((result, [key, [x, y]]) => {
  result[key] = map([x, y, 0, 1]);
  return result;
}, {});
const toPoints = vertices => entries$4(vertices).reduce((result, [key, [x, y]]) => {
  result[key] = {
    x,
    y
  };
  return result;
}, {});
const ownBox = (element, container) => {
  const [left, top] = getAbsoluteOffset(element, container);
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    offset: {
      left,
      top
    }
  };
};
const bBoxPoints$1 = (element, container, ctm, bBox) => {
  const {
    width,
    height,
    offset: {
      left,
      top
    } = {}
  } = bBox || ownBox(element, container);
  return [[0, 0, 0, 1], [width, 0, 0, 1], [0, height, 0, 1], [width, height, 0, 1]].map(vertex => {
    const [x, y, z, w] = multiplyMatrixAndPoint(ctm, vertex);
    return [x + left, y + top, z, w];
  });
};

const {
  E_MOUSEDOWN: E_MOUSEDOWN$2,
  E_TOUCHSTART: E_TOUCHSTART$2
} = CLIENT_EVENTS_CONSTANTS;
const {
  entries: entries$3,
  values: values$1
} = Object;
const BOX_HANDLES$1 = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];
class Draggable extends Transformable {
  /** @internal */
  init(elements) {
    const {
      options: {
        transformOrigin,
        container,
        controlsContainer,
        rotatable,
        restrict
      }
    } = this;
    const wrapper = createElement(['sjx-wrapper']);
    const controls = createElement(['sjx-controls']);
    const {
      rotator = null,
      anchor = null,
      ...vertices
    } = this.getVertices();
    const rotationHandles = rotatable ? this.renderRotationHandles(controls, anchor, rotator, vertices.center) : {};
    const nextTransformOrigin = Array.isArray(transformOrigin) ? [...transformOrigin, 0, 1] : [...vertices.center, 0, 1];
    const edgeHandles = this.renderEdges(controls, vertices);
    const pointHandles = this.renderPoints(controls, {
      ...this.resizingPoints(vertices),
      center: transformOrigin && rotatable ? [...nextTransformOrigin].slice(0, 2) : undefined,
      rotator
    });
    wrapper.appendChild(controls);
    controlsContainer.appendChild(wrapper);
    const data = new WeakMap();
    elements.forEach(element => data.set(element, {
      parent: element.parentNode,
      transform: {
        ctm: getCurrentTransformMatrix(element, container)
      },
      bBox: this.getBBox(),
      __data__: new WeakMap(),
      cached: {}
    }));
    const restrictContainer = restrict || container;
    this.storage = {
      wrapper,
      controls,
      handles: {
        ...edgeHandles,
        ...pointHandles,
        ...rotationHandles
      },
      data,
      center: {
        isShifted: Array.isArray(transformOrigin)
      },
      transformOrigin: nextTransformOrigin,
      transform: {
        containerMatrix: getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode)
      },
      cached: {}
    };
    [...elements, controls].forEach(target => helper(target).on(E_MOUSEDOWN$2, this.onMouseDown).on(E_TOUCHSTART$2, this.onTouchStart));
  }

  /** @internal */
  renderRotationHandles(controls, anchor, rotator, center) {
    const {
      showNormal,
      transformOrigin
    } = this.options;
    const normal = showNormal ? renderLine$1([[anchor.x, anchor.y], rotator], 'normal') : null;
    if (normal) controls.appendChild(normal);
    let radius = null;
    if (transformOrigin) {
      radius = renderLine$1([center, center], 'radius');
      addClass(radius, 'sjx-hidden');
      controls.appendChild(radius);
    }
    return {
      normal,
      radius
    };
  }

  /** @internal */
  renderEdges(controls, vertices) {
    const handles = {};
    entries$3(edgeSegments(vertices)).forEach(([key, segment]) => {
      const edge = renderLine$1(segment, key);
      if (!this.isHandleEnabled(key)) helper(edge).css({
        pointerEvents: 'none'
      });
      controls.appendChild(edge);
      handles[key] = edge;
    });
    return handles;
  }

  /** @internal */
  resizingPoints(vertices) {
    if (!this.options.resizable) return {};
    return BOX_HANDLES$1.filter(key => this.isHandleEnabled(key)).reduce((result, key) => {
      result[key] = vertices[key];
      return result;
    }, {});
  }

  /** @internal */
  renderPoints(controls, points) {
    const handles = {};
    entries$3(points).forEach(([key, point]) => {
      if (isUndef(point)) return;
      const handle = createHandler$1(point, key);
      controls.appendChild(handle);
      handles[key] = handle;
    });
    return handles;
  }

  /** @internal */
  pointToTransform({
    x,
    y,
    matrix
  }) {
    const nextMatrix = matrixInvert(matrix);
    return this.applyMatrixToPoint(dropTranslate(nextMatrix, false), x, y);
  }

  /** @internal */
  pointToControls({
    x,
    y
  }, transform = this.storage.transform) {
    const {
      controlsMatrix
    } = transform;
    const matrix = matrixInvert(controlsMatrix);
    return this.applyMatrixToPoint(dropTranslate(matrix, false), x, y);
  }

  /** @internal */
  pointToGroup(point) {
    return this.pointToControls(point);
  }

  /** @internal */
  getControlsMatrix() {
    const {
      controls
    } = this.storage || {};
    return controls ? getCurrentTransformMatrix(controls, controls.parentNode) : createIdentityMatrix();
  }

  /** @internal */
  applyMatrixToPoint(matrix, x, y) {
    const [nx, ny] = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]);
    return {
      x: nx,
      y: ny
    };
  }

  /** @internal */
  cursorPoint({
    clientX,
    clientY
  }) {
    const {
      container
    } = this.options;
    const globalMatrix = getCurrentTransformMatrix(container);
    const offset = getElementOffset(container);
    const {
      left,
      top
    } = getScrollOffset();
    const translateMatrix = createTranslateMatrix$1(offset.left - left, offset.top - top);
    return this.applyMatrixToPoint(matrixInvert(multiplyMatrix(globalMatrix, translateMatrix)), clientX, clientY);
  }

  /** @internal */
  getRestrictedBBox(force = false) {
    const {
      storage: {
        transform: {
          containerMatrix
        }
      },
      options: {
        restrict,
        container
      }
    } = this;
    const restrictEl = restrict || container;
    return bBoxPoints$1(restrictEl, container, force ? getCurrentTransformMatrix(restrictEl, container) : containerMatrix);
  }

  /** @internal */
  applyTransformToElement(element) {
    const {
      storage: {
        controls,
        data
      },
      options: {
        applyTranslate
      }
    } = this;
    const {
      cached,
      transform: {
        matrix
      }
    } = data.get(element);
    const $controls = helper(controls);
    if (isUndef(cached)) return;
    if (applyTranslate) {
      const $el = helper(element);
      const {
        dx,
        dy
      } = cached;
      const css = matrixToCSS(matrix);
      const left = parseFloat(element.style.left || $el.css('left'));
      const top = parseFloat(element.style.top || $el.css('top'));
      css.left = `${left + dx}px`;
      css.top = `${top + dy}px`;
      $el.css(css);
      $controls.css(css);
    }
  }

  /** @internal */
  resizeResult(element, {
    dx,
    dy
  }) {
    const {
      storage: {
        revX,
        revY,
        doW,
        doH,
        data,
        bBox: {
          width,
          height
        }
      },
      options: {
        proportions,
        scalable
      }
    } = this;
    const {
      matrix,
      auxiliary: {
        scale: {
          translateMatrix
        }
      }
    } = data.get(element).transform;
    const [scaleX, scaleY, newWidth, newHeight] = resizeBox({
      width,
      height,
      dx,
      dy,
      doW,
      doH,
      proportions,
      flip: false
    });
    const scaleMatrix = multiplyMatrix(multiplyMatrix(translateMatrix, createScaleMatrix$1(scaleX, scaleY)), matrixInvert(translateMatrix));
    return {
      resultMatrix: scalable ? multiplyMatrix(scaleMatrix, matrix) : pinnedMatrix(scaleMatrix, matrix, revX, revY),
      newWidth,
      newHeight
    };
  }

  /** @internal */
  cacheResize(element, {
    dx,
    dy
  }, width, height) {
    const {
      data
    } = this.storage;
    const elementData = data.get(element);
    data.set(element, {
      ...elementData,
      cached: {
        ...elementData.cached,
        dx,
        dy,
        bBox: {
          width,
          height
        }
      }
    });
  }

  /** @internal */
  rotatedMatrix(element, radians) {
    const {
      matrix,
      auxiliary: {
        rotate: {
          translateMatrix
        }
      }
    } = this.storage.data.get(element).transform;
    return multiplyMatrix(matrix, conjugate(rotation(radians), translateMatrix));
  }

  /** @internal */
  translatedMatrix(element, {
    dx,
    dy
  }) {
    const {
      matrix,
      auxiliary: {
        translate: {
          parentMatrix
        }
      }
    } = this.storage.data.get(element).transform;
    const [nx, ny] = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]);
    return {
      matrix: multiplyMatrix(matrix, createTranslateMatrix$1(nx, ny)),
      nx,
      ny
    };
  }

  /** @internal */
  processResize(element, delta) {
    if (this.options.isGrouped) return this.processGroupResize(element, delta);
    const {
      scalable
    } = this.options;
    const {
      resultMatrix,
      newWidth,
      newHeight
    } = this.resizeResult(element, delta);
    this.updateElementView(element, {
      ...matrixToCSS(flatMatrix(resultMatrix)),
      ...(!scalable && {
        width: `${newWidth}px`,
        height: `${newHeight}px`
      })
    });
    this.cacheResize(element, delta, newWidth, newHeight);
    return {
      transform: resultMatrix,
      width: newWidth,
      height: newHeight
    };
  }

  /** @internal */
  processGroupResize(element, {
    dx,
    dy
  }) {
    const {
      storage: {
        revX,
        revY,
        doW,
        doH,
        data,
        bBox: {
          x: boxX = 0,
          y: boxY = 0,
          width: boxWidth,
          height: boxHeight
        },
        transform: {
          controlsMatrix
        }
      },
      options: {
        proportions,
        scalable
      }
    } = this;
    const elementData = data.get(element);
    const {
      transform: {
        matrix,
        ctm,
        origin
      },
      bBox: {
        width,
        height,
        offset: {
          left = 0,
          top = 0
        } = {}
      }
    } = elementData;
    const [scaleX, scaleY, newWidth, newHeight] = resizeBox({
      width: boxWidth,
      height: boxHeight,
      dx,
      dy,
      doW,
      doH,
      proportions,
      flip: false
    });
    const fixedX = boxX + boxWidth * (doH ? 0.5 : revX ? 1 : 0),
      fixedY = boxY + boxHeight * (doW ? 0.5 : revY ? 1 : 0);
    const local = composeMatrix(matrixInvert(ctm), createTranslateMatrix$1(-left, -top), controlsMatrix, createTranslateMatrix$1(fixedX, fixedY), createScaleMatrix$1(scaleX, scaleY), createTranslateMatrix$1(-fixedX, -fixedY), matrixInvert(controlsMatrix), createTranslateMatrix$1(left, top), ctm);
    const toOrigin = createTranslateMatrix$1(origin[0], origin[1]),
      fromOrigin = createTranslateMatrix$1(-origin[0], -origin[1]);
    const isAxisAligned = local[0][0] > 0 && local[1][1] > 0 && Math.abs(local[0][1]) < 1e-4 * local[0][0] && Math.abs(local[1][0]) < 1e-4 * local[1][1];
    let resultMatrix;
    if (scalable || !isAxisAligned) {
      resultMatrix = composeMatrix(matrix, fromOrigin, local, toOrigin);
      this.updateElementView(element, {
        ...matrixToCSS(flatMatrix(resultMatrix)),
        ...(!scalable && {
          width: `${width}px`,
          height: `${height}px`
        })
      });
    } else {
      this.updateElementView(element, {
        width: `${width * local[0][0]}px`,
        height: `${height * local[1][1]}px`
      });
      const [nextOriginX, nextOriginY] = getTransformOrigin(element, false);
      resultMatrix = composeMatrix(createTranslateMatrix$1(-nextOriginX, -nextOriginY), toOrigin, matrix, fromOrigin, createTranslateMatrix$1(local[0][3], local[1][3]), createTranslateMatrix$1(nextOriginX, nextOriginY));
      this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
    }
    this.cacheResize(element, {
      dx,
      dy
    }, newWidth, newHeight);
    return {
      transform: resultMatrix,
      width: newWidth,
      height: newHeight
    };
  }

  /** @internal */
  processMove(element, delta) {
    const {
      data
    } = this.storage;
    const elementStorage = data.get(element);
    const {
      matrix: moveElementMtrx,
      nx,
      ny
    } = this.translatedMatrix(element, delta);
    this.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)));
    data.set(element, {
      ...elementStorage,
      cached: {
        ...elementStorage.cached,
        dist: {
          dx: floatToFixed(delta.dx),
          dy: floatToFixed(delta.dy),
          ox: floatToFixed(nx),
          oy: floatToFixed(ny)
        }
      }
    });
    return moveElementMtrx;
  }

  /** @internal */
  processRotate(element, radians) {
    const resultMatrix = this.rotatedMatrix(element, radians);
    if (this.options.restrict) {
      const {
        x,
        y
      } = this.restrictHandler(resultMatrix);
      if (isDef(x) || isDef(y)) return resultMatrix;
    }
    this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
    return resultMatrix;
  }

  /** @internal */
  getElementState(element, {
    revX,
    revY,
    doW,
    doH
  }) {
    const {
      storage: {
        handles: {
          center: cHandle
        },
        data,
        transformOrigin
      },
      options: {
        container,
        scalable
      }
    } = this;
    const storage = data.get(element);
    const {
      parent
    } = storage;
    const [glLeft, glTop] = getAbsoluteOffset(element, container);
    const {
      offsetLeft: elOffsetLeft,
      offsetTop: elOffsetTop
    } = element;
    const {
      width: elWidth,
      height: elHeight
    } = getLayoutSize(element);
    const matrix = getTransform(element);
    const ctm = getCurrentTransformMatrix(element, container);
    const parentMatrix = getCurrentTransformMatrix(parent, container);
    const hW = elWidth / 2,
      hH = elHeight / 2;

    // real element's center
    const [cenX, cenY] = multiplyMatrixAndPoint(ctm, [hW, hH, 0, 1]);
    const scaleX = doH ? 0 : revX ? -hW : hW,
      scaleY = doW ? 0 : revY ? -hH : hH;
    const globalCenterX = cenX + glLeft;
    const globalCenterY = cenY + glTop;
    const originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();

    // search distance between el's center and rotation handle
    const [distX, distY] = multiplyMatrixAndPoint(multiplyMatrix(matrixInvert(dropTranslate(ctm)), dropTranslate(originTransform)), [transformOrigin[0] - globalCenterX, transformOrigin[1] - globalCenterY, 0, 1]);

    // todo: check rotation origin with parent transform
    const [elX, elY] = multiplyMatrixAndPoint(matrix, [distX, distY, 0, 1]);
    const {
      scale: {
        sX,
        sY
      }
    } = decompose(getCurrentTransformMatrix(element, element.parentNode));
    const transform = {
      auxiliary: {
        scale: {
          translateMatrix: scalable ? createTranslateMatrix$1(scaleX, scaleY) : createTranslateMatrix$1(doH ? 0 : hW, doW ? 0 : hH)
        },
        translate: {
          parentMatrix: matrixInvert(dropTranslate(parentMatrix))
        },
        rotate: {
          translateMatrix: createTranslateMatrix$1(elX, elY)
        }
      },
      scaleX,
      scaleY,
      matrix,
      ctm,
      origin: getTransformOrigin(element, false),
      parentMatrix,
      scX: sX,
      scY: sY
    };
    return {
      transform,
      bBox: {
        width: elWidth,
        height: elHeight,
        left: elOffsetLeft,
        top: elOffsetTop,
        offset: {
          left: glLeft,
          top: glTop
        }
      }
    };
  }

  /** @internal */
  getCommonState() {
    const {
      elements,
      storage: {
        controls,
        handles: {
          center: cHandle
        },
        center: oldCenter,
        wrapper,
        transformOrigin
      },
      options: {
        container,
        restrict,
        isGrouped
      }
    } = this;
    const [glLeft, glTop] = getAbsoluteOffset(elements[0], container);
    const ctm = getCurrentTransformMatrix(elements[0], container);
    const restrictContainer = restrict || container;
    const containerMatrix = getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode);
    const {
      width: boxWidth,
      height: boxHeight
    } = this.getBBox();

    // real element's center
    const [cenX, cenY] = multiplyMatrixAndPoint(ctm, [boxWidth / 2, boxHeight / 2, 0, 1]);
    const [globalCenterX, globalCenterY] = oldCenter && oldCenter.isShifted ? transformOrigin : isGrouped ? multiplyMatrixAndPoint(this.getControlsMatrix(), this.getGroupVertices().center) : [cenX + glLeft, cenY + glTop];
    const originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();
    return {
      transform: {
        controlsMatrix: getCurrentTransformMatrix(controls, controls.parentNode),
        containerMatrix,
        wrapperMatrix: getCurrentTransformMatrix(wrapper, container)
      },
      bBox: {
        ...this.getBBox()
      },
      center: {
        ...oldCenter,
        x: globalCenterX,
        y: globalCenterY,
        matrix: originTransform
      }
    };
  }

  /** @internal */
  getBBox() {
    const {
      elements: [element],
      options: {
        isGrouped,
        container
      }
    } = this;
    if (isGrouped) {
      return this.getGroupBbox();
    } else {
      const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
      const {
        offsetLeft: elOffsetLeft,
        offsetTop: elOffsetTop
      } = element;
      const {
        width: elWidth,
        height: elHeight
      } = getLayoutSize(element);
      return {
        x: elOffsetLeft,
        y: elOffsetTop,
        width: elWidth,
        height: elHeight,
        offset: {
          left: offsetLeft,
          top: offsetTop
        }
      };
    }
  }

  /** @internal */
  processControlsResize() {
    const {
      center
    } = this.applyTransformToHandles();
    const {
      storage: {
        transform: {
          controlsMatrix
        }
      }
    } = this;
    if (!center) return;
    this.storage = {
      ...this.storage,
      cached: {
        transformOrigin: multiplyMatrixAndPoint(controlsMatrix, center)
      }
    };
  }

  /** @internal */
  processControlsMove({
    dx,
    dy
  }) {
    const {
      storage: {
        transform: {
          controlsMatrix,
          wrapperMatrix
        },
        center,
        transformOrigin
      }
    } = this;
    const moveControlsMtrx = multiplyMatrix(controlsMatrix, createTranslateMatrix$1(dx, dy));
    this.updateControlsView(moveControlsMtrx);
    const centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));
    const [cx, cy] = multiplyMatrixAndPoint(centerTransformMatrix, [dx, dy, 0, 1]);
    if (center.isShifted) {
      const [hx, hy] = multiplyMatrixAndPoint(dropTranslate(matrixInvert(controlsMatrix)), [dx, dy, 0, 1]);
      this.moveCenterHandle(-hx, -hy, false);
    } else {
      const translateMatrix = createTranslateMatrix$1(cx, cy);
      this.storage = {
        ...this.storage,
        cached: {
          transformOrigin: multiplyMatrixAndPoint(translateMatrix, transformOrigin)
        }
      };
    }
  }

  /** @internal */
  processControlsRotate({
    radians
  }) {
    const {
      storage: {
        transform: {
          wrapperMatrix,
          controlsMatrix
        },
        transformOrigin: [originX, originY]
      }
    } = this;
    const transformMatrix = conjugate(rotation(radians), wrapperMatrix);
    const rotateResultMatrix = multiplyMatrix(multiplyMatrix(createTranslateMatrix$1(-originX, -originY), transformMatrix), createTranslateMatrix$1(originX, originY));
    this.updateControlsView(multiplyMatrix(controlsMatrix, rotateResultMatrix));
  }

  /** @internal */
  moveCenterHandle(x, y, updateTransformOrigin = true) {
    const {
      storage: {
        handles: {
          center
        },
        center: {
          matrix
        },
        center: prevCenterData,
        transformOrigin,
        transform: {
          controlsMatrix
        } = {}
      }
    } = this;
    const [originDx, originDy] = controlsMatrix ? multiplyMatrixAndPoint(dropTranslate(controlsMatrix), [x, y, 0, 1]) : [x, y];
    const translateMatrix = createTranslateMatrix$1(x, y);
    const resultMatrix = multiplyMatrix(matrix, translateMatrix);
    helper(center).css({
      ...matrixToCSS(flatMatrix(resultMatrix))
    });
    this.storage = {
      ...this.storage,
      center: {
        ...prevCenterData,
        isShifted: true
      },
      ...(updateTransformOrigin ? {
        cached: {
          transformOrigin: multiplyMatrixAndPoint(createTranslateMatrix$1(originDx, originDy), transformOrigin)
        }
      } : {})
    };
  }

  /** @internal */
  processMoveRestrict(element, delta) {
    return this.restrictHandler(this.translatedMatrix(element, delta).matrix);
  }

  /** @internal */
  processRotateRestrict(element, radians) {
    return this.restrictHandler(this.rotatedMatrix(element, radians));
  }

  /** @internal */
  processResizeRestrict(element, delta) {
    return this.restrictHandler(this.resizeResult(element, delta).resultMatrix);
  }

  /** @internal */
  updateElementView(element, css) {
    helper(element).css(css);
  }

  /** @internal */
  updateControlsView(matrix = createIdentityMatrix()) {
    const cssStyle = matrixToCSS(flatMatrix(matrix));
    helper(this.storage.controls).css(cssStyle);
    this.storage.cached.controlsMatrix = matrix;
  }

  /**
   * Handle positions as [x, y, ...] arrays in container coordinates: box corners
   * and edge midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, and rotator
   * when rotatable; anchor, the rotator's base point, is { x, y }
   * @param transformMatrix matrix applied on top of the element transform
   */
  getVertices(transformMatrix = createIdentityMatrix()) {
    const {
      elements: [element] = [],
      options: {
        isGrouped,
        rotatable,
        rotatorAnchor,
        rotatorOffset
      }
    } = this;
    const vertices = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, transformMatrix);
    if (!rotatable) return vertices;
    const {
      anchor,
      rotator
    } = rotatorPlacement(toPoints(vertices), rotatorAnchor, rotatorOffset);
    vertices.rotator = [rotator.x, rotator.y];
    vertices.anchor = anchor;
    return vertices;
  }

  /** @internal */
  getElementVertices(element, transformMatrix) {
    const {
      container
    } = this.options;
    const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
    const {
      width,
      height
    } = getLayoutSize(element);
    const ctm = getCurrentTransformMatrix(element, container);
    return mapVertices(boxVertices({
      x: 0,
      y: 0,
      width,
      height
    }), vertex => {
      const [x, y, z, w] = multiplyMatrixAndPoint(ctm, vertex);
      return multiplyMatrixAndPoint(transformMatrix, [x + offsetLeft, y + offsetTop, z, w]);
    });
  }

  /** @internal */
  getGroupVertices() {
    return toVectors(boxVertices(this.getGroupBbox()));
  }

  /** @internal */
  getGroupBbox() {
    const {
      elements,
      options: {
        container
      }
    } = this;
    const toControls = matrixInvert(this.getControlsMatrix());
    const points = elements.reduce((result, element) => {
      const [left, top] = getAbsoluteOffset(element, container);
      return [...result, ...bBoxPoints$1(element, container, getCurrentTransformMatrix(element, container), {
        ...getLayoutSize(element),
        offset: {
          left,
          top
        }
      })];
    }, []).map(vertex => multiplyMatrixAndPoint(toControls, vertex));
    const [[minX, maxX], [minY, maxY]] = getMinMaxOfArray(points);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /** @internal */
  applyTransformToHandles({
    boxMatrix = createIdentityMatrix()
  } = {}) {
    const {
      options: {
        rotatable,
        resizable,
        showNormal
      },
      storage: {
        handles,
        controls,
        center: {
          isShifted = false
        } = {},
        transform: {
          controlsMatrix = getCurrentTransformMatrix(controls, controls.parentNode)
        } = {}
      }
    } = this;
    const {
      anchor = null,
      center,
      ...vertices
    } = this.getVertices(multiplyMatrix(boxMatrix, matrixInvert(controlsMatrix)));
    const normal = rotatable && showNormal ? [[anchor.x, anchor.y], vertices.rotator] : null;
    const lines = {
      ...edgeSegments(vertices),
      ...(normal && {
        normal
      })
    };
    entries$3(lines).forEach(([key, [from, to]]) => helper(handles[key]).css(lineStyle(from, to)));
    const allHandles = {
      ...(resizable && vertices),
      ...(rotatable && {
        rotator: vertices.rotator
      }),
      ...(!isShifted && Boolean(center) && {
        center
      })
    };
    entries$3(allHandles).forEach(([key, point]) => {
      const hdl = handles[key];
      if (isUndef(point) || isUndef(hdl)) return;
      helper(hdl).css({
        transform: `translate(${point[0]}px, ${point[1]}px)`
      });
    });
    return allHandles;
  }
  setTransformOrigin({
    x,
    y,
    dx,
    dy
  } = {}, pin = true) {
    const {
      elements: [element] = [],
      storage,
      storage: {
        wrapper,
        handles: {
          center: handle
        },
        center
      } = {},
      options: {
        container
      } = {}
    } = this;
    const isRelative = isDef(dx) && isDef(dy),
      isAbsolute = isDef(x) && isDef(y);
    if (!handle || !center || !(isRelative || isAbsolute)) return;
    const matrix = multiplyMatrix(getCurrentTransformMatrix(element, container), matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode)));
    let newX, newY;
    const [offsetLeft, offsetTop] = getAbsoluteOffset(element, container);
    if (isRelative) {
      const {
        offsetHeight,
        offsetWidth
      } = element;
      const relX = -dx + offsetWidth / 2;
      const relY = -dy + offsetHeight / 2;
      [newX, newY] = multiplyMatrixAndPoint(matrix, [relX, relY, 0, 1]);
    } else {
      newX = x;
      newY = y;
    }
    helper(handle).css({
      transform: `translate(${newX + offsetLeft}px, ${newY + offsetTop}px)`
    });
    center.isShifted = pin;
    storage.transformOrigin = multiplyMatrixAndPoint(createIdentityMatrix(), [newX, newY, 0, 1]);
  }
  fitControlsToSize() {
    const {
      storage: {
        controls,
        center: {
          isShifted
        } = {},
        transformOrigin: [originX, originY]
      }
    } = this;
    const controlsMatrix = getCurrentTransformMatrix(controls, controls.parentNode);
    const [dx, dy] = multiplyMatrixAndPoint(controlsMatrix, [originX, originY, 0, 1]);
    this.updateControlsView();
    if (isShifted) {
      this.setTransformOrigin({
        x: dx,
        y: dy
      }, true);
    } else {
      this.setTransformOrigin({
        dx: 0,
        dy: 0
      }, false);
    }
    this.applyTransformToHandles();
  }
  getBoundingRect(transformMatrix = null) {
    const {
      elements: [element] = [],
      options: {
        scalable,
        restrict,
        container
      },
      storage: {
        bBox,
        bBox: {
          width,
          height
        } = {},
        cached: {
          bBox: {
            width: nextWidth = width,
            height: nextHeight = height
          } = {}
        } = {}
      }
    } = this;
    const nextBox = scalable ? bBox : {
      ...bBox,
      width: nextWidth,
      height: nextHeight
    };
    const restrictEl = restrict || container;
    return bBoxPoints$1(element, restrictEl, getCurrentTransformMatrix(element, restrictEl, transformMatrix), nextBox);
  }
  applyAlignment(direction, target = null) {
    const {
      elements,
      options: {
        container
      }
    } = this;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      anchor,
      rotator,
      center,
      ...vertices
    } = this.getVertices();
    const restrictBBox = target ? bBoxPoints$1(target, container, getCurrentTransformMatrix(target, container)) : this.getRestrictedBBox(true);
    const [offsetX, offsetY] = alignmentOffset(direction, getMinMaxOfArray(restrictBBox), getMinMaxOfArray(values$1(vertices)));
    const [x, y] = multiplyMatrixAndPoint(matrixInvert(dropTranslate(getCurrentTransformMatrix(elements[0].parentNode, container))), [offsetX, offsetY, 0, 1]);
    const moveElementMtrx = multiplyMatrix(getTransform(elements[0]), createTranslateMatrix$1(x, y));
    elements.forEach(element => this.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx))));
    this.fitControlsToSize();
  }
  getDimensions() {
    const {
      elements: [element] = [],
      options: {
        isGrouped
      }
    } = this;
    const vertices = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, createIdentityMatrix());
    const controlsMatrix = this.getControlsMatrix();
    const [tl, tr, br] = [vertices.tl, vertices.tr, vertices.br].map(([x, y]) => isGrouped ? multiplyMatrixAndPoint(controlsMatrix, [x, y, 0, 1]) : [x, y]);
    return {
      x: floatToFixed(tl[0]),
      y: floatToFixed(tl[1]),
      width: floatToFixed(Math.sqrt(Math.pow(tl[0] - tr[0], 2) + Math.pow(tl[1] - tr[1], 2))),
      height: floatToFixed(Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2))),
      rotation: floatToFixed(Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * DEG)
    };
  }
}

const CIRCLE_SEGMENTS = 32;
const EDGE_KEYS = ['te', 'be', 'le', 're'];
const HANDLE_EDGES = {
  tl: ['te', 'le'],
  tr: ['te', 're'],
  bl: ['be', 'le'],
  br: ['be', 're'],
  tc: ['te'],
  bc: ['be'],
  ml: ['le'],
  mr: ['re']
};
const sub = (a, b) => ({
  x: a.x - b.x,
  y: a.y - b.y
});
const dot = (a, b) => a.x * b.x + a.y * b.y;
const length = a => Math.hypot(a.x, a.y);
const along = (point, direction, distance) => ({
  x: point.x + direction.x * distance,
  y: point.y + direction.y * distance
});
const edgeEnds = ({
  tl,
  tr,
  bl,
  br
}, edge) => ({
  te: [tl, tr],
  be: [bl, br],
  le: [tl, bl],
  re: [tr, br]
})[edge];
const OPPOSITE = {
  te: 'be',
  be: 'te',
  le: 're',
  re: 'le'
};
const edgeNormal = (corners, edge) => {
  const [a, b] = edgeEnds(corners, edge);
  const direction = sub(b, a);
  const size = length(direction);
  if (size < 1e-9) return {
    x: 0,
    y: 0
  };
  const normal = {
    x: direction.y / size,
    y: -direction.x / size
  };
  const [oppositeStart] = edgeEnds(corners, OPPOSITE[edge]);
  const towardsOpposite = dot(sub(oppositeStart, a), normal);
  if (Math.abs(towardsOpposite) > 1e-9) {
    return towardsOpposite > 0 ? {
      x: -normal.x,
      y: -normal.y
    } : normal;
  }
  return edge === 'te' || edge === 're' ? normal : {
    x: -normal.x,
    y: -normal.y
  };
};
const edgeDepth = (corners, edge) => {
  const [a] = edgeEnds(corners, edge);
  const [oppositeStart] = edgeEnds(corners, OPPOSITE[edge]);
  return Math.abs(dot(sub(oppositeStart, a), edgeNormal(corners, edge)));
};
const clampFor = (corners, edge, radius) => ({
  normal: edgeNormal(corners, edge),
  depth: Math.min(radius, edgeDepth(corners, edge) / 4)
});
const clockwise = points => {
  const area = points.reduce((sum, point, i) => {
    const next = points[(i + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0);
  return area < 0 ? [...points].reverse() : points;
};
const applyClamps = (points, origin, clamps) => clamps.reduce((result, {
  normal,
  depth
}) => result.map(point => {
  const offset = dot(sub(point, origin), normal);
  return offset < -depth ? along(point, normal, -depth - offset) : point;
}), points);
const hitAreaOutline = (key, center, corners, radius) => {
  if (radius <= 0) return [];
  if (corners && EDGE_KEYS.includes(key)) {
    const edge = key;
    const [a, b] = edgeEnds(corners, edge);
    if (length(sub(b, a)) < 1e-9) return [];
    const {
      normal,
      depth
    } = clampFor(corners, edge, radius);
    return clockwise([along(a, normal, radius), along(b, normal, radius), along(b, normal, -depth), along(a, normal, -depth)]);
  }
  const circle = Array.from({
    length: CIRCLE_SEGMENTS
  }, (_, i) => {
    const angle = i / CIRCLE_SEGMENTS * Math.PI * 2;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    };
  });
  const edges = corners ? HANDLE_EDGES[key] || [] : [];
  return clockwise(applyClamps(circle, center, edges.map(edge => clampFor(corners, edge, radius))));
};
const outlineToPath = points => points.length ? `M${points.map(({
  x,
  y
}) => `${+x.toFixed(3)} ${+y.toFixed(3)}`).join('L')}Z` : '';

const sepRE = /\s*,\s*|\s+/g;
const allowedElements = ['circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'g', 'foreignobject', 'use'];
function createSVGElement(name, classNames = []) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  classNames.forEach(className => addClass(element, className));
  return element;
}
const createSVGPoint = (x, y) => {
  const pt = createSVGElement('svg').createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt;
};
const checkChildElements = element => {
  const arrOfElements = [];
  if (isSVGGroup(element)) {
    forEach.call(element.childNodes, item => {
      if (item.nodeType === 1) {
        const tagName = item.tagName.toLowerCase();
        if (allowedElements.indexOf(tagName) !== -1) {
          if (tagName === 'g') {
            arrOfElements.push(...checkChildElements(item));
          }
          arrOfElements.push(item);
        }
      }
    });
  } else {
    arrOfElements.push(element);
  }
  return arrOfElements;
};
const createSVGMatrix = () => {
  return createSVGElement('svg').createSVGMatrix();
};
const createTranslateMatrix = (x, y) => {
  const matrix = createSVGMatrix();
  matrix.e = x;
  matrix.f = y;
  return matrix;
};
const createRotateMatrix = (sin, cos) => {
  const matrix = createSVGMatrix();
  matrix.a = cos;
  matrix.b = sin;
  matrix.c = -sin;
  matrix.d = cos;
  return matrix;
};
const createRotationMatrix = radians => createRotateMatrix(floatToFixed(Math.sin(radians)), floatToFixed(Math.cos(radians)));
const scaleAround = (translateMatrix, scaleX, scaleY) => translateMatrix.multiply(createScaleMatrix(scaleX, scaleY)).multiply(translateMatrix.inverse());
const createScaleMatrix = (x, y) => {
  const matrix = createSVGMatrix();
  matrix.a = x;
  matrix.d = y;
  return matrix;
};
const getTransformToElement = (toElement, g) => {
  var _getScreenCTM, _ref, _getScreenCTM2, _ref2;
  const gTransform = (g === null || g === void 0 || (_getScreenCTM = (_ref = g).getScreenCTM) === null || _getScreenCTM === void 0 ? void 0 : _getScreenCTM.call(_ref)) || createSVGMatrix();
  return gTransform.inverse().multiply((toElement === null || toElement === void 0 || (_getScreenCTM2 = (_ref2 = toElement).getScreenCTM) === null || _getScreenCTM2 === void 0 ? void 0 : _getScreenCTM2.call(_ref2)) || createSVGMatrix());
};
const matrixToString = m => {
  const {
    a,
    b,
    c,
    d,
    e,
    f
  } = m;
  return `matrix(${a},${b},${c},${d},${e},${f})`;
};
const pointTo = (ctm, x, y) => {
  return createSVGPoint(x, y).matrixTransform(ctm);
};
const cloneMatrix = b => {
  const a = createSVGMatrix();
  a.a = b.a;
  a.b = b.b;
  a.c = b.c;
  a.d = b.d;
  a.e = b.e;
  a.f = b.f;
  return a;
};
const isIdentity = matrix => {
  const {
    a,
    b,
    c,
    d,
    e,
    f
  } = matrix;
  return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0;
};
const checkElement = el => {
  const tagName = el.tagName.toLowerCase();
  if (allowedElements.indexOf(tagName) === -1) {
    warn(`Selected element "${tagName}" is not allowed to transform. Allowed elements:\n
            circle, ellipse, image, line, path, polygon, polyline, rect, text, g`);
    return false;
  } else {
    return true;
  }
};
const isSVGGroup = element => element.tagName.toLowerCase() === 'g';
const normalizeString = (str = '') => str.replace(/[\n\r]/g, '').replace(/([^e])-/g, '$1 -').replace(/ +/g, ' ').replace(/(\d*\.)(\d+)(?=\.)/g, '$1$2 ');

// example "101.3,175.5 92.3,162 110.3,162 		"
const parsePoints = pts => normalizeString(pts).trim().split(sepRE).reduce((result, _, index, array) => {
  if (index % 2 === 0) {
    result.push(array.slice(index, index + 2));
  }
  return result;
}, []);
const arrayToChunks = (a, size) => Array.from(new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size));
const childLocalMatrix = (childCTM, transformMatrix) => childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
const groupedChildMatrix = ({
  matrix,
  childCTM
}, transformMatrix) => matrix.multiply(childLocalMatrix(childCTM, transformMatrix));
const isAxisAligned = matrix => Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6;
const keepFixedPoint = (scale, translate, actualStart, actualSize, targetStart, targetSize) => {
  if (Math.abs(1 - scale) < 1e-6 || !targetSize) return 0;
  const fixed = translate / (1 - scale);
  const ratio = (fixed - targetStart) / targetSize;
  return fixed - (actualStart + ratio * actualSize);
};

var svgMatrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arrayToChunks: arrayToChunks,
    checkChildElements: checkChildElements,
    checkElement: checkElement,
    childLocalMatrix: childLocalMatrix,
    cloneMatrix: cloneMatrix,
    createRotateMatrix: createRotateMatrix,
    createRotationMatrix: createRotationMatrix,
    createSVGElement: createSVGElement,
    createSVGMatrix: createSVGMatrix,
    createSVGPoint: createSVGPoint,
    createScaleMatrix: createScaleMatrix,
    createTranslateMatrix: createTranslateMatrix,
    getTransformToElement: getTransformToElement,
    groupedChildMatrix: groupedChildMatrix,
    isAxisAligned: isAxisAligned,
    isIdentity: isIdentity,
    isSVGGroup: isSVGGroup,
    keepFixedPoint: keepFixedPoint,
    matrixToString: matrixToString,
    normalizeString: normalizeString,
    parsePoints: parsePoints,
    pointTo: pointTo,
    scaleAround: scaleAround,
    sepRE: sepRE
});

const {
  entries: entries$2
} = Object;
const ORIGIN_COLOR = '#fe3232';
const GUIDE_COLOR = '#ff3d9a';
const setAttributes = (element, attrs) => {
  entries$2(attrs).forEach(([attr, value]) => element.setAttribute(attr, String(value)));
};
const createHandler = (left, top, color, key) => {
  const handler = createSVGElement('circle', ['sjx-svg-hdl', `sjx-svg-hdl-${key}`]);
  setAttributes(handler, {
    cx: left,
    cy: top,
    r: 4,
    fill: '#fff',
    stroke: color,
    'stroke-width': 1,
    'fill-opacity': 1,
    'vector-effect': 'non-scaling-stroke'
  });
  return handler;
};
const renderLine = ([b, e], color, key) => {
  const handler = createSVGElement('line', ['sjx-svg-line', `sjx-svg-line-${key}`]);
  setAttributes(handler, {
    x1: b.x,
    y1: b.y,
    x2: e.x,
    y2: e.y,
    stroke: color,
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke'
  });
  return handler;
};
const setLineStyle = (line, color) => {
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-dasharray', '3 3');
  line.setAttribute('vector-effect', 'non-scaling-stroke');
};
const renderRadius = (from, to) => {
  const radius = createSVGElement('line', ['sjx-hidden']);
  radius.x1.baseVal.value = from.x;
  radius.y1.baseVal.value = from.y;
  radius.x2.baseVal.value = to.x;
  radius.y2.baseVal.value = to.y;
  setLineStyle(radius, ORIGIN_COLOR);
  radius.setAttribute('opacity', '0.5');
  return radius;
};
const createHitArea = key => {
  const area = createSVGElement('path', ['sjx-svg-hit', `sjx-svg-hit-${key}`, EDGE_KEYS.includes(key) ? 'sjx-svg-hit-edge' : 'sjx-svg-hit-handle']);
  area.setAttribute('data-sjx-handle', key);
  area.setAttribute('fill', 'transparent');
  return area;
};
const readCorners = (top, bottom) => {
  if (!top || !bottom) return null;
  const point = (line, n) => ({
    x: Number(line.getAttribute(`x${n}`)) || 0,
    y: Number(line.getAttribute(`y${n}`)) || 0
  });
  return {
    tl: point(top, 1),
    tr: point(top, 2),
    bl: point(bottom, 1),
    br: point(bottom, 2)
  };
};
const createGuideLine = ({
  axis,
  value,
  from,
  to
}) => {
  const line = createSVGElement('line', ['sjx-svg-guide']);
  const [x1, y1, x2, y2] = axis === 'x' ? [value, from, value, to] : [from, value, to, value];
  setAttributes(line, {
    x1,
    y1,
    x2,
    y2,
    stroke: GUIDE_COLOR,
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke',
    'pointer-events': 'none'
  });
  return line;
};
const screenScale = element => {
  const matrix = element.getScreenCTM();
  return matrix ? Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c)) || 1 : 1;
};

const {
  entries: entries$1
} = Object;
const transformVertices = (vertices, matrix) => entries$1(vertices).reduce((result, [key, [x, y]]) => {
  result[key] = pointTo(matrix, x, y);
  return result;
}, {});
const bBoxPoints = (element, ctm, bBox = element.getBBox()) => {
  const {
    x,
    y,
    width,
    height
  } = bBox;
  return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]].map(([l, t]) => {
    const {
      x: nx,
      y: ny
    } = pointTo(ctm, l, t);
    return [nx, ny];
  });
};
const lineRotator = (start, end, rotatorAnchor, rotatorOffset) => {
  const axisX = end.x - start.x,
    axisY = end.y - start.y;
  const length = Math.sqrt(axisX * axisX + axisY * axisY);
  const [normalX, normalY] = length ? [axisY / length, -axisX / length] : [0, -1];
  const side = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;
  const anchor = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
  return {
    anchor,
    rotator: {
      x: anchor.x + normalX * rotatorOffset * side,
      y: anchor.y + normalY * rotatorOffset * side
    }
  };
};

// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
const dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
const getCommandValuesLength = cmd => [{
  size: 2,
  condition: ['M', 'm', 'L', 'l', 'T', 't'].includes(cmd)
}, {
  size: 1,
  condition: ['H', 'h', 'V', 'v'].includes(cmd)
}, {
  size: 6,
  condition: ['C', 'c'].includes(cmd)
}, {
  size: 4,
  condition: ['S', 's', 'Q', 'q'].includes(cmd)
}, {
  size: 7,
  condition: ['A', 'a'].includes(cmd)
}, {
  size: 1,
  condition: true
}].find(({
  condition
}) => !!condition);
const parsePath = path => {
  let match;
  dRE.lastIndex = 0;
  const serialized = [];
  while (match = dRE.exec(path)) {
    const [, cmd, params] = match;
    const upCmd = cmd.toUpperCase();
    const isRelative = cmd !== upCmd;
    const data = normalizeString(params);
    const values = data.trim().split(sepRE).map(val => {
      if (!isNaN(val)) {
        return Number(val);
      }
    });
    let firstCommand = false;
    const isMoveTo = upCmd === 'M';
    const {
      size: commandLength
    } = getCommandValuesLength(cmd);

    // split big command into multiple commands
    arrayToChunks(values, commandLength).map(chunkedValues => {
      const shouldReplace = firstCommand && isMoveTo;
      firstCommand = firstCommand ? firstCommand : isMoveTo;
      return serialized.push({
        relative: isRelative,
        key: shouldReplace ? 'L' : upCmd,
        cmd: shouldReplace ? isRelative ? 'l' : 'L' : cmd,
        values: chunkedValues
      });
    });
  }
  return reducePathData(absolutizePathData(serialized));
};
const movePath = params => {
  const {
    path,
    dx,
    dy
  } = params;
  try {
    const serialized = parsePath(path);
    let str = '';
    let space = ' ';
    let firstCommand = true;
    for (let i = 0, len = serialized.length; i < len; i++) {
      const item = serialized[i];
      const {
        values,
        key: cmd,
        relative
      } = item;
      const coordinates = [];
      switch (cmd) {
        case 'M':
          {
            for (let k = 0, len = values.length; k < len; k += 2) {
              let [x, y] = values.slice(k, k + 2);
              if (!(relative && !firstCommand)) {
                x += dx;
                y += dy;
              }
              coordinates.push(x, y);
              firstCommand = false;
            }
            break;
          }
        case 'A':
          {
            for (let k = 0, len = values.length; k < len; k += 7) {
              const set = values.slice(k, k + 7);
              if (!relative) {
                set[5] += dx;
                set[6] += dy;
              }
              coordinates.push(...set);
            }
            break;
          }
        case 'C':
          {
            for (let k = 0, len = values.length; k < len; k += 6) {
              const set = values.slice(k, k + 6);
              if (!relative) {
                set[0] += dx;
                set[1] += dy;
                set[2] += dx;
                set[3] += dy;
                set[4] += dx;
                set[5] += dy;
              }
              coordinates.push(...set);
            }
            break;
          }
        case 'H':
          {
            for (let k = 0, len = values.length; k < len; k += 1) {
              const set = values.slice(k, k + 1);
              if (!relative) {
                set[0] += dx;
              }
              coordinates.push(set[0]);
            }
            break;
          }
        case 'V':
          {
            for (let k = 0, len = values.length; k < len; k += 1) {
              const set = values.slice(k, k + 1);
              if (!relative) {
                set[0] += dy;
              }
              coordinates.push(set[0]);
            }
            break;
          }
        case 'L':
        case 'T':
          {
            for (let k = 0, len = values.length; k < len; k += 2) {
              let [x, y] = values.slice(k, k + 2);
              if (!relative) {
                x += dx;
                y += dy;
              }
              coordinates.push(x, y);
            }
            break;
          }
        case 'Q':
        case 'S':
          {
            for (let k = 0, len = values.length; k < len; k += 4) {
              let [x1, y1, x2, y2] = values.slice(k, k + 4);
              if (!relative) {
                x1 += dx;
                y1 += dy;
                x2 += dx;
                y2 += dy;
              }
              coordinates.push(x1, y1, x2, y2);
            }
            break;
          }
        case 'Z':
          {
            values[0] = '';
            space = '';
            break;
          }
      }
      str += cmd + coordinates.join(',') + space;
    }
    return str;
  } catch (err) {
    warn('Path parsing error: ' + err);
  }
};
const resizePath = params => {
  const {
    path,
    localCTM
  } = params;
  try {
    const serialized = parsePath(path);
    let str = '';
    let space = ' ';
    const res = [];
    let firstCommand = true;
    for (let i = 0, len = serialized.length; i < len; i++) {
      const item = serialized[i];
      const {
        values,
        key: cmd,
        relative = false
      } = item;
      switch (cmd) {
        case 'A':
          {
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 7) {
              const [rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y] = values.slice(k, k + 7);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX), floatToFixed(resY));
              mtrx.e = mtrx.f = 0;
              const {
                x: newRx,
                y: newRy
              } = pointTo(mtrx, rx, ry);
              coordinates.unshift(floatToFixed(newRx), floatToFixed(newRy), xAxisRot, largeArcFlag, sweepFlag);
            }
            res.push(coordinates);
            break;
          }
        case 'C':
          {
            // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 6) {
              const [x1, y1, x2, y2, x, y] = values.slice(k, k + 6);
              const {
                x: resX1,
                y: resY1
              } = pointTo(mtrx, x1, y1);
              const {
                x: resX2,
                y: resY2
              } = pointTo(mtrx, x2, y2);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX1), floatToFixed(resY1), floatToFixed(resX2), floatToFixed(resY2), floatToFixed(resX), floatToFixed(resY));
            }
            res.push(coordinates);
            break;
          }
        // this command makes impossible free transform within group
        // it will be converted to L
        case 'H':
          {
            // H x (or h dx)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 1) {
              const [x] = values.slice(k, k + 1);
              const {
                x: resX
              } = pointTo(mtrx, x, 0);
              coordinates.push(floatToFixed(resX));
            }
            res.push(coordinates);
            break;
          }
        // this command makes impossible free transform within group
        // it will be converted to L
        case 'V':
          {
            // V y (or v dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 1) {
              const [y] = values.slice(k, k + 1);
              const {
                y: resY
              } = pointTo(mtrx, 0, y);
              coordinates.push(floatToFixed(resY));
            }
            res.push(coordinates);
            break;
          }
        case 'T':
        case 'L':
          {
            // T x y (or t dx dy)
            // L x y (or l dx dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 2) {
              const [x, y] = values.slice(k, k + 2);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX), floatToFixed(resY));
            }
            res.push(coordinates);
            break;
          }
        case 'M':
          {
            // M x y (or dx dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative && !firstCommand) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 2) {
              const [x, y] = values.slice(k, k + 2);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX), floatToFixed(resY));
              firstCommand = false;
            }
            res.push(coordinates);
            break;
          }
        case 'Q':
          {
            // Q x1 y1, x y (or q dx1 dy1, dx dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 4) {
              const [x1, y1, x, y] = values.slice(k, k + 4);
              const {
                x: resX1,
                y: resY1
              } = pointTo(mtrx, x1, y1);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX1), floatToFixed(resY1), floatToFixed(resX), floatToFixed(resY));
            }
            res.push(coordinates);
            break;
          }
        case 'S':
          {
            // S x2 y2, x y (or s dx2 dy2, dx dy)
            const coordinates = [];
            const mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (let k = 0, len = values.length; k < len; k += 4) {
              const [x2, y2, x, y] = values.slice(k, k + 4);
              const {
                x: resX2,
                y: resY2
              } = pointTo(mtrx, x2, y2);
              const {
                x: resX,
                y: resY
              } = pointTo(mtrx, x, y);
              coordinates.push(floatToFixed(resX2), floatToFixed(resY2), floatToFixed(resX), floatToFixed(resY));
            }
            res.push(coordinates);
            break;
          }
        case 'Z':
          {
            res.push(['']);
            space = '';
            break;
          }
      }
      str += item.key + res[i].join(',') + space;
    }
    return str.trim();
  } catch (err) {
    warn('Path parsing error: ' + err);
  }
};
const absolutizePathData = pathData => {
  let currentX = null,
    currentY = null,
    subpathX = null,
    subpathY = null;
  return pathData.reduce((absolutizedPathData, seg) => {
    const {
      cmd,
      values
    } = seg;
    let nextSeg;
    switch (cmd) {
      case 'M':
        {
          const [x, y] = values;
          nextSeg = {
            key: 'M',
            values: [x, y]
          };
          subpathX = x;
          subpathY = y;
          currentX = x;
          currentY = y;
          break;
        }
      case 'm':
        {
          const [x, y] = values;
          const nextX = currentX + x;
          const nextY = currentY + y;
          nextSeg = {
            key: 'M',
            values: [nextX, nextY]
          };
          subpathX = nextX;
          subpathY = nextY;
          currentX = nextX;
          currentY = nextY;
          break;
        }
      case 'L':
        {
          const [x, y] = values;
          nextSeg = {
            key: 'L',
            values: [x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 'l':
        {
          const [x, y] = values;
          const nextX = currentX + x;
          const nextY = currentY + y;
          nextSeg = {
            key: 'L',
            values: [nextX, nextY]
          };
          currentX = nextX;
          currentY = nextY;
          break;
        }
      case 'C':
        {
          const [x1, y1, x2, y2, x, y] = values;
          nextSeg = {
            key: 'C',
            values: [x1, y1, x2, y2, x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 'c':
        {
          const [x1, y1, x2, y2, x, y] = values;
          const nextValues = [currentX + x1, currentY + y1, currentX + x2, currentY + y2, currentX + x, currentY + y];
          nextSeg = {
            key: 'C',
            values: [...nextValues]
          };
          currentX = nextValues[4];
          currentY = nextValues[5];
          break;
        }
      case 'Q':
        {
          const [x1, y1, x, y] = values;
          nextSeg = {
            key: 'Q',
            values: [x1, y1, x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 'q':
        {
          const [x1, y1, x, y] = values;
          const nextValues = [currentX + x1, currentY + y1, currentX + x, currentY + y];
          absolutizedPathData.push({
            key: 'Q',
            values: [...nextValues]
          });
          currentX = nextValues[2];
          currentY = nextValues[3];
          break;
        }
      case 'A':
        {
          const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;
          nextSeg = {
            key: 'A',
            values: [r1, r2, angle, largeArcFlag, sweepFlag, x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 'a':
        {
          const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;
          const nextX = currentX + x;
          const nextY = currentY + y;
          nextSeg = {
            key: 'A',
            values: [r1, r2, angle, largeArcFlag, sweepFlag, nextX, nextY]
          };
          currentX = nextX;
          currentY = nextY;
          break;
        }
      case 'H':
        {
          const [x] = values;
          nextSeg = {
            key: 'H',
            values: [x]
          };
          currentX = x;
          break;
        }
      case 'h':
        {
          const [x] = values;
          const nextX = currentX + x;
          nextSeg = {
            key: 'H',
            values: [nextX]
          };
          currentX = nextX;
          break;
        }
      case 'V':
        {
          const [y] = values;
          nextSeg = {
            key: 'V',
            values: [y]
          };
          currentY = y;
          break;
        }
      case 'v':
        {
          const [y] = values;
          const nextY = currentY + y;
          nextSeg = {
            key: 'V',
            values: [nextY]
          };
          currentY = nextY;
          break;
        }
      case 'S':
        {
          const [x2, y2, x, y] = values;
          nextSeg = {
            key: 'S',
            values: [x2, y2, x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 's':
        {
          const [x2, y2, x, y] = values;
          const nextValues = [currentX + x2, currentY + y2, currentX + x, currentY + y];
          nextSeg = {
            key: 'S',
            values: [...nextValues]
          };
          currentX = nextValues[2];
          currentY = nextValues[3];
          break;
        }
      case 'T':
        {
          const [x, y] = values;
          nextSeg = {
            key: 'T',
            values: [x, y]
          };
          currentX = x;
          currentY = y;
          break;
        }
      case 't':
        {
          const [x, y] = values;
          const nextX = currentX + x;
          const nextY = currentY + y;
          nextSeg = {
            key: 'T',
            values: [nextX, nextY]
          };
          currentX = nextX;
          currentY = nextY;
          break;
        }
      case 'Z':
      case 'z':
        {
          nextSeg = {
            key: 'Z',
            values: []
          };
          currentX = subpathX;
          currentY = subpathY;
          break;
        }
    }
    return [...absolutizedPathData, nextSeg];
  }, []);
};
const reducePathData = pathData => {
  let lastType = null;
  let lastControlX = null;
  let lastControlY = null;
  let currentX = null;
  let currentY = null;
  let subpathX = null;
  let subpathY = null;
  return pathData.reduce((reducedPathData, seg) => {
    const {
      key,
      values
    } = seg;
    let nextSeg;
    switch (key) {
      case 'M':
        {
          const [x, y] = values;
          nextSeg = [{
            key: 'M',
            values: [x, y]
          }];
          subpathX = x;
          subpathY = y;
          currentX = x;
          currentY = y;
          break;
        }
      case 'C':
        {
          const [x1, y1, x2, y2, x, y] = values;
          nextSeg = [{
            key: 'C',
            values: [x1, y1, x2, y2, x, y]
          }];
          lastControlX = x2;
          lastControlY = y2;
          currentX = x;
          currentY = y;
          break;
        }
      case 'L':
        {
          const [x, y] = values;
          nextSeg = [{
            key: 'L',
            values: [x, y]
          }];
          currentX = x;
          currentY = y;
          break;
        }
      case 'H':
        {
          const [x] = values;
          nextSeg = [{
            key: 'L',
            values: [x, currentY]
          }];
          currentX = x;
          break;
        }
      case 'V':
        {
          const [y] = values;
          nextSeg = [{
            key: 'L',
            values: [currentX, y]
          }];
          currentY = y;
          break;
        }
      case 'S':
        {
          const [x2, y2, x, y] = values;
          let cx1, cy1;
          if (lastType === 'C' || lastType === 'S') {
            cx1 = currentX + (currentX - lastControlX);
            cy1 = currentY + (currentY - lastControlY);
          } else {
            cx1 = currentX;
            cy1 = currentY;
          }
          nextSeg = [{
            key: 'C',
            values: [cx1, cy1, x2, y2, x, y]
          }];
          lastControlX = x2;
          lastControlY = y2;
          currentX = x;
          currentY = y;
          break;
        }
      case 'T':
        {
          const [x, y] = values;
          let x1, y1;
          if (lastType === 'Q' || lastType === 'T') {
            x1 = currentX + (currentX - lastControlX);
            y1 = currentY + (currentY - lastControlY);
          } else {
            x1 = currentX;
            y1 = currentY;
          }
          const cx1 = currentX + 2 * (x1 - currentX) / 3;
          const cy1 = currentY + 2 * (y1 - currentY) / 3;
          const cx2 = x + 2 * (x1 - x) / 3;
          const cy2 = y + 2 * (y1 - y) / 3;
          nextSeg = [{
            key: 'C',
            values: [cx1, cy1, cx2, cy2, x, y]
          }];
          lastControlX = x1;
          lastControlY = y1;
          currentX = x;
          currentY = y;
          break;
        }
      case 'Q':
        {
          const [x1, y1, x, y] = values;
          const cx1 = currentX + 2 * (x1 - currentX) / 3;
          const cy1 = currentY + 2 * (y1 - currentY) / 3;
          const cx2 = x + 2 * (x1 - x) / 3;
          const cy2 = y + 2 * (y1 - y) / 3;
          nextSeg = [{
            key: 'C',
            values: [cx1, cy1, cx2, cy2, x, y]
          }];
          lastControlX = x1;
          lastControlY = y1;
          currentX = x;
          currentY = y;
          break;
        }
      case 'A':
        {
          const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;
          if (r1 === 0 || r2 === 0) {
            nextSeg = [{
              key: 'C',
              values: [currentX, currentY, x, y, x, y]
            }];
            currentX = x;
            currentY = y;
          } else {
            if (currentX !== x || currentY !== y) {
              const curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
              nextSeg = curves.map(curve => ({
                key: 'C',
                values: curve
              }));
              currentX = x;
              currentY = y;
            }
          }
          break;
        }
      case 'Z':
        {
          nextSeg = [seg];
          currentX = subpathX;
          currentY = subpathY;
          break;
        }
    }
    lastType = key;
    return [...reducedPathData, ...nextSeg];
  }, []);
};

//  - a2c() by Dmitry Baranovskiy (MIT License)
//  https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.js#L2216
const arcToCubicCurves = (x1, y1, x2, y2, rx, ry, xAxisRot, largeArcFlag, sweepFlag, recursive) => {
  const degToRad = deg => Math.PI * deg / 180;
  const rotate = (x, y, rad) => ({
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad)
  });
  const angleRad = degToRad(xAxisRot);
  let params = [];
  let f1, f2, cx, cy;
  if (recursive) {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  } else {
    const p1 = rotate(x1, y1, -angleRad);
    x1 = p1.x;
    y1 = p1.y;
    const p2 = rotate(x2, y2, -angleRad);
    x2 = p2.x;
    y2 = p2.y;
    const x = (x1 - x2) / 2;
    const y = (y1 - y2) / 2;
    let h = x * x / (rx * rx) + y * y / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    let sign = largeArcFlag === sweepFlag ? -1 : 1;
    const r1Pow = rx * rx;
    const r2Pow = ry * ry;
    const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
    const right = r1Pow * y * y + r2Pow * x * x;
    let k = sign * Math.sqrt(Math.abs(left / right));
    cx = k * rx * y / ry + (x1 + x2) / 2;
    cy = k * -ry * x / rx + (y1 + y2) / 2;
    f1 = Math.asin(parseFloat(((y1 - cy) / ry).toFixed(9)));
    f2 = Math.asin(parseFloat(((y2 - cy) / ry).toFixed(9)));
    if (x1 < cx) {
      f1 = Math.PI - f1;
    }
    if (x2 < cx) {
      f2 = Math.PI - f2;
    }
    if (f1 < 0) {
      f1 = Math.PI * 2 + f1;
    }
    if (f2 < 0) {
      f2 = Math.PI * 2 + f2;
    }
    if (sweepFlag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweepFlag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  }
  let df = f2 - f1;
  if (Math.abs(df) > Math.PI * 120 / 180) {
    let f2old = f2;
    let x2old = x2;
    let y2old = y2;
    const ratio = sweepFlag && f2 > f1 ? 1 : -1;
    f2 = f1 + Math.PI * 120 / 180 * ratio;
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    params = arcToCubicCurves(x2, y2, x2old, y2old, rx, ry, xAxisRot, 0, sweepFlag, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  let c1 = Math.cos(f1);
  let s1 = Math.sin(f1);
  let c2 = Math.cos(f2);
  let s2 = Math.sin(f2);
  let t = Math.tan(df / 4);
  let hx = 4 / 3 * rx * t;
  let hy = 4 / 3 * ry * t;
  let m1 = [x1, y1];
  let m2 = [x1 + hx * s1, y1 - hy * c1];
  let m3 = [x2 + hx * s2, y2 - hy * c2];
  let m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4, ...params];
  } else {
    params = [m2, m3, m4, ...params].join().split(',');
    const curves = [];
    let curveParams = [];
    params.forEach((_, i) => {
      if (i % 2) {
        curveParams.push(rotate(params[i - 1], params[i], angleRad).y);
      } else {
        curveParams.push(rotate(params[i], params[i + 1], angleRad).x);
      }
      if (curveParams.length === 6) {
        curves.push(curveParams);
        curveParams = [];
      }
    });
    return curves;
  }
};

const applyTranslate = (element, {
  x,
  y
}) => {
  const attrs = [];
  switch (element.tagName.toLowerCase()) {
    case 'text':
      {
        const el = element;
        const resX = isDef(el.x.baseVal[0]) ? el.x.baseVal[0].value + x : (Number(element.getAttribute('x')) || 0) + x;
        const resY = isDef(el.y.baseVal[0]) ? el.y.baseVal[0].value + y : (Number(element.getAttribute('y')) || 0) + y;
        attrs.push(['x', resX], ['y', resY]);
        break;
      }
    case 'foreignobject':
    case 'use':
    case 'image':
    case 'rect':
      {
        const el = element;
        const resX = isDef(el.x.baseVal.value) ? el.x.baseVal.value + x : (Number(element.getAttribute('x')) || 0) + x;
        const resY = isDef(el.y.baseVal.value) ? el.y.baseVal.value + y : (Number(element.getAttribute('y')) || 0) + y;
        attrs.push(['x', resX], ['y', resY]);
        break;
      }
    case 'circle':
    case 'ellipse':
      {
        const el = element;
        const resX = el.cx.baseVal.value + x,
          resY = el.cy.baseVal.value + y;
        attrs.push(['cx', resX], ['cy', resY]);
        break;
      }
    case 'line':
      {
        const el = element;
        const resX1 = el.x1.baseVal.value + x,
          resY1 = el.y1.baseVal.value + y,
          resX2 = el.x2.baseVal.value + x,
          resY2 = el.y2.baseVal.value + y;
        attrs.push(['x1', resX1], ['y1', resY1], ['x2', resX2], ['y2', resY2]);
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        const points = parsePoints(element.getAttribute('points'));
        const result = points.map(item => {
          item[0] = String(Number(item[0]) + x);
          item[1] = String(Number(item[1]) + y);
          return item.join(' ');
        }).join(' ');
        attrs.push(['points', result]);
        break;
      }
    case 'path':
      {
        const path = element.getAttribute('d');
        attrs.push(['d', movePath({
          path,
          dx: x,
          dy: y
        })]);
        break;
      }
  }
  attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};
const translateElement = (element, {
  matrix,
  parentMatrix
}, {
  dx,
  dy,
  ox,
  oy
}) => {
  const eM = createTranslateMatrix(ox, oy);
  element.setAttribute('transform', matrixToString(eM.multiply(matrix).multiply(eM.inverse())));
  if (!isSVGGroup(element)) {
    applyTranslate(element, {
      x: ox,
      y: oy
    });
    return;
  }
  checkChildElements(element).forEach(child => {
    const childM = createTranslateMatrix(dx, dy);
    const translateMatrix = childM.multiply(getTransformToElement(child, child.parentNode)).multiply(childM.inverse());
    if (!isIdentity(translateMatrix)) {
      child.setAttribute('transform', matrixToString(translateMatrix));
    }
    if (!isSVGGroup(child)) {
      const ctm = parentMatrix.inverse();
      ctm.e = ctm.f = 0;
      applyTranslate(child, pointTo(ctm, ox, oy));
    }
  });
};

const applyResize = (element, data) => {
  const {
    scaleX,
    scaleY,
    localCTM,
    __data__,
    transformMatrix,
    isGrouped
  } = data;
  const attrs = [];
  const storedData = __data__.get(element);
  switch (element.tagName.toLowerCase()) {
    case 'text':
    case 'tspan':
      {
        if (isGrouped && element.tagName.toLowerCase() === 'text') {
          attrs.push(['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]);
          break;
        }
        const {
          x,
          y,
          textLength,
          fontSize,
          textBox
        } = storedData;
        const absX = Math.abs(scaleX),
          absY = Math.abs(scaleY);
        const corners = [[textBox.x, textBox.y], [textBox.x + textBox.width, textBox.y + textBox.height]].map(([px, py]) => pointTo(localCTM, px, py));
        const left = Math.min(corners[0].x, corners[1].x),
          top = Math.min(corners[0].y, corners[1].y);
        const textElement = element;
        const nextFontSize = fontSize * absY;
        if (textElement.style.fontSize) {
          textElement.style.fontSize = `${nextFontSize}px`;
        } else {
          textElement.setAttribute('font-size', String(nextFontSize));
        }
        textElement.setAttribute('textLength', String(absX * textLength));
        textElement.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        const nextX = left + (x - textBox.x) * absX,
          nextY = top + (y - textBox.y) * absY;
        textElement.setAttribute('x', String(nextX));
        textElement.setAttribute('y', String(nextY));
        const actual = textElement.getBBox();
        attrs.push(['x', nextX + keepFixedPoint(localCTM.a, localCTM.e, actual.x, actual.width, left, textBox.width * absX)], ['y', nextY + keepFixedPoint(localCTM.d, localCTM.f, actual.y, actual.height, top, textBox.height * absY)]);
        break;
      }
    case 'circle':
      {
        const {
            r,
            cx,
            cy
          } = storedData,
          newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
        const {
          x: resX,
          y: resY
        } = pointTo(localCTM, cx, cy);
        attrs.push(['r', newR], ['cx', resX], ['cy', resY]);
        break;
      }
    case 'foreignobject':
    case 'image':
    case 'rect':
      {
        if (!isGrouped) {
          const {
            width,
            height,
            x,
            y
          } = storedData;
          const {
            x: resX,
            y: resY
          } = pointTo(localCTM, x, y);
          const newWidth = Math.abs(width * scaleX),
            newHeight = Math.abs(height * scaleY);
          attrs.push(['x', resX - (scaleX < 0 ? newWidth : 0)], ['y', resY - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
        } else {
          const local = childLocalMatrix(storedData.childCTM, transformMatrix);
          if (!isAxisAligned(local)) {
            attrs.push(['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]);
            break;
          }
          const {
            width,
            height,
            x,
            y
          } = storedData;
          const start = pointTo(local, x, y),
            end = pointTo(local, x + width, y + height);
          attrs.push(['x', Math.min(start.x, end.x)], ['y', Math.min(start.y, end.y)], ['width', Math.abs(end.x - start.x)], ['height', Math.abs(end.y - start.y)]);
        }
        break;
      }
    case 'ellipse':
      {
        const {
          rx,
          ry,
          cx,
          cy
        } = storedData;
        const {
          x: cx1,
          y: cy1
        } = pointTo(localCTM, cx, cy);
        const scaleMatrix = createSVGMatrix();
        scaleMatrix.a = scaleX;
        scaleMatrix.d = scaleY;
        const {
          x: nRx,
          y: nRy
        } = pointTo(scaleMatrix, rx, ry);
        attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
        break;
      }
    case 'line':
      {
        const {
          resX1,
          resY1,
          resX2,
          resY2
        } = storedData;
        const {
          x: resX1_,
          y: resY1_
        } = pointTo(localCTM, resX1, resY1);
        const {
          x: resX2_,
          y: resY2_
        } = pointTo(localCTM, resX2, resY2);
        attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        const {
          points
        } = storedData;
        const result = parsePoints(points).map(item => {
          const {
            x,
            y
          } = pointTo(localCTM, Number(item[0]), Number(item[1]));
          item[0] = String(floatToFixed(x));
          item[1] = String(floatToFixed(y));
          return item.join(' ');
        }).join(' ');
        attrs.push(['points', result]);
        break;
      }
    case 'path':
      {
        const {
          path
        } = storedData;
        attrs.push(['d', resizePath({
          path: path,
          localCTM
        })]);
        break;
      }
  }
  attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};
const resizeElement = (element, params) => {
  const {
    transformMatrix,
    isGrouped
  } = params;
  if (!isSVGGroup(element) && !isGrouped) {
    applyResize(element, {
      ...params,
      localCTM: transformMatrix
    });
    return;
  }
  checkChildElements(element).forEach(child => {
    if (isSVGGroup(child)) return;
    const childCTM = getTransformToElement(child, isGrouped ? element.parentNode : element);
    applyResize(child, {
      ...params,
      localCTM: childCTM.inverse().multiply(transformMatrix).multiply(childCTM)
    });
  });
};

const readAttributes = (element, container, isGrouped) => {
  let data = null;
  switch (element.tagName.toLowerCase()) {
    case 'text':
      {
        const el = element;
        const x = isDef(el.x.baseVal[0]) ? el.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
        const y = isDef(el.y.baseVal[0]) ? el.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
        const textLength = isDef(el.textLength.baseVal) ? el.textLength.baseVal.value : Number(element.getAttribute('textLength')) || null;
        const {
          x: bx,
          y: by,
          width,
          height
        } = el.getBBox();
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        data = {
          x,
          y,
          textLength,
          fontSize,
          textBox: {
            x: bx,
            y: by,
            width,
            height
          }
        };
        break;
      }
    case 'circle':
      {
        const el = element;
        const r = el.r.baseVal.value,
          cx = el.cx.baseVal.value,
          cy = el.cy.baseVal.value;
        data = {
          r,
          cx,
          cy
        };
        break;
      }
    case 'foreignobject':
    case 'image':
    case 'rect':
      {
        const el = element;
        const width = el.width.baseVal.value,
          height = el.height.baseVal.value,
          x = el.x.baseVal.value,
          y = el.y.baseVal.value;
        data = {
          width,
          height,
          x,
          y
        };
        break;
      }
    case 'ellipse':
      {
        const el = element;
        const rx = el.rx.baseVal.value,
          ry = el.ry.baseVal.value,
          cx = el.cx.baseVal.value,
          cy = el.cy.baseVal.value;
        data = {
          rx,
          ry,
          cx,
          cy
        };
        break;
      }
    case 'line':
      {
        const el = element;
        const resX1 = el.x1.baseVal.value,
          resY1 = el.y1.baseVal.value,
          resX2 = el.x2.baseVal.value,
          resY2 = el.y2.baseVal.value;
        data = {
          resX1,
          resY1,
          resX2,
          resY2
        };
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        const points = element.getAttribute('points');
        data = {
          points
        };
        break;
      }
    case 'path':
      {
        const path = element.getAttribute('d');
        data = {
          path
        };
        break;
      }
  }
  return {
    ...data,
    matrix: getTransformToElement(element, element.parentNode),
    ctm: getTransformToElement(element.parentNode, container),
    childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
  };
};

const {
  E_DRAG,
  E_RESIZE,
  E_ROTATE
} = EVENT_EMITTER_CONSTANTS;
const {
  E_MOUSEDOWN: E_MOUSEDOWN$1,
  E_TOUCHSTART: E_TOUCHSTART$1
} = CLIENT_EVENTS_CONSTANTS;
const {
  START_POINT,
  END_POINT
} = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_POINT_KEYS;
const {
  entries,
  values
} = Object;
const BOX_HANDLES = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];
const LINE_HANDLES = [START_POINT, END_POINT];
class DraggableSVG extends Transformable {
  /** @internal */
  init(elements) {
    const {
      options: {
        container,
        controlsContainer,
        rotatable,
        transformOrigin,
        restrict,
        hitRadius,
        showHitAreas
      }
    } = this;
    const hitAreas = {};
    const wrapper = createSVGElement('g', showHitAreas ? ['sjx-svg-wrapper', 'sjx-show-hit'] : ['sjx-svg-wrapper']);
    const controls = createSVGElement('g', ['sjx-svg-controls']);
    const hitOverlay = hitRadius && showHitAreas ? createSVGElement('path', ['sjx-svg-hit-overlay']) : undefined;
    if (hitOverlay) {
      hitOverlay.setAttribute('pointer-events', 'none');
      controls.appendChild(hitOverlay);
    }
    const {
      rotator = null,
      anchor = null,
      ...vertices
    } = this.getVertices();
    const origin = Array.isArray(transformOrigin) ? pointTo(createSVGMatrix(), transformOrigin[0], transformOrigin[1]) : vertices.center;
    const rotationHandles = rotatable ? this.renderRotationHandles(controls, [anchor, rotator], vertices.center, origin) : {};
    const edgeHandles = this.renderEdges(controls, vertices, hitAreas);
    const pointHandles = this.renderPoints(controls, {
      ...this.resizingPoints(vertices),
      rotator,
      center: transformOrigin && rotatable ? origin : undefined
    }, hitAreas);
    wrapper.appendChild(controls);
    controlsContainer.appendChild(wrapper);
    const data = new WeakMap();
    elements.forEach(element => data.set(element, {
      parent: element.parentNode,
      transform: {
        ctm: getTransformToElement(element, container)
      },
      bBox: element.getBBox(),
      __data__: new WeakMap(),
      cached: {}
    }));
    const restrictContainer = restrict || container;
    this.storage = {
      wrapper,
      controls,
      handles: {
        ...edgeHandles,
        ...pointHandles,
        ...rotationHandles
      },
      data,
      center: {
        isShifted: Array.isArray(transformOrigin)
      },
      transformOrigin: origin,
      transform: {
        containerMatrix: getTransformToElement(restrictContainer, restrictContainer.parentNode)
      },
      cached: {},
      hitAreas,
      hitOverlay
    };
    this.syncHitAreas();
    [...elements, controls].forEach(target => helper(target).on(E_MOUSEDOWN$1, this.onMouseDown).on(E_TOUCHSTART$1, this.onTouchStart));
  }

  /** @internal */
  renderRotationHandles(controls, normalPoints, center, origin) {
    const {
      showNormal,
      transformOrigin
    } = this.options;
    const normal = showNormal ? renderLine(normalPoints, THEME_COLOR, 'normal') : null;
    if (normal) controls.appendChild(normal);
    const radius = transformOrigin ? renderRadius(center, origin) : null;
    if (radius) controls.appendChild(radius);
    return {
      normal,
      radius
    };
  }

  /** @internal */
  renderEdges(controls, vertices, hitAreas) {
    const {
      hitRadius
    } = this.options;
    const line = this.getLine();
    const handles = {};
    entries(edgeSegments(vertices)).forEach(([key, segment]) => {
      const edge = renderLine(segment, THEME_COLOR, key);
      const isEnabled = !line && this.isHandleEnabled(key);
      if (!isEnabled) edge.setAttribute('pointer-events', 'none');
      if (line) edge.setAttribute('visibility', 'hidden');
      if (hitRadius && isEnabled) {
        hitAreas[key] = createHitArea(key);
        controls.appendChild(hitAreas[key]);
      }
      controls.appendChild(edge);
      handles[key] = edge;
    });
    return handles;
  }

  /** @internal */
  resizingPoints(vertices) {
    if (!this.options.resizable) return {};
    return (this.getLine() ? LINE_HANDLES : BOX_HANDLES).filter(key => this.isHandleEnabled(key)).reduce((result, key) => {
      result[key] = vertices[key];
      return result;
    }, {});
  }

  /** @internal */
  renderPoints(controls, points, hitAreas) {
    const {
      hitRadius
    } = this.options;
    const handles = {};
    entries(points).forEach(([key, point]) => {
      if (!point) return;
      const handle = createHandler(point.x, point.y, key === 'center' ? ORIGIN_COLOR : THEME_COLOR, key);
      if (hitRadius) {
        hitAreas[key] = createHitArea(key);
        controls.appendChild(hitAreas[key]);
      }
      controls.appendChild(handle);
      handles[key] = handle;
    });
    return handles;
  }

  /** @internal */
  cursorPoint({
    clientX,
    clientY
  }) {
    const {
      container
    } = this.options;
    return this.applyMatrixToPoint(container.getScreenCTM().inverse(), clientX, clientY);
  }

  /** @internal */
  getRestrictedBBox(force = false) {
    const {
      storage: {
        transform: {
          containerMatrix
        } = {}
      } = {},
      options: {
        container,
        restrict
      } = {}
    } = this;
    const restrictEl = restrict || container;
    return bBoxPoints(restrictEl, force ? getTransformToElement(restrictEl, container) : containerMatrix);
  }

  /** @internal */
  pointToTransform({
    x,
    y,
    matrix
  }) {
    const nextMatrix = matrix.inverse();
    nextMatrix.e = nextMatrix.f = 0;
    return this.applyMatrixToPoint(nextMatrix, x, y);
  }

  /** @internal */
  pointToControls({
    x,
    y
  }, transform = this.storage.transform) {
    const matrix = transform.controlsMatrix.inverse();
    matrix.e = matrix.f = 0;
    return this.applyMatrixToPoint(matrix, x, y);
  }

  /** @internal */
  applyMatrixToPoint(matrix, x, y) {
    const pt = createSVGElement('svg').createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(matrix);
  }

  /** @internal */
  applyTransformToElement(element, actionName) {
    const {
      storage: {
        data,
        bBox
      } = {},
      options: {
        isGrouped,
        scalable,
        applyTranslate
      } = {}
    } = this;
    const {
      cached = {},
      ...nextData
    } = data.get(element);
    const {
      transform,
      __data__
    } = nextData;
    const {
      scaleX,
      scaleY,
      dist,
      transformMatrix
    } = cached;
    if (actionName === E_DRAG) {
      if (!applyTranslate || !dist || !dist.dx && !dist.dy) return;
      translateElement(element, transform, dist);
    }
    if (actionName === E_RESIZE) {
      if (!transformMatrix) return;
      if (!scalable) {
        resizeElement(element, {
          dx: dist === null || dist === void 0 ? void 0 : dist.dx,
          dy: dist === null || dist === void 0 ? void 0 : dist.dy,
          scaleX: scaleX,
          scaleY: scaleY,
          transformMatrix,
          bBox,
          __data__,
          isGrouped
        });
      }
    }
    data.set(element, {
      ...nextData
    });
  }

  /** @internal */
  processActions(actionName) {
    const {
      storage: {
        transform: {
          controlsMatrix
        },
        center: {
          isShifted
        } = {}
      },
      options: {
        isGrouped
      }
    } = this;
    if (!isGrouped || actionName !== E_ROTATE) return;
    this.applyTransformToHandles();
    const {
      x: dx,
      y: dy
    } = pointTo(controlsMatrix, 0, 0);
    if (isShifted) this.moveCenterHandle(dx, dy);
    this.updateControlsView();
    if (!isShifted) this.setTransformOrigin({
      dx: 0,
      dy: 0
    }, false);
  }

  /** @internal */
  resizeScale({
    dx,
    dy
  }) {
    const {
      storage: {
        doW,
        doH,
        bBox: {
          width,
          height
        }
      },
      options: {
        proportions,
        flip
      }
    } = this;
    return resizeBox({
      width,
      height,
      dx,
      dy,
      doW,
      doH,
      proportions,
      flip
    });
  }

  /** @internal */
  scaleMatrixOf(element, scaleX, scaleY) {
    const {
      translateMatrix
    } = this.storage.data.get(element).transform.auxiliary.scale;
    return scaleAround(translateMatrix, scaleX, scaleY);
  }

  /** @internal */
  rotatedMatrix(element, radians) {
    const {
      matrix,
      parentMatrix,
      auxiliary: {
        rotate: {
          translateMatrix
        }
      }
    } = this.storage.data.get(element).transform;
    parentMatrix.e = parentMatrix.f = 0;
    const localRotation = parentMatrix.inverse().multiply(createRotationMatrix(radians)).multiply(parentMatrix);
    return translateMatrix.multiply(localRotation).multiply(translateMatrix.inverse()).multiply(matrix);
  }

  /** @internal */
  parentDelta(element, {
    dx,
    dy
  }) {
    const {
      parentMatrix
    } = this.storage.data.get(element).transform.auxiliary.translate;
    parentMatrix.e = parentMatrix.f = 0;
    return pointTo(parentMatrix, dx, dy);
  }

  /** @internal */
  processResize(element, delta) {
    const {
      storage: {
        revX,
        revY,
        doW,
        doH,
        data,
        bBox: {
          x,
          y,
          width: boxWidth,
          height: boxHeight
        }
      },
      options: {
        isGrouped,
        scalable
      }
    } = this;
    const elementData = data.get(element);
    const {
      transform: {
        matrix
      },
      cached = {}
    } = elementData;
    const [scaleX, scaleY, newWidth, newHeight] = this.resizeScale(delta);
    const scaleMatrix = this.scaleMatrixOf(element, scaleX, scaleY);
    const deltaW = newWidth - boxWidth,
      deltaH = newHeight - boxHeight;
    const newX = x - deltaW * (doH ? 0.5 : revX ? 1 : 0),
      newY = y - deltaH * (doW ? 0.5 : revY ? 1 : 0);
    const resultMatrix = isGrouped ? scaleMatrix.multiply(matrix) : matrix.multiply(scaleMatrix);
    if (scalable) this.updateElementView(element, resultMatrix);
    data.set(element, {
      ...elementData,
      cached: {
        ...cached,
        scaleX,
        scaleY,
        transformMatrix: scaleMatrix,
        resultMatrix
      }
    });
    this.applyTransformToElement(element, E_RESIZE);
    return {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      transform: resultMatrix
    };
  }

  /** @internal */
  processMove(element, delta) {
    const {
      data
    } = this.storage;
    const elementStorage = data.get(element);
    const {
      transform: {
        matrix,
        auxiliary: {
          translate: {
            translateMatrix
          }
        }
      },
      cached
    } = elementStorage;
    const {
      x: nx,
      y: ny
    } = this.parentDelta(element, delta);
    data.set(element, {
      ...elementStorage,
      cached: {
        ...cached,
        dist: {
          dx: floatToFixed(delta.dx),
          dy: floatToFixed(delta.dy),
          ox: floatToFixed(nx),
          oy: floatToFixed(ny)
        }
      }
    });
    translateMatrix.e = nx;
    translateMatrix.f = ny;
    const moveElementMtrx = translateMatrix.multiply(matrix);
    this.updateElementView(element, moveElementMtrx);
    return moveElementMtrx;
  }

  /** @internal */
  processRotate(element, radians) {
    const resultMatrix = this.rotatedMatrix(element, radians);
    this.updateElementView(element, resultMatrix);
    return resultMatrix;
  }

  /** @internal */
  getElementState(element, {
    revX,
    revY,
    doW,
    doH
  }) {
    const {
      options: {
        container,
        isGrouped
      },
      storage: {
        data,
        controls,
        handles: {
          center: cHandle
        },
        transformOrigin: {
          x: originX,
          y: originY
        }
      }
    } = this;
    const elementData = data.get(element);
    const {
      __data__
    } = elementData;
    __data__.delete(element);
    checkChildElements(element).forEach(child => __data__.set(child, readAttributes(child, element, isGrouped)));
    const bBox = this.getBBox();
    const {
      x: elX,
      y: elY,
      width: elW,
      height: elH
    } = bBox;
    const elMatrix = getTransformToElement(element, element.parentNode),
      ctm = getTransformToElement(element, container),
      parentMatrix = getTransformToElement(element.parentNode, container);
    const parentMatrixInverted = parentMatrix.inverse();
    const scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
      scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);
    const boxCTM = getTransformToElement(controls, container);
    const elCenterX = elX + elW / 2,
      elCenterY = elY + elH / 2;

    // c-handle's coordinates
    const {
      x: bcx,
      y: bcy
    } = pointTo(boxCTM, originX, originY);

    // element's center coordinates
    const {
      x: elcx,
      y: elcy
    } = cHandle ? pointTo(parentMatrixInverted, bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : elMatrix, elCenterX, elCenterY);
    const {
      x: nextScaleX,
      y: nextScaleY
    } = cHandle ? pointTo(isGrouped ? parentMatrixInverted : ctm.inverse(), bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : createSVGMatrix(), scaleX, scaleY);
    const transform = {
      auxiliary: {
        scale: {
          scaleMatrix: createSVGMatrix(),
          translateMatrix: createTranslateMatrix(nextScaleX, nextScaleY)
        },
        translate: {
          parentMatrix: parentMatrixInverted,
          translateMatrix: createSVGMatrix()
        },
        rotate: {
          translateMatrix: createTranslateMatrix(elcx, elcy)
        }
      },
      matrix: elMatrix,
      ctm,
      parentMatrix,
      scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
      scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
    };
    return {
      transform,
      bBox
    };
  }

  /** @internal */
  getCommonState() {
    const {
      elements,
      options: {
        isGrouped,
        container,
        restrict
      },
      storage: {
        controls,
        handles: {
          center: cHandle
        }
      }
    } = this;
    const bBox = this.getBBox();
    const {
      x: elX,
      y: elY,
      width: elW,
      height: elH
    } = bBox;
    const elCenterX = elX + elW / 2,
      elCenterY = elY + elH / 2;
    const boxCTM = getTransformToElement(controls, container);
    const centerX = cHandle ? cHandle.cx.baseVal.value : elCenterX;
    const centerY = cHandle ? cHandle.cy.baseVal.value : elCenterY;

    // c-handle's coordinates
    const {
      x: bcx,
      y: bcy
    } = pointTo(boxCTM, centerX, centerY);

    // box's center coordinates
    const {
      x: rcx,
      y: rcy
    } = pointTo(isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container), elCenterX, elCenterY);
    const restrictContainer = restrict || container;
    const containerMatrix = getTransformToElement(restrictContainer, restrictContainer.parentNode);
    const center = {
      ...(this.storage.center || {}),
      x: cHandle ? bcx : rcx,
      y: cHandle ? bcy : rcy,
      hx: cHandle ? cHandle.cx.baseVal.value : null,
      hy: cHandle ? cHandle.cy.baseVal.value : null
    };
    return {
      transform: {
        containerMatrix,
        controlsMatrix: getTransformToElement(controls, controls.parentNode),
        controlsTranslateMatrix: createSVGMatrix(),
        wrapperOriginMatrix: createTranslateMatrix(center.x, center.y)
      },
      bBox,
      center
    };
  }

  /**
   * Handle positions as { x, y } in container coordinates: box corners and edge
   * midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, line endpoints (p1, p2)
   * for a single <line>, and rotator with its anchor when rotatable
   * @param transformMatrix matrix applied on top of the element transform
   */
  getVertices(transformMatrix = createSVGMatrix()) {
    const {
      elements,
      options: {
        isGrouped,
        rotatable,
        rotatorAnchor,
        rotatorOffset,
        container
      }
    } = this;
    const local = boxVertices(this.getBBox());
    const line = this.getLine();
    if (line) {
      local[START_POINT] = [line.x1.baseVal.value, line.y1.baseVal.value];
      local[END_POINT] = [line.x2.baseVal.value, line.y2.baseVal.value];
    }
    const matrix = isGrouped ? transformMatrix : transformMatrix.multiply(getTransformToElement(elements[0], container));
    const vertices = transformVertices(local, matrix);
    if (!rotatable) return vertices;
    const {
      anchor,
      rotator
    } = line ? lineRotator(vertices[START_POINT], vertices[END_POINT], rotatorAnchor, rotatorOffset) : rotatorPlacement(vertices, rotatorAnchor, rotatorOffset);
    vertices.rotator = rotator;
    vertices.anchor = anchor;
    return vertices;
  }

  /** @internal */
  getLine() {
    const {
      elements: [element],
      options: {
        isGrouped
      }
    } = this;
    return !isGrouped && element.tagName.toLowerCase() === 'line' ? element : null;
  }

  /** @internal */
  getBBox() {
    const {
      elements,
      options: {
        container,
        isGrouped
      }
    } = this;
    if (!isGrouped) return elements[0].getBBox();
    const groupBBox = elements.reduce((result, element) => [...result, ...bBoxPoints(element, getTransformToElement(element, container))], []);
    const [[minX, maxX], [minY, maxY]] = getMinMaxOfArray(groupBBox);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /** @internal */
  moveCenterHandle(dx, dy) {
    const {
      storage: {
        handles: {
          center,
          radius
        },
        center: prevCenterData,
        transform: {
          controlsMatrix = createSVGMatrix()
        } = {},
        transformOrigin: {
          x: originX,
          y: originY
        } = {},
        cached
      }
    } = this;
    if (isUndef(center)) return;
    const nextX = originX + dx,
      nextY = originY + dy;
    center.cx.baseVal.value = nextX;
    center.cy.baseVal.value = nextY;
    radius.x2.baseVal.value = nextX;
    radius.y2.baseVal.value = nextY;
    this.storage = {
      ...this.storage,
      center: {
        ...prevCenterData,
        isShifted: true,
        ...pointTo(controlsMatrix.inverse(), nextX, nextY)
      },
      cached: {
        ...cached,
        transformOrigin: pointTo(createSVGMatrix(), nextX, nextY)
      }
    };
    this.syncHitAreas();
  }

  /** @internal */
  processMoveRestrict(element, delta) {
    const {
      matrix
    } = this.storage.data.get(element).transform;
    const {
      x,
      y
    } = this.parentDelta(element, delta);
    return this.restrictHandler(element, createTranslateMatrix(x, y).multiply(matrix));
  }

  /** @internal */
  processRotateRestrict(element, radians) {
    return this.restrictHandler(element, this.rotatedMatrix(element, radians));
  }

  /** @internal */
  processResizeRestrict(element, delta) {
    const {
      matrix
    } = this.storage.data.get(element).transform;
    const [scaleX, scaleY] = this.resizeScale(delta);
    return this.restrictHandler(element, matrix.multiply(this.scaleMatrixOf(element, scaleX, scaleY)));
  }

  /** @internal */
  processPointMove(element, point, {
    dx,
    dy
  }) {
    const {
      storage: {
        data,
        restriction
      },
      options: {
        proportions
      }
    } = this;
    const {
      transform: {
        ctm,
        matrix
      },
      __data__
    } = data.get(element);
    const {
      resX1,
      resY1,
      resX2,
      resY2
    } = __data__.get(element);
    const isStart = point === START_POINT;
    const [baseX, baseY, otherX, otherY] = isStart ? [resX1, resY1, resX2, resY2] : [resX2, resY2, resX1, resY1];
    const toLocal = ctm.inverse();
    toLocal.e = toLocal.f = 0;
    let {
      x: localDx,
      y: localDy
    } = pointTo(toLocal, dx, dy);
    if (proportions) {
      const axisX = baseX - otherX,
        axisY = baseY - otherY;
      const axisLength = axisX * axisX + axisY * axisY;
      if (axisLength > 0) {
        const projection = (localDx * axisX + localDy * axisY) / axisLength;
        localDx = axisX * projection;
        localDy = axisY * projection;
      }
    }
    const nextX = baseX + localDx,
      nextY = baseY + localDy;
    if (restriction) {
      const {
        x,
        y
      } = pointTo(ctm, nextX, nextY);
      const {
        area
      } = restriction;
      const tolerance = 1e-6;
      if (x < area.left - tolerance || x > area.right + tolerance || y < area.top - tolerance || y > area.bottom + tolerance) return null;
    }
    element.setAttribute(isStart ? 'x1' : 'x2', String(nextX));
    element.setAttribute(isStart ? 'y1' : 'y2', String(nextY));
    this.processControlsResize();
    const {
      width,
      height
    } = element.getBBox();
    return {
      width,
      height,
      transform: matrix
    };
  }

  /** @internal */
  processControlsResize() {
    const {
      storage: {
        transform: {
          controlsMatrix
        }
      } = {}
    } = this;
    this.applyTransformToHandles({
      boxMatrix: controlsMatrix.inverse()
    });
  }

  /** @internal */
  processControlsMove({
    dx,
    dy
  }) {
    const {
      storage: {
        transform: {
          controlsMatrix,
          controlsTranslateMatrix
        },
        center
      } = {}
    } = this;
    controlsTranslateMatrix.e = dx;
    controlsTranslateMatrix.f = dy;
    const moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);
    this.updateControlsView(moveControlsMtrx);
    if (center.isShifted) {
      const centerTransformMatrix = controlsMatrix.inverse();
      centerTransformMatrix.e = centerTransformMatrix.f = 0;
      const {
        x: cx,
        y: cy
      } = pointTo(centerTransformMatrix, dx, dy);
      this.moveCenterHandle(-cx, -cy);
    }
  }

  /** @internal */
  processControlsRotate({
    radians
  }) {
    const {
      options: {
        isGrouped
      },
      storage: {
        transform: {
          controlsMatrix,
          wrapperOriginMatrix
        } = {}
      } = {}
    } = this;
    if (isGrouped) {
      const wrapperResultMatrix = wrapperOriginMatrix.multiply(createRotationMatrix(radians)).multiply(wrapperOriginMatrix.inverse()).multiply(controlsMatrix);
      this.updateControlsView(wrapperResultMatrix);
    } else {
      this.applyTransformToHandles({
        boxMatrix: controlsMatrix.inverse()
      });
    }
  }

  /** @internal */
  updateElementView(element, matrix) {
    element.setAttribute('transform', matrixToString(matrix));
  }

  /** @internal */
  updateControlsView(matrix = createSVGMatrix()) {
    this.storage.controls.setAttribute('transform', matrixToString(matrix));
    this.storage.cached.controlsMatrix = matrix;
  }

  /** @internal */
  applyTransformToHandles({
    boxMatrix = createSVGMatrix()
  } = {}) {
    const {
      options: {
        rotatable
      },
      storage: {
        handles,
        center: {
          isShifted
        }
      }
    } = this;
    const {
      anchor = null,
      center,
      ...nextVertices
    } = this.getVertices(boxMatrix);
    if (rotatable) {
      const {
        normal,
        radius
      } = handles;
      if (isDef(normal)) {
        normal.x1.baseVal.value = anchor.x;
        normal.y1.baseVal.value = anchor.y;
        normal.x2.baseVal.value = nextVertices.rotator.x;
        normal.y2.baseVal.value = nextVertices.rotator.y;
      }
      if (isDef(radius)) {
        radius.x1.baseVal.value = center.x;
        radius.y1.baseVal.value = center.y;
        if (!isShifted) {
          radius.x2.baseVal.value = center.x;
          radius.y2.baseVal.value = center.y;
        }
      }
    }
    entries(edgeSegments(nextVertices)).forEach(([key, [b, e]]) => {
      const hdl = handles[key];
      if (isUndef(b) || isUndef(hdl)) return;
      setAttributes(hdl, {
        x1: b.x,
        y1: b.y,
        x2: e.x,
        y2: e.y
      });
    });
    const handlesVertices = {
      ...nextVertices,
      ...(!isShifted && Boolean(center) && {
        center
      })
    };
    entries(handlesVertices).forEach(([key, point]) => {
      const hdl = handles[key];
      if (isUndef(point) || isUndef(hdl)) return;
      setAttributes(hdl, {
        cx: point.x,
        cy: point.y
      });
    });
    this.syncHitAreas();
    return handlesVertices;
  }

  /** @internal */
  prepareGuides() {
    const {
      elements,
      storage: {
        wrapper
      },
      options: {
        container,
        guides
      }
    } = this;
    if (!guides) return null;
    const {
      targets,
      bounds,
      threshold = 6,
      snap = true
    } = guides;
    const isMoving = element => elements.some(item => item === element || item.contains(element) || element.contains(item));
    const candidates = typeof targets === 'string' ? [...document.querySelectorAll(targets)] : targets || [...elements[0].parentNode.children];
    const targetBoxes = candidates.reduce((result, element) => {
      if (!('getBBox' in element) || isMoving(element) || wrapper.contains(element)) return result;
      try {
        result.push(this.getBoundsBox(element));
      } catch {
        return result;
      }
      return result;
    }, []);
    const boundsElement = bounds === false ? null : bounds ? helper(bounds)[0] : container;
    if (boundsElement) targetBoxes.push(this.getBoundsBox(boundsElement));
    return {
      ...this.measure(),
      targets: targetBoxes,
      threshold: threshold / screenScale(container),
      snap
    };
  }

  /** @internal */
  prepareRestrict() {
    const {
      restrict
    } = this.options;
    if (!restrict) return null;
    return {
      ...this.measure(),
      area: this.getBoundsBox(restrict)
    };
  }

  /** @internal */
  measure() {
    const {
      elements,
      options: {
        container,
        isGrouped
      }
    } = this;
    const matrices = elements.map(element => getTransformToElement(element, container));
    const [firstMatrix] = matrices;
    const line = this.getLine();
    const {
      point
    } = this.storage;
    const pointPosition = line && point ? pointTo(firstMatrix, point === START_POINT ? line.x1.baseVal.value : line.x2.baseVal.value, point === START_POINT ? line.y1.baseVal.value : line.y2.baseVal.value) : null;
    return {
      box: unionBoxes(elements.map((element, index) => boxFromPoints(bBoxPoints(element, matrices[index])))),
      axisAligned: matrices.every(matrix => Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6),
      flipX: !isGrouped && firstMatrix.a < 0,
      flipY: !isGrouped && firstMatrix.d < 0,
      point: pointPosition && {
        x: pointPosition.x,
        y: pointPosition.y
      }
    };
  }

  /** @internal */
  getBoundsBox(element) {
    const {
      container
    } = this.options;
    if (element.tagName.toLowerCase() !== 'svg') {
      return boxFromPoints(bBoxPoints(element, getTransformToElement(element, container)));
    }
    const {
      left,
      top,
      right,
      bottom
    } = element.getBoundingClientRect();
    const toContainer = (container.getScreenCTM() || createSVGMatrix()).inverse();
    return boxFromPoints([[left, top], [right, top], [right, bottom], [left, bottom]].map(([x, y]) => {
      const point = pointTo(toContainer, x, y);
      return [point.x, point.y];
    }));
  }

  /** @internal */
  drawGuides(lines) {
    const {
      storage,
      storage: {
        wrapper,
        guidesLayer
      },
      options: {
        container
      }
    } = this;
    if (guidesLayer) {
      while (guidesLayer.firstChild) guidesLayer.removeChild(guidesLayer.firstChild);
    }
    if (!lines.length) return;
    const layer = guidesLayer || createSVGElement('g', ['sjx-svg-guides']);
    if (!guidesLayer) {
      wrapper.insertBefore(layer, wrapper.firstChild);
      storage.guidesLayer = layer;
    }
    layer.setAttribute('transform', matrixToString(getTransformToElement(container, wrapper.parentNode)));
    lines.forEach(guide => layer.appendChild(createGuideLine(guide)));
  }

  /** @internal */
  syncHitAreas() {
    const {
      storage: {
        controls,
        handles,
        hitAreas,
        hitOverlay
      },
      options: {
        hitRadius
      }
    } = this;
    if (!hitAreas) return;
    const corners = readCorners(handles.te, handles.be);
    const radius = hitRadius / screenScale(controls);
    const outlines = [];
    entries(hitAreas).forEach(([key, area]) => {
      const hdl = handles[key];
      if (isUndef(hdl)) return;
      const center = {
        x: Number(hdl.getAttribute('cx')) || 0,
        y: Number(hdl.getAttribute('cy')) || 0
      };
      const path = outlineToPath(hitAreaOutline(key, center, corners, radius));
      area.setAttribute('d', path);
      outlines.push(path);
    });
    if (hitOverlay) hitOverlay.setAttribute('d', outlines.join(''));
  }
  setTransformOrigin({
    x,
    y,
    dx,
    dy
  } = {}, pin = true) {
    const {
      elements,
      storage,
      storage: {
        controls,
        handles: {
          center: handle,
          radius
        } = {},
        center
      } = {},
      options: {
        container,
        isGrouped
      }
    } = this;
    const isRelative = isDef(dx) && isDef(dy),
      isAbsolute = isDef(x) && isDef(y);
    if (!center || !handle || !radius || !(isRelative || isAbsolute)) return;
    const controlsTransformMatrix = getTransformToElement(controls, controls.parentNode).inverse();
    const nextTransform = isGrouped ? controlsTransformMatrix : controlsTransformMatrix.multiply(getTransformToElement(elements[0], container));
    let newX, newY;
    if (isRelative) {
      const {
        x: bx,
        y: by,
        width,
        height
      } = this.getBBox();
      const hW = width / 2,
        hH = height / 2;
      ({
        x: newX,
        y: newY
      } = pointTo(nextTransform, bx + hW + dx, by + hH + dy));
    } else {
      newX = x;
      newY = y;
    }
    handle.cx.baseVal.value = newX;
    handle.cy.baseVal.value = newY;
    radius.x2.baseVal.value = newX;
    radius.y2.baseVal.value = newY;
    center.isShifted = pin;
    storage.transformOrigin = pointTo(createSVGMatrix(), newX, newY);
    this.syncHitAreas();
  }
  fitControlsToSize() {
    const {
      storage: {
        controls,
        center: {
          isShifted
        } = {},
        transformOrigin: {
          x: originX,
          y: originY
        } = {}
      }
    } = this;
    const controlsMatrix = getTransformToElement(controls, controls.parentNode);
    const {
      x: dx,
      y: dy
    } = pointTo(controlsMatrix, originX, originY);
    this.updateControlsView();
    if (isShifted) {
      this.setTransformOrigin({
        x: dx,
        y: dy
      }, true);
    } else {
      this.setTransformOrigin({
        dx: 0,
        dy: 0
      }, false);
    }
    this.applyTransformToHandles();
  }
  getBoundingRect(element, transformMatrix = null) {
    const {
      options: {
        restrict,
        container
      } = {}
    } = this;
    const restrictEl = restrict || container;
    const nextTransform = transformMatrix ? getTransformToElement(element.parentNode, restrictEl).multiply(transformMatrix) : getTransformToElement(element, restrictEl);
    return bBoxPoints(element, nextTransform, element.getBBox());
  }
  applyAlignment(direction, target = null) {
    const {
      elements,
      options: {
        container
      }
    } = this;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      anchor,
      rotator,
      center,
      ...vertices
    } = this.getVertices();
    const restrictBBox = target ? bBoxPoints(target, getTransformToElement(target, container)) : this.getRestrictedBBox(true);
    const [offsetX, offsetY] = alignmentOffset(direction, getMinMaxOfArray(restrictBBox), getMinMaxOfArray(values(vertices).map(({
      x,
      y
    }) => [x, y])));
    elements.forEach(element => {
      const parentMatrix = getTransformToElement(element.parentNode, container);
      parentMatrix.e = parentMatrix.f = 0;
      const {
        x,
        y
      } = pointTo(parentMatrix.inverse(), offsetX, offsetY);
      const moveElementMtrx = createTranslateMatrix(x, y).multiply(getTransformToElement(element, element.parentNode));
      this.updateElementView(element, moveElementMtrx);
    });
    this.fitControlsToSize();
  }
  getDimensions() {
    const {
      elements,
      options: {
        isGrouped,
        container
      }
    } = this;
    const nextTransform = isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container);
    const {
      tl,
      br,
      tr
    } = transformVertices(boxVertices(this.getBBox()), nextTransform);
    return {
      x: floatToFixed(tl.x),
      y: floatToFixed(tl.y),
      width: floatToFixed(Math.sqrt(Math.pow(tl.x - tr.x, 2) + Math.pow(tl.y - tr.y, 2))),
      height: floatToFixed(Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2))),
      rotation: floatToFixed(Math.atan2(tr.y - tl.y, tr.x - tl.x) * DEG)
    };
  }
}

// factory method for creating draggable elements
function drag(options, obInstance) {
  if (this.length) {
    const Ob = isDef(obInstance) && obInstance instanceof Observable ? obInstance : new Observable();
    if (this[0] instanceof SVGElement) {
      const items = [];
      forEach.call(this, item => {
        if (checkElement(item)) {
          items.push(item);
        }
      });
      return new DraggableSVG(items, options, Ob);
    } else {
      return new Draggable(arrMap.call(this, _ => _), options, Ob);
    }
  }
}

const {
  EMITTER_EVENTS
} = EVENT_EMITTER_CONSTANTS;
const {
  E_MOUSEDOWN,
  E_TOUCHSTART
} = CLIENT_EVENTS_CONSTANTS;
class Cloneable extends SubjectModel {
  constructor(elements, options) {
    super(elements);
    this.enable(options);
  }

  /** @internal */
  init() {
    const {
      elements,
      options
    } = this;
    const {
      style,
      appendTo
    } = options;
    const nextStyle = {
      position: 'absolute',
      'z-index': '2147483647',
      ...style
    };
    const data = new WeakMap();
    elements.map(element => data.set(element, {
      parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
    }));
    this.storage = {
      style: nextStyle,
      data
    };
    helper(elements).on(E_MOUSEDOWN, this.onMouseDown).on(E_TOUCHSTART, this.onTouchStart);
    EMITTER_EVENTS.slice(0, 3).forEach(eventName => this.eventDispatcher.registerEvent(eventName));
  }

  /** @internal */
  processOptions(options = {}) {
    const {
      style = {},
      appendTo = null,
      stack = document.body,
      onInit = noop,
      onMove = noop,
      onDrop = noop,
      onDestroy = noop
    } = options;
    const dropable = helper(stack)[0];
    const _onDrop = isFunc(onDrop) ? function (evt) {
      const {
        clone
      } = this.storage;
      const isCollide = objectsCollide(clone, dropable);
      if (isCollide) {
        onDrop.call(this, evt, this.elements, clone);
      }
    } : noop;
    this.options = {
      style,
      appendTo,
      stack
    };
    this.proxyMethods = {
      onInit: createMethod(onInit),
      onDrop: _onDrop,
      onMove: createMethod(onMove),
      onDestroy: createMethod(onDestroy)
    };
  }

  /** @internal */
  start({
    target,
    clientX,
    clientY
  }) {
    const {
      elements
    } = this;
    const storage = this.storage;
    const {
      data,
      style
    } = storage;
    const element = elements.find(el => el === target || el.contains(target));
    if (!element) return;
    const {
      parent = element.parentNode
    } = data.get(element) || {};
    const {
      left,
      top
    } = getOffset(parent);
    style.left = `${clientX - left}px`;
    style.top = `${clientY - top}px`;
    const clone = element.cloneNode(true);
    helper(clone).css(style);
    storage.clientX = clientX;
    storage.clientY = clientY;
    storage.cx = clientX;
    storage.cy = clientY;
    storage.clone = clone;
    parent.appendChild(clone);
    this.draw();
  }

  /** @internal */
  moving({
    clientX,
    clientY
  }) {
    const storage = this.storage;
    storage.clientX = clientX;
    storage.clientY = clientY;
    storage.doDraw = true;
    storage.doMove = true;
  }

  /** @internal */
  end(e) {
    const storage = this.storage;
    const {
      clone,
      frameId
    } = storage;
    storage.doDraw = false;
    cancelAnimFrame(frameId);
    if (isUndef(clone)) return;
    this.proxyMethods.onDrop.call(this, e);
    clone.parentNode.removeChild(clone);
    delete storage.clone;
  }

  /** @internal */
  animate() {
    const storage = this.storage;
    storage.frameId = requestAnimFrame(this.animate);
    const {
      doDraw,
      clientX,
      clientY,
      cx,
      cy,
      clone
    } = storage;
    if (!doDraw) return;
    storage.doDraw = false;
    this.drag({
      element: clone,
      dx: clientX - cx,
      dy: clientY - cy
    });
  }

  /** @internal */
  processMove(_, {
    dx,
    dy
  }) {
    const {
      clone
    } = this.storage;
    const transformCommand = `translate(${dx}px, ${dy}px)`;
    helper(clone).css({
      transform: transformCommand,
      webkitTranform: transformCommand,
      mozTransform: transformCommand,
      msTransform: transformCommand,
      otransform: transformCommand
    });
  }

  /** @internal */
  destroy() {
    const {
      storage,
      proxyMethods,
      elements
    } = this;
    if (isUndef(storage)) return;
    helper(elements).off(E_MOUSEDOWN, this.onMouseDown).off(E_TOUCHSTART, this.onTouchStart);
    proxyMethods.onDestroy.call(this, elements);
    delete this.storage;
  }
  disable() {
    this.destroy();
  }
}

function clone(options) {
  if (this.length) {
    return new Cloneable(arrMap.call(this, _ => _), options);
  }
}

class Subjx extends Helper {
  drag(options, obInstance) {
    return drag.call(this, options, obInstance);
  }
  clone(options) {
    return clone.call(this, options);
  }
}

function subjx(params) {
  return new Subjx(params);
}
const createObservable = () => new Observable();
const api = Object.assign(subjx, {
  createObservable,
  Subjx,
  Observable,
  matrix,
  svgMatrix,
  common
});

exports.Observable = Observable;
exports.common = common;
exports.createObservable = createObservable;
exports.default = api;
exports.matrix = matrix;
exports.svgMatrix = svgMatrix;
