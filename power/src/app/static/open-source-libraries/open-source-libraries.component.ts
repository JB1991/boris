import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
// import { Observable } from 'rxjs';

@Component({
    selector: 'power-open-source-libraries',
    templateUrl: './open-source-libraries.component.html',
    styleUrls: ['./open-source-libraries.component.scss']
})

export class OpenSourceLibrariesComponent implements OnDestroy {
    public licenses: string;

    private licenseSubscribtion: Subscription;

    constructor(http: HttpClient) {
        this.licenses = '';
        this.licenseSubscribtion = http.get('/3rdpartylicenses.txt', { responseType: 'text' }).subscribe((response) => {
            this.licenses = response;
        });
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        this.licenseSubscribtion.unsubscribe();
    }

}
