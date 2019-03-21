import {
    arrMap
} from '../util/util'

import Clone from './clone'

export default function _clone(options) {
    if (this.length) {
        return arrMap.call(this, item => {
            return new Clone(item, options);
        })
    }
}