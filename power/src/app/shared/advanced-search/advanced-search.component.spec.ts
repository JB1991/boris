import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeatureCollection } from 'geojson';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalminiComponent } from '../modalmini/modalmini.component';
import { SharedModule } from '../shared.module';

import { AdvancedSearchComponent } from './advanced-search.component';

describe('AdvancedSearchComponent', () => {
    const brwSearch: FeatureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-nummer-search.json');

    let component: AdvancedSearchComponent;
    let fixture: ComponentFixture<AdvancedSearchComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdvancedSearchComponent,
                ModalminiComponent
            ],
            imports: [
                SharedModule,
                TabsModule,
                HttpClientTestingModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdvancedSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit fts onBodenrichtwertChange', () => {
        spyOn(component.bodenrichtwertChange, 'emit').and.callThrough();
        component.onBodenrichtwertChange(brwSearch);
        expect(component.bodenrichtwertChange.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit fts onFlurstueckChange', () => {
        spyOn(component.flurstueckChange, 'emit').and.callThrough();
        component.onFlurstueckChange(brwSearch);
        expect(component.flurstueckChange.emit).toHaveBeenCalledTimes(1);
    });

    /*
    it('closing should close the modal', () => {
        spyOn(component.modal, 'close');
        component.closing();
        expect(component.modal.close).toHaveBeenCalledTimes(1);
    });

    it('onClose should reset flurstueckForm and bodenrichtwertForm', () => {
        spyOn(component.flurstueckForm, 'reset');
        spyOn(component.bodenrichtwertForm, 'reset');
        component.onClose();
        expect(component.bodenrichtwertForm.reset).toHaveBeenCalledTimes(1);
        expect(component.flurstueckForm.reset).toHaveBeenCalledTimes(1);
    });
    */
});
