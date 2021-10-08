import { warn } from './../../util/util';
import { floatToFixed } from '../common';

import {
    pointTo,
    cloneMatrix,
    normalizeString,
    sepRE,
    arrayToChunks
} from './util';

const dRE = /\s*([achlmqstvz])([^achlmqstvz]*)\s*/gi;

const getCommandValuesLength = (cmd) => ([
    {
        size: 2,
        condition: ['M', 'm', 'L', 'l', 'T', 't'].includes(cmd)
    },
    {
        size: 1,
        condition: ['H', 'h', 'V', 'v'].includes(cmd)
    },
    {
        size: 6,
        condition: ['C', 'c'].includes(cmd)
    },
    {
        size: 4,
        condition: ['S', 's', 'Q', 'q'].includes(cmd)
    },
    {
        size: 7,
        condition: ['A', 'a'].includes(cmd)
    },
    {
        size: 1,
        condition: true
    }
].find(({ condition }) => !!condition));

const parsePath = (path) => {
    let match = dRE.lastIndex = 0;

    const serialized = [];

    while ((match = dRE.exec(path))) {
        const [, cmd, params] = match;
        const upCmd = cmd.toUpperCase();

        const isRelative = cmd !== upCmd;

        const data = normalizeString(params);

        const values = data.trim().split(sepRE).map(val => {
            if (!isNaN(val)) {
                return Number(val);
            }
        });

        // split big command into multiple commands
        arrayToChunks(values, getCommandValuesLength(cmd).size)
            .map(chunkedValues => (
                serialized.push({
                    relative: isRelative,
                    key: upCmd,
                    cmd,
                    values: chunkedValues
                })
            ));
    }

    return reducePathData(absolutizePathData(serialized));
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

            str += cmd + coordinates.join(',') + space;
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
                relative = false
            } = item;

            switch (cmd) {

                case 'A': {
                    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 7) {
                        const [rx, ry, xAxisRot, largeArcFlag, sweepFlag, x, y] =
                            values.slice(k, k + 7);

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
                            xAxisRot,
                            largeArcFlag,
                            sweepFlag
                        );
                    }

                    res.push(coordinates);
                    break;
                }
                case 'C': {
                    // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 6) {
                        const [x1, y1, x2, y2, x, y] = values.slice(k, k + 6);

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
                // it will be converted to L
                case 'H': {
                    // H x (or h dx)
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [x] = values.slice(k, k + 1);

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
                // it will be converted to L
                case 'V': {
                    // V y (or v dy)
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 1) {
                        const [y] = values.slice(k, k + 1);

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

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

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

                    const mtrx = cloneMatrix(localCTM);

                    if (relative && !firstCommand) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 2) {
                        const [x, y] = values.slice(k, k + 2);

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
                    // Q x1 y1, x y (or q dx1 dy1, dx dy)
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x1, y1, x, y] = values.slice(k, k + 4);

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
                    // S x2 y2, x y (or s dx2 dy2, dx dy)
                    const coordinates = [];

                    const mtrx = cloneMatrix(localCTM);

                    if (relative) {
                        mtrx.e = mtrx.f = 0;
                    }

                    for (let k = 0, len = values.length; k < len; k += 4) {
                        const [x2, y2, x, y] = values.slice(k, k + 4);

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

            str += item.key + res[i].join(',') + space;
        }

        return str.trim();
    } catch (err) {
        warn('Path parsing error: ' + err);
    }
};

const absolutizePathData = (pathData) => {
    let currentX = null,
        currentY = null,
        subpathX = null,
        subpathY = null;

    return pathData.reduce((absolutizedPathData, seg) => {
        const { cmd, values } = seg;

        let nextSeg;

        switch (cmd) {

            case 'M': {
                const [x, y] = values;

                nextSeg = { key: 'M', values: [x, y] };

                subpathX = x;
                subpathY = y;

                currentX = x;
                currentY = y;
                break;
            }

            case 'm': {
                const [x, y] = values;

                const nextX = currentX + x;
                const nextY = currentY + y;

                nextSeg = { key: 'M', values: [nextX, nextY] };

                subpathX = nextX;
                subpathY = nextY;

                currentX = nextX;
                currentY = nextY;
                break;
            }

            case 'L': {
                const [x, y] = values;

                nextSeg = { key: 'L', values: [x, y] };

                currentX = x;
                currentY = y;
                break;
            }

            case 'l': {
                const [x, y] = values;
                const nextX = currentX + x;
                const nextY = currentY + y;

                nextSeg = { key: 'L', values: [nextX, nextY] };

                currentX = nextX;
                currentY = nextY;
                break;
            }

            case 'C': {
                const [x1, y1, x2, y2, x, y] = values;

                nextSeg = { key: 'C', values: [x1, y1, x2, y2, x, y] };

                currentX = x;
                currentY = y;
                break;
            }

            case 'c': {
                const [x1, y1, x2, y2, x, y] = values;

                const nextValues = [
                    currentX + x1,
                    currentY + y1,
                    currentX + x2,
                    currentY + y2,
                    currentX + x,
                    currentY + y
                ];

                nextSeg = { key: 'C', values: [...nextValues] };

                currentX = nextValues[4];
                currentY = nextValues[5];
                break;
            }

            case 'Q': {
                const [x1, y1, x, y] = values;

                nextSeg = { key: 'Q', values: [x1, y1, x, y] };

                currentX = x;
                currentY = y;
                break;
            }

            case 'q': {
                const [x1, y1, x, y] = values;

                const nextValues = [
                    currentX + x1,
                    currentY + y1,
                    currentX + x,
                    currentY + y
                ];

                absolutizedPathData.push({ key: 'Q', values: [...nextValues] });

                currentX = nextValues[2];
                currentY = nextValues[3];
                break;
            }

            case 'A': {
                const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;

                nextSeg = {
                    key: 'A',
                    values: [r1, r2, angle, largeArcFlag, sweepFlag, x, y]
                };

                currentX = x;
                currentY = y;
                break;
            }

            case 'a': {
                const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;
                const nextX = currentX + x;
                const nextY = currentY + y;

                nextSeg = {
                    key: 'A',
                    values: [r1, r2, angle, largeArcFlag, sweepFlag, nextX, nextY]
                };

                currentX = nextX;
                currentY = nextY;
                break;
            }

            case 'H': {
                const [x] = values;
                nextSeg = { key: 'H', values: [x] };
                currentX = x;
                break;
            }

            case 'h': {
                const [x] = values;
                const nextX = currentX + x;

                nextSeg = { key: 'H', values: [nextX] };
                currentX = nextX;
                break;
            }

            case 'V': {
                const [y] = values;
                nextSeg = { key: 'V', values: [y] };
                currentY = y;
                break;
            }

            case 'v': {
                const [y] = values;
                const nextY = currentY + y;
                nextSeg = { key: 'V', values: [nextY] };
                currentY = nextY;
                break;
            }
            case 'S': {
                const [x2, y2, x, y] = values;

                nextSeg = { key: 'S', values: [x2, y2, x, y] };

                currentX = x;
                currentY = y;
                break;
            }

            case 's': {
                const [x2, y2, x, y] = values;

                const nextValues = [
                    currentX + x2,
                    currentY + y2,
                    currentX + x,
                    currentY + y
                ];

                nextSeg = { key: 'S', values: [...nextValues] };

                currentX = nextValues[2];
                currentY = nextValues[3];
                break;
            }

            case 'T': {
                const [x, y] = values;

                nextSeg = { key: 'T', values: [x, y] };

                currentX = x;
                currentY = y;
                break;
            }

            case 't': {
                const [x, y] = values;
                const nextX = currentX + x;
                const nextY = currentY + y;

                nextSeg = { key: 'T', values: [nextX, nextY] };

                currentX = nextX;
                currentY = nextY;
                break;
            }

            case 'Z':
            case 'z': {
                nextSeg = { key: 'Z', values: [] };

                currentX = subpathX;
                currentY = subpathY;
                break;
            }

        }

        return [...absolutizedPathData, nextSeg];
    }, []);
};

const reducePathData = (pathData) => {
    let lastType = null;

    let lastControlX = null;
    let lastControlY = null;

    let currentX = null;
    let currentY = null;

    let subpathX = null;
    let subpathY = null;

    return pathData.reduce((reducedPathData, seg) => {
        const { key, values } = seg;

        let nextSeg;

        switch (key) {

            case 'M': {
                const [x, y] = values;

                nextSeg = [{ key: 'M', values: [x, y] }];

                subpathX = x;
                subpathY = y;

                currentX = x;
                currentY = y;
                break;
            }

            case 'C': {
                const [x1, y1, x2, y2, x, y] = values;

                nextSeg = [{ key: 'C', values: [x1, y1, x2, y2, x, y] }];

                lastControlX = x2;
                lastControlY = y2;

                currentX = x;
                currentY = y;
                break;
            }

            case 'L': {
                const [x, y] = values;

                nextSeg = [{ key: 'L', values: [x, y] }];

                currentX = x;
                currentY = y;
                break;
            }

            case 'H': {
                const [x] = values;

                nextSeg = [{ key: 'L', values: [x, currentY] }];

                currentX = x;
                break;
            }

            case 'V': {
                const [y] = values;

                nextSeg = [{ key: 'L', values: [currentX, y] }];

                currentY = y;
                break;
            }

            case 'S': {
                const [x2, y2, x, y] = values;

                let cx1, cy1;

                if (lastType === 'C' || lastType === 'S') {
                    cx1 = currentX + (currentX - lastControlX);
                    cy1 = currentY + (currentY - lastControlY);
                } else {
                    cx1 = currentX;
                    cy1 = currentY;
                }

                nextSeg = [{ key: 'C', values: [cx1, cy1, x2, y2, x, y] }];

                lastControlX = x2;
                lastControlY = y2;

                currentX = x;
                currentY = y;
                break;
            }

            case 'T': {
                const [x, y] = values;

                let x1, y1;

                if (lastType === 'Q' || lastType === 'T') {
                    x1 = currentX + (currentX - lastControlX);
                    y1 = currentY + (currentY - lastControlY);
                } else {
                    x1 = currentX;
                    y1 = currentY;
                }

                const cx1 = currentX + 2 * (x1 - currentX) / 3;
                const cy1 = currentY + 2 * (y1 - currentY) / 3;
                const cx2 = x + 2 * (x1 - x) / 3;
                const cy2 = y + 2 * (y1 - y) / 3;

                nextSeg = [{ key: 'C', values: [cx1, cy1, cx2, cy2, x, y] }];

                lastControlX = x1;
                lastControlY = y1;

                currentX = x;
                currentY = y;
                break;
            }

            case 'Q': {
                const [x1, y1, x, y] = values;

                const cx1 = currentX + 2 * (x1 - currentX) / 3;
                const cy1 = currentY + 2 * (y1 - currentY) / 3;
                const cx2 = x + 2 * (x1 - x) / 3;
                const cy2 = y + 2 * (y1 - y) / 3;

                nextSeg = [{ key: 'C', values: [cx1, cy1, cx2, cy2, x, y] }];

                lastControlX = x1;
                lastControlY = y1;

                currentX = x;
                currentY = y;
                break;
            }

            case 'A': {
                const [r1, r2, angle, largeArcFlag, sweepFlag, x, y] = values;

                if (r1 === 0 || r2 === 0) {
                    nextSeg = [{ key: 'C', values: [currentX, currentY, x, y, x, y] }];

                    currentX = x;
                    currentY = y;
                } else {
                    if (currentX !== x || currentY !== y) {
                        const curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);

                        nextSeg = curves.map(curve => ({ key: 'C', values: curve }));

                        currentX = x;
                        currentY = y;
                    }
                }
                break;
            }

            case 'Z': {
                nextSeg = [seg];

                currentX = subpathX;
                currentY = subpathY;
                break;
            }

        }

        lastType = key;

        return [...reducedPathData, ...nextSeg];
    }, []);
};

const arcToCubicCurves = (x1, y1, x2, y2, rx, ry, xAxisRot, largeArcFlag, sweepFlag, recursive) => {
    const degToRad = deg => (Math.PI * deg) / 180;

    const rotate = (x, y, rad) => ({
        x: x * Math.cos(rad) - y * Math.sin(rad),
        y: x * Math.sin(rad) + y * Math.cos(rad)
    });

    const angleRad = degToRad(xAxisRot);
    let params = [];
    let f1, f2, cx, cy;

    if (recursive) {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
    } else {
        const p1 = rotate(x1, y1, -angleRad);
        x1 = p1.x;
        y1 = p1.y;

        const p2 = rotate(x2, y2, -angleRad);
        x2 = p2.x;
        y2 = p2.y;

        const x = (x1 - x2) / 2;
        const y = (y1 - y2) / 2;
        let h = (x * x) / (rx * rx) + (y * y) / (ry * ry);

        if (h > 1) {
            h = Math.sqrt(h);
            rx = h * rx;
            ry = h * ry;
        }

        let sign = largeArcFlag === sweepFlag ? -1 : 1;

        const r1Pow = rx * rx;
        const r2Pow = ry * ry;

        const left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
        const right = r1Pow * y * y + r2Pow * x * x;

        let k = sign * Math.sqrt(Math.abs(left / right));

        cx = k * rx * y / ry + (x1 + x2) / 2;
        cy = k * -ry * x / rx + (y1 + y2) / 2;

        f1 = Math.asin(parseFloat(((y1 - cy) / ry).toFixed(9)));
        f2 = Math.asin(parseFloat(((y2 - cy) / ry).toFixed(9)));

        if (x1 < cx) {
            f1 = Math.PI - f1;
        }

        if (x2 < cx) {
            f2 = Math.PI - f2;
        }

        if (f1 < 0) {
            f1 = Math.PI * 2 + f1;
        }

        if (f2 < 0) {
            f2 = Math.PI * 2 + f2;
        }

        if (sweepFlag && f1 > f2) {
            f1 = f1 - Math.PI * 2;
        }

        if (!sweepFlag && f2 > f1) {
            f2 = f2 - Math.PI * 2;
        }
    }

    let df = f2 - f1;

    if (Math.abs(df) > (Math.PI * 120 / 180)) {
        let f2old = f2;
        let x2old = x2;
        let y2old = y2;

        const ratio = sweepFlag && f2 > f1 ? 1 : -1;

        f2 = f1 + (Math.PI * 120 / 180) * ratio;

        x2 = cx + rx * Math.cos(f2);
        y2 = cy + ry * Math.sin(f2);
        params = arcToCubicCurves(x2, y2, x2old, y2old, rx, ry, xAxisRot, 0, sweepFlag, [f2, f2old, cx, cy]);
    }

    df = f2 - f1;

    let c1 = Math.cos(f1);
    let s1 = Math.sin(f1);
    let c2 = Math.cos(f2);
    let s2 = Math.sin(f2);
    let t = Math.tan(df / 4);
    let hx = 4 / 3 * rx * t;
    let hy = 4 / 3 * ry * t;

    let m1 = [x1, y1];
    let m2 = [x1 + hx * s1, y1 - hy * c1];
    let m3 = [x2 + hx * s2, y2 - hy * c2];
    let m4 = [x2, y2];

    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];

    if (recursive) {
        return [m2, m3, m4, ...params];
    } else {
        params = [m2, m3, m4, ...params].join().split(',');

        const curves = [];
        let curveParams = [];

        params.forEach((_, i) => {
            if (i % 2) {
                curveParams.push(rotate(params[i - 1], params[i], angleRad).y);
            } else {
                curveParams.push(rotate(params[i], params[i + 1], angleRad).x);
            }

            if (curveParams.length === 6) {
                curves.push(curveParams);
                curveParams = [];
            }
        });

        return curves;
    }
};