import { Helper } from '../helper'
import Subject from './subject'

import { 
    addClass,
    getTransform,
    parseMatrix,
    getOffset
} from '../util/css-util'

import {
    rotatedTopLeft,
    toPX,
    fromPX,
    getUnitDimension,
    floatToFixed
} from './common'

const MIN_SIZE = 2;
const BRACKETS = `
        <div class="dg dg-normal"></div>
        <div class="dg-hdl dg-hdl-t dg-hdl-l dg-hdl-tl"></div>
        <div class="dg-hdl dg-hdl-t dg-hdl-r dg-hdl-tr"></div>
        <div class="dg-hdl dg-hdl-b dg-hdl-r dg-hdl-br"></div>
        <div class="dg-hdl dg-hdl-b dg-hdl-l dg-hdl-bl"></div>
        <div class="dg-hdl dg-hdl-t dg-hdl-c dg-hdl-tc"></div>
        <div class="dg-hdl dg-hdl-b dg-hdl-c dg-hdl-bc"></div>
        <div class="dg-hdl dg-hdl-m dg-hdl-l dg-hdl-ml"></div>
        <div class="dg-hdl dg-hdl-m dg-hdl-r dg-hdl-mr"></div>
        <div class="dg-hdl dg-rotator"></div>`;

export default class Draggable extends Subject {

    constructor(el, options, Observable) {
        super(el, Observable);
        this.enable(options);
    }

    _init(item) {
        _init.call(this, item);
    }

    _destroy(item) {
        _destroy.call(this, item);
    }

    _drag() {
        processMove.call(this, ...arguments);
    }

    _rotate() {
        processRotate.call(this, ...arguments);
    }

    _resize() {
        processResize.call(this, ...arguments);
    }

    _compute() {
        return _compute.call(this, ...arguments);
    }

    _pointToElement(data) {

        const {
            transform,
        } = this.storage;

        const { 
            x, 
            y 
        } = data;

        const ctm = [...transform.matrix];
        ctm[4] = ctm[5] = 0;

        return multiplyMatrixAndPoint(
            {
                x,
                y
            },
            matrixInvert(ctm)
        );
    }

    _cursorPoint(e) {

        const { 
            container
        } = this.storage;

        const globalMatrix = parseMatrix(
            getTransform(Helper(container))
        );

        return multiplyMatrixAndPoint(
            {
                x: e.clientX,
                y: e.clientY
            },
            matrixInvert(
                globalMatrix
            )
        );
    }

    _apply() {

        const {
            storage,
            el
        } = this;

        const _el = Helper(el);

        const {
            cached,
            parent,
            dimens,
            controls
        } = storage;

        if (!cached) return;

        const matrix = [...cached];

        const pW = parent.css('width'),
            pH = parent.css('height');

        const diffLeft = matrix[4];
        const diffTop = matrix[5];

        matrix[4] = 0;
        matrix[5] = 0;

        const css = matrixToCSS(matrix);

        const left = parseFloat(
            toPX(
                _el[0].style.left || _el.css('left'),
                pW
            )
        );

        const top = parseFloat(
            toPX(
                _el[0].style.top || _el.css('top'), 
                pH
            )
        );

        css.left = fromPX(
            left + diffLeft + 'px', 
            pW,
            dimens.left
        );

        css.top = fromPX(
            top + diffTop + 'px', 
            pH,
            dimens.top
        );

        _el.css(css);
        Helper(controls).css(css);

        this.storage.cached = null;
    }

    onGetState(data) {

        const store = this.storage;

        const recalc = getState.call(
            this,
            data
        );

        Object.keys(recalc).forEach(key => {
            store[key] = recalc[key];
        });
    }
}

function _init(sel) {

    const { storage } = this;

    const container = document.createElement('div');

    addClass(container, 'dg-wrapper');
    sel.parentNode.insertBefore(container, sel);

    const _sel = Helper(sel);

    const {
        left,
        top,
        width,
        height
    } = sel.style;

    const w = width || _sel.css('width'),
        h = height || _sel.css('height'),
        t = top || _sel.css('top'),
        l = left || _sel.css('left');

    const _parent = Helper(container.parentNode);

    const css = {
        top: t,
        left: l,
        width: w,
        height: h,
        transform: getTransform(_sel)
    };

    const controls = document.createElement('div');
    controls.innerHTML = BRACKETS;
    
    addClass(controls, 'dg-controls');

    container.appendChild(controls);

    const _controls = Helper(controls);
    _controls.css(css);

    const _container = Helper(container);

    Object.assign(storage, {
        controls,
        handles: {
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
    });

    _controls.on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
}

function _destroy() {

    const { 
        controls,
        container 
    } = this.storage;

    Helper(controls).off('mousedown', this._onMouseDown)
                    .off('touchstart', this._onTouchStart);

    container.removeChild(controls.parentNode);
}

function _compute(e) {

    const {
        handles,
    } = this.storage;

    const handle = Helper(e.target);

    //reverse axis
    const revX = handle.is(handles.tl) || 
                handle.is(handles.ml) || 
                handle.is(handles.bl) || 
                handle.is(handles.tc);

    const revY = handle.is(handles.tl) || 
                handle.is(handles.tr) || 
                handle.is(handles.tc) || 
                handle.is(handles.ml);
            
    const onTopEdge = handle.is(handles.tl) || handle.is(handles.tc) || handle.is(handles.tr),
        onLeftEdge = handle.is(handles.tl) || handle.is(handles.ml) || handle.is(handles.bl),
        onRightEdge = handle.is(handles.tr) || handle.is(handles.mr) || handle.is(handles.br),
        onBottomEdge = handle.is(handles.br) || handle.is(handles.bc) || handle.is(handles.bl);

    //reverse angle
    const factor = handle.is(handles.tr) || 
                    handle.is(handles.bl) 
                ? -1
                : 1;

    const _computed = getState.call(this, {
        factor,
        revX, 
        revY
    });

    const { 
        x: clientX, 
        y: clientY
    } = this._cursorPoint(e);

    const pressang = Math.atan2(
        clientY - _computed.center.y,
        clientX - _computed.center.x
    );

    _computed.onTopEdge = onTopEdge;
    _computed.onLeftEdge = onLeftEdge;
    _computed.onRightEdge = onRightEdge;
    _computed.onBottomEdge = onBottomEdge;
    _computed.handle = handle;
    _computed.pressang = pressang;
    
    return _computed; 
}

function getState(params) {

    const {
        factor,
        revX,
        revY
    } = params;

    const {
        el,
        storage
    } = this;

    const {
        handles,
        controls,
        parent
    } = storage;

    const tl_off = getOffset(handles.tl[0]),
        tr_off = getOffset(handles.tr[0]);

    const refang = Math.atan2(
        tr_off.top - tl_off.top, 
        tr_off.left - tl_off.left
    ) * factor;

    const cw = parseFloat(
        toPX(controls.style.width, parent.css('width'))
    );
    const ch = parseFloat(
        toPX(controls.style.height, parent.css('height'))
    );

    const offset_ = getOffset(controls);

    const center_x = offset_.left + cw / 2,
        center_y = offset_.top + ch / 2;

    const _el = Helper(el);
    const styleList = el.style;

    const dimens = {
        top: getUnitDimension(styleList.top || _el.css('top')),
        left: getUnitDimension(styleList.left || _el.css('left')),
        width: getUnitDimension(styleList.width || _el.css('width')),
        height: getUnitDimension(styleList.height || _el.css('height'))
    };

    const transform = {
        matrix: parseMatrix(
            getTransform(Helper(controls))
        ),
        parentMatrix: parseMatrix(
            getTransform(parent)
        )
    };

    const ctm = [...transform.matrix];
    ctm[4] = 0;
    ctm[5] = 0;

    //getting current coordinates considering rotation angle                                                                                                  
    const coords = rotatedTopLeft(
        transform.matrix[4],
        transform.matrix[5],
        cw,
        ch,
        refang,
        revX,
        revY
    );

    return {
        transform,
        cw,
        ch,
        coords,
        center: {
            x: center_x,
            y: center_y
        },
        factor,
        refang,
        revX,
        revY,
        dimens
    }
}

function processResize(
   dx,
   dy
) {
    const {
        el,
        storage
    } = this;

    const {
        controls,
        coords,
        cw,
        ch,
        dimens,
        parent,
        transform,
        refang,
        revX,
        revY
    } = storage;

    const { style } = controls;

    const newWidth = cw + dx,
        newHeight = ch + dy;

    if (newWidth < MIN_SIZE || newHeight < MIN_SIZE) return;

    style.width = `${newWidth}px`;
    style.height = `${newHeight}px`;

    const matrix = [...transform.matrix];
                                                                                                
    const newCoords = rotatedTopLeft(
        matrix[4],
        matrix[5],
        newWidth,
        newHeight,
        refang,
        revX,
        revY
    );

    matrix[4] -= (newCoords.left - coords.left);
    matrix[5] -= (newCoords.top - coords.top);
    
    const css = matrixToCSS(matrix);

    Helper(controls).css(css);

    css.width = fromPX(
        style.width, 
        parent.css('width'), 
        dimens.width
    );

    css.height = fromPX(
        style.height, 
        parent.css('height'), 
        dimens.height
    );

    Helper(el).css(css);
    storage.cached = matrix;
}

function processMove(
    dx,
    dy
) {
    const {
        el,
        storage
    } = this;

    const {
        controls,
        transform
    } = storage;

    const {
        matrix,
        parentMatrix
    } = transform;

    const pctm = [...parentMatrix];
    pctm[4] = pctm[5] = 0;

    const { x, y } = multiplyMatrixAndPoint(
        {
            x: dx,
            y: dy
        },
        matrixInvert(pctm)
    );

    const n_matrix = [...matrix]; 

    n_matrix[4] = matrix[4] + dx;
    n_matrix[5] = matrix[5] + dy;
        
    const css = matrixToCSS(n_matrix);

    Helper(controls).css(css);
    Helper(el).css(css);

    storage.cached = n_matrix;
}

function processRotate(radians) {

    const {
        el,
        storage
    } = this;

    const {
        controls,
        transform
    } = storage;

    const {
        matrix
    } = transform;

    const cos = floatToFixed(Math.cos(radians)),
        sin = floatToFixed(Math.sin(radians));

    const rotMatrix = [
        cos,
        sin,
        -sin,
        cos,
        0,
        0
    ];

    const resMatrix = multiplyMatrix(rotMatrix, matrix);
    const css = matrixToCSS(resMatrix);

    Helper(controls).css(css);
    Helper(el).css(css);

    storage.cached = resMatrix;
}

function matrixToCSS(arr) {

    const style = `matrix(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style                     
    }
}

function multiplyMatrixAndPoint(point, matrix) {

    const {
        x, y
    } = point;

    const [ a, b, c, d, e, f ] = matrix;

    return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
    };
}

//http://blog.acipo.com/matrix-inversion-in-javascript/
function matrixInvert(ctm) {
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    const M = [
        [ctm[0], ctm[2], ctm[4]],
        [ctm[1], ctm[3], ctm[5]],
        [0, 0, 1]
    ];

    //if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
        return;
    }

    //create the identity matrix (I), and a copy (C) of the original
    const dim = M.length;

    const I = [],
        C = [];

    for (let i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];
        for (let j = 0; j < dim; j += 1) {

            //if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            }

            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }

    // Perform elementary row operations
    for (let i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        let e = C[i][i];

        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if (e === 0) {
            //look through every row below the i'th row
            for (let ii = i + 1; ii < dim; ii += 1) {
                //if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] !== 0) {
                    //it would make the diagonal have a non-0 so swap it
                    for (let j = 0; j < dim; j++) {
                        e = C[i][j]; //temp store i'th row
                        C[i][j] = C[ii][j]; //replace i'th row by ii'th
                        C[ii][j] = e; //repace ii'th by temp
                        e = I[i][j]; //temp store i'th row
                        I[i][j] = I[ii][j]; //replace i'th row by ii'th
                        I[ii][j] = e; //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if (e === 0) {
                return
            }
        }

        // Scale this row down by e (so we have a 1 on the diagonal)
        for (let j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix
            I[i][j] = I[i][j] / e; //apply to identity
        }

        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for (let ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            }

            // We want to change this element to 0
            e = C[ii][i];

            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for (let j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix
                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    }

    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return [
        I[0][0], I[1][0],
        I[0][1], I[1][1],
        I[0][2], I[1][2]
    ];
}

function multiplyMatrix(mtrx1, mtrx2) {

    const m1 =  [
        [mtrx1[0], mtrx1[2], mtrx1[4]],
        [mtrx1[1], mtrx1[3], mtrx1[5]],
        [0, 0, 1]
    ];

    const m2 =  [
        [mtrx2[0], mtrx2[2], mtrx2[4]],
        [mtrx2[1], mtrx2[3], mtrx2[5]],
        [0, 0, 1]
    ];

    const result = [];

    for(let j = 0; j < m2.length; j++) {
        result[j] = [];
        for(let k = 0; k < m1[0].length; k++) {
            let sum = 0;
            for(let i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
            result[j].push(sum);
        }
    }

    return [
        result[0][0], result[1][0], 
        result[0][1], result[1][1], 
        result[0][2], result[1][2]
    ];
}