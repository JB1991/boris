import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { ConfigService } from '@app/config.service';
import { AlertsService } from '../alerts/alerts.service';

/**
 * AuthService handles authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;

  constructor(public router: Router,
              public httpClient: HttpClient,
              public conf: ConfigService,
              public alerts: AlertsService) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Returns user object
   */
  public getUser(): User {
    return this.user;
  }

  /**
   * Returns auth header
   */
  public getBearer(): string {
    // check token
    if (!this.user) {
      return null;
    }
    return 'Bearer ' + this.user.token.access_token;
  }

  /**
   * Performs login and requests token
   * @param username Username
   * @param password Password
   * @param redirecturl URL to redirect if successful
   */
  public login(username: string, password: string, redirecturl = '/') {
    // check data
    if (!username) {
      throw new Error('username is required');
    }
    if (!password) {
      throw new Error('password is required');
    }
    if (!redirecturl) {
      redirecturl = '/';
    }

    // craft post object
    let body = new HttpParams();
    body = body.set('grant_type', 'password');
    body = body.set('client_id', environment.auth.clientid);
    body = body.set('client_secret', environment.auth.clientsecret);
    body = body.set('username', username);
    body = body.set('password', password);
    body = body.set('scope', 'openid');
    body = body.set('response_type', 'id_token');

    // post login data
    this.httpClient.post(environment.auth.apiurl, body).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data && data['error'] ? data['error'] : 'Unknown');
        this.alerts.NewAlert('danger', 'Login fehlgeschlagen', alertText);
        console.log('Could not login: ' + alertText);
        return;
      }

      // save data
      this.user = {'username': username, 'token': data};
      localStorage.setItem('user', JSON.stringify(this.user));

      // redirect
      this.router.navigate([redirecturl], { replaceUrl: true });
    }, (error: Error) => {
      // failed to login
      const alertText = (error['error'] && error['error']['error_description'] ? error['error']['error_description']
                        : error['statusText']);
      this.alerts.NewAlert('danger', 'Login fehlgeschlagen', alertText);
      console.log(error);
      return;
    });
  }

  /**
   * Performs logout and deletes user session
   */
  public logout() {
    localStorage.removeItem('user');
    this.user = null;
  }

  /**
   * IsAuthEnabled returns true if auth module is enabled
   */
  public IsAuthEnabled() {
    if (!environment.production || !(this.conf.config && this.conf.config['authentication'])) {
      return false;
    }
    return true;
  }
}

/**
 * Represents userdata
 */
export class User {
  username: string;
  token: any;
}
