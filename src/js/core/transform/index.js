import { Observable } from '../observable';
import Draggable from './Draggable';
import DraggableSVG from './svg';
import { checkElement } from './svg/util';
import { arrReduce, arrMap, isDef } from '../util/util';

// factory method for creating draggable elements
export default function drag(options, obInstance) {
    if (this.length) {
        const Ob = (isDef(obInstance) && obInstance instanceof Observable)
            ? obInstance
            : new Observable();

        if (this[0] instanceof SVGElement) {
            const items = arrReduce.call(this, (result, item) => {
                if (checkElement(item)) {
                    result.push(item);
                }
                return result;
            }, []);

            return new DraggableSVG(items, options, Ob);
        } else {
            return new Draggable(
                arrMap.call(this, _ => _),
                options,
                Ob
            );
        }
    }
}