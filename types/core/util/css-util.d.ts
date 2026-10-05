declare const getOffset: (node: Element) => DOMRect;
declare const addClass: (node: Element, cls?: string | null) => void | Element;
declare const removeClass: (node: Element, cls?: string | null) => void | Element;
declare const objectsCollide: (a: Element, b: Element) => boolean;
declare const matrixToCSS: (arr: number[]) => {
    transform: string;
    webkitTranform: string;
    mozTransform: string;
    msTransform: string;
    otransform: string;
};
declare const getStyle: (el: Element, property: string) => string | null;
declare const getScrollOffset: () => {
    left: number;
    top: number;
};
declare const getElementOffset: (el: HTMLElement | null) => {
    left: number;
    top: number;
};
export { getOffset, addClass, removeClass, objectsCollide, matrixToCSS, getStyle, getScrollOffset, getElementOffset };
