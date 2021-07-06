import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueComponent } from './value.component';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';

describe('Fragebogen.Editor.ValueComponent', () => {
    let component: ValueComponent;
    let fixture: ComponentFixture<ValueComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                SurveyjsModule
            ],
            declarations: [
                ValueComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ValueComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        fixture.detectChanges();
    }));

    it('should create', () => {
        component.question = {
            title: {},
            description: {},
            name: 'e1',
            type: 'text',
            valueName: '',
            inputType: 'text',
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        };
        component.value = '';
        spyOn(component.valueChange, 'emit');
        expect(component).toBeTruthy();

        // update value
        component.ngOnChanges();
        component.updateValue({ e1: 'Test' });
        expect(component.value).toEqual('Test');
        expect(component.valueChange.emit).toHaveBeenCalledWith('Test');

        // reset value
        component.resetValue();
        expect(component.value).toBeUndefined();
        expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });
});
