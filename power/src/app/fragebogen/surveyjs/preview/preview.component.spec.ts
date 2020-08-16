import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowdownModule } from 'ngx-showdown';
import { environment } from '@env/environment';

import { PreviewComponent } from './preview.component';
import { WrapperComponent } from '../wrapper.component';
import { SharedModule } from '@app/shared/shared.module';

describe('Fragebogen.Surveyjs.Preview.PreviewComponent', () => {
    let component: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                ShowdownModule
            ],
            declarations: [
                PreviewComponent,
                WrapperComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(console, 'log');
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        environment.production = true;
        component.debugPrint('x');
        environment.production = false;
        component.debugPrint('x');
    });

    it('should crash', () => {
        expect(function () {
            component.open('ediet');
        }).toThrowError('mode is invalid');
    });

    it('should open/close', () => {
        expect(component.modal.isVisible()).toBeFalse();
        expect(component.mode).toEqual('edit');

        component.open();
        expect(component.modal.isVisible()).toBeTrue();
        expect(component.mode).toEqual('edit');

        component.modal.close();
        expect(component.modal.isVisible()).toBeFalse();
        expect(component.data).toBeNull();

        component.open('display', 5);
        expect(component.mode).toEqual('display');
        expect(component.data).toEqual(5);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
