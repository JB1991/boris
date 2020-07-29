import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'power-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public auth: AuthService,
              public router: Router) { }

  ngOnInit(): void {
    // delete localStorage
    localStorage.removeItem('user');
    this.auth.user = null;

    // redirect to logout page
    document.location.href = environment.auth.url + 'logout' +
                             '?client_id=' + encodeURIComponent(environment.auth.clientid) +
                             '&redirect_uri=' + encodeURIComponent(location.protocol + '//' + location.host);
  }
}
