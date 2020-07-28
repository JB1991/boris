import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
    this.loadSession();
  }

  /**
   * Loads session from localStorage
   */
  public loadSession() {
    // parse localstorage
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user && this.user.expires) {
      this.user.expires = new Date(this.user.expires);
    }

    // check if session is valid
    if (this.user && this.user.expires && new Date() < this.user.expires) {
      return;
    }

    // session refresh
    if (this.user) {
      // craft post object
      let body = new HttpParams();
      body = body.set('grant_type', 'refresh_token');
      body = body.set('client_id', environment.auth.clientid);
      body = body.set('client_secret', environment.auth.clientsecret);
      body = body.set('refresh_token', this.user.token.refresh_token);
      body = body.set('scope', 'openid');
      body = body.set('response_type', 'id_token');

      // post login data
      this.httpClient.post(environment.auth.tokenurl, body).subscribe((data) => {
        // check for error
        if (!data || data['error']) {
          this.alerts.NewAlert('danger', 'Session abgelaufen', 'Sie waren zu lange inaktiv und wurden ausgeloggt.');
          console.log('Could not refresh: ' + data);
          this.logout();
          return;
        }

        // save data
        this.user.expires = new Date();
        this.user.expires.setSeconds(this.user.expires.getSeconds() + data['expires_in']);
        this.user.token = data;
        localStorage.setItem('user', JSON.stringify(this.user));
      }, (error: Error) => {
        // failed to refresh
        this.alerts.NewAlert('danger', 'Session abgelaufen', 'Sie waren zu lange inaktiv und wurden ausgeloggt.');
        console.log(error);
        this.logout();
        return;
      });
      return;
    }

    // session empty
    this.logout();
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
   * Returns http options
   * @param responsetype How to parse file
   * @param contenttype Content-Type of file expected
   */
  public getHeaders(responsetype = 'json', contenttype = 'application/json'): any {
    let header = new HttpHeaders().set('Content-Type', contenttype);
    // check if user is logged in
    if (this.getUser()) {
      header = header.set('Authorization', this.getBearer());
    }
    return {'headers': header, 'responseType': responsetype};
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
    this.httpClient.post(environment.auth.tokenurl, body).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data && data['error'] ? data['error'] : 'Unknown');
        this.alerts.NewAlert('danger', 'Login fehlgeschlagen', alertText);
        console.log('Could not login: ' + alertText);
        return;
      }

      // save data
      const expire = new Date();
      expire.setSeconds(expire.getSeconds() + data['expires_in']);
      this.user = {'username': username, 'expires': expire, 'token': data};
      localStorage.setItem('user', JSON.stringify(this.user));

      /*
      // TODO: Remove code snippet
      let body2 = new HttpParams();
      body2 = body2.set('token', this.user.token.access_token);
      body2 = body2.set('client_id', environment.auth.clientid);
      body2 = body2.set('client_secret', environment.auth.clientsecret);
      this.httpClient.post(environment.auth.introspecturl, body2).subscribe((data2) => {
        console.log(data2);
      }, (error2: Error) => {
        console.log(error2);
      });
      */

      // redirect
      this.router.navigate([redirecturl], { replaceUrl: true });
    }, (error: Error) => {
      // failed to login
      const alertText = (error['error'] && error['error']['error_description'] ? error['error']['error_description']
                        : error['message']);
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
  expires: Date;
  token: any;
}
