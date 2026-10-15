import { MIN_SIZE } from '../consts';

export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

const snapCandidate = (value: number, gridSize: number): number => (
    gridSize === 0
        ? value
        : Math.round(value / gridSize) * gridSize
);

export const snapToGrid = (value: number, snap: number): number | undefined => {
    if (snap === 0) {
        return value;
    } else {
        const result = snapCandidate(value, snap);

        if (result - value < snap) {
            return result;
        }
    }
};

export const floatToFixed = (val: number, size = 6): number => (
    Number(val.toFixed(size))
);

export const getMinMaxOfArray = (arr: number[][], length = 2): [number, number][] => {
    const res: [number, number][] = [];

    for (let i = 0; i < length; i++) {
        const axisValues = arr.map(e => e[i]);

        res.push([
            Math.min(...axisValues),
            Math.max(...axisValues)
        ]);
    }

    return res;
};

export const rotatorAngle = (
    alongX: number,
    alongY: number,
    acrossX: number,
    acrossY: number
): number => (
    Math.hypot(alongX, alongY) > 1e-6
        ? Math.atan2(alongY, alongX)
        : Math.atan2(acrossY, acrossX) + Math.PI / 2
);

interface ResizeBoxParams {
    width: number;
    height: number;
    dx: number;
    dy: number;
    doW?: boolean;
    doH?: boolean;
    proportions: boolean;
    flip: boolean;
}

const limitSize = (value: number, min: number, flip: boolean): number => {
    if (!flip) return Math.max(value, min);

    return Math.abs(value) < min ? (value < 0 ? -min : min) : value;
};

export const resizeBox = ({
    width,
    height,
    dx,
    dy,
    doW,
    doH,
    proportions,
    flip
}: ResizeBoxParams): [number, number, number, number] => {
    const baseWidth = Math.max(1, width),
        baseHeight = Math.max(1, height);

    const minWidth = Math.min(MIN_SIZE, baseWidth),
        minHeight = Math.min(MIN_SIZE, baseHeight);

    let newWidth: number,
        newHeight: number;

    if (proportions) {
        const ratio = limitSize(
            doW || !doH
                ? (baseWidth + dx) / baseWidth
                : (baseHeight + dy) / baseHeight,
            Math.max(minWidth / baseWidth, minHeight / baseHeight),
            flip
        );

        newWidth = baseWidth * ratio;
        newHeight = baseHeight * ratio;
    } else {
        newWidth = limitSize(baseWidth + dx, minWidth, flip);
        newHeight = limitSize(baseHeight + dy, minHeight, flip);
    }

    return [newWidth / baseWidth, newHeight / baseHeight, newWidth, newHeight];
};
