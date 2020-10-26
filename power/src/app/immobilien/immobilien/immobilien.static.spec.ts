import * as ImmobilienStatic from './immobilien.static';

describe('Immobilien.Immobilien.ImmobilienStatic', () => {

    let component: ImmobilienStatic.NipixStatic;

    beforeEach(() => {
        component = new ImmobilienStatic.NipixStatic();
    });

    it('loadConfig works', function () {
        const conf = {
            'layoutRtl': true,
            'agnbUrl': 'foo.bar',
            'map': {
                'geoCoordMap': ['foofoo']
            },
            'regionen': ['foo'],
            'presets': ['bar'],
            'items': ['foobar'],
            'shortNames': { 'foo': 'bar' },
            'selections': ['barfoo']
        };

        const res = component.loadConfig(conf);

        expect(res).toEqual(true);
        expect(component.layoutRtl).toEqual(true);
        expect(component.agnbUrl).toEqual('foo.bar');
        // expect(component.data.geoCoordMap).toEqual(['foofoo']);
        expect(component.data.regionen).toEqual(['foo']);
        expect(component.data.presets).toEqual(['bar']);
        expect(component.data.allItems).toEqual(['foobar']);
        expect(component.data.shortNames).toEqual({ 'foo': 'bar' });
        expect(component.data.selections).toEqual(['barfoo']);
    });

    it('parseGemeinden works', function () {
        const gem = '\r\n1234567;4411;bla\r\n';

        const res = component.parseGemeinden(gem);

        expect(res).toEqual(true);
        expect(component.data.gemeinden).toEqual({ '4411': 'bla' });
    });


    it('parseNipix works', function () {
        const npx = '\r\ngebrauchte Eigenheime;4101;2000_2;1037;111,640' +
            '\r\ngebrauchte Eigenheime;4101_bla;2000_3;1000;120,640' +
            '\r\n';

        const res = component.parseNipix(npx);

        expect(res).toEqual(true);
        expect(component.data.nipix).toEqual({
            'gebrauchte Eigenheime': {
                '4101': {
                    '2000_2': {
                        'index': '111,640',
                        'faelle': 1037
                    },
                    '2000_3': {
                        'index': '120,640',
                        'faelle': 1000
                    }
                }
            }
        });
    });


});

/* vim: set expandtab ts=4 sw=4 sts=4: */
