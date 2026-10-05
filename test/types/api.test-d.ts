import subjx from 'subjx';
import type {
    AlignmentDirection,
    BoundingRect,
    CloneOptions,
    Cloneable,
    Dimensions,
    Direction,
    DragOptions,
    Draggable,
    DraggableSVG,
    Observable
} from 'subjx';

declare const div: HTMLDivElement;
declare const rect: SVGRectElement;

const rotatorAnchor: Direction = 'n';

const options: DragOptions = {
    axis: 'x',
    snap: { x: 5 },
    each: { move: true },
    rotatorAnchor,
    rotatorOffset: 30,
    restrict: '#area',
    container: div,
    controlsContainer: div,
    transformOrigin: [10, 20],
    custom: { any: 'thing' },
    onInit(elements) {
        elements.forEach(el => el.getAttribute('id'));
    },
    onMove({ dx, dy, clientX, transform }) {
        return dx + dy + clientX + (Array.isArray(transform) ? transform.length : transform.a);
    },
    onResize({ width, height }) {
        return width + height;
    },
    onRotate({ delta }) {
        return delta;
    },
    onDrop({ clientX, clientY }) {
        return clientX + clientY;
    },
    onDestroy() {}
};

const ob: Observable = subjx.createObservable();

const draggable = subjx(rect).drag(options, ob);

draggable.on('drag', ({ dx, dy }) => dx + dy);
draggable.on('resize', ({ width }) => width);
draggable.on('rotate', ({ delta }) => delta);
draggable.on('dragEnd', ({ clientX }) => clientX);
draggable.off('drag', () => {});

draggable.exeDrag({ dx: 1, dy: 1 });
draggable.exeResize({ dx: 1, dy: 1, revX: true, doW: true });
draggable.exeRotate({ delta: 0.5 });
draggable.setTransformOrigin({ x: 1, y: 1 }, true);
draggable.setTransformOrigin({ dx: 0, dy: 0 });
draggable.resetTransformOrigin();
draggable.setCenterPoint();
draggable.resetCenterPoint();
draggable.fitControlsToSize();

const direction: AlignmentDirection = 't';
draggable.applyAlignment(direction);
draggable.applyAlignment('l', rect);

const dimensions: Dimensions = draggable.getDimensions();
const box: BoundingRect = (draggable as DraggableSVG).getBoundingRect(rect);
dimensions.rotation.toFixed();
box.forEach(([x, y]) => x + y);

draggable.controls.querySelector('.sjx-hdl');
draggable.elements.map(el => el.getAttribute('id'));
const { te } = draggable.storage.handles;
te?.setAttribute('stroke', 'red');

draggable.disable();
draggable.enable(options);

const items: DraggableSVG[] = [draggable as DraggableSVG];
const htmlItem: Draggable = subjx(div).drag() as Draggable;
items.length.toFixed();
htmlItem.getBoundingRect();
htmlItem.disable();

subjx('.selector');
subjx([div, rect]);

const cloneOptions: CloneOptions = {
    style: { border: '1px dashed red' },
    appendTo: '#holder',
    stack: div,
    onDrop(event, elements, clone) {
        elements.push(clone);
        return event;
    }
};

const cloneable: Cloneable = subjx('.item').clone(cloneOptions);
cloneable.on('dragEnd', () => {});
cloneable.disable();

const inferredSVG: DraggableSVG = subjx(rect).drag();
const inferredHTML: Draggable = subjx(div).drag();
inferredSVG.controls.getBBox();
inferredHTML.controls.offsetWidth.toFixed();
inferredSVG.getVertices().tl.x.toFixed();
inferredHTML.getVertices().tl[0].toFixed();

subjx(div).clone({
    onDrop(event) {
        return 'identifier' in event ? event.identifier : 0;
    }
});
