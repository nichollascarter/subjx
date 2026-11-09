import type { Alignment, GuideState } from '../guides';
import type { Restriction } from '../restrict';
import type { Delta, TransformStorage } from './types';
type ResizeSession = Pick<TransformStorage, 'dox' | 'doy' | 'revX' | 'revY' | 'doW' | 'doH'>;
export declare const alignResize: (guides: GuideState | null | undefined, session: ResizeSession, proportions: boolean, { dx, dy }: Delta) => Alignment | null;
export declare const alignPoint: (guides: GuideState | null | undefined, { dox, doy }: ResizeSession, proportions: boolean, { dx, dy }: Delta) => Alignment | null;
export declare const clampResize: (restriction: Restriction | null | undefined, session: ResizeSession, { dx, dy }: Delta) => Delta & {
    clamped: boolean;
};
export declare const clampPoint: (restriction: Restriction | null | undefined, { dx, dy }: Delta) => Delta;
export {};
