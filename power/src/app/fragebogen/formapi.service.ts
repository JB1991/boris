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
     * Returns tag list
     */
    public async getInternTags(): Promise<string[]> {
        // craft url
        let data: ArrayBuffer;
        const url = environment.formAPI + 'intern/tags';

        // load tags
        try {
            data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed
            throw new Error(error['message']);
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
     * Returns forms list with filter options
     * @param queryParams Query parameters
     */
    public async getInternFormList(queryParams?: {
        fields?: string;
        access?: 'public' | 'pin6' | 'pin8' | 'pin6-factor';
        'title-contains'?: string;
        tag?: string;
        'created-before'?: string;
        'created-after'?: string;
        'published-before'?: string;
        'published-after'?: string;
        'cancelled-before'?: string;
        'cancelled-after'?: string;
        status?: 'created' | 'published' | 'cancelled';
        sort?: 'id' | 'title' | 'created' | 'published' | 'cancelled';
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Form[];
        total: number;
    }> {
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

        // load forms list
        try {
            data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed
            throw new Error(error['message']);
        }

        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        } else if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        } else if (!data['data']) {
            throw new Error('API returned an invalid response');
        }
        return <any>data;
    }

    /**
     * Creates new form
     * @param form Formular json
     * @param queryParams Query parameters
     */
    public async createInternForm(form: any, queryParams?: {
        fields?: string;
        access?: 'public' | 'pin6' | 'pin8' | 'pin6-factor';
        'access-minutes'?: number;
        tags?: string[];
        owners?: string[];
        readers?: string[];
    }): Promise<Form> {
        // check data
        if (!form) {
            throw new Error('form is required');
        }

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

        // create form
        try {
            data = await this.httpClient.post(url, form, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed
            throw new Error(error['message']);
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
    }): Promise<Form> {
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
            // failed
            throw new Error(error['message']);
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
     * Updates form by id
     * @param id Form id
     * @param form Formular json
     * @param queryParams Query parameters
     */
    public async updateInternForm(id: string, form?: any, queryParams?: {
        fields?: string;
        access?: 'public' | 'pin6' | 'pin8' | 'pin6-factor';
        'access-minutes'?: number;
        tags?: string[];
        owners?: string[];
        readers?: string[];
        'add-tags'?: string[];
        'add-owners'?: string[];
        'add-readers'?: string[];
        'remove-tags'?: string[];
        'remove-owners'?: string[];
        'remove-readers'?: string[];
        publish?: boolean;
        cancel?: boolean;
    }): Promise<Form> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!form) {
            form = '';
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

        // update form
        try {
            data = await this.httpClient.post(url, form, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed
            throw new Error(error['message']);
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
     * Deletes form by id
     * @param id Form id
     */
    public async deleteInternForm(id: string): Promise<string> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        // craft url
        let data: ArrayBuffer;
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);

        // delete form
        try {
            data = await this.httpClient.delete(url, this.auth.getHeaders()).toPromise();
        } catch (error) {
            // failed
            throw new Error(error['message']);
        }

        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        } else if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        } else if (!data['message']) {
            throw new Error('API returned an invalid response');
        }
        return data['message'];
    }
}

export interface Form {
    id: string;
    content: Object;
    title: string;
    access?: 'public' | 'pin6' | 'pin8' | 'pin6-factor';
    'access-minutes'?: number;
    tags: string[];
    owners: string[];
    readers: string[];
    created: string;
    published?: string;
    cancelled?: string;
    status: 'created' | 'published' | 'cancelled';
}

export interface Task {
    id: string;
    'form-id': string;
    factor?: string;
    pin?: string;
    content: Object;
    created: string;
    accessed?: string;
    submitted?: string;
    status: 'created' | 'accessed' | 'submitted';
    description: string;
}
