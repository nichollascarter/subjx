/*
 * Move, Rotate, Resize tool
 * Released under the MIT license, 2018
 * nichollascarter
*/

import '../style/subj.css';
import _drag from './drag'
import _clone from './clone'
import { Helper_ } from './helper'

class Subject extends Helper_ {

    constructor(params) {
        super(params);
    }

    drag(method) {
        return _drag.call(this, method)
    }
    clone(method) {
        return _clone.call(this, method)
    }
}

export default function Subj(params) {
    return new Subject(params);
}