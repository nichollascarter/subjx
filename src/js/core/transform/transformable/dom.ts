import { addClass, removeClass } from '../../util/css-util';

export const syncTransform = (target: Element, source: Element) => {
    const value = source.getAttribute('transform');

    if (value === null) {
        target.removeAttribute('transform');
    } else {
        target.setAttribute('transform', value);
    }

    const targetStyle = (target as HTMLElement).style;
    const sourceStyle = (source as HTMLElement).style;

    if (targetStyle && sourceStyle) targetStyle.transform = sourceStyle.transform;
};

interface ControlsPair {
    wrapper: Element;
    controls: Element;
}

export interface ControlsClasses {
    wrapper: string[];
    controls: string[];
}

export const readClasses = ({ wrapper, controls }: ControlsPair): ControlsClasses => ({
    wrapper: Array.from(wrapper.classList),
    controls: Array.from(controls.classList)
});

export const adoptControls = (target: ControlsPair, fresh: ControlsPair, previous?: ControlsClasses) => {
    const { wrapper, controls } = target;
    const firstForeign = controls.firstChild;

    while (fresh.controls.firstChild) {
        controls.insertBefore(fresh.controls.firstChild, firstForeign);
    }

    Array.from(fresh.wrapper.childNodes)
        .filter(node => node !== fresh.controls)
        .forEach(node => wrapper.insertBefore(node, controls));

    ([
        [wrapper, fresh.wrapper, previous?.wrapper],
        [controls, fresh.controls, previous?.controls]
    ] as [Element, Element, string[] | undefined][]).forEach(([node, source, classes = []]) => {
        classes.forEach(name => removeClass(node, name));
        Array.from(source.classList).forEach(name => addClass(node, name));
        syncTransform(node, source);
    });

    const parent = fresh.wrapper.parentNode!;

    if (wrapper.parentNode !== parent) parent.insertBefore(wrapper, fresh.wrapper);
    parent.removeChild(fresh.wrapper);
};
