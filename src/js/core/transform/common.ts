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
