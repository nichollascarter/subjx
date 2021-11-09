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
    'M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z',
    'm 78.022826,217.94212 18.390625,-15.375 91.066399,0.0391 -18.38672,15.375 z'
];

const moved = [
    'M20,0 L100,0 L100,80 L20,80 L20,0 ',
    'M20,0 L100,0 L100,80 L20,80 Z',
    'M20,70 C50,0,75,0,105,70 C135,140,160,140,190,70 ',
    'M20,70 C48.33333333333333,23.333333333333336,76.66666666666667,23.333333333333336,105,70 C133.33333333333331,116.66666666666666,161.66666666666666,116.66666666666666,190,70 ',
    'M90,70 C90,94.8528137423857,110.1471862576143,115,135,115 L135,70 Z',
    'M88.022826,207.94212 L106.413451,192.56712 L197.47985,192.60621999999998 L179.09313,207.98121999999998 Z'
];

const pathExample = 'M9.573 2.28L5.593 2.21 5.593 13 4.161 15 4.165 2.29.187 2.29.181.961 9.572.964 9.571 2.29z';

const complexPath = 'm 468.40073,169.51405 c -81.79095,0.35958 -149.30336,18.16033 -156.21875,41.1875 -0.56516,1.88189 -0.7187,3.75366 -0.46875,5.59375 -0.97168,1.50623 -1.53125,3.24172 -1.53125,5.09375 l 0,340.5 c 0,2.1512 0.74899,4.153 2.03125,5.8125 l -0.21875,0 0.75,0.65625 c 0.54415,0.59928 1.1626,1.14133 1.84375,1.625 0.0188,0.0133 0.0436,0.0181 0.0625,0.0312 l 48.46875,42.3125 51.15625,44.65625 56.0625,-0.0625 56.0938,-0.0625 52.25,-44.5625 52.25,-44.59375 -1.375,0 c 1.2769,-1.6595 2.0312,-3.6613 2.0312,-5.8125 l 0,-340.5 c 0,-1.87506 -0.5369,-3.63711 -1.5312,-5.15625 3.3376,-23.89888 -60.5075,-44.52004 -145.7188,-46.5625 l -15.9375,-0.15625 z m 139.375,88.5625 -0.25,137.71875 -0.25,137.75 -11.125,2.75 c -19.7825,4.90058 -55.9925,9.875 -71.875,9.875 l -5.4063,0 0,-137.3125 0,-137.3125 4.3126,-0.5 c 2.3612,-0.279 10.4058,-1.00088 17.9062,-1.59375 21.0858,-1.66675 43.0386,-5.34696 63.9062,-10.6875 l 2.7813,-0.6875 z';

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
        expect(result).toEqual('M9.573,2.28 L5.593,2.21 L5.593,13 L4.161,15 L4.165,2.29 L0.187,2.29 L0.181,0.961 L9.572,0.964 L9.571,2.29 Z');
    });

    it('Apply resize to complex path', () => {
        const result = resizePath({ path: complexPath, localCTM: createSVGMatrix() });
        expect(result.lastIndexOf('M') > 0).toEqual(true);
    });
});

