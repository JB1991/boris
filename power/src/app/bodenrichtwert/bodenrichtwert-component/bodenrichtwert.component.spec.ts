import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertComponent } from './bodenrichtwert.component';
import { BodenrichtwertKarteComponent } from '../bodenrichtwert-karte/karte/bodenrichtwert-karte.component';
import { BodenrichtwertVerlaufComponent } from '../bodenrichtwert-verlauf/bodenrichtwert-verlauf.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@app/config.service';

describe('Bodenrichtwert.BodenrichtwertComponent.BodenrichtwertComponent', () => {
    let component: BodenrichtwertComponent;
    let fixture: ComponentFixture<BodenrichtwertComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertComponent,
                BodenrichtwertKarteComponent,
                BodenrichtwertVerlaufComponent
            ],
            providers: [
                ConfigService
            ],
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                RouterModule.forRoot([]),
                NgxMapboxGLModule,
                SharedModule,
                CollapseModule.forRoot(),
                AlertModule.forRoot()
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertComponent);
        component = fixture.componentInstance;
        component.configService.config = { 'modules': ['a', 'b'], 'authentication': false };
        fixture.detectChanges();

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
