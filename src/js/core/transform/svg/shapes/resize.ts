import { floatToFixed } from '../../common';
import { resizePath } from '../path';
import {
    checkChildElements,
    childLocalMatrix,
    createSVGMatrix,
    getTransformToElement,
    groupedChildMatrix,
    isAxisAligned,
    isSVGGroup,
    keepFixedPoint,
    matrixToString,
    parsePoints,
    pointTo
} from '../util';
import type { BBox, StoredAttributes } from '../types';

interface ResizeParams {
    dx?: number;
    dy?: number;
    scaleX: number;
    scaleY: number;
    localCTM: DOMMatrix;
    transformMatrix: DOMMatrix;
    bBox: BBox;
    __data__: WeakMap<Element, StoredAttributes>;
    isGrouped: boolean;
}

export const applyResize = (element: Element, data: ResizeParams) => {
    const {
        scaleX,
        scaleY,
        localCTM,
        __data__,
        transformMatrix,
        isGrouped
    } = data;

    const attrs: [string, string | number | undefined][] = [];

    const storedData = __data__.get(element) as Required<StoredAttributes>;

    switch (element.tagName.toLowerCase()) {

        case 'text':
        case 'tspan': {
            if (isGrouped && element.tagName.toLowerCase() === 'text') {
                attrs.push(['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]);
                break;
            }

            const { x, y, textLength, fontSize, textBox } = storedData;
            const absX = Math.abs(scaleX),
                absY = Math.abs(scaleY);

            const corners = [
                [textBox.x, textBox.y],
                [textBox.x + textBox.width, textBox.y + textBox.height]
            ].map(([px, py]) => pointTo(localCTM, px, py));

            const left = Math.min(corners[0].x, corners[1].x),
                top = Math.min(corners[0].y, corners[1].y);

            const textElement = element as SVGTextContentElement;
            const nextFontSize = fontSize * absY;

            if (textElement.style.fontSize) {
                textElement.style.fontSize = `${nextFontSize}px`;
            } else {
                textElement.setAttribute('font-size', String(nextFontSize));
            }

            textElement.setAttribute('textLength', String(absX * (textLength as number)));
            textElement.setAttribute('lengthAdjust', 'spacingAndGlyphs');

            const nextX = left + (x - textBox.x) * absX,
                nextY = top + (y - textBox.y) * absY;

            textElement.setAttribute('x', String(nextX));
            textElement.setAttribute('y', String(nextY));

            const actual = textElement.getBBox();

            attrs.push(
                ['x', nextX + keepFixedPoint(localCTM.a, localCTM.e, actual.x, actual.width, left, textBox.width * absX)],
                ['y', nextY + keepFixedPoint(localCTM.d, localCTM.f, actual.y, actual.height, top, textBox.height * absY)]
            );
            break;
        }
        case 'circle': {
            const { r, cx, cy } = storedData,
                newR = r * (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

            const {
                x: resX,
                y: resY
            } = pointTo(
                localCTM,
                cx,
                cy
            );

            attrs.push(
                ['r', newR],
                ['cx', resX],
                ['cy', resY]
            );
            break;
        }
        case 'foreignobject':
        case 'image':
        case 'rect': {
            if (!isGrouped) {
                const { width, height, x, y } = storedData;

                const {
                    x: resX,
                    y: resY
                } = pointTo(
                    localCTM,
                    x,
                    y
                );

                const newWidth = Math.abs(width * scaleX),
                    newHeight = Math.abs(height * scaleY);

                attrs.push(
                    ['x', resX - (scaleX < 0 ? newWidth : 0)],
                    ['y', resY - (scaleY < 0 ? newHeight : 0)],
                    ['width', newWidth],
                    ['height', newHeight]
                );
            } else {
                const local = childLocalMatrix(storedData.childCTM, transformMatrix);

                if (!isAxisAligned(local)) {
                    attrs.push(
                        ['transform', matrixToString(groupedChildMatrix(storedData, transformMatrix))]
                    );
                    break;
                }

                const { width, height, x, y } = storedData;

                const start = pointTo(local, x, y),
                    end = pointTo(local, x + width, y + height);

                attrs.push(
                    ['x', Math.min(start.x, end.x)],
                    ['y', Math.min(start.y, end.y)],
                    ['width', Math.abs(end.x - start.x)],
                    ['height', Math.abs(end.y - start.y)]
                );
            }
            break;
        }
        case 'ellipse': {
            const { rx, ry, cx, cy } = storedData;

            const {
                x: cx1,
                y: cy1
            } = pointTo(
                localCTM,
                cx,
                cy
            );

            const scaleMatrix = createSVGMatrix();

            scaleMatrix.a = scaleX;
            scaleMatrix.d = scaleY;

            const {
                x: nRx,
                y: nRy
            } = pointTo(
                scaleMatrix,
                rx,
                ry
            );

            attrs.push(
                ['rx', Math.abs(nRx)],
                ['ry', Math.abs(nRy)],
                ['cx', cx1],
                ['cy', cy1]
            );
            break;
        }
        case 'line': {
            const { resX1, resY1, resX2, resY2 } = storedData;

            const {
                x: resX1_,
                y: resY1_
            } = pointTo(
                localCTM,
                resX1,
                resY1
            );

            const {
                x: resX2_,
                y: resY2_
            } = pointTo(
                localCTM,
                resX2,
                resY2
            );

            attrs.push(
                ['x1', resX1_],
                ['y1', resY1_],
                ['x2', resX2_],
                ['y2', resY2_]
            );
            break;
        }
        case 'polygon':
        case 'polyline': {
            const { points } = storedData;

            const result = parsePoints(points!).map(item => {
                const {
                    x,
                    y
                } = pointTo(
                    localCTM,
                    Number(item[0]),
                    Number(item[1])
                );

                item[0] = String(floatToFixed(x));
                item[1] = String(floatToFixed(y));

                return item.join(' ');
            }).join(' ');

            attrs.push(['points', result]);
            break;
        }
        case 'path': {
            const { path } = storedData;

            attrs.push(['d', resizePath({ path: path!, localCTM })]);
            break;
        }
        default:
            break;

    }

    attrs.forEach(([name, value]) => element.setAttribute(name, String(value)));
};

export const resizeElement = (element: Element, params: Omit<ResizeParams, 'localCTM'>) => {
    const { transformMatrix, isGrouped } = params;

    if (!isSVGGroup(element) && !isGrouped) {
        applyResize(element, { ...params, localCTM: transformMatrix });
        return;
    }

    checkChildElements(element).forEach((child) => {
        if (isSVGGroup(child)) return;

        const childCTM = getTransformToElement(child, isGrouped ? element.parentNode : element);

        applyResize(child, {
            ...params,
            localCTM: childCTM.inverse().multiply(transformMatrix).multiply(childCTM)
        });
    });
};
