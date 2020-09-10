import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConditionsComponent } from './conditions.component';
import { StorageService } from '../storage.service';

describe('Fragebogen.Editor.Conditions.ConditionsComponent', () => {
    let component: ConditionsComponent;
    let fixture: ComponentFixture<ConditionsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [StorageService],
            declarations: [ConditionsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ConditionsComponent);
        component = fixture.componentInstance;
        component.model = { pages: [] };
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
