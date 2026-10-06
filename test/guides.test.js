import { align, boxFromPoints, unionBoxes } from '../src/js/core/transform/guides';

const box = { left: 0, top: 0, right: 100, bottom: 50 };
const target = { left: 200, top: 100, right: 300, bottom: 180 };

const state = (overrides = {}) => ({
    box,
    targets: [target],
    threshold: 6,
    snap: true,
    ...overrides
});

describe('guides', () => {
    it('snaps the nearest edge within the threshold', () => {
        const { dx, dy } = align(state(), 96, 0);

        expect(dx).toEqual(100);
        expect(dy).toEqual(0);
    });

    it('snaps centers', () => {
        const { dx, lines } = align(state(), 148, 0);

        expect(dx).toEqual(150);
        expect(lines).toContainEqual({ axis: 'x', value: 250, from: 0, to: 180 });
    });

    it('keeps the move when nothing is close', () => {
        const { dx, dy, lines } = align(state(), 40, 10);

        expect([dx, dy]).toEqual([40, 10]);
        expect(lines).toEqual([]);
    });

    it('snaps both axes independently', () => {
        const { dx, dy } = align(state(), 197, 97);

        expect([dx, dy]).toEqual([200, 100]);
    });

    it('respects disabled axes', () => {
        const { dx, dy } = align(state(), 197, 97, { x: false });

        expect([dx, dy]).toEqual([197, 100]);
    });

    it('only shows guides when snapping is off', () => {
        const { dx, lines } = align(state({ snap: false }), 96, 0);

        expect(dx).toEqual(96);
        expect(lines.map(line => line.axis)).toContain('x');
    });

    it('merges guides on the same line', () => {
        const other = { left: 200, top: 300, right: 260, bottom: 340 };
        const { lines } = align(state({ targets: [target, other] }), 100, 0);

        expect(lines.filter(line => line.axis === 'x' && line.value === 200)).toEqual([
            { axis: 'x', value: 200, from: 0, to: 340 }
        ]);
    });

    it('builds boxes from points', () => {
        expect(boxFromPoints([[10, 5], [0, 20], [30, 0]])).toEqual({ left: 0, top: 0, right: 30, bottom: 20 });
        expect(unionBoxes([box, target])).toEqual({ left: 0, top: 0, right: 300, bottom: 180 });
    });
});
