import { ImmobilienHelper } from './immobilien.helper';

describe('Immobilien.Immobilien.ImmobilienHelper', () => {

    it('ImmobilienHelper.rgbToHex should convert', () => {
        const res = ImmobilienHelper.rgbToHex(255, 255, 0);
        expect(res).toEqual('#ffff00');
    });

    it('ImmobilienHelper.appendLeadingZeroes should append <= 9', () => {
        const res = ImmobilienHelper.appendLeadingZeroes(2);
        expect(res).toEqual('02');
    });

    it('ImmobilienHelper.appendLeadingZeroes should not append > 9', () => {
        const res = ImmobilienHelper.appendLeadingZeroes(10);
        expect(res).toEqual('10');
    });

    it('ImmobilienHelper.getDate returns Year', () => {
        const res = ImmobilienHelper.getDate();
        expect(res).toEqual(new Date().getFullYear());
    });

    it('ImmobilienHelper.convertRemToPixels works correct', () => {
        spyOn(window, 'getComputedStyle').and.callFake(
            (elt: Element, pseudoElt?: string | null | undefined): CSSStyleDeclaration => {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = ImmobilienHelper.convertRemToPixels(1);
        expect(res).toEqual(1);
    });

    it('ImmobilienHelper.convertColor undefined returns #000000', () => {
        const res = ImmobilienHelper.convertColor(undefined as any);
        expect(res).toEqual('#000000');
    });


    it('ImmobilienHelper.convertColor null returns #000000', () => {
        const res = ImmobilienHelper.convertColor(null as any);
        expect(res).toEqual('#000000');
    });

    it('ImmobilienHelper.convertColor incompatible returns #000000', () => {
        const res = ImmobilienHelper.convertColor('foo');
        expect(res).toEqual('#000000');
    });


    it('ImmobilienHelper.convertColor rgb(r,g,b) works', () => {
        const res = ImmobilienHelper.convertColor('rgb(255,255,0)');
        expect(res).toEqual('#ffff00');
    });


    it('ImmobilienHelper.convertColor Array[r,g,b] works', () => {
        const res = ImmobilienHelper.convertColor([255, 255, 0]);
        expect(res).toEqual('#ffff00');
    });

    it('ImmobilienHelper.convertColor #123456 pass through', () => {
        const res = ImmobilienHelper.convertColor('#123456');
        expect(res).toEqual('#123456');
    });

    it('ImmobilienHelper.modifyColor +% works', () => {
        const res = ImmobilienHelper.modifyColor('#ff0096', 0.2);
        expect(res).toEqual('#ff33ab');
    });

    it('ImmobilienHelper.modifyColor -% works', () => {
        const res = ImmobilienHelper.modifyColor('#ff0096', -0.2);
        expect(res).toEqual('#cc0078');
    });

    it('ImmobilienHelper.resolve works', () => {
        const res = ImmobilienHelper.resolve('path.to', { 'path': { 'to': 'value' } }, '.');
        expect(res).toEqual('value');
    });

    /*
    it('ImmobilienHelper.downloadFile works', function () {
        let clicked = false;
        const anchor = Object.create(HTMLElement.prototype);
        anchor.click = function () { clicked = true; };

        const fun = function (elem: string) {
            return this;
        };

        spyOn(document, 'createElement').and.callFake(fun.bind(anchor));

        ImmobilienHelper.downloadFile('foo', 'bar', '', true);

        expect(anchor.href).toEqual('foo');
        expect(anchor.download).toEqual('bar');
        expect(clicked).toEqual(true);

    });

    it('ImmobilienHelper.downloadFile with data works', function () {
        let clicked = false;
        const anchor = Object.create(HTMLElement.prototype);
        anchor.click = function () { clicked = true; };

        const fun = function (elem: string) {
            return this;
        };

        spyOn(document, 'createElement').and.callFake(fun.bind(anchor));

        ImmobilienHelper.downloadFile('foo', 'bar');

        expect(anchor.href.indexOf('blob') !== -1).toBe(true);
        expect(anchor.download).toEqual('bar');
        expect(clicked).toEqual(true);

    });
    */

    it('ImmobilienHelper.convertArrayToCSV works', () => {
        const data = [
            {
                'key': 'key',
                'value': 'value'
            }
        ];
        const ky = ['key', 'value'];
        const res = ImmobilienHelper.convertArrayToCSV(data, ky);
        expect(res).toEqual('"key";"value"');
    });

    it('ImmobilienHelper.convertArrayToCSV works with parameter', () => {
        const data = [
            {
                'key': 'key',
                'value': 1.2
            }
        ];
        const ky = ['key', 'value'];
        const res = ImmobilienHelper.convertArrayToCSV(data, ky, ':', '/');
        expect(res).toEqual('/key/:/1,2/');
    });

    it('ImmobilienHelper.getSingleFeature works', () => {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    }
                }
            ]
        };
        const res = ImmobilienHelper.getSingleFeature(data, 'foo');
        expect(res).toEqual({
            'properties': {
                'name': 'foo'
            }
        });
    });

    it('ImmobilienHelper.getSingleFeature not found works', () => {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    }
                }
            ]
        };
        const res = ImmobilienHelper.getSingleFeature(data, 'bar');
        expect(res).toEqual({});
    });


    it('ImmobilienHelper.getGeometryArray works', () => {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    },
                    'geometry': 'geometry'
                }
            ]
        };
        const res = ImmobilienHelper.getGeometryArray(data, 'foo');
        expect(res).toEqual({
            'type': 'GeometryCollection',
            'geometries': ['geometry']
        });
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
