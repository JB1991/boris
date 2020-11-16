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

    it('should open and close the modal', () => {
        expect(component.modal.isVisible()).toBeFalse();
        component.open();
        expect(component.modal.isVisible()).toBeTrue();
        component.close();
        expect(component.modal.isVisible()).toBeFalse();
    });
});
