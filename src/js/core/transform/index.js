import { Observable } from '../observable';
import Draggable from './Draggable';
import DraggableSVG from './svg';
import { checkElement } from './svg/util';
import { arrReduce, isDef } from '../util/util';

// factory method for creating draggable elements
export default function drag(options, obInstance) {
    if (this.length) {
        const Ob = (isDef(obInstance) && obInstance instanceof Observable)
            ? obInstance
            : new Observable();

        return arrReduce.call(this, (result, item) => {
            if (!(item instanceof SVGElement)) {
                result.push(
                    new Draggable(item, options, Ob)
                );
            } else {
                if (checkElement(item)) {
                    result.push(
                        new DraggableSVG(item, options, Ob)
                    );
                }
            }
            return result;
        }, []);
    }
}