export interface HitPoint {
    x: number;
    y: number;
}

export interface HitCorners {
    tl: HitPoint;
    tr: HitPoint;
    bl: HitPoint;
    br: HitPoint;
}

interface Clamp {
    normal: HitPoint;
    depth: number;
}

type Edge = 'te' | 'be' | 'le' | 're';

const CIRCLE_SEGMENTS = 32;

export const EDGE_KEYS: readonly string[] = ['te', 'be', 'le', 're'];

const HANDLE_EDGES: Record<string, Edge[]> = {
    tl: ['te', 'le'],
    tr: ['te', 're'],
    bl: ['be', 'le'],
    br: ['be', 're'],
    tc: ['te'],
    bc: ['be'],
    ml: ['le'],
    mr: ['re']
};

const sub = (a: HitPoint, b: HitPoint) => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: HitPoint, b: HitPoint) => a.x * b.x + a.y * b.y;
const length = (a: HitPoint) => Math.hypot(a.x, a.y);
const along = (point: HitPoint, direction: HitPoint, distance: number) => ({
    x: point.x + direction.x * distance,
    y: point.y + direction.y * distance
});

const edgeEnds = ({ tl, tr, bl, br }: HitCorners, edge: Edge): [HitPoint, HitPoint] => ({
    te: [tl, tr],
    be: [bl, br],
    le: [tl, bl],
    re: [tr, br]
} as Record<Edge, [HitPoint, HitPoint]>)[edge];

const OPPOSITE: Record<Edge, Edge> = { te: 'be', be: 'te', le: 're', re: 'le' };

const edgeNormal = (corners: HitCorners, edge: Edge): HitPoint => {
    const [a, b] = edgeEnds(corners, edge);
    const direction = sub(b, a);
    const size = length(direction);
    if (size < 1e-9) return { x: 0, y: 0 };

    const normal = { x: direction.y / size, y: -direction.x / size };
    const [oppositeStart] = edgeEnds(corners, OPPOSITE[edge]);
    const towardsOpposite = dot(sub(oppositeStart, a), normal);

    if (Math.abs(towardsOpposite) > 1e-9) {
        return towardsOpposite > 0 ? { x: -normal.x, y: -normal.y } : normal;
    }

    return edge === 'te' || edge === 're' ? normal : { x: -normal.x, y: -normal.y };
};

const edgeDepth = (corners: HitCorners, edge: Edge) => {
    const [a] = edgeEnds(corners, edge);
    const [oppositeStart] = edgeEnds(corners, OPPOSITE[edge]);
    return Math.abs(dot(sub(oppositeStart, a), edgeNormal(corners, edge)));
};

const clampFor = (corners: HitCorners, edge: Edge, radius: number): Clamp => ({
    normal: edgeNormal(corners, edge),
    depth: Math.min(radius, edgeDepth(corners, edge) / 4)
});

const clockwise = (points: HitPoint[]) => {
    const area = points.reduce((sum, point, i) => {
        const next = points[(i + 1) % points.length];
        return sum + point.x * next.y - next.x * point.y;
    }, 0);

    return area < 0 ? [...points].reverse() : points;
};

const applyClamps = (points: HitPoint[], origin: HitPoint, clamps: Clamp[]) => (
    clamps.reduce((result, { normal, depth }) => result.map((point) => {
        const offset = dot(sub(point, origin), normal);
        return offset < -depth ? along(point, normal, -depth - offset) : point;
    }), points)
);

export const hitAreaOutline = (
    key: string,
    center: HitPoint,
    corners: HitCorners | null,
    radius: number
): HitPoint[] => {
    if (radius <= 0) return [];

    if (corners && EDGE_KEYS.includes(key)) {
        const edge = key as Edge;
        const [a, b] = edgeEnds(corners, edge);
        if (length(sub(b, a)) < 1e-9) return [];

        const { normal, depth } = clampFor(corners, edge, radius);

        return clockwise([
            along(a, normal, radius),
            along(b, normal, radius),
            along(b, normal, -depth),
            along(a, normal, -depth)
        ]);
    }

    const circle = Array.from({ length: CIRCLE_SEGMENTS }, (_, i) => {
        const angle = (i / CIRCLE_SEGMENTS) * Math.PI * 2;
        return {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        };
    });

    const edges = corners ? HANDLE_EDGES[key] || [] : [];

    return clockwise(applyClamps(circle, center, edges.map((edge) => clampFor(corners!, edge, radius))));
};

export const outlineToPath = (points: HitPoint[]) => (
    points.length
        ? `M${points.map(({ x, y }) => `${+x.toFixed(3)} ${+y.toFixed(3)}`).join('L')}Z`
        : ''
);
