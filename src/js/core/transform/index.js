import Observable from '../observer/Observer'
import Draggable from './html'
import DraggableSVG from './svg/index'

import {
    arrMap
} from '../util/util'

// factory method for creating draggable elements
export default function _drag(options) {
    if (this.length) {
        const Ob = new Observable();
        return arrMap.call(this, item => {
            if (!(item instanceof SVGElement)) {
                return new Draggable(item, options, Ob);
            } else {
                return new DraggableSVG(item, options, Ob);
            }   
        })
    }
}