const DOM_GLOBALS = [
    'window',
    'document',
    'SVGElement',
    'MouseEvent',
    'HTMLElement',
    'Element',
    'requestAnimationFrame',
    'cancelAnimationFrame'
];

describe('import without a DOM', () => {
    let saved;

    beforeEach(() => {
        saved = DOM_GLOBALS.map((key) => [key, global[key]]);
        DOM_GLOBALS.forEach((key) => {
            delete global[key];
        });
    });

    afterEach(() => {
        saved.forEach(([key, value]) => {
            global[key] = value;
        });
    });

    it('loads the library when window and document are missing', () => {
        jest.isolateModules(() => {
            const lib = require('../src/js/index');

            expect(typeof lib.default).toBe('function');
            expect(typeof lib.createObservable).toBe('function');
        });
    });

    it('falls back to timers for animation frames', () => {
        jest.isolateModules(() => {
            const { requestAnimFrame, cancelAnimFrame } = require('../src/js/core/util/util');
            const callback = jest.fn();

            const id = requestAnimFrame(callback);
            cancelAnimFrame(id);

            expect(callback).not.toHaveBeenCalled();
        });
    });
});
