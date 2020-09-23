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
