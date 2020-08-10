import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

import { ConfigService } from '@app/config.service';

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
              public conf: ConfigService) {
    // load session
    this.loadSession(true);
  }

  /**
   * Loads session from localStorage
   * @param refresh should refresh token if expired
   */
  public async loadSession(refresh = true) {
    // check if session is loaded and still valid
    if (this.IsAuthenticated()) {
      return;
    }

    // load session from localstorage
    this.user = JSON.parse(localStorage.getItem('user'));
    // fix wrong timezone after parsing from json
    if (this.user && this.user.expires) {
      this.user.expires = new Date(this.user.expires);
    }

    // check if session is still valid
    if (this.IsAuthenticated()) {
      return;
    }

    // session needs refresh
    if (refresh && this.user && this.user.token && this.user.token.refresh_token) {
      // craft post object
      let body = new HttpParams();
      body = body.set('grant_type', 'refresh_token');
      body = body.set('client_id', environment.auth.clientid);
      body = body.set('client_secret', environment.auth.clientsecret);
      body = body.set('refresh_token', this.user.token.refresh_token);

      try {
        // post login data
        const data = await this.httpClient.post(environment.auth.url + 'token', body).toPromise();
        // check for error
        if (!data || data['error']) {
          console.log('Could not refresh: ' + data);

          // delete localStorage
          localStorage.removeItem('user');
          this.user = null;
          return;
        }

        // save data
        this.user.expires = new Date();
        this.user.expires.setSeconds(this.user.expires.getSeconds() + data['expires_in']);
        this.user.token = data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return;
      } catch (error) {
        // failed to refresh
        console.log(error);

        // delete localStorage
        localStorage.removeItem('user');
        this.user = null;
        return;
      }
    }

    // delete localStorage
    localStorage.removeItem('user');
    this.user = null;
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
    if (!this.user || !this.user.token || !this.user.token.access_token) {
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
    // check if user is authenticated
    if (this.IsAuthenticated()) {
      header = header.set('Authorization', this.getBearer());
    }
    return {'headers': header, 'responseType': responsetype};
  }

  /**
   * Requests auth token from keycloak
   * @param code Auth code
   */
  public async KeycloakToken(code: string) {
    // check data
    if (!code) {
      throw new Error('code is required');
    }

    // craft post object
    let body = new HttpParams();
    body = body.set('grant_type', 'authorization_code');
    body = body.set('client_id', environment.auth.clientid);
    body = body.set('client_secret', environment.auth.clientsecret);
    body = body.set('code', code);
    body = body.set('redirect_uri', location.protocol + '//' + location.host + '/login');

    // post login data
    try {
      const data = await this.httpClient.post(environment.auth.url + 'token', body).toPromise();
      // check for error
      if (!data || data['error']) {
        console.log('Could not get token: ' + data);
        return;
      }

      // save data
      const expire = new Date();
      expire.setSeconds(expire.getSeconds() + data['expires_in']);
      this.user = {'expires': expire, 'token': data, 'data': null};
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      // failed to login
      console.log(error);
      return;
    }
  }

  /**
   * Gets user info from keycloak
   */
  public async KeyLoakUserInfo() {
    // get data
    try {
      const data = await this.httpClient.get(environment.auth.url + 'userinfo', this.getHeaders()).toPromise();
      // check for error
      if (!data || data['error']) {
        console.log('Could not get user info: ' + data);
        return;
      }

      // save data
      this.user.data = data;
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      // failed to login
      console.log(error);
      return;
    }
  }

  /**
   * IsAuthEnabled returns true if auth module is enabled
   */
  public IsAuthEnabled(): boolean {
    if (!environment.production || !(this.conf.config && this.conf.config['authentication'])) {
      return false;
    }
    return true;
  }

  /**
   * IsAuthenticated returns true if user has valid session
   */
  public IsAuthenticated(): boolean {
    if (this.user && this.user.token && this.user.expires && new Date() < this.user.expires) {
      return true;
    }
    return false;
  }
}

/**
 * Represents userdata
 */
export class User {
  expires: Date;
  token: any;
  data: any;
}
