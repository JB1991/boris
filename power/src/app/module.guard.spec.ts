import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModuleGuard } from './module.guard';

describe('Shared.Auth.AuthGuard', () => {
    let guard: ModuleGuard;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: MockStartComponent }
                ])
            ]
        });
        guard = TestBed.inject(ModuleGuard);
        spyOn(console, 'log');
        spyOn(guard.router, 'navigate');
    }));

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});

@Component({
    selector: 'power-start',
    template: ''
})
class MockStartComponent {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
