import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowdownModule } from 'ngx-showdown';
import { FormsModule } from '@angular/forms';
import { environment } from '@env/environment';

import { PreviewComponent } from './preview.component';
import { WrapperComponent } from '../wrapper.component';
import { SharedModule } from '@app/shared/shared.module';

describe('Fragebogen.Surveyjs.Preview.PreviewComponent', () => {
    let component: PreviewComponent;
    let fixture: ComponentFixture<PreviewComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                SharedModule,
                ShowdownModule,
                FormsModule
            ],
            declarations: [
                PreviewComponent,
                WrapperComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PreviewComponent);
        component = fixture.componentInstance;
        component.form = { locale: 'de' };

        spyOn(console, 'error');
        fixture.detectChanges();
    }));

    it('should create', () => {
        spyOn(console, 'info');
        expect(component).toBeTruthy();
        environment.production = true;
        component.debugPrint('x');
        environment.production = false;
        component.debugPrint('x');
    });

    it('should open/close', () => {
        expect(component.modal?.isVisible()).toBeFalse();
        expect(component.mode).toEqual('display');

        component.open();
        expect(component.modal?.isVisible()).toBeTrue();
        expect(component.mode).toEqual('display');

        if (component.modal) {
            component.modal.close();
        }
        expect(component.modal?.isVisible()).toBeFalse();
        expect(component.data).toBeNull();

        component.open('edit', 5);
        expect(component.mode).toEqual('edit');
        expect(component.data).toEqual(5);
    });

    it('should set language', () => {
        component.open();
        fixture.detectChanges();
        component.language = 'en';
        component.setLanguage();

        expect(component.wrapper?.survey?.locale).toEqual('en');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
