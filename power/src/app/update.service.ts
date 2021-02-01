import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {

    constructor(public updates: SwUpdate) {
        if (updates.isEnabled) {
            this.updates.checkForUpdate();
        }
    }

    public checkForUpdates(): void {
        this.updates.available.subscribe(event => {
            this.updates.activateUpdate().then(() => document.location.reload());
        });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
