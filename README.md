# Drag/Resize/Rotate library

Touch-enabled draggable, resizable, rotatable library for creating drag-n-drop applications.

# Usage

Library provides two actions with an element.

## [Demo](http://jsfiddle.net/nichollascarter/qgwzch0v/)

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
    }
    // call function on drop event
    drop(e, el) {
        console.log(el);
    }
});

// method always returns array of new Draggable instances
// for disabling use `disable` a method for each object
xDraggables.forEach(item => {
    item.disable();
})
```
Perhaps, better to use shortened construction:
```javascript
const xSVGElements = Subjx('.draggable').drag(...);
```

Important:
`drag` method supports manipulation with SVG elements and their groups:
`path`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `g`

2) Tool for creating a clone:

```javascript
const xCloneable = xElem.clone({
    // set clone style
    style: 'clone' |
    { 
        width: '100px', 
        height: '100px',
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        background: 'black',
        position:'absolute'
    },
    // set clone parent
    appendTo: 'selector',
    // dropping area
    stack: 'selector',
    // call function on drop to area event 
    drop(e, el) {
        console.log(el);
    }
});

// disabling
xCloneable.forEach(item => {
    item.disable();
});
```