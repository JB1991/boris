import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import * as ImmobilienFormatter from './immobilien.formatter';
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';

describe('Immobilien.Immobilien.ImmobilienFormatter', () => {

    let component: ImmobilienFormatter.ImmobilienFormatter;

    beforeEach(() => {

        const niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = {
            'regionen': {
                'foo': {
                    'name': 'bar'
                }
            }
        };

        const niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);
        niRuntime.state = {
            'rangeEndIndex': 10
        };



        component = new ImmobilienFormatter.ImmobilienFormatter(niStatic, niRuntime);
    });


    it('mapTooltipFormatter should return params.name', function() {
        const ths = { myRegionen: {} };
        const res = component.mapTooltipFormatter({'name': 'test'});
        expect(res).toEqual('test');
    });

    it('mapTooltipFormatter should return myregionname', function() {
        const res = component.mapTooltipFormatter({'name': 'foo'});
        expect(res).toEqual('bar');

    });

    it('formatLabel should return empty string if not rangeEnd', function() {
        const res = component.formatLabel({'params': {'dataIndex': 1}});
        expect(res).toEqual('');
    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
