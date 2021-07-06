import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowdownModule } from 'ngx-showdown';

import { WrapperComponent } from './wrapper.component';
import { Bootstrap4_CSS } from './style';

describe('Fragebogen.Surveyjs.WrapperComponent', () => {
    let component: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ShowdownModule
            ],
            declarations: [
                WrapperComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(WrapperComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should do surveyjs', () => {
        component.model = { 'title': 'Hallo Welt', 'data': 5 };
        component.mode = 'edit';
        component.theme = 'bootstrap';
        component.css = Bootstrap4_CSS;
        component.showInvisible = true;
        spyOn(component.changes, 'emit');
        spyOn(component.interimResult, 'emit');
        spyOn(component.submitResult, 'emit');

        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.model).toEqual({ 'title': 'Hallo Welt', 'data': 5 });
        expect(component.css).toEqual(Bootstrap4_CSS);
        expect(component.showInvisible).toBeTrue();
        expect(component.submitResult).toBeTruthy();

        expect(component.props['data']).toEqual(5);
        expect(component.props['model']['mode']).toEqual('edit');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
