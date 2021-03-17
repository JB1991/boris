import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '@env/environment';

/**
 * ModulGuard ensures that a disabled module cant be accessed
 */
@Injectable({
    providedIn: 'root'
})
export class ModuleGuard implements CanActivate {

    constructor(public router: Router) { }

    /**
     * Called before a protected route is loaded to check if module is enabled
     */
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // check if module is enabled
        for (const module of environment.config.modules) {
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
