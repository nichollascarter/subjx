import { rotatorPlacement, alignmentOffset, boxVertices, edgeSegments } from '../src/js/core/transform/common';
import { lineRotator } from '../src/js/core/transform/svg/vertices';

const toPoints = vertices => Object.keys(vertices).reduce((res, key) => {
    const [x, y] = vertices[key];
    return { ...res, [key]: { x, y } };
}, {});

const box = toPoints(boxVertices({ x: 0, y: 0, width: 100, height: 50 }));

const near = (point, x, y) => {
    expect(point.x).toBeCloseTo(x);
    expect(point.y).toBeCloseTo(y);
};

describe('box vertices', () => {
    it('places corners, edge midpoints and center', () => {
        expect(boxVertices({ x: 10, y: 20, width: 100, height: 50 })).toEqual({
            tl: [10, 20],
            tr: [110, 20],
            mr: [110, 45],
            ml: [10, 45],
            tc: [60, 20],
            bc: [60, 70],
            br: [110, 70],
            bl: [10, 70],
            center: [60, 45]
        });
    });

    it('builds edge segments from corners', () => {
        const { te, be, le, re } = edgeSegments(box);

        expect(te).toEqual([box.tl, box.tr]);
        expect(be).toEqual([box.bl, box.br]);
        expect(le).toEqual([box.tl, box.bl]);
        expect(re).toEqual([box.tr, box.br]);
    });
});

describe('rotator placement', () => {
    it('defaults to the east side', () => {
        const { anchor, rotator } = rotatorPlacement(box, null, 30);

        near(anchor, 100, 25);
        near(rotator, 130, 25);
    });

    it('places the rotator above, below and to the left', () => {
        near(rotatorPlacement(box, 'n', 30).rotator, 50, -30);
        near(rotatorPlacement(box, 's', 30).rotator, 50, 80);
        near(rotatorPlacement(box, 'w', 30).rotator, -30, 25);
        near(rotatorPlacement(box, 'e', 30).rotator, 130, 25);
    });

    it('places a line rotator on the normal of its middle', () => {
        const { anchor, rotator } = lineRotator({ x: 0, y: 0 }, { x: 100, y: 0 }, 'n', 20);

        near(anchor, 50, 0);
        near(rotator, 50, -20);
        near(lineRotator({ x: 0, y: 0 }, { x: 100, y: 0 }, 's', 20).rotator, 50, 20);
        near(lineRotator({ x: 5, y: 5 }, { x: 5, y: 5 }, null, 10).rotator, 5, -5);
    });
});

describe('alignment offset', () => {
    const bounds = [[0, 200], [0, 100]];
    const element = [[50, 70], [40, 60]];

    it('aligns to edges and centers', () => {
        expect(alignmentOffset('l', bounds, element)).toEqual([-50, 0]);
        expect(alignmentOffset('r', bounds, element)).toEqual([130, 0]);
        expect(alignmentOffset('t', bounds, element)).toEqual([0, -40]);
        expect(alignmentOffset('b', bounds, element)).toEqual([0, 40]);
        expect(alignmentOffset('hv', bounds, element)).toEqual([40, 0]);
        expect(alignmentOffset('tl', bounds, element)).toEqual([-50, -40]);
    });

    it('ignores unknown directions', () => {
        expect(alignmentOffset('x', bounds, element)).toEqual([0, 0]);
    });
});
