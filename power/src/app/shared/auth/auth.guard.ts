import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * AuthGuard ensures that a route requires authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router,
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
    if (this.auth.IsAuthenticated()) {
      return true;
    }

    // unauthenticated
    console.log('User is unauthenticated');
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
