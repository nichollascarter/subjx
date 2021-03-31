import Subjx from '../src/js/core';
import JsDOM from 'jsdom';

function subjx(params) {
    return new Subjx(params);
}

const jsdom = new JsDOM.JSDOM('<html><head></head><body></body></html>');
document = jsdom.window.document;
window = jsdom.window;

beforeEach(() => {
    jest.useFakeTimers();

    Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({
            getPropertyValue: () => {
                return '';
            }
        })
    });

    const SVGMatrixMock = () => jest.fn().mockImplementation(() => ({
        martix: jest.fn(() => [[]]),
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 10,
        f: 10,
        flipX: jest.fn().mockImplementation(() => window.SVGElement),
        flipY: jest.fn().mockImplementation(() => window.SVGElement),
        inverse: jest.fn().mockImplementation(() => SVGMatrixMock()()),
        multiply: jest.fn().mockImplementation(() => SVGMatrixMock()()),
        rotate: jest.fn().mockImplementation(() => ({
            translate: jest.fn().mockImplementation(() => ({
                rotate: jest.fn()
            }))
        })),
        rotateFromVector: jest.fn().mockImplementation(() => window.SVGElement),
        scale: jest.fn().mockImplementation(() => window.SVGElement),
        scaleNonUniform: jest.fn().mockImplementation(() => window.SVGElement),
        skewX: jest.fn().mockImplementation(() => window.SVGElement),
        skewY: jest.fn().mockImplementation(() => window.SVGElement),
        translate: jest.fn().mockImplementation(() => ({
            multiply: jest.fn().mockImplementation(() => ({
                multiply: jest.fn().mockImplementation(() => window.SVGElement)
            }))
        }))
    }));

    Object.defineProperty(window.SVGElement.prototype, 'createSVGMatrix', {
        writable: true,
        value: SVGMatrixMock()
    });

    Object.defineProperty(window.SVGElement.prototype, 'createSVGPoint', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
            x: 0,
            y: 0,
            matrixTransform: jest.fn().mockImplementation(() => ({
                x: 150,
                y: 150
            }))
        }))
    });

    Object.defineProperty(window.SVGElement.prototype, 'createSVGTransform', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
            angle: 0,
            matrix: {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 0,
                f: 0,
                multiply: jest.fn()
            },
            setMatrix: jest.fn(),
            setTranslate: jest.fn()
        }))
    });

    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
            x: 0,
            y: 0,
            width: 150,
            height: 150
        }))
    });

    Object.defineProperty(window.SVGElement.prototype, 'getScreenCTM', {
        writable: true,
        value: SVGMatrixMock()
    });

    Object.assign(window.SVGElement.prototype, {
        x1: { baseVal: { value: 0 } },
        x2: { baseVal: { value: 0 } },
        y1: { baseVal: { value: 0 } },
        y2: { baseVal: { value: 0 } }
    });
});

afterEach(() => {
    jest.useRealTimers();
});

document.body.innerHTML = `
    <div id="cloneable" style="display: block"><div>
    <div id="container" style="display: block; position: absolute">
        <div id="draggable" class="draggables" style="display: block; position: absolute"><div>
        <div id="draggable" class="draggables" style="display: block; position: absolute"><div>
    </div>
    <svg id="svg-container" xmlns="http://www.w3.org/2000/svg">
        <path id="svg-draggable" d="M691,331 Q711,306,721,331 T761,331 " fill="none" stroke="blue" stroke-width="5"></path>
    </svg>
`;

const domElement = document.getElementById('draggable');
const draggables = document.getElementsByClassName('draggables');
const draggableContainer = document.getElementById('container');
const cloneableElement = document.getElementById('cloneable');

const svgElement = document.getElementById('svg-draggable');
const svgContainerElement = document.getElementById('svg-container');

const defaultOptions = {
    axis: 'xy',
    cursorMove: 'auto',
    cursorRotate: 'auto',
    cursorResize: 'auto',
    rotationPoint: false,
    restrict: null,
    snap: { x: 10, y: 10, angle: 0.17453292519943295 },
    each: { move: false, resize: false, rotate: false },
    proportions: false,
    draggable: true,
    resizable: true,
    rotatable: true,
    scalable: false,
    applyTranslate: false,
    custom: null,
    rotatorAnchor: null,
    rotatorOffset: 50,
    showNormal: true
};

const options = {
    rotationPoint: true,
    proportions: true,
    axis: 'x',
    each: {
        move: true,
        resize: true,
        rotate: true
    },
    snap: {
        x: 10,
        y: 20,
        angle: 30
    },
    cursorMove: 'move',
    cursorRotate: 'crosshair',
    cursorResize: 'pointer',
    draggable: true,
    resizable: true,
    rotatable: true,
    scalable: true,
    applyTranslate: false,
    custom: null,
    rotatorAnchor: 's',
    rotatorOffset: 20,
    showNormal: true
};

const createEMouseDown = () =>
    new MouseEvent('mousedown', {
        clientX: 10,
        clientY: 10,
        bubbles: true,
        cancelable: true,
        view: window
    });

const createEMouseMove = () =>
    new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 150,
        bubbles: true,
        cancelable: true,
        view: window
    });

const createEMouseUp = () =>
    new MouseEvent('mouseup', {
        clientX: 150,
        clientY: 150,
        bubbles: true,
        cancelable: true,
        view: window
    });

describe('Test subjx "clone" method', () => {
    it('init cloneable with defaults', () => {
        subjx(cloneableElement).clone();
    });
});

describe('Test subjx "drag" method', () => {
    it('init draggable with defaults', () => {
        const [draggable] = subjx(domElement).drag();
        expect(draggable.options).toEqual({
            ...defaultOptions,
            container: draggableContainer,
            controlsContainer: draggableContainer
        });

        draggable.disable();
    });

    it('init draggable with options', () => {
        const nextOptions = {
            ...options,
            container: '#container',
            restrict: '#container'
        };
        const $draggables = subjx(draggables).drag({
            ...nextOptions
        });

        expect($draggables[0].options).toMatchObject({
            ...nextOptions,
            restrict: draggableContainer,
            container: draggableContainer,
            controlsContainer: draggableContainer,
            snap: {
                ...nextOptions.snap,
                angle: 0.5235987755982988
            }
        });

        $draggables.forEach(item => item.disable());
    });

    it('test subjx hooks', () => {
        let init = false,
            move = false,
            resize = false,
            rotate = false,
            drop = false,
            destroy = false;

        const methods = {
            onInit() {
                init = true;
            },
            onMove() {
                move = true;
            },
            onResize() {
                resize = true;
            },
            onRotate() {
                rotate = true;
            },
            onDrop() {
                drop = true;
            },
            onDestroy() {
                destroy = true;
            }
        };

        const [draggable] = subjx(domElement).drag({ ...methods });

        // simulate move
        draggable.el.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        // simulate resize
        draggable.storage.handles.tr.dispatchEvent(createEMouseDown());

        step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        // simulate rotate
        draggable.storage.handles.rotator.dispatchEvent(createEMouseDown());

        step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        draggable.disable();

        expect([
            init,
            move,
            rotate,
            resize,
            drop,
            destroy
        ].every((item) => item === true)).toEqual(true);
    });

    it('process move', () => {
        const $draggables = subjx(draggables).drag({ each: { move: true } });

        $draggables[0].el.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect($draggables[0].storage).toMatchObject({
            clientX: 150,
            clientY: 150,
            cx: 10,
            cy: 10,
            isTarget: true
        });

        $draggables.forEach(item => item.disable());
    });

    it('test subjx api', () => {
        const [draggable] = subjx(draggables).drag({ each: { move: true } });

        expect(() => {
            draggable.fitControlsToSize();
            draggable.resetCenterPoint();
            draggable.getBoundingRect();
            ['t', 'b', 'l', 'b', 'r', 'v', 'h'].map((align) => draggable.applyAlignment(align));
        }).not.toThrow();
    });
});

describe('Test svg subjx "drag" method', () => {
    it('init draggable with defaults', () => {
        const [draggable] = subjx(svgElement).drag();
        expect(draggable.options).toEqual({
            ...defaultOptions,
            container: svgContainerElement,
            controlsContainer: svgContainerElement
        });

        draggable.disable();
    });

    it('init draggable with options', () => {
        const nextOptions = {
            container: '#svg-container',
            restrict: '#svg-container',
            ...options
        };

        const $draggables = subjx(svgElement).drag({
            ...nextOptions
        });

        expect($draggables[0].options).toMatchObject({
            ...nextOptions,
            restrict: svgContainerElement,
            container: svgContainerElement,
            controlsContainer: svgContainerElement,
            snap: {
                ...nextOptions.snap,
                angle: 0.5235987755982988
            }
        });

        $draggables.forEach(item => item.disable());
    });

    it('test subjx hooks', () => {
        let init = false,
            move = false,
            resize = false,
            rotate = false,
            drop = false,
            destroy = false;

        const methods = {
            onInit() {
                init = true;
            },
            onMove() {
                move = true;
            },
            onResize() {
                resize = true;
            },
            onRotate() {
                rotate = true;
            },
            onDrop() {
                drop = true;
            },
            onDestroy() {
                destroy = true;
            }
        };

        const [draggable] = subjx(svgElement).drag({ ...methods });

        // simulate move
        draggable.el.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        // simulate resize
        draggable.storage.handles.tr.dispatchEvent(createEMouseDown());

        step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        // simulate rotate
        draggable.storage.handles.rotator.dispatchEvent(createEMouseDown());

        step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        draggable.disable();

        expect([
            init,
            move,
            rotate,
            resize,
            drop,
            destroy
        ].every((item) => item === true)).toEqual(true);
    });

    it('process move', () => {
        const $draggables = subjx(svgElement).drag({ each: { move: true } });

        $draggables[0].el.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect($draggables[0].storage).toMatchObject({
            clientX: 150,
            clientY: 150,
            cx: 150,
            cy: 150,
            isTarget: true
        });

        $draggables.forEach(item => item.disable());
    });

    it('test subjx api', () => {
        const [draggable] = subjx(svgElement).drag({ each: { move: true } });

        expect(() => {
            draggable.fitControlsToSize();
            draggable.resetCenterPoint();
            draggable.getBoundingRect();
            ['t', 'b', 'l', 'b', 'r', 'v', 'h'].map((align) => draggable.applyAlignment(align));
        }).not.toThrow();
    });
});