import { helper } from '../../Helper';
import { addClass } from '../../util/css-util';
import type { Vector } from '../../types';

export const createElement = (classNames: string[] = []) => {
    const element = document.createElement('div');
    classNames.forEach(className => addClass(element, className));
    return element;
};

export const lineStyle = ([x1, y1]: Vector, [x2, y2]: Vector, thickness = 1) => {
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);

    const theta = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    return {
        transform: `translate(${cx}px, ${cy}px) rotate(${theta}deg)`,
        width: `${length}px`
    };
};

export const createHandler = ([x, y]: Vector, key = 'handler') => {
    const element = createElement(['sjx-hdl', `sjx-hdl-${key}`]);

    helper(element).css({
        transform: `translate(${x}px, ${y}px)`
    });

    return element;
};

export const renderLine = ([from, to]: Vector[], key: string) => {
    const thickness = 1;
    const line = createElement(['sjx-hdl-line', `sjx-hdl-${key}`]);

    const { transform, width } = lineStyle(from, to, thickness);

    helper(line).css({
        transform,
        height: `${thickness}px`,
        width
    });

    return line;
};
