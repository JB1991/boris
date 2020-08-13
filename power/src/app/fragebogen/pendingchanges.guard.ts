import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

/**
 * PendingChanges can prevent the browser to leave the page if there are any unsaved changes
 */
@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
    /**
     * Asks user to confirm leaving the page if component.canDeactivate() returns false
     * @param component
     */
    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        return component.canDeactivate() ?
        true :
        confirm($localize`ACHTUNG: Sie haben ungespeicherte Änderungen. Drücken Sie auf abbrechen um die Änderungen zu behalten.`);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
