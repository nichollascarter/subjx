export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

const snapCandidate = (value, gridSize) => (
    gridSize === 0
        ? value
        : Math.round(value / gridSize) * gridSize
);

export const snapToGrid = (value, snap) => {
    if (snap === 0) {
        return value;
    } else {
        const result = snapCandidate(value, snap);

        if (result - value < snap) {
            return result;
        }
    }
};

export const floatToFixed = (val, size = 6) => (
    Number(val.toFixed(size))
);

export const getMinMaxOfArray = (arr, length = 2) => {
    const res = [];

    for (let i = 0; i < length; i++) {
        const axisValues = arr.map(e => e[i]);

        res.push([
            Math.min(...axisValues),
            Math.max(...axisValues)
        ]);
    }

    return res;
};