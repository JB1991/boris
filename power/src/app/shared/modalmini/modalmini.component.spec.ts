import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalminiComponent } from './modalmini.component';

describe('Shared.ModalminiComponent', () => {
    let component: ModalminiComponent;
    let fixture: ComponentFixture<ModalminiComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot()
            ],
            declarations: [
                ModalminiComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalminiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

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
    });

    it('should do nothing', () => {
        // close
        component.close();
        expect(component.isVisible()).toBeFalse();

        // ngOnDestroy
        component.ngOnDestroy();
        expect(component.isVisible()).toBeFalse();
    });
});
