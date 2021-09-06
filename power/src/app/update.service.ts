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
            void this.updates.checkForUpdate();

            // handle an unrecoverable state
            /* istanbul ignore next */
            updates.unrecoverable.subscribe((event) => {
                console.error(event);
                this.cleanupServiceWorker(true);
                window.location.reload();
            });
        }
    }

    /**
     * Checks for update and reloads
     */
    public checkForUpdates(): void {
        /* istanbul ignore else */
        if (this.updates.isEnabled) {
            // subscribe to updates
            /* istanbul ignore next */
            this.updates.available.subscribe(() => {
                // do update
                void this.updates.activateUpdate().then(() => {
                    console.warn('Reloading to complete update');
                    this.cleanupServiceWorker(false);
                    window.location.reload();
                });
            });
        }
    }

    /* istanbul ignore next */
    /**
     * Deletes cache and unregisters service worker
     * @param del Unregister service worker
     */
    public cleanupServiceWorker(del: boolean): void {
        // delete cache
        if ('caches' in window) {
            console.warn('Deleting cache');
            void caches.keys().then(async (keyList: string[]) =>
                Promise.all(keyList.map(async (key: string) => caches.delete(key))));
        }

        // unregister service worker
        if (del && window.navigator && navigator.serviceWorker) {
            void navigator.serviceWorker.getRegistrations().then((registrations) => {
                console.warn('Deleting service workers');
                for (const registration of registrations) {
                    void registration.unregister();
                }
            });
        }
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
