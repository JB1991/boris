import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenschutzComponent } from './datenschutz.component';

describe('Static.Datenschutz.DatenschutzComponent', () => {
    let component: DatenschutzComponent;
    let fixture: ComponentFixture<DatenschutzComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DatenschutzComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DatenschutzComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
