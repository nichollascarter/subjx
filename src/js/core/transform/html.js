import { helper } from '../Helper';
import Subject from './Subject';

import {
    addClass,
    getTransform,
    parseMatrix,
    getOffset
} from '../util/css-util';

import {
    rotatedTopLeft,
    floatToFixed
} from './common';

import {
    isDef,
    isUndef
} from '../util/util';

const MIN_SIZE = 2;
const CENTER_DELTA = 7;

export default class Draggable extends Subject {

    constructor(el, options, Observable) {
        super(el, Observable);
        this.enable(options);
    }

    _init(el) {
        const container = document.createElement('div');

        addClass(container, 'sjx-wrapper');
        el.parentNode.insertBefore(container, el);

        const $el = helper(el);

        const { options } = this;

        const {
            rotationPoint,
        } = options;

        const {
            left,
            top,
            width,
            height
        } = el.style;

        const w = width || $el.css('width'),
            h = height || $el.css('height'),
            t = top || $el.css('top'),
            l = left || $el.css('left');

        const $parent = helper(container.parentNode);

        const css = {
            top: t,
            left: l,
            width: w,
            height: h,
            transform: getTransform($el)
        };

        const controls = document.createElement('div');

        const handles = {
            normal: ['sjx-hdl', 'sjx-normal'],
            tl: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-l', 'sjx-hdl-tl'],
            tr: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-r', 'sjx-hdl-tr'],
            br: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-r', 'sjx-hdl-br'],
            bl: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-l', 'sjx-hdl-bl'],
            tc: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-c', 'sjx-hdl-tc'],
            bc: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-c', 'sjx-hdl-bc'],
            ml: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-l', 'sjx-hdl-ml'],
            mr: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-r', 'sjx-hdl-mr'],
            center: rotationPoint ? ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc'] : undefined,
            //...(rotationPoint && { center: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc']}), IE11 not supports
            rotator: ['sjx-hdl', 'sjx-hdl-m', 'sjx-rotator']
        };

        Object.keys(handles).forEach(key => {
            const data = handles[key];
            if (isUndef(data)) return;
            const handler = createHandler(data);
            handles[key] = handler;
            controls.appendChild(handler);
        });

        if (isDef(handles.center)) {
            const cHandle = helper(handles.center);
            cHandle.css({
                left: `${el.getAttribute('data-cx')}px`,
                top: `${el.getAttribute('data-cy')}px`,
                'border-color': 'rgb(254, 50, 50)',
                'background-color': 'rgb(254, 50, 50, 0.2)'
            });
        }

        addClass(controls, 'sjx-controls');

        container.appendChild(controls);

        const $controls = helper(controls);
        $controls.css(css);

        const $container = helper(container);

        this.storage = {
            controls,
            handles,
            radius: $container.find('.sjx-radius'),
            parent: $parent
        };

        $controls
            .on('mousedown', this._onMouseDown)
            .on('touchstart', this._onTouchStart);
    }

    _destroy() {
        const {
            controls
        } = this.storage;

        helper(controls)
            .off('mousedown', this._onMouseDown)
            .off('touchstart', this._onTouchStart);

        const wrapper = controls.parentNode;
        wrapper.parentNode.removeChild(wrapper);
    }

    _compute(e) {
        const {
            handles,
        } = this.storage;

        const handle = helper(e.target);

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

        const _computed = this._getState({
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

        return this._applyMatrixToPoint(
            matrixInvert(ctm),
            x,
            y
        );
    }

    _pointToControls(data) {
        return this._pointToElement(data);
    }

    _applyMatrixToPoint(matrix, x, y) {
        return multiplyMatrixAndPoint(
            {
                x,
                y
            },
            matrix
        );
    }

    _cursorPoint(e) {
        const {
            container
        } = this.options;

        const globalMatrix = parseMatrix(
            getTransform(helper(container))
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
            el,
            storage
        } = this;

        const $el = helper(el);

        const {
            cached,
            controls,
            transform,
            handles
        } = storage;

        const $controls = helper(controls);

        const cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));

        const hW = cw / 2,
            hH = ch / 2;

        const {
            center: cHandle
        } = handles;

        const isDefCenter = isDef(cHandle);

        const centerX = isDefCenter
                ? parseFloat(helper(cHandle).css('left'))
                : hW,
            centerY = isDefCenter
                ? parseFloat(helper(cHandle).css('top'))
                : hH;

        el.setAttribute('data-cx', centerX);
        el.setAttribute('data-cy', centerY);

        if (isUndef(cached)) return;

        const { dx, dy } = cached;

        const css = matrixToCSS(transform.matrix);

        const left = parseFloat(
            el.style.left || $el.css('left'),
        );

        const top = parseFloat(
            el.style.top || $el.css('top'),
        );

        css.left = `${left + dx}px`;
        css.top = `${top + dy}px`;

        $el.css(css);
        $controls.css(css);

        this.storage.cached = null;
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            options
        } = this;

        const {
            proportions
        } = options;

        const {
            controls,
            coords,
            cw,
            ch,
            transform,
            refang,
            revX,
            revY
        } = storage;

        const ratio = (cw + dx) / cw;

        const newWidth = proportions ? cw * ratio : cw + dx,
            newHeight = proportions ? ch * ratio : ch + dy;

        if (newWidth < MIN_SIZE || newHeight < MIN_SIZE) return;

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

        const nx = coords.left - newCoords.left,
            ny = coords.top - newCoords.top;

        matrix[4] += nx;
        matrix[5] += ny;

        const css = matrixToCSS(matrix);

        css.width = `${newWidth}px`;
        css.height = `${newHeight}px`;

        helper(controls).css(css);
        helper(el).css(css);

        storage.cached = {
            dx: nx,
            dy: ny
        };
    }

    _processMove(dx, dy) {
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

        const n_matrix = [...matrix];

        n_matrix[4] = matrix[4] + dx;
        n_matrix[5] = matrix[5] + dy;

        const css = matrixToCSS(n_matrix);

        helper(controls).css(css);
        helper(el).css(css);

        storage.cached = {
            dx,
            dy
        };
    }

    _processRotate(radians) {
        const {
            el,
            storage
        } = this;

        const {
            controls,
            transform,
            center
        } = storage;

        const {
            matrix,
            parentMatrix
        } = transform;

        const cos = floatToFixed(Math.cos(radians)),
            sin = floatToFixed(Math.sin(radians));

        const translateMatrix = [
            1,
            0,
            0,
            1,
            center.cx,
            center.cy
        ];

        const rotMatrix = [
            cos,
            sin,
            -sin,
            cos,
            0,
            0
        ];

        const pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;

        const resRotMatrix = multiplyMatrix(
            matrixInvert(pctm),
            multiplyMatrix(rotMatrix, pctm)
        );

        const nMatrix = multiplyMatrix(
            multiplyMatrix(translateMatrix, resRotMatrix),
            matrixInvert(translateMatrix)
        );

        const resMatrix = multiplyMatrix(nMatrix, matrix);

        const css = matrixToCSS(resMatrix);

        helper(controls).css(css);
        helper(el).css(css);
    }

    _getState(params) {
        const {
            factor,
            revX,
            revY
        } = params;

        const {
            el,
            storage,
            options
        } = this;

        const {
            container
        } = options;

        const {
            handles,
            controls,
            parent
        } = storage;

        const {
            center: cHandle,
            tl,
            tr
        } = handles;

        const tl_off = getOffset(tl),
            tr_off = getOffset(tr);

        const refang = Math.atan2(
            tr_off.top - tl_off.top,
            tr_off.left - tl_off.left
        ) * factor;

        const $controls = helper(controls);

        const containerMatrix = parseMatrix(
            getTransform(helper(container))
        );

        const matrix = parseMatrix(
            getTransform(helper(controls))
        );

        const pMatrix = parseMatrix(
            getTransform(parent)
        );

        const parentMatrix = parent === container
            ? multiplyMatrix(
                pMatrix,
                containerMatrix
            )
            : containerMatrix;

        const transform = {
            matrix,
            parentMatrix,
            scX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
            scY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]),
        };

        const cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));

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

        const hW = cw / 2,
            hH = ch / 2;

        const offset_ = getOffset(el),
            isDefCenter = isDef(cHandle);

        const centerX = isDefCenter
                ? parseFloat(helper(cHandle).css('left'))
                : hW,
            centerY = isDefCenter
                ? parseFloat(helper(cHandle).css('top'))
                : hH;
        
        const cDelta = isDefCenter ? CENTER_DELTA : 0;

        return {
            transform,
            cw,
            ch,
            coords,
            center: {
                x: offset_.left + centerX - cDelta,
                y: offset_.top + centerY - cDelta,
                cx: -centerX + hW - cDelta,
                cy: -centerY + hH - cDelta,
                hx: centerX,
                hy: centerY
            },
            factor,
            refang,
            revX,
            revY
        };
    }

    _moveCenterHandle(x, y) {
        const { storage } = this;
        const { handles, center } = storage;

        const left = `${center.hx + x}px`,
            top = `${center.hy + y}px`;

        helper(handles.center).css(
            {
                left,
                top
            }
        );
    }

    resetCenterPoint() {
        const { storage } = this;
        const { 
            handles,
        } = storage;

        helper(handles.center).css(
            {
                left: null,
                top: null
            }
        );
    }

    get controls() {
        return this.storage.controls;
    }

}

function matrixToCSS(arr) {
    const style = `matrix(${arr.join()})`;

    return {
        transform: style,
        webkitTranform: style,
        mozTransform: style,
        msTransform: style,
        otransform: style
    };
}

function multiplyMatrixAndPoint(point, matrix) {
    const {
        x, y
    } = point;

    const [a, b, c, d, e, f] = matrix;

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
                return;
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
    const m1 = [
        [mtrx1[0], mtrx1[2], mtrx1[4]],
        [mtrx1[1], mtrx1[3], mtrx1[5]],
        [0, 0, 1]
    ];

    const m2 = [
        [mtrx2[0], mtrx2[2], mtrx2[4]],
        [mtrx2[1], mtrx2[3], mtrx2[5]],
        [0, 0, 1]
    ];

    const result = [];

    for (let j = 0; j < m2.length; j++) {
        result[j] = [];
        for (let k = 0; k < m1[0].length; k++) {
            let sum = 0;
            for (let i = 0; i < m1.length; i++) {
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

function createHandler(classList) {
    const element = document.createElement('div');
    classList.forEach(cls => {
        addClass(element, cls);
    });
    return element;
}