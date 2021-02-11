import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmbComponent } from './gmb.component';

describe('GmbComponent', () => {
    let component: GmbComponent;
    let fixture: ComponentFixture<GmbComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ GmbComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GmbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
