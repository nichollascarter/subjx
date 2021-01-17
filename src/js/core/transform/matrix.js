import { getStyle } from '../util/css-util';

export const cloneMatrix = m => m.map(item => [...item]);

export const flatMatrix = (m) => (
    m.reduce((flat, _, i) => ([...flat, m[0][i], m[1][i], m[2][i], m[3][i]]), [])
);

export const createIdentityMatrix = (n = 4) => (
    [...Array(n)].map((_, i, a) => a.map(() => +!i--))
);

export const createTranslateMatrix = (x, y, z = 0) => (
    createIdentityMatrix().map((item, i) => {
        item[3] = [x, y, z, 1][i];
        return item;
    })
);

export const createScaleMatrix = (x, y, z = 1, w = 1) => (
    createIdentityMatrix().map((item, i) => {
        item[i] = [x, y, z, w][i];
        return item;
    })
);

export const createRotateMatrix = (sin, cos) => {
    const res = createIdentityMatrix();

    res[0][0] = cos;
    res[0][1] = -sin;
    res[1][0] = sin;
    res[1][1] = cos;

    return res;
};

export const dropTranslate = (matrix, clone = true) => {
    const nextMatrix = clone ? cloneMatrix(matrix) : matrix;
    nextMatrix[0][3] = nextMatrix[1][3] = nextMatrix[2][3] = 0;
    return nextMatrix;
};

export const multiplyMatrixAndPoint = (mat, point) => {
    const out = [];

    for (let i = 0, len = mat.length; i < len; ++i) {
        let sum = 0;
        for (let j = 0; j < len; ++j) {
            sum += +mat[i][j] * point[j];
        }
        out[i] = sum;
    }

    return out;
};

export const multiplyMatrix = (m1, m2) => {
    const result = [];

    for (let j = 0; j < m2.length; j++) {
        result[j] = [];

        for (let k = 0; k < m1[0].length; k++) {
            let sum = 0;

            for (let i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
            result[j].push(sum);
        }
    }
    return result;
};

export const matrixInvert = (matrix) => {
    const _A = cloneMatrix(matrix);

    let temp,
        N = _A.length,
        E = [];

    for (let i = 0; i < N; i++)
        E[i] = [];

    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
            E[i][j] = 0;
            if (i == j)
                E[i][j] = 1;
        }

    for (let k = 0; k < N; k++) {
        temp = _A[k][k];

        for (let j = 0; j < N; j++) {
            _A[k][j] /= temp;
            E[k][j] /= temp;
        }

        for (let i = k + 1; i < N; i++) {
            temp = _A[i][k];

            for (let j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (let k = N - 1; k > 0; k--) {
        for (let i = k - 1; i >= 0; i--) {
            temp = _A[i][k];

            for (let j = 0; j < N; j++) {
                _A[i][j] -= _A[k][j] * temp;
                E[i][j] -= E[k][j] * temp;
            }
        }
    }

    for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
            _A[i][j] = E[i][j];

    return _A;
};

export const computeTransformMatrix = (tx, [x, y, z]) => {
    const preMul = createTranslateMatrix(-x, -y, -z);
    const postMul = createTranslateMatrix(x, y, z);

    return multiplyMatrix(
        multiplyMatrix(preMul, tx),
        postMul
    );
};

export const getCurrentTransformMatrix = (el, container = document.body, newTransform) => {
    let matrix = createIdentityMatrix();
    let node = el;

    // set predefined matrix if we need to find new CTM
    let nodeTx = newTransform || getTransform(node);
    let allowBorderOffset = false;

    while (node && node instanceof Element) {
        //const nodeTx = getTransform(node);
        const nodeTxOrigin = getTransformOrigin(node, allowBorderOffset);

        matrix = multiplyMatrix(
            matrix,
            computeTransformMatrix(nodeTx, nodeTxOrigin)
        );

        allowBorderOffset = true;
        if (node === container || node.offsetParent === null) break;
        node = node.offsetParent;
        nodeTx = getTransform(node);
    }

    return matrix;
};

export const decompose = (m) => {
    const sX = Math.sqrt(m[0][0] * m[0][0] + m[1][0] * m[1][0] + m[2][0] * m[2][0]),
        sY = Math.sqrt(m[0][1] * m[0][1] + m[1][1] * m[1][1] + m[2][1] * m[2][1]),
        sZ = Math.sqrt(m[0][2] * m[0][2] + m[1][2] * m[1][2] + m[2][2] * m[2][2]);

    let rX = Math.atan2(-m[0][3] / sZ, m[1][3] / sZ),
        rY = Math.asin(m[3][1] / sZ),
        rZ = Math.atan2(-m[3][0] / sY, m[0][0] / sX);

    if (m[0][1] === 1 || m[0][1] === -1) {
        rX = 0;
        rY = m[0][1] * -Math.PI / 2;
        rZ = m[0][1] * Math.atan2(m[1][1] / sY, m[0][1] / sY);
    }

    return {
        rotate: {
            x: rX,
            y: rY,
            z: rZ
        },
        translate: {
            x: m[0][3] / sX,
            y: m[1][3] / sY,
            z: m[2][3] / sZ
        },
        scale: {
            sX,
            sY,
            sZ
        }
    };
};

export const getTransform = (el) => {
    const matrixString = getStyle(el, 'transform') || 'none';
    const matrix = createIdentityMatrix();

    if (matrixString === 'none') return matrix;

    const values = matrixString.split(/\s*[(),]\s*/).slice(1, -1);

    if (values.length === 16) {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                matrix[j][i] = +values[i * 4 + j];
            }
        }
    } else {
        return [
            [+values[0], +values[2], 0, +values[4]],
            [+values[1], +values[3], 0, +values[5]],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    return matrix;
};

export const getTransformOrigin = (el, allowBorderOffset) => {
    const transformOrigin = getStyle(el, 'transform-origin');
    const values = transformOrigin ? transformOrigin.split(' ') : [];

    const out = [
        allowBorderOffset ? -el.clientLeft : 0,
        allowBorderOffset ? -el.clientTop : 0,
        0,
        1
    ];

    for (let i = 0; i < values.length; ++i) {
        out[i] += parseFloat(values[i]);
    }

    return out;
};

export const getAbsoluteOffset = (elem, container = document.body) => {
    let top = 0, left = 0;

    let allowBorderOffset = false;
    while (elem) {
        const parentTx = getCurrentTransformMatrix(elem.offsetParent);

        const [offsetLeft, offsetTop] = multiplyMatrixAndPoint(
            dropTranslate(parentTx, false),
            [
                elem.offsetLeft + (allowBorderOffset ? elem.clientLeft : 0),
                elem.offsetTop + (allowBorderOffset ? elem.clientTop : 0),
                0,
                1
            ]
        );

        left += offsetLeft;
        top += offsetTop;

        if (container === elem) break;
        allowBorderOffset = true;
        elem = elem.offsetParent;
    }

    return [left, top, 0, 1];
};