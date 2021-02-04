import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

@Component({
    selector: 'power-forms-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(public titleService: Title,
        public router: Router,
        public auth: AuthService,
        public alerts: AlertsService) {
        this.titleService.setTitle($localize`Formulare - Immobilienmarkt.NI`);
    }

    ngOnInit() {
    }

    form: any = {};

    /**
     * Redirects to formular fillout dialogue
     * @param pin Formular pin
     */
    submitPIN(pin: string) {
        if (!pin) {
            this.alerts.NewAlert('danger', $localize`Bitte Pin eingeben`, '');
            throw new Error('pin is required');
        }
        this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
