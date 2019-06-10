export const unitRE = /px|em|%|ex|ch|rem|vh|vw|vmin|vmax|mm|cm|in|pt|pc|deg/;
export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

export function snapToGrid(value, snap) {

    if (snap === 0) {
        return value;
    } else {
        const result = snapCandidate(value, snap);

        if (result - value < snap) {
            return result;
        }
    }
}

export function snapCandidate(value, gridSize) {
    if (gridSize === 0) return value;
    return Math.round(value / gridSize) * gridSize;
}

export function rotatedTopLeft(
    x,
    y,
    width,
    height,
    rotationAngle,
    revX,
    revY
) {

    const hw = parseFloat(width) / 2,
        hh = parseFloat(height) / 2;

    const cx = x + hw,
        cy = y + hh;

    const dx = x - cx,
        dy = y - cy;

    const originalTopLeftAngle = Math.atan2(dy, dx);

    const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

    const radius = Math.sqrt(Math.pow(hw, 2) + Math.pow(hh, 2));

    let cos = Math.cos(rotatedTopLeftAngle),
        sin = Math.sin(rotatedTopLeftAngle);

    cos = revX === true ? -cos : cos;
    sin = revY === true ? -sin : sin;

    const rx = cx + radius * cos,
        ry = cy + radius * sin;

    return {
        left: floatToFixed(rx),
        top: floatToFixed(ry)
    }
}

export function toPX(value, parent) {
    if (/px/.test(value)) {
        return value;
    }
    if (/%/.test(value)) {
        return `${(parseFloat(value) * parseFloat(parent) / 100)}px`;
    }
}

export function fromPX(value, parent, toUnit) {
    if (/px/.test(toUnit)) {
        return value;
    }
    if (/%/.test(toUnit)) {
        return `${parseFloat(value) * 100 / parseFloat(parent)}%`;
    }
}

export function getUnitDimension(value) {
    return value.match(unitRE)[0];
}

export function floatToFixed(val) {
    return Number(val.toFixed(6));
}