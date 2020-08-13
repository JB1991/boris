import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { Bootstrap4_CSS } from '@app/fragebogen/surveyjs/style';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public css_style: any = JSON.parse(JSON.stringify(Bootstrap4_CSS));
    public task: any = null;
    public form: any = null;
    public UnsavedChanges = false;

    constructor(private httpClient: HttpClient) {
    }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
        this.task = null;
        this.form = null;
        this.UnsavedChanges = false;
    }

    /**
     * Get access by pin.
     * @param pin Task pin
     * @param factor Task factor
     */
    public getAccess(pin: string, factor?: string): Observable<Object> {
        // check data
        if (!pin) {
            throw new Error('pin is required');
        }

        // load data from server
        let url = environment.formAPI + 'public/access?pin=' + encodeURIComponent(pin);
        if (factor) {
            url += '&factor=' + encodeURIComponent(factor);
        }
        return this.httpClient.get(url);
    }

    /**
     * Loads form by id.
     * @param id Form id
     */
    public loadForm(id: string): Observable<Object> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // load data from server
        const url = environment.formAPI + 'public/forms/' + encodeURIComponent(id);
        return this.httpClient.get(url);
    }

    /**
     * Saves progress
     * @param id Task id
     * @param data Data from form
     * @param submit Submit form
     */
    public saveResults(id: string, data: any, submit: boolean = false): Observable<Object> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!data) {
            throw new Error('no data provided');
        }

        let url = environment.formAPI + 'public/tasks/' + encodeURIComponent(id);
        if (submit) {
            url += '?submit=true';
        }

        return this.httpClient.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Sets unsaved changes state
     * @param state true or false
     */
    public setUnsavedChanges(state: boolean) {
        this.UnsavedChanges = state;
    }

    /**
     * Returns true if unsaved changes exists
     */
    public getUnsavedChanges(): boolean {
        return this.UnsavedChanges;
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
