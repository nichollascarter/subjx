import '../style/subjx.css';
import Subjx, { Observable } from './core';
import * as matrix from './core/transform/matrix';
import * as svgMatrix from './core/transform/svg/util';
import * as common from './core/transform/common';

function subjx(params) {
    return new Subjx(params);
}

Object.assign(subjx, {
    createObservable: () => new Observable(),
    Subjx,
    Observable,
    matrix,
    svgMatrix,
    common
});

export { matrix, svgMatrix, common };
export default subjx;
