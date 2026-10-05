import Cloneable from './Cloneable';
import { arrMap } from '../util/util';
import type Helper from '../Helper';
import type { CloneOptions } from '../options';

export default function clone(this: Helper, options?: CloneOptions) {
    if (this.length) {
        return new Cloneable(
            arrMap.call(this, (_: Element) => _) as Element[],
            options
        );
    }
}