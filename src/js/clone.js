import { Helper } from './helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    forEach,
    arrSlice,
    warn,
    storage,
    offset,
    noop
} from './common'

export function _clone(method) {

    const methods = {

        enable: function(options) {
            const sel = this;
            return forEach.call(sel, function(value) {
                if (!value[storage]) {
                    _init(value, options);
                }
            });
        },

        disable: function() {
            const sel = this;
            return forEach.call(sel, function(value) {
                _destroy(value);
            });
        }
    };

    if (methods[method]) {
        return methods[method].apply(this, arrSlice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.enable.apply(this, arguments);
    } else {
        warn(`Method ${method} does not exist`);
    }
    return false;

    function _init(sel, options) {

        sel[storage] = {};

        const _sel = Helper(sel);

        if (options) {
            Object.assign(sel[storage], options);
        }

        const down = function(e) {
            e.preventDefault();
            _mouseDown(e, sel);
        };
        const touchstart = function(e) {
            e.preventDefault();
            _touchDown(e, sel);
        };

        _sel.on('mousedown', down)
            .on('touchstart', touchstart);

        sel[storage].removeEvents = function() {
            _sel.off('mousedown', down)
                .off('touchstart', touchstart);
        }
    }

    function _touchDown(e, sel) {
        e.stopImmediatePropagation();
        _down(e.touches[0], sel);

    }

    function _touchMove(e, sel) {
        _move(e.touches[0], sel);
    }

    function _onTouchEnd(e, sel) {
        if (e.touches.length === 0) {
            _up(e.changedTouches[0], sel);
        }
    }

    function _mouseDown(e, sel) {
        e.stopImmediatePropagation();
        _down(e, sel);
    }

    function _down(e, sel) {

        let draggable = document.createElement('div');

        const pos = sel[storage].appendTo ? offset(Helper(sel[storage].appendTo)[0]) : offset(Helper('body')[0]);

        let css = {
            width: Helper(sel).css('width'),
            height: Helper(sel).css('height'),
            margin: 0,
            padding: 0,
            top: `${(e.pageY - pos.top)}px`,
            left: `${(e.pageX - pos.left)}px`,
            position: 'absolute'
        };

        if (!sel[storage].style || sel[storage].style === 'default') {
            css.border = '#32B5FE 1px dashed';
            css.background = 'transparent';         
        } else if (sel[storage].style === 'clone') {
            draggable = sel.cloneNode(true);
        } else if (typeof sel[storage].style === 'object') {
            css = Object.assign({}, sel[storage].style);
        }

        draggable[storage] = {};

        Helper(draggable).css(css);

        if (sel[storage].appendTo) {
            Helper(sel[storage].appendTo)[0].appendChild(draggable);
        } else {
            Helper('body')[0].appendChild(draggable);
        }

        const data = draggable[storage];
        const coords = _compute(e, draggable);

        data.x = coords.tx - pos.left;
        data.y = coords.ty - pos.top;
        data.w = coords.w;
        data.h = coords.h;
        data.doMove = true;

        const move = function(evt) {
            if (e.preventDefault) e.preventDefault();
            _move(evt, draggable);
        };

        const touchmove = function(evt) {
            _touchMove(evt, draggable);
        };

        let drop = noop;

        if (sel[storage].drop) {
            drop = function (evt) {
                let result = true;
                if (sel[storage].stack) {
                    result = objectsCollide(draggable, Helper(sel[storage].stack)[0]);
                }
                if (result) {
                    sel[storage].drop(evt, sel);
                }
            }
        }

        const up = function(evt) {
            drop(evt);
            // Mouse events remove
            _up(evt, draggable);
            Helper(document).off('mousemove', move)
                            .off('mouseup', up);
        };

        const touchend = function(evt) {
            drop(evt.changedTouches[0]);
            // Mouse events remove
            _onTouchEnd(evt, draggable);
            Helper(document).off('touchmove', touchmove)
                            .off('touchend', touchend);
        };

        Helper(document).on('mousemove', move)
                        .on('mouseup', up);

        Helper(document).on('touchmove', touchmove)
                        .on('touchend', touchend);
    }

    function _compute(e, drggble) {

        let b, x, y;
        const d = drggble[storage];

        b = offset(drggble);
        x = e.pageX - b.left;
        y = e.pageY - b.top;

        d.pageX = e.pageX;
        d.pageY = e.pageY;

        return {
            tx: x,
            ty: y,
            w: b.width,
            h: b.height
        };
    }

    function _move(e, drggble) {
        if (!drggble[storage]) return;
        const d = drggble[storage];
        d.pageX = e.pageX;
        d.pageY = e.pageY;
        d.redraw = true;
        _draw(drggble);
    }

    function _up(e, drggble) {
        if (!drggble[storage]) return;
        const d = drggble[storage];
        d.redraw = false;
        cancelAnimFrame(d.frameId);
        delete drggble[storage];
        drggble.parentNode.removeChild(drggble);
    }

    function _draw(draggable) {

        function animate() {

            if (!draggable[storage]) return;

            draggable[storage].frameId = requestAnimFrame(animate);

            const pressed = draggable[storage];

            if (!pressed.redraw) return;
            pressed.redraw = false;

            const pos = offset(draggable.parentNode);

            Helper(draggable).css({
                top: `${(pressed.pageY - pressed.y - pos.top)}px`,
                left: `${(pressed.pageX - pressed.x - pos.left)}px`
            });
        }
        animate();
    }

    function _destroy(sel) {
        if (!sel[storage]) return;
        sel[storage].removeEvents();
        delete sel[storage];
    }
}

function objectsCollide(a, b) {

    const aTop = offset(a).top,
        aLeft = offset(a).left,
        bTop = offset(b).top,
        bLeft = offset(b).left;

    return !(
        ((aTop) < (bTop)) ||
        (aTop > (bTop + Helper(b).css('height'))) ||
        ((aLeft) < bLeft) ||
        (aLeft > (bLeft + Helper(b).css('width')))
    );
}