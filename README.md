<h2 align="middle">
    Subjx(dragging/resizing/rotating)
</h2>

<p align="center">
    <img src="https://raw.githubusercontent.com/nichollascarter/subjx/master/examples/demo.gif">
</p>

<h3 align="middle">
    Draggable, Resizable, Rotatable library for creating drag-n-drop applications.
</h3>

## Demos

### [Basic example](http://jsfiddle.net/nichollascarter/qgwzch0v/)

### [Drag, zoom and pan SVG](https://codesandbox.io/s/svg-drag-pan-zoom-wb95s)

## Usage

Library provides dragging/resizing/rotating/snapping SVG/HTML Elements.
Alignment guides, endpoint handles for `<line>`, `hitRadius` and the
`handles` option are available for SVG elements.

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
const xDraggable = xElem.drag();

// for disabling use `disable` method for each object
xDraggable.disable();
```


### "Draggable" API

```javascript
// getter returns root DOM element of 'controls'
xDraggable.controls;

// provides access to useful options
xDraggable.storage;
// for example: to get reference to any handle's DOM
const {
  handles: { tl, tr, ...etc }
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
    'rotateEnd',
    'setPointEnd' // transform origin moved
];

// execute dragging manually, `restrict` is respected
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

// Align element inside container: ['t', 'l', 'r', 'b', 'v', 'h']
xDraggable.applyAlignment('tr');

// optional second argument: align to an arbitrary frame element instead of
// `restrict`/container — unlike `restrict`, it does not constrain dragging
xDraggable.applyAlignment('tr', frameElement);

// Call this method when applying scale or viewBox values changing
// useful when element's container was transformed from outside
xDraggable.fitControlsToSize();

// Sets the origin for an element's transformations
xDraggable.setTransformOrigin(
    {
        x, // absolute x coordinate of the origin
        y, // absolute y coordinate of the origin
        dx, // offset the origin's position x coordinate
        dy // offset the origin's position y coordinate
    },
    pin // leaves current origin fixed if true or not if false
);

// Sets transform origin to default
xDraggable.resetTransformOrigin();

// Returns element's current dimensions
xDraggable.getDimensions();

// Returns handle positions in container coordinates:
// { x, y } points for SVG, [x, y, ...] arrays for HTML
const { tl, tr, br, bl, center, rotator } = xDraggable.getVertices();

// Returns the element's bounding vertices
// SVG: getBoundingRect(element), HTML: getBoundingRect()
xDraggable.getBoundingRect(element);
```

A single SVG `<line>` gets two endpoint handles (`p1`, `p2`) instead of the
bounding box handles. Moving an endpoint rewrites `x1`/`y1` or `x2`/`y2` and is
reported as a resize (`resizeStart`, `resize`, `resizeEnd`, `onResize`).

### Options

|Property|Description|Type|Default|
|--|--|--|--|
| **container** | Transformation coordinate system | `'selector'` \| `element` | element.parentNode |
| **controlsContainer** | Parent element of 'controls' | `'selector'` \| `element` | container |
| **axis** | Constrain movement along an axis | `string`: 'x' \| 'y' \| 'xy' | 'xy' |
| **snap** | Snapping to grid: x/y in pixels, angle in degrees; missing values use the defaults, 0 disables | `object` | { x: 10, y: 10, angle: 10 } |
| **each** | Mimic behavior with other '.draggable' elements | `object` | { move: false, resize: false, rotate: false } |
| **proportions** | Keep aspect ratio on resizing / scaling | `boolean` | false |
| **draggable** | Allow or deny an action | `boolean` | true |
| **resizable** | Allow or deny an action | `boolean` | true |
| **rotatable** | Allow or deny an action | `boolean` | true |
| **scalable** | Applies scaling only to root element | `boolean` | false |
| **restrict** | Keeps the element inside this element while dragging/resizing/rotating; SVG elements stop exactly at its edges (an outer `<svg>` counts by its visible area) | `'selector'` \| `element` | - |
| **applyTranslate** | Applies the drag result to left/top (HTML) or position attributes such as x/y, cx/cy, points, d (SVG) instead of the transform | `boolean` | false |
| **rotatorAnchor** | Rotator anchor direction | `string`: 'n' \| 's' \| 'w' \| 'e' | 'e' |
| **rotatorOffset** | Rotator offset  | `number` | 50 |
| **showNormal** | Shows the line between the element and the rotator | `boolean` | true |
| **transformOrigin** | Sets the origin for an element's transformations | `boolean` \| Array<number> | false |
| **cursorMove** / **cursorResize** / **cursorRotate** | Cursor during an action | `string` | 'auto' |
| **custom** | Arbitrary user data, available as `options.custom` | `object` | null |
| **handles** | Resize handles to show: `tl`, `tc`, `tr`, `ml`, `mr`, `bl`, `bc`, `br`, edges `te`, `be`, `le`, `re`, line endpoints `p1`, `p2`; edges left out stay visible but ignore the pointer | `Array<string>` | all |
| **hitRadius** | Extra grab area around handles and edges, in screen pixels (SVG) | `number` | 0 |
| **showHitAreas** | Keeps grab areas visible, e.g. to tune `hitRadius` (SVG) | `boolean` | false |
| **guides** | Alignment guides and snapping to other elements and the container (SVG), see below | `boolean` \| `object` | false |

#### Notice: In most cases, it is recommended to use 'proportions' option

### Alignment guides (SVG)

With `guides`, the dragged box snaps to the edges and centers of other elements
and of the container, and the matching guides are drawn. While resizing, the
moving edge snaps (not for rotated elements); a line endpoint snaps as a point.
`restrict` is applied after the guides.

```javascript
subjx('.shape').drag({
    guides: {
        targets: '.shape',      // selector or elements, default: siblings
        bounds: '#paper',       // element with edges/center to snap to,
                                // default: container, `false` to skip
        threshold: 6,           // snapping distance in screen pixels
        snap: true              // `false` only shows the guides
    }
});

// `guides: true` uses the defaults
```

### Styling

Controls are plain SVG/HTML elements styled by `subjx.css`; override these
classes to change their look:

|Class|Element|
|--|--|
| `.sjx-svg-hdl`, `.sjx-svg-hdl-{key}` | SVG handle (`tl`, `rotator`, `center`, `p1`...) |
| `.sjx-svg-line` | SVG edge |
| `.sjx-svg-hit` | grab area added by `hitRadius` |
| `.sjx-show-hit` | controls with `showHitAreas` |
| `.sjx-active` | handle or edge being dragged |
| `.sjx-acting` | controls during resize/rotate/origin move |
| `.sjx-svg-guide` | alignment guide |
| `.sjx-hdl`, `.sjx-hdl-line` | HTML handle and edge |

### Methods

```javascript
subjx('.draggable').drag({
    onInit(elements) {
        // fires on tool activation
    },
    onMove({ clientX, clientY, dx, dy, transform }) {
        // fires on moving
    },
    onResize({ clientX, clientY, dx, dy, transform, width, height }) {
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
const options = {};
const observable = subjx.createObservable();
subjx('.draggable').drag(options, observable);

// pass Observable to new element
const createDraggableAndSubscribe = e => {
    subjx(e.target).drag(options, observable);
};
```

Allowed SVG elements:
`g`, `path`, `rect`, `ellipse`, `circle`, `line`, `polyline`, `polygon`, `text`,
`image`, `use`, `foreignObject`

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
    onMove({ dx, dy }) {
        // fires on moving
    },
    onDrop(event, elements, clone) {
        // fires when the clone is dropped inside `stack`;
        // event is a MouseEvent, or a Touch on touch devices
    },
    onDestroy() {
        // fires on tool deactivation
    }
});
```

Events: `dragStart`, `drag`, `dragEnd`

```javascript
xCloneable.on('dragEnd', cb);
```

Disabling

```javascript
xCloneable.disable();
```

## TypeScript

Typings are bundled with the package. The renderer is inferred from the element:

```typescript
import subjx, { createObservable } from 'subjx';
import type { DragOptions, DraggableSVG, Draggable } from 'subjx';

const svgItem: DraggableSVG = subjx(svgElement).drag();
const htmlItem: Draggable = subjx(divElement).drag();

// selectors and mixed lists give `Draggable | DraggableSVG`
const item = subjx('.shape').drag() as DraggableSVG;

item.on('resize', ({ width, height }) => {});
```

Named exports: `createObservable`, `Observable`, `matrix`, `svgMatrix`, `common`.

## License

MIT (c) Karen Sarksyan
