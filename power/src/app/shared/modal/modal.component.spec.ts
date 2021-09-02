import { CommonModule } from '@angular/common';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('Shared.ModalComponent', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                ModalComponent
            ],
            imports: [
                CommonModule
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

    it('should close', () => {
        // esc key
        component.isOpen = true;
        spyOn(document, 'getElementsByClassName').and.returnValue(document.getElementsByTagName('fergfegrehewg'));
        component.onKeydownHandler(new KeyboardEvent('a'));
        expect(component.isVisible()).toBeFalse();

        // ngOnDestroy
        component.isOpen = true;
        component.ngOnDestroy();
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
        spyOn(document, 'getElementsByClassName').and.returnValue(document.getElementsByTagName('fergfegrehewg'));
        component.onKeydownHandler({} as any);
        expect(component.isVisible()).toBeFalse();
    });
});
