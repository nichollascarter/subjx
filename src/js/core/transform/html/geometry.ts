import type { Matrix, Vector } from '../../types';
import {
    createRotateMatrix,
    createTranslateMatrix,
    getAbsoluteOffset,
    matrixInvert,
    multiplyMatrix,
    multiplyMatrixAndPoint
} from '../matrix';
import type { HTMLBBox, VertexMap } from './types';

const { entries } = Object;

export const rotation = (radians: number): Matrix => createRotateMatrix(Math.sin(radians), Math.cos(radians));

export const conjugate = (matrix: Matrix, pivot: Matrix): Matrix => (
    multiplyMatrix(multiplyMatrix(matrixInvert(pivot), matrix), pivot)
);

export const pinnedMatrix = (scaleMatrix: Matrix, ctm: Matrix, revX?: boolean, revY?: boolean): Matrix => {
    const translateX = scaleMatrix[0][3];
    const translateY = scaleMatrix[1][3];

    const inverted = createTranslateMatrix(
        translateX * (revX ? -1 : 1),
        translateY * (revY ? -1 : 1)
    );

    return multiplyMatrix(
        multiplyMatrix(inverted, ctm),
        matrixInvert(createTranslateMatrix(translateX, translateY))
    );
};

export const toVectors = (vertices: Record<string, number[]>): VertexMap => (
    entries(vertices).reduce<VertexMap>((result, [key, [x, y]]) => {
        result[key] = [x, y, 0, 1];
        return result;
    }, {})
);

export const mapVertices = (vertices: Record<string, number[]>, map: (vertex: Vector) => Vector): VertexMap => (
    entries(vertices).reduce<VertexMap>((result, [key, [x, y]]) => {
        result[key] = map([x, y, 0, 1]);
        return result;
    }, {})
);

export const toPoints = (vertices: Record<string, Vector>) => (
    entries(vertices).reduce<Record<string, { x: number; y: number }>>((result, [key, [x, y]]) => {
        result[key] = { x, y };
        return result;
    }, {})
);

const ownBox = (element: HTMLElement, container: Element): HTMLBBox => {
    const [left, top] = getAbsoluteOffset(element, container);

    return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        offset: { left, top }
    };
};

export const bBoxPoints = (element: HTMLElement, container: Element, ctm: Matrix, bBox?: HTMLBBox): Vector[] => {
    const {
        width,
        height,
        offset: {
            left,
            top
        } = {} as NonNullable<HTMLBBox['offset']>
    } = bBox || ownBox(element, container);

    return [
        [0, 0, 0, 1],
        [width, 0, 0, 1],
        [0, height, 0, 1],
        [width, height, 0, 1]
    ].map((vertex) => {
        const [x, y, z, w] = multiplyMatrixAndPoint(ctm, vertex);
        return [x + left, y + top, z, w];
    });
};
