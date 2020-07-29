import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/auth/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public titleService: Title,
              public router: Router,
              public auth: AuthService,
              public loadingscreen: LoadingscreenService) {
    this.titleService.setTitle('Logout - POWER.NI');
  }

  ngOnInit(): void {
    this.loadingscreen.setVisible(true);

    // delete localStorage
    localStorage.removeItem('user');
    this.auth.user = null;

    // redirect to logout page
    this.redirect();
  }

  /**
   * Redirects to external page. This exists to prevent redirect on karma tests
   */
  public redirect() {
    document.location.href = environment.auth.url + 'logout' +
                             '?client_id=' + encodeURIComponent(environment.auth.clientid) +
                             '&redirect_uri=' + encodeURIComponent(location.protocol + '//' + location.host);
  }
}
