import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Component({
  selector: 'power-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email = '';
  public password = '';
  public redirect = '/';

  constructor(public titleService: Title,
              public activatedRoute: ActivatedRoute,
              public router: Router,
              public auth: AuthService,
              public alerts: AlertsService) {
    this.titleService.setTitle('Login - POWER.NI');
  }

  ngOnInit(): void {
    // get redirect
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.redirect) {
        this.redirect = params.redirect;
      }
    });

    // check if user is authenticated
    if (this.auth.getUser()) {
      this.router.navigate(['/'], { replaceUrl: true });
      console.log('User is authenticated');
    }
  }

  /**
   * Handles login button event
   */
  public login(): boolean {
    if (!this.email) {
      this.alerts.NewAlert('danger', 'Loginformular', 'Bitte geben Sie Ihren Benutzernamen an.');
      return false;
    }
    if (!this.password) {
      this.alerts.NewAlert('danger', 'Loginformular', 'Bitte geben Sie Ihr Passwort an.');
      return false;
    }
    if (!this.redirect) {
      this.redirect = '/';
    }

    // authenticate
    this.auth.login(this.email, this.password, this.redirect);
    return true;
  }
}
