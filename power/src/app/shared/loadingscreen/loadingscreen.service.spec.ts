import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, NavigationStart, GuardsCheckEnd, NavigationCancel } from '@angular/router';
import { Observable } from 'rxjs';

import { LoadingscreenService } from './loadingscreen.service';

describe('Shared.Loadingscreen.LoadingscreenService', () => {
    let service: LoadingscreenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                {
                    provide: Router,
                    useClass: MockRouter
                }
            ]
        });
        service = TestBed.inject(LoadingscreenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.isVisible()).toBeFalse();
        service.ngOnDestroy();
    });

    it('should change visibility', () => {
        service.setVisible(true);
        expect(service.isVisible()).toBeTrue();
        service.setVisible(false);
        expect(service.isVisible()).toBeFalse();
    });

    it('should reset service', () => {
        service.setVisible(true);

        // reset service
        service.resetService();
        expect(service.isVisible()).toBeFalse();
    });
});

class MockRouter {
    public ns = new NavigationStart(0, 'http://localhost:4200/login');
    public gc = new GuardsCheckEnd(1, 'http://localhost:4200/login', 'http://localhost:4200/login', null, true);
    public ne = new NavigationEnd(2, 'http://localhost:4200/login', 'http://localhost:4200/login');
    public nc = new NavigationCancel(1, 'http://localhost:4200/login', 'Guard');
    public events = new Observable(observer => {
        observer.next(this.ns);
        observer.next(this.gc);
        observer.next(this.nc);
        observer.next(this.ne);
        observer.complete();
    });
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
