import { floatToFixed } from './common';

export function matrixTransform({ x, y }, matrix) {
    const [a, b, c, d, e, f] = matrix;

    return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
    };
}

//http://blog.acipo.com/matrix-inversion-in-javascript/
export function matrixInvert(ctm) {
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    const M = [
        [ctm[0], ctm[2], ctm[4]],
        [ctm[1], ctm[3], ctm[5]],
        [0, 0, 1]
    ];

    //if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
        return;
    }

    //create the identity matrix (I), and a copy (C) of the original
    const dim = M.length;

    const I = [],
        C = [];

    for (let i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];
        for (let j = 0; j < dim; j += 1) {
            //if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            }

            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }

    // Perform elementary row operations
    for (let i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        let e = C[i][i];

        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if (e === 0) {
            //look through every row below the i'th row
            for (let ii = i + 1; ii < dim; ii += 1) {
                //if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] !== 0) {
                    //it would make the diagonal have a non-0 so swap it
                    for (let j = 0; j < dim; j++) {
                        e = C[i][j]; //temp store i'th row
                        C[i][j] = C[ii][j]; //replace i'th row by ii'th
                        C[ii][j] = e; //repace ii'th by temp
                        e = I[i][j]; //temp store i'th row
                        I[i][j] = I[ii][j]; //replace i'th row by ii'th
                        I[ii][j] = e; //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if (e === 0) {
                return;
            }
        }

        // Scale this row down by e (so we have a 1 on the diagonal)
        for (let j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix
            I[i][j] = I[i][j] / e; //apply to identity
        }

        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for (let ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            }

            // We want to change this element to 0
            e = C[ii][i];

            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for (let j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix
                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    }

    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return [
        I[0][0], I[1][0],
        I[0][1], I[1][1],
        I[0][2], I[1][2]
    ];
}

export function multiplyMatrix(
    [a1, b1, c1, d1, e1, f1], 
    [a2, b2, c2, d2, e2, f2]
) {
    const m1 = [
        [a1, c1, e1],
        [b1, d1, f1],
        [0, 0, 1]
    ];

    const m2 = [
        [a2, c2, e2],
        [b2, d2, f2],
        [0, 0, 1]
    ];

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

    return [
        result[0][0], result[1][0],
        result[0][1], result[1][1],
        result[0][2], result[1][2]
    ];
}

export function rotatedTopLeft(
    x,
    y,
    width,
    height,
    rotationAngle,
    revX,
    revY,
    doW,
    doH
) {
    const hw = parseFloat(width) / 2,
        hh = parseFloat(height) / 2;

    const cx = x + hw,
        cy = y + hh;

    const dx = x - cx,
        dy = y - cy;

    const originalTopLeftAngle = Math.atan2(doW ? 0 : dy, doH ? 0 : dx);
    const rotatedTopLeftAngle = originalTopLeftAngle + rotationAngle;

    const radius = Math.sqrt(Math.pow(doH ? 0 : hw, 2) + Math.pow(doW ? 0 : hh, 2));

    let cos = Math.cos(rotatedTopLeftAngle),
        sin = Math.sin(rotatedTopLeftAngle);

    cos = revX === true ? -cos : cos;
    sin = revY === true ? -sin : sin;

    const rx = cx + radius * cos,
        ry = cy + radius * sin;

    return {
        left: floatToFixed(rx),
        top: floatToFixed(ry)
    };
}