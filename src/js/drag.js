import { Helper } from './helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    forEach,
    arrSlice,
    warn,
    storage,
    offset
} from './common'

const brackets = '<div class="dg-hdl dg-rotator"></div>\n\
            <div class="dg-hdl dg-hdl-t dg-hdl-l dg-hdl-tl"></div>\n\
            <div class="dg-hdl dg-hdl-t dg-hdl-r dg-hdl-tr"></div>\n\
            <div class="dg-hdl dg-hdl-b dg-hdl-r dg-hdl-br"></div>\n\
            <div class="dg-hdl dg-hdl-b dg-hdl-l dg-hdl-bl"></div>\n\
            <div class="dg-hdl dg-hdl-t dg-hdl-c dg-hdl-tc"></div>\n\
            <div class="dg-hdl dg-hdl-b dg-hdl-c dg-hdl-bc"></div>\n\
            <div class="dg-hdl dg-hdl-m dg-hdl-l dg-hdl-ml"></div>\n\
            <div class="dg-hdl dg-hdl-m dg-hdl-r dg-hdl-mr"></div>';

const unitEXP = /px|em|%|ex|ch|rem|vh|vw|vmin|vmax|mm|cm|in|pt|pc|deg/; //supports only px|%
const radToDeg = 180 / Math.PI;

export function _drag(method) {

    const methods = {

        enable: function(options) {
            const sel = this;
            return forEach.call(sel, function(value) {
                if (!value[storage]) {
                    _init(value, options);
                };
                _draw(value, options);
            });
        },

        disable: function() {
            const sel = this;
            forEach.call(sel, function(value) {
                _destroy(value);
            });
            return this;
        },
    };

    if (methods[method]) {
        return methods[method].apply(this, arrSlice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.enable.apply(this, arguments);
    } else {
        warn(`Method ${method} does not exist`);
    }

    function _init(sel, options) {

        const wrapper = document.createElement('div');
        addClass(wrapper, 'dg-wrapper');
        sel.parentNode.insertBefore(wrapper, sel);
        wrapper.appendChild(sel);

        const container = sel.parentNode;
        const _sel = Helper(sel);

        const w = _sel.css('width'),
            h = _sel.css('height'),
            t = _sel.css('top'),
            l = _sel.css('left');

        const _parent = Helper(container.parentNode);

        const css = {
            top: t,
            left: l,
            width: toPX(w, _parent.css('width')),
            height: toPX(h, _parent.css('height')),
            transform: _sel.css('transform')
        };

        const controls = document.createElement('div');
        controls.innerHTML = brackets;

        addClass(controls, 'dg-controls');

        container.appendChild(controls);

        const _controls = Helper(controls);
        _controls.css(css);

        const _container = Helper(container);

        sel[storage] = {
            controls: controls,
            drop: options && options.drop ? options.drop : null,
            divs: {
                tl: _container.find('.dg-hdl-tl'),
                tr: _container.find('.dg-hdl-tr'),
                br: _container.find('.dg-hdl-br'),
                bl: _container.find('.dg-hdl-bl'),
                tc: _container.find('.dg-hdl-tc'),
                bc: _container.find('.dg-hdl-bc'),
                ml: _container.find('.dg-hdl-ml'),
                mr: _container.find('.dg-hdl-mr'),
                rotator: _container.find('.dg-rotator')
            },
            parent: _parent
        };

        addClass(sel, 'dg-drag');

        const down = function(e) {
            _mouseDown(e, sel);
        };

        const touch = function(e) {
            _touchDown(e, sel);
        };

        _controls.on('mousedown', down);
        _controls.on('touchstart', touch);
    }

    function _touchDown(e, sel) {
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

        const _sel = Helper(sel);
        const styleList = sel.style;

        const data = sel[storage];

        const move = function(e) {
            e.preventDefault();
            _move(e, sel);
        };

        const touchmove = function(e) {
            _touchMove(e, sel);
        };

        const drop = function(e) {
            if (data.drop) {
                data.drop(e, sel);
            }
        };

        const up = function(e) {
            drop(e);
            _up(e, sel);
            Helper(document).off('mousemove', move)
                            .off('mouseup', up);
        };

        const touchend = function(e) {
            drop(e);
            _onTouchEnd(e, sel);
            Helper(document).off('touchmove', touchmove)
                            .off('touchend', touchend);
        };

        data.removeEvents = function() {
            Helper(document).off('mousemove', move)
                            .off('mouseup', up)
                            .off('touchmove', touchmove)
                            .off('touchend', touchend);
        };

        Helper(document).on('mouseup', up)
                        .on('mousemove', move)
                        .on('touchend', touchend)
                        .on('touchmove', touchmove);

        const coords = _compute(e, sel);

        const doResize = coords.onRightEdge || 
                        coords.onBottomEdge || 
                        coords.onTopEdge || 
                        coords.onLeftEdge;

        data.x = coords.tx;
        data.y = coords.ty;
        data.w = coords.w;
        data.h = coords.h;
        data.handle = coords.handle;
        data.doRotate = coords.rotate;
        data.coordY = coords.coordY;
        data.coordX = coords.coordX;
        data.doResize = doResize;
        data.doMove = !coords.rotate && !doResize;
        data.onTopEdge = coords.onTopEdge;
        data.onLeftEdge = coords.onLeftEdge;
        data.onRightEdge = coords.onRightEdge;
        data.onBottomEdge = coords.onBottomEdge;

        data.dimens = {
            top: getUnitDimension(styleList.top ? styleList.top : _sel.css('top')),
            left: getUnitDimension(styleList.left ? styleList.left : _sel.css('left')),
            width: getUnitDimension(styleList.width ? styleList.width : _sel.css('width')),
            height: getUnitDimension(styleList.height ? styleList.height : _sel.css('height'))
        };
    }

    function _compute(e, sel) {

        const data = sel[storage];
        const handle = Helper(e.target);
        const ctrls = data.controls;

        data.pageX = e.pageX;
        data.pageY = e.pageY;
        data.ctrlKey = e.ctrlKey;
        data.cx = e.pageX;
        data.cy = e.pageY;
        data.tl_off = offset(data.divs.tl[0]);
        data.tr_off = offset(data.divs.tr[0]);
        data.br_off = offset(data.divs.br[0]);

        data.refang = Math.atan2(data.tr_off.top - data.tl_off.top, data.tr_off.left - data.tl_off.left);

        //reverse axis
        const revX = handle.is(data.divs.tl) || 
                    handle.is(data.divs.ml) || 
                    handle.is(data.divs.bl) || 
                    handle.is(data.divs.tc);

        const revY = handle.is(data.divs.tl) || 
                    handle.is(data.divs.tr) || 
                    handle.is(data.divs.tc) || 
                    handle.is(data.divs.ml);
        //reverse angle
        if (handle.is(data.divs.tr) || handle.is(data.divs.bl)) { data.refang = -data.refang; }

        data.cw = parseFloat(toPX(ctrls.style.width, data.parent.css('width')));
        data.ch = parseFloat(toPX(ctrls.style.height, data.parent.css('height')));

        const c_top = parseFloat(Helper(ctrls).css('top'));
        const c_left = parseFloat(Helper(ctrls).css('left'));

        //get current coordinates considering rotation angle                                                                                                  
        const coords = rotatedTopLeft(c_left,
            c_top,
            data.cw,
            data.ch,
            data.refang,
            revX,
            revY);

        const offset_ = offset(ctrls);

        const center_x = offset_.left + (data.cw / 2);
        const center_y = offset_.top + (data.ch / 2);

        data.pressang = Math.atan2(e.pageY - center_y, e.pageX - center_x);

        return {
            tx: e.pageX - c_left,
            ty: e.pageY - c_top,
            coordY: coords.top,
            coordX: coords.left,
            handle: handle,
            rotate: handle.is(data.divs.rotator),
            onTopEdge: handle.is(data.divs.tl) || handle.is(data.divs.tc) || handle.is(data.divs.tr),
            onLeftEdge: handle.is(data.divs.tl) || handle.is(data.divs.ml) || handle.is(data.divs.bl),
            onRightEdge: handle.is(data.divs.tr) || handle.is(data.divs.mr) || handle.is(data.divs.br),
            onBottomEdge: handle.is(data.divs.br) || handle.is(data.divs.bc) || handle.is(data.divs.bl)
        };
    }

    function _move(e, sel) {

        const data = sel[storage];
        data.pageX = e.pageX;
        data.pageY = e.pageY;
        data.redraw = true;
    }

    function _up(e, sel) {

        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }

        const d = sel[storage];

        d.doResize = false;
        d.doMove = false;
        d.doRotate = false;
        d.redraw = false;
        Helper(d.controls).css({
            cursor: 'default'
        });
    }

    function rotatedTopLeft(x, y, width, height, rotationAngle, revX, revY) {

        // rotation point                  
        const cx = x + parseFloat(width) / 2;
        const cy = y + parseFloat(height) / 2;

        // angle of the unrotated TL corner vs the center point
        const dx = x - cx;
        const dy = y - cy;

        const originalTopLeftAngle = Math.atan2(dy, dx);

        // Add the unrotatedTL + rotationAngle to get total rotation
        const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

        // calc the radius of the rectangle (== diagonalLength/2)
        const radius = Math.sqrt(Math.pow(parseFloat(width) / 2, 2) + Math.pow(parseFloat(height) / 2, 2));

        // calc the rotated top & left corner              
        let cos = Math.cos(rotatedTopLeftAngle);
        let sin = Math.sin(rotatedTopLeftAngle);

        cos = revX === true ? -cos : cos;
        sin = revY === true ? -sin : sin;

        const rx = cx + radius * cos;
        const ry = cy + radius * sin;

        return {
            top: ry,
            left: rx
        };
    }

    function getMousePos(cx, cy, x, y, angle, revX, revY) {

        const radians = angle;
        let cos = Math.cos(radians),
            sin = Math.sin(radians);

        cos = revX === true ? -cos : cos;
        sin = revY === true ? -sin : sin;

        let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

        return {
            left: nx,
            top: ny
        };
    }

    function _draw(sel, options) {

        function animate() {

            const pressed = sel[storage];

            if (!pressed) return;

            pressed.frame = requestAnimFrame(animate);

            if (!pressed.redraw) return;
            pressed.redraw = false;

            let snap = 10;

            if (options && options.snap) {
                snap = options.snap;
            }

            //set controls to local var
            const controls = pressed.controls,
                handle = pressed.handle,
                d = pressed.dimens;

            let coords, revX, revY, x, y, pos;

            if (pressed.doResize) {

                if (handle.is(pressed.divs.br) || handle.is(pressed.divs.mr)) {

                    pos = getMousePos(
                        pressed.cx, 
                        pressed.cy,
                        pressed.pageX,
                        pressed.pageY, 
                        pressed.refang, 
                        false, 
                        false
                    );

                    pressed.pageY = pos.top;
                    pressed.pageX = pos.left;

                    y = pressed.pageY - pressed.cy;
                    x = pressed.pageX - pressed.cx;

                    let doy = handle.is(pressed.divs.br);

                    if (doy) { controls.style.height = `${y + pressed.ch}px`; }
                    controls.style.width = `${x + pressed.cw}px`;

                    revX = false;
                    revY = false;

                } else if (handle.is(pressed.divs.tl) || handle.is(pressed.divs.ml)) {

                    pos = getMousePos(
                        pressed.cx, 
                        pressed.cy, 
                        pressed.pageX, 
                        pressed.pageY, 
                        pressed.refang, 
                        false, 
                        false
                    );

                    pressed.pageY = pos.top;
                    pressed.pageX = pos.left;

                    let y = pressed.pageY - pressed.cy;
                    let x = pressed.pageX - pressed.cx;

                    let doy = handle.is(pressed.divs.tl);

                    controls.style.width = `${-x + pressed.cw}px`;
                    if (doy) { controls.style.height = `${-y + pressed.ch}px`; }

                    revX = true;
                    revY = true;

                } else if (handle.is(pressed.divs.tr) || handle.is(pressed.divs.tc)) {

                    let dox = handle.is(pressed.divs.tr);
                    let doy = handle.is(pressed.divs.tc);

                    pos = getMousePos(
                        pressed.cx, 
                        pressed.cy, 
                        pressed.pageX, 
                        pressed.pageY, 
                        pressed.refang, 
                        dox, 
                        false
                    );

                    pressed.pageY = pos.top;
                    pressed.pageX = pos.left;

                    y = pressed.pageY - pressed.cy;
                    x = pressed.pageX - pressed.cx;

                    if (dox) {y = -y;}
                    x = -x;

                    controls.style.height = `${-y + pressed.ch}px`;
                    if (dox) { controls.style.width = `${x + pressed.cw}px`; }

                    revX = doy;
                    revY = true;

                } else if (handle.is(pressed.divs.bl) || handle.is(pressed.divs.bc)) {

                    let dox = handle.is(pressed.divs.bl);

                    pos = getMousePos(
                        pressed.cx, 
                        pressed.cy, 
                        pressed.pageX, 
                        pressed.pageY, 
                        pressed.refang, 
                        false, 
                        dox
                    );

                    pressed.pageY = pos.top;
                    pressed.pageX = pos.left;

                    y = pressed.pageY - pressed.cy;
                    x = pressed.pageX - pressed.cx;

                    controls.style.height = `${y + pressed.ch}px`;
                    if (dox) { controls.style.width = `${-x + pressed.cw}px`; }

                    revX = dox;
                    revY = false;
                }

                //recalculate coords while dimensions are changing
                coords = rotatedTopLeft(
                    pressed.coordX, 
                    pressed.coordY, 
                    controls.style.width, 
                    controls.style.height, 
                    pressed.refang, 
                    revX, 
                    revY
                );

                let resultY = `${pressed.coordY*2 - coords.top}px`,
                    resultX = `${pressed.coordX*2 - coords.left}px`;

                controls.style.top = resultY;
                controls.style.left = resultX;

                sel.style.top = fromPX(resultY, pressed.parent.css('height'), d.top);
                sel.style.left = fromPX(resultX, pressed.parent.css('width'), d.left);
                sel.style.width = fromPX(controls.style.width, pressed.parent.css('width'), d.width);
                sel.style.height = fromPX(controls.style.height, pressed.parent.css('height'), d.height);
            }

            if (pressed.doMove) {

                let oldTop = parseFloat(Helper(controls).css('top'));
                let oldLeft = parseFloat(Helper(controls).css('left'));

                let top = pressed.pageY - pressed.y;
                let left = pressed.pageX - pressed.x;

                if (Math.abs(top - oldTop) >= snap) {
                    controls.style.top = `${top}px`;
                }

                if (Math.abs(left - oldLeft) >= snap) {
                    controls.style.left = `${left}px`;
                }

                Helper(pressed.parent).find('.dg-drag').each(function() {

                    if (sel !== this) {

                        let _this = this[storage];

                        if (Math.abs(top - oldTop) >= snap) {
                            _this.controls.style.top = `${parseFloat(_this.controls.style.top) - (oldTop - top)}px`;
                        }
                        if (Math.abs(left - oldLeft) >= snap) {
                            _this.controls.style.left = `${parseFloat(_this.controls.style.left) - (oldLeft - left)}px`;
                        }

                        this.style.top = fromPX(_this.controls.style.top, Helper(pressed.parent).css('height'), d.top);
                        this.style.left = fromPX(_this.controls.style.left, Helper(pressed.parent).css('width'), d.left);
                    }
                });

                sel.style.top = fromPX(controls.style.top,Helper(pressed.parent).css('height'), d.top);
                sel.style.left = fromPX( controls.style.left, Helper(pressed.parent).css('width'), d.left);
            }

            if (pressed && pressed.doRotate) {

                const offset_ = offset(controls);

                const center_x = (offset_.left) + (parseFloat(controls.style.width) / 2);
                const center_y = (offset_.top) + (parseFloat(controls.style.height) / 2);

                const radians = Math.atan2(pressed.pageY - center_y, pressed.pageX - center_x);

                const degree = ((pressed.refang + radians - pressed.pressang) * (radToDeg));

                const value = `rotate(${degree}deg)`;

                const css = {
                    transform: value,
                    webkitTranform: value,
                    mozTransform: value,
                    msTransform: value,
                    otransform: value,
                    'transform-origin': '50% 50%', //rotation point - center                          
                };

                Helper(controls).css(css);
                Helper(sel).css(css);
            }
        }
        animate();
    }

    function _destroy(sel) {

        const data = sel[storage];

        if (!data) return;
        cancelAnimFrame(data.frame);
        if (data.removeEvents) {
            data.removeEvents();
        }
        Helper(data.controls).off('mousedown')
                            .off('touchstart');
        removeClass(sel, 'dg-drag');
        sel.parentNode.parentNode.replaceChild(sel, sel.parentNode);
        delete sel[storage];
    }
}

function addClass(node, cls) {
    if (!cls) return;

    if (node.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(function(cl) {
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
            cls.split(/\s+/).forEach(function(cl) {
                return node.classList.remove(cl);
            });
        } else {
            return node.classList.remove(cls);
        }
    }
    return node;
}

function toPX(value, parent) {
    if (value.match('px')) {
        return value;
    }
    if (value.match('%')) {
        return `${parseFloat(value) * parseFloat(parent) / 100}px`;
    }
}

function fromPX(value, parent, toUnit) {
    if (toUnit.match('px')) {
        return value;
    }
    if (toUnit.match('%')) {
        return `${parseFloat(value) * 100 / parseFloat(parent)}%`;
    }
}

function getUnitDimension(value) {
    return value.match(unitEXP)[0];
}