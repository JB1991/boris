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
     * Helper function to reduce code duplication
     * @param uri URL
     * @param required Required json key from response
     * @param queryParams Query parameters
     * @param body Body for POST
     * @param del True to send DELETE
     */
    private async getData(uri: string,
        required?: string,
        queryParams?: Object,
        body?: any,
        del?: boolean): Promise<any> {
        // craft url
        let data: ArrayBuffer;
        const params = new URLSearchParams({});
        if (queryParams) {
            for (const key of Object.keys(queryParams)) {
                params.append(key, queryParams[key].toString());
            }
        }
        const url = environment.formAPI + uri +
            (params.toString() ? '?' + params.toString() : '');

        // get data
        try {
            if (del) {
                data = await this.httpClient.delete(url, this.auth.getHeaders()).toPromise();
            } else if (typeof body !== 'undefined') {
                data = await this.httpClient.post(url, body, this.auth.getHeaders()).toPromise();
            } else {
                data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
            }
        } catch (error) {
            // failed
            throw new Error(error['message']);
        }

        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        } else if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        } else if (required && !data[required]) {
            throw new Error('API returned an invalid response');
        }
        return <any>data;
    }

    /**
     * Returns tag list
     */
    public async getInternTags(): Promise<string[]> {
        return (await this.getData('intern/tags', 'data'))['data'];
    }

    /**
     * Returns form list
     * @param queryParams Query parameters
     */
    public async getInternForms(queryParams?: {
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
        return (await this.getData('intern/forms', 'data', queryParams));
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

        return (await this.getData('intern/forms', 'data', queryParams, form))['data'];
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

        return (await this.getData('intern/forms/' + encodeURIComponent(id), 'data', queryParams))['data'];
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

        return (await this.getData('intern/forms/' + encodeURIComponent(id), 'data', queryParams, form))['data'];
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

        return (await this.getData('intern/forms/' + encodeURIComponent(id), 'message', null, null, true))['message'];
    }

    /**
     * Returns tasks by form-id
     * @param id Form id
     * @param queryParams Query parameters
     */
    public async getInternFormTasks(id: string, queryParams?: {
        fields?: string;
        status?: 'created' | 'accessed' | 'submitted';
        'created-before'?: string;
        'created-after'?: string;
        'accessed-before'?: string;
        'accessed-after'?: string;
        'submitted-before'?: string;
        'submitted-after'?: string;
        sort?: 'id' | 'form-id' | 'factor' | 'pin' | 'created' | 'submitted';
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Task[];
        total: number;
    }> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        return (await this.getData('intern/forms/' + encodeURIComponent(id) + '/tasks', 'data', queryParams));
    }

    /**
     * Creates new tasks for form-id
     * @param id Form id
     * @param results Formular result json
     * @param queryParams Query parameters
     */
    public async createInternFormTasks(id: string, results?: any, queryParams?: {
        fields?: string;
        factor?: string;
        description?: string;
        number?: number;
    }): Promise<{
        data: Task[];
        total: number;
    }> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!results) {
            throw new Error('results is required');
        }

        return (await this.getData('intern/forms/' + encodeURIComponent(id) + '/tasks', 'data', queryParams, results));
    }

    /**
     * Returns task list
     * @param queryParams Query parameters
     */
    public async getInternTasks(queryParams?: {
        fields?: string;
        status?: 'created' | 'accessed' | 'submitted';
        'created-before'?: string;
        'created-after'?: string;
        'accessed-before'?: string;
        'accessed-after'?: string;
        'submitted-before'?: string;
        'submitted-after'?: string;
        sort?: 'id' | 'form-id' | 'factor' | 'pin' | 'created' | 'submitted';
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Task[];
        total: number;
    }> {
        return (await this.getData('intern/tasks', 'data', queryParams));
    }

    /**
     * Returns task by id
     * @param id Task id
     * @param queryParams Query parameters
     */
    public async getInternTask(id: string, queryParams?: {
        fields?: string;
    }): Promise<Task> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        return (await this.getData('intern/tasks/' + encodeURIComponent(id), 'data', queryParams))['data'];
    }

    /**
     * Updates tasks by id
     * @param id Task id
     * @param results Formular result json
     * @param queryParams Query parameters
     */
    public async updateInternTask(id: string, results?: any, queryParams?: {
        fields?: string;
        factor?: string;
        description?: string;
        submit?: boolean;
    }): Promise<Task> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!results) {
            results = '';
        }

        return (await this.getData('intern/tasks/' + encodeURIComponent(id), 'data', queryParams, results))['data'];
    }

    /**
     * Deletes task by id
     * @param id Task id
     */
    public async deleteInternTask(id: string): Promise<string> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        return (await this.getData('intern/tasks/' + encodeURIComponent(id), 'message', null, null, true))['message'];
    }

    /**
     * Returns form list
     * @param queryParams Query parameters
     */
    public async getPublicForms(queryParams?: {
        fields?: string;
        'title-contains'?: string;
        'published-before'?: string;
        'published-after'?: string;
        sort?: 'id' | 'title' | 'published';
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<{
        data: PublicForm[];
        total: number;
    }> {
        return (await this.getData('public/forms', 'data', queryParams));
    }

    /**
     * Returns form by id
     * @param id Form id
     * @param queryParams Query parameters
     */
    public async getPublicForm(id: string, queryParams?: {
        fields?: string;
    }): Promise<PublicForm> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        return (await this.getData('public/forms/' + encodeURIComponent(id), 'data', queryParams))['data'];
    }

    /**
     * Creates task for form-id
     * @param id Form id
     * @param results Formular result json
     * @param queryParams Query parameters
     */
    public async createPublicTask(id: string, results: any, queryParams?: {
        fields?: string;
        submit?: boolean;
    }): Promise<PublicTask> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!results) {
            throw new Error('results is required');
        }

        return (await this.getData('public/forms/' + encodeURIComponent(id) + '/tasks', 'data', queryParams, results))['data'];
    }

    /**
     * Returns task by id
     * @param id Task id
     * @param queryParams Query parameters
     */
    public async getPublicTask(id: string, queryParams?: {
        fields?: string;
    }): Promise<PublicTask> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        return (await this.getData('public/tasks/' + encodeURIComponent(id), 'data', queryParams))['data'];
    }

    /**
     * Updates task by id
     * @param id Task id
     * @param results Formular result json
     * @param queryParams Query parameters
     */
    public async updatePublicTask(id: string, results?: any, queryParams?: {
        fields?: string;
        submit?: boolean;
    }): Promise<PublicTask> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }
        if (!results) {
            results = '';
        }

        return (await this.getData('public/tasks/' + encodeURIComponent(id), 'data', queryParams, results))['data'];
    }

    /**
     * Grants access
     * @param pin Formular pin
     * @param factor Two factor value
     */
    public async getPublicAccess(pin: string, factor?: string): Promise<PublicAccess> {
        // check data
        if (!pin) {
            throw new Error('pin is required');
        }

        return (await this.getData('public/access?pin=' + encodeURIComponent(pin) +
            (factor ? '&factor=' + encodeURIComponent(factor) : ''), 'data'))['data'];
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

export interface PublicForm {
    id: string;
    content: Object;
    title: string;
    access?: 'public' | 'pin6' | 'pin8' | 'pin6-factor';
    'access-minutes'?: number;
    published?: string;
}

export interface Task {
    id: string;
    'form-id': string;
    factor?: string;
    pin?: string;
    content?: Object;
    created: string;
    accessed?: string;
    submitted?: string;
    status: 'created' | 'accessed' | 'submitted';
    description: string;
}

export interface PublicTask {
    id: string;
    'form-id': string;
    content?: Object;
}

export interface PublicAccess {
    id: string;
    'form-id': string;
    content?: Object;
}
