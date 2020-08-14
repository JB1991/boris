import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthService } from '@app/shared/auth/auth.service';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public formsList: any = [];
    public tasksList: any = [];
    public tagList: any = [];
    public serviceList: any = [
        { value: 'AKS', name: 'Automatische Kaufpreissammlung' }
    ];

    constructor(private httpClient: HttpClient,
        public auth: AuthService) {
    }

    /**
     * Resets service to empty model
     */
    public resetService() {
        this.formsList = [];
        this.tagList = [];
    }

    /**
     * Loads list of forms
     */
    public loadFormsList(): Observable<Object> {
        // Load data from server
        const url = environment.formAPI
            + 'intern/forms?fields=created,id,owners,status,tags,title';
        return this.httpClient.get(url, this.auth.getHeaders());
    }

    /**
     * Loads list of tasks
     */
    public loadTasksList(): Observable<Object> {
        // Load data from server
        const url = environment.formAPI
            + 'intern/tasks?status=submitted&sort=submitted';
        return this.httpClient.get(url, this.auth.getHeaders());
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
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
        return this.httpClient.get(url, this.auth.getHeaders());
    }

    /**
     * Load tags
     */
    public loadTags(): Observable<Object> {
        // Load tags from server
        const url = environment.formAPI + 'intern/tags';
        return this.httpClient.get(url, this.auth.getHeaders());
    }

    /**
     * Upload form from JSON
     * @param data SurveyJS
     * @param tags Tag list
     */
    public createForm(data: any, tags?: string): Observable<Object> {
        // check data
        if (!data) {
            throw new Error('data is required');
        }

        // Uploads form
        let url = environment.formAPI + 'intern/forms';
        if (tags) {
            url += '?tags=' + encodeURIComponent(tags);
        }
        return this.httpClient.post(url, data, this.auth.getHeaders());
    }

    /**
     * Deletes form
     * @param id Form id
     */
    public deleteForm(id: string): Observable<Object> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // Delete form
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
        return this.httpClient.delete(url, this.auth.getHeaders());
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
