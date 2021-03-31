const {
    snapToGrid,
    floatToFixed,
    getMinMaxOfArray
} = require('../src/js/core/transform/common');

describe('snapToGrid func', () => {
    it('returns value near to grid size', () => {
        expect(snapToGrid(15, 30)).toBe(30);
    });

    it('returns value less than grid size', () => {
        expect(snapToGrid(10, 50)).toBe(0);
    });

    it('returns value with grid size equals 0', () => {
        expect(snapToGrid(15, 0)).toBe(15);
    });
});

describe('floatToFixed func', () => {
    it('returns rounded value', () => {
        expect(floatToFixed(1.23456789)).toBe(1.234568);
    });
});

describe('getMinMaxOfArray func', () => {
    it('returns min and max values', () => {
        const values = [
            [100, 2, 0, 1],
            [-1, 5, 0, 1]
        ];

        expect(
            getMinMaxOfArray(values)
        ).toMatchObject([[-1, 100], [2, 5]]);
    });
});