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
            'presets': ['bar'],
            'items': ['foobar'],
            'shortNames': { 'foo': 'bar' },
            'selections': ['barfoo']
        };

        const res = component.loadConfig(conf);

        expect(res).toEqual(true);
        expect(component.layoutRtl).toEqual(true);
        expect(component.agnbUrl).toEqual('foo.bar');
        expect(component.data.presets).toEqual(['bar']);
        expect(component.data.allItems).toEqual(['foobar']);
        expect(component.data.shortNames).toEqual({ 'foo': 'bar' });
        expect(component.data.selections).toEqual(['barfoo']);
    });

    it('parseGemeinden works', function () {
        const gem = '\r\n1234567;4411;bla\r\n';

        const res = component.parseGemeinden(gem);

        expect(res).toEqual(true);
        expect(component.data.gemeinden).toEqual([{'name': '4411', 'ags': '1234567', 'woma_id': 'bla' }]);
    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
