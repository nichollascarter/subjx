import { helper } from '../Helper';
import Transformable from './Transformable';
import { floatToFixed } from './common';
import { isDef, isUndef } from '../util/util';
import { addClass, matrixToCSS } from '../util/css-util';
import { MIN_SIZE } from '../consts';

import {
    matrixInvert,
    createRotateMatrix,
    createTranslateMatrix,
    createScaleMatrix,
    multiplyMatrix,
    multiplyMatrixAndPoint,
    getTransform,
    getCurrentTransformMatrix,
    flatMatrix,
    cloneMatrix,
    decompose,
    getAbsoluteOffset
} from './matrix';

export default class Draggable extends Transformable {

    _init(el) {
        const {
            rotationPoint,
            container,
            resizable,
            rotatable,
            showNormal,
            rotatorOffset,
            rotatorAnchor
        } = this.options;

        const { offsetHeight, offsetWidth } = el;

        const wrapper = document.createElement('div');
        addClass(wrapper, 'sjx-wrapper');

        const controls = document.createElement('div');
        addClass(controls, 'sjx-controls');

        const handles = {};

        const matrix = getCurrentTransformMatrix(el, container);
        const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

        const vertices = {
            tl: [0, 0, 0, 1],
            bl: [0, offsetHeight, 0, 1],
            br: [offsetWidth, offsetHeight, 0, 1],
            tr: [offsetWidth, 0, 0, 1],
            tc: [offsetWidth / 2, 0, 0, 1],
            ml: [0, offsetHeight / 2, 0, 1],
            bc: [offsetWidth / 2, offsetHeight, 0, 1],
            mr: [offsetWidth, offsetHeight / 2, 0, 1],
            center: [offsetWidth / 2, offsetHeight / 2, 0, 1]
        };

        const finalVertices = Object.entries(vertices)
            .reduce((nextVerteces, [key, vertex]) => (
                [...nextVerteces, [key, multiplyMatrixAndPoint(matrix, vertex)]]
            ), [])
            .reduce((vertices, [key, [x, y, z, w]]) => {
                vertices[key] = [
                    x + offsetLeft,
                    y + offsetTop,
                    z,
                    w
                ];
                return vertices;
            }, {});

        let rotationHandles = {},
            rotator = null;

        if (rotatable) {
            const anchor = {};
            let factor = 1;

            switch (rotatorAnchor) {

                case 'n':
                    anchor.x = finalVertices.tc[0];
                    anchor.y = finalVertices.tc[1];
                    break;
                case 's':
                    anchor.x = finalVertices.bc[0];
                    anchor.y = finalVertices.bc[1];
                    factor = -1;
                    break;
                case 'w':
                    anchor.x = finalVertices.ml[0];
                    anchor.y = finalVertices.ml[1];
                    factor = -1;
                    break;
                case 'e':
                default:
                    anchor.x = finalVertices.mr[0];
                    anchor.y = finalVertices.mr[1];
                    break;

            }

            const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
                ? Math.atan2(
                    finalVertices.bl[1] - finalVertices.tl[1],
                    finalVertices.bl[0] - finalVertices.tl[0]
                )
                : Math.atan2(
                    finalVertices.tl[1] - finalVertices.tr[1],
                    finalVertices.tl[0] - finalVertices.tr[0]
                );

            rotator = [
                anchor.x - (rotatorOffset * factor) * Math.cos(theta),
                anchor.y - (rotatorOffset * factor) * Math.sin(theta)
            ];

            const normalLine = showNormal
                ? renderLine([[anchor.x, anchor.y], rotator])
                : null;

            if (showNormal) controls.appendChild(normalLine);

            let radius = null;

            if (rotationPoint) {
                radius = renderLine([finalVertices.center, finalVertices.center]);
                addClass(radius, 'sjx-hidden');

                controls.appendChild(radius);
            }

            rotationHandles = {
                ...rotationHandles,
                normal: normalLine,
                radius
            };
        }

        const resizingEdges = {
            te: [finalVertices.tl, finalVertices.tr],
            be: [finalVertices.bl, finalVertices.br],
            le: [finalVertices.tl, finalVertices.bl],
            re: [finalVertices.tr, finalVertices.br]
        };

        const resizingHandles = resizable ?
            {
                tl: finalVertices.tl,
                tr: finalVertices.tr,
                br: finalVertices.br,
                bl: finalVertices.bl,
                tc: finalVertices.tc,
                bc: finalVertices.bc,
                ml: finalVertices.ml,
                mr: finalVertices.mr
            }
            : {};

        const allHandles = {
            ...resizingHandles,
            center: rotationPoint && rotatable
                ? finalVertices.center
                : undefined,
            rotator
        };

        Object.keys(resizingEdges).forEach(key => {
            const data = resizingEdges[key];
            if (isUndef(data)) return;
            const handler = renderLine(data);
            handles[key] = handler;
            controls.appendChild(handler);
        });

        Object.keys(allHandles).forEach(key => {
            const data = allHandles[key];
            if (isUndef(data)) return;
            const handler = createHandler(data, key);
            handles[key] = handler;
            controls.appendChild(handler);
        });

        wrapper.appendChild(controls);
        container.appendChild(wrapper);

        this.storage = {
            controls,
            handles: {
                ...handles,
                ...rotationHandles
            },
            radius: undefined,
            parent: el.parentNode,
            wrapper,
            beforeTransform: {
                ctm: matrix
            },
            stored: {
                center: {
                    x: el.getAttribute('data-sjx-cx') || 0,
                    y: el.getAttribute('data-sjx-cy') || 0
                }
            }
        };

        [el, controls].map(target => (
            helper(target)
                .on('mousedown', this._onMouseDown)
                .on('touchstart', this._onTouchStart)
        ));
    }

    _destroy() {
        const {
            el,
            storage: {
                controls,
                wrapper
            }
        } = this;

        [el, controls].map(target => (
            helper(target)
                .off('mousedown', this._onMouseDown)
                .off('touchstart', this._onTouchStart)
        ));

        wrapper.parentNode.removeChild(wrapper);
    }

    _pointToElement({ x, y }) {
        const { transform: { ctm } } = this.storage;

        const matrix = matrixInvert(ctm);
        matrix[0][3] = matrix[1][3] = matrix[2][3] = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _pointToControls({ x, y }) {
        const { transform: { wrapperMatrix } } = this.storage;

        const matrix = matrixInvert(wrapperMatrix);
        matrix[0][3] = matrix[1][3] = matrix[2][3] = 0;

        return this._applyMatrixToPoint(
            matrix,
            x,
            y
        );
    }

    _applyMatrixToPoint(matrix, x, y) {
        const [nx, ny] = multiplyMatrixAndPoint(matrix, [x, y, 0, 1]);

        return {
            x: nx,
            y: ny
        };
    }

    _cursorPoint({ clientX, clientY }) {
        const { container } = this.options;

        const globalMatrix = getCurrentTransformMatrix(container);

        return this._applyMatrixToPoint(
            matrixInvert(globalMatrix),
            clientX,
            clientY
        );
    }

    _restrictHandler(matrix) {
        const {
            storage: {
                transform: {
                    containerBox: [
                        restrictWidth,
                        restrictHeight
                    ]
                }
            }
        } = this;

        let restrictX = null,
            restrictY = null;

        for (const point of this.getBoundingRect(matrix)) {
            const [x, y] = point;
            if (x < 0 || x > restrictWidth) {
                restrictX = x || restrictWidth;
            }
            if (y < 0 || y > restrictHeight) {
                restrictY = y || restrictHeight;
            }
        }

        return {
            x: restrictX,
            y: restrictY
        };
    }

    _apply() {
        const {
            el,
            storage,
            options: {
                applyTranslate
            }
        } = this;

        const {
            cached,
            controls,
            transform: { matrix }
            // handles
        } = storage;

        const $controls = helper(controls);

        // const cw = el.offsetWidth,
        //     ch = el.offsetHeight;

        // const { center: cHandle } = handles;

        // const isDefCenter = isDef(cHandle);

        if (isUndef(cached)) return;

        // const nextStoredCenter = {
        //     x: isDefCenter ? storage.stored.center.x + cached.centerOffset.x : 0,
        //     y: isDefCenter ? storage.stored.center.y + cached.centerOffset.y : 0
        // };

        // el.setAttribute('data-sjx-cx', nextStoredCenter.x);
        // el.setAttribute('data-sjx-cy', nextStoredCenter.y);

        // this.storage = {
        //     ...this.storage,
        //     stored: {
        //         ...this.storage.stored,
        //         center: {
        //             ...nextStoredCenter
        //         }
        //     }
        // };

        if (applyTranslate) {
            const $el = helper(el);

            const { dx, dy } = cached;

            const css = matrixToCSS(matrix);

            const left = parseFloat(
                el.style.left || $el.css('left')
            );

            const top = parseFloat(
                el.style.top || $el.css('top')
            );

            css.left = `${left + dx}px`;
            css.top = `${top + dy}px`;

            $el.css(css);
            $controls.css(css);
        }

        this.storage.cached = {};
    }

    _processResize(dx, dy) {
        const {
            el,
            storage,
            storage: {
                transform: {
                    matrix,
                    auxiliary: {
                        scale: {
                            translateMatrix
                        }
                    }
                },
                cached: {
                    dist: {
                        dx: nextDx = dx,
                        dy: nextDy = dy
                    } = {}
                } = {}
            },
            options: {
                proportions,
                scalable,
                restrict
            }
        } = this;

        const {
            cw,
            ch,
            revX,
            revY,
            doW,
            doH
        } = storage;

        const getScale = (distX, distY) => {
            const ratio = doW || (!doW && !doH)
                ? (cw + distX) / cw
                : (ch + distY) / ch;

            const newWidth = proportions ? cw * ratio : cw + distX,
                newHeight = proportions ? ch * ratio : ch + distY;

            const scaleX = newWidth / cw,
                scaleY = newHeight / ch;

            return [scaleX, scaleY];
        };

        const getScaleMatrix = (scaleX, scaleY) => {
            const scaleMatrix = createScaleMatrix(
                scaleX,
                scaleY
            );

            const fullScaleMatrix = multiplyMatrix(
                multiplyMatrix(translateMatrix, scaleMatrix),
                matrixInvert(translateMatrix)
            );

            return multiplyMatrix(
                fullScaleMatrix,
                matrix
            );
        };

        const ratio = doW || (!doW && !doH)
            ? (cw + dx) / cw
            : (ch + dy) / ch;

        const newWidth = proportions ? cw * ratio : cw + dx,
            newHeight = proportions ? ch * ratio : ch + dy;

        if (Math.abs(newWidth) <= MIN_SIZE || Math.abs(newHeight) <= MIN_SIZE) return;

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(getScaleMatrix(...getScale(dx, dy)))
            : { x: null, y: null };

        storage.cached.dist = {
            dx: restX !== null && restrict ? nextDx : dx,
            dy: restY !== null && restrict ? nextDy : dy
        };

        const resultMatrix = getScaleMatrix(...getScale(nextDx, nextDy));

        if (scalable) {
            helper(el).css(
                matrixToCSS(flatMatrix(resultMatrix))
            );
        } else {
            const sX = (cw / 2) * (doH ? 0 : (revX ? -1 : 1)),
                sY = (ch / 2) * (doW ? 0 : (revY ? -1 : 1));

            const transMatrix = createTranslateMatrix(
                sX,
                sY,
                0
            );

            const nextScaleMatrix = multiplyMatrix(
                multiplyMatrix(transMatrix, scaleMatrix),
                matrixInvert(transMatrix)
            );

            const trMatrix = createTranslateMatrix(
                nextScaleMatrix[0][3],
                nextScaleMatrix[1][3]
            );

            const result = multiplyMatrix(
                multiplyMatrix(trMatrix, matrix),
                matrixInvert(trMatrix)
            );

            helper(el).css({
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                ...matrixToCSS(flatMatrix(result))
            });
        }

        applyTransformToHandles(
            storage,
            this.options,
            {
                el,
                boxMatrix: resultMatrix
            }
        );

        return {
            transform: resultMatrix,
            width: newWidth,
            height: newHeight
        };
    }

    _processMove(dx, dy) {
        const {
            el,
            storage,
            storage: {
                wrapper,
                transform: {
                    matrix,
                    wrapperMatrix,
                    auxiliary: {
                        translate: {
                            parentMatrix
                        }
                    }
                },
                cached: {
                    dist: {
                        dx: nextDx = dx,
                        dy: nextDy = dy
                    } = {}
                } = {}
            },
            options: {
                restrict
            }
        } = this;

        const [x, y] = multiplyMatrixAndPoint(
            parentMatrix,
            [dx, dy, 0, 1]
        );

        const preTranslateMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(preTranslateMatrix)
            : { x: null, y: null };

        storage.cached.dist = {
            dx: restX !== null && restrict ? nextDx : dx,
            dy: restY !== null && restrict ? nextDy : dy
        };

        const [nx, ny] = multiplyMatrixAndPoint(
            parentMatrix,
            [nextDx, nextDy, 0, 1]
        );

        const moveElementMtrx = multiplyMatrix(
            matrix,
            createTranslateMatrix(nx, ny)
        );

        const moveWrapperMtrx = multiplyMatrix(
            wrapperMatrix,
            createTranslateMatrix(nextDx, nextDy)
        );

        const elStyle = matrixToCSS(flatMatrix(moveElementMtrx));
        const wrapperStyle = matrixToCSS(flatMatrix(moveWrapperMtrx));

        helper(el).css(elStyle);
        helper(wrapper).css(wrapperStyle);

        return moveElementMtrx;
    }

    _processRotate(radians) {
        const {
            el,
            storage: {
                transform: {
                    matrix,
                    auxiliary: {
                        rotate: {
                            translateMatrix
                        }
                    }
                }
            },
            options: {
                restrict
            }
        } = this;

        const cos = floatToFixed(Math.cos(radians), 4),
            sin = floatToFixed(Math.sin(radians), 4);

        const rotationMatrix = createRotateMatrix(sin, cos);

        const transformMatrix = multiplyMatrix(
            multiplyMatrix(matrixInvert(translateMatrix), rotationMatrix),
            translateMatrix
        );

        const resultMatrix = multiplyMatrix(matrix, transformMatrix);

        const { x: restX, y: restY } = restrict
            ? this._restrictHandler(resultMatrix)
            : { x: null, y: null };

        if (isDef(restX) || isDef(restY)) return resultMatrix;

        helper(el).css(
            matrixToCSS(flatMatrix(resultMatrix))
        );

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                el,
                boxMatrix: resultMatrix
            }
        );

        return resultMatrix;
    }

    _getState(params) {
        const {
            revX,
            revY,
            doW,
            doH
        } = params;

        const {
            el,
            storage: {
                handles,
                parent,
                wrapper,
                stored: {
                    center: centerData
                }
            },
            options: {
                container
            }
        } = this;

        const [glLeft, glTop] = getAbsoluteOffset(el, container);

        const {
            offsetLeft: elOffsetLeft,
            offsetTop: elOffsetTop
        } = el;

        const { center: cHandle } = handles;

        const matrix = getTransform(el);
        const ctm = getCurrentTransformMatrix(el, container);
        const containerMatrix = getCurrentTransformMatrix(container, container.parentNode);
        const parentMatrix = getCurrentTransformMatrix(parent, container);
        const wrapperMatrix = getCurrentTransformMatrix(wrapper, container);

        const cw = el.offsetWidth;
        const ch = el.offsetHeight;

        const hW = cw / 2,
            hH = ch / 2;

        const scaleX = doH ? 0 : (revX ? -hW : hW),
            scaleY = doW ? 0 : (revY ? -hH : hH);

        const [cenX, cenY] = multiplyMatrixAndPoint(
            ctm,
            [
                hW,
                hH,
                0,
                1
            ]
        );

        const [elX, elY] = multiplyMatrixAndPoint(
            matrix,
            [
                centerData.x,
                centerData.y,
                0,
                1
            ]
        );

        const parentCloneMatrix = cloneMatrix(parentMatrix);
        parentCloneMatrix[0][3] = parentCloneMatrix[1][3] = parentCloneMatrix[2][3] = 0;

        const nMatrix = cloneMatrix(matrix);
        nMatrix[0][3] = nMatrix[1][3] = nMatrix[2][3] = 0;

        const [oldX, oldY] = multiplyMatrixAndPoint(
            matrix,
            [
                hW,
                hH,
                0,
                1
            ]
        );

        const {
            options: {
                container: {
                    offsetWidth,
                    offsetHeight
                }
            }
        } = this;

        const containerCtm = cloneMatrix(containerMatrix);
        containerCtm[0][3] = containerCtm[1][3] = containerCtm[2][3] = 0;

        const containerBox = multiplyMatrixAndPoint(
            containerCtm,
            [offsetWidth, offsetHeight, 0, 1]
        );

        const transform = {
            auxiliary: {
                scale: {
                    translateMatrix: createTranslateMatrix(
                        scaleX,
                        scaleY,
                        0
                    )
                },
                translate: {
                    parentMatrix: matrixInvert(parentCloneMatrix)
                },
                rotate: {
                    translateMatrix: createTranslateMatrix(
                        elX,
                        elY,
                        0
                    )
                }
            },
            scaleX,
            scaleY,
            matrix,
            localCTM: getCurrentTransformMatrix(el, el.parentNode),
            ctm,
            parentMatrix,
            containerMatrix,
            wrapperMatrix,
            scX: decompose(getCurrentTransformMatrix(el, el.parentNode)).scale.sX,
            scY: decompose(getCurrentTransformMatrix(el, el.parentNode)).scale.sY,
            oldX: oldX,
            oldY: oldY,
            globalOffset: getAbsoluteOffset(el, container),
            containerBox
        };

        return {
            transform,
            cw,
            ch,
            left: elOffsetLeft,
            top: elOffsetTop,
            center: {
                x: cenX + glLeft,
                y: cenY + glTop,
                elX,
                elY,
                cx: 0,
                cy: 0,
                matrix: cHandle ? getTransform(cHandle) : null
            },
            revX,
            revY,
            doW,
            doH
        };
    }

    _moveCenterHandle(x, y) {
        const {
            handles: { center },
            center: { matrix }
        } = this.storage;

        const resultMatrix = multiplyMatrix(
            matrix,
            createTranslateMatrix(x, y)
        );

        helper(center).css({
            ...matrixToCSS(flatMatrix(resultMatrix))
        });

        this.storage.cached = {
            centerOffset: { x, y }
        };
    }

    resetCenterPoint() {
        const {
            el,
            el: {
                offsetHeight,
                offsetWidth
            },
            storage: {
                wrapper,
                handles: { center }
            },
            options: {
                container
            }
        } = this;

        if (!center) return;

        const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

        const matrix = multiplyMatrix(
            getCurrentTransformMatrix(el, container),
            matrixInvert(getCurrentTransformMatrix(wrapper, wrapper.parentNode))
        );

        const [x, y] = multiplyMatrixAndPoint(
            matrix,
            [offsetWidth / 2, offsetHeight / 2, 0, 1]
        );

        helper(center).css(
            { transform: `translate(${x + offsetLeft}px, ${y + offsetTop}px)` }
        );
    }

    fitControlsToSize() {
        const {
            el,
            storage: {
                wrapper
            }
        } = this;

        wrapper.removeAttribute('transform');

        applyTransformToHandles(
            this.storage,
            this.options,
            {
                el
            }
        );
    }

    getBoundingRect(transformMatrix) {
        const {
            el,
            options: { container }
        } = this;

        const matrix = transformMatrix
            ? getCurrentTransformMatrix(el, container, transformMatrix)
            : getCurrentTransformMatrix(el, container);

        return getBoundingRect(el, container, matrix);
    }

    get controls() {
        return this.storage.wrapper;
    }

}

const createHandler = ([x, y], key = 'handler', style = {}) => {
    const element = document.createElement('div');
    addClass(element, 'sjx-hdl');
    addClass(element, `sjx-hdl-${key}`);

    helper(element).css({
        transform: `translate(${x}px, ${y}px)`,
        ...style
    });
    return element;
};

const renderLine = ([pt1, pt2, thickness = 1]) => {
    const {
        cx,
        cy,
        length,
        theta
    } = getLineAttrs(pt1, pt2, thickness);

    const line = document.createElement('div');

    helper(line).css({
        transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
        height: `${thickness}px`,
        width: `${length}px`
    });

    addClass(line, 'sjx-hdl-line');
    return line;
};

const getLineAttrs = (pt1, pt2, thickness = 1) => {
    const [x1, y1] = pt1;
    const [x2, y2] = pt2;

    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);

    const theta = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    return {
        cx,
        cy,
        thickness,
        theta,
        length
    };
};

const applyTransformToHandles = (storage, options, data) => {
    const {
        wrapper,
        handles,
        transform: {
            //ctm,
            wrapperMatrix = getCurrentTransformMatrix(wrapper, wrapper.parentNode)
        } = {}
    } = storage;

    const {
        rotationPoint,
        rotatable,
        resizable,
        showNormal,
        rotatorOffset,
        rotatorAnchor,
        container
    } = options;

    const {
        //boxMatrix,
        el
    } = data;

    const { offsetHeight, offsetWidth } = el;
    const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);

    const matrix = multiplyMatrix(
        getCurrentTransformMatrix(el, container), // better to find result matrix instead of calculated
        matrixInvert(wrapperMatrix)
    );

    const vertices = {
        tl: [0, 0, 0, 1],
        tr: [offsetWidth, 0, 0, 1],
        bl: [0, offsetHeight, 0, 1],
        br: [offsetWidth, offsetHeight, 0, 1],
        tc: [offsetWidth / 2, 0, 0, 1],
        ml: [0, offsetHeight / 2, 0, 1],
        bc: [offsetWidth / 2, offsetHeight, 0, 1],
        mr: [offsetWidth, offsetHeight / 2, 0, 1],
        ...(rotationPoint && rotatable &&
            { center: [offsetWidth / 2, offsetHeight / 2, 0, 1] }
        )
    };

    const finalVertices = Object.entries(vertices)
        .reduce((nextVerteces, [key, vertex]) => (
            [...nextVerteces, [key, multiplyMatrixAndPoint(matrix, vertex)]]
        ), [])
        .reduce((vertices, [key, [x, y, z, w]]) => {
            vertices[key] = [
                x + offsetLeft,
                y + offsetTop,
                z,
                w
            ];
            return vertices;
        }, {});

    let normalLine = null;
    let rotationHandles = {};

    if (rotatable) {
        const anchor = {};
        let factor = 1;
        let rotator = [];

        switch (rotatorAnchor) {

            case 'n':
                anchor.x = finalVertices.tc[0];
                anchor.y = finalVertices.tc[1];
                break;
            case 's':
                anchor.x = finalVertices.bc[0];
                anchor.y = finalVertices.bc[1];
                factor = -1;
                break;
            case 'w':
                anchor.x = finalVertices.ml[0];
                anchor.y = finalVertices.ml[1];
                factor = -1;
                break;
            case 'e':
            default:
                anchor.x = finalVertices.mr[0];
                anchor.y = finalVertices.mr[1];
                break;

        }

        const theta = rotatorAnchor === 'n' || rotatorAnchor === 's'
            ? Math.atan2(
                finalVertices.bl[1] - finalVertices.tl[1],
                finalVertices.bl[0] - finalVertices.tl[0]
            )
            : Math.atan2(
                finalVertices.tl[1] - finalVertices.tr[1],
                finalVertices.tl[0] - finalVertices.tr[0]
            );

        const nextRotatorOffset = rotatorOffset * factor;

        rotator = [
            anchor.x - nextRotatorOffset * Math.cos(theta),
            anchor.y - nextRotatorOffset * Math.sin(theta)
        ];

        normalLine = showNormal
            ? [[anchor.x, anchor.y], rotator]
            : null;

        rotationHandles = {
            rotator
        };
    }

    const resizingHandles = {
        tl: finalVertices.tl,
        tr: finalVertices.tr,
        br: finalVertices.br,
        bl: finalVertices.bl,
        tc: finalVertices.tc,
        bc: finalVertices.bc,
        ml: finalVertices.ml,
        mr: finalVertices.mr,
        center: finalVertices.center
        // rotator
    };

    const resizingEdges = {
        te: [finalVertices.tl, finalVertices.tr],
        be: [finalVertices.bl, finalVertices.br],
        le: [finalVertices.tl, finalVertices.bl],
        re: [finalVertices.tr, finalVertices.br],
        ...(showNormal && normalLine && { normal: normalLine })
    };

    Object.keys(resizingEdges).forEach(key => {
        const [pt1, pt2] = resizingEdges[key];

        const {
            cx,
            cy,
            length,
            theta
        } = getLineAttrs(pt1, pt2);

        helper(handles[key]).css({
            transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
            width: `${length}px`
        });
    });

    const allHandles = {
        ...(resizable && resizingHandles),
        ...rotationHandles
    };

    Object.keys(allHandles).forEach(key => {
        const hdl = allHandles[key];
        if (!hdl) return;

        const [x, y] = hdl;
        helper(handles[key]).css({
            transform: `translate(${x}px, ${y}px)`
        });
    });
};

const getBoundingRect = (el, container, ctm) => {
    const [offsetLeft, offsetTop] = getAbsoluteOffset(el, container);
    const { offsetWidth, offsetHeight } = el;

    const vertices = {
        tl: [0, 0, 0, 1],
        tr: [offsetWidth, 0, 0, 1],
        bl: [0, offsetHeight, 0, 1],
        br: [offsetWidth, offsetHeight, 0, 1]
    };

    return Object.values(vertices)
        .reduce((nextVerteces, vertex) => (
            [...nextVerteces, multiplyMatrixAndPoint(ctm, vertex)]
        ), [])
        .map(([x, y, z, w]) => (
            [
                x + offsetLeft,
                y + offsetTop,
                z,
                w
            ]
        ));
};