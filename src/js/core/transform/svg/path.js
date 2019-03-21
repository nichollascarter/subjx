import {
    recalcPoint
} from '../common'

const dRE = /([achlmqstvz])([^achlmqstvz]*)/gi;
const sepRE = /\s*,\s*|\s+/g;

function parsePath(path)  {

    let match = dRE.lastIndex = 0;

    const serialized = [];

    while ((match = dRE.exec(path))) {

        const cmd = match[1];
        const upCmd = cmd.toUpperCase();

        serialized.push({
            relative: cmd !== upCmd,
            key: upCmd,
            cmd: cmd,
            value: match[2].trim().split(sepRE).map(val => { 
                if (!isNaN(val)) {
                    return Number(val);
                }
            })
        });
    }

    return serialized;
}

export function movePath(params) {

    const { path, x, y } = params;

    const serialized = parsePath(path);

    let str = '';

    let firstCommand = true;

    for (let i = 0, len = serialized.length; i < len; i++) {

        const item = serialized[i];

        const { 
            value: values,
            key: cmd,
            relative
        } = item;

        switch (cmd) {
            case 'M':
                if (relative && !firstCommand) break;
                values[0] = values[0] + x;
                values[1] = values[1] + y;
                break;
            case 'A':
                if (relative) break;
                values[5] = values[5] + x;
                values[6] = values[6] + y;
                break;
            case 'C':
                if (relative) break;
                values[0] = values[0] + x;
                values[1] = values[1] + y;
                values[2] = values[2] + x;
                values[3] = values[3] + y;
                values[4] = values[4] + x;
                values[5] = values[5] + y;
                break;
            case 'H':
                if (relative) break;
                values[0] = values[0] + x;
                break;
            case 'V':
                if (relative) break;
                values[0] = values[0] + y;
                break;
            case 'L':
            case 'T':
                if (relative) break;
                values[0] = values[0] + x;
                values[1] = values[1] + y;
                break;
            
            case 'Q':
            case 'S':
                if (relative) break;
                values[0] = values[0] + x;
                values[1] = values[1] + y;
                values[2] = values[2] + x;
                values[3] = values[3] + y;
                break;
            case 'Z':
                values[0] = '';
                break;
        }

        str += item.cmd + item.value.join(',') + ' ';
        firstCommand = false;
    }

    return str;
}

export function resizePath(params) {

    const {
        bBox,
        path,
        baseData,
        dx,
        dy,
        revX,
        revY,
        fixedX,
        fixedY
    } = params;

    const serialized = parsePath(path);

    const { 
        width: boxW,
        height: boxH
    } = bBox;

    let str = '';
    const res = [];

    let firstCommand = true;

    for (let i = 0, len = serialized.length; i < len; i++) {

        const item = serialized[i];

        const { 
            value: values,
            key: cmd,
            relative
        } = item;
            
        switch (cmd) {

            case 'A': {

                //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                const [ rx, ry, x_axis_rot, large_arc_flag, sweep_flag, x, y ] = values;

                const factorX = getFactor(revX),
                    factorY = getFactor(revY);
                
                const params = [];

                const newRx = rx + dx * factorX * (rx / boxW),
                    newRy =  ry + dy * factorY * (ry / boxH);
                
                params.push(
                    newRx,
                    newRy,
                    x_axis_rot,
                    large_arc_flag,
                    sweep_flag
                );

                if (relative) {

                    params.push(
                        setRelativeCoord(x, dx * factorX, boxW),
                        setRelativeCoord(y, dy * factorY, boxH)
                    );

                } else {

                    let valX = setCoord(x, dx, fixedX, boxW),
                        valY = setCoord(y, dy, fixedY, boxH);

                    const { resX, resY } = recalcPoint({
                        x: valX,
                        y: valY,
                        ...baseData
                    });

                    params.push(
                        resX,
                        resY
                    );
                }

                res.push(params);

                break;
            }

            case 'C': {

                //C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
                const [ x1, y1, x2, y2, x, y ] = values;

                if (relative) {

                    const factorX = getFactor(revX),
                        factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(x1, dx * factorX, boxW),
                        setRelativeCoord(y1, dy * factorY, boxH),
                        setRelativeCoord(x2, dx * factorX, boxW),
                        setRelativeCoord(y2, dy * factorY, boxH),
                        setRelativeCoord(x, dx * factorX, boxW),
                        setRelativeCoord(y, dy * factorY, boxH)
                    ]);

                } else {

                    const factorX1 = revX && x1 > fixedX || !revX && x1 < fixedX ? -1 : 1,    
                        factorY1 = revY && y1 > fixedY || !revY && y1 < fixedY ? -1 : 1,
                        factorX2 = revX && x2 > fixedX || !revX && x2 < fixedX ? -1 : 1,    
                        factorY2 = revY && y2 > fixedY || !revY && y2 < fixedY ? -1 : 1;

                    const { resX: resX1, resY: resY1 } = recalcPoint({
                        x: setCoord(x1, dx * factorX1, fixedX, boxW),
                        y: setCoord(y1, dy * factorY1, fixedY, boxH),
                        ...baseData
                    });

                    const { resX: resX2, resY: resY2 } = recalcPoint({
                        x: setCoord(x2, dx * factorX2, fixedX, boxW),
                        y: setCoord(y2, dy * factorY2, fixedY, boxH),
                        ...baseData
                    });

                    const { resX: resX3, resY: resY3 } = recalcPoint({
                        x: setCoord(x, dx, fixedX, boxW),
                        y: setCoord(y, dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([
                        resX1,
                        resY1,
                        resX2,
                        resY2,
                        resX3,
                        resY3
                    ]);
                }
                break;
            }

            case 'H': {

                if (relative) {
                
                    const factorX = getFactor(revX);
                    res.push([
                        setRelativeCoord(values[0], dx * factorX, boxW)
                    ]);

                } else {

                    const { resX } = recalcPoint({
                        x: setCoord(values[0], dx, fixedX, boxW),
                        y: 0,
                        ...baseData
                    });

                    res.push([resX]);
                }
                break;
            }

            case 'V': {

                if (relative) {

                    const factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(values[0], dy * factorY, boxH)
                    ]);

                } else {

                    const { resY } = recalcPoint({
                        x: 0,
                        y: setCoord(values[0], dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([resY]);
                }
                break;
            }

            case 'T':
            case 'L': {

                if (relative) {

                    const factorX = getFactor(revX),
                        factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(values[0], dx * factorX, boxW), 
                        setRelativeCoord(values[1], dy * factorY, boxH)
                    ]);

                } else {

                    const { resX, resY } = recalcPoint({
                        x: setCoord(values[0], dx, fixedX, boxW),
                        y: setCoord(values[1], dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([resX, resY]);
                }
                break;
            }

            case 'M': {

                // M x y (or dx dy)
                const [ x, y ] = values;

                if (relative && !firstCommand) {

                    const factorX = getFactor(revX),
                        factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(x, dx * factorX, boxW), 
                        setRelativeCoord(y, dy * factorY, boxH)
                    ]);

                } else {

                    const { resX, resY } = recalcPoint({
                        x: setCoord(x, dx, fixedX, boxW),
                        y: setCoord(y, dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([resX, resY]);
                }
   
                break;
            }

            case 'Q': {

                //Q x1 y1, x y (or q dx1 dy1, dx dy)
                const [x1, y1, x, y] = values;

                if (relative) {

                    const factorX = getFactor(revX),
                        factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(x1, dx * factorX, boxW), 
                        setRelativeCoord(y1, dy * factorY, boxH), 
                        setRelativeCoord(x, dx * factorX, boxW), 
                        setRelativeCoord(y, dy * factorY, boxH)
                    ]);

                } else {

                    const factorX = revX && x1 > fixedX || !revX && x1 < fixedX ? -1 : 1,    
                        factorY = revY && y1 > fixedY || !revY && y1 < fixedY ? -1 : 1;

                    const { resX: resX1, resY: resY1 } = recalcPoint({
                        x: setCoord(x1, dx * factorX, fixedX, boxW),
                        y: setCoord(y1, dy * factorY, fixedY, boxH),
                        ...baseData
                    });

                    const { resX: resX2, resY: resY2 } = recalcPoint({
                        x: setCoord(x, dx, fixedX, boxW),
                        y: setCoord(y, dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([resX1, resY1, resX2, resY2]);
                }
                
                break;
            }

            case 'S': {

                //S x2 y2, x y (or s dx2 dy2, dx dy)
                const [ x2, y2, x, y ] = values;

                if (relative) {

                    const factorX = getFactor(revX),    
                        factorY = getFactor(revY);

                    res.push([
                        setRelativeCoord(x2, dx * factorX, boxW),
                        setRelativeCoord(y2, dy * factorY, boxH),
                        setRelativeCoord(x, dx * factorX, boxW),
                        setRelativeCoord(y, dy * factorY, boxH)
                    ]);
                } else {

                    const factorX = revX && x2 > fixedX || !revX && x2 < fixedX ? -1 : 1,    
                        factorY = revY && y2 > fixedY || !revY && y2 < fixedY ? -1 : 1;

                    const { resX : resX1, resY: resY1 } = recalcPoint({
                        x: setCoord(x2, dx * factorX, fixedX, boxW),
                        y: setCoord(y2, dy * factorY, fixedY, boxH),
                        ...baseData
                    });

                    const { resX : resX2, resY: resY2 } = recalcPoint({
                        x: setCoord(x, dx, fixedX, boxW),
                        y: setCoord(y, dy, fixedY, boxH),
                        ...baseData
                    });

                    res.push([
                        resX1,
                        resY1,
                        resX2,
                        resY2
                    ]);
                }
                break;
            }

            case 'Z': {
                res.push(['']);
                break;
            }
        }

        str += item.cmd + res[i].join(',') + ' ';

        firstCommand = false;
    }

    return str;
}

export function setCoord(value, diff, fixed, dist) {
    return value + diff * (Math.abs(value - fixed) / dist);
}

function setRelativeCoord(value, diff, dist) {
    return value + diff * (value / dist);
}

export function getFactor(b) {
    return b === true ? -1 : 1;
}