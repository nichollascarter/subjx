import Subjx, { Observable } from './core';
import * as matrix from './core/transform/matrix';
import * as svgMatrix from './core/transform/svg/util';
import * as common from './core/transform/common';
import type { HelperParams } from './core/Helper';

function subjx<T extends Element = Element>(params: HelperParams<T>) {
    return new Subjx<T>(params);
}

const createObservable = () => new Observable();

const api = Object.assign(subjx, {
    createObservable,
    Subjx,
    Observable,
    matrix,
    svgMatrix,
    common
});

export { matrix, svgMatrix, common, Observable, createObservable };
export default api;

export type * from './core/options';
export type { Subjx };
export type { DragResult } from './core/Subjx';
export type { default as Helper, HelperParams as Target } from './core/Helper';
export type { default as SubjectModel } from './core/SubjectModel';
export type { Observer } from './core/observable/Observable';
export type {
    default as Transformable,
    TransformStorage,
    TransformHandles
} from './core/transform/Transformable';
export type { default as Draggable } from './core/transform/Draggable';
export type { default as DraggableSVG } from './core/transform/svg/DraggableSVG';
export type { default as Cloneable } from './core/clone/Cloneable';
