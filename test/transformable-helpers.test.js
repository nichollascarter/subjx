import { helper } from '../src/js/core/Helper';
import { handleFlags, handleKey, resizeAxes } from '../src/js/core/transform/transformable/handles';
import { actionOf, isMimicked, startEventOf, endEventOf } from '../src/js/core/transform/transformable/actions';
import { alignResize, alignPoint, clampResize, clampPoint } from '../src/js/core/transform/transformable/alignment';
import { overflowPoint } from '../src/js/core/transform/restrict';

const makeHandles = (...keys) => keys.reduce((res, key) => ({ ...res, [key]: document.createElement('div') }), {});

describe('handles', () => {
    const handles = makeHandles('tl', 'tc', 'mr', 'bc', 're', 'p1', 'rotator');

    it('finds the key of a handle', () => {
        expect(handleKey(handles, handles.mr)).toBe('mr');
        expect(handleKey(handles, document.createElement('div'))).toBeNull();
    });

    it('reads resize flags of a corner', () => {
        expect(handleFlags(helper(handles.tl), handles)).toEqual({
            revX: true,
            revY: true,
            onTopEdge: true,
            onLeftEdge: true,
            onRightEdge: false,
            onBottomEdge: false,
            doW: false,
            doH: false,
            point: null
        });
    });

    it('reads width-only and height-only handles', () => {
        expect(handleFlags(helper(handles.re), handles)).toMatchObject({ onRightEdge: true, doW: true, doH: false });
        expect(handleFlags(helper(handles.bc), handles)).toMatchObject({ onBottomEdge: true, doW: false, doH: true });
    });

    it('detects a line point', () => {
        expect(handleFlags(helper(handles.p1), handles).point).toBe('p1');
    });

    it('resolves the resized axes', () => {
        expect(resizeAxes(helper(handles.tl), handles)).toEqual({ x: true, y: true });
        expect(resizeAxes(helper(handles.mr), handles)).toEqual({ x: true, y: false });
        expect(resizeAxes(helper(handles.tc), handles)).toEqual({ x: false, y: true });
        expect(resizeAxes(helper(handles.rotator), handles)).toEqual({ x: false, y: false });
    });
});

describe('actions', () => {
    it('names the running action', () => {
        expect(actionOf({ doResize: true })).toBe('resize');
        expect(actionOf({ doRotate: true })).toBe('rotate');
        expect(actionOf({ doSetCenter: true })).toBe('setPoint');
        expect(actionOf({ doDrag: true })).toBe('drag');
        expect(actionOf({})).toBe('drag');
    });

    it('mirrors only the subscribed actions', () => {
        const each = { move: true, resize: false, rotate: true };

        expect(isMimicked({ doDrag: true }, each)).toBe(true);
        expect(isMimicked({ doResize: true }, each)).toBe(false);
        expect(isMimicked({ doRotate: true }, each)).toBe(true);
        expect(isMimicked({ doSetCenter: true }, each)).toBe(false);
    });

    it('maps actions to start and end events', () => {
        expect(startEventOf('resize')).toBe('resizeStart');
        expect(startEventOf('setPoint')).toBeNull();
        expect(endEventOf('setPoint')).toBe('setPointEnd');
        expect(endEventOf('drag')).toBe('dragEnd');
    });
});

describe('alignment', () => {
    const box = { left: 0, top: 0, right: 100, bottom: 50 };
    const area = { left: -20, top: -10, right: 120, bottom: 60 };

    it('skips alignment without axis-aligned guides', () => {
        expect(alignResize(null, {}, false, { dx: 1, dy: 1 })).toBeNull();
        expect(alignResize({ box, targets: [], threshold: 5, snap: true }, {}, false, { dx: 1, dy: 1 })).toBeNull();
        expect(alignPoint({ box, targets: [], threshold: 5, snap: true, point: { x: 0, y: 0 } }, {}, true, { dx: 1, dy: 1 })).toBeNull();
    });

    it('snaps the moving edge to a guide', () => {
        const guides = { box, targets: [{ left: 103, top: 200, right: 150, bottom: 250 }], threshold: 5, snap: true, axisAligned: true };
        const { dx, dy } = alignResize(guides, { dox: true, doy: false }, false, { dx: 1, dy: 0 });

        expect(dx).toBe(3);
        expect(dy).toBe(0);
    });

    it('keeps guides on the edge when flip is off', () => {
        const guides = { box, targets: [{ left: -60, top: 200, right: -50, bottom: 250 }], threshold: 5, snap: true, axisAligned: true };

        expect(alignResize(guides, { dox: true, doy: false }, false, { dx: -150, dy: 0 }, false)).toEqual({ dx: -98, dy: 0, lines: [] });
        expect(alignResize(guides, { dox: true, doy: false, revX: true }, false, { dx: 150, dy: 0 }, false)).toMatchObject({ dx: 98, lines: [] });
        expect(alignResize(guides, { dox: true, doy: false }, false, { dx: -150, dy: 0 })).toMatchObject({ dx: -150 });
        expect(alignResize(guides, { dox: true, doy: false }, false, { dx: -150, dy: 0 }).lines).toHaveLength(1);
    });

    it('drops a snap that would flip the element', () => {
        const guides = { box, targets: [{ left: -40, top: 200, right: 0, bottom: 250 }], threshold: 5, snap: true, axisAligned: true };

        expect(alignResize(guides, { dox: true, doy: false }, false, { dx: -97, dy: 0 }, false)).toEqual({ dx: -97, dy: 0, lines: [] });
    });

    it('clamps the moving edges to the area', () => {
        const restriction = { box, area, axisAligned: true };

        expect(clampResize(restriction, { dox: true, doy: true }, { dx: 50, dy: 50 })).toEqual({ dx: 20, dy: 10, clamped: true });
        expect(clampResize(restriction, { dox: true, doy: true, revX: true, revY: true }, { dx: -50, dy: -50 })).toEqual({ dx: -20, dy: -10, clamped: true });
        expect(clampResize({ box, area }, { dox: true }, { dx: 50, dy: 0 })).toEqual({ dx: 50, dy: 0, clamped: false });
    });

    it('clamps a line point to the area', () => {
        expect(clampPoint({ box, area, point: { x: 100, y: 50 } }, { dx: 50, dy: -100 })).toEqual({ dx: 20, dy: -60 });
        expect(clampPoint(null, { dx: 5, dy: 5 })).toEqual({ dx: 5, dy: 5 });
    });
});

describe('overflowPoint', () => {
    const bounds = [[0, 0], [100, 0], [100, 100], [0, 100]];

    it('returns nulls inside the bounds', () => {
        expect(overflowPoint([[10, 10], [90, 90]], bounds)).toEqual({ x: null, y: null });
    });

    it('returns the overflowing coordinates', () => {
        expect(overflowPoint([[10, 10], [120, 50]], bounds)).toEqual({ x: 120, y: null });
        expect(overflowPoint([[-5, 130]], bounds)).toEqual({ x: -5, y: 130 });
    });
});
