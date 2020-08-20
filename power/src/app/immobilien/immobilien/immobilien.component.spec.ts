import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImmobilienComponent } from './immobilien.component';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { Building, HouseFill, PlusCircle, DashCircle } from 'ngx-bootstrap-icons';

// Select some icons (use an object, not an array)
const icons = {
    Building,
    HouseFill,
    PlusCircle,
    DashCircle
};

describe('Immobilien.Immobilien.ImmobilienComponent', () => {
    let component: ImmobilienComponent;
    let fixture: ComponentFixture<ImmobilienComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxBootstrapIconsModule.pick(icons)
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImmobilienComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
