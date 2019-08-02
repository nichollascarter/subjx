import Helper from './Helper';
import drag from './transform/index';
import clone from './clone/index';

export default class Subjx extends Helper {

    constructor(params) {
        super(params);
    }

    drag() {
        return drag.call(this, ...arguments);
    }

    clone() {
        return clone.call(this, ...arguments);
    }

}