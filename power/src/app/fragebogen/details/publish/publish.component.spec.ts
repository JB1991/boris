import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PublishComponent } from './publish.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.PublishComponent', () => {
    let component: PublishComponent;
    let fixture: ComponentFixture<PublishComponent>;

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
                PublishComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PublishComponent);
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
        component.open('123');
        expect(component.modal?.isOpen).toBeTrue();
        if (component.modal) {
            component.modal.close();
        }
        expect(component.modal?.isOpen).toBeFalse();
    });

    /**
     * PUBLISH
     */
    it('should publish', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        component.id = '123';
        spyOn(component.out, 'emit');
        component.Publish();
        expect(component.out.emit).toHaveBeenCalledTimes(1);
    });

    it('should not publish', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        component.id = '123';
        spyOn(component.out, 'emit');
        component.Publish();
        expect(component.out.emit).toHaveBeenCalledTimes(0);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
