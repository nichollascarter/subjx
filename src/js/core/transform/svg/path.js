import { warn } from './../../util/util';
import { floatToFixed } from '../common';

import {
    pointTo,
    cloneMatrix,
    normalizeString,
    sepRE
} from './util';

const dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;

const parsePath = (path) => {
    let match = dRE.lastIndex = 0;

    const serialized = [];

    while ((match = dRE.exec(path))) {
        const [, cmd, params] = match;
        const upCmd = cmd.toUpperCase();

        const data = normalizeString(params);

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

export const movePath = (params) => {
    const {
        path,
        dx,
        dy
    } = params;

    try {
        const serialized = parsePath(path);

        let str = '';
        let space = ' ';

        let firstCommand = true;

        for (let i = 0, len = serialized.length; i < len; i++) {
            const item = serialized[i];

            const {
                values,
                key: cmd,
                relative
            } = item;

            const coordinates = [];

            switch (cmd) {

                case 'M': {
                    for (let k = 0, len = values.length; k < len; k += 2) {
                        let [x, y] = values.slice(k, k + 2);

                        if (!(relative && !firstCommand)) {
                            x += dx;
                            y += dy;
                        }

                        coordinates.push(
                            x,
                            y
                        );

                        firstCommand = false;
                    }
                    break;
                }
                case 'A': {
                    for (let k = 0, len = values.length; k < len; k += 7) {
                        const set = values.slice(k, k + 7);

                        if (!relative) {
                            set[5] += dx;
                            set[6] += dy;
                        }

                        coordinates.push(...set);
                    }
                    break;
                }
                case 'C': {
                    for (let k = 0, len = values.length; k < len; k += 6) {
                        const set = values.slice(k, k + 6);

                        if (!relative) {
                            set[0] += dx;
                            set[1] += dy;
                            set[2] += dx;
                            set[3] += dy;
                            set[4] += dx;
                            set[5] += dy;
                        }

                        coordinates.push(...set);
                    }
                    break;
                }
                case 'H': {
                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const set = values.slice(k, k + 1);

                        if (!relative) {
                            set[0] += dx;
                        }

                        coordinates.push(set[0]);
                    }

                    break;
                }
                case 'V': {
                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const set = values.slice(k, k + 1);

                        if (!relative) {
                            set[0] += dy;
                        }
                        coordinates.push(set[0]);
                    }

                    break;
                }
                case 'L':
                case 'T': {
                    for (let k = 0, len = values.length; k < len; k += 2) {
                        let [x, y] = values.slice(k, k + 2);

                        if (!relative) {
                            x += dx;
                            y += dy;
                        }

                        coordinates.push(
                            x,
                            y
                        );
                    }
                    break;
                }
                case 'Q':
                case 'S': {
                    for (let k = 0, len = values.length; k < len; k += 4) {
                        let [x1, y1, x2, y2] = values.slice(k, k + 4);

                        if (!relative) {
                            x1 += dx;
                            y1 += dy;
                            x2 += dx;
                            y2 += dy;
                        }

                        coordinates.push(
                            x1,
                            y1,
                            x2,
                            y2
                        );
                    }
                    break;
                }
                case 'Z': {
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

export const resizePath = (params) => {
    const {
        path,
        localCTM
    } = params;

    try {
        const serialized = parsePath(path);

        let str = '';
        let space = ' ';

        const res = [];

        let firstCommand = true;

        for (let i = 0, len = serialized.length; i < len; i++) {
            const item = serialized[i];

            const {
                values,
                key: cmd,
                relative
            } = item;

            switch (cmd) {

                case 'A': {
                //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 7) {
                        const [rx, ry, x_axis_rot, large_arc_flag, sweep_flag, x, y] =
                            values.slice(k, k + 7);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );

                        mtrx.e = mtrx.f = 0;

                        const {
                            x: newRx,
                            y: newRy
                        } = pointTo(
                            mtrx,
                            rx,
                            ry
                        );

                        coordinates.unshift(
                            floatToFixed(newRx),
                            floatToFixed(newRy),
                            x_axis_rot,
                            large_arc_flag,
                            sweep_flag
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'C': {
                //C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 6) {
                        const [x1, y1, x2, y2, x, y] = values.slice(k, k + 6);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,
                            x1,
                            y1
                        );

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX1),
                            floatToFixed(resY1),
                            floatToFixed(resX2),
                            floatToFixed(resY2),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                // this command makes impossible free transform within group
                // todo: use proportional resizing only or need to be converted to L
                case 'H': {
                // H x (or h dx)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [x] = values.slice(k, k + 1);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX
                        } = pointTo(
                            mtrx,
                            x,
                            0
                        );

                        coordinates.push(
                            floatToFixed(resX)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                // this command makes impossible free transform within group
                // todo: use proportional resizing only or need to be converted to L
                case 'V': {
                // V y (or v dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [y] = values.slice(k, k + 1);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            y: resY
                        } = pointTo(
                            mtrx,
                            0,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'T':
                case 'L': {
                // T x y (or t dx dy)
                // L x y (or l dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'M': {
                // M x y (or dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative && !firstCommand) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );

                        firstCommand = false;
                    }

                    res.push(coordinates);
                    break;
                }
                case 'Q': {
                //Q x1 y1, x y (or q dx1 dy1, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x1, y1, x, y] = values.slice(k, k + 4);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX1,
                            y: resY1
                        } = pointTo(
                            mtrx,
                            x1,
                            y1
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX1),
                            floatToFixed(resY1),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'S': {
                //S x2 y2, x y (or s dx2 dy2, dx dy)
                    const coordinates = [];

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x2, y2, x, y] = values.slice(k, k + 4);

                        const mtrx = cloneMatrix(localCTM);

                        if (relative) {
                            mtrx.e = mtrx.f = 0;
                        }

                        const {
                            x: resX2,
                            y: resY2
                        } = pointTo(
                            mtrx,
                            x2,
                            y2
                        );

                        const {
                            x: resX,
                            y: resY
                        } = pointTo(
                            mtrx,
                            x,
                            y
                        );

                        coordinates.push(
                            floatToFixed(resX2),
                            floatToFixed(resY2),
                            floatToFixed(resX),
                            floatToFixed(resY)
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'Z': {
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