import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModalComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle', () => {
        component.focusedElement = document.createElement('div');
        component.div.nativeElement.appendChild(document.createElement('div'));
        component.div.nativeElement.appendChild(document.createElement('div'));

        expect(component.isVisible()).toBeFalse();
        component.toggle();
        expect(component.isVisible()).toBeTrue();
        component.toggle();
        expect(component.isVisible()).toBeFalse();
    });

    it('should close', () => {
        // ngOnDestroy
        component.isOpen = true;
        component.ngOnDestroy();
        expect(component.isVisible()).toBeFalse();

        // esc key
        component.isOpen = true;
        component.onKeydownHandler(null);
        expect(component.isVisible()).toBeFalse();
    });

    it('should do nothing', () => {
        // close
        component.close();
        expect(component.isVisible()).toBeFalse();

        // ngOnDestroy
        component.ngOnDestroy();
        expect(component.isVisible()).toBeFalse();

        // esc key
        component.onKeydownHandler(null);
        expect(component.isVisible()).toBeFalse();
    });
});
