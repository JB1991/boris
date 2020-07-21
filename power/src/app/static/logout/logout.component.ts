import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'power-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public auth: AuthService,
              public router: Router,
              public alerts: AlertsService) { }

  ngOnInit(): void {
    // logout
    this.auth.logout();
    this.alerts.NewAlert('success', 'Sie wurden erfolgreich ausgeloggt', '');
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
