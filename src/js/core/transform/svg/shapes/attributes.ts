import { isDef } from '../../../util/util';
import { getTransformToElement } from '../util';
import type { StoredAttributes } from '../types';

export const readAttributes = (
    element: Element,
    container: Node,
    isGrouped?: boolean
): StoredAttributes => {
    let data: Partial<StoredAttributes> | null = null;

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const el = element as SVGTextElement;
            const x = isDef(el.x.baseVal[0])
                ? el.x.baseVal[0].value
                : (Number(element.getAttribute('x')) || 0);
            const y = isDef(el.y.baseVal[0])
                ? el.y.baseVal[0].value
                : (Number(element.getAttribute('y')) || 0);
            const textLength = isDef(el.textLength.baseVal)
                ? el.textLength.baseVal.value
                : (Number(element.getAttribute('textLength')) || null);

            const { x: bx, y: by, width, height } = el.getBBox();
            const fontSize = parseFloat(getComputedStyle(el).fontSize);

            data = { x, y, textLength, fontSize, textBox: { x: bx, y: by, width, height } };
            break;
        }
        case 'circle': {
            const el = element as SVGCircleElement;
            const r = el.r.baseVal.value,
                cx = el.cx.baseVal.value,
                cy = el.cy.baseVal.value;

            data = { r, cx, cy };
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            const el = element as SVGRectElement | SVGImageElement | SVGForeignObjectElement;
            const width = el.width.baseVal.value,
                height = el.height.baseVal.value,
                x = el.x.baseVal.value,
                y = el.y.baseVal.value;

            data = { width, height, x, y };
            break;
        }
        case 'ellipse': {
            const el = element as SVGEllipseElement;
            const rx = el.rx.baseVal.value,
                ry = el.ry.baseVal.value,
                cx = el.cx.baseVal.value,
                cy = el.cy.baseVal.value;

            data = { rx, ry, cx, cy };
            break;
        }
        case 'line': {
            const el = element as SVGLineElement;
            const resX1 = el.x1.baseVal.value,
                resY1 = el.y1.baseVal.value,
                resX2 = el.x2.baseVal.value,
                resY2 = el.y2.baseVal.value;

            data = { resX1, resY1, resX2, resY2 };
            break;
        }
        case 'polygon':
        case 'polyline': {
            const points = element.getAttribute('points');
            data = { points };
            break;
        }
        case 'path': {
            const path = element.getAttribute('d');

            data = { path };
            break;
        }
        default:
            break;

    }

    return {
        ...data,
        matrix: getTransformToElement(element, element.parentNode),
        ctm: getTransformToElement(element.parentNode, container),
        childCTM: getTransformToElement(element, isGrouped ? container.parentNode : container)
    };
};
