import Subjx, { Observable } from '../src/js/core';

function subjx(params) {
    return new Subjx(params);
}

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
        <line id="svg-line" x1="0" y1="0" x2="100" y2="0" stroke="blue"></line>
    </svg>
`;

const domElement = document.getElementById('draggable');
const draggables = document.getElementsByClassName('draggables');
const draggableContainer = document.getElementById('container');
const cloneableElement = document.getElementById('cloneable');

const svgElement = document.getElementById('svg-draggable');
const svgContainerElement = document.getElementById('svg-container');
const svgLineElement = document.getElementById('svg-line');

const defaultOptions = {
    axis: 'xy',
    cursorMove: 'auto',
    cursorRotate: null,
    cursorResize: null,
    restrict: null,
    snap: { x: 0, y: 0, angle: 0 },
    each: { move: false, resize: false, rotate: false },
    proportions: false,
    flip: true,
    draggable: true,
    resizable: true,
    handles: null,
    hitRadius: 0,
    showHitAreas: false,
    guides: null,
    rotatable: true,
    scalable: false,
    applyTranslate: false,
    custom: null,
    rotatorAnchor: null,
    rotatorOffset: 50,
    showNormal: true,
    isGrouped: false,
    transformOrigin: false
};

const options = {
    transformOrigin: true,
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

    it('subscribes to every drag event', () => {
        const cloneable = subjx(cloneableElement).clone();

        expect(() => {
            ['dragStart', 'drag', 'dragEnd'].forEach(name => cloneable.on(name, () => {}));
        }).not.toThrow();

        cloneable.disable();
    });
});

describe('Test subjx "drag" method', () => {
    it('init draggable with defaults', () => {
        const draggable = subjx(domElement).drag();
        expect(draggable.options).toEqual({
            ...defaultOptions,
            container: draggableContainer,
            controlsContainer: draggableContainer
        });

        draggable.disable();
    });

    it('fills missing snap values with defaults', () => {
        const draggable = subjx(domElement).drag({ snap: { x: 5 } });

        expect(draggable.options.snap).toEqual({
            ...defaultOptions.snap,
            x: 5
        });

        draggable.disable();
    });

    it('test subjx api', () => {
        const draggable = subjx(draggables).drag({ each: { move: true } });

        expect(() => {
            draggable.fitControlsToSize();
            draggable.getBoundingRect();
            draggable.setTransformOrigin({ x: 0, y: 0 });
            draggable.getDimensions();
            ['t', 'b', 'l', 'r', 'v', 'h'].map(align => draggable.applyAlignment(align));
        }).not.toThrow();

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

        expect($draggables.options).toMatchObject({
            ...nextOptions,
            restrict: draggableContainer,
            container: draggableContainer,
            controlsContainer: draggableContainer,
            snap: {
                ...nextOptions.snap,
                angle: 0.5235987755982988
            }
        });

        $draggables.disable();
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

        const draggable = subjx(domElement).drag({ ...methods });

        // simulate move
        draggable.elements[0].dispatchEvent(createEMouseDown());

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

        $draggables.elements[0].dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect($draggables.storage).toMatchObject({
            clientX: 150,
            clientY: 150,
            relativeX: 10,
            relativeY: 10,
            isTarget: true
        });

        $draggables.disable();
    });

    it('exposes handles without going through storage', () => {
        const draggable = subjx(domElement).drag();

        expect(draggable.handles).toBe(draggable.storage.handles);
        expect(draggable.handles.tl).toBeInstanceOf(HTMLElement);

        draggable.disable();
    });

    it('moves subscribed peers through a shared observable', () => {
        const [leader, follower] = ['leader', 'follower'].map((id) => {
            const element = document.createElement('div');
            element.id = id;
            element.style.cssText = 'display: block; position: absolute';
            draggableContainer.appendChild(element);
            return element;
        });

        const observable = new Observable();
        const $follower = subjx(follower).drag({ each: { move: true } }, observable);
        const $leader = subjx(leader).drag({ each: { move: true } }, observable);
        const leaderDrops = jest.fn();
        $leader.on('dragEnd', leaderDrops);

        const dragLeader = () => {
            leader.dispatchEvent(createEMouseDown());
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            document.dispatchEvent(createEMouseUp());
        };

        dragLeader();
        const movedTransform = follower.style.transform;

        expect(movedTransform).toBe(leader.style.transform);
        expect(movedTransform).toContain('140,140');

        $follower.disable();
        dragLeader();

        expect(leaderDrops).toHaveBeenCalledTimes(2);
        expect(follower.style.transform).toBe(movedTransform);

        $leader.disable();
    });
});

describe('Test svg subjx "drag" method', () => {
    it('init draggable with defaults', () => {
        const draggable = subjx(svgElement).drag();
        expect(draggable.options).toEqual({
            ...defaultOptions,
            container: svgContainerElement,
            controlsContainer: svgContainerElement
        });

        draggable.disable();
    });

    it('applies translate on drag with applyTranslate', () => {
        const draggable = subjx(svgElement).drag({ applyTranslate: true });

        expect(() => draggable.exeDrag({ dx: 10, dy: 10 })).not.toThrow();

        draggable.disable();
    });

    it('test subjx api', () => {
        const draggable = subjx(svgElement).drag({ each: { move: true } });

        expect(() => {
            draggable.fitControlsToSize();
            draggable.getBoundingRect(svgElement);
            draggable.setTransformOrigin({ x: 0, y: 0 });
            draggable.getDimensions();
            ['t', 'b', 'l', 'r', 'v', 'h'].map((align) => draggable.applyAlignment(align));
        }).not.toThrow();

        draggable.disable();
    });

    it('init draggable with options', () => {
        const nextOptions = {
            container: '#svg-container',
            restrict: '#svg-container',
            ...options
        };

        const $draggable = subjx(svgElement).drag({
            ...nextOptions
        });

        expect($draggable.options).toMatchObject({
            ...nextOptions,
            restrict: svgContainerElement,
            container: svgContainerElement,
            controlsContainer: svgContainerElement,
            snap: {
                ...nextOptions.snap,
                angle: 0.5235987755982988
            }
        });

        $draggable.disable();
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

        const draggable = subjx(svgElement).drag({ ...methods });

        // simulate move
        draggable.elements[0].dispatchEvent(createEMouseDown());

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

        $draggables.elements[0].dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect($draggables.storage).toMatchObject({
            clientX: 150,
            clientY: 150,
            relativeX: 150,
            relativeY: 150,
            isTarget: true
        });

        $draggables.disable();
    });
});

describe('Test svg line controls', () => {
    const boxHandles = ['tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'];

    it('uses endpoint handles for a single line', () => {
        const draggable = subjx(svgLineElement).drag();
        const { handles } = draggable.storage;

        expect(handles.p1).toBeDefined();
        expect(handles.p2).toBeDefined();
        boxHandles.forEach(key => expect(handles[key]).toBeUndefined());
        ['te', 'be', 'le', 're'].forEach(key => (
            expect(handles[key].getAttribute('pointer-events')).toEqual('none')
        ));

        draggable.disable();
    });

    it('keeps box handles for other elements', () => {
        const draggable = subjx(svgElement).drag();
        const { handles } = draggable.storage;

        boxHandles.forEach(key => expect(handles[key]).toBeDefined());
        expect(handles.p1).toBeUndefined();
        expect(handles.te.getAttribute('pointer-events')).toBeNull();

        draggable.disable();
    });

    it('has no endpoint handles when not resizable', () => {
        const draggable = subjx(svgLineElement).drag({ resizable: false });

        expect(draggable.storage.handles.p1).toBeUndefined();
        expect(draggable.storage.handles.p2).toBeUndefined();

        draggable.disable();
    });

    it('moves an endpoint as a resize', () => {
        const events = [];
        const onResize = jest.fn();

        const draggable = subjx(svgLineElement).drag({ onResize });

        ['resizeStart', 'resize', 'resizeEnd', 'drag'].forEach(name => (
            draggable.on(name, () => events.push(name))
        ));

        draggable.storage.handles.p2.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect(svgLineElement.getAttribute('x2')).toEqual('150');
        expect(svgLineElement.getAttribute('x1')).toEqual('0');
        expect(onResize).toHaveBeenCalled();
        expect(events[0]).toEqual('resizeStart');
        expect(events).toContain('resize');
        expect(events[events.length - 1]).toEqual('resizeEnd');
        expect(events).not.toContain('drag');

        draggable.disable();
    });
});

describe('Test handles option', () => {
    const boxHandles = ['tl', 'tc', 'tr', 'ml', 'mr', 'bl', 'bc', 'br'];

    it('shows only the listed svg handles', () => {
        const draggable = subjx(svgElement).drag({ handles: ['tl', 'br', 're'] });
        const { handles } = draggable.storage;

        expect(boxHandles.filter(key => handles[key])).toEqual(['tl', 'br']);
        expect(handles.rotator).toBeDefined();
        expect(handles.re.getAttribute('pointer-events')).toBeNull();
        ['te', 'be', 'le'].forEach(key => {
            expect(handles[key].getAttribute('pointer-events')).toEqual('none');
            expect(handles[key].getAttribute('visibility')).toBeNull();
        });

        draggable.disable();
    });

    it('shows only the listed html handles', () => {
        const draggable = subjx(domElement).drag({ handles: ['tl'] });
        const { handles } = draggable.storage;

        expect(boxHandles.filter(key => handles[key])).toEqual(['tl']);
        ['te', 'be', 'le', 're'].forEach(key => (
            expect(handles[key].style.pointerEvents).toEqual('none')
        ));

        draggable.disable();
    });

    it('filters line endpoints', () => {
        const draggable = subjx(svgLineElement).drag({ handles: ['p2'] });

        expect(draggable.storage.handles.p1).toBeUndefined();
        expect(draggable.storage.handles.p2).toBeDefined();

        draggable.disable();
    });
});

describe('Test hitRadius option', () => {
    it('adds no hit areas by default', () => {
        const draggable = subjx(svgElement).drag();

        expect(Object.keys(draggable.storage.hitAreas)).toEqual([]);

        draggable.disable();
    });

    it('adds a hit area to every interactive handle', () => {
        const draggable = subjx(svgElement).drag({ hitRadius: 12 });
        const { hitAreas, handles } = draggable.storage;

        ['tl', 'br', 'rotator', 'te', 're'].forEach(key => {
            expect(hitAreas[key].getAttribute('data-sjx-handle')).toEqual(key);
            expect(handles[key]).toBeDefined();
        });
        expect(hitAreas.tl.tagName).toEqual('path');
        expect(hitAreas.tl.getAttribute('d')).toMatch(/^M.+Z$/);
        expect(hitAreas.tl.classList.contains('sjx-svg-hit-handle')).toBe(true);
        expect(hitAreas.te.classList.contains('sjx-svg-hit-edge')).toBe(true);

        draggable.disable();
    });

    it('marks the controls when hit areas should stay visible', () => {
        const hidden = subjx(svgElement).drag({ hitRadius: 12 });
        expect(hidden.controls.classList.contains('sjx-show-hit')).toBe(false);
        expect(hidden.storage.hitOverlay).toBeUndefined();
        hidden.disable();

        const shown = subjx(svgElement).drag({ hitRadius: 12, showHitAreas: true });
        expect(shown.controls.classList.contains('sjx-show-hit')).toBe(true);
        expect(shown.storage.hitOverlay.getAttribute('d')).toContain(shown.storage.hitAreas.tl.getAttribute('d'));
        shown.disable();
    });

    it('skips edges that ignore the pointer', () => {
        const draggable = subjx(svgLineElement).drag({ hitRadius: 12 });
        const { hitAreas } = draggable.storage;

        expect(hitAreas.p1).toBeDefined();
        expect(hitAreas.p2).toBeDefined();
        ['te', 'be', 'le', 're'].forEach(key => expect(hitAreas[key]).toBeUndefined());

        draggable.disable();
    });

    it('treats a press on the hit area as a press on its handle', () => {
        svgLineElement.setAttribute('x2', '100');

        const events = [];
        const draggable = subjx(svgLineElement).drag({ hitRadius: 12 });

        ['resizeStart', 'drag'].forEach(name => (
            draggable.on(name, () => events.push(name))
        ));

        draggable.storage.hitAreas.p2.dispatchEvent(createEMouseDown());

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect(events).toContain('resizeStart');
        expect(events).not.toContain('drag');
        expect(svgLineElement.getAttribute('x2')).toEqual('150');

        draggable.disable();
    });
});

describe('Test active handle marking', () => {
    const press = (target) => {
        target.dispatchEvent(createEMouseDown());
        document.dispatchEvent(createEMouseMove());
        jest.advanceTimersByTime(1001 / 60);
    };

    it('marks the grabbed handle while resizing or rotating', () => {
        const draggable = subjx(svgElement).drag();
        const { handles, wrapper } = draggable.storage;

        ['tr', 'rotator'].forEach(key => {
            press(handles[key]);

            expect(handles[key].classList.contains('sjx-active')).toBe(true);
            expect(wrapper.classList.contains('sjx-acting')).toBe(true);
            expect(handles.tl.classList.contains('sjx-active')).toBe(false);

            document.dispatchEvent(createEMouseUp());

            expect(handles[key].classList.contains('sjx-active')).toBe(false);
            expect(wrapper.classList.contains('sjx-acting')).toBe(false);
        });

        draggable.disable();
    });

    it('marks nothing while dragging the element', () => {
        const draggable = subjx(svgElement).drag();

        press(svgElement);

        expect(draggable.storage.wrapper.classList.contains('sjx-acting')).toBe(false);
        expect(draggable.storage.wrapper.querySelector('.sjx-active')).toBeNull();

        document.dispatchEvent(createEMouseUp());
        draggable.disable();
    });
});

describe('Test guides option', () => {
    it('normalizes the option', () => {
        const enabled = subjx(svgElement).drag({ guides: true });
        expect(enabled.options.guides).toEqual({});
        enabled.disable();

        const custom = subjx(svgElement).drag({ guides: { threshold: 10, snap: false } });
        expect(custom.options.guides).toEqual({ threshold: 10, snap: false });
        custom.disable();
    });

    it('drags with guides and clears them on drop', () => {
        const draggable = subjx(svgElement).drag({ guides: true });

        svgElement.dispatchEvent(createEMouseDown());

        expect(draggable.storage.guides).toBeTruthy();

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(createEMouseMove());
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(createEMouseUp());

        expect(draggable.storage.guides).toBeNull();
        expect(draggable.storage.wrapper.querySelectorAll('.sjx-svg-guide').length).toEqual(0);

        draggable.disable();
    });
});

describe('Test restrict', () => {
    it('measures the restriction for an action and drops it on release', () => {
        const draggable = subjx(svgElement).drag({ restrict: '#svg-container' });

        svgElement.dispatchEvent(createEMouseDown());

        expect(draggable.storage.restriction).toEqual(expect.objectContaining({
            box: expect.any(Object),
            area: expect.any(Object)
        }));

        document.dispatchEvent(createEMouseMove());
        jest.advanceTimersByTime(1001 / 60);
        document.dispatchEvent(createEMouseUp());

        expect(draggable.storage.restriction).toBeNull();

        draggable.disable();
    });

    it('measures nothing without restrict', () => {
        const draggable = subjx(svgElement).drag();

        svgElement.dispatchEvent(createEMouseDown());
        expect(draggable.storage.restriction).toBeNull();
        document.dispatchEvent(createEMouseUp());

        draggable.disable();
    });
});

describe('Test update method', () => {
    const press = (target) => {
        target.dispatchEvent(createEMouseDown());
        document.dispatchEvent(createEMouseMove());
        jest.advanceTimersByTime(1001 / 60);
    };

    it('applies runtime options without rebuilding the controls', () => {
        const draggable = subjx(svgElement).drag();
        const { handles: { tl } } = draggable.storage;

        draggable.update({ axis: 'x', snap: { x: 5 }, proportions: true });

        expect(draggable.options).toMatchObject({
            axis: 'x',
            snap: { x: 5, y: 0 },
            proportions: true
        });
        expect(draggable.storage.handles.tl).toBe(tl);

        draggable.disable();
    });

    it('keeps the previous options that update does not mention', () => {
        const draggable = subjx(svgElement).drag({ axis: 'y', rotatorOffset: 20 });

        draggable.update({ proportions: true });

        expect(draggable.options).toMatchObject({ axis: 'y', rotatorOffset: 20, proportions: true });

        draggable.disable();
    });

    it('ignores options equal to the current ones', () => {
        const draggable = subjx(svgElement).drag({ handles: ['tl', 'br'], snap: { x: 5 } });
        const { handles: { tl } } = draggable.storage;
        const { snap } = draggable.options;

        draggable.update({ handles: ['tl', 'br'], snap: { x: 5 } });

        expect(draggable.storage.handles.tl).toBe(tl);
        expect(draggable.options.snap).toBe(snap);

        draggable.disable();
    });

    it('rebuilds svg handles inside the same wrapper and keeps foreign nodes', () => {
        const onInit = jest.fn();
        const countWrappers = () => svgContainerElement.querySelectorAll('.sjx-svg-wrapper').length;
        const draggable = subjx(svgElement).drag({ onInit });
        const wrappersBefore = countWrappers();
        const { wrapper, controls, handles: { tl } } = draggable.storage;

        const tool = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        controls.appendChild(tool);
        wrapper.classList.add('app-locked');

        draggable.update({ resizable: false, hitRadius: 10, showHitAreas: true });

        const { storage } = draggable;

        expect(storage.wrapper).toBe(wrapper);
        expect(storage.controls).toBe(controls);
        expect(tl.parentNode).toBeNull();
        expect(storage.handles.tl).toBeUndefined();
        expect(storage.handles.rotator.parentNode).toBe(controls);
        expect(storage.hitAreas.rotator.parentNode).toBe(controls);
        expect(controls.lastChild).toBe(tool);
        expect(wrapper.classList.contains('app-locked')).toBe(true);
        expect(wrapper.classList.contains('sjx-show-hit')).toBe(true);
        expect(countWrappers()).toBe(wrappersBefore);
        expect(onInit).toHaveBeenCalledTimes(1);

        draggable.update({ showHitAreas: false });

        expect(wrapper.classList.contains('sjx-show-hit')).toBe(false);
        expect(wrapper.classList.contains('app-locked')).toBe(true);

        draggable.disable();

        expect(wrapper.parentNode).toBeNull();
    });

    it('rebuilds html handles', () => {
        const draggable = subjx(domElement).drag();
        const { wrapper } = draggable.storage;

        draggable.update({ handles: ['tl'] });

        const { handles } = draggable.storage;

        expect(draggable.storage.wrapper).toBe(wrapper);
        expect(['tl', 'tr', 'br', 'bl'].filter(key => handles[key])).toEqual(['tl']);
        expect(handles.tl.parentNode).toBe(draggable.storage.controls);

        draggable.disable();
    });

    it('starts an action once from a rebuilt handle', () => {
        const draggable = subjx(svgElement).drag();
        const starts = [];

        draggable.on('rotateStart', () => starts.push('rotate'));
        draggable.on('resizeStart', () => starts.push('resize'));
        draggable.update({ hitRadius: 10 });

        press(draggable.storage.handles.rotator);
        document.dispatchEvent(createEMouseUp());

        press(draggable.storage.handles.br);
        document.dispatchEvent(createEMouseUp());

        expect(starts).toEqual(['rotate', 'resize']);

        draggable.disable();
    });

    it('defers structural changes until the action ends', () => {
        const draggable = subjx(svgElement).drag();
        const { handles: { rotator } } = draggable.storage;

        press(svgElement);

        draggable.update({ rotatable: false, axis: 'x' });

        expect(draggable.options.axis).toEqual('x');
        expect(draggable.options.rotatable).toBe(true);
        expect(draggable.storage.handles.rotator).toBe(rotator);

        document.dispatchEvent(createEMouseUp());

        expect(draggable.options.rotatable).toBe(false);
        expect(draggable.storage.handles.rotator).toBeUndefined();
        expect(draggable.options.axis).toEqual('x');

        draggable.disable();
    });

    it('skips a deferred change that was reverted before the action ended', () => {
        const draggable = subjx(svgElement).drag();
        const { handles: { rotator } } = draggable.storage;

        press(svgElement);

        draggable.update({ rotatable: false });
        draggable.update({ rotatable: true });

        document.dispatchEvent(createEMouseUp());

        expect(draggable.storage.handles.rotator).toBe(rotator);

        draggable.disable();
    });

    it('keeps a moved transform origin across a rebuild', () => {
        const lengths = new WeakMap();
        ['cx', 'cy'].forEach(key => Object.defineProperty(window.SVGElement.prototype, key, {
            configurable: true,
            get() {
                if (!lengths.has(this)) lengths.set(this, {});
                const own = lengths.get(this);
                if (!own[key]) own[key] = { baseVal: { value: 0 } };
                return own[key];
            }
        }));

        const draggable = subjx(svgElement).drag({ transformOrigin: true });

        draggable.setTransformOrigin({ x: 20, y: 30 }, true);

        const origin = draggable.storage.transformOrigin;
        const { handles: { center } } = draggable.storage;

        draggable.update({ hitRadius: 10 });

        const { storage } = draggable;

        expect(storage.handles.center).not.toBe(center);
        expect(storage.center.isShifted).toBe(true);
        expect(storage.transformOrigin).toBe(origin);
        expect(storage.handles.center.cx.baseVal.value).toEqual(origin.x);
        expect(storage.handles.center.cy.baseVal.value).toEqual(origin.y);

        draggable.disable();
        ['cx', 'cy'].forEach(key => delete window.SVGElement.prototype[key]);
    });

    it('replaces callbacks', () => {
        const first = jest.fn();
        const second = jest.fn();
        const draggable = subjx(svgElement).drag({ onMove: first });

        draggable.update({ onMove: second });

        press(svgElement);
        document.dispatchEvent(createEMouseUp());

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalled();

        draggable.disable();
    });

    it('does nothing after disable', () => {
        const draggable = subjx(svgElement).drag();
        const { wrapper } = draggable.storage;

        draggable.disable();

        expect(() => draggable.update({ resizable: false })).not.toThrow();
        expect(wrapper.parentNode).toBeNull();
        expect(draggable.storage).toBeUndefined();
    });
});

describe('Test cursors', () => {
    const place = (element, x, y) => {
        element.getBoundingClientRect = () => ({ left: x, top: y, width: 0, height: 0 });
    };

    const placeBox = ({ te, be, tl, tr }) => {
        place(te, 50, 0);
        place(be, 50, 100);
        if (tl) place(tl, 0, 0);
        if (tr) place(tr, 100, 0);
    };

    const hover = target => target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    const press = (target) => {
        target.dispatchEvent(createEMouseDown());
        document.dispatchEvent(createEMouseMove());
        jest.advanceTimersByTime(1001 / 60);
    };

    afterEach(() => {
        document.body.style.cursor = '';
    });

    it('shows a direction cursor on a hovered resize handle and its hit area', () => {
        const draggable = subjx(svgElement).drag({ hitRadius: 10 });
        const { handles, hitAreas } = draggable.storage;

        placeBox(handles);
        hover(hitAreas.tr);

        expect(handles.tr.style.cursor).toEqual('nesw-resize');
        expect(hitAreas.tr.style.cursor).toEqual('nesw-resize');

        hover(handles.tl);

        expect(handles.tl.style.cursor).toEqual('nwse-resize');

        draggable.disable();
    });

    it('keeps the grabbed handle cursor on the page while resizing', () => {
        const draggable = subjx(svgElement).drag();
        const { handles, wrapper } = draggable.storage;

        placeBox(handles);
        press(handles.tl);

        expect(document.body.style.cursor).toEqual('nwse-resize');
        expect(wrapper.style.cursor).toEqual('nwse-resize');

        document.dispatchEvent(createEMouseUp());

        expect(document.body.style.cursor).toEqual('auto');
        expect(wrapper.style.cursor).toEqual('');

        draggable.disable();
    });

    it('grabs while rotating', () => {
        const draggable = subjx(svgElement).drag();

        press(draggable.storage.handles.rotator);

        expect(document.body.style.cursor).toEqual('grabbing');

        document.dispatchEvent(createEMouseUp());
        draggable.disable();
    });

    it('prefers the cursor options', () => {
        const draggable = subjx(svgElement).drag({ cursorResize: 'pointer', cursorRotate: 'crosshair' });
        const { handles } = draggable.storage;

        placeBox(handles);
        press(handles.tl);
        expect(document.body.style.cursor).toEqual('pointer');
        document.dispatchEvent(createEMouseUp());

        press(handles.rotator);
        expect(document.body.style.cursor).toEqual('crosshair');
        document.dispatchEvent(createEMouseUp());

        draggable.disable();
    });

    it('clears the cursor of edges that cannot resize', () => {
        const draggable = subjx(svgElement).drag();
        const { handles } = draggable.storage;

        placeBox(handles);
        hover(handles.te);
        expect(handles.te.style.cursor).toEqual('ns-resize');

        draggable.update({ resizable: false });

        const next = draggable.storage.handles;
        placeBox(next);
        next.te.style.cursor = 'ns-resize';
        hover(next.te);

        expect(next.te.style.cursor).toEqual('');

        draggable.disable();
    });

    it('stops listening for hover after disable', () => {
        const draggable = subjx(svgElement).drag();
        const { handles } = draggable.storage;

        placeBox(handles);
        draggable.disable();
        hover(handles.tl);

        expect(handles.tl.style.cursor).toEqual('');
    });
});
