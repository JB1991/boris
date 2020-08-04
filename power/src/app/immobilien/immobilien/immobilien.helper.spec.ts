import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {
    convertRemToPixels,
    rgbToHex,
    appendLeadingZeroes,
    getDate,
    convertColor,
    modifyColor,
    resolve,
    convertArrayToCSV,
    getSingleFeature,
    getGeometryArray
} from './immobilien.helper';


describe('Immobilien.Immobilien.ImmobilienHelper', () => {

    it('rgbToHex should convert', function() {
        const res = rgbToHex(255, 255, 0);
        expect(res).toEqual('#ffff00');
    });

    it('appendLeadingZeroes should append <= 9', function() {
        const res = appendLeadingZeroes(2);
        expect(res).toEqual('02');
    });

    it('appendLeadingZeroes should not append > 9', function() {
        const res = appendLeadingZeroes(10);
        expect(res).toEqual(10);
    });

    it('getDate returns Year', function() {
        const res = getDate();
        expect(res).toEqual(new Date().getFullYear());
    });

    it('convertRemToPixels works correct', function() {
        spyOn(window, 'getComputedStyle').and.callFake(
            function(elt: Element, pseudoElt?: string) {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = convertRemToPixels(1);
        expect(res).toEqual(1);
    });

    it('ConvertColor undefined returns #000000', function() {
        const res = convertColor(undefined);
        expect(res).toEqual('#000000');
    });


    it('ConvertColor null returns #000000', function() {
        const res = convertColor(null);
        expect(res).toEqual('#000000');
    });

    it('ConvertColor incompatible returns #000000', function() {
        const res = convertColor('foo');
        expect(res).toEqual('#000000');
    });


    it('ConvertColor rgb(r,g,b) works', function() {
        const res = convertColor('rgb(255,255,0)');
        expect(res).toEqual('#ffff00');
    });


    it('ConvertColor Array[r,g,b] works', function() {
        const res = convertColor([255, 255, 0]);
        expect(res).toEqual('#ffff00');
    });

    it('ConvertColor #123456 pass through', function() {
        const res = convertColor('#123456');
        expect(res).toEqual('#123456');
    });

    it('modifyColor +% works', function() {
        const res = modifyColor('#ff0096', 0.2);
        expect(res).toEqual('#ff33ab');
    });

    it('modifyColor -% works', function() {
        const res = modifyColor('#ff0096', -0.2);
        expect(res).toEqual('#cc0078');
    });

    it('resolve works', function() {
        const res = resolve('path.to', {'path': {'to': 'value'}}, '.');
        expect(res).toEqual('value');
    });

    it('convertArrayToCSV works', function() {
        const data = [
            {
                'key': 'key',
                'value': 'value'
            }
        ];
        const ky = ['key','value'];
        const res = convertArrayToCSV(data, ky);
        expect(res).toEqual('"key";"value"');
    });

    it('convertArrayToCSV works with parameter', function() {
        const data = [
            {
                'key': 'key',
                'value': 1.2
            }
        ];
        const ky = ['key','value'];
        const res = convertArrayToCSV(data, ky, ':', '/');
        expect(res).toEqual('/key/:/1,2/');
    });

    it('getSingleFeature works', function() {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    }
                }
            ]};
        const res = getSingleFeature(data, 'foo');
        expect(res).toEqual({
            'properties': {
                'name': 'foo'
            }
        });
    });

    it('getSingleFeature not found works', function() {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    }
                }
            ]};
        const res = getSingleFeature(data, 'bar');
        expect(res).toEqual({});
    });


    it('getGeometryArray works', function() {
        const data = {
            'features': [
                {
                    'properties': {
                        'name': 'foo'
                    },
                    'geometry': 'geometry'
                }
            ]};
        const res = getGeometryArray(data, 'foo');
        expect(res).toEqual({
            'type': 'GeometryCollection',
            'geometries': ['geometry']
        });
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
