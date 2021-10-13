import { Component, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
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

    private licenseSubscription: Subscription = new Subscription;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        http: HttpClient) {
        this.libs = [];

        if (isPlatformBrowser(this.platformId)) {
            this.licenseSubscription = http.get('/3rdpartylicenses.txt', { responseType: 'text' }).subscribe((response) => {
                this.libs = OpenSourceLibrariesComponent.findLibs(response.toString());
            });
        }
    }

    /**
     * Parses a text to return found libraries and its licenses
     *
     * @param licenses text to parse
     * @returns array of lib names and licenses
     */
    public static findLibs(licenses: string): ILib[] {
        const res = [];
        const array = licenses.split('\n');
        const pattern = new RegExp(/^[\w/.\d@]+[\w -/.\d@]*/);
        for (let line = 0; line < array.length; line++) {
            if (array[line].startsWith('@')
                || ((line > 0 && array[line - 1].length === 0)
                    && !array[line].includes(' ')
                    && pattern.exec(array[line]))) {
                if (array[line].startsWith('ngx-bootstrap/')) {
                    res.push({ name: array[line], license: 'MIT' }); // libs like ngx-bootstrap/accordion do not contain a license
                }
                else {
                    res.push({ name: array[line], license: array[++line] });
                }
            }
        }

        return res;
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        this.licenseSubscription.unsubscribe();
    }

}
