import { hitAreaOutline, outlineToPath } from '../src/js/core/transform/svg/hitAreas';

const box = (left, top, right, bottom) => ({
    tl: { x: left, y: top },
    tr: { x: right, y: top },
    bl: { x: left, y: bottom },
    br: { x: right, y: bottom }
});

const bounds = points => ({
    left: Math.min(...points.map(p => p.x)),
    right: Math.max(...points.map(p => p.x)),
    top: Math.min(...points.map(p => p.y)),
    bottom: Math.max(...points.map(p => p.y))
});

const signedArea = points => points.reduce((sum, p, i) => {
    const next = points[(i + 1) % points.length];
    return sum + p.x * next.y - next.x * p.y;
}, 0);

const round = value => Math.round(value * 1000) / 1000;

const roundBounds = b => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, round(v)]));

describe('hit areas', () => {
    it('keeps the full band around edges of a large box', () => {
        const corners = box(0, 0, 200, 100);

        expect(roundBounds(bounds(hitAreaOutline('te', corners.tl, corners, 8))))
            .toEqual({ left: 0, right: 200, top: -8, bottom: 8 });
        expect(roundBounds(bounds(hitAreaOutline('re', corners.tr, corners, 8))))
            .toEqual({ left: 192, right: 208, top: 0, bottom: 100 });
    });

    it('limits how deep edges reach into a narrow box', () => {
        const corners = box(0, 0, 200, 12);

        expect(roundBounds(bounds(hitAreaOutline('te', corners.tl, corners, 8))))
            .toEqual({ left: 0, right: 200, top: -8, bottom: 3 });
        expect(roundBounds(bounds(hitAreaOutline('be', corners.bl, corners, 8))))
            .toEqual({ left: 0, right: 200, top: 9, bottom: 20 });
    });

    it('keeps full circles around corners of a large box', () => {
        const corners = box(0, 0, 200, 100);

        expect(roundBounds(bounds(hitAreaOutline('tl', corners.tl, corners, 8))))
            .toEqual({ left: -8, right: 8, top: -8, bottom: 8 });
    });

    it('clips corner and middle handles inside a narrow box', () => {
        const corners = box(0, 0, 200, 12);

        expect(roundBounds(bounds(hitAreaOutline('br', corners.br, corners, 8))))
            .toEqual({ left: 192, right: 208, top: 9, bottom: 20 });
        expect(roundBounds(bounds(hitAreaOutline('tc', { x: 100, y: 0 }, corners, 8))))
            .toEqual({ left: 92, right: 108, top: -8, bottom: 3 });
    });

    it('follows a rotated box', () => {
        const c = Math.SQRT1_2;
        const rotate = ({ x, y }) => ({ x: x * c - y * c, y: x * c + y * c });
        const flat = box(0, 0, 200, 12);
        const corners = Object.fromEntries(Object.entries(flat).map(([k, p]) => [k, rotate(p)]));

        const outline = hitAreaOutline('te', corners.tl, corners, 8);
        const unrotated = outline.map(({ x, y }) => ({ x: x * c + y * c, y: -x * c + y * c }));

        expect(roundBounds(bounds(unrotated))).toEqual({ left: 0, right: 200, top: -8, bottom: 3 });
    });

    it('reaches outwards on both sides of a flat box', () => {
        const corners = box(0, 50, 200, 50);

        expect(roundBounds(bounds(hitAreaOutline('te', corners.tl, corners, 8))))
            .toEqual({ left: 0, right: 200, top: 42, bottom: 50 });
        expect(roundBounds(bounds(hitAreaOutline('be', corners.bl, corners, 8))))
            .toEqual({ left: 0, right: 200, top: 50, bottom: 58 });
    });

    it('leaves circles without a box untouched and winds every outline the same way', () => {
        const corners = box(0, 0, 200, 12);

        expect(roundBounds(bounds(hitAreaOutline('rotator', { x: 100, y: -30 }, null, 8))))
            .toEqual({ left: 92, right: 108, top: -38, bottom: -22 });

        ['te', 'be', 'le', 're', 'tl', 'br', 'tc'].forEach((key) => {
            expect(signedArea(hitAreaOutline(key, corners.tl, corners, 8))).toBeGreaterThan(0);
        });
    });

    it('builds an empty path for an empty outline', () => {
        expect(outlineToPath([])).toBe('');
        expect(outlineToPath([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }])).toBe('M0 0L1 0L1 1Z');
    });
});
