import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoadingscreenService {
    public visible = false;

    constructor(public router: Router) {
        router.events.subscribe((event) => {
            // enable/disable loadingscreen with navigation
            if (event instanceof NavigationEnd) {
                this.visible = false;
            } else if (event instanceof NavigationStart) {
                this.visible = true;
            } else if (event instanceof NavigationCancel) {
                this.visible = false;
            }
        });
    }

    /**
     * Shows or hides loadingscreen
     * @param state new state
     */
    public setVisible(state: boolean) {
        this.visible = state;
    }

    /**
     * Returns loadingscreen state
     */
    public isVisible(): boolean {
        return this.visible;
    }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.visible = false;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
