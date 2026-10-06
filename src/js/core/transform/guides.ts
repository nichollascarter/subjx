export interface Box {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface GuideLine {
    axis: 'x' | 'y';
    value: number;
    from: number;
    to: number;
}

export interface GuideState {
    box: Box;
    targets: Box[];
    threshold: number;
    snap: boolean;
    axisAligned?: boolean;
    flipX?: boolean;
    flipY?: boolean;
    point?: {
        x: number;
        y: number;
    } | null;
}

export interface Alignment {
    dx: number;
    dy: number;
    lines: GuideLine[];
}

export interface Axes {
    x?: boolean;
    y?: boolean;
}

const EPSILON = 1e-6;

const xLines = ({ left, right }: Box) => [left, (left + right) / 2, right];
const yLines = ({ top, bottom }: Box) => [top, (top + bottom) / 2, bottom];

const shift = ({ left, top, right, bottom }: Box, dx: number, dy: number): Box => ({
    left: left + dx,
    top: top + dy,
    right: right + dx,
    bottom: bottom + dy
});

export const boxFromPoints = (points: number[][]): Box => {
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);

    return {
        left: Math.min(...xs),
        top: Math.min(...ys),
        right: Math.max(...xs),
        bottom: Math.max(...ys)
    };
};

export const unionBoxes = (boxes: Box[]): Box => ({
    left: Math.min(...boxes.map(box => box.left)),
    top: Math.min(...boxes.map(box => box.top)),
    right: Math.max(...boxes.map(box => box.right)),
    bottom: Math.max(...boxes.map(box => box.bottom))
});

const nearestOffset = (moving: number[], targets: number[][], threshold: number) => {
    let best: number | null = null;

    targets.forEach(values => values.forEach(target => moving.forEach(value => {
        const offset = target - value;

        if (Math.abs(offset) <= threshold && (best === null || Math.abs(offset) < Math.abs(best))) {
            best = offset;
        }
    })));

    return best;
};

const collectLines = (xs: number[], ys: number[], extent: Box, targets: Box[], tolerance: number) => {
    const lines: GuideLine[] = [];

    const add = (axis: GuideLine['axis'], value: number, from: number, to: number) => {
        const same = lines.find(line => line.axis === axis && Math.abs(line.value - value) <= EPSILON);

        if (same) {
            same.from = Math.min(same.from, from);
            same.to = Math.max(same.to, to);
        } else {
            lines.push({ axis, value, from, to });
        }
    };

    targets.forEach(target => {
        xLines(target).forEach(value => {
            if (xs.some(x => Math.abs(x - value) <= tolerance)) {
                add('x', value, Math.min(extent.top, target.top), Math.max(extent.bottom, target.bottom));
            }
        });

        yLines(target).forEach(value => {
            if (ys.some(y => Math.abs(y - value) <= tolerance)) {
                add('y', value, Math.min(extent.left, target.left), Math.max(extent.right, target.right));
            }
        });
    });

    return lines;
};

const alignProbes = (
    { targets, threshold, snap }: GuideState,
    xs: number[],
    ys: number[],
    extent: (dx: number, dy: number) => Box,
    dx: number,
    dy: number,
    { x: alignX = true, y: alignY = true }: Axes
): Alignment => {
    const offsetX = snap && alignX && xs.length
        ? nearestOffset(xs.map(x => x + dx), targets.map(xLines), threshold)
        : null;
    const offsetY = snap && alignY && ys.length
        ? nearestOffset(ys.map(y => y + dy), targets.map(yLines), threshold)
        : null;

    const nextDx = dx + (offsetX || 0);
    const nextDy = dy + (offsetY || 0);

    return {
        dx: nextDx,
        dy: nextDy,
        lines: collectLines(
            xs.map(x => x + nextDx),
            ys.map(y => y + nextDy),
            extent(nextDx, nextDy),
            targets,
            snap ? EPSILON : threshold
        )
    };
};

export const align = (state: GuideState, dx: number, dy: number, axes: Axes = {}): Alignment => (
    alignProbes(
        state,
        xLines(state.box),
        yLines(state.box),
        (nextDx, nextDy) => shift(state.box, nextDx, nextDy),
        dx,
        dy,
        axes
    )
);

export const alignEdges = (
    state: GuideState,
    edges: { x?: number | null; y?: number | null },
    extent: (dx: number, dy: number) => Box,
    dx: number,
    dy: number,
    axes: Axes = {}
): Alignment => (
    alignProbes(
        state,
        edges.x === null || edges.x === undefined ? [] : [edges.x],
        edges.y === null || edges.y === undefined ? [] : [edges.y],
        extent,
        dx,
        dy,
        axes
    )
);
