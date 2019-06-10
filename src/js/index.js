/* @license
 * Move/Rotate/Resize tool
 * Released under the MIT license, 2018-2019
 * nichollascarter@gmail.com
*/

import '../style/subjx.css'
import _drag from './core/transform/index'
import _clone from './core/clone/index'
import { Helper_ } from './core/helper'

class Subjx extends Helper_ {

    constructor(params) {
        super(params);
    }

    drag(params) {
        return _drag.call(this, params);
    }
    clone(params) {
        return _clone.call(this, params);
    }
}

export default function(params) {
    return new Subjx(params);
}