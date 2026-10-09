import SubjectModel from '../SubjectModel';
import type { ProxyMethods } from '../SubjectModel';
import type { CloneOptions, CloneEventName, DragEventArgs } from '../options';
interface CloneStorage {
    style: Record<string, string>;
    data: WeakMap<Element, {
        parent: Element;
    }>;
    clientX?: number;
    clientY?: number;
    cx?: number;
    cy?: number;
    clone?: Element;
    doDraw?: boolean;
    doMove?: boolean;
    frameId?: number;
}
export type CloneEventMap = Record<CloneEventName, DragEventArgs>;
export default class Cloneable extends SubjectModel<CloneStorage, ProxyMethods, CloneEventMap> {
    options: Required<Pick<CloneOptions, 'style' | 'appendTo' | 'stack'>>;
    constructor(elements: Element[], options?: CloneOptions);
    disable(): void;
}
export {};
