<h2 align="middle">
    Subjx(dragging/resizing/rotating)
</h2>

<p align="center">
    <img src="https://raw.githubusercontent.com/nichollascarter/subjx/master/examples/demo.gif">
</p>

<h3 align="middle">
    Touch-enabled draggable, resizable, rotatable library for creating drag-n-drop applications.
</h3>

## Demos

### [Basic example](http://jsfiddle.net/nichollascarter/qgwzch0v/)
### [Drag, zoom and pan SVG](https://codesandbox.io/s/svg-drag-pan-zoom-wb95s)

## Usage

Library provides dragging/resizing/rotating/snapping SVG/HTML Elements.

## Installation

Run `npm install` to install with `npm`.

```
npm install subjx
```

Including via a `<script>` tag:

```html
<script src="../dist/js/subjx.js"></script>
```

## Get started

 Main function `subjx` returns `Subjx` instance which based on elements finded by
 passed parameters:

```javascript
import subjx from 'subjx';
import 'subjx/dist/style/subjx.css';

// possible parameters
const xElem = subjx( 'selector' ) |
                subjx( element ) |
                subjx( elementArray );
```

## Transformation(drag/resize/rotate)

```javascript
// enabling tool by `drag` method with the optional parameters
// by default just call `.drag()`
const xDraggables = xElem.drag();

// method always returns array of new Draggable instances
// for disabling use `disable` method for each object
xDraggables.forEach(item => {
    item.disable();
});
```
### "Draggable" API

```javascript
// getter returns root DOM element of "controls"
xDraggable.controls;

// provides access to useful options
xDraggable.storage;
// for example: to get reference to any handle's DOM
const {
  handles: { tl, tr, ...etc}
} = xDraggable.storage;

// enables dragging
// there is no need to call this method manually
xDraggable.enable(options);

// disables dragging, removes controls and handles
xDraggable.disable();

 // adds event listener for some events
xDraggable.on(eventName, cb);

// removes event listener for some events
xDraggable.off(eventName, cb);

// Event names
const EVENTS = [
    'dragStart',
    'drag',
    'dragEnd',
    'resizeStart',
    'resize',
    'resizeEnd',
    'rotateStart',
    'rotate',
    'rotateEnd'
];

// execute dragging manually
xDraggable.exeDrag({ 
    dx, // drag along the x axis
    dy // drag along the y axis
});

// execute resizing manually
xDraggable.exeResize({ 
    dx, // resize along the x axis
    dy, // resize along the y axis
    revX, // reverse resizing along the x axis
    revY, // reverse resizing along the y axis
    doW, // allow width resizing
    doH  // allow height resizing
});

// execute rotating manually
xDraggable.exeRotate({
    delta // radians
});

// SVG elements methods

// Useful when SVG element's container was transformed from outside
// call this method when applying scale or viewBox values changing
xDraggable.fitControlsToSize();

// Returns rotation point handle to default position
xDraggable.resetCenterPoint();
```

### Options

```javascript
subjx('.draggable').drag({
    // transformation coordinate system
    // "controls" append to this element
    container: 'selector' | element,
    // constrain movement along an axis
    axis: 'x' | 'y'
    // snapping to grid (default: 10)
    snap: {
        x: 20(px),
        y: 20(px),
        angle: 45(deg)
    },
    // mimic behavior with other '.draggable' elements
    each: {
        move: true,
        resize: true, 
        rotate: true
    },
    // keep aspect ratio when resizing
    proportions: true,
    // allow or deny an action(default: true)
    draggable: true,
    // handles will not showing with false
    resizable: true,
    rotatable: true,
    // ----- experimental options ------
    // show/manipulate rotation point(not tested with HTML elements)
    rotationPoint: true,
    // restrict moving
    // spreads to dragging one element 
    restrict: 'selector'
});
```
#### Notice: In most cases, it is recommended to use 'proportions' option

### Methods

```javascript
subjx('.draggable').drag({
    onInit(el) {
        // fires on tool activation
    },
    onMove({ clientX, clientY, dx, dy, transform }) {
        // fires on moving
    },
    onResize({ clientX, clientY, dx, dy, width, height }) {
        // fires on resizing
    },
    onRotate({ clientX, clientY, delta, transform }) {
        // fires on rotation
    },
    onDrop({ clientX, clientY }) {
        // fires on drop
    },
    onDestroy(el) {
        // fires on tool deactivation
    }
});
```

Subscribing new draggable element to previously activated(useful with `each` option)
```javascript
const observable = subjx.createObservable();
subjx('.draggable').drag({...}, observable);

const createDraggableAndSubscribe = e => {
    subjx(e.target).drag({...}, observable);
};
```

Allowed SVG elements:
`g`, `path`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `circle`


## Cloning

### Options

```javascript
const xCloneable = xElem.clone({
    // dropping area
    stack: 'selector',
    // set clone parent
    appendTo: 'selector',
    // set clone additional style
    style: {
        border: '1px dashed green',
        background: 'transparent'
    }
});
```

### Methods

```javascript
subjx('.cloneable').clone({
    onInit(el) {
        // fires on tool activation
    },
    onMove(dx, dy) {
        // fires on moving
    },
    onDrop(e) {
        // fires on drop
    },
    onDestroy() {
        // fires on tool deactivation
    }
});
```

Disabling
```javascript
xCloneable.forEach(item => {
    item.disable();
});
```

## Licence
MIT (c) Karen Sarksyan