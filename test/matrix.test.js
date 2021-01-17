import * as matrixUtil from '../src/js/core/transform/matrix';

document.body.innerHTML = `
    <div style="position: fixed; width:100%; height:100%;">
        <div id="container" style="top:10px; left:10px; width:100%; height:100%; position: absolute; transform: matrix(0.8, 0, 0, 0.8, 15, 15); transform-origin: 15px 15px">
            <div
                id="draggable"
                style="position: absolute; top:150px; left:150px; transform: matrix3d(1.5, 0, 0, 10, 0, 1.5, 0, 0, 5, 0, 1, 0, 0, 0, -7, 1)"
            ></div>
            <div
                id="draggable2"
                style="position: absolute; top:150px; left:150px; transform: matrix(2, 0, 0, 1.5, 10, 20)"
            ></div>
        <div>
    </div>
`;

const {
    cloneMatrix,
    flatMatrix,
    createIdentityMatrix,
    createTranslateMatrix,
    createScaleMatrix,
    createRotateMatrix,
    dropTranslate,
    multiplyMatrixAndPoint,
    multiplyMatrix,
    matrixInvert,
    computeTransformMatrix,
    decompose,
    getTransform,
    getTransformOrigin,
    getAbsoluteOffset
} = matrixUtil;

describe('Matrix util test', () => {
    it('creates flat matrix', () => {
        const matrix3d = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        expect(flatMatrix(matrix3d)).toMatchObject([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    });

    it('creates identity matrix', () => {
        expect(createIdentityMatrix()).toMatchObject([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('creates translate matrix', () => {
        const x = 10,
            y = 20;

        expect(createTranslateMatrix(x, y)).toMatchObject([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('creates scale matrix', () => {
        const x = 2,
            y = 3;

        expect(createScaleMatrix(x, y)).toMatchObject([
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('creates rotate matrix', () => {
        const sin = 2,
            cos = 2;

        expect(createRotateMatrix(sin, cos)).toMatchObject([
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('drops translate effect from matrix', () => {
        const translateMatrix = [
            [1.5, 0, 0, 10],
            [0, 1.5, 0, 20],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        expect(dropTranslate(translateMatrix)).toMatchObject([
            [1.5, 0, 0, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('clones matrix', () => {
        const originMatrix = [
            [1.5, 0, 0, 10],
            [0, 1.5, 0, 20],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        expect(cloneMatrix(originMatrix)).toMatchObject([
            [1.5, 0, 0, 10],
            [0, 1.5, 0, 20],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('get 3d transform matrix of element', () => {
        const el = document.getElementById('draggable');
        expect(getTransform(el)).toMatchObject([
            [1.5, 0, 5, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1, -7],
            [10, 0, 0, 1]
        ]);
    });

    it('get transform matrix of element', () => {
        const el = document.getElementById('draggable2');
        expect(getTransform(el)).toMatchObject([
            [2, 0, 0, 10],
            [0, 1.5, 0, 20],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('get transform origin of element', () => {
        const el = document.getElementById('draggable');
        expect(getTransformOrigin(el, false)).toMatchObject([0, 0, 0, 1]);
    });

    it('multiplies matrices', () => {
        const preMatrix = [
            [1.5, 0, 0, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        const postMatrix = [
            [1, 0, 0, 10],
            [0, 1, 0, 20],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        expect(multiplyMatrix(preMatrix, postMatrix)).toMatchObject([
            [1.5, 0, 0, 10],
            [0, 1.5, 0, 20],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('inverses matrix', () => {
        const matrix = [
            [1.5, 0, 0, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        expect(matrixInvert(matrix)).toMatchObject([
            [0.6666666666666666, 0, 0, 0],
            [0, 0.6666666666666666, 0, 0],
            [0, 0, 0.6666666666666666, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('applies matrix to point', () => {
        const matrix = [
            [1.5, 0, 0, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        expect(
            multiplyMatrixAndPoint(matrix, [10, 10, 0, 1])
        ).toMatchObject([15, 15, 0, 1]);
    });

    it('computes transform matrix', () => {
        const matrix = [
            [1.5, 0, 0, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ];

        expect(
            computeTransformMatrix(matrix, [10, 10, 0])
        ).toMatchObject([
            [1.5, 0, 0, -5],
            [0, 1.5, 0, -5],
            [0, 0, 1.5, 0],
            [0, 0, 0, 1]
        ]);
    });

    it('decomposes transform to components', () => {
        const matrix = [
            [1.5, 0, 5, 0],
            [0, 1.5, 0, 0],
            [0, 0, 1, -7],
            [10, 0, 0, 1]
        ];

        expect(
            decompose(matrix)
        ).toMatchObject({
            rotate: { x: -0, y: 0, z: -1.4219063791853994 },
            translate: { x: 0, y: 0, z: -1.3728129459672884 },
            scale: { sX: 1.5, sY: 1.5, sZ: 5.0990195135927845 }
        });
    });

    it('get offset of element', () => {
        const el = document.getElementById('draggable');

        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
            get() { return this.parentNode; }
        });

        expect(
            getAbsoluteOffset(el, el.parentNode)
        ).toMatchObject([0, 0, 0, 1]);
    });

    // it('get current transform of element', () => {
    //     const el = document.getElementById('draggable');

    //     Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    //         get() { return this.parentNode; }
    //     });
    //     console.log(getCurrentTransformMatrix(el, el.parentNode))
    //     expect(getCurrentTransformMatrix(el, el.parentNode)).toMatchObject([
    //         [ 1.5, 0, 5, 0 ],
    //         [ 0, 1.5, 0, 0 ],
    //         [ 0, 0, 1, -7 ],
    //         [ 10, 0, 0, 1 ]
    //     ]);
    // });
});