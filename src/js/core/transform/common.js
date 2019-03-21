export const unitRE = /px|em|%|ex|ch|rem|vh|vw|vmin|vmax|mm|cm|in|pt|pc|deg/;
export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

export function recalcPoint(params) {

    const { 
        x, 
        y, 
        centerX,
        centerY,
        angle,
        newCenterX,
        newCenterY
    } = params;

    const oldCoords = getRotatedPoint(
        centerX,
        centerY,
        x,
        y,
        angle,
        false,
        false
    );

    const coords = getRotatedPoint(
        newCenterX,
        newCenterY,
        x,
        y,
        angle,
        false,
        false
    );

    const nx = x - (oldCoords.left - coords.left),
        ny = y - (oldCoords.top - coords.top);

    return {
        resX: floatToFixed(nx),
        resY: floatToFixed(ny)
    }
}

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
    return gridSize * Math.round(value / gridSize);
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
                
    const cx = x + parseFloat(width) / 2,
        cy = y + parseFloat(height) / 2;

    const dx = x - cx,
        dy = y - cy;

    const originalTopLeftAngle = Math.atan2(dy, dx);

    const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

    const radius = Math.sqrt(Math.pow(parseFloat(width) / 2, 2) + Math.pow(parseFloat(height) / 2, 2));
            
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

export function getRotatedPoint(
    cx, 
    cy, 
    x, 
    y, 
    angle, 
    revX, 
    revY
) {

    let cos = Math.cos(angle),
        sin = Math.sin(angle);

    cos = revX === true ? -cos : cos;
    sin = revY === true ? -sin : sin;

    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return {
        left: floatToFixed(nx),
        top: floatToFixed(ny)
    }
}

export function toPX(value, parent) {
    if (/px/.test(value)) {
        return value;
    }
    if (/%/.test(value)) {
        return `${parseFloat(value) * parseFloat(parent) / 100}px`;
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