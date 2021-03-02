/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2021
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
      var hasNativeReflectConstruct = _isNativeReflectConstruct();

      return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;

        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf(this).constructor;

          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }

        return _possibleConstructorReturn(this, result);
      };
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
      if (n === "Map" || n === "Set") return Array.from(o);
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

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it;

      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
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

      var normalCompletion = true,
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
      } : function () {};
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
      function SubjectModel(el) {
        _classCallCheck(this, SubjectModel);

        this.el = el;
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

          this._init(this.el);

          this.proxyMethods.onInit.call(this, this.el);
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
          var dx = _ref.dx,
              dy = _ref.dy,
              rest = _objectWithoutProperties(_ref, ["dx", "dy"]);

          var transform = this._processMove(dx, dy);

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

          this._moving(e, this.el);
        }
      }, {
        key: "_onTouchMove",
        value: function _onTouchMove(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          this._moving(e.touches[0], this.el);
        }
      }, {
        key: "_onMouseUp",
        value: function _onMouseUp(e) {
          helper(document).off(E_MOUSEMOVE$1, this._onMouseMove).off(E_MOUSEUP$1, this._onMouseUp);

          this._end(e, this.el);
        }
      }, {
        key: "_onTouchEnd",
        value: function _onTouchEnd(e) {
          helper(document).off(E_TOUCHMOVE$1, this._onTouchMove).off(E_TOUCHEND$1, this._onTouchEnd);

          if (e.touches.length === 0) {
            this._end(e.changedTouches[0], this.el);
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
    var getMinMaxOf2DIndex = function getMinMaxOf2DIndex(arr, idx) {
      var axisValues = arr.map(function (e) {
        return e[idx];
      });
      return [Math.min.apply(Math, _toConsumableArray(axisValues)), Math.max.apply(Math, _toConsumableArray(axisValues))];
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
        E_ROTATE_END$1 = EVENT_EMITTER_CONSTANTS.E_ROTATE_END;
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

    var Transformable = /*#__PURE__*/function (_SubjectModel) {
      _inherits(Transformable, _SubjectModel);

      var _super = _createSuper(Transformable);

      function Transformable(el, options, observable) {
        var _this;

        _classCallCheck(this, Transformable);

        _this = _super.call(this, el);

        if (_this.constructor === Transformable) {
          throw new TypeError('Cannot construct Transformable instances directly');
        }

        _this.observable = observable;
        EMITTER_EVENTS$1.forEach(function (eventName) {
          return _this.eventDispatcher.registerEvent(eventName);
        });

        _this.enable(options);

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
          var radians = _ref.radians,
              rest = _objectWithoutProperties(_ref, ["radians"]);

          var resultMtrx = this._processRotate(radians);

          var finalArgs = _objectSpread2({
            transform: resultMtrx,
            delta: radians
          }, rest);

          this.proxyMethods.onRotate.call(this, finalArgs);

          this._emitEvent(E_ROTATE$1, finalArgs);
        }
      }, {
        key: "_resize",
        value: function _resize(_ref2) {
          var dx = _ref2.dx,
              dy = _ref2.dy,
              rest = _objectWithoutProperties(_ref2, ["dx", "dy"]);

          var finalValues = this._processResize(dx, dy);

          var finalArgs = _objectSpread2(_objectSpread2({}, finalValues), {}, {
            dx: dx,
            dy: dy
          }, rest);

          this.proxyMethods.onResize.call(this, finalArgs);

          this._emitEvent(E_RESIZE$1, finalArgs);
        }
      }, {
        key: "_processOptions",
        value: function _processOptions() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var el = this.el;
          addClass(el, "".concat(LIB_CLASS_PREFIX, "drag"));
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
              onInit = _options$onInit === void 0 ? function () {} : _options$onInit,
              _options$onDrop = options.onDrop,
              onDrop = _options$onDrop === void 0 ? function () {} : _options$onDrop,
              _options$onMove = options.onMove,
              onMove = _options$onMove === void 0 ? function () {} : _options$onMove,
              _options$onResize = options.onResize,
              onResize = _options$onResize === void 0 ? function () {} : _options$onResize,
              _options$onRotate = options.onRotate,
              onRotate = _options$onRotate === void 0 ? function () {} : _options$onRotate,
              _options$onDestroy = options.onDestroy,
              onDestroy = _options$onDestroy === void 0 ? function () {} : _options$onDestroy,
              _options$container = options.container,
              container = _options$container === void 0 ? el.parentNode : _options$container,
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
            rotatable: rotatable,
            scalable: scalable,
            applyTranslate: applyTranslate,
            custom: _typeof(custom) === 'object' && custom || null,
            rotatorAnchor: rotatorAnchor,
            rotatorOffset: rotatorOffset,
            showNormal: showNormal
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
          var self = this;
          var observable = self.observable,
              storage = self.storage,
              options = self.options;
          if (isUndef(storage)) return;
          storage.frame = requestAnimFrame(self._animate);
          if (!storage.doDraw) return;
          storage.doDraw = false;
          var dox = storage.dox,
              doy = storage.doy,
              clientX = storage.clientX,
              clientY = storage.clientY,
              doDrag = storage.doDrag,
              doResize = storage.doResize,
              doRotate = storage.doRotate,
              doSetCenter = storage.doSetCenter,
              revX = storage.revX,
              revY = storage.revY;
          var snap = options.snap,
              _options$each2 = options.each,
              moveEach = _options$each2.move,
              resizeEach = _options$each2.resize,
              rotateEach = _options$each2.rotate,
              draggable = options.draggable,
              resizable = options.resizable,
              rotatable = options.rotatable;

          if (doResize && resizable) {
            var _storage$transform = storage.transform,
                scX = _storage$transform.scX,
                scY = _storage$transform.scY,
                cx = storage.cx,
                cy = storage.cy;

            var _this$_pointToElement = this._pointToElement({
              x: clientX,
              y: clientY
            }),
                x = _this$_pointToElement.x,
                y = _this$_pointToElement.y;

            var dx = dox ? snapToGrid(x - cx, snap.x / scX) : 0;
            var dy = doy ? snapToGrid(y - cy, snap.y / scY) : 0;
            dx = dox ? revX ? -dx : dx : 0;
            dy = doy ? revY ? -dy : dy : 0;
            var args = {
              dx: dx,
              dy: dy,
              clientX: clientX,
              clientY: clientY
            };

            self._resize(args);

            if (resizeEach) {
              observable.notify(ON_RESIZE$2, self, args);
            }
          }

          if (doDrag && draggable) {
            var nx = storage.nx,
                ny = storage.ny;

            var _dx = dox ? snapToGrid(clientX - nx, snap.x) : 0;

            var _dy = doy ? snapToGrid(clientY - ny, snap.y) : 0;

            var _args = {
              dx: _dx,
              dy: _dy,
              clientX: clientX,
              clientY: clientY
            };

            self._drag(_args);

            if (moveEach) {
              observable.notify(ON_MOVE$2, self, _args);
            }
          }

          if (doRotate && rotatable) {
            var pressang = storage.pressang,
                center = storage.center;
            var delta = Math.atan2(clientY - center.y, clientX - center.x);
            var radians = delta - pressang;
            var _args2 = {
              clientX: clientX,
              clientY: clientY
            };

            self._rotate(_objectSpread2({
              radians: snapToGrid(radians, snap.angle)
            }, _args2));

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
                _x = _this$_pointToControl.x,
                _y = _this$_pointToControl.y;

            self._moveCenterHandle(_x - bx, _y - by);
          }
        }
      }, {
        key: "_start",
        value: function _start(e) {
          var clientX = e.clientX,
              clientY = e.clientY;
          var observable = this.observable,
              storage = this.storage,
              handles = this.storage.handles,
              _this$options = this.options,
              axis = _this$options.axis,
              each = _this$options.each,
              el = this.el;
          var isTarget = Object.values(handles).some(function (hdl) {
            return helper(e.target).is(hdl);
          }) || el.contains(e.target);
          storage.isTarget = isTarget;
          if (!isTarget) return;

          var computed = this._compute(e, el);

          Object.keys(computed).map(function (prop) {
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
          var doDrag = el.contains(e.target) && !(doRotate || doResize || doSetCenter);

          var _this$_cursorPoint = this._cursorPoint({
            clientX: clientX,
            clientY: clientY
          }),
              x = _this$_cursorPoint.x,
              y = _this$_cursorPoint.y;

          var _this$_pointToElement2 = this._pointToElement({
            x: x,
            y: y
          }),
              ex = _this$_pointToElement2.x,
              ey = _this$_pointToElement2.y;

          var _this$_pointToControl2 = this._pointToControls({
            x: x,
            y: y
          }),
              bx = _this$_pointToControl2.x,
              by = _this$_pointToControl2.y;

          var nextStorage = {
            clientX: clientX,
            clientY: clientY,
            cx: ex,
            cy: ey,
            nx: x,
            ny: y,
            bx: bx,
            by: by,
            doResize: doResize,
            doDrag: doDrag,
            doRotate: doRotate,
            doSetCenter: doSetCenter,
            onExecution: true,
            cursor: null,
            dox: /\x/.test(axis) && (doResize ? handle.is(handles.ml) || handle.is(handles.mr) || handle.is(handles.tl) || handle.is(handles.tr) || handle.is(handles.bl) || handle.is(handles.br) || handle.is(handles.le) || handle.is(handles.re) : true),
            doy: /\y/.test(axis) && (doResize ? handle.is(handles.br) || handle.is(handles.bl) || handle.is(handles.bc) || handle.is(handles.tr) || handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.te) || handle.is(handles.be) : true),
            cached: {}
          };
          this.storage = _objectSpread2(_objectSpread2({}, storage), nextStorage);
          var eventArgs = {
            clientX: clientX,
            clientY: clientY
          };

          if (doResize) {
            this._emitEvent(E_RESIZE_START$1, eventArgs);
          } else if (doRotate) {
            this._emitEvent(E_ROTATE_START$1, eventArgs);
          } else if (doDrag) {
            this._emitEvent(E_DRAG_START$1, eventArgs);
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

          var _this$_cursorPoint2 = this._cursorPoint(e),
              x = _this$_cursorPoint2.x,
              y = _this$_cursorPoint2.y;

          storage.e = e;
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
        value: function _end(_ref3) {
          var clientX = _ref3.clientX,
              clientY = _ref3.clientY;
          var each = this.options.each,
              observable = this.observable,
              storage = this.storage,
              _this$storage2 = this.storage,
              doResize = _this$storage2.doResize,
              doDrag = _this$storage2.doDrag,
              doRotate = _this$storage2.doRotate,
              frame = _this$storage2.frame,
              radius = _this$storage2.handles.radius,
              isTarget = _this$storage2.isTarget,
              proxyMethods = this.proxyMethods;
          if (!isTarget) return;
          var actionName = doResize ? E_RESIZE$1 : doDrag ? E_DRAG$2 : E_ROTATE$1;
          storage.doResize = false;
          storage.doDrag = false;
          storage.doRotate = false;
          storage.doSetCenter = false;
          storage.doDraw = false;
          storage.onExecution = false;
          storage.cursor = null;

          this._apply(actionName);

          var eventArgs = {
            clientX: clientX,
            clientY: clientY
          };
          proxyMethods.onDrop.call(this, eventArgs);

          if (doResize) {
            this._emitEvent(E_RESIZE_END$1, eventArgs);
          } else if (doRotate) {
            this._emitEvent(E_ROTATE_END$1, eventArgs);
          } else if (doDrag) {
            this._emitEvent(E_DRAG_END$1, eventArgs);
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
        value: function _compute(e, el) {
          var handles = this.storage.handles;
          var handle = helper(e.target);

          var _this$_checkHandles = this._checkHandles(handle, handles),
              revX = _this$_checkHandles.revX,
              revY = _this$_checkHandles.revY,
              doW = _this$_checkHandles.doW,
              doH = _this$_checkHandles.doH,
              rest = _objectWithoutProperties(_this$_checkHandles, ["revX", "revY", "doW", "doH"]);

          var _computed = this._getState({
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          });

          var _this$_cursorPoint3 = this._cursorPoint(e),
              clientX = _this$_cursorPoint3.x,
              clientY = _this$_cursorPoint3.y;

          var pressang = Math.atan2(clientY - _computed.center.y, clientX - _computed.center.x);
          return _objectSpread2(_objectSpread2(_objectSpread2({}, _computed), rest), {}, {
            handle: Object.values(handles).some(function (hdl) {
              return helper(e.target).is(hdl);
            }) ? handle : helper(el),
            pressang: pressang
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
        key: "_destroy",
        value: function _destroy() {
          var _this2 = this;

          var el = this.el,
              _this$storage3 = this.storage,
              controls = _this$storage3.controls,
              wrapper = _this$storage3.wrapper;
          [el, controls].map(function (target) {
            return helper(target).off(E_MOUSEDOWN$1, _this2._onMouseDown).off(E_TOUCHSTART$1, _this2._onTouchStart);
          });
          wrapper.parentNode.removeChild(wrapper);
        }
      }, {
        key: "notifyMove",
        value: function notifyMove() {
          this._drag.apply(this, arguments);
        }
      }, {
        key: "notifyRotate",
        value: function notifyRotate(_ref4) {
          var radians = _ref4.radians,
              rest = _objectWithoutProperties(_ref4, ["radians"]);

          var angle = this.options.snap.angle;

          this._rotate(_objectSpread2({
            radians: snapToGrid(radians, angle)
          }, rest));
        }
      }, {
        key: "notifyResize",
        value: function notifyResize() {
          this._resize.apply(this, arguments);
        }
      }, {
        key: "notifyApply",
        value: function notifyApply(_ref5) {
          var clientX = _ref5.clientX,
              clientY = _ref5.clientY,
              actionName = _ref5.actionName,
              triggerEvent = _ref5.triggerEvent;
          this.proxyMethods.onDrop.call(this, {
            clientX: clientX,
            clientY: clientY
          });

          if (triggerEvent) {
            this._apply(actionName);

            this._emitEvent("".concat(actionName, "End"), {
              clientX: clientX,
              clientY: clientY
            });
          }
        }
      }, {
        key: "notifyGetState",
        value: function notifyGetState(_ref6) {
          var clientX = _ref6.clientX,
              clientY = _ref6.clientY,
              actionName = _ref6.actionName,
              triggerEvent = _ref6.triggerEvent,
              rest = _objectWithoutProperties(_ref6, ["clientX", "clientY", "actionName", "triggerEvent"]);

          if (triggerEvent) {
            var recalc = this._getState(rest);

            this.storage = _objectSpread2(_objectSpread2({}, this.storage), recalc);

            this._emitEvent("".concat(actionName, "Start"), {
              clientX: clientX,
              clientY: clientY
            });
          }
        }
      }, {
        key: "subscribe",
        value: function subscribe(_ref7) {
          var resize = _ref7.resize,
              move = _ref7.move,
              rotate = _ref7.rotate;
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
          var _this3 = this;

          var ob = this.observable;
          NOTIFIER_EVENTS$1.map(function (eventName) {
            return ob.unsubscribe(eventName, _this3);
          });
        }
      }, {
        key: "disable",
        value: function disable() {
          var storage = this.storage,
              proxyMethods = this.proxyMethods,
              el = this.el;
          if (isUndef(storage)) return; // unexpected case

          if (storage.onExecution) {
            helper(document).off(E_MOUSEMOVE$2, this._onMouseMove).off(E_MOUSEUP$2, this._onMouseUp).off(E_TOUCHMOVE$2, this._onTouchMove).off(E_TOUCHEND$2, this._onTouchEnd);
          }

          removeClass(el, "".concat(LIB_CLASS_PREFIX, "drag"));
          this.unsubscribe();

          this._destroy();

          proxyMethods.onDestroy.call(this, el);
          delete this.storage;
        }
      }, {
        key: "exeDrag",
        value: function exeDrag(_ref8) {
          var dx = _ref8.dx,
              dy = _ref8.dy;
          var draggable = this.options.draggable;
          if (!draggable) return;
          this.storage = _objectSpread2(_objectSpread2({}, this.storage), this._getState({
            revX: false,
            revY: false,
            doW: false,
            doH: false
          }));

          this._drag({
            dx: dx,
            dy: dy
          });

          this._apply(E_DRAG$2);
        }
      }, {
        key: "exeResize",
        value: function exeResize(_ref9) {
          var dx = _ref9.dx,
              dy = _ref9.dy,
              _ref9$revX = _ref9.revX,
              revX = _ref9$revX === void 0 ? false : _ref9$revX,
              _ref9$revY = _ref9.revY,
              revY = _ref9$revY === void 0 ? false : _ref9$revY,
              _ref9$doW = _ref9.doW,
              doW = _ref9$doW === void 0 ? false : _ref9$doW,
              _ref9$doH = _ref9.doH,
              doH = _ref9$doH === void 0 ? false : _ref9$doH;
          var resizable = this.options.resizable;
          if (!resizable) return;
          this.storage = _objectSpread2(_objectSpread2({}, this.storage), this._getState({
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          }));

          this._resize({
            dx: dx,
            dy: dy
          });

          this._apply(E_RESIZE$1);
        }
      }, {
        key: "exeRotate",
        value: function exeRotate(_ref10) {
          var delta = _ref10.delta;
          var rotatable = this.options.rotatable;
          if (!rotatable) return;
          this.storage = _objectSpread2(_objectSpread2({}, this.storage), this._getState({
            revX: false,
            revY: false,
            doW: false,
            doH: false
          }));

          this._rotate({
            radians: delta
          });

          this._apply(E_ROTATE$1);
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
    var getCurrentTransformMatrix = function getCurrentTransformMatrix(el) {
      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
      var newTransform = arguments.length > 2 ? arguments[2] : undefined;
      var matrix = createIdentityMatrix();
      var node = el; // set predefined matrix if we need to find new CTM

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
    var getAbsoluteOffset = function getAbsoluteOffset(elem) {
      var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
      var top = 0,
          left = 0;
      var allowBorderOffset = false;

      while (elem) {
        var parentTx = getCurrentTransformMatrix(elem.offsetParent);

        var _multiplyMatrixAndPoi = multiplyMatrixAndPoint(dropTranslate(parentTx, false), [elem.offsetLeft + (allowBorderOffset ? elem.clientLeft : 0), elem.offsetTop + (allowBorderOffset ? elem.clientTop : 0), 0, 1]),
            _multiplyMatrixAndPoi2 = _slicedToArray(_multiplyMatrixAndPoi, 2),
            offsetLeft = _multiplyMatrixAndPoi2[0],
            offsetTop = _multiplyMatrixAndPoi2[1];

        left += offsetLeft;
        top += offsetTop;
        if (container === elem) break;
        allowBorderOffset = true;
        elem = elem.offsetParent;
      }

      return [left, top, 0, 1];
    };

    var E_MOUSEDOWN$2 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$2 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;

    var Draggable = /*#__PURE__*/function (_Transformable) {
      _inherits(Draggable, _Transformable);

      var _super = _createSuper(Draggable);

      function Draggable() {
        _classCallCheck(this, Draggable);

        return _super.apply(this, arguments);
      }

      _createClass(Draggable, [{
        key: "_init",
        value: function _init(el) {
          var _this = this;

          var _this$options = this.options,
              rotationPoint = _this$options.rotationPoint,
              container = _this$options.container,
              controlsContainer = _this$options.controlsContainer,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable,
              showNormal = _this$options.showNormal,
              rotatorOffset = _this$options.rotatorOffset,
              rotatorAnchor = _this$options.rotatorAnchor;
          var offsetHeight = el.offsetHeight,
              offsetWidth = el.offsetWidth;
          var wrapper = createElement(['sjx-wrapper']);
          var controls = createElement(['sjx-controls']);
          var handles = {};
          var matrix = getCurrentTransformMatrix(el, container);

          var _getAbsoluteOffset = getAbsoluteOffset(el, container),
              _getAbsoluteOffset2 = _slicedToArray(_getAbsoluteOffset, 2),
              offsetLeft = _getAbsoluteOffset2[0],
              offsetTop = _getAbsoluteOffset2[1];

          var originRotation = ['data-sjx-cx', 'data-sjx-cy'].map(function (attr) {
            var val = el.getAttribute(attr);
            return isDef(val) ? Number(val) : undefined;
          });
          var hasOrigin = originRotation.every(function (val) {
            return !isNaN(val);
          });
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
          var finalVertices = Object.entries(vertices).reduce(function (nextVerteces, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                vertex = _ref2[1];

            return [].concat(_toConsumableArray(nextVerteces), [[key, multiplyMatrixAndPoint(matrix, vertex)]]);
          }, []).reduce(function (vertices, _ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                _ref4$ = _slicedToArray(_ref4[1], 4),
                x = _ref4$[0],
                y = _ref4$[1],
                z = _ref4$[2],
                w = _ref4$[3];

            vertices[key] = [x + offsetLeft, y + offsetTop, z, w];
            return vertices;
          }, {});
          var rotationHandles = {},
              rotator = null;

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
            var normalLine = showNormal ? renderLine([[anchor.x, anchor.y], rotator], 'normal') : null;
            if (showNormal) controls.appendChild(normalLine);
            var radius = null;

            if (rotationPoint) {
              radius = renderLine([finalVertices.center, finalVertices.center], 'radius');
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
          var nextCenter = hasOrigin ? [].concat(_toConsumableArray(originRotation), [0, 1]) : finalVertices.center;

          var allHandles = _objectSpread2(_objectSpread2({}, resizingHandles), {}, {
            center: rotationPoint && rotatable ? nextCenter : undefined,
            rotator: rotator
          });

          var mapHandlers = function mapHandlers(obj, renderFunc) {
            return Object.keys(obj).map(function (key) {
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
          this.storage = {
            wrapper: wrapper,
            controls: controls,
            handles: _objectSpread2(_objectSpread2({}, handles), rotationHandles),
            parent: el.parentNode,
            center: {
              isShifted: hasOrigin
            },
            cached: {}
          };
          [el, controls].map(function (target) {
            return helper(target).on(E_MOUSEDOWN$2, _this._onMouseDown).on(E_TOUCHSTART$2, _this._onTouchStart);
          });
        }
      }, {
        key: "_pointToElement",
        value: function _pointToElement(_ref5) {
          var x = _ref5.x,
              y = _ref5.y;
          var ctm = this.storage.transform.ctm;
          var matrix = matrixInvert(ctm);
          return this._applyMatrixToPoint(dropTranslate(matrix, false), x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(_ref6) {
          var x = _ref6.x,
              y = _ref6.y;
          var wrapperMatrix = this.storage.transform.wrapperMatrix;
          var matrix = matrixInvert(wrapperMatrix);
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
        value: function _cursorPoint(_ref7) {
          var clientX = _ref7.clientX,
              clientY = _ref7.clientY;
          var container = this.options.container;
          var globalMatrix = getCurrentTransformMatrix(container);
          return this._applyMatrixToPoint(matrixInvert(globalMatrix), clientX, clientY);
        }
      }, {
        key: "_restrictHandler",
        value: function _restrictHandler(matrix) {
          var containerMatrix = this.storage.transform.containerMatrix,
              _this$options2 = this.options,
              restrict = _this$options2.restrict,
              container = _this$options2.container;
          var restrictX = null,
              restrictY = null;

          var containerBox = _getBoundingRect(restrict, container, containerMatrix);

          var elBox = this.getBoundingRect(matrix);

          var _getMinMaxOf2DIndex = getMinMaxOf2DIndex(containerBox, 0),
              _getMinMaxOf2DIndex2 = _slicedToArray(_getMinMaxOf2DIndex, 2),
              minX = _getMinMaxOf2DIndex2[0],
              maxX = _getMinMaxOf2DIndex2[1];

          var _getMinMaxOf2DIndex3 = getMinMaxOf2DIndex(containerBox, 1),
              _getMinMaxOf2DIndex4 = _slicedToArray(_getMinMaxOf2DIndex3, 2),
              minY = _getMinMaxOf2DIndex4[0],
              maxY = _getMinMaxOf2DIndex4[1];

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
        key: "_apply",
        value: function _apply() {
          var element = this.el,
              _this$storage = this.storage,
              cached = _this$storage.cached,
              controls = _this$storage.controls,
              matrix = _this$storage.transform.matrix,
              center = _this$storage.center,
              applyTranslate = this.options.applyTranslate;
          var $controls = helper(controls);
          if (isUndef(cached)) return;
          element.setAttribute('data-sjx-cx', center.elX);
          element.setAttribute('data-sjx-cy', center.elY);

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

          this.storage.cached = {};
        }
      }, {
        key: "_processResize",
        value: function _processResize(dx, dy) {
          var el = this.el,
              storage = this.storage,
              _this$storage2 = this.storage,
              _this$storage2$transf = _this$storage2.transform,
              matrix = _this$storage2$transf.matrix,
              translateMatrix = _this$storage2$transf.auxiliary.scale.translateMatrix,
              _this$storage2$cached = _this$storage2.cached;
          _this$storage2$cached = _this$storage2$cached === void 0 ? {} : _this$storage2$cached;
          var _this$storage2$cached2 = _this$storage2$cached.dist;
          _this$storage2$cached2 = _this$storage2$cached2 === void 0 ? {} : _this$storage2$cached2;
          var _this$storage2$cached3 = _this$storage2$cached2.dx,
              nextDx = _this$storage2$cached3 === void 0 ? dx : _this$storage2$cached3,
              _this$storage2$cached4 = _this$storage2$cached2.dy,
              nextDy = _this$storage2$cached4 === void 0 ? dy : _this$storage2$cached4,
              _this$storage2$box = _this$storage2.box,
              boxWidth = _this$storage2$box.width,
              boxHeight = _this$storage2$box.height,
              revX = _this$storage2.revX,
              revY = _this$storage2.revY,
              doW = _this$storage2.doW,
              doH = _this$storage2.doH,
              _this$options3 = this.options,
              proportions = _this$options3.proportions,
              scalable = _this$options3.scalable,
              restrict = _this$options3.restrict;

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
              pScaleX = _getScale2[0],
              pScaleY = _getScale2[1],
              pWidth = _getScale2[2],
              pHeight = _getScale2[3];

          var preScaleMatrix = getScaleMatrix(pScaleX, pScaleY);
          var preResultMatrix = scalable ? multiplyMatrix(preScaleMatrix, matrix) : getTranslateMatrix(preScaleMatrix, matrix);
          this.storage.cached.box = {
            width: pWidth,
            height: pHeight
          };

          var _ref8 = restrict ? this._restrictHandler(preResultMatrix) : {
            x: null,
            y: null
          },
              restX = _ref8.x,
              restY = _ref8.y;

          var isBounding = (restX !== null || restY !== null) && restrict;
          var newDx = isBounding ? nextDx : dx;
          var newDy = isBounding ? nextDy : dy;

          var _getScale3 = getScale(newDx, newDy),
              _getScale4 = _slicedToArray(_getScale3, 4),
              scaleX = _getScale4[0],
              scaleY = _getScale4[1],
              newWidth = _getScale4[2],
              newHeight = _getScale4[3];

          var scaleMatrix = getScaleMatrix(scaleX, scaleY);
          var resultMatrix = scalable ? multiplyMatrix(scaleMatrix, matrix) : getTranslateMatrix(scaleMatrix, matrix);

          if (newWidth <= MIN_SIZE || newHeight <= MIN_SIZE) {
            return {
              transform: resultMatrix,
              width: newWidth,
              height: newHeight
            };
          }
          helper(el).css(_objectSpread2(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))), !scalable && {
            width: "".concat(newWidth, "px"),
            height: "".concat(newHeight, "px")
          }));
          applyTransformToHandles(storage, this.options, {
            el: el,
            boxMatrix: resultMatrix
          });
          storage.cached.dist = {
            dx: newDx,
            dy: newDy
          };
          return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
          };
        }
      }, {
        key: "_processMove",
        value: function _processMove(dx, dy) {
          var el = this.el,
              storage = this.storage,
              _this$storage3 = this.storage,
              wrapper = _this$storage3.wrapper,
              _this$storage3$transf = _this$storage3.transform,
              matrix = _this$storage3$transf.matrix,
              wrapperMatrix = _this$storage3$transf.wrapperMatrix,
              parentMatrix = _this$storage3$transf.auxiliary.translate.parentMatrix,
              center = _this$storage3.center,
              _this$storage3$cached = _this$storage3.cached;
          _this$storage3$cached = _this$storage3$cached === void 0 ? {} : _this$storage3$cached;
          var _this$storage3$cached2 = _this$storage3$cached.dist;
          _this$storage3$cached2 = _this$storage3$cached2 === void 0 ? {} : _this$storage3$cached2;
          var _this$storage3$cached3 = _this$storage3$cached2.dx,
              nextDx = _this$storage3$cached3 === void 0 ? dx : _this$storage3$cached3,
              _this$storage3$cached4 = _this$storage3$cached2.dy,
              nextDy = _this$storage3$cached4 === void 0 ? dy : _this$storage3$cached4,
              restrict = this.options.restrict;

          var _multiplyMatrixAndPoi3 = multiplyMatrixAndPoint(parentMatrix, [dx, dy, 0, 1]),
              _multiplyMatrixAndPoi4 = _slicedToArray(_multiplyMatrixAndPoi3, 2),
              x = _multiplyMatrixAndPoi4[0],
              y = _multiplyMatrixAndPoi4[1];

          var preTranslateMatrix = multiplyMatrix(matrix, createTranslateMatrix(x, y));

          var _ref9 = restrict ? this._restrictHandler(preTranslateMatrix) : {
            x: null,
            y: null
          },
              restX = _ref9.x,
              restY = _ref9.y;

          var newDx = restX !== null && restrict ? nextDx : dx,
              newDy = restY !== null && restrict ? nextDy : dy;

          var _multiplyMatrixAndPoi5 = multiplyMatrixAndPoint(parentMatrix, [newDx, newDy, 0, 1]),
              _multiplyMatrixAndPoi6 = _slicedToArray(_multiplyMatrixAndPoi5, 2),
              nx = _multiplyMatrixAndPoi6[0],
              ny = _multiplyMatrixAndPoi6[1];

          var moveElementMtrx = multiplyMatrix(matrix, createTranslateMatrix(nx, ny));
          var moveWrapperMtrx = multiplyMatrix(wrapperMatrix, createTranslateMatrix(newDx, newDy));
          var elStyle = matrixToCSS(flatMatrix(moveElementMtrx));
          var wrapperStyle = matrixToCSS(flatMatrix(moveWrapperMtrx));
          helper(el).css(elStyle);
          helper(wrapper).css(wrapperStyle);
          storage.cached.dist = {
            dx: newDx,
            dy: newDy
          };

          if (center.isShifted) ;

          return moveElementMtrx;
        }
      }, {
        key: "_processRotate",
        value: function _processRotate(radians) {
          var el = this.el,
              _this$storage$transfo = this.storage.transform,
              matrix = _this$storage$transfo.matrix,
              translateMatrix = _this$storage$transfo.auxiliary.rotate.translateMatrix,
              restrict = this.options.restrict;
          var cos = floatToFixed(Math.cos(radians), 4),
              sin = floatToFixed(Math.sin(radians), 4);
          var rotationMatrix = createRotateMatrix(sin, cos);
          var transformMatrix = multiplyMatrix(multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix), translateMatrix);
          var resultMatrix = multiplyMatrix(matrix, transformMatrix);

          var _ref10 = restrict ? this._restrictHandler(resultMatrix) : {
            x: null,
            y: null
          },
              restX = _ref10.x,
              restY = _ref10.y;

          if (isDef(restX) || isDef(restY)) return resultMatrix;
          helper(el).css(matrixToCSS(flatMatrix(resultMatrix)));
          applyTransformToHandles(this.storage, this.options, {
            el: el,
            boxMatrix: resultMatrix
          });
          return resultMatrix;
        }
      }, {
        key: "_getState",
        value: function _getState(_ref11) {
          var revX = _ref11.revX,
              revY = _ref11.revY,
              doW = _ref11.doW,
              doH = _ref11.doH;
          var el = this.el,
              _this$storage4 = this.storage,
              cHandle = _this$storage4.handles.center,
              parent = _this$storage4.parent,
              wrapper = _this$storage4.wrapper,
              oldCenter = _this$storage4.center,
              _this$options4 = this.options,
              container = _this$options4.container,
              restrict = _this$options4.restrict,
              scalable = _this$options4.scalable;

          var _ref12 = restrict || container,
              offsetWidth = _ref12.offsetWidth,
              offsetHeight = _ref12.offsetHeight;

          var _getAbsoluteOffset3 = getAbsoluteOffset(el, container),
              _getAbsoluteOffset4 = _slicedToArray(_getAbsoluteOffset3, 2),
              glLeft = _getAbsoluteOffset4[0],
              glTop = _getAbsoluteOffset4[1];

          var elOffsetLeft = el.offsetLeft,
              elOffsetTop = el.offsetTop,
              elWidth = el.offsetWidth,
              elHeight = el.offsetHeight;
          var matrix = getTransform(el);
          var ctm = getCurrentTransformMatrix(el, container);
          var parentMatrix = getCurrentTransformMatrix(parent, container);
          var wrapperMatrix = getCurrentTransformMatrix(wrapper, container);
          var containerMatrix = restrict ? getCurrentTransformMatrix(restrict, restrict.parentNode) : getCurrentTransformMatrix(container, container.parentNode);
          var hW = elWidth / 2,
              hH = elHeight / 2;
          var scaleX = doH ? 0 : revX ? -hW : hW,
              scaleY = doW ? 0 : revY ? -hH : hH; // real element's center

          var _multiplyMatrixAndPoi7 = multiplyMatrixAndPoint(ctm, [hW, hH, 0, 1]),
              _multiplyMatrixAndPoi8 = _slicedToArray(_multiplyMatrixAndPoi7, 2),
              cenX = _multiplyMatrixAndPoi8[0],
              cenY = _multiplyMatrixAndPoi8[1];

          var globalCenterX = cenX + glLeft;
          var globalCenterY = cenY + glTop;
          var originTransform = cHandle ? getTransform(cHandle) : createIdentityMatrix();

          var _ref13 = cHandle ? decompose(getCurrentTransformMatrix(cHandle)) : {
            translate: {
              x: globalCenterX,
              y: globalCenterY
            }
          },
              _ref13$translate = _ref13.translate,
              originX = _ref13$translate.x,
              originY = _ref13$translate.y; // search distance between el's center and rotation handle


          var _multiplyMatrixAndPoi9 = multiplyMatrixAndPoint(multiplyMatrix(matrixInvert(dropTranslate(ctm)), dropTranslate(originTransform)), [originX - globalCenterX, originY - globalCenterY, 0, 1]),
              _multiplyMatrixAndPoi10 = _slicedToArray(_multiplyMatrixAndPoi9, 2),
              distX = _multiplyMatrixAndPoi10[0],
              distY = _multiplyMatrixAndPoi10[1]; // todo: check rotation origin with parent transform


          var _multiplyMatrixAndPoi11 = multiplyMatrixAndPoint(matrix, [distX, distY, 0, 1]),
              _multiplyMatrixAndPoi12 = _slicedToArray(_multiplyMatrixAndPoi11, 2),
              elX = _multiplyMatrixAndPoi12[0],
              elY = _multiplyMatrixAndPoi12[1];

          var containerBox = multiplyMatrixAndPoint(dropTranslate(containerMatrix), [offsetWidth, offsetHeight, 0, 1]);

          var _decompose = decompose(getCurrentTransformMatrix(el, el.parentNode)),
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
            containerMatrix: containerMatrix,
            wrapperMatrix: wrapperMatrix,
            scX: sX,
            scY: sY,
            containerBox: containerBox
          };
          return {
            transform: transform,
            box: {
              width: elWidth,
              height: elHeight,
              left: elOffsetLeft,
              top: elOffsetTop,
              offset: {
                left: glLeft,
                top: glTop
              }
            },
            center: _objectSpread2(_objectSpread2({}, oldCenter), {}, {
              x: globalCenterX,
              y: globalCenterY,
              elX: elX,
              elY: elY,
              matrix: originTransform
            }),
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          };
        }
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(x, y) {
          var _this$storage5 = this.storage,
              center = _this$storage5.handles.center,
              matrix = _this$storage5.center.matrix;
          var resultMatrix = multiplyMatrix(matrix, createTranslateMatrix(x, y));
          helper(center).css(_objectSpread2({}, matrixToCSS(flatMatrix(resultMatrix))));
          this.storage.center.isShifted = true;
        }
      }, {
        key: "resetCenterPoint",
        value: function resetCenterPoint() {
          var el = this.el,
              _this$el = this.el,
              offsetHeight = _this$el.offsetHeight,
              offsetWidth = _this$el.offsetWidth,
              _this$storage6 = this.storage,
              wrapper = _this$storage6.wrapper,
              center = _this$storage6.handles.center,
              container = this.options.container;
          if (!center) return;

          var _getAbsoluteOffset5 = getAbsoluteOffset(el, container),
              _getAbsoluteOffset6 = _slicedToArray(_getAbsoluteOffset5, 2),
              offsetLeft = _getAbsoluteOffset6[0],
              offsetTop = _getAbsoluteOffset6[1];

          var matrix = multiplyMatrix(getCurrentTransformMatrix(el, container), matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode)));

          var _multiplyMatrixAndPoi13 = multiplyMatrixAndPoint(matrix, [offsetWidth / 2, offsetHeight / 2, 0, 1]),
              _multiplyMatrixAndPoi14 = _slicedToArray(_multiplyMatrixAndPoi13, 2),
              x = _multiplyMatrixAndPoi14[0],
              y = _multiplyMatrixAndPoi14[1];

          helper(center).css({
            transform: "translate(".concat(x + offsetLeft, "px, ").concat(y + offsetTop, "px)")
          });
        }
      }, {
        key: "fitControlsToSize",
        value: function fitControlsToSize() {
          var el = this.el,
              wrapper = this.storage.wrapper;
          wrapper.removeAttribute('transform');
          applyTransformToHandles(this.storage, this.options, {
            el: el
          });
        }
      }, {
        key: "getBoundingRect",
        value: function getBoundingRect() {
          var transformMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var el = this.el,
              _this$options5 = this.options,
              scalable = _this$options5.scalable,
              restrict = _this$options5.restrict,
              _this$storage7 = this.storage,
              box = _this$storage7.box,
              _this$storage7$box = _this$storage7.box,
              width = _this$storage7$box.width,
              height = _this$storage7$box.height,
              _this$storage7$cached = _this$storage7.cached;
          _this$storage7$cached = _this$storage7$cached === void 0 ? {} : _this$storage7$cached;
          var _this$storage7$cached2 = _this$storage7$cached.box;
          _this$storage7$cached2 = _this$storage7$cached2 === void 0 ? {} : _this$storage7$cached2;
          var _this$storage7$cached3 = _this$storage7$cached2.width,
              nextWidth = _this$storage7$cached3 === void 0 ? width : _this$storage7$cached3,
              _this$storage7$cached4 = _this$storage7$cached2.height,
              nextHeight = _this$storage7$cached4 === void 0 ? height : _this$storage7$cached4;
          var nextBox = scalable ? box : _objectSpread2(_objectSpread2({}, box), {}, {
            width: nextWidth,
            height: nextHeight
          });
          return _getBoundingRect(el, restrict, getCurrentTransformMatrix(el, restrict, transformMatrix), nextBox);
        }
      }, {
        key: "controls",
        get: function get() {
          return this.storage.wrapper;
        }
      }]);

      return Draggable;
    }(Transformable);

    var createHandler = function createHandler(_ref14) {
      var _ref15 = _slicedToArray(_ref14, 2),
          x = _ref15[0],
          y = _ref15[1];

      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'handler';
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var element = createElement(['sjx-hdl', "sjx-hdl-".concat(key)]);
      helper(element).css(_objectSpread2({
        transform: "translate(".concat(x, "px, ").concat(y, "px)")
      }, style));
      return element;
    };

    var renderLine = function renderLine(_ref16, key) {
      var _ref17 = _slicedToArray(_ref16, 3),
          pt1 = _ref17[0],
          pt2 = _ref17[1],
          _ref17$ = _ref17[2],
          thickness = _ref17$ === void 0 ? 1 : _ref17$;

      var _getLineAttrs = getLineAttrs(pt1, pt2, thickness),
          cx = _getLineAttrs.cx,
          cy = _getLineAttrs.cy,
          length = _getLineAttrs.length,
          theta = _getLineAttrs.theta;

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

    var applyTransformToHandles = function applyTransformToHandles(storage, options, data) {
      var wrapper = storage.wrapper,
          handles = storage.handles,
          _storage$transform = storage.transform;
      _storage$transform = _storage$transform === void 0 ? {} : _storage$transform;
      var _storage$transform$wr = _storage$transform.wrapperMatrix,
          wrapperMatrix = _storage$transform$wr === void 0 ? getCurrentTransformMatrix(wrapper, wrapper.parentNode) : _storage$transform$wr,
          center = storage.center;
      var rotationPoint = options.rotationPoint,
          rotatable = options.rotatable,
          resizable = options.resizable,
          showNormal = options.showNormal,
          rotatorOffset = options.rotatorOffset,
          rotatorAnchor = options.rotatorAnchor,
          container = options.container;
      var el = data.el,
          _data$el = data.el,
          offsetHeight = _data$el.offsetHeight,
          offsetWidth = _data$el.offsetWidth;

      var _getAbsoluteOffset7 = getAbsoluteOffset(el, container),
          _getAbsoluteOffset8 = _slicedToArray(_getAbsoluteOffset7, 2),
          offsetLeft = _getAbsoluteOffset8[0],
          offsetTop = _getAbsoluteOffset8[1];

      var matrix = multiplyMatrix(getCurrentTransformMatrix(el, container), // better to find result matrix instead of calculated
      matrixInvert(wrapperMatrix));

      var vertices = _objectSpread2({
        tl: [0, 0, 0, 1],
        tr: [offsetWidth, 0, 0, 1],
        bl: [0, offsetHeight, 0, 1],
        br: [offsetWidth, offsetHeight, 0, 1],
        tc: [offsetWidth / 2, 0, 0, 1],
        ml: [0, offsetHeight / 2, 0, 1],
        bc: [offsetWidth / 2, offsetHeight, 0, 1],
        mr: [offsetWidth, offsetHeight / 2, 0, 1]
      }, rotationPoint && rotatable && !center.isShifted && {
        center: [offsetWidth / 2, offsetHeight / 2, 0, 1]
      });

      var finalVertices = Object.entries(vertices).reduce(function (nextVerteces, _ref18) {
        var _ref19 = _slicedToArray(_ref18, 2),
            key = _ref19[0],
            vertex = _ref19[1];

        return [].concat(_toConsumableArray(nextVerteces), [[key, multiplyMatrixAndPoint(matrix, vertex)]]);
      }, []).reduce(function (vertices, _ref20) {
        var _ref21 = _slicedToArray(_ref20, 2),
            key = _ref21[0],
            _ref21$ = _slicedToArray(_ref21[1], 4),
            x = _ref21$[0],
            y = _ref21$[1],
            z = _ref21$[2],
            w = _ref21$[3];

        vertices[key] = [x + offsetLeft, y + offsetTop, z, w];
        return vertices;
      }, {});
      var normalLine = null;
      var rotationHandles = {};

      if (rotatable) {
        var anchor = {};
        var factor = 1;
        var rotator = [];

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
        var nextRotatorOffset = rotatorOffset * factor;
        rotator = [anchor.x - nextRotatorOffset * Math.cos(theta), anchor.y - nextRotatorOffset * Math.sin(theta)];
        normalLine = showNormal ? [[anchor.x, anchor.y], rotator] : null;
        rotationHandles = {
          rotator: rotator
        };
      }

      var resizingHandles = _objectSpread2({}, finalVertices);

      var resizingEdges = _objectSpread2({
        te: [finalVertices.tl, finalVertices.tr],
        be: [finalVertices.bl, finalVertices.br],
        le: [finalVertices.tl, finalVertices.bl],
        re: [finalVertices.tr, finalVertices.br]
      }, showNormal && normalLine && {
        normal: normalLine
      });

      Object.keys(resizingEdges).forEach(function (key) {
        var _resizingEdges$key = _slicedToArray(resizingEdges[key], 2),
            pt1 = _resizingEdges$key[0],
            pt2 = _resizingEdges$key[1];

        var _getLineAttrs2 = getLineAttrs(pt1, pt2),
            cx = _getLineAttrs2.cx,
            cy = _getLineAttrs2.cy,
            length = _getLineAttrs2.length,
            theta = _getLineAttrs2.theta;

        helper(handles[key]).css({
          transform: "translate(".concat(cx, "px, ").concat(cy, "px) rotate(").concat(theta, "deg)"),
          width: "".concat(length, "px")
        });
      });

      var allHandles = _objectSpread2(_objectSpread2({}, resizable && resizingHandles), rotationHandles);

      Object.keys(allHandles).forEach(function (key) {
        var hdl = allHandles[key];
        if (!hdl) return;

        var _hdl = _slicedToArray(hdl, 2),
            x = _hdl[0],
            y = _hdl[1];

        helper(handles[key]).css({
          transform: "translate(".concat(x, "px, ").concat(y, "px)")
        });
      });
    };

    var _getBoundingRect = function _getBoundingRect(el, container, ctm, box) {
      var _getAbsoluteOffset9 = getAbsoluteOffset(el, container),
          _getAbsoluteOffset10 = _slicedToArray(_getAbsoluteOffset9, 2),
          offsetLeft = _getAbsoluteOffset10[0],
          offsetTop = _getAbsoluteOffset10[1];

      var _ref22 = box || {
        width: el.offsetWidth,
        height: el.offsetHeight,
        offset: {
          left: offsetLeft,
          top: offsetTop
        }
      },
          width = _ref22.width,
          height = _ref22.height,
          _ref22$offset = _ref22.offset,
          left = _ref22$offset.left,
          top = _ref22$offset.top;

      var vertices = [[0, 0, 0, 1], [width, 0, 0, 1], [0, height, 0, 1], [width, height, 0, 1]];
      return vertices.reduce(function (nextVerteces, vertex) {
        return [].concat(_toConsumableArray(nextVerteces), [multiplyMatrixAndPoint(ctm, vertex)]);
      }, []).map(function (_ref23) {
        var _ref24 = _slicedToArray(_ref23, 4),
            x = _ref24[0],
            y = _ref24[1],
            z = _ref24[2],
            w = _ref24[3];

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

    var svgPoint = createSVGElement('svg').createSVGPoint();
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
    var checkChildElements = function checkChildElements(element) {
      var arrOfElements = [];

      if (isGroup(element)) {
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
      svgPoint.x = x;
      svgPoint.y = y;
      return svgPoint.matrixTransform(ctm);
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
    var isGroup = function isGroup(element) {
      return element.tagName.toLowerCase() === 'g';
    };
    var normalizeString = function normalizeString() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return str.replace(/([^e])-/g, '$1 -').replace(/ +/g, ' ');
    };
    var parsePoints = function parsePoints(pts) {
      return normalizeString(pts).split(sepRE).reduce(function (result, _, index, array) {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }

        return result;
      }, []);
    };

    var dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;

    var parsePath = function parsePath(path) {
      var match = dRE.lastIndex = 0;
      var serialized = [];

      while (match = dRE.exec(path)) {
        var _match = match,
            _match2 = _slicedToArray(_match, 3),
            cmd = _match2[1],
            params = _match2[2];

        var upCmd = cmd.toUpperCase();
        var data = normalizeString(params);
        serialized.push({
          relative: cmd !== upCmd,
          key: upCmd,
          cmd: cmd,
          values: data.trim().split(sepRE).map(function (val) {
            if (!isNaN(val)) {
              return Number(val);
            }
          })
        });
      }

      return serialized;
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

          str += item.cmd + coordinates.join(',') + space;
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
              relative = item.relative;

          switch (cmd) {
            case 'A':
              {
                //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                var coordinates = [];

                for (var k = 0, _len8 = values.length; k < _len8; k += 7) {
                  var _values$slice7 = values.slice(k, k + 7),
                      _values$slice8 = _slicedToArray(_values$slice7, 7),
                      rx = _values$slice8[0],
                      ry = _values$slice8[1],
                      x_axis_rot = _values$slice8[2],
                      large_arc_flag = _values$slice8[3],
                      sweep_flag = _values$slice8[4],
                      x = _values$slice8[5],
                      y = _values$slice8[6];

                  var mtrx = cloneMatrix$1(localCTM);

                  if (relative) {
                    mtrx.e = mtrx.f = 0;
                  }

                  var _pointTo = pointTo(mtrx, x, y),
                      resX = _pointTo.x,
                      resY = _pointTo.y;

                  coordinates.push(floatToFixed(resX), floatToFixed(resY));
                  mtrx.e = mtrx.f = 0;

                  var _pointTo2 = pointTo(mtrx, rx, ry),
                      newRx = _pointTo2.x,
                      newRy = _pointTo2.y;

                  coordinates.unshift(floatToFixed(newRx), floatToFixed(newRy), x_axis_rot, large_arc_flag, sweep_flag);
                }

                res.push(coordinates);
                break;
              }

            case 'C':
              {
                //C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
                var _coordinates = [];

                for (var _k7 = 0, _len9 = values.length; _k7 < _len9; _k7 += 6) {
                  var _values$slice9 = values.slice(_k7, _k7 + 6),
                      _values$slice10 = _slicedToArray(_values$slice9, 6),
                      x1 = _values$slice10[0],
                      y1 = _values$slice10[1],
                      x2 = _values$slice10[2],
                      y2 = _values$slice10[3],
                      _x2 = _values$slice10[4],
                      _y2 = _values$slice10[5];

                  var _mtrx = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx.e = _mtrx.f = 0;
                  }

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
            // todo: use proportional resizing only or need to be converted to L

            case 'H':
              {
                // H x (or h dx)
                var _coordinates2 = [];

                for (var _k8 = 0, _len10 = values.length; _k8 < _len10; _k8 += 1) {
                  var _values$slice11 = values.slice(_k8, _k8 + 1),
                      _values$slice12 = _slicedToArray(_values$slice11, 1),
                      _x3 = _values$slice12[0];

                  var _mtrx2 = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx2.e = _mtrx2.f = 0;
                  }

                  var _pointTo6 = pointTo(_mtrx2, _x3, 0),
                      _resX2 = _pointTo6.x;

                  _coordinates2.push(floatToFixed(_resX2));
                }

                res.push(_coordinates2);
                break;
              }
            // this command makes impossible free transform within group
            // todo: use proportional resizing only or need to be converted to L

            case 'V':
              {
                // V y (or v dy)
                var _coordinates3 = [];

                for (var _k9 = 0, _len11 = values.length; _k9 < _len11; _k9 += 1) {
                  var _values$slice13 = values.slice(_k9, _k9 + 1),
                      _values$slice14 = _slicedToArray(_values$slice13, 1),
                      _y3 = _values$slice14[0];

                  var _mtrx3 = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx3.e = _mtrx3.f = 0;
                  }

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

                for (var _k10 = 0, _len12 = values.length; _k10 < _len12; _k10 += 2) {
                  var _values$slice15 = values.slice(_k10, _k10 + 2),
                      _values$slice16 = _slicedToArray(_values$slice15, 2),
                      _x4 = _values$slice16[0],
                      _y4 = _values$slice16[1];

                  var _mtrx4 = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx4.e = _mtrx4.f = 0;
                  }

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

                for (var _k11 = 0, _len13 = values.length; _k11 < _len13; _k11 += 2) {
                  var _values$slice17 = values.slice(_k11, _k11 + 2),
                      _values$slice18 = _slicedToArray(_values$slice17, 2),
                      _x5 = _values$slice18[0],
                      _y5 = _values$slice18[1];

                  var _mtrx5 = cloneMatrix$1(localCTM);

                  if (relative && !firstCommand) {
                    _mtrx5.e = _mtrx5.f = 0;
                  }

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
                //Q x1 y1, x y (or q dx1 dy1, dx dy)
                var _coordinates6 = [];

                for (var _k12 = 0, _len14 = values.length; _k12 < _len14; _k12 += 4) {
                  var _values$slice19 = values.slice(_k12, _k12 + 4),
                      _values$slice20 = _slicedToArray(_values$slice19, 4),
                      _x6 = _values$slice20[0],
                      _y6 = _values$slice20[1],
                      _x7 = _values$slice20[2],
                      _y7 = _values$slice20[3];

                  var _mtrx6 = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx6.e = _mtrx6.f = 0;
                  }

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
                //S x2 y2, x y (or s dx2 dy2, dx dy)
                var _coordinates7 = [];

                for (var _k13 = 0, _len15 = values.length; _k13 < _len15; _k13 += 4) {
                  var _values$slice21 = values.slice(_k13, _k13 + 4),
                      _values$slice22 = _slicedToArray(_values$slice21, 4),
                      _x8 = _values$slice22[0],
                      _y8 = _values$slice22[1],
                      _x9 = _values$slice22[2],
                      _y9 = _values$slice22[3];

                  var _mtrx7 = cloneMatrix$1(localCTM);

                  if (relative) {
                    _mtrx7.e = _mtrx7.f = 0;
                  }

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

          str += item.cmd + res[i].join(',') + space;
        }

        return str;
      } catch (err) {
        warn('Path parsing error: ' + err);
      }
    };

    var E_DRAG$3 = EVENT_EMITTER_CONSTANTS.E_DRAG,
        E_RESIZE$2 = EVENT_EMITTER_CONSTANTS.E_RESIZE;
    var E_MOUSEDOWN$3 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$3 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;

    var DraggableSVG = /*#__PURE__*/function (_Transformable) {
      _inherits(DraggableSVG, _Transformable);

      var _super = _createSuper(DraggableSVG);

      function DraggableSVG() {
        _classCallCheck(this, DraggableSVG);

        return _super.apply(this, arguments);
      }

      _createClass(DraggableSVG, [{
        key: "_init",
        value: function _init(el) {
          var _this = this;

          var _this$options = this.options,
              rotationPoint = _this$options.rotationPoint,
              container = _this$options.container,
              controlsContainer = _this$options.controlsContainer,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable,
              rotatorAnchor = _this$options.rotatorAnchor,
              rotatorOffset = _this$options.rotatorOffset,
              showNormal = _this$options.showNormal,
              custom = _this$options.custom;
          var elBBox = el.getBBox();
          var bX = elBBox.x,
              bY = elBBox.y,
              bW = elBBox.width,
              bH = elBBox.height;
          var wrapper = createSVGElement('g', ['sjx-svg-wrapper']);
          var controls = createSVGElement('g', ['sjx-svg-controls']);
          var originRotation = ['data-sjx-cx', 'data-sjx-cy'].map(function (attr) {
            var val = el.getAttribute(attr);
            return isDef(val) ? Number(val) : undefined;
          });
          var hasOrigin = originRotation.every(function (val) {
            return !isNaN(val);
          });
          var vertices = {
            tl: [bX, bY],
            tr: [bX + bW, bY],
            mr: [bX + bW, bY + bH / 2],
            ml: [bX, bY + bH / 2],
            tc: [bX + bW / 2, bY],
            bc: [bX + bW / 2, bY + bH],
            br: [bX + bW, bY + bH],
            bl: [bX, bY + bH],
            center: [bX + bW / 2, bY + bH / 2]
          };
          var elCTM = getTransformToElement(el, container);
          var nextVertices = Object.entries(vertices).reduce(function (nextRes, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                _ref2$ = _slicedToArray(_ref2[1], 2),
                x = _ref2$[0],
                y = _ref2$[1];

            return _objectSpread2(_objectSpread2({}, nextRes), {}, _defineProperty({}, key, pointTo(elCTM, x, y)));
          }, {});
          var handles = {};
          var rotationHandles = {},
              rotator = null;

          if (rotatable) {
            var anchor = {};
            var factor = 1;

            switch (rotatorAnchor) {
              case 'n':
                anchor.x = nextVertices.tc.x;
                anchor.y = nextVertices.tc.y;
                break;

              case 's':
                anchor.x = nextVertices.bc.x;
                anchor.y = nextVertices.bc.y;
                factor = -1;
                break;

              case 'w':
                anchor.x = nextVertices.ml.x;
                anchor.y = nextVertices.ml.y;
                factor = -1;
                break;

              case 'e':
              default:
                anchor.x = nextVertices.mr.x;
                anchor.y = nextVertices.mr.y;
                break;
            }

            var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(nextVertices.bl.y - nextVertices.tl.y, nextVertices.bl.x - nextVertices.tl.x) : Math.atan2(nextVertices.tl.y - nextVertices.tr.y, nextVertices.tl.x - nextVertices.tr.x);
            rotator = {
              x: anchor.x - rotatorOffset * factor * Math.cos(theta),
              y: anchor.y - rotatorOffset * factor * Math.sin(theta)
            };
            var normalLine = showNormal ? renderLine$1([anchor, rotator], THEME_COLOR, 'normal') : null;
            if (showNormal) controls.appendChild(normalLine);
            var radius = null;

            if (rotationPoint) {
              radius = createSVGElement('line', ['sjx-hidden']);
              radius.x1.baseVal.value = nextVertices.center.x;
              radius.y1.baseVal.value = nextVertices.center.y;
              radius.x2.baseVal.value = originRotation[0] || nextVertices.center.x;
              radius.y2.baseVal.value = originRotation[1] || nextVertices.center.y;
              setLineStyle(radius, '#fe3232');
              radius.setAttribute('opacity', 0.5);
              controls.appendChild(radius);
            }

            rotationHandles = _objectSpread2(_objectSpread2({}, rotationHandles), {}, {
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
          Object.keys(resizingEdges).forEach(function (key) {
            var data = resizingEdges[key];
            if (isUndef(data)) return;
            handles[key] = renderLine$1(data, THEME_COLOR, key);
            controls.appendChild(handles[key]);
          });
          var nextCenter = hasOrigin ? pointTo(createSVGMatrix(), originRotation[0], originRotation[1]) : nextVertices.center;

          var allHandles = _objectSpread2(_objectSpread2({}, resizingHandles), {}, {
            rotator: rotator,
            center: rotationPoint && rotatable ? nextCenter : undefined
          });

          Object.keys(allHandles).forEach(function (key) {
            var data = allHandles[key];
            if (isUndef(data)) return;
            var x = data.x,
                y = data.y;
            var color = key === 'center' ? '#fe3232' : THEME_COLOR;

            if (isDef(custom) && isFunc(custom[key])) {
              handles[key] = custom[key](elCTM, elBBox, pointTo);
            } else {
              handles[key] = createHandler$1(x, y, color, key);
            }

            controls.appendChild(handles[key]);
          });
          wrapper.appendChild(controls);
          controlsContainer.appendChild(wrapper);
          this.storage = {
            wrapper: wrapper,
            controls: controls,
            handles: _objectSpread2(_objectSpread2({}, handles), rotationHandles),
            parent: el.parentNode,
            center: {
              isShifted: hasOrigin
            },
            cached: {}
          };
          [el, controls].map(function (target) {
            return helper(target).on(E_MOUSEDOWN$3, _this._onMouseDown).on(E_TOUCHSTART$3, _this._onTouchStart);
          });
        }
      }, {
        key: "_cursorPoint",
        value: function _cursorPoint(_ref3) {
          var clientX = _ref3.clientX,
              clientY = _ref3.clientY;
          var container = this.options.container;
          return this._applyMatrixToPoint(container.getScreenCTM().inverse(), clientX, clientY);
        }
      }, {
        key: "_restrictHandler",
        value: function _restrictHandler(matrix) {
          var containerMatrix = this.storage.transform.containerMatrix,
              _this$options2 = this.options,
              container = _this$options2.container,
              _this$options2$restri = _this$options2.restrict,
              restrict = _this$options2$restri === void 0 ? container : _this$options2$restri;
          var restrictX = null,
              restrictY = null;

          var containerBox = _getBoundingRect$1(restrict, containerMatrix);

          var elBox = this.getBoundingRect(matrix);

          var _getMinMaxOf2DIndex = getMinMaxOf2DIndex(containerBox, 0),
              _getMinMaxOf2DIndex2 = _slicedToArray(_getMinMaxOf2DIndex, 2),
              minX = _getMinMaxOf2DIndex2[0],
              maxX = _getMinMaxOf2DIndex2[1];

          var _getMinMaxOf2DIndex3 = getMinMaxOf2DIndex(containerBox, 1),
              _getMinMaxOf2DIndex4 = _slicedToArray(_getMinMaxOf2DIndex3, 2),
              minY = _getMinMaxOf2DIndex4[0],
              maxY = _getMinMaxOf2DIndex4[1];

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
        key: "_pointToElement",
        value: function _pointToElement(_ref4) {
          var x = _ref4.x,
              y = _ref4.y;
          var ctm = this.storage.transform.ctm;
          var matrix = ctm.inverse();
          matrix.e = matrix.f = 0;
          return this._applyMatrixToPoint(matrix, x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(_ref5) {
          var x = _ref5.x,
              y = _ref5.y;
          var wrapperMatrix = this.storage.transform.wrapperMatrix;
          var matrix = wrapperMatrix.inverse();
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
        key: "_apply",
        value: function _apply(actionName) {
          var element = this.el,
              storage = this.storage,
              _this$storage = this.storage,
              bBox = _this$storage.bBox,
              cached = _this$storage.cached,
              transform = _this$storage.transform,
              center = _this$storage.center,
              options = this.options,
              _this$options3 = this.options,
              container = _this$options3.container,
              scalable = _this$options3.scalable,
              applyDragging = _this$options3.applyTranslate;
          var matrix = transform.matrix,
              parentMatrix = transform.parentMatrix,
              ctm = transform.ctm;
          element.setAttribute('data-sjx-cx', center.elX);
          element.setAttribute('data-sjx-cy', center.elY);
          if (isUndef(cached)) return;
          var scaleX = cached.scaleX,
              scaleY = cached.scaleY,
              dx = cached.dx,
              dy = cached.dy,
              ox = cached.ox,
              oy = cached.oy,
              transformMatrix = cached.transformMatrix;

          if (actionName === E_DRAG$3) {
            if (!applyDragging || dx === 0 && dy === 0) return;
            var eM = createTranslateMatrix$1(dx, dy);
            var translateMatrix = eM.multiply(matrix).multiply(eM.inverse());
            element.setAttribute('transform', matrixToString(translateMatrix));

            if (isGroup(element)) {
              var els = checkChildElements(element);
              els.forEach(function (child) {
                var eM = createTranslateMatrix$1(dx, dy);
                var translateMatrix = eM.multiply(getTransformToElement(child, child.parentNode)).multiply(eM.inverse());

                if (!isIdentity(translateMatrix)) {
                  child.setAttribute('transform', matrixToString(translateMatrix));
                }

                if (!isGroup(child)) {
                  var _ctm = parentMatrix.inverse();

                  _ctm.e = _ctm.f = 0;
                  applyTranslate(child, _objectSpread2({}, pointTo(_ctm, ox, oy)));
                }
              });
            } else {
              applyTranslate(element, {
                x: dx,
                y: dy
              });
            }
          }

          if (actionName === E_RESIZE$2) {
            if (!transformMatrix) return;

            if (!scalable) {
              if (isGroup(element)) {
                var _els = checkChildElements(element);

                _els.forEach(function (child) {
                  if (!isGroup(child)) {
                    var childCTM = getTransformToElement(child, element);
                    var localCTM = childCTM.inverse().multiply(transformMatrix).multiply(childCTM);
                    applyResize(child, {
                      scaleX: scaleX,
                      scaleY: scaleY,
                      localCTM: localCTM,
                      bBox: bBox,
                      container: container,
                      storage: storage,
                      cached: cached
                    });
                  }
                });
              } else {
                var containerCTM = container.getScreenCTM() || createSVGMatrix();
                var elementMatrix = element.getScreenCTM().multiply(transformMatrix);
                var resultCTM = containerCTM.inverse().multiply(elementMatrix);
                var localCTM = ctm.inverse().multiply(resultCTM);
                applyResize(element, {
                  scaleX: scaleX,
                  scaleY: scaleY,
                  localCTM: localCTM,
                  bBox: bBox,
                  container: container,
                  storage: storage,
                  cached: cached
                });
              }
            }

            applyTransformToHandles$1(storage, options, {
              boxMatrix: scalable ? ctm.multiply(transformMatrix) : ctm,
              element: element
            });
          }
        }
      }, {
        key: "_processResize",
        value: function _processResize(dx, dy) {
          var el = this.el,
              storage = this.storage,
              _this$storage2 = this.storage,
              _this$storage2$bBox = _this$storage2.bBox,
              boxWidth = _this$storage2$bBox.width,
              boxHeight = _this$storage2$bBox.height,
              revX = _this$storage2.revX,
              revY = _this$storage2.revY,
              doW = _this$storage2.doW,
              doH = _this$storage2.doH,
              _this$storage2$transf = _this$storage2.transform,
              matrix = _this$storage2$transf.matrix,
              translateMatrix = _this$storage2$transf.auxiliary.scale.translateMatrix,
              _this$storage2$cached = _this$storage2.cached;
          _this$storage2$cached = _this$storage2$cached === void 0 ? {} : _this$storage2$cached;
          var _this$storage2$cached2 = _this$storage2$cached.dist;
          _this$storage2$cached2 = _this$storage2$cached2 === void 0 ? {} : _this$storage2$cached2;
          var _this$storage2$cached3 = _this$storage2$cached2.dx,
              nextDx = _this$storage2$cached3 === void 0 ? dx : _this$storage2$cached3,
              _this$storage2$cached4 = _this$storage2$cached2.dy,
              nextDy = _this$storage2$cached4 === void 0 ? dy : _this$storage2$cached4,
              _this$options4 = this.options,
              proportions = _this$options4.proportions,
              scalable = _this$options4.scalable,
              restrict = _this$options4.restrict;

          var _el$getBBox = el.getBBox(),
              x = _el$getBBox.x,
              y = _el$getBBox.y;

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
            return translateMatrix.multiply(scaleMatrix).multiply(translateMatrix.inverse());
          };

          var preScaledMatrix = matrix.multiply(getScaleMatrix.apply(void 0, _toConsumableArray(getScale(dx, dy))));

          var _ref6 = restrict ? this._restrictHandler(preScaledMatrix) : {
            x: null,
            y: null
          },
              restX = _ref6.x,
              restY = _ref6.y;

          var isBounding = (restX !== null || restY !== null) && restrict;
          var newDx = isBounding ? nextDx : dx;
          var newDy = isBounding ? nextDy : dy;

          var _getScale = getScale(newDx, newDy),
              _getScale2 = _slicedToArray(_getScale, 4),
              scaleX = _getScale2[0],
              scaleY = _getScale2[1],
              newWidth = _getScale2[2],
              newHeight = _getScale2[3];

          var scaleMatrix = getScaleMatrix(scaleX, scaleY);
          var resultMatrix = matrix.multiply(scaleMatrix);
          var deltaW = newWidth - boxWidth,
              deltaH = newHeight - boxHeight;
          var newX = x - deltaW * (doH ? 0.5 : revX ? 1 : 0),
              newY = y - deltaH * (doW ? 0.5 : revY ? 1 : 0);

          if (scalable) {
            el.setAttribute('transform', matrixToString(resultMatrix));
          }

          storage.cached = _objectSpread2(_objectSpread2({}, storage.cached), {}, {
            scaleX: scaleX,
            scaleY: scaleY,
            transformMatrix: scaleMatrix,
            resultMatrix: resultMatrix,
            dist: {
              dx: newDx,
              dy: newDy
            }
          });

          this._apply(E_RESIZE$2);

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
        value: function _processMove(dx, dy) {
          var storage = this.storage,
              _this$storage3 = this.storage,
              wrapper = _this$storage3.wrapper,
              center = _this$storage3.center,
              _this$storage3$transf = _this$storage3.transform,
              matrix = _this$storage3$transf.matrix,
              _this$storage3$transf2 = _this$storage3$transf.auxiliary.translate,
              translateMatrix = _this$storage3$transf2.translateMatrix,
              wrapperTranslateMatrix = _this$storage3$transf2.wrapperTranslateMatrix,
              wrapperMatrix = _this$storage3$transf.wrapperMatrix,
              parentMatrix = _this$storage3$transf.parentMatrix,
              _this$storage3$cached = _this$storage3.cached;
          _this$storage3$cached = _this$storage3$cached === void 0 ? {} : _this$storage3$cached;
          var _this$storage3$cached2 = _this$storage3$cached.dist;
          _this$storage3$cached2 = _this$storage3$cached2 === void 0 ? {} : _this$storage3$cached2;
          var _this$storage3$cached3 = _this$storage3$cached2.dx,
              nextDx = _this$storage3$cached3 === void 0 ? dx : _this$storage3$cached3,
              _this$storage3$cached4 = _this$storage3$cached2.dy,
              nextDy = _this$storage3$cached4 === void 0 ? dy : _this$storage3$cached4,
              restrict = this.options.restrict;
          parentMatrix.e = parentMatrix.f = 0;

          var _pointTo = pointTo(parentMatrix.inverse(), dx, dy),
              x = _pointTo.x,
              y = _pointTo.y;

          var preTranslateMatrix = createTranslateMatrix$1(x, y).multiply(matrix);

          var _ref7 = restrict ? this._restrictHandler(preTranslateMatrix) : {
            x: null,
            y: null
          },
              restX = _ref7.x,
              restY = _ref7.y;

          var newDx = restX !== null && restrict ? nextDx : dx;
          var newDy = restY !== null && restrict ? nextDy : dy;
          storage.cached.dist = {
            dx: newDx,
            dy: newDy
          };

          var _pointTo2 = pointTo(parentMatrix.inverse(), newDx, newDy),
              nx = _pointTo2.x,
              ny = _pointTo2.y;

          translateMatrix.e = nx;
          translateMatrix.f = ny;
          var moveElementMtrx = translateMatrix.multiply(matrix);
          wrapperTranslateMatrix.e = newDx;
          wrapperTranslateMatrix.f = newDy;
          var moveWrapperMtrx = wrapperTranslateMatrix.multiply(wrapperMatrix);
          wrapper.setAttribute('transform', matrixToString(moveWrapperMtrx));
          this.el.setAttribute('transform', matrixToString(moveElementMtrx));

          if (center.isShifted) {
            var centerTransformMatrix = wrapperMatrix.inverse();
            centerTransformMatrix.e = centerTransformMatrix.f = 0;

            var _pointTo3 = pointTo(centerTransformMatrix, newDx, newDy),
                cx = _pointTo3.x,
                cy = _pointTo3.y;

            this._moveCenterHandle(-cx, -cy);
          }

          return moveElementMtrx;
        }
      }, {
        key: "_processRotate",
        value: function _processRotate(radians) {
          var _this$storage4 = this.storage,
              wrapper = _this$storage4.wrapper,
              _this$storage4$transf = _this$storage4.transform,
              matrix = _this$storage4$transf.matrix,
              wrapperMatrix = _this$storage4$transf.wrapperMatrix,
              parentMatrix = _this$storage4$transf.parentMatrix,
              _this$storage4$transf2 = _this$storage4$transf.auxiliary.rotate,
              translateMatrix = _this$storage4$transf2.translateMatrix,
              wrapperTranslateMatrix = _this$storage4$transf2.wrapperTranslateMatrix,
              restrict = this.options.restrict;
          var cos = floatToFixed(Math.cos(radians)),
              sin = floatToFixed(Math.sin(radians));
          var rotateMatrix = createRotateMatrix$1(sin, cos);
          parentMatrix.e = parentMatrix.f = 0;
          var resRotMatrix = parentMatrix.inverse().multiply(rotateMatrix).multiply(parentMatrix);
          var resRotateMatrix = translateMatrix.multiply(resRotMatrix).multiply(translateMatrix.inverse());
          var resultMatrix = resRotateMatrix.multiply(matrix);

          var _ref8 = restrict ? this._restrictHandler(resultMatrix) : {
            x: null,
            y: null
          },
              restX = _ref8.x,
              restY = _ref8.y;

          if (isDef(restX) || isDef(restY)) return resultMatrix;
          var wrapperResultMatrix = wrapperTranslateMatrix.multiply(rotateMatrix).multiply(wrapperTranslateMatrix.inverse()).multiply(wrapperMatrix);
          wrapper.setAttribute('transform', matrixToString(wrapperResultMatrix));
          this.el.setAttribute('transform', matrixToString(resultMatrix));
          return resultMatrix;
        }
      }, {
        key: "_getState",
        value: function _getState(_ref9) {
          var revX = _ref9.revX,
              revY = _ref9.revY,
              doW = _ref9.doW,
              doH = _ref9.doH;
          var element = this.el,
              _this$storage5 = this.storage,
              wrapper = _this$storage5.wrapper,
              parent = _this$storage5.parent,
              cHandle = _this$storage5.handles.center,
              _this$options5 = this.options,
              container = _this$options5.container,
              restrict = _this$options5.restrict;
          var eBBox = element.getBBox();
          var elX = eBBox.x,
              elY = eBBox.y,
              elW = eBBox.width,
              elH = eBBox.height;
          var elMatrix = getTransformToElement(element, parent),
              ctm = getTransformToElement(element, container),
              boxCTM = getTransformToElement(wrapper, container),
              parentMatrix = getTransformToElement(parent, container),
              wrapperMatrix = getTransformToElement(wrapper, wrapper.parentNode);
          var parentMatrixInverted = parentMatrix.inverse();
          var scaleX = elX + elW * (doH ? 0.5 : revX ? 1 : 0),
              scaleY = elY + elH * (doW ? 0.5 : revY ? 1 : 0);
          var elCenterX = elX + elW / 2,
              elCenterY = elY + elH / 2;
          var centerX = cHandle ? cHandle.cx.baseVal.value : elCenterX;
          var centerY = cHandle ? cHandle.cy.baseVal.value : elCenterY; // c-handle's coordinates

          var _pointTo4 = pointTo(boxCTM, centerX, centerY),
              bcx = _pointTo4.x,
              bcy = _pointTo4.y; // element's center coordinates


          var _ref10 = cHandle ? pointTo(parentMatrixInverted, bcx, bcy) : pointTo(elMatrix, elCenterX, elCenterY),
              elcx = _ref10.x,
              elcy = _ref10.y; // box's center coordinates


          var _pointTo5 = pointTo(ctm, elCenterX, elCenterY),
              rcx = _pointTo5.x,
              rcy = _pointTo5.y;

          storeElementAttributes(this.el);
          checkChildElements(element).forEach(function (child) {
            child.__ctm__ = getTransformToElement(child, child.parentNode);
            storeElementAttributes(child);
          });

          var center = _objectSpread2(_objectSpread2({}, this.storage.center || {}), {}, {
            x: cHandle ? bcx : rcx,
            y: cHandle ? bcy : rcy,
            elX: elcx,
            elY: elcy,
            hx: cHandle ? cHandle.cx.baseVal.value : null,
            hy: cHandle ? cHandle.cy.baseVal.value : null
          });

          var containerMatrix = restrict ? getTransformToElement(restrict, restrict.parentNode) : getTransformToElement(container, container.parentNode);
          var transform = {
            auxiliary: {
              scale: {
                scaleMatrix: createSVGMatrix(),
                translateMatrix: createTranslateMatrix$1(scaleX, scaleY)
              },
              translate: {
                parentMatrix: parentMatrixInverted,
                translateMatrix: createSVGMatrix(),
                wrapperTranslateMatrix: createSVGMatrix()
              },
              rotate: {
                translateMatrix: createTranslateMatrix$1(center.elX, center.elY),
                wrapperTranslateMatrix: createTranslateMatrix$1(center.x, center.y)
              }
            },
            matrix: elMatrix,
            ctm: ctm,
            parentMatrix: parentMatrix,
            wrapperMatrix: wrapperMatrix,
            containerMatrix: containerMatrix,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
          };
          return {
            transform: transform,
            bBox: eBBox,
            center: center,
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          };
        }
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(dx, dy) {
          var _this$storage6 = this.storage,
              _this$storage6$handle = _this$storage6.handles,
              center = _this$storage6$handle.center,
              radius = _this$storage6$handle.radius,
              _this$storage6$center = _this$storage6.center,
              hx = _this$storage6$center.hx,
              hy = _this$storage6$center.hy;
          if (isUndef(center)) return;
          var mx = hx + dx,
              my = hy + dy;
          center.cx.baseVal.value = mx;
          center.cy.baseVal.value = my;
          radius.x2.baseVal.value = mx;
          radius.y2.baseVal.value = my;
          this.storage.center.isShifted = true;
        }
      }, {
        key: "resetCenterPoint",
        value: function resetCenterPoint() {
          var el = this.el,
              _this$storage7 = this.storage,
              _this$storage7$bBox = _this$storage7.bBox,
              boxWidth = _this$storage7$bBox.width,
              boxHeight = _this$storage7$bBox.height,
              boxLeft = _this$storage7$bBox.x,
              boxTop = _this$storage7$bBox.y,
              _this$storage7$handle = _this$storage7.handles,
              center = _this$storage7$handle.center,
              radius = _this$storage7$handle.radius;
          if (!center) return;
          var matrix = getTransformToElement(el, el.parentNode);

          var _pointTo6 = pointTo(matrix, boxLeft + boxWidth / 2, boxTop + boxHeight / 2),
              cx = _pointTo6.x,
              cy = _pointTo6.y;

          center.cx.baseVal.value = cx;
          center.cy.baseVal.value = cy;
          center.isShifted = false;
          radius.x2.baseVal.value = cx;
          radius.y2.baseVal.value = cy;
        }
      }, {
        key: "fitControlsToSize",
        value: function fitControlsToSize() {
          var el = this.el,
              wrapper = this.storage.wrapper,
              container = this.options.container;

          var _el$getBBox2 = el.getBBox(),
              width = _el$getBBox2.width,
              height = _el$getBBox2.height,
              x = _el$getBBox2.x,
              y = _el$getBBox2.y;

          var containerMatrix = getTransformToElement(el, container);
          var identityMatrix = createSVGMatrix();
          this.storage.transform.wrapperMatrix = identityMatrix;
          wrapper.setAttribute('transform', matrixToString(identityMatrix));
          applyTransformToHandles$1(this.storage, this.options, {
            x: x,
            y: y,
            width: width,
            height: height,
            boxMatrix: containerMatrix,
            element: el
          });
        }
      }, {
        key: "getBoundingRect",
        value: function getBoundingRect(transformMatrix) {
          var el = this.el,
              restrict = this.options.restrict,
              bBox = this.storage.bBox;
          return _getBoundingRect$1(el, getTransformToElement(el.parentNode, restrict).multiply(transformMatrix), bBox);
        }
      }, {
        key: "controls",
        get: function get() {
          return this.storage.wrapper;
        }
      }]);

      return DraggableSVG;
    }(Transformable);

    var applyTranslate = function applyTranslate(element, _ref11) {
      var x = _ref11.x,
          y = _ref11.y;
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
          boxH = _data$bBox.height;
      var attrs = [];

      switch (element.tagName.toLowerCase()) {
        case 'text':
        case 'tspan':
          {
            var _element$__data__ = element.__data__,
                x = _element$__data__.x,
                y = _element$__data__.y,
                textLength = _element$__data__.textLength;

            var _pointTo7 = pointTo(localCTM, x, y),
                resX = _pointTo7.x,
                resY = _pointTo7.y;

            attrs.push(['x', resX + (scaleX < 0 ? boxW : 0)], ['y', resY - (scaleY < 0 ? boxH : 0)], ['textLength', Math.abs(scaleX * textLength)]);
            break;
          }

        case 'circle':
          {
            var _element$__data__2 = element.__data__,
                r = _element$__data__2.r,
                cx = _element$__data__2.cx,
                cy = _element$__data__2.cy,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            var _pointTo8 = pointTo(localCTM, cx, cy),
                _resX3 = _pointTo8.x,
                _resY3 = _pointTo8.y;

            attrs.push(['r', newR], ['cx', _resX3], ['cy', _resY3]);
            break;
          }

        case 'foreignobject':
        case 'image':
        case 'rect':
          {
            var _element$__data__3 = element.__data__,
                width = _element$__data__3.width,
                height = _element$__data__3.height,
                _x = _element$__data__3.x,
                _y = _element$__data__3.y;

            var _pointTo9 = pointTo(localCTM, _x, _y),
                _resX4 = _pointTo9.x,
                _resY4 = _pointTo9.y;

            var newWidth = Math.abs(width * scaleX),
                newHeight = Math.abs(height * scaleY);
            attrs.push(['x', _resX4 - (scaleX < 0 ? newWidth : 0)], ['y', _resY4 - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
            break;
          }

        case 'ellipse':
          {
            var _element$__data__4 = element.__data__,
                rx = _element$__data__4.rx,
                ry = _element$__data__4.ry,
                _cx = _element$__data__4.cx,
                _cy = _element$__data__4.cy;

            var _pointTo10 = pointTo(localCTM, _cx, _cy),
                cx1 = _pointTo10.x,
                cy1 = _pointTo10.y;

            var scaleMatrix = createSVGMatrix();
            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;

            var _pointTo11 = pointTo(scaleMatrix, rx, ry),
                nRx = _pointTo11.x,
                nRy = _pointTo11.y;

            attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
            break;
          }

        case 'line':
          {
            var _element$__data__5 = element.__data__,
                resX1 = _element$__data__5.resX1,
                resY1 = _element$__data__5.resY1,
                resX2 = _element$__data__5.resX2,
                resY2 = _element$__data__5.resY2;

            var _pointTo12 = pointTo(localCTM, resX1, resY1),
                resX1_ = _pointTo12.x,
                resY1_ = _pointTo12.y;

            var _pointTo13 = pointTo(localCTM, resX2, resY2),
                resX2_ = _pointTo13.x,
                resY2_ = _pointTo13.y;

            attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
            break;
          }

        case 'polygon':
        case 'polyline':
          {
            var points = element.__data__.points;
            var result = parsePoints(points).map(function (item) {
              var _pointTo14 = pointTo(localCTM, Number(item[0]), Number(item[1])),
                  x = _pointTo14.x,
                  y = _pointTo14.y;

              item[0] = floatToFixed(x);
              item[1] = floatToFixed(y);
              return item.join(' ');
            }).join(' ');
            attrs.push(['points', result]);
            break;
          }

        case 'path':
          {
            var path = element.__data__.path;
            attrs.push(['d', resizePath({
              path: path,
              localCTM: localCTM
            })]);
            break;
          }
      }

      attrs.forEach(function (_ref12) {
        var _ref13 = _slicedToArray(_ref12, 2),
            key = _ref13[0],
            value = _ref13[1];

        element.setAttribute(key, value);
      });
    };

    var applyTransformToHandles$1 = function applyTransformToHandles(storage, options, data) {
      var rotatable = options.rotatable,
          rotatorAnchor = options.rotatorAnchor,
          rotatorOffset = options.rotatorOffset;
      var wrapper = storage.wrapper,
          handles = storage.handles,
          center = storage.center,
          _storage$transform = storage.transform;
      _storage$transform = _storage$transform === void 0 ? {} : _storage$transform;
      var _storage$transform$wr = _storage$transform.wrapperMatrix,
          wrapperMatrix = _storage$transform$wr === void 0 ? getTransformToElement(wrapper, wrapper.parentNode) : _storage$transform$wr;
      var boxMatrix = data.boxMatrix,
          element = data.element;

      var _element$getBBox = element.getBBox(),
          x = _element$getBBox.x,
          y = _element$getBBox.y,
          width = _element$getBBox.width,
          height = _element$getBBox.height;

      var hW = width / 2,
          hH = height / 2;
      var resultTransform = wrapperMatrix.inverse().multiply(boxMatrix);
      var boxCenter = pointTo(resultTransform, x + hW, y + hH);

      var vertices = _objectSpread2({
        tl: [x, y],
        tr: [x + width, y],
        mr: [x + width, y + hH],
        ml: [x, y + hH],
        tc: [x + hW, y],
        bc: [x + hW, y + height],
        br: [x + width, y + height],
        bl: [x, y + height]
      }, !center.isShifted && {
        center: [x + hW, y + hH]
      });

      var nextVertices = Object.entries(vertices).reduce(function (nextRes, _ref14) {
        var _ref15 = _slicedToArray(_ref14, 2),
            key = _ref15[0],
            vertex = _ref15[1];

        nextRes[key] = pointTo(resultTransform, vertex[0], vertex[1]);
        return nextRes;
      }, {});
      var resEdges = {
        te: [nextVertices.tl, nextVertices.tr],
        be: [nextVertices.bl, nextVertices.br],
        le: [nextVertices.tl, nextVertices.bl],
        re: [nextVertices.tr, nextVertices.br]
      };

      if (rotatable) {
        var anchor = {};
        var factor = 1;

        switch (rotatorAnchor) {
          case 'n':
            anchor.x = nextVertices.tc.x;
            anchor.y = nextVertices.tc.y;
            break;

          case 's':
            anchor.x = nextVertices.bc.x;
            anchor.y = nextVertices.bc.y;
            factor = -1;
            break;

          case 'w':
            anchor.x = nextVertices.ml.x;
            anchor.y = nextVertices.ml.y;
            factor = -1;
            break;

          case 'e':
          default:
            anchor.x = nextVertices.mr.x;
            anchor.y = nextVertices.mr.y;
            break;
        }

        var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(nextVertices.bl.y - nextVertices.tl.y, nextVertices.bl.x - nextVertices.tl.x) : Math.atan2(nextVertices.tl.y - nextVertices.tr.y, nextVertices.tl.x - nextVertices.tr.x);
        var nextRotatorOffset = rotatorOffset * factor;
        var rotator = {
          x: anchor.x - nextRotatorOffset * Math.cos(theta),
          y: anchor.y - nextRotatorOffset * Math.sin(theta)
        };
        var normal = handles.normal,
            radius = handles.radius;

        if (isDef(normal)) {
          normal.x1.baseVal.value = anchor.x;
          normal.y1.baseVal.value = anchor.y;
          normal.x2.baseVal.value = rotator.x;
          normal.y2.baseVal.value = rotator.y;
        }

        if (isDef(radius)) {
          radius.x1.baseVal.value = boxCenter.x;
          radius.y1.baseVal.value = boxCenter.y;

          if (!center.isShifted) {
            radius.x2.baseVal.value = boxCenter.x;
            radius.y2.baseVal.value = boxCenter.y;
          }
        }

        nextVertices.rotator = rotator;
      }

      Object.keys(resEdges).forEach(function (key) {
        var hdl = handles[key];

        var _resEdges$key = _slicedToArray(resEdges[key], 2),
            b = _resEdges$key[0],
            e = _resEdges$key[1];

        if (isUndef(b) || isUndef(hdl)) return;
        Object.entries({
          x1: b.x,
          y1: b.y,
          x2: e.x,
          y2: e.y
        }).map(function (_ref16) {
          var _ref17 = _slicedToArray(_ref16, 2),
              attr = _ref17[0],
              value = _ref17[1];

          return hdl.setAttribute(attr, value);
        });
      });
      Object.keys(nextVertices).forEach(function (key) {
        var hdl = handles[key];
        var attr = nextVertices[key];
        if (isUndef(attr) || isUndef(hdl)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
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
      Object.entries(attrs).forEach(function (_ref18) {
        var _ref19 = _slicedToArray(_ref18, 2),
            attr = _ref19[0],
            value = _ref19[1];

        return handler.setAttribute(attr, value);
      });
      return handler;
    };

    var setLineStyle = function setLineStyle(line, color) {
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-dasharray', '3 3');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
    };

    var storeElementAttributes = function storeElementAttributes(element) {
      switch (element.tagName.toLowerCase()) {
        case 'text':
          {
            var x = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
            var y = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
            var textLength = isDef(element.textLength.baseVal) ? element.textLength.baseVal.value : Number(element.getAttribute('textLength')) || null;
            element.__data__ = {
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
            element.__data__ = {
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
                _x2 = element.x.baseVal.value,
                _y2 = element.y.baseVal.value;
            element.__data__ = {
              width: width,
              height: height,
              x: _x2,
              y: _y2
            };
            break;
          }

        case 'ellipse':
          {
            var rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                _cx2 = element.cx.baseVal.value,
                _cy2 = element.cy.baseVal.value;
            element.__data__ = {
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
            element.__data__ = {
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
            element.__data__ = {
              points: points
            };
            break;
          }

        case 'path':
          {
            var path = element.getAttribute('d');
            element.__data__ = {
              path: path
            };
            break;
          }
      }
    };

    var renderLine$1 = function renderLine(_ref20, color, key) {
      var _ref21 = _slicedToArray(_ref20, 2),
          b = _ref21[0],
          e = _ref21[1];

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
      Object.entries(attrs).forEach(function (_ref22) {
        var _ref23 = _slicedToArray(_ref22, 2),
            attr = _ref23[0],
            value = _ref23[1];

        return handler.setAttribute(attr, value);
      });
      return handler;
    };

    var _getBoundingRect$1 = function _getBoundingRect(el, ctm) {
      var bBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : el.getBBox();
      var x = bBox.x,
          y = bBox.y,
          width = bBox.width,
          height = bBox.height;
      var vertices = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      return vertices.map(function (_ref24) {
        var _ref25 = _slicedToArray(_ref24, 2),
            l = _ref25[0],
            t = _ref25[1];

        var _pointTo15 = pointTo(ctm, l, t),
            nx = _pointTo15.x,
            ny = _pointTo15.y;

        return [nx, ny];
      });
    };

    function drag(options, obInstance) {
      if (this.length) {
        var Ob = isDef(obInstance) && obInstance instanceof Observable ? obInstance : new Observable();
        return arrReduce.call(this, function (result, item) {
          if (!(item instanceof SVGElement)) {
            result.push(new Draggable(item, options, Ob));
          } else {
            if (checkElement(item)) {
              result.push(new DraggableSVG(item, options, Ob));
            }
          }

          return result;
        }, []);
      }
    }

    var EMITTER_EVENTS$2 = EVENT_EMITTER_CONSTANTS.EMITTER_EVENTS;
    var E_MOUSEDOWN$4 = CLIENT_EVENTS_CONSTANTS.E_MOUSEDOWN,
        E_TOUCHSTART$4 = CLIENT_EVENTS_CONSTANTS.E_TOUCHSTART;

    var Cloneable = /*#__PURE__*/function (_SubjectModel) {
      _inherits(Cloneable, _SubjectModel);

      var _super = _createSuper(Cloneable);

      function Cloneable(el, options) {
        var _this;

        _classCallCheck(this, Cloneable);

        _this = _super.call(this, el);

        _this.enable(options);

        return _this;
      }

      _createClass(Cloneable, [{
        key: "_init",
        value: function _init() {
          var _this2 = this;

          var el = this.el,
              options = this.options;
          var $el = helper(el);
          var style = options.style,
              appendTo = options.appendTo;

          var css = _objectSpread2({
            position: 'absolute',
            'z-index': '2147483647'
          }, style);

          this.storage = {
            css: css,
            parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
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
              _onInit = function _onInit() {},
              _onMove = function _onMove() {},
              _onDrop = function _onDrop() {},
              _onDestroy = function _onDestroy() {};

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
              var clone = this.storage.clone;
              var result = objectsCollide(clone, dropZone);

              if (result) {
                onDrop.call(this, evt, this.el, clone);
              }
            } : function () {};
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
          var clientX = _ref.clientX,
              clientY = _ref.clientY;
          var storage = this.storage,
              el = this.el;
          var parent = storage.parent,
              css = storage.css;

          var _getOffset = getOffset(parent),
              left = _getOffset.left,
              top = _getOffset.top;

          css.left = "".concat(clientX - left, "px");
          css.top = "".concat(clientY - top, "px");
          var clone = el.cloneNode(true);
          helper(clone).css(css);
          storage.clientX = clientX;
          storage.clientY = clientY;
          storage.cx = clientX;
          storage.cy = clientY;
          storage.clone = clone;
          helper(parent)[0].appendChild(clone);

          this._draw();
        }
      }, {
        key: "_moving",
        value: function _moving(_ref2) {
          var clientX = _ref2.clientX,
              clientY = _ref2.clientY;
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
              cy = storage.cy;
          if (!doDraw) return;
          storage.doDraw = false;

          this._drag({
            dx: clientX - cx,
            dy: clientY - cy
          });
        }
      }, {
        key: "_processMove",
        value: function _processMove(dx, dy) {
          var clone = this.storage.clone;
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
              el = this.el;
          if (isUndef(storage)) return;
          helper(el).off(E_MOUSEDOWN$4, this._onMouseDown).off(E_TOUCHSTART$4, this._onTouchStart);
          proxyMethods.onDestroy.call(this, el);
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
        return arrMap.call(this, function (item) {
          return new Cloneable(item, options);
        });
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
