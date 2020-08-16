import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/auth/auth.service';

@Component({
    selector: 'power-forms-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(public titleService: Title,
        public router: Router,
        public auth: AuthService) {
        this.titleService.setTitle($localize`Formulare - POWER.NI`);
    }

    ngOnInit() {
    }

    /**
     * Redirects to formular fillout dialogue
     * @param pin Formular pin
     */
    submitPIN(pin: string) {
        if (!pin) {
            throw new Error('pin is required');
        }
        this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
