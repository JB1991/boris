import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BodenrichtwertService } from '@app/bodenrichtwert/bodenrichtwert.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TestScheduler } from 'rxjs/testing';

import { BodenrichwertnummerSearchComponent } from './bodenrichwertnummer-search.component';

describe('BodenrichwertnummerSearchComponent', () => {
    let component: BodenrichwertnummerSearchComponent;
    let fixture: ComponentFixture<BodenrichwertnummerSearchComponent>;

    let httpController: HttpTestingController;
    let testScheduler: TestScheduler;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichwertnummerSearchComponent,
                ModalComponent
            ],
            providers: [
                AlertsService,
                BodenrichtwertService
            ],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                NgbTypeaheadModule
            ]
        }).compileComponents();

        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichwertnummerSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
