import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {
    convertRemToPixels,
    rgbToHex,
    appendLeadingZeroes,
    getDate,
    convertColor,
    modifyColor
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


});

/* vim: set expandtab ts=4 sw=4 sts=4: */
