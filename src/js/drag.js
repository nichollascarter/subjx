import { Helper } from './helper'

import {
    requestAnimFrame,
    cancelAnimFrame,
    forEach,
    arrSlice,
    warn,
    storage,
    offset,
    isDef,
    isUndef,
    noop
} from './common'

const brackets = '<div class="dg-hdl dg-rotator"></div>\
            <div class="dg-hdl dg-hdl-t dg-hdl-l dg-hdl-tl"></div>\
            <div class="dg-hdl dg-hdl-t dg-hdl-r dg-hdl-tr"></div>\
            <div class="dg-hdl dg-hdl-b dg-hdl-r dg-hdl-br"></div>\
            <div class="dg-hdl dg-hdl-b dg-hdl-l dg-hdl-bl"></div>\
            <div class="dg-hdl dg-hdl-t dg-hdl-c dg-hdl-tc"></div>\
            <div class="dg-hdl dg-hdl-b dg-hdl-c dg-hdl-bc"></div>\
            <div class="dg-hdl dg-hdl-m dg-hdl-l dg-hdl-ml"></div>\
            <div class="dg-hdl dg-hdl-m dg-hdl-r dg-hdl-mr"></div>';

const unitEXP = /px|em|%|ex|ch|rem|vh|vw|vmin|vmax|mm|cm|in|pt|pc|deg/; //supports only px|%
const radToDeg = 180 / Math.PI;

export default function _drag(method) {

    const methods = {

        enable(options) {
            return forEach.call(this, function(value) {
                if (isUndef(value[storage])) {
                    _init(value, options);
                };
                _draw(value);
            });
        },

        disable() {
            forEach.call(this, function(value) {
                _destroy(value);
            });
            return this;
        }
    };

    if (isDef(methods[method])) {
        return methods[method].apply(this, arrSlice.call(arguments, 1));
    } else if (typeof method === 'object' || isUndef(method)) {
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

        let snap = {
            x: 10,
            y: 10
        };

        let each = {
            move: false,
            resize: false,
            rotate: false,
        }

        if (isDef(options)) {
            if (isDef(options.snap)) {
                snap.x = isUndef(options.snap.x) ? 10 : options.snap.x;
                snap.y = isUndef(options.snap.y) ? 10 : options.snap.y;
            }
            
            if (isDef(options.each)) {
                each.move = options.each.move || false;
                each.resize = options.each.resize || false;
                each.rotate = options.each.rotate || false; 
            }    
        } 

        sel[storage] = {
            controls: controls,
            drop: options && options.drop ? options.drop : null,
            snap: snap,
            each: each,
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

        let drop = noop; 
        if (isUndef(data.drop)) {
            drop = function(e) {  
                data.drop(e, sel);
            };
        }

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

        data.siblings = coords.siblings;
        data.center_x = coords.center_x;
        data.center_y = coords.center_y;
        data.origLeft = snapCandidate(coords.left, data.snap.x);
        data.origTop = snapCandidate(coords.top, data.snap.y);
        data.cw = coords.cw;
        data.ch = coords.ch;
        data.handle = coords.handle;
        data.pressang = coords.pressang;
        data.refang = coords.refang;
        data.coordY = coords.coordY;
        data.coordX = coords.coordX;
        data.doResize = doResize;
        data.doMove = !coords.rotate && !doResize;
        data.doRotate = coords.rotate;
        data.onTopEdge = coords.onTopEdge;
        data.onLeftEdge = coords.onLeftEdge;
        data.onRightEdge = coords.onRightEdge;
        data.onBottomEdge = coords.onBottomEdge;

        data.dimens = {
            top: getUnitDimension(styleList.top || _sel.css('top')),
            left: getUnitDimension(styleList.left || _sel.css('left')),
            width: getUnitDimension(styleList.width || _sel.css('width')),
            height: getUnitDimension(styleList.height || _sel.css('height'))
        };
    }

    function _compute(e, sel) {

        const data = sel[storage],
            handle = Helper(e.target),
            ctrls = data.controls;

        //getting mouse position coordinates
        data.pageX = e.pageX;
        data.pageY = e.pageY;
        data.cx = e.pageX;
        data.cy = e.pageY;
        data.ctrlKey = e.ctrlKey;

        let factor = 1;

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
        if (handle.is(data.divs.tr) || 
            handle.is(data.divs.bl)
        ) { 
            factor = -1;
        }

        const tl_off = offset(data.divs.tl[0]),
            tr_off = offset(data.divs.tr[0]);

        let refang = Math.atan2(
            tr_off.top - tl_off.top, 
            tr_off.left - tl_off.left
        ) * factor;

        const cw = parseFloat(
            toPX(ctrls.style.width, data.parent.css('width'))
        );
        const ch = parseFloat(
            toPX(ctrls.style.height, data.parent.css('height'))
        );

        const c_top = parseFloat(Helper(ctrls).css('top'));
        const c_left = parseFloat(Helper(ctrls).css('left'));

        //getting current coordinates considering rotation angle                                                                                                  
        const coords = rotatedTopLeft(
            c_left,
            c_top,
            cw,
            ch,
            refang,
            revX,
            revY
        );

        const siblings = data.parent.find('.dg-drag');

        siblings.each(function() {
            if (sel !== this) {

                const _data = this[storage];
                const _ctrls = _data.controls;

                const _tl_off = offset(_data.divs.tl[0]),
                    _tr_off = offset(_data.divs.tr[0]);

                const refang = Math.atan2(
                    _tr_off.top - _tl_off.top,
                    _tr_off.left - _tl_off.left
                ) * factor;

                _data.refang = refang;

                _data.origTop = snapCandidate(
                    parseFloat(Helper(this).css('top')), 
                    data.snap.y
                );
                _data.origLeft = snapCandidate(
                    parseFloat(Helper(this).css('left')), 
                    data.snap.x
                );

                _data.cw = parseFloat(
                    toPX(_ctrls.style.width, data.parent.css('width'))
                );
                _data.ch = parseFloat(
                    toPX(_ctrls.style.height, data.parent.css('height'))
                );
        
                const _c_top = parseFloat(Helper(_ctrls).css('top'));
                const _c_left = parseFloat(Helper(_ctrls).css('left'));
        
                //getting current coordinates considering rotation angle                                                                                                  
                const _coords = rotatedTopLeft(
                    _c_left,
                    _c_top,
                    _data.cw,
                    _data.ch,
                    refang,
                    revX,
                    revY
                );

                _data.coordY = _coords.top;
                _data.coordX = _coords.left;
            } 
        });

        const offset_ = offset(ctrls);

        const center_x = offset_.left + cw / 2;
        const center_y = offset_.top + ch / 2;

        const pressang = Math.atan2(
            e.pageY - center_y, 
            e.pageX - center_x
        );

        return {
            siblings: siblings,
            cw: cw,
            ch: ch,
            center_x: center_x,
            center_y: center_y,
            top: c_top,
            left: c_left,
            coordY: coords.top,
            coordX: coords.left,
            handle: handle,
            pressang: pressang, // mouse position angle regarding element's center
            refang: refang, // rotated element angle
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

        // Add the originalTopLeftAngle + rotationAngle to get total rotation
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

    function _draw(sel) {

        function animate() {

            const pressed = sel[storage];

            if (isUndef(pressed)) return;

            pressed.frame = requestAnimFrame(animate);

            if (!pressed.redraw) return;
            pressed.redraw = false;

            const parentTransform = getParentTransform(pressed.parent);

            //set controls to local var
            const controls = pressed.controls,
                handle = pressed.handle,
                d = pressed.dimens,
                scaleX = parentTransform[0] || 1,
                scaleY = parentTransform[3] || 1;

            let snap = pressed.snap,
                moveEach = pressed.each.move,
                resizeEach = pressed.each.resize,
                rotateEach = pressed.each.rotate;

            if (pressed.doResize) {

                let revX, revY, x, y, pos;

                let width = null;
                let height = null;

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

                    y = (pressed.pageY - pressed.cy) / scaleY;
                    x = (pressed.pageX - pressed.cx) / scaleX;

                    let doy = handle.is(pressed.divs.br);

                    if (doy) { height = y + pressed.ch; }
                    width = x + pressed.cw;

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

                    y = - (pressed.pageY - pressed.cy) / scaleY;
                    x = - (pressed.pageX - pressed.cx) / scaleX;

                    let doy = handle.is(pressed.divs.tl);

                    width = x + pressed.cw;
                    if (doy) { height = y + pressed.ch; }

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

                    y = - (pressed.pageY - pressed.cy) / scaleY;
                    x = - (pressed.pageX - pressed.cx) / scaleX;

                    if (dox) {y = -y;}

                    height = y + pressed.ch;
                    if (dox) { width = x + pressed.cw; }

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

                    y = (pressed.pageY - pressed.cy) / scaleY;
                    x = - (pressed.pageX - pressed.cx) / scaleX;

                    height = y + pressed.ch;
                    if (dox) { width = x + pressed.cw; }

                    revX = dox;
                    revY = false;
                }

                processResize(
                    width,
                    height, 
                    controls, 
                    sel, 
                    pressed,
                    revX,
                    revY,
                    snap,
                    d
                );

                if (resizeEach) {
                    pressed.siblings.each(function() {
                        if (sel !== this) {

                            const _ctrls = this[storage].controls;

                            const _w = width !== null ? this[storage].cw + x : null;
                            const _h = height !== null ? this[storage].ch + y : null;

                            processResize(
                                _w,
                                _h,
                                _ctrls,
                                this, 
                                this[storage],
                                revX,
                                revY,
                                snap,
                                d
                            );
                        }
                    });
                }
            }

            if (pressed.doMove) {

                const diffTop = (pressed.pageY - pressed.cy) / scaleY, 
                    diffLeft = (pressed.pageX - pressed.cx) / scaleX; 
                    
                processMove(
                    pressed.origTop + diffTop, 
                    pressed.origLeft + diffLeft,
                    controls, 
                    sel, 
                    pressed.parent, 
                    snap, 
                    d
                );

                if (moveEach) {
                    pressed.siblings.each(function() {
                        if (sel !== this) {
                            const _ctrls = this[storage].controls;

                            processMove(
                                this[storage].origTop + diffTop, 
                                this[storage].origLeft + diffLeft,
                                _ctrls, 
                                this, 
                                pressed.parent, 
                                snap, 
                                d
                            );
                        }
                    });
                }
            }

            if (pressed.doRotate) {

                const radians = Math.atan2(
                    pressed.pageY - pressed.center_y, 
                    pressed.pageX - pressed.center_x
                ) - pressed.pressang;

                processRotate(
                    radians + pressed.refang,
                    controls, 
                    sel
                );

                if (rotateEach) {
                    pressed.siblings.each(function() {
                        if (sel !== this) {
                            const _ctrls = this[storage].controls;

                            processRotate(
                                radians + this[storage].refang, 
                                _ctrls, 
                                this
                            );
                        }
                    });
                }
            }
        }
        animate();
    }

    function processResize(
        width, 
        height, 
        ctrls, 
        sel, 
        pressed, 
        revX, 
        revY, 
        snap, 
        d
    ) {

        if (width !== null) {
            setParam(ctrls, width, snap.x, 'width');
        }

        if (height !== null) {
            setParam(ctrls, height, snap.y, 'height');
        }

        //recalculate coords while dimensions are changing
        const coords = rotatedTopLeft(
            pressed.coordX, 
            pressed.coordY, 
            ctrls.style.width,
            ctrls.style.height, 
            pressed.refang, 
            revX, 
            revY
        );

        const resultY = `${pressed.coordY*2 - coords.top}px`,
            resultX = `${pressed.coordX*2 - coords.left}px`;

        ctrls.style.top = resultY;
        ctrls.style.left = resultX;

        sel.style.top = fromPX(resultY, pressed.parent.css('height'), d.top);
        sel.style.left = fromPX(resultX, pressed.parent.css('width'), d.left);
        sel.style.width = fromPX(ctrls.style.width, pressed.parent.css('width'), d.width);
        sel.style.height = fromPX(ctrls.style.height, pressed.parent.css('height'), d.height);
    }

    function processMove(
        top,
        left,
        ctrls, 
        sel, 
        parent, 
        snap, 
        d
    ) {
        setParam(ctrls, top, snap.y, 'top');
        setParam(ctrls, left, snap.x, 'left');

        sel.style.top = fromPX(
            ctrls.style.top, 
            parent.css('height'), 
            d.top
        );
        sel.style.left = fromPX(
            ctrls.style.left, 
            parent.css('width'), 
            d.left
        );
    }

    function processRotate(radians, ctrls, sel) {
        
        const degree = radians * radToDeg;
        const value = `rotate(${degree}deg)`;

        const css = {
            transform: value,
            webkitTranform: value,
            mozTransform: value,
            msTransform: value,
            otransform: value                        
        };

        Helper(ctrls).css(css);
        Helper(sel).css(css);
    }

    function setParam(ctrls, value, snap, param) {

        if (snap === 0) {
            ctrls.style[param] = `${value}px`;
        } else {
            const result = snapCandidate(value, snap);

            if (result - value < snap) {
                ctrls.style[param] = `${result}px`;
            }
        }
    }

    function snapCandidate(value, gridSize) {
        if (gridSize === 0) return value
        return gridSize * Math.round(value / gridSize);
    }

    function getParentTransform(el) {

        const transform = el.css('-webkit-transform') ||
            el.css('-moz-transform') ||
            el.css('-ms-transform') ||
            el.css('-o-transform') ||
            el.css('transform') ||
            'none';
        return transform.match(/\d+\.?\d+|\d+/g) || [];
    }

    function _destroy(sel) {

        const data = sel[storage];

        if (isUndef(data)) return;
        cancelAnimFrame(data.frame);
        if (isDef(data.removeEvents)) {
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
    if (/px/.test(value)) {
        return value;
    }
    if (/%/.test(value)) {
        return `${parseFloat(value) * parseFloat(parent) / 100}px`;
    }
}

function fromPX(value, parent, toUnit) {
    if (/px/.test(toUnit)) {
        return value;
    }
    if (/%/.test(toUnit)) {
        return `${parseFloat(value) * 100 / parseFloat(parent)}%`;
    }
}

function getUnitDimension(value) {
    return value.match(unitEXP)[0];
}