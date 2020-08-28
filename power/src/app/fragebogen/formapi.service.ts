import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { AuthService } from '@app/shared/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class FormAPIService {

    constructor(private httpClient: HttpClient,
        public auth: AuthService) { }

    /**
     * Returns forms list with filter options
     * @param queryParams Query parameters
     */
    public async getInternFormList(queryParams?: {
        fields?: string;
        access?: string;
        'title-contains'?: string;
        tag?: string;
        'created-before'?: string;
        'created-after'?: string;
        'published-before'?: string;
        'published-after'?: string;
        'cancelled-before'?: string;
        'cancelled-after'?: string;
        status?: string;
        sort?: string;
        order?: string;
        limit?: number;
        offset?: number;
    }): Promise<Object[]> {
        // craft url
        let data: ArrayBuffer;
        const params = new URLSearchParams({});
        if (queryParams) {
            for (const key of Object.keys(queryParams)) {
                params.append(key, queryParams[key].toString());
            }
        }
        const url = environment.formAPI + 'intern/forms' +
            (params.toString() ? '?' + params.toString() : '');

        // load form
        try {
            data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed to load
            throw error;
        }

        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        } else if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        } else if (!data['data']) {
            throw new Error('API returned an invalid response');
        }
        return data['data'];
    }

    /**
     * Returns form by id
     * @param id Form id
     * @param queryParams Query parameters
     */
    public async getInternForm(id: string, queryParams?: {
        fields?: string;
    }): Promise<Object> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // craft url
        let data: ArrayBuffer;
        const params = new URLSearchParams({});
        if (queryParams) {
            for (const key of Object.keys(queryParams)) {
                params.append(key, queryParams[key].toString());
            }
        }
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) +
            (params.toString() ? '?' + params.toString() : '');

        // load form
        try {
            data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed to load
            throw error;
        }

        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        } else if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        } else if (!data['data']) {
            throw new Error('API returned an invalid response');
        }
        return data['data'];
    }
}
