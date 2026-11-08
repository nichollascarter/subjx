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
