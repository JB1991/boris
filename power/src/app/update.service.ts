import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {

    constructor(public updates: SwUpdate) {
        // check for update
        if (updates.isEnabled) {
            this.updates.checkForUpdate();
        }
    }

    /**
     * Checks for update and reloads
     */
    public checkForUpdates() {
        if (this.updates.isEnabled) {
            // subscribe to updates
            this.updates.available.subscribe(event => {
                // do update
                this.updates.activateUpdate().then(() => {
                    // this.cleanupServiceWorker();
                    window.location.reload();
                });
            });
        }
    }

    /**
     * Deletes cache and unregisters service worker
     */
    public cleanupServiceWorker() {
        // delete cache
        if ('caches' in window) {
            caches.keys().then(keyList => Promise.all(keyList.map(key => caches.delete(key))));
        }

        // unregister service worker
        if (window.navigator && navigator.serviceWorker) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (const registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
