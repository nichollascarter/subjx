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

    var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
      return setTimeout(f, 1000 / 60);
    };
    var cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (requestID) {
      clearTimeout(requestID);
    };
    var {
      forEach,
      slice: arrSlice,
      map: arrMap,
      reduce: arrReduce
    } = Array.prototype;
    /* eslint-disable no-console */

    var {
      warn
    } = console;
    /* eslint-disable no-console */

    var isDef = val => {
      return val !== undefined && val !== null;
    };
    var isUndef = val => {
      return val === undefined || val === null;
    };
    var isFunc = val => {
      return typeof val === 'function';
    };
    var createMethod = fn => {
      return isFunc(fn) ? function () {
        fn.call(this, ...arguments);
      } : () => {};
    };

    class Helper {
      constructor(params) {
        if (typeof params === 'string') {
          var selector = document.querySelectorAll(params);
          this.length = selector.length;

          for (var count = 0; count < this.length; count++) {
            this[count] = selector[count];
          }
        } else if (typeof params === 'object' && (params.nodeType === 1 || params === document)) {
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

      css(prop) {
        var _getStyle = obj => {
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

        var _setStyle = (obj, options) => {
          var len = obj.length;

          while (len--) {
            for (var property in options) {
              obj[len].style[property] = options[property];
            }
          }

          return obj.style;
        };

        var methods = {
          setStyle(options) {
            return _setStyle(this, options);
          },

          getStyle() {
            return _getStyle(this);
          }

        };

        if (typeof prop === 'string') {
          return methods.getStyle.apply(this, arrSlice.call(arguments, 1));
        } else if (typeof prop === 'object' || !prop) {
          return methods.setStyle.apply(this, arguments);
        } else {
          warn("Method ".concat(prop, " does not exist"));
        }

        return false;
      }

      on() {
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

      off() {
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

      is(selector) {
        if (isUndef(selector)) return false;

        var _sel = helper(selector);

        var len = this.length;

        while (len--) {
          if (this[len] === _sel[len]) return true;
        }

        return false;
      }

    }

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
      return isDef(obj) && typeof obj === 'object' && (Array.isArray(obj) || isDef(window.Symbol) && typeof obj[window.Symbol.iterator] === 'function' || isDef(obj.forEach) || typeof obj.length === "number" && (obj.length === 0 || obj.length > 0 && obj.length - 1 in obj));
    }

    function helper(params) {
      return new Helper(params);
    }

    class Observable {
      constructor() {
        this.observers = {};
      }

      subscribe(eventName, sub) {
        var obs = this.observers;

        if (isUndef(obs[eventName])) {
          Object.defineProperty(obs, eventName, {
            value: []
          });
        }

        obs[eventName].push(sub);
        return this;
      }

      unsubscribe(eventName, f) {
        var obs = this.observers;

        if (isDef(obs[eventName])) {
          var index = obs[eventName].indexOf(f);
          obs[eventName].splice(index, 1);
        }

        return this;
      }

      notify(eventName, source, data) {
        if (isUndef(this.observers[eventName])) return;
        this.observers[eventName].forEach(observer => {
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

    class Event {
      constructor(name) {
        this.name = name;
        this.callbacks = [];
      }

      registerCallback(cb) {
        this.callbacks.push(cb);
      }

      removeCallback(cb) {
        var ix = this.callbacks(cb);
        this.callbacks.splice(ix, 1);
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

    class SubjectModel {
      constructor(el) {
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

      enable(options) {
        this._processOptions(options);

        this._init(this.el);

        this.proxyMethods.onInit.call(this, this.el);
      }

      disable() {
        throwNotImplementedError();
      }

      _init() {
        throwNotImplementedError();
      }

      _destroy() {
        throwNotImplementedError();
      }

      _processOptions() {
        throwNotImplementedError();
      }

      _start() {
        throwNotImplementedError();
      }

      _moving() {
        throwNotImplementedError();
      }

      _end() {
        throwNotImplementedError();
      }

      _animate() {
        throwNotImplementedError();
      }

      _drag(_ref) {
        var {
          dx,
          dy
        } = _ref,
            rest = _objectWithoutProperties(_ref, ["dx", "dy"]);

        var transform = this._processMove(dx, dy);

        var finalArgs = _objectSpread2({
          dx,
          dy,
          transform
        }, rest);

        this.proxyMethods.onMove.call(this, finalArgs);

        this._emitEvent('drag', finalArgs);
      }

      _draw() {
        this._animate();
      }

      _onMouseDown(e) {
        this._start(e);

        helper(document).on('mousemove', this._onMouseMove).on('mouseup', this._onMouseUp);
      }

      _onTouchStart(e) {
        this._start(e.touches[0]);

        helper(document).on('touchmove', this._onTouchMove).on('touchend', this._onTouchEnd);
      }

      _onMouseMove(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }

        this._moving(e, this.el);
      }

      _onTouchMove(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }

        this._moving(e.touches[0], this.el);
      }

      _onMouseUp(e) {
        helper(document).off('mousemove', this._onMouseMove).off('mouseup', this._onMouseUp);

        this._end(e, this.el);
      }

      _onTouchEnd(e) {
        helper(document).off('touchmove', this._onTouchMove).off('touchend', this._onTouchEnd);

        if (e.touches.length === 0) {
          this._end(e.changedTouches[0], this.el);
        }
      }

      _emitEvent() {
        this.eventDispatcher.emit(this, ...arguments);
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

    var throwNotImplementedError = () => {
      throw Error("Method not implemented");
    };

    var EVENTS = ['dragStart', 'drag', 'dragEnd', 'resizeStart', 'resize', 'resizeEnd', 'rotateStart', 'rotate', 'rotateEnd', 'setPointStart', 'setPointEnd'];

    var RAD = Math.PI / 180;
    var snapToGrid = (value, snap) => {
      if (snap === 0) {
        return value;
      } else {
        var result = snapCandidate(value, snap);

        if (result - value < snap) {
          return result;
        }
      }
    };
    var snapCandidate = (value, gridSize) => {
      if (gridSize === 0) return value;
      return Math.round(value / gridSize) * gridSize;
    };
    var floatToFixed = function floatToFixed(val) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      return Number(val.toFixed(size));
    };

    var getOffset = node => {
      return node.getBoundingClientRect();
    };
    var getTransform = el => {
      var transform = el.css('-webkit-transform') || el.css('-moz-transform') || el.css('-ms-transform') || el.css('-o-transform') || el.css('transform') || 'none';
      return transform;
    };
    var parseMatrix = value => {
      var transform = value.match(/[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);

      if (transform) {
        return transform.map(item => {
          return parseFloat(item);
        });
      } else {
        return [1, 0, 0, 1, 0, 0];
      }
    };
    var addClass = (node, cls) => {
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
    var removeClass = (node, cls) => {
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
    var objectsCollide = (a, b) => {
      var {
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
    var matrixToCSS = arr => {
      var style = "matrix(".concat(arr.join(), ")");
      return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
      };
    };

    class Transformable extends SubjectModel {
      constructor(el, options, observable) {
        super(el);

        if (this.constructor === Transformable) {
          throw new TypeError('Cannot construct Transformable instances directly');
        }

        this.observable = observable;
        EVENTS.forEach(eventName => {
          this.eventDispatcher.registerEvent(eventName);
        });
        this.enable(options);
      }

      _cursorPoint() {
        throw Error("'_cursorPoint()' method not implemented");
      }

      _rotate(_ref) {
        var {
          radians
        } = _ref,
            rest = _objectWithoutProperties(_ref, ["radians"]);

        var resultMtrx = this._processRotate(radians);

        var finalArgs = _objectSpread2({
          transform: resultMtrx,
          delta: radians
        }, rest);

        this.proxyMethods.onRotate.call(this, finalArgs);

        this._emitEvent('rotate', finalArgs);
      }

      _resize(_ref2) {
        var {
          dx,
          dy
        } = _ref2,
            rest = _objectWithoutProperties(_ref2, ["dx", "dy"]);

        var finalValues = this._processResize(dx, dy);

        var finalArgs = _objectSpread2({}, finalValues, {
          dx,
          dy
        }, rest);

        this.proxyMethods.onResize.call(this, finalArgs);

        this._emitEvent('resize', finalArgs);
      }

      _processOptions(options) {
        var {
          el
        } = this;
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
            _rotationPoint = false,
            _draggable = true,
            _resizable = true,
            _rotatable = true,
            _rotatorAnchor = null,
            _rotatorOffset = 50,
            _showNormal = true,
            _custom = null,
            _onInit = () => {},
            _onMove = () => {},
            _onRotate = () => {},
            _onResize = () => {},
            _onDrop = () => {},
            _onDestroy = () => {};

        var _container = el.parentNode;

        if (isDef(options)) {
          var {
            snap,
            each,
            axis,
            cursorMove,
            cursorResize,
            cursorRotate,
            rotationPoint,
            restrict,
            draggable,
            resizable,
            rotatable,
            onInit,
            onDrop,
            onMove,
            onResize,
            onRotate,
            onDestroy,
            container,
            proportions,
            custom,
            rotatorAnchor,
            rotatorOffset,
            showNormal
          } = options;

          if (isDef(snap)) {
            var {
              x,
              y,
              angle
            } = snap;
            _snap.x = isUndef(x) ? 10 : x;
            _snap.y = isUndef(y) ? 10 : y;
            _snap.angle = isUndef(angle) ? _snap.angle : angle * RAD;
          }

          if (isDef(each)) {
            var {
              move,
              resize,
              rotate
            } = each;
            _each.move = move || false;
            _each.resize = resize || false;
            _each.rotate = rotate || false;
          }

          if (isDef(restrict)) {
            _restrict = restrict === 'parent' ? el.parentNode : helper(restrict)[0] || document;
          }

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
          _custom = typeof custom === 'object' && custom || null;
          _rotatorAnchor = rotatorAnchor || null;
          _rotatorOffset = rotatorOffset || 50;
          _showNormal = isDef(showNormal) ? showNormal : true;
          _onInit = createMethod(onInit);
          _onDrop = createMethod(onDrop);
          _onMove = createMethod(onMove);
          _onResize = createMethod(onResize);
          _onRotate = createMethod(onRotate);
          _onDestroy = createMethod(onDestroy);
        }

        this.options = {
          axis: _axis,
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
          rotatable: _rotatable,
          custom: _custom,
          rotatorAnchor: _rotatorAnchor,
          rotatorOffset: _rotatorOffset,
          showNormal: _showNormal
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

      _animate() {
        var self = this;
        var {
          observable,
          storage,
          options
        } = self;
        if (isUndef(storage)) return;
        storage.frame = requestAnimFrame(self._animate);
        if (!storage.doDraw) return;
        storage.doDraw = false;
        var {
          dox,
          doy,
          clientX,
          clientY,
          doDrag,
          doResize,
          doRotate,
          doSetCenter,
          revX,
          revY
        } = storage;
        var {
          snap,
          each: {
            move: moveEach,
            resize: resizeEach,
            rotate: rotateEach
          },
          restrict,
          draggable,
          resizable,
          rotatable
        } = options;

        if (doResize && resizable) {
          var {
            transform,
            cx,
            cy
          } = storage;

          var {
            x,
            y
          } = this._pointToElement({
            x: clientX,
            y: clientY
          });

          var dx = dox ? snapToGrid(x - cx, snap.x / transform.scX) : 0;
          var dy = doy ? snapToGrid(y - cy, snap.y / transform.scY) : 0;
          dx = dox ? revX ? -dx : dx : 0;
          dy = doy ? revY ? -dy : dy : 0;
          var args = {
            dx,
            dy,
            clientX,
            clientY
          };

          self._resize(args);

          if (resizeEach) {
            observable.notify('onresize', self, args);
          }
        }

        if (doDrag && draggable) {
          var {
            restrictOffset,
            elementOffset,
            nx,
            ny
          } = storage;

          if (isDef(restrict)) {
            var {
              left: restLeft,
              top: restTop
            } = restrictOffset;
            var {
              left: elLeft,
              top: elTop,
              width: elW,
              height: elH
            } = elementOffset;
            var distX = nx - clientX,
                distY = ny - clientY;
            var maxX = restrict.clientWidth - elW,
                maxY = restrict.clientHeight - elH;
            var offsetY = elTop - restTop,
                offsetX = elLeft - restLeft;

            if (offsetY - distY < 0) {
              clientY = ny - elTop + restTop;
            }

            if (offsetX - distX < 0) {
              clientX = nx - elLeft + restLeft;
            }

            if (offsetY - distY > maxY) {
              clientY = maxY + (ny - elTop + restTop);
            }

            if (offsetX - distX > maxX) {
              clientX = maxX + (nx - elLeft + restLeft);
            }
          }

          var _dx = dox ? snapToGrid(clientX - nx, snap.x) : 0;

          var _dy = doy ? snapToGrid(clientY - ny, snap.y) : 0;

          var _args = {
            dx: _dx,
            dy: _dy,
            clientX,
            clientY
          };

          self._drag(_args);

          if (moveEach) {
            observable.notify('onmove', self, _args);
          }
        }

        if (doRotate && rotatable) {
          var {
            pressang,
            center
          } = storage;
          var radians = Math.atan2(clientY - center.y, clientX - center.x) - pressang;
          var _args2 = {
            clientX,
            clientY
          };

          self._rotate(_objectSpread2({
            radians: snapToGrid(radians, snap.angle)
          }, _args2));

          if (rotateEach) {
            observable.notify('onrotate', self, _objectSpread2({
              radians
            }, _args2));
          }
        }

        if (doSetCenter && rotatable) {
          var {
            bx,
            by
          } = storage;

          var {
            x: _x,
            y: _y
          } = this._pointToControls({
            x: clientX,
            y: clientY
          });

          self._moveCenterHandle(_x - bx, _y - by);
        }
      }

      _start(e) {
        var {
          observable,
          storage,
          options: {
            axis,
            restrict,
            each
          },
          el
        } = this;

        var computed = this._compute(e);

        Object.keys(computed).forEach(prop => {
          storage[prop] = computed[prop];
        });
        var {
          onRightEdge,
          onBottomEdge,
          onTopEdge,
          onLeftEdge,
          handle,
          factor,
          revX,
          revY,
          doW,
          doH
        } = computed;
        var doResize = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
        var {
          handles
        } = storage;
        var {
          rotator,
          center,
          radius
        } = handles;

        if (isDef(radius)) {
          removeClass(radius, 'sjx-hidden');
        }

        var doRotate = handle.is(rotator),
            doSetCenter = isDef(center) ? handle.is(center) : false;
        var doDrag = !(doRotate || doResize || doSetCenter);
        var {
          clientX,
          clientY
        } = e;

        var {
          x,
          y
        } = this._cursorPoint({
          clientX,
          clientY
        });

        var {
          x: nx,
          y: ny
        } = this._pointToElement({
          x,
          y
        });

        var {
          x: bx,
          y: by
        } = this._pointToControls({
          x,
          y
        });

        var newStorageValues = {
          clientX,
          clientY,
          nx: x,
          ny: y,
          cx: nx,
          cy: ny,
          bx,
          by,
          doResize,
          doDrag,
          doRotate,
          doSetCenter,
          onExecution: true,
          cursor: null,
          elementOffset: getOffset(el),
          restrictOffset: isDef(restrict) ? getOffset(restrict) : null,
          dox: /\x/.test(axis) && (doResize ? handle.is(handles.ml) || handle.is(handles.mr) || handle.is(handles.tl) || handle.is(handles.tr) || handle.is(handles.bl) || handle.is(handles.br) : true),
          doy: /\y/.test(axis) && (doResize ? handle.is(handles.br) || handle.is(handles.bl) || handle.is(handles.bc) || handle.is(handles.tr) || handle.is(handles.tl) || handle.is(handles.tc) : true)
        };
        this.storage = _objectSpread2({}, storage, {}, newStorageValues);
        var eventArgs = {
          clientX,
          clientY
        };

        if (doResize) {
          this._emitEvent('resizeStart', eventArgs);
        } else if (doRotate) {
          this._emitEvent('rotateStart', eventArgs);
        } else if (doDrag) {
          this._emitEvent('dragStart', eventArgs);
        }

        var {
          move,
          resize,
          rotate
        } = each;
        var actionName = doResize ? 'resize' : doRotate ? 'rotate' : 'drag';
        var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
        observable.notify('ongetstate', this, {
          clientX,
          clientY,
          actionName,
          triggerEvent,
          factor,
          revX,
          revY,
          doW,
          doH
        });

        this._draw();
      }

      _moving(e) {
        var {
          storage,
          options
        } = this;

        var {
          x,
          y
        } = this._cursorPoint(e);

        storage.e = e;
        storage.clientX = x;
        storage.clientY = y;
        storage.doDraw = true;
        var {
          doRotate,
          doDrag,
          doResize,
          cursor
        } = storage;
        var {
          cursorMove,
          cursorResize,
          cursorRotate
        } = options;

        if (isUndef(cursor)) {
          if (doDrag) {
            cursor = cursorMove;
          } else if (doRotate) {
            cursor = cursorRotate;
          } else if (doResize) {
            cursor = cursorResize;
          }

          helper(document.body).css({
            cursor
          });
        }
      }

      _end(_ref3) {
        var {
          clientX,
          clientY
        } = _ref3;
        var {
          options: {
            each
          },
          observable,
          storage,
          proxyMethods
        } = this;
        var {
          doResize,
          doDrag,
          doRotate,
          //doSetCenter,
          frame,
          handles: {
            radius
          }
        } = storage;
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
          clientX,
          clientY
        };
        proxyMethods.onDrop.call(this, eventArgs);

        if (doResize) {
          this._emitEvent('resizeEnd', eventArgs);
        } else if (doRotate) {
          this._emitEvent('rotateEnd', eventArgs);
        } else if (doDrag) {
          this._emitEvent('dragEnd', eventArgs);
        }

        var {
          move,
          resize,
          rotate
        } = each;
        var triggerEvent = doResize && resize || doRotate && rotate || doDrag && move;
        observable.notify('onapply', this, {
          clientX,
          clientY,
          actionName,
          triggerEvent
        });
        cancelAnimFrame(frame);
        helper(document.body).css({
          cursor: 'auto'
        });

        if (isDef(radius)) {
          addClass(radius, 'sjx-hidden');
        }
      }

      _compute(e) {
        var {
          handles
        } = this.storage;
        var handle = helper(e.target);

        var _this$_checkHandles = this._checkHandles(handle, handles),
            {
          revX,
          revY,
          doW,
          doH
        } = _this$_checkHandles,
            rest = _objectWithoutProperties(_this$_checkHandles, ["revX", "revY", "doW", "doH"]);

        var _computed = this._getState({
          revX,
          revY,
          doW,
          doH
        });

        var {
          x: clientX,
          y: clientY
        } = this._cursorPoint(e);

        var pressang = Math.atan2(clientY - _computed.center.y, clientX - _computed.center.x);
        return _objectSpread2({}, _computed, {}, rest, {
          handle,
          pressang
        });
      }

      _checkHandles(handle, handles) {
        var {
          tl,
          tc,
          tr,
          bl,
          br,
          bc,
          ml,
          mr
        } = handles;
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
          revX,
          revY,
          onTopEdge,
          onLeftEdge,
          onRightEdge,
          onBottomEdge,
          doW,
          doH
        };
      }

      notifyMove() {
        this._drag(...arguments);
      }

      notifyRotate(_ref4) {
        var {
          radians
        } = _ref4,
            rest = _objectWithoutProperties(_ref4, ["radians"]);

        var {
          snap: {
            angle
          }
        } = this.options;

        this._rotate(_objectSpread2({
          radians: snapToGrid(radians, angle)
        }, rest));
      }

      notifyResize() {
        this._resize(...arguments);
      }

      notifyApply(_ref5) {
        var {
          clientX,
          clientY,
          actionName,
          triggerEvent
        } = _ref5;
        this.proxyMethods.onDrop.call(this, {
          clientX,
          clientY
        });

        if (triggerEvent) {
          this._apply(actionName);

          this._emitEvent("".concat(actionName, "End"), {
            clientX,
            clientY
          });
        }
      }

      notifyGetState(_ref6) {
        var {
          clientX,
          clientY,
          actionName,
          triggerEvent
        } = _ref6,
            rest = _objectWithoutProperties(_ref6, ["clientX", "clientY", "actionName", "triggerEvent"]);

        if (triggerEvent) {
          var recalc = this._getState(rest);

          this.storage = _objectSpread2({}, this.storage, {}, recalc);

          this._emitEvent("".concat(actionName, "Start"), {
            clientX,
            clientY
          });
        }
      }

      subscribe(_ref7) {
        var {
          resize,
          move,
          rotate
        } = _ref7;
        var {
          observable: ob
        } = this;

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

      unsubscribe() {
        var {
          observable: ob
        } = this;
        ob.unsubscribe('ongetstate', this).unsubscribe('onapply', this).unsubscribe('onmove', this).unsubscribe('onresize', this).unsubscribe('onrotate', this);
      }

      disable() {
        var {
          storage,
          proxyMethods,
          el
        } = this;
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

      exeDrag(_ref8) {
        var {
          dx,
          dy
        } = _ref8;
        var {
          draggable
        } = this.options;
        if (!draggable) return;
        this.storage = _objectSpread2({}, this.storage, {}, this._getState({
          revX: false,
          revY: false,
          doW: false,
          doH: false
        }));

        this._drag({
          dx,
          dy
        });

        this._apply('drag');
      }

      exeResize(_ref9) {
        var {
          dx,
          dy,
          revX,
          revY,
          doW,
          doH
        } = _ref9;
        var {
          resizable
        } = this.options;
        if (!resizable) return;
        this.storage = _objectSpread2({}, this.storage, {}, this._getState({
          revX: revX || false,
          revY: revY || false,
          doW: doW || false,
          doH: doH || false
        }));

        this._resize({
          dx,
          dy
        });

        this._apply('resize');
      }

      exeRotate(_ref10) {
        var {
          delta
        } = _ref10;
        var {
          rotatable
        } = this.options;
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

    }

    var matrixTransform = (_ref, matrix) => {
      var {
        x,
        y
      } = _ref;
      var [a, b, c, d, e, f] = matrix;
      return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
      };
    }; //http://blog.acipo.com/matrix-inversion-in-javascript/

    var matrixInvert = ctm => {
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
    };
    var multiplyMatrix = (_ref2, _ref3) => {
      var [a1, b1, c1, d1, e1, f1] = _ref2;
      var [a2, b2, c2, d2, e2, f2] = _ref3;
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
    };
    var rotatedTopLeft = (x, y, width, height, rotationAngle, revX, revY, doW, doH) => {
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
    };

    var MIN_SIZE = 2;
    var CENTER_DELTA = 7;
    class Draggable extends Transformable {
      _init(el) {
        var {
          rotationPoint,
          container,
          resizable,
          rotatable,
          showNormal
        } = this.options;
        var {
          left,
          top,
          width,
          height
        } = el.style;
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
          normal: showNormal ? ['sjx-normal'] : null,
          rotator: ['sjx-hdl', 'sjx-hdl-m', 'sjx-rotator']
        };

        var handles = _objectSpread2({}, rotatable && rotationHandles, {}, resizable && resizingHandles, {
          center: rotationPoint && rotatable ? ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc'] : undefined
        });

        Object.keys(handles).forEach(key => {
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
          controls,
          handles,
          radius: undefined,
          parent: el.parentNode
        };
        $controls.on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
      }

      _destroy() {
        var {
          controls
        } = this.storage;
        helper(controls).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
        var wrapper = controls.parentNode;
        wrapper.parentNode.removeChild(wrapper);
      }

      _pointToElement(_ref) {
        var {
          x,
          y
        } = _ref;
        var {
          transform
        } = this.storage;
        var ctm = [...transform.matrix];
        ctm[4] = ctm[5] = 0;
        return this._applyMatrixToPoint(matrixInvert(ctm), x, y);
      }

      _pointToControls(data) {
        return this._pointToElement(data);
      }

      _applyMatrixToPoint(matrix, x, y) {
        return matrixTransform({
          x,
          y
        }, matrix);
      }

      _cursorPoint(_ref2) {
        var {
          clientX,
          clientY
        } = _ref2;
        var {
          container
        } = this.options;
        var globalMatrix = parseMatrix(getTransform(helper(container)));
        return matrixTransform({
          x: clientX,
          y: clientY
        }, matrixInvert(globalMatrix));
      }

      _apply() {
        var {
          el,
          storage
        } = this;
        var {
          // cached,
          controls,
          // transform,
          handles
        } = storage;
        var $controls = helper(controls);
        var cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));
        var hW = cw / 2,
            hH = ch / 2;
        var {
          center: cHandle
        } = handles;
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

      _processResize(dx, dy) {
        var {
          el,
          storage,
          options: {
            proportions
          }
        } = this;
        var {
          controls,
          coords,
          cw,
          ch,
          transform,
          refang,
          revX,
          revY,
          doW,
          doH
        } = storage;
        var ratio = doW || !doW && !doH ? (cw + dx) / cw : (ch + dy) / ch;
        var newWidth = proportions ? cw * ratio : cw + dx,
            newHeight = proportions ? ch * ratio : ch + dy;
        if (newWidth <= MIN_SIZE || newHeight <= MIN_SIZE) return;
        var matrix = [...transform.matrix];
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

      _processMove(dx, dy) {
        var {
          el,
          storage
        } = this;
        var {
          controls,
          transform: {
            matrix,
            parentMatrix
          }
        } = storage;
        var pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;
        var nMatrix = [...matrix];
        nMatrix[4] = matrix[4] + dx;
        nMatrix[5] = matrix[5] + dy;
        var css = matrixToCSS(nMatrix);
        helper(controls).css(css);
        helper(el).css(css);
        storage.cached = {
          dx,
          dy
        };
        return nMatrix;
      }

      _processRotate(radians) {
        var {
          el,
          storage: {
            controls,
            transform,
            center
          }
        } = this;
        var {
          matrix,
          parentMatrix
        } = transform;
        var cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);
        var translateMatrix = [1, 0, 0, 1, center.cx, center.cy];
        var rotMatrix = [cos, sin, -sin, cos, 0, 0];
        var pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;
        var resRotMatrix = multiplyMatrix(matrixInvert(pctm), multiplyMatrix(rotMatrix, pctm));
        var nMatrix = multiplyMatrix(multiplyMatrix(translateMatrix, resRotMatrix), matrixInvert(translateMatrix));
        var resMatrix = multiplyMatrix(nMatrix, matrix);
        var css = matrixToCSS(resMatrix);
        helper(controls).css(css);
        helper(el).css(css);
        return resMatrix;
      }

      _getState(params) {
        var {
          revX,
          revY,
          doW,
          doH
        } = params;
        var factor = revX !== revY ? -1 : 1;
        var {
          el,
          storage: {
            handles,
            controls,
            parent
          },
          options: {
            container
          }
        } = this;
        var {
          center: cHandle
        } = handles;
        var $controls = helper(controls);
        var containerMatrix = parseMatrix(getTransform(helper(container)));
        var matrix = parseMatrix(getTransform(helper(controls)));
        var pMatrix = parseMatrix(getTransform(helper(parent)));
        var refang = Math.atan2(matrix[1], matrix[0]) * factor;
        var parentMatrix = parent !== container ? multiplyMatrix(pMatrix, containerMatrix) : containerMatrix;
        var transform = {
          matrix,
          parentMatrix,
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
        var {
          x: el_x,
          y: el_y
        } = matrixTransform({
          x: offset_.left,
          y: offset_.top
        }, matrixInvert(parentMatrix));
        return {
          transform,
          cw,
          ch,
          coords,
          center: {
            x: el_x + centerX - cDelta,
            y: el_y + centerY - cDelta,
            cx: -centerX + hW - cDelta,
            cy: -centerY + hH - cDelta,
            hx: centerX,
            hy: centerY
          },
          factor,
          refang,
          revX,
          revY,
          doW,
          doH
        };
      }

      _moveCenterHandle(x, y) {
        var {
          handles: {
            center
          },
          center: {
            hx,
            hy
          }
        } = this.storage;
        var left = "".concat(hx + x, "px"),
            top = "".concat(hy + y, "px");
        helper(center).css({
          left,
          top
        });
      }

      resetCenterPoint() {
        var {
          handles: {
            center
          }
        } = this.storage;
        helper(center).css({
          left: null,
          top: null
        });
      }

      fitControlsToSize() {}

      get controls() {
        return this.storage.controls;
      }

    }

    var createHandler = classList => {
      var element = document.createElement('div');
      classList.forEach(cls => {
        addClass(element, cls);
      });
      return element;
    };

    var svgPoint = createSVGElement('svg').createSVGPoint();
    var floatRE = /[+-]?\d+(\.\d+)?/g;
    var ALLOWED_ELEMENTS = ['circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'g'];
    function createSVGElement(name) {
      return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    var checkChildElements = element => {
      var arrOfElements = [];

      if (isGroup(element)) {
        forEach.call(element.childNodes, item => {
          if (item.nodeType === 1) {
            var tagName = item.tagName.toLowerCase();

            if (ALLOWED_ELEMENTS.indexOf(tagName) !== -1) {
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
    var createSVGMatrix = () => {
      return createSVGElement('svg').createSVGMatrix();
    };
    var getTransformToElement = (toElement, g) => {
      var gTransform = g.getScreenCTM() || createSVGMatrix();
      return gTransform.inverse().multiply(toElement.getScreenCTM() || createSVGMatrix());
    };
    var matrixToString = m => {
      var {
        a,
        b,
        c,
        d,
        e,
        f
      } = m;
      return "matrix(".concat(a, ",").concat(b, ",").concat(c, ",").concat(d, ",").concat(e, ",").concat(f, ")");
    };
    var pointTo = (ctm, x, y) => {
      svgPoint.x = x;
      svgPoint.y = y;
      return svgPoint.matrixTransform(ctm);
    };
    var cloneMatrix = b => {
      var a = createSVGMatrix();
      a.a = b.a;
      a.b = b.b;
      a.c = b.c;
      a.d = b.d;
      a.e = b.e;
      a.f = b.f;
      return a;
    };
    var checkElement = el => {
      var tagName = el.tagName.toLowerCase();

      if (ALLOWED_ELEMENTS.indexOf(tagName) === -1) {
        warn('Selected element is not allowed to transform. Allowed elements:\n' + 'circle, ellipse, image, line, path, polygon, polyline, rect, text, g');
        return false;
      } else {
        return true;
      }
    };
    var isIdentity = matrix => {
      var {
        a,
        b,
        c,
        d,
        e,
        f
      } = matrix;
      return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0;
    };
    var createPoint = (svg, x, y) => {
      if (isUndef(x) || isUndef(y)) {
        return null;
      }

      var pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      return pt;
    };
    var isGroup = element => {
      return element.tagName.toLowerCase() === 'g';
    };
    var parsePoints = pts => {
      return pts.match(floatRE).reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }

        return result;
      }, []);
    };

    var dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;
    var sepRE = /\s*,\s*|\s+/g;

    var parsePath = path => {
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
          values: data.trim().split(sepRE).map(val => {
            if (!isNaN(val)) {
              return Number(val);
            }
          })
        });
      }

      return serialized;
    };

    var movePath = params => {
      var {
        path,
        dx,
        dy
      } = params;

      try {
        var serialized = parsePath(path);
        var str = '';
        var space = ' ';
        var firstCommand = true;

        for (var i = 0, len = serialized.length; i < len; i++) {
          var item = serialized[i];
          var {
            values,
            key: cmd,
            relative
          } = item;
          var coordinates = [];

          switch (cmd) {
            case 'M':
              {
                for (var k = 0, _len = values.length; k < _len; k += 2) {
                  var [x, y] = values.slice(k, k + 2);

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

                  coordinates.push(...set);
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

                  coordinates.push(..._set);
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
                  var [_x, _y] = values.slice(_k5, _k5 + 2);

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
                  var [x1, y1, x2, y2] = values.slice(_k6, _k6 + 4);

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
    var resizePath = params => {
      var {
        path,
        localCTM
      } = params;

      try {
        var serialized = parsePath(path);
        var str = '';
        var space = ' ';
        var res = [];
        var firstCommand = true;

        for (var i = 0, len = serialized.length; i < len; i++) {
          var item = serialized[i];
          var {
            values,
            key: cmd,
            relative
          } = item;

          switch (cmd) {
            case 'A':
              {
                //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                var coordinates = [];

                for (var k = 0, _len8 = values.length; k < _len8; k += 7) {
                  var [rx, ry, x_axis_rot, large_arc_flag, sweep_flag, x, y] = values.slice(k, k + 7);
                  var mtrx = cloneMatrix(localCTM);

                  if (relative) {
                    mtrx.e = mtrx.f = 0;
                  }

                  var {
                    x: resX,
                    y: resY
                  } = pointTo(mtrx, x, y);
                  coordinates.push(floatToFixed(resX), floatToFixed(resY));
                  mtrx.e = mtrx.f = 0;
                  var {
                    x: newRx,
                    y: newRy
                  } = pointTo(mtrx, rx, ry);
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
                  var [x1, y1, x2, y2, _x2, _y2] = values.slice(_k7, _k7 + 6);

                  var _mtrx = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx.e = _mtrx.f = 0;
                  }

                  var {
                    x: resX1,
                    y: resY1
                  } = pointTo(_mtrx, x1, y1);
                  var {
                    x: resX2,
                    y: resY2
                  } = pointTo(_mtrx, x2, y2);
                  var {
                    x: _resX,
                    y: _resY
                  } = pointTo(_mtrx, _x2, _y2);

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
                  var [_x3] = values.slice(_k8, _k8 + 1);

                  var _mtrx2 = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx2.e = _mtrx2.f = 0;
                  }

                  var {
                    x: _resX2
                  } = pointTo(_mtrx2, _x3, 0);

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
                  var [_y3] = values.slice(_k9, _k9 + 1);

                  var _mtrx3 = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx3.e = _mtrx3.f = 0;
                  }

                  var {
                    y: _resY2
                  } = pointTo(_mtrx3, 0, _y3);

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
                  var [_x4, _y4] = values.slice(_k10, _k10 + 2);

                  var _mtrx4 = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx4.e = _mtrx4.f = 0;
                  }

                  var {
                    x: _resX3,
                    y: _resY3
                  } = pointTo(_mtrx4, _x4, _y4);

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
                  var [_x5, _y5] = values.slice(_k11, _k11 + 2);

                  var _mtrx5 = cloneMatrix(localCTM);

                  if (relative && !firstCommand) {
                    _mtrx5.e = _mtrx5.f = 0;
                  }

                  var {
                    x: _resX4,
                    y: _resY4
                  } = pointTo(_mtrx5, _x5, _y5);

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
                  var [_x6, _y6, _x7, _y7] = values.slice(_k12, _k12 + 4);

                  var _mtrx6 = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx6.e = _mtrx6.f = 0;
                  }

                  var {
                    x: _resX5,
                    y: _resY5
                  } = pointTo(_mtrx6, _x6, _y6);
                  var {
                    x: _resX6,
                    y: _resY6
                  } = pointTo(_mtrx6, _x7, _y7);

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
                  var [_x8, _y8, _x9, _y9] = values.slice(_k13, _k13 + 4);

                  var _mtrx7 = cloneMatrix(localCTM);

                  if (relative) {
                    _mtrx7.e = _mtrx7.f = 0;
                  }

                  var {
                    x: _resX7,
                    y: _resY7
                  } = pointTo(_mtrx7, _x8, _y8);
                  var {
                    x: _resX8,
                    y: _resY8
                  } = pointTo(_mtrx7, _x9, _y9);

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

    var MIN_SIZE$1 = 5;
    var THEME_COLOR = '#00a8ff';
    class DraggableSVG extends Transformable {
      _init(el) {
        var {
          rotationPoint,
          container,
          resizable,
          rotatable,
          rotatorAnchor,
          rotatorOffset,
          showNormal,
          custom
        } = this.options;
        var wrapper = createSVGElement('g');
        addClass(wrapper, 'sjx-svg-wrapper');
        container.appendChild(wrapper);
        var {
          width: cw,
          height: ch,
          x: cx,
          y: cy
        } = el.getBBox();
        var elCTM = getTransformToElement(el, container);
        var box = createSVGElement('rect');
        var attrs = [['width', cw], ['height', ch], ['x', cx], ['y', cy], ['fill', THEME_COLOR], ['fill-opacity', 0.1], ['stroke', THEME_COLOR], ['stroke-dasharray', '3 3'], ['vector-effect', 'non-scaling-stroke'], ['transform', matrixToString(elCTM)]];
        attrs.forEach((_ref) => {
          var [key, value] = _ref;
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
        var bBox = box.getBBox(),
            {
          x: bX,
          y: bY,
          width: bW,
          height: bH
        } = bBox;
        var centerX = el.getAttribute('data-cx'),
            centerY = el.getAttribute('data-cy');
        var boxCTM = getTransformToElement(box, box.parentNode),
            boxCenter = pointTo(boxCTM, bX + bW / 2, bY + bH / 2),
            boxTL = pointTo(boxCTM, bX, bY),
            boxTR = pointTo(boxCTM, bX + bW, bY),
            boxMR = pointTo(boxCTM, bX + bW, bY + bH / 2),
            boxML = pointTo(boxCTM, bX, bY + bH / 2),
            boxTC = pointTo(boxCTM, bX + bW / 2, bY),
            boxBC = pointTo(boxCTM, bX + bW / 2, bY + bH),
            boxBR = pointTo(boxCTM, bX + bW, bY + bH),
            boxBL = pointTo(boxCTM, bX, bY + bH);
        var resizingHandles = {
          tl: boxTL,
          tr: boxTR,
          br: boxBR,
          bl: boxBL,
          tc: boxTC,
          bc: boxBC,
          ml: boxML,
          mr: boxMR
        };
        var rotationHandles = {},
            rotator = null;

        if (rotatable) {
          var anchor = {};
          var factor = 1;

          switch (rotatorAnchor) {
            case 'n':
              anchor.x = boxTC.x;
              anchor.y = boxTC.y;
              break;

            case 's':
              anchor.x = boxBC.x;
              anchor.y = boxBC.y;
              factor = -1;
              break;

            case 'w':
              anchor.x = boxML.x;
              anchor.y = boxML.y;
              factor = -1;
              break;

            case 'e':
            default:
              anchor.x = boxMR.x;
              anchor.y = boxMR.y;
              break;
          }

          var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(boxBL.y - boxTL.y, boxBL.x - boxTL.x) : Math.atan2(boxTL.y - boxTR.y, boxTL.x - boxTR.x);
          rotator = {
            x: anchor.x - rotatorOffset * factor * Math.cos(theta),
            y: anchor.y - rotatorOffset * factor * Math.sin(theta)
          };
          var normalLine = showNormal ? createSVGElement('line') : null;

          if (showNormal) {
            normalLine.x1.baseVal.value = anchor.x;
            normalLine.y1.baseVal.value = anchor.y;
            normalLine.x2.baseVal.value = rotator.x;
            normalLine.y2.baseVal.value = rotator.y;
            setLineStyle(normalLine, THEME_COLOR);
            normalLineGroup.appendChild(normalLine);
          }

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
            radius
          };
        }

        var handles = _objectSpread2({}, resizable && resizingHandles, {
          rotator,
          center: rotationPoint && rotatable ? createPoint(container, centerX, centerY) || boxCenter : undefined
        });

        Object.keys(handles).forEach(key => {
          var data = handles[key];
          if (isUndef(data)) return;
          var {
            x,
            y
          } = data;
          var color = key === 'center' ? '#fe3232' : THEME_COLOR;

          if (isDef(custom) && isFunc(custom[key])) {
            handles[key] = custom[key](boxCTM, bBox, pointTo);
          } else {
            handles[key] = createHandler$1(x, y, color, key);
          }

          handlesGroup.appendChild(handles[key]);
        });
        this.storage = {
          wrapper,
          box,
          handles: _objectSpread2({}, handles, {}, rotationHandles),
          parent: el.parentNode
        };
        helper(wrapper).on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
      }

      _destroy() {
        var {
          wrapper
        } = this.storage;
        helper(wrapper).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
        wrapper.parentNode.removeChild(wrapper);
      }

      _cursorPoint(_ref2) {
        var {
          clientX,
          clientY
        } = _ref2;
        var {
          container
        } = this.options;
        return pointTo(container.getScreenCTM().inverse(), clientX, clientY);
      }

      _pointToElement(_ref3) {
        var {
          x,
          y
        } = _ref3;
        var {
          transform
        } = this.storage;
        var {
          ctm
        } = transform;
        var matrix = ctm.inverse();
        matrix.e = matrix.f = 0;
        return this._applyMatrixToPoint(matrix, x, y);
      }

      _pointToControls(_ref4) {
        var {
          x,
          y
        } = _ref4;
        var {
          transform
        } = this.storage;
        var {
          boxCTM
        } = transform;
        var matrix = boxCTM.inverse();
        matrix.e = matrix.f = 0;
        return this._applyMatrixToPoint(matrix, x, y);
      }

      _applyMatrixToPoint(matrix, x, y) {
        var {
          container
        } = this.options;
        var pt = container.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(matrix);
      }

      _apply(actionName) {
        var {
          el: element,
          storage,
          options,
          options: {
            container
          }
        } = this;
        var {
          box,
          handles,
          cached,
          transform
        } = storage;
        var {
          matrix,
          boxCTM,
          bBox,
          ctm
        } = transform;
        var eBBox = element.getBBox();
        var {
          x: elX,
          y: elY,
          width: elW,
          height: elH
        } = eBBox;
        var rotationPoint = isDef(handles.center) ? pointTo(boxCTM, handles.center.cx.baseVal.value, handles.center.cy.baseVal.value) : pointTo(matrix, elX + elW / 2, elY + elH / 2);
        element.setAttribute('data-cx', rotationPoint.x);
        element.setAttribute('data-cy', rotationPoint.y);
        if (isUndef(cached)) return;
        var {
          scaleX,
          scaleY,
          dx,
          dy,
          ox,
          oy
        } = cached;

        if (actionName === 'drag') {
          if (dx === 0 && dy === 0) return;
          var eM = createSVGMatrix();
          eM.e = dx;
          eM.f = dy;
          var translateMatrix = eM.multiply(matrix).multiply(eM.inverse());
          element.setAttribute('transform', matrixToString(translateMatrix));

          if (isGroup(element)) {
            var els = checkChildElements(element);
            els.forEach(child => {
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
          var {
            x,
            y,
            width: newWidth,
            height: newHeight
          } = box.getBBox();
          applyTransformToHandles(storage, options, {
            x,
            y,
            width: newWidth,
            height: newHeight,
            boxMatrix: null
          });

          if (isGroup(element)) {
            var _els = checkChildElements(element);

            _els.forEach(child => {
              if (!isGroup(child)) {
                applyResize(child, {
                  scaleX,
                  scaleY,
                  defaultCTM: child.__ctm__,
                  bBox: bBox,
                  container,
                  storage
                });
              }
            });
          } else {
            applyResize(element, {
              scaleX,
              scaleY,
              defaultCTM: ctm,
              bBox: bBox,
              container,
              storage
            });
          }

          element.setAttribute('transform', matrixToString(matrix));
        }

        this.storage.cached = null;
      }

      _processResize(dx, dy) {
        var {
          el,
          storage,
          options,
          options: {
            proportions
          }
        } = this;
        var {
          left,
          top,
          cw,
          ch,
          transform,
          revX,
          revY,
          doW,
          doH
        } = storage;
        var {
          matrix,
          scMatrix,
          trMatrix,
          scaleX: ptX,
          scaleY: ptY
        } = transform;
        var {
          width: newWidth,
          height: newHeight
        } = el.getBBox();
        var ratio = doW || !doW && !doH ? (cw + dx) / cw : (ch + dy) / ch;
        newWidth = proportions ? cw * ratio : cw + dx;
        newHeight = proportions ? ch * ratio : ch + dy;
        if (Math.abs(newWidth) <= MIN_SIZE$1 || Math.abs(newHeight) <= MIN_SIZE$1) return;
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
          scaleX,
          scaleY
        };
        var finalValues = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        };
        applyTransformToHandles(storage, options, _objectSpread2({}, finalValues, {
          boxMatrix: null
        }));
        return finalValues;
      }

      _processMove(dx, dy) {
        var {
          transform,
          wrapper,
          center
        } = this.storage;
        var {
          matrix,
          trMatrix,
          scMatrix,
          wrapperMatrix,
          parentMatrix
        } = transform;
        scMatrix.e = dx;
        scMatrix.f = dy;
        var moveWrapperMtrx = scMatrix.multiply(wrapperMatrix);
        wrapper.setAttribute('transform', matrixToString(moveWrapperMtrx));
        parentMatrix.e = parentMatrix.f = 0;
        var {
          x,
          y
        } = pointTo(parentMatrix.inverse(), dx, dy);
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
          var {
            x: nx,
            y: ny
          } = pointTo(radiusMatrix, dx, dy);

          this._moveCenterHandle(-nx, -ny);
        }

        return moveElementMtrx;
      }

      _processRotate(radians) {
        var {
          center,
          transform,
          wrapper
        } = this.storage;
        var {
          matrix,
          wrapperMatrix,
          parentMatrix,
          trMatrix,
          scMatrix,
          rotMatrix
        } = transform;
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

      _getState(_ref5) {
        var {
          revX,
          revY,
          doW,
          doH
        } = _ref5;
        var {
          el: element,
          storage,
          options: {
            container
          }
        } = this;
        var {
          box,
          wrapper,
          parent,
          handles: {
            center: cHandle
          }
        } = storage;
        var eBBox = element.getBBox();
        var {
          x: el_x,
          y: el_y,
          width: el_w,
          height: el_h
        } = eBBox;
        var {
          width: cw,
          height: ch,
          x: c_left,
          y: c_top
        } = box.getBBox();
        var elMatrix = getTransformToElement(element, parent),
            ctm = getTransformToElement(element, container),
            boxCTM = getTransformToElement(box.parentNode, container);
        var parentMatrix = getTransformToElement(parent, container);
        var scaleX = el_x + el_w * (doH ? 0.5 : revX ? 1 : 0),
            scaleY = el_y + el_h * (doW ? 0.5 : revY ? 1 : 0);
        var transform = {
          matrix: elMatrix,
          ctm,
          boxCTM,
          parentMatrix,
          wrapperMatrix: getTransformToElement(wrapper, wrapper.parentNode),
          trMatrix: createSVGMatrix(),
          scMatrix: createSVGMatrix(),
          rotMatrix: createSVGMatrix(),
          scaleX,
          scaleY,
          scX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
          scY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
          bBox: eBBox
        };
        var boxCenterX = c_left + cw / 2,
            boxCenterY = c_top + ch / 2;
        var centerX = cHandle ? cHandle.cx.baseVal.value : boxCenterX,
            centerY = cHandle ? cHandle.cy.baseVal.value : boxCenterY; // c-handle's coordinates

        var {
          x: bcx,
          y: bcy
        } = pointTo(boxCTM, centerX, centerY); // element's center coordinates

        var {
          x: elcx,
          y: elcy
        } = isDef(cHandle) ? pointTo(parentMatrix.inverse(), bcx, bcy) : pointTo(elMatrix, el_x + el_w / 2, el_y + el_h / 2); // box's center coordinates

        var {
          x: rcx,
          y: rcy
        } = pointTo(getTransformToElement(box, container), boxCenterX, boxCenterY);
        checkChildElements(element).forEach(child => {
          child.__ctm__ = getTransformToElement(child, container);
        });
        return {
          transform,
          cw,
          ch,
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
          revX,
          revY,
          doW,
          doH
        };
      }

      _moveCenterHandle(x, y) {
        var {
          handles: {
            center,
            radius
          },
          center: {
            hx,
            hy
          }
        } = this.storage;
        if (isUndef(center)) return;
        var mx = hx + x,
            my = hy + y;
        center.cx.baseVal.value = mx;
        center.cy.baseVal.value = my;
        radius.x2.baseVal.value = mx;
        radius.y2.baseVal.value = my;
      }

      resetCenterPoint() {
        var {
          box,
          handles: {
            center,
            radius
          }
        } = this.storage;
        var {
          width: cw,
          height: ch,
          x: c_left,
          y: c_top
        } = box.getBBox();
        var matrix = getTransformToElement(box, box.parentNode);
        var {
          x: cx,
          y: cy
        } = pointTo(matrix, c_left + cw / 2, c_top + ch / 2);
        center.cx.baseVal.value = cx;
        center.cy.baseVal.value = cy;
        center.isShifted = false;
        radius.x2.baseVal.value = cx;
        radius.y2.baseVal.value = cy;
      }

      fitControlsToSize() {
        var {
          el,
          storage: {
            box,
            wrapper
          },
          options: {
            container
          }
        } = this;
        var {
          width,
          height,
          x,
          y
        } = el.getBBox();
        var containerMatrix = getTransformToElement(el, container);
        wrapper.removeAttribute('transform');
        box.setAttribute('transform', matrixToString(containerMatrix));
        applyTransformToHandles(this.storage, this.options, {
          x,
          y,
          width,
          height,
          boxMatrix: containerMatrix
        });
      }

      get controls() {
        return this.storage.wrapper;
      }

    }

    var applyTranslate = (element, _ref6) => {
      var {
        x,
        y
      } = _ref6;
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
            var result = points.map(item => {
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
              path,
              dx: x,
              dy: y
            })]);
            break;
          }
      }

      attrs.forEach(item => {
        element.setAttribute(item[0], item[1]);
      });
    };

    var applyResize = (element, data) => {
      var {
        scaleX,
        scaleY,
        bBox,
        defaultCTM,
        container
      } = data;
      var {
        width: boxW,
        height: boxH
      } = bBox;
      var attrs = [];
      var ctm = getTransformToElement(element, container);
      var localCTM = defaultCTM.inverse().multiply(ctm);

      switch (element.tagName.toLowerCase()) {
        case 'text':
          {
            var x = isDef(element.x.baseVal[0]) ? element.x.baseVal[0].value : Number(element.getAttribute('x')) || 0;
            var y = isDef(element.y.baseVal[0]) ? element.y.baseVal[0].value : Number(element.getAttribute('y')) || 0;
            var {
              x: resX,
              y: resY
            } = pointTo(localCTM, x, y);
            attrs.push(['x', resX + (scaleX < 0 ? boxW : 0)], ['y', resY + (scaleY < 0 ? boxH : 0)]);
            break;
          }

        case 'circle':
          {
            var r = element.r.baseVal.value,
                cx = element.cx.baseVal.value,
                cy = element.cy.baseVal.value,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
            var {
              x: _resX3,
              y: _resY3
            } = pointTo(localCTM, cx, cy);
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
            var {
              x: _resX4,
              y: _resY4
            } = pointTo(localCTM, _x, _y);
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
            var {
              x: cx1,
              y: cy1
            } = pointTo(localCTM, _cx, _cy);
            var scaleMatrix = createSVGMatrix();
            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;
            var {
              x: nRx,
              y: nRy
            } = pointTo(scaleMatrix, rx, ry);
            attrs.push(['rx', Math.abs(nRx)], ['ry', Math.abs(nRy)], ['cx', cx1], ['cy', cy1]);
            break;
          }

        case 'line':
          {
            var resX1 = element.x1.baseVal.value,
                resY1 = element.y1.baseVal.value,
                resX2 = element.x2.baseVal.value,
                resY2 = element.y2.baseVal.value;
            var {
              x: resX1_,
              y: resY1_
            } = pointTo(localCTM, resX1, resY1);
            var {
              x: resX2_,
              y: resY2_
            } = pointTo(localCTM, resX2, resY2);
            attrs.push(['x1', resX1_], ['y1', resY1_], ['x2', resX2_], ['y2', resY2_]);
            break;
          }

        case 'polygon':
        case 'polyline':
          {
            var points = parsePoints(element.getAttribute('points'));
            var result = points.map(item => {
              var {
                x,
                y
              } = pointTo(localCTM, Number(item[0]), Number(item[1]));
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
              path,
              localCTM
            })]);
            break;
          }
      }

      attrs.forEach((_ref7) => {
        var [key, value] = _ref7;
        element.setAttribute(key, value);
      });
    };

    var applyTransformToHandles = (storage, options, data) => {
      var {
        rotatable,
        rotatorAnchor,
        rotatorOffset
      } = options;
      var {
        box,
        handles,
        center
      } = storage;
      var {
        x,
        y,
        width,
        height,
        boxMatrix
      } = data;
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
        center: isDef(handles.center) && !center.isShifted ? boxCenter : undefined
      }; // if (forced) { 
      //     attrs.center = pointTo(
      //         boxCTM, 
      //         center.x, 
      //         center.y
      //     );
      //     console.log(attrs.center);
      // }

      if (rotatable) {
        var anchor = {};
        var factor = 1;

        switch (rotatorAnchor) {
          case 'n':
            anchor.x = attrs.tc.x;
            anchor.y = attrs.tc.y;
            break;

          case 's':
            anchor.x = attrs.bc.x;
            anchor.y = attrs.bc.y;
            factor = -1;
            break;

          case 'w':
            anchor.x = attrs.ml.x;
            anchor.y = attrs.ml.y;
            factor = -1;
            break;

          case 'e':
          default:
            anchor.x = attrs.mr.x;
            anchor.y = attrs.mr.y;
            break;
        }

        var theta = rotatorAnchor === 'n' || rotatorAnchor === 's' ? Math.atan2(attrs.bl.y - attrs.tl.y, attrs.bl.x - attrs.tl.x) : Math.atan2(attrs.tl.y - attrs.tr.y, attrs.tl.x - attrs.tr.x);
        var rotator = {
          x: anchor.x - rotatorOffset * factor * Math.cos(theta),
          y: anchor.y - rotatorOffset * factor * Math.sin(theta)
        };
        var {
          normal,
          radius
        } = handles;

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

        attrs.rotator = rotator;
      }

      x += width < 0 ? width : 0;
      y += height < 0 ? height : 0;
      var boxAttrs = {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height)
      };
      Object.keys(boxAttrs).forEach(attr => {
        box.setAttribute(attr, boxAttrs[attr]);
      });
      Object.keys(attrs).forEach(key => {
        var hdl = handles[key];
        var attr = attrs[key];
        if (isUndef(attr) || isUndef(hdl)) return;
        hdl.setAttribute('cx', attr.x);
        hdl.setAttribute('cy', attr.y);
      });
    };

    var createHandler$1 = (l, t, color, key) => {
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
      Object.keys(items).map(key => {
        handler.setAttribute(key, items[key]);
      });
      return handler;
    };

    var setLineStyle = (line, color) => {
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-dasharray', '3 3');
      line.setAttribute('vector-effect', 'non-scaling-stroke');
    };

    function drag(options, obInstance) {
      if (this.length) {
        var Ob = isDef(obInstance) && obInstance instanceof Observable ? obInstance : new Observable();
        return arrReduce.call(this, (result, item) => {
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

    class Cloneable extends SubjectModel {
      constructor(el, options) {
        super(el);
        this.enable(options);
      }

      _init() {
        var {
          el,
          options
        } = this;
        var $el = helper(el);
        var {
          style,
          appendTo
        } = options;

        var css = _objectSpread2({
          position: 'absolute',
          'z-index': '2147483647'
        }, style);

        this.storage = {
          css,
          parent: isDef(appendTo) ? helper(appendTo)[0] : document.body
        };
        $el.on('mousedown', this._onMouseDown).on('touchstart', this._onTouchStart);
        EVENTS.slice(0, 3).forEach(eventName => {
          this.eventDispatcher.registerEvent(eventName);
        });
      }

      _processOptions(options) {
        var _style = {},
            _appendTo = null,
            _stack = document,
            _onInit = () => {},
            _onMove = () => {},
            _onDrop = () => {},
            _onDestroy = () => {};

        if (isDef(options)) {
          var {
            style,
            appendTo,
            stack,
            onInit,
            onMove,
            onDrop,
            onDestroy
          } = options;
          _style = isDef(style) && typeof style === 'object' ? style : _style;
          _appendTo = appendTo || null;
          var dropZone = isDef(stack) ? helper(stack)[0] : document;
          _onInit = createMethod(onInit);
          _onMove = createMethod(onMove);
          _onDrop = isFunc(onDrop) ? function (evt) {
            var {
              clone
            } = this.storage;
            var result = objectsCollide(clone, dropZone);

            if (result) {
              onDrop.call(this, evt, this.el, clone);
            }
          } : () => {};
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

      _start(_ref) {
        var {
          clientX,
          clientY
        } = _ref;
        var {
          storage,
          el
        } = this;
        var {
          parent,
          css
        } = storage;
        var {
          left,
          top
        } = getOffset(parent);
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

      _moving(_ref2) {
        var {
          clientX,
          clientY
        } = _ref2;
        var {
          storage
        } = this;
        storage.clientX = clientX;
        storage.clientY = clientY;
        storage.doDraw = true;
        storage.doMove = true;
      }

      _end(e) {
        var {
          storage
        } = this;
        var {
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

      _animate() {
        var {
          storage
        } = this;
        storage.frameId = requestAnimFrame(this._animate);
        var {
          doDraw,
          clientX,
          clientY,
          cx,
          cy
        } = storage;
        if (!doDraw) return;
        storage.doDraw = false;

        this._drag({
          dx: clientX - cx,
          dy: clientY - cy
        });
      }

      _processMove(dx, dy) {
        var {
          clone
        } = this.storage;
        var translate = "translate(".concat(dx, "px, ").concat(dy, "px)");
        helper(clone).css({
          transform: translate,
          webkitTranform: translate,
          mozTransform: translate,
          msTransform: translate,
          otransform: translate
        });
      }

      _destroy() {
        var {
          storage,
          proxyMethods,
          el
        } = this;
        if (isUndef(storage)) return;
        helper(el).off('mousedown', this._onMouseDown).off('touchstart', this._onTouchStart);
        proxyMethods.onDestroy.call(this, el);
        delete this.storage;
      }

      disable() {
        this._destroy();
      }

    }

    function clone(options) {
      if (this.length) {
        return arrMap.call(this, item => {
          return new Cloneable(item, options);
        });
      }
    }

    class Subjx extends Helper {
      drag() {
        return drag.call(this, ...arguments);
      }

      clone() {
        return clone.call(this, ...arguments);
      }

    }

    function subjx(params) {
      return new Subjx(params);
    }
    Object.defineProperty(subjx, 'createObservable', {
      value: () => {
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
