import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlurstueckSearchComponent } from './flurstueck-search.component';

describe('FlurstueckSearchComponent', () => {
    let component: FlurstueckSearchComponent;
    let fixture: ComponentFixture<FlurstueckSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlurstueckSearchComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FlurstueckSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
