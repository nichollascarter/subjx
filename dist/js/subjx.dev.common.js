/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2025
* Karen Sarksyan
* nichollascarter@gmail.com
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(t.prototype ), o, e);
  return "function" == typeof p ? function (t) {
    return p.apply(e, t);
  } : p;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var legacyWindow = window;
var requestAnimFrame = window.requestAnimationFrame || legacyWindow.mozRequestAnimationFrame || legacyWindow.webkitRequestAnimationFrame || legacyWindow.msRequestAnimationFrame || function (f) {
  return setTimeout(f, 1000 / 60);
};
var cancelAnimFrame = window.cancelAnimationFrame || legacyWindow.mozCancelAnimationFrame || function (requestID) {
  clearTimeout(requestID);
};
var _Array$prototype = Array.prototype,
  forEach = _Array$prototype.forEach,
  arrMap = _Array$prototype.map;
var _console = console,
  warn = _console.warn;
var noop = function noop(_) {
  return _;
};

/* eslint-disable no-console */

var isDef = function isDef(val) {
  return val !== undefined && val !== null;
};
var isUndef = function isUndef(val) {
  return val === undefined || val === null;
};
var isFunc = function isFunc(val) {
  return typeof val === 'function';
};
var createMethod = function createMethod(fn) {
  return isFunc(fn) ? function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    fn.call.apply(fn, [this].concat(args));
  } : noop;
};

var Helper = /*#__PURE__*/function () {
  function Helper(params) {
    _classCallCheck(this, Helper);
    if (typeof params === 'string') {
      var _selector = document.querySelectorAll(params);
      this.length = _selector.length;
      for (var count = 0; count < this.length; count++) {
        this[count] = _selector[count];
      }
    } else if (_typeof(params) === 'object' && (params.nodeType === 1 || params === document)) {
      this[0] = params;
      this.length = 1;
    } else if (params instanceof Helper) {
      this.length = params.length;
      for (var _count = 0; _count < this.length; _count++) {
        this[_count] = params[_count];
      }
    } else if (isIterable(params)) {
      this.length = params.length;
      for (var _count2 = 0; _count2 < this.length; _count2++) {
        if (params[_count2].nodeType === 1) {
          this[_count2] = params[_count2];
        }
      }
    } else {
      throw new Error("Passed parameter must be selector/element/elementArray");
    }
  }
  return _createClass(Helper, [{
    key: "css",
    value: function css(prop) {
      var _getStyle = function _getStyle(obj) {
        var len = obj.length;
        while (len--) {
          var node = obj[len];
          if (node.currentStyle) {
            return node.currentStyle[prop];
          } else if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(node, '')[prop];
          } else {
            return node.style[prop];
          }
        }
      };
      var _setStyle = function _setStyle(obj, options) {
        var len = obj.length;
        while (len--) {
          for (var property in options) {
            obj[len].style[property] = options[property];
          }
        }
        return obj.style;
      };
      if (typeof prop === 'string') {
        return _getStyle(this);
      } else if (_typeof(prop) === 'object' || !prop) {
        return _setStyle(this, prop);
      } else {
        warn("Method ".concat(prop, " does not exist"));
      }
      return false;
    }
  }, {
    key: "on",
    value: function on(eventName, handlerOrSelector, optionsOrHandler, options) {
      var len = this.length;
      while (len--) {
        var node = this[len];
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
            node.attachEvent("on".concat(eventName), handlerOrSelector);
          } else {
            node["on".concat(eventName)] = handlerOrSelector;
          }
        } else {
          listenerDelegate(node, eventName, handlerOrSelector, optionsOrHandler, options, true);
        }
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, handlerOrSelector, optionsOrHandler, options) {
      var len = this.length;
      while (len--) {
        var node = this[len];
        if (!node.events) {
          node.events = {};
          node.events[eventName] = [];
        }
        if (typeof handlerOrSelector !== 'string') {
          if (document.removeEventListener) {
            node.removeEventListener(eventName, handlerOrSelector, optionsOrHandler);
          } else if (document.detachEvent) {
            node.detachEvent("on".concat(eventName), handlerOrSelector);
          } else {
            node["on".concat(eventName)] = null;
          }
        } else {
          listenerDelegate(node, eventName, handlerOrSelector, optionsOrHandler, options, false);
        }
      }
      return this;
    }
  }, {
    key: "is",
    value: function is(selector) {
      if (isUndef(selector)) return false;
      var _sel = new Helper(selector);
      var len = this.length;
      while (len--) {
        if (this[len] === _sel[len]) return true;
      }
      return false;
    }
  }]);
}();
function listenerDelegate(el, evt, sel, handler, options, act) {
  var doit = function doit(event) {
    var t = event.target;
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
      el.attachEvent("on".concat(evt), doit);
    } else {
      el["on".concat(evt)] = doit;
    }
  } else {
    if (document.removeEventListener) {
      el.removeEventListener(evt, doit, options || {
        passive: false
      });
    } else if (document.detachEvent) {
      el.detachEvent("on".concat(evt), doit);
    } else {
      el["on".concat(evt)] = null;
    }
  }
}
function isIterable(obj) {
  var o = obj;
  return isDef(o) && _typeof(o) === 'object' && (Array.isArray(o) || isDef(window.Symbol) && typeof o[window.Symbol.iterator] === 'function' || isDef(o.forEach) || typeof o.length === 'number' && (o.length === 0 || o.length > 0 && o.length - 1 in o));
}
function helper(params) {
  return new Helper(params);
}

var MIN_SIZE = 2;
var THEME_COLOR = '#00a8ff';
var LIB_CLASS_PREFIX = 'sjx-';
var E_MOUSEDOWN$4 = 'mousedown';
var E_MOUSEUP$2 = 'mouseup';
var E_MOUSEMOVE$2 = 'mousemove';
var E_TOUCHSTART$4 = 'touchstart';
var E_TOUCHEND$2 = 'touchend';
var E_TOUCHMOVE$2 = 'touchmove';
var E_DRAG_START$1 = 'dragStart';
var E_DRAG$3 = 'drag';
var E_DRAG_END$1 = 'dragEnd';
var E_RESIZE_START$1 = 'resizeStart';
var E_RESIZE$2 = 'resize';
var E_RESIZE_END$1 = 'resizeEnd';
var E_ROTATE_START$1 = 'rotateStart';
var E_ROTATE$2 = 'rotate';
var E_ROTATE_END$1 = 'rotateEnd';
var E_SET_POINT$1 = 'setPoint';
var E_SET_POINT_START = 'setPointStart';
var E_SET_POINT_END$1 = 'setPointEnd';
var EMITTER_EVENTS$2 = [E_DRAG_START$1, E_DRAG$3, E_DRAG_END$1, E_RESIZE_START$1, E_RESIZE$2, E_RESIZE_END$1, E_ROTATE_START$1, E_ROTATE$2, E_ROTATE_END$1, E_SET_POINT_START, E_SET_POINT_END$1];
var CSS_PREFIXES = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
var ON_GETSTATE$2 = 'ongetstate';
var ON_APPLY$2 = 'onapply';
var ON_MOVE$2 = 'onmove';
var ON_RESIZE$2 = 'onresize';
var ON_ROTATE$2 = 'onrotate';
var NOTIFIER_EVENTS$1 = [ON_GETSTATE$2, ON_APPLY$2, ON_MOVE$2, ON_RESIZE$2, ON_ROTATE$2];
var NOTIFIER_CONSTANTS = {
  NOTIFIER_EVENTS: NOTIFIER_EVENTS$1,
  ON_GETSTATE: ON_GETSTATE$2,
  ON_APPLY: ON_APPLY$2,
  ON_MOVE: ON_MOVE$2,
  ON_RESIZE: ON_RESIZE$2,
  ON_ROTATE: ON_ROTATE$2
};
var EVENT_EMITTER_CONSTANTS = {
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
var CLIENT_EVENTS_CONSTANTS = {
  E_MOUSEDOWN: E_MOUSEDOWN$4,
  E_MOUSEUP: E_MOUSEUP$2,
  E_MOUSEMOVE: E_MOUSEMOVE$2,
  E_TOUCHSTART: E_TOUCHSTART$4,
  E_TOUCHEND: E_TOUCHEND$2,
  E_TOUCHMOVE: E_TOUCHMOVE$2
};
var TRANSFORM_HANDLES_KEYS$1 = {
  TOP_LEFT: 'tl',
  TOP_CENTER: 'tc',
  TOP_RIGHT: 'tr',
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
  BOTTOM_CENTER: 'bc',
  MIDDLE_LEFT: 'ml',
  MIDDLE_RIGHT: 'mr'};
var TRANSFORM_EDGES_KEYS$1 = {
  TOP_EDGE: 'te',
  BOTTOM_EDGE: 'be',
  LEFT_EDGE: 'le',
  RIGHT_EDGE: 're'
};
var TRANSFORM_POINT_KEYS$1 = {
  START_POINT: 'p1',
  END_POINT: 'p2'
};
var TRANSFORM_HANDLES_CONSTANTS = {
  TRANSFORM_HANDLES_KEYS: TRANSFORM_HANDLES_KEYS$1,
  TRANSFORM_EDGES_KEYS: TRANSFORM_EDGES_KEYS$1,
  TRANSFORM_POINT_KEYS: TRANSFORM_POINT_KEYS$1
};

var ON_GETSTATE$1 = NOTIFIER_CONSTANTS.ON_GETSTATE,
  ON_APPLY$1 = NOTIFIER_CONSTANTS.ON_APPLY,
  ON_MOVE$1 = NOTIFIER_CONSTANTS.ON_MOVE,
  ON_RESIZE$1 = NOTIFIER_CONSTANTS.ON_RESIZE,
  ON_ROTATE$1 = NOTIFIER_CONSTANTS.ON_ROTATE;
var Observable = /*#__PURE__*/function () {
  function Observable() {
    _classCallCheck(this, Observable);
    this.observers = {};
  }
  return _createClass(Observable, [{
    key: "subscribe",
    value: function subscribe(eventName, sub) {
      var obs = this.observers;
      if (isUndef(obs[eventName])) {
        Object.defineProperty(obs, eventName, {
          value: []
        });
      }
      obs[eventName].push(sub);
      return this;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(eventName, f) {
      var obs = this.observers;
      if (isDef(obs[eventName])) {
        var index = obs[eventName].indexOf(f);
        obs[eventName].splice(index, 1);
      }
      return this;
    }
  }, {
    key: "notify",
    value: function notify(eventName, source, data) {
      if (isUndef(this.observers[eventName])) return;
      this.observers[eventName].forEach(function (observer) {
        if (source === observer) return;
        switch (eventName) {
          case ON_MOVE$1:
            observer.notifyMove(data);
            break;
          case ON_ROTATE$1:
            observer.notifyRotate(data);
            break;
          case ON_RESIZE$1:
            observer.notifyResize(data);
            break;
          case ON_APPLY$1:
            observer.notifyApply(data);
            break;
          case ON_GETSTATE$1:
            observer.notifyGetState(data);
            break;
        }
      });
    }
  }]);
}();

var Event = /*#__PURE__*/function () {
  function Event(name) {
    _classCallCheck(this, Event);
    this.name = name;
    this.callbacks = [];
  }
  return _createClass(Event, [{
    key: "registerCallback",
    value: function registerCallback(cb) {
      this.callbacks.push(cb);
    }
  }, {
    key: "removeCallback",
    value: function removeCallback(cb) {
      var ix = this.callbacks.indexOf(cb);
      if (ix !== -1) {
        this.callbacks.splice(ix, 1);
      }
    }
  }]);
}();
var EventDispatcher = /*#__PURE__*/function () {
  function EventDispatcher() {
    _classCallCheck(this, EventDispatcher);
    this.events = {};
  }
  return _createClass(EventDispatcher, [{
    key: "registerEvent",
    value: function registerEvent(eventName) {
      this.events[eventName] = new Event(eventName);
    }
  }, {
    key: "emit",
    value: function emit(ctx, eventName, eventArgs) {
      this.events[eventName].callbacks.forEach(function (cb) {
        cb.call(ctx, eventArgs);
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, cb) {
      this.events[eventName].registerCallback(cb);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, cb) {
      this.events[eventName].removeCallback(cb);
    }
  }]);
}();

var _excluded$3 = ["element", "dx", "dy"];
var E_DRAG$2 = EVENT_EMITTER_CONSTANTS.E_DRAG;
var E_MOUSEMOVE$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEMOVE,
  E_MOUSEUP$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEUP,
  E_TOUCHMOVE$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHMOVE,
  E_TOUCHEND$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHEND;
var SubjectModel = /*#__PURE__*/function () {
  /** @internal */

  /** @internal */

  function SubjectModel(elements) {
    _classCallCheck(this, SubjectModel);
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
  return _createClass(SubjectModel, [{
    key: "enable",
    value: function enable(options) {
      this.processOptions(options);
      this.init(this.elements);
      this.proxyMethods.onInit.call(this, this.elements);
    }
  }, {
    key: "drag",
    value: /** @internal */
    function drag(_ref) {
      var element = _ref.element,
        dx = _ref.dx,
        dy = _ref.dy,
        rest = _objectWithoutProperties(_ref, _excluded$3);
      var transform = this.processMove(element, {
        dx: dx,
        dy: dy
      });
      var finalArgs = _objectSpread2({
        dx: dx,
        dy: dy,
        transform: transform
      }, rest);
      this.proxyMethods.onMove.call(this, finalArgs);
      this.emitEvent(E_DRAG$2, finalArgs);
    }

    /** @internal */
  }, {
    key: "draw",
    value: function draw() {
      this.animate();
    }

    /** @internal */
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      this.start(e);
      helper(document).on(E_MOUSEMOVE$1, this.onMouseMove).on(E_MOUSEUP$1, this.onMouseUp);
    }

    /** @internal */
  }, {
    key: "onTouchStart",
    value: function onTouchStart(e) {
      this.start(e.touches[0]);
      helper(document).on(E_TOUCHMOVE$1, this.onTouchMove).on(E_TOUCHEND$1, this.onTouchEnd);
    }

    /** @internal */
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      this.moving(e);
    }

    /** @internal */
  }, {
    key: "onTouchMove",
    value: function onTouchMove(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      this.moving(e.touches[0]);
    }

    /** @internal */
  }, {
    key: "onMouseUp",
    value: function onMouseUp(e) {
      helper(document).off(E_MOUSEMOVE$1, this.onMouseMove).off(E_MOUSEUP$1, this.onMouseUp);
      this.end(e, this.elements);
    }

    /** @internal */
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd(e) {
      helper(document).off(E_TOUCHMOVE$1, this.onTouchMove).off(E_TOUCHEND$1, this.onTouchEnd);
      if (e.touches.length === 0) {
        this.end(e.changedTouches[0], this.elements);
      }
    }

    /** @internal */
  }, {
    key: "emitEvent",
    value: function emitEvent(eventName, eventArgs) {
      this.eventDispatcher.emit(this, eventName, eventArgs);
    }
  }, {
    key: "on",
    value: function on(name, cb) {
      this.eventDispatcher.addEventListener(name, cb);
      return this;
    }
  }, {
    key: "off",
    value: function off(name, cb) {
      this.eventDispatcher.removeEventListener(name, cb);
      return this;
    }
  }]);
}();

var RAD = Math.PI / 180;
var DEG = 180 / Math.PI;
var snapCandidate = function snapCandidate(value, gridSize) {
  return gridSize === 0 ? value : Math.round(value / gridSize) * gridSize;
};
var snapToGrid = function snapToGrid(value, snap) {
  if (snap === 0) {
    return value;
  } else {
    var result = snapCandidate(value, snap);
    if (result - value < snap) {
      return result;
    }
  }
};
var floatToFixed = function floatToFixed(val) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  return Number(val.toFixed(size));
};
var getMinMaxOfArray = function getMinMaxOfArray(arr) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var res = [];
  var _loop = function _loop(i) {
    var axisValues = arr.map(function (e) {
      return e[i];
    });
    res.push([Math.min.apply(Math, _toConsumableArray(axisValues)), Math.max.apply(Math, _toConsumableArray(axisValues))]);
  };
  for (var i = 0; i < length; i++) {
    _loop(i);
  }
  return res;
};
var rotatorAngle = function rotatorAngle(alongX, alongY, acrossX, acrossY) {
  return Math.hypot(alongX, alongY) > 1e-6 ? Math.atan2(alongY, alongX) : Math.atan2(acrossY, acrossX) + Math.PI / 2;
};

var common = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DEG: DEG,
  RAD: RAD,
  floatToFixed: floatToFixed,
  getMinMaxOfArray: getMinMaxOfArray,
  rotatorAngle: rotatorAngle,
  snapToGrid: snapToGrid
});

var EPSILON = 1e-6;
var xLines = function xLines(_ref) {
  var left = _ref.left,
    right = _ref.right;
  return [left, (left + right) / 2, right];
};
var yLines = function yLines(_ref2) {
  var top = _ref2.top,
    bottom = _ref2.bottom;
  return [top, (top + bottom) / 2, bottom];
};
var shift = function shift(_ref3, dx, dy) {
  var left = _ref3.left,
    top = _ref3.top,
    right = _ref3.right,
    bottom = _ref3.bottom;
  return {
    left: left + dx,
    top: top + dy,
    right: right + dx,
    bottom: bottom + dy
  };
};
var boxFromPoints = function boxFromPoints(points) {
  var xs = points.map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 1),
      x = _ref5[0];
    return x;
  });
  var ys = points.map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      y = _ref7[1];
    return y;
  });
  return {
    left: Math.min.apply(Math, _toConsumableArray(xs)),
    top: Math.min.apply(Math, _toConsumableArray(ys)),
    right: Math.max.apply(Math, _toConsumableArray(xs)),
    bottom: Math.max.apply(Math, _toConsumableArray(ys))
  };
};
var unionBoxes = function unionBoxes(boxes) {
  return {
    left: Math.min.apply(Math, _toConsumableArray(boxes.map(function (box) {
      return box.left;
    }))),
    top: Math.min.apply(Math, _toConsumableArray(boxes.map(function (box) {
      return box.top;
    }))),
    right: Math.max.apply(Math, _toConsumableArray(boxes.map(function (box) {
      return box.right;
    }))),
    bottom: Math.max.apply(Math, _toConsumableArray(boxes.map(function (box) {
      return box.bottom;
    })))
  };
};
var nearestOffset = function nearestOffset(moving, targets, threshold) {
  var best = null;
  targets.forEach(function (values) {
    return values.forEach(function (target) {
      return moving.forEach(function (value) {
        var offset = target - value;
        if (Math.abs(offset) <= threshold && (best === null || Math.abs(offset) < Math.abs(best))) {
          best = offset;
        }
      });
    });
  });
  return best;
};
var collectLines = function collectLines(xs, ys, extent, targets, tolerance) {
  var lines = [];
  var add = function add(axis, value, from, to) {
    var same = lines.find(function (line) {
      return line.axis === axis && Math.abs(line.value - value) <= EPSILON;
    });
    if (same) {
      same.from = Math.min(same.from, from);
      same.to = Math.max(same.to, to);
    } else {
      lines.push({
        axis: axis,
        value: value,
        from: from,
        to: to
      });
    }
  };
  targets.forEach(function (target) {
    xLines(target).forEach(function (value) {
      if (xs.some(function (x) {
        return Math.abs(x - value) <= tolerance;
      })) {
        add('x', value, Math.min(extent.top, target.top), Math.max(extent.bottom, target.bottom));
      }
    });
    yLines(target).forEach(function (value) {
      if (ys.some(function (y) {
        return Math.abs(y - value) <= tolerance;
      })) {
        add('y', value, Math.min(extent.left, target.left), Math.max(extent.right, target.right));
      }
    });
  });
  return lines;
};
var alignProbes = function alignProbes(_ref8, xs, ys, extent, dx, dy, _ref9) {
  var targets = _ref8.targets,
    threshold = _ref8.threshold,
    snap = _ref8.snap;
  var _ref9$x = _ref9.x,
    alignX = _ref9$x === void 0 ? true : _ref9$x,
    _ref9$y = _ref9.y,
    alignY = _ref9$y === void 0 ? true : _ref9$y;
  var offsetX = snap && alignX && xs.length ? nearestOffset(xs.map(function (x) {
    return x + dx;
  }), targets.map(xLines), threshold) : null;
  var offsetY = snap && alignY && ys.length ? nearestOffset(ys.map(function (y) {
    return y + dy;
  }), targets.map(yLines), threshold) : null;
  var nextDx = dx + (offsetX || 0);
  var nextDy = dy + (offsetY || 0);
  return {
    dx: nextDx,
    dy: nextDy,
    lines: collectLines(xs.map(function (x) {
      return x + nextDx;
    }), ys.map(function (y) {
      return y + nextDy;
    }), extent(nextDx, nextDy), targets, snap ? EPSILON : threshold)
  };
};
var align = function align(state, dx, dy) {
  var axes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return alignProbes(state, xLines(state.box), yLines(state.box), function (nextDx, nextDy) {
    return shift(state.box, nextDx, nextDy);
  }, dx, dy, axes);
};
var alignEdges = function alignEdges(state, edges, extent, dx, dy) {
  var axes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  return alignProbes(state, edges.x === null || edges.x === undefined ? [] : [edges.x], edges.y === null || edges.y === undefined ? [] : [edges.y], extent, dx, dy, axes);
};

var clampAxis = function clampAxis(min, max, areaMin, areaMax, delta) {
  var low = Math.min(0, areaMin - min);
  var high = Math.max(0, areaMax - max);
  return Math.min(Math.max(delta, low), high);
};
var clampMove = function clampMove(_ref, dx, dy) {
  var box = _ref.box,
    area = _ref.area;
  return {
    dx: clampAxis(box.left, box.right, area.left, area.right, dx),
    dy: clampAxis(box.top, box.bottom, area.top, area.bottom, dy)
  };
};
var clampEdge = function clampEdge(edge, areaMin, areaMax, delta) {
  return clampAxis(edge, edge, areaMin, areaMax, delta);
};

var getOffset = function getOffset(node) {
  return node.getBoundingClientRect();
};
var addClass = function addClass(node, cls) {
  if (!cls) return;
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (cl) {
        return node.classList.add(cl);
      });
    } else {
      return node.classList.add(cls);
    }
  }
  return node;
};
var removeClass = function removeClass(node, cls) {
  if (!cls) return;
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (cl) {
        return node.classList.remove(cl);
      });
    } else {
      return node.classList.remove(cls);
    }
  }
  return node;
};
var objectsCollide = function objectsCollide(a, b) {
  var _getOffset = getOffset(a),
    aTop = _getOffset.top,
    aLeft = _getOffset.left,
    _getOffset2 = getOffset(b),
    bTop = _getOffset2.top,
    bLeft = _getOffset2.left,
    _a = helper(a),
    _b = helper(b);
  return !(aTop < bTop || aTop + parseFloat(_a.css('height')) > bTop + parseFloat(_b.css('height')) || aLeft < bLeft || aLeft + parseFloat(_a.css('width')) > bLeft + parseFloat(_b.css('width')));
};
var matrixToCSS = function matrixToCSS(arr) {
  var style = "matrix3d(".concat(arr.join(), ")");
  return {
    transform: style,
    webkitTranform: style,
    mozTransform: style,
    msTransform: style,
    otransform: style
  };
};
var getStyle = function getStyle(el, property) {
  var style = window.getComputedStyle(el);
  var value = null;
  var _iterator = _createForOfIteratorHelper(CSS_PREFIXES),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var prefix = _step.value;
      value = style.getPropertyValue("".concat(prefix).concat(property)) || value;
      if (value) break;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return value;
};
var getScrollOffset = function getScrollOffset() {
  var doc = document.documentElement;
  return {
    left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
    top: (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  };
};
var getElementOffset = function getElementOffset(el) {
  var left = 0;
  var top = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    left += el.offsetLeft - el.scrollLeft;
    top += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    left: left,
    top: top
  };
};

var _excluded$2 = ["element", "radians"],
  _excluded2$2 = ["element", "dx", "dy"],
  _excluded3$2 = ["revX", "revY", "doW", "doH"],
  _excluded4$1 = ["transform"],
  _excluded5 = ["radians"],
  _excluded6 = ["clientX", "clientY", "actionName", "triggerEvent"];
var NOTIFIER_EVENTS = NOTIFIER_CONSTANTS.NOTIFIER_EVENTS,
  ON_GETSTATE = NOTIFIER_CONSTANTS.ON_GETSTATE,
  ON_APPLY = NOTIFIER_CONSTANTS.ON_APPLY,
  ON_MOVE = NOTIFIER_CONSTANTS.ON_MOVE,
  ON_RESIZE = NOTIFIER_CONSTANTS.ON_RESIZE,
  ON_ROTATE = NOTIFIER_CONSTANTS.ON_ROTATE;
var EMITTER_EVENTS$1 = EVENT_EMITTER_CONSTANTS.EMITTER_EVENTS,
  E_DRAG_START = EVENT_EMITTER_CONSTANTS.E_DRAG_START,
  E_DRAG$1 = EVENT_EMITTER_CONSTANTS.E_DRAG,
  E_DRAG_END = EVENT_EMITTER_CONSTANTS.E_DRAG_END,
  E_RESIZE_START = EVENT_EMITTER_CONSTANTS.E_RESIZE_START,
  E_RESIZE$1 = EVENT_EMITTER_CONSTANTS.E_RESIZE,
  E_RESIZE_END = EVENT_EMITTER_CONSTANTS.E_RESIZE_END,
  E_ROTATE_START = EVENT_EMITTER_CONSTANTS.E_ROTATE_START,
  E_ROTATE$1 = EVENT_EMITTER_CONSTANTS.E_ROTATE,
  E_ROTATE_END = EVENT_EMITTER_CONSTANTS.E_ROTATE_END,
  E_SET_POINT = EVENT_EMITTER_CONSTANTS.E_SET_POINT,
  E_SET_POINT_END = EVENT_EMITTER_CONSTANTS.E_SET_POINT_END;
var TRANSFORM_HANDLES_KEYS = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_HANDLES_KEYS,
  TRANSFORM_EDGES_KEYS = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_EDGES_KEYS,
  TRANSFORM_POINT_KEYS = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_POINT_KEYS;
var E_MOUSEDOWN$3 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
  E_TOUCHSTART$3 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART,
  E_MOUSEMOVE = CLIENT_EVENTS_CONSTANTS.E_MOUSEMOVE,
  E_MOUSEUP = CLIENT_EVENTS_CONSTANTS.E_MOUSEUP,
  E_TOUCHMOVE = CLIENT_EVENTS_CONSTANTS.E_TOUCHMOVE,
  E_TOUCHEND = CLIENT_EVENTS_CONSTANTS.E_TOUCHEND;
var TOP_LEFT = TRANSFORM_HANDLES_KEYS.TOP_LEFT,
  TOP_CENTER = TRANSFORM_HANDLES_KEYS.TOP_CENTER,
  TOP_RIGHT = TRANSFORM_HANDLES_KEYS.TOP_RIGHT,
  BOTTOM_LEFT = TRANSFORM_HANDLES_KEYS.BOTTOM_LEFT,
  BOTTOM_RIGHT = TRANSFORM_HANDLES_KEYS.BOTTOM_RIGHT,
  BOTTOM_CENTER = TRANSFORM_HANDLES_KEYS.BOTTOM_CENTER,
  MIDDLE_LEFT = TRANSFORM_HANDLES_KEYS.MIDDLE_LEFT,
  MIDDLE_RIGHT = TRANSFORM_HANDLES_KEYS.MIDDLE_RIGHT;
var TOP_EDGE = TRANSFORM_EDGES_KEYS.TOP_EDGE,
  BOTTOM_EDGE = TRANSFORM_EDGES_KEYS.BOTTOM_EDGE,
  LEFT_EDGE = TRANSFORM_EDGES_KEYS.LEFT_EDGE,
  RIGHT_EDGE = TRANSFORM_EDGES_KEYS.RIGHT_EDGE;
var START_POINT$1 = TRANSFORM_POINT_KEYS.START_POINT,
  END_POINT$1 = TRANSFORM_POINT_KEYS.END_POINT;
var keys$2 = Object.keys,
  values$2 = Object.values;
var Transformable = /*#__PURE__*/function (_SubjectModel) {
  /** @internal */

  function Transformable(elements, options, observable) {
    var _this;
    _classCallCheck(this, Transformable);
    _this = _callSuper(this, Transformable, [elements]);
    if (_this.constructor === Transformable) {
      throw new TypeError('Cannot construct Transformable instances directly');
    }
    _this.observable = observable;
    EMITTER_EVENTS$1.forEach(function (eventName) {
      return _this.eventDispatcher.registerEvent(eventName);
    });
    _superPropGet((Transformable), "enable", _this)([options]);
    return _this;
  }

  /** @internal */
  _inherits(Transformable, _SubjectModel);
  return _createClass(Transformable, [{
    key: "rotate",
    value: /** @internal */
    function rotate(_ref) {
      var element = _ref.element,
        radians = _ref.radians,
        rest = _objectWithoutProperties(_ref, _excluded$2);
      var resultMtrx = this.processRotate(element, radians);
      var finalArgs = _objectSpread2({
        transform: resultMtrx,
        delta: radians
      }, rest);
      this.proxyMethods.onRotate.call(this, finalArgs);
      _superPropGet(Transformable, "emitEvent", this)([E_ROTATE$1, finalArgs]);
    }

    /** @internal */
  }, {
    key: "resize",
    value: function resize(_ref2) {
      var element = _ref2.element,
        dx = _ref2.dx,
        dy = _ref2.dy,
        rest = _objectWithoutProperties(_ref2, _excluded2$2);
      var finalValues = this.processResize(element, {
        dx: dx,
        dy: dy
      });
      var finalArgs = _objectSpread2(_objectSpread2({}, finalValues), {}, {
        dx: dx,
        dy: dy
      }, rest);
      this.proxyMethods.onResize.call(this, finalArgs);
      _superPropGet(Transformable, "emitEvent", this)([E_RESIZE$1, finalArgs]);
    }

    /** @internal */
  }, {
    key: "processOptions",
    value: function processOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var elements = this.elements;
      _toConsumableArray(elements).map(function (element) {
        return addClass(element, "".concat(LIB_CLASS_PREFIX, "drag"));
      });
      var _options$each = options.each,
        each = _options$each === void 0 ? {
          move: false,
          resize: false,
          rotate: false
        } : _options$each,
        snapOptions = options.snap,
        _options$axis = options.axis,
        axis = _options$axis === void 0 ? 'xy' : _options$axis,
        _options$cursorMove = options.cursorMove,
        cursorMove = _options$cursorMove === void 0 ? 'auto' : _options$cursorMove,
        _options$cursorResize = options.cursorResize,
        cursorResize = _options$cursorResize === void 0 ? 'auto' : _options$cursorResize,
        _options$cursorRotate = options.cursorRotate,
        cursorRotate = _options$cursorRotate === void 0 ? 'auto' : _options$cursorRotate,
        _options$rotationPoin = options.rotationPoint,
        rotationPoint = _options$rotationPoin === void 0 ? false : _options$rotationPoin,
        _options$transformOri = options.transformOrigin,
        transformOrigin = _options$transformOri === void 0 ? false : _options$transformOri,
        restrict = options.restrict,
        _options$draggable = options.draggable,
        draggable = _options$draggable === void 0 ? true : _options$draggable,
        _options$resizable = options.resizable,
        resizable = _options$resizable === void 0 ? true : _options$resizable,
        handles = options.handles,
        _options$hitRadius = options.hitRadius,
        hitRadius = _options$hitRadius === void 0 ? 0 : _options$hitRadius,
        _options$showHitAreas = options.showHitAreas,
        showHitAreas = _options$showHitAreas === void 0 ? false : _options$showHitAreas,
        _options$guides = options.guides,
        guides = _options$guides === void 0 ? false : _options$guides,
        _options$rotatable = options.rotatable,
        rotatable = _options$rotatable === void 0 ? true : _options$rotatable,
        _options$scalable = options.scalable,
        scalable = _options$scalable === void 0 ? false : _options$scalable,
        _options$applyTransla = options.applyTranslate,
        applyTranslate = _options$applyTransla === void 0 ? false : _options$applyTransla,
        _options$onInit = options.onInit,
        onInit = _options$onInit === void 0 ? noop : _options$onInit,
        _options$onDrop = options.onDrop,
        onDrop = _options$onDrop === void 0 ? noop : _options$onDrop,
        _options$onMove = options.onMove,
        onMove = _options$onMove === void 0 ? noop : _options$onMove,
        _options$onResize = options.onResize,
        onResize = _options$onResize === void 0 ? noop : _options$onResize,
        _options$onRotate = options.onRotate,
        onRotate = _options$onRotate === void 0 ? noop : _options$onRotate,
        _options$onDestroy = options.onDestroy,
        onDestroy = _options$onDestroy === void 0 ? noop : _options$onDestroy,
        _options$container = options.container,
        container = _options$container === void 0 ? elements[0].parentNode : _options$container,
        _options$controlsCont = options.controlsContainer,
        controlsContainer = _options$controlsCont === void 0 ? container : _options$controlsCont,
        _options$proportions = options.proportions,
        proportions = _options$proportions === void 0 ? false : _options$proportions,
        _options$rotatorAncho = options.rotatorAnchor,
        rotatorAnchor = _options$rotatorAncho === void 0 ? null : _options$rotatorAncho,
        _options$rotatorOffse = options.rotatorOffset,
        rotatorOffset = _options$rotatorOffse === void 0 ? 50 : _options$rotatorOffse,
        _options$showNormal = options.showNormal,
        showNormal = _options$showNormal === void 0 ? true : _options$showNormal,
        custom = options.custom;
      var snap = _objectSpread2({
        x: 10,
        y: 10,
        angle: 10
      }, snapOptions);
      this.options = {
        axis: axis,
        cursorMove: cursorMove,
        cursorRotate: cursorRotate,
        cursorResize: cursorResize,
        rotationPoint: rotationPoint,
        transformOrigin: transformOrigin || rotationPoint,
        restrict: restrict ? helper(restrict)[0] || document.body : null,
        container: helper(container)[0],
        controlsContainer: helper(controlsContainer)[0],
        snap: _objectSpread2(_objectSpread2({}, snap), {}, {
          angle: snap.angle * RAD
        }),
        each: each,
        proportions: proportions,
        draggable: draggable,
        resizable: resizable,
        handles: Array.isArray(handles) ? handles : null,
        hitRadius: Math.max(0, Number(hitRadius) || 0),
        showHitAreas: Boolean(showHitAreas),
        guides: guides === true ? {} : guides && _typeof(guides) === 'object' ? guides : null,
        rotatable: rotatable,
        scalable: scalable,
        applyTranslate: applyTranslate,
        custom: _typeof(custom) === 'object' && custom || null,
        rotatorAnchor: rotatorAnchor,
        rotatorOffset: rotatorOffset,
        showNormal: showNormal,
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
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;
      var self = this;
      var observable = self.observable,
        storage = self.storage,
        options = self.options,
        elements = self.elements;
      if (isUndef(storage)) return;
      storage.frame = requestAnimFrame(self.animate);
      if (!storage.doDraw) return;
      storage.doDraw = false;
      var _ref3 = storage,
        dox = _ref3.dox,
        doy = _ref3.doy,
        clientX = _ref3.clientX,
        clientY = _ref3.clientY,
        relativeX = _ref3.relativeX,
        relativeY = _ref3.relativeY,
        doDrag = _ref3.doDrag,
        doResize = _ref3.doResize,
        doRotate = _ref3.doRotate,
        doSetCenter = _ref3.doSetCenter,
        revX = _ref3.revX,
        revY = _ref3.revY,
        mouseEvent = _ref3.mouseEvent,
        data = _ref3.data,
        point = _ref3.point;
      var snap = options.snap,
        _options$each2 = options.each,
        moveEach = _options$each2.move,
        resizeEach = _options$each2.resize,
        rotateEach = _options$each2.rotate,
        draggable = options.draggable,
        resizable = options.resizable,
        rotatable = options.rotatable,
        isGrouped = options.isGrouped,
        restrict = options.restrict,
        proportions = options.proportions;
      if (doResize && resizable && point) {
        var _this$clampPoint = this.clampPoint(this.alignPoint(snapToGrid(clientX - relativeX, snap.x), snapToGrid(clientY - relativeY, snap.y))),
          dx = _this$clampPoint.dx,
          dy = _this$clampPoint.dy;
        var result = this.processPointMove(elements[0], point, {
          dx: dx,
          dy: dy
        });
        if (result) {
          var finalArgs = _objectSpread2(_objectSpread2({}, result), {}, {
            dx: dx,
            dy: dy,
            clientX: clientX,
            clientY: clientY,
            mouseEvent: mouseEvent
          });
          this.proxyMethods.onResize.call(this, finalArgs);
          _superPropGet(Transformable, "emitEvent", this)([E_RESIZE$1, finalArgs]);
        }
      } else if (doResize && resizable) {
        var aligned = this.alignResize(snapToGrid(clientX - relativeX, snap.x), snapToGrid(clientY - relativeY, snap.y));
        var _this$clampResize = this.clampResize(aligned.dx, aligned.dy),
          distX = _this$clampResize.dx,
          distY = _this$clampResize.dy,
          clamped = _this$clampResize.clamped;
        var cached = storage.cached,
          _storage$cached = storage.cached,
          _storage$cached2 = _storage$cached === void 0 ? {} : _storage$cached,
          _storage$cached2$dist = _storage$cached2.dist,
          _storage$cached2$dist2 = _storage$cached2$dist === void 0 ? {} : _storage$cached2$dist,
          _storage$cached2$dist3 = _storage$cached2$dist2.dx,
          prevDx = _storage$cached2$dist3 === void 0 ? 0 : _storage$cached2$dist3,
          _storage$cached2$dist4 = _storage$cached2$dist2.dy,
          prevDy = _storage$cached2$dist4 === void 0 ? 0 : _storage$cached2$dist4;
        var args = {
          dx: distX,
          dy: distY,
          clientX: clientX,
          clientY: clientY,
          mouseEvent: mouseEvent
        };
        var _ref4 = restrict && !(clamped && !proportions) ? elements.reduce(function (res, element) {
            var _ref5 = data.get(element),
              ctm = _ref5.transform.ctm;
            var _ref6 = !isGrouped ? _this2.pointToTransform({
                x: distX,
                y: distY,
                matrix: ctm
              }) : {
                x: distX,
                y: distY
              },
              x = _ref6.x,
              y = _ref6.y;
            var dx = dox ? revX ? -x : x : 0;
            var dy = doy ? revY ? -y : y : 0;
            var _this2$processResizeR = _this2.processResizeRestrict(element, {
                dx: dx,
                dy: dy
              }),
              newX = _this2$processResizeR.x,
              newY = _this2$processResizeR.y;
            return {
              x: newX !== null && res.x === null ? distX : res.x,
              y: newY !== null && res.y === null ? distY : res.y
            };
          }, {
            x: null,
            y: null
          }) : {
            x: null,
            y: null
          },
          restX = _ref4.x,
          restY = _ref4.y;
        var isBounding = restrict && (restX !== null || restY !== null);
        var newDx = isBounding ? prevDx : distX;
        var newDy = isBounding ? prevDy : distY;
        var nextArgs = _objectSpread2(_objectSpread2({}, args), {}, {
          dx: newDx,
          dy: newDy,
          revX: revX,
          revY: revY,
          dox: dox,
          doy: doy
        });
        elements.map(function (element) {
          var _ref7 = data.get(element),
            ctm = _ref7.transform.ctm;
          var _ref8 = !isGrouped ? _this2.pointToTransform({
              x: newDx,
              y: newDy,
              matrix: ctm
            }) : {
              x: newDx,
              y: newDy
            },
            x = _ref8.x,
            y = _ref8.y;
          var dx = dox ? revX ? -x : x : 0;
          var dy = doy ? revY ? -y : y : 0;
          self.resize(_objectSpread2(_objectSpread2({}, nextArgs), {}, {
            element: element,
            dx: dx,
            dy: dy
          }));
        });
        this.storage.cached = _objectSpread2(_objectSpread2({}, cached), {}, {
          dist: {
            dx: newDx,
            dy: newDy
          }
        });
        this.processControlsResize({
          dx: newDx,
          dy: newDy
        });
        if (resizeEach) {
          observable.notify(ON_RESIZE, self, nextArgs);
        }
      }
      if (doDrag && draggable) {
        var gridDx = dox ? snapToGrid(clientX - relativeX, snap.x) : 0;
        var gridDy = doy ? snapToGrid(clientY - relativeY, snap.y) : 0;
        var alignment = storage.guides ? align(storage.guides, gridDx, gridDy, {
          x: dox,
          y: doy
        }) : null;
        var _ref9 = storage.restriction ? clampMove(storage.restriction, alignment ? alignment.dx : gridDx, alignment ? alignment.dy : gridDy) : {
            dx: alignment ? alignment.dx : gridDx,
            dy: alignment ? alignment.dy : gridDy
          },
          _dx = _ref9.dx,
          _dy = _ref9.dy;
        if (alignment) this.drawGuides(alignment.lines);
        var _cached = storage.cached,
          _storage$cached3 = storage.cached,
          _storage$cached4 = _storage$cached3 === void 0 ? {} : _storage$cached3,
          _storage$cached4$dist = _storage$cached4.dist,
          _storage$cached4$dist2 = _storage$cached4$dist === void 0 ? {} : _storage$cached4$dist,
          _storage$cached4$dist3 = _storage$cached4$dist2.dx,
          _prevDx = _storage$cached4$dist3 === void 0 ? 0 : _storage$cached4$dist3,
          _storage$cached4$dist4 = _storage$cached4$dist2.dy,
          _prevDy = _storage$cached4$dist4 === void 0 ? 0 : _storage$cached4$dist4;
        var _args = {
          dx: _dx,
          dy: _dy,
          clientX: clientX,
          clientY: clientY,
          mouseEvent: mouseEvent
        };
        var _ref0 = restrict && !storage.restriction ? elements.reduce(function (res, element) {
            var _this2$processMoveRes = _this2.processMoveRestrict(element, _args),
              x = _this2$processMoveRes.x,
              y = _this2$processMoveRes.y;
            return {
              x: res.x === null && restrict ? x : res.x,
              y: res.y === null && restrict ? y : res.y
            };
          }, {
            x: null,
            y: null
          }) : {
            x: null,
            y: null
          },
          _restX = _ref0.x,
          _restY = _ref0.y;
        var _newDx = _restX !== null && restrict ? _prevDx : _dx;
        var _newDy = _restY !== null && restrict ? _prevDy : _dy;
        var _nextArgs = _objectSpread2(_objectSpread2({}, _args), {}, {
          dx: _newDx,
          dy: _newDy
        });
        this.storage.cached = _objectSpread2(_objectSpread2({}, _cached), {}, {
          dist: {
            dx: _newDx,
            dy: _newDy
          }
        });
        elements.map(function (element) {
          return _superPropGet(Transformable, "drag", _this2)([_objectSpread2(_objectSpread2({
            element: element
          }, _nextArgs), {}, {
            dx: _newDx,
            dy: _newDy
          })]);
        });
        this.processControlsMove({
          dx: _newDx,
          dy: _newDy
        });
        if (moveEach) {
          observable.notify(ON_MOVE, self, _nextArgs);
        }
      }
      if (doRotate && rotatable) {
        var _ref1 = storage,
          pressang = _ref1.pressang,
          center = _ref1.center;
        var _delta = Math.atan2(clientY - center.y, clientX - center.x);
        var _radians = snapToGrid(_delta - pressang, snap.angle);
        if (restrict) {
          var _isBounding = elements.some(function (element) {
            var _this2$processRotateR = _this2.processRotateRestrict(element, _radians),
              restX = _this2$processRotateR.x,
              restY = _this2$processRotateR.y;
            return restX !== null || restY !== null;
          });
          if (_isBounding) return;
        }
        var _args2 = {
          clientX: clientX,
          clientY: clientY,
          mouseEvent: mouseEvent
        };
        elements.map(function (element) {
          return self.rotate(_objectSpread2({
            element: element,
            radians: _radians
          }, _args2));
        });
        this.processControlsRotate({
          radians: _radians
        });
        if (rotateEach) {
          observable.notify(ON_ROTATE, self, _objectSpread2({
            radians: _radians
          }, _args2));
        }
      }
      if (doSetCenter && rotatable) {
        var _ref10 = storage,
          bx = _ref10.bx,
          by = _ref10.by;
        var _this$pointToControls = this.pointToControls({
            x: clientX,
            y: clientY
          }),
          _x = _this$pointToControls.x,
          _y = _this$pointToControls.y;
        self.moveCenterHandle(_x - bx, _y - by);
      }
    }

    /** @internal */
  }, {
    key: "start",
    value: function start(e) {
      var clientX = e.clientX,
        clientY = e.clientY;
      var target = this.resolveHandle(e.target);
      var elements = this.elements,
        observable = this.observable,
        _this$options = this.options,
        axis = _this$options.axis,
        each = _this$options.each,
        storage = this.storage,
        handles = this.storage.handles;
      var isTarget = values$2(handles).some(function (hdl) {
        return helper(target).is(hdl);
      }) || elements.some(function (element) {
        return element.contains(target);
      });
      storage.isTarget = isTarget;
      if (!isTarget) return;
      var computed = this.compute(e, elements);
      keys$2(computed).map(function (prop) {
        return storage[prop] = computed[prop];
      });
      var onRightEdge = computed.onRightEdge,
        onBottomEdge = computed.onBottomEdge,
        onTopEdge = computed.onTopEdge,
        onLeftEdge = computed.onLeftEdge,
        handle = computed.handle,
        factor = computed.factor,
        revX = computed.revX,
        revY = computed.revY,
        doW = computed.doW,
        doH = computed.doH,
        point = computed.point;
      var doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge || Boolean(point);
      var rotator = handles.rotator,
        center = handles.center,
        radius = handles.radius;
      if (isDef(radius)) removeClass(radius, "".concat(LIB_CLASS_PREFIX, "hidden"));
      var doRotate = handle.is(rotator),
        doSetCenter = isDef(center) ? handle.is(center) : false;
      var doDrag = isTarget && !(doRotate || doResize || doSetCenter);
      var nextStorage = {
        mouseEvent: e,
        clientX: clientX,
        clientY: clientY,
        doResize: doResize,
        doDrag: doDrag,
        doRotate: doRotate,
        doSetCenter: doSetCenter,
        onExecution: true,
        guides: (doDrag || doResize) && this.options.guides ? this.prepareGuides() : null,
        restriction: (doDrag || doResize) && this.options.restrict ? this.prepareRestrict() : null,
        cursor: null,
        dox: /x/.test(axis) && (doResize ? Boolean(point) || handle.is(handles.ml) || handle.is(handles.mr) || handle.is(handles.tl) || handle.is(handles.tr) || handle.is(handles.bl) || handle.is(handles.br) || handle.is(handles.le) || handle.is(handles.re) : true),
        doy: /y/.test(axis) && (doResize ? Boolean(point) || handle.is(handles.br) || handle.is(handles.bl) || handle.is(handles.bc) || handle.is(handles.tr) || handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.te) || handle.is(handles.be) : true)
      };
      this.storage = _objectSpread2(_objectSpread2({}, storage), nextStorage);
      if (doResize || doRotate || doSetCenter) {
        this.setActiveHandle(handle[0]);
      }
      var eventArgs = {
        clientX: clientX,
        clientY: clientY
      };
      if (doResize) {
        _superPropGet(Transformable, "emitEvent", this)([E_RESIZE_START, eventArgs]);
      } else if (doRotate) {
        _superPropGet(Transformable, "emitEvent", this)([E_ROTATE_START, eventArgs]);
      } else if (doDrag) {
        _superPropGet(Transformable, "emitEvent", this)([E_DRAG_START, eventArgs]);
      }
      var move = each.move,
        resize = each.resize,
        rotate = each.rotate;
      var actionName = doResize ? E_RESIZE$1 : doRotate ? E_ROTATE$1 : E_DRAG$1;
      var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
      observable.notify(ON_GETSTATE, this, {
        clientX: clientX,
        clientY: clientY,
        actionName: actionName,
        triggerEvent: triggerEvent,
        factor: factor,
        revX: revX,
        revY: revY,
        doW: doW,
        doH: doH
      });
      this.draw();
    }

    /** @internal */
  }, {
    key: "moving",
    value: function moving(e) {
      var _this$storage = this.storage,
        storage = _this$storage === void 0 ? {} : _this$storage,
        options = this.options;
      if (!storage.isTarget) return;
      var _this$cursorPoint = this.cursorPoint(e),
        x = _this$cursorPoint.x,
        y = _this$cursorPoint.y;
      storage.mouseEvent = e;
      storage.clientX = x;
      storage.clientY = y;
      storage.doDraw = true;
      var doRotate = storage.doRotate,
        doDrag = storage.doDrag,
        doResize = storage.doResize,
        cursor = storage.cursor;
      var cursorMove = options.cursorMove,
        cursorResize = options.cursorResize,
        cursorRotate = options.cursorRotate;
      if (isUndef(cursor)) {
        if (doDrag) {
          cursor = cursorMove;
        } else if (doRotate) {
          cursor = cursorRotate;
        } else if (doResize) {
          cursor = cursorResize;
        }
        helper(document.body).css({
          cursor: cursor
        });
      }
    }

    /** @internal */
  }, {
    key: "end",
    value: function end(_ref11) {
      var _this3 = this;
      var clientX = _ref11.clientX,
        clientY = _ref11.clientY;
      var elements = this.elements,
        each = this.options.each,
        observable = this.observable,
        _this$storage2 = this.storage,
        doResize = _this$storage2.doResize,
        doDrag = _this$storage2.doDrag,
        doRotate = _this$storage2.doRotate,
        doSetCenter = _this$storage2.doSetCenter,
        frame = _this$storage2.frame,
        radius = _this$storage2.handles.radius,
        isTarget = _this$storage2.isTarget,
        proxyMethods = this.proxyMethods;
      if (!isTarget) return;
      var _ref12 = [{
          actionName: E_RESIZE$1,
          condition: doResize
        }, {
          actionName: E_DRAG$1,
          condition: doDrag
        }, {
          actionName: E_ROTATE$1,
          condition: doRotate
        }, {
          actionName: E_SET_POINT,
          condition: doSetCenter
        }].find(function (_ref13) {
          var condition = _ref13.condition;
          return condition;
        }) || {},
        _ref12$actionName = _ref12.actionName,
        actionName = _ref12$actionName === void 0 ? E_DRAG$1 : _ref12$actionName;
      elements.map(function (element) {
        return _this3.applyTransformToElement(element, actionName);
      });
      this.processActions(actionName);
      this.updateStorage();
      var eventArgs = {
        clientX: clientX,
        clientY: clientY
      };
      proxyMethods.onDrop.call(this, eventArgs);
      if (doResize) {
        _superPropGet(Transformable, "emitEvent", this)([E_RESIZE_END, eventArgs]);
      } else if (doRotate) {
        _superPropGet(Transformable, "emitEvent", this)([E_ROTATE_END, eventArgs]);
      } else if (doDrag) {
        _superPropGet(Transformable, "emitEvent", this)([E_DRAG_END, eventArgs]);
      } else if (doSetCenter) {
        _superPropGet(Transformable, "emitEvent", this)([E_SET_POINT_END, eventArgs]);
      }
      var move = each.move,
        resize = each.resize,
        rotate = each.rotate;
      var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
      observable.notify(ON_APPLY, this, {
        clientX: clientX,
        clientY: clientY,
        actionName: actionName,
        triggerEvent: triggerEvent
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
      if (isDef(radius)) {
        addClass(radius, "".concat(LIB_CLASS_PREFIX, "hidden"));
      }
    }

    /** @internal */
  }, {
    key: "setActiveHandle",
    value: function setActiveHandle(handle) {
      var storage = this.storage,
        _this$storage3 = this.storage,
        wrapper = _this$storage3.wrapper,
        activeHandle = _this$storage3.activeHandle;
      if (activeHandle) removeClass(activeHandle, "".concat(LIB_CLASS_PREFIX, "active"));
      if (handle) {
        addClass(handle, "".concat(LIB_CLASS_PREFIX, "active"));
        addClass(wrapper, "".concat(LIB_CLASS_PREFIX, "acting"));
      } else {
        removeClass(wrapper, "".concat(LIB_CLASS_PREFIX, "acting"));
      }
      storage.activeHandle = handle;
    }

    /** @internal */
  }, {
    key: "compute",
    value: function compute(e, elements) {
      var _this4 = this;
      var _this$storage4 = this.storage,
        _this$storage5 = _this$storage4 === void 0 ? {} : _this$storage4,
        handles = _this$storage5.handles,
        data = _this$storage5.data;
      var target = this.resolveHandle(e.target);
      var handle = helper(target);
      var _this$checkHandles = this.checkHandles(handle, handles),
        revX = _this$checkHandles.revX,
        revY = _this$checkHandles.revY,
        doW = _this$checkHandles.doW,
        doH = _this$checkHandles.doH,
        rest = _objectWithoutProperties(_this$checkHandles, _excluded3$2);
      var commonState = this.getCommonState();
      var _this$cursorPoint2 = this.cursorPoint(e),
        x = _this$cursorPoint2.x,
        y = _this$cursorPoint2.y;
      var _this$pointToControls2 = this.pointToControls({
          x: x,
          y: y
        }, commonState.transform),
        bx = _this$pointToControls2.x,
        by = _this$pointToControls2.y;
      elements.map(function (element) {
        var _this4$getElementStat = _this4.getElementState(element, {
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          }),
          transform = _this4$getElementStat.transform,
          nextData = _objectWithoutProperties(_this4$getElementStat, _excluded4$1);
        var _this4$pointToTransfo = _this4.pointToTransform({
            x: x,
            y: y,
            matrix: transform.ctm
          }),
          ex = _this4$pointToTransfo.x,
          ey = _this4$pointToTransfo.y;
        data.set(element, _objectSpread2(_objectSpread2(_objectSpread2({}, data.get(element)), nextData), {}, {
          transform: transform,
          cx: ex,
          cy: ey
        }));
      });
      var pressang = Math.atan2(y - commonState.center.y, x - commonState.center.x);
      return _objectSpread2(_objectSpread2(_objectSpread2({
        data: data
      }, rest), {}, {
        handle: values$2(handles).some(function (hdl) {
          return helper(target).is(hdl);
        }) ? handle : helper(elements[0]),
        pressang: pressang
      }, commonState), {}, {
        revX: revX,
        revY: revY,
        doW: doW,
        doH: doH,
        relativeX: x,
        relativeY: y,
        bx: bx,
        by: by
      });
    }

    /** @internal */
  }, {
    key: "checkHandles",
    value: function checkHandles(handle, handles) {
      var checkIsHandle = function checkIsHandle(hdl) {
        return isDef(hdl) ? handle.is(hdl) : false;
      };
      var checkAction = function checkAction(items) {
        return items.some(function (key) {
          return checkIsHandle(handles[key]);
        });
      };
      var revX = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE]);
      var revY = checkAction([TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE]);
      var onTopEdge = checkAction([TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE]);
      var onLeftEdge = checkAction([TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE]);
      var onRightEdge = checkAction([TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE]);
      var onBottomEdge = checkAction([BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE]);
      var doW = checkAction([MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE]);
      var doH = checkAction([TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE]);
      var point = [START_POINT$1, END_POINT$1].find(function (key) {
        return checkIsHandle(handles[key]);
      }) || null;
      return {
        revX: revX,
        revY: revY,
        onTopEdge: onTopEdge,
        onLeftEdge: onLeftEdge,
        onRightEdge: onRightEdge,
        onBottomEdge: onBottomEdge,
        doW: doW,
        doH: doH,
        point: point
      };
    }

    /** @internal */
  }, {
    key: "alignResize",
    value: function alignResize(dx, dy) {
      var _this$storage6 = this.storage,
        guides = _this$storage6.guides,
        doW = _this$storage6.doW,
        doH = _this$storage6.doH,
        dox = _this$storage6.dox,
        doy = _this$storage6.doy,
        proportions = this.options.proportions;
      if (!guides || !guides.axisAligned) return {
        dx: dx,
        dy: dy
      };
      var box = guides.box;
      var _this$movingEdges = this.movingEdges(guides),
        leftMoves = _this$movingEdges.leftMoves,
        topMoves = _this$movingEdges.topMoves;
      var widthLeads = doW || !doH;
      var alignment = alignEdges(guides, {
        x: dox ? leftMoves ? box.left : box.right : null,
        y: doy ? topMoves ? box.top : box.bottom : null
      }, function (nextDx, nextDy) {
        return {
          left: box.left + (dox && leftMoves ? nextDx : 0),
          right: box.right + (dox && !leftMoves ? nextDx : 0),
          top: box.top + (doy && topMoves ? nextDy : 0),
          bottom: box.bottom + (doy && !topMoves ? nextDy : 0)
        };
      }, dx, dy, {
        x: Boolean(dox) && (!proportions || widthLeads),
        y: Boolean(doy) && (!proportions || !widthLeads)
      });
      this.drawGuides(alignment.lines);
      return alignment;
    }

    /** @internal */
  }, {
    key: "movingEdges",
    value: function movingEdges(_ref14) {
      var flipX = _ref14.flipX,
        flipY = _ref14.flipY;
      var _this$storage7 = this.storage,
        revX = _this$storage7.revX,
        revY = _this$storage7.revY;
      return {
        leftMoves: Boolean(revX) !== Boolean(flipX),
        topMoves: Boolean(revY) !== Boolean(flipY)
      };
    }

    /** @internal */
  }, {
    key: "clampResize",
    value: function clampResize(dx, dy) {
      var _this$storage8 = this.storage,
        restriction = _this$storage8.restriction,
        dox = _this$storage8.dox,
        doy = _this$storage8.doy;
      if (!restriction || !restriction.axisAligned) return {
        dx: dx,
        dy: dy,
        clamped: false
      };
      var box = restriction.box,
        area = restriction.area;
      var _this$movingEdges2 = this.movingEdges(restriction),
        leftMoves = _this$movingEdges2.leftMoves,
        topMoves = _this$movingEdges2.topMoves;
      return {
        dx: dox ? clampEdge(leftMoves ? box.left : box.right, area.left, area.right, dx) : dx,
        dy: doy ? clampEdge(topMoves ? box.top : box.bottom, area.top, area.bottom, dy) : dy,
        clamped: true
      };
    }

    /** @internal */
  }, {
    key: "clampPoint",
    value: function clampPoint(_ref15) {
      var dx = _ref15.dx,
        dy = _ref15.dy;
      var restriction = this.storage.restriction;
      if (!restriction || !restriction.point) return {
        dx: dx,
        dy: dy
      };
      var point = restriction.point,
        area = restriction.area;
      return {
        dx: clampEdge(point.x, area.left, area.right, dx),
        dy: clampEdge(point.y, area.top, area.bottom, dy)
      };
    }

    /** @internal */
  }, {
    key: "alignPoint",
    value: function alignPoint(dx, dy) {
      var _this$storage9 = this.storage,
        guides = _this$storage9.guides,
        dox = _this$storage9.dox,
        doy = _this$storage9.doy,
        proportions = this.options.proportions;
      if (!guides || !guides.point || proportions) return {
        dx: dx,
        dy: dy
      };
      var _guides$point = guides.point,
        x = _guides$point.x,
        y = _guides$point.y;
      var alignment = alignEdges(guides, {
        x: x,
        y: y
      }, function (nextDx, nextDy) {
        return {
          left: x + nextDx,
          right: x + nextDx,
          top: y + nextDy,
          bottom: y + nextDy
        };
      }, dx, dy, {
        x: dox,
        y: doy
      });
      this.drawGuides(alignment.lines);
      return alignment;
    }

    /** @internal */
  }, {
    key: "resolveHandle",
    value: function resolveHandle(target) {
      var key = target && target.getAttribute && target.getAttribute('data-sjx-handle');
      var handle = key ? this.storage.handles[key] : null;
      return handle || target;
    }

    /** @internal */
  }, {
    key: "isHandleEnabled",
    value: function isHandleEnabled(key) {
      var handles = this.options.handles;
      return !handles || handles.includes(key);
    }

    /** @internal */
  }, {
    key: "restrictHandler",
    value: function restrictHandler(element, matrix) {
      var restrictX = null,
        restrictY = null;
      var elBox = this.getBoundingRect(element, matrix);
      var containerBBox = this.getRestrictedBBox();
      var _getMinMaxOfArray = getMinMaxOfArray(containerBBox),
        _getMinMaxOfArray2 = _slicedToArray(_getMinMaxOfArray, 2),
        _getMinMaxOfArray2$ = _slicedToArray(_getMinMaxOfArray2[0], 2),
        minX = _getMinMaxOfArray2$[0],
        maxX = _getMinMaxOfArray2$[1],
        _getMinMaxOfArray2$2 = _slicedToArray(_getMinMaxOfArray2[1], 2),
        minY = _getMinMaxOfArray2$2[0],
        maxY = _getMinMaxOfArray2$2[1];
      for (var i = 0, len = elBox.length; i < len; i++) {
        var _elBox$i = _slicedToArray(elBox[i], 2),
          _x2 = _elBox$i[0],
          _y2 = _elBox$i[1];
        if (_x2 < minX || _x2 > maxX) {
          restrictX = _x2;
        }
        if (_y2 < minY || _y2 > maxY) {
          restrictY = _y2;
        }
      }
      return {
        x: restrictX,
        y: restrictY
      };
    }

    /** @internal */
  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;
      var elements = this.elements,
        _this$storage0 = this.storage,
        _this$storage1 = _this$storage0 === void 0 ? {} : _this$storage0,
        controls = _this$storage1.controls,
        wrapper = _this$storage1.wrapper;
      [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
        return helper(target).off(E_MOUSEDOWN$3, _this5.onMouseDown).off(E_TOUCHSTART$3, _this5.onTouchStart);
      });
      wrapper.parentNode.removeChild(wrapper);
    }

    /** @internal */
  }, {
    key: "updateStorage",
    value: function updateStorage() {
      var storage = this.storage,
        _this$storage10 = this.storage,
        prevTransformOrigin = _this$storage10.transformOrigin,
        _this$storage10$trans = _this$storage10.transform,
        _this$storage10$trans2 = _this$storage10$trans === void 0 ? {} : _this$storage10$trans,
        prevControlsMatrix = _this$storage10$trans2.controlsMatrix,
        _this$storage10$cache = _this$storage10.cached,
        _this$storage10$cache2 = _this$storage10$cache === void 0 ? {} : _this$storage10$cache,
        _this$storage10$cache3 = _this$storage10$cache2.transformOrigin,
        transformOrigin = _this$storage10$cache3 === void 0 ? prevTransformOrigin : _this$storage10$cache3,
        _this$storage10$cache4 = _this$storage10$cache2.controlsMatrix,
        controlsMatrix = _this$storage10$cache4 === void 0 ? prevControlsMatrix : _this$storage10$cache4;
      this.storage = _objectSpread2(_objectSpread2({}, storage), {}, {
        doResize: false,
        doDrag: false,
        doRotate: false,
        doSetCenter: false,
        doDraw: false,
        onExecution: false,
        cursor: null,
        transformOrigin: transformOrigin,
        controlsMatrix: controlsMatrix,
        cached: {}
      });
    }
  }, {
    key: "notifyMove",
    value: function notifyMove(_ref16) {
      var _this6 = this;
      var dx = _ref16.dx,
        dy = _ref16.dy;
      this.elements.map(function (element) {
        return _superPropGet(Transformable, "drag", _this6)([{
          element: element,
          dx: dx,
          dy: dy
        }]);
      });
      this.processControlsMove({
        dx: dx,
        dy: dy
      });
    }
  }, {
    key: "notifyRotate",
    value: function notifyRotate(_ref17) {
      var _this7 = this;
      var radians = _ref17.radians,
        rest = _objectWithoutProperties(_ref17, _excluded5);
      var elements = this.elements,
        _this$options2 = this.options,
        _this$options3 = _this$options2 === void 0 ? {} : _this$options2,
        angle = _this$options3.snap.angle;
      elements.map(function (element) {
        return _this7.rotate(_objectSpread2({
          element: element,
          radians: snapToGrid(radians, angle)
        }, rest));
      });
      this.processControlsRotate({
        radians: radians
      });
    }
  }, {
    key: "notifyResize",
    value: function notifyResize(_ref18) {
      var _this8 = this;
      var dx = _ref18.dx,
        dy = _ref18.dy,
        revX = _ref18.revX,
        revY = _ref18.revY,
        dox = _ref18.dox,
        doy = _ref18.doy;
      var elements = this.elements,
        data = this.storage.data,
        isGrouped = this.options.isGrouped;
      elements.map(function (element) {
        var _ref19 = data.get(element),
          ctm = _ref19.transform.ctm;
        var _ref20 = !isGrouped ? _this8.pointToTransform({
            x: dx,
            y: dy,
            matrix: ctm
          }) : {
            x: dx,
            y: dy
          },
          x = _ref20.x,
          y = _ref20.y;
        _this8.resize({
          element: element,
          dx: dox ? revX ? -x : x : 0,
          dy: doy ? revY ? -y : y : 0
        });
      });
      this.processControlsResize({
        dx: dx,
        dy: dy
      });
    }
  }, {
    key: "notifyApply",
    value: function notifyApply(_ref21) {
      var _this9 = this;
      var clientX = _ref21.clientX,
        clientY = _ref21.clientY,
        actionName = _ref21.actionName,
        triggerEvent = _ref21.triggerEvent;
      this.proxyMethods.onDrop.call(this, {
        clientX: clientX,
        clientY: clientY
      });
      if (triggerEvent) {
        this.elements.map(function (element) {
          return _this9.applyTransformToElement(element, actionName);
        });
        _superPropGet(Transformable, "emitEvent", this)(["".concat(actionName, "End"), {
          clientX: clientX,
          clientY: clientY
        }]);
      }
    }
  }, {
    key: "notifyGetState",
    value: function notifyGetState(_ref22) {
      var _this0 = this;
      var clientX = _ref22.clientX,
        clientY = _ref22.clientY,
        actionName = _ref22.actionName,
        triggerEvent = _ref22.triggerEvent,
        rest = _objectWithoutProperties(_ref22, _excluded6);
      if (triggerEvent) {
        var elements = this.elements,
          data = this.storage.data;
        elements.map(function (element) {
          var nextData = _this0.getElementState(element, rest);
          data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), nextData));
        });
        var recalc = this.getCommonState();
        this.storage = _objectSpread2(_objectSpread2({}, this.storage), recalc);
        _superPropGet(Transformable, "emitEvent", this)(["".concat(actionName, "Start"), {
          clientX: clientX,
          clientY: clientY
        }]);
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(_ref23) {
      var resize = _ref23.resize,
        move = _ref23.move,
        rotate = _ref23.rotate;
      var ob = this.observable;
      if (move || resize || rotate) {
        ob.subscribe(ON_GETSTATE, this).subscribe(ON_APPLY, this);
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
  }, {
    key: "unsubscribe",
    value: function unsubscribe() {
      var _this1 = this;
      var ob = this.observable;
      NOTIFIER_EVENTS.map(function (eventName) {
        return ob.unsubscribe(eventName, _this1);
      });
    }
  }, {
    key: "disable",
    value: function disable() {
      var storage = this.storage,
        proxyMethods = this.proxyMethods,
        elements = this.elements;
      if (isUndef(storage)) return;

      // unexpected case
      if (storage.onExecution) {
        helper(document).off(E_MOUSEMOVE, this.onMouseMove).off(E_MOUSEUP, this.onMouseUp).off(E_TOUCHMOVE, this.onTouchMove).off(E_TOUCHEND, this.onTouchEnd);
      }
      elements.map(function (element) {
        return removeClass(element, "".concat(LIB_CLASS_PREFIX, "drag"));
      });
      this.unsubscribe();
      this.destroy();
      proxyMethods.onDestroy.call(this, elements);
      delete this.storage;
    }
  }, {
    key: "exeDrag",
    value: function exeDrag(_ref24) {
      var _this10 = this;
      var dx = _ref24.dx,
        dy = _ref24.dy;
      var elements = this.elements,
        draggable = this.options.draggable,
        storage = this.storage,
        data = this.storage.data;
      if (!draggable) return;
      var commonState = this.getCommonState();
      elements.map(function (element) {
        var nextData = _this10.getElementState(element, {
          revX: false,
          revY: false,
          doW: false,
          doH: false
        });
        data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), nextData));
      });
      this.storage = _objectSpread2(_objectSpread2({}, storage), commonState);
      var restriction = this.options.restrict ? this.prepareRestrict() : null;
      var delta = restriction ? clampMove(restriction, dx, dy) : {
        dx: dx,
        dy: dy
      };
      elements.map(function (element) {
        _superPropGet(Transformable, "drag", _this10)([_objectSpread2({
          element: element
        }, delta)]);
        _this10.applyTransformToElement(element, E_DRAG$1);
      });
      this.processControlsMove(delta);
    }
  }, {
    key: "exeResize",
    value: function exeResize(_ref25) {
      var _this11 = this;
      var dx = _ref25.dx,
        dy = _ref25.dy,
        _ref25$revX = _ref25.revX,
        revX = _ref25$revX === void 0 ? false : _ref25$revX,
        _ref25$revY = _ref25.revY,
        revY = _ref25$revY === void 0 ? false : _ref25$revY,
        _ref25$doW = _ref25.doW,
        doW = _ref25$doW === void 0 ? false : _ref25$doW,
        _ref25$doH = _ref25.doH,
        doH = _ref25$doH === void 0 ? false : _ref25$doH;
      var elements = this.elements,
        resizable = this.options.resizable,
        storage = this.storage,
        data = this.storage.data;
      if (!resizable) return;
      var commonState = this.getCommonState();
      elements.map(function (element) {
        var nextData = _this11.getElementState(element, {
          revX: revX,
          revY: revY,
          doW: doW,
          doH: doH
        });
        data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), nextData));
      });
      this.storage = _objectSpread2(_objectSpread2({}, storage), commonState);
      elements.map(function (element) {
        _this11.resize({
          element: element,
          dx: dx,
          dy: dy
        });
        _this11.applyTransformToElement(element, E_RESIZE$1);
      });
      this.processControlsMove({
        dx: dx,
        dy: dy
      });
    }
  }, {
    key: "exeRotate",
    value: function exeRotate(_ref26) {
      var _this12 = this;
      var delta = _ref26.delta;
      var elements = this.elements,
        rotatable = this.options.rotatable,
        storage = this.storage,
        data = this.storage.data;
      if (!rotatable) return;
      var commonState = this.getCommonState();
      elements.map(function (element) {
        var nextData = _this12.getElementState(element, {
          revX: false,
          revY: false,
          doW: false,
          doH: false
        });
        data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), nextData));
      });
      this.storage = _objectSpread2(_objectSpread2({}, storage), commonState);
      elements.map(function (element) {
        _this12.rotate({
          element: element,
          radians: delta
        });
        _this12.applyTransformToElement(element, E_ROTATE$1);
      });
      this.processControlsRotate({
        radians: delta
      });
    }
  }, {
    key: "resetCenterPoint",
    value: function resetCenterPoint() {
      warn('"resetCenterPoint" method is replaced by "resetTransformOrigin" and would be removed soon');
      this.setTransformOrigin({
        dx: 0,
        dy: 0
      }, false);
    }
  }, {
    key: "resetTransformOrigin",
    value: function resetTransformOrigin() {
      this.setTransformOrigin({
        dx: 0,
        dy: 0
      }, false);
    }
  }, {
    key: "controls",
    get: function get() {
      return this.storage.wrapper;
    }
  }]);
}(SubjectModel);

var cloneMatrix$1 = function cloneMatrix(m) {
  return m.map(function (item) {
    return _toConsumableArray(item);
  });
};
var flatMatrix = function flatMatrix(m) {
  return m.reduce(function (flat, _, i) {
    return [].concat(_toConsumableArray(flat), [m[0][i], m[1][i], m[2][i], m[3][i]]);
  }, []);
};
var createIdentityMatrix = function createIdentityMatrix() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
  return _toConsumableArray(Array(n)).map(function (_, i, a) {
    return a.map(function () {
      return +!i--;
    });
  });
};
var createTranslateMatrix$1 = function createTranslateMatrix(x, y) {
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return createIdentityMatrix().map(function (item, i) {
    item[3] = [x, y, z, 1][i];
    return item;
  });
};
var createScaleMatrix$1 = function createScaleMatrix(x, y) {
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  return createIdentityMatrix().map(function (item, i) {
    item[i] = [x, y, z, w][i];
    return item;
  });
};
var createRotateMatrix$1 = function createRotateMatrix(sin, cos) {
  var res = createIdentityMatrix();
  res[0][0] = cos;
  res[0][1] = -sin;
  res[1][0] = sin;
  res[1][1] = cos;
  return res;
};
var dropTranslate = function dropTranslate(matrix) {
  var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var nextMatrix = clone ? cloneMatrix$1(matrix) : matrix;
  nextMatrix[0][3] = nextMatrix[1][3] = nextMatrix[2][3] = 0;
  return nextMatrix;
};
var multiplyMatrixAndPoint = function multiplyMatrixAndPoint(mat, point) {
  var out = [];
  for (var i = 0, len = mat.length; i < len; ++i) {
    var sum = 0;
    for (var j = 0; j < len; ++j) {
      sum += +mat[i][j] * point[j];
    }
    out[i] = sum;
  }
  return out;
};
var multiplyMatrix = function multiplyMatrix(m1, m2) {
  var result = [];
  for (var j = 0; j < m2.length; j++) {
    result[j] = [];
    for (var k = 0; k < m1[0].length; k++) {
      var sum = 0;
      for (var i = 0; i < m1.length; i++) {
        sum += m1[i][k] * m2[j][i];
      }
      result[j].push(sum);
    }
  }
  return result;
};
var matrixInvert = function matrixInvert(matrix) {
  var A = cloneMatrix$1(matrix);
  var N = A.length;
  var temp;
  var E = [];
  for (var i = 0; i < N; i++) E[i] = [];
  for (var _i = 0; _i < N; _i++) for (var j = 0; j < N; j++) {
    E[_i][j] = 0;
    if (_i === j) E[_i][j] = 1;
  }
  for (var k = 0; k < N; k++) {
    temp = A[k][k];
    if (temp !== 0) {
      for (var _j = 0; _j < N; _j++) {
        A[k][_j] /= temp;
        E[k][_j] /= temp;
      }
    }
    for (var _i2 = k + 1; _i2 < N; _i2++) {
      temp = A[_i2][k];
      for (var _j2 = 0; _j2 < N; _j2++) {
        A[_i2][_j2] -= A[k][_j2] * temp;
        E[_i2][_j2] -= E[k][_j2] * temp;
      }
    }
  }
  for (var _k = N - 1; _k > 0; _k--) {
    for (var _i3 = _k - 1; _i3 >= 0; _i3--) {
      temp = A[_i3][_k];
      for (var _j3 = 0; _j3 < N; _j3++) {
        A[_i3][_j3] -= A[_k][_j3] * temp;
        E[_i3][_j3] -= E[_k][_j3] * temp;
      }
    }
  }
  for (var _i4 = 0; _i4 < N; _i4++) for (var _j4 = 0; _j4 < N; _j4++) A[_i4][_j4] = E[_i4][_j4];
  return A;
};
var computeTransformMatrix = function computeTransformMatrix(tx, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
    x = _ref2[0],
    y = _ref2[1],
    z = _ref2[2];
  var preMul = createTranslateMatrix$1(-x, -y, -z);
  var postMul = createTranslateMatrix$1(x, y, z);
  return multiplyMatrix(multiplyMatrix(preMul, tx), postMul);
};
var getCurrentTransformMatrix = function getCurrentTransformMatrix(element) {
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
  var newTransform = arguments.length > 2 ? arguments[2] : undefined;
  var matrix = createIdentityMatrix();
  var node = element;

  // set predefined matrix if we need to find new CTM
  var nodeTx = newTransform || getTransform(node);
  var allowBorderOffset = false;
  while (node && node instanceof Element) {
    //const nodeTx = getTransform(node);
    var nodeTxOrigin = getTransformOrigin(node, allowBorderOffset);
    matrix = multiplyMatrix(matrix, computeTransformMatrix(nodeTx, nodeTxOrigin));
    allowBorderOffset = true;
    if (node === container || node.offsetParent === null) break;
    node = node.offsetParent;
    nodeTx = getTransform(node);
  }
  return matrix;
};
var decompose = function decompose(m) {
  var sX = Math.sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0] + m[2][0] * m[2][0]),
    sY = Math.sqrt(m[0][1] * m[0][1] + m[1][1] * m[1][1] + m[2][1] * m[2][1]),
    sZ = Math.sqrt(m[0][2] * m[0][2] + m[1][2] * m[1][2] + m[2][2] * m[2][2]);
  var rX = Math.atan2(-m[0][3] / sZ, m[1][3] / sZ),
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
      sX: sX,
      sY: sY,
      sZ: sZ
    }
  };
};
var getTransform = function getTransform(el) {
  var matrixString = getStyle(el, 'transform') || 'none';
  var matrix = createIdentityMatrix();
  if (matrixString === 'none') return matrix;
  var values = matrixString.split(/\s*[(),]\s*/).slice(1, -1);
  if (values.length === 16) {
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        matrix[j][i] = +values[i * 4 + j];
      }
    }
  } else {
    return [[+values[0], +values[2], 0, +values[4]], [+values[1], +values[3], 0, +values[5]], [0, 0, 1, 0], [0, 0, 0, 1]];
  }
  return matrix;
};
var getTransformOrigin = function getTransformOrigin(el, allowBorderOffset) {
  var transformOrigin = getStyle(el, 'transform-origin');
  var values = transformOrigin ? transformOrigin.split(' ') : [];
  var out = [allowBorderOffset ? -el.clientLeft : 0, allowBorderOffset ? -el.clientTop : 0, 0, 1];
  for (var i = 0; i < values.length; ++i) {
    out[i] += parseFloat(values[i]);
  }
  return out;
};
var getAbsoluteOffset = function getAbsoluteOffset(element) {
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
  var top = 0,
    left = 0;
  var node = element;
  var allowBorderOffset = false;
  while (node && node.offsetParent) {
    var parentTx = getCurrentTransformMatrix(node.offsetParent);
    var _multiplyMatrixAndPoi = multiplyMatrixAndPoint(dropTranslate(parentTx, false), [node.offsetLeft + (allowBorderOffset ? node.clientLeft : 0), node.offsetTop + (allowBorderOffset ? node.clientTop : 0), 0, 1]),
      _multiplyMatrixAndPoi2 = _slicedToArray(_multiplyMatrixAndPoi, 2),
      offsetLeft = _multiplyMatrixAndPoi2[0],
      offsetTop = _multiplyMatrixAndPoi2[1];
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

var _excluded$1 = ["rotator", "anchor"],
  _excluded2$1 = ["anchor", "center"],
  _excluded3$1 = ["anchor", "rotator", "center"];
var E_MOUSEDOWN$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
  E_TOUCHSTART$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
var keys$1 = Object.keys,
  entries$1 = Object.entries,
  values$1 = Object.values;
var Draggable = /*#__PURE__*/function (_Transformable) {
  function Draggable() {
    _classCallCheck(this, Draggable);
    return _callSuper(this, Draggable, arguments);
  }
  _inherits(Draggable, _Transformable);
  return _createClass(Draggable, [{
    key: "init",
    value: /** @internal */
    function init(elements) {
      var _this = this;
      var _this$options = this.options,
        transformOrigin = _this$options.transformOrigin,
        container = _this$options.container,
        controlsContainer = _this$options.controlsContainer,
        resizable = _this$options.resizable,
        rotatable = _this$options.rotatable,
        showNormal = _this$options.showNormal,
        restrict = _this$options.restrict;
      var wrapper = createElement(['sjx-wrapper']);
      var controls = createElement(['sjx-controls']);
      var handles = {};
      var _this$getVertices = this.getVertices(),
        _this$getVertices$rot = _this$getVertices.rotator,
        rotator = _this$getVertices$rot === void 0 ? null : _this$getVertices$rot,
        _this$getVertices$anc = _this$getVertices.anchor,
        anchor = _this$getVertices$anc === void 0 ? null : _this$getVertices$anc,
        finalVertices = _objectWithoutProperties(_this$getVertices, _excluded$1);
      var rotationHandles = {};
      if (rotatable) {
        var normalLine = showNormal ? renderLine$1([[anchor.x, anchor.y], rotator], 'normal') : null;
        if (showNormal) controls.appendChild(normalLine);
        var radius = null;
        if (transformOrigin) {
          radius = renderLine$1([finalVertices.center, finalVertices.center], 'radius');
          addClass(radius, 'sjx-hidden');
          controls.appendChild(radius);
        }
        rotationHandles = _objectSpread2(_objectSpread2({}, rotationHandles), {}, {
          normal: normalLine,
          radius: radius
        });
      }
      var resizingEdges = {
        te: [finalVertices.tl, finalVertices.tr],
        be: [finalVertices.bl, finalVertices.br],
        le: [finalVertices.tl, finalVertices.bl],
        re: [finalVertices.tr, finalVertices.br]
      };
      var boxHandles = {
        tl: finalVertices.tl,
        tr: finalVertices.tr,
        br: finalVertices.br,
        bl: finalVertices.bl,
        tc: finalVertices.tc,
        bc: finalVertices.bc,
        ml: finalVertices.ml,
        mr: finalVertices.mr
      };
      var resizingHandles = resizable ? keys$1(boxHandles).filter(function (key) {
        return _this.isHandleEnabled(key);
      }).reduce(function (result, key) {
        result[key] = boxHandles[key];
        return result;
      }, {}) : {};
      var nextTransformOrigin = Array.isArray(transformOrigin) ? [].concat(_toConsumableArray(transformOrigin), [0, 1]) : [].concat(_toConsumableArray(finalVertices.center), [0, 1]);
      var allHandles = _objectSpread2(_objectSpread2({}, resizingHandles), {}, {
        center: transformOrigin && rotatable ? _toConsumableArray(nextTransformOrigin).slice(0, 2) : undefined,
        rotator: rotator
      });
      var mapHandlers = function mapHandlers(obj, renderFunc) {
        return keys$1(obj).map(function (key) {
          var data = obj[key];
          if (isUndef(data)) return;
          var handler = renderFunc(data, key);
          handles[key] = handler;
          controls.appendChild(handler);
        });
      };
      mapHandlers(resizingEdges, renderLine$1);
      keys$1(resizingEdges).filter(function (key) {
        return !_this.isHandleEnabled(key);
      }).forEach(function (key) {
        return helper(handles[key]).css({
          pointerEvents: 'none'
        });
      });
      mapHandlers(allHandles, createHandler$1);
      wrapper.appendChild(controls);
      controlsContainer.appendChild(wrapper);
      var data = new WeakMap();
      elements.map(function (element) {
        return data.set(element, {
          parent: element.parentNode,
          transform: {
            ctm: getCurrentTransformMatrix(element, container)
          },
          bBox: _this.getBBox(),
          __data__: new WeakMap(),
          cached: {}
        });
      });
      var restrictContainer = restrict || container;
      this.storage = {
        wrapper: wrapper,
        controls: controls,
        handles: _objectSpread2(_objectSpread2({}, handles), rotationHandles),
        data: data,
        center: {
          isShifted: Array.isArray(transformOrigin)
        },
        transformOrigin: nextTransformOrigin,
        transform: {
          containerMatrix: getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode)
        },
        cached: {}
      };
      [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
        return helper(target).on(E_MOUSEDOWN$2, _this.onMouseDown).on(E_TOUCHSTART$2, _this.onTouchStart);
      });
    }

    /** @internal */
  }, {
    key: "pointToTransform",
    value: function pointToTransform(_ref) {
      var x = _ref.x,
        y = _ref.y,
        matrix = _ref.matrix;
      var nextMatrix = matrixInvert(matrix);
      return this.applyMatrixToPoint(dropTranslate(nextMatrix, false), x, y);
    }

    /** @internal */
  }, {
    key: "pointToControls",
    value: function pointToControls(_ref2) {
      var x = _ref2.x,
        y = _ref2.y;
      var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
      var controlsMatrix = transform.controlsMatrix;
      var matrix = matrixInvert(controlsMatrix);
      return this.applyMatrixToPoint(dropTranslate(matrix, false), x, y);
    }

    /** @internal */
  }, {
    key: "applyMatrixToPoint",
    value: function applyMatrixToPoint(matrix, x, y) {
      var _multiplyMatrixAndPoi = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]),
        _multiplyMatrixAndPoi2 = _slicedToArray(_multiplyMatrixAndPoi, 2),
        nx = _multiplyMatrixAndPoi2[0],
        ny = _multiplyMatrixAndPoi2[1];
      return {
        x: nx,
        y: ny
      };
    }

    /** @internal */
  }, {
    key: "cursorPoint",
    value: function cursorPoint(_ref3) {
      var clientX = _ref3.clientX,
        clientY = _ref3.clientY;
      var container = this.options.container;
      var globalMatrix = getCurrentTransformMatrix(container);
      var offset = getElementOffset(container);
      var _getScrollOffset = getScrollOffset(),
        left = _getScrollOffset.left,
        top = _getScrollOffset.top;
      var translateMatrix = createTranslateMatrix$1(offset.left - left, offset.top - top);
      return this.applyMatrixToPoint(matrixInvert(multiplyMatrix(globalMatrix, translateMatrix)), clientX, clientY);
    }

    /** @internal */
  }, {
    key: "getRestrictedBBox",
    value: function getRestrictedBBox() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var containerMatrix = this.storage.transform.containerMatrix,
        _this$options2 = this.options,
        restrict = _this$options2.restrict,
        container = _this$options2.container;
      var restrictEl = restrict || container;
      return _getBoundingRect$1(restrictEl, container, force ? getCurrentTransformMatrix(restrictEl, container) : containerMatrix);
    }

    /** @internal */
  }, {
    key: "applyTransformToElement",
    value: function applyTransformToElement(element) {
      var _this$storage = this.storage,
        controls = _this$storage.controls,
        data = _this$storage.data,
        applyTranslate = this.options.applyTranslate;
      var _ref4 = data.get(element),
        cached = _ref4.cached,
        matrix = _ref4.transform.matrix;
      var $controls = helper(controls);
      if (isUndef(cached)) return;
      if (applyTranslate) {
        var $el = helper(element);
        var dx = cached.dx,
          dy = cached.dy;
        var css = matrixToCSS(matrix);
        var left = parseFloat(element.style.left || $el.css('left'));
        var top = parseFloat(element.style.top || $el.css('top'));
        css.left = "".concat(left + dx, "px");
        css.top = "".concat(top + dy, "px");
        $el.css(css);
        $controls.css(css);
      }
    }

    /** @internal */
  }, {
    key: "processActions",
    value: function processActions() {}

    /** @internal */
  }, {
    key: "processPointMove",
    value: function processPointMove() {
      return null;
    }

    /** @internal */
  }, {
    key: "prepareGuides",
    value: function prepareGuides() {
      return null;
    }

    /** @internal */
  }, {
    key: "drawGuides",
    value: function drawGuides() {}

    /** @internal */
  }, {
    key: "prepareRestrict",
    value: function prepareRestrict() {
      return null;
    }

    /** @internal */
  }, {
    key: "processResize",
    value: function processResize(element, _ref5) {
      var dx = _ref5.dx,
        dy = _ref5.dy;
      var _this$storage2 = this.storage,
        revX = _this$storage2.revX,
        revY = _this$storage2.revY,
        doW = _this$storage2.doW,
        doH = _this$storage2.doH,
        data = _this$storage2.data,
        _this$storage2$bBox = _this$storage2.bBox,
        boxWidth = _this$storage2$bBox.width,
        boxHeight = _this$storage2$bBox.height,
        _this$options3 = this.options,
        proportions = _this$options3.proportions,
        scalable = _this$options3.scalable;
      var elementData = data.get(element);
      var _elementData$transfor = elementData.transform,
        matrix = _elementData$transfor.matrix,
        translateMatrix = _elementData$transfor.auxiliary.scale.translateMatrix,
        cached = elementData.cached;
      var getScale = function getScale(distX, distY) {
        var ratio = doW || !doW && !doH ? (boxWidth + distX) / boxWidth : (boxHeight + distY) / boxHeight;
        var newWidth = proportions ? boxWidth * ratio : boxWidth + distX,
          newHeight = proportions ? boxHeight * ratio : boxHeight + distY;
        var scaleX = newWidth / boxWidth,
          scaleY = newHeight / boxHeight;
        return [scaleX, scaleY, newWidth, newHeight];
      };
      var getScaleMatrix = function getScaleMatrix(scaleX, scaleY) {
        var scaleMatrix = createScaleMatrix$1(scaleX, scaleY);
        return multiplyMatrix(multiplyMatrix(translateMatrix, scaleMatrix), matrixInvert(translateMatrix));
      };
      var getTranslateMatrix = function getTranslateMatrix(scM, ctm) {
        var translateX = scM[0][3];
        var translateY = scM[1][3];
        var trMatrix = createTranslateMatrix$1(translateX, translateY);
        var inverted = createTranslateMatrix$1(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
        return multiplyMatrix(multiplyMatrix(inverted, ctm), matrixInvert(trMatrix));
      };
      var _getScale = getScale(dx, dy),
        _getScale2 = _slicedToArray(_getScale, 4),
        scaleX = _getScale2[0],
        scaleY = _getScale2[1],
        newWidth = _getScale2[2],
        newHeight = _getScale2[3];
      var scaleMatrix = getScaleMatrix(scaleX, scaleY);
      var resultMatrix = scalable ? multiplyMatrix(scaleMatrix, matrix) : getTranslateMatrix(scaleMatrix, matrix);
      if (newWidth <= MIN_SIZE || newHeight <= MIN_SIZE) {
        return {
          transform: resultMatrix,
          width: newWidth,
          height: newHeight
        };
      }
      this.updateElementView(element, _objectSpread2(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))), !scalable && {
        width: "".concat(newWidth, "px"),
        height: "".concat(newHeight, "px")
      }));
      data.set(element, _objectSpread2(_objectSpread2({}, elementData), {}, {
        cached: _objectSpread2(_objectSpread2({}, cached), {}, {
          dx: dx,
          dy: dy,
          bBox: {
            width: newWidth,
            height: newHeight
          }
        })
      }));
      return {
        transform: resultMatrix,
        width: newWidth,
        height: newHeight
      };
    }

    /** @internal */
  }, {
    key: "processMove",
    value: function processMove(element, _ref6) {
      var dx = _ref6.dx,
        dy = _ref6.dy;
      var data = this.storage.data;
      var elementStorage = data.get(element);
      var _elementStorage$trans = elementStorage.transform,
        matrix = _elementStorage$trans.matrix,
        parentMatrix = _elementStorage$trans.auxiliary.translate.parentMatrix,
        _elementStorage$cache = elementStorage.cached,
        cached = _elementStorage$cache === void 0 ? {} : _elementStorage$cache;
      var _multiplyMatrixAndPoi3 = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]),
        _multiplyMatrixAndPoi4 = _slicedToArray(_multiplyMatrixAndPoi3, 2),
        nx = _multiplyMatrixAndPoi4[0],
        ny = _multiplyMatrixAndPoi4[1];
      var moveElementMtrx = multiplyMatrix(matrix, createTranslateMatrix$1(nx, ny));
      var elStyle = matrixToCSS(flatMatrix(moveElementMtrx));
      this.updateElementView(element, elStyle);
      data.set(element, _objectSpread2(_objectSpread2({}, elementStorage), {}, {
        cached: _objectSpread2(_objectSpread2({}, cached), {}, {
          dist: {
            dx: floatToFixed(dx),
            dy: floatToFixed(dy),
            ox: floatToFixed(nx),
            oy: floatToFixed(ny)
          }
        })
      }));
      return moveElementMtrx;
    }

    /** @internal */
  }, {
    key: "processRotate",
    value: function processRotate(element, radians) {
      var data = this.storage.data,
        restrict = this.options.restrict;
      var _ref7 = data.get(element),
        _ref7$transform = _ref7.transform,
        matrix = _ref7$transform.matrix,
        translateMatrix = _ref7$transform.auxiliary.rotate.translateMatrix;
      var cos = floatToFixed(Math.cos(radians), 4),
        sin = floatToFixed(Math.sin(radians), 4);
      var rotationMatrix = createRotateMatrix$1(sin, cos);
      var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix), translateMatrix);
      var resultMatrix = multiplyMatrix(matrix, transformMatrix);
      var _ref8 = restrict ? this.restrictHandler(resultMatrix) : {
          x: null,
          y: null
        },
        restX = _ref8.x,
        restY = _ref8.y;
      if (isDef(restX) || isDef(restY)) return resultMatrix;
      this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
      return resultMatrix;
    }

    /** @internal */
  }, {
    key: "getElementState",
    value: function getElementState(element, _ref9) {
      var revX = _ref9.revX,
        revY = _ref9.revY,
        doW = _ref9.doW,
        doH = _ref9.doH;
      var _this$storage3 = this.storage,
        cHandle = _this$storage3.handles.center,
        data = _this$storage3.data,
        transformOrigin = _this$storage3.transformOrigin,
        _this$options4 = this.options,
        container = _this$options4.container,
        scalable = _this$options4.scalable;
      var storage = data.get(element);
      var parent = storage.parent;
      var _getAbsoluteOffset = getAbsoluteOffset(element, container),
        _getAbsoluteOffset2 = _slicedToArray(_getAbsoluteOffset, 2),
        glLeft = _getAbsoluteOffset2[0],
        glTop = _getAbsoluteOffset2[1];
      var elOffsetLeft = element.offsetLeft,
        elOffsetTop = element.offsetTop,
        elWidth = element.offsetWidth,
        elHeight = element.offsetHeight;
      var matrix = getTransform(element);
      var ctm = getCurrentTransformMatrix(element, container);
      var parentMatrix = getCurrentTransformMatrix(parent, container);
      var hW = elWidth / 2,
        hH = elHeight / 2;

      // real element's center
      var _multiplyMatrixAndPoi5 = multiplyMatrixAndPoint(ctm, [hW, hH, 0, 1]),
        _multiplyMatrixAndPoi6 = _slicedToArray(_multiplyMatrixAndPoi5, 2),
        cenX = _multiplyMatrixAndPoi6[0],
        cenY = _multiplyMatrixAndPoi6[1];
      var scaleX = doH ? 0 : revX ? -hW : hW,
        scaleY = doW ? 0 : revY ? -hH : hH;
      var globalCenterX = cenX + glLeft;
      var globalCenterY = cenY + glTop;
      var originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();

      // search distance between el's center and rotation handle
      var _multiplyMatrixAndPoi7 = multiplyMatrixAndPoint(multiplyMatrix(matrixInvert(dropTranslate(ctm)), dropTranslate(originTransform)), [transformOrigin[0] - globalCenterX, transformOrigin[1] - globalCenterY, 0, 1]),
        _multiplyMatrixAndPoi8 = _slicedToArray(_multiplyMatrixAndPoi7, 2),
        distX = _multiplyMatrixAndPoi8[0],
        distY = _multiplyMatrixAndPoi8[1];

      // todo: check rotation origin with parent transform
      var _multiplyMatrixAndPoi9 = multiplyMatrixAndPoint(matrix, [distX, distY, 0, 1]),
        _multiplyMatrixAndPoi0 = _slicedToArray(_multiplyMatrixAndPoi9, 2),
        elX = _multiplyMatrixAndPoi0[0],
        elY = _multiplyMatrixAndPoi0[1];
      var _decompose = decompose(getCurrentTransformMatrix(element, element.parentNode)),
        _decompose$scale = _decompose.scale,
        sX = _decompose$scale.sX,
        sY = _decompose$scale.sY;
      var transform = {
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
        scaleX: scaleX,
        scaleY: scaleY,
        matrix: matrix,
        ctm: ctm,
        parentMatrix: parentMatrix,
        scX: sX,
        scY: sY
      };
      return {
        transform: transform,
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
  }, {
    key: "getCommonState",
    value: function getCommonState() {
      var elements = this.elements,
        _this$storage4 = this.storage,
        controls = _this$storage4.controls,
        cHandle = _this$storage4.handles.center,
        oldCenter = _this$storage4.center,
        wrapper = _this$storage4.wrapper,
        _this$options5 = this.options,
        container = _this$options5.container,
        restrict = _this$options5.restrict;
      var _getAbsoluteOffset3 = getAbsoluteOffset(elements[0], container),
        _getAbsoluteOffset4 = _slicedToArray(_getAbsoluteOffset3, 2),
        glLeft = _getAbsoluteOffset4[0],
        glTop = _getAbsoluteOffset4[1];
      var ctm = getCurrentTransformMatrix(elements[0], container);
      var restrictContainer = restrict || container;
      var containerMatrix = getCurrentTransformMatrix(restrictContainer, restrictContainer.parentNode);
      var _this$getBBox = this.getBBox(),
        boxWidth = _this$getBBox.width,
        boxHeight = _this$getBBox.height;

      // real element's center
      var _multiplyMatrixAndPoi1 = multiplyMatrixAndPoint(ctm, [boxWidth / 2, boxHeight / 2, 0, 1]),
        _multiplyMatrixAndPoi10 = _slicedToArray(_multiplyMatrixAndPoi1, 2),
        cenX = _multiplyMatrixAndPoi10[0],
        cenY = _multiplyMatrixAndPoi10[1];
      var globalCenterX = cenX + glLeft;
      var globalCenterY = cenY + glTop;
      var originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();
      return {
        transform: {
          controlsMatrix: getCurrentTransformMatrix(controls, controls.parentNode),
          containerMatrix: containerMatrix,
          wrapperMatrix: getCurrentTransformMatrix(wrapper, container)
        },
        bBox: _objectSpread2({}, this.getBBox()),
        center: _objectSpread2(_objectSpread2({}, oldCenter), {}, {
          x: globalCenterX,
          y: globalCenterY,
          matrix: originTransform
        })
      };
    }

    /** @internal */
  }, {
    key: "getBBox",
    value: function getBBox() {
      var _this$elements = _slicedToArray(this.elements, 1),
        element = _this$elements[0],
        _this$options6 = this.options,
        isGrouped = _this$options6.isGrouped,
        container = _this$options6.container;
      if (isGrouped) {
        return this.getGroupBbox();
      } else {
        var _getAbsoluteOffset5 = getAbsoluteOffset(element, container),
          _getAbsoluteOffset6 = _slicedToArray(_getAbsoluteOffset5, 2),
          offsetLeft = _getAbsoluteOffset6[0],
          offsetTop = _getAbsoluteOffset6[1];
        var elOffsetLeft = element.offsetLeft,
          elOffsetTop = element.offsetTop,
          elWidth = element.offsetWidth,
          elHeight = element.offsetHeight;
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
  }, {
    key: "processControlsResize",
    value: function processControlsResize() {
      var _this$applyTransformT = this.applyTransformToHandles(),
        center = _this$applyTransformT.center;
      var controlsMatrix = this.storage.transform.controlsMatrix;
      if (!center) return;
      this.storage = _objectSpread2(_objectSpread2({}, this.storage), {}, {
        cached: {
          transformOrigin: multiplyMatrixAndPoint(controlsMatrix, center)
        }
      });
    }

    /** @internal */
  }, {
    key: "processControlsMove",
    value: function processControlsMove(_ref0) {
      var dx = _ref0.dx,
        dy = _ref0.dy;
      var _this$storage5 = this.storage,
        _this$storage5$transf = _this$storage5.transform,
        controlsMatrix = _this$storage5$transf.controlsMatrix,
        wrapperMatrix = _this$storage5$transf.wrapperMatrix,
        center = _this$storage5.center,
        transformOrigin = _this$storage5.transformOrigin;
      var moveControlsMtrx = multiplyMatrix(controlsMatrix, createTranslateMatrix$1(dx, dy));
      this.updateControlsView(moveControlsMtrx);
      var centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));
      var _multiplyMatrixAndPoi11 = multiplyMatrixAndPoint(centerTransformMatrix, [dx, dy, 0, 1]),
        _multiplyMatrixAndPoi12 = _slicedToArray(_multiplyMatrixAndPoi11, 2),
        cx = _multiplyMatrixAndPoi12[0],
        cy = _multiplyMatrixAndPoi12[1];
      if (center.isShifted) {
        this.moveCenterHandle(-cx, -cy, false);
      } else {
        var translateMatrix = createTranslateMatrix$1(cx, cy);
        this.storage = _objectSpread2(_objectSpread2({}, this.storage), {}, {
          cached: {
            transformOrigin: multiplyMatrixAndPoint(translateMatrix, transformOrigin)
          }
        });
      }
    }

    /** @internal */
  }, {
    key: "processControlsRotate",
    value: function processControlsRotate(_ref1) {
      var radians = _ref1.radians;
      var _this$storage6 = this.storage,
        _this$storage6$transf = _this$storage6.transform,
        wrapperMatrix = _this$storage6$transf.wrapperMatrix,
        controlsMatrix = _this$storage6$transf.controlsMatrix,
        _this$storage6$transf2 = _slicedToArray(_this$storage6.transformOrigin, 2),
        originX = _this$storage6$transf2[0],
        originY = _this$storage6$transf2[1];
      var cos = floatToFixed(Math.cos(radians)),
        sin = floatToFixed(Math.sin(radians));
      var rotateMatrix = createRotateMatrix$1(sin, cos);
      var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(wrapperMatrix), rotateMatrix), wrapperMatrix);
      var rotateResultMatrix = multiplyMatrix(multiplyMatrix(createTranslateMatrix$1(-originX, -originY), transformMatrix), createTranslateMatrix$1(originX, originY));
      this.updateControlsView(multiplyMatrix(controlsMatrix, rotateResultMatrix));
    }

    /** @internal */
  }, {
    key: "moveCenterHandle",
    value: function moveCenterHandle(x, y) {
      var updateTransformOrigin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var _this$storage7 = this.storage,
        center = _this$storage7.handles.center,
        matrix = _this$storage7.center.matrix,
        prevCenterData = _this$storage7.center,
        transformOrigin = _this$storage7.transformOrigin;
      var translateMatrix = createTranslateMatrix$1(x, y);
      var resultMatrix = multiplyMatrix(matrix, translateMatrix);
      helper(center).css(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))));
      this.storage = _objectSpread2(_objectSpread2({}, this.storage), {}, {
        center: _objectSpread2(_objectSpread2({}, prevCenterData), {}, {
          isShifted: true
        })
      }, updateTransformOrigin ? {
        cached: {
          transformOrigin: multiplyMatrixAndPoint(translateMatrix, transformOrigin)
        }
      } : {});
    }

    /** @internal */
  }, {
    key: "processMoveRestrict",
    value: function processMoveRestrict(element, _ref10) {
      var dx = _ref10.dx,
        dy = _ref10.dy;
      var data = this.storage.data;
      var elementStorage = data.get(element);
      var _elementStorage$trans2 = elementStorage.transform,
        matrix = _elementStorage$trans2.matrix,
        parentMatrix = _elementStorage$trans2.auxiliary.translate.parentMatrix;
      var _multiplyMatrixAndPoi13 = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]),
        _multiplyMatrixAndPoi14 = _slicedToArray(_multiplyMatrixAndPoi13, 2),
        x = _multiplyMatrixAndPoi14[0],
        y = _multiplyMatrixAndPoi14[1];
      var preTranslateMatrix = multiplyMatrix(matrix, createTranslateMatrix$1(x, y));
      return this.restrictHandler(preTranslateMatrix);
    }

    /** @internal */
  }, {
    key: "processRotateRestrict",
    value: function processRotateRestrict(element, radians) {
      var data = this.storage.data;
      var _ref11 = data.get(element),
        _ref11$transform = _ref11.transform,
        matrix = _ref11$transform.matrix,
        translateMatrix = _ref11$transform.auxiliary.rotate.translateMatrix;
      var cos = floatToFixed(Math.cos(radians), 4),
        sin = floatToFixed(Math.sin(radians), 4);
      var rotationMatrix = createRotateMatrix$1(sin, cos);
      var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix), translateMatrix);
      var resultMatrix = multiplyMatrix(matrix, transformMatrix);
      return this.restrictHandler(resultMatrix);
    }

    /** @internal */
  }, {
    key: "processResizeRestrict",
    value: function processResizeRestrict(element, _ref12) {
      var dx = _ref12.dx,
        dy = _ref12.dy;
      var _this$storage8 = this.storage,
        revX = _this$storage8.revX,
        revY = _this$storage8.revY,
        doW = _this$storage8.doW,
        doH = _this$storage8.doH,
        data = _this$storage8.data,
        _this$storage8$bBox = _this$storage8.bBox,
        boxWidth = _this$storage8$bBox.width,
        boxHeight = _this$storage8$bBox.height,
        _this$options7 = this.options,
        proportions = _this$options7.proportions,
        scalable = _this$options7.scalable;
      var elementData = data.get(element);
      var _elementData$transfor2 = elementData.transform,
        matrix = _elementData$transfor2.matrix,
        translateMatrix = _elementData$transfor2.auxiliary.scale.translateMatrix;
      var getScale = function getScale(distX, distY) {
        var ratio = doW || !doW && !doH ? (boxWidth + distX) / boxWidth : (boxHeight + distY) / boxHeight;
        var newWidth = proportions ? boxWidth * ratio : boxWidth + distX,
          newHeight = proportions ? boxHeight * ratio : boxHeight + distY;
        var scaleX = newWidth / boxWidth,
          scaleY = newHeight / boxHeight;
        return [scaleX, scaleY, newWidth, newHeight];
      };
      var getScaleMatrix = function getScaleMatrix(scaleX, scaleY) {
        var scaleMatrix = createScaleMatrix$1(scaleX, scaleY);
        return multiplyMatrix(multiplyMatrix(translateMatrix, scaleMatrix), matrixInvert(translateMatrix));
      };
      var getTranslateMatrix = function getTranslateMatrix(scM, ctm) {
        var translateX = scM[0][3];
        var translateY = scM[1][3];
        var trMatrix = createTranslateMatrix$1(translateX, translateY);
        var inverted = createTranslateMatrix$1(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
        return multiplyMatrix(multiplyMatrix(inverted, ctm), matrixInvert(trMatrix));
      };
      var _getScale3 = getScale(dx, dy),
        _getScale4 = _slicedToArray(_getScale3, 2),
        pScaleX = _getScale4[0],
        pScaleY = _getScale4[1];
      var preScaleMatrix = getScaleMatrix(pScaleX, pScaleY);
      var preResultMatrix = scalable ? multiplyMatrix(preScaleMatrix, matrix) : getTranslateMatrix(preScaleMatrix, matrix);
      return this.restrictHandler(preResultMatrix);
    }

    /** @internal */
  }, {
    key: "updateElementView",
    value: function updateElementView(element, css) {
      helper(element).css(css);
    }

    /** @internal */
  }, {
    key: "updateControlsView",
    value: function updateControlsView() {
      var matrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createIdentityMatrix();
      var cssStyle = matrixToCSS(flatMatrix(matrix));
      helper(this.storage.controls).css(cssStyle);
      this.storage.cached.controlsMatrix = matrix;
    }

    /**
     * Handle positions as [x, y, ...] arrays in container coordinates: box corners
     * and edge midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, and rotator
     * when rotatable; anchor, the rotator's base point, is { x, y }
     * @param transformMatrix matrix applied on top of the element transform
     */
  }, {
    key: "getVertices",
    value: function getVertices() {
      var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createIdentityMatrix();
      var _this$elements2 = this.elements,
        _this$elements3 = _this$elements2 === void 0 ? [] : _this$elements2,
        _this$elements4 = _slicedToArray(_this$elements3, 1),
        element = _this$elements4[0],
        _this$options8 = this.options,
        isGrouped = _this$options8.isGrouped,
        rotatable = _this$options8.rotatable,
        rotatorAnchor = _this$options8.rotatorAnchor,
        rotatorOffset = _this$options8.rotatorOffset;
      var finalVertices = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, transformMatrix);
      var rotator = null;
      if (rotatable) {
        var anchor = {};
        var factor = 1;
        switch (rotatorAnchor) {
          case 'n':
            anchor.x = finalVertices.tc[0];
            anchor.y = finalVertices.tc[1];
            break;
          case 's':
            anchor.x = finalVertices.bc[0];
            anchor.y = finalVertices.bc[1];
            factor = -1;
            break;
          case 'w':
            anchor.x = finalVertices.ml[0];
            anchor.y = finalVertices.ml[1];
            factor = -1;
            break;
          case 'e':
          default:
            anchor.x = finalVertices.mr[0];
            anchor.y = finalVertices.mr[1];
            break;
        }
        var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? rotatorAngle(finalVertices.bl[0] - finalVertices.tl[0], finalVertices.bl[1] - finalVertices.tl[1], finalVertices.tr[0] - finalVertices.tl[0], finalVertices.tr[1] - finalVertices.tl[1]) : rotatorAngle(finalVertices.tl[0] - finalVertices.tr[0], finalVertices.tl[1] - finalVertices.tr[1], finalVertices.bl[0] - finalVertices.tl[0], finalVertices.bl[1] - finalVertices.tl[1]);
        rotator = [anchor.x - rotatorOffset * factor * Math.cos(theta), anchor.y - rotatorOffset * factor * Math.sin(theta)];
        finalVertices.rotator = rotator;
        finalVertices.anchor = anchor;
      }
      return finalVertices;
    }

    /** @internal */
  }, {
    key: "getElementVertices",
    value: function getElementVertices(element, transformMatrix) {
      var _this$options9 = this.options,
        container = _this$options9.container,
        isGrouped = _this$options9.isGrouped;
      var _getAbsoluteOffset7 = getAbsoluteOffset(element, container),
        _getAbsoluteOffset8 = _slicedToArray(_getAbsoluteOffset7, 2),
        offsetLeft = _getAbsoluteOffset8[0],
        offsetTop = _getAbsoluteOffset8[1];
      var offsetWidth = element.offsetWidth,
        offsetHeight = element.offsetHeight;
      var vertices = {
        tl: [0, 0, 0, 1],
        bl: [0, offsetHeight, 0, 1],
        br: [offsetWidth, offsetHeight, 0, 1],
        tr: [offsetWidth, 0, 0, 1],
        tc: [offsetWidth / 2, 0, 0, 1],
        ml: [0, offsetHeight / 2, 0, 1],
        bc: [offsetWidth / 2, offsetHeight, 0, 1],
        mr: [offsetWidth, offsetHeight / 2, 0, 1],
        center: [offsetWidth / 2, offsetHeight / 2, 0, 1]
      };
      var nextTransform = isGrouped ? transformMatrix : multiplyMatrix(getCurrentTransformMatrix(element, container), transformMatrix);
      return entries$1(vertices).reduce(function (nextVertices, _ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
          key = _ref14[0],
          vertex = _ref14[1];
        return [].concat(_toConsumableArray(nextVertices), [[key, multiplyMatrixAndPoint(nextTransform, vertex)]]);
      }, []).reduce(function (vertices, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
          key = _ref16[0],
          _ref16$ = _slicedToArray(_ref16[1], 4),
          x = _ref16$[0],
          y = _ref16$[1],
          z = _ref16$[2],
          w = _ref16$[3];
        vertices[key] = [x + offsetLeft, y + offsetTop, z, w];
        return vertices;
      }, {});
    }

    /** @internal */
  }, {
    key: "getGroupVertices",
    value: function getGroupVertices() {
      var _this$getGroupBbox = this.getGroupBbox(),
        x = _this$getGroupBbox.x,
        y = _this$getGroupBbox.y,
        width = _this$getGroupBbox.width,
        height = _this$getGroupBbox.height;
      var hW = width / 2,
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
    }

    /** @internal */
  }, {
    key: "getGroupBbox",
    value: function getGroupBbox() {
      var elements = this.elements,
        container = this.options.container;
      var vertices = elements.reduce(function (result, element) {
        var _getAbsoluteOffset9 = getAbsoluteOffset(element, container),
          _getAbsoluteOffset0 = _slicedToArray(_getAbsoluteOffset9, 2),
          offsetLeft = _getAbsoluteOffset0[0],
          offsetTop = _getAbsoluteOffset0[1];
        var offsetWidth = element.offsetWidth,
          offsetHeight = element.offsetHeight;
        var vertices = [[0, 0, 0, 1], [0, offsetHeight, 0, 1], [offsetWidth, offsetHeight, 0, 1], [offsetWidth, 0, 0, 1]];
        var nextTransform = getCurrentTransformMatrix(element, container);
        var groupVertices = vertices.reduce(function (nextVertices, vertex) {
          return [].concat(_toConsumableArray(nextVertices), [multiplyMatrixAndPoint(nextTransform, vertex)]);
        }, []).map(function (_ref17) {
          var _ref18 = _slicedToArray(_ref17, 4),
            x = _ref18[0],
            y = _ref18[1],
            z = _ref18[2],
            w = _ref18[3];
          return [x + offsetLeft, y + offsetTop, z, w];
        });
        return [].concat(_toConsumableArray(result), [groupVertices]);
      }, []);
      var _getMinMaxOfArray = getMinMaxOfArray(vertices.reduce(function (res, item) {
          return [].concat(_toConsumableArray(res), _toConsumableArray(item));
        }, [])),
        _getMinMaxOfArray2 = _slicedToArray(_getMinMaxOfArray, 2),
        _getMinMaxOfArray2$ = _slicedToArray(_getMinMaxOfArray2[0], 2),
        minX = _getMinMaxOfArray2$[0],
        maxX = _getMinMaxOfArray2$[1],
        _getMinMaxOfArray2$2 = _slicedToArray(_getMinMaxOfArray2[1], 2),
        minY = _getMinMaxOfArray2$2[0],
        maxY = _getMinMaxOfArray2$2[1];
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    /** @internal */
  }, {
    key: "getElementBBox",
    value: function getElementBBox(element) {
      var container = this.options.container;
      var _getAbsoluteOffset1 = getAbsoluteOffset(element, container),
        _getAbsoluteOffset10 = _slicedToArray(_getAbsoluteOffset1, 2),
        offsetLeft = _getAbsoluteOffset10[0],
        offsetTop = _getAbsoluteOffset10[1];
      var offsetWidth = element.offsetWidth,
        offsetHeight = element.offsetHeight;
      var vertices = [[0, 0, 0, 1], [0, offsetHeight, 0, 1], [offsetWidth, offsetHeight, 0, 1], [offsetWidth, 0, 0, 1]];
      var nextTransform = getCurrentTransformMatrix(element, container);
      var nextVertices = vertices.reduce(function (nextVertices, vertex) {
        return [].concat(_toConsumableArray(nextVertices), [multiplyMatrixAndPoint(nextTransform, vertex)]);
      }, []).map(function (_ref19) {
        var _ref20 = _slicedToArray(_ref19, 4),
          x = _ref20[0],
          y = _ref20[1],
          z = _ref20[2],
          w = _ref20[3];
        return [x + offsetLeft, y + offsetTop, z, w];
      });
      var _getMinMaxOfArray3 = getMinMaxOfArray(nextVertices),
        _getMinMaxOfArray4 = _slicedToArray(_getMinMaxOfArray3, 2),
        _getMinMaxOfArray4$ = _slicedToArray(_getMinMaxOfArray4[0], 2),
        minX = _getMinMaxOfArray4$[0],
        maxX = _getMinMaxOfArray4$[1],
        _getMinMaxOfArray4$2 = _slicedToArray(_getMinMaxOfArray4[1], 2),
        minY = _getMinMaxOfArray4$2[0],
        maxY = _getMinMaxOfArray4$2[1];
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }

    /** @internal */
  }, {
    key: "applyTransformToHandles",
    value: function applyTransformToHandles() {
      var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref21$boxMatrix = _ref21.boxMatrix,
        boxMatrix = _ref21$boxMatrix === void 0 ? createIdentityMatrix() : _ref21$boxMatrix;
      var _this$options0 = this.options,
        rotatable = _this$options0.rotatable,
        resizable = _this$options0.resizable,
        showNormal = _this$options0.showNormal,
        _this$storage9 = this.storage,
        handles = _this$storage9.handles,
        controls = _this$storage9.controls,
        _this$storage9$center = _this$storage9.center,
        _this$storage9$center2 = _this$storage9$center === void 0 ? {} : _this$storage9$center,
        _this$storage9$center3 = _this$storage9$center2.isShifted,
        isShifted = _this$storage9$center3 === void 0 ? false : _this$storage9$center3,
        _this$storage9$transf = _this$storage9.transform,
        _this$storage9$transf2 = _this$storage9$transf === void 0 ? {} : _this$storage9$transf,
        _this$storage9$transf3 = _this$storage9$transf2.controlsMatrix,
        controlsMatrix = _this$storage9$transf3 === void 0 ? getCurrentTransformMatrix(controls, controls.parentNode) : _this$storage9$transf3;
      var matrix = multiplyMatrix(boxMatrix,
      // better to find result matrix instead of calculated
      matrixInvert(controlsMatrix));
      var _this$getVertices2 = this.getVertices(matrix),
        _this$getVertices2$an = _this$getVertices2.anchor,
        anchor = _this$getVertices2$an === void 0 ? null : _this$getVertices2$an,
        center = _this$getVertices2.center,
        finalVertices = _objectWithoutProperties(_this$getVertices2, _excluded2$1);
      var normalLine = null;
      var rotationHandles = {};
      if (rotatable) {
        normalLine = showNormal ? [[anchor.x, anchor.y], finalVertices.rotator] : null;
        rotationHandles = {
          rotator: finalVertices.rotator
        };
      }
      var resizingEdges = _objectSpread2({
        te: [finalVertices.tl, finalVertices.tr],
        be: [finalVertices.bl, finalVertices.br],
        le: [finalVertices.tl, finalVertices.bl],
        re: [finalVertices.tr, finalVertices.br]
      }, showNormal && normalLine && {
        normal: normalLine
      });
      keys$1(resizingEdges).forEach(function (key) {
        var _resizingEdges$key = _slicedToArray(resizingEdges[key], 2),
          pt1 = _resizingEdges$key[0],
          pt2 = _resizingEdges$key[1];
        var _getLineAttrs = getLineAttrs(pt1, pt2),
          cx = _getLineAttrs.cx,
          cy = _getLineAttrs.cy,
          length = _getLineAttrs.length,
          theta = _getLineAttrs.theta;
        helper(handles[key]).css({
          transform: "translate(".concat(cx, "px, ").concat(cy, "px) rotate(").concat(theta, "deg)"),
          width: "".concat(length, "px")
        });
      });
      var allHandles = _objectSpread2(_objectSpread2(_objectSpread2({}, resizable && finalVertices), rotationHandles), !isShifted && Boolean(center) && {
        center: center
      });
      return keys$1(allHandles).reduce(function (result, key) {
        var hdl = handles[key];
        var attr = allHandles[key];
        result[key] = attr;
        if (isUndef(attr) || isUndef(hdl)) return result;
        var _attr = _slicedToArray(attr, 2),
          x = _attr[0],
          y = _attr[1];
        helper(hdl).css({
          transform: "translate(".concat(x, "px, ").concat(y, "px)")
        });
        return result;
      }, {});
    }
  }, {
    key: "setCenterPoint",
    value: function setCenterPoint() {
      warn('"setCenterPoint" method is replaced by "setTransformOrigin" and would be removed soon');
      this.setTransformOrigin.apply(this, arguments);
    }
  }, {
    key: "setTransformOrigin",
    value: function setTransformOrigin() {
      var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        x = _ref22.x,
        y = _ref22.y,
        dx = _ref22.dx,
        dy = _ref22.dy;
      var pin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _this$elements5 = this.elements,
        _this$elements6 = _this$elements5 === void 0 ? [] : _this$elements5,
        _this$elements7 = _slicedToArray(_this$elements6, 1),
        element = _this$elements7[0],
        storage = this.storage,
        _this$storage0 = this.storage,
        _this$storage1 = _this$storage0 === void 0 ? {} : _this$storage0,
        wrapper = _this$storage1.wrapper,
        handle = _this$storage1.handles.center,
        center = _this$storage1.center,
        _this$options1 = this.options,
        _this$options10 = _this$options1 === void 0 ? {} : _this$options1,
        container = _this$options10.container;
      var isRelative = isDef(dx) && isDef(dy),
        isAbsolute = isDef(x) && isDef(y);
      if (!handle || !center || !(isRelative || isAbsolute)) return;
      var matrix = multiplyMatrix(getCurrentTransformMatrix(element, container), matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode)));
      var newX, newY;
      var _getAbsoluteOffset11 = getAbsoluteOffset(element, container),
        _getAbsoluteOffset12 = _slicedToArray(_getAbsoluteOffset11, 2),
        offsetLeft = _getAbsoluteOffset12[0],
        offsetTop = _getAbsoluteOffset12[1];
      if (isRelative) {
        var offsetHeight = element.offsetHeight,
          offsetWidth = element.offsetWidth;
        var relX = -dx + offsetWidth / 2;
        var relY = -dy + offsetHeight / 2;
        var _multiplyMatrixAndPoi15 = multiplyMatrixAndPoint(matrix, [relX, relY, 0, 1]);
        var _multiplyMatrixAndPoi16 = _slicedToArray(_multiplyMatrixAndPoi15, 2);
        newX = _multiplyMatrixAndPoi16[0];
        newY = _multiplyMatrixAndPoi16[1];
      } else {
        newX = x;
        newY = y;
      }
      helper(handle).css({
        transform: "translate(".concat(newX + offsetLeft, "px, ").concat(newY + offsetTop, "px)")
      });
      center.isShifted = pin;
      storage.transformOrigin = multiplyMatrixAndPoint(createIdentityMatrix(), [newX, newY, 0, 1]);
    }
  }, {
    key: "fitControlsToSize",
    value: function fitControlsToSize() {
      var _this$storage10 = this.storage,
        controls = _this$storage10.controls,
        _this$storage10$cente = _this$storage10.center,
        _this$storage10$cente2 = _this$storage10$cente === void 0 ? {} : _this$storage10$cente,
        isShifted = _this$storage10$cente2.isShifted,
        _this$storage10$trans = _slicedToArray(_this$storage10.transformOrigin, 2),
        originX = _this$storage10$trans[0],
        originY = _this$storage10$trans[1];
      var controlsMatrix = getCurrentTransformMatrix(controls, controls.parentNode);
      var _multiplyMatrixAndPoi17 = multiplyMatrixAndPoint(controlsMatrix, [originX, originY, 0, 1]),
        _multiplyMatrixAndPoi18 = _slicedToArray(_multiplyMatrixAndPoi17, 2),
        dx = _multiplyMatrixAndPoi18[0],
        dy = _multiplyMatrixAndPoi18[1];
      var _ref23 = [{
          nextValues: function nextValues() {
            return {
              x: dx,
              y: dy
            };
          },
          pin: true,
          condition: function condition() {
            return isShifted;
          }
        }, {
          nextValues: function nextValues() {
            return {
              dx: 0,
              dy: 0
            };
          },
          pin: false,
          condition: function condition() {
            return !isShifted;
          }
        }].find(function (_ref24) {
          var condition = _ref24.condition;
          return condition();
        }),
        nextValues = _ref23.nextValues,
        pin = _ref23.pin;
      this.updateControlsView();
      this.setTransformOrigin(_objectSpread2({}, nextValues()), pin);
      this.applyTransformToHandles();
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _this$elements8 = this.elements,
        _this$elements9 = _this$elements8 === void 0 ? [] : _this$elements8,
        _this$elements0 = _slicedToArray(_this$elements9, 1),
        element = _this$elements0[0],
        _this$options11 = this.options,
        scalable = _this$options11.scalable,
        restrict = _this$options11.restrict,
        container = _this$options11.container,
        _this$storage11 = this.storage,
        bBox = _this$storage11.bBox,
        _this$storage11$bBox = _this$storage11.bBox,
        _this$storage11$bBox2 = _this$storage11$bBox === void 0 ? {} : _this$storage11$bBox,
        width = _this$storage11$bBox2.width,
        height = _this$storage11$bBox2.height,
        _this$storage11$cache = _this$storage11.cached,
        _this$storage11$cache2 = _this$storage11$cache === void 0 ? {} : _this$storage11$cache,
        _this$storage11$cache3 = _this$storage11$cache2.bBox,
        _this$storage11$cache4 = _this$storage11$cache3 === void 0 ? {} : _this$storage11$cache3,
        _this$storage11$cache5 = _this$storage11$cache4.width,
        nextWidth = _this$storage11$cache5 === void 0 ? width : _this$storage11$cache5,
        _this$storage11$cache6 = _this$storage11$cache4.height,
        nextHeight = _this$storage11$cache6 === void 0 ? height : _this$storage11$cache6;
      var nextBox = scalable ? bBox : _objectSpread2(_objectSpread2({}, bBox), {}, {
        width: nextWidth,
        height: nextHeight
      });
      var restrictEl = restrict || container;
      return _getBoundingRect$1(element, restrictEl, getCurrentTransformMatrix(element, restrictEl, transformMatrix), nextBox);
    }
  }, {
    key: "applyAlignment",
    value: function applyAlignment(direction) {
      var _this2 = this;
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var elements = this.elements,
        container = this.options.container;
      var _this$getVertices3 = this.getVertices();
        _this$getVertices3.anchor;
        _this$getVertices3.rotator;
        _this$getVertices3.center;
        var vertices = _objectWithoutProperties(_this$getVertices3, _excluded3$1);
      var restrictBBox = target ? _getBoundingRect$1(target, container, getCurrentTransformMatrix(target, container)) : this.getRestrictedBBox(true);
      var nextVertices = values$1(vertices);
      var _getMinMaxOfArray5 = getMinMaxOfArray(restrictBBox),
        _getMinMaxOfArray6 = _slicedToArray(_getMinMaxOfArray5, 2),
        _getMinMaxOfArray6$ = _slicedToArray(_getMinMaxOfArray6[0], 2),
        minX = _getMinMaxOfArray6$[0],
        maxX = _getMinMaxOfArray6$[1],
        _getMinMaxOfArray6$2 = _slicedToArray(_getMinMaxOfArray6[1], 2),
        minY = _getMinMaxOfArray6$2[0],
        maxY = _getMinMaxOfArray6$2[1];
      var _getMinMaxOfArray7 = getMinMaxOfArray(nextVertices),
        _getMinMaxOfArray8 = _slicedToArray(_getMinMaxOfArray7, 2),
        _getMinMaxOfArray8$ = _slicedToArray(_getMinMaxOfArray8[0], 2),
        elMinX = _getMinMaxOfArray8$[0],
        elMaxX = _getMinMaxOfArray8$[1],
        _getMinMaxOfArray8$2 = _slicedToArray(_getMinMaxOfArray8[1], 2),
        elMinY = _getMinMaxOfArray8$2[0],
        elMaxY = _getMinMaxOfArray8$2[1];
      var getXDir = function getXDir() {
        switch (true) {
          case /[l]/.test(direction):
            return minX - elMinX;
          case /[r]/.test(direction):
            return maxX - elMaxX;
          case /[h]/.test(direction):
            return (maxX + minX) / 2 - (elMaxX + elMinX) / 2;
          default:
            return 0;
        }
      };
      var getYDir = function getYDir() {
        switch (true) {
          case /[t]/.test(direction):
            return minY - elMinY;
          case /[b]/.test(direction):
            return maxY - elMaxY;
          case /[v]/.test(direction):
            return (maxY + minY) / 2 - (elMaxY + elMinY) / 2;
          default:
            return 0;
        }
      };
      var _multiplyMatrixAndPoi19 = multiplyMatrixAndPoint(matrixInvert(dropTranslate(getCurrentTransformMatrix(elements[0].parentNode, container))), [getXDir(), getYDir(), 0, 1]),
        _multiplyMatrixAndPoi20 = _slicedToArray(_multiplyMatrixAndPoi19, 2),
        x = _multiplyMatrixAndPoi20[0],
        y = _multiplyMatrixAndPoi20[1];
      var moveElementMtrx = multiplyMatrix(getTransform(elements[0]), createTranslateMatrix$1(x, y));
      elements.map(function (element) {
        return _this2.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)));
      });
      this.fitControlsToSize();
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      var _this$elements1 = this.elements,
        _this$elements10 = _this$elements1 === void 0 ? [] : _this$elements1,
        _this$elements11 = _slicedToArray(_this$elements10, 1),
        element = _this$elements11[0],
        isGrouped = this.options.isGrouped;
      var _ref25 = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, createIdentityMatrix()),
        tl = _ref25.tl,
        tr = _ref25.tr,
        br = _ref25.br;
      return {
        x: floatToFixed(tl[0]),
        y: floatToFixed(tl[1]),
        width: floatToFixed(Math.sqrt(Math.pow(tl[0] - tr[0], 2) + Math.pow(tl[1] - tr[1], 2))),
        height: floatToFixed(Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2))),
        rotation: floatToFixed(Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * DEG)
      };
    }
  }]);
}(Transformable);
var createHandler$1 = function createHandler(_ref26) {
  var _ref27 = _slicedToArray(_ref26, 2),
    x = _ref27[0],
    y = _ref27[1];
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'handler';
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var element = createElement(['sjx-hdl', "sjx-hdl-".concat(key)]);
  helper(element).css(_objectSpread2({
    transform: "translate(".concat(x, "px, ").concat(y, "px)")
  }, style));
  return element;
};
var renderLine$1 = function renderLine(_ref28, key) {
  var _ref29 = _slicedToArray(_ref28, 3),
    pt1 = _ref29[0],
    pt2 = _ref29[1],
    _ref29$ = _ref29[2],
    thickness = _ref29$ === void 0 ? 1 : _ref29$;
  var _getLineAttrs2 = getLineAttrs(pt1, pt2, thickness),
    cx = _getLineAttrs2.cx,
    cy = _getLineAttrs2.cy,
    length = _getLineAttrs2.length,
    theta = _getLineAttrs2.theta;
  var line = createElement(['sjx-hdl-line', "sjx-hdl-".concat(key)]);
  helper(line).css({
    transform: "translate(".concat(cx, "px, ").concat(cy, "px) rotate(").concat(theta, "deg)"),
    height: "".concat(thickness, "px"),
    width: "".concat(length, "px")
  });
  return line;
};
var getLineAttrs = function getLineAttrs(pt1, pt2) {
  var thickness = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var _pt = _slicedToArray(pt1, 2),
    x1 = _pt[0],
    y1 = _pt[1];
  var _pt2 = _slicedToArray(pt2, 2),
    x2 = _pt2[0],
    y2 = _pt2[1];
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  var cx = (x1 + x2) / 2 - length / 2;
  var cy = (y1 + y2) / 2 - thickness / 2;
  var theta = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
  return {
    cx: cx,
    cy: cy,
    thickness: thickness,
    theta: theta,
    length: length
  };
};
var _getBoundingRect$1 = function _getBoundingRect(element, container, ctm, bBox) {
  var _getAbsoluteOffset13 = getAbsoluteOffset(element, container),
    _getAbsoluteOffset14 = _slicedToArray(_getAbsoluteOffset13, 2),
    offsetLeft = _getAbsoluteOffset14[0],
    offsetTop = _getAbsoluteOffset14[1];
  var _ref30 = bBox || {
      width: element.offsetWidth,
      height: element.offsetHeight,
      offset: {
        left: offsetLeft,
        top: offsetTop
      }
    },
    width = _ref30.width,
    height = _ref30.height,
    _ref30$offset = _ref30.offset,
    _ref30$offset2 = _ref30$offset === void 0 ? {} : _ref30$offset,
    left = _ref30$offset2.left,
    top = _ref30$offset2.top;
  var vertices = [[0, 0, 0, 1], [width, 0, 0, 1], [0, height, 0, 1], [width, height, 0, 1]];
  return vertices.reduce(function (nextVerteces, vertex) {
    return [].concat(_toConsumableArray(nextVerteces), [multiplyMatrixAndPoint(ctm, vertex)]);
  }, []).map(function (_ref31) {
    var _ref32 = _slicedToArray(_ref31, 4),
      x = _ref32[0],
      y = _ref32[1],
      z = _ref32[2],
      w = _ref32[3];
    return [x + left, y + top, z, w];
  });
};
var createElement = function createElement() {
  var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var element = document.createElement('div');
  classNames.forEach(function (className) {
    return addClass(element, className);
  });
  return element;
};

var sepRE = /\s*,\s*|\s+/g;
var allowedElements = ['circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'g', 'foreignobject', 'use'];
function createSVGElement(name) {
  var classNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var element = document.createElementNS('http://www.w3.org/2000/svg', name);
  classNames.forEach(function (className) {
    return addClass(element, className);
  });
  return element;
}
var createSVGPoint = function createSVGPoint(x, y) {
  var pt = createSVGElement('svg').createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt;
};
var _checkChildElements = function checkChildElements(element) {
  var arrOfElements = [];
  if (isSVGGroup(element)) {
    forEach.call(element.childNodes, function (item) {
      if (item.nodeType === 1) {
        var tagName = item.tagName.toLowerCase();
        if (allowedElements.indexOf(tagName) !== -1) {
          if (tagName === 'g') {
            arrOfElements.push.apply(arrOfElements, _toConsumableArray(_checkChildElements(item)));
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
var createSVGMatrix = function createSVGMatrix() {
  return createSVGElement('svg').createSVGMatrix();
};
var createTranslateMatrix = function createTranslateMatrix(x, y) {
  var matrix = createSVGMatrix();
  matrix.e = x;
  matrix.f = y;
  return matrix;
};
var createRotateMatrix = function createRotateMatrix(sin, cos) {
  var matrix = createSVGMatrix();
  matrix.a = cos;
  matrix.b = sin;
  matrix.c = -sin;
  matrix.d = cos;
  return matrix;
};
var createScaleMatrix = function createScaleMatrix(x, y) {
  var matrix = createSVGMatrix();
  matrix.a = x;
  matrix.d = y;
  return matrix;
};
var getTransformToElement = function getTransformToElement(toElement, g) {
  var _getScreenCTM, _ref, _getScreenCTM2, _ref2;
  var gTransform = (g === null || g === void 0 || (_getScreenCTM = (_ref = g).getScreenCTM) === null || _getScreenCTM === void 0 ? void 0 : _getScreenCTM.call(_ref)) || createSVGMatrix();
  return gTransform.inverse().multiply((toElement === null || toElement === void 0 || (_getScreenCTM2 = (_ref2 = toElement).getScreenCTM) === null || _getScreenCTM2 === void 0 ? void 0 : _getScreenCTM2.call(_ref2)) || createSVGMatrix());
};
var matrixToString = function matrixToString(m) {
  var a = m.a,
    b = m.b,
    c = m.c,
    d = m.d,
    e = m.e,
    f = m.f;
  return "matrix(".concat(a, ",").concat(b, ",").concat(c, ",").concat(d, ",").concat(e, ",").concat(f, ")");
};
var pointTo = function pointTo(ctm, x, y) {
  return createSVGPoint(x, y).matrixTransform(ctm);
};
var cloneMatrix = function cloneMatrix(b) {
  var a = createSVGMatrix();
  a.a = b.a;
  a.b = b.b;
  a.c = b.c;
  a.d = b.d;
  a.e = b.e;
  a.f = b.f;
  return a;
};
var isIdentity = function isIdentity(matrix) {
  var a = matrix.a,
    b = matrix.b,
    c = matrix.c,
    d = matrix.d,
    e = matrix.e,
    f = matrix.f;
  return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0;
};
var checkElement = function checkElement(el) {
  var tagName = el.tagName.toLowerCase();
  if (allowedElements.indexOf(tagName) === -1) {
    warn("Selected element \"".concat(tagName, "\" is not allowed to transform. Allowed elements:\n\n            circle, ellipse, image, line, path, polygon, polyline, rect, text, g"));
    return false;
  } else {
    return true;
  }
};
var isSVGGroup = function isSVGGroup(element) {
  return element.tagName.toLowerCase() === 'g';
};
var normalizeString = function normalizeString() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.replace(/[\n\r]/g, '').replace(/([^e])-/g, '$1 -').replace(/ +/g, ' ').replace(/(\d*\.)(\d+)(?=\.)/g, '$1$2 ');
};

// example "101.3,175.5 92.3,162 110.3,162 		"
var parsePoints = function parsePoints(pts) {
  return normalizeString(pts).trim().split(sepRE).reduce(function (result, _, index, array) {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []);
};
var arrayToChunks = function arrayToChunks(a, size) {
  return Array.from(new Array(Math.ceil(a.length / size)), function (_, i) {
    return a.slice(i * size, i * size + size);
  });
};

var svgMatrix = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arrayToChunks: arrayToChunks,
  checkChildElements: _checkChildElements,
  checkElement: checkElement,
  cloneMatrix: cloneMatrix,
  createRotateMatrix: createRotateMatrix,
  createSVGElement: createSVGElement,
  createSVGMatrix: createSVGMatrix,
  createSVGPoint: createSVGPoint,
  createScaleMatrix: createScaleMatrix,
  createTranslateMatrix: createTranslateMatrix,
  getTransformToElement: getTransformToElement,
  isIdentity: isIdentity,
  isSVGGroup: isSVGGroup,
  matrixToString: matrixToString,
  normalizeString: normalizeString,
  parsePoints: parsePoints,
  pointTo: pointTo,
  sepRE: sepRE
});

// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
var dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
var getCommandValuesLength = function getCommandValuesLength(cmd) {
  return [{
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
  }].find(function (_ref) {
    var condition = _ref.condition;
    return !!condition;
  });
};
var parsePath = function parsePath(path) {
  var match;
  dRE.lastIndex = 0;
  var serialized = [];
  var _loop = function _loop() {
    var _match = match,
      _match2 = _slicedToArray(_match, 3),
      cmd = _match2[1],
      params = _match2[2];
    var upCmd = cmd.toUpperCase();
    var isRelative = cmd !== upCmd;
    var data = normalizeString(params);
    var values = data.trim().split(sepRE).map(function (val) {
      if (!isNaN(val)) {
        return Number(val);
      }
    });
    var firstCommand = false;
    var isMoveTo = upCmd === 'M';
    var _getCommandValuesLeng = getCommandValuesLength(cmd),
      commandLength = _getCommandValuesLeng.size;

    // split big command into multiple commands
    arrayToChunks(values, commandLength).map(function (chunkedValues) {
      var shouldReplace = firstCommand && isMoveTo;
      firstCommand = firstCommand ? firstCommand : isMoveTo;
      return serialized.push({
        relative: isRelative,
        key: shouldReplace ? 'L' : upCmd,
        cmd: shouldReplace ? isRelative ? 'l' : 'L' : cmd,
        values: chunkedValues
      });
    });
  };
  while (match = dRE.exec(path)) {
    _loop();
  }
  return reducePathData(absolutizePathData(serialized));
};
var movePath = function movePath(params) {
  var path = params.path,
    dx = params.dx,
    dy = params.dy;
  try {
    var serialized = parsePath(path);
    var str = '';
    var space = ' ';
    var firstCommand = true;
    for (var i = 0, len = serialized.length; i < len; i++) {
      var item = serialized[i];
      var values = item.values,
        cmd = item.key,
        relative = item.relative;
      var coordinates = [];
      switch (cmd) {
        case 'M':
          {
            for (var k = 0, _len = values.length; k < _len; k += 2) {
              var _values$slice = values.slice(k, k + 2),
                _values$slice2 = _slicedToArray(_values$slice, 2),
                x = _values$slice2[0],
                y = _values$slice2[1];
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
            for (var _k = 0, _len2 = values.length; _k < _len2; _k += 7) {
              var set = values.slice(_k, _k + 7);
              if (!relative) {
                set[5] += dx;
                set[6] += dy;
              }
              coordinates.push.apply(coordinates, _toConsumableArray(set));
            }
            break;
          }
        case 'C':
          {
            for (var _k2 = 0, _len3 = values.length; _k2 < _len3; _k2 += 6) {
              var _set = values.slice(_k2, _k2 + 6);
              if (!relative) {
                _set[0] += dx;
                _set[1] += dy;
                _set[2] += dx;
                _set[3] += dy;
                _set[4] += dx;
                _set[5] += dy;
              }
              coordinates.push.apply(coordinates, _toConsumableArray(_set));
            }
            break;
          }
        case 'H':
          {
            for (var _k3 = 0, _len4 = values.length; _k3 < _len4; _k3 += 1) {
              var _set2 = values.slice(_k3, _k3 + 1);
              if (!relative) {
                _set2[0] += dx;
              }
              coordinates.push(_set2[0]);
            }
            break;
          }
        case 'V':
          {
            for (var _k4 = 0, _len5 = values.length; _k4 < _len5; _k4 += 1) {
              var _set3 = values.slice(_k4, _k4 + 1);
              if (!relative) {
                _set3[0] += dy;
              }
              coordinates.push(_set3[0]);
            }
            break;
          }
        case 'L':
        case 'T':
          {
            for (var _k5 = 0, _len6 = values.length; _k5 < _len6; _k5 += 2) {
              var _values$slice3 = values.slice(_k5, _k5 + 2),
                _values$slice4 = _slicedToArray(_values$slice3, 2),
                _x = _values$slice4[0],
                _y = _values$slice4[1];
              if (!relative) {
                _x += dx;
                _y += dy;
              }
              coordinates.push(_x, _y);
            }
            break;
          }
        case 'Q':
        case 'S':
          {
            for (var _k6 = 0, _len7 = values.length; _k6 < _len7; _k6 += 4) {
              var _values$slice5 = values.slice(_k6, _k6 + 4),
                _values$slice6 = _slicedToArray(_values$slice5, 4),
                x1 = _values$slice6[0],
                y1 = _values$slice6[1],
                x2 = _values$slice6[2],
                y2 = _values$slice6[3];
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
var resizePath = function resizePath(params) {
  var path = params.path,
    localCTM = params.localCTM;
  try {
    var serialized = parsePath(path);
    var str = '';
    var space = ' ';
    var res = [];
    var firstCommand = true;
    for (var i = 0, len = serialized.length; i < len; i++) {
      var item = serialized[i];
      var values = item.values,
        cmd = item.key,
        _item$relative = item.relative,
        relative = _item$relative === void 0 ? false : _item$relative;
      switch (cmd) {
        case 'A':
          {
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            var coordinates = [];
            var mtrx = cloneMatrix(localCTM);
            if (relative) {
              mtrx.e = mtrx.f = 0;
            }
            for (var k = 0, _len8 = values.length; k < _len8; k += 7) {
              var _values$slice7 = values.slice(k, k + 7),
                _values$slice8 = _slicedToArray(_values$slice7, 7),
                rx = _values$slice8[0],
                ry = _values$slice8[1],
                xAxisRot = _values$slice8[2],
                largeArcFlag = _values$slice8[3],
                sweepFlag = _values$slice8[4],
                x = _values$slice8[5],
                y = _values$slice8[6];
              var _pointTo = pointTo(mtrx, x, y),
                resX = _pointTo.x,
                resY = _pointTo.y;
              coordinates.push(floatToFixed(resX), floatToFixed(resY));
              mtrx.e = mtrx.f = 0;
              var _pointTo2 = pointTo(mtrx, rx, ry),
                newRx = _pointTo2.x,
                newRy = _pointTo2.y;
              coordinates.unshift(floatToFixed(newRx), floatToFixed(newRy), xAxisRot, largeArcFlag, sweepFlag);
            }
            res.push(coordinates);
            break;
          }
        case 'C':
          {
            // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
            var _coordinates = [];
            var _mtrx = cloneMatrix(localCTM);
            if (relative) {
              _mtrx.e = _mtrx.f = 0;
            }
            for (var _k7 = 0, _len9 = values.length; _k7 < _len9; _k7 += 6) {
              var _values$slice9 = values.slice(_k7, _k7 + 6),
                _values$slice0 = _slicedToArray(_values$slice9, 6),
                x1 = _values$slice0[0],
                y1 = _values$slice0[1],
                x2 = _values$slice0[2],
                y2 = _values$slice0[3],
                _x2 = _values$slice0[4],
                _y2 = _values$slice0[5];
              var _pointTo3 = pointTo(_mtrx, x1, y1),
                resX1 = _pointTo3.x,
                resY1 = _pointTo3.y;
              var _pointTo4 = pointTo(_mtrx, x2, y2),
                resX2 = _pointTo4.x,
                resY2 = _pointTo4.y;
              var _pointTo5 = pointTo(_mtrx, _x2, _y2),
                _resX = _pointTo5.x,
                _resY = _pointTo5.y;
              _coordinates.push(floatToFixed(resX1), floatToFixed(resY1), floatToFixed(resX2), floatToFixed(resY2), floatToFixed(_resX), floatToFixed(_resY));
            }
            res.push(_coordinates);
            break;
          }
        // this command makes impossible free transform within group
        // it will be converted to L
        case 'H':
          {
            // H x (or h dx)
            var _coordinates2 = [];
            var _mtrx2 = cloneMatrix(localCTM);
            if (relative) {
              _mtrx2.e = _mtrx2.f = 0;
            }
            for (var _k8 = 0, _len0 = values.length; _k8 < _len0; _k8 += 1) {
              var _values$slice1 = values.slice(_k8, _k8 + 1),
                _values$slice10 = _slicedToArray(_values$slice1, 1),
                _x3 = _values$slice10[0];
              var _pointTo6 = pointTo(_mtrx2, _x3, 0),
                _resX2 = _pointTo6.x;
              _coordinates2.push(floatToFixed(_resX2));
            }
            res.push(_coordinates2);
            break;
          }
        // this command makes impossible free transform within group
        // it will be converted to L
        case 'V':
          {
            // V y (or v dy)
            var _coordinates3 = [];
            var _mtrx3 = cloneMatrix(localCTM);
            if (relative) {
              _mtrx3.e = _mtrx3.f = 0;
            }
            for (var _k9 = 0, _len1 = values.length; _k9 < _len1; _k9 += 1) {
              var _values$slice11 = values.slice(_k9, _k9 + 1),
                _values$slice12 = _slicedToArray(_values$slice11, 1),
                _y3 = _values$slice12[0];
              var _pointTo7 = pointTo(_mtrx3, 0, _y3),
                _resY2 = _pointTo7.y;
              _coordinates3.push(floatToFixed(_resY2));
            }
            res.push(_coordinates3);
            break;
          }
        case 'T':
        case 'L':
          {
            // T x y (or t dx dy)
            // L x y (or l dx dy)
            var _coordinates4 = [];
            var _mtrx4 = cloneMatrix(localCTM);
            if (relative) {
              _mtrx4.e = _mtrx4.f = 0;
            }
            for (var _k0 = 0, _len10 = values.length; _k0 < _len10; _k0 += 2) {
              var _values$slice13 = values.slice(_k0, _k0 + 2),
                _values$slice14 = _slicedToArray(_values$slice13, 2),
                _x4 = _values$slice14[0],
                _y4 = _values$slice14[1];
              var _pointTo8 = pointTo(_mtrx4, _x4, _y4),
                _resX3 = _pointTo8.x,
                _resY3 = _pointTo8.y;
              _coordinates4.push(floatToFixed(_resX3), floatToFixed(_resY3));
            }
            res.push(_coordinates4);
            break;
          }
        case 'M':
          {
            // M x y (or dx dy)
            var _coordinates5 = [];
            var _mtrx5 = cloneMatrix(localCTM);
            if (relative && !firstCommand) {
              _mtrx5.e = _mtrx5.f = 0;
            }
            for (var _k1 = 0, _len11 = values.length; _k1 < _len11; _k1 += 2) {
              var _values$slice15 = values.slice(_k1, _k1 + 2),
                _values$slice16 = _slicedToArray(_values$slice15, 2),
                _x5 = _values$slice16[0],
                _y5 = _values$slice16[1];
              var _pointTo9 = pointTo(_mtrx5, _x5, _y5),
                _resX4 = _pointTo9.x,
                _resY4 = _pointTo9.y;
              _coordinates5.push(floatToFixed(_resX4), floatToFixed(_resY4));
              firstCommand = false;
            }
            res.push(_coordinates5);
            break;
          }
        case 'Q':
          {
            // Q x1 y1, x y (or q dx1 dy1, dx dy)
            var _coordinates6 = [];
            var _mtrx6 = cloneMatrix(localCTM);
            if (relative) {
              _mtrx6.e = _mtrx6.f = 0;
            }
            for (var _k10 = 0, _len12 = values.length; _k10 < _len12; _k10 += 4) {
              var _values$slice17 = values.slice(_k10, _k10 + 4),
                _values$slice18 = _slicedToArray(_values$slice17, 4),
                _x6 = _values$slice18[0],
                _y6 = _values$slice18[1],
                _x7 = _values$slice18[2],
                _y7 = _values$slice18[3];
              var _pointTo0 = pointTo(_mtrx6, _x6, _y6),
                _resX5 = _pointTo0.x,
                _resY5 = _pointTo0.y;
              var _pointTo1 = pointTo(_mtrx6, _x7, _y7),
                _resX6 = _pointTo1.x,
                _resY6 = _pointTo1.y;
              _coordinates6.push(floatToFixed(_resX5), floatToFixed(_resY5), floatToFixed(_resX6), floatToFixed(_resY6));
            }
            res.push(_coordinates6);
            break;
          }
        case 'S':
          {
            // S x2 y2, x y (or s dx2 dy2, dx dy)
            var _coordinates7 = [];
            var _mtrx7 = cloneMatrix(localCTM);
            if (relative) {
              _mtrx7.e = _mtrx7.f = 0;
            }
            for (var _k11 = 0, _len13 = values.length; _k11 < _len13; _k11 += 4) {
              var _values$slice19 = values.slice(_k11, _k11 + 4),
                _values$slice20 = _slicedToArray(_values$slice19, 4),
                _x8 = _values$slice20[0],
                _y8 = _values$slice20[1],
                _x9 = _values$slice20[2],
                _y9 = _values$slice20[3];
              var _pointTo10 = pointTo(_mtrx7, _x8, _y8),
                _resX7 = _pointTo10.x,
                _resY7 = _pointTo10.y;
              var _pointTo11 = pointTo(_mtrx7, _x9, _y9),
                _resX8 = _pointTo11.x,
                _resY8 = _pointTo11.y;
              _coordinates7.push(floatToFixed(_resX7), floatToFixed(_resY7), floatToFixed(_resX8), floatToFixed(_resY8));
            }
            res.push(_coordinates7);
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
var absolutizePathData = function absolutizePathData(pathData) {
  var currentX = null,
    currentY = null,
    subpathX = null,
    subpathY = null;
  return pathData.reduce(function (absolutizedPathData, seg) {
    var cmd = seg.cmd,
      values = seg.values;
    var nextSeg;
    switch (cmd) {
      case 'M':
        {
          var _values = _slicedToArray(values, 2),
            x = _values[0],
            y = _values[1];
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
          var _values2 = _slicedToArray(values, 2),
            _x0 = _values2[0],
            _y0 = _values2[1];
          var nextX = currentX + _x0;
          var nextY = currentY + _y0;
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
          var _values3 = _slicedToArray(values, 2),
            _x1 = _values3[0],
            _y1 = _values3[1];
          nextSeg = {
            key: 'L',
            values: [_x1, _y1]
          };
          currentX = _x1;
          currentY = _y1;
          break;
        }
      case 'l':
        {
          var _values4 = _slicedToArray(values, 2),
            _x10 = _values4[0],
            _y10 = _values4[1];
          var _nextX = currentX + _x10;
          var _nextY = currentY + _y10;
          nextSeg = {
            key: 'L',
            values: [_nextX, _nextY]
          };
          currentX = _nextX;
          currentY = _nextY;
          break;
        }
      case 'C':
        {
          var _values5 = _slicedToArray(values, 6),
            x1 = _values5[0],
            y1 = _values5[1],
            x2 = _values5[2],
            y2 = _values5[3],
            _x11 = _values5[4],
            _y11 = _values5[5];
          nextSeg = {
            key: 'C',
            values: [x1, y1, x2, y2, _x11, _y11]
          };
          currentX = _x11;
          currentY = _y11;
          break;
        }
      case 'c':
        {
          var _values6 = _slicedToArray(values, 6),
            _x12 = _values6[0],
            _y12 = _values6[1],
            _x13 = _values6[2],
            _y13 = _values6[3],
            _x14 = _values6[4],
            _y14 = _values6[5];
          var nextValues = [currentX + _x12, currentY + _y12, currentX + _x13, currentY + _y13, currentX + _x14, currentY + _y14];
          nextSeg = {
            key: 'C',
            values: [].concat(nextValues)
          };
          currentX = nextValues[4];
          currentY = nextValues[5];
          break;
        }
      case 'Q':
        {
          var _values7 = _slicedToArray(values, 4),
            _x15 = _values7[0],
            _y15 = _values7[1],
            _x16 = _values7[2],
            _y16 = _values7[3];
          nextSeg = {
            key: 'Q',
            values: [_x15, _y15, _x16, _y16]
          };
          currentX = _x16;
          currentY = _y16;
          break;
        }
      case 'q':
        {
          var _values8 = _slicedToArray(values, 4),
            _x17 = _values8[0],
            _y17 = _values8[1],
            _x18 = _values8[2],
            _y18 = _values8[3];
          var _nextValues = [currentX + _x17, currentY + _y17, currentX + _x18, currentY + _y18];
          absolutizedPathData.push({
            key: 'Q',
            values: [].concat(_nextValues)
          });
          currentX = _nextValues[2];
          currentY = _nextValues[3];
          break;
        }
      case 'A':
        {
          var _values9 = _slicedToArray(values, 7),
            r1 = _values9[0],
            r2 = _values9[1],
            angle = _values9[2],
            largeArcFlag = _values9[3],
            sweepFlag = _values9[4],
            _x19 = _values9[5],
            _y19 = _values9[6];
          nextSeg = {
            key: 'A',
            values: [r1, r2, angle, largeArcFlag, sweepFlag, _x19, _y19]
          };
          currentX = _x19;
          currentY = _y19;
          break;
        }
      case 'a':
        {
          var _values0 = _slicedToArray(values, 7),
            _r = _values0[0],
            _r2 = _values0[1],
            _angle = _values0[2],
            _largeArcFlag = _values0[3],
            _sweepFlag = _values0[4],
            _x20 = _values0[5],
            _y20 = _values0[6];
          var _nextX2 = currentX + _x20;
          var _nextY2 = currentY + _y20;
          nextSeg = {
            key: 'A',
            values: [_r, _r2, _angle, _largeArcFlag, _sweepFlag, _nextX2, _nextY2]
          };
          currentX = _nextX2;
          currentY = _nextY2;
          break;
        }
      case 'H':
        {
          var _values1 = _slicedToArray(values, 1),
            _x21 = _values1[0];
          nextSeg = {
            key: 'H',
            values: [_x21]
          };
          currentX = _x21;
          break;
        }
      case 'h':
        {
          var _values10 = _slicedToArray(values, 1),
            _x22 = _values10[0];
          var _nextX3 = currentX + _x22;
          nextSeg = {
            key: 'H',
            values: [_nextX3]
          };
          currentX = _nextX3;
          break;
        }
      case 'V':
        {
          var _values11 = _slicedToArray(values, 1),
            _y21 = _values11[0];
          nextSeg = {
            key: 'V',
            values: [_y21]
          };
          currentY = _y21;
          break;
        }
      case 'v':
        {
          var _values12 = _slicedToArray(values, 1),
            _y22 = _values12[0];
          var _nextY3 = currentY + _y22;
          nextSeg = {
            key: 'V',
            values: [_nextY3]
          };
          currentY = _nextY3;
          break;
        }
      case 'S':
        {
          var _values13 = _slicedToArray(values, 4),
            _x23 = _values13[0],
            _y23 = _values13[1],
            _x24 = _values13[2],
            _y24 = _values13[3];
          nextSeg = {
            key: 'S',
            values: [_x23, _y23, _x24, _y24]
          };
          currentX = _x24;
          currentY = _y24;
          break;
        }
      case 's':
        {
          var _values14 = _slicedToArray(values, 4),
            _x25 = _values14[0],
            _y25 = _values14[1],
            _x26 = _values14[2],
            _y26 = _values14[3];
          var _nextValues2 = [currentX + _x25, currentY + _y25, currentX + _x26, currentY + _y26];
          nextSeg = {
            key: 'S',
            values: [].concat(_nextValues2)
          };
          currentX = _nextValues2[2];
          currentY = _nextValues2[3];
          break;
        }
      case 'T':
        {
          var _values15 = _slicedToArray(values, 2),
            _x27 = _values15[0],
            _y27 = _values15[1];
          nextSeg = {
            key: 'T',
            values: [_x27, _y27]
          };
          currentX = _x27;
          currentY = _y27;
          break;
        }
      case 't':
        {
          var _values16 = _slicedToArray(values, 2),
            _x28 = _values16[0],
            _y28 = _values16[1];
          var _nextX4 = currentX + _x28;
          var _nextY4 = currentY + _y28;
          nextSeg = {
            key: 'T',
            values: [_nextX4, _nextY4]
          };
          currentX = _nextX4;
          currentY = _nextY4;
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
    return [].concat(_toConsumableArray(absolutizedPathData), [nextSeg]);
  }, []);
};
var reducePathData = function reducePathData(pathData) {
  var lastType = null;
  var lastControlX = null;
  var lastControlY = null;
  var currentX = null;
  var currentY = null;
  var subpathX = null;
  var subpathY = null;
  return pathData.reduce(function (reducedPathData, seg) {
    var key = seg.key,
      values = seg.values;
    var nextSeg;
    switch (key) {
      case 'M':
        {
          var _values17 = _slicedToArray(values, 2),
            x = _values17[0],
            y = _values17[1];
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
          var _values18 = _slicedToArray(values, 6),
            x1 = _values18[0],
            y1 = _values18[1],
            x2 = _values18[2],
            y2 = _values18[3],
            _x29 = _values18[4],
            _y29 = _values18[5];
          nextSeg = [{
            key: 'C',
            values: [x1, y1, x2, y2, _x29, _y29]
          }];
          lastControlX = x2;
          lastControlY = y2;
          currentX = _x29;
          currentY = _y29;
          break;
        }
      case 'L':
        {
          var _values19 = _slicedToArray(values, 2),
            _x30 = _values19[0],
            _y30 = _values19[1];
          nextSeg = [{
            key: 'L',
            values: [_x30, _y30]
          }];
          currentX = _x30;
          currentY = _y30;
          break;
        }
      case 'H':
        {
          var _values20 = _slicedToArray(values, 1),
            _x31 = _values20[0];
          nextSeg = [{
            key: 'L',
            values: [_x31, currentY]
          }];
          currentX = _x31;
          break;
        }
      case 'V':
        {
          var _values21 = _slicedToArray(values, 1),
            _y31 = _values21[0];
          nextSeg = [{
            key: 'L',
            values: [currentX, _y31]
          }];
          currentY = _y31;
          break;
        }
      case 'S':
        {
          var _values22 = _slicedToArray(values, 4),
            _x32 = _values22[0],
            _y32 = _values22[1],
            _x33 = _values22[2],
            _y33 = _values22[3];
          var cx1, cy1;
          if (lastType === 'C' || lastType === 'S') {
            cx1 = currentX + (currentX - lastControlX);
            cy1 = currentY + (currentY - lastControlY);
          } else {
            cx1 = currentX;
            cy1 = currentY;
          }
          nextSeg = [{
            key: 'C',
            values: [cx1, cy1, _x32, _y32, _x33, _y33]
          }];
          lastControlX = _x32;
          lastControlY = _y32;
          currentX = _x33;
          currentY = _y33;
          break;
        }
      case 'T':
        {
          var _values23 = _slicedToArray(values, 2),
            _x34 = _values23[0],
            _y34 = _values23[1];
          var _x35, _y35;
          if (lastType === 'Q' || lastType === 'T') {
            _x35 = currentX + (currentX - lastControlX);
            _y35 = currentY + (currentY - lastControlY);
          } else {
            _x35 = currentX;
            _y35 = currentY;
          }
          var _cx = currentX + 2 * (_x35 - currentX) / 3;
          var _cy = currentY + 2 * (_y35 - currentY) / 3;
          var cx2 = _x34 + 2 * (_x35 - _x34) / 3;
          var cy2 = _y34 + 2 * (_y35 - _y34) / 3;
          nextSeg = [{
            key: 'C',
            values: [_cx, _cy, cx2, cy2, _x34, _y34]
          }];
          lastControlX = _x35;
          lastControlY = _y35;
          currentX = _x34;
          currentY = _y34;
          break;
        }
      case 'Q':
        {
          var _values24 = _slicedToArray(values, 4),
            _x36 = _values24[0],
            _y36 = _values24[1],
            _x37 = _values24[2],
            _y37 = _values24[3];
          var _cx2 = currentX + 2 * (_x36 - currentX) / 3;
          var _cy2 = currentY + 2 * (_y36 - currentY) / 3;
          var _cx3 = _x37 + 2 * (_x36 - _x37) / 3;
          var _cy3 = _y37 + 2 * (_y36 - _y37) / 3;
          nextSeg = [{
            key: 'C',
            values: [_cx2, _cy2, _cx3, _cy3, _x37, _y37]
          }];
          lastControlX = _x36;
          lastControlY = _y36;
          currentX = _x37;
          currentY = _y37;
          break;
        }
      case 'A':
        {
          var _values25 = _slicedToArray(values, 7),
            r1 = _values25[0],
            r2 = _values25[1],
            angle = _values25[2],
            largeArcFlag = _values25[3],
            sweepFlag = _values25[4],
            _x38 = _values25[5],
            _y38 = _values25[6];
          if (r1 === 0 || r2 === 0) {
            nextSeg = [{
              key: 'C',
              values: [currentX, currentY, _x38, _y38, _x38, _y38]
            }];
            currentX = _x38;
            currentY = _y38;
          } else {
            if (currentX !== _x38 || currentY !== _y38) {
              var curves = _arcToCubicCurves(currentX, currentY, _x38, _y38, r1, r2, angle, largeArcFlag, sweepFlag);
              nextSeg = curves.map(function (curve) {
                return {
                  key: 'C',
                  values: curve
                };
              });
              currentX = _x38;
              currentY = _y38;
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
    return [].concat(_toConsumableArray(reducedPathData), _toConsumableArray(nextSeg));
  }, []);
};

//  - a2c() by Dmitry Baranovskiy (MIT License)
//  https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.js#L2216
var _arcToCubicCurves = function arcToCubicCurves(x1, y1, x2, y2, rx, ry, xAxisRot, largeArcFlag, sweepFlag, recursive) {
  var degToRad = function degToRad(deg) {
    return Math.PI * deg / 180;
  };
  var rotate = function rotate(x, y, rad) {
    return {
      x: x * Math.cos(rad) - y * Math.sin(rad),
      y: x * Math.sin(rad) + y * Math.cos(rad)
    };
  };
  var angleRad = degToRad(xAxisRot);
  var params = [];
  var f1, f2, cx, cy;
  if (recursive) {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  } else {
    var p1 = rotate(x1, y1, -angleRad);
    x1 = p1.x;
    y1 = p1.y;
    var p2 = rotate(x2, y2, -angleRad);
    x2 = p2.x;
    y2 = p2.y;
    var x = (x1 - x2) / 2;
    var y = (y1 - y2) / 2;
    var h = x * x / (rx * rx) + y * y / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    var sign = largeArcFlag === sweepFlag ? -1 : 1;
    var r1Pow = rx * rx;
    var r2Pow = ry * ry;
    var left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
    var right = r1Pow * y * y + r2Pow * x * x;
    var k = sign * Math.sqrt(Math.abs(left / right));
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
  var df = f2 - f1;
  if (Math.abs(df) > Math.PI * 120 / 180) {
    var f2old = f2;
    var x2old = x2;
    var y2old = y2;
    var ratio = sweepFlag && f2 > f1 ? 1 : -1;
    f2 = f1 + Math.PI * 120 / 180 * ratio;
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    params = _arcToCubicCurves(x2, y2, x2old, y2old, rx, ry, xAxisRot, 0, sweepFlag, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  var c1 = Math.cos(f1);
  var s1 = Math.sin(f1);
  var c2 = Math.cos(f2);
  var s2 = Math.sin(f2);
  var t = Math.tan(df / 4);
  var hx = 4 / 3 * rx * t;
  var hy = 4 / 3 * ry * t;
  var m1 = [x1, y1];
  var m2 = [x1 + hx * s1, y1 - hy * c1];
  var m3 = [x2 + hx * s2, y2 - hy * c2];
  var m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4].concat(_toConsumableArray(params));
  } else {
    params = [m2, m3, m4].concat(_toConsumableArray(params)).join().split(',');
    var curves = [];
    var curveParams = [];
    params.forEach(function (_, i) {
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

var CIRCLE_SEGMENTS = 32;
var EDGE_KEYS = ['te', 'be', 'le', 're'];
var HANDLE_EDGES = {
  tl: ['te', 'le'],
  tr: ['te', 're'],
  bl: ['be', 'le'],
  br: ['be', 're'],
  tc: ['te'],
  bc: ['be'],
  ml: ['le'],
  mr: ['re']
};
var sub = function sub(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
};
var dot = function dot(a, b) {
  return a.x * b.x + a.y * b.y;
};
var length = function length(a) {
  return Math.hypot(a.x, a.y);
};
var along = function along(point, direction, distance) {
  return {
    x: point.x + direction.x * distance,
    y: point.y + direction.y * distance
  };
};
var edgeEnds = function edgeEnds(_ref, edge) {
  var tl = _ref.tl,
    tr = _ref.tr,
    bl = _ref.bl,
    br = _ref.br;
  return {
    te: [tl, tr],
    be: [bl, br],
    le: [tl, bl],
    re: [tr, br]
  }[edge];
};
var OPPOSITE = {
  te: 'be',
  be: 'te',
  le: 're',
  re: 'le'
};
var edgeNormal = function edgeNormal(corners, edge) {
  var _edgeEnds = edgeEnds(corners, edge),
    _edgeEnds2 = _slicedToArray(_edgeEnds, 2),
    a = _edgeEnds2[0],
    b = _edgeEnds2[1];
  var direction = sub(b, a);
  var size = length(direction);
  if (size < 1e-9) return {
    x: 0,
    y: 0
  };
  var normal = {
    x: direction.y / size,
    y: -direction.x / size
  };
  var _edgeEnds3 = edgeEnds(corners, OPPOSITE[edge]),
    _edgeEnds4 = _slicedToArray(_edgeEnds3, 1),
    oppositeStart = _edgeEnds4[0];
  var towardsOpposite = dot(sub(oppositeStart, a), normal);
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
var edgeDepth = function edgeDepth(corners, edge) {
  var _edgeEnds5 = edgeEnds(corners, edge),
    _edgeEnds6 = _slicedToArray(_edgeEnds5, 1),
    a = _edgeEnds6[0];
  var _edgeEnds7 = edgeEnds(corners, OPPOSITE[edge]),
    _edgeEnds8 = _slicedToArray(_edgeEnds7, 1),
    oppositeStart = _edgeEnds8[0];
  return Math.abs(dot(sub(oppositeStart, a), edgeNormal(corners, edge)));
};
var clampFor = function clampFor(corners, edge, radius) {
  return {
    normal: edgeNormal(corners, edge),
    depth: Math.min(radius, edgeDepth(corners, edge) / 4)
  };
};
var clockwise = function clockwise(points) {
  var area = points.reduce(function (sum, point, i) {
    var next = points[(i + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0);
  return area < 0 ? _toConsumableArray(points).reverse() : points;
};
var applyClamps = function applyClamps(points, origin, clamps) {
  return clamps.reduce(function (result, _ref2) {
    var normal = _ref2.normal,
      depth = _ref2.depth;
    return result.map(function (point) {
      var offset = dot(sub(point, origin), normal);
      return offset < -depth ? along(point, normal, -depth - offset) : point;
    });
  }, points);
};
var hitAreaOutline = function hitAreaOutline(key, center, corners, radius) {
  if (radius <= 0) return [];
  if (corners && EDGE_KEYS.includes(key)) {
    var edge = key;
    var _edgeEnds9 = edgeEnds(corners, edge),
      _edgeEnds0 = _slicedToArray(_edgeEnds9, 2),
      a = _edgeEnds0[0],
      b = _edgeEnds0[1];
    if (length(sub(b, a)) < 1e-9) return [];
    var _clampFor = clampFor(corners, edge, radius),
      normal = _clampFor.normal,
      depth = _clampFor.depth;
    return clockwise([along(a, normal, radius), along(b, normal, radius), along(b, normal, -depth), along(a, normal, -depth)]);
  }
  var circle = Array.from({
    length: CIRCLE_SEGMENTS
  }, function (_, i) {
    var angle = i / CIRCLE_SEGMENTS * Math.PI * 2;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    };
  });
  var edges = corners ? HANDLE_EDGES[key] || [] : [];
  return clockwise(applyClamps(circle, center, edges.map(function (edge) {
    return clampFor(corners, edge, radius);
  })));
};
var outlineToPath = function outlineToPath(points) {
  return points.length ? "M".concat(points.map(function (_ref3) {
    var x = _ref3.x,
      y = _ref3.y;
    return "".concat(+x.toFixed(3), " ").concat(+y.toFixed(3));
  }).join('L'), "Z") : '';
};

var _excluded = ["rotator", "anchor"],
  _excluded2 = ["cached"],
  _excluded3 = ["anchor", "center"],
  _excluded4 = ["anchor", "rotator", "center"];
var E_DRAG = EVENT_EMITTER_CONSTANTS.E_DRAG,
  E_RESIZE = EVENT_EMITTER_CONSTANTS.E_RESIZE,
  E_ROTATE = EVENT_EMITTER_CONSTANTS.E_ROTATE;
var E_MOUSEDOWN$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
  E_TOUCHSTART$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
var _TRANSFORM_HANDLES_CO = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_POINT_KEYS,
  START_POINT = _TRANSFORM_HANDLES_CO.START_POINT,
  END_POINT = _TRANSFORM_HANDLES_CO.END_POINT;
var keys = Object.keys,
  entries = Object.entries,
  values = Object.values;
var DraggableSVG = /*#__PURE__*/function (_Transformable) {
  function DraggableSVG() {
    _classCallCheck(this, DraggableSVG);
    return _callSuper(this, DraggableSVG, arguments);
  }
  _inherits(DraggableSVG, _Transformable);
  return _createClass(DraggableSVG, [{
    key: "init",
    value: /** @internal */
    function init(elements) {
      var _this = this;
      var _this$options = this.options,
        container = _this$options.container,
        controlsContainer = _this$options.controlsContainer,
        resizable = _this$options.resizable,
        rotatable = _this$options.rotatable,
        showNormal = _this$options.showNormal,
        transformOrigin = _this$options.transformOrigin,
        restrict = _this$options.restrict,
        hitRadius = _this$options.hitRadius,
        showHitAreas = _this$options.showHitAreas;
      var hitAreas = {};
      var wrapper = createSVGElement('g', showHitAreas ? ['sjx-svg-wrapper', 'sjx-show-hit'] : ['sjx-svg-wrapper']);
      var controls = createSVGElement('g', ['sjx-svg-controls']);
      var hitOverlay = hitRadius && showHitAreas ? createSVGElement('path', ['sjx-svg-hit-overlay']) : undefined;
      if (hitOverlay) {
        hitOverlay.setAttribute('pointer-events', 'none');
        controls.appendChild(hitOverlay);
      }
      var line = this.getLine();
      var _this$getVertices = this.getVertices(),
        _this$getVertices$rot = _this$getVertices.rotator,
        rotator = _this$getVertices$rot === void 0 ? null : _this$getVertices$rot,
        _this$getVertices$anc = _this$getVertices.anchor,
        anchor = _this$getVertices$anc === void 0 ? null : _this$getVertices$anc,
        nextVertices = _objectWithoutProperties(_this$getVertices, _excluded);
      var handles = {};
      var rotationHandles = {};
      var nextTransformOrigin = Array.isArray(transformOrigin) ? pointTo(createSVGMatrix(), transformOrigin[0], transformOrigin[1]) : nextVertices.center;
      if (rotatable) {
        var normalLine = showNormal ? renderLine([anchor, rotator], THEME_COLOR, 'normal') : null;
        if (showNormal) controls.appendChild(normalLine);
        var radius = null;
        if (transformOrigin) {
          radius = createSVGElement('line', ['sjx-hidden']);
          radius.x1.baseVal.value = nextVertices.center.x;
          radius.y1.baseVal.value = nextVertices.center.y;
          radius.x2.baseVal.value = nextTransformOrigin.x;
          radius.y2.baseVal.value = nextTransformOrigin.y;
          setLineStyle(radius, '#fe3232');
          radius.setAttribute('opacity', '0.5');
          controls.appendChild(radius);
        }
        rotationHandles = _objectSpread2(_objectSpread2({}, rotationHandles), {}, {
          normal: normalLine,
          radius: radius
        });
      }
      var boxHandles = {
        tl: nextVertices.tl,
        tr: nextVertices.tr,
        br: nextVertices.br,
        bl: nextVertices.bl,
        tc: nextVertices.tc,
        bc: nextVertices.bc,
        ml: nextVertices.ml,
        mr: nextVertices.mr
      };
      var lineHandles = _defineProperty(_defineProperty({}, START_POINT, nextVertices[START_POINT]), END_POINT, nextVertices[END_POINT]);
      var resizingHandles = resizable ? entries(line ? lineHandles : boxHandles).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
          key = _ref2[0];
        return _this.isHandleEnabled(key);
      }).reduce(function (result, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          point = _ref4[1];
        result[key] = point;
        return result;
      }, {}) : {};
      var resizingEdges = {
        te: [nextVertices.tl, nextVertices.tr],
        be: [nextVertices.bl, nextVertices.br],
        le: [nextVertices.tl, nextVertices.bl],
        re: [nextVertices.tr, nextVertices.br]
      };
      keys(resizingEdges).forEach(function (key) {
        var data = resizingEdges[key];
        if (isUndef(data)) return;
        handles[key] = renderLine(data, THEME_COLOR, key);
        if (line || !_this.isHandleEnabled(key)) {
          handles[key].setAttribute('pointer-events', 'none');
        }
        if (line) {
          handles[key].setAttribute('visibility', 'hidden');
        }
        if (hitRadius && !line && _this.isHandleEnabled(key)) {
          hitAreas[key] = createHitArea(key);
          controls.appendChild(hitAreas[key]);
        }
        controls.appendChild(handles[key]);
      });
      var allHandles = _objectSpread2(_objectSpread2({}, resizingHandles), {}, {
        rotator: rotator,
        center: transformOrigin && rotatable ? nextTransformOrigin : undefined
      });
      keys(allHandles).forEach(function (key) {
        var data = allHandles[key];
        if (isUndef(data)) return;
        var _ref5 = data,
          x = _ref5.x,
          y = _ref5.y;
        var color = key === 'center' ? '#fe3232' : THEME_COLOR;
        handles[key] = createHandler(x, y, color, key);
        if (hitRadius) {
          hitAreas[key] = createHitArea(key);
          controls.appendChild(hitAreas[key]);
        }
        controls.appendChild(handles[key]);
      });
      wrapper.appendChild(controls);
      controlsContainer.appendChild(wrapper);
      var data = new WeakMap();
      elements.map(function (element) {
        return data.set(element, {
          parent: element.parentNode,
          transform: {
            ctm: getTransformToElement(element, container)
          },
          bBox: element.getBBox(),
          __data__: new WeakMap(),
          cached: {}
        });
      });
      var restrictContainer = restrict || container;
      this.storage = {
        wrapper: wrapper,
        controls: controls,
        handles: _objectSpread2(_objectSpread2({}, handles), rotationHandles),
        data: data,
        center: {
          isShifted: Array.isArray(transformOrigin)
        },
        transformOrigin: nextTransformOrigin,
        transform: {
          containerMatrix: getTransformToElement(restrictContainer, restrictContainer.parentNode)
        },
        cached: {},
        hitAreas: hitAreas,
        hitOverlay: hitOverlay
      };
      this.syncHitAreas();
      [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
        return helper(target).on(E_MOUSEDOWN$1, _this.onMouseDown).on(E_TOUCHSTART$1, _this.onTouchStart);
      });
    }

    /** @internal */
  }, {
    key: "cursorPoint",
    value: function cursorPoint(_ref6) {
      var clientX = _ref6.clientX,
        clientY = _ref6.clientY;
      var container = this.options.container;
      return this.applyMatrixToPoint(container.getScreenCTM().inverse(), clientX, clientY);
    }

    /** @internal */
  }, {
    key: "getRestrictedBBox",
    value: function getRestrictedBBox() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _this$storage = this.storage,
        _this$storage2 = _this$storage === void 0 ? {} : _this$storage,
        _this$storage2$transf = _this$storage2.transform,
        _this$storage2$transf2 = _this$storage2$transf === void 0 ? {} : _this$storage2$transf,
        containerMatrix = _this$storage2$transf2.containerMatrix,
        _this$options2 = this.options,
        _this$options3 = _this$options2 === void 0 ? {} : _this$options2,
        container = _this$options3.container,
        restrict = _this$options3.restrict;
      var restrictEl = restrict || container;
      return _getBoundingRect(restrictEl, force ? getTransformToElement(restrictEl, container) : containerMatrix);
    }

    /** @internal */
  }, {
    key: "pointToTransform",
    value: function pointToTransform(_ref7) {
      var x = _ref7.x,
        y = _ref7.y,
        matrix = _ref7.matrix;
      var nextMatrix = matrix.inverse();
      nextMatrix.e = nextMatrix.f = 0;
      return this.applyMatrixToPoint(nextMatrix, x, y);
    }

    /** @internal */
  }, {
    key: "pointToControls",
    value: function pointToControls(_ref8) {
      var x = _ref8.x,
        y = _ref8.y;
      var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
      var controlsMatrix = transform.controlsMatrix;
      var matrix = controlsMatrix.inverse();
      matrix.e = matrix.f = 0;
      return this.applyMatrixToPoint(matrix, x, y);
    }

    /** @internal */
  }, {
    key: "applyMatrixToPoint",
    value: function applyMatrixToPoint(matrix, x, y) {
      var pt = createSVGElement('svg').createSVGPoint();
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(matrix);
    }

    /** @internal */
  }, {
    key: "applyTransformToElement",
    value: function applyTransformToElement(element, actionName) {
      var _this$storage3 = this.storage,
        _this$storage4 = _this$storage3 === void 0 ? {} : _this$storage3,
        data = _this$storage4.data,
        bBox = _this$storage4.bBox,
        _this$options4 = this.options,
        _this$options5 = _this$options4 === void 0 ? {} : _this$options4,
        isGrouped = _this$options5.isGrouped,
        scalable = _this$options5.scalable,
        applyDragging = _this$options5.applyTranslate;
      var _ref9 = data.get(element),
        _ref9$cached = _ref9.cached,
        cached = _ref9$cached === void 0 ? {} : _ref9$cached,
        nextData = _objectWithoutProperties(_ref9, _excluded2);
      var _nextData$transform = nextData.transform,
        matrix = _nextData$transform.matrix,
        parentMatrix = _nextData$transform.parentMatrix,
        __data__ = nextData.__data__;
      var _ref0 = cached,
        scaleX = _ref0.scaleX,
        scaleY = _ref0.scaleY,
        _ref0$dist = _ref0.dist,
        _ref0$dist2 = _ref0$dist === void 0 ? {} : _ref0$dist,
        dx = _ref0$dist2.dx,
        dy = _ref0$dist2.dy,
        ox = _ref0$dist2.ox,
        oy = _ref0$dist2.oy,
        transformMatrix = _ref0.transformMatrix;
      if (actionName === E_DRAG) {
        if (!applyDragging || !dx && !dy) return;
        var eM = createTranslateMatrix(ox, oy);
        var translateMatrix = eM.multiply(matrix).multiply(eM.inverse());
        this.updateElementView(element, ['transform', translateMatrix]);
        if (isSVGGroup(element)) {
          _checkChildElements(element).map(function (child) {
            var eM = createTranslateMatrix(dx, dy);
            var translateMatrix = eM.multiply(getTransformToElement(child, child.parentNode)).multiply(eM.inverse());
            if (!isIdentity(translateMatrix)) {
              child.setAttribute('transform', matrixToString(translateMatrix));
            }
            if (!isSVGGroup(child)) {
              var ctm = parentMatrix.inverse();
              ctm.e = ctm.f = 0;
              var _pointTo = pointTo(ctm, ox, oy),
                x = _pointTo.x,
                y = _pointTo.y;
              applyTranslate(child, {
                x: x,
                y: y
              });
            }
          });
        } else {
          applyTranslate(element, {
            x: ox,
            y: oy
          });
        }
      }
      if (actionName === E_RESIZE) {
        if (!transformMatrix) return;
        if (!scalable) {
          if (isSVGGroup(element) || isGrouped) {
            var elements = _checkChildElements(element);
            elements.forEach(function (child) {
              if (!isSVGGroup(child)) {
                var childCTM = getTransformToElement(child, isGrouped ? element.parentNode : element);
                var localCTM = childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
                applyResize(child, {
                  scaleX: scaleX,
                  scaleY: scaleY,
                  localCTM: localCTM,
                  transformMatrix: transformMatrix,
                  bBox: bBox,
                  __data__: __data__,
                  isGrouped: isGrouped
                });
              }
            });
          } else {
            applyResize(element, {
              scaleX: scaleX,
              scaleY: scaleY,
              localCTM: transformMatrix,
              transformMatrix: transformMatrix,
              bBox: bBox,
              __data__: __data__,
              isGrouped: isGrouped
            });
          }
        }
      }
      data.set(element, _objectSpread2({}, nextData));
    }

    /** @internal */
  }, {
    key: "processActions",
    value: function processActions(actionName) {
      var _this$storage5 = this.storage,
        controlsMatrix = _this$storage5.transform.controlsMatrix,
        _this$storage5$center = _this$storage5.center,
        _this$storage5$center2 = _this$storage5$center === void 0 ? {} : _this$storage5$center,
        isShifted = _this$storage5$center2.isShifted,
        isGrouped = this.options.isGrouped;
      if (isGrouped && actionName === E_ROTATE) {
        this.applyTransformToHandles();
        var _pointTo2 = pointTo(controlsMatrix, 0, 0),
          dx = _pointTo2.x,
          dy = _pointTo2.y;
        if (isShifted) this.moveCenterHandle(dx, dy);
        this.updateControlsView();
        if (!isShifted) this.setTransformOrigin({
          dx: 0,
          dy: 0
        }, false);
      }
    }

    /** @internal */
  }, {
    key: "processResize",
    value: function processResize(element, _ref1) {
      var dx = _ref1.dx,
        dy = _ref1.dy;
      var _this$storage6 = this.storage,
        revX = _this$storage6.revX,
        revY = _this$storage6.revY,
        doW = _this$storage6.doW,
        doH = _this$storage6.doH,
        data = _this$storage6.data,
        _this$storage6$bBox = _this$storage6.bBox,
        x = _this$storage6$bBox.x,
        y = _this$storage6$bBox.y,
        boxWidth = _this$storage6$bBox.width,
        boxHeight = _this$storage6$bBox.height,
        _this$options6 = this.options,
        isGrouped = _this$options6.isGrouped,
        proportions = _this$options6.proportions,
        scalable = _this$options6.scalable;
      var elementData = data.get(element);
      var _elementData$transfor = elementData.transform,
        matrix = _elementData$transfor.matrix,
        translateMatrix = _elementData$transfor.auxiliary.scale.translateMatrix,
        _elementData$cached = elementData.cached,
        cached = _elementData$cached === void 0 ? {} : _elementData$cached;
      var getScale = function getScale(distX, distY) {
        var actualBoxWidth = Math.max(1, boxWidth);
        var actualBoxHeight = Math.max(1, boxHeight);
        var ratio = doW || !doW && !doH ? (actualBoxWidth + distX) / actualBoxWidth : (actualBoxHeight + distY) / actualBoxHeight;
        var newWidth = proportions ? actualBoxWidth * ratio : actualBoxWidth + distX,
          newHeight = proportions ? actualBoxHeight * ratio : actualBoxHeight + distY;
        var scaleX = newWidth / actualBoxWidth,
          scaleY = newHeight / actualBoxHeight;
        return [scaleX, scaleY, newWidth, newHeight];
      };
      var getScaleMatrix = function getScaleMatrix(scaleX, scaleY) {
        var scaleMatrix = createScaleMatrix(scaleX, scaleY);
        return translateMatrix.multiply(scaleMatrix).multiply(translateMatrix.inverse());
      };
      var _getScale = getScale(dx, dy),
        _getScale2 = _slicedToArray(_getScale, 4),
        scaleX = _getScale2[0],
        scaleY = _getScale2[1],
        newWidth = _getScale2[2],
        newHeight = _getScale2[3];
      var scaleMatrix = getScaleMatrix(scaleX, scaleY);
      var deltaW = newWidth - boxWidth,
        deltaH = newHeight - boxHeight;
      var newX = x - deltaW * (doH ? 0.5 : revX ? 1 : 0),
        newY = y - deltaH * (doW ? 0.5 : revY ? 1 : 0);
      var resultMatrix = isGrouped ? scaleMatrix.multiply(matrix) : matrix.multiply(scaleMatrix);
      if (scalable) this.updateElementView(element, ['transform', resultMatrix]);
      data.set(element, _objectSpread2(_objectSpread2({}, elementData), {}, {
        cached: _objectSpread2(_objectSpread2({}, cached), {}, {
          scaleX: scaleX,
          scaleY: scaleY,
          transformMatrix: scaleMatrix,
          resultMatrix: resultMatrix
        })
      }));
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
  }, {
    key: "processMove",
    value: function processMove(element, _ref10) {
      var dx = _ref10.dx,
        dy = _ref10.dy;
      var data = this.storage.data;
      var elementStorage = data.get(element);
      var _elementStorage$trans = elementStorage.transform,
        matrix = _elementStorage$trans.matrix,
        _elementStorage$trans2 = _elementStorage$trans.auxiliary.translate,
        translateMatrix = _elementStorage$trans2.translateMatrix,
        parentMatrix = _elementStorage$trans2.parentMatrix,
        cached = elementStorage.cached;
      parentMatrix.e = parentMatrix.f = 0;
      var _pointTo3 = pointTo(parentMatrix, dx, dy),
        nx = _pointTo3.x,
        ny = _pointTo3.y;
      data.set(element, _objectSpread2(_objectSpread2({}, elementStorage), {}, {
        cached: _objectSpread2(_objectSpread2({}, cached), {}, {
          dist: {
            dx: floatToFixed(dx),
            dy: floatToFixed(dy),
            ox: floatToFixed(nx),
            oy: floatToFixed(ny)
          }
        })
      }));
      translateMatrix.e = nx;
      translateMatrix.f = ny;
      var moveElementMtrx = translateMatrix.multiply(matrix);
      this.updateElementView(element, ['transform', moveElementMtrx]);
      return moveElementMtrx;
    }

    /** @internal */
  }, {
    key: "processRotate",
    value: function processRotate(element, radians) {
      var _this$storage7 = this.storage,
        _this$storage8 = _this$storage7 === void 0 ? {} : _this$storage7,
        data = _this$storage8.data;
      var _ref11 = data.get(element),
        _ref11$transform = _ref11.transform,
        matrix = _ref11$transform.matrix,
        parentMatrix = _ref11$transform.parentMatrix,
        translateMatrix = _ref11$transform.auxiliary.rotate.translateMatrix;
      var cos = floatToFixed(Math.cos(radians)),
        sin = floatToFixed(Math.sin(radians));
      var rotateMatrix = createRotateMatrix(sin, cos);
      parentMatrix.e = parentMatrix.f = 0;
      var resRotMatrix = parentMatrix.inverse().multiply(rotateMatrix).multiply(parentMatrix);
      var resRotateMatrix = translateMatrix.multiply(resRotMatrix).multiply(translateMatrix.inverse());
      var resultMatrix = resRotateMatrix.multiply(matrix);
      this.updateElementView(element, ['transform', resultMatrix]);
      return resultMatrix;
    }

    /** @internal */
  }, {
    key: "getElementState",
    value: function getElementState(element, _ref12) {
      var revX = _ref12.revX,
        revY = _ref12.revY,
        doW = _ref12.doW,
        doH = _ref12.doH;
      var _this$options7 = this.options,
        container = _this$options7.container,
        isGrouped = _this$options7.isGrouped,
        _this$storage9 = this.storage,
        data = _this$storage9.data,
        controls = _this$storage9.controls,
        cHandle = _this$storage9.handles.center,
        _this$storage9$transf = _this$storage9.transformOrigin,
        originX = _this$storage9$transf.x,
        originY = _this$storage9$transf.y;
      var elementData = data.get(element);
      var __data__ = elementData.__data__;
      storeElementAttributes(element, elementData, container);
      __data__["delete"](element);
      _checkChildElements(element).forEach(function (child) {
        __data__["delete"](child);
        storeElementAttributes(child, elementData, element, isGrouped);
      });
      var bBox = this.getBBox();
      var elX = bBox.x,
        elY = bBox.y,
        elW = bBox.width,
        elH = bBox.height;
      var elMatrix = getTransformToElement(element, element.parentNode),
        ctm = getTransformToElement(element, container),
        parentMatrix = getTransformToElement(element.parentNode, container);
      var parentMatrixInverted = parentMatrix.inverse();
      var scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
        scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);
      var boxCTM = getTransformToElement(controls, container);
      var elCenterX = elX + elW / 2,
        elCenterY = elY + elH / 2;

      // c-handle's coordinates
      var _pointTo4 = pointTo(boxCTM, originX, originY),
        bcx = _pointTo4.x,
        bcy = _pointTo4.y;

      // element's center coordinates
      var _ref13 = cHandle ? pointTo(parentMatrixInverted, bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : elMatrix, elCenterX, elCenterY),
        elcx = _ref13.x,
        elcy = _ref13.y;
      var _ref14 = cHandle ? pointTo(isGrouped ? parentMatrixInverted : ctm.inverse(), bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : createSVGMatrix(), scaleX, scaleY),
        nextScaleX = _ref14.x,
        nextScaleY = _ref14.y;
      var transform = {
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
        ctm: ctm,
        parentMatrix: parentMatrix,
        scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
        scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
      };
      return {
        transform: transform,
        bBox: bBox
      };
    }

    /** @internal */
  }, {
    key: "getCommonState",
    value: function getCommonState() {
      var elements = this.elements,
        _this$options8 = this.options,
        isGrouped = _this$options8.isGrouped,
        container = _this$options8.container,
        restrict = _this$options8.restrict,
        _this$storage0 = this.storage,
        controls = _this$storage0.controls,
        cHandle = _this$storage0.handles.center;
      var bBox = this.getBBox();
      var elX = bBox.x,
        elY = bBox.y,
        elW = bBox.width,
        elH = bBox.height;
      var elCenterX = elX + elW / 2,
        elCenterY = elY + elH / 2;
      var boxCTM = getTransformToElement(controls, container);
      var centerX = cHandle ? cHandle.cx.baseVal.value : elCenterX;
      var centerY = cHandle ? cHandle.cy.baseVal.value : elCenterY;

      // c-handle's coordinates
      var _pointTo5 = pointTo(boxCTM, centerX, centerY),
        bcx = _pointTo5.x,
        bcy = _pointTo5.y;

      // box's center coordinates
      var _pointTo6 = pointTo(isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container), elCenterX, elCenterY),
        rcx = _pointTo6.x,
        rcy = _pointTo6.y;
      var restrictContainer = restrict || container;
      var containerMatrix = getTransformToElement(restrictContainer, restrictContainer.parentNode);
      var center = _objectSpread2(_objectSpread2({}, this.storage.center || {}), {}, {
        x: cHandle ? bcx : rcx,
        y: cHandle ? bcy : rcy,
        hx: cHandle ? cHandle.cx.baseVal.value : null,
        hy: cHandle ? cHandle.cy.baseVal.value : null
      });
      return {
        transform: {
          containerMatrix: containerMatrix,
          controlsMatrix: getTransformToElement(controls, controls.parentNode),
          controlsTranslateMatrix: createSVGMatrix(),
          wrapperOriginMatrix: createTranslateMatrix(center.x, center.y)
        },
        bBox: bBox,
        center: center
      };
    }

    /**
     * Handle positions as { x, y } in container coordinates: box corners and edge
     * midpoints (tl, tc, tr, ml, mr, bl, bc, br), center, line endpoints (p1, p2)
     * for a single <line>, and rotator with its anchor when rotatable
     * @param transformMatrix matrix applied on top of the element transform
     */
  }, {
    key: "getVertices",
    value: function getVertices() {
      var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createSVGMatrix();
      var elements = this.elements,
        _this$options9 = this.options,
        isGrouped = _this$options9.isGrouped,
        rotatable = _this$options9.rotatable,
        rotatorAnchor = _this$options9.rotatorAnchor,
        rotatorOffset = _this$options9.rotatorOffset,
        container = _this$options9.container;
      var _this$getBBox = this.getBBox(),
        x = _this$getBBox.x,
        y = _this$getBBox.y,
        width = _this$getBBox.width,
        height = _this$getBBox.height;
      var hW = width / 2,
        hH = height / 2;
      var vertices = {
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
      var line = this.getLine();
      if (line) {
        vertices[START_POINT] = [line.x1.baseVal.value, line.y1.baseVal.value];
        vertices[END_POINT] = [line.x2.baseVal.value, line.y2.baseVal.value];
      }
      var nextTransform = isGrouped ? transformMatrix : transformMatrix.multiply(getTransformToElement(elements[0], container));
      var nextVertices = entries(vertices).reduce(function (nextRes, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
          key = _ref16[0],
          _ref16$ = _slicedToArray(_ref16[1], 2),
          x = _ref16$[0],
          y = _ref16$[1];
        nextRes[key] = pointTo(nextTransform, x, y);
        return nextRes;
      }, {});
      if (rotatable && line) {
        var start = nextVertices[START_POINT],
          end = nextVertices[END_POINT];
        var axisX = end.x - start.x,
          axisY = end.y - start.y;
        var length = Math.sqrt(axisX * axisX + axisY * axisY);
        var _ref17 = length ? [axisY / length, -axisX / length] : [0, -1],
          _ref18 = _slicedToArray(_ref17, 2),
          normalX = _ref18[0],
          normalY = _ref18[1];
        var side = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;
        var anchor = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        };
        nextVertices.rotator = {
          x: anchor.x + normalX * rotatorOffset * side,
          y: anchor.y + normalY * rotatorOffset * side
        };
        nextVertices.anchor = anchor;
      } else if (rotatable) {
        var _anchor = {};
        var factor = 1;
        switch (rotatorAnchor) {
          case 'n':
            {
              var _nextVertices$tc = nextVertices.tc,
                _x = _nextVertices$tc.x,
                _y = _nextVertices$tc.y;
              _anchor.x = _x;
              _anchor.y = _y;
              break;
            }
          case 's':
            {
              var _nextVertices$bc = nextVertices.bc,
                _x2 = _nextVertices$bc.x,
                _y2 = _nextVertices$bc.y;
              _anchor.x = _x2;
              _anchor.y = _y2;
              factor = -1;
              break;
            }
          case 'w':
            {
              var _nextVertices$ml = nextVertices.ml,
                _x3 = _nextVertices$ml.x,
                _y3 = _nextVertices$ml.y;
              _anchor.x = _x3;
              _anchor.y = _y3;
              factor = -1;
              break;
            }
          case 'e':
          default:
            {
              var _nextVertices$mr = nextVertices.mr,
                _x4 = _nextVertices$mr.x,
                _y4 = _nextVertices$mr.y;
              _anchor.x = _x4;
              _anchor.y = _y4;
              break;
            }
        }
        var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? rotatorAngle(nextVertices.bl.x - nextVertices.tl.x, nextVertices.bl.y - nextVertices.tl.y, nextVertices.tr.x - nextVertices.tl.x, nextVertices.tr.y - nextVertices.tl.y) : rotatorAngle(nextVertices.tl.x - nextVertices.tr.x, nextVertices.tl.y - nextVertices.tr.y, nextVertices.bl.x - nextVertices.tl.x, nextVertices.bl.y - nextVertices.tl.y);
        var nextRotatorOffset = rotatorOffset * factor;
        var rotator = {
          x: _anchor.x - nextRotatorOffset * Math.cos(theta),
          y: _anchor.y - nextRotatorOffset * Math.sin(theta)
        };
        nextVertices.rotator = rotator;
        nextVertices.anchor = _anchor;
      }
      return nextVertices;
    }

    /** @internal */
  }, {
    key: "getLine",
    value: function getLine() {
      var _this$elements = _slicedToArray(this.elements, 1),
        element = _this$elements[0],
        isGrouped = this.options.isGrouped;
      return !isGrouped && element.tagName.toLowerCase() === 'line' ? element : null;
    }

    /** @internal */
  }, {
    key: "getBBox",
    value: function getBBox() {
      var elements = this.elements,
        _this$options0 = this.options,
        container = _this$options0.container,
        isGrouped = _this$options0.isGrouped;
      if (isGrouped) {
        var groupBBox = elements.reduce(function (result, element) {
          var elCTM = getTransformToElement(element, container);
          return [].concat(_toConsumableArray(result), _toConsumableArray(_getBoundingRect(element, elCTM)));
        }, []);
        var _getMinMaxOfArray = getMinMaxOfArray(groupBBox),
          _getMinMaxOfArray2 = _slicedToArray(_getMinMaxOfArray, 2),
          _getMinMaxOfArray2$ = _slicedToArray(_getMinMaxOfArray2[0], 2),
          minX = _getMinMaxOfArray2$[0],
          maxX = _getMinMaxOfArray2$[1],
          _getMinMaxOfArray2$2 = _slicedToArray(_getMinMaxOfArray2[1], 2),
          minY = _getMinMaxOfArray2$2[0],
          maxY = _getMinMaxOfArray2$2[1];
        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      } else {
        return elements[0].getBBox();
      }
    }

    /** @internal */
  }, {
    key: "moveCenterHandle",
    value: function moveCenterHandle(dx, dy) {
      var _this$storage1 = this.storage,
        _this$storage1$handle = _this$storage1.handles,
        center = _this$storage1$handle.center,
        radius = _this$storage1$handle.radius,
        prevCenterData = _this$storage1.center,
        _this$storage1$transf = _this$storage1.transform,
        _this$storage1$transf2 = _this$storage1$transf === void 0 ? {} : _this$storage1$transf,
        _this$storage1$transf3 = _this$storage1$transf2.controlsMatrix,
        controlsMatrix = _this$storage1$transf3 === void 0 ? createSVGMatrix() : _this$storage1$transf3,
        _this$storage1$transf4 = _this$storage1.transformOrigin,
        _this$storage1$transf5 = _this$storage1$transf4 === void 0 ? {} : _this$storage1$transf4,
        originX = _this$storage1$transf5.x,
        originY = _this$storage1$transf5.y,
        cached = _this$storage1.cached;
      if (isUndef(center)) return;
      var nextX = originX + dx,
        nextY = originY + dy;
      center.cx.baseVal.value = nextX;
      center.cy.baseVal.value = nextY;
      radius.x2.baseVal.value = nextX;
      radius.y2.baseVal.value = nextY;
      this.storage = _objectSpread2(_objectSpread2({}, this.storage), {}, {
        center: _objectSpread2(_objectSpread2({}, prevCenterData), {}, {
          isShifted: true
        }, pointTo(controlsMatrix.inverse(), nextX, nextY)),
        cached: _objectSpread2(_objectSpread2({}, cached), {}, {
          transformOrigin: pointTo(createSVGMatrix(), nextX, nextY)
        })
      });
      this.syncHitAreas();
    }

    /** @internal */
  }, {
    key: "processMoveRestrict",
    value: function processMoveRestrict(element, _ref19) {
      var dx = _ref19.dx,
        dy = _ref19.dy;
      var data = this.storage.data;
      var elementStorage = data.get(element);
      var _elementStorage$trans3 = elementStorage.transform,
        matrix = _elementStorage$trans3.matrix,
        parentMatrix = _elementStorage$trans3.auxiliary.translate.parentMatrix;
      parentMatrix.e = parentMatrix.f = 0;
      var _pointTo7 = pointTo(parentMatrix, dx, dy),
        x = _pointTo7.x,
        y = _pointTo7.y;
      var preTranslateMatrix = createTranslateMatrix(x, y).multiply(matrix);
      return this.restrictHandler(element, preTranslateMatrix);
    }

    /** @internal */
  }, {
    key: "processRotateRestrict",
    value: function processRotateRestrict(element, radians) {
      var _this$storage10 = this.storage,
        _this$storage11 = _this$storage10 === void 0 ? {} : _this$storage10,
        data = _this$storage11.data;
      var _ref20 = data.get(element),
        _ref20$transform = _ref20.transform,
        matrix = _ref20$transform.matrix,
        parentMatrix = _ref20$transform.parentMatrix,
        translateMatrix = _ref20$transform.auxiliary.rotate.translateMatrix;
      var cos = floatToFixed(Math.cos(radians)),
        sin = floatToFixed(Math.sin(radians));
      var rotateMatrix = createRotateMatrix(sin, cos);
      parentMatrix.e = parentMatrix.f = 0;
      var resRotMatrix = parentMatrix.inverse().multiply(rotateMatrix).multiply(parentMatrix);
      var resRotateMatrix = translateMatrix.multiply(resRotMatrix).multiply(translateMatrix.inverse());
      var resultMatrix = resRotateMatrix.multiply(matrix);
      return this.restrictHandler(element, resultMatrix);
    }

    /** @internal */
  }, {
    key: "processResizeRestrict",
    value: function processResizeRestrict(element, _ref21) {
      var dx = _ref21.dx,
        dy = _ref21.dy;
      var _this$storage12 = this.storage,
        doW = _this$storage12.doW,
        doH = _this$storage12.doH,
        data = _this$storage12.data,
        _this$storage12$bBox = _this$storage12.bBox,
        boxWidth = _this$storage12$bBox.width,
        boxHeight = _this$storage12$bBox.height,
        proportions = this.options.proportions;
      var elementData = data.get(element);
      var _elementData$transfor2 = elementData.transform,
        matrix = _elementData$transfor2.matrix,
        translateMatrix = _elementData$transfor2.auxiliary.scale.translateMatrix;
      var getScale = function getScale(distX, distY) {
        var actualBoxWidth = Math.max(1, boxWidth);
        var actualBoxHeight = Math.max(1, boxHeight);
        var ratio = doW || !doW && !doH ? (actualBoxWidth + distX) / actualBoxWidth : (actualBoxHeight + distY) / actualBoxHeight;
        var newWidth = proportions ? actualBoxWidth * ratio : actualBoxWidth + distX,
          newHeight = proportions ? actualBoxHeight * ratio : actualBoxHeight + distY;
        var scaleX = newWidth / actualBoxWidth,
          scaleY = newHeight / actualBoxHeight;
        return [scaleX, scaleY, newWidth, newHeight];
      };
      var getScaleMatrix = function getScaleMatrix(scaleX, scaleY) {
        var scaleMatrix = createScaleMatrix(scaleX, scaleY);
        return translateMatrix.multiply(scaleMatrix).multiply(translateMatrix.inverse());
      };
      var _getScale3 = getScale(dx, dy),
        _getScale4 = _slicedToArray(_getScale3, 2),
        scaleX = _getScale4[0],
        scaleY = _getScale4[1];
      var preScaledMatrix = matrix.multiply(getScaleMatrix(scaleX, scaleY));
      return this.restrictHandler(element, preScaledMatrix);
    }

    /** @internal */
  }, {
    key: "processPointMove",
    value: function processPointMove(element, point, _ref22) {
      var dx = _ref22.dx,
        dy = _ref22.dy;
      var _this$storage13 = this.storage,
        data = _this$storage13.data,
        restriction = _this$storage13.restriction,
        proportions = this.options.proportions;
      var _ref23 = data.get(element),
        _ref23$transform = _ref23.transform,
        ctm = _ref23$transform.ctm,
        matrix = _ref23$transform.matrix,
        __data__ = _ref23.__data__;
      var _ref24 = __data__.get(element),
        resX1 = _ref24.resX1,
        resY1 = _ref24.resY1,
        resX2 = _ref24.resX2,
        resY2 = _ref24.resY2;
      var isStart = point === START_POINT;
      var _ref25 = isStart ? [resX1, resY1, resX2, resY2] : [resX2, resY2, resX1, resY1],
        _ref26 = _slicedToArray(_ref25, 4),
        baseX = _ref26[0],
        baseY = _ref26[1],
        otherX = _ref26[2],
        otherY = _ref26[3];
      var toLocal = ctm.inverse();
      toLocal.e = toLocal.f = 0;
      var _pointTo8 = pointTo(toLocal, dx, dy),
        localDx = _pointTo8.x,
        localDy = _pointTo8.y;
      if (proportions) {
        var axisX = baseX - otherX,
          axisY = baseY - otherY;
        var axisLength = axisX * axisX + axisY * axisY;
        if (axisLength > 0) {
          var projection = (localDx * axisX + localDy * axisY) / axisLength;
          localDx = axisX * projection;
          localDy = axisY * projection;
        }
      }
      var nextX = baseX + localDx,
        nextY = baseY + localDy;
      if (restriction) {
        var _pointTo9 = pointTo(ctm, nextX, nextY),
          x = _pointTo9.x,
          y = _pointTo9.y;
        var area = restriction.area;
        var tolerance = 1e-6;
        if (x < area.left - tolerance || x > area.right + tolerance || y < area.top - tolerance || y > area.bottom + tolerance) return null;
      }
      element.setAttribute(isStart ? 'x1' : 'x2', String(nextX));
      element.setAttribute(isStart ? 'y1' : 'y2', String(nextY));
      this.processControlsResize();
      var _element$getBBox = element.getBBox(),
        width = _element$getBBox.width,
        height = _element$getBBox.height;
      return {
        width: width,
        height: height,
        transform: matrix
      };
    }

    /** @internal */
  }, {
    key: "processControlsResize",
    value: function processControlsResize() {
      var _this$storage14 = this.storage,
        _this$storage15 = _this$storage14 === void 0 ? {} : _this$storage14,
        controlsMatrix = _this$storage15.transform.controlsMatrix;
      this.applyTransformToHandles({
        boxMatrix: controlsMatrix.inverse()
      });
    }

    /** @internal */
  }, {
    key: "processControlsMove",
    value: function processControlsMove(_ref27) {
      var dx = _ref27.dx,
        dy = _ref27.dy;
      var _this$storage16 = this.storage,
        _this$storage17 = _this$storage16 === void 0 ? {} : _this$storage16,
        _this$storage17$trans = _this$storage17.transform,
        controlsMatrix = _this$storage17$trans.controlsMatrix,
        controlsTranslateMatrix = _this$storage17$trans.controlsTranslateMatrix,
        center = _this$storage17.center;
      controlsTranslateMatrix.e = dx;
      controlsTranslateMatrix.f = dy;
      var moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);
      this.updateControlsView(moveControlsMtrx);
      if (center.isShifted) {
        var centerTransformMatrix = controlsMatrix.inverse();
        centerTransformMatrix.e = centerTransformMatrix.f = 0;
        var _pointTo0 = pointTo(centerTransformMatrix, dx, dy),
          cx = _pointTo0.x,
          cy = _pointTo0.y;
        this.moveCenterHandle(-cx, -cy);
      }
    }

    /** @internal */
  }, {
    key: "processControlsRotate",
    value: function processControlsRotate(_ref28) {
      var radians = _ref28.radians;
      var isGrouped = this.options.isGrouped,
        _this$storage18 = this.storage,
        _this$storage19 = _this$storage18 === void 0 ? {} : _this$storage18,
        _this$storage19$trans = _this$storage19.transform,
        _this$storage19$trans2 = _this$storage19$trans === void 0 ? {} : _this$storage19$trans,
        controlsMatrix = _this$storage19$trans2.controlsMatrix,
        wrapperOriginMatrix = _this$storage19$trans2.wrapperOriginMatrix;
      if (isGrouped) {
        var cos = floatToFixed(Math.cos(radians)),
          sin = floatToFixed(Math.sin(radians));
        var rotateMatrix = createRotateMatrix(sin, cos);
        var wrapperResultMatrix = wrapperOriginMatrix.multiply(rotateMatrix).multiply(wrapperOriginMatrix.inverse()).multiply(controlsMatrix);
        this.updateControlsView(wrapperResultMatrix);
      } else {
        this.applyTransformToHandles({
          boxMatrix: controlsMatrix.inverse()
        });
      }
    }

    /** @internal */
  }, {
    key: "updateElementView",
    value: function updateElementView(element, _ref29) {
      var _ref30 = _slicedToArray(_ref29, 2),
        attr = _ref30[0],
        value = _ref30[1];
      if (attr === 'transform') {
        element.setAttribute(attr, matrixToString(value));
      }
    }

    /** @internal */
  }, {
    key: "updateControlsView",
    value: function updateControlsView() {
      var matrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createSVGMatrix();
      this.storage.controls.setAttribute('transform', matrixToString(matrix));
      this.storage.cached.controlsMatrix = matrix;
    }

    /** @internal */
  }, {
    key: "applyTransformToHandles",
    value: function applyTransformToHandles() {
      var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref31$boxMatrix = _ref31.boxMatrix,
        boxMatrix = _ref31$boxMatrix === void 0 ? createSVGMatrix() : _ref31$boxMatrix;
      var rotatable = this.options.rotatable,
        _this$storage20 = this.storage,
        handles = _this$storage20.handles,
        isShifted = _this$storage20.center.isShifted;
      var _this$getVertices2 = this.getVertices(boxMatrix),
        _this$getVertices2$an = _this$getVertices2.anchor,
        anchor = _this$getVertices2$an === void 0 ? null : _this$getVertices2$an,
        center = _this$getVertices2.center,
        nextVertices = _objectWithoutProperties(_this$getVertices2, _excluded3);
      var resEdges = {
        te: [nextVertices.tl, nextVertices.tr],
        be: [nextVertices.bl, nextVertices.br],
        le: [nextVertices.tl, nextVertices.bl],
        re: [nextVertices.tr, nextVertices.br]
      };
      if (rotatable) {
        var normal = handles.normal,
          radius = handles.radius;
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
      keys(resEdges).forEach(function (key) {
        var hdl = handles[key];
        var _resEdges$key = _slicedToArray(resEdges[key], 2),
          b = _resEdges$key[0],
          e = _resEdges$key[1];
        if (isUndef(b) || isUndef(hdl)) return;
        entries({
          x1: b.x,
          y1: b.y,
          x2: e.x,
          y2: e.y
        }).map(function (_ref32) {
          var _ref33 = _slicedToArray(_ref32, 2),
            attr = _ref33[0],
            value = _ref33[1];
          return hdl.setAttribute(attr, String(value));
        });
      });
      var handlesVertices = _objectSpread2(_objectSpread2({}, nextVertices), !isShifted && Boolean(center) && {
        center: center
      });
      var result = keys(handlesVertices).reduce(function (result, key) {
        var hdl = handles[key];
        var attr = handlesVertices[key];
        result[key] = attr;
        if (isUndef(attr) || isUndef(hdl)) return result;
        hdl.setAttribute('cx', String(attr.x));
        hdl.setAttribute('cy', String(attr.y));
        return result;
      }, {});
      this.syncHitAreas();
      return result;
    }

    /** @internal */
  }, {
    key: "prepareGuides",
    value: function prepareGuides() {
      var _this2 = this;
      var elements = this.elements,
        wrapper = this.storage.wrapper,
        _this$options1 = this.options,
        container = _this$options1.container,
        guides = _this$options1.guides;
      if (!guides) return null;
      var targets = guides.targets,
        bounds = guides.bounds,
        _guides$threshold = guides.threshold,
        threshold = _guides$threshold === void 0 ? 6 : _guides$threshold,
        _guides$snap = guides.snap,
        snap = _guides$snap === void 0 ? true : _guides$snap;
      var isMoving = function isMoving(element) {
        return elements.some(function (item) {
          return item === element || item.contains(element) || element.contains(item);
        });
      };
      var candidates = typeof targets === 'string' ? _toConsumableArray(document.querySelectorAll(targets)) : targets || _toConsumableArray(elements[0].parentNode.children);
      var targetBoxes = candidates.reduce(function (result, element) {
        if (!('getBBox' in element) || isMoving(element) || wrapper.contains(element)) return result;
        try {
          result.push(_this2.getBoundsBox(element));
        } catch (_unused) {
          return result;
        }
        return result;
      }, []);
      var boundsElement = bounds === false ? null : bounds ? helper(bounds)[0] : container;
      if (boundsElement) targetBoxes.push(this.getBoundsBox(boundsElement));
      var screenMatrix = container.getScreenCTM();
      var scale = screenMatrix ? Math.sqrt(Math.abs(screenMatrix.a * screenMatrix.d - screenMatrix.b * screenMatrix.c)) || 1 : 1;
      return _objectSpread2(_objectSpread2({}, this.measure()), {}, {
        targets: targetBoxes,
        threshold: threshold / scale,
        snap: snap
      });
    }

    /** @internal */
  }, {
    key: "prepareRestrict",
    value: function prepareRestrict() {
      var restrict = this.options.restrict;
      if (!restrict) return null;
      return _objectSpread2(_objectSpread2({}, this.measure()), {}, {
        area: this.getBoundsBox(restrict)
      });
    }

    /** @internal */
  }, {
    key: "measure",
    value: function measure() {
      var elements = this.elements,
        _this$options10 = this.options,
        container = _this$options10.container,
        isGrouped = _this$options10.isGrouped;
      var matrices = elements.map(function (element) {
        return getTransformToElement(element, container);
      });
      var _matrices = _slicedToArray(matrices, 1),
        firstMatrix = _matrices[0];
      var line = this.getLine();
      var point = this.storage.point;
      var pointPosition = line && point ? pointTo(firstMatrix, point === START_POINT ? line.x1.baseVal.value : line.x2.baseVal.value, point === START_POINT ? line.y1.baseVal.value : line.y2.baseVal.value) : null;
      return {
        box: unionBoxes(elements.map(function (element, index) {
          return boxFromPoints(_getBoundingRect(element, matrices[index]));
        })),
        axisAligned: matrices.every(function (matrix) {
          return Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6;
        }),
        flipX: !isGrouped && firstMatrix.a < 0,
        flipY: !isGrouped && firstMatrix.d < 0,
        point: pointPosition && {
          x: pointPosition.x,
          y: pointPosition.y
        }
      };
    }

    /** @internal */
  }, {
    key: "getBoundsBox",
    value: function getBoundsBox(element) {
      var container = this.options.container;
      if (element.tagName.toLowerCase() !== 'svg') {
        return boxFromPoints(_getBoundingRect(element, getTransformToElement(element, container)));
      }
      var _element$getBoundingC = element.getBoundingClientRect(),
        left = _element$getBoundingC.left,
        top = _element$getBoundingC.top,
        right = _element$getBoundingC.right,
        bottom = _element$getBoundingC.bottom;
      var toContainer = (container.getScreenCTM() || createSVGMatrix()).inverse();
      return boxFromPoints([[left, top], [right, top], [right, bottom], [left, bottom]].map(function (_ref34) {
        var _ref35 = _slicedToArray(_ref34, 2),
          x = _ref35[0],
          y = _ref35[1];
        var point = pointTo(toContainer, x, y);
        return [point.x, point.y];
      }));
    }

    /** @internal */
  }, {
    key: "drawGuides",
    value: function drawGuides(lines) {
      var storage = this.storage,
        _this$storage21 = this.storage,
        wrapper = _this$storage21.wrapper,
        guidesLayer = _this$storage21.guidesLayer,
        container = this.options.container;
      if (guidesLayer) {
        while (guidesLayer.firstChild) guidesLayer.removeChild(guidesLayer.firstChild);
      }
      if (!lines.length) return;
      var layer = guidesLayer || createSVGElement('g', ['sjx-svg-guides']);
      if (!guidesLayer) {
        wrapper.insertBefore(layer, wrapper.firstChild);
        storage.guidesLayer = layer;
      }
      layer.setAttribute('transform', matrixToString(getTransformToElement(container, wrapper.parentNode)));
      lines.forEach(function (_ref36) {
        var axis = _ref36.axis,
          value = _ref36.value,
          from = _ref36.from,
          to = _ref36.to;
        var line = createSVGElement('line', ['sjx-svg-guide']);
        var _ref37 = axis === 'x' ? [value, from, value, to] : [from, value, to, value],
          _ref38 = _slicedToArray(_ref37, 4),
          x1 = _ref38[0],
          y1 = _ref38[1],
          x2 = _ref38[2],
          y2 = _ref38[3];
        entries({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: '#ff3d9a',
          'stroke-width': 1,
          'vector-effect': 'non-scaling-stroke',
          'pointer-events': 'none'
        }).forEach(function (_ref39) {
          var _ref40 = _slicedToArray(_ref39, 2),
            attr = _ref40[0],
            attrValue = _ref40[1];
          return line.setAttribute(attr, String(attrValue));
        });
        layer.appendChild(line);
      });
    }

    /** @internal */
  }, {
    key: "syncHitAreas",
    value: function syncHitAreas() {
      var _this$storage22 = this.storage,
        controls = _this$storage22.controls,
        handles = _this$storage22.handles,
        hitAreas = _this$storage22.hitAreas,
        hitOverlay = _this$storage22.hitOverlay,
        hitRadius = this.options.hitRadius;
      if (!hitAreas) return;
      var screenMatrix = controls.getScreenCTM();
      var scale = screenMatrix ? Math.sqrt(Math.abs(screenMatrix.a * screenMatrix.d - screenMatrix.b * screenMatrix.c)) || 1 : 1;
      var corners = readCorners(handles.te, handles.be);
      var radius = hitRadius / scale;
      var outlines = [];
      entries(hitAreas).forEach(function (_ref41) {
        var _ref42 = _slicedToArray(_ref41, 2),
          key = _ref42[0],
          area = _ref42[1];
        var hdl = handles[key];
        if (isUndef(hdl)) return;
        var center = {
          x: Number(hdl.getAttribute('cx')) || 0,
          y: Number(hdl.getAttribute('cy')) || 0
        };
        var path = outlineToPath(hitAreaOutline(key, center, corners, radius));
        area.setAttribute('d', path);
        outlines.push(path);
      });
      if (hitOverlay) hitOverlay.setAttribute('d', outlines.join(''));
    }
  }, {
    key: "setCenterPoint",
    value: function setCenterPoint() {
      warn('"setCenterPoint" method is replaced by "setTransformOrigin" and would be removed soon');
      this.setTransformOrigin.apply(this, arguments);
    }
  }, {
    key: "setTransformOrigin",
    value: function setTransformOrigin() {
      var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        x = _ref43.x,
        y = _ref43.y,
        dx = _ref43.dx,
        dy = _ref43.dy;
      var pin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var elements = this.elements,
        storage = this.storage,
        _this$storage23 = this.storage,
        _this$storage24 = _this$storage23 === void 0 ? {} : _this$storage23,
        controls = _this$storage24.controls,
        _this$storage24$handl = _this$storage24.handles,
        _this$storage24$handl2 = _this$storage24$handl === void 0 ? {} : _this$storage24$handl,
        handle = _this$storage24$handl2.center,
        radius = _this$storage24$handl2.radius,
        center = _this$storage24.center,
        _this$options11 = this.options,
        container = _this$options11.container,
        isGrouped = _this$options11.isGrouped;
      var isRelative = isDef(dx) && isDef(dy),
        isAbsolute = isDef(x) && isDef(y);
      if (!center || !handle || !radius || !(isRelative || isAbsolute)) return;
      var controlsTransformMatrix = getTransformToElement(controls, controls.parentNode).inverse();
      var nextTransform = isGrouped ? controlsTransformMatrix : controlsTransformMatrix.multiply(getTransformToElement(elements[0], container));
      var newX, newY;
      if (isRelative) {
        var _this$getBBox2 = this.getBBox(),
          bx = _this$getBBox2.x,
          by = _this$getBBox2.y,
          width = _this$getBBox2.width,
          height = _this$getBBox2.height;
        var hW = width / 2,
          hH = height / 2;
        var _pointTo1 = pointTo(nextTransform, bx + hW + dx, by + hH + dy);
        newX = _pointTo1.x;
        newY = _pointTo1.y;
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
  }, {
    key: "fitControlsToSize",
    value: function fitControlsToSize() {
      var _this$storage25 = this.storage,
        controls = _this$storage25.controls,
        _this$storage25$cente = _this$storage25.center,
        _this$storage25$cente2 = _this$storage25$cente === void 0 ? {} : _this$storage25$cente,
        isShifted = _this$storage25$cente2.isShifted,
        _this$storage25$trans = _this$storage25.transformOrigin,
        _this$storage25$trans2 = _this$storage25$trans === void 0 ? {} : _this$storage25$trans,
        originX = _this$storage25$trans2.x,
        originY = _this$storage25$trans2.y;
      var controlsMatrix = getTransformToElement(controls, controls.parentNode);
      var _pointTo10 = pointTo(controlsMatrix, originX, originY),
        dx = _pointTo10.x,
        dy = _pointTo10.y;
      var _ref44 = [{
          nextValues: function nextValues() {
            return {
              x: dx,
              y: dy
            };
          },
          pin: true,
          condition: function condition() {
            return isShifted;
          }
        }, {
          nextValues: function nextValues() {
            return {
              dx: 0,
              dy: 0
            };
          },
          pin: false,
          condition: function condition() {
            return !isShifted;
          }
        }].find(function (_ref45) {
          var condition = _ref45.condition;
          return condition();
        }),
        nextValues = _ref44.nextValues,
        pin = _ref44.pin;
      this.updateControlsView();
      this.setTransformOrigin(_objectSpread2({}, nextValues()), pin);
      this.applyTransformToHandles();
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect(element) {
      var transformMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$options12 = this.options,
        _this$options13 = _this$options12 === void 0 ? {} : _this$options12,
        restrict = _this$options13.restrict,
        container = _this$options13.container;
      var restrictEl = restrict || container;
      var nextTransform = transformMatrix ? getTransformToElement(element.parentNode, restrictEl).multiply(transformMatrix) : getTransformToElement(element, restrictEl);
      return _getBoundingRect(element, nextTransform, element.getBBox());
    }
  }, {
    key: "applyAlignment",
    value: function applyAlignment(direction) {
      var _this3 = this;
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var elements = this.elements,
        container = this.options.container;
      var _this$getVertices3 = this.getVertices();
        _this$getVertices3.anchor;
        _this$getVertices3.rotator;
        _this$getVertices3.center;
        var vertices = _objectWithoutProperties(_this$getVertices3, _excluded4);
      var restrictBBox = target ? _getBoundingRect(target, getTransformToElement(target, container)) : this.getRestrictedBBox(true);
      var nextVertices = values(vertices).map(function (_ref46) {
        var x = _ref46.x,
          y = _ref46.y;
        return [x, y];
      });
      var _getMinMaxOfArray3 = getMinMaxOfArray(restrictBBox),
        _getMinMaxOfArray4 = _slicedToArray(_getMinMaxOfArray3, 2),
        _getMinMaxOfArray4$ = _slicedToArray(_getMinMaxOfArray4[0], 2),
        minX = _getMinMaxOfArray4$[0],
        maxX = _getMinMaxOfArray4$[1],
        _getMinMaxOfArray4$2 = _slicedToArray(_getMinMaxOfArray4[1], 2),
        minY = _getMinMaxOfArray4$2[0],
        maxY = _getMinMaxOfArray4$2[1];
      var _getMinMaxOfArray5 = getMinMaxOfArray(nextVertices),
        _getMinMaxOfArray6 = _slicedToArray(_getMinMaxOfArray5, 2),
        _getMinMaxOfArray6$ = _slicedToArray(_getMinMaxOfArray6[0], 2),
        elMinX = _getMinMaxOfArray6$[0],
        elMaxX = _getMinMaxOfArray6$[1],
        _getMinMaxOfArray6$2 = _slicedToArray(_getMinMaxOfArray6[1], 2),
        elMinY = _getMinMaxOfArray6$2[0],
        elMaxY = _getMinMaxOfArray6$2[1];
      var getXDir = function getXDir() {
        switch (true) {
          case /[l]/.test(direction):
            return minX - elMinX;
          case /[r]/.test(direction):
            return maxX - elMaxX;
          case /[h]/.test(direction):
            return (maxX + minX) / 2 - (elMaxX + elMinX) / 2;
          default:
            return 0;
        }
      };
      var getYDir = function getYDir() {
        switch (true) {
          case /[t]/.test(direction):
            return minY - elMinY;
          case /[b]/.test(direction):
            return maxY - elMaxY;
          case /[v]/.test(direction):
            return (maxY + minY) / 2 - (elMaxY + elMinY) / 2;
          default:
            return 0;
        }
      };
      elements.map(function (element) {
        var parentMatrix = getTransformToElement(element.parentNode, container);
        parentMatrix.e = parentMatrix.f = 0;
        var _pointTo11 = pointTo(parentMatrix.inverse(), getXDir(), getYDir()),
          x = _pointTo11.x,
          y = _pointTo11.y;
        var moveElementMtrx = createTranslateMatrix(x, y).multiply(getTransformToElement(element, element.parentNode));
        _this3.updateElementView(element, ['transform', moveElementMtrx]);
      });
      this.fitControlsToSize();
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      var elements = this.elements,
        _this$options14 = this.options,
        isGrouped = _this$options14.isGrouped,
        container = _this$options14.container;
      var _this$getBBox3 = this.getBBox(),
        x = _this$getBBox3.x,
        y = _this$getBBox3.y,
        width = _this$getBBox3.width,
        height = _this$getBBox3.height;
      var vertices = {
        tl: [x, y],
        tr: [x + width, y],
        bl: [x, y + height],
        br: [x + width, y + height]
      };
      var nextTransform = isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container);
      var _entries$reduce = entries(vertices).reduce(function (nextRes, _ref47) {
          var _ref48 = _slicedToArray(_ref47, 2),
            key = _ref48[0],
            _ref48$ = _slicedToArray(_ref48[1], 2),
            x = _ref48$[0],
            y = _ref48$[1];
          nextRes[key] = pointTo(nextTransform, x, y);
          return nextRes;
        }, {}),
        tl = _entries$reduce.tl,
        br = _entries$reduce.br,
        tr = _entries$reduce.tr;
      return {
        x: floatToFixed(tl.x),
        y: floatToFixed(tl.y),
        width: floatToFixed(Math.sqrt(Math.pow(tl.x - tr.x, 2) + Math.pow(tl.y - tr.y, 2))),
        height: floatToFixed(Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2))),
        rotation: floatToFixed(Math.atan2(tr.y - tl.y, tr.x - tl.x) * DEG)
      };
    }
  }]);
}(Transformable);
var applyTranslate = function applyTranslate(element, _ref49) {
  var x = _ref49.x,
    y = _ref49.y;
  var attrs = [];
  switch (element.tagName.toLowerCase()) {
    case 'text':
      {
        var el = element;
        var resX = isDef(el.x.baseVal[0]) ? el.x.baseVal[0].value + x : (Number(element.getAttribute('x')) || 0) + x;
        var resY = isDef(el.y.baseVal[0]) ? el.y.baseVal[0].value + y : (Number(element.getAttribute('y')) || 0) + y;
        attrs.push(['x', resX], ['y', resY]);
        break;
      }
    case 'foreignobject':
    case 'use':
    case 'image':
    case 'rect':
      {
        var _el = element;
        var _resX = isDef(_el.x.baseVal.value) ? _el.x.baseVal.value + x : (Number(element.getAttribute('x')) || 0) + x;
        var _resY = isDef(_el.y.baseVal.value) ? _el.y.baseVal.value + y : (Number(element.getAttribute('y')) || 0) + y;
        attrs.push(['x', _resX], ['y', _resY]);
        break;
      }
    case 'circle':
    case 'ellipse':
      {
        var _el2 = element;
        var _resX2 = _el2.cx.baseVal.value + x,
          _resY2 = _el2.cy.baseVal.value + y;
        attrs.push(['cx', _resX2], ['cy', _resY2]);
        break;
      }
    case 'line':
      {
        var _el3 = element;
        var resX1 = _el3.x1.baseVal.value + x,
          resY1 = _el3.y1.baseVal.value + y,
          resX2 = _el3.x2.baseVal.value + x,
          resY2 = _el3.y2.baseVal.value + y;
        attrs.push(['x1', resX1], ['y1', resY1], ['x2', resX2], ['y2', resY2]);
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        var points = parsePoints(element.getAttribute('points'));
        var result = points.map(function (item) {
          item[0] = String(Number(item[0]) + x);
          item[1] = String(Number(item[1]) + y);
          return item.join(' ');
        }).join(' ');
        attrs.push(['points', result]);
        break;
      }
    case 'path':
      {
        var path = element.getAttribute('d');
        attrs.push(['d', movePath({
          path: path,
          dx: x,
          dy: y
        })]);
        break;
      }
  }
  attrs.forEach(function (_ref50) {
    var _ref51 = _slicedToArray(_ref50, 2),
      name = _ref51[0],
      value = _ref51[1];
    return element.setAttribute(name, String(value));
  });
};
var applyResize = function applyResize(element, data) {
  var scaleX = data.scaleX,
    scaleY = data.scaleY,
    localCTM = data.localCTM,
    _data$bBox = data.bBox,
    boxW = _data$bBox.width,
    boxH = _data$bBox.height,
    __data__ = data.__data__,
    transformMatrix = data.transformMatrix,
    isGrouped = data.isGrouped;
  var attrs = [];
  var storedData = __data__.get(element);
  switch (element.tagName.toLowerCase()) {
    case 'text':
    case 'tspan':
      {
        var x = storedData.x,
          y = storedData.y,
          textLength = storedData.textLength;
        var _pointTo12 = pointTo(localCTM, x, y),
          resX = _pointTo12.x,
          resY = _pointTo12.y;
        attrs.push(['x', resX + (scaleX < 0 ? boxW : 0)], ['y', resY - (scaleY < 0 ? boxH : 0)], ['textLength', Math.abs(scaleX * textLength)]);
        break;
      }
    case 'circle':
      {
        var r = storedData.r,
          cx = storedData.cx,
          cy = storedData.cy,
          newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
        var _pointTo13 = pointTo(localCTM, cx, cy),
          _resX3 = _pointTo13.x,
          _resY3 = _pointTo13.y;
        attrs.push(['r', newR], ['cx', _resX3], ['cy', _resY3]);
        break;
      }
    case 'foreignobject':
    case 'image':
    case 'rect':
      {
        if (!isGrouped) {
          var width = storedData.width,
            height = storedData.height,
            _x5 = storedData.x,
            _y5 = storedData.y;
          var _pointTo14 = pointTo(localCTM, _x5, _y5),
            _resX4 = _pointTo14.x,
            _resY4 = _pointTo14.y;
          var newWidth = Math.abs(width * scaleX),
            newHeight = Math.abs(height * scaleY);
          attrs.push(['x', _resX4 - (scaleX < 0 ? newWidth : 0)], ['y', _resY4 - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
        } else {
          var matrix = storedData.matrix,
            childCTM = storedData.childCTM;
          var local = childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
          var nextResult = matrix.multiply(local);
          // TODO: need to find how to resize rect within elements group but not to scale
          attrs.push(['transform', matrixToString(nextResult)]);
        }
        break;
      }
    case 'ellipse':
      {
        var rx = storedData.rx,
          ry = storedData.ry,
          _cx = storedData.cx,
          _cy = storedData.cy;
        var _pointTo15 = pointTo(localCTM, _cx, _cy),
          cx1 = _pointTo15.x,
          cy1 = _pointTo15.y;
        var scaleMatrix = createSVGMatrix();
        scaleMatrix.a = scaleX;
        scaleMatrix.d = scaleY;
        var _pointTo16 = pointTo(scaleMatrix, rx, ry),
          nRx = _pointTo16.x,
          nRy = _pointTo16.y;
        attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
        break;
      }
    case 'line':
      {
        var resX1 = storedData.resX1,
          resY1 = storedData.resY1,
          resX2 = storedData.resX2,
          resY2 = storedData.resY2;
        var _pointTo17 = pointTo(localCTM, resX1, resY1),
          resX1_ = _pointTo17.x,
          resY1_ = _pointTo17.y;
        var _pointTo18 = pointTo(localCTM, resX2, resY2),
          resX2_ = _pointTo18.x,
          resY2_ = _pointTo18.y;
        attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        var points = storedData.points;
        var result = parsePoints(points).map(function (item) {
          var _pointTo19 = pointTo(localCTM, Number(item[0]), Number(item[1])),
            x = _pointTo19.x,
            y = _pointTo19.y;
          item[0] = String(floatToFixed(x));
          item[1] = String(floatToFixed(y));
          return item.join(' ');
        }).join(' ');
        attrs.push(['points', result]);
        break;
      }
    case 'path':
      {
        var path = storedData.path;
        attrs.push(['d', resizePath({
          path: path,
          localCTM: localCTM
        })]);
        break;
      }
  }
  attrs.forEach(function (_ref52) {
    var _ref53 = _slicedToArray(_ref52, 2),
      name = _ref53[0],
      value = _ref53[1];
    return element.setAttribute(name, String(value));
  });
};
var createHandler = function createHandler(left, top, color, key) {
  var handler = createSVGElement('circle', ['sjx-svg-hdl', "sjx-svg-hdl-".concat(key)]);
  var attrs = {
    cx: left,
    cy: top,
    r: 4,
    fill: '#fff',
    stroke: color,
    'stroke-width': 1,
    'fill-opacity': 1,
    'vector-effect': 'non-scaling-stroke'
  };
  entries(attrs).forEach(function (_ref54) {
    var _ref55 = _slicedToArray(_ref54, 2),
      attr = _ref55[0],
      value = _ref55[1];
    return handler.setAttribute(attr, String(value));
  });
  return handler;
};
var readCorners = function readCorners(top, bottom) {
  if (!top || !bottom) return null;
  var point = function point(line, n) {
    return {
      x: Number(line.getAttribute("x".concat(n))) || 0,
      y: Number(line.getAttribute("y".concat(n))) || 0
    };
  };
  return {
    tl: point(top, 1),
    tr: point(top, 2),
    bl: point(bottom, 1),
    br: point(bottom, 2)
  };
};
var createHitArea = function createHitArea(key) {
  var area = createSVGElement('path', ['sjx-svg-hit', "sjx-svg-hit-".concat(key), EDGE_KEYS.includes(key) ? 'sjx-svg-hit-edge' : 'sjx-svg-hit-handle']);
  area.setAttribute('data-sjx-handle', key);
  area.setAttribute('fill', 'transparent');
  return area;
};
var setLineStyle = function setLineStyle(line, color) {
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-dasharray', '3 3');
  line.setAttribute('vector-effect', 'non-scaling-stroke');
};
var storeElementAttributes = function storeElementAttributes(element, storage, container, isGrouped) {
  var data = null;
  switch (element.tagName.toLowerCase()) {
    case 'text':
      {
        var el = element;
        var x = isDef(el.x.baseVal[0]) ? el.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
        var y = isDef(el.y.baseVal[0]) ? el.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
        var textLength = isDef(el.textLength.baseVal) ? el.textLength.baseVal.value : Number(element.getAttribute('textLength')) || null;
        data = {
          x: x,
          y: y,
          textLength: textLength
        };
        break;
      }
    case 'circle':
      {
        var _el4 = element;
        var r = _el4.r.baseVal.value,
          cx = _el4.cx.baseVal.value,
          cy = _el4.cy.baseVal.value;
        data = {
          r: r,
          cx: cx,
          cy: cy
        };
        break;
      }
    case 'foreignobject':
    case 'image':
    case 'rect':
      {
        var _el5 = element;
        var width = _el5.width.baseVal.value,
          height = _el5.height.baseVal.value,
          _x6 = _el5.x.baseVal.value,
          _y6 = _el5.y.baseVal.value;
        data = {
          width: width,
          height: height,
          x: _x6,
          y: _y6
        };
        break;
      }
    case 'ellipse':
      {
        var _el6 = element;
        var rx = _el6.rx.baseVal.value,
          ry = _el6.ry.baseVal.value,
          _cx2 = _el6.cx.baseVal.value,
          _cy2 = _el6.cy.baseVal.value;
        data = {
          rx: rx,
          ry: ry,
          cx: _cx2,
          cy: _cy2
        };
        break;
      }
    case 'line':
      {
        var _el7 = element;
        var resX1 = _el7.x1.baseVal.value,
          resY1 = _el7.y1.baseVal.value,
          resX2 = _el7.x2.baseVal.value,
          resY2 = _el7.y2.baseVal.value;
        data = {
          resX1: resX1,
          resY1: resY1,
          resX2: resX2,
          resY2: resY2
        };
        break;
      }
    case 'polygon':
    case 'polyline':
      {
        var points = element.getAttribute('points');
        data = {
          points: points
        };
        break;
      }
    case 'path':
      {
        var path = element.getAttribute('d');
        data = {
          path: path
        };
        break;
      }
  }
  storage.__data__.set(element, _objectSpread2(_objectSpread2({}, data), {}, {
    matrix: getTransformToElement(element, element.parentNode),
    ctm: getTransformToElement(element.parentNode, container),
    childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
  }));
};
var renderLine = function renderLine(_ref56, color, key) {
  var _ref57 = _slicedToArray(_ref56, 2),
    b = _ref57[0],
    e = _ref57[1];
  var handler = createSVGElement('line', ['sjx-svg-line', "sjx-svg-line-".concat(key)]);
  var attrs = {
    x1: b.x,
    y1: b.y,
    x2: e.x,
    y2: e.y,
    stroke: color,
    'stroke-width': 1,
    'vector-effect': 'non-scaling-stroke'
  };
  entries(attrs).forEach(function (_ref58) {
    var _ref59 = _slicedToArray(_ref58, 2),
      attr = _ref59[0],
      value = _ref59[1];
    return handler.setAttribute(attr, String(value));
  });
  return handler;
};
var _getBoundingRect = function _getBoundingRect(element, ctm) {
  var bBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : element.getBBox();
  var x = bBox.x,
    y = bBox.y,
    width = bBox.width,
    height = bBox.height;
  var vertices = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
  return vertices.map(function (_ref60) {
    var _ref61 = _slicedToArray(_ref60, 2),
      l = _ref61[0],
      t = _ref61[1];
    var _pointTo20 = pointTo(ctm, l, t),
      nx = _pointTo20.x,
      ny = _pointTo20.y;
    return [nx, ny];
  });
};

// factory method for creating draggable elements
function drag(options, obInstance) {
  if (this.length) {
    var Ob = isDef(obInstance) && obInstance instanceof Observable ? obInstance : new Observable();
    if (this[0] instanceof SVGElement) {
      var items = [];
      forEach.call(this, function (item) {
        if (checkElement(item)) {
          items.push(item);
        }
      });
      return new DraggableSVG(items, options, Ob);
    } else {
      return new Draggable(arrMap.call(this, function (_) {
        return _;
      }), options, Ob);
    }
  }
}

var EMITTER_EVENTS = EVENT_EMITTER_CONSTANTS.EMITTER_EVENTS;
var E_MOUSEDOWN = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
  E_TOUCHSTART = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
var Cloneable = /*#__PURE__*/function (_SubjectModel) {
  function Cloneable(elements, options) {
    var _this;
    _classCallCheck(this, Cloneable);
    _this = _callSuper(this, Cloneable, [elements]);
    _this.enable(options);
    return _this;
  }

  /** @internal */
  _inherits(Cloneable, _SubjectModel);
  return _createClass(Cloneable, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      var elements = this.elements,
        options = this.options;
      var style = options.style,
        appendTo = options.appendTo;
      var nextStyle = _objectSpread2({
        position: 'absolute',
        'z-index': '2147483647'
      }, style);
      var data = new WeakMap();
      elements.map(function (element) {
        return data.set(element, {
          parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
        });
      });
      this.storage = {
        style: nextStyle,
        data: data
      };
      helper(elements).on(E_MOUSEDOWN, this.onMouseDown).on(E_TOUCHSTART, this.onTouchStart);
      EMITTER_EVENTS.slice(0, 3).forEach(function (eventName) {
        return _this2.eventDispatcher.registerEvent(eventName);
      });
    }

    /** @internal */
  }, {
    key: "processOptions",
    value: function processOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$style = options.style,
        style = _options$style === void 0 ? {} : _options$style,
        _options$appendTo = options.appendTo,
        appendTo = _options$appendTo === void 0 ? null : _options$appendTo,
        _options$stack = options.stack,
        stack = _options$stack === void 0 ? document.body : _options$stack,
        _options$onInit = options.onInit,
        onInit = _options$onInit === void 0 ? noop : _options$onInit,
        _options$onMove = options.onMove,
        onMove = _options$onMove === void 0 ? noop : _options$onMove,
        _options$onDrop = options.onDrop,
        onDrop = _options$onDrop === void 0 ? noop : _options$onDrop,
        _options$onDestroy = options.onDestroy,
        onDestroy = _options$onDestroy === void 0 ? noop : _options$onDestroy;
      var dropable = helper(stack)[0];
      var _onDrop = isFunc(onDrop) ? function (evt) {
        var _ref = this.storage,
          clone = _ref.clone;
        var isCollide = objectsCollide(clone, dropable);
        if (isCollide) {
          onDrop.call(this, evt, this.elements, clone);
        }
      } : noop;
      this.options = {
        style: style,
        appendTo: appendTo,
        stack: stack
      };
      this.proxyMethods = {
        onInit: createMethod(onInit),
        onDrop: _onDrop,
        onMove: createMethod(onMove),
        onDestroy: createMethod(onDestroy)
      };
    }

    /** @internal */
  }, {
    key: "start",
    value: function start(_ref2) {
      var target = _ref2.target,
        clientX = _ref2.clientX,
        clientY = _ref2.clientY;
      var elements = this.elements;
      var storage = this.storage;
      var data = storage.data,
        style = storage.style;
      var element = elements.find(function (el) {
        return el === target || el.contains(target);
      });
      if (!element) return;
      var _ref3 = data.get(element) || {},
        _ref3$parent = _ref3.parent,
        parent = _ref3$parent === void 0 ? element.parentNode : _ref3$parent;
      var _getOffset = getOffset(parent),
        left = _getOffset.left,
        top = _getOffset.top;
      style.left = "".concat(clientX - left, "px");
      style.top = "".concat(clientY - top, "px");
      var clone = element.cloneNode(true);
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
  }, {
    key: "moving",
    value: function moving(_ref4) {
      var clientX = _ref4.clientX,
        clientY = _ref4.clientY;
      var storage = this.storage;
      storage.clientX = clientX;
      storage.clientY = clientY;
      storage.doDraw = true;
      storage.doMove = true;
    }

    /** @internal */
  }, {
    key: "end",
    value: function end(e) {
      var storage = this.storage;
      var clone = storage.clone,
        frameId = storage.frameId;
      storage.doDraw = false;
      cancelAnimFrame(frameId);
      if (isUndef(clone)) return;
      this.proxyMethods.onDrop.call(this, e);
      clone.parentNode.removeChild(clone);
      delete storage.clone;
    }

    /** @internal */
  }, {
    key: "animate",
    value: function animate() {
      var storage = this.storage;
      storage.frameId = requestAnimFrame(this.animate);
      var _ref5 = storage,
        doDraw = _ref5.doDraw,
        clientX = _ref5.clientX,
        clientY = _ref5.clientY,
        cx = _ref5.cx,
        cy = _ref5.cy,
        clone = _ref5.clone;
      if (!doDraw) return;
      storage.doDraw = false;
      this.drag({
        element: clone,
        dx: clientX - cx,
        dy: clientY - cy
      });
    }

    /** @internal */
  }, {
    key: "processMove",
    value: function processMove(_, _ref6) {
      var dx = _ref6.dx,
        dy = _ref6.dy;
      var _ref7 = this.storage,
        clone = _ref7.clone;
      var transformCommand = "translate(".concat(dx, "px, ").concat(dy, "px)");
      helper(clone).css({
        transform: transformCommand,
        webkitTranform: transformCommand,
        mozTransform: transformCommand,
        msTransform: transformCommand,
        otransform: transformCommand
      });
    }

    /** @internal */
  }, {
    key: "destroy",
    value: function destroy() {
      var storage = this.storage,
        proxyMethods = this.proxyMethods,
        elements = this.elements;
      if (isUndef(storage)) return;
      helper(elements).off(E_MOUSEDOWN, this.onMouseDown).off(E_TOUCHSTART, this.onTouchStart);
      proxyMethods.onDestroy.call(this, elements);
      delete this.storage;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.destroy();
    }
  }]);
}(SubjectModel);

function clone(options) {
  if (this.length) {
    return new Cloneable(arrMap.call(this, function (_) {
      return _;
    }), options);
  }
}

var Subjx = /*#__PURE__*/function (_Helper) {
  function Subjx() {
    _classCallCheck(this, Subjx);
    return _callSuper(this, Subjx, arguments);
  }
  _inherits(Subjx, _Helper);
  return _createClass(Subjx, [{
    key: "drag",
    value: function drag$1(options, obInstance) {
      return drag.call(this, options, obInstance);
    }
  }, {
    key: "clone",
    value: function clone$1(options) {
      return clone.call(this, options);
    }
  }]);
}(Helper);

function subjx(params) {
  return new Subjx(params);
}
var createObservable = function createObservable() {
  return new Observable();
};
var api = Object.assign(subjx, {
  createObservable: createObservable,
  Subjx: Subjx,
  Observable: Observable,
  matrix: matrix,
  svgMatrix: svgMatrix,
  common: common
});

exports.Observable = Observable;
exports.common = common;
exports.createObservable = createObservable;
exports.default = api;
exports.matrix = matrix;
exports.svgMatrix = svgMatrix;
