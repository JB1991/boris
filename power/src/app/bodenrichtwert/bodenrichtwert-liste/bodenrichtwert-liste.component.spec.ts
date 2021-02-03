import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertListeComponent } from './bodenrichtwert-liste.component';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

describe('Bodenrichtwert.BodenrichtwertListe.BodenrichtwertListeComponent', () => {
    const changes = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-liste-changes.json');

    let component: BodenrichtwertListeComponent;
    let fixture: ComponentFixture<BodenrichtwertListeComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertListeComponent
            ],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                NgbPaginationModule
            ],
            providers: [
                BodenrichtwertService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertListeComponent);
        component = fixture.componentInstance;
        component.features = {features: [], type: 'FeatureCollection'};
        fixture.detectChanges();

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work', () => {
        component.ngOnChanges(changes);
        expect(component.features.features.length).toBe(0);
        expect(component.filteredFeatures.length).toBe(0);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
