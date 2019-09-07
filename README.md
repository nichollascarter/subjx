<h2 align="middle">
    Drag/Resize/Rotate library
</h2>

<p align="center">
    <img src="https://raw.githubusercontent.com/nichollascarter/subjx/master/examples/demo.gif">
</p>

<h3 align="middle">
    Touch-enabled draggable, resizable, rotatable library for creating drag-n-drop applications.
</h3>

## Usage

Library provides dragging/resizing/rotating SVG/HTML Elements.

## [Demo](http://jsfiddle.net/nichollascarter/qgwzch0v/)

## Installation

Run `npm install` to install with `npm`.

Including via a `<script>` tag:

```html
<script src="../dist/js/subjx.js"></script>
```

## Get started

 - Getting an element:

 Main function `subjx` returns `Subjx` instance which based on elements finded by
 passed parameters:

```javascript
import subjx from 'subjx';

// possible parameters
const xElem = subjx( 'selector' ) |
                subjx( element ) |
                subjx( elementArray );
```

- Choosing an action:

1) Transformation(move, resize, rotate):

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
Possible parameters:
```javascript
subjx('.draggable').drag({
    // transformation coordinate system
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
    // ----- experimental options ------
    // show rotation point
    rotationPoint: true,
    // restrict moving
    // spreads to dragging one element 
    restrict: 'selector'
});
```
Subscribing new draggable element to previously activated(useful with `each` option)
```javascript
const observable = subjx.createObservable();
subjx('.draggable').drag({...}, observable)

const createDraggableAndSubscribe = e => {
    subjx(e.target).drag({...}, observable);
};
```

Allowed SVG elements:
`path`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `circle`, `g`

#### Warning: group resizing in experimental mode

Avaliable methods:
```javascript
subjx('.draggable').drag({
    onInit(el) {
        // fires on tool activation
    },
    onMove(dx, dy) {
        // fires on moving
    },
    onResize(dx, dy, handle) {
        // fires on resizing
    },
    onRotate(rad) {
        // fires on rotation
    },
    onDrop(e, el) {
        // fires on drop
    },
    onDestroy(el) {
        // fires on tool deactivation
    }
});
```

2) Tool for creating a clone:

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
    },
    // call function on drop to area event 
    onDrop(e, el) {
        console.log(el);
    }
});

// disabling
xCloneable.forEach(item => {
    item.disable();
});
```