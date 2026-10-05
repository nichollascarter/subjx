import Helper from './Helper';
import type Observable from './observable/Observable';
import type Draggable from './transform/Draggable';
import type DraggableSVG from './transform/svg/DraggableSVG';
import type Cloneable from './clone/Cloneable';
import type { DragOptions, CloneOptions } from './options';
export type DragResult<T extends Element> = [
    T
] extends [SVGElement] ? DraggableSVG : [T] extends [HTMLElement] ? Draggable : Draggable | DraggableSVG;
export default class Subjx<T extends Element = Element> extends Helper<T> {
    drag(options?: DragOptions, obInstance?: Observable): DragResult<T>;
    clone(options?: CloneOptions): Cloneable;
}
