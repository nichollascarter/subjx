# Drag/Resize/Rotate library

Touch-enabled draggable, resizable, rotatable library for creating drag-n-drop applications.

# Usage

Library provides two actions with an element. More recently, was decided to make accent on SVG elements. 
But HTML elements transformation support will be staying.

## [Demo](http://jsfiddle.net/nichollascarter/qgwzch0v/)

## Installation

Run `npm install` to install with `npm`.

Including via a `<script>` tag:

```html
<script src="../dist/js/subjx.js"></script>
```

 - Getting an element:

 Main function `Subjx` returns new Subjx which based on elements finded by
 passed parameters:

```javascript
// possible parameters
const xElem = Subjx( 'selector' ) |
                Subjx( element ) |
                Subjx( elementArray );
```

- Choosing an action:

1) Transformation(move, resize, rotate):

```javascript
// enabling tool by `drag` method with the optional parameters
// by default just call `.drag()`
const xDraggables = xElem.drag({
    // manipulation area
    container: '#container',
    // snapping to grid (default: 10)
    snap: {
        x: 20,
        y: 20,
        angle: 45
    },
    // mimic behavior with other draggable elements
    each: {
        move: true,
        resize: true, 
        rotate: true
    },
    // If true, aspect ratio will be kept when resizing
    proportions: false,
    // call function on drop event
    onDrop(e, el) {
        console.log(el);
    }
});

// method always returns array of new Draggable instances
// for disabling use `disable` method for each object
xDraggables.forEach(item => {
    item.disable();
})
```
Perhaps, better to use shortened construction:
```javascript
const xSVGElements = Subjx('.draggable').drag(...);
```

Allowed SVG elements:
`path`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `g`

Avaliable methods:
```javascript
const methods = {
    
    onInit(el) {
        // fires on tool activation
    },
    onMove(dx, dy) {
        // fires on moving
    },
    onResize(dx, dy) {
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
};

Subjx('.draggable').drag(methods);
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

### Work In Progress
    This library depends of my another project and as far as possible it will be updating.