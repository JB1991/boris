import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ConfigService } from '@app/config.service';
import { environment } from '@env/environment';

import { AuthService } from './auth.service';

/**
 * AuthGuard ensures that a route requires authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router,
              public conf: ConfigService,
              public auth: AuthService) {
  }

  /**
   * Called before a protected route is loaded to check if user is authenticated
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // allow access if auth module is not enabled
    if (!this.auth.IsAuthEnabled()) {
      return true;
    }

    // check authentication
    if (this.auth.getUser()) {
      return true;
    }

    // unauthenticated
    this.router.navigate(['/login'], { replaceUrl: true });
    console.log('User is unauthenticated');
    return false;
  }
}
