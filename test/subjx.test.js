import Subjx from '../src/js/core';
import JsDOM from 'jsdom';

function subjx(params) {
    return new Subjx(params);
}

const jsdom = new JsDOM.JSDOM('<html><head></head><body></body></html>');
document = jsdom.window.document;
window = jsdom.window;

Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: () => {
            return '';
        }
    })
});

beforeEach(() => {
    jest.useFakeTimers();
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
        <path id="svg-draggable" d="M691,331 Q711,306,721,331 T761,331 " fill="none" stroke="blue" stroke-width="5">
        </path>
    </svg>
`;

const domElement = document.getElementById('draggable');
const draggables = document.getElementsByClassName('draggables');
const draggableContainer = document.getElementById('container');
const cloneableElement = document.getElementById('cloneable');

describe('Test subjx function', () => {
    it('init cloneable with defaults', () => {
        subjx(cloneableElement).clone();
    });

    it('init draggable with defaults', () => {
        const [draggable] = subjx(domElement).drag();
        expect(draggable.options).toEqual({
            axis: 'xy',
            cursorMove: 'auto',
            cursorRotate: 'auto',
            cursorResize: 'auto',
            rotationPoint: false,
            restrict: null,
            container: draggableContainer,
            controlsContainer: draggableContainer,
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
        });
    });

    it('init draggable with options', () => {
        const methods = {
            onInit() {
            },
            onMove() {
            },
            onResize() {
            },
            onRotate() {
            },
            onDrop() {
            },
            onDestroy() {
            }
        };

        const options = {
            container: '#container',
            restrict: '#container',
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
        const $draggables = subjx(draggables).drag({
            ...options,
            ...methods
        });

        expect($draggables[0].options).toMatchObject({
            ...options,
            restrict: draggableContainer,
            container: draggableContainer,
            controlsContainer: draggableContainer,
            snap: {
                ...options.snap,
                angle: 0.5235987755982988
            }
        });

        $draggables.forEach(item => item.disable());
    });

    it('process move', () => {
        const [draggable] = subjx(draggables).drag({
            each: {
                move: true
            }
        });

        let evtMouseDown = new MouseEvent('mousedown', {
            clientX: 10,
            clientY: 10,
            bubbles: true,
            cancelable: true,
            view: window
        });

        let evtMouseMove = new MouseEvent('mousemove', {
            clientX: 150,
            clientY: 150,
            bubbles: true,
            cancelable: true,
            view: window
        });

        let evtMouseUp = new MouseEvent('mouseup', {
            clientX: 150,
            clientY: 150,
            bubbles: true,
            cancelable: true,
            view: window
        });

        draggable.el.dispatchEvent(evtMouseDown);

        let step = 0;
        while (step < 5) {
            document.dispatchEvent(evtMouseMove);
            jest.advanceTimersByTime(1001 / 60);
            step++;
        }

        document.dispatchEvent(evtMouseUp);

        expect(draggable.storage).toMatchObject({
            clientX: 150,
            clientY: 150,
            cx: 10,
            cy: 10,
            isTarget: true
        });
    });
});