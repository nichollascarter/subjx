/*@license
* Drag/Rotate/Resize Library
* Released under the MIT license, 2018-2020
* Karen Sarksyan
* nichollascarter@gmail.com
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.subjx = factory());
}(this, (function () { 'use strict';

    function _typeof(obj) {
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
          ownKeys(source, true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(source).forEach(function (key) {
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

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      }
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
        return;
      }

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

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
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
    function isDef(val) {
      return val !== undefined && val !== null;
    }
    function isUndef(val) {
      return val === undefined || val === null;
    }
    function isFunc(val) {
      return typeof val === 'function';
    }
    function createMethod(fn) {
      return isFunc(fn) ? function () {
        fn.call.apply(fn, [this].concat(Array.prototype.slice.call(arguments)));
      } : function () {};
    }

    var Helper =
    /*#__PURE__*/
    function () {
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
          this.length = 0;

          for (var _count2 = 0; _count2 < this.length; _count2++) {
            if (params.nodeType === 1) {
              this[_count2] = params[_count2];
              this.length++;
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
      return isDef(obj) && _typeof(obj) === 'object' && (Array.isArray(obj) || isDef(window.Symbol) && typeof obj[window.Symbol.iterator] === 'function' || isDef(obj.forEach) || typeof obj.length === "number" && (obj.length === 0 || obj.length > 0 && obj.length - 1 in obj));
    }

    function helper(params) {
      return new Helper(params);
    }

    var Observable =
    /*#__PURE__*/
    function () {
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
              case 'onmove':
                observer.notifyMove(data);
                break;

              case 'onrotate':
                observer.notifyRotate(data);
                break;

              case 'onresize':
                observer.notifyResize(data);
                break;

              case 'onapply':
                observer.notifyApply(data);
                break;

              case 'ongetstate':
                observer.notifyGetState(data);
                break;
            }
          });
        }
      }]);

      return Observable;
    }();

    var Event =
    /*#__PURE__*/
    function () {
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

    var EventDispatcher =
    /*#__PURE__*/
    function () {
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

    var SubjectModel =
    /*#__PURE__*/
    function () {
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

          this._emitEvent('drag', finalArgs);
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

          helper(document).on('mousemove', this._onMouseMove).on('mouseup', this._onMouseUp);
        }
      }, {
        key: "_onTouchStart",
        value: function _onTouchStart(e) {
          this._start(e.touches[0]);

          helper(document).on('touchmove', this._onTouchMove).on('touchend', this._onTouchEnd);
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
          helper(document).off('mousemove', this._onMouseMove).off('mouseup', this._onMouseUp);

          this._end(e, this.el);
        }
      }, {
        key: "_onTouchEnd",
        value: function _onTouchEnd(e) {
          helper(document).off('touchmove', this._onTouchMove).off('touchend', this._onTouchEnd);

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

    function throwNotImplementedError() {
      throw Error("Method not implemented");
    }

    var EVENTS = ['dragStart', 'drag', 'dragEnd', 'resizeStart', 'resize', 'resizeEnd', 'rotateStart', 'rotate', 'rotateEnd', 'setPointStart', 'setPointEnd'];

    var RAD = Math.PI / 180;
    function snapToGrid(value, snap) {
      if (snap === 0) {
        return value;
      } else {
        var result = snapCandidate(value, snap);

        if (result - value < snap) {
          return result;
        }
      }
    }
    function snapCandidate(value, gridSize) {
      if (gridSize === 0) return value;
      return Math.round(value / gridSize) * gridSize;
    }
    function floatToFixed(val) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      return Number(val.toFixed(size));
    }

    function getOffset(node) {
      return node.getBoundingClientRect();
    }
    function getTransform(el) {
      var transform = el.css('-webkit-transform') || el.css('-moz-transform') || el.css('-ms-transform') || el.css('-o-transform') || el.css('transform') || 'none';
      return transform;
    }
    function parseMatrix(value) {
      var transform = value.match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);

      if (transform) {
        return transform.map(function (item) {
          return parseFloat(item);
        });
      } else {
        return [1, 0, 0, 1, 0, 0];
      }
    }
    function addClass(node, cls) {
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
    }
    function removeClass(node, cls) {
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
    }
    function objectsCollide(a, b) {
      var _getOffset = getOffset(a),
          aTop = _getOffset.top,
          aLeft = _getOffset.left,
          _getOffset2 = getOffset(b),
          bTop = _getOffset2.top,
          bLeft = _getOffset2.left,
          _a = helper(a),
          _b = helper(b);

      return !(aTop < bTop || aTop + parseFloat(_a.css('height')) > bTop + parseFloat(_b.css('height')) || aLeft < bLeft || aLeft + parseFloat(_a.css('width')) > bLeft + parseFloat(_b.css('width')));
    }
    function matrixToCSS(arr) {
      var style = "matrix(".concat(arr.join(), ")");
      return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
      };
    }

    var Transformable =
    /*#__PURE__*/
    function (_SubjectModel) {
      _inherits(Transformable, _SubjectModel);

      function Transformable(el, options, observable) {
        var _this;

        _classCallCheck(this, Transformable);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Transformable).call(this, el));

        if (_this.constructor === Transformable) {
          throw new TypeError('Cannot construct Transformable instances directly');
        }

        _this.observable = observable;
        EVENTS.forEach(function (eventName) {
          _this.eventDispatcher.registerEvent(eventName);
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

          this._emitEvent('rotate', finalArgs);
        }
      }, {
        key: "_resize",
        value: function _resize(_ref2) {
          var dx = _ref2.dx,
              dy = _ref2.dy,
              rest = _objectWithoutProperties(_ref2, ["dx", "dy"]);

          var finalValues = this._processResize(dx, dy);

          var finalArgs = _objectSpread2({}, finalValues, {
            dx: dx,
            dy: dy
          }, rest);

          this.proxyMethods.onResize.call(this, finalArgs);

          this._emitEvent('resize', finalArgs);
        }
      }, {
        key: "_processOptions",
        value: function _processOptions(options) {
          var el = this.el;
          addClass(el, 'sjx-drag');
          var _snap = {
            x: 10,
            y: 10,
            angle: 10 * RAD
          };
          var _each = {
            move: false,
            resize: false,
            rotate: false
          };

          var _restrict = null,
              _proportions = false,
              _axis = 'xy',
              _cursorMove = 'auto',
              _cursorResize = 'auto',
              _cursorRotate = 'auto',
              _themeColor = '#00a8ff',
              _rotationPoint = false,
              _draggable = true,
              _resizable = true,
              _rotatable = true,
              _onInit = function _onInit() {},
              _onMove = function _onMove() {},
              _onRotate = function _onRotate() {},
              _onResize = function _onResize() {},
              _onDrop = function _onDrop() {},
              _onDestroy = function _onDestroy() {};

          var _container = el.parentNode;

          if (isDef(options)) {
            var snap = options.snap,
                each = options.each,
                axis = options.axis,
                cursorMove = options.cursorMove,
                cursorResize = options.cursorResize,
                cursorRotate = options.cursorRotate,
                rotationPoint = options.rotationPoint,
                restrict = options.restrict,
                draggable = options.draggable,
                resizable = options.resizable,
                rotatable = options.rotatable,
                onInit = options.onInit,
                onDrop = options.onDrop,
                onMove = options.onMove,
                onResize = options.onResize,
                onRotate = options.onRotate,
                onDestroy = options.onDestroy,
                container = options.container,
                proportions = options.proportions,
                themeColor = options.themeColor;

            if (isDef(snap)) {
              var x = snap.x,
                  y = snap.y,
                  angle = snap.angle;
              _snap.x = isUndef(x) ? 10 : x;
              _snap.y = isUndef(y) ? 10 : y;
              _snap.angle = isUndef(angle) ? _snap.angle : angle * RAD;
            }

            if (isDef(each)) {
              var move = each.move,
                  resize = each.resize,
                  rotate = each.rotate;
              _each.move = move || false;
              _each.resize = resize || false;
              _each.rotate = rotate || false;
            }

            if (isDef(restrict)) {
              _restrict = restrict === 'parent' ? el.parentNode : helper(restrict)[0] || document;
            }

            _themeColor = themeColor || '#00a8ff';
            _cursorMove = cursorMove || 'auto';
            _cursorResize = cursorResize || 'auto';
            _cursorRotate = cursorRotate || 'auto';
            _axis = axis || 'xy';
            _container = isDef(container) && helper(container)[0] ? helper(container)[0] : _container;
            _rotationPoint = rotationPoint || false;
            _proportions = proportions || false;
            _draggable = isDef(draggable) ? draggable : true;
            _resizable = isDef(resizable) ? resizable : true;
            _rotatable = isDef(rotatable) ? rotatable : true;
            _onInit = createMethod(onInit);
            _onDrop = createMethod(onDrop);
            _onMove = createMethod(onMove);
            _onResize = createMethod(onResize);
            _onRotate = createMethod(onRotate);
            _onDestroy = createMethod(onDestroy);
          }

          this.options = {
            axis: _axis,
            themeColor: _themeColor,
            cursorMove: _cursorMove,
            cursorRotate: _cursorRotate,
            cursorResize: _cursorResize,
            rotationPoint: _rotationPoint,
            restrict: _restrict,
            container: _container,
            snap: _snap,
            each: _each,
            proportions: _proportions,
            draggable: _draggable,
            resizable: _resizable,
            rotatable: _rotatable
          };
          this.proxyMethods = {
            onInit: _onInit,
            onDrop: _onDrop,
            onMove: _onMove,
            onResize: _onResize,
            onRotate: _onRotate,
            onDestroy: _onDestroy
          };
          this.subscribe(_each);
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
              _options$each = options.each,
              moveEach = _options$each.move,
              resizeEach = _options$each.resize,
              rotateEach = _options$each.rotate,
              restrict = options.restrict,
              draggable = options.draggable,
              resizable = options.resizable,
              rotatable = options.rotatable;

          if (doResize && resizable) {
            var transform = storage.transform,
                cx = storage.cx,
                cy = storage.cy;

            var _this$_pointToElement = this._pointToElement({
              x: clientX,
              y: clientY
            }),
                x = _this$_pointToElement.x,
                y = _this$_pointToElement.y;

            var dx = dox ? snapToGrid(x - cx, snap.x / transform.scX) : 0;
            var dy = doy ? snapToGrid(y - cy, snap.y / transform.scY) : 0;
            dx = dox ? revX ? -dx : dx : 0, dy = doy ? revY ? -dy : dy : 0;
            var args = {
              dx: dx,
              dy: dy,
              clientX: clientX,
              clientY: clientY
            };

            self._resize(args);

            if (resizeEach) {
              observable.notify('onresize', self, args);
            }
          }

          if (doDrag && draggable) {
            var restrictOffset = storage.restrictOffset,
                elementOffset = storage.elementOffset,
                nx = storage.nx,
                ny = storage.ny;

            if (isDef(restrict)) {
              if (clientX - restrictOffset.left < nx - elementOffset.left) {
                clientX = nx - elementOffset.left + restrictOffset.left;
              }

              if (clientY - restrictOffset.top < ny - elementOffset.top) {
                clientY = ny - elementOffset.top + restrictOffset.top;
              }
            }

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
              observable.notify('onmove', self, _args);
            }
          }

          if (doRotate && rotatable) {
            var pressang = storage.pressang,
                center = storage.center;
            var radians = Math.atan2(clientY - center.y, clientX - center.x) - pressang;
            var _args2 = {
              clientX: clientX,
              clientY: clientY
            };

            self._rotate(_objectSpread2({
              radians: snapToGrid(radians, snap.angle)
            }, _args2));

            if (rotateEach) {
              observable.notify('onrotate', self, _objectSpread2({
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
          var observable = this.observable,
              storage = this.storage,
              _this$options = this.options,
              axis = _this$options.axis,
              restrict = _this$options.restrict,
              each = _this$options.each,
              el = this.el;

          var computed = this._compute(e);

          Object.keys(computed).forEach(function (prop) {
            storage[prop] = computed[prop];
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
          var handles = storage.handles;
          var rotator = handles.rotator,
              center = handles.center,
              radius = handles.radius;

          if (isDef(radius)) {
            removeClass(radius, 'sjx-hidden');
          }

          var doRotate = handle.is(rotator),
              doSetCenter = isDef(center) ? handle.is(center) : false;
          var doDrag = !(doRotate || doResize || doSetCenter);
          var clientX = e.clientX,
              clientY = e.clientY;

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
              nx = _this$_pointToElement2.x,
              ny = _this$_pointToElement2.y;

          var _this$_pointToControl2 = this._pointToControls({
            x: x,
            y: y
          }),
              bx = _this$_pointToControl2.x,
              by = _this$_pointToControl2.y;

          var newStorageValues = {
            clientX: clientX,
            clientY: clientY,
            nx: x,
            ny: y,
            cx: nx,
            cy: ny,
            bx: bx,
            by: by,
            doResize: doResize,
            doDrag: doDrag,
            doRotate: doRotate,
            doSetCenter: doSetCenter,
            onExecution: true,
            cursor: null,
            elementOffset: getOffset(el),
            restrictOffset: isDef(restrict) ? getOffset(restrict) : null,
            dox: /\x/.test(axis) && (doResize ? handle.is(handles.ml) || handle.is(handles.mr) || handle.is(handles.tl) || handle.is(handles.tr) || handle.is(handles.bl) || handle.is(handles.br) : true),
            doy: /\y/.test(axis) && (doResize ? handle.is(handles.br) || handle.is(handles.bl) || handle.is(handles.bc) || handle.is(handles.tr) || handle.is(handles.tl) || handle.is(handles.tc) : true)
          };
          this.storage = _objectSpread2({}, storage, {}, newStorageValues);
          var eventArgs = {
            clientX: clientX,
            clientY: clientY
          };

          if (doResize) {
            this._emitEvent('resizeStart', eventArgs);
          } else if (doRotate) {
            this._emitEvent('rotateStart', eventArgs);
          } else if (doDrag) {
            this._emitEvent('dragStart', eventArgs);
          }

          var move = each.move,
              resize = each.resize,
              rotate = each.rotate;
          var actionName = doResize ? 'resize' : doRotate ? 'rotate' : 'drag';
          var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
          observable.notify('ongetstate', this, {
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
          var storage = this.storage,
              options = this.options;

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
              proxyMethods = this.proxyMethods;
          var doResize = storage.doResize,
              doDrag = storage.doDrag,
              doRotate = storage.doRotate,
              frame = storage.frame,
              radius = storage.handles.radius;
          var actionName = doResize ? 'resize' : doDrag ? 'drag' : 'rotate';
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
            this._emitEvent('resizeEnd', eventArgs);
          } else if (doRotate) {
            this._emitEvent('rotateEnd', eventArgs);
          } else if (doDrag) {
            this._emitEvent('dragEnd', eventArgs);
          }

          var move = each.move,
              resize = each.resize,
              rotate = each.rotate;
          var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
          observable.notify('onapply', this, {
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
            addClass(radius, 'sjx-hidden');
          }
        }
      }, {
        key: "_compute",
        value: function _compute(e) {
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
          return _objectSpread2({}, _computed, {}, rest, {
            handle: handle,
            pressang: pressang
          });
        }
      }, {
        key: "_checkHandles",
        value: function _checkHandles(handle, handles) {
          var tl = handles.tl,
              tc = handles.tc,
              tr = handles.tr,
              bl = handles.bl,
              br = handles.br,
              bc = handles.bc,
              ml = handles.ml,
              mr = handles.mr;
          var isTL = isDef(tl) ? handle.is(tl) : false,
              isTC = isDef(tc) ? handle.is(tc) : false,
              isTR = isDef(tr) ? handle.is(tr) : false,
              isBL = isDef(bl) ? handle.is(bl) : false,
              isBC = isDef(bc) ? handle.is(bc) : false,
              isBR = isDef(br) ? handle.is(br) : false,
              isML = isDef(ml) ? handle.is(ml) : false,
              isMR = isDef(mr) ? handle.is(mr) : false; //reverse axis

          var revX = isTL || isML || isBL || isTC,
              revY = isTL || isTR || isTC || isML;
          var onTopEdge = isTC || isTR || isTL,
              onLeftEdge = isTL || isML || isBL,
              onRightEdge = isTR || isMR || isBR,
              onBottomEdge = isBR || isBC || isBL;
          var doW = isML || isMR,
              doH = isTC || isBC;
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

            this.storage = _objectSpread2({}, this.storage, {}, recalc);

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
            ob.subscribe('ongetstate', this).subscribe('onapply', this);
          }

          if (move) {
            ob.subscribe('onmove', this);
          }

          if (resize) {
            ob.subscribe('onresize', this);
          }

          if (rotate) {
            ob.subscribe('onrotate', this);
          }
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe() {
          var ob = this.observable;
          ob.unsubscribe('ongetstate', this).unsubscribe('onapply', this).unsubscribe('onmove', this).unsubscribe('onresize', this).unsubscribe('onrotate', this);
        }
      }, {
        key: "disable",
        value: function disable() {
          var storage = this.storage,
              proxyMethods = this.proxyMethods,
              el = this.el;
          if (isUndef(storage)) return; // unexpected case

          if (storage.onExecution) {
            this._end();

            helper(document).off('mousemove', this._onMouseMove).off('mouseup', this._onMouseUp).off('touchmove', this._onTouchMove).off('touchend', this._onTouchEnd);
          }

          removeClass(el, 'sjx-drag');

          this._destroy();

          this.unsubscribe();
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
          this.storage = _objectSpread2({}, this.storage, {}, this._getState({
            revX: false,
            revY: false,
            doW: false,
            doH: false
          }));

          this._drag({
            dx: dx,
            dy: dy
          });

          this._apply('drag');
        }
      }, {
        key: "exeResize",
        value: function exeResize(_ref9) {
          var dx = _ref9.dx,
              dy = _ref9.dy,
              revX = _ref9.revX,
              revY = _ref9.revY,
              doW = _ref9.doW,
              doH = _ref9.doH;
          var resizable = this.options.resizable;
          if (!resizable) return;
          this.storage = _objectSpread2({}, this.storage, {}, this._getState({
            revX: revX || false,
            revY: revY || false,
            doW: doW || false,
            doH: doH || false
          }));

          this._resize({
            dx: dx,
            dy: dy
          });

          this._apply('resize');
        }
      }, {
        key: "exeRotate",
        value: function exeRotate(_ref10) {
          var delta = _ref10.delta;
          var rotatable = this.options.rotatable;
          if (!rotatable) return;
          this.storage = _objectSpread2({}, this.storage, {}, this._getState({
            revX: false,
            revY: false,
            doW: false,
            doH: false
          }));

          this._rotate({
            radians: delta
          });

          this._apply('rotate');
        }
      }]);

      return Transformable;
    }(SubjectModel);

    function matrixTransform(_ref, matrix) {
      var x = _ref.x,
          y = _ref.y;

      var _matrix = _slicedToArray(matrix, 6),
          a = _matrix[0],
          b = _matrix[1],
          c = _matrix[2],
          d = _matrix[3],
          e = _matrix[4],
          f = _matrix[5];

      return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
      };
    } //http://blog.acipo.com/matrix-inversion-in-javascript/

    function matrixInvert(ctm) {
      // I use Guassian Elimination to calculate the inverse:
      // (1) 'augment' the matrix (left) by the identity (on the right)
      // (2) Turn the matrix on the left into the identity by elemetry row ops
      // (3) The matrix on the right is the inverse (was the identity matrix)
      // There are 3 elemtary row ops: (I combine b and c in my code)
      // (a) Swap 2 rows
      // (b) Multiply a row by a scalar
      // (c) Add 2 rows
      var M = [[ctm[0], ctm[2], ctm[4]], [ctm[1], ctm[3], ctm[5]], [0, 0, 1]]; //if the matrix isn't square: exit (error)

      if (M.length !== M[0].length) {
        return;
      } //create the identity matrix (I), and a copy (C) of the original


      var dim = M.length;
      var I = [],
          C = [];

      for (var i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];

        for (var j = 0; j < dim; j += 1) {
          //if we're on the diagonal, put a 1 (for identity)
          if (i == j) {
            I[i][j] = 1;
          } else {
            I[i][j] = 0;
          } // Also, make the copy of the original


          C[i][j] = M[i][j];
        }
      } // Perform elementary row operations


      for (var _i = 0; _i < dim; _i += 1) {
        // get the element e on the diagonal
        var e = C[_i][_i]; // if we have a 0 on the diagonal (we'll need to swap with a lower row)

        if (e === 0) {
          //look through every row below the i'th row
          for (var ii = _i + 1; ii < dim; ii += 1) {
            //if the ii'th row has a non-0 in the i'th col
            if (C[ii][_i] !== 0) {
              //it would make the diagonal have a non-0 so swap it
              for (var _j = 0; _j < dim; _j++) {
                e = C[_i][_j]; //temp store i'th row

                C[_i][_j] = C[ii][_j]; //replace i'th row by ii'th

                C[ii][_j] = e; //repace ii'th by temp

                e = I[_i][_j]; //temp store i'th row

                I[_i][_j] = I[ii][_j]; //replace i'th row by ii'th

                I[ii][_j] = e; //repace ii'th by temp
              } //don't bother checking other rows since we've swapped


              break;
            }
          } //get the new diagonal


          e = C[_i][_i]; //if it's still 0, not invertable (error)

          if (e === 0) {
            return;
          }
        } // Scale this row down by e (so we have a 1 on the diagonal)


        for (var _j2 = 0; _j2 < dim; _j2++) {
          C[_i][_j2] = C[_i][_j2] / e; //apply to original matrix

          I[_i][_j2] = I[_i][_j2] / e; //apply to identity
        } // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one


        for (var _ii = 0; _ii < dim; _ii++) {
          // Only apply to other rows (we want a 1 on the diagonal)
          if (_ii == _i) {
            continue;
          } // We want to change this element to 0


          e = C[_ii][_i]; // Subtract (the row above(or below) scaled by e) from (the
          // current row) but start at the i'th column and assume all the
          // stuff left of diagonal is 0 (which it should be if we made this
          // algorithm correctly)

          for (var _j3 = 0; _j3 < dim; _j3++) {
            C[_ii][_j3] -= e * C[_i][_j3]; //apply to original matrix

            I[_ii][_j3] -= e * I[_i][_j3]; //apply to identity
          }
        }
      } //we've done all operations, C should be the identity
      //matrix I should be the inverse:


      return [I[0][0], I[1][0], I[0][1], I[1][1], I[0][2], I[1][2]];
    }
    function multiplyMatrix(_ref2, _ref3) {
      var _ref4 = _slicedToArray(_ref2, 6),
          a1 = _ref4[0],
          b1 = _ref4[1],
          c1 = _ref4[2],
          d1 = _ref4[3],
          e1 = _ref4[4],
          f1 = _ref4[5];

      var _ref5 = _slicedToArray(_ref3, 6),
          a2 = _ref5[0],
          b2 = _ref5[1],
          c2 = _ref5[2],
          d2 = _ref5[3],
          e2 = _ref5[4],
          f2 = _ref5[5];

      var m1 = [[a1, c1, e1], [b1, d1, f1], [0, 0, 1]];
      var m2 = [[a2, c2, e2], [b2, d2, f2], [0, 0, 1]];
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

      return [result[0][0], result[1][0], result[0][1], result[1][1], result[0][2], result[1][2]];
    }
    function rotatedTopLeft(x, y, width, height, rotationAngle, revX, revY, doW, doH) {
      var hw = parseFloat(width) / 2,
          hh = parseFloat(height) / 2;
      var cx = x + hw,
          cy = y + hh;
      var dx = x - cx,
          dy = y - cy;
      var originalTopLeftAngle = Math.atan2(doW ? 0 : dy, doH ? 0 : dx);
      var rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;
      var radius = Math.sqrt(Math.pow(doH ? 0 : hw, 2) + Math.pow(doW ? 0 : hh, 2));
      var cos = Math.cos(rotatedTopLeftAngle),
          sin = Math.sin(rotatedTopLeftAngle);
      cos = revX === true ? -cos : cos;
      sin = revY === true ? -sin : sin;
      var rx = cx + radius * cos,
          ry = cy + radius * sin;
      return {
        left: floatToFixed(rx),
        top: floatToFixed(ry)
      };
    }

    var MIN_SIZE = 2;
    var CENTER_DELTA = 7;

    var Draggable =
    /*#__PURE__*/
    function (_Transformable) {
      _inherits(Draggable, _Transformable);

      function Draggable() {
        _classCallCheck(this, Draggable);

        return _possibleConstructorReturn(this, _getPrototypeOf(Draggable).apply(this, arguments));
      }

      _createClass(Draggable, [{
        key: "_init",
        value: function _init(el) {
          var _this$options = this.options,
              rotationPoint = _this$options.rotationPoint,
              container = _this$options.container,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable;
          var _el$style = el.style,
              left = _el$style.left,
              top = _el$style.top,
              width = _el$style.width,
              height = _el$style.height;
          var wrapper = document.createElement('div');
          addClass(wrapper, 'sjx-wrapper');
          container.appendChild(wrapper);
          var $el = helper(el);
          var w = width || $el.css('width'),
              h = height || $el.css('height'),
              t = top || $el.css('top'),
              l = left || $el.css('left');
          var css = {
            top: t,
            left: l,
            width: w,
            height: h,
            transform: getTransform($el)
          };
          var controls = document.createElement('div');
          addClass(controls, 'sjx-controls');
          var resizingHandles = {
            tl: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-l', 'sjx-hdl-tl'],
            tr: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-r', 'sjx-hdl-tr'],
            br: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-r', 'sjx-hdl-br'],
            bl: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-l', 'sjx-hdl-bl'],
            tc: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-c', 'sjx-hdl-tc'],
            bc: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-c', 'sjx-hdl-bc'],
            ml: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-l', 'sjx-hdl-ml'],
            mr: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-r', 'sjx-hdl-mr']
          };
          var rotationHandles = {
            normal: ['sjx-normal'],
            rotator: ['sjx-hdl', 'sjx-hdl-m', 'sjx-rotator']
          };

          var handles = _objectSpread2({}, rotatable && rotationHandles, {}, resizable && resizingHandles, {
            center: rotationPoint && rotatable ? ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc'] : undefined
          });

          Object.keys(handles).forEach(function (key) {
            var data = handles[key];
            if (isUndef(data)) return;
            var handler = createHandler(data);
            handles[key] = handler;
            controls.appendChild(handler);
          });

          if (isDef(handles.center)) {
            var cHandle = helper(handles.center);
            cHandle.css({
              left: "".concat(el.getAttribute('data-cx'), "px"),
              top: "".concat(el.getAttribute('data-cy'), "px")
            });
          }

          wrapper.appendChild(controls);
          var $controls = helper(controls);
          $controls.css(css);
          this.storage = {
            controls: controls,
            handles: handles,
            radius: undefined,
            parent: el.parentNode
          };
          $controls.on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          var controls = this.storage.controls;
          helper(controls).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
          var wrapper = controls.parentNode;
          wrapper.parentNode.removeChild(wrapper);
        }
      }, {
        key: "_pointToElement",
        value: function _pointToElement(_ref) {
          var x = _ref.x,
              y = _ref.y;
          var transform = this.storage.transform;

          var ctm = _toConsumableArray(transform.matrix);

          ctm[4] = ctm[5] = 0;
          return this._applyMatrixToPoint(matrixInvert(ctm), x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(data) {
          return this._pointToElement(data);
        }
      }, {
        key: "_applyMatrixToPoint",
        value: function _applyMatrixToPoint(matrix, x, y) {
          return matrixTransform({
            x: x,
            y: y
          }, matrix);
        }
      }, {
        key: "_cursorPoint",
        value: function _cursorPoint(_ref2) {
          var clientX = _ref2.clientX,
              clientY = _ref2.clientY;
          var container = this.options.container;
          var globalMatrix = parseMatrix(getTransform(helper(container)));
          return matrixTransform({
            x: clientX,
            y: clientY
          }, matrixInvert(globalMatrix));
        }
      }, {
        key: "_apply",
        value: function _apply() {
          var el = this.el,
              storage = this.storage;
          var controls = storage.controls,
              handles = storage.handles;
          var $controls = helper(controls);
          var cw = parseFloat($controls.css('width')),
              ch = parseFloat($controls.css('height'));
          var hW = cw / 2,
              hH = ch / 2;
          var cHandle = handles.center;
          var isDefCenter = isDef(cHandle);
          var centerX = isDefCenter ? parseFloat(helper(cHandle).css('left')) : hW;
          var centerY = isDefCenter ? parseFloat(helper(cHandle).css('top')) : hH;
          el.setAttribute('data-cx', centerX);
          el.setAttribute('data-cy', centerY); // if (isUndef(cached)) return;
          // const $el = helper(el);
          // const { dx, dy } = cached;
          // const css = matrixToCSS(transform.matrix);
          // const left = parseFloat(
          //     el.style.left || $el.css('left')
          // );
          // const top = parseFloat(
          //     el.style.top || $el.css('top')
          // );
          // css.left = `${left + dx}px`;
          // css.top = `${top + dy}px`;
          // $el.css(css);
          // $controls.css(css);

          this.storage.cached = null;
        }
      }, {
        key: "_processResize",
        value: function _processResize(dx, dy) {
          var el = this.el,
              storage = this.storage,
              proportions = this.options.proportions;
          var controls = storage.controls,
              coords = storage.coords,
              cw = storage.cw,
              ch = storage.ch,
              transform = storage.transform,
              refang = storage.refang,
              revX = storage.revX,
              revY = storage.revY,
              doW = storage.doW,
              doH = storage.doH;
          var ratio = doW || !doW && !doH ? (cw + dx) / cw : (ch + dy) / ch;
          var newWidth = proportions ? cw * ratio : cw + dx,
              newHeight = proportions ? ch * ratio : ch + dy;
          if (newWidth < MIN_SIZE || newHeight < MIN_SIZE) return;

          var matrix = _toConsumableArray(transform.matrix);

          var newCoords = rotatedTopLeft(matrix[4], matrix[5], newWidth, newHeight, refang, revX, revY, doW, doH);
          var nx = coords.left - newCoords.left,
              ny = coords.top - newCoords.top;
          matrix[4] += nx;
          matrix[5] += ny;
          var css = matrixToCSS(matrix);
          css.width = "".concat(newWidth, "px");
          css.height = "".concat(newHeight, "px");
          helper(controls).css(css);
          helper(el).css(css);
          storage.cached = {
            dx: nx,
            dy: ny
          };
          return {
            width: newWidth,
            height: newHeight,
            ox: nx,
            oy: ny
          };
        }
      }, {
        key: "_processMove",
        value: function _processMove(dx, dy) {
          var el = this.el,
              storage = this.storage;
          var controls = storage.controls,
              _storage$transform = storage.transform,
              matrix = _storage$transform.matrix,
              parentMatrix = _storage$transform.parentMatrix;

          var pctm = _toConsumableArray(parentMatrix);

          pctm[4] = pctm[5] = 0;

          var nMatrix = _toConsumableArray(matrix);

          nMatrix[4] = matrix[4] + dx;
          nMatrix[5] = matrix[5] + dy;
          var css = matrixToCSS(nMatrix);
          helper(controls).css(css);
          helper(el).css(css);
          storage.cached = {
            dx: dx,
            dy: dy
          };
          return nMatrix;
        }
      }, {
        key: "_processRotate",
        value: function _processRotate(radians) {
          var el = this.el,
              _this$storage = this.storage,
              controls = _this$storage.controls,
              transform = _this$storage.transform,
              center = _this$storage.center;
          var matrix = transform.matrix,
              parentMatrix = transform.parentMatrix;
          var cos = floatToFixed(Math.cos(radians), 4),
              sin = floatToFixed(Math.sin(radians), 4);
          var translateMatrix = [1, 0, 0, 1, center.cx, center.cy];
          var rotMatrix = [cos, sin, -sin, cos, 0, 0];

          var pctm = _toConsumableArray(parentMatrix);

          pctm[4] = pctm[5] = 0;
          var resRotMatrix = multiplyMatrix(matrixInvert(pctm), multiplyMatrix(rotMatrix, pctm));
          var nMatrix = multiplyMatrix(multiplyMatrix(translateMatrix, resRotMatrix), matrixInvert(translateMatrix));
          var resMatrix = multiplyMatrix(nMatrix, matrix);
          var css = matrixToCSS(resMatrix);
          helper(controls).css(css);
          helper(el).css(css);
          return resMatrix;
        }
      }, {
        key: "_getState",
        value: function _getState(params) {
          var revX = params.revX,
              revY = params.revY,
              doW = params.doW,
              doH = params.doH;
          var factor = revX !== revY ? -1 : 1;
          var el = this.el,
              _this$storage2 = this.storage,
              handles = _this$storage2.handles,
              controls = _this$storage2.controls,
              parent = _this$storage2.parent,
              container = this.options.container;
          var cHandle = handles.center;
          var $controls = helper(controls);
          var containerMatrix = parseMatrix(getTransform(helper(container)));
          var matrix = parseMatrix(getTransform(helper(controls)));
          var pMatrix = parseMatrix(getTransform(helper(parent)));
          var refang = Math.atan2(matrix[1], matrix[0]) * factor;
          var parentMatrix = parent !== container ? multiplyMatrix(pMatrix, containerMatrix) : containerMatrix;
          var transform = {
            matrix: matrix,
            parentMatrix: parentMatrix,
            scX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
            scY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3])
          };
          var cw = parseFloat($controls.css('width')),
              ch = parseFloat($controls.css('height')); // getting current coordinates considering rotation angle                                                                                                  

          var coords = rotatedTopLeft(matrix[4], matrix[5], cw, ch, refang, revX, revY, doW, doH);
          var hW = cw / 2,
              hH = ch / 2;
          var offset_ = getOffset(el),
              isDefCenter = isDef(cHandle);
          var centerX = isDefCenter ? parseFloat(helper(cHandle).css('left')) : hW;
          var centerY = isDefCenter ? parseFloat(helper(cHandle).css('top')) : hH;
          var cDelta = isDefCenter ? CENTER_DELTA : 0;

          var _matrixTransform = matrixTransform({
            x: offset_.left,
            y: offset_.top
          }, matrixInvert(parentMatrix)),
              el_x = _matrixTransform.x,
              el_y = _matrixTransform.y;

          return {
            transform: transform,
            cw: cw,
            ch: ch,
            coords: coords,
            center: {
              x: el_x + centerX - cDelta,
              y: el_y + centerY - cDelta,
              cx: -centerX + hW - cDelta,
              cy: -centerY + hH - cDelta,
              hx: centerX,
              hy: centerY
            },
            factor: factor,
            refang: refang,
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          };
        }
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(x, y) {
          var _this$storage3 = this.storage,
              center = _this$storage3.handles.center,
              _this$storage3$center = _this$storage3.center,
              hx = _this$storage3$center.hx,
              hy = _this$storage3$center.hy;
          var left = "".concat(hx + x, "px"),
              top = "".concat(hy + y, "px");
          helper(center).css({
            left: left,
            top: top
          });
        }
      }, {
        key: "resetCenterPoint",
        value: function resetCenterPoint() {
          var center = this.storage.handles.center;
          helper(center).css({
            left: null,
            top: null
          });
        }
      }, {
        key: "fitControlsToSize",
        value: function fitControlsToSize() {}
      }, {
        key: "controls",
        get: function get() {
          return this.storage.controls;
        }
      }]);

      return Draggable;
    }(Transformable);

    function createHandler(classList) {
      var element = document.createElement('div');
      classList.forEach(function (cls) {
        addClass(element, cls);
      });
      return element;
    }

    var svgPoint = createSVGElement('svg').createSVGPoint();
    var floatRE = /[+-]?\d+(\.\d+)?/g;
    var ALLOWED_ELEMENTS = ['circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'g'];
    function checkChildElements(element) {
      var arrOfElements = [];

      if (isGroup(element)) {
        forEach.call(element.childNodes, function (item) {
          if (item.nodeType === 1) {
            var tagName = item.tagName.toLowerCase();

            if (ALLOWED_ELEMENTS.indexOf(tagName) !== -1) {
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
    }
    function createSVGElement(name) {
      return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function createSVGMatrix() {
      return createSVGElement('svg').createSVGMatrix();
    }
    function getTransformToElement(toElement, g) {
      var gTransform = g.getScreenCTM() || createSVGMatrix();
      return gTransform.inverse().multiply(toElement.getScreenCTM() || createSVGMatrix());
    }
    function matrixToString(m) {
      var a = m.a,
          b = m.b,
          c = m.c,
          d = m.d,
          e = m.e,
          f = m.f;
      return "matrix(".concat(a, ",").concat(b, ",").concat(c, ",").concat(d, ",").concat(e, ",").concat(f, ")");
    }
    function pointTo(ctm, x, y) {
      svgPoint.x = x;
      svgPoint.y = y;
      return svgPoint.matrixTransform(ctm);
    }
    function cloneMatrix(b) {
      var a = createSVGMatrix();
      a.a = b.a;
      a.b = b.b;
      a.c = b.c;
      a.d = b.d;
      a.e = b.e;
      a.f = b.f;
      return a;
    }
    function checkElement(el) {
      var tagName = el.tagName.toLowerCase();

      if (ALLOWED_ELEMENTS.indexOf(tagName) === -1) {
        warn('Selected element is not allowed to transform. Allowed elements:\n' + 'circle, ellipse, image, line, path, polygon, polyline, rect, text, g');
        return false;
      } else {
        return true;
      }
    }
    function isIdentity(matrix) {
      var a = matrix.a,
          b = matrix.b,
          c = matrix.c,
          d = matrix.d,
          e = matrix.e,
          f = matrix.f;
      return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0;
    }
    function createPoint(svg, x, y) {
      if (isUndef(x) || isUndef(y)) {
        return null;
      }

      var pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      return pt;
    }
    function isGroup(element) {
      return element.tagName.toLowerCase() === 'g';
    }
    function parsePoints(pts) {
      return pts.match(floatRE).reduce(function (result, value, index, array) {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }

        return result;
      }, []);
    }

    var dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
    var sepRE = /\s*,\s*|\s+/g;

    function parsePath(path) {
      var match = dRE.lastIndex = 0;
      var serialized = [];

      while (match = dRE.exec(path)) {
        var cmd = match[1];
        var upCmd = cmd.toUpperCase(); // normalize the data

        var data = match[2].replace(/([^e])-/g, '$1 -').replace(/ +/g, ' ');
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
    }

    function movePath(params) {
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
    }
    function resizePath(params) {
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

                  var mtrx = cloneMatrix(localCTM);

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

                  var _mtrx = cloneMatrix(localCTM);

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

                  var _mtrx2 = cloneMatrix(localCTM);

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

                  var _mtrx3 = cloneMatrix(localCTM);

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

                  var _mtrx4 = cloneMatrix(localCTM);

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

                  var _mtrx5 = cloneMatrix(localCTM);

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

                  var _mtrx6 = cloneMatrix(localCTM);

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

                  var _mtrx7 = cloneMatrix(localCTM);

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
    }

    var MIN_SIZE$1 = 5;
    var ROT_OFFSET = 50;

    var DraggableSVG =
    /*#__PURE__*/
    function (_Transformable) {
      _inherits(DraggableSVG, _Transformable);

      function DraggableSVG() {
        _classCallCheck(this, DraggableSVG);

        return _possibleConstructorReturn(this, _getPrototypeOf(DraggableSVG).apply(this, arguments));
      }

      _createClass(DraggableSVG, [{
        key: "_init",
        value: function _init(el) {
          var _this$options = this.options,
              rotationPoint = _this$options.rotationPoint,
              container = _this$options.container,
              themeColor = _this$options.themeColor,
              resizable = _this$options.resizable,
              rotatable = _this$options.rotatable;
          var wrapper = createSVGElement('g');
          addClass(wrapper, 'sjx-svg-wrapper');
          container.appendChild(wrapper);

          var _el$getBBox = el.getBBox(),
              cw = _el$getBBox.width,
              ch = _el$getBBox.height,
              cx = _el$getBBox.x,
              cy = _el$getBBox.y;

          var elCTM = getTransformToElement(el, container);
          var box = createSVGElement('rect');
          var attrs = [['width', cw], ['height', ch], ['x', cx], ['y', cy], ['fill', themeColor], ['fill-opacity', 0.1], ['stroke', themeColor], ['stroke-dasharray', '3 3'], ['vector-effect', 'non-scaling-stroke'], ['transform', matrixToString(elCTM)]];
          attrs.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            box.setAttribute(key, value);
          });
          var handlesGroup = createSVGElement('g'),
              normalLineGroup = createSVGElement('g'),
              group = createSVGElement('g');
          addClass(group, 'sjx-svg-box-group');
          addClass(handlesGroup, 'sjx-svg-handles');
          addClass(normalLineGroup, 'sjx-svg-normal-group');
          group.appendChild(box);
          wrapper.appendChild(group);
          wrapper.appendChild(normalLineGroup);
          wrapper.appendChild(handlesGroup);

          var _box$getBBox = box.getBBox(),
              bX = _box$getBBox.x,
              bY = _box$getBBox.y,
              bW = _box$getBBox.width,
              bH = _box$getBBox.height;

          var centerX = el.getAttribute('data-cx'),
              centerY = el.getAttribute('data-cy');
          var boxCTM = getTransformToElement(box, box.parentNode),
              boxCenter = pointTo(boxCTM, bX + bW / 2, bY + bH / 2),
              boxTL = pointTo(boxCTM, bX, bY),
              boxTR = pointTo(boxCTM, bX + bW, bY),
              boxMR = pointTo(boxCTM, bX + bW, bY + bH / 2);
          var resizingHandles = {
            tl: boxTL,
            tr: boxTR,
            br: pointTo(boxCTM, bX + bW, bY + bH),
            bl: pointTo(boxCTM, bX, bY + bH),
            tc: pointTo(boxCTM, bX + bW / 2, bY),
            bc: pointTo(boxCTM, bX + bW / 2, bY + bH),
            ml: pointTo(boxCTM, bX, bY + bH / 2),
            mr: boxMR
          };
          var rotationHandles = {},
              rotator = null;

          if (rotatable) {
            var theta = Math.atan2(boxTL.y - boxTR.y, boxTL.x - boxTR.x);
            rotator = {
              x: boxMR.x - ROT_OFFSET * Math.cos(theta),
              y: boxMR.y - ROT_OFFSET * Math.sin(theta)
            };
            var normalLine = createSVGElement('line');
            normalLine.x1.baseVal.value = boxMR.x;
            normalLine.y1.baseVal.value = boxMR.y;
            normalLine.x2.baseVal.value = rotator.x;
            normalLine.y2.baseVal.value = rotator.y;
            setLineStyle(normalLine, themeColor);
            normalLineGroup.appendChild(normalLine);
            var radius = null;

            if (rotationPoint) {
              radius = createSVGElement('line');
              addClass(radius, 'sjx-hidden');
              radius.x1.baseVal.value = boxCenter.x;
              radius.y1.baseVal.value = boxCenter.y;
              radius.x2.baseVal.value = centerX || boxCenter.x;
              radius.y2.baseVal.value = centerY || boxCenter.y;
              setLineStyle(radius, '#fe3232');
              radius.setAttribute('opacity', 0.5);
              normalLineGroup.appendChild(radius);
            }

            rotationHandles = {
              normal: normalLine,
              radius: radius
            };
          }

          var handles = _objectSpread2({}, resizable && resizingHandles, {
            rotator: rotator,
            center: rotationPoint && rotatable ? createPoint(container, centerX, centerY) || boxCenter : undefined
          });

          Object.keys(handles).forEach(function (key) {
            var data = handles[key];
            if (isUndef(data)) return;
            var x = data.x,
                y = data.y;
            var color = key === 'center' ? '#fe3232' : themeColor;
            handles[key] = createHandler$1(x, y, color, key);
            handlesGroup.appendChild(handles[key]);
          });
          this.storage = {
            wrapper: wrapper,
            box: box,
            handles: _objectSpread2({}, handles, {}, rotationHandles),
            parent: el.parentNode,
            center: {}
          };
          helper(wrapper).on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          var wrapper = this.storage.wrapper;
          helper(wrapper).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
          wrapper.parentNode.removeChild(wrapper);
        }
      }, {
        key: "_cursorPoint",
        value: function _cursorPoint(_ref3) {
          var clientX = _ref3.clientX,
              clientY = _ref3.clientY;
          var container = this.options.container;
          return pointTo(container.getScreenCTM().inverse(), clientX, clientY);
        }
      }, {
        key: "_pointToElement",
        value: function _pointToElement(_ref4) {
          var x = _ref4.x,
              y = _ref4.y;
          var transform = this.storage.transform;
          var ctm = transform.ctm;
          var matrix = ctm.inverse();
          matrix.e = matrix.f = 0;
          return this._applyMatrixToPoint(matrix, x, y);
        }
      }, {
        key: "_pointToControls",
        value: function _pointToControls(_ref5) {
          var x = _ref5.x,
              y = _ref5.y;
          var transform = this.storage.transform;
          var boxCTM = transform.boxCTM;
          var matrix = boxCTM.inverse();
          matrix.e = matrix.f = 0;
          return this._applyMatrixToPoint(matrix, x, y);
        }
      }, {
        key: "_applyMatrixToPoint",
        value: function _applyMatrixToPoint(matrix, x, y) {
          var container = this.options.container;
          var pt = container.createSVGPoint();
          pt.x = x;
          pt.y = y;
          return pt.matrixTransform(matrix);
        }
      }, {
        key: "_apply",
        value: function _apply(actionName) {
          var element = this.el,
              storage = this.storage,
              container = this.options.container;
          var box = storage.box,
              handles = storage.handles,
              cached = storage.cached,
              transform = storage.transform;
          var matrix = transform.matrix,
              boxCTM = transform.boxCTM,
              bBox = transform.bBox,
              ctm = transform.ctm;
          var eBBox = element.getBBox();
          var elX = eBBox.x,
              elY = eBBox.y,
              elW = eBBox.width,
              elH = eBBox.height;
          var rotationPoint = isDef(handles.center) ? pointTo(boxCTM, handles.center.cx.baseVal.value, handles.center.cy.baseVal.value) : pointTo(matrix, elX + elW / 2, elY + elH / 2);
          element.setAttribute('data-cx', rotationPoint.x);
          element.setAttribute('data-cy', rotationPoint.y);
          if (isUndef(cached)) return;
          var scaleX = cached.scaleX,
              scaleY = cached.scaleY,
              dx = cached.dx,
              dy = cached.dy,
              ox = cached.ox,
              oy = cached.oy;

          if (actionName === 'drag') {
            if (dx === 0 && dy === 0) return;
            var eM = createSVGMatrix();
            eM.e = dx;
            eM.f = dy;
            var translateMatrix = eM.multiply(matrix).multiply(eM.inverse());
            element.setAttribute('transform', matrixToString(translateMatrix));

            if (isGroup(element)) {
              var els = checkChildElements(element);
              els.forEach(function (child) {
                var pt = container.createSVGPoint();
                var ctm = getTransformToElement(element.parentNode, container).inverse();
                pt.x = ox;
                pt.y = oy;
                ctm.e = ctm.f = 0;
                var newPT = pt.matrixTransform(ctm);
                var eM = createSVGMatrix();
                eM.e = dx;
                eM.f = dy;
                var translateMatrix = eM.multiply(getTransformToElement(child, child.parentNode)).multiply(eM.inverse());

                if (!isIdentity(translateMatrix)) {
                  child.setAttribute('transform', matrixToString(translateMatrix));
                }

                if (!isGroup(child)) {
                  applyTranslate(child, {
                    x: newPT.x,
                    y: newPT.y
                  });
                }
              });
            } else {
              applyTranslate(element, {
                x: dx,
                y: dy
              });
            }
          }

          if (actionName === 'resize') {
            var _box$getBBox2 = box.getBBox(),
                x = _box$getBBox2.x,
                y = _box$getBBox2.y,
                newWidth = _box$getBBox2.width,
                newHeight = _box$getBBox2.height;

            applyTransformToHandles(storage, {
              x: x,
              y: y,
              width: newWidth,
              height: newHeight,
              boxMatrix: null
            });

            if (isGroup(element)) {
              var _els = checkChildElements(element);

              _els.forEach(function (child) {
                if (!isGroup(child)) {
                  applyResize(child, {
                    scaleX: scaleX,
                    scaleY: scaleY,
                    defaultCTM: child.__ctm__,
                    bBox: bBox,
                    container: container,
                    storage: storage
                  });
                }
              });
            } else {
              applyResize(element, {
                scaleX: scaleX,
                scaleY: scaleY,
                defaultCTM: ctm,
                bBox: bBox,
                container: container,
                storage: storage
              });
            }

            element.setAttribute('transform', matrixToString(matrix));
          }

          this.storage.cached = null;
        }
      }, {
        key: "_processResize",
        value: function _processResize(dx, dy) {
          var el = this.el,
              storage = this.storage,
              proportions = this.options.proportions;
          var left = storage.left,
              top = storage.top,
              cw = storage.cw,
              ch = storage.ch,
              transform = storage.transform,
              revX = storage.revX,
              revY = storage.revY,
              doW = storage.doW,
              doH = storage.doH;
          var matrix = transform.matrix,
              scMatrix = transform.scMatrix,
              trMatrix = transform.trMatrix,
              ptX = transform.scaleX,
              ptY = transform.scaleY;

          var _el$getBBox2 = el.getBBox(),
              newWidth = _el$getBBox2.width,
              newHeight = _el$getBBox2.height; //box


          var ratio = doW || !doW && !doH ? (cw + dx) / cw : (ch + dy) / ch;
          newWidth = proportions ? cw * ratio : cw + dx;
          newHeight = proportions ? ch * ratio : ch + dy;
          if (Math.abs(newWidth) < MIN_SIZE$1 || Math.abs(newHeight) < MIN_SIZE$1) return;
          var scaleX = newWidth / cw,
              scaleY = newHeight / ch; // setup scale matrix

          scMatrix.a = scaleX;
          scMatrix.b = 0;
          scMatrix.c = 0;
          scMatrix.d = scaleY;
          scMatrix.e = 0;
          scMatrix.f = 0; // translate compensation matrix

          trMatrix.e = ptX;
          trMatrix.f = ptY; //now must to do: translate(x y) scale(sx sy) translate(-x -y)

          var scaleMatrix = trMatrix.multiply(scMatrix).multiply(trMatrix.inverse());
          var res = matrix.multiply(scaleMatrix);
          el.setAttribute('transform', matrixToString(res));
          var deltaW = newWidth - cw,
              deltaH = newHeight - ch;
          var newX = left - deltaW * (doH ? 0.5 : revX ? 1 : 0),
              newY = top - deltaH * (doW ? 0.5 : revY ? 1 : 0);
          this.storage.cached = {
            scaleX: scaleX,
            scaleY: scaleY
          };
          var finalValues = {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
          };
          applyTransformToHandles(storage, _objectSpread2({}, finalValues, {
            boxMatrix: null
          }));
          return finalValues;
        }
      }, {
        key: "_processMove",
        value: function _processMove(dx, dy) {
          var _this$storage = this.storage,
              transform = _this$storage.transform,
              wrapper = _this$storage.wrapper,
              center = _this$storage.center;
          var matrix = transform.matrix,
              trMatrix = transform.trMatrix,
              scMatrix = transform.scMatrix,
              wrapperMatrix = transform.wrapperMatrix,
              parentMatrix = transform.parentMatrix;
          scMatrix.e = dx;
          scMatrix.f = dy;
          var moveWrapperMtrx = scMatrix.multiply(wrapperMatrix);
          wrapper.setAttribute('transform', matrixToString(moveWrapperMtrx));
          parentMatrix.e = parentMatrix.f = 0;

          var _pointTo = pointTo(parentMatrix.inverse(), dx, dy),
              x = _pointTo.x,
              y = _pointTo.y;

          trMatrix.e = x;
          trMatrix.f = y;
          var moveElementMtrx = trMatrix.multiply(matrix);
          this.el.setAttribute('transform', matrixToString(moveElementMtrx));
          this.storage.cached = {
            dx: x,
            dy: y,
            ox: dx,
            oy: dy
          };

          if (center.isShifted) {
            var radiusMatrix = wrapperMatrix.inverse();
            radiusMatrix.e = radiusMatrix.f = 0;

            var _pointTo2 = pointTo(radiusMatrix, dx, dy),
                nx = _pointTo2.x,
                ny = _pointTo2.y;

            this._moveCenterHandle(-nx, -ny);
          }

          return moveElementMtrx;
        }
      }, {
        key: "_processRotate",
        value: function _processRotate(radians) {
          var _this$storage2 = this.storage,
              center = _this$storage2.center,
              transform = _this$storage2.transform,
              wrapper = _this$storage2.wrapper;
          var matrix = transform.matrix,
              wrapperMatrix = transform.wrapperMatrix,
              parentMatrix = transform.parentMatrix,
              trMatrix = transform.trMatrix,
              scMatrix = transform.scMatrix,
              rotMatrix = transform.rotMatrix;
          var cos = floatToFixed(Math.cos(radians)),
              sin = floatToFixed(Math.sin(radians)); // rotate(a cx cy) is equivalent to translate(cx cy) rotate(a) translate(-cx -cy)

          trMatrix.e = center.x;
          trMatrix.f = center.y;
          rotMatrix.a = cos;
          rotMatrix.b = sin;
          rotMatrix.c = -sin;
          rotMatrix.d = cos;
          var wrapMatrix = trMatrix.multiply(rotMatrix).multiply(trMatrix.inverse()).multiply(wrapperMatrix);
          wrapper.setAttribute('transform', matrixToString(wrapMatrix));
          scMatrix.e = center.el_x;
          scMatrix.f = center.el_y;
          parentMatrix.e = parentMatrix.f = 0;
          var resRotMatrix = parentMatrix.inverse().multiply(rotMatrix).multiply(parentMatrix);
          var rotateMatrix = scMatrix.multiply(resRotMatrix).multiply(scMatrix.inverse());
          var elMatrix = rotateMatrix.multiply(matrix);
          this.el.setAttribute('transform', matrixToString(elMatrix));
          return elMatrix;
        }
      }, {
        key: "_getState",
        value: function _getState(_ref6) {
          var revX = _ref6.revX,
              revY = _ref6.revY,
              doW = _ref6.doW,
              doH = _ref6.doH;
          var element = this.el,
              storage = this.storage,
              container = this.options.container;
          var box = storage.box,
              wrapper = storage.wrapper,
              parent = storage.parent,
              cHandle = storage.handles.center;
          var eBBox = element.getBBox();
          var el_x = eBBox.x,
              el_y = eBBox.y,
              el_w = eBBox.width,
              el_h = eBBox.height;

          var _box$getBBox3 = box.getBBox(),
              cw = _box$getBBox3.width,
              ch = _box$getBBox3.height,
              c_left = _box$getBBox3.x,
              c_top = _box$getBBox3.y;

          var elMatrix = getTransformToElement(element, parent),
              ctm = getTransformToElement(element, container),
              boxCTM = getTransformToElement(box.parentNode, container);
          var parentMatrix = getTransformToElement(parent, container);
          var scaleX = el_x + el_w * (doH ? 0.5 : revX ? 1 : 0),
              scaleY = el_y + el_h * (doW ? 0.5 : revY ? 1 : 0);
          var transform = {
            matrix: elMatrix,
            ctm: ctm,
            boxCTM: boxCTM,
            parentMatrix: parentMatrix,
            wrapperMatrix: getTransformToElement(wrapper, wrapper.parentNode),
            trMatrix: createSVGMatrix(),
            scMatrix: createSVGMatrix(),
            rotMatrix: createSVGMatrix(),
            scaleX: scaleX,
            scaleY: scaleY,
            scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
            scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
            bBox: eBBox
          };
          var boxCenterX = c_left + cw / 2,
              boxCenterY = c_top + ch / 2;
          var centerX = cHandle ? cHandle.cx.baseVal.value : boxCenterX,
              centerY = cHandle ? cHandle.cy.baseVal.value : boxCenterY; // c-handle's coordinates

          var _pointTo3 = pointTo(boxCTM, centerX, centerY),
              bcx = _pointTo3.x,
              bcy = _pointTo3.y; // element's center coordinates


          var _ref7 = isDef(cHandle) ? pointTo(parentMatrix.inverse(), bcx, bcy) : pointTo(elMatrix, el_x + el_w / 2, el_y + el_h / 2),
              elcx = _ref7.x,
              elcy = _ref7.y; // box's center coordinates


          var _pointTo4 = pointTo(getTransformToElement(box, container), boxCenterX, boxCenterY),
              rcx = _pointTo4.x,
              rcy = _pointTo4.y;

          checkChildElements(element).forEach(function (child) {
            child.__ctm__ = getTransformToElement(child, container);
          });
          return {
            transform: transform,
            cw: cw,
            ch: ch,
            center: {
              x: cHandle ? bcx : rcx,
              y: cHandle ? bcy : rcy,
              el_x: elcx,
              el_y: elcy,
              hx: cHandle ? cHandle.cx.baseVal.value : null,
              hy: cHandle ? cHandle.cy.baseVal.value : null,
              isShifted: floatToFixed(rcx, 3) !== floatToFixed(bcx, 3) && floatToFixed(rcy, 3) !== floatToFixed(bcy, 3)
            },
            left: c_left,
            top: c_top,
            revX: revX,
            revY: revY,
            doW: doW,
            doH: doH
          };
        }
      }, {
        key: "_moveCenterHandle",
        value: function _moveCenterHandle(x, y) {
          var _this$storage3 = this.storage,
              _this$storage3$handle = _this$storage3.handles,
              center = _this$storage3$handle.center,
              radius = _this$storage3$handle.radius,
              _this$storage3$center = _this$storage3.center,
              hx = _this$storage3$center.hx,
              hy = _this$storage3$center.hy;
          if (isUndef(center)) return;
          var mx = hx + x,
              my = hy + y;
          center.cx.baseVal.value = mx;
          center.cy.baseVal.value = my;
          radius.x2.baseVal.value = mx;
          radius.y2.baseVal.value = my;
        }
      }, {
        key: "resetCenterPoint",
        value: function resetCenterPoint() {
          var _this$storage4 = this.storage,
              box = _this$storage4.box,
              _this$storage4$handle = _this$storage4.handles,
              center = _this$storage4$handle.center,
              radius = _this$storage4$handle.radius;

          var _box$getBBox4 = box.getBBox(),
              cw = _box$getBBox4.width,
              ch = _box$getBBox4.height,
              c_left = _box$getBBox4.x,
              c_top = _box$getBBox4.y;

          var matrix = getTransformToElement(box, box.parentNode);

          var _pointTo5 = pointTo(matrix, c_left + cw / 2, c_top + ch / 2),
              cx = _pointTo5.x,
              cy = _pointTo5.y;

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
              _this$storage5 = this.storage,
              box = _this$storage5.box,
              wrapper = _this$storage5.wrapper,
              container = this.options.container;

          var _el$getBBox3 = el.getBBox(),
              width = _el$getBBox3.width,
              height = _el$getBBox3.height,
              x = _el$getBBox3.x,
              y = _el$getBBox3.y;

          var containerMatrix = getTransformToElement(el, container);
          wrapper.removeAttribute('transform');
          box.setAttribute('transform', matrixToString(containerMatrix));
          applyTransformToHandles(this.storage, {
            x: x,
            y: y,
            width: width,
            height: height,
            boxMatrix: containerMatrix
          });
        }
      }, {
        key: "controls",
        get: function get() {
          return this.storage.wrapper;
        }
      }]);

      return DraggableSVG;
    }(Transformable);

    function applyTranslate(element, _ref8) {
      var x = _ref8.x,
          y = _ref8.y;
      var attrs = [];

      switch (element.tagName.toLowerCase()) {
        case 'text':
          {
            var resX = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value + x : (Number(element.getAttribute('x')) || 0) + x;
            var resY = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value + y : (Number(element.getAttribute('y')) || 0) + y;
            attrs.push(['x', resX], ['y', resY]);
            break;
          }

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
    }

    function applyResize(element, data) {
      var scaleX = data.scaleX,
          scaleY = data.scaleY,
          bBox = data.bBox,
          defaultCTM = data.defaultCTM,
          container = data.container;
      var boxW = bBox.width,
          boxH = bBox.height;
      var attrs = [];
      var ctm = getTransformToElement(element, container);
      var localCTM = defaultCTM.inverse().multiply(ctm);

      switch (element.tagName.toLowerCase()) {
        case 'text':
          {
            var x = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
            var y = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;

            var _pointTo6 = pointTo(localCTM, x, y),
                resX = _pointTo6.x,
                resY = _pointTo6.y;

            attrs.push(['x', resX + (scaleX < 0 ? boxW : 0)], ['y', resY + (scaleY < 0 ? boxH : 0)]);
            break;
          }

        case 'circle':
          {
            var r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            var _pointTo7 = pointTo(localCTM, cx, cy),
                _resX3 = _pointTo7.x,
                _resY3 = _pointTo7.y;

            attrs.push(['r', newR], ['cx', _resX3], ['cy', _resY3]);
            break;
          }

        case 'image':
        case 'rect':
          {
            var width = element.width.baseVal.value,
                height = element.height.baseVal.value,
                _x = element.x.baseVal.value,
                _y = element.y.baseVal.value;

            var _pointTo8 = pointTo(localCTM, _x, _y),
                _resX4 = _pointTo8.x,
                _resY4 = _pointTo8.y;

            var newWidth = Math.abs(width * scaleX),
                newHeight = Math.abs(height * scaleY);
            attrs.push(['x', _resX4 - (scaleX < 0 ? newWidth : 0)], ['y', _resY4 - (scaleY < 0 ? newHeight : 0)], ['width', newWidth], ['height', newHeight]);
            break;
          }

        case 'ellipse':
          {
            var rx = element.rx.baseVal.value,
                ry = element.ry.baseVal.value,
                _cx = element.cx.baseVal.value,
                _cy = element.cy.baseVal.value;

            var _pointTo9 = pointTo(localCTM, _cx, _cy),
                cx1 = _pointTo9.x,
                cy1 = _pointTo9.y;

            var scaleMatrix = createSVGMatrix();
            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;

            var _pointTo10 = pointTo(scaleMatrix, rx, ry),
                nRx = _pointTo10.x,
                nRy = _pointTo10.y;

            attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
            break;
          }

        case 'line':
          {
            var resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;

            var _pointTo11 = pointTo(localCTM, resX1, resY1),
                resX1_ = _pointTo11.x,
                resY1_ = _pointTo11.y;

            var _pointTo12 = pointTo(localCTM, resX2, resY2),
                resX2_ = _pointTo12.x,
                resY2_ = _pointTo12.y;

            attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
            break;
          }

        case 'polygon':
        case 'polyline':
          {
            var points = parsePoints(element.getAttribute('points'));
            var result = points.map(function (item) {
              var _pointTo13 = pointTo(localCTM, Number(item[0]), Number(item[1])),
                  x = _pointTo13.x,
                  y = _pointTo13.y;

              item[0] = x;
              item[1] = y;
              return item.join(' ');
            }).join(' ');
            attrs.push(['points', result]);
            break;
          }

        case 'path':
          {
            var path = element.getAttribute('d');
            attrs.push(['d', resizePath({
              path: path,
              localCTM: localCTM
            })]);
            break;
          }
      }

      attrs.forEach(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            key = _ref10[0],
            value = _ref10[1];

        element.setAttribute(key, value);
      });
    }

    function applyTransformToHandles(storage, data) {
      var box = storage.box,
          handles = storage.handles,
          center = storage.center;
      var x = data.x,
          y = data.y,
          width = data.width,
          height = data.height,
          boxMatrix = data.boxMatrix;
      var hW = width / 2,
          hH = height / 2;
      var forced = boxMatrix !== null;
      var boxCTM = !forced ? getTransformToElement(box, box.parentNode) : boxMatrix;
      var boxCenter = pointTo(boxCTM, x + hW, y + hH);
      var attrs = {
        tl: pointTo(boxCTM, x, y),
        tr: pointTo(boxCTM, x + width, y),
        br: pointTo(boxCTM, x + width, y + height),
        bl: pointTo(boxCTM, x, y + height),
        tc: pointTo(boxCTM, x + hW, y),
        bc: pointTo(boxCTM, x + hW, y + height),
        ml: pointTo(boxCTM, x, y + hH),
        mr: pointTo(boxCTM, x + width, y + hH),
        rotator: {},
        center: isDef(handles.center) && !center.isShifted ? boxCenter : undefined
      }; // if (forced) { 
      //     attrs.center = pointTo(
      //         boxCTM, 
      //         center.x, 
      //         center.y
      //     );
      //     console.log(attrs.center);
      // }

      var theta = Math.atan2(attrs.tl.y - attrs.tr.y, attrs.tl.x - attrs.tr.x);
      attrs.rotator.x = attrs.mr.x - ROT_OFFSET * Math.cos(theta);
      attrs.rotator.y = attrs.mr.y - ROT_OFFSET * Math.sin(theta);
      var normal = handles.normal,
          radius = handles.radius;

      if (isDef(normal)) {
        normal.x1.baseVal.value = attrs.mr.x;
        normal.y1.baseVal.value = attrs.mr.y;
        normal.x2.baseVal.value = attrs.rotator.x;
        normal.y2.baseVal.value = attrs.rotator.y;
      }

      if (isDef(radius)) {
        radius.x1.baseVal.value = boxCenter.x;
        radius.y1.baseVal.value = boxCenter.y;

        if (!center.isShifted) {
          radius.x2.baseVal.value = boxCenter.x;
          radius.y2.baseVal.value = boxCenter.y;
        }
      }

      x += width < 0 ? width : 0;
      y += height < 0 ? height : 0;
      var boxAttrs = {
        x: x,
        y: y,
        width: Math.abs(width),
        height: Math.abs(height)
      };
      Object.keys(boxAttrs).forEach(function (attr) {
        box.setAttribute(attr, boxAttrs[attr]);
      });
      Object.keys(attrs).forEach(function (key) {
        var hdl = handles[key];
        var attr = attrs[key];
        if (isUndef(attr) || isUndef(hdl)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
      });
    }

    function createHandler$1(l, t, color, key) {
      var handler = createSVGElement('circle');
      addClass(handler, "sjx-svg-hdl-".concat(key));
      var items = {
        cx: l,
        cy: t,
        r: 5.5,
        fill: color,
        stroke: '#fff',
        'fill-opacity': 1,
        'vector-effect': 'non-scaling-stroke',
        'stroke-width': 1
      };
      Object.keys(items).map(function (key) {
        handler.setAttribute(key, items[key]);
      });
      return handler;
    }

    function setLineStyle(line, color) {
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-dasharray', '3 3');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
    }

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

    var Cloneable =
    /*#__PURE__*/
    function (_SubjectModel) {
      _inherits(Cloneable, _SubjectModel);

      function Cloneable(el, options) {
        var _this;

        _classCallCheck(this, Cloneable);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Cloneable).call(this, el));

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
          $el.on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
          EVENTS.slice(0, 3).forEach(function (eventName) {
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
          helper(el).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
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

    var Subjx =
    /*#__PURE__*/
    function (_Helper) {
      _inherits(Subjx, _Helper);

      function Subjx() {
        _classCallCheck(this, Subjx);

        return _possibleConstructorReturn(this, _getPrototypeOf(Subjx).apply(this, arguments));
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
