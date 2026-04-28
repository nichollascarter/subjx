import '../style/subjx.css';
import Subjx, { Observable } from './core';

// Export matrix utilities for programmatic transform operations
// matrix - 4x4 matrix utilities for CSS/HTML transforms
export * as matrix from './core/transform/matrix';
// svgMatrix - 6-value matrix utilities for SVG transforms (a,b,c,d,e,f)
export * as svgMatrix from './core/transform/svg/util';
// common - shared utilities (RAD, DEG, snapToGrid, etc.)
export * as common from './core/transform/common';

export default function subjx(params) {
    return new Subjx(params);
}

Object.defineProperty(subjx, 'createObservable', {
    value: () => new Observable()
});

Object.defineProperty(subjx, 'Subjx', {
    value: Subjx
});

Object.defineProperty(subjx, 'Observable', {
    value: Observable
});