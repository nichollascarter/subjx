import { cursorFromAngle, handleCursor, resizeCursor } from '../src/js/core/transform/transformable/cursors';

const at = (x, y) => ({
    getBoundingClientRect: () => ({ left: x, top: y, width: 0, height: 0 })
});

const rotate = ([x, y], degrees, [cx, cy] = [50, 50]) => {
    const radians = degrees * Math.PI / 180;
    const dx = x - cx;
    const dy = y - cy;
    return [
        cx + dx * Math.cos(radians) - dy * Math.sin(radians),
        cy + dx * Math.sin(radians) + dy * Math.cos(radians)
    ];
};

const box = (degrees = 0) => {
    const points = {
        te: [50, 0],
        be: [50, 100],
        le: [0, 50],
        re: [100, 50],
        tl: [0, 0],
        tr: [100, 0],
        br: [100, 100],
        bl: [0, 100],
        tc: [50, 0],
        bc: [50, 100],
        ml: [0, 50],
        mr: [100, 50],
        p1: [0, 0],
        rotator: [50, -50]
    };

    return Object.fromEntries(
        Object.entries(points).map(([key, point]) => [key, at(...rotate(point, degrees))])
    );
};

describe('cursorFromAngle', () => {
    it.each([
        [0, 'ew-resize'],
        [Math.PI / 4, 'nwse-resize'],
        [Math.PI / 2, 'ns-resize'],
        [3 * Math.PI / 4, 'nesw-resize'],
        [Math.PI, 'ew-resize'],
        [-Math.PI / 4, 'nesw-resize'],
        [-Math.PI / 2, 'ns-resize'],
        [-3 * Math.PI / 4, 'nwse-resize']
    ])('maps %f radians to %s', (radians, cursor) => {
        expect(cursorFromAngle(radians)).toEqual(cursor);
    });
});

describe('resizeCursor', () => {
    it('points corners, sides and edges of an upright box', () => {
        const handles = box();

        expect(resizeCursor(handles, 'tl')).toEqual('nwse-resize');
        expect(resizeCursor(handles, 'br')).toEqual('nwse-resize');
        expect(resizeCursor(handles, 'tr')).toEqual('nesw-resize');
        expect(resizeCursor(handles, 'bl')).toEqual('nesw-resize');
        expect(resizeCursor(handles, 'tc')).toEqual('ns-resize');
        expect(resizeCursor(handles, 'te')).toEqual('ns-resize');
        expect(resizeCursor(handles, 'mr')).toEqual('ew-resize');
        expect(resizeCursor(handles, 'le')).toEqual('ew-resize');
    });

    it('follows the rotation of the element', () => {
        const handles = box(45);

        expect(resizeCursor(handles, 'tl')).toEqual('ns-resize');
        expect(resizeCursor(handles, 'tr')).toEqual('ew-resize');
        expect(resizeCursor(handles, 'tc')).toEqual('nesw-resize');
        expect(resizeCursor(handles, 'mr')).toEqual('nwse-resize');
    });

    it('gives nothing without the top and bottom edges', () => {
        const { tl } = box();

        expect(resizeCursor({ tl }, 'tl')).toBeNull();
    });
});

describe('handleCursor', () => {
    it('picks a cursor by the handle key', () => {
        const handles = box();

        expect(handleCursor(handles, 'br')).toEqual('nwse-resize');
        expect(handleCursor(handles, 'p1')).toEqual('crosshair');
        expect(handleCursor(handles, 'rotator')).toBeNull();
        expect(handleCursor(handles, null)).toBeNull();
    });
});
