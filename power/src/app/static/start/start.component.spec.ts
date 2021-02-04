import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { StartComponent } from './start.component';
import { ConfigService } from '@app/config.service';
import { SharedModule } from '@app/shared/shared.module';

describe('Static.Start.StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [StartComponent],
            imports: [
                RouterTestingModule.withRoutes([]),
                FormsModule,
                SharedModule,
                CarouselModule.forRoot()
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
        spyOn(component.alerts, 'NewAlert');
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
        component.submitPIN('');
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
