import { CommonModule } from '@angular/common';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalminiComponent } from './modalmini.component';

describe('Shared.ModalminiComponent', () => {
    let component: ModalminiComponent;
    let fixture: ComponentFixture<ModalminiComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                CommonModule,
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
