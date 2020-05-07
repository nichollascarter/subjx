import { helper } from '../Helper';
import Transformable from './Transformable';
import { floatToFixed } from './common';
import { isDef, isUndef } from '../util/util';

import {
    addClass,
    getTransform,
    parseMatrix,
    getOffset,
    matrixToCSS
} from '../util/css-util';

import {
    matrixTransform,
    matrixInvert,
    multiplyMatrix,
    rotatedTopLeft
} from './matrix';

const MIN_SIZE = 2;
const CENTER_DELTA = 7;

export default class Draggable extends Transformable {

    _init(el) {
        const {
            rotationPoint,
            container,
            resizable,
            rotatable,
            showNormal
        } = this.options;

        const {
            left,
            top,
            width,
            height
        } = el.style;

        const wrapper = document.createElement('div');
        addClass(wrapper, 'sjx-wrapper');
        container.appendChild(wrapper);

        const $el = helper(el);

        const w = width || $el.css('width'),
            h = height || $el.css('height'),
            t = top || $el.css('top'),
            l = left || $el.css('left');

        const css = {
            top: t,
            left: l,
            width: w,
            height: h,
            transform: getTransform($el)
        };

        const controls = document.createElement('div');
        addClass(controls, 'sjx-controls');

        const resizingHandles = {
            tl: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-l', 'sjx-hdl-tl'],
            tr: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-r', 'sjx-hdl-tr'],
            br: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-r', 'sjx-hdl-br'],
            bl: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-l', 'sjx-hdl-bl'],
            tc: ['sjx-hdl', 'sjx-hdl-t', 'sjx-hdl-c', 'sjx-hdl-tc'],
            bc: ['sjx-hdl', 'sjx-hdl-b', 'sjx-hdl-c', 'sjx-hdl-bc'],
            ml: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-l', 'sjx-hdl-ml'],
            mr: ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-r', 'sjx-hdl-mr']
        };

        const rotationHandles = {
            normal: showNormal ? ['sjx-normal'] : null,
            rotator: ['sjx-hdl', 'sjx-hdl-m', 'sjx-rotator']
        };

        const handles = {
            ...(rotatable && rotationHandles),
            ...(resizable && resizingHandles),
            center: rotationPoint && rotatable
                ? ['sjx-hdl', 'sjx-hdl-m', 'sjx-hdl-c', 'sjx-hdl-mc'] 
                : undefined
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
                top: `${el.getAttribute('data-cy')}px`
            });
        }

        wrapper.appendChild(controls);

        const $controls = helper(controls);
        $controls.css(css);

        this.storage = {
            controls,
            handles,
            radius: undefined,
            parent: el.parentNode
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

    _pointToElement({ x, y }) {
        const {
            transform
        } = this.storage;

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
        return matrixTransform(
            {
                x,
                y
            },
            matrix
        );
    }

    _cursorPoint({ clientX, clientY }) {
        const {
            container
        } = this.options;

        const globalMatrix = parseMatrix(
            getTransform(helper(container))
        );

        return matrixTransform(
            {
                x: clientX,
                y: clientY
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

        const {
            // cached,
            controls,
            // transform,
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
            : hW;
        const centerY = isDefCenter
            ? parseFloat(helper(cHandle).css('top'))
            : hH;

        el.setAttribute('data-cx', centerX);
        el.setAttribute('data-cy', centerY);

        // if (isUndef(cached)) return;

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
        const {
            el,
            storage,
            options: { proportions }
        } = this;

        const {
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

        const ratio = doW || (!doW && !doH)
            ? (cw + dx) / cw
            : (ch + dy) / ch;

        const newWidth = proportions ? cw * ratio : cw + dx,
            newHeight = proportions ? ch * ratio : ch + dy;

        if (newWidth <= MIN_SIZE || newHeight <= MIN_SIZE) return;

        const matrix = [...transform.matrix];

        const newCoords = rotatedTopLeft(
            matrix[4],
            matrix[5],
            newWidth,
            newHeight,
            refang,
            revX,
            revY,
            doW,
            doH
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
        
        return {
            width: newWidth,
            height: newHeight,
            ox: nx,
            oy: ny
        };
    }

    _processMove(dx, dy) {
        const {
            el,
            storage
        } = this;

        const {
            controls,
            transform: {
                matrix,
                parentMatrix
            }
        } = storage;

        const pctm = [...parentMatrix];
        pctm[4] = pctm[5] = 0;

        const nMatrix = [...matrix];

        nMatrix[4] = matrix[4] + dx;
        nMatrix[5] = matrix[5] + dy;

        const css = matrixToCSS(nMatrix);

        helper(controls).css(css);
        helper(el).css(css);

        storage.cached = {
            dx,
            dy
        };

        return nMatrix;
    }

    _processRotate(radians) {
        const {
            el,
            storage: {
                controls,
                transform,
                center
            }
        } = this;

        const {
            matrix,
            parentMatrix
        } = transform;

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

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

        return resMatrix;
    }

    _getState(params) {
        const {
            revX,
            revY,
            doW,
            doH
        } = params;

        const factor = revX !== revY
            ? -1
            : 1;

        const {
            el,
            storage: {
                handles,
                controls,
                parent
            },
            options: { container }
        } = this;

        const {
            center: cHandle
        } = handles;

        const $controls = helper(controls);

        const containerMatrix = parseMatrix(
            getTransform(helper(container))
        );

        const matrix = parseMatrix(
            getTransform(helper(controls))
        );

        const pMatrix = parseMatrix(
            getTransform(helper(parent))
        );

        const refang = Math.atan2(
            matrix[1], matrix[0]
        ) * factor;

        const parentMatrix = parent !== container
            ? multiplyMatrix(
                pMatrix,
                containerMatrix
            )
            : containerMatrix;

        const transform = {
            matrix,
            parentMatrix,
            scX: Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]),
            scY: Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3])
        };

        const cw = parseFloat($controls.css('width')),
            ch = parseFloat($controls.css('height'));

        // getting current coordinates considering rotation angle                                                                                                  
        const coords = rotatedTopLeft(
            matrix[4],
            matrix[5],
            cw,
            ch,
            refang,
            revX,
            revY,
            doW,
            doH
        );

        const hW = cw / 2,
            hH = ch / 2;

        const offset_ = getOffset(el),
            isDefCenter = isDef(cHandle);

        const centerX = isDefCenter
            ? parseFloat(helper(cHandle).css('left'))
            : hW;
        const centerY = isDefCenter
            ? parseFloat(helper(cHandle).css('top'))
            : hH;

        const cDelta = isDefCenter ? CENTER_DELTA : 0;

        const { x: el_x, y: el_y } = matrixTransform(
            {
                x: offset_.left,
                y: offset_.top
            },
            matrixInvert(parentMatrix)
        );

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
        const { 
            handles: { center }, 
            center: { hx, hy }
        } = this.storage;

        const left = `${hx + x}px`,
            top = `${hy + y}px`;

        helper(center).css(
            {
                left,
                top
            }
        );
    }

    resetCenterPoint() {
        const {
            handles: { center }
        } = this.storage;

        helper(center).css(
            {
                left: null,
                top: null
            }
        );
    }

    fitControlsToSize() {}

    get controls() {
        return this.storage.controls;
    }

}

const createHandler = (classList) => {
    const element = document.createElement('div');
    classList.forEach(cls => {
        addClass(element, cls);
    });
    return element;
};