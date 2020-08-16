import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { FormularSettingsComponent } from './formular-settings.component';
import { StorageService } from '../storage.service';
import { HistoryService } from '../history.service';
import { ConditionsComponent } from '../conditions/conditions.component';

import { SharedModule } from '@app/shared/shared.module';

describe('FormularSettingsComponent', () => {
    let component: FormularSettingsComponent;
    let fixture: ComponentFixture<FormularSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                AccordionModule.forRoot(),
                FormsModule,
                SharedModule
            ],
            providers: [
                StorageService,
                HistoryService
            ],
            declarations: [
                FormularSettingsComponent,
                ConditionsComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormularSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open modal', () => {
        component.open();
        expect(component.modal.isVisible()).toBeTrue();
        component.modal.close();
        expect(component.modal.isVisible()).toBeFalse();
    });

    it('should move pages', () => {
        component.storage.model = { pages: [0, 1, 2] };
        component.open();

        // move up
        component.moveUp(1);
        expect(component.storage.model.pages).toEqual([1, 0, 2]);

        // move down
        component.moveDown(1);
        expect(component.storage.model.pages).toEqual([1, 2, 0]);
        component.close();
    });

    it('should not move pages', () => {
        component.storage.model = { pages: [0, 1, 2] };

        // move up
        component.moveUp(0);
        expect(component.storage.model.pages).toEqual([0, 1, 2]);

        // move down
        component.moveDown(2);
        expect(component.storage.model.pages).toEqual([0, 1, 2]);

        // test out of bounds
        expect(() => {
            component.moveUp(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.moveUp(3);
        }).toThrowError('page is invalid');
        expect(() => {
            component.moveDown(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.moveDown(3);
        }).toThrowError('page is invalid');
    });
});
