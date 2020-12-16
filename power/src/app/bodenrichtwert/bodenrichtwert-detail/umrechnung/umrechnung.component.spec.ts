import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { UmrechnungsTable, UmrechnungComponent } from './umrechnung.component';
import { HyphenatePipe } from '@app/shared/pipes/hyphenate.pipe';

describe('Bodenrichtwert.BodenrichtwertDetail.Umrechnung.UmrechnungComponent', () => {
    let component: UmrechnungComponent;
    let fixture: ComponentFixture<UmrechnungComponent>;

    const tableWgfz: UmrechnungsTable = require('../../../../assets/boden/bodenrichtwert-samples/umrechnung-table-wgfz.json');
    const tableArtBebauung: UmrechnungsTable = require('../../../../assets/boden/bodenrichtwert-samples/umrechnung-table-artbebauung.json');
    const tableFlae: UmrechnungsTable = require('../../../../assets/boden/bodenrichtwert-samples/umrechnung-table-flae.json');
    const tableFail: UmrechnungsTable = require('../../../../assets/boden/bodenrichtwert-samples/umrechnung-table-fail.json');

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
        component.table = tableFlae;
        component.actualValue = '200';
        fixture.detectChanges();
    });

    afterEach(() => {
        component.actualKoef = undefined;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('sortBezugswerte should sort the array', () => {
        const array = [{ bzwt: 200, koef: 1.2 }, { bzwt: 100, koef: 1.1 }, { bzwt: 300, koef: 1.3 }];
        const sorted = [{ bzwt: 100, koef: 1.1 }, { bzwt: 200, koef: 1.2 }, { bzwt: 300, koef: 1.3 }];
        const result = component.sortBezugswerte(array);
        expect(result).toEqual(sorted);
    });

    it('ngOninit should initialize the component', () => {
        // FLAE
        expect(component.actualKoef).toEqual({ 'bzwt': 200, 'koef': 123.0 });
        expect(component.objectId).toEqual('0015UW0002');
        expect(component.einflussgroesse).toEqual('Fläche in m²');

        // FLAE interpolate
        component.table = tableFlae;
        component.actualValue = '250';
        component.ngOnInit();
        expect(component.actualKoef).toEqual({ 'bzwt': 250, 'koef': 120.5 });
        expect(component.objectId).toEqual('0015UW0002');
        expect(component.einflussgroesse).toEqual('Fläche in m²');

        // FLAE interpolate
        component.table = tableFlae;
        component.actualValue = '2800';
        component.ngOnInit();
        expect(component.actualKoef).toEqual({ 'bzwt': 2800, 'koef': 56.5 });
        expect(component.objectId).toEqual('0015UW0002');
        expect(component.einflussgroesse).toEqual('Fläche in m²');

        // WGFZ
        component.table = tableWgfz;
        component.actualValue = '2.2';
        component.ngOnInit();
        expect(component.actualKoef).toEqual({ 'bzwt': 2.2, 'koef': 1.04 });
        expect(component.objectId).toEqual('4313UW0007');
        expect(component.einflussgroesse).toEqual('Wertrelevante Geschossflächenzahl');

        // Art der Bebauung
        component.table = tableArtBebauung;
        component.actualValue = 'MFH';
        component.ngOnInit();
        expect(component.actualKoef).toEqual({ 'bzwt': 2, 'koef': 1.35 });
        expect(component.objectId).toEqual('4920UW0099');
        expect(component.einflussgroesse).toEqual('Art der Bebauung');
        component.table = tableArtBebauung;
        component.actualValue = 'EFH';
        component.ngOnInit();
        expect(component.actualKoef).toEqual({ 'bzwt': 1, 'koef': 1 });
    });

    it('ngOninit should not intialize actualKoef', () => {
        // FLAE
        expect(component.actualKoef).toEqual({ 'bzwt': 200, 'koef': 123.0 });
        expect(component.objectId).toEqual('0015UW0002');
        expect(component.einflussgroesse).toEqual('Fläche in m²');

        // Art der Bebauung
        component.table = tableArtBebauung;
        component.actualValue = 'GH';
        component.ngOnInit();
        expect(component.actualKoef).toEqual(undefined);

        // Fail
        component.table = tableFail;
        component.actualValue = 'GH';
        component.ngOnInit();
        expect(component.actualKoef).toEqual(undefined);
    });

    it('should open and close the modal', () => {
        expect(component.modal.isVisible()).toBeFalse();
        component.open();
        expect(component.modal.isVisible()).toBeTrue();
        component.close();
        expect(component.modal.isVisible()).toBeFalse();
    });
});
