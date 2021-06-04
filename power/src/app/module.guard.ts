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
     * @param next ActivatedRouteSnapshot
     * @param state RouterStateSnapshot
     * @returns Promise of boolean
     */
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // check if module is enabled
        for (const module of environment.config.modules) {
            if (state.url.startsWith('/' + module)) {
                return true;
            }
        }

        // disabled
        /* istanbul ignore else */
        if (!environment.production) {
            console.error('Module is disabled');
        }
        this.router.navigate(['/notfound'], { replaceUrl: true });
        return false;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
