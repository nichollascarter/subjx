/* @license
 * Move/Rotate/Resize tool
 * Released under the MIT license, 2018-2019
 * Karen Sarksyan
 * nichollascarter@gmail.com
*/

import '../style/subjx.css';
import Subjx from './core/Subjx';
import Observable from './core/observable/Observable';

export { Subjx, Observable };

export default function subjx(params) {
    return new Subjx(params);
}

Object.defineProperty(subjx, 'createObservable', {
    value: () => {
        return new Observable();
    }
});