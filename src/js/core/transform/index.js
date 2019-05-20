import Observable from '../observer/Observer'
import Draggable from './html'
import DraggableSVG from './svg/index'

import { checkElement } from './svg/util'
import { arrReduce } from '../util/util'

// factory method for creating draggable elements
export default function _drag(options) {
    if (this.length) {
        const Ob = new Observable();
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