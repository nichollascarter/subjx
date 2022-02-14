/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2022
* Karen Sarksyan
* nichollascarter@gmail.com
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.subjx = factory());
}(this, (function () { 'use strict';

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) {
          return typeof obj;
        };
      } else {
        _typeof = function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }

      return target;
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;

      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }

      return target;
    }

    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {};

      var target = _objectWithoutPropertiesLoose(source, excluded);

      var key, i;

      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }

      return target;
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    function _createSuper(Derived) {
      return function () {
        var Super = _getPrototypeOf(Derived),
            result;

        if (_isNativeReflectConstruct()) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
    }

    function _superPropBase(object, property) {
      while (!Object.prototype.hasOwnProperty.call(object, property)) {
        object = _getPrototypeOf(object);
        if (object === null) break;
      }

      return object;
    }

    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
      } else {
        _get = function _get(target, property, receiver) {
          var base = _superPropBase(target, property);

          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.get) {
            return desc.get.call(receiver);
          }

          return desc.value;
        };
      }

      return _get(target, property, receiver || target);
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _createForOfIteratorHelper(o) {
      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
          var i = 0;

          var F = function () {};

          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var it,
          normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function () {
          it = o[Symbol.iterator]();
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
      return setTimeout(f, 1000 / 60);
    };
    var cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (requestID) {
      clearTimeout(requestID);
    };
    var _Array$prototype = Array.prototype,
        forEach = _Array$prototype.forEach,
        arrSlice = _Array$prototype.slice,
        arrMap = _Array$prototype.map,
        arrReduce = _Array$prototype.reduce;
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
        fn.call.apply(fn, [this].concat(Array.prototype.slice.call(arguments)));
      } : noop;
    };

    var Helper = /*#__PURE__*/function () {
      function Helper(params) {
        _classCallCheck(this, Helper);

        if (typeof params === 'string') {
          var selector = document.querySelectorAll(params);
          this.length = selector.length;

          for (var count = 0; count < this.length; count++) {
            this[count] = selector[count];
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

      _createClass(Helper, [{
        key: "css",
        value: function css(prop) {
          var _getStyle = function _getStyle(obj) {
            var len = obj.length;

            while (len--) {
              if (obj[len].currentStyle) {
                return obj[len].currentStyle[prop];
              } else if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(obj[len], '')[prop];
              } else {
                return obj[len].style[prop];
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

          var methods = {
            setStyle: function setStyle(options) {
              return _setStyle(this, options);
            },
            getStyle: function getStyle() {
              return _getStyle(this);
            }
          };

          if (typeof prop === 'string') {
            return methods.getStyle.apply(this, arrSlice.call(arguments, 1));
          } else if (_typeof(prop) === 'object' || !prop) {
            return methods.setStyle.apply(this, arguments);
          } else {
            warn("Method ".concat(prop, " does not exist"));
          }

          return false;
        }
      }, {
        key: "on",
        value: function on() {
          var len = this.length;

          while (len--) {
            if (!this[len].events) {
              this[len].events = {};
              this[len].events[arguments[0]] = [];
            }

            if (typeof arguments[1] !== 'string') {
              if (document.addEventListener) {
                this[len].addEventListener(arguments[0], arguments[1], arguments[2] || {
                  passive: false
                });
              } else if (document.attachEvent) {
                this[len].attachEvent("on".concat(arguments[0]), arguments[1]);
              } else {
                this[len]["on".concat(arguments[0])] = arguments[1];
              }
            } else {
              listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], arguments[3], true);
            }
          }

          return this;
        }
      }, {
        key: "off",
        value: function off() {
          var len = this.length;

          while (len--) {
            if (!this[len].events) {
              this[len].events = {};
              this[len].events[arguments[0]] = [];
            }

            if (typeof arguments[1] !== 'string') {
              if (document.removeEventListener) {
                this[len].removeEventListener(arguments[0], arguments[1], arguments[2]);
              } else if (document.detachEvent) {
                this[len].detachEvent("on".concat(arguments[0]), arguments[1]);
              } else {
                this[len]["on".concat(arguments[0])] = null;
              }
            } else {
              listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], arguments[3], false);
            }
          }

          return this;
        }
      }, {
        key: "is",
        value: function is(selector) {
          if (isUndef(selector)) return false;

          var _sel = helper(selector);

          var len = this.length;

          while (len--) {
            if (this[len] === _sel[len]) return true;
          }

          return false;
        }
      }]);

      return Helper;
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
      return isDef(obj) && _typeof(obj) === 'object' && (Array.isArray(obj) || isDef(window.Symbol) && typeof obj[window.Symbol.iterator] === 'function' || isDef(obj.forEach) || typeof obj.length === 'number' && (obj.length === 0 || obj.length > 0 && obj.length - 1 in obj));
    }

    function helper(params) {
      return new Helper(params);
    }

    var MIN_SIZE = 2;
    var THEME_COLOR = '#00a8ff';
    var LIB_CLASS_PREFIX = 'sjx-';
    var E_MOUSEDOWN = 'mousedown';
    var E_MOUSEUP = 'mouseup';
    var E_MOUSEMOVE = 'mousemove';
    var E_TOUCHSTART = 'touchstart';
    var E_TOUCHEND = 'touchend';
    var E_TOUCHMOVE = 'touchmove';
    var E_DRAG_START = 'dragStart';
    var E_DRAG = 'drag';
    var E_DRAG_END = 'dragEnd';
    var E_RESIZE_START = 'resizeStart';
    var E_RESIZE = 'resize';
    var E_RESIZE_END = 'resizeEnd';
    var E_ROTATE_START = 'rotateStart';
    var E_ROTATE = 'rotate';
    var E_ROTATE_END = 'rotateEnd';
    var E_SET_POINT = 'setPoint';
    var E_SET_POINT_START = 'setPointStart';
    var E_SET_POINT_END = 'setPointEnd';
    var EMITTER_EVENTS = [E_DRAG_START, E_DRAG,, E_DRAG_END, E_RESIZE_START, E_RESIZE, E_RESIZE_END, E_ROTATE_START, E_ROTATE, E_ROTATE_END, E_SET_POINT_START, E_SET_POINT_END];
    var CSS_PREFIXES = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
    var ON_GETSTATE = 'ongetstate';
    var ON_APPLY = 'onapply';
    var ON_MOVE = 'onmove';
    var ON_RESIZE = 'onresize';
    var ON_ROTATE = 'onrotate';
    var NOTIFIER_EVENTS = [ON_GETSTATE, ON_APPLY, ON_MOVE, ON_RESIZE, ON_ROTATE];
    var NOTIFIER_CONSTANTS = {
      NOTIFIER_EVENTS: NOTIFIER_EVENTS,
      ON_GETSTATE: ON_GETSTATE,
      ON_APPLY: ON_APPLY,
      ON_MOVE: ON_MOVE,
      ON_RESIZE: ON_RESIZE,
      ON_ROTATE: ON_ROTATE
    };
    var EVENT_EMITTER_CONSTANTS = {
      EMITTER_EVENTS: EMITTER_EVENTS,
      E_DRAG_START: E_DRAG_START,
      E_DRAG: E_DRAG,
      E_DRAG_END: E_DRAG_END,
      E_RESIZE_START: E_RESIZE_START,
      E_RESIZE: E_RESIZE,
      E_RESIZE_END: E_RESIZE_END,
      E_ROTATE_START: E_ROTATE_START,
      E_ROTATE: E_ROTATE,
      E_ROTATE_END: E_ROTATE_END,
      E_SET_POINT: E_SET_POINT,
      E_SET_POINT_START: E_SET_POINT_START,
      E_SET_POINT_END: E_SET_POINT_END
    };
    var CLIENT_EVENTS_CONSTANTS = {
      E_MOUSEDOWN: E_MOUSEDOWN,
      E_MOUSEUP: E_MOUSEUP,
      E_MOUSEMOVE: E_MOUSEMOVE,
      E_TOUCHSTART: E_TOUCHSTART,
      E_TOUCHEND: E_TOUCHEND,
      E_TOUCHMOVE: E_TOUCHMOVE
    };
    var TRANSFORM_HANDLES_KEYS = {
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
    var TRANSFORM_EDGES_KEYS = {
      TOP_EDGE: 'te',
      BOTTOM_EDGE: 'be',
      LEFT_EDGE: 'le',
      RIGHT_EDGE: 're'
    };
    var TRANSFORM_HANDLES_CONSTANTS = {
      TRANSFORM_HANDLES_KEYS: TRANSFORM_HANDLES_KEYS,
      TRANSFORM_EDGES_KEYS: TRANSFORM_EDGES_KEYS
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

      _createClass(Observable, [{
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

      return Observable;
    }();

    var Event = /*#__PURE__*/function () {
      function Event(name) {
        _classCallCheck(this, Event);

        this.name = name;
        this.callbacks = [];
      }

      _createClass(Event, [{
        key: "registerCallback",
        value: function registerCallback(cb) {
          this.callbacks.push(cb);
        }
      }, {
        key: "removeCallback",
        value: function removeCallback(cb) {
          var ix = this.callbacks(cb);
          this.callbacks.splice(ix, 1);
        }
      }]);

      return Event;
    }();

    var EventDispatcher = /*#__PURE__*/function () {
      function EventDispatcher() {
        _classCallCheck(this, EventDispatcher);

        this.events = {};
      }

      _createClass(EventDispatcher, [{
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

      return EventDispatcher;
    }();

    var E_DRAG$1 = EVENT_EMITTER_CONSTANTS.E_DRAG;
    var E_MOUSEMOVE$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEMOVE,
        E_MOUSEUP$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEUP,
        E_TOUCHMOVE$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHMOVE,
        E_TOUCHEND$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHEND;

    var SubjectModel = /*#__PURE__*/function () {
      function SubjectModel(elements) {
        _classCallCheck(this, SubjectModel);

        this.elements = elements;
        this.storage = null;
        this.proxyMethods = null;
        this.eventDispatcher = new EventDispatcher();
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._animate = this._animate.bind(this);
      }

      _createClass(SubjectModel, [{
        key: "enable",
        value: function enable(options) {
          this._processOptions(options);

          this._init(this.elements);

          this.proxyMethods.onInit.call(this, this.elements);
        }
      }, {
        key: "disable",
        value: function disable() {
          throwNotImplementedError();
        }
      }, {
        key: "_init",
        value: function _init() {
          throwNotImplementedError();
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          throwNotImplementedError();
        }
      }, {
        key: "_processOptions",
        value: function _processOptions() {
          throwNotImplementedError();
        }
      }, {
        key: "_start",
        value: function _start() {
          throwNotImplementedError();
        }
      }, {
        key: "_moving",
        value: function _moving() {
          throwNotImplementedError();
        }
      }, {
        key: "_end",
        value: function _end() {
          throwNotImplementedError();
        }
      }, {
        key: "_animate",
        value: function _animate() {
          throwNotImplementedError();
        }
      }, {
        key: "_drag",
        value: function _drag(_ref) {
          var element = _ref.element,
              dx = _ref.dx,
              dy = _ref.dy,
              rest = _objectWithoutProperties(_ref, ["element", "dx", "dy"]);

          var transform = this._processMove(element, {
            dx: dx,
            dy: dy
          });

          var finalArgs = _objectSpread2({
            dx: dx,
            dy: dy,
            transform: transform
          }, rest);

          this.proxyMethods.onMove.call(this, finalArgs);

          this._emitEvent(E_DRAG$1, finalArgs);
        }
      }, {
        key: "_draw",
        value: function _draw() {
          this._animate();
        }
      }, {
        key: "_onMouseDown",
        value: function _onMouseDown(e) {
          this._start(e);

          helper(document).on(E_MOUSEMOVE$1, this._onMouseMove).on(E_MOUSEUP$1, this._onMouseUp);
        }
      }, {
        key: "_onTouchStart",
        value: function _onTouchStart(e) {
          this._start(e.touches[0]);

          helper(document).on(E_TOUCHMOVE$1, this._onTouchMove).on(E_TOUCHEND$1, this._onTouchEnd);
        }
      }, {
        key: "_onMouseMove",
        value: function _onMouseMove(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          this._moving(e);
        }
      }, {
        key: "_onTouchMove",
        value: function _onTouchMove(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          this._moving(e.touches[0]);
        }
      }, {
        key: "_onMouseUp",
        value: function _onMouseUp(e) {
          helper(document).off(E_MOUSEMOVE$1, this._onMouseMove).off(E_MOUSEUP$1, this._onMouseUp);

          this._end(e, this.elements);
        }
      }, {
        key: "_onTouchEnd",
        value: function _onTouchEnd(e) {
          helper(document).off(E_TOUCHMOVE$1, this._onTouchMove).off(E_TOUCHEND$1, this._onTouchEnd);

          if (e.touches.length === 0) {
            this._end(e.changedTouches[0], this.elements);
          }
        }
      }, {
        key: "_emitEvent",
        value: function _emitEvent() {
          var _this$eventDispatcher;

          (_this$eventDispatcher = this.eventDispatcher).emit.apply(_this$eventDispatcher, [this].concat(Array.prototype.slice.call(arguments)));
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

      return SubjectModel;
    }();

    var throwNotImplementedError = function throwNotImplementedError() {
      throw Error("Method not implemented");
    };

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

    var NOTIFIER_EVENTS$1 = NOTIFIER_CONSTANTS.NOTIFIER_EVENTS,
        ON_GETSTATE$2 = NOTIFIER_CONSTANTS.ON_GETSTATE,
        ON_APPLY$2 = NOTIFIER_CONSTANTS.ON_APPLY,
        ON_MOVE$2 = NOTIFIER_CONSTANTS.ON_MOVE,
        ON_RESIZE$2 = NOTIFIER_CONSTANTS.ON_RESIZE,
        ON_ROTATE$2 = NOTIFIER_CONSTANTS.ON_ROTATE;
    var EMITTER_EVENTS$1 = EVENT_EMITTER_CONSTANTS.EMITTER_EVENTS,
        E_DRAG_START$1 = EVENT_EMITTER_CONSTANTS.E_DRAG_START,
        E_DRAG$2 = EVENT_EMITTER_CONSTANTS.E_DRAG,
        E_DRAG_END$1 = EVENT_EMITTER_CONSTANTS.E_DRAG_END,
        E_RESIZE_START$1 = EVENT_EMITTER_CONSTANTS.E_RESIZE_START,
        E_RESIZE$1 = EVENT_EMITTER_CONSTANTS.E_RESIZE,
        E_RESIZE_END$1 = EVENT_EMITTER_CONSTANTS.E_RESIZE_END,
        E_ROTATE_START$1 = EVENT_EMITTER_CONSTANTS.E_ROTATE_START,
        E_ROTATE$1 = EVENT_EMITTER_CONSTANTS.E_ROTATE,
        E_ROTATE_END$1 = EVENT_EMITTER_CONSTANTS.E_ROTATE_END,
        E_SET_POINT$1 = EVENT_EMITTER_CONSTANTS.E_SET_POINT,
        E_SET_POINT_END$1 = EVENT_EMITTER_CONSTANTS.E_SET_POINT_END;
    var TRANSFORM_HANDLES_KEYS$1 = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_HANDLES_KEYS,
        TRANSFORM_EDGES_KEYS$1 = TRANSFORM_HANDLES_CONSTANTS.TRANSFORM_EDGES_KEYS;
    var E_MOUSEDOWN$1 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$1 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART,
        E_MOUSEMOVE$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEMOVE,
        E_MOUSEUP$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEUP,
        E_TOUCHMOVE$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHMOVE,
        E_TOUCHEND$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHEND;
    var TOP_LEFT = TRANSFORM_HANDLES_KEYS$1.TOP_LEFT,
        TOP_CENTER = TRANSFORM_HANDLES_KEYS$1.TOP_CENTER,
        TOP_RIGHT = TRANSFORM_HANDLES_KEYS$1.TOP_RIGHT,
        BOTTOM_LEFT = TRANSFORM_HANDLES_KEYS$1.BOTTOM_LEFT,
        BOTTOM_RIGHT = TRANSFORM_HANDLES_KEYS$1.BOTTOM_RIGHT,
        BOTTOM_CENTER = TRANSFORM_HANDLES_KEYS$1.BOTTOM_CENTER,
        MIDDLE_LEFT = TRANSFORM_HANDLES_KEYS$1.MIDDLE_LEFT,
        MIDDLE_RIGHT = TRANSFORM_HANDLES_KEYS$1.MIDDLE_RIGHT;
    var TOP_EDGE = TRANSFORM_EDGES_KEYS$1.TOP_EDGE,
        BOTTOM_EDGE = TRANSFORM_EDGES_KEYS$1.BOTTOM_EDGE,
        LEFT_EDGE = TRANSFORM_EDGES_KEYS$1.LEFT_EDGE,
        RIGHT_EDGE = TRANSFORM_EDGES_KEYS$1.RIGHT_EDGE;
    var keys = Object.keys,
        values = Object.values;

    var Transformable = /*#__PURE__*/function (_SubjectModel) {
      _inherits(Transformable, _SubjectModel);

      var _super = _createSuper(Transformable);

      function Transformable(elements, options, observable) {
        var _this;

        _classCallCheck(this, Transformable);

        _this = _super.call(this, elements);

        if (_this.constructor === Transformable) {
          throw new TypeError('Cannot construct Transformable instances directly');
        }

        _this.observable = observable;
        EMITTER_EVENTS$1.forEach(function (eventName) {
          return _this.eventDispatcher.registerEvent(eventName);
        });

        _get(_getPrototypeOf(Transformable.prototype), "enable", _assertThisInitialized(_this)).call(_assertThisInitialized(_this), options);

        return _this;
      }

      _createClass(Transformable, [{
        key: "_cursorPoint",
        value: function _cursorPoint() {
          throw Error("'_cursorPoint()' method not implemented");
        }
      }, {
        key: "_rotate",
        value: function _rotate(_ref) {
          var element = _ref.element,
              radians = _ref.radians,
              rest = _objectWithoutProperties(_ref, ["element", "radians"]);

          var resultMtrx = this._processRotate(element, radians);

          var finalArgs = _objectSpread2({
            transform: resultMtrx,
            delta: radians
          }, rest);

          this.proxyMethods.onRotate.call(this, finalArgs);

          _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_ROTATE$1, finalArgs);
        }
      }, {
        key: "_resize",
        value: function _resize(_ref2) {
          var element = _ref2.element,
              dx = _ref2.dx,
              dy = _ref2.dy,
              rest = _objectWithoutProperties(_ref2, ["element", "dx", "dy"]);

          var finalValues = this._processResize(element, {
            dx: dx,
            dy: dy
          });

          var finalArgs = _objectSpread2({}, finalValues, {
            dx: dx,
            dy: dy
          }, rest);

          this.proxyMethods.onResize.call(this, finalArgs);

          _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_RESIZE$1, finalArgs);
        }
      }, {
        key: "_processOptions",
        value: function _processOptions() {
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
              _options$snap = options.snap,
              snap = _options$snap === void 0 ? {
            x: 10,
            y: 10,
            angle: 10
          } : _options$snap,
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
            snap: _objectSpread2({}, snap, {
              angle: snap.angle * RAD
            }),
            each: each,
            proportions: proportions,
            draggable: draggable,
            resizable: resizable,
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
      }, {
        key: "_animate",
        value: function _animate() {
          var _this2 = this;

          var self = this;
          var observable = self.observable,
              storage = self.storage,
              options = self.options,
              elements = self.elements;
          if (isUndef(storage)) return;
          storage.frame = requestAnimFrame(self._animate);
          if (!storage.doDraw) return;
          storage.doDraw = false;
          var dox = storage.dox,
              doy = storage.doy,
              clientX = storage.clientX,
              clientY = storage.clientY,
              relativeX = storage.relativeX,
              relativeY = storage.relativeY,
              doDrag = storage.doDrag,
              doResize = storage.doResize,
              doRotate = storage.doRotate,
              doSetCenter = storage.doSetCenter,
              revX = storage.revX,
              revY = storage.revY,
              mouseEvent = storage.mouseEvent,
              data = storage.data;
          var snap = options.snap,
              _options$each2 = options.each,
              moveEach = _options$each2.move,
              resizeEach = _options$each2.resize,
              rotateEach = _options$each2.rotate,
              draggable = options.draggable,
              resizable = options.resizable,
              rotatable = options.rotatable,
              isGrouped = options.isGrouped,
              restrict = options.restrict;

          if (doResize && resizable) {
            var distX = snapToGrid(clientX - relativeX, snap.x);
            var distY = snapToGrid(clientY - relativeY, snap.y);
            var cached = storage.cached,
                _storage$cached = storage.cached;
            _storage$cached = _storage$cached === void 0 ? {} : _storage$cached;
            var _storage$cached$dist = _storage$cached.dist;
            _storage$cached$dist = _storage$cached$dist === void 0 ? {} : _storage$cached$dist;
            var _storage$cached$dist$ = _storage$cached$dist.dx,
                prevDx = _storage$cached$dist$ === void 0 ? distX : _storage$cached$dist$,
                _storage$cached$dist$2 = _storage$cached$dist.dy,
                prevDy = _storage$cached$dist$2 === void 0 ? distY : _storage$cached$dist$2;
            var args = {
              dx: distX,
              dy: distY,
              clientX: clientX,
              clientY: clientY,
              mouseEvent: mouseEvent
            };

            var _ref3 = restrict ? elements.reduce(function (res, element) {
              var _data$get = data.get(element),
                  ctm = _data$get.transform.ctm;

              var _ref4 = !isGrouped ? _this2._pointToTransform({
                x: distX,
                y: distY,
                matrix: ctm
              }) : {
                x: distX,
                y: distY
              },
                  x = _ref4.x,
                  y = _ref4.y;

              var dx = dox ? revX ? -x : x : 0;
              var dy = doy ? revY ? -y : y : 0;

              var _this2$_processResize = _this2._processResizeRestrict(element, {
                dx: dx,
                dy: dy
              }),
                  newX = _this2$_processResize.x,
                  newY = _this2$_processResize.y;

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
                restX = _ref3.x,
                restY = _ref3.y;

            var isBounding = restrict && (restX !== null || restY !== null);
            var newDx = isBounding ? prevDx : distX;
            var newDy = isBounding ? prevDy : distY;

            var nextArgs = _objectSpread2({}, args, {
              dx: newDx,
              dy: newDy,
              revX: revX,
              revY: revY,
              dox: dox,
              doy: doy
            });

            elements.map(function (element) {
              var _data$get2 = data.get(element),
                  ctm = _data$get2.transform.ctm;

              var _ref5 = !isGrouped ? _this2._pointToTransform({
                x: newDx,
                y: newDy,
                matrix: ctm
              }) : {
                x: newDx,
                y: newDy
              },
                  x = _ref5.x,
                  y = _ref5.y;

              var dx = dox ? revX ? -x : x : 0;
              var dy = doy ? revY ? -y : y : 0;

              self._resize(_objectSpread2({}, nextArgs, {
                element: element,
                dx: dx,
                dy: dy
              }));
            });
            this.storage.cached = _objectSpread2({}, cached, {
              dist: {
                dx: newDx,
                dy: newDy
              }
            });

            this._processControlsResize({
              dx: newDx,
              dy: newDy
            });

            if (resizeEach) {
              observable.notify(ON_RESIZE$2, self, nextArgs);
            }
          }

          if (doDrag && draggable) {
            var dx = dox ? snapToGrid(clientX - relativeX, snap.x) : 0;
            var dy = doy ? snapToGrid(clientY - relativeY, snap.y) : 0;
            var _cached = storage.cached,
                _storage$cached2 = storage.cached;
            _storage$cached2 = _storage$cached2 === void 0 ? {} : _storage$cached2;
            var _storage$cached2$dist = _storage$cached2.dist;
            _storage$cached2$dist = _storage$cached2$dist === void 0 ? {} : _storage$cached2$dist;

            var _storage$cached2$dist2 = _storage$cached2$dist.dx,
                _prevDx = _storage$cached2$dist2 === void 0 ? dx : _storage$cached2$dist2,
                _storage$cached2$dist3 = _storage$cached2$dist.dy,
                _prevDy = _storage$cached2$dist3 === void 0 ? dy : _storage$cached2$dist3;

            var _args = {
              dx: dx,
              dy: dy,
              clientX: clientX,
              clientY: clientY,
              mouseEvent: mouseEvent
            };

            var _ref6 = restrict ? elements.reduce(function (res, element) {
              var _this2$_processMoveRe = _this2._processMoveRestrict(element, _args),
                  x = _this2$_processMoveRe.x,
                  y = _this2$_processMoveRe.y;

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
                _restX = _ref6.x,
                _restY = _ref6.y;

            var _newDx = _restX !== null && restrict ? _prevDx : dx;

            var _newDy = _restY !== null && restrict ? _prevDy : dy;

            var _nextArgs = _objectSpread2({}, _args, {
              dx: _newDx,
              dy: _newDy
            });

            this.storage.cached = _objectSpread2({}, _cached, {
              dist: {
                dx: _newDx,
                dy: _newDy
              }
            });
            elements.map(function (element) {
              return _get(_getPrototypeOf(Transformable.prototype), "_drag", _this2).call(_this2, _objectSpread2({
                element: element
              }, _nextArgs, {
                dx: _newDx,
                dy: _newDy
              }));
            });

            this._processControlsMove({
              dx: _newDx,
              dy: _newDy
            });

            if (moveEach) {
              observable.notify(ON_MOVE$2, self, _nextArgs);
            }
          }

          if (doRotate && rotatable) {
            var pressang = storage.pressang,
                center = storage.center;
            var delta = Math.atan2(clientY - center.y, clientX - center.x);
            var radians = snapToGrid(delta - pressang, snap.angle);

            if (restrict) {
              var _isBounding = elements.some(function (element) {
                var _this2$_processRotate = _this2._processRotateRestrict(element, radians),
                    restX = _this2$_processRotate.x,
                    restY = _this2$_processRotate.y;

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
              return self._rotate(_objectSpread2({
                element: element,
                radians: radians
              }, _args2));
            });

            this._processControlsRotate({
              radians: radians
            });

            if (rotateEach) {
              observable.notify(ON_ROTATE$2, self, _objectSpread2({
                radians: radians
              }, _args2));
            }
          }

          if (doSetCenter && rotatable) {
            var bx = storage.bx,
                by = storage.by;

            var _this$_pointToControl = this._pointToControls({
              x: clientX,
              y: clientY
            }),
                x = _this$_pointToControl.x,
                y = _this$_pointToControl.y;

            self._moveCenterHandle(x - bx, y - by);
          }
        }
      }, {
        key: "_start",
        value: function _start(e) {
          var clientX = e.clientX,
              clientY = e.clientY;
          var elements = this.elements,
              observable = this.observable,
              _this$options = this.options,
              axis = _this$options.axis,
              each = _this$options.each,
              storage = this.storage,
              handles = this.storage.handles;
          var isTarget = values(handles).some(function (hdl) {
            return helper(e.target).is(hdl);
          }) || elements.some(function (element) {
            return element.contains(e.target);
          });
          storage.isTarget = isTarget;
          if (!isTarget) return;

          var computed = this._compute(e, elements);

          keys(computed).map(function (prop) {
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
              doH = computed.doH;
          var doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
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
            cursor: null,
            dox: /\x/.test(axis) && (doResize ? handle.is(handles.ml) || handle.is(handles.mr) || handle.is(handles.tl) || handle.is(handles.tr) || handle.is(handles.bl) || handle.is(handles.br) || handle.is(handles.le) || handle.is(handles.re) : true),
            doy: /\y/.test(axis) && (doResize ? handle.is(handles.br) || handle.is(handles.bl) || handle.is(handles.bc) || handle.is(handles.tr) || handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.te) || handle.is(handles.be) : true)
          };
          this.storage = _objectSpread2({}, storage, {}, nextStorage);
          var eventArgs = {
            clientX: clientX,
            clientY: clientY
          };

          if (doResize) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_RESIZE_START$1, eventArgs);
          } else if (doRotate) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_ROTATE_START$1, eventArgs);
          } else if (doDrag) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_DRAG_START$1, eventArgs);
          }

          var move = each.move,
              resize = each.resize,
              rotate = each.rotate;
          var actionName = doResize ? E_RESIZE$1 : doRotate ? E_ROTATE$1 : E_DRAG$2;
          var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
          observable.notify(ON_GETSTATE$2, this, {
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

          this._draw();
        }
      }, {
        key: "_moving",
        value: function _moving(e) {
          var _this$storage = this.storage,
              storage = _this$storage === void 0 ? {} : _this$storage,
              options = this.options;
          if (!storage.isTarget) return;

          var _this$_cursorPoint = this._cursorPoint(e),
              x = _this$_cursorPoint.x,
              y = _this$_cursorPoint.y;

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
      }, {
        key: "_end",
        value: function _end(_ref7) {
          var _this3 = this;

          var clientX = _ref7.clientX,
              clientY = _ref7.clientY;
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

          var _ref8 = [{
            actionName: E_RESIZE$1,
            condition: doResize
          }, {
            actionName: E_DRAG$2,
            condition: doDrag
          }, {
            actionName: E_ROTATE$1,
            condition: doRotate
          }, {
            actionName: E_SET_POINT$1,
            condition: doSetCenter
          }].find(function (_ref9) {
            var condition = _ref9.condition;
            return condition;
          }) || {},
              _ref8$actionName = _ref8.actionName,
              actionName = _ref8$actionName === void 0 ? E_DRAG$2 : _ref8$actionName;

          elements.map(function (element) {
            return _this3._applyTransformToElement(element, actionName);
          });

          this._processActions(actionName);

          this._updateStorage();

          var eventArgs = {
            clientX: clientX,
            clientY: clientY
          };
          proxyMethods.onDrop.call(this, eventArgs);

          if (doResize) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_RESIZE_END$1, eventArgs);
          } else if (doRotate) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_ROTATE_END$1, eventArgs);
          } else if (doDrag) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_DRAG_END$1, eventArgs);
          } else if (doSetCenter) {
            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, E_SET_POINT_END$1, eventArgs);
          }

          var move = each.move,
              resize = each.resize,
              rotate = each.rotate;
          var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
          observable.notify(ON_APPLY$2, this, {
            clientX: clientX,
            clientY: clientY,
            actionName: actionName,
            triggerEvent: triggerEvent
          });
          cancelAnimFrame(frame);
          helper(document.body).css({
            cursor: 'auto'
          });

          if (isDef(radius)) {
            addClass(radius, "".concat(LIB_CLASS_PREFIX, "hidden"));
          }
        }
      }, {
        key: "_compute",
        value: function _compute(e, elements) {
          var _this4 = this;

          var _this$storage3 = this.storage;
          _this$storage3 = _this$storage3 === void 0 ? {} : _this$storage3;
          var handles = _this$storage3.handles,
              data = _this$storage3.data;
          var handle = helper(e.target);

          var _this$_checkHandles = this._checkHandles(handle, handles),
              revX = _this$_checkHandles.revX,
              revY = _this$_checkHandles.revY,
              doW = _this$_checkHandles.doW,
              doH = _this$_checkHandles.doH,
              rest = _objectWithoutProperties(_this$_checkHandles, ["revX", "revY", "doW", "doH"]);

          var commonState = this._getCommonState();

          var _this$_cursorPoint2 = this._cursorPoint(e),
              x = _this$_cursorPoint2.x,
              y = _this$_cursorPoint2.y;

          var _this$_pointToControl2 = this._pointToControls({
            x: x,
            y: y
          }, commonState.transform),
              bx = _this$_pointToControl2.x,
              by = _this$_pointToControl2.y;

          elements.map(function (element) {
            var _this4$_getElementSta = _this4._getElementState(element, {
              revX: revX,
              revY: revY,
              doW: doW,
              doH: doH
            }),
                transform = _this4$_getElementSta.transform,
                nextData = _objectWithoutProperties(_this4$_getElementSta, ["transform"]);

            var _this4$_pointToTransf = _this4._pointToTransform({
              x: x,
              y: y,
              matrix: transform.ctm
            }),
                ex = _this4$_pointToTransf.x,
                ey = _this4$_pointToTransf.y;

            data.set(element, _objectSpread2({}, data.get(element), {}, nextData, {
              transform: transform,
              cx: ex,
              cy: ey
            }));
          });
          var pressang = Math.atan2(y - commonState.center.y, x - commonState.center.x);
          return _objectSpread2({
            data: data
          }, rest, {
            handle: values(handles).some(function (hdl) {
              return helper(e.target).is(hdl);
            }) ? handle : helper(elements[0]),
            pressang: pressang
          }, commonState, {
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
      }, {
        key: "_checkHandles",
        value: function _checkHandles(handle, handles) {
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
          return {
            revX: revX,
            revY: revY,
            onTopEdge: onTopEdge,
            onLeftEdge: onLeftEdge,
            onRightEdge: onRightEdge,
            onBottomEdge: onBottomEdge,
            doW: doW,
            doH: doH
          };
        }
      }, {
        key: "_restrictHandler",
        value: function _restrictHandler(element, matrix) {
          var restrictX = null,
              restrictY = null;
          var elBox = this.getBoundingRect(element, matrix);

          var containerBBox = this._getRestrictedBBox();

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
                x = _elBox$i[0],
                y = _elBox$i[1];

            if (x < minX || x > maxX) {
              restrictX = x;
            }

            if (y < minY || y > maxY) {
              restrictY = y;
            }
          }

          return {
            x: restrictX,
            y: restrictY
          };
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          var _this5 = this;

          var elements = this.elements,
              _this$storage4 = this.storage;
          _this$storage4 = _this$storage4 === void 0 ? {} : _this$storage4;
          var controls = _this$storage4.controls,
              wrapper = _this$storage4.wrapper;
          [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
            return helper(target).off(E_MOUSEDOWN$1, _this5._onMouseDown).off(E_TOUCHSTART$1, _this5._onTouchStart);
          });
          wrapper.parentNode.removeChild(wrapper);
        }
      }, {
        key: "_updateStorage",
        value: function _updateStorage() {
          var storage = this.storage,
              _this$storage5 = this.storage,
              prevTransformOrigin = _this$storage5.transformOrigin,
              _this$storage5$cached = _this$storage5.cached;
          _this$storage5$cached = _this$storage5$cached === void 0 ? {} : _this$storage5$cached;
          var _this$storage5$cached2 = _this$storage5$cached.transformOrigin,
              transformOrigin = _this$storage5$cached2 === void 0 ? prevTransformOrigin : _this$storage5$cached2;
          this.storage = _objectSpread2({}, storage, {
            doResize: false,
            doDrag: false,
            doRotate: false,
            doSetCenter: false,
            doDraw: false,
            onExecution: false,
            cursor: null,
            transformOrigin: transformOrigin,
            cached: {}
          });
        }
      }, {
        key: "notifyMove",
        value: function notifyMove(_ref10) {
          var _this6 = this;

          var dx = _ref10.dx,
              dy = _ref10.dy;
          this.elements.map(function (element) {
            return _get(_getPrototypeOf(Transformable.prototype), "_drag", _this6).call(_this6, {
              element: element,
              dx: dx,
              dy: dy
            });
          });

          this._processControlsMove({
            dx: dx,
            dy: dy
          });
        }
      }, {
        key: "notifyRotate",
        value: function notifyRotate(_ref11) {
          var _this7 = this;

          var radians = _ref11.radians,
              rest = _objectWithoutProperties(_ref11, ["radians"]);

          var elements = this.elements,
              _this$options2 = this.options;
          _this$options2 = _this$options2 === void 0 ? {} : _this$options2;
          var angle = _this$options2.snap.angle;
          elements.map(function (element) {
            return _this7._rotate(_objectSpread2({
              element: element,
              radians: snapToGrid(radians, angle)
            }, rest));
          });

          this._processControlsRotate({
            radians: radians
          });
        }
      }, {
        key: "notifyResize",
        value: function notifyResize(_ref12) {
          var _this8 = this;

          var dx = _ref12.dx,
              dy = _ref12.dy,
              revX = _ref12.revX,
              revY = _ref12.revY,
              dox = _ref12.dox,
              doy = _ref12.doy;
          var elements = this.elements,
              data = this.storage.data,
              isGrouped = this.options.isGrouped;
          elements.map(function (element) {
            var _data$get3 = data.get(element),
                ctm = _data$get3.transform.ctm;

            var _ref13 = !isGrouped ? _this8._pointToTransform({
              x: dx,
              y: dy,
              matrix: ctm
            }) : {
              x: dx,
              y: dy
            },
                x = _ref13.x,
                y = _ref13.y;

            _this8._resize({
              element: element,
              dx: dox ? revX ? -x : x : 0,
              dy: doy ? revY ? -y : y : 0
            });
          });

          this._processControlsResize({
            dx: dx,
            dy: dy
          });
        }
      }, {
        key: "notifyApply",
        value: function notifyApply(_ref14) {
          var _this9 = this;

          var clientX = _ref14.clientX,
              clientY = _ref14.clientY,
              actionName = _ref14.actionName,
              triggerEvent = _ref14.triggerEvent;
          this.proxyMethods.onDrop.call(this, {
            clientX: clientX,
            clientY: clientY
          });

          if (triggerEvent) {
            this.elements.map(function (element) {
              return _this9._applyTransformToElement(element, actionName);
            });

            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, "".concat(actionName, "End"), {
              clientX: clientX,
              clientY: clientY
            });
          }
        }
      }, {
        key: "notifyGetState",
        value: function notifyGetState(_ref15) {
          var _this10 = this;

          var clientX = _ref15.clientX,
              clientY = _ref15.clientY,
              actionName = _ref15.actionName,
              triggerEvent = _ref15.triggerEvent,
              rest = _objectWithoutProperties(_ref15, ["clientX", "clientY", "actionName", "triggerEvent"]);

          if (triggerEvent) {
            var elements = this.elements,
                data = this.storage.data;
            elements.map(function (element) {
              var nextData = _this10._getElementState(element, rest);

              data.set(element, _objectSpread2({}, data.get(element), {}, nextData));
            });

            var recalc = this._getCommonState();

            this.storage = _objectSpread2({}, this.storage, {}, recalc);

            _get(_getPrototypeOf(Transformable.prototype), "_emitEvent", this).call(this, "".concat(actionName, "Start"), {
              clientX: clientX,
              clientY: clientY
            });
          }
        }
      }, {
        key: "subscribe",
        value: function subscribe(_ref16) {
          var resize = _ref16.resize,
              move = _ref16.move,
              rotate = _ref16.rotate;
          var ob = this.observable;

          if (move || resize || rotate) {
            ob.subscribe(ON_GETSTATE$2, this).subscribe(ON_APPLY$2, this);
          }

          if (move) {
            ob.subscribe(ON_MOVE$2, this);
          }

          if (resize) {
            ob.subscribe(ON_RESIZE$2, this);
          }

          if (rotate) {
            ob.subscribe(ON_ROTATE$2, this);
          }
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe() {
          var _this11 = this;

          var ob = this.observable;
          NOTIFIER_EVENTS$1.map(function (eventName) {
            return ob.unsubscribe(eventName, _this11);
          });
        }
      }, {
        key: "disable",
        value: function disable() {
          var storage = this.storage,
              proxyMethods = this.proxyMethods,
              elements = this.elements;
          if (isUndef(storage)) return; // unexpected case

          if (storage.onExecution) {
            helper(document).off(E_MOUSEMOVE$2, this._onMouseMove).off(E_MOUSEUP$2, this._onMouseUp).off(E_TOUCHMOVE$2, this._onTouchMove).off(E_TOUCHEND$2, this._onTouchEnd);
          }

          elements.map(function (element) {
            return removeClass(element, "".concat(LIB_CLASS_PREFIX, "drag"));
          });
          this.unsubscribe();

          this._destroy();

          proxyMethods.onDestroy.call(this, elements);
          delete this.storage;
        }
      }, {
        key: "exeDrag",
        value: function exeDrag(_ref17) {
          var _this12 = this;

          var dx = _ref17.dx,
              dy = _ref17.dy;
          var elements = this.elements,
              draggable = this.options.draggable,
              storage = this.storage,
              data = this.storage.data;
          if (!draggable) return;

          var commonState = this._getCommonState();

          elements.map(function (element) {
            var nextData = _this12._getElementState(element, {
              revX: false,
              revY: false,
              doW: false,
              doH: false
            });

            data.set(element, _objectSpread2({}, data.get(element), {}, nextData));
          });
          this.storage = _objectSpread2({}, storage, {}, commonState);
          elements.map(function (element) {
            _get(_getPrototypeOf(Transformable.prototype), "_drag", _this12).call(_this12, {
              element: element,
              dx: dx,
              dy: dy
            });

            _this12._applyTransformToElement(element, E_DRAG$2);
          });

          this._processControlsMove({
            dx: dx,
            dy: dy
          });
        }
      }, {
        key: "exeResize",
        value: function exeResize(_ref18) {
          var _this13 = this;

          var dx = _ref18.dx,
              dy = _ref18.dy,
              _ref18$revX = _ref18.revX,
              revX = _ref18$revX === void 0 ? false : _ref18$revX,
              _ref18$revY = _ref18.revY,
              revY = _ref18$revY === void 0 ? false : _ref18$revY,
              _ref18$doW = _ref18.doW,
              doW = _ref18$doW === void 0 ? false : _ref18$doW,
              _ref18$doH = _ref18.doH,
              doH = _ref18$doH === void 0 ? false : _ref18$doH;
          var elements = this.elements,
              resizable = this.options.resizable,
              storage = this.storage,
              data = this.storage.data;
          if (!resizable) return;

          var commonState = this._getCommonState();

          elements.map(function (element) {
            var nextData = _this13._getElementState(element, {
              revX: revX,
              revY: revY,
              doW: doW,
              doH: doH
            });

            data.set(element, _objectSpread2({}, data.get(element), {}, nextData));
          });
          this.storage = _objectSpread2({}, storage, {}, commonState);
          elements.map(function (element) {
            _this13._resize({
              element: element,
              dx: dx,
              dy: dy
            });

            _this13._applyTransformToElement(element, E_RESIZE$1);
          });

          this._processControlsMove({
            dx: dx,
            dy: dy
          });
        }
      }, {
        key: "exeRotate",
        value: function exeRotate(_ref19) {
          var _this14 = this;

          var delta = _ref19.delta;
          var elements = this.elements,
              rotatable = this.options.rotatable,
              storage = this.storage,
              data = this.storage.data;
          if (!rotatable) return;

          var commonState = this._getCommonState();

          elements.map(function (element) {
            var nextData = _this14._getElementState(element, {
              revX: false,
              revY: false,
              doW: false,
              doH: false
            });

            data.set(element, _objectSpread2({}, data.get(element), {}, nextData));
          });
          this.storage = _objectSpread2({}, storage, {}, commonState);
          elements.map(function (element) {
            _this14._rotate({
              element: element,
              radians: delta
            });

            _this14._applyTransformToElement(element, E_ROTATE$1);
          });

          this._processControlsRotate({
            radians: delta
          });
        }
      }, {
        key: "setCenterPoint",
        value: function setCenterPoint() {
          throw Error("'setCenterPoint()' method not implemented");
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
        key: "setTransformOrigin",
        value: function setTransformOrigin() {
          throw Error("'setTransformOrigin()' method not implemented");
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

      return Transformable;
    }(SubjectModel);

    var cloneMatrix = function cloneMatrix(m) {
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
    var createTranslateMatrix = function createTranslateMatrix(x, y) {
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return createIdentityMatrix().map(function (item, i) {
        item[3] = [x, y, z, 1][i];
        return item;
      });
    };
    var createScaleMatrix = function createScaleMatrix(x, y) {
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      return createIdentityMatrix().map(function (item, i) {
        item[i] = [x, y, z, w][i];
        return item;
      });
    };
    var createRotateMatrix = function createRotateMatrix(sin, cos) {
      var res = createIdentityMatrix();
      res[0][0] = cos;
      res[0][1] = -sin;
      res[1][0] = sin;
      res[1][1] = cos;
      return res;
    };
    var dropTranslate = function dropTranslate(matrix) {
      var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var nextMatrix = clone ? cloneMatrix(matrix) : matrix;
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
      var _A = cloneMatrix(matrix);

      var temp,
          N = _A.length,
          E = [];

      for (var i = 0; i < N; i++) {
        E[i] = [];
      }

      for (var _i = 0; _i < N; _i++) {
        for (var j = 0; j < N; j++) {
          E[_i][j] = 0;
          if (_i == j) E[_i][j] = 1;
        }
      }

      for (var k = 0; k < N; k++) {
        temp = _A[k][k];

        for (var _j = 0; _j < N; _j++) {
          _A[k][_j] /= temp;
          E[k][_j] /= temp;
        }

        for (var _i2 = k + 1; _i2 < N; _i2++) {
          temp = _A[_i2][k];

          for (var _j2 = 0; _j2 < N; _j2++) {
            _A[_i2][_j2] -= _A[k][_j2] * temp;
            E[_i2][_j2] -= E[k][_j2] * temp;
          }
        }
      }

      for (var _k = N - 1; _k > 0; _k--) {
        for (var _i3 = _k - 1; _i3 >= 0; _i3--) {
          temp = _A[_i3][_k];

          for (var _j3 = 0; _j3 < N; _j3++) {
            _A[_i3][_j3] -= _A[_k][_j3] * temp;
            E[_i3][_j3] -= E[_k][_j3] * temp;
          }
        }
      }

      for (var _i4 = 0; _i4 < N; _i4++) {
        for (var _j4 = 0; _j4 < N; _j4++) {
          _A[_i4][_j4] = E[_i4][_j4];
        }
      }

      return _A;
    };
    var computeTransformMatrix = function computeTransformMatrix(tx, _ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          x = _ref2[0],
          y = _ref2[1],
          z = _ref2[2];

      var preMul = createTranslateMatrix(-x, -y, -z);
      var postMul = createTranslateMatrix(x, y, z);
      return multiplyMatrix(multiplyMatrix(preMul, tx), postMul);
    };
    var getCurrentTransformMatrix = function getCurrentTransformMatrix(element) {
      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
      var newTransform = arguments.length > 2 ? arguments[2] : undefined;
      var matrix = createIdentityMatrix();
      var node = element; // set predefined matrix if we need to find new CTM

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

    var E_MOUSEDOWN$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
    var keys$1 = Object.keys,
        entries = Object.entries,
        values$1 = Object.values;

    var Draggable = /*#__PURE__*/function (_Transformable) {
      _inherits(Draggable, _Transformable);

      var _super = _createSuper(Draggable);

      function Draggable() {
        _classCallCheck(this, Draggable);

        return _super.apply(this, arguments);
      }

      _createClass(Draggable, [{
        key: "_init",
        value: function _init(elements) {
          var _this = this;

          var _this$options = this.options,
              transformOrigin = _this$options.transformOrigin,
              container = _this$options.container,
              controlsContainer = _this$options.controlsContainer,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable,
              showNormal = _this$options.showNormal;
          var wrapper = createElement(['sjx-wrapper']);
          var controls = createElement(['sjx-controls']);
          var handles = {};

          var _this$_getVertices = this._getVertices(),
              _this$_getVertices$ro = _this$_getVertices.rotator,
              rotator = _this$_getVertices$ro === void 0 ? null : _this$_getVertices$ro,
              _this$_getVertices$an = _this$_getVertices.anchor,
              anchor = _this$_getVertices$an === void 0 ? null : _this$_getVertices$an,
              finalVertices = _objectWithoutProperties(_this$_getVertices, ["rotator", "anchor"]);

          var rotationHandles = {};

          if (rotatable) {
            var normalLine = showNormal ? renderLine([[anchor.x, anchor.y], rotator], 'normal') : null;
            if (showNormal) controls.appendChild(normalLine);
            var radius = null;

            if (transformOrigin) {
              radius = renderLine([finalVertices.center, finalVertices.center], 'radius');
              addClass(radius, 'sjx-hidden');
              controls.appendChild(radius);
            }

            rotationHandles = _objectSpread2({}, rotationHandles, {
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
          var resizingHandles = resizable ? {
            tl: finalVertices.tl,
            tr: finalVertices.tr,
            br: finalVertices.br,
            bl: finalVertices.bl,
            tc: finalVertices.tc,
            bc: finalVertices.bc,
            ml: finalVertices.ml,
            mr: finalVertices.mr
          } : {};
          var nextTransformOrigin = Array.isArray(transformOrigin) ? [].concat(_toConsumableArray(transformOrigin), [0, 1]) : finalVertices.center;

          var allHandles = _objectSpread2({}, resizingHandles, {
            center: transformOrigin && rotatable ? nextTransformOrigin : undefined,
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

          mapHandlers(resizingEdges, renderLine);
          mapHandlers(allHandles, createHandler);
          wrapper.appendChild(controls);
          controlsContainer.appendChild(wrapper);
          var data = new WeakMap();
          elements.map(function (element) {
            return data.set(element, {
              parent: element.parentNode,
              transform: {
                ctm: getCurrentTransformMatrix(element, container)
              },
              bBox: _this._getBBox(),
              __data__: new WeakMap(),
              cached: {}
            });
          });
          this.storage = {
            wrapper: wrapper,
            controls: controls,
            handles: _objectSpread2({}, handles, {}, rotationHandles),
            data: data,
            center: {
              isShifted: Array.isArray(transformOrigin)
            },
            transformOrigin: nextTransformOrigin
          };
          [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
            return helper(target).on(E_MOUSEDOWN$2, _this._onMouseDown).on(E_TOUCHSTART$2, _this._onTouchStart);
          });
        }
      }, {
        key: "_pointToTransform",
        value: function _pointToTransform(_ref) {
          var x = _ref.x,
              y = _ref.y,
              matrix = _ref.matrix;
          var nextMatrix = matrixInvert(matrix);
          return this._applyMatrixToPoint(dropTranslate(nextMatrix, false), x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(_ref2) {
          var x = _ref2.x,
              y = _ref2.y;
          var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
          var controlsMatrix = transform.controlsMatrix;
          var matrix = matrixInvert(controlsMatrix);
          return this._applyMatrixToPoint(dropTranslate(matrix, false), x, y);
        }
      }, {
        key: "_applyMatrixToPoint",
        value: function _applyMatrixToPoint(matrix, x, y) {
          var _multiplyMatrixAndPoi = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]),
              _multiplyMatrixAndPoi2 = _slicedToArray(_multiplyMatrixAndPoi, 2),
              nx = _multiplyMatrixAndPoi2[0],
              ny = _multiplyMatrixAndPoi2[1];

          return {
            x: nx,
            y: ny
          };
        }
      }, {
        key: "_cursorPoint",
        value: function _cursorPoint(_ref3) {
          var clientX = _ref3.clientX,
              clientY = _ref3.clientY;
          var container = this.options.container;
          var globalMatrix = getCurrentTransformMatrix(container);
          var offset = getElementOffset(container);

          var _getScrollOffset = getScrollOffset(),
              left = _getScrollOffset.left,
              top = _getScrollOffset.top;

          var translateMatrix = createTranslateMatrix(offset.left - left, offset.top - top);
          return this._applyMatrixToPoint(matrixInvert(multiplyMatrix(globalMatrix, translateMatrix)), clientX, clientY);
        }
      }, {
        key: "_getRestrictedBBox",
        value: function _getRestrictedBBox() {
          var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var containerMatrix = this.storage.transform.containerMatrix,
              _this$options2 = this.options,
              restrict = _this$options2.restrict,
              container = _this$options2.container;
          var restrictEl = restrict || container;
          return _getBoundingRect(restrictEl, container, force ? getCurrentTransformMatrix(restrictEl, container) : containerMatrix);
        }
      }, {
        key: "_applyTransformToElement",
        value: function _applyTransformToElement(element) {
          var _this$storage = this.storage,
              controls = _this$storage.controls,
              data = _this$storage.data,
              applyTranslate = this.options.applyTranslate;

          var _data$get = data.get(element),
              cached = _data$get.cached,
              matrix = _data$get.transform.matrix;

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
      }, {
        key: "_processActions",
        value: function _processActions() {}
      }, {
        key: "_processResize",
        value: function _processResize(element, _ref4) {
          var dx = _ref4.dx,
              dy = _ref4.dy;
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
            var scaleMatrix = createScaleMatrix(scaleX, scaleY);
            return multiplyMatrix(multiplyMatrix(translateMatrix, scaleMatrix), matrixInvert(translateMatrix));
          };

          var getTranslateMatrix = function getTranslateMatrix(scM, ctm) {
            var translateX = scM[0][3];
            var translateY = scM[1][3];
            var trMatrix = createTranslateMatrix(translateX, translateY);
            var inverted = createTranslateMatrix(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
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

          this._updateElementView(element, _objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix)), {}, !scalable && {
            width: "".concat(newWidth, "px"),
            height: "".concat(newHeight, "px")
          }));

          data.set(element, _objectSpread2({}, elementData, {
            cached: _objectSpread2({}, cached, {
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
      }, {
        key: "_processMove",
        value: function _processMove(element, _ref5) {
          var dx = _ref5.dx,
              dy = _ref5.dy;
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

          var moveElementMtrx = multiplyMatrix(matrix, createTranslateMatrix(nx, ny));
          var elStyle = matrixToCSS(flatMatrix(moveElementMtrx));

          this._updateElementView(element, elStyle);

          data.set(element, _objectSpread2({}, elementStorage, {
            cached: _objectSpread2({}, cached, {
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
      }, {
        key: "_processRotate",
        value: function _processRotate(element, radians) {
          var data = this.storage.data,
              restrict = this.options.restrict;

          var _data$get2 = data.get(element),
              _data$get2$transform = _data$get2.transform,
              matrix = _data$get2$transform.matrix,
              translateMatrix = _data$get2$transform.auxiliary.rotate.translateMatrix;

          var cos = floatToFixed(Math.cos(radians), 4),
              sin = floatToFixed(Math.sin(radians), 4);
          var rotationMatrix = createRotateMatrix(sin, cos);
          var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix), translateMatrix);
          var resultMatrix = multiplyMatrix(matrix, transformMatrix);

          var _ref6 = restrict ? this._restrictHandler(resultMatrix) : {
            x: null,
            y: null
          },
              restX = _ref6.x,
              restY = _ref6.y;

          if (isDef(restX) || isDef(restY)) return resultMatrix;

          this._updateElementView(element, matrixToCSS(flatMatrix(resultMatrix)));

          return resultMatrix;
        }
      }, {
        key: "_getElementState",
        value: function _getElementState(element, _ref7) {
          var revX = _ref7.revX,
              revY = _ref7.revY,
              doW = _ref7.doW,
              doH = _ref7.doH;
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
              hH = elHeight / 2; // real element's center

          var _multiplyMatrixAndPoi5 = multiplyMatrixAndPoint(ctm, [hW, hH, 0, 1]),
              _multiplyMatrixAndPoi6 = _slicedToArray(_multiplyMatrixAndPoi5, 2),
              cenX = _multiplyMatrixAndPoi6[0],
              cenY = _multiplyMatrixAndPoi6[1];

          var scaleX = doH ? 0 : revX ? -hW : hW,
              scaleY = doW ? 0 : revY ? -hH : hH;
          var globalCenterX = cenX + glLeft;
          var globalCenterY = cenY + glTop;
          var originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix(); // search distance between el's center and rotation handle

          var _multiplyMatrixAndPoi7 = multiplyMatrixAndPoint(multiplyMatrix(matrixInvert(dropTranslate(ctm)), dropTranslate(originTransform)), [transformOrigin[0] - globalCenterX, transformOrigin[1] - globalCenterY, 0, 1]),
              _multiplyMatrixAndPoi8 = _slicedToArray(_multiplyMatrixAndPoi7, 2),
              distX = _multiplyMatrixAndPoi8[0],
              distY = _multiplyMatrixAndPoi8[1]; // todo: check rotation origin with parent transform


          var _multiplyMatrixAndPoi9 = multiplyMatrixAndPoint(matrix, [distX, distY, 0, 1]),
              _multiplyMatrixAndPoi10 = _slicedToArray(_multiplyMatrixAndPoi9, 2),
              elX = _multiplyMatrixAndPoi10[0],
              elY = _multiplyMatrixAndPoi10[1];

          var _decompose = decompose(getCurrentTransformMatrix(element, element.parentNode)),
              _decompose$scale = _decompose.scale,
              sX = _decompose$scale.sX,
              sY = _decompose$scale.sY;

          var transform = {
            auxiliary: {
              scale: {
                translateMatrix: scalable ? createTranslateMatrix(scaleX, scaleY) : createTranslateMatrix(doH ? 0 : hW, doW ? 0 : hH)
              },
              translate: {
                parentMatrix: matrixInvert(dropTranslate(parentMatrix))
              },
              rotate: {
                translateMatrix: createTranslateMatrix(elX, elY)
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
      }, {
        key: "_getCommonState",
        value: function _getCommonState() {
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
          var containerMatrix = restrict ? getCurrentTransformMatrix(restrict, restrict.parentNode) : getCurrentTransformMatrix(container, container.parentNode);

          var _this$_getBBox = this._getBBox(),
              boxWidth = _this$_getBBox.width,
              boxHeight = _this$_getBBox.height; // real element's center


          var _multiplyMatrixAndPoi11 = multiplyMatrixAndPoint(ctm, [boxWidth / 2, boxHeight / 2, 0, 1]),
              _multiplyMatrixAndPoi12 = _slicedToArray(_multiplyMatrixAndPoi11, 2),
              cenX = _multiplyMatrixAndPoi12[0],
              cenY = _multiplyMatrixAndPoi12[1];

          var globalCenterX = cenX + glLeft;
          var globalCenterY = cenY + glTop;
          var originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();
          return {
            transform: {
              controlsMatrix: getCurrentTransformMatrix(controls, controls.parentNode),
              containerMatrix: containerMatrix,
              wrapperMatrix: getCurrentTransformMatrix(wrapper, container)
            },
            bBox: _objectSpread2({}, this._getBBox()),
            center: _objectSpread2({}, oldCenter, {
              x: globalCenterX,
              y: globalCenterY,
              matrix: originTransform
            })
          };
        }
      }, {
        key: "_getBBox",
        value: function _getBBox() {
          var _this$elements = _slicedToArray(this.elements, 1),
              element = _this$elements[0],
              _this$options6 = this.options,
              isGrouped = _this$options6.isGrouped,
              container = _this$options6.container;

          if (isGrouped) {
            return this._getGroupBbox();
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
      }, {
        key: "_processControlsResize",
        value: function _processControlsResize() {
          var _this$_applyTransform = this._applyTransformToHandles(),
              center = _this$_applyTransform.center;

          var controlsMatrix = this.storage.transform.controlsMatrix;
          if (!center) return;
          this.storage = _objectSpread2({}, this.storage, {
            cached: {
              transformOrigin: multiplyMatrixAndPoint(controlsMatrix, center)
            }
          });
        }
      }, {
        key: "_processControlsMove",
        value: function _processControlsMove(_ref8) {
          var dx = _ref8.dx,
              dy = _ref8.dy;
          var _this$storage5 = this.storage,
              _this$storage5$transf = _this$storage5.transform,
              controlsMatrix = _this$storage5$transf.controlsMatrix,
              wrapperMatrix = _this$storage5$transf.wrapperMatrix,
              center = _this$storage5.center,
              transformOrigin = _this$storage5.transformOrigin;
          var moveControlsMtrx = multiplyMatrix(controlsMatrix, createTranslateMatrix(dx, dy));
          var wrapperStyle = matrixToCSS(flatMatrix(moveControlsMtrx));

          this._updateControlsView(wrapperStyle);

          var centerTransformMatrix = dropTranslate(matrixInvert(wrapperMatrix));

          var _multiplyMatrixAndPoi13 = multiplyMatrixAndPoint(centerTransformMatrix, [dx, dy, 0, 1]),
              _multiplyMatrixAndPoi14 = _slicedToArray(_multiplyMatrixAndPoi13, 2),
              cx = _multiplyMatrixAndPoi14[0],
              cy = _multiplyMatrixAndPoi14[1];

          if (center.isShifted) {
            this._moveCenterHandle(-cx, -cy, false);
          } else {
            var translateMatrix = createTranslateMatrix(cx, cy);
            this.storage = _objectSpread2({}, this.storage, {
              cached: {
                transformOrigin: multiplyMatrixAndPoint(translateMatrix, transformOrigin)
              }
            });
          }
        }
      }, {
        key: "_processControlsRotate",
        value: function _processControlsRotate() {
          this._applyTransformToHandles();
        }
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(x, y) {
          var updateTransformOrigin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
          var _this$storage6 = this.storage,
              center = _this$storage6.handles.center,
              matrix = _this$storage6.center.matrix,
              prevCenterData = _this$storage6.center,
              transformOrigin = _this$storage6.transformOrigin;
          var translateMatrix = createTranslateMatrix(x, y);
          var resultMatrix = multiplyMatrix(matrix, translateMatrix);
          helper(center).css(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))));
          this.storage = _objectSpread2({}, this.storage, {
            center: _objectSpread2({}, prevCenterData, {
              isShifted: true
            })
          }, updateTransformOrigin ? {
            cached: {
              transformOrigin: multiplyMatrixAndPoint(translateMatrix, transformOrigin)
            }
          } : {});
        }
      }, {
        key: "_processMoveRestrict",
        value: function _processMoveRestrict(element, _ref9) {
          var dx = _ref9.dx,
              dy = _ref9.dy;
          var data = this.storage.data;
          var elementStorage = data.get(element);
          var _elementStorage$trans2 = elementStorage.transform,
              matrix = _elementStorage$trans2.matrix,
              parentMatrix = _elementStorage$trans2.auxiliary.translate.parentMatrix;

          var _multiplyMatrixAndPoi15 = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]),
              _multiplyMatrixAndPoi16 = _slicedToArray(_multiplyMatrixAndPoi15, 2),
              x = _multiplyMatrixAndPoi16[0],
              y = _multiplyMatrixAndPoi16[1];

          var preTranslateMatrix = multiplyMatrix(matrix, createTranslateMatrix(x, y));
          return this._restrictHandler(preTranslateMatrix);
        }
      }, {
        key: "_processRotateRestrict",
        value: function _processRotateRestrict(element, radians) {
          var data = this.storage.data;

          var _data$get3 = data.get(element),
              _data$get3$transform = _data$get3.transform,
              matrix = _data$get3$transform.matrix,
              translateMatrix = _data$get3$transform.auxiliary.rotate.translateMatrix;

          var cos = floatToFixed(Math.cos(radians), 4),
              sin = floatToFixed(Math.sin(radians), 4);
          var rotationMatrix = createRotateMatrix(sin, cos);
          var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix), translateMatrix);
          var resultMatrix = multiplyMatrix(matrix, transformMatrix);
          return this._restrictHandler(resultMatrix);
        }
      }, {
        key: "_processResizeRestrict",
        value: function _processResizeRestrict(element, _ref10) {
          var dx = _ref10.dx,
              dy = _ref10.dy;
          var _this$storage7 = this.storage,
              revX = _this$storage7.revX,
              revY = _this$storage7.revY,
              doW = _this$storage7.doW,
              doH = _this$storage7.doH,
              data = _this$storage7.data,
              _this$storage7$bBox = _this$storage7.bBox,
              boxWidth = _this$storage7$bBox.width,
              boxHeight = _this$storage7$bBox.height,
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
            var scaleMatrix = createScaleMatrix(scaleX, scaleY);
            return multiplyMatrix(multiplyMatrix(translateMatrix, scaleMatrix), matrixInvert(translateMatrix));
          };

          var getTranslateMatrix = function getTranslateMatrix(scM, ctm) {
            var translateX = scM[0][3];
            var translateY = scM[1][3];
            var trMatrix = createTranslateMatrix(translateX, translateY);
            var inverted = createTranslateMatrix(translateX * (revX ? -1 : 1), translateY * (revY ? -1 : 1));
            return multiplyMatrix(multiplyMatrix(inverted, ctm), matrixInvert(trMatrix));
          };

          var _getScale3 = getScale(dx, dy),
              _getScale4 = _slicedToArray(_getScale3, 2),
              pScaleX = _getScale4[0],
              pScaleY = _getScale4[1];

          var preScaleMatrix = getScaleMatrix(pScaleX, pScaleY);
          var preResultMatrix = scalable ? multiplyMatrix(preScaleMatrix, matrix) : getTranslateMatrix(preScaleMatrix, matrix);
          return this._restrictHandler(preResultMatrix);
        }
      }, {
        key: "_updateElementView",
        value: function _updateElementView(element, css) {
          helper(element).css(css);
        }
      }, {
        key: "_updateControlsView",
        value: function _updateControlsView(css) {
          helper(this.storage.controls).css(css);
        }
      }, {
        key: "_getVertices",
        value: function _getVertices() {
          var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createIdentityMatrix();
          var _this$elements2 = this.elements;
          _this$elements2 = _this$elements2 === void 0 ? [] : _this$elements2;

          var _this$elements3 = _slicedToArray(_this$elements2, 1),
              element = _this$elements3[0],
              _this$options8 = this.options,
              isGrouped = _this$options8.isGrouped,
              rotatable = _this$options8.rotatable,
              rotatorAnchor = _this$options8.rotatorAnchor,
              rotatorOffset = _this$options8.rotatorOffset;

          var finalVertices = isGrouped ? this._getGroupVertices() : this._getElementVertices(element, transformMatrix);
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

            var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(finalVertices.bl[1] - finalVertices.tl[1], finalVertices.bl[0] - finalVertices.tl[0]) : Math.atan2(finalVertices.tl[1] - finalVertices.tr[1], finalVertices.tl[0] - finalVertices.tr[0]);
            rotator = [anchor.x - rotatorOffset * factor * Math.cos(theta), anchor.y - rotatorOffset * factor * Math.sin(theta)];
            finalVertices.rotator = rotator;
            finalVertices.anchor = anchor;
          }

          return finalVertices;
        }
      }, {
        key: "_getElementVertices",
        value: function _getElementVertices(element, transformMatrix) {
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
          return entries(vertices).reduce(function (nextVertices, _ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
                key = _ref12[0],
                vertex = _ref12[1];

            return [].concat(_toConsumableArray(nextVertices), [[key, multiplyMatrixAndPoint(nextTransform, vertex)]]);
          }, []).reduce(function (vertices, _ref13) {
            var _ref14 = _slicedToArray(_ref13, 2),
                key = _ref14[0],
                _ref14$ = _slicedToArray(_ref14[1], 4),
                x = _ref14$[0],
                y = _ref14$[1],
                z = _ref14$[2],
                w = _ref14$[3];

            vertices[key] = [x + offsetLeft, y + offsetTop, z, w];
            return vertices;
          }, {});
        }
      }, {
        key: "_getGroupVertices",
        value: function _getGroupVertices() {
          var _this$_getGroupBbox = this._getGroupBbox(),
              x = _this$_getGroupBbox.x,
              y = _this$_getGroupBbox.y,
              width = _this$_getGroupBbox.width,
              height = _this$_getGroupBbox.height;

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
      }, {
        key: "_getGroupBbox",
        value: function _getGroupBbox() {
          var elements = this.elements,
              container = this.options.container;
          var vertices = elements.reduce(function (result, element) {
            var _getAbsoluteOffset9 = getAbsoluteOffset(element, container),
                _getAbsoluteOffset10 = _slicedToArray(_getAbsoluteOffset9, 2),
                offsetLeft = _getAbsoluteOffset10[0],
                offsetTop = _getAbsoluteOffset10[1];

            var offsetWidth = element.offsetWidth,
                offsetHeight = element.offsetHeight;
            var vertices = [[0, 0, 0, 1], [0, offsetHeight, 0, 1], [offsetWidth, offsetHeight, 0, 1], [offsetWidth, 0, 0, 1]];
            var nextTransform = getCurrentTransformMatrix(element, container);
            var groupVertices = vertices.reduce(function (nextVertices, vertex) {
              return [].concat(_toConsumableArray(nextVertices), [multiplyMatrixAndPoint(nextTransform, vertex)]);
            }, []).map(function (_ref15) {
              var _ref16 = _slicedToArray(_ref15, 4),
                  x = _ref16[0],
                  y = _ref16[1],
                  z = _ref16[2],
                  w = _ref16[3];

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
      }, {
        key: "_getElementBBox",
        value: function _getElementBBox(element) {
          var container = this.options.container;

          var _getAbsoluteOffset11 = getAbsoluteOffset(element, container),
              _getAbsoluteOffset12 = _slicedToArray(_getAbsoluteOffset11, 2),
              offsetLeft = _getAbsoluteOffset12[0],
              offsetTop = _getAbsoluteOffset12[1];

          var offsetWidth = element.offsetWidth,
              offsetHeight = element.offsetHeight;
          var vertices = [[0, 0, 0, 1], [0, offsetHeight, 0, 1], [offsetWidth, offsetHeight, 0, 1], [offsetWidth, 0, 0, 1]];
          var nextTransform = getCurrentTransformMatrix(element, container);
          var nextVertices = vertices.reduce(function (nextVertices, vertex) {
            return [].concat(_toConsumableArray(nextVertices), [multiplyMatrixAndPoint(nextTransform, vertex)]);
          }, []).map(function (_ref17) {
            var _ref18 = _slicedToArray(_ref17, 4),
                x = _ref18[0],
                y = _ref18[1],
                z = _ref18[2],
                w = _ref18[3];

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
      }, {
        key: "_applyTransformToHandles",
        value: function _applyTransformToHandles() {
          var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref19$boxMatrix = _ref19.boxMatrix,
              boxMatrix = _ref19$boxMatrix === void 0 ? createIdentityMatrix() : _ref19$boxMatrix;

          var _this$options10 = this.options,
              rotatable = _this$options10.rotatable,
              resizable = _this$options10.resizable,
              showNormal = _this$options10.showNormal,
              _this$storage8 = this.storage,
              handles = _this$storage8.handles,
              _this$storage8$center = _this$storage8.center;
          _this$storage8$center = _this$storage8$center === void 0 ? {} : _this$storage8$center;
          var _this$storage8$center2 = _this$storage8$center.isShifted,
              isShifted = _this$storage8$center2 === void 0 ? false : _this$storage8$center2,
              controlsMatrix = _this$storage8.transform.controlsMatrix;
          var matrix = multiplyMatrix(boxMatrix, // better to find result matrix instead of calculated
          matrixInvert(controlsMatrix));

          var _this$_getVertices2 = this._getVertices(matrix),
              _this$_getVertices2$a = _this$_getVertices2.anchor,
              anchor = _this$_getVertices2$a === void 0 ? null : _this$_getVertices2$a,
              center = _this$_getVertices2.center,
              finalVertices = _objectWithoutProperties(_this$_getVertices2, ["anchor", "center"]);

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

          var allHandles = _objectSpread2({}, resizable && finalVertices, {}, rotationHandles, {}, !isShifted && Boolean(center) && {
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
          var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              x = _ref20.x,
              y = _ref20.y,
              dx = _ref20.dx,
              dy = _ref20.dy;

          var pin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var _this$elements4 = this.elements;
          _this$elements4 = _this$elements4 === void 0 ? [] : _this$elements4;

          var _this$elements5 = _slicedToArray(_this$elements4, 1),
              element = _this$elements5[0],
              storage = this.storage,
              _this$storage9 = this.storage;

          _this$storage9 = _this$storage9 === void 0 ? {} : _this$storage9;
          var wrapper = _this$storage9.wrapper,
              handle = _this$storage9.handles.center,
              center = _this$storage9.center,
              _this$options11 = this.options;
          _this$options11 = _this$options11 === void 0 ? {} : _this$options11;
          var container = _this$options11.container;
          var isRelative = isDef(dx) && isDef(dy),
              isAbsolute = isDef(x) && isDef(y);
          if (!handle || !center || !(isRelative || isAbsolute)) return;
          var matrix = multiplyMatrix(getCurrentTransformMatrix(element, container), matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode)));
          var newX, newY;

          var _getAbsoluteOffset13 = getAbsoluteOffset(element, container),
              _getAbsoluteOffset14 = _slicedToArray(_getAbsoluteOffset13, 2),
              offsetLeft = _getAbsoluteOffset14[0],
              offsetTop = _getAbsoluteOffset14[1];

          if (isRelative) {
            var offsetHeight = element.offsetHeight,
                offsetWidth = element.offsetWidth;
            newX = -dx + offsetWidth / 2;
            newY = -dy + offsetHeight / 2;
          } else {
            newX = x;
            newY = y;
          }

          var _multiplyMatrixAndPoi17 = multiplyMatrixAndPoint(matrix, [newX, newY, 0, 1]),
              _multiplyMatrixAndPoi18 = _slicedToArray(_multiplyMatrixAndPoi17, 2),
              nextX = _multiplyMatrixAndPoi18[0],
              nextY = _multiplyMatrixAndPoi18[1];

          helper(handle).css({
            transform: "translate(".concat(nextX + offsetLeft, "px, ").concat(nextY + offsetTop, "px)")
          });
          center.isShifted = pin;
          storage.transformOrigin = multiplyMatrixAndPoint(createIdentityMatrix(), [nextX, nextY, 0, 1]);
        }
      }, {
        key: "fitControlsToSize",
        value: function fitControlsToSize() {
          var identityMatrix = createIdentityMatrix();
          this.storage = _objectSpread2({}, this.storage, {
            transform: _objectSpread2({}, this.storage.transform || {}, {
              controlsMatrix: identityMatrix
            })
          });

          this._updateControlsView(matrixToCSS(flatMatrix(identityMatrix)));

          this._applyTransformToHandles();
        }
      }, {
        key: "getBoundingRect",
        value: function getBoundingRect() {
          var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var _this$elements6 = this.elements;
          _this$elements6 = _this$elements6 === void 0 ? [] : _this$elements6;

          var _this$elements7 = _slicedToArray(_this$elements6, 1),
              element = _this$elements7[0],
              _this$options12 = this.options,
              scalable = _this$options12.scalable,
              restrict = _this$options12.restrict,
              container = _this$options12.container,
              _this$storage10 = this.storage,
              bBox = _this$storage10.bBox,
              _this$storage10$bBox = _this$storage10.bBox;

          _this$storage10$bBox = _this$storage10$bBox === void 0 ? {} : _this$storage10$bBox;
          var width = _this$storage10$bBox.width,
              height = _this$storage10$bBox.height,
              _this$storage10$cache = _this$storage10.cached;
          _this$storage10$cache = _this$storage10$cache === void 0 ? {} : _this$storage10$cache;
          var _this$storage10$cache2 = _this$storage10$cache.bBox;
          _this$storage10$cache2 = _this$storage10$cache2 === void 0 ? {} : _this$storage10$cache2;
          var _this$storage10$cache3 = _this$storage10$cache2.width,
              nextWidth = _this$storage10$cache3 === void 0 ? width : _this$storage10$cache3,
              _this$storage10$cache4 = _this$storage10$cache2.height,
              nextHeight = _this$storage10$cache4 === void 0 ? height : _this$storage10$cache4;
          var nextBox = scalable ? bBox : _objectSpread2({}, bBox, {
            width: nextWidth,
            height: nextHeight
          });
          var restrictEl = restrict || container;
          return _getBoundingRect(element, restrictEl, getCurrentTransformMatrix(element, restrictEl, transformMatrix), nextBox);
        }
      }, {
        key: "applyAlignment",
        value: function applyAlignment(direction) {
          var elements = this.elements,
              container = this.options.container;

          var _this$_getVertices3 = this._getVertices(),
              anchor = _this$_getVertices3.anchor,
              rotator = _this$_getVertices3.rotator,
              center = _this$_getVertices3.center,
              vertices = _objectWithoutProperties(_this$_getVertices3, ["anchor", "rotator", "center"]);

          var restrictBBox = this._getRestrictedBBox(true);

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

          var moveElementMtrx = multiplyMatrix(getTransform(elements[0]), createTranslateMatrix(x, y));

          this._updateElementView(elements[0], matrixToCSS(flatMatrix(moveElementMtrx)));

          this.fitControlsToSize();
        }
      }, {
        key: "getDimensions",
        value: function getDimensions() {
          var _this$elements8 = this.elements;
          _this$elements8 = _this$elements8 === void 0 ? [] : _this$elements8;

          var _this$elements9 = _slicedToArray(_this$elements8, 1),
              element = _this$elements9[0],
              isGrouped = this.options.isGrouped;

          var _ref21 = isGrouped ? this._getGroupVertices() : this._getElementVertices(element, createIdentityMatrix()),
              tl = _ref21.tl,
              tr = _ref21.tr,
              br = _ref21.br;

          return {
            x: floatToFixed(tl[0]),
            y: floatToFixed(tl[1]),
            width: floatToFixed(Math.sqrt(Math.pow(tl[0] - tr[0], 2) + Math.pow(tl[1] - tr[1], 2))),
            height: floatToFixed(Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2))),
            rotation: floatToFixed(Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * DEG)
          };
        }
      }]);

      return Draggable;
    }(Transformable);

    var createHandler = function createHandler(_ref22) {
      var _ref23 = _slicedToArray(_ref22, 2),
          x = _ref23[0],
          y = _ref23[1];

      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'handler';
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var element = createElement(['sjx-hdl', "sjx-hdl-".concat(key)]);
      helper(element).css(_objectSpread2({
        transform: "translate(".concat(x, "px, ").concat(y, "px)")
      }, style));
      return element;
    };

    var renderLine = function renderLine(_ref24, key) {
      var _ref25 = _slicedToArray(_ref24, 3),
          pt1 = _ref25[0],
          pt2 = _ref25[1],
          _ref25$ = _ref25[2],
          thickness = _ref25$ === void 0 ? 1 : _ref25$;

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

    var _getBoundingRect = function _getBoundingRect(element, container, ctm, bBox) {
      var _getAbsoluteOffset15 = getAbsoluteOffset(element, container),
          _getAbsoluteOffset16 = _slicedToArray(_getAbsoluteOffset15, 2),
          offsetLeft = _getAbsoluteOffset16[0],
          offsetTop = _getAbsoluteOffset16[1];

      var _ref26 = bBox || {
        width: element.offsetWidth,
        height: element.offsetHeight,
        offset: {
          left: offsetLeft,
          top: offsetTop
        }
      },
          width = _ref26.width,
          height = _ref26.height,
          _ref26$offset = _ref26.offset;

      _ref26$offset = _ref26$offset === void 0 ? {} : _ref26$offset;
      var left = _ref26$offset.left,
          top = _ref26$offset.top;
      var vertices = [[0, 0, 0, 1], [width, 0, 0, 1], [0, height, 0, 1], [width, height, 0, 1]];
      return vertices.reduce(function (nextVerteces, vertex) {
        return [].concat(_toConsumableArray(nextVerteces), [multiplyMatrixAndPoint(ctm, vertex)]);
      }, []).map(function (_ref27) {
        var _ref28 = _slicedToArray(_ref27, 4),
            x = _ref28[0],
            y = _ref28[1],
            z = _ref28[2],
            w = _ref28[3];

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
    var checkChildElements = function checkChildElements(element) {
      var arrOfElements = [];

      if (isSVGGroup(element)) {
        forEach.call(element.childNodes, function (item) {
          if (item.nodeType === 1) {
            var tagName = item.tagName.toLowerCase();

            if (allowedElements.indexOf(tagName) !== -1) {
              if (tagName === 'g') {
                arrOfElements.push.apply(arrOfElements, _toConsumableArray(checkChildElements(item)));
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
    var createTranslateMatrix$1 = function createTranslateMatrix(x, y) {
      var matrix = createSVGMatrix();
      matrix.e = x;
      matrix.f = y;
      return matrix;
    };
    var createRotateMatrix$1 = function createRotateMatrix(sin, cos) {
      var matrix = createSVGMatrix();
      matrix.a = cos;
      matrix.b = sin;
      matrix.c = -sin;
      matrix.d = cos;
      return matrix;
    };
    var createScaleMatrix$1 = function createScaleMatrix(x, y) {
      var matrix = createSVGMatrix();
      matrix.a = x;
      matrix.d = y;
      return matrix;
    };
    var getTransformToElement = function getTransformToElement(toElement, g) {
      var gTransform = g.getScreenCTM && g.getScreenCTM() || createSVGMatrix();
      return gTransform.inverse().multiply(toElement.getScreenCTM() || createSVGMatrix());
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
    var cloneMatrix$1 = function cloneMatrix(b) {
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
    }; // example "101.3,175.5 92.3,162 110.3,162 		"

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
      var match = dRE.lastIndex = 0;
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
            commandLength = _getCommandValuesLeng.size; // split big command into multiple commands


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
                var mtrx = cloneMatrix$1(localCTM);

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

                var _mtrx = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx.e = _mtrx.f = 0;
                }

                for (var _k7 = 0, _len9 = values.length; _k7 < _len9; _k7 += 6) {
                  var _values$slice9 = values.slice(_k7, _k7 + 6),
                      _values$slice10 = _slicedToArray(_values$slice9, 6),
                      x1 = _values$slice10[0],
                      y1 = _values$slice10[1],
                      x2 = _values$slice10[2],
                      y2 = _values$slice10[3],
                      _x2 = _values$slice10[4],
                      _y2 = _values$slice10[5];

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

                var _mtrx2 = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx2.e = _mtrx2.f = 0;
                }

                for (var _k8 = 0, _len10 = values.length; _k8 < _len10; _k8 += 1) {
                  var _values$slice11 = values.slice(_k8, _k8 + 1),
                      _values$slice12 = _slicedToArray(_values$slice11, 1),
                      _x3 = _values$slice12[0];

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

                var _mtrx3 = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx3.e = _mtrx3.f = 0;
                }

                for (var _k9 = 0, _len11 = values.length; _k9 < _len11; _k9 += 1) {
                  var _values$slice13 = values.slice(_k9, _k9 + 1),
                      _values$slice14 = _slicedToArray(_values$slice13, 1),
                      _y3 = _values$slice14[0];

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

                var _mtrx4 = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx4.e = _mtrx4.f = 0;
                }

                for (var _k10 = 0, _len12 = values.length; _k10 < _len12; _k10 += 2) {
                  var _values$slice15 = values.slice(_k10, _k10 + 2),
                      _values$slice16 = _slicedToArray(_values$slice15, 2),
                      _x4 = _values$slice16[0],
                      _y4 = _values$slice16[1];

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

                var _mtrx5 = cloneMatrix$1(localCTM);

                if (relative && !firstCommand) {
                  _mtrx5.e = _mtrx5.f = 0;
                }

                for (var _k11 = 0, _len13 = values.length; _k11 < _len13; _k11 += 2) {
                  var _values$slice17 = values.slice(_k11, _k11 + 2),
                      _values$slice18 = _slicedToArray(_values$slice17, 2),
                      _x5 = _values$slice18[0],
                      _y5 = _values$slice18[1];

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

                var _mtrx6 = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx6.e = _mtrx6.f = 0;
                }

                for (var _k12 = 0, _len14 = values.length; _k12 < _len14; _k12 += 4) {
                  var _values$slice19 = values.slice(_k12, _k12 + 4),
                      _values$slice20 = _slicedToArray(_values$slice19, 4),
                      _x6 = _values$slice20[0],
                      _y6 = _values$slice20[1],
                      _x7 = _values$slice20[2],
                      _y7 = _values$slice20[3];

                  var _pointTo10 = pointTo(_mtrx6, _x6, _y6),
                      _resX5 = _pointTo10.x,
                      _resY5 = _pointTo10.y;

                  var _pointTo11 = pointTo(_mtrx6, _x7, _y7),
                      _resX6 = _pointTo11.x,
                      _resY6 = _pointTo11.y;

                  _coordinates6.push(floatToFixed(_resX5), floatToFixed(_resY5), floatToFixed(_resX6), floatToFixed(_resY6));
                }

                res.push(_coordinates6);
                break;
              }

            case 'S':
              {
                // S x2 y2, x y (or s dx2 dy2, dx dy)
                var _coordinates7 = [];

                var _mtrx7 = cloneMatrix$1(localCTM);

                if (relative) {
                  _mtrx7.e = _mtrx7.f = 0;
                }

                for (var _k13 = 0, _len15 = values.length; _k13 < _len15; _k13 += 4) {
                  var _values$slice21 = values.slice(_k13, _k13 + 4),
                      _values$slice22 = _slicedToArray(_values$slice21, 4),
                      _x8 = _values$slice22[0],
                      _y8 = _values$slice22[1],
                      _x9 = _values$slice22[2],
                      _y9 = _values$slice22[3];

                  var _pointTo12 = pointTo(_mtrx7, _x8, _y8),
                      _resX7 = _pointTo12.x,
                      _resY7 = _pointTo12.y;

                  var _pointTo13 = pointTo(_mtrx7, _x9, _y9),
                      _resX8 = _pointTo13.x,
                      _resY8 = _pointTo13.y;

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
                  _x10 = _values2[0],
                  _y10 = _values2[1];

              var nextX = currentX + _x10;
              var nextY = currentY + _y10;
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
                  _x11 = _values3[0],
                  _y11 = _values3[1];

              nextSeg = {
                key: 'L',
                values: [_x11, _y11]
              };
              currentX = _x11;
              currentY = _y11;
              break;
            }

          case 'l':
            {
              var _values4 = _slicedToArray(values, 2),
                  _x12 = _values4[0],
                  _y12 = _values4[1];

              var _nextX = currentX + _x12;

              var _nextY = currentY + _y12;

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
                  _x13 = _values5[4],
                  _y13 = _values5[5];

              nextSeg = {
                key: 'C',
                values: [x1, y1, x2, y2, _x13, _y13]
              };
              currentX = _x13;
              currentY = _y13;
              break;
            }

          case 'c':
            {
              var _values6 = _slicedToArray(values, 6),
                  _x14 = _values6[0],
                  _y14 = _values6[1],
                  _x15 = _values6[2],
                  _y15 = _values6[3],
                  _x16 = _values6[4],
                  _y16 = _values6[5];

              var nextValues = [currentX + _x14, currentY + _y14, currentX + _x15, currentY + _y15, currentX + _x16, currentY + _y16];
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
                  _x17 = _values7[0],
                  _y17 = _values7[1],
                  _x18 = _values7[2],
                  _y18 = _values7[3];

              nextSeg = {
                key: 'Q',
                values: [_x17, _y17, _x18, _y18]
              };
              currentX = _x18;
              currentY = _y18;
              break;
            }

          case 'q':
            {
              var _values8 = _slicedToArray(values, 4),
                  _x19 = _values8[0],
                  _y19 = _values8[1],
                  _x20 = _values8[2],
                  _y20 = _values8[3];

              var _nextValues = [currentX + _x19, currentY + _y19, currentX + _x20, currentY + _y20];
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
                  _x21 = _values9[5],
                  _y21 = _values9[6];

              nextSeg = {
                key: 'A',
                values: [r1, r2, angle, largeArcFlag, sweepFlag, _x21, _y21]
              };
              currentX = _x21;
              currentY = _y21;
              break;
            }

          case 'a':
            {
              var _values10 = _slicedToArray(values, 7),
                  _r = _values10[0],
                  _r2 = _values10[1],
                  _angle = _values10[2],
                  _largeArcFlag = _values10[3],
                  _sweepFlag = _values10[4],
                  _x22 = _values10[5],
                  _y22 = _values10[6];

              var _nextX2 = currentX + _x22;

              var _nextY2 = currentY + _y22;

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
              var _values11 = _slicedToArray(values, 1),
                  _x23 = _values11[0];

              nextSeg = {
                key: 'H',
                values: [_x23]
              };
              currentX = _x23;
              break;
            }

          case 'h':
            {
              var _values12 = _slicedToArray(values, 1),
                  _x24 = _values12[0];

              var _nextX3 = currentX + _x24;

              nextSeg = {
                key: 'H',
                values: [_nextX3]
              };
              currentX = _nextX3;
              break;
            }

          case 'V':
            {
              var _values13 = _slicedToArray(values, 1),
                  _y23 = _values13[0];

              nextSeg = {
                key: 'V',
                values: [_y23]
              };
              currentY = _y23;
              break;
            }

          case 'v':
            {
              var _values14 = _slicedToArray(values, 1),
                  _y24 = _values14[0];

              var _nextY3 = currentY + _y24;

              nextSeg = {
                key: 'V',
                values: [_nextY3]
              };
              currentY = _nextY3;
              break;
            }

          case 'S':
            {
              var _values15 = _slicedToArray(values, 4),
                  _x25 = _values15[0],
                  _y25 = _values15[1],
                  _x26 = _values15[2],
                  _y26 = _values15[3];

              nextSeg = {
                key: 'S',
                values: [_x25, _y25, _x26, _y26]
              };
              currentX = _x26;
              currentY = _y26;
              break;
            }

          case 's':
            {
              var _values16 = _slicedToArray(values, 4),
                  _x27 = _values16[0],
                  _y27 = _values16[1],
                  _x28 = _values16[2],
                  _y28 = _values16[3];

              var _nextValues2 = [currentX + _x27, currentY + _y27, currentX + _x28, currentY + _y28];
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
              var _values17 = _slicedToArray(values, 2),
                  _x29 = _values17[0],
                  _y29 = _values17[1];

              nextSeg = {
                key: 'T',
                values: [_x29, _y29]
              };
              currentX = _x29;
              currentY = _y29;
              break;
            }

          case 't':
            {
              var _values18 = _slicedToArray(values, 2),
                  _x30 = _values18[0],
                  _y30 = _values18[1];

              var _nextX4 = currentX + _x30;

              var _nextY4 = currentY + _y30;

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
              var _values19 = _slicedToArray(values, 2),
                  x = _values19[0],
                  y = _values19[1];

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
              var _values20 = _slicedToArray(values, 6),
                  x1 = _values20[0],
                  y1 = _values20[1],
                  x2 = _values20[2],
                  y2 = _values20[3],
                  _x31 = _values20[4],
                  _y31 = _values20[5];

              nextSeg = [{
                key: 'C',
                values: [x1, y1, x2, y2, _x31, _y31]
              }];
              lastControlX = x2;
              lastControlY = y2;
              currentX = _x31;
              currentY = _y31;
              break;
            }

          case 'L':
            {
              var _values21 = _slicedToArray(values, 2),
                  _x32 = _values21[0],
                  _y32 = _values21[1];

              nextSeg = [{
                key: 'L',
                values: [_x32, _y32]
              }];
              currentX = _x32;
              currentY = _y32;
              break;
            }

          case 'H':
            {
              var _values22 = _slicedToArray(values, 1),
                  _x33 = _values22[0];

              nextSeg = [{
                key: 'L',
                values: [_x33, currentY]
              }];
              currentX = _x33;
              break;
            }

          case 'V':
            {
              var _values23 = _slicedToArray(values, 1),
                  _y33 = _values23[0];

              nextSeg = [{
                key: 'L',
                values: [currentX, _y33]
              }];
              currentY = _y33;
              break;
            }

          case 'S':
            {
              var _values24 = _slicedToArray(values, 4),
                  _x34 = _values24[0],
                  _y34 = _values24[1],
                  _x35 = _values24[2],
                  _y35 = _values24[3];

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
                values: [cx1, cy1, _x34, _y34, _x35, _y35]
              }];
              lastControlX = _x34;
              lastControlY = _y34;
              currentX = _x35;
              currentY = _y35;
              break;
            }

          case 'T':
            {
              var _values25 = _slicedToArray(values, 2),
                  _x36 = _values25[0],
                  _y36 = _values25[1];

              var _x37, _y37;

              if (lastType === 'Q' || lastType === 'T') {
                _x37 = currentX + (currentX - lastControlX);
                _y37 = currentY + (currentY - lastControlY);
              } else {
                _x37 = currentX;
                _y37 = currentY;
              }

              var _cx = currentX + 2 * (_x37 - currentX) / 3;

              var _cy = currentY + 2 * (_y37 - currentY) / 3;

              var cx2 = _x36 + 2 * (_x37 - _x36) / 3;
              var cy2 = _y36 + 2 * (_y37 - _y36) / 3;
              nextSeg = [{
                key: 'C',
                values: [_cx, _cy, cx2, cy2, _x36, _y36]
              }];
              lastControlX = _x37;
              lastControlY = _y37;
              currentX = _x36;
              currentY = _y36;
              break;
            }

          case 'Q':
            {
              var _values26 = _slicedToArray(values, 4),
                  _x38 = _values26[0],
                  _y38 = _values26[1],
                  _x39 = _values26[2],
                  _y39 = _values26[3];

              var _cx2 = currentX + 2 * (_x38 - currentX) / 3;

              var _cy2 = currentY + 2 * (_y38 - currentY) / 3;

              var _cx3 = _x39 + 2 * (_x38 - _x39) / 3;

              var _cy3 = _y39 + 2 * (_y38 - _y39) / 3;

              nextSeg = [{
                key: 'C',
                values: [_cx2, _cy2, _cx3, _cy3, _x39, _y39]
              }];
              lastControlX = _x38;
              lastControlY = _y38;
              currentX = _x39;
              currentY = _y39;
              break;
            }

          case 'A':
            {
              var _values27 = _slicedToArray(values, 7),
                  r1 = _values27[0],
                  r2 = _values27[1],
                  angle = _values27[2],
                  largeArcFlag = _values27[3],
                  sweepFlag = _values27[4],
                  _x40 = _values27[5],
                  _y40 = _values27[6];

              if (r1 === 0 || r2 === 0) {
                nextSeg = [{
                  key: 'C',
                  values: [currentX, currentY, _x40, _y40, _x40, _y40]
                }];
                currentX = _x40;
                currentY = _y40;
              } else {
                if (currentX !== _x40 || currentY !== _y40) {
                  var curves = arcToCubicCurves(currentX, currentY, _x40, _y40, r1, r2, angle, largeArcFlag, sweepFlag);
                  nextSeg = curves.map(function (curve) {
                    return {
                      key: 'C',
                      values: curve
                    };
                  });
                  currentX = _x40;
                  currentY = _y40;
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
    }; //  - a2c() by Dmitry Baranovskiy (MIT License)
    //  https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.js#L2216


    var arcToCubicCurves = function arcToCubicCurves(x1, y1, x2, y2, rx, ry, xAxisRot, largeArcFlag, sweepFlag, recursive) {
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
        params = arcToCubicCurves(x2, y2, x2old, y2old, rx, ry, xAxisRot, 0, sweepFlag, [f2, f2old, cx, cy]);
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

    var E_DRAG$3 = EVENT_EMITTER_CONSTANTS.E_DRAG,
        E_RESIZE$2 = EVENT_EMITTER_CONSTANTS.E_RESIZE,
        E_ROTATE$2 = EVENT_EMITTER_CONSTANTS.E_ROTATE;
    var E_MOUSEDOWN$3 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$3 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;
    var keys$2 = Object.keys,
        entries$1 = Object.entries,
        values$2 = Object.values;

    var DraggableSVG = /*#__PURE__*/function (_Transformable) {
      _inherits(DraggableSVG, _Transformable);

      var _super = _createSuper(DraggableSVG);

      function DraggableSVG() {
        _classCallCheck(this, DraggableSVG);

        return _super.apply(this, arguments);
      }

      _createClass(DraggableSVG, [{
        key: "_init",
        value: function _init(elements) {
          var _this = this;

          var _this$options = this.options,
              container = _this$options.container,
              controlsContainer = _this$options.controlsContainer,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable,
              showNormal = _this$options.showNormal,
              transformOrigin = _this$options.transformOrigin;
          var wrapper = createSVGElement('g', ['sjx-svg-wrapper']);
          var controls = createSVGElement('g', ['sjx-svg-controls']);

          var _this$_getVertices = this._getVertices(),
              _this$_getVertices$ro = _this$_getVertices.rotator,
              rotator = _this$_getVertices$ro === void 0 ? null : _this$_getVertices$ro,
              _this$_getVertices$an = _this$_getVertices.anchor,
              anchor = _this$_getVertices$an === void 0 ? null : _this$_getVertices$an,
              nextVertices = _objectWithoutProperties(_this$_getVertices, ["rotator", "anchor"]);

          var handles = {};
          var rotationHandles = {};
          var nextTransformOrigin = Array.isArray(transformOrigin) ? pointTo(createSVGMatrix(), transformOrigin[0], transformOrigin[1]) : nextVertices.center;

          if (rotatable) {
            var normalLine = showNormal ? renderLine$1([anchor, rotator], THEME_COLOR, 'normal') : null;
            if (showNormal) controls.appendChild(normalLine);
            var radius = null;

            if (transformOrigin) {
              radius = createSVGElement('line', ['sjx-hidden']);
              radius.x1.baseVal.value = nextVertices.center.x;
              radius.y1.baseVal.value = nextVertices.center.y;
              radius.x2.baseVal.value = nextTransformOrigin.x;
              radius.y2.baseVal.value = nextTransformOrigin.y;
              setLineStyle(radius, '#fe3232');
              radius.setAttribute('opacity', 0.5);
              controls.appendChild(radius);
            }

            rotationHandles = _objectSpread2({}, rotationHandles, {
              normal: normalLine,
              radius: radius
            });
          }

          var resizingHandles = resizable ? {
            tl: nextVertices.tl,
            tr: nextVertices.tr,
            br: nextVertices.br,
            bl: nextVertices.bl,
            tc: nextVertices.tc,
            bc: nextVertices.bc,
            ml: nextVertices.ml,
            mr: nextVertices.mr
          } : {};
          var resizingEdges = {
            te: [nextVertices.tl, nextVertices.tr],
            be: [nextVertices.bl, nextVertices.br],
            le: [nextVertices.tl, nextVertices.bl],
            re: [nextVertices.tr, nextVertices.br]
          };
          keys$2(resizingEdges).forEach(function (key) {
            var data = resizingEdges[key];
            if (isUndef(data)) return;
            handles[key] = renderLine$1(data, THEME_COLOR, key);
            controls.appendChild(handles[key]);
          });

          var allHandles = _objectSpread2({}, resizingHandles, {
            rotator: rotator,
            center: transformOrigin && rotatable ? nextTransformOrigin : undefined
          });

          keys$2(allHandles).forEach(function (key) {
            var data = allHandles[key];
            if (isUndef(data)) return;
            var x = data.x,
                y = data.y;
            var color = key === 'center' ? '#fe3232' : THEME_COLOR;
            handles[key] = createHandler$1(x, y, color, key);
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
          this.storage = {
            wrapper: wrapper,
            controls: controls,
            handles: _objectSpread2({}, handles, {}, rotationHandles),
            data: data,
            center: {
              isShifted: Array.isArray(transformOrigin)
            },
            transformOrigin: nextTransformOrigin
          };
          [].concat(_toConsumableArray(elements), [controls]).map(function (target) {
            return helper(target).on(E_MOUSEDOWN$3, _this._onMouseDown).on(E_TOUCHSTART$3, _this._onTouchStart);
          });
        }
      }, {
        key: "_cursorPoint",
        value: function _cursorPoint(_ref) {
          var clientX = _ref.clientX,
              clientY = _ref.clientY;
          var container = this.options.container;
          return this._applyMatrixToPoint(container.getScreenCTM().inverse(), clientX, clientY);
        }
      }, {
        key: "_getRestrictedBBox",
        value: function _getRestrictedBBox() {
          var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var _this$storage = this.storage;
          _this$storage = _this$storage === void 0 ? {} : _this$storage;
          var _this$storage$transfo = _this$storage.transform;
          _this$storage$transfo = _this$storage$transfo === void 0 ? {} : _this$storage$transfo;
          var containerMatrix = _this$storage$transfo.containerMatrix,
              _this$options2 = this.options;
          _this$options2 = _this$options2 === void 0 ? {} : _this$options2;
          var container = _this$options2.container,
              restrict = _this$options2.restrict;
          var restrictEl = restrict || container;
          return _getBoundingRect$1(restrictEl, force ? getTransformToElement(restrictEl, container) : containerMatrix);
        }
      }, {
        key: "_pointToTransform",
        value: function _pointToTransform(_ref2) {
          var x = _ref2.x,
              y = _ref2.y,
              matrix = _ref2.matrix;
          var nextMatrix = matrix.inverse();
          nextMatrix.e = nextMatrix.f = 0;
          return this._applyMatrixToPoint(nextMatrix, x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(_ref3) {
          var x = _ref3.x,
              y = _ref3.y;
          var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.storage.transform;
          var controlsMatrix = transform.controlsMatrix;
          var matrix = controlsMatrix.inverse();
          matrix.e = matrix.f = 0;
          return this._applyMatrixToPoint(matrix, x, y);
        }
      }, {
        key: "_applyMatrixToPoint",
        value: function _applyMatrixToPoint(matrix, x, y) {
          var pt = createSVGElement('svg').createSVGPoint();
          pt.x = x;
          pt.y = y;
          return pt.matrixTransform(matrix);
        }
      }, {
        key: "_applyTransformToElement",
        value: function _applyTransformToElement(element, actionName) {
          var _this$storage2 = this.storage;
          _this$storage2 = _this$storage2 === void 0 ? {} : _this$storage2;
          var data = _this$storage2.data,
              bBox = _this$storage2.bBox,
              _this$options3 = this.options;
          _this$options3 = _this$options3 === void 0 ? {} : _this$options3;
          var isGrouped = _this$options3.isGrouped,
              scalable = _this$options3.scalable,
              applyDragging = _this$options3.applyTranslate;

          var _data$get = data.get(element),
              _data$get$cached = _data$get.cached,
              cached = _data$get$cached === void 0 ? {} : _data$get$cached,
              nextData = _objectWithoutProperties(_data$get, ["cached"]);

          var _nextData$transform = nextData.transform,
              matrix = _nextData$transform.matrix,
              parentMatrix = _nextData$transform.parentMatrix,
              __data__ = nextData.__data__;
          var scaleX = cached.scaleX,
              scaleY = cached.scaleY,
              _cached$dist = cached.dist;
          _cached$dist = _cached$dist === void 0 ? {} : _cached$dist;
          var dx = _cached$dist.dx,
              dy = _cached$dist.dy,
              ox = _cached$dist.ox,
              oy = _cached$dist.oy,
              transformMatrix = cached.transformMatrix;

          if (actionName === E_DRAG$3) {
            if (!applyDragging || !dx && !dy) return;
            var eM = createTranslateMatrix$1(ox, oy);
            var translateMatrix = eM.multiply(matrix).multiply(eM.inverse());

            this._updateElementView(['transform', translateMatrix]);

            if (isSVGGroup(element)) {
              checkChildElements(element).map(function (child) {
                var eM = createTranslateMatrix$1(dx, dy);
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

          if (actionName === E_RESIZE$2) {
            if (!transformMatrix) return;

            if (!scalable) {
              if (isSVGGroup(element) || isGrouped) {
                var elements = checkChildElements(element);
                elements.forEach(function (child) {
                  if (!isSVGGroup(child)) {
                    var childCTM = getTransformToElement(child, isGrouped ? element.parentNode : element);
                    var localCTM = childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
                    applyResize(child, {
                      dx: dx,
                      dy: dy,
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
                  dx: dx,
                  dy: dy,
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
      }, {
        key: "_processActions",
        value: function _processActions(actionName) {
          var _this$storage3 = this.storage,
              controlsMatrix = _this$storage3.transform.controlsMatrix,
              _this$storage3$center = _this$storage3.center;
          _this$storage3$center = _this$storage3$center === void 0 ? {} : _this$storage3$center;
          var isShifted = _this$storage3$center.isShifted,
              isGrouped = this.options.isGrouped;

          if (isGrouped && actionName === E_ROTATE$2) {
            this._applyTransformToHandles();

            var _pointTo2 = pointTo(controlsMatrix, 0, 0),
                dx = _pointTo2.x,
                dy = _pointTo2.y;

            if (isShifted) this._moveCenterHandle(dx, dy);

            this._updateControlsView();

            if (!isShifted) this.setTransformOrigin({
              dx: 0,
              dy: 0
            }, false);
          }
        }
      }, {
        key: "_processResize",
        value: function _processResize(element, _ref4) {
          var dx = _ref4.dx,
              dy = _ref4.dy;
          var _this$storage4 = this.storage,
              revX = _this$storage4.revX,
              revY = _this$storage4.revY,
              doW = _this$storage4.doW,
              doH = _this$storage4.doH,
              data = _this$storage4.data,
              _this$storage4$bBox = _this$storage4.bBox,
              x = _this$storage4$bBox.x,
              y = _this$storage4$bBox.y,
              boxWidth = _this$storage4$bBox.width,
              boxHeight = _this$storage4$bBox.height,
              _this$options4 = this.options,
              isGrouped = _this$options4.isGrouped,
              proportions = _this$options4.proportions,
              scalable = _this$options4.scalable;
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
            var scaleMatrix = createScaleMatrix$1(scaleX, scaleY);
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
          if (scalable) this._updateElementView(element, ['transform', resultMatrix]);
          data.set(element, _objectSpread2({}, elementData, {
            cached: _objectSpread2({}, cached, {
              scaleX: scaleX,
              scaleY: scaleY,
              transformMatrix: scaleMatrix,
              resultMatrix: resultMatrix
            })
          }));

          this._applyTransformToElement(element, E_RESIZE$2);

          return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            transform: resultMatrix
          };
        }
      }, {
        key: "_processMove",
        value: function _processMove(element, _ref5) {
          var dx = _ref5.dx,
              dy = _ref5.dy;
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

          data.set(element, _objectSpread2({}, elementStorage, {
            cached: _objectSpread2({}, cached, {
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

          this._updateElementView(element, ['transform', moveElementMtrx]);

          return moveElementMtrx;
        }
      }, {
        key: "_processRotate",
        value: function _processRotate(element, radians) {
          var _this$storage5 = this.storage;
          _this$storage5 = _this$storage5 === void 0 ? {} : _this$storage5;
          var data = _this$storage5.data;

          var _data$get2 = data.get(element),
              _data$get2$transform = _data$get2.transform,
              matrix = _data$get2$transform.matrix,
              parentMatrix = _data$get2$transform.parentMatrix,
              translateMatrix = _data$get2$transform.auxiliary.rotate.translateMatrix;

          var cos = floatToFixed(Math.cos(radians)),
              sin = floatToFixed(Math.sin(radians));
          var rotateMatrix = createRotateMatrix$1(sin, cos);
          parentMatrix.e = parentMatrix.f = 0;
          var resRotMatrix = parentMatrix.inverse().multiply(rotateMatrix).multiply(parentMatrix);
          var resRotateMatrix = translateMatrix.multiply(resRotMatrix).multiply(translateMatrix.inverse());
          var resultMatrix = resRotateMatrix.multiply(matrix);

          this._updateElementView(element, ['transform', resultMatrix]);

          return resultMatrix;
        }
      }, {
        key: "_getElementState",
        value: function _getElementState(element, _ref6) {
          var revX = _ref6.revX,
              revY = _ref6.revY,
              doW = _ref6.doW,
              doH = _ref6.doH;
          var _this$options5 = this.options,
              container = _this$options5.container,
              isGrouped = _this$options5.isGrouped,
              _this$storage6 = this.storage,
              data = _this$storage6.data,
              controls = _this$storage6.controls,
              cHandle = _this$storage6.handles.center,
              _this$storage6$transf = _this$storage6.transformOrigin,
              originX = _this$storage6$transf.x,
              originY = _this$storage6$transf.y;
          var elementData = data.get(element);
          var __data__ = elementData.__data__;
          storeElementAttributes(element, elementData, container);

          __data__["delete"](element);

          checkChildElements(element).forEach(function (child) {
            __data__["delete"](child);

            storeElementAttributes(child, elementData, element, isGrouped);
          });

          var bBox = this._getBBox();

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
              elCenterY = elY + elH / 2; // c-handle's coordinates

          var _pointTo4 = pointTo(boxCTM, originX, originY),
              bcx = _pointTo4.x,
              bcy = _pointTo4.y; // element's center coordinates


          var _ref7 = cHandle ? pointTo(parentMatrixInverted, bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : elMatrix, elCenterX, elCenterY),
              elcx = _ref7.x,
              elcy = _ref7.y;

          var _ref8 = cHandle ? pointTo(isGrouped ? parentMatrixInverted : ctm.inverse(), bcx, bcy) : pointTo(isGrouped ? parentMatrixInverted : createSVGMatrix(), scaleX, scaleY),
              nextScaleX = _ref8.x,
              nextScaleY = _ref8.y;

          var transform = {
            auxiliary: {
              scale: {
                scaleMatrix: createSVGMatrix(),
                translateMatrix: createTranslateMatrix$1(nextScaleX, nextScaleY)
              },
              translate: {
                parentMatrix: parentMatrixInverted,
                translateMatrix: createSVGMatrix()
              },
              rotate: {
                translateMatrix: createTranslateMatrix$1(elcx, elcy)
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
      }, {
        key: "_getCommonState",
        value: function _getCommonState() {
          var elements = this.elements,
              _this$options6 = this.options,
              isGrouped = _this$options6.isGrouped,
              container = _this$options6.container,
              restrict = _this$options6.restrict,
              _this$storage7 = this.storage,
              controls = _this$storage7.controls,
              cHandle = _this$storage7.handles.center;

          var bBox = this._getBBox();

          var elX = bBox.x,
              elY = bBox.y,
              elW = bBox.width,
              elH = bBox.height;
          var elCenterX = elX + elW / 2,
              elCenterY = elY + elH / 2;
          var boxCTM = getTransformToElement(controls, container);
          var centerX = cHandle ? cHandle.cx.baseVal.value : elCenterX;
          var centerY = cHandle ? cHandle.cy.baseVal.value : elCenterY; // c-handle's coordinates

          var _pointTo5 = pointTo(boxCTM, centerX, centerY),
              bcx = _pointTo5.x,
              bcy = _pointTo5.y; // box's center coordinates


          var _pointTo6 = pointTo(isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container), elCenterX, elCenterY),
              rcx = _pointTo6.x,
              rcy = _pointTo6.y;

          var containerMatrix = restrict ? getTransformToElement(restrict, restrict.parentNode) : getTransformToElement(container, container.parentNode);

          var center = _objectSpread2({}, this.storage.center || {}, {
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
              wrapperOriginMatrix: createTranslateMatrix$1(center.x, center.y)
            },
            bBox: bBox,
            center: center
          };
        }
      }, {
        key: "_getVertices",
        value: function _getVertices() {
          var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createSVGMatrix();
          var elements = this.elements,
              _this$options7 = this.options,
              isGrouped = _this$options7.isGrouped,
              rotatable = _this$options7.rotatable,
              rotatorAnchor = _this$options7.rotatorAnchor,
              rotatorOffset = _this$options7.rotatorOffset,
              container = _this$options7.container;

          var _this$_getBBox = this._getBBox(),
              x = _this$_getBBox.x,
              y = _this$_getBBox.y,
              width = _this$_getBBox.width,
              height = _this$_getBBox.height;

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
          var nextTransform = isGrouped ? transformMatrix : transformMatrix.multiply(getTransformToElement(elements[0], container));
          var nextVertices = entries$1(vertices).reduce(function (nextRes, _ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
                key = _ref10[0],
                _ref10$ = _slicedToArray(_ref10[1], 2),
                x = _ref10$[0],
                y = _ref10$[1];

            nextRes[key] = pointTo(nextTransform, x, y);
            return nextRes;
          }, {});

          if (rotatable) {
            var anchor = {};
            var factor = 1;

            switch (rotatorAnchor) {
              case 'n':
                {
                  var _nextVertices$tc = nextVertices.tc,
                      _x = _nextVertices$tc.x,
                      _y = _nextVertices$tc.y;
                  anchor.x = _x;
                  anchor.y = _y;
                  break;
                }

              case 's':
                {
                  var _nextVertices$bc = nextVertices.bc,
                      _x2 = _nextVertices$bc.x,
                      _y2 = _nextVertices$bc.y;
                  anchor.x = _x2;
                  anchor.y = _y2;
                  factor = -1;
                  break;
                }

              case 'w':
                {
                  var _nextVertices$ml = nextVertices.ml,
                      _x3 = _nextVertices$ml.x,
                      _y3 = _nextVertices$ml.y;
                  anchor.x = _x3;
                  anchor.y = _y3;
                  factor = -1;
                  break;
                }

              case 'e':
              default:
                {
                  var _nextVertices$mr = nextVertices.mr,
                      _x4 = _nextVertices$mr.x,
                      _y4 = _nextVertices$mr.y;
                  anchor.x = _x4;
                  anchor.y = _y4;
                  break;
                }
            }

            var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(nextVertices.bl.y - nextVertices.tl.y, nextVertices.bl.x - nextVertices.tl.x) : Math.atan2(nextVertices.tl.y - nextVertices.tr.y, nextVertices.tl.x - nextVertices.tr.x);
            var nextRotatorOffset = rotatorOffset * factor;
            var rotator = {
              x: anchor.x - nextRotatorOffset * Math.cos(theta),
              y: anchor.y - nextRotatorOffset * Math.sin(theta)
            };
            nextVertices.rotator = rotator;
            nextVertices.anchor = anchor;
          }

          return nextVertices;
        }
      }, {
        key: "_getBBox",
        value: function _getBBox() {
          var elements = this.elements,
              _this$options8 = this.options,
              container = _this$options8.container,
              isGrouped = _this$options8.isGrouped;

          if (isGrouped) {
            var groupBBox = elements.reduce(function (result, element) {
              var elCTM = getTransformToElement(element, container);
              return [].concat(_toConsumableArray(result), _toConsumableArray(_getBoundingRect$1(element, elCTM)));
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
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(dx, dy) {
          var _this$storage8 = this.storage,
              _this$storage8$handle = _this$storage8.handles,
              center = _this$storage8$handle.center,
              radius = _this$storage8$handle.radius,
              prevCenterData = _this$storage8.center,
              _this$storage8$transf = _this$storage8.transform;
          _this$storage8$transf = _this$storage8$transf === void 0 ? {} : _this$storage8$transf;
          var _this$storage8$transf2 = _this$storage8$transf.controlsMatrix,
              controlsMatrix = _this$storage8$transf2 === void 0 ? createSVGMatrix() : _this$storage8$transf2,
              _this$storage8$transf3 = _this$storage8.transformOrigin;
          _this$storage8$transf3 = _this$storage8$transf3 === void 0 ? {} : _this$storage8$transf3;
          var originX = _this$storage8$transf3.x,
              originY = _this$storage8$transf3.y,
              cached = _this$storage8.cached;
          if (isUndef(center)) return;
          var nextX = originX + dx,
              nextY = originY + dy;
          center.cx.baseVal.value = nextX;
          center.cy.baseVal.value = nextY;
          radius.x2.baseVal.value = nextX;
          radius.y2.baseVal.value = nextY;
          this.storage = _objectSpread2({}, this.storage, {
            center: _objectSpread2({}, prevCenterData, {
              isShifted: true
            }, pointTo(controlsMatrix.inverse(), nextX, nextY)),
            cached: _objectSpread2({}, cached, {
              transformOrigin: pointTo(createSVGMatrix(), nextX, nextY)
            })
          });
        }
      }, {
        key: "_processMoveRestrict",
        value: function _processMoveRestrict(element, _ref11) {
          var dx = _ref11.dx,
              dy = _ref11.dy;
          var data = this.storage.data;
          var elementStorage = data.get(element);
          var _elementStorage$trans3 = elementStorage.transform,
              matrix = _elementStorage$trans3.matrix,
              parentMatrix = _elementStorage$trans3.auxiliary.translate.parentMatrix;
          parentMatrix.e = parentMatrix.f = 0;

          var _pointTo7 = pointTo(parentMatrix, dx, dy),
              x = _pointTo7.x,
              y = _pointTo7.y;

          var preTranslateMatrix = createTranslateMatrix$1(x, y).multiply(matrix);
          return this._restrictHandler(element, preTranslateMatrix);
        }
      }, {
        key: "_processRotateRestrict",
        value: function _processRotateRestrict(element, radians) {
          var _this$storage9 = this.storage;
          _this$storage9 = _this$storage9 === void 0 ? {} : _this$storage9;
          var data = _this$storage9.data;

          var _data$get3 = data.get(element),
              _data$get3$transform = _data$get3.transform,
              matrix = _data$get3$transform.matrix,
              parentMatrix = _data$get3$transform.parentMatrix,
              translateMatrix = _data$get3$transform.auxiliary.rotate.translateMatrix;

          var cos = floatToFixed(Math.cos(radians)),
              sin = floatToFixed(Math.sin(radians));
          var rotateMatrix = createRotateMatrix$1(sin, cos);
          parentMatrix.e = parentMatrix.f = 0;
          var resRotMatrix = parentMatrix.inverse().multiply(rotateMatrix).multiply(parentMatrix);
          var resRotateMatrix = translateMatrix.multiply(resRotMatrix).multiply(translateMatrix.inverse());
          var resultMatrix = resRotateMatrix.multiply(matrix);
          return this._restrictHandler(element, resultMatrix);
        }
      }, {
        key: "_processResizeRestrict",
        value: function _processResizeRestrict(element, _ref12) {
          var dx = _ref12.dx,
              dy = _ref12.dy;
          var _this$storage10 = this.storage,
              doW = _this$storage10.doW,
              doH = _this$storage10.doH,
              data = _this$storage10.data,
              _this$storage10$bBox = _this$storage10.bBox,
              boxWidth = _this$storage10$bBox.width,
              boxHeight = _this$storage10$bBox.height,
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
            var scaleMatrix = createScaleMatrix$1(scaleX, scaleY);
            return translateMatrix.multiply(scaleMatrix).multiply(translateMatrix.inverse());
          };

          var preScaledMatrix = matrix.multiply(getScaleMatrix.apply(void 0, _toConsumableArray(getScale(dx, dy))));
          return this._restrictHandler(element, preScaledMatrix);
        }
      }, {
        key: "_processControlsResize",
        value: function _processControlsResize() {
          var _this$storage11 = this.storage;
          _this$storage11 = _this$storage11 === void 0 ? {} : _this$storage11;
          var controlsMatrix = _this$storage11.transform.controlsMatrix;

          this._applyTransformToHandles({
            boxMatrix: controlsMatrix.inverse()
          });
        }
      }, {
        key: "_processControlsMove",
        value: function _processControlsMove(_ref13) {
          var dx = _ref13.dx,
              dy = _ref13.dy;
          var _this$storage12 = this.storage;
          _this$storage12 = _this$storage12 === void 0 ? {} : _this$storage12;
          var _this$storage12$trans = _this$storage12.transform,
              controlsMatrix = _this$storage12$trans.controlsMatrix,
              controlsTranslateMatrix = _this$storage12$trans.controlsTranslateMatrix,
              center = _this$storage12.center;
          controlsTranslateMatrix.e = dx;
          controlsTranslateMatrix.f = dy;
          var moveControlsMtrx = controlsTranslateMatrix.multiply(controlsMatrix);

          this._updateControlsView(moveControlsMtrx);

          if (center.isShifted) {
            var centerTransformMatrix = controlsMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;

            var _pointTo8 = pointTo(centerTransformMatrix, dx, dy),
                cx = _pointTo8.x,
                cy = _pointTo8.y;

            this._moveCenterHandle(-cx, -cy);
          }
        }
      }, {
        key: "_processControlsRotate",
        value: function _processControlsRotate(_ref14) {
          var radians = _ref14.radians;
          var _this$storage13 = this.storage;
          _this$storage13 = _this$storage13 === void 0 ? {} : _this$storage13;
          var _this$storage13$trans = _this$storage13.transform,
              controlsMatrix = _this$storage13$trans.controlsMatrix,
              wrapperOriginMatrix = _this$storage13$trans.wrapperOriginMatrix;
          var cos = floatToFixed(Math.cos(radians)),
              sin = floatToFixed(Math.sin(radians));
          var rotateMatrix = createRotateMatrix$1(sin, cos);
          var wrapperResultMatrix = wrapperOriginMatrix.multiply(rotateMatrix).multiply(wrapperOriginMatrix.inverse()).multiply(controlsMatrix);

          this._updateControlsView(wrapperResultMatrix);
        }
      }, {
        key: "_updateElementView",
        value: function _updateElementView(element, _ref15) {
          var _ref16 = _slicedToArray(_ref15, 2),
              attr = _ref16[0],
              value = _ref16[1];

          if (attr === 'transform') {
            element.setAttribute(attr, matrixToString(value));
          }
        }
      }, {
        key: "_updateControlsView",
        value: function _updateControlsView() {
          var matrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : createSVGMatrix();
          this.storage.controls.setAttribute('transform', matrixToString(matrix));
        }
      }, {
        key: "_applyTransformToHandles",
        value: function _applyTransformToHandles() {
          var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref17$boxMatrix = _ref17.boxMatrix,
              boxMatrix = _ref17$boxMatrix === void 0 ? createSVGMatrix() : _ref17$boxMatrix;

          var rotatable = this.options.rotatable,
              _this$storage14 = this.storage,
              handles = _this$storage14.handles,
              isShifted = _this$storage14.center.isShifted;

          var _this$_getVertices2 = this._getVertices(boxMatrix),
              _this$_getVertices2$a = _this$_getVertices2.anchor,
              anchor = _this$_getVertices2$a === void 0 ? null : _this$_getVertices2$a,
              center = _this$_getVertices2.center,
              nextVertices = _objectWithoutProperties(_this$_getVertices2, ["anchor", "center"]);

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

          keys$2(resEdges).forEach(function (key) {
            var hdl = handles[key];

            var _resEdges$key = _slicedToArray(resEdges[key], 2),
                b = _resEdges$key[0],
                e = _resEdges$key[1];

            if (isUndef(b) || isUndef(hdl)) return;
            entries$1({
              x1: b.x,
              y1: b.y,
              x2: e.x,
              y2: e.y
            }).map(function (_ref18) {
              var _ref19 = _slicedToArray(_ref18, 2),
                  attr = _ref19[0],
                  value = _ref19[1];

              return hdl.setAttribute(attr, value);
            });
          });

          var handlesVertices = _objectSpread2({}, nextVertices, {}, !isShifted && Boolean(center) && {
            center: center
          });

          return keys$2(handlesVertices).reduce(function (result, key) {
            var hdl = handles[key];
            var attr = handlesVertices[key];
            result[key] = attr;
            if (isUndef(attr) || isUndef(hdl)) return result;
            hdl.setAttribute('cx', attr.x);
            hdl.setAttribute('cy', attr.y);
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
          var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              x = _ref20.x,
              y = _ref20.y,
              dx = _ref20.dx,
              dy = _ref20.dy;

          var pin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var elements = this.elements,
              storage = this.storage,
              _this$storage15 = this.storage;
          _this$storage15 = _this$storage15 === void 0 ? {} : _this$storage15;
          var controls = _this$storage15.controls,
              _this$storage15$handl = _this$storage15.handles;
          _this$storage15$handl = _this$storage15$handl === void 0 ? {} : _this$storage15$handl;
          var handle = _this$storage15$handl.center,
              radius = _this$storage15$handl.radius,
              center = _this$storage15.center,
              _this$options9 = this.options,
              container = _this$options9.container,
              isGrouped = _this$options9.isGrouped;
          var isRelative = isDef(dx) && isDef(dy),
              isAbsolute = isDef(x) && isDef(y);
          if (!center || !handle || !radius || !(isRelative || isAbsolute)) return;
          var controlsTransformMatrix = getTransformToElement(controls, controls.parentNode).inverse();
          var nextTransform = isGrouped ? controlsTransformMatrix : controlsTransformMatrix.multiply(getTransformToElement(elements[0], container));
          var newX, newY;

          if (isRelative) {
            var _this$_getBBox2 = this._getBBox(),
                bx = _this$_getBBox2.x,
                by = _this$_getBBox2.y,
                width = _this$_getBBox2.width,
                height = _this$_getBBox2.height;

            var hW = width / 2,
                hH = height / 2;
            newX = bx + hW + dx;
            newY = by + hH + dy;
          } else {
            newX = x;
            newY = y;
          }

          var _pointTo9 = pointTo(nextTransform, newX, newY),
              nextX = _pointTo9.x,
              nextY = _pointTo9.y;

          handle.cx.baseVal.value = nextX;
          handle.cy.baseVal.value = nextY;
          radius.x2.baseVal.value = nextX;
          radius.y2.baseVal.value = nextY;
          center.isShifted = pin;
          storage.transformOrigin = pointTo(createSVGMatrix(), nextX, nextY);
        }
      }, {
        key: "fitControlsToSize",
        value: function fitControlsToSize() {
          var _this$storage16 = this.storage,
              storage = _this$storage16 === void 0 ? {} : _this$storage16;
          var identityMatrix = createSVGMatrix();
          this.storage = _objectSpread2({}, storage, {
            transform: _objectSpread2({}, storage.transform || {}, {
              controlsMatrix: identityMatrix
            })
          });

          this._updateControlsView(identityMatrix);

          this._applyTransformToHandles({
            boxMatrix: identityMatrix
          });
        }
      }, {
        key: "getBoundingRect",
        value: function getBoundingRect(element) {
          var transformMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          var _this$options10 = this.options;
          _this$options10 = _this$options10 === void 0 ? {} : _this$options10;
          var restrict = _this$options10.restrict,
              container = _this$options10.container;
          var restrictEl = restrict || container;
          var nextTransform = transformMatrix ? getTransformToElement(element.parentNode, restrictEl).multiply(transformMatrix) : getTransformToElement(element, restrictEl);
          return _getBoundingRect$1(element, nextTransform, element.getBBox());
        }
      }, {
        key: "applyAlignment",
        value: function applyAlignment(direction) {
          var _this2 = this;

          var elements = this.elements,
              container = this.options.container;

          var _this$_getVertices3 = this._getVertices(),
              anchor = _this$_getVertices3.anchor,
              rotator = _this$_getVertices3.rotator,
              center = _this$_getVertices3.center,
              vertices = _objectWithoutProperties(_this$_getVertices3, ["anchor", "rotator", "center"]);

          var restrictBBox = this._getRestrictedBBox(true);

          var nextVertices = values$2(vertices).map(function (_ref21) {
            var x = _ref21.x,
                y = _ref21.y;
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

            var _pointTo10 = pointTo(parentMatrix.inverse(), getXDir(), getYDir()),
                x = _pointTo10.x,
                y = _pointTo10.y;

            var moveElementMtrx = createTranslateMatrix$1(x, y).multiply(getTransformToElement(element, element.parentNode));

            _this2._updateElementView(element, ['transform', moveElementMtrx]);
          });
          this.fitControlsToSize();
        }
      }, {
        key: "getDimensions",
        value: function getDimensions() {
          var elements = this.elements,
              _this$options11 = this.options,
              isGrouped = _this$options11.isGrouped,
              container = _this$options11.container;

          var _this$_getBBox3 = this._getBBox(),
              x = _this$_getBBox3.x,
              y = _this$_getBBox3.y,
              width = _this$_getBBox3.width,
              height = _this$_getBBox3.height;

          var vertices = {
            tl: [x, y],
            tr: [x + width, y],
            bl: [x, y + height],
            br: [x + width, y + height]
          };
          var nextTransform = isGrouped ? createSVGMatrix() : getTransformToElement(elements[0], container);

          var _entries$reduce = entries$1(vertices).reduce(function (nextRes, _ref22) {
            var _ref23 = _slicedToArray(_ref22, 2),
                key = _ref23[0],
                _ref23$ = _slicedToArray(_ref23[1], 2),
                x = _ref23$[0],
                y = _ref23$[1];

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

      return DraggableSVG;
    }(Transformable);

    var applyTranslate = function applyTranslate(element, _ref24) {
      var x = _ref24.x,
          y = _ref24.y;
      var attrs = [];

      switch (element.tagName.toLowerCase()) {
        case 'text':
          {
            var resX = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value + x : (Number(element.getAttribute('x')) || 0) + x;
            var resY = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value + y : (Number(element.getAttribute('y')) || 0) + y;
            attrs.push(['x', resX], ['y', resY]);
            break;
          }

        case 'foreignobject':
        case 'use':
        case 'image':
        case 'rect':
          {
            var _resX = isDef(element.x.baseVal.value) ? element.x.baseVal.value + x : (Number(element.getAttribute('x')) || 0) + x;

            var _resY = isDef(element.y.baseVal.value) ? element.y.baseVal.value + y : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(['x', _resX], ['y', _resY]);
            break;
          }

        case 'circle':
        case 'ellipse':
          {
            var _resX2 = element.cx.baseVal.value + x,
                _resY2 = element.cy.baseVal.value + y;

            attrs.push(['cx', _resX2], ['cy', _resY2]);
            break;
          }

        case 'line':
          {
            var resX1 = element.x1.baseVal.value + x,
                resY1 = element.y1.baseVal.value + y,
                resX2 = element.x2.baseVal.value + x,
                resY2 = element.y2.baseVal.value + y;
            attrs.push(['x1', resX1], ['y1', resY1], ['x2', resX2], ['y2', resY2]);
            break;
          }

        case 'polygon':
        case 'polyline':
          {
            var points = parsePoints(element.getAttribute('points'));
            var result = points.map(function (item) {
              item[0] = Number(item[0]) + x;
              item[1] = Number(item[1]) + y;
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

      attrs.forEach(function (item) {
        element.setAttribute(item[0], item[1]);
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

            var _pointTo11 = pointTo(localCTM, x, y),
                resX = _pointTo11.x,
                resY = _pointTo11.y;

            attrs.push(['x', resX + (scaleX < 0 ? boxW : 0)], ['y', resY - (scaleY < 0 ? boxH : 0)], ['textLength', Math.abs(scaleX * textLength)]);
            break;
          }

        case 'circle':
          {
            var r = storedData.r,
                cx = storedData.cx,
                cy = storedData.cy,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            var _pointTo12 = pointTo(localCTM, cx, cy),
                _resX3 = _pointTo12.x,
                _resY3 = _pointTo12.y;

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

              var _pointTo13 = pointTo(localCTM, _x5, _y5),
                  _resX4 = _pointTo13.x,
                  _resY4 = _pointTo13.y;

              var newWidth = Math.abs(width * scaleX),
                  newHeight = Math.abs(height * scaleY);
              attrs.push(['x', _resX4 - (scaleX < 0 ? newWidth : 0)], ['y', _resY4 - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
            } else {
              var matrix = storedData.matrix,
                  childCTM = storedData.childCTM;
              var local = childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
              var nextResult = matrix.multiply(local); // TODO: need to find how to resize rect within elements group but not to scale

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

            var _pointTo14 = pointTo(localCTM, _cx, _cy),
                cx1 = _pointTo14.x,
                cy1 = _pointTo14.y;

            var scaleMatrix = createSVGMatrix();
            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;

            var _pointTo15 = pointTo(scaleMatrix, rx, ry),
                nRx = _pointTo15.x,
                nRy = _pointTo15.y;

            attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
            break;
          }

        case 'line':
          {
            var resX1 = storedData.resX1,
                resY1 = storedData.resY1,
                resX2 = storedData.resX2,
                resY2 = storedData.resY2;

            var _pointTo16 = pointTo(localCTM, resX1, resY1),
                resX1_ = _pointTo16.x,
                resY1_ = _pointTo16.y;

            var _pointTo17 = pointTo(localCTM, resX2, resY2),
                resX2_ = _pointTo17.x,
                resY2_ = _pointTo17.y;

            attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
            break;
          }

        case 'polygon':
        case 'polyline':
          {
            var points = storedData.points;
            var result = parsePoints(points).map(function (item) {
              var _pointTo18 = pointTo(localCTM, Number(item[0]), Number(item[1])),
                  x = _pointTo18.x,
                  y = _pointTo18.y;

              item[0] = floatToFixed(x);
              item[1] = floatToFixed(y);
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

      attrs.forEach(function (_ref25) {
        var _ref26 = _slicedToArray(_ref25, 2),
            key = _ref26[0],
            value = _ref26[1];

        element.setAttribute(key, value);
      });
    };

    var createHandler$1 = function createHandler(left, top, color, key) {
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
      entries$1(attrs).forEach(function (_ref27) {
        var _ref28 = _slicedToArray(_ref27, 2),
            attr = _ref28[0],
            value = _ref28[1];

        return handler.setAttribute(attr, value);
      });
      return handler;
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
            var x = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
            var y = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
            var textLength = isDef(element.textLength.baseVal) ? element.textLength.baseVal.value : Number(element.getAttribute('textLength')) || null;
            data = {
              x: x,
              y: y,
              textLength: textLength
            };
            break;
          }

        case 'circle':
          {
            var r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value;
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
            var width = element.width.baseVal.value,
                height = element.height.baseVal.value,
                _x6 = element.x.baseVal.value,
                _y6 = element.y.baseVal.value;
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
            var rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                _cx2 = element.cx.baseVal.value,
                _cy2 = element.cy.baseVal.value;
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
            var resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;
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

      storage.__data__.set(element, _objectSpread2({}, data, {
        matrix: getTransformToElement(element, element.parentNode),
        ctm: getTransformToElement(element.parentNode, container),
        childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
      }));
    };

    var renderLine$1 = function renderLine(_ref29, color, key) {
      var _ref30 = _slicedToArray(_ref29, 2),
          b = _ref30[0],
          e = _ref30[1];

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
      entries$1(attrs).forEach(function (_ref31) {
        var _ref32 = _slicedToArray(_ref31, 2),
            attr = _ref32[0],
            value = _ref32[1];

        return handler.setAttribute(attr, value);
      });
      return handler;
    };

    var _getBoundingRect$1 = function _getBoundingRect(element, ctm) {
      var bBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : element.getBBox();
      var x = bBox.x,
          y = bBox.y,
          width = bBox.width,
          height = bBox.height;
      var vertices = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      return vertices.map(function (_ref33) {
        var _ref34 = _slicedToArray(_ref33, 2),
            l = _ref34[0],
            t = _ref34[1];

        var _pointTo19 = pointTo(ctm, l, t),
            nx = _pointTo19.x,
            ny = _pointTo19.y;

        return [nx, ny];
      });
    };

    function drag(options, obInstance) {
      if (this.length) {
        var Ob = isDef(obInstance) && obInstance instanceof Observable ? obInstance : new Observable();

        if (this[0] instanceof SVGElement) {
          var items = arrReduce.call(this, function (result, item) {
            if (checkElement(item)) {
              result.push(item);
            }

            return result;
          }, []);
          return new DraggableSVG(items, options, Ob);
        } else {
          return new Draggable(arrMap.call(this, function (_) {
            return _;
          }), options, Ob);
        }
      }
    }

    var EMITTER_EVENTS$2 = EVENT_EMITTER_CONSTANTS.EMITTER_EVENTS;
    var E_MOUSEDOWN$4 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$4 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;

    var Cloneable = /*#__PURE__*/function (_SubjectModel) {
      _inherits(Cloneable, _SubjectModel);

      var _super = _createSuper(Cloneable);

      function Cloneable(elements, options) {
        var _this;

        _classCallCheck(this, Cloneable);

        _this = _super.call(this, elements);

        _this.enable(options);

        return _this;
      }

      _createClass(Cloneable, [{
        key: "_init",
        value: function _init() {
          var _this2 = this;

          var elements = this.elements,
              options = this.options;
          var $el = helper(elements);
          var style = options.style,
              appendTo = options.appendTo;

          var css = _objectSpread2({
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
            css: css,
            data: data
          };
          $el.on(E_MOUSEDOWN$4, this._onMouseDown).on(E_TOUCHSTART$4, this._onTouchStart);
          EMITTER_EVENTS$2.slice(0, 3).forEach(function (eventName) {
            _this2.eventDispatcher.registerEvent(eventName);
          });
        }
      }, {
        key: "_processOptions",
        value: function _processOptions(options) {
          var _style = {},
              _appendTo = null,
              _stack = document,
              _onInit = noop,
              _onMove = noop,
              _onDrop = noop,
              _onDestroy = noop;

          if (isDef(options)) {
            var style = options.style,
                appendTo = options.appendTo,
                stack = options.stack,
                onInit = options.onInit,
                onMove = options.onMove,
                onDrop = options.onDrop,
                onDestroy = options.onDestroy;
            _style = isDef(style) && _typeof(style) === 'object' ? style : _style;
            _appendTo = appendTo || null;
            var dropZone = isDef(stack) ? helper(stack)[0] : document;
            _onInit = createMethod(onInit);
            _onMove = createMethod(onMove);
            _onDrop = isFunc(onDrop) ? function (evt) {
              var _this$storage = this.storage;
              _this$storage = _this$storage === void 0 ? {} : _this$storage;
              var clone = _this$storage.clone;
              var result = objectsCollide(clone, dropZone);

              if (result) {
                onDrop.call(this, evt, this.elements, clone);
              }
            } : noop;
            _onDestroy = createMethod(onDestroy);
          }

          this.options = {
            style: _style,
            appendTo: _appendTo,
            stack: _stack
          };
          this.proxyMethods = {
            onInit: _onInit,
            onDrop: _onDrop,
            onMove: _onMove,
            onDestroy: _onDestroy
          };
        }
      }, {
        key: "_start",
        value: function _start(_ref) {
          var target = _ref.target,
              clientX = _ref.clientX,
              clientY = _ref.clientY;
          var elements = this.elements,
              storage = this.storage,
              _this$storage2 = this.storage,
              data = _this$storage2.data,
              css = _this$storage2.css;
          var element = elements.find(function (el) {
            return el === target || el.contains(target);
          });
          if (!element) return;

          var _ref2 = data.get(element) || {},
              _ref2$parent = _ref2.parent,
              parent = _ref2$parent === void 0 ? element.parentNode : _ref2$parent;

          var _getOffset = getOffset(parent),
              left = _getOffset.left,
              top = _getOffset.top;

          css.left = "".concat(clientX - left, "px");
          css.top = "".concat(clientY - top, "px");
          var clone = element.cloneNode(true);
          helper(clone).css(css);
          storage.clientX = clientX;
          storage.clientY = clientY;
          storage.cx = clientX;
          storage.cy = clientY;
          storage.clone = clone;
          parent.appendChild(clone);

          this._draw();
        }
      }, {
        key: "_moving",
        value: function _moving(_ref3) {
          var clientX = _ref3.clientX,
              clientY = _ref3.clientY;
          var storage = this.storage;
          storage.clientX = clientX;
          storage.clientY = clientY;
          storage.doDraw = true;
          storage.doMove = true;
        }
      }, {
        key: "_end",
        value: function _end(e) {
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
      }, {
        key: "_animate",
        value: function _animate() {
          var storage = this.storage;
          storage.frameId = requestAnimFrame(this._animate);
          var doDraw = storage.doDraw,
              clientX = storage.clientX,
              clientY = storage.clientY,
              cx = storage.cx,
              cy = storage.cy,
              clone = storage.clone;
          if (!doDraw) return;
          storage.doDraw = false;

          this._drag({
            element: clone,
            dx: clientX - cx,
            dy: clientY - cy
          });
        }
      }, {
        key: "_processMove",
        value: function _processMove(_, _ref4) {
          var dx = _ref4.dx,
              dy = _ref4.dy;
          var _this$storage3 = this.storage;
          _this$storage3 = _this$storage3 === void 0 ? {} : _this$storage3;
          var clone = _this$storage3.clone;
          var translate = "translate(".concat(dx, "px, ").concat(dy, "px)");
          helper(clone).css({
            transform: translate,
            webkitTranform: translate,
            mozTransform: translate,
            msTransform: translate,
            otransform: translate
          });
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          var storage = this.storage,
              proxyMethods = this.proxyMethods,
              elements = this.elements;
          if (isUndef(storage)) return;
          helper(elements).off(E_MOUSEDOWN$4, this._onMouseDown).off(E_TOUCHSTART$4, this._onTouchStart);
          proxyMethods.onDestroy.call(this, elements);
          delete this.storage;
        }
      }, {
        key: "disable",
        value: function disable() {
          this._destroy();
        }
      }]);

      return Cloneable;
    }(SubjectModel);

    function clone(options) {
      if (this.length) {
        return new Cloneable(arrMap.call(this, function (_) {
          return _;
        }), options);
      }
    }

    var Subjx = /*#__PURE__*/function (_Helper) {
      _inherits(Subjx, _Helper);

      var _super = _createSuper(Subjx);

      function Subjx() {
        _classCallCheck(this, Subjx);

        return _super.apply(this, arguments);
      }

      _createClass(Subjx, [{
        key: "drag",
        value: function drag$1() {
          return drag.call.apply(drag, [this].concat(Array.prototype.slice.call(arguments)));
        }
      }, {
        key: "clone",
        value: function clone$1() {
          return clone.call.apply(clone, [this].concat(Array.prototype.slice.call(arguments)));
        }
      }]);

      return Subjx;
    }(Helper);

    function subjx(params) {
      return new Subjx(params);
    }
    Object.defineProperty(subjx, 'createObservable', {
      value: function value() {
        return new Observable();
      }
    });
    Object.defineProperty(subjx, 'Subjx', {
      value: Subjx
    });
    Object.defineProperty(subjx, 'Observable', {
      value: Observable
    });

    return subjx;

})));
