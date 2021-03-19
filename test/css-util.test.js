import {
    getOffset,
    addClass,
    removeClass,
    matrixToCSS,
    getStyle
} from '../src/js/core/util/css-util';

import {
    createIdentityMatrix,
    flatMatrix
} from '../src/js/core/transform/matrix';

document.body.innerHTML = `
    <div id="empty-class" class="removal" style="display: block"><div>
`;

const domElement = document.getElementById('empty-class');

describe('dom class test', () => {
    it('adds new class to element', () => {
        addClass(domElement, 'new-class');
        const isContains = domElement.classList.contains('new-class');
        expect(isContains).toBe(true);
    });

    it('removes class from element', () => {
        removeClass(domElement, 'removal');
        const isContains = domElement.classList.contains('removal');
        expect(isContains).toBe(false);
    });
});

describe('element style test', () => {
    it('creates transform style properties', () => {
        const flatArr = flatMatrix(createIdentityMatrix());
        const matrixStr = `matrix3d(${flatArr.join()})`;
        const style = matrixToCSS(flatArr);

        expect(style).toMatchObject({
            transform: matrixStr,
            webkitTranform: matrixStr,
            mozTransform: matrixStr,
            msTransform: matrixStr,
            otransform: matrixStr
        });
    });

    it('get style properties', () => {
        const style = getStyle(domElement, 'display');
        expect(style).toBe('block');
    });
});

describe('element offset test', () => {
    it('get elements offset', () => {
        const offset = getOffset(domElement);
        expect(offset).toMatchObject({
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        });
    });
});