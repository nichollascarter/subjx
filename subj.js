/*
 * Move, Rotate, Resize tool
 * Released under the MIT license, 2018
 */

(function(global){
    
        'use strict';
        
        const requestAnimationFrame = global.requestAnimationFrame
            || global.mozRequestAnimationFrame
            || global.webkitRequestAnimationFrame
            || global.msRequestAnimationFrame
            || function(f) {return setTimeout(f, 1000/60);};

        const cancelAnimationFrame = global.cancelAnimationFrame
            || global.mozCancelAnimationFrame
            || function(requestID) {clearTimeout(requestID);};

        const unitEXP = /px|em|%|ex|ch|rem|vh|vw|vmin|vmax|mm|cm|in|pt|pc|deg/;
        const radToDeg = 180/Math.PI;  

        const forEach = Array.prototype.forEach,
                arrSlice = Array.prototype.slice,
                warn = console.warn;
        
        const storage = (function () {
                return 'Subj' + Math.random().toString(32).substr(2, 10);
        })();
        
        class Subject {

                constructor(params) {

                        if (!params) return this;

                        if (typeof params === 'string') {
                                let selector = document.querySelectorAll(params);
                                this.length = selector.length;
                                for (let count = 0; count < this.length; count++) {
                                        this[count] = selector[count];
                                }
                        }
                        else if (params.nodeType === 1 || params === document) {
                                this[0] = params;
                                this.length = 1;
                        }
                        else if (params instanceof Subj || typeof params === 'object') {
                                this.length = params.length;
                                for (let count = 0; count < this.length; count++) {
                                        this[count] = params[count];
                                }
                        }
                        return this;
                }

                draggle(method) {return _draggle.call(this, method)};
                clone(method)  {return _clone.call(this, method)};
                css(property) { return _css.call(this, property)};
                find(node) {return _find.call(this, node)};
                each(fn) {return _each.call(this, fn)};
                on() {return _on.apply(this, arguments)};
                off() {return _off.apply(this, arguments)};
                is(selector) {return _is.call(this, selector)}; 
        }

        const brackets = '<div class="dg-hdl dg-rotator"></div>\n\
                       <div class="dg-hdl dg-hdl-t dg-hdl-l dg-hdl-tl"></div>\n\
                        <div class="dg-hdl dg-hdl-t dg-hdl-r dg-hdl-tr"></div>\n\
                        <div class="dg-hdl dg-hdl-b dg-hdl-r dg-hdl-br"></div>\n\
                        <div class="dg-hdl dg-hdl-b dg-hdl-l dg-hdl-bl"></div>\n\
                        <div class="dg-hdl dg-hdl-t dg-hdl-c dg-hdl-tc"></div>\n\
                        <div class="dg-hdl dg-hdl-b dg-hdl-c dg-hdl-bc"></div>\n\
                        <div class="dg-hdl dg-hdl-m dg-hdl-l dg-hdl-ml"></div>\n\
                        <div class="dg-hdl dg-hdl-m dg-hdl-r dg-hdl-mr"></div>';
        
        function _draggle(method) {

                const methods = {

                        enable: function(options) { 
                                let sel = this;
                                return forEach.call(sel, function(value) {  
                                        if (!value[storage]) {_init(value, options);};
                                        _draw(value, options); 
                                });
                        },

                        disable: function() {
                                let sel = this;
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
                        warn('Method ' +  method + ' does not exist');
                }
                           
                function _init(sel, options) {                   

                        const wrapper = document.createElement('div');
                        addClass(wrapper, 'dg-wrapper');                             
                        sel.parentNode.insertBefore(wrapper, sel);
                        wrapper.appendChild(sel);

                        const container = sel.parentNode;
                        const _sel = Subj(sel);
                                       
                        const w = _sel.css('width'),
                            h = _sel.css('height'),
                            t = _sel.css('top'),
                            l = _sel.css('left');
                    
                        const _parent = Subj(container.parentNode);
                        
                        const css = {           
                                top: t, 
                                left: l,
                                width: toPX(w, _parent.css('width')),
                                height: toPX(h, _parent.css('height')),
                                transform : _sel.css('transform')
                        };                               
                                       
                        const controls = document.createElement('div');
                        controls.innerHTML = brackets;    
                        
                        addClass(controls, 'dg-controls');
                    
                        container.appendChild(controls);  

                        const _controls = Subj(controls);    
                        _controls.css(css);
                        
                        const _container = Subj(container);
                        
                        sel[storage] = {
                                controls: controls,
                                drop : options && options.drop ? options.drop : null,
                                divs: { 
                                        tl : _container.find('.dg-hdl-tl'),
                                        tr : _container.find('.dg-hdl-tr'),
                                        br : _container.find('.dg-hdl-br'),
                                        bl : _container.find('.dg-hdl-bl'),
                                        tc : _container.find('.dg-hdl-tc'),
                                        bc : _container.find('.dg-hdl-bc'),
                                        ml : _container.find('.dg-hdl-ml'),
                                        mr : _container.find('.dg-hdl-mr'),
                                        rotator : _container.find('.dg-rotator')                                      
                                }, 
                                parent : _parent
                        };
                        
                        addClass(sel, 'dg-draggle');                                                                             

                        const down = function (e) {
                                _mouseDown(e, sel);
                        };

                        const touch = function (e) {
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
                        if (e.touches.length === 0) _up(e.changedTouches[0],sel);
                }

                function _mouseDown(e, sel) { 
                        e.stopImmediatePropagation();                                             
                        _down(e, sel);                       
                }

                function _down(e, sel) {
                    
                        const _sel = Subj(sel);
                        const styleList = sel.style;
                        
                        const data = sel[storage];

                        const move = function(e) {
                                e.preventDefault();
                                _move(e,sel);
                        };

                        const touchmove = function(e) {
                                _touchMove(e, sel);
                        };

                        const drop = function(e){  
                                if (data.drop) {
                                        data.drop(e, sel);                                     
                                }                             
                        };

                        const up = function (e) {
                                drop(e);
                                _up(e, sel);                
                                Subj(document).off('mousemove', move);
                                Subj(document).off('mouseup', up);                               
                        };  

                        const touchend = function (e) {
                                drop(e);
                                _onTouchEnd(e, sel);
                                Subj(document).off('touchmove', touchmove);
                                Subj(document).off('touchend', touchend);
                        };
                        
                        data.removeEvents = function () {
                                Subj(document).off('mousemove', move);
                                Subj(document).off('mouseup', up);  
                                Subj(document).off('touchmove', touchmove);
                                Subj(document).off('touchend', touchend);
                        };                              

                        Subj(document).on('mouseup', up);  
                        Subj(document).on('mousemove', move); 

                        Subj(document).on('touchend', touchend);         
                        Subj(document).on('touchmove', touchmove); 
        
                        const coords = _compute(e, sel); 
                 
                        const doResize = coords.onRightEdge || coords.onBottomEdge || coords.onTopEdge || coords.onLeftEdge;

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
                                top : getUnitDimension(styleList.top ? styleList.top: _sel.css('top')),
                                left : getUnitDimension(styleList.left ? styleList.left : _sel.css('left')),
                                width : getUnitDimension(styleList.width ? styleList.width : _sel.css('width')),
                                height : getUnitDimension(styleList.height ? styleList.height : _sel.css('height'))
                        };                       
                }
                
                function _compute(e, sel) {
                    
                        const data = sel[storage];
                        const handle = Subj(e.target);
                        const ctrls = data.controls;
                                               
                        data.pageX = e.pageX; 
                        data.pageY = e.pageY; 
                        data.ctrlKey = e.ctrlKey;
                        data.cx = e.pageX;
                        data.cy = e.pageY;
                        data.tl_off =  offset(data.divs.tl[0]);
                        data.tr_off = offset(data.divs.tr[0]);
                        data.br_off = offset(data.divs.br[0]);
                                           
                        data.refang = Math.atan2(data.tr_off.top - data.tl_off.top, data.tr_off.left - data.tl_off.left);
                                               
                        //reverse axis
                        const revX = handle.is(data.divs.tl) || handle.is(data.divs.ml) || handle.is(data.divs.bl) || handle.is(data.divs.tc);
                        const revY =  handle.is(data.divs.tl) || handle.is(data.divs.tr) || handle.is(data.divs.tc) || handle.is(data.divs.ml);
                        //reverse angle
                        if (handle.is(data.divs.tr) || handle.is(data.divs.bl)) data.refang = -data.refang;

                        data.cw = parseFloat(toPX(ctrls.style.width, data.parent.css('width')));
                        data.ch = parseFloat(toPX(ctrls.style.height, data.parent.css('height')));

                        const c_top = parseFloat(Subj(ctrls).css('top'));
                        const c_left = parseFloat(Subj(ctrls).css('left')); 

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
                                tx : e.pageX - c_left,
                                ty : e.pageY - c_top,                                                         
                                coordY : coords.top,
                                coordX : coords.left,                             
                                handle : handle,
                                rotate : handle.is(data.divs.rotator),
                                onTopEdge : handle.is(data.divs.tl) || handle.is(data.divs.tc) || handle.is(data.divs.tr),
                                onLeftEdge : handle.is(data.divs.tl) || handle.is(data.divs.ml) || handle.is(data.divs.bl),
                                onRightEdge : handle.is(data.divs.tr) || handle.is(data.divs.mr) || handle.is(data.divs.br),
                                onBottomEdge : handle.is(data.divs.br) || handle.is(data.divs.bc) || handle.is(data.divs.bl)     
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
                        Subj(d.controls).css({cursor : 'default'});
                }                       
                
                function rotatedTopLeft(x, y, width, height, rotationAngle, revX, revY){                                                                               

                        // rotation point                           
                        const cx = x + parseFloat(width)/2;   
                        const cy = y + parseFloat(height)/2;

                        // angle of the unrotated TL corner vs the center point
                        const dx = x - cx;
                        const dy = y - cy;

                        const originalTopLeftAngle = Math.atan2(dy,dx);
                        
                        // Add the unrotatedTL + rotationAngle to get total rotation
                        const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

                        // calc the radius of the rectangle (== diagonalLength/2)
                        const radius = Math.sqrt(Math.pow(parseFloat(width)/2,2)+Math.pow(parseFloat(height)/2,2)); 

                        // calc the rotated top & left corner                    
                        let cos = Math.cos(rotatedTopLeftAngle);
                        let sin = Math.sin(rotatedTopLeftAngle);
                        
                        cos = revX === true ? -cos : cos;
                        sin = revY === true ? -sin : sin;
                       
                        const rx = cx + radius*cos;
                        const ry = cy + radius*sin;                     

                        return {top: ry, left: rx};
                } 
                
                function getMousePos(cx, cy, x, y, angle, revX, revY) {
                    
                        const radians = angle;
                        let cos = Math.cos(radians),
                        sin = Math.sin(radians);

                        cos = revX === true ? -cos : cos;
                        sin = revY === true ? -sin : sin;

                        let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
                        let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

                        return {left : nx, top : ny};
                }
                
                function _draw(sel, options) {          

                        function animate() {
                            
                                const pressed = sel[storage];

                                if (!pressed) return;        

                                pressed.frame = requestAnimationFrame(animate);  

                                if (!pressed.redraw) return; 
                                pressed.redraw =  false;
                                
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
                                            
                                                pos = getMousePos(pressed.cx, pressed.cy, pressed.pageX, pressed.pageY, pressed.refang, false, false);
                                 
                                                pressed.pageY = pos.top;
                                                pressed.pageX = pos.left;

                                                y = pressed.pageY - pressed.cy; 
                                                x = pressed.pageX - pressed.cx; 
                                                                                                                                  
                                                let doy = handle.is(pressed.divs.br);
                                                
                                                if (doy) controls.style.height = y + pressed.ch + 'px'; 
                                                controls.style.width = x + pressed.cw + 'px'; 
                                                
                                                revX = false; revY = false;                                                                                                                                                                                                                                                                              
                                            
                                        } else if (handle.is(pressed.divs.tl) || handle.is(pressed.divs.ml)) {
                                            
                                                pos = getMousePos(pressed.cx, pressed.cy, pressed.pageX, pressed.pageY, pressed.refang, false, false);
                                 
                                                pressed.pageY = pos.top;
                                                pressed.pageX = pos.left;

                                                let y = pressed.pageY - pressed.cy; 
                                                let x = pressed.pageX - pressed.cx; 
                                            
                                                let doy = handle.is(pressed.divs.tl);
  
                                                controls.style.width = -x + pressed.cw + 'px'; 
                                                 
                                                if (doy) controls.style.height = -y + pressed.ch + 'px';  
                                                
                                                revX = true; revY = true;                                                                  
                                            
                                        }  else if (handle.is(pressed.divs.tr) || handle.is(pressed.divs.tc)) { 
                                                                                
                                                let dox = handle.is(pressed.divs.tr);
                                                let doy = handle.is(pressed.divs.tc);
                                                
                                                pos = getMousePos(pressed.cx, pressed.cy, pressed.pageX, pressed.pageY, pressed.refang, dox, false);
                                                                                 
                                                pressed.pageY = pos.top;
                                                pressed.pageX = pos.left;

                                                y = pressed.pageY - pressed.cy; 
                                                x = pressed.pageX - pressed.cx; 
                                                
                                                if (dox) y = -y; x = -x;
                                                
                                                controls.style.height = -y + pressed.ch + 'px';                                                                                                 
                                                 
                                                if (dox) controls.style.width = x + pressed.cw + 'px';  
                                                
                                                revX = doy; revY = true;                                                                                                                                                                           
                                        
                                        } else if (handle.is(pressed.divs.bl) || handle.is(pressed.divs.bc)) {
                                                
                                                let dox = handle.is(pressed.divs.bl);
                                                 
                                                pos = getMousePos(pressed.cx,pressed.cy,pressed.pageX,pressed.pageY,pressed.refang,false,dox);
                                 
                                                pressed.pageY = pos.top;
                                                pressed.pageX = pos.left;

                                                y = pressed.pageY - pressed.cy; 
                                                x = pressed.pageX - pressed.cx;  
                                                
                                                controls.style.height = y + pressed.ch + 'px';                                                                                               
                                                 
                                                if (dox) controls.style.width = -x + pressed.cw + 'px';   
                                                
                                                revX = dox; revY = false;                               
                                        } 
                                        
                                        //recalculate coords while dimensions are changing
                                        coords = rotatedTopLeft(pressed.coordX, pressed.coordY, controls.style.width, controls.style.height,pressed.refang,revX,revY);
                                        
                                        let resultY = pressed.coordY*2 - coords.top + 'px',
                                            resultX = pressed.coordX*2 - coords.left + 'px';
                                        
                                        controls.style.top = resultY; 
                                        controls.style.left = resultX;

                                        sel.style.top = fromPX(resultY, pressed.parent.css('height'), d.top);
                                        sel.style.left = fromPX(resultX, pressed.parent.css('width'), d.left);
                                        sel.style.width = fromPX(controls.style.width, pressed.parent.css('width'), d.width);
                                        sel.style.height = fromPX(controls.style.height, pressed.parent.css('height'), d.height);
                                }  
                                
                                if (pressed.doMove) {
                                                                        
                                        let oldTop = parseFloat(Subj(controls).css('top'));
                                        let oldLeft = parseFloat(Subj(controls).css('left'));                                                                           
                                                                                                                                                                                                                                                                                             
                                        let top = pressed.pageY - pressed.y;
                                        let left = pressed.pageX - pressed.x;                                      
                                                                                                                                                                                                  
                                        if (Math.abs(top-oldTop) >= snap) {
                                                controls.style.top = top + 'px'; 
                                        }
                                        
                                         if (Math.abs(left-oldLeft) >= snap) {
                                                controls.style.left = left + 'px';                                                
                                        }
                                                                                                                                                                                          
                                        Subj(pressed.parent).find('.dg-draggle').each(function(){

                                                if (sel !== this) {  

                                                        let _this = this[storage];

                                                        if (Math.abs(top-oldTop) >= snap) {
                                                                _this.controls.style.top = parseFloat(_this.controls.style.top) - (oldTop - top) + 'px';
                                                        }
                                                        if (Math.abs(left-oldLeft) >= snap) {
                                                                _this.controls.style.left = parseFloat(_this.controls.style.left) - (oldLeft - left) + 'px';                        
                                                        }        

                                                        this.style.top = fromPX(_this.controls.style.top, Subj(pressed.parent).css('height'), d.top);
                                                        this.style.left = fromPX(_this.controls.style.left, Subj(pressed.parent).css('width'), d.left);   
                                                }                                                                                                
                                        });                                  
                                   
                                        sel.style.top = fromPX(controls.style.top, Subj(pressed.parent).css('height'), d.top);
                                        sel.style.left = fromPX(controls.style.left, Subj(pressed.parent).css('width'), d.left);                                                                                                                                                 
                                }
                                
                                if (pressed && pressed.doRotate) {
                                       
                                        const offset_ = offset(controls);

                                        const center_x = (offset_.left) + (parseFloat(controls.style.width) / 2);
                                        const center_y = (offset_.top) + (parseFloat(controls.style.height) / 2);                                       

                                        const radians = Math.atan2(pressed.pageY - center_y, pressed.pageX - center_x);
                            
                                        let degree = ((pressed.refang + radians - pressed.pressang) * (radToDeg)); 

                                        let value = 'rotate(' + degree + 'deg)';                                        
                                                                              
                                        const css = {
                                                transform: value,
                                                webkitTranform : value,
                                                mozTransform : value,
                                                msTransform : value,
                                                otransform : value ,
                                                'transform-origin':'50% 50%',     //rotation point - center                                      
                                        };
                                                                               
                                        Subj(controls).css(css);
                                        Subj(sel).css(css);                                      
                                }                             
                        }   
                        
                        animate();
                }

                function _destroy(sel) {
                    
                        const data = sel[storage]; 

                        if (!data) return;
                        cancelAnimationFrame(data.frame);
                        if (data.removeEvents) {data.removeEvents();}
                        Subj(data.controls).off('mousedown');             
                        Subj(data.controls).off('touchstart'); 
                        removeClass(sel, 'dg-draggle');
                        sel.parentNode.parentNode.replaceChild(sel, sel.parentNode);
                        delete sel[storage];
                }
        };
    
        function _clone(method) {

                const methods = {

                        enable: function(options) {    
                                        const sel = this;
                                        return forEach.call(sel, function (value) {  
                                           if (!value[storage]) {_init(value, options);};
                                });                          
                        },

                        disable : function() {
                                        const sel = this;                          
                                        return forEach.call(sel, function (value) {  
                                        _destroy(value);
                                });
                        }		
                };

                if (methods[method]) {
                        return methods[method].apply(this, arrSlice.call(arguments, 1));
                } else if (typeof method === 'object' || !method) {
                        return methods.enable.apply(this, arguments);
                } else {
                        warn('Method ' +  method + ' does not exist');
                }
                return false;

                function _init(sel, options) {

                        sel[storage] = {};

                        const _sel = Subj(sel);

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

                        _sel.on('mousedown', down);    
                        _sel.on('touchstart', touchstart);

                        sel[storage].removeEvents = function() {
                                _sel.off('mousedown', down);    
                                _sel.off('touchstart', touchstart);
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

                        const pos = sel[storage].appendTo ? offset(Subj(sel[storage].appendTo)[0]) : offset(Subj('body')[0]);

                        let css = {};

                        if (!sel[storage].style || sel[storage].style === 'default') {
                                css = { 
                                        width: Subj(sel).css('width'),
                                        height: Subj(sel).css('height'),
                                        margin: 0,
                                        padding: 0,
                                        border: '#32B5FE 1px solid',
                                        background:'transparent',
                                        top: (e.pageY - pos.top) + 'px',
                                        left : (e.pageX - pos.left) + 'px',
                                        position :'absolute'
                                }
                        } else if (sel[storage].style === 'clone') {
                                draggable = sel.cloneNode(true);
                                css = { 
                                        width: Subj(sel).css('width'),
                                        height: Subj(sel).css('height'),
                                        margin: 0,
                                        padding: 0,
                                        top: (e.pageY - pos.top) + 'px',
                                        left : (e.pageX - pos.left) + 'px',
                                        position :'absolute'
                                }
                        } else if (typeof sel[storage].style === 'object') {
                                Object.assign(css, sel[storage].style);
                        }

                        draggable[storage] = {};

                        Subj(draggable).css(css);

                        if (sel[storage].appendTo){
                                Subj(sel[storage].appendTo)[0].appendChild(draggable);
                        } else {
                                Subj('body')[0].appendChild(draggable); 
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

                        const drop = function(evt) {

                                const result = objectsCollide(draggable, Subj(sel[storage].stack)[0]);                

                                if (sel[storage].drop && result) {
                                        sel[storage].drop(evt, sel);
                                }
                        };

                        const up = function(evt) { 
                                drop(evt);
                                // Mouse events remove
                                _up(evt, draggable);                                                                                

                                Subj(document).off('mousemove', move);
                                Subj(document).off('mouseup', up);                              
                        }; 

                        const touchend = function(evt) {
                              drop(evt.changedTouches[0]); 
                              // Mouse events remove
                              _onTouchEnd(evt, draggable);
                              Subj(document).off('touchmove', touchmove);
                              Subj(document).off('touchend', touchend);
                        };  

                        Subj(document).on('mousemove', move);
                        Subj(document).on('mouseup', up);

                        Subj(document).on('touchmove', touchmove);
                        Subj(document).on('touchend', touchend);
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
                                tx : x,
                                ty : y,
                                w : b.width,
                                h : b.height      
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
                        cancelAnimationFrame(d.frameId); 
                        delete drggble[storage];    
                        drggble.parentNode.removeChild(drggble);
                }

                function _draw(draggable) {

                        function animate() {

                                if (!draggable[storage]) return; 

                                draggable[storage].frameId = requestAnimationFrame(animate);

                                const pressed = draggable[storage];               

                                if (!pressed.redraw) return;     
                                pressed.redraw = false;

                                //parent offset
                                const pos = offset(draggable.parentNode);  //sel.data.appendTo ? offset(Subj(sel.data.appendTo)[0]) :
                              
                                // moving
                                Subj(draggable).css({top : (pressed.pageY - pressed.y - pos.top) +'px'});
                                Subj(draggable).css({left : (pressed.pageX - pressed.x - pos.left) + 'px'});

                                let b, x, y; 
                                b = offset(draggable);
                                x = pressed.pageX - b.left; 
                                y = pressed.pageY - b.top;  
                        }

                        animate();
                }

                function _destroy(sel) { 
                        if (!sel[storage]) return;
                        sel[storage].removeEvents();  
                        delete sel[storage];
                }
        }; 
               
        function _css(prop) {

                const methods = {

                        setStyle: function(options) {            
                                const obj = this;            
                                return _setStyle(obj, options);
                        },

                        getStyle: function() {
                               const obj = this;
                               return _getStyle(obj);
                        }		
                };

                if (typeof prop === 'string') {
                        return methods.getStyle.apply(this, arrSlice.call(arguments, 1));
                } else if (typeof prop === 'object' || ! prop) {
                        return methods.setStyle.apply(this, arguments);
                } else {
                        warn('Method ' +  prop + ' does not exist');
                }
                return false;


                function _getStyle(obj){ 

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
        
        function offset(node){
                return node.getBoundingClientRect();         
        };
        
        function _each(fn){ 

                const arr = arrSlice.call(this, 0); 

                for (let index = arr.length - 1; index >= 0; --index) {              
                        let func = function() { 
                            return arr[index];  
                        };               
                        fn.call(func());
                }           
                return this;
        }
        
        function _find(sel){ 

                let len = this.length, selector;

                while (len--) {
                        selector = this[len].querySelectorAll(sel);
                        return Subj(selector);
                } 
        } 
        
        function _on(){

                let len = this.length;    

                while (len--) {

                        if (!this[len].events) {                       
                                this[len].events = {}; 
                                this[len].events[arguments[0]] = [];
                        }

                        if (arguments.length === 2) { 

                                if (document.addEventListener) {
                                        this[len].addEventListener(arguments[0], arguments[1], false);  
                                } else if (document.attachEvent)  {
                                        this[len].attachEvent('on' + arguments[0], arguments[1]);
                                } else {
                                        this[len]['on' + arguments[0]] = arguments[1];
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
                                            this[len].detachEvent('on' + arguments[0], arguments[1]);
                                } else {
                                            this[len]['on' + arguments[0]] = null;
                                }

                        } else if (arguments.length === 3 && typeof(arguments[1]) === 'string') {
                                listenerDelegate(this[len], arguments[0], arguments[1], arguments[2], false);
                        }
                }

                return this;
        }
        
        function _is(selector) {
            
                const _sel = Subj(selector);
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
                        } else if (document.attachEvent)  {
                            el.attachEvent('on' + evt, doit);
                        } else {
                            el['on' + evt] = doit;
                        }    
                } else {
                        if (document.removeEventListener) {
                            el.removeEventListener(evt, doit, false);  
                        }
                        else if (document.detachEvent) {
                            el.detachEvent('on' + evt, doit);
                        } else {
                            el['on' + evt] = null;
                        }                                             
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
      
        function objectsCollide(a, b) { 

                const aTop = offset(a).top,
                        aLeft = offset(a).left,
                        bTop = offset(b).top,
                        bLeft = offset(b).left;       

                return !(
                    ((aTop) < (bTop)) ||
                    (aTop > (bTop + Subj(b).css('height'))) ||
                    ((aLeft) < bLeft) ||
                    (aLeft > (bLeft + Subj(b).css('width')))
                );
        }  
        
        function toPX(value, parent) {
                if (value.match('px')) {
                        return value;
                }
                if (value.match('%')) {
                        return parseFloat(value)*parseFloat(parent)/100 + 'px';
                }
        }

        function fromPX(value, parent, toUnit) {
                if (toUnit.match('px')) {
                        return value;
                }
                if (toUnit.match('%')) {
                        return parseFloat(value)*100/parseFloat(parent) + '%';
                }
        }
        
        function getUnitDimension(value) {  
                return value.match(unitEXP)[0];
        }
      
        global.Subj = function (params) {
                return new Subject(params);
        };

})(window);
