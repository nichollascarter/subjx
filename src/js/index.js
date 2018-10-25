/*
 * Move, Rotate, Resize tool
 * Released under the MIT license, 2018
 */
import '../style/subj.css';
import { _drag } from './drag'
import { _clone } from './clone'
import { Helper_ } from './helper'

(function(global) {

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

    global.Subj = function(params) {
        return new Subject(params);
    };

})(window);