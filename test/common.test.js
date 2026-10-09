import { rotatorAngle } from '../src/js/core/transform/common';

describe('rotatorAngle', () => {
    it('points along the box side', () => {
        expect(rotatorAngle(0, 40, 100, 0)).toBeCloseTo(Math.PI / 2);
        expect(rotatorAngle(-100, 0, 0, 40)).toBeCloseTo(Math.PI);
    });

    it('falls back to the perpendicular of the other side when the box is flat', () => {
        expect(rotatorAngle(0, 0, 100, 0)).toBeCloseTo(Math.PI / 2);
        expect(rotatorAngle(0, 0, 0, 40)).toBeCloseTo(Math.PI);
    });

    it('keeps the rotation of a flat rotated box', () => {
        const a = Math.PI / 6;
        expect(rotatorAngle(0, 0, Math.cos(a) * 100, Math.sin(a) * 100)).toBeCloseTo(a + Math.PI / 2);
    });
});
