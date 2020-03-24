import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { FormularService } from './formular.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private router: Router, private service: FormularService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.service.loadFormular(route.params.id).subscribe((data) => {
        if (data === null) {
          this.router.navigateByUrl('formular');
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
}

function IsJsonString(str): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
