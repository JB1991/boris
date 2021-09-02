import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingscreenService implements OnDestroy {
    public visible = false;
    private _subscription: Subscription;

    constructor(public router: Router) {
        this._subscription = router.events.subscribe((event) => {
            // enable/disable loadingscreen with navigation
            if (event instanceof NavigationEnd) {
                this.visible = false;
                /* istanbul ignore else */
                if (typeof window.scrollTo === 'function') {
                    window.scrollTo(0, 0);
                }
            } else if (event instanceof NavigationStart) {
                this.visible = true;
            } else if (event instanceof NavigationCancel) {
                this.visible = false;
            }
        });
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    /**
     * Shows or hides loadingscreen
     * @param state new state
     */
    public setVisible(state: boolean): void {
        this.visible = state;
    }

    /**
     * Returns loadingscreen state
     * @returns True if visible
     */
    public isVisible(): boolean {
        return this.visible;
    }

    /**
     * Resets service to empty model
     */
    public resetService(): void {
        this.visible = false;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
