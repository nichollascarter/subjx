import {
    arrMap
} from '../util/util';

import Cloneable from './Cloneable';

export default function clone(options) {
    if (this.length) {
        return arrMap.call(this, item => {
            return new Cloneable(item, options);
        });
    }
}