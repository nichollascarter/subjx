# Drag-resize-rotate-library
Drag, resize, rotate pure javascript library(no dependencies)


# Usage

Library provides two simple actions with an element. 

## [Demo](http://jsfiddle.net/Doigrales/qgwzch0v/)


 - Getting an element:

```javascript
const elem = 'selector' || DOM element;

const drop = function(event, el) {
    console.log(`Element ${el} dropped!`);
}
```

- Choosing an action:

1) Move, rotate, resize:

```javascript
Subj(elem).drag({
    //optional parameters
    drop: drop,
    snap: 20
});

Subj(elem).drag('disable'); //disable tool
```

2) Tool for creating a clone:

```javascript
Subj(elem).clone({
    stack: 'selector',
    //optional parameters
    drop: drop,
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
    appendTo: 'selector'
});

Subj(elem).clone('disable'); //disable tool
```
