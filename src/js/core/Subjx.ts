import Helper from './Helper';
import drag from './transform';
import clone from './clone';
import type Observable from './observable/Observable';
import type { DragOptions, CloneOptions } from '../../../types/options';

export default class Subjx extends Helper {

    drag(options?: DragOptions, obInstance?: Observable) {
        return drag.call(this, options, obInstance);
    }

    clone(options?: CloneOptions) {
        return clone.call(this, options);
    }

}