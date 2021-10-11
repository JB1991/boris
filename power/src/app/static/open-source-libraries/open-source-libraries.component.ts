import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

export interface ILib {
    name: string;
    license: string
}

@Component({
    selector: 'power-open-source-libraries',
    templateUrl: './open-source-libraries.component.html',
    styleUrls: ['./open-source-libraries.component.scss']
})

export class OpenSourceLibrariesComponent implements OnDestroy {

    public libs: ILib[];

    private licenseSubscribtion: Subscription;

    constructor(http: HttpClient) {
        this.libs = [];
        this.licenseSubscribtion = http.get('/3rdpartylicenses.txt', { responseType: 'text' }).subscribe((response) => {
            this.libs = OpenSourceLibrariesComponent.findLibs(response.toString());
        });
    }

    public static findLibs(licenses: string): ILib[] {
        const res = [];
        const array = licenses.split('\n');
        const pattern = new RegExp(/^[\w/.\d@]+[\w -/.\d@]*/);
        for (let i = 0; i < array.length; i++) {
            if ((array[i].startsWith('@')
                || (i > 1 && array[i - 1].length === 0)
                && !array[i].includes(' ')
                && pattern.exec(array[i]))) {
                res.push({ name: array[i], license: array[++i] });
            }
        }

        return res;
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        this.licenseSubscribtion.unsubscribe();
    }

}
