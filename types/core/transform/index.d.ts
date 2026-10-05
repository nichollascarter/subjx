import { Observable } from '../observable';
import Draggable from './Draggable';
import DraggableSVG from './svg';
import type Helper from '../Helper';
import type { DragOptions } from '../options';
export default function drag(this: Helper, options?: DragOptions, obInstance?: Observable): Draggable | DraggableSVG | undefined;
