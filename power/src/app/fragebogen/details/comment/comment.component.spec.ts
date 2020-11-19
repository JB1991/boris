import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommentComponent } from './comment.component';
import { SharedModule } from '@app/shared/shared.module';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { FormAPIService } from '@app/fragebogen/formapi.service';

describe('Fragebogen.Details.CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;

    const getTask = require('../../../../assets/fragebogen/get-task.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                RouterTestingModule.withRoutes([]),
                SharedModule
            ],
            providers: [
                AlertsService,
                FormAPIService
            ],
            declarations: [
                CommentComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CommentComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        // spyOn(component.alerts, 'NewAlert');
        fixture.detectChanges(); // onInit
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * OPEN AND CLOSE
     */
    it('should open and close', () => {
        component.open(getTask.task);
        expect(component.modal.isOpen).toBeTrue();
        component.modal.close();
    });

    afterEach(() => {

    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
