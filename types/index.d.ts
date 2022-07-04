import { DragOptions, CloneOptions } from './options';

type Target = string | Element | Array<Element>;

declare class Helper {
    constructor(target: Target);
}

declare class SubjectModel { }
declare class Transformable extends SubjectModel { }
declare class Cloneable extends SubjectModel { }
declare class Draggable extends Transformable { }
declare class DraggableSVG extends Transformable { }
declare class Observable { }

declare class Subjx extends Helper {
    public drag(parameters: DragOptions, observable: Observable): Draggable | DraggableSVG;
    public clone(parameters: CloneOptions): Cloneable;
}

/**
 * Factory function for handling target elements. Accepts "string | Element | Array<Element>"
*/
declare function subjx(target: Target): Subjx;

export default subjx;
