import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SettingsComponent } from './settings.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                CommonModule,
                FormsModule,
                SharedModule
            ],
            providers: [
                AlertsService,
                FormAPIService
            ],
            declarations: [
                SettingsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;

        spyOn(console, 'error');
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * OPEN AND CLOSE
     */
    it('should open and close', () => {
        component.open({
            id: '123',
        });
        expect(component.modal?.isOpen).toBeTrue();
        component.modal?.close();
        expect(component.modal?.isOpen).toBeFalse();
    });

    it('should open with data', () => {
        component.open({
            id: '123',
            tags: ['a'],
            groups: ['b'],
            owner: { id: '1', name: 'Klaus' }
        });
        expect(component.modal?.isOpen).toBeTrue();
        expect(component.tags).toEqual(['a']);
        expect(component.groups).toEqual(['b']);
        expect(component.owner).toEqual('1');
        component.modal?.close();
    });

});
