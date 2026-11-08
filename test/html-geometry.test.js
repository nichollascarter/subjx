import { conjugate, mapVertices, pinnedMatrix, rotation, toPoints, toVectors } from '../src/js/core/transform/html/geometry';
import { lineStyle } from '../src/js/core/transform/html/controls';
import { createTranslateMatrix, createIdentityMatrix, multiplyMatrixAndPoint } from '../src/js/core/transform/matrix';

const near = (actual, expected) => actual.forEach((value, index) => expect(value).toBeCloseTo(expected[index]));

describe('html geometry', () => {
    it('rotates around a pivot', () => {
        const matrix = conjugate(rotation(Math.PI / 2), createTranslateMatrix(-10, 0));
        const [x, y] = multiplyMatrixAndPoint(matrix, [20, 0, 0, 1]);

        near(multiplyMatrixAndPoint(matrix, [-10, 0, 0, 1]).slice(0, 2), [-10, 0]);
        expect(Math.hypot(x + 10, y)).toBeCloseTo(30);
        near([x, y], [-10, 30]);
    });

    it('pins the opposite side while resizing', () => {
        const scaled = createTranslateMatrix(6, 4);

        near(multiplyMatrixAndPoint(pinnedMatrix(scaled, createIdentityMatrix()), [0, 0, 0, 1]).slice(0, 2), [0, 0]);
        near(multiplyMatrixAndPoint(pinnedMatrix(scaled, createIdentityMatrix(), true, true), [0, 0, 0, 1]).slice(0, 2), [-12, -8]);
    });

    it('converts vertices between vectors and points', () => {
        const vectors = toVectors({ tl: [1, 2], br: [3, 4] });

        expect(vectors).toEqual({ tl: [1, 2, 0, 1], br: [3, 4, 0, 1] });
        expect(toPoints(vectors)).toEqual({ tl: { x: 1, y: 2 }, br: { x: 3, y: 4 } });
        expect(mapVertices({ tl: [1, 2] }, ([x, y, z, w]) => [x * 2, y * 2, z, w])).toEqual({ tl: [2, 4, 0, 1] });
    });

    it('positions a line between two points', () => {
        expect(lineStyle([0, 0], [100, 0])).toEqual({
            transform: 'translate(0px, -0.5px) rotate(180deg)',
            width: '100px'
        });
        expect(lineStyle([0, 0], [0, 50]).width).toBe('50px');
    });
});
