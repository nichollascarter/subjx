import Cloneable from './Cloneable';
import { arrMap } from '../util/util';

export default function clone(options) {
    if (this.length) {
        return new Cloneable(
            arrMap.call(this, _ => _),
            options
        );
    }
}