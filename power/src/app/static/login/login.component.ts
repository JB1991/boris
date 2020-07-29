import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@app/shared/auth/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'power-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public titleService: Title,
              public activatedRoute: ActivatedRoute,
              public router: Router,
              public auth: AuthService) {
    this.titleService.setTitle('Login - POWER.NI');
  }

  async ngOnInit() {
    await this.authenticate();
  }

  /**
   * Handles user authentication
   */
  public async authenticate() {
    // get redirect
    let redirect = this.activatedRoute.snapshot.queryParamMap.get("redirect");
    if (!redirect) {
      redirect = '/';
    }

    // check if user is authenticated
    if (this.auth.IsAuthenticated()) {
      console.log('User is authenticated');
      this.router.navigate([redirect], { replaceUrl: true });
      return;
    }

    // check if keycloak params are set
    const session = this.activatedRoute.snapshot.queryParamMap.get("code");
    if (session) {
      // get access token
      await this.auth.KeycloakToken(session);

      // check if user is authenticated
      if (this.auth.IsAuthenticated()) {
        console.log('User is authenticated');
        this.router.navigate([redirect], { replaceUrl: true });
        return;
      }

      // failed to authenticate
      console.log("authentication failed");
      return;
    }

    // redirect to auth page
    document.location.href = environment.auth.url + 'auth' +
                             '?response_type=code' +
                             '&client_id=' + encodeURIComponent(environment.auth.clientid) +
                             '&redirect_uri=' + encodeURIComponent(document.location.href);
  }
}
