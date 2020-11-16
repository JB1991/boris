import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmrechnungComponent } from './umrechnung.component';
import { HyphenatePipe } from '@app/shared/pipes/hyphenate.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.Umrechnung.UmrechnungComponent', () => {
    let component: UmrechnungComponent;
    let fixture: ComponentFixture<UmrechnungComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                UmrechnungComponent,
                HyphenatePipe
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UmrechnungComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
