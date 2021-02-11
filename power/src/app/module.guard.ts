import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ConfigService } from '@app/config.service';

/**
 * ModulGuard ensures that a disabled module cant be accessed
 */
@Injectable({
    providedIn: 'root'
})
export class ModuleGuard implements CanActivate {

    constructor(public router: Router, public config: ConfigService) { }

    /**
     * Called before a protected route is loaded to check if module is enabled
     */
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // check if module is enabled
        for (const module of this.config.config.modules) {
            if (state.url.startsWith('/' + module)) {
                return true;
            }
        }

        // disabled
        console.error('Module is disabled');
        this.router.navigate(['/'], { replaceUrl: true });
        return false;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
