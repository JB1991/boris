import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {

    constructor(public updates: SwUpdate) {
        // check for update
        /* istanbul ignore else */
        if (updates.isEnabled) {
            this.updates.checkForUpdate();

            // handle an unrecoverable state
            /* istanbul ignore next */
            updates.unrecoverable.subscribe(event => {
                console.error(event);
                // this.cleanupServiceWorker();
                window.location.reload();
            });
        }
    }

    /**
     * Checks for update and reloads
     */
    public checkForUpdates() {
        /* istanbul ignore else */
        if (this.updates.isEnabled) {
            // subscribe to updates
            /* istanbul ignore next */
            this.updates.available.subscribe(event => {
                // do update
                this.updates.activateUpdate().then(() => {
                    console.log('Reloading to complete update');
                    // this.cleanupServiceWorker();
                    window.location.reload();
                });
            });
        }
    }

    /**
     * Deletes cache and unregisters service worker
     */
    /* istanbul ignore next */
    public cleanupServiceWorker() {
        console.log('Deleting cache and service workers');

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
