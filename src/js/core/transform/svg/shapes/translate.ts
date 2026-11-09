import { isDef } from '../../../util/util';
import type { Point } from '../../transformable';
import { movePath } from '../path';
import {
    checkChildElements,
    createTranslateMatrix,
    getTransformToElement,
    isIdentity,
    isSVGGroup,
    matrixToString,
    parsePoints,
    pointTo
} from '../util';
import type { SVGElementTransform } from '../types';

interface Distance {
    dx: number;
    dy: number;
    ox: number;
    oy: number;
}

export const applyTranslate = (element: Element, { x, y }: Point) => {
    const attrs: [string, string | number | undefined][] = [];

    switch (element.tagName.toLowerCase()) {

        case 'text': {
            const el = element as SVGTextElement;
            const resX = isDef(el.x.baseVal[0])
                ? el.x.baseVal[0].value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(el.y.baseVal[0])
                ? el.y.baseVal[0].value + y
                : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(
                ['x', resX],
                ['y', resY]
            );
            break;
        }
        case 'foreignobject':
        case 'use':
        case 'image':
        case 'rect': {
            const el = element as SVGRectElement | SVGImageElement | SVGUseElement | SVGForeignObjectElement;
            const resX = isDef(el.x.baseVal.value)
                ? el.x.baseVal.value + x
                : (Number(element.getAttribute('x')) || 0) + x;
            const resY = isDef(el.y.baseVal.value)
                ? el.y.baseVal.value + y
                : (Number(element.getAttribute('y')) || 0) + y;

            attrs.push(
                ['x', resX],
                ['y', resY]
            );
            break;
        }
        case 'circle':
        case 'ellipse': {
            const el = element as SVGCircleElement | SVGEllipseElement;
            const resX = el.cx.baseVal.value + x,
                resY = el.cy.baseVal.value + y;

            attrs.push(
                ['cx', resX],
                ['cy', resY]
            );
            break;
        }
        case 'line': {
            const el = element as SVGLineElement;
            const resX1 = el.x1.baseVal.value + x,
                resY1 = el.y1.baseVal.value + y,
                resX2 = el.x2.baseVal.value + x,
                resY2 = el.y2.baseVal.value + y;

            attrs.push(
                ['x1', resX1],
                ['y1', resY1],
                ['x2', resX2],
                ['y2', resY2]
            );
            break;
        }
        case 'polygon':
        case 'polyline': {
            const points = parsePoints(element.getAttribute('points')!);
            const result = points.map(item => {
                item[0] = String(Number(item[0]) + x);
                item[1] = String(Number(item[1]) + y);

                return item.join(' ');
            }).join(' ');

            attrs.push(
                ['points', result]
            );
            break;
        }
        case 'path': {
            const path = element.getAttribute('d')!;

            attrs.push(['d', movePath(
                {
                    path,
                    dx: x,
                    dy: y
                }
            )]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};

export const translateElement = (
    element: Element,
    { matrix, parentMatrix }: Pick<SVGElementTransform, 'matrix' | 'parentMatrix'>,
    { dx, dy, ox, oy }: Distance
) => {
    const eM = createTranslateMatrix(ox, oy);

    element.setAttribute('transform', matrixToString(eM.multiply(matrix).multiply(eM.inverse())));

    if (!isSVGGroup(element)) {
        applyTranslate(element, { x: ox, y: oy });
        return;
    }

    checkChildElements(element).forEach((child) => {
        const childM = createTranslateMatrix(dx, dy);

        const translateMatrix = childM
            .multiply(getTransformToElement(child, child.parentNode))
            .multiply(childM.inverse());

        if (!isIdentity(translateMatrix)) {
            child.setAttribute('transform', matrixToString(translateMatrix));
        }

        if (!isSVGGroup(child)) {
            const ctm = parentMatrix.inverse();
            ctm.e = ctm.f = 0;

            applyTranslate(child, pointTo(ctm, ox, oy));
        }
    });
};
