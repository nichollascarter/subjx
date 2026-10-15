import { rotatorAngle, resizeBox } from '../src/js/core/transform/common';
import { MIN_SIZE } from '../src/js/core/consts';

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

describe('resizeBox', () => {
    const box = { width: 80, height: 40, doW: true, doH: true, proportions: false, flip: true };

    it('scales by the handle delta', () => {
        expect(resizeBox({ ...box, dx: 40, dy: -20 })).toEqual([1.5, 0.5, 120, 20]);
    });

    it('never lands on a zero size when crossing the opposite edge', () => {
        const [scaleX, scaleY, width, height] = resizeBox({ ...box, dx: -80, dy: -40 });

        expect([width, height]).toEqual([MIN_SIZE, MIN_SIZE]);
        expect(scaleX).not.toBe(0);
        expect(scaleY).not.toBe(0);
    });

    it('mirrors past the opposite edge when flip is on', () => {
        expect(resizeBox({ ...box, dx: -81, dy: -120 })).toEqual([-MIN_SIZE / 80, -2, -MIN_SIZE, -80]);
    });

    it('stops at the minimum size when flip is off', () => {
        expect(resizeBox({ ...box, flip: false, dx: -200, dy: -200 })).toEqual([MIN_SIZE / 80, MIN_SIZE / 40, MIN_SIZE, MIN_SIZE]);
    });

    it('keeps the aspect ratio at the minimum with proportions', () => {
        const [scaleX, scaleY, width, height] = resizeBox({ ...box, proportions: true, flip: false, dx: -200, dy: 0 });

        expect(scaleX).toBe(scaleY);
        expect(height).toBe(MIN_SIZE);
        expect(width).toBe(MIN_SIZE * 2);
    });

    it('does not grow a flat box on the axis that is not resized', () => {
        const [, scaleY, , height] = resizeBox({ ...box, height: 0, flip: false, dx: 10, dy: 0 });

        expect(scaleY).toBe(1);
        expect(height).toBe(1);
    });
});
