import { strokeBBox, strokePadding } from '../src/js/core/transform/svg/stroke-bounds';

const SVG_NS = 'http://www.w3.org/2000/svg';

const styles = new Map();

const styled = (tag, style = {}) => {
    const el = document.createElementNS(SVG_NS, tag);
    styles.set(el, style);
    return el;
};

beforeEach(() => {
    Object.defineProperty(window, 'getComputedStyle', {
        configurable: true,
        value: el => ({ getPropertyValue: name => (styles.get(el) || {})[name] || '' })
    });
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
        configurable: true,
        writable: true,
        value: () => ({ x: 0, y: 0, width: 100, height: 0 })
    });
});

describe('stroke padding', () => {
    it('is half the stroke width of a shape', () => {
        expect(strokePadding(styled('polyline', { stroke: '#000', 'stroke-width': '10' }))).toEqual(5);
    });

    it('is zero without a stroke', () => {
        expect(strokePadding(styled('polyline', { stroke: 'none', 'stroke-width': '10' }))).toEqual(0);
    });

    it('takes the widest visible stroke inside a group', () => {
        const group = styled('g');
        group.append(
            styled('polyline', { stroke: '#000', 'stroke-width': '10' }),
            styled('polyline', { stroke: '#000', 'stroke-width': '4' }),
            styled('polyline', { stroke: '#000', 'stroke-width': '30', display: 'none' })
        );
        expect(strokePadding(group)).toEqual(5);
    });

    it('ignores strokes that are never painted', () => {
        const group = styled('g');
        const defs = styled('defs');
        defs.append(styled('rect', { stroke: '#000', 'stroke-width': '40' }));
        group.append(defs, styled('title', { stroke: '#000', 'stroke-width': '40' }));
        expect(strokePadding(group)).toEqual(0);
    });
});

describe('stroke bounding box', () => {
    it('pads the geometry when the browser ignores the stroke option', () => {
        const line = styled('polyline', { stroke: '#000', 'stroke-width': '10' });
        expect(strokeBBox(line)).toEqual({ x: -5, y: -5, width: 110, height: 10 });
    });

    it('uses the browser stroke box when there is one', () => {
        const line = styled('polyline', { stroke: '#000', 'stroke-width': '10' });
        line.getBBox = options => (options && options.stroke
            ? { x: -5, y: -5, width: 110, height: 10 }
            : { x: 0, y: 0, width: 100, height: 0 });
        expect(strokeBBox(line)).toEqual({ x: -5, y: -5, width: 110, height: 10 });
    });
});
