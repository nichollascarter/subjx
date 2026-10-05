import { Observable } from '../observable';
import Draggable from './Draggable';
import DraggableSVG from './svg';
import { checkElement } from './svg/util';
import { forEach, arrMap, isDef } from '../util/util';
import type Helper from '../Helper';
import type { DragOptions } from '../options';

// factory method for creating draggable elements
export default function drag(this: Helper, options?: DragOptions, obInstance?: Observable) {
    if (this.length) {
        const Ob = (isDef(obInstance) && obInstance instanceof Observable)
            ? obInstance
            : new Observable();

        if (this[0] instanceof SVGElement) {
            const items: Element[] = [];

            forEach.call(this, (item: Element) => {
                if (checkElement(item)) {
                    items.push(item);
                }
            });

            return new DraggableSVG(items, options, Ob);
        } else {
            return new Draggable(
                arrMap.call(this, (_: Element) => _) as Element[],
                options,
                Ob
            );
        }
    }
}