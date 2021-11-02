import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HideDropdownMenuDirective } from './hide-dropdown-menu.directive';

describe('HideDropdownMenuDirective', () => {
    let component: TestHideDropdownComponent;
    let fixture: ComponentFixture<TestHideDropdownComponent>;
    let input: DebugElement;

    beforeEach(() => {
        void TestBed.configureTestingModule({
            declarations: [
                HideDropdownMenuDirective,
                TestHideDropdownComponent
            ],
            imports: [
                NgbModule
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TestHideDropdownComponent);
        component = fixture.componentInstance;
        input = fixture.debugElement.query(By.directive(HideDropdownMenuDirective));
        fixture.detectChanges();

    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should hide on window:resize', () => {
        expect(input.nativeElement).toHaveClass('collapse');
        expect(input.nativeElement).toHaveClass('show');
        window.dispatchEvent(new Event('resize'));
        expect(input.nativeElement.classList.contains('collapse')).toBeFalse();
        expect(input.nativeElement.classList.contains('show')).toBeFalse();
    });

    it('should hide on click', () => {
        const clickedEl = fixture.debugElement.nativeElement.querySelector('#clickedEl');
        expect(input.nativeElement).toHaveClass('collapse');
        expect(input.nativeElement).toHaveClass('show');
        clickedEl.click();
        expect(input.nativeElement.classList.contains('collapse')).toBeFalse();
        expect(input.nativeElement.classList.contains('show')).toBeFalse();
    });
});

@Component({
    template: `
    <button #functionsToggler>Toggler</button>
    <div
        hoverfocus
        powerHideDropdownMenu
        #functionsCollapseRef="ngbCollapse"
        [(ngbCollapse)]="furtherFunCollapsed"
        [ngbCollapseRef]="functionsCollapseRef"
        [dropdownToggler]="functionsToggler">
    </div>
    <button id="clickedEl">clickedEl</button>`
})
class TestHideDropdownComponent {
}
