export declare const syncTransform: (target: Element, source: Element) => void;
interface ControlsPair {
    wrapper: Element;
    controls: Element;
}
export interface ControlsClasses {
    wrapper: string[];
    controls: string[];
}
export declare const readClasses: ({ wrapper, controls }: ControlsPair) => ControlsClasses;
export declare const adoptControls: (target: ControlsPair, fresh: ControlsPair, previous?: ControlsClasses) => void;
export {};
