import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertListeComponent } from './bodenrichtwert-liste.component';
import { BodenrichtwertService } from '../bodenrichtwert.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

describe('Bodenrichtwert.BodenrichtwertListe.BodenrichtwertListeComponent', () => {
    let component: BodenrichtwertListeComponent;
    let fixture: ComponentFixture<BodenrichtwertListeComponent>;
    let httpTestingController: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BodenrichtwertListeComponent
            ],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                NgbPaginationModule,
                FormsModule
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
