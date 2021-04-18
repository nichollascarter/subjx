import {
    movePath,
    resizePath
} from '../src/js/core/transform/svg/path';

import { createSVGMatrix } from '../src/js/core/transform/svg/util';

const createElementNS = document.createElementNS;

beforeEach(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    document.createElementNS = () => {
        const el = svg;

        el.createSVGPoint = () => {
            return {
                x: 0,
                y: 0,
                matrixTransform: () => {
                    return { x: 0, y: 0 };
                }
            };
        };

        el.createSVGMatrix = () => {
            return {
                a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
            };
        };

        return el;
    };
});

afterEach(() => {
    document.createElementNS = createElementNS;
});

const paths = [
    'M10 10 H 90 V 90 H 10 L 10 10',
    'M10 10 h 80 v 80 h -80 Z',
    'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
    'M10 80 Q 52.5 10, 95 80 T 180 80',
    'M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z'
];

const moved = [
    'M20,0 H100 V80 H20 L20,0 ',
    'M20,0 h80 v80 h-80 Z',
    'M20,70 C50,0,75,0,105,70 S160,140,190,70 ',
    'M20,70 Q62.5,0,105,70 T190,70 ',
    'M90,70 A45,45,0,0,0,135,115 L135,70 Z'
];

const pathExample = 'M9.573 2.28L5.593 2.21 5.593 13 4.161 15 4.165 2.29.187 2.29.181.961 9.572.964 9.571 2.29z';

describe('SVG <path/> transform', () => {
    it('Apply move to svg path', () => {
        const result = paths.map((path) => movePath({ path, dx: 10, dy: -10 }));

        expect(result).toEqual(moved);
    });

    it('Apply resize to svg path', () => {
        const result = paths.map((path) => resizePath({ path, localCTM: createSVGMatrix() }));
        expect(result).toBeDefined();
    });

    it('Apply move to raw path', () => {
        const result = movePath({ path: pathExample, dx: 0, dy: 0 });

        expect(result).toEqual('M9.573,2.28 L5.593,2.21,5.593,13,4.161,15,4.165,2.29,0.187,2.29,0.181,0.961,9.572,0.964,9.571,2.29 z');
    });
});

