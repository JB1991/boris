import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartComponent } from './start.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '@app/config.service';

describe('Static.Start.StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [StartComponent],
            imports: [
                RouterTestingModule.withRoutes([]),
                FormsModule,
                SharedModule
            ],
            providers: [
                ConfigService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should redirect', () => {
        component.submitPIN('123');
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
        expect(component.router.navigate).toHaveBeenCalledWith(['/forms', 'fillout', encodeURIComponent('123')],
            { replaceUrl: true });
    });

    it('should not redirect', () => {
        expect(function () {
            component.submitPIN('');
        }).toThrowError('pin is required');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
