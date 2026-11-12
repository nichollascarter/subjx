/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2025
* Karen Sarksyan
* nichollascarter@gmail.com
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.subjx = factory());
})(this, (function () { 'use strict';

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
    return ("string" === r ? String : Number)(t);
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

  var requestAnimFrame = function requestAnimFrame(callback) {
    return typeof requestAnimationFrame === 'function' ? requestAnimationFrame(callback) : setTimeout(callback, 1000 / 60);
  };
  var cancelAnimFrame = function cancelAnimFrame(requestID) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(requestID);
    } else {
      clearTimeout(requestID);
    }
  };
  var _Array$prototype = Array.prototype,
    forEach = _Array$prototype.forEach,
    arrMap = _Array$prototype.map;
  var _console = console,
    warn = _console.warn;
  var noop = function noop(_) {
    return _;
  };
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
  var E_MOUSEOVER$1 = 'mouseover';
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
    E_TOUCHMOVE: E_TOUCHMOVE$2,
    E_MOUSEOVER: E_MOUSEOVER$1
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
  var handlers = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, ON_GETSTATE$1, function (observer, data) {
    return observer.notifyGetState(data);
  }), ON_APPLY$1, function (observer, data) {
    return observer.notifyApply(data);
  }), ON_MOVE$1, function (observer, data) {
    return observer.notifyMove(data);
  }), ON_RESIZE$1, function (observer, data) {
    return observer.notifyResize(data);
  }), ON_ROTATE$1, function (observer, data) {
    return observer.notifyRotate(data);
  });
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
          if (index !== -1) obs[eventName].splice(index, 1);
        }
        return this;
      }
    }, {
      key: "notify",
      value: function notify(eventName, source, data) {
        var observers = this.observers[eventName];
        var handler = handlers[eventName];
        if (isUndef(observers) || isUndef(handler)) return;
        observers.forEach(function (observer) {
          if (source !== observer) handler(observer, data);
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
    /** Internal state. Its shape is not part of the public API and may change in any minor release. */

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
        this.afterInit();
        this.proxyMethods.onInit.call(this, this.elements);
      }

      /** @internal */
    }, {
      key: "afterInit",
      value: function afterInit() {}
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
        if (e.button !== 0) return;
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
  var limitSize = function limitSize(value, min, flip) {
    if (!flip) return Math.max(value, min);
    return Math.abs(value) < min ? value < 0 ? -min : min : value;
  };
  var resizeBox = function resizeBox(_ref) {
    var width = _ref.width,
      height = _ref.height,
      dx = _ref.dx,
      dy = _ref.dy,
      doW = _ref.doW,
      doH = _ref.doH,
      proportions = _ref.proportions,
      flip = _ref.flip;
    var baseWidth = Math.max(1, width),
      baseHeight = Math.max(1, height);
    var minWidth = Math.min(MIN_SIZE, baseWidth),
      minHeight = Math.min(MIN_SIZE, baseHeight);
    var newWidth, newHeight;
    if (proportions) {
      var ratio = limitSize(doW || !doH ? (baseWidth + dx) / baseWidth : (baseHeight + dy) / baseHeight, Math.max(minWidth / baseWidth, minHeight / baseHeight), flip);
      newWidth = baseWidth * ratio;
      newHeight = baseHeight * ratio;
    } else {
      newWidth = limitSize(baseWidth + dx, minWidth, flip);
      newHeight = limitSize(baseHeight + dy, minHeight, flip);
    }
    return [newWidth / baseWidth, newHeight / baseHeight, newWidth, newHeight];
  };
  var ROTATOR_ANCHORS = {
    n: 'tc',
    s: 'bc',
    w: 'ml',
    e: 'mr'
  };
  var rotatorPlacement = function rotatorPlacement(vertices, rotatorAnchor, rotatorOffset) {
    var tl = vertices.tl,
      tr = vertices.tr,
      bl = vertices.bl;
    var _vertices = vertices[rotatorAnchor && ROTATOR_ANCHORS[rotatorAnchor] || 'mr'],
      x = _vertices.x,
      y = _vertices.y;
    var factor = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;
    var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? rotatorAngle(bl.x - tl.x, bl.y - tl.y, tr.x - tl.x, tr.y - tl.y) : rotatorAngle(tl.x - tr.x, tl.y - tr.y, bl.x - tl.x, bl.y - tl.y);
    var offset = rotatorOffset * factor;
    return {
      anchor: {
        x: x,
        y: y
      },
      rotator: {
        x: x - offset * Math.cos(theta),
        y: y - offset * Math.sin(theta)
      }
    };
  };
  var axisOffset = function axisOffset(direction, rules) {
    var rule = rules.find(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 1),
        pattern = _ref3[0];
      return pattern.test(direction);
    });
    return rule ? rule[1] : 0;
  };
  var alignmentOffset = function alignmentOffset(direction, _ref4, _ref5) {
    var _ref6 = _slicedToArray(_ref4, 2),
      _ref6$ = _slicedToArray(_ref6[0], 2),
      minX = _ref6$[0],
      maxX = _ref6$[1],
      _ref6$2 = _slicedToArray(_ref6[1], 2),
      minY = _ref6$2[0],
      maxY = _ref6$2[1];
    var _ref7 = _slicedToArray(_ref5, 2),
      _ref7$ = _slicedToArray(_ref7[0], 2),
      elMinX = _ref7$[0],
      elMaxX = _ref7$[1],
      _ref7$2 = _slicedToArray(_ref7[1], 2),
      elMinY = _ref7$2[0],
      elMaxY = _ref7$2[1];
    return [axisOffset(direction, [[/[l]/, minX - elMinX], [/[r]/, maxX - elMaxX], [/[h]/, (maxX + minX) / 2 - (elMaxX + elMinX) / 2]]), axisOffset(direction, [[/[t]/, minY - elMinY], [/[b]/, maxY - elMaxY], [/[v]/, (maxY + minY) / 2 - (elMaxY + elMinY) / 2]])];
  };
  var boxVertices = function boxVertices(_ref8) {
    var x = _ref8.x,
      y = _ref8.y,
      width = _ref8.width,
      height = _ref8.height;
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
  };
  var edgeSegments = function edgeSegments(_ref9) {
    var tl = _ref9.tl,
      tr = _ref9.tr,
      bl = _ref9.bl,
      br = _ref9.br;
    return {
      te: [tl, tr],
      be: [bl, br],
      le: [tl, bl],
      re: [tr, br]
    };
  };

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
  var overflowPoint = function overflowPoint(points, bounds) {
    var _getMinMaxOfArray = getMinMaxOfArray(bounds),
      _getMinMaxOfArray2 = _slicedToArray(_getMinMaxOfArray, 2),
      _getMinMaxOfArray2$ = _slicedToArray(_getMinMaxOfArray2[0], 2),
      minX = _getMinMaxOfArray2$[0],
      maxX = _getMinMaxOfArray2$[1],
      _getMinMaxOfArray2$2 = _slicedToArray(_getMinMaxOfArray2[1], 2),
      minY = _getMinMaxOfArray2$2[0],
      maxY = _getMinMaxOfArray2$2[1];
    var x = null,
      y = null;
    for (var i = 0, len = points.length; i < len; i++) {
      var _points$i = _slicedToArray(points[i], 2),
        px = _points$i[0],
        py = _points$i[1];
      if (px < minX || px > maxX) x = px;
      if (py < minY || py > maxY) y = py;
    }
    return {
      x: x,
      y: y
    };
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
  var sumPx = function sumPx() {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }
    return values.reduce(function (sum, value) {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };
  var getLayoutSize = function getLayoutSize(el) {
    var offsetWidth = el.offsetWidth,
      offsetHeight = el.offsetHeight;
    var style = window.getComputedStyle(el);
    var isBorderBox = style.boxSizing === 'border-box';
    var width = parseFloat(style.width) + (isBorderBox ? 0 : sumPx(style.paddingLeft, style.paddingRight, style.borderLeftWidth, style.borderRightWidth));
    var height = parseFloat(style.height) + (isBorderBox ? 0 : sumPx(style.paddingTop, style.paddingBottom, style.borderTopWidth, style.borderBottomWidth));
    var isPrecise = function isPrecise(value, rounded) {
      return Number.isFinite(value) && Math.abs(value - rounded) < 1;
    };
    return {
      width: isPrecise(width, offsetWidth) ? width : offsetWidth,
      height: isPrecise(height, offsetHeight) ? height : offsetHeight
    };
  };

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
    E_TOUCHEND = CLIENT_EVENTS_CONSTANTS.E_TOUCHEND,
    E_MOUSEOVER = CLIENT_EVENTS_CONSTANTS.E_MOUSEOVER;
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

  var keys$2 = Object.keys;
  var RUNTIME_OPTIONS = ['axis', 'snap', 'each', 'proportions', 'flip', 'draggable', 'scalable', 'applyTranslate', 'guides', 'cursorMove', 'cursorResize', 'cursorRotate', 'custom', 'onInit', 'onMove', 'onResize', 'onRotate', 'onDrop', 'onDestroy'];
  var ORIGIN_OPTIONS = ['transformOrigin', 'container'];
  var isPlainObject = function isPlainObject(value) {
    return _typeof(value) === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
  };
  var isSameOption = function isSameOption(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every(function (item, index) {
        return item === b[index];
      });
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      var aKeys = keys$2(a);
      return aKeys.length === keys$2(b).length && aKeys.every(function (key) {
        return a[key] === b[key];
      });
    }
    return false;
  };
  var normalizeOptions = function normalizeOptions(options, elements) {
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
      cursorResize = _options$cursorResize === void 0 ? null : _options$cursorResize,
      _options$cursorRotate = options.cursorRotate,
      cursorRotate = _options$cursorRotate === void 0 ? null : _options$cursorRotate,
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
      _options$container = options.container,
      container = _options$container === void 0 ? elements[0].parentNode : _options$container,
      _options$controlsCont = options.controlsContainer,
      controlsContainer = _options$controlsCont === void 0 ? container : _options$controlsCont,
      _options$proportions = options.proportions,
      proportions = _options$proportions === void 0 ? false : _options$proportions,
      _options$flip = options.flip,
      flip = _options$flip === void 0 ? true : _options$flip,
      _options$rotatorAncho = options.rotatorAnchor,
      rotatorAnchor = _options$rotatorAncho === void 0 ? null : _options$rotatorAncho,
      _options$rotatorOffse = options.rotatorOffset,
      rotatorOffset = _options$rotatorOffse === void 0 ? 50 : _options$rotatorOffse,
      _options$showNormal = options.showNormal,
      showNormal = _options$showNormal === void 0 ? true : _options$showNormal,
      custom = options.custom;
    var snap = _objectSpread2({
      x: 0,
      y: 0,
      angle: 0
    }, snapOptions);
    return {
      axis: axis,
      cursorMove: cursorMove,
      cursorRotate: cursorRotate,
      cursorResize: cursorResize,
      transformOrigin: transformOrigin,
      restrict: restrict ? helper(restrict)[0] || document.body : null,
      container: helper(container)[0],
      controlsContainer: helper(controlsContainer)[0],
      snap: _objectSpread2(_objectSpread2({}, snap), {}, {
        angle: snap.angle * RAD
      }),
      each: each,
      proportions: proportions,
      flip: flip,
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
  };
  var proxyMethodsOf = function proxyMethodsOf(_ref) {
    var _ref$onInit = _ref.onInit,
      onInit = _ref$onInit === void 0 ? noop : _ref$onInit,
      _ref$onDrop = _ref.onDrop,
      onDrop = _ref$onDrop === void 0 ? noop : _ref$onDrop,
      _ref$onMove = _ref.onMove,
      onMove = _ref$onMove === void 0 ? noop : _ref$onMove,
      _ref$onResize = _ref.onResize,
      onResize = _ref$onResize === void 0 ? noop : _ref$onResize,
      _ref$onRotate = _ref.onRotate,
      onRotate = _ref$onRotate === void 0 ? noop : _ref$onRotate,
      _ref$onDestroy = _ref.onDestroy,
      onDestroy = _ref$onDestroy === void 0 ? noop : _ref$onDestroy;
    return {
      onInit: createMethod(onInit),
      onDrop: createMethod(onDrop),
      onMove: createMethod(onMove),
      onResize: createMethod(onResize),
      onRotate: createMethod(onRotate),
      onDestroy: createMethod(onDestroy)
    };
  };

  var syncTransform = function syncTransform(target, source) {
    var value = source.getAttribute('transform');
    if (value === null) {
      target.removeAttribute('transform');
    } else {
      target.setAttribute('transform', value);
    }
    var targetStyle = target.style;
    var sourceStyle = source.style;
    if (targetStyle && sourceStyle) targetStyle.transform = sourceStyle.transform;
  };
  var readClasses = function readClasses(_ref) {
    var wrapper = _ref.wrapper,
      controls = _ref.controls;
    return {
      wrapper: Array.from(wrapper.classList),
      controls: Array.from(controls.classList)
    };
  };
  var adoptControls = function adoptControls(target, fresh, previous) {
    var wrapper = target.wrapper,
      controls = target.controls;
    var firstForeign = controls.firstChild;
    while (fresh.controls.firstChild) {
      controls.insertBefore(fresh.controls.firstChild, firstForeign);
    }
    Array.from(fresh.wrapper.childNodes).filter(function (node) {
      return node !== fresh.controls;
    }).forEach(function (node) {
      return wrapper.insertBefore(node, controls);
    });
    [[wrapper, fresh.wrapper, previous === null || previous === void 0 ? void 0 : previous.wrapper], [controls, fresh.controls, previous === null || previous === void 0 ? void 0 : previous.controls]].forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 3),
        node = _ref3[0],
        source = _ref3[1],
        _ref3$ = _ref3[2],
        classes = _ref3$ === void 0 ? [] : _ref3$;
      classes.forEach(function (name) {
        return removeClass(node, name);
      });
      Array.from(source.classList).forEach(function (name) {
        return addClass(node, name);
      });
      syncTransform(node, source);
    });
    var parent = fresh.wrapper.parentNode;
    if (wrapper.parentNode !== parent) parent.insertBefore(wrapper, fresh.wrapper);
    parent.removeChild(fresh.wrapper);
  };

  var RESIZE_CURSORS = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'];
  var SECTOR = Math.PI / 4;
  var RESIZE_KEYS = [TOP_LEFT, TOP_CENTER, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM_CENTER, MIDDLE_LEFT, MIDDLE_RIGHT, TOP_EDGE, BOTTOM_EDGE, LEFT_EDGE, RIGHT_EDGE];
  var POINT_KEYS = [START_POINT$1, END_POINT$1];
  var POINT_CURSOR = 'crosshair';
  var ROTATE_CURSOR = 'grabbing';
  var screenCenter = function screenCenter(element) {
    var _element$getBoundingC = element.getBoundingClientRect(),
      left = _element$getBoundingC.left,
      top = _element$getBoundingC.top,
      width = _element$getBoundingC.width,
      height = _element$getBoundingC.height;
    return [left + width / 2, top + height / 2];
  };
  var cursorFromAngle = function cursorFromAngle(radians) {
    return RESIZE_CURSORS[(Math.round(radians / SECTOR) % 4 + 4) % 4];
  };
  var resizeCursor = function resizeCursor(handles, key) {
    var top = handles[TOP_EDGE],
      bottom = handles[BOTTOM_EDGE],
      handle = handles[key];
    if (!top || !bottom || !handle) return null;
    var _screenCenter = screenCenter(top),
      _screenCenter2 = _slicedToArray(_screenCenter, 2),
      tx = _screenCenter2[0],
      ty = _screenCenter2[1];
    var _screenCenter3 = screenCenter(bottom),
      _screenCenter4 = _slicedToArray(_screenCenter3, 2),
      bx = _screenCenter4[0],
      by = _screenCenter4[1];
    var _screenCenter5 = screenCenter(handle),
      _screenCenter6 = _slicedToArray(_screenCenter5, 2),
      hx = _screenCenter6[0],
      hy = _screenCenter6[1];
    return cursorFromAngle(Math.atan2(hy - (ty + by) / 2, hx - (tx + bx) / 2));
  };
  var handleCursor = function handleCursor(handles, key) {
    if (!key) return null;
    if (POINT_KEYS.includes(key)) return POINT_CURSOR;
    if (RESIZE_KEYS.includes(key)) return resizeCursor(handles, key);
    return null;
  };

  var keys$1 = Object.keys;
  var REVERSE_X = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, TOP_CENTER, LEFT_EDGE];
  var REVERSE_Y = [TOP_LEFT, TOP_RIGHT, TOP_CENTER, MIDDLE_LEFT, TOP_EDGE];
  var ON_TOP = [TOP_CENTER, TOP_RIGHT, TOP_LEFT, TOP_EDGE];
  var ON_LEFT = [TOP_LEFT, MIDDLE_LEFT, BOTTOM_LEFT, LEFT_EDGE];
  var ON_RIGHT = [TOP_RIGHT, MIDDLE_RIGHT, BOTTOM_RIGHT, RIGHT_EDGE];
  var ON_BOTTOM = [BOTTOM_RIGHT, BOTTOM_CENTER, BOTTOM_LEFT, BOTTOM_EDGE];
  var WIDTH_ONLY = [MIDDLE_LEFT, MIDDLE_RIGHT, LEFT_EDGE, RIGHT_EDGE];
  var HEIGHT_ONLY = [TOP_CENTER, BOTTOM_CENTER, BOTTOM_EDGE, TOP_EDGE];
  var POINTS = [START_POINT$1, END_POINT$1];
  var RESIZE_X = [MIDDLE_LEFT, MIDDLE_RIGHT, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, LEFT_EDGE, RIGHT_EDGE];
  var RESIZE_Y = [BOTTOM_RIGHT, BOTTOM_LEFT, BOTTOM_CENTER, TOP_RIGHT, TOP_LEFT, TOP_CENTER, TOP_EDGE, BOTTOM_EDGE];
  var matcher = function matcher(handle, handles) {
    var isHandle = function isHandle(key) {
      var hdl = handles[key];
      return isDef(hdl) ? handle.is(hdl) : false;
    };
    return {
      isHandle: isHandle,
      some: function some(items) {
        return items.some(isHandle);
      }
    };
  };
  var handleKey = function handleKey(handles, handle) {
    var _keys$find;
    return (_keys$find = keys$1(handles).find(function (key) {
      return handles[key] === handle;
    })) !== null && _keys$find !== void 0 ? _keys$find : null;
  };
  var handleFlags = function handleFlags(handle, handles) {
    var _matcher = matcher(handle, handles),
      isHandle = _matcher.isHandle,
      some = _matcher.some;
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
  var resizeAxes = function resizeAxes(handle, handles) {
    var _matcher2 = matcher(handle, handles),
      some = _matcher2.some;
    return {
      x: some(RESIZE_X),
      y: some(RESIZE_Y)
    };
  };

  var START_EVENTS = _defineProperty(_defineProperty(_defineProperty({}, E_RESIZE$1, E_RESIZE_START), E_ROTATE$1, E_ROTATE_START), E_DRAG$1, E_DRAG_START);
  var END_EVENTS = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, E_RESIZE$1, E_RESIZE_END), E_ROTATE$1, E_ROTATE_END), E_DRAG$1, E_DRAG_END), E_SET_POINT, E_SET_POINT_END);
  var actionOf = function actionOf(_ref) {
    var doResize = _ref.doResize,
      doDrag = _ref.doDrag,
      doRotate = _ref.doRotate,
      doSetCenter = _ref.doSetCenter;
    if (doResize) return E_RESIZE$1;
    if (doDrag) return E_DRAG$1;
    if (doRotate) return E_ROTATE$1;
    if (doSetCenter) return E_SET_POINT;
    return E_DRAG$1;
  };
  var isMimicked = function isMimicked(_ref2, _ref3) {
    var doResize = _ref2.doResize,
      doDrag = _ref2.doDrag,
      doRotate = _ref2.doRotate;
    var move = _ref3.move,
      resize = _ref3.resize,
      rotate = _ref3.rotate;
    return Boolean(doResize && resize || doRotate && rotate || doDrag && move);
  };
  var startEventOf = function startEventOf(action) {
    var _START_EVENTS$action;
    return (_START_EVENTS$action = START_EVENTS[action]) !== null && _START_EVENTS$action !== void 0 ? _START_EVENTS$action : null;
  };
  var endEventOf = function endEventOf(action) {
    var _END_EVENTS$action;
    return (_END_EVENTS$action = END_EVENTS[action]) !== null && _END_EVENTS$action !== void 0 ? _END_EVENTS$action : null;
  };

  var movingEdges = function movingEdges(_ref, _ref2) {
    var revX = _ref.revX,
      revY = _ref.revY;
    var flipX = _ref2.flipX,
      flipY = _ref2.flipY;
    return {
      leftMoves: Boolean(revX) !== Boolean(flipX),
      topMoves: Boolean(revY) !== Boolean(flipY)
    };
  };
  var room = function room(size) {
    return size - Math.min(MIN_SIZE, size);
  };
  var sizeLimit = function sizeLimit(_ref3, _ref4, _ref5, flip) {
    var left = _ref3.left,
      right = _ref3.right,
      top = _ref3.top,
      bottom = _ref3.bottom;
    var dox = _ref4.dox,
      doy = _ref4.doy;
    var leftMoves = _ref5.leftMoves,
      topMoves = _ref5.topMoves;
    return function (_ref6) {
      var dx = _ref6.dx,
        dy = _ref6.dy;
      if (flip) return {
        dx: dx,
        dy: dy
      };
      var width = room(right - left);
      var height = room(bottom - top);
      return {
        dx: !dox ? dx : leftMoves ? Math.min(dx, width) : Math.max(dx, -width),
        dy: !doy ? dy : topMoves ? Math.min(dy, height) : Math.max(dy, -height)
      };
    };
  };
  var alignResize = function alignResize(guides, session, proportions, delta) {
    var flip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    if (!guides || !guides.axisAligned) return null;
    var box = guides.box;
    var dox = session.dox,
      doy = session.doy,
      doW = session.doW,
      doH = session.doH;
    var moving = movingEdges(session, guides);
    var leftMoves = moving.leftMoves,
      topMoves = moving.topMoves;
    var widthLeads = doW || !doH;
    var limit = sizeLimit(box, session, moving, flip);
    var _limit = limit(delta),
      dx = _limit.dx,
      dy = _limit.dy;
    var run = function run(axes) {
      return alignEdges(guides, {
        x: dox ? leftMoves ? box.left : box.right : null,
        y: doy ? topMoves ? box.top : box.bottom : null
      }, function (nextDx, nextDy) {
        return {
          left: box.left + (dox && leftMoves ? nextDx : 0),
          right: box.right + (dox && !leftMoves ? nextDx : 0),
          top: box.top + (doy && topMoves ? nextDy : 0),
          bottom: box.bottom + (doy && !topMoves ? nextDy : 0)
        };
      }, dx, dy, axes);
    };
    var axes = {
      x: Boolean(dox) && (!proportions || widthLeads),
      y: Boolean(doy) && (!proportions || !widthLeads)
    };
    var aligned = run(axes);
    var bounded = limit(aligned);
    if (bounded.dx === aligned.dx && bounded.dy === aligned.dy) return aligned;
    return run({
      x: axes.x && bounded.dx === aligned.dx,
      y: axes.y && bounded.dy === aligned.dy
    });
  };
  var alignPoint = function alignPoint(guides, _ref7, proportions, _ref8) {
    var dox = _ref7.dox,
      doy = _ref7.doy;
    var dx = _ref8.dx,
      dy = _ref8.dy;
    if (!guides || !guides.point || proportions) return null;
    var _guides$point = guides.point,
      x = _guides$point.x,
      y = _guides$point.y;
    return alignEdges(guides, {
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
  };
  var clampResize = function clampResize(restriction, session, _ref9) {
    var dx = _ref9.dx,
      dy = _ref9.dy;
    if (!restriction || !restriction.axisAligned) return {
      dx: dx,
      dy: dy,
      clamped: false
    };
    var box = restriction.box,
      area = restriction.area;
    var dox = session.dox,
      doy = session.doy;
    var _movingEdges = movingEdges(session, restriction),
      leftMoves = _movingEdges.leftMoves,
      topMoves = _movingEdges.topMoves;
    return {
      dx: dox ? clampEdge(leftMoves ? box.left : box.right, area.left, area.right, dx) : dx,
      dy: doy ? clampEdge(topMoves ? box.top : box.bottom, area.top, area.bottom, dy) : dy,
      clamped: true
    };
  };
  var clampPoint = function clampPoint(restriction, _ref0) {
    var dx = _ref0.dx,
      dy = _ref0.dy;
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
  };

  var _excluded$2 = ["element", "radians"],
    _excluded2$2 = ["element", "dx", "dy"],
    _excluded3$2 = ["revX", "revY", "doW", "doH"],
    _excluded4$1 = ["transform"],
    _excluded5 = ["radians"],
    _excluded6 = ["clientX", "clientY", "actionName", "triggerEvent"];
  var keys = Object.keys,
    values$2 = Object.values;
  var NO_FLAGS = {
    revX: false,
    revY: false,
    doW: false,
    doH: false
  };
  var overflows = function overflows(_ref) {
    var x = _ref.x,
      y = _ref.y;
    return x !== null || y !== null;
  };
  var Transformable = /*#__PURE__*/function (_SubjectModel) {
    function Transformable(elements, options, observable) {
      var _this;
      _classCallCheck(this, Transformable);
      _this = _callSuper(this, Transformable, [elements]);
      /** Internal state. Its shape is not part of the public API and may change in any minor release. Prefer `handles`, `controls`, `getBoundingRect()` and `getDimensions()`. */
      /** @internal */
      _defineProperty(_this, "observer", {
        notifyMove: function notifyMove(data) {
          return _this.notifyMove(data);
        },
        notifyRotate: function notifyRotate(data) {
          return _this.notifyRotate(data);
        },
        notifyResize: function notifyResize(data) {
          return _this.notifyResize(data);
        },
        notifyApply: function notifyApply(data) {
          return _this.notifyApply(data);
        },
        notifyGetState: function notifyGetState(data) {
          return _this.notifyGetState(data);
        }
      });
      _defineProperty(_this, "onControlsOver", function (e) {
        var _this2 = _this,
          storage = _this2.storage;
        if (isUndef(storage) || storage.onExecution) return;
        var target = e.target;
        var handle = _this.resolveHandle(target);
        var key = handleKey(storage.handles, handle);
        if (!key || !RESIZE_KEYS.includes(key)) return;
        var cursor = _this.options.resizable ? resizeCursor(storage.handles, key) || '' : '';
        [handle, target].forEach(function (node) {
          node.style.cursor = cursor;
        });
      });
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
      key: "pointToGroup",
      value: /** @internal */
      function pointToGroup(point) {
        return point;
      }

      /** @internal */
    }, {
      key: "prepareGuides",
      value: /** @internal */
      function prepareGuides() {
        return null;
      }

      /** @internal */
    }, {
      key: "drawGuides",
      value: function drawGuides(_lines) {}

      /** @internal */
    }, {
      key: "prepareRestrict",
      value: function prepareRestrict() {
        return null;
      }

      /** @internal */
    }, {
      key: "processActions",
      value: /** @internal */
      function processActions(_actionName) {}

      /** @internal */
    }, {
      key: "rotate",
      value: /** @internal */
      function rotate(_ref2) {
        var element = _ref2.element,
          radians = _ref2.radians,
          rest = _objectWithoutProperties(_ref2, _excluded$2);
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
      value: function resize(_ref3) {
        var element = _ref3.element,
          dx = _ref3.dx,
          dy = _ref3.dy,
          rest = _objectWithoutProperties(_ref3, _excluded2$2);
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
        this.rawOptions = options;
        elements.forEach(function (element) {
          return addClass(element, "".concat(LIB_CLASS_PREFIX, "drag"));
        });
        this.options = normalizeOptions(options, elements);
        this.proxyMethods = proxyMethodsOf(options);
        this.subscribe(this.options.each);
      }

      /** @internal */
    }, {
      key: "animate",
      value: function animate() {
        var storage = this.storage,
          options = this.options;
        if (isUndef(storage)) return;
        storage.frame = requestAnimFrame(this.animate);
        if (!storage.doDraw) return;
        storage.doDraw = false;
        var doDrag = storage.doDrag,
          doResize = storage.doResize,
          doRotate = storage.doRotate,
          doSetCenter = storage.doSetCenter,
          point = storage.point;
        var draggable = options.draggable,
          resizable = options.resizable,
          rotatable = options.rotatable;
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
    }, {
      key: "session",
      get: function get() {
        return this.storage;
      }

      /** @internal */
    }, {
      key: "pointerDelta",
      value: function pointerDelta() {
        var _this$session = this.session,
          clientX = _this$session.clientX,
          clientY = _this$session.clientY,
          relativeX = _this$session.relativeX,
          relativeY = _this$session.relativeY,
          snap = this.options.snap;
        return {
          dx: snapToGrid(clientX - relativeX, snap.x),
          dy: snapToGrid(clientY - relativeY, snap.y)
        };
      }

      /** @internal */
    }, {
      key: "pointerArgs",
      value: function pointerArgs() {
        var _this$session2 = this.session,
          clientX = _this$session2.clientX,
          clientY = _this$session2.clientY,
          mouseEvent = _this$session2.mouseEvent;
        return {
          clientX: clientX,
          clientY: clientY,
          mouseEvent: mouseEvent
        };
      }

      /** @internal */
    }, {
      key: "cachedDist",
      value: function cachedDist() {
        var _this$storage$cached$, _this$storage$cached;
        var _ref4 = (_this$storage$cached$ = (_this$storage$cached = this.storage.cached) === null || _this$storage$cached === void 0 ? void 0 : _this$storage$cached.dist) !== null && _this$storage$cached$ !== void 0 ? _this$storage$cached$ : {},
          _ref4$dx = _ref4.dx,
          dx = _ref4$dx === void 0 ? 0 : _ref4$dx,
          _ref4$dy = _ref4.dy,
          dy = _ref4$dy === void 0 ? 0 : _ref4$dy;
        return {
          dx: dx,
          dy: dy
        };
      }

      /** @internal */
    }, {
      key: "cacheDist",
      value: function cacheDist(dist) {
        this.storage.cached = _objectSpread2(_objectSpread2({}, this.storage.cached), {}, {
          dist: dist
        });
      }

      /** @internal */
    }, {
      key: "guide",
      value: function guide(alignment, delta) {
        if (!alignment) return delta;
        this.drawGuides(alignment.lines);
        return alignment;
      }

      /** @internal */
    }, {
      key: "localDelta",
      value: function localDelta(element, _ref5, _ref6) {
        var dx = _ref5.dx,
          dy = _ref5.dy;
        var revX = _ref6.revX,
          revY = _ref6.revY,
          dox = _ref6.dox,
          doy = _ref6.doy;
        var _ref7 = this.options.isGrouped ? this.pointToGroup({
            x: dx,
            y: dy
          }) : this.pointToTransform({
            x: dx,
            y: dy,
            matrix: this.storage.data.get(element).transform.ctm
          }),
          x = _ref7.x,
          y = _ref7.y;
        return {
          dx: dox ? revX ? -x : x : 0,
          dy: doy ? revY ? -y : y : 0
        };
      }

      /** @internal */
    }, {
      key: "drawPoint",
      value: function drawPoint(point) {
        var _this$processPointMov;
        var storage = this.storage,
          session = this.session,
          proportions = this.options.proportions;
        var pointer = this.pointerDelta();
        var _clampPoint = clampPoint(storage.restriction, this.guide(alignPoint(storage.guides, session, proportions, pointer), pointer)),
          dx = _clampPoint.dx,
          dy = _clampPoint.dy;
        var result = (_this$processPointMov = this.processPointMove) === null || _this$processPointMov === void 0 ? void 0 : _this$processPointMov.call(this, this.elements[0], point, {
          dx: dx,
          dy: dy
        });
        if (!result) return;
        var finalArgs = _objectSpread2(_objectSpread2({}, result), {}, {
          dx: dx,
          dy: dy
        }, this.pointerArgs());
        this.proxyMethods.onResize.call(this, finalArgs);
        _superPropGet(Transformable, "emitEvent", this)([E_RESIZE$1, finalArgs]);
      }

      /** @internal */
    }, {
      key: "drawResize",
      value: function drawResize() {
        var _this3 = this;
        var elements = this.elements,
          observable = this.observable,
          observer = this.observer,
          storage = this.storage,
          session = this.session,
          _this$session3 = this.session,
          revX = _this$session3.revX,
          revY = _this$session3.revY,
          dox = _this$session3.dox,
          doy = _this$session3.doy,
          _this$options = this.options,
          restrict = _this$options.restrict,
          proportions = _this$options.proportions,
          flip = _this$options.flip,
          each = _this$options.each;
        var pointer = this.pointerDelta();
        var aligned = this.guide(alignResize(storage.guides, session, proportions, pointer, flip), pointer);
        var _clampResize = clampResize(storage.restriction, session, aligned),
          dx = _clampResize.dx,
          dy = _clampResize.dy,
          clamped = _clampResize.clamped;
        var dist = {
          dx: dx,
          dy: dy
        };
        var isBounding = Boolean(restrict) && !(clamped && !proportions) && elements.map(function (element) {
          return _this3.processResizeRestrict(element, _this3.localDelta(element, dist, session));
        }).some(overflows);
        var next = isBounding ? this.cachedDist() : dist;
        var nextArgs = _objectSpread2(_objectSpread2(_objectSpread2({}, next), this.pointerArgs()), {}, {
          revX: revX,
          revY: revY,
          dox: dox,
          doy: doy
        });
        elements.forEach(function (element) {
          return _this3.resize(_objectSpread2(_objectSpread2({}, nextArgs), {}, {
            element: element
          }, _this3.localDelta(element, next, session)));
        });
        this.cacheDist(next);
        this.processControlsResize(next);
        if (each.resize) observable.notify(ON_RESIZE, observer, nextArgs);
      }

      /** @internal */
    }, {
      key: "drawDrag",
      value: function drawDrag() {
        var _this4 = this;
        var elements = this.elements,
          observable = this.observable,
          observer = this.observer,
          _this$storage = this.storage,
          guides = _this$storage.guides,
          restriction = _this$storage.restriction,
          _this$session4 = this.session,
          dox = _this$session4.dox,
          doy = _this$session4.doy,
          _this$options2 = this.options,
          restrict = _this$options2.restrict,
          each = _this$options2.each;
        var pointer = this.pointerDelta();
        var grid = {
          dx: dox ? pointer.dx : 0,
          dy: doy ? pointer.dy : 0
        };
        var aligned = this.guide(guides ? align(guides, grid.dx, grid.dy, {
          x: dox,
          y: doy
        }) : null, grid);
        var delta = restriction ? clampMove(restriction, aligned.dx, aligned.dy) : {
          dx: aligned.dx,
          dy: aligned.dy
        };
        var args = _objectSpread2(_objectSpread2({}, delta), this.pointerArgs());
        var overflow = restrict && !restriction ? elements.map(function (element) {
          return _this4.processMoveRestrict(element, args);
        }) : [];
        var prev = this.cachedDist();
        var next = {
          dx: overflow.some(function (_ref8) {
            var x = _ref8.x;
            return x !== null;
          }) ? prev.dx : delta.dx,
          dy: overflow.some(function (_ref9) {
            var y = _ref9.y;
            return y !== null;
          }) ? prev.dy : delta.dy
        };
        var nextArgs = _objectSpread2(_objectSpread2({}, args), next);
        this.cacheDist(next);
        elements.forEach(function (element) {
          return _superPropGet(Transformable, "drag", _this4)([_objectSpread2({
            element: element
          }, nextArgs)]);
        });
        this.processControlsMove(next);
        if (each.move) observable.notify(ON_MOVE, observer, nextArgs);
      }

      /** @internal */
    }, {
      key: "drawRotate",
      value: function drawRotate() {
        var _this5 = this;
        var elements = this.elements,
          observable = this.observable,
          observer = this.observer,
          _this$session5 = this.session,
          clientX = _this$session5.clientX,
          clientY = _this$session5.clientY,
          pressang = _this$session5.pressang,
          center = _this$session5.center,
          _this$options3 = this.options,
          snap = _this$options3.snap,
          restrict = _this$options3.restrict,
          each = _this$options3.each;
        var angle = Math.atan2(clientY - center.y, clientX - center.x);
        var radians = snapToGrid(angle - pressang, snap.angle);
        if (restrict && elements.some(function (element) {
          return overflows(_this5.processRotateRestrict(element, radians));
        })) return;
        var args = this.pointerArgs();
        elements.forEach(function (element) {
          return _this5.rotate(_objectSpread2({
            element: element,
            radians: radians
          }, args));
        });
        this.processControlsRotate({
          radians: radians
        });
        if (each.rotate) observable.notify(ON_ROTATE, observer, _objectSpread2({
          radians: radians
        }, args));
      }

      /** @internal */
    }, {
      key: "drawCenter",
      value: function drawCenter() {
        var _this$session6 = this.session,
          clientX = _this$session6.clientX,
          clientY = _this$session6.clientY,
          bx = _this$session6.bx,
          by = _this$session6.by;
        var _this$pointToControls = this.pointToControls({
            x: clientX,
            y: clientY
          }),
          x = _this$pointToControls.x,
          y = _this$pointToControls.y;
        this.moveCenterHandle(x - bx, y - by);
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
          _this$options4 = this.options,
          axis = _this$options4.axis,
          each = _this$options4.each,
          guides = _this$options4.guides,
          restrict = _this$options4.restrict,
          storage = this.storage,
          handles = this.storage.handles;
        var isTarget = values$2(handles).some(function (hdl) {
          return helper(target).is(hdl);
        }) || elements.some(function (element) {
          return element.contains(target);
        });
        storage.isTarget = isTarget;
        if (!isTarget) return;
        storage.handleCursor = handleCursor(handles, handleKey(handles, target));
        var computed = this.compute(e, elements);
        keys(computed).forEach(function (prop) {
          return storage[prop] = computed[prop];
        });
        var onRightEdge = computed.onRightEdge,
          onBottomEdge = computed.onBottomEdge,
          onTopEdge = computed.onTopEdge,
          onLeftEdge = computed.onLeftEdge,
          handle = computed.handle,
          revX = computed.revX,
          revY = computed.revY,
          doW = computed.doW,
          doH = computed.doH,
          point = computed.point;
        var rotator = handles.rotator,
          center = handles.center,
          radius = handles.radius;
        if (isDef(radius)) removeClass(radius, "".concat(LIB_CLASS_PREFIX, "hidden"));
        var doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge || Boolean(point);
        var doRotate = handle.is(rotator);
        var doSetCenter = isDef(center) ? handle.is(center) : false;
        var doDrag = !(doRotate || doResize || doSetCenter);
        var flags = {
          doResize: doResize,
          doDrag: doDrag,
          doRotate: doRotate,
          doSetCenter: doSetCenter
        };
        var axes = resizeAxes(handle, handles);
        var prepared = doDrag || doResize;
        this.storage = _objectSpread2(_objectSpread2(_objectSpread2({}, storage), flags), {}, {
          mouseEvent: e,
          clientX: clientX,
          clientY: clientY,
          onExecution: true,
          guides: prepared && guides ? this.prepareGuides() : null,
          restriction: prepared && restrict ? this.prepareRestrict() : null,
          cursor: null,
          dox: /x/.test(axis) && (!doResize || Boolean(point) || axes.x),
          doy: /y/.test(axis) && (!doResize || Boolean(point) || axes.y)
        });
        if (!doDrag) this.setActiveHandle(handle[0]);
        var actionName = actionOf(flags);
        var startEvent = startEventOf(actionName);
        if (startEvent) _superPropGet(Transformable, "emitEvent", this)([startEvent, {
          clientX: clientX,
          clientY: clientY
        }]);
        observable.notify(ON_GETSTATE, this.observer, {
          clientX: clientX,
          clientY: clientY,
          actionName: actionName,
          triggerEvent: isMimicked(flags, each),
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
        var _this$storage2 = this.storage,
          storage = _this$storage2 === void 0 ? {} : _this$storage2,
          options = this.options;
        if (!storage.isTarget) return;
        var _this$cursorPoint = this.cursorPoint(e),
          x = _this$cursorPoint.x,
          y = _this$cursorPoint.y;
        storage.mouseEvent = e;
        storage.clientX = x;
        storage.clientY = y;
        storage.doDraw = true;
        if (!isUndef(storage.cursor)) return;
        var doRotate = storage.doRotate,
          doDrag = storage.doDrag,
          doResize = storage.doResize,
          pressedCursor = storage.handleCursor;
        var cursorMove = options.cursorMove,
          cursorResize = options.cursorResize,
          cursorRotate = options.cursorRotate;
        var cursor = null;
        if (doDrag) {
          cursor = cursorMove;
        } else if (doRotate) {
          cursor = cursorRotate !== null && cursorRotate !== void 0 ? cursorRotate : ROTATE_CURSOR;
        } else if (doResize) {
          var _ref0;
          cursor = (_ref0 = cursorResize !== null && cursorResize !== void 0 ? cursorResize : pressedCursor) !== null && _ref0 !== void 0 ? _ref0 : 'auto';
        }
        helper(document.body).css({
          cursor: cursor
        });
        storage.wrapper.style.cursor = cursor || '';
      }

      /** @internal */
    }, {
      key: "end",
      value: function end(_ref1) {
        var _this6 = this;
        var clientX = _ref1.clientX,
          clientY = _ref1.clientY;
        var elements = this.elements,
          each = this.options.each,
          observable = this.observable,
          storage = this.storage,
          _this$storage3 = this.storage,
          frame = _this$storage3.frame,
          radius = _this$storage3.handles.radius,
          isTarget = _this$storage3.isTarget,
          proxyMethods = this.proxyMethods;
        if (!isTarget) return;
        var actionName = actionOf(storage);
        var triggerEvent = isMimicked(storage, each);
        elements.forEach(function (element) {
          return _this6.applyTransformToElement(element, actionName);
        });
        this.processActions(actionName);
        this.updateStorage();
        var eventArgs = {
          clientX: clientX,
          clientY: clientY
        };
        proxyMethods.onDrop.call(this, eventArgs);
        var endEvent = endEventOf(actionName);
        if (endEvent) _superPropGet(Transformable, "emitEvent", this)([endEvent, eventArgs]);
        observable.notify(ON_APPLY, this.observer, {
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
        this.storage.wrapper.style.cursor = '';
        if (isDef(radius)) addClass(radius, "".concat(LIB_CLASS_PREFIX, "hidden"));
        var pendingOptions = this.pendingOptions;
        if (pendingOptions) {
          this.pendingOptions = null;
          this.applyOptions(pendingOptions);
        }
      }

      /** @internal */
    }, {
      key: "afterInit",
      value: function afterInit() {
        this.initClasses = readClasses(this.storage);
        helper(this.storage.controls).on(E_MOUSEOVER, this.onControlsOver);
      }

      /** @internal */
    }, {
      key: "setActiveHandle",
      value: function setActiveHandle(handle) {
        var storage = this.storage,
          _this$storage4 = this.storage,
          wrapper = _this$storage4.wrapper,
          activeHandle = _this$storage4.activeHandle;
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
        var _this7 = this;
        var _this$storage5 = this.storage,
          _this$storage6 = _this$storage5 === void 0 ? {} : _this$storage5,
          handles = _this$storage6.handles,
          data = _this$storage6.data;
        var target = this.resolveHandle(e.target);
        var handle = helper(target);
        var _handleFlags = handleFlags(handle, handles),
          revX = _handleFlags.revX,
          revY = _handleFlags.revY,
          doW = _handleFlags.doW,
          doH = _handleFlags.doH,
          rest = _objectWithoutProperties(_handleFlags, _excluded3$2);
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
        elements.forEach(function (element) {
          var _this7$getElementStat = _this7.getElementState(element, {
              revX: revX,
              revY: revY,
              doW: doW,
              doH: doH
            }),
            transform = _this7$getElementStat.transform,
            nextData = _objectWithoutProperties(_this7$getElementStat, _excluded4$1);
          var _this7$pointToTransfo = _this7.pointToTransform({
              x: x,
              y: y,
              matrix: transform.ctm
            }),
            ex = _this7$pointToTransfo.x,
            ey = _this7$pointToTransfo.y;
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
            return handle.is(hdl);
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
        return overflowPoint(this.getBoundingRect(element, matrix), this.getRestrictedBBox());
      }

      /** @internal */
    }, {
      key: "unbindPress",
      value: function unbindPress(targets) {
        var _this8 = this;
        targets.forEach(function (target) {
          return helper(target).off(E_MOUSEDOWN$3, _this8.onMouseDown).off(E_TOUCHSTART$3, _this8.onTouchStart);
        });
      }

      /** @internal */
    }, {
      key: "destroy",
      value: function destroy() {
        var elements = this.elements,
          _this$storage7 = this.storage,
          _this$storage8 = _this$storage7 === void 0 ? {} : _this$storage7,
          controls = _this$storage8.controls,
          wrapper = _this$storage8.wrapper;
        this.unbindPress([].concat(_toConsumableArray(elements), [controls]));
        helper(controls).off(E_MOUSEOVER, this.onControlsOver);
        wrapper.parentNode.removeChild(wrapper);
      }

      /** @internal */
    }, {
      key: "updateStorage",
      value: function updateStorage() {
        var storage = this.storage,
          _this$storage9 = this.storage,
          prevTransformOrigin = _this$storage9.transformOrigin,
          _this$storage9$transf = _this$storage9.transform,
          _this$storage9$transf2 = _this$storage9$transf === void 0 ? {} : _this$storage9$transf,
          prevControlsMatrix = _this$storage9$transf2.controlsMatrix,
          _this$storage9$cached = _this$storage9.cached,
          _this$storage9$cached2 = _this$storage9$cached === void 0 ? {} : _this$storage9$cached,
          _this$storage9$cached3 = _this$storage9$cached2.transformOrigin,
          transformOrigin = _this$storage9$cached3 === void 0 ? prevTransformOrigin : _this$storage9$cached3,
          _this$storage9$cached4 = _this$storage9$cached2.controlsMatrix,
          controlsMatrix = _this$storage9$cached4 === void 0 ? prevControlsMatrix : _this$storage9$cached4;
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

      /** @internal */
    }, {
      key: "prepareState",
      value: function prepareState() {
        var _this9 = this;
        var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NO_FLAGS;
        var elements = this.elements,
          storage = this.storage,
          data = this.storage.data;
        var commonState = this.getCommonState();
        elements.forEach(function (element) {
          data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), _this9.getElementState(element, flags)));
        });
        this.storage = _objectSpread2(_objectSpread2({}, storage), commonState);
      }
    }, {
      key: "notifyMove",
      value: function notifyMove(_ref10) {
        var _this0 = this;
        var dx = _ref10.dx,
          dy = _ref10.dy;
        this.elements.forEach(function (element) {
          return _superPropGet(Transformable, "drag", _this0)([{
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
      value: function notifyRotate(_ref11) {
        var _this1 = this;
        var radians = _ref11.radians,
          rest = _objectWithoutProperties(_ref11, _excluded5);
        var elements = this.elements,
          _this$options5 = this.options,
          _this$options6 = _this$options5 === void 0 ? {} : _this$options5,
          angle = _this$options6.snap.angle;
        elements.forEach(function (element) {
          return _this1.rotate(_objectSpread2({
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
      value: function notifyResize(_ref12) {
        var _this10 = this;
        var dx = _ref12.dx,
          dy = _ref12.dy,
          revX = _ref12.revX,
          revY = _ref12.revY,
          dox = _ref12.dox,
          doy = _ref12.doy;
        this.elements.forEach(function (element) {
          return _this10.resize(_objectSpread2({
            element: element
          }, _this10.localDelta(element, {
            dx: dx,
            dy: dy
          }, {
            revX: revX,
            revY: revY,
            dox: dox,
            doy: doy
          })));
        });
        this.processControlsResize({
          dx: dx,
          dy: dy
        });
      }
    }, {
      key: "notifyApply",
      value: function notifyApply(_ref13) {
        var _this11 = this;
        var clientX = _ref13.clientX,
          clientY = _ref13.clientY,
          actionName = _ref13.actionName,
          triggerEvent = _ref13.triggerEvent;
        this.proxyMethods.onDrop.call(this, {
          clientX: clientX,
          clientY: clientY
        });
        if (triggerEvent) {
          this.elements.forEach(function (element) {
            return _this11.applyTransformToElement(element, actionName);
          });
          _superPropGet(Transformable, "emitEvent", this)(["".concat(actionName, "End"), {
            clientX: clientX,
            clientY: clientY
          }]);
        }
      }
    }, {
      key: "notifyGetState",
      value: function notifyGetState(_ref14) {
        var _this12 = this;
        var clientX = _ref14.clientX,
          clientY = _ref14.clientY,
          actionName = _ref14.actionName,
          triggerEvent = _ref14.triggerEvent,
          rest = _objectWithoutProperties(_ref14, _excluded6);
        if (!triggerEvent) return;
        var elements = this.elements,
          data = this.storage.data;
        elements.forEach(function (element) {
          data.set(element, _objectSpread2(_objectSpread2({}, data.get(element)), _this12.getElementState(element, rest)));
        });
        this.storage = _objectSpread2(_objectSpread2({}, this.storage), this.getCommonState());
        _superPropGet(Transformable, "emitEvent", this)(["".concat(actionName, "Start"), {
          clientX: clientX,
          clientY: clientY
        }]);
      }
    }, {
      key: "subscribe",
      value: function subscribe(_ref15) {
        var resize = _ref15.resize,
          move = _ref15.move,
          rotate = _ref15.rotate;
        var ob = this.observable,
          observer = this.observer;
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
    }, {
      key: "unsubscribe",
      value: function unsubscribe() {
        var ob = this.observable,
          observer = this.observer;
        NOTIFIER_EVENTS.forEach(function (eventName) {
          return ob.unsubscribe(eventName, observer);
        });
      }
    }, {
      key: "disable",
      value: function disable() {
        var storage = this.storage,
          proxyMethods = this.proxyMethods,
          elements = this.elements;
        if (isUndef(storage)) return;
        if (storage.onExecution) {
          helper(document).off(E_MOUSEMOVE, this.onMouseMove).off(E_MOUSEUP, this.onMouseUp).off(E_TOUCHMOVE, this.onTouchMove).off(E_TOUCHEND, this.onTouchEnd);
        }
        elements.forEach(function (element) {
          return removeClass(element, "".concat(LIB_CLASS_PREFIX, "drag"));
        });
        this.pendingOptions = null;
        this.unsubscribe();
        this.destroy();
        proxyMethods.onDestroy.call(this, elements);
        delete this.storage;
      }
    }, {
      key: "update",
      value: function update() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var storage = this.storage;
        if (isUndef(storage)) return;
        if (!storage.onExecution) {
          this.applyOptions(options);
          return;
        }
        var runtime = {};
        var structural = {};
        keys(options).forEach(function (key) {
          var target = RUNTIME_OPTIONS.includes(key) ? runtime : structural;
          target[key] = options[key];
        });
        if (keys(structural).length) {
          this.pendingOptions = _objectSpread2(_objectSpread2({}, this.pendingOptions), structural);
        }
        this.applyOptions(runtime);
      }

      /** @internal */
    }, {
      key: "applyOptions",
      value: function applyOptions(options) {
        var rawOptions = this.rawOptions,
          prevOptions = this.options;
        var changed = keys(options).filter(function (key) {
          return !isSameOption(options[key], rawOptions[key]);
        });
        if (!changed.length) return;
        this.unsubscribe();
        this.processOptions(_objectSpread2(_objectSpread2({}, rawOptions), options));
        var nextOptions = this.options;
        var structural = changed.filter(function (key) {
          return !RUNTIME_OPTIONS.includes(key) && !isSameOption(nextOptions[key], prevOptions[key]);
        });
        if (structural.length) this.rebuildControls(structural);
      }

      /** @internal */
    }, {
      key: "rebuildControls",
      value: function rebuildControls(changed) {
        var elements = this.elements,
          prev = this.storage,
          initClasses = this.initClasses;
        var wrapper = prev.wrapper,
          controls = prev.controls,
          transformOrigin = prev.transformOrigin,
          center = prev.center;
        var owned = [].concat(_toConsumableArray(values$2(prev.handles)), _toConsumableArray(values$2(prev.hitAreas || {})), [prev.hitOverlay, prev.guidesLayer]).filter(isDef);
        this.unbindPress([].concat(_toConsumableArray(elements), [controls]));
        owned.forEach(function (node) {
          if (node.parentNode) node.parentNode.removeChild(node);
        });
        this.init(elements);
        var fresh = this.storage;
        var freshClasses = readClasses(fresh);
        this.unbindPress([fresh.controls]);
        helper(controls).on(E_MOUSEDOWN$3, this.onMouseDown).on(E_TOUCHSTART$3, this.onTouchStart);
        adoptControls(prev, fresh, initClasses);
        this.storage = _objectSpread2(_objectSpread2({}, fresh), {}, {
          wrapper: wrapper,
          controls: controls
        });
        this.initClasses = freshClasses;
        if (center.isShifted && !changed.some(function (key) {
          return ORIGIN_OPTIONS.includes(key);
        })) {
          var _ref16 = Array.isArray(transformOrigin) ? transformOrigin : [transformOrigin.x, transformOrigin.y],
            _ref17 = _slicedToArray(_ref16, 2),
            _x = _ref17[0],
            _y = _ref17[1];
          this.setTransformOrigin({
            x: _x,
            y: _y
          }, true);
          this.storage.transformOrigin = transformOrigin;
          this.storage.center.isShifted = true;
        }
      }
    }, {
      key: "exeDrag",
      value: function exeDrag(_ref18) {
        var _this13 = this;
        var dx = _ref18.dx,
          dy = _ref18.dy;
        var elements = this.elements,
          _this$options7 = this.options,
          draggable = _this$options7.draggable,
          restrict = _this$options7.restrict;
        if (!draggable) return;
        this.prepareState();
        var restriction = restrict ? this.prepareRestrict() : null;
        var delta = restriction ? clampMove(restriction, dx, dy) : {
          dx: dx,
          dy: dy
        };
        elements.forEach(function (element) {
          _superPropGet(Transformable, "drag", _this13)([_objectSpread2({
            element: element
          }, delta)]);
          _this13.applyTransformToElement(element, E_DRAG$1);
        });
        this.processControlsMove(delta);
      }
    }, {
      key: "exeResize",
      value: function exeResize(_ref19) {
        var _this14 = this;
        var dx = _ref19.dx,
          dy = _ref19.dy,
          _ref19$revX = _ref19.revX,
          revX = _ref19$revX === void 0 ? false : _ref19$revX,
          _ref19$revY = _ref19.revY,
          revY = _ref19$revY === void 0 ? false : _ref19$revY,
          _ref19$doW = _ref19.doW,
          doW = _ref19$doW === void 0 ? false : _ref19$doW,
          _ref19$doH = _ref19.doH,
          doH = _ref19$doH === void 0 ? false : _ref19$doH;
        var elements = this.elements,
          resizable = this.options.resizable;
        if (!resizable) return;
        this.prepareState({
          revX: revX,
          revY: revY,
          doW: doW,
          doH: doH
        });
        elements.forEach(function (element) {
          _this14.resize({
            element: element,
            dx: dx,
            dy: dy
          });
          _this14.applyTransformToElement(element, E_RESIZE$1);
        });
        this.processControlsMove({
          dx: dx,
          dy: dy
        });
      }
    }, {
      key: "exeRotate",
      value: function exeRotate(_ref20) {
        var _this15 = this;
        var delta = _ref20.delta;
        var elements = this.elements,
          rotatable = this.options.rotatable;
        if (!rotatable) return;
        this.prepareState();
        elements.forEach(function (element) {
          _this15.rotate({
            element: element,
            radians: delta
          });
          _this15.applyTransformToElement(element, E_ROTATE$1);
        });
        this.processControlsRotate({
          radians: delta
        });
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
    }, {
      key: "handles",
      get: function get() {
        return this.storage.handles;
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
  var composeMatrix = function composeMatrix() {
    for (var _len = arguments.length, matrices = new Array(_len), _key = 0; _key < _len; _key++) {
      matrices[_key] = arguments[_key];
    }
    return matrices.reduce(function (result, matrix) {
      return multiplyMatrix(matrix, result);
    });
  };
  var matrixInvert = function matrixInvert(matrix) {
    var A = cloneMatrix$1(matrix);
    var N = A.length;
    var E = A.map(function (_, i) {
      return A.map(function (__, j) {
        return i === j ? 1 : 0;
      });
    });
    for (var k = 0; k < N; k++) {
      var pivot = k;
      for (var i = k + 1; i < N; i++) {
        if (Math.abs(A[i][k]) > Math.abs(A[pivot][k])) pivot = i;
      }
      if (A[pivot][k] === 0) continue;
      var _ref = [A[pivot], A[k]];
      A[k] = _ref[0];
      A[pivot] = _ref[1];
      var _ref2 = [E[pivot], E[k]];
      E[k] = _ref2[0];
      E[pivot] = _ref2[1];
      var temp = A[k][k];
      for (var j = 0; j < N; j++) {
        A[k][j] /= temp;
        E[k][j] /= temp;
      }
      for (var _i = 0; _i < N; _i++) {
        var factor = A[_i][k];
        if (_i === k || !factor) continue;
        for (var _j = 0; _j < N; _j++) {
          A[_i][_j] -= A[k][_j] * factor;
          E[_i][_j] -= E[k][_j] * factor;
        }
      }
    }
    return E;
  };
  var computeTransformMatrix = function computeTransformMatrix(tx, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 3),
      x = _ref4[0],
      y = _ref4[1],
      z = _ref4[2];
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

  var createElement = function createElement() {
    var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var element = document.createElement('div');
    classNames.forEach(function (className) {
      return addClass(element, className);
    });
    return element;
  };
  var lineStyle = function lineStyle(_ref, _ref2) {
    var _ref3 = _slicedToArray(_ref, 2),
      x1 = _ref3[0],
      y1 = _ref3[1];
    var _ref4 = _slicedToArray(_ref2, 2),
      x2 = _ref4[0],
      y2 = _ref4[1];
    var thickness = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var cx = (x1 + x2) / 2 - length / 2;
    var cy = (y1 + y2) / 2 - thickness / 2;
    var theta = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
    return {
      transform: "translate(".concat(cx, "px, ").concat(cy, "px) rotate(").concat(theta, "deg)"),
      width: "".concat(length, "px")
    };
  };
  var createHandler$1 = function createHandler(_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
      x = _ref6[0],
      y = _ref6[1];
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'handler';
    var element = createElement(['sjx-hdl', "sjx-hdl-".concat(key)]);
    helper(element).css({
      transform: "translate(".concat(x, "px, ").concat(y, "px)")
    });
    return element;
  };
  var renderLine$1 = function renderLine(_ref7, key) {
    var _ref8 = _slicedToArray(_ref7, 2),
      from = _ref8[0],
      to = _ref8[1];
    var thickness = 1;
    var line = createElement(['sjx-hdl-line', "sjx-hdl-".concat(key)]);
    var _lineStyle = lineStyle(from, to, thickness),
      transform = _lineStyle.transform,
      width = _lineStyle.width;
    helper(line).css({
      transform: transform,
      height: "".concat(thickness, "px"),
      width: width
    });
    return line;
  };

  var entries$4 = Object.entries;
  var rotation = function rotation(radians) {
    return createRotateMatrix$1(Math.sin(radians), Math.cos(radians));
  };
  var conjugate = function conjugate(matrix, pivot) {
    return multiplyMatrix(multiplyMatrix(matrixInvert(pivot), matrix), pivot);
  };
  var pinnedMatrix = function pinnedMatrix(scaleMatrix, ctm, revX, revY) {
    var translateX = scaleMatrix[0][3];
    var translateY = scaleMatrix[1][3];
    var inverted = createTranslateMatrix$1(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
    return multiplyMatrix(multiplyMatrix(inverted, ctm), matrixInvert(createTranslateMatrix$1(translateX, translateY)));
  };
  var toVectors = function toVectors(vertices) {
    return entries$4(vertices).reduce(function (result, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        _ref2$ = _slicedToArray(_ref2[1], 2),
        x = _ref2$[0],
        y = _ref2$[1];
      result[key] = [x, y, 0, 1];
      return result;
    }, {});
  };
  var mapVertices = function mapVertices(vertices, map) {
    return entries$4(vertices).reduce(function (result, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        _ref4$ = _slicedToArray(_ref4[1], 2),
        x = _ref4$[0],
        y = _ref4$[1];
      result[key] = map([x, y, 0, 1]);
      return result;
    }, {});
  };
  var toPoints = function toPoints(vertices) {
    return entries$4(vertices).reduce(function (result, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        _ref6$ = _slicedToArray(_ref6[1], 2),
        x = _ref6$[0],
        y = _ref6$[1];
      result[key] = {
        x: x,
        y: y
      };
      return result;
    }, {});
  };
  var ownBox = function ownBox(element, container) {
    var _getAbsoluteOffset = getAbsoluteOffset(element, container),
      _getAbsoluteOffset2 = _slicedToArray(_getAbsoluteOffset, 2),
      left = _getAbsoluteOffset2[0],
      top = _getAbsoluteOffset2[1];
    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
      offset: {
        left: left,
        top: top
      }
    };
  };
  var bBoxPoints$1 = function bBoxPoints(element, container, ctm, bBox) {
    var _ref7 = bBox || ownBox(element, container),
      width = _ref7.width,
      height = _ref7.height,
      _ref7$offset = _ref7.offset,
      _ref7$offset2 = _ref7$offset === void 0 ? {} : _ref7$offset,
      left = _ref7$offset2.left,
      top = _ref7$offset2.top;
    return [[0, 0, 0, 1], [width, 0, 0, 1], [0, height, 0, 1], [width, height, 0, 1]].map(function (vertex) {
      var _multiplyMatrixAndPoi = multiplyMatrixAndPoint(ctm, vertex),
        _multiplyMatrixAndPoi2 = _slicedToArray(_multiplyMatrixAndPoi, 4),
        x = _multiplyMatrixAndPoi2[0],
        y = _multiplyMatrixAndPoi2[1],
        z = _multiplyMatrixAndPoi2[2],
        w = _multiplyMatrixAndPoi2[3];
      return [x + left, y + top, z, w];
    });
  };

  var _excluded$1 = ["rotator", "anchor"],
    _excluded2$1 = ["anchor", "center"],
    _excluded3$1 = ["anchor", "rotator", "center"];
  var E_MOUSEDOWN$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
    E_TOUCHSTART$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
  var entries$3 = Object.entries,
    values$1 = Object.values;
  var BOX_HANDLES$1 = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];
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
          rotatable = _this$options.rotatable,
          restrict = _this$options.restrict;
        var wrapper = createElement(['sjx-wrapper']);
        var controls = createElement(['sjx-controls']);
        var _this$getVertices = this.getVertices(),
          _this$getVertices$rot = _this$getVertices.rotator,
          rotator = _this$getVertices$rot === void 0 ? null : _this$getVertices$rot,
          _this$getVertices$anc = _this$getVertices.anchor,
          anchor = _this$getVertices$anc === void 0 ? null : _this$getVertices$anc,
          vertices = _objectWithoutProperties(_this$getVertices, _excluded$1);
        var rotationHandles = rotatable ? this.renderRotationHandles(controls, anchor, rotator, vertices.center) : {};
        var nextTransformOrigin = Array.isArray(transformOrigin) ? [].concat(_toConsumableArray(transformOrigin), [0, 1]) : [].concat(_toConsumableArray(vertices.center), [0, 1]);
        var edgeHandles = this.renderEdges(controls, vertices);
        var pointHandles = this.renderPoints(controls, _objectSpread2(_objectSpread2({}, this.resizingPoints(vertices)), {}, {
          center: transformOrigin && rotatable ? _toConsumableArray(nextTransformOrigin).slice(0, 2) : undefined,
          rotator: rotator
        }));
        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);
        var data = new WeakMap();
        elements.forEach(function (element) {
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
          handles: _objectSpread2(_objectSpread2(_objectSpread2({}, edgeHandles), pointHandles), rotationHandles),
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
        [].concat(_toConsumableArray(elements), [controls]).forEach(function (target) {
          return helper(target).on(E_MOUSEDOWN$2, _this.onMouseDown).on(E_TOUCHSTART$2, _this.onTouchStart);
        });
      }

      /** @internal */
    }, {
      key: "renderRotationHandles",
      value: function renderRotationHandles(controls, anchor, rotator, center) {
        var _this$options2 = this.options,
          showNormal = _this$options2.showNormal,
          transformOrigin = _this$options2.transformOrigin;
        var normal = showNormal ? renderLine$1([[anchor.x, anchor.y], rotator], 'normal') : null;
        if (normal) controls.appendChild(normal);
        var radius = null;
        if (transformOrigin) {
          radius = renderLine$1([center, center], 'radius');
          addClass(radius, 'sjx-hidden');
          controls.appendChild(radius);
        }
        return {
          normal: normal,
          radius: radius
        };
      }

      /** @internal */
    }, {
      key: "renderEdges",
      value: function renderEdges(controls, vertices) {
        var _this2 = this;
        var handles = {};
        entries$3(edgeSegments(vertices)).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            segment = _ref2[1];
          var edge = renderLine$1(segment, key);
          if (!_this2.isHandleEnabled(key)) helper(edge).css({
            pointerEvents: 'none'
          });
          controls.appendChild(edge);
          handles[key] = edge;
        });
        return handles;
      }

      /** @internal */
    }, {
      key: "resizingPoints",
      value: function resizingPoints(vertices) {
        var _this3 = this;
        if (!this.options.resizable) return {};
        return BOX_HANDLES$1.filter(function (key) {
          return _this3.isHandleEnabled(key);
        }).reduce(function (result, key) {
          result[key] = vertices[key];
          return result;
        }, {});
      }

      /** @internal */
    }, {
      key: "renderPoints",
      value: function renderPoints(controls, points) {
        var handles = {};
        entries$3(points).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            point = _ref4[1];
          if (isUndef(point)) return;
          var handle = createHandler$1(point, key);
          controls.appendChild(handle);
          handles[key] = handle;
        });
        return handles;
      }

      /** @internal */
    }, {
      key: "pointToTransform",
      value: function pointToTransform(_ref5) {
        var x = _ref5.x,
          y = _ref5.y,
          matrix = _ref5.matrix;
        var nextMatrix = matrixInvert(matrix);
        return this.applyMatrixToPoint(dropTranslate(nextMatrix, false), x, y);
      }

      /** @internal */
    }, {
      key: "pointToControls",
      value: function pointToControls(_ref6) {
        var x = _ref6.x,
          y = _ref6.y;
        var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
        var controlsMatrix = transform.controlsMatrix;
        var matrix = matrixInvert(controlsMatrix);
        return this.applyMatrixToPoint(dropTranslate(matrix, false), x, y);
      }

      /** @internal */
    }, {
      key: "pointToGroup",
      value: function pointToGroup(point) {
        return this.pointToControls(point);
      }

      /** @internal */
    }, {
      key: "getControlsMatrix",
      value: function getControlsMatrix() {
        var _ref7 = this.storage || {},
          controls = _ref7.controls;
        return controls ? getCurrentTransformMatrix(controls, controls.parentNode) : createIdentityMatrix();
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
      value: function cursorPoint(_ref8) {
        var clientX = _ref8.clientX,
          clientY = _ref8.clientY;
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
          _this$options3 = this.options,
          restrict = _this$options3.restrict,
          container = _this$options3.container;
        var restrictEl = restrict || container;
        return bBoxPoints$1(restrictEl, container, force ? getCurrentTransformMatrix(restrictEl, container) : containerMatrix);
      }

      /** @internal */
    }, {
      key: "applyTransformToElement",
      value: function applyTransformToElement(element) {
        var _this$storage = this.storage,
          controls = _this$storage.controls,
          data = _this$storage.data,
          applyTranslate = this.options.applyTranslate;
        var _ref9 = data.get(element),
          cached = _ref9.cached,
          matrix = _ref9.transform.matrix;
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
      key: "resizeResult",
      value: function resizeResult(element, _ref0) {
        var dx = _ref0.dx,
          dy = _ref0.dy;
        var _this$storage2 = this.storage,
          revX = _this$storage2.revX,
          revY = _this$storage2.revY,
          doW = _this$storage2.doW,
          doH = _this$storage2.doH,
          data = _this$storage2.data,
          _this$storage2$bBox = _this$storage2.bBox,
          width = _this$storage2$bBox.width,
          height = _this$storage2$bBox.height,
          _this$options4 = this.options,
          proportions = _this$options4.proportions,
          scalable = _this$options4.scalable;
        var _transform = data.get(element).transform,
          matrix = _transform.matrix,
          translateMatrix = _transform.auxiliary.scale.translateMatrix;
        var _resizeBox = resizeBox({
            width: width,
            height: height,
            dx: dx,
            dy: dy,
            doW: doW,
            doH: doH,
            proportions: proportions,
            flip: false
          }),
          _resizeBox2 = _slicedToArray(_resizeBox, 4),
          scaleX = _resizeBox2[0],
          scaleY = _resizeBox2[1],
          newWidth = _resizeBox2[2],
          newHeight = _resizeBox2[3];
        var scaleMatrix = multiplyMatrix(multiplyMatrix(translateMatrix, createScaleMatrix$1(scaleX, scaleY)), matrixInvert(translateMatrix));
        return {
          resultMatrix: scalable ? multiplyMatrix(scaleMatrix, matrix) : pinnedMatrix(scaleMatrix, matrix, revX, revY),
          newWidth: newWidth,
          newHeight: newHeight
        };
      }

      /** @internal */
    }, {
      key: "cacheResize",
      value: function cacheResize(element, _ref1, width, height) {
        var dx = _ref1.dx,
          dy = _ref1.dy;
        var data = this.storage.data;
        var elementData = data.get(element);
        data.set(element, _objectSpread2(_objectSpread2({}, elementData), {}, {
          cached: _objectSpread2(_objectSpread2({}, elementData.cached), {}, {
            dx: dx,
            dy: dy,
            bBox: {
              width: width,
              height: height
            }
          })
        }));
      }

      /** @internal */
    }, {
      key: "rotatedMatrix",
      value: function rotatedMatrix(element, radians) {
        var _transform2 = this.storage.data.get(element).transform,
          matrix = _transform2.matrix,
          translateMatrix = _transform2.auxiliary.rotate.translateMatrix;
        return multiplyMatrix(matrix, conjugate(rotation(radians), translateMatrix));
      }

      /** @internal */
    }, {
      key: "translatedMatrix",
      value: function translatedMatrix(element, _ref10) {
        var dx = _ref10.dx,
          dy = _ref10.dy;
        var _transform3 = this.storage.data.get(element).transform,
          matrix = _transform3.matrix,
          parentMatrix = _transform3.auxiliary.translate.parentMatrix;
        var _multiplyMatrixAndPoi3 = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]),
          _multiplyMatrixAndPoi4 = _slicedToArray(_multiplyMatrixAndPoi3, 2),
          nx = _multiplyMatrixAndPoi4[0],
          ny = _multiplyMatrixAndPoi4[1];
        return {
          matrix: multiplyMatrix(matrix, createTranslateMatrix$1(nx, ny)),
          nx: nx,
          ny: ny
        };
      }

      /** @internal */
    }, {
      key: "processResize",
      value: function processResize(element, delta) {
        if (this.options.isGrouped) return this.processGroupResize(element, delta);
        var scalable = this.options.scalable;
        var _this$resizeResult = this.resizeResult(element, delta),
          resultMatrix = _this$resizeResult.resultMatrix,
          newWidth = _this$resizeResult.newWidth,
          newHeight = _this$resizeResult.newHeight;
        this.updateElementView(element, _objectSpread2(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))), !scalable && {
          width: "".concat(newWidth, "px"),
          height: "".concat(newHeight, "px")
        }));
        this.cacheResize(element, delta, newWidth, newHeight);
        return {
          transform: resultMatrix,
          width: newWidth,
          height: newHeight
        };
      }

      /** @internal */
    }, {
      key: "processGroupResize",
      value: function processGroupResize(element, _ref11) {
        var dx = _ref11.dx,
          dy = _ref11.dy;
        var _this$storage3 = this.storage,
          revX = _this$storage3.revX,
          revY = _this$storage3.revY,
          doW = _this$storage3.doW,
          doH = _this$storage3.doH,
          data = _this$storage3.data,
          _this$storage3$bBox = _this$storage3.bBox,
          _this$storage3$bBox$x = _this$storage3$bBox.x,
          boxX = _this$storage3$bBox$x === void 0 ? 0 : _this$storage3$bBox$x,
          _this$storage3$bBox$y = _this$storage3$bBox.y,
          boxY = _this$storage3$bBox$y === void 0 ? 0 : _this$storage3$bBox$y,
          boxWidth = _this$storage3$bBox.width,
          boxHeight = _this$storage3$bBox.height,
          controlsMatrix = _this$storage3.transform.controlsMatrix,
          _this$options5 = this.options,
          proportions = _this$options5.proportions,
          scalable = _this$options5.scalable;
        var elementData = data.get(element);
        var _elementData$transfor = elementData.transform,
          matrix = _elementData$transfor.matrix,
          ctm = _elementData$transfor.ctm,
          origin = _elementData$transfor.origin,
          _elementData$bBox = elementData.bBox,
          width = _elementData$bBox.width,
          height = _elementData$bBox.height,
          _elementData$bBox$off = _elementData$bBox.offset,
          _elementData$bBox$off2 = _elementData$bBox$off === void 0 ? {} : _elementData$bBox$off,
          _elementData$bBox$off3 = _elementData$bBox$off2.left,
          left = _elementData$bBox$off3 === void 0 ? 0 : _elementData$bBox$off3,
          _elementData$bBox$off4 = _elementData$bBox$off2.top,
          top = _elementData$bBox$off4 === void 0 ? 0 : _elementData$bBox$off4;
        var _resizeBox3 = resizeBox({
            width: boxWidth,
            height: boxHeight,
            dx: dx,
            dy: dy,
            doW: doW,
            doH: doH,
            proportions: proportions,
            flip: false
          }),
          _resizeBox4 = _slicedToArray(_resizeBox3, 4),
          scaleX = _resizeBox4[0],
          scaleY = _resizeBox4[1],
          newWidth = _resizeBox4[2],
          newHeight = _resizeBox4[3];
        var fixedX = boxX + boxWidth * (doH ? 0.5 : revX ? 1 : 0),
          fixedY = boxY + boxHeight * (doW ? 0.5 : revY ? 1 : 0);
        var local = composeMatrix(matrixInvert(ctm), createTranslateMatrix$1(-left, -top), controlsMatrix, createTranslateMatrix$1(fixedX, fixedY), createScaleMatrix$1(scaleX, scaleY), createTranslateMatrix$1(-fixedX, -fixedY), matrixInvert(controlsMatrix), createTranslateMatrix$1(left, top), ctm);
        var toOrigin = createTranslateMatrix$1(origin[0], origin[1]),
          fromOrigin = createTranslateMatrix$1(-origin[0], -origin[1]);
        var isAxisAligned = local[0][0] > 0 && local[1][1] > 0 && Math.abs(local[0][1]) < 1e-4 * local[0][0] && Math.abs(local[1][0]) < 1e-4 * local[1][1];
        var resultMatrix;
        if (scalable || !isAxisAligned) {
          resultMatrix = composeMatrix(matrix, fromOrigin, local, toOrigin);
          this.updateElementView(element, _objectSpread2(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))), !scalable && {
            width: "".concat(width, "px"),
            height: "".concat(height, "px")
          }));
        } else {
          this.updateElementView(element, {
            width: "".concat(width * local[0][0], "px"),
            height: "".concat(height * local[1][1], "px")
          });
          var _getTransformOrigin = getTransformOrigin(element, false),
            _getTransformOrigin2 = _slicedToArray(_getTransformOrigin, 2),
            nextOriginX = _getTransformOrigin2[0],
            nextOriginY = _getTransformOrigin2[1];
          resultMatrix = composeMatrix(createTranslateMatrix$1(-nextOriginX, -nextOriginY), toOrigin, matrix, fromOrigin, createTranslateMatrix$1(local[0][3], local[1][3]), createTranslateMatrix$1(nextOriginX, nextOriginY));
          this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
        }
        this.cacheResize(element, {
          dx: dx,
          dy: dy
        }, newWidth, newHeight);
        return {
          transform: resultMatrix,
          width: newWidth,
          height: newHeight
        };
      }

      /** @internal */
    }, {
      key: "processMove",
      value: function processMove(element, delta) {
        var data = this.storage.data;
        var elementStorage = data.get(element);
        var _this$translatedMatri = this.translatedMatrix(element, delta),
          moveElementMtrx = _this$translatedMatri.matrix,
          nx = _this$translatedMatri.nx,
          ny = _this$translatedMatri.ny;
        this.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)));
        data.set(element, _objectSpread2(_objectSpread2({}, elementStorage), {}, {
          cached: _objectSpread2(_objectSpread2({}, elementStorage.cached), {}, {
            dist: {
              dx: floatToFixed(delta.dx),
              dy: floatToFixed(delta.dy),
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
        var resultMatrix = this.rotatedMatrix(element, radians);
        if (this.options.restrict) {
          var _this$restrictHandler = this.restrictHandler(resultMatrix),
            x = _this$restrictHandler.x,
            y = _this$restrictHandler.y;
          if (isDef(x) || isDef(y)) return resultMatrix;
        }
        this.updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));
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
        var _this$storage4 = this.storage,
          cHandle = _this$storage4.handles.center,
          data = _this$storage4.data,
          transformOrigin = _this$storage4.transformOrigin,
          _this$options6 = this.options,
          container = _this$options6.container,
          scalable = _this$options6.scalable;
        var storage = data.get(element);
        var parent = storage.parent;
        var _getAbsoluteOffset = getAbsoluteOffset(element, container),
          _getAbsoluteOffset2 = _slicedToArray(_getAbsoluteOffset, 2),
          glLeft = _getAbsoluteOffset2[0],
          glTop = _getAbsoluteOffset2[1];
        var elOffsetLeft = element.offsetLeft,
          elOffsetTop = element.offsetTop;
        var _getLayoutSize = getLayoutSize(element),
          elWidth = _getLayoutSize.width,
          elHeight = _getLayoutSize.height;
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
          origin: getTransformOrigin(element, false),
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
          _this$storage5 = this.storage,
          controls = _this$storage5.controls,
          cHandle = _this$storage5.handles.center,
          oldCenter = _this$storage5.center,
          wrapper = _this$storage5.wrapper,
          transformOrigin = _this$storage5.transformOrigin,
          _this$options7 = this.options,
          container = _this$options7.container,
          restrict = _this$options7.restrict,
          isGrouped = _this$options7.isGrouped;
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
        var _ref13 = oldCenter && oldCenter.isShifted ? transformOrigin : isGrouped ? multiplyMatrixAndPoint(this.getControlsMatrix(), this.getGroupVertices().center) : [cenX + glLeft, cenY + glTop],
          _ref14 = _slicedToArray(_ref13, 2),
          globalCenterX = _ref14[0],
          globalCenterY = _ref14[1];
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
          _this$options8 = this.options,
          isGrouped = _this$options8.isGrouped,
          container = _this$options8.container;
        if (isGrouped) {
          return this.getGroupBbox();
        } else {
          var _getAbsoluteOffset5 = getAbsoluteOffset(element, container),
            _getAbsoluteOffset6 = _slicedToArray(_getAbsoluteOffset5, 2),
            offsetLeft = _getAbsoluteOffset6[0],
            offsetTop = _getAbsoluteOffset6[1];
          var elOffsetLeft = element.offsetLeft,
            elOffsetTop = element.offsetTop;
          var _getLayoutSize2 = getLayoutSize(element),
            elWidth = _getLayoutSize2.width,
            elHeight = _getLayoutSize2.height;
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
      value: function processControlsMove(_ref15) {
        var dx = _ref15.dx,
          dy = _ref15.dy;
        var _this$storage6 = this.storage,
          _this$storage6$transf = _this$storage6.transform,
          controlsMatrix = _this$storage6$transf.controlsMatrix,
          wrapperMatrix = _this$storage6$transf.wrapperMatrix,
          center = _this$storage6.center,
          transformOrigin = _this$storage6.transformOrigin;
        var moveControlsMtrx = multiplyMatrix(controlsMatrix, createTranslateMatrix$1(dx, dy));
        this.updateControlsView(moveControlsMtrx);
        var centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));
        var _multiplyMatrixAndPoi11 = multiplyMatrixAndPoint(centerTransformMatrix, [dx, dy, 0, 1]),
          _multiplyMatrixAndPoi12 = _slicedToArray(_multiplyMatrixAndPoi11, 2),
          cx = _multiplyMatrixAndPoi12[0],
          cy = _multiplyMatrixAndPoi12[1];
        if (center.isShifted) {
          var _multiplyMatrixAndPoi13 = multiplyMatrixAndPoint(dropTranslate(matrixInvert(controlsMatrix)), [dx, dy, 0, 1]),
            _multiplyMatrixAndPoi14 = _slicedToArray(_multiplyMatrixAndPoi13, 2),
            hx = _multiplyMatrixAndPoi14[0],
            hy = _multiplyMatrixAndPoi14[1];
          this.moveCenterHandle(-hx, -hy, false);
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
      value: function processControlsRotate(_ref16) {
        var radians = _ref16.radians;
        var _this$storage7 = this.storage,
          _this$storage7$transf = _this$storage7.transform,
          wrapperMatrix = _this$storage7$transf.wrapperMatrix,
          controlsMatrix = _this$storage7$transf.controlsMatrix,
          _this$storage7$transf2 = _slicedToArray(_this$storage7.transformOrigin, 2),
          originX = _this$storage7$transf2[0],
          originY = _this$storage7$transf2[1];
        var transformMatrix = conjugate(rotation(radians), wrapperMatrix);
        var rotateResultMatrix = multiplyMatrix(multiplyMatrix(createTranslateMatrix$1(-originX, -originY), transformMatrix), createTranslateMatrix$1(originX, originY));
        this.updateControlsView(multiplyMatrix(controlsMatrix, rotateResultMatrix));
      }

      /** @internal */
    }, {
      key: "moveCenterHandle",
      value: function moveCenterHandle(x, y) {
        var updateTransformOrigin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var _this$storage8 = this.storage,
          center = _this$storage8.handles.center,
          matrix = _this$storage8.center.matrix,
          prevCenterData = _this$storage8.center,
          transformOrigin = _this$storage8.transformOrigin,
          _this$storage8$transf = _this$storage8.transform,
          _this$storage8$transf2 = _this$storage8$transf === void 0 ? {} : _this$storage8$transf,
          controlsMatrix = _this$storage8$transf2.controlsMatrix;
        var _ref17 = controlsMatrix ? multiplyMatrixAndPoint(dropTranslate(controlsMatrix), [x, y, 0, 1]) : [x, y],
          _ref18 = _slicedToArray(_ref17, 2),
          originDx = _ref18[0],
          originDy = _ref18[1];
        var translateMatrix = createTranslateMatrix$1(x, y);
        var resultMatrix = multiplyMatrix(matrix, translateMatrix);
        helper(center).css(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))));
        this.storage = _objectSpread2(_objectSpread2({}, this.storage), {}, {
          center: _objectSpread2(_objectSpread2({}, prevCenterData), {}, {
            isShifted: true
          })
        }, updateTransformOrigin ? {
          cached: {
            transformOrigin: multiplyMatrixAndPoint(createTranslateMatrix$1(originDx, originDy), transformOrigin)
          }
        } : {});
      }

      /** @internal */
    }, {
      key: "processMoveRestrict",
      value: function processMoveRestrict(element, delta) {
        return this.restrictHandler(this.translatedMatrix(element, delta).matrix);
      }

      /** @internal */
    }, {
      key: "processRotateRestrict",
      value: function processRotateRestrict(element, radians) {
        return this.restrictHandler(this.rotatedMatrix(element, radians));
      }

      /** @internal */
    }, {
      key: "processResizeRestrict",
      value: function processResizeRestrict(element, delta) {
        return this.restrictHandler(this.resizeResult(element, delta).resultMatrix);
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
          _this$options9 = this.options,
          isGrouped = _this$options9.isGrouped,
          rotatable = _this$options9.rotatable,
          rotatorAnchor = _this$options9.rotatorAnchor,
          rotatorOffset = _this$options9.rotatorOffset;
        var vertices = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, transformMatrix);
        if (!rotatable) return vertices;
        var _rotatorPlacement = rotatorPlacement(toPoints(vertices), rotatorAnchor, rotatorOffset),
          anchor = _rotatorPlacement.anchor,
          rotator = _rotatorPlacement.rotator;
        vertices.rotator = [rotator.x, rotator.y];
        vertices.anchor = anchor;
        return vertices;
      }

      /** @internal */
    }, {
      key: "getElementVertices",
      value: function getElementVertices(element, transformMatrix) {
        var container = this.options.container;
        var _getAbsoluteOffset7 = getAbsoluteOffset(element, container),
          _getAbsoluteOffset8 = _slicedToArray(_getAbsoluteOffset7, 2),
          offsetLeft = _getAbsoluteOffset8[0],
          offsetTop = _getAbsoluteOffset8[1];
        var _getLayoutSize3 = getLayoutSize(element),
          width = _getLayoutSize3.width,
          height = _getLayoutSize3.height;
        var ctm = getCurrentTransformMatrix(element, container);
        return mapVertices(boxVertices({
          x: 0,
          y: 0,
          width: width,
          height: height
        }), function (vertex) {
          var _multiplyMatrixAndPoi15 = multiplyMatrixAndPoint(ctm, vertex),
            _multiplyMatrixAndPoi16 = _slicedToArray(_multiplyMatrixAndPoi15, 4),
            x = _multiplyMatrixAndPoi16[0],
            y = _multiplyMatrixAndPoi16[1],
            z = _multiplyMatrixAndPoi16[2],
            w = _multiplyMatrixAndPoi16[3];
          return multiplyMatrixAndPoint(transformMatrix, [x + offsetLeft, y + offsetTop, z, w]);
        });
      }

      /** @internal */
    }, {
      key: "getGroupVertices",
      value: function getGroupVertices() {
        return toVectors(boxVertices(this.getGroupBbox()));
      }

      /** @internal */
    }, {
      key: "getGroupBbox",
      value: function getGroupBbox() {
        var elements = this.elements,
          container = this.options.container;
        var toControls = matrixInvert(this.getControlsMatrix());
        var points = elements.reduce(function (result, element) {
          var _getAbsoluteOffset9 = getAbsoluteOffset(element, container),
            _getAbsoluteOffset0 = _slicedToArray(_getAbsoluteOffset9, 2),
            left = _getAbsoluteOffset0[0],
            top = _getAbsoluteOffset0[1];
          return [].concat(_toConsumableArray(result), _toConsumableArray(bBoxPoints$1(element, container, getCurrentTransformMatrix(element, container), _objectSpread2(_objectSpread2({}, getLayoutSize(element)), {}, {
            offset: {
              left: left,
              top: top
            }
          }))));
        }, []).map(function (vertex) {
          return multiplyMatrixAndPoint(toControls, vertex);
        });
        var _getMinMaxOfArray = getMinMaxOfArray(points),
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
      key: "applyTransformToHandles",
      value: function applyTransformToHandles() {
        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref19$boxMatrix = _ref19.boxMatrix,
          boxMatrix = _ref19$boxMatrix === void 0 ? createIdentityMatrix() : _ref19$boxMatrix;
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
        var _this$getVertices2 = this.getVertices(multiplyMatrix(boxMatrix, matrixInvert(controlsMatrix))),
          _this$getVertices2$an = _this$getVertices2.anchor,
          anchor = _this$getVertices2$an === void 0 ? null : _this$getVertices2$an,
          center = _this$getVertices2.center,
          vertices = _objectWithoutProperties(_this$getVertices2, _excluded2$1);
        var normal = rotatable && showNormal ? [[anchor.x, anchor.y], vertices.rotator] : null;
        var lines = _objectSpread2(_objectSpread2({}, edgeSegments(vertices)), normal && {
          normal: normal
        });
        entries$3(lines).forEach(function (_ref20) {
          var _ref21 = _slicedToArray(_ref20, 2),
            key = _ref21[0],
            _ref21$ = _slicedToArray(_ref21[1], 2),
            from = _ref21$[0],
            to = _ref21$[1];
          return helper(handles[key]).css(lineStyle(from, to));
        });
        var allHandles = _objectSpread2(_objectSpread2(_objectSpread2({}, resizable && vertices), rotatable && {
          rotator: vertices.rotator
        }), !isShifted && Boolean(center) && {
          center: center
        });
        entries$3(allHandles).forEach(function (_ref22) {
          var _ref23 = _slicedToArray(_ref22, 2),
            key = _ref23[0],
            point = _ref23[1];
          var hdl = handles[key];
          if (isUndef(point) || isUndef(hdl)) return;
          helper(hdl).css({
            transform: "translate(".concat(point[0], "px, ").concat(point[1], "px)")
          });
        });
        return allHandles;
      }
    }, {
      key: "setTransformOrigin",
      value: function setTransformOrigin() {
        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref24.x,
          y = _ref24.y,
          dx = _ref24.dx,
          dy = _ref24.dy;
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
        var _getAbsoluteOffset1 = getAbsoluteOffset(element, container),
          _getAbsoluteOffset10 = _slicedToArray(_getAbsoluteOffset1, 2),
          offsetLeft = _getAbsoluteOffset10[0],
          offsetTop = _getAbsoluteOffset10[1];
        if (isRelative) {
          var offsetHeight = element.offsetHeight,
            offsetWidth = element.offsetWidth;
          var relX = -dx + offsetWidth / 2;
          var relY = -dy + offsetHeight / 2;
          var _multiplyMatrixAndPoi17 = multiplyMatrixAndPoint(matrix, [relX, relY, 0, 1]);
          var _multiplyMatrixAndPoi18 = _slicedToArray(_multiplyMatrixAndPoi17, 2);
          newX = _multiplyMatrixAndPoi18[0];
          newY = _multiplyMatrixAndPoi18[1];
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
        var _multiplyMatrixAndPoi19 = multiplyMatrixAndPoint(controlsMatrix, [originX, originY, 0, 1]),
          _multiplyMatrixAndPoi20 = _slicedToArray(_multiplyMatrixAndPoi19, 2),
          dx = _multiplyMatrixAndPoi20[0],
          dy = _multiplyMatrixAndPoi20[1];
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
        return bBoxPoints$1(element, restrictEl, getCurrentTransformMatrix(element, restrictEl, transformMatrix), nextBox);
      }
    }, {
      key: "applyAlignment",
      value: function applyAlignment(direction) {
        var _this4 = this;
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var elements = this.elements,
          container = this.options.container;
        var _this$getVertices3 = this.getVertices();
          _this$getVertices3.anchor;
          _this$getVertices3.rotator;
          _this$getVertices3.center;
          var vertices = _objectWithoutProperties(_this$getVertices3, _excluded3$1);
        var restrictBBox = target ? bBoxPoints$1(target, container, getCurrentTransformMatrix(target, container)) : this.getRestrictedBBox(true);
        var _alignmentOffset = alignmentOffset(direction, getMinMaxOfArray(restrictBBox), getMinMaxOfArray(values$1(vertices))),
          _alignmentOffset2 = _slicedToArray(_alignmentOffset, 2),
          offsetX = _alignmentOffset2[0],
          offsetY = _alignmentOffset2[1];
        var _multiplyMatrixAndPoi21 = multiplyMatrixAndPoint(matrixInvert(dropTranslate(getCurrentTransformMatrix(elements[0].parentNode, container))), [offsetX, offsetY, 0, 1]),
          _multiplyMatrixAndPoi22 = _slicedToArray(_multiplyMatrixAndPoi21, 2),
          x = _multiplyMatrixAndPoi22[0],
          y = _multiplyMatrixAndPoi22[1];
        var moveElementMtrx = multiplyMatrix(getTransform(elements[0]), createTranslateMatrix$1(x, y));
        elements.forEach(function (element) {
          return _this4.updateElementView(element, matrixToCSS(flatMatrix(moveElementMtrx)));
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
        var vertices = isGrouped ? this.getGroupVertices() : this.getElementVertices(element, createIdentityMatrix());
        var controlsMatrix = this.getControlsMatrix();
        var _map = [vertices.tl, vertices.tr, vertices.br].map(function (_ref25) {
            var _ref26 = _slicedToArray(_ref25, 2),
              x = _ref26[0],
              y = _ref26[1];
            return isGrouped ? multiplyMatrixAndPoint(controlsMatrix, [x, y, 0, 1]) : [x, y];
          }),
          _map2 = _slicedToArray(_map, 3),
          tl = _map2[0],
          tr = _map2[1],
          br = _map2[2];
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
  var createRotationMatrix = function createRotationMatrix(radians) {
    return createRotateMatrix(floatToFixed(Math.sin(radians)), floatToFixed(Math.cos(radians)));
  };
  var scaleAround = function scaleAround(translateMatrix, scaleX, scaleY) {
    return translateMatrix.multiply(createScaleMatrix(scaleX, scaleY)).multiply(translateMatrix.inverse());
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
  var childLocalMatrix = function childLocalMatrix(childCTM, transformMatrix) {
    return childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
  };
  var groupedChildMatrix = function groupedChildMatrix(_ref3, transformMatrix) {
    var matrix = _ref3.matrix,
      childCTM = _ref3.childCTM;
    return matrix.multiply(childLocalMatrix(childCTM, transformMatrix));
  };
  var isAxisAligned = function isAxisAligned(matrix) {
    return Math.abs(matrix.b) < 1e-6 && Math.abs(matrix.c) < 1e-6;
  };
  var keepFixedPoint = function keepFixedPoint(scale, translate, actualStart, actualSize, targetStart, targetSize) {
    if (Math.abs(1 - scale) < 1e-6 || !targetSize) return 0;
    var fixed = translate / (1 - scale);
    var ratio = (fixed - targetStart) / targetSize;
    return fixed - (actualStart + ratio * actualSize);
  };

  var svgMatrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arrayToChunks: arrayToChunks,
    checkChildElements: _checkChildElements,
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

  var entries$2 = Object.entries;
  var ORIGIN_COLOR = '#fe3232';
  var GUIDE_COLOR = '#ff3d9a';
  var setAttributes = function setAttributes(element, attrs) {
    entries$2(attrs).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        value = _ref2[1];
      return element.setAttribute(attr, String(value));
    });
  };
  var createHandler = function createHandler(left, top, color, key) {
    var handler = createSVGElement('circle', ['sjx-svg-hdl', "sjx-svg-hdl-".concat(key)]);
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
  var renderLine = function renderLine(_ref3, color, key) {
    var _ref4 = _slicedToArray(_ref3, 2),
      b = _ref4[0],
      e = _ref4[1];
    var handler = createSVGElement('line', ['sjx-svg-line', "sjx-svg-line-".concat(key)]);
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
  var setLineStyle = function setLineStyle(line, color) {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-dasharray', '3 3');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
  };
  var renderRadius = function renderRadius(from, to) {
    var radius = createSVGElement('line', ['sjx-hidden']);
    radius.x1.baseVal.value = from.x;
    radius.y1.baseVal.value = from.y;
    radius.x2.baseVal.value = to.x;
    radius.y2.baseVal.value = to.y;
    setLineStyle(radius, ORIGIN_COLOR);
    radius.setAttribute('opacity', '0.5');
    return radius;
  };
  var createHitArea = function createHitArea(key) {
    var area = createSVGElement('path', ['sjx-svg-hit', "sjx-svg-hit-".concat(key), EDGE_KEYS.includes(key) ? 'sjx-svg-hit-edge' : 'sjx-svg-hit-handle']);
    area.setAttribute('data-sjx-handle', key);
    area.setAttribute('fill', 'transparent');
    return area;
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
  var createGuideLine = function createGuideLine(_ref5) {
    var axis = _ref5.axis,
      value = _ref5.value,
      from = _ref5.from,
      to = _ref5.to;
    var line = createSVGElement('line', ['sjx-svg-guide']);
    var _ref6 = axis === 'x' ? [value, from, value, to] : [from, value, to, value],
      _ref7 = _slicedToArray(_ref6, 4),
      x1 = _ref7[0],
      y1 = _ref7[1],
      x2 = _ref7[2],
      y2 = _ref7[3];
    setAttributes(line, {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: GUIDE_COLOR,
      'stroke-width': 1,
      'vector-effect': 'non-scaling-stroke',
      'pointer-events': 'none'
    });
    return line;
  };
  var screenScale = function screenScale(element) {
    var matrix = element.getScreenCTM();
    return matrix ? Math.sqrt(Math.abs(matrix.a * matrix.d - matrix.b * matrix.c)) || 1 : 1;
  };

  var entries$1 = Object.entries;
  var transformVertices = function transformVertices(vertices, matrix) {
    return entries$1(vertices).reduce(function (result, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        _ref2$ = _slicedToArray(_ref2[1], 2),
        x = _ref2$[0],
        y = _ref2$[1];
      result[key] = pointTo(matrix, x, y);
      return result;
    }, {});
  };
  var bBoxPoints = function bBoxPoints(element, ctm) {
    var bBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : element.getBBox();
    var x = bBox.x,
      y = bBox.y,
      width = bBox.width,
      height = bBox.height;
    return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]].map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        l = _ref4[0],
        t = _ref4[1];
      var _pointTo = pointTo(ctm, l, t),
        nx = _pointTo.x,
        ny = _pointTo.y;
      return [nx, ny];
    });
  };
  var lineRotator = function lineRotator(start, end, rotatorAnchor, rotatorOffset) {
    var axisX = end.x - start.x,
      axisY = end.y - start.y;
    var length = Math.sqrt(axisX * axisX + axisY * axisY);
    var _ref5 = length ? [axisY / length, -axisX / length] : [0, -1],
      _ref6 = _slicedToArray(_ref5, 2),
      normalX = _ref6[0],
      normalY = _ref6[1];
    var side = rotatorAnchor === 's' || rotatorAnchor === 'w' ? -1 : 1;
    var anchor = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
    return {
      anchor: anchor,
      rotator: {
        x: anchor.x + normalX * rotatorOffset * side,
        y: anchor.y + normalY * rotatorOffset * side
      }
    };
  };

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

  var applyTranslate = function applyTranslate(element, _ref) {
    var x = _ref.x,
      y = _ref.y;
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
    attrs.forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        name = _ref3[0],
        value = _ref3[1];
      return element.setAttribute(name, String(value));
    });
  };
  var translateElement = function translateElement(element, _ref4, _ref5) {
    var matrix = _ref4.matrix,
      parentMatrix = _ref4.parentMatrix;
    var dx = _ref5.dx,
      dy = _ref5.dy,
      ox = _ref5.ox,
      oy = _ref5.oy;
    var eM = createTranslateMatrix(ox, oy);
    element.setAttribute('transform', matrixToString(eM.multiply(matrix).multiply(eM.inverse())));
    if (!isSVGGroup(element)) {
      applyTranslate(element, {
        x: ox,
        y: oy
      });
      return;
    }
    _checkChildElements(element).forEach(function (child) {
      var childM = createTranslateMatrix(dx, dy);
      var translateMatrix = childM.multiply(getTransformToElement(child, child.parentNode)).multiply(childM.inverse());
      if (!isIdentity(translateMatrix)) {
        child.setAttribute('transform', matrixToString(translateMatrix));
      }
      if (!isSVGGroup(child)) {
        var ctm = parentMatrix.inverse();
        ctm.e = ctm.f = 0;
        applyTranslate(child, pointTo(ctm, ox, oy));
      }
    });
  };

  var applyResize = function applyResize(element, data) {
    var scaleX = data.scaleX,
      scaleY = data.scaleY,
      localCTM = data.localCTM,
      __data__ = data.__data__,
      transformMatrix = data.transformMatrix,
      isGrouped = data.isGrouped;
    var attrs = [];
    var storedData = __data__.get(element);
    switch (element.tagName.toLowerCase()) {
      case 'text':
      case 'tspan':
        {
          if (isGrouped && element.tagName.toLowerCase() === 'text') {
            attrs.push(['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]);
            break;
          }
          var x = storedData.x,
            y = storedData.y,
            textLength = storedData.textLength,
            fontSize = storedData.fontSize,
            textBox = storedData.textBox;
          var absX = Math.abs(scaleX),
            absY = Math.abs(scaleY);
          var corners = [[textBox.x, textBox.y], [textBox.x + textBox.width, textBox.y + textBox.height]].map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              px = _ref2[0],
              py = _ref2[1];
            return pointTo(localCTM, px, py);
          });
          var left = Math.min(corners[0].x, corners[1].x),
            top = Math.min(corners[0].y, corners[1].y);
          var textElement = element;
          var nextFontSize = fontSize * absY;
          if (textElement.style.fontSize) {
            textElement.style.fontSize = "".concat(nextFontSize, "px");
          } else {
            textElement.setAttribute('font-size', String(nextFontSize));
          }
          textElement.setAttribute('textLength', String(absX * textLength));
          textElement.setAttribute('lengthAdjust', 'spacingAndGlyphs');
          var nextX = left + (x - textBox.x) * absX,
            nextY = top + (y - textBox.y) * absY;
          textElement.setAttribute('x', String(nextX));
          textElement.setAttribute('y', String(nextY));
          var actual = textElement.getBBox();
          attrs.push(['x', nextX + keepFixedPoint(localCTM.a, localCTM.e, actual.x, actual.width, left, textBox.width * absX)], ['y', nextY + keepFixedPoint(localCTM.d, localCTM.f, actual.y, actual.height, top, textBox.height * absY)]);
          break;
        }
      case 'circle':
        {
          var r = storedData.r,
            cx = storedData.cx,
            cy = storedData.cy,
            newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
          var _pointTo = pointTo(localCTM, cx, cy),
            resX = _pointTo.x,
            resY = _pointTo.y;
          attrs.push(['r', newR], ['cx', resX], ['cy', resY]);
          break;
        }
      case 'foreignobject':
      case 'image':
      case 'rect':
        {
          if (!isGrouped) {
            var width = storedData.width,
              height = storedData.height,
              _x = storedData.x,
              _y = storedData.y;
            var _pointTo2 = pointTo(localCTM, _x, _y),
              _resX = _pointTo2.x,
              _resY = _pointTo2.y;
            var newWidth = Math.abs(width * scaleX),
              newHeight = Math.abs(height * scaleY);
            attrs.push(['x', _resX - (scaleX < 0 ? newWidth : 0)], ['y', _resY - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
          } else {
            var local = childLocalMatrix(storedData.childCTM, transformMatrix);
            if (!isAxisAligned(local)) {
              attrs.push(['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]);
              break;
            }
            var _width = storedData.width,
              _height = storedData.height,
              _x2 = storedData.x,
              _y2 = storedData.y;
            var start = pointTo(local, _x2, _y2),
              end = pointTo(local, _x2 + _width, _y2 + _height);
            attrs.push(['x', Math.min(start.x, end.x)], ['y', Math.min(start.y, end.y)], ['width', Math.abs(end.x - start.x)], ['height', Math.abs(end.y - start.y)]);
          }
          break;
        }
      case 'ellipse':
        {
          var rx = storedData.rx,
            ry = storedData.ry,
            _cx = storedData.cx,
            _cy = storedData.cy;
          var _pointTo3 = pointTo(localCTM, _cx, _cy),
            cx1 = _pointTo3.x,
            cy1 = _pointTo3.y;
          var scaleMatrix = createSVGMatrix();
          scaleMatrix.a = scaleX;
          scaleMatrix.d = scaleY;
          var _pointTo4 = pointTo(scaleMatrix, rx, ry),
            nRx = _pointTo4.x,
            nRy = _pointTo4.y;
          attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
          break;
        }
      case 'line':
        {
          var resX1 = storedData.resX1,
            resY1 = storedData.resY1,
            resX2 = storedData.resX2,
            resY2 = storedData.resY2;
          var _pointTo5 = pointTo(localCTM, resX1, resY1),
            resX1_ = _pointTo5.x,
            resY1_ = _pointTo5.y;
          var _pointTo6 = pointTo(localCTM, resX2, resY2),
            resX2_ = _pointTo6.x,
            resY2_ = _pointTo6.y;
          attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
          break;
        }
      case 'polygon':
      case 'polyline':
        {
          var points = storedData.points;
          var result = parsePoints(points).map(function (item) {
            var _pointTo7 = pointTo(localCTM, Number(item[0]), Number(item[1])),
              x = _pointTo7.x,
              y = _pointTo7.y;
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
    attrs.forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        name = _ref4[0],
        value = _ref4[1];
      return element.setAttribute(name, String(value));
    });
  };
  var resizeElement = function resizeElement(element, params) {
    var transformMatrix = params.transformMatrix,
      isGrouped = params.isGrouped;
    if (!isSVGGroup(element) && !isGrouped) {
      applyResize(element, _objectSpread2(_objectSpread2({}, params), {}, {
        localCTM: transformMatrix
      }));
      return;
    }
    _checkChildElements(element).forEach(function (child) {
      if (isSVGGroup(child)) return;
      var childCTM = getTransformToElement(child, isGrouped ? element.parentNode : element);
      applyResize(child, _objectSpread2(_objectSpread2({}, params), {}, {
        localCTM: childCTM.inverse().multiply(transformMatrix).multiply(childCTM)
      }));
    });
  };

  var readAttributes = function readAttributes(element, container, isGrouped) {
    var data = null;
    switch (element.tagName.toLowerCase()) {
      case 'text':
        {
          var el = element;
          var x = isDef(el.x.baseVal[0]) ? el.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
          var y = isDef(el.y.baseVal[0]) ? el.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
          var textLength = isDef(el.textLength.baseVal) ? el.textLength.baseVal.value : Number(element.getAttribute('textLength')) || null;
          var _el$getBBox = el.getBBox(),
            bx = _el$getBBox.x,
            by = _el$getBBox.y,
            width = _el$getBBox.width,
            height = _el$getBBox.height;
          var fontSize = parseFloat(getComputedStyle(el).fontSize);
          data = {
            x: x,
            y: y,
            textLength: textLength,
            fontSize: fontSize,
            textBox: {
              x: bx,
              y: by,
              width: width,
              height: height
            }
          };
          break;
        }
      case 'circle':
        {
          var _el = element;
          var r = _el.r.baseVal.value,
            cx = _el.cx.baseVal.value,
            cy = _el.cy.baseVal.value;
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
          var _el2 = element;
          var _width = _el2.width.baseVal.value,
            _height = _el2.height.baseVal.value,
            _x = _el2.x.baseVal.value,
            _y = _el2.y.baseVal.value;
          data = {
            width: _width,
            height: _height,
            x: _x,
            y: _y
          };
          break;
        }
      case 'ellipse':
        {
          var _el3 = element;
          var rx = _el3.rx.baseVal.value,
            ry = _el3.ry.baseVal.value,
            _cx = _el3.cx.baseVal.value,
            _cy = _el3.cy.baseVal.value;
          data = {
            rx: rx,
            ry: ry,
            cx: _cx,
            cy: _cy
          };
          break;
        }
      case 'line':
        {
          var _el4 = element;
          var resX1 = _el4.x1.baseVal.value,
            resY1 = _el4.y1.baseVal.value,
            resX2 = _el4.x2.baseVal.value,
            resY2 = _el4.y2.baseVal.value;
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
    return _objectSpread2(_objectSpread2({}, data), {}, {
      matrix: getTransformToElement(element, element.parentNode),
      ctm: getTransformToElement(element.parentNode, container),
      childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
    });
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
  var entries = Object.entries,
    values = Object.values;
  var BOX_HANDLES = ['tl', 'tr', 'br', 'bl', 'tc', 'bc', 'ml', 'mr'];
  var LINE_HANDLES = [START_POINT, END_POINT];
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
          rotatable = _this$options.rotatable,
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
        var _this$getVertices = this.getVertices(),
          _this$getVertices$rot = _this$getVertices.rotator,
          rotator = _this$getVertices$rot === void 0 ? null : _this$getVertices$rot,
          _this$getVertices$anc = _this$getVertices.anchor,
          anchor = _this$getVertices$anc === void 0 ? null : _this$getVertices$anc,
          vertices = _objectWithoutProperties(_this$getVertices, _excluded);
        var origin = Array.isArray(transformOrigin) ? pointTo(createSVGMatrix(), transformOrigin[0], transformOrigin[1]) : vertices.center;
        var rotationHandles = rotatable ? this.renderRotationHandles(controls, [anchor, rotator], vertices.center, origin) : {};
        var edgeHandles = this.renderEdges(controls, vertices, hitAreas);
        var pointHandles = this.renderPoints(controls, _objectSpread2(_objectSpread2({}, this.resizingPoints(vertices)), {}, {
          rotator: rotator,
          center: transformOrigin && rotatable ? origin : undefined
        }), hitAreas);
        wrapper.appendChild(controls);
        controlsContainer.appendChild(wrapper);
        var data = new WeakMap();
        elements.forEach(function (element) {
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
          handles: _objectSpread2(_objectSpread2(_objectSpread2({}, edgeHandles), pointHandles), rotationHandles),
          data: data,
          center: {
            isShifted: Array.isArray(transformOrigin)
          },
          transformOrigin: origin,
          transform: {
            containerMatrix: getTransformToElement(restrictContainer, restrictContainer.parentNode)
          },
          cached: {},
          hitAreas: hitAreas,
          hitOverlay: hitOverlay
        };
        if (this.storage.center.isShifted) this.anchorOrigin(origin);
        this.syncHitAreas();
        [].concat(_toConsumableArray(elements), [controls]).forEach(function (target) {
          return helper(target).on(E_MOUSEDOWN$1, _this.onMouseDown).on(E_TOUCHSTART$1, _this.onTouchStart);
        });
      }

      /** @internal */
    }, {
      key: "renderRotationHandles",
      value: function renderRotationHandles(controls, normalPoints, center, origin) {
        var _this$options2 = this.options,
          showNormal = _this$options2.showNormal,
          transformOrigin = _this$options2.transformOrigin;
        var normal = showNormal ? renderLine(normalPoints, THEME_COLOR, 'normal') : null;
        if (normal) controls.appendChild(normal);
        var radius = transformOrigin ? renderRadius(center, origin) : null;
        if (radius) controls.appendChild(radius);
        return {
          normal: normal,
          radius: radius
        };
      }

      /** @internal */
    }, {
      key: "renderEdges",
      value: function renderEdges(controls, vertices, hitAreas) {
        var _this2 = this;
        var hitRadius = this.options.hitRadius;
        var line = this.getLine();
        var handles = {};
        entries(edgeSegments(vertices)).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            segment = _ref2[1];
          var edge = renderLine(segment, THEME_COLOR, key);
          var isEnabled = !line && _this2.isHandleEnabled(key);
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
    }, {
      key: "resizingPoints",
      value: function resizingPoints(vertices) {
        var _this3 = this;
        if (!this.options.resizable) return {};
        return (this.getLine() ? LINE_HANDLES : BOX_HANDLES).filter(function (key) {
          return _this3.isHandleEnabled(key);
        }).reduce(function (result, key) {
          result[key] = vertices[key];
          return result;
        }, {});
      }

      /** @internal */
    }, {
      key: "renderPoints",
      value: function renderPoints(controls, points, hitAreas) {
        var hitRadius = this.options.hitRadius;
        var handles = {};
        entries(points).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            point = _ref4[1];
          if (!point) return;
          var handle = createHandler(point.x, point.y, key === 'center' ? ORIGIN_COLOR : THEME_COLOR, key);
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
    }, {
      key: "cursorPoint",
      value: function cursorPoint(_ref5) {
        var clientX = _ref5.clientX,
          clientY = _ref5.clientY;
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
          _this$options3 = this.options,
          _this$options4 = _this$options3 === void 0 ? {} : _this$options3,
          container = _this$options4.container,
          restrict = _this$options4.restrict;
        var restrictEl = restrict || container;
        return bBoxPoints(restrictEl, force ? getTransformToElement(restrictEl, container) : containerMatrix);
      }

      /** @internal */
    }, {
      key: "pointToTransform",
      value: function pointToTransform(_ref6) {
        var x = _ref6.x,
          y = _ref6.y,
          matrix = _ref6.matrix;
        var nextMatrix = matrix.inverse();
        nextMatrix.e = nextMatrix.f = 0;
        return this.applyMatrixToPoint(nextMatrix, x, y);
      }

      /** @internal */
    }, {
      key: "pointToControls",
      value: function pointToControls(_ref7) {
        var x = _ref7.x,
          y = _ref7.y;
        var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
        var matrix = transform.controlsMatrix.inverse();
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
          _this$options5 = this.options,
          _this$options6 = _this$options5 === void 0 ? {} : _this$options5,
          isGrouped = _this$options6.isGrouped,
          scalable = _this$options6.scalable,
          applyTranslate = _this$options6.applyTranslate;
        var _ref8 = data.get(element),
          _ref8$cached = _ref8.cached,
          cached = _ref8$cached === void 0 ? {} : _ref8$cached,
          nextData = _objectWithoutProperties(_ref8, _excluded2);
        var transform = nextData.transform,
          __data__ = nextData.__data__;
        var _ref9 = cached,
          scaleX = _ref9.scaleX,
          scaleY = _ref9.scaleY,
          dist = _ref9.dist,
          transformMatrix = _ref9.transformMatrix;
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
              transformMatrix: transformMatrix,
              bBox: bBox,
              __data__: __data__,
              isGrouped: isGrouped
            });
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
          var _pointTo = pointTo(controlsMatrix, 0, 0),
            dx = _pointTo.x,
            dy = _pointTo.y;
          if (isShifted) this.moveCenterHandle(dx, dy);
          this.updateControlsView();
          if (!isShifted) this.setTransformOrigin({
            dx: 0,
            dy: 0
          }, false);
        }
        if (this.storage.center.isShifted) {
          this.anchorOrigin(this.storage.cached.transformOrigin || this.storage.transformOrigin);
        }
      }

      /** @internal */
    }, {
      key: "anchorOrigin",
      value: function anchorOrigin(point) {
        var elements = this.elements,
          _this$storage6 = this.storage,
          controls = _this$storage6.controls,
          center = _this$storage6.center,
          container = this.options.container;
        var _pointTo2 = pointTo(getTransformToElement(controls, controls.parentNode), point.x, point.y),
          x = _pointTo2.x,
          y = _pointTo2.y;
        var local = pointTo(getTransformToElement(elements[0], container).inverse(), x, y);
        center.local = {
          x: local.x,
          y: local.y
        };
      }

      /** @internal */
    }, {
      key: "anchoredOrigin",
      value: function anchoredOrigin() {
        var elements = this.elements,
          center = this.storage.center,
          container = this.options.container;
        if (!center.local) return null;
        var _pointTo3 = pointTo(getTransformToElement(elements[0], container), center.local.x, center.local.y),
          x = _pointTo3.x,
          y = _pointTo3.y;
        return {
          x: x,
          y: y
        };
      }

      /** @internal */
    }, {
      key: "resizeScale",
      value: function resizeScale(_ref0) {
        var dx = _ref0.dx,
          dy = _ref0.dy;
        var _this$storage7 = this.storage,
          doW = _this$storage7.doW,
          doH = _this$storage7.doH,
          _this$storage7$bBox = _this$storage7.bBox,
          width = _this$storage7$bBox.width,
          height = _this$storage7$bBox.height,
          _this$options7 = this.options,
          proportions = _this$options7.proportions,
          flip = _this$options7.flip;
        return resizeBox({
          width: width,
          height: height,
          dx: dx,
          dy: dy,
          doW: doW,
          doH: doH,
          proportions: proportions,
          flip: flip
        });
      }

      /** @internal */
    }, {
      key: "scaleMatrixOf",
      value: function scaleMatrixOf(element, scaleX, scaleY) {
        var translateMatrix = this.storage.data.get(element).transform.auxiliary.scale.translateMatrix;
        return scaleAround(translateMatrix, scaleX, scaleY);
      }

      /** @internal */
    }, {
      key: "rotatedMatrix",
      value: function rotatedMatrix(element, radians) {
        var _transform = this.storage.data.get(element).transform,
          matrix = _transform.matrix,
          parentMatrix = _transform.parentMatrix,
          translateMatrix = _transform.auxiliary.rotate.translateMatrix;
        parentMatrix.e = parentMatrix.f = 0;
        var localRotation = parentMatrix.inverse().multiply(createRotationMatrix(radians)).multiply(parentMatrix);
        return translateMatrix.multiply(localRotation).multiply(translateMatrix.inverse()).multiply(matrix);
      }

      /** @internal */
    }, {
      key: "parentDelta",
      value: function parentDelta(element, _ref1) {
        var dx = _ref1.dx,
          dy = _ref1.dy;
        var parentMatrix = this.storage.data.get(element).transform.auxiliary.translate.parentMatrix;
        parentMatrix.e = parentMatrix.f = 0;
        return pointTo(parentMatrix, dx, dy);
      }

      /** @internal */
    }, {
      key: "processResize",
      value: function processResize(element, delta) {
        var _this$storage8 = this.storage,
          revX = _this$storage8.revX,
          revY = _this$storage8.revY,
          doW = _this$storage8.doW,
          doH = _this$storage8.doH,
          data = _this$storage8.data,
          _this$storage8$bBox = _this$storage8.bBox,
          x = _this$storage8$bBox.x,
          y = _this$storage8$bBox.y,
          boxWidth = _this$storage8$bBox.width,
          boxHeight = _this$storage8$bBox.height,
          _this$options8 = this.options,
          isGrouped = _this$options8.isGrouped,
          scalable = _this$options8.scalable;
        var elementData = data.get(element);
        var matrix = elementData.transform.matrix,
          _elementData$cached = elementData.cached,
          cached = _elementData$cached === void 0 ? {} : _elementData$cached;
        var _this$resizeScale = this.resizeScale(delta),
          _this$resizeScale2 = _slicedToArray(_this$resizeScale, 4),
          scaleX = _this$resizeScale2[0],
          scaleY = _this$resizeScale2[1],
          newWidth = _this$resizeScale2[2],
          newHeight = _this$resizeScale2[3];
        var scaleMatrix = this.scaleMatrixOf(element, scaleX, scaleY);
        var deltaW = newWidth - boxWidth,
          deltaH = newHeight - boxHeight;
        var newX = x - deltaW * (doH ? 0.5 : revX ? 1 : 0),
          newY = y - deltaH * (doW ? 0.5 : revY ? 1 : 0);
        var resultMatrix = isGrouped ? scaleMatrix.multiply(matrix) : matrix.multiply(scaleMatrix);
        if (scalable) this.updateElementView(element, resultMatrix);
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
      value: function processMove(element, delta) {
        var data = this.storage.data;
        var elementStorage = data.get(element);
        var _elementStorage$trans = elementStorage.transform,
          matrix = _elementStorage$trans.matrix,
          translateMatrix = _elementStorage$trans.auxiliary.translate.translateMatrix,
          cached = elementStorage.cached;
        var _this$parentDelta = this.parentDelta(element, delta),
          nx = _this$parentDelta.x,
          ny = _this$parentDelta.y;
        data.set(element, _objectSpread2(_objectSpread2({}, elementStorage), {}, {
          cached: _objectSpread2(_objectSpread2({}, cached), {}, {
            dist: {
              dx: floatToFixed(delta.dx),
              dy: floatToFixed(delta.dy),
              ox: floatToFixed(nx),
              oy: floatToFixed(ny)
            }
          })
        }));
        translateMatrix.e = nx;
        translateMatrix.f = ny;
        var moveElementMtrx = translateMatrix.multiply(matrix);
        this.updateElementView(element, moveElementMtrx);
        return moveElementMtrx;
      }

      /** @internal */
    }, {
      key: "processRotate",
      value: function processRotate(element, radians) {
        var resultMatrix = this.rotatedMatrix(element, radians);
        this.updateElementView(element, resultMatrix);
        return resultMatrix;
      }

      /** @internal */
    }, {
      key: "getElementState",
      value: function getElementState(element, _ref10) {
        var revX = _ref10.revX,
          revY = _ref10.revY,
          doW = _ref10.doW,
          doH = _ref10.doH;
        var _this$options9 = this.options,
          container = _this$options9.container,
          isGrouped = _this$options9.isGrouped,
          _this$storage9 = this.storage,
          data = _this$storage9.data,
          controls = _this$storage9.controls,
          cHandle = _this$storage9.handles.center,
          _this$storage9$transf = _this$storage9.transformOrigin,
          originX = _this$storage9$transf.x,
          originY = _this$storage9$transf.y;
        var elementData = data.get(element);
        var __data__ = elementData.__data__;
        __data__.delete(element);
        _checkChildElements(element).forEach(function (child) {
          return __data__.set(child, readAttributes(child, element, isGrouped));
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
        var _ref11 = cHandle ? pointTo(parentMatrixInverted, bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : elMatrix, elCenterX, elCenterY),
          elcx = _ref11.x,
          elcy = _ref11.y;
        var _ref12 = cHandle ? pointTo(isGrouped ? parentMatrixInverted : ctm.inverse(), bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : createSVGMatrix(), scaleX, scaleY),
          nextScaleX = _ref12.x,
          nextScaleY = _ref12.y;
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
          _this$options0 = this.options,
          isGrouped = _this$options0.isGrouped,
          container = _this$options0.container,
          restrict = _this$options0.restrict,
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
          _this$options1 = this.options,
          isGrouped = _this$options1.isGrouped,
          rotatable = _this$options1.rotatable,
          rotatorAnchor = _this$options1.rotatorAnchor,
          rotatorOffset = _this$options1.rotatorOffset,
          container = _this$options1.container;
        var local = boxVertices(this.getBBox());
        var line = this.getLine();
        if (line) {
          local[START_POINT] = [line.x1.baseVal.value, line.y1.baseVal.value];
          local[END_POINT] = [line.x2.baseVal.value, line.y2.baseVal.value];
        }
        var matrix = isGrouped ? transformMatrix : transformMatrix.multiply(getTransformToElement(elements[0], container));
        var vertices = transformVertices(local, matrix);
        if (!rotatable) return vertices;
        var _ref13 = line ? lineRotator(vertices[START_POINT], vertices[END_POINT], rotatorAnchor, rotatorOffset) : rotatorPlacement(vertices, rotatorAnchor, rotatorOffset),
          anchor = _ref13.anchor,
          rotator = _ref13.rotator;
        vertices.rotator = rotator;
        vertices.anchor = anchor;
        return vertices;
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
          _this$options10 = this.options,
          container = _this$options10.container,
          isGrouped = _this$options10.isGrouped;
        if (!isGrouped) return elements[0].getBBox();
        var groupBBox = elements.reduce(function (result, element) {
          return [].concat(_toConsumableArray(result), _toConsumableArray(bBoxPoints(element, getTransformToElement(element, container))));
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
      value: function processMoveRestrict(element, delta) {
        var matrix = this.storage.data.get(element).transform.matrix;
        var _this$parentDelta2 = this.parentDelta(element, delta),
          x = _this$parentDelta2.x,
          y = _this$parentDelta2.y;
        return this.restrictHandler(element, createTranslateMatrix(x, y).multiply(matrix));
      }

      /** @internal */
    }, {
      key: "processRotateRestrict",
      value: function processRotateRestrict(element, radians) {
        return this.restrictHandler(element, this.rotatedMatrix(element, radians));
      }

      /** @internal */
    }, {
      key: "processResizeRestrict",
      value: function processResizeRestrict(element, delta) {
        var matrix = this.storage.data.get(element).transform.matrix;
        var _this$resizeScale3 = this.resizeScale(delta),
          _this$resizeScale4 = _slicedToArray(_this$resizeScale3, 2),
          scaleX = _this$resizeScale4[0],
          scaleY = _this$resizeScale4[1];
        return this.restrictHandler(element, matrix.multiply(this.scaleMatrixOf(element, scaleX, scaleY)));
      }

      /** @internal */
    }, {
      key: "processPointMove",
      value: function processPointMove(element, point, _ref14) {
        var dx = _ref14.dx,
          dy = _ref14.dy;
        var _this$storage10 = this.storage,
          data = _this$storage10.data,
          restriction = _this$storage10.restriction,
          proportions = this.options.proportions;
        var _ref15 = data.get(element),
          _ref15$transform = _ref15.transform,
          ctm = _ref15$transform.ctm,
          matrix = _ref15$transform.matrix,
          __data__ = _ref15.__data__;
        var _ref16 = __data__.get(element),
          resX1 = _ref16.resX1,
          resY1 = _ref16.resY1,
          resX2 = _ref16.resX2,
          resY2 = _ref16.resY2;
        var isStart = point === START_POINT;
        var _ref17 = isStart ? [resX1, resY1, resX2, resY2] : [resX2, resY2, resX1, resY1],
          _ref18 = _slicedToArray(_ref17, 4),
          baseX = _ref18[0],
          baseY = _ref18[1],
          otherX = _ref18[2],
          otherY = _ref18[3];
        var toLocal = ctm.inverse();
        toLocal.e = toLocal.f = 0;
        var _pointTo7 = pointTo(toLocal, dx, dy),
          localDx = _pointTo7.x,
          localDy = _pointTo7.y;
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
          var _pointTo8 = pointTo(ctm, nextX, nextY),
            x = _pointTo8.x,
            y = _pointTo8.y;
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
        var _this$storage11 = this.storage,
          _this$storage12 = _this$storage11 === void 0 ? {} : _this$storage11,
          controlsMatrix = _this$storage12.transform.controlsMatrix;
        this.applyTransformToHandles({
          boxMatrix: controlsMatrix.inverse()
        });
      }

      /** @internal */
    }, {
      key: "processControlsMove",
      value: function processControlsMove(_ref19) {
        var dx = _ref19.dx,
          dy = _ref19.dy;
        var _this$storage13 = this.storage,
          _this$storage14 = _this$storage13 === void 0 ? {} : _this$storage13,
          _this$storage14$trans = _this$storage14.transform,
          controlsMatrix = _this$storage14$trans.controlsMatrix,
          controlsTranslateMatrix = _this$storage14$trans.controlsTranslateMatrix,
          center = _this$storage14.center;
        controlsTranslateMatrix.e = dx;
        controlsTranslateMatrix.f = dy;
        var moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);
        this.updateControlsView(moveControlsMtrx);
        if (center.isShifted) {
          var centerTransformMatrix = controlsMatrix.inverse();
          centerTransformMatrix.e = centerTransformMatrix.f = 0;
          var _pointTo9 = pointTo(centerTransformMatrix, dx, dy),
            cx = _pointTo9.x,
            cy = _pointTo9.y;
          this.moveCenterHandle(-cx, -cy);
        }
      }

      /** @internal */
    }, {
      key: "processControlsRotate",
      value: function processControlsRotate(_ref20) {
        var radians = _ref20.radians;
        var isGrouped = this.options.isGrouped,
          _this$storage15 = this.storage,
          _this$storage16 = _this$storage15 === void 0 ? {} : _this$storage15,
          _this$storage16$trans = _this$storage16.transform,
          _this$storage16$trans2 = _this$storage16$trans === void 0 ? {} : _this$storage16$trans,
          controlsMatrix = _this$storage16$trans2.controlsMatrix,
          wrapperOriginMatrix = _this$storage16$trans2.wrapperOriginMatrix;
        if (isGrouped) {
          var wrapperResultMatrix = wrapperOriginMatrix.multiply(createRotationMatrix(radians)).multiply(wrapperOriginMatrix.inverse()).multiply(controlsMatrix);
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
      value: function updateElementView(element, matrix) {
        element.setAttribute('transform', matrixToString(matrix));
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
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref21$boxMatrix = _ref21.boxMatrix,
          boxMatrix = _ref21$boxMatrix === void 0 ? createSVGMatrix() : _ref21$boxMatrix;
        var rotatable = this.options.rotatable,
          _this$storage17 = this.storage,
          handles = _this$storage17.handles,
          isShifted = _this$storage17.center.isShifted;
        var _this$getVertices2 = this.getVertices(boxMatrix),
          _this$getVertices2$an = _this$getVertices2.anchor,
          anchor = _this$getVertices2$an === void 0 ? null : _this$getVertices2$an,
          center = _this$getVertices2.center,
          nextVertices = _objectWithoutProperties(_this$getVertices2, _excluded3);
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
        entries(edgeSegments(nextVertices)).forEach(function (_ref22) {
          var _ref23 = _slicedToArray(_ref22, 2),
            key = _ref23[0],
            _ref23$ = _slicedToArray(_ref23[1], 2),
            b = _ref23$[0],
            e = _ref23$[1];
          var hdl = handles[key];
          if (isUndef(b) || isUndef(hdl)) return;
          setAttributes(hdl, {
            x1: b.x,
            y1: b.y,
            x2: e.x,
            y2: e.y
          });
        });
        var handlesVertices = _objectSpread2(_objectSpread2({}, nextVertices), !isShifted && Boolean(center) && {
          center: center
        });
        entries(handlesVertices).forEach(function (_ref24) {
          var _ref25 = _slicedToArray(_ref24, 2),
            key = _ref25[0],
            point = _ref25[1];
          var hdl = handles[key];
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
    }, {
      key: "prepareGuides",
      value: function prepareGuides() {
        var _this4 = this;
        var elements = this.elements,
          wrapper = this.storage.wrapper,
          _this$options11 = this.options,
          container = _this$options11.container,
          guides = _this$options11.guides;
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
            result.push(_this4.getBoundsBox(element));
          } catch (_unused) {
            return result;
          }
          return result;
        }, []);
        var boundsElement = bounds === false ? null : bounds ? helper(bounds)[0] : container;
        if (boundsElement) targetBoxes.push(this.getBoundsBox(boundsElement));
        return _objectSpread2(_objectSpread2({}, this.measure()), {}, {
          targets: targetBoxes,
          threshold: threshold / screenScale(container),
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
          _this$options12 = this.options,
          container = _this$options12.container,
          isGrouped = _this$options12.isGrouped;
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
            return boxFromPoints(bBoxPoints(element, matrices[index]));
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
          return boxFromPoints(bBoxPoints(element, getTransformToElement(element, container)));
        }
        var _element$getBoundingC = element.getBoundingClientRect(),
          left = _element$getBoundingC.left,
          top = _element$getBoundingC.top,
          right = _element$getBoundingC.right,
          bottom = _element$getBoundingC.bottom;
        var toContainer = (container.getScreenCTM() || createSVGMatrix()).inverse();
        return boxFromPoints([[left, top], [right, top], [right, bottom], [left, bottom]].map(function (_ref26) {
          var _ref27 = _slicedToArray(_ref26, 2),
            x = _ref27[0],
            y = _ref27[1];
          var point = pointTo(toContainer, x, y);
          return [point.x, point.y];
        }));
      }

      /** @internal */
    }, {
      key: "drawGuides",
      value: function drawGuides(lines) {
        var storage = this.storage,
          _this$storage18 = this.storage,
          wrapper = _this$storage18.wrapper,
          guidesLayer = _this$storage18.guidesLayer,
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
        lines.forEach(function (guide) {
          return layer.appendChild(createGuideLine(guide));
        });
      }

      /** @internal */
    }, {
      key: "syncHitAreas",
      value: function syncHitAreas() {
        var _this$storage19 = this.storage,
          controls = _this$storage19.controls,
          handles = _this$storage19.handles,
          hitAreas = _this$storage19.hitAreas,
          hitOverlay = _this$storage19.hitOverlay,
          hitRadius = this.options.hitRadius;
        if (!hitAreas) return;
        var corners = readCorners(handles.te, handles.be);
        var radius = hitRadius / screenScale(controls);
        var outlines = [];
        entries(hitAreas).forEach(function (_ref28) {
          var _ref29 = _slicedToArray(_ref28, 2),
            key = _ref29[0],
            area = _ref29[1];
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
      key: "setTransformOrigin",
      value: function setTransformOrigin() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          x = _ref30.x,
          y = _ref30.y,
          dx = _ref30.dx,
          dy = _ref30.dy;
        var pin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var elements = this.elements,
          storage = this.storage,
          _this$storage20 = this.storage,
          _this$storage21 = _this$storage20 === void 0 ? {} : _this$storage20,
          controls = _this$storage21.controls,
          _this$storage21$handl = _this$storage21.handles,
          _this$storage21$handl2 = _this$storage21$handl === void 0 ? {} : _this$storage21$handl,
          handle = _this$storage21$handl2.center,
          radius = _this$storage21$handl2.radius,
          center = _this$storage21.center,
          _this$options13 = this.options,
          container = _this$options13.container,
          isGrouped = _this$options13.isGrouped;
        var isRelative = isDef(dx) && isDef(dy),
          isAbsolute = isDef(x) && isDef(y);
        if (!center || !handle || !radius || !(isRelative || isAbsolute)) return;
        var controlsTransformMatrix = getTransformToElement(controls, controls.parentNode).inverse();
        var nextTransform = isGrouped ? controlsTransformMatrix : controlsTransformMatrix.multiply(getTransformToElement(elements[0], container));
        var newX, newY;
        if (isRelative) {
          var _this$getBBox = this.getBBox(),
            bx = _this$getBBox.x,
            by = _this$getBBox.y,
            width = _this$getBBox.width,
            height = _this$getBBox.height;
          var hW = width / 2,
            hH = height / 2;
          var _pointTo0 = pointTo(nextTransform, bx + hW + dx, by + hH + dy);
          newX = _pointTo0.x;
          newY = _pointTo0.y;
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
        if (pin) this.anchorOrigin(storage.transformOrigin);else center.local = null;
        this.syncHitAreas();
      }
    }, {
      key: "fitControlsToSize",
      value: function fitControlsToSize() {
        var _this$storage22 = this.storage,
          controls = _this$storage22.controls,
          _this$storage22$cente = _this$storage22.center,
          _this$storage22$cente2 = _this$storage22$cente === void 0 ? {} : _this$storage22$cente,
          isShifted = _this$storage22$cente2.isShifted,
          _this$storage22$trans = _this$storage22.transformOrigin,
          _this$storage22$trans2 = _this$storage22$trans === void 0 ? {} : _this$storage22$trans,
          originX = _this$storage22$trans2.x,
          originY = _this$storage22$trans2.y;
        var controlsMatrix = getTransformToElement(controls, controls.parentNode);
        var _ref31 = this.anchoredOrigin() || pointTo(controlsMatrix, originX, originY),
          dx = _ref31.x,
          dy = _ref31.y;
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
    }, {
      key: "getBoundingRect",
      value: function getBoundingRect(element) {
        var transformMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _this$options14 = this.options,
          _this$options15 = _this$options14 === void 0 ? {} : _this$options14,
          restrict = _this$options15.restrict,
          container = _this$options15.container;
        var restrictEl = restrict || container;
        var nextTransform = transformMatrix ? getTransformToElement(element.parentNode, restrictEl).multiply(transformMatrix) : getTransformToElement(element, restrictEl);
        return bBoxPoints(element, nextTransform, element.getBBox());
      }
    }, {
      key: "applyAlignment",
      value: function applyAlignment(direction) {
        var _this5 = this;
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var elements = this.elements,
          container = this.options.container;
        var _this$getVertices3 = this.getVertices();
          _this$getVertices3.anchor;
          _this$getVertices3.rotator;
          _this$getVertices3.center;
          var vertices = _objectWithoutProperties(_this$getVertices3, _excluded4);
        var restrictBBox = target ? bBoxPoints(target, getTransformToElement(target, container)) : this.getRestrictedBBox(true);
        var _alignmentOffset = alignmentOffset(direction, getMinMaxOfArray(restrictBBox), getMinMaxOfArray(values(vertices).map(function (_ref32) {
            var x = _ref32.x,
              y = _ref32.y;
            return [x, y];
          }))),
          _alignmentOffset2 = _slicedToArray(_alignmentOffset, 2),
          offsetX = _alignmentOffset2[0],
          offsetY = _alignmentOffset2[1];
        elements.forEach(function (element) {
          var parentMatrix = getTransformToElement(element.parentNode, container);
          parentMatrix.e = parentMatrix.f = 0;
          var _pointTo1 = pointTo(parentMatrix.inverse(), offsetX, offsetY),
            x = _pointTo1.x,
            y = _pointTo1.y;
          var moveElementMtrx = createTranslateMatrix(x, y).multiply(getTransformToElement(element, element.parentNode));
          _this5.updateElementView(element, moveElementMtrx);
        });
        this.fitControlsToSize();
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        var elements = this.elements,
          _this$options16 = this.options,
          isGrouped = _this$options16.isGrouped,
          container = _this$options16.container;
        var nextTransform = isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container);
        var _transformVertices = transformVertices(boxVertices(this.getBBox()), nextTransform),
          tl = _transformVertices.tl,
          br = _transformVertices.br,
          tr = _transformVertices.tr;
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

  // default-only entry so the UMD global stays directly callable

  return api;

}));
