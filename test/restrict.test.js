import { clampMove, clampEdge } from '../src/js/core/transform/restrict';

const area = { left: 0, top: 0, right: 300, bottom: 200 };

const restriction = box => ({ box, area });

describe('restrict', () => {
    it('stops a move exactly at the edge', () => {
        const box = { left: 200, top: 50, right: 260, bottom: 100 };

        expect(clampMove(restriction(box), 100, 0)).toEqual({ dx: 40, dy: 0 });
        expect(clampMove(restriction(box), -500, 500)).toEqual({ dx: -200, dy: 100 });
    });

    it('keeps moves inside the area untouched', () => {
        const box = { left: 100, top: 50, right: 160, bottom: 100 };

        expect(clampMove(restriction(box), 20, -30)).toEqual({ dx: 20, dy: -30 });
    });

    it('lets an element outside move inwards only', () => {
        const box = { left: -100, top: 50, right: -40, bottom: 100 };

        expect(clampMove(restriction(box), -10, 0).dx).toEqual(0);
        expect(clampMove(restriction(box), 70, 0).dx).toEqual(70);
        expect(clampMove(restriction(box), 1000, 0).dx).toEqual(340);
    });

    it('freezes an axis when the element is larger than the area', () => {
        const box = { left: -10, top: 50, right: 310, bottom: 100 };

        expect(clampMove(restriction(box), 15, 5)).toEqual({ dx: 0, dy: 5 });
    });

    it('clamps a moving edge or point', () => {
        expect(clampEdge(260, 0, 300, 100)).toEqual(40);
        expect(clampEdge(260, 0, 300, -100)).toEqual(-100);
        expect(clampEdge(320, 0, 300, 10)).toEqual(0);
        expect(clampEdge(320, 0, 300, -30)).toEqual(-30);
    });
});
