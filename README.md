# Drag/Resize/Rotate library

Touch-enabled draggable, resizable, rotatable library for creating drag-n-drop application.

# Usage

Library provides two simple actions with an element. 

## [Demo](http://jsfiddle.net/Doigrales/qgwzch0v/)

 - Getting an element:

```javascript
const elem = 'selector' || DOM element;

const drop = function(event, el) {
    console.log(`${el}`);
}
```

- Choosing an action:

1) Move, rotate, resize:

```javascript
//enabling tool with the optional parameters
Subj(elem).drag({
    //set the snap size (default: 10)
    snap: 20, 
    //move other draggable elements
    moveEach: true,
    //call function on drop event
    drop: drop 
});
// or enabling with defaults
Subj(elem).drag();

//disabling tool
Subj(elem).drag('disable');
```

2) Tool for creating a clone:

```javascript
//enabling tool
Subj(elem).clone({
    //set clone style
    style: 'clone' || 
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
    //set clone parent
    appendTo: 'selector',
    //dropping area
    stack: 'selector',
    //call function on drop to area event 
    drop: drop
});

//disabling tool
Subj(elem).clone('disable'); 
```