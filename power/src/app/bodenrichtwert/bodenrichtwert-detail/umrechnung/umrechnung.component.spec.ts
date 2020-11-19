import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
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
            ],
            imports: [
                SharedModule
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

    it('sortBezugswerte should sort the array', () => {
        const array = [{bzwt: 200, koef: 1.2}, {bzwt: 100, koef: 1.1}, {bzwt: 300, koef: 1.3}];
        const sorted = [{bzwt: 100, koef: 1.1}, {bzwt: 200, koef: 1.2}, {bzwt: 300, koef: 1.3}];
        const result = component.sortBezugswerte(array);
        expect(result).toEqual(sorted);
    });

    it('should open and close the modal', () => {
        expect(component.modal.isVisible()).toBeFalse();
        component.open();
        expect(component.modal.isVisible()).toBeTrue();
        component.close();
        expect(component.modal.isVisible()).toBeFalse();
    });
});
