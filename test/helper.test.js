import Helper, { helper } from '../src/js/core/Helper';

document.body.innerHTML = `
    <div id="empty-class" class="removal" style="display: block"><div>
`;

const domElement = document.getElementById('empty-class');

describe('Helper instance test', () => {
    it('creates new instance from element', () => {
        const _$ = helper(domElement);
        expect(_$ instanceof Helper).toBe(true);
    });

    it('creates new instance from elementArray', () => {
        const _$ = helper([domElement]);
        expect(_$ instanceof Helper).toBe(true);
    });

    it('creates new instance from selector', () => {
        const _$ = helper('#empty-class');
        expect(_$ instanceof Helper).toBe(true);
    });

    it('creates new instance from childNodes', () => {
        const _$ = helper(document.body.childNodes);
        expect(_$ instanceof Helper).toBe(true);
    });

    it('throws error from element', () => {
        try {
            expect(helper());
        } catch (e) {
            expect(e.message).toBe(`Passed parameter must be selector/element/elementArray`);
        }
    });

    it('get element style', () => {
        const style = helper(domElement).css('display');
        expect(style).toBe('block');
    });

    it('set element style', () => {
        helper(domElement).css({ 'visibility': 'hidden' });
        const style = helper(domElement).css('visibility');
        expect(style).toBe('hidden');
    });

    it('checks element', () => {
        helper(domElement).is('#empty-class');
        expect(
            helper(domElement).is('#empty-class')
        ).toBe(true);
    });

    it('adds element event listener', () => {
        let data = null;
        const addClickTrack = () => {
            helper(domElement).on('click', (e) => {
                data = {
                    target: e.target
                };
            });
        };
        addClickTrack();
        domElement.click();

        expect(data).toMatchObject({
            target: domElement
        });
    });

    it('removes element event listener', () => {
        let data = null;
        const eventHandler = (e) => {
            data = {
                target: e.target
            };
        };

        helper(domElement).on('click', eventHandler);
        helper(domElement).off('click', eventHandler);

        domElement.click();

        expect(data).toBe(null);
    });
});