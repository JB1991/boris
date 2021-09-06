/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { SwUpdate, UpdateActivatedEvent, UpdateAvailableEvent, UnrecoverableStateEvent } from '@angular/service-worker';
import { Observable, Subject } from 'rxjs';

import { UpdateService } from './update.service';

export class SwUpdateServerMock {
    public available: Observable<UpdateAvailableEvent> = new Subject();

    public activated: Observable<UpdateActivatedEvent> = new Subject();

    public unrecoverable: Observable<UnrecoverableStateEvent> = new Subject();

    public isEnabled = true;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public checkForUpdate(): void { }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public activateUpdate(): void { }
}

describe('UpdateService', () => {
    let service: UpdateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SwUpdate, useClass: SwUpdateServerMock }
            ]
        });

        spyOn(console, 'error');
        service = TestBed.inject(UpdateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        service.checkForUpdates();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
