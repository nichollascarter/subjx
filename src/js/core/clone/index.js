import Cloneable from './Cloneable';
import { arrMap } from '../util/util';

export default function clone(options) {
    if (this.length) {
        return arrMap.call(this, item => (
            new Cloneable(item, options)
        ));
    }
}