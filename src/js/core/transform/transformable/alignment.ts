import { alignEdges } from '../guides';
import type { Alignment, GuideState } from '../guides';
import { clampEdge } from '../restrict';
import { MIN_SIZE } from '../../consts';
import type { Restriction } from '../restrict';
import type { Delta, TransformStorage } from './types';

type ResizeSession = Pick<TransformStorage, 'dox' | 'doy' | 'revX' | 'revY' | 'doW' | 'doH'>;

interface Flips {
    flipX?: boolean;
    flipY?: boolean;
}

const movingEdges = ({ revX, revY }: ResizeSession, { flipX, flipY }: Flips) => ({
    leftMoves: Boolean(revX) !== Boolean(flipX),
    topMoves: Boolean(revY) !== Boolean(flipY)
});

const room = (size: number): number => size - Math.min(MIN_SIZE, size);

const sizeLimit = (
    { left, right, top, bottom }: GuideState['box'],
    { dox, doy }: ResizeSession,
    { leftMoves, topMoves }: ReturnType<typeof movingEdges>,
    flip: boolean
) => ({ dx, dy }: Delta): Delta => {
    if (flip) return { dx, dy };

    const width = room(right - left);
    const height = room(bottom - top);

    return {
        dx: !dox ? dx : leftMoves ? Math.min(dx, width) : Math.max(dx, -width),
        dy: !doy ? dy : topMoves ? Math.min(dy, height) : Math.max(dy, -height)
    };
};

export const alignResize = (
    guides: GuideState | null | undefined,
    session: ResizeSession,
    proportions: boolean,
    delta: Delta,
    flip = true
): Alignment | null => {
    if (!guides || !guides.axisAligned) return null;

    const { box } = guides;
    const { dox, doy, doW, doH } = session;
    const moving = movingEdges(session, guides);
    const { leftMoves, topMoves } = moving;
    const widthLeads = doW || !doH;
    const limit = sizeLimit(box, session, moving, flip);
    const { dx, dy } = limit(delta);

    const run = (axes: { x: boolean; y: boolean }) => alignEdges(
        guides,
        {
            x: dox ? (leftMoves ? box.left : box.right) : null,
            y: doy ? (topMoves ? box.top : box.bottom) : null
        },
        (nextDx, nextDy) => ({
            left: box.left + (dox && leftMoves ? nextDx : 0),
            right: box.right + (dox && !leftMoves ? nextDx : 0),
            top: box.top + (doy && topMoves ? nextDy : 0),
            bottom: box.bottom + (doy && !topMoves ? nextDy : 0)
        }),
        dx,
        dy,
        axes
    );

    const axes = {
        x: Boolean(dox) && (!proportions || widthLeads),
        y: Boolean(doy) && (!proportions || !widthLeads)
    };
    const aligned = run(axes);
    const bounded = limit(aligned);

    if (bounded.dx === aligned.dx && bounded.dy === aligned.dy) return aligned;

    return run({
        x: axes.x && bounded.dx === aligned.dx,
        y: axes.y && bounded.dy === aligned.dy
    });
};

export const alignPoint = (
    guides: GuideState | null | undefined,
    { dox, doy }: ResizeSession,
    proportions: boolean,
    { dx, dy }: Delta
): Alignment | null => {
    if (!guides || !guides.point || proportions) return null;

    const { x, y } = guides.point;

    return alignEdges(
        guides,
        { x, y },
        (nextDx, nextDy) => ({
            left: x + nextDx,
            right: x + nextDx,
            top: y + nextDy,
            bottom: y + nextDy
        }),
        dx,
        dy,
        { x: dox, y: doy }
    );
};

export const clampResize = (
    restriction: Restriction | null | undefined,
    session: ResizeSession,
    { dx, dy }: Delta
): Delta & { clamped: boolean } => {
    if (!restriction || !restriction.axisAligned) return { dx, dy, clamped: false };

    const { box, area } = restriction;
    const { dox, doy } = session;
    const { leftMoves, topMoves } = movingEdges(session, restriction);

    return {
        dx: dox ? clampEdge(leftMoves ? box.left : box.right, area.left, area.right, dx) : dx,
        dy: doy ? clampEdge(topMoves ? box.top : box.bottom, area.top, area.bottom, dy) : dy,
        clamped: true
    };
};

export const clampPoint = (restriction: Restriction | null | undefined, { dx, dy }: Delta): Delta => {
    if (!restriction || !restriction.point) return { dx, dy };

    const { point, area } = restriction;

    return {
        dx: clampEdge(point.x, area.left, area.right, dx),
        dy: clampEdge(point.y, area.top, area.bottom, dy)
    };
};
