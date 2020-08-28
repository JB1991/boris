import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public formsList: any = [];

    constructor(private httpClient: HttpClient) {
    }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.formsList = [];
    }

    /**
     * Loads list of forms
     */
    public loadFormsList(): Observable<Object> {
        // Load data from server
        const url = environment.formAPI
            + 'public/forms?fields=id,title,published';
        return this.httpClient.get(url);
    }

    /**
     * Loads a form by id
     */
    public loadForm(id: string): Observable<Object> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // load form from server
        const url = environment.formAPI + 'public/forms/' + encodeURIComponent(id);
        return this.httpClient.get(url);
    }

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
