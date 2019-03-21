import {
    arrSlice,
    warn
} from './util/util'

export class Helper_ {

    constructor(params) {

        if (!params) return this;

        if (typeof params === 'string') {
            let selector = document.querySelectorAll(params);
            this.length = selector.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = selector[count];
            }
        } else if (params.nodeType === 1 || params === document) {
            this[0] = params;
            this.length = 1;
        } else if (params instanceof Subjx || typeof params === 'object') {
            this.length = params.length;
            for (let count = 0; count < this.length; count++) {
                this[count] = params[count];
            }
        } else if (Array.isArray(params)) {
            this.length = 0;
            for (let count = 0; count < this.length; count++) {
                if (params.nodeType === 1) {
                    this[count] = params[count];
                    this.length++;
                }
            }
        }
        return this;
    }

    css(property) {
        return _css.call(this, property);
    }
    find(node) {
        return _find.call(this, node);
    }
    each(fn) {
        return _each.call(this, fn);
    }
    on() {
        return _on.apply(this, arguments);
    }
    off() {
        return _off.apply(this, arguments);
    }
    is(selector) {
        return _is.call(this, selector);
    }
}

function _css(prop) {

    const methods = {
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
        warn(`Method ${prop} does not exist`);
    }
    return false;


    function _getStyle(obj) {

        let len = obj.length;

        while (len--) {
            if (obj[len].currentStyle) {
                return obj[len].currentStyle[prop];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(obj[len], '')[prop];
            } else {
                return obj[len].style[prop];
            }
        }
    }

    function _setStyle(obj, options) {

        let len = obj.length;

        while (len--) {
            for (let property in options) {
                obj[len].style[property] = options[property];
            }
        }
        return obj.style;
    }
}

function _each(fn) {

    const arr = arrSlice.call(this, 0);

    for (let index = arr.length - 1; index >= 0; --index) {
        let func = function() {
            return arr[index];
        };
        fn.call(func());
    }
    return this;
}

function _find(sel) {

    let len = this.length,
        selector;

    while (len--) {
        selector = this[len].querySelectorAll(sel);
        return Helper(selector);
    }
}

function _on() {

    let len = this.length;

    while (len--) {

        if (!this[len].events) {
            this[len].events = {};
            this[len].events[arguments[0]] = [];
        }

        if (arguments.length === 2) {

            if (document.addEventListener) {
                this[len].addEventListener(arguments[0], arguments[1], false);
            } else if (document.attachEvent) {
                this[len].attachEvent(`on${arguments[0]}`, arguments[1]);
            } else {
                this[len][`on${arguments[0]}`] = arguments[1];
            }

        } else if (arguments.length === 3 && typeof(arguments[1]) === 'string') {
            listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], true);
        }
    }
    return this;
}

function _off() {

    let len = this.length;

    while (len--) {

        if (!this[len].events) {
            this[len].events = {};
            this[len].events[arguments[0]] = [];
        }

        if (arguments.length === 2) {
            if (document.removeEventListener) {
                this[len].removeEventListener(arguments[0], arguments[1], false);
            } else if (document.detachEvent) {
                this[len].detachEvent(`on${arguments[0]}`, arguments[1]);
            } else {
                this[len][`on${arguments[0]}`] = null;
            }

        } else if (arguments.length === 3 && typeof(arguments[1]) === 'string') {
            listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], false);
        }
    }

    return this;
}

function _is(selector) {

    const _sel = Helper(selector);
    let len = this.length;

    while (len--) {
        if (this[len] === _sel[len]) return true;
    }
    return false;
}

function listenerDelegate(el, evt, sel, handler, act) {

    const doit = function(event) {
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
            el.addEventListener(evt, doit, false);
        } else if (document.attachEvent) {
            el.attachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = doit;
        }
    } else {
        if (document.removeEventListener) {
            el.removeEventListener(evt, doit, false);
        } else if (document.detachEvent) {
            el.detachEvent(`on${evt}`, doit);
        } else {
            el[`on${evt}`] = null;
        }
    }
}

export function Helper(params) {
    return new Helper_(params);
}