import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { AuthService } from '@app/shared/auth/auth.service';
import {
    Access, ElementField, ElementFilter, ElementSort,
    Form, FormField, FormFilter, FormSort, FormStatus,
    PublicForm, PublicFormField, PublicFormFilter,
    PublicFormSort, PublicTask, PublicTaskField, Task, TaskField,
    TaskFilter, TaskSort, TaskStatus, UserField, User
} from './formapi.model';
import { ElementFilterToString, FormFilterToString, SortToString, TaskFilterToString } from './formapi.converter';
import { Observable } from 'rxjs';

enum Method {
    GET,
    POST,
    PUT,
    DELETE,
}

@Injectable({
    providedIn: 'root',
})
export class FormAPIService {
    constructor(private httpClient: HttpClient, public auth: AuthService) { }

    /**
     * Helper function to reduce code duplication
     * @param required Required json keys from response
     * @param method Http method
     * @param uri URL
     * @param params Query parameters
     * @param body Body for POST
     */
    private async Do(method: Method, uri: string, params: Record<string, string>, body?: any) {
        const p = new URLSearchParams(params);
        const url = environment.formAPI + uri + (p.toString() ? '?' + p.toString() : '');

        let data: Promise<ArrayBuffer>;
        let obs: Observable<ArrayBuffer>;
        switch (method) {
            case Method.POST:
                obs = this.httpClient.post(url, body, this.auth.getHeaders());
                break;
            case Method.PUT:
                obs = this.httpClient.put(url, body, this.auth.getHeaders());
                break;
            case Method.DELETE:
                obs = this.httpClient.delete(url, this.auth.getHeaders());
                break;
            default:
                obs = this.httpClient.get(url, this.auth.getHeaders());
        }
        data = obs.toPromise();
        return <any>data;
    }

    /**
     * Returns tag list
     */
    public async getTags(): Promise<{
        tags: Array<string>;
        total: number;
        status: number;
    }> {
        return this.Do(Method.GET, 'tags', {});
    }

    /**
     * Returns group list
     */
    public async getGroups(): Promise<{
        groups: Array<string>;
        total: number;
        status: number;
    }> {
        return this.Do(Method.GET, 'groups', {});
    }

    // tslint:disable-next-line: cyclomatic-complexity
    public async getForms(
        params: GetFormsParams
    ): Promise<{
        forms: Array<Form>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extract && params.extract.length > 0) {
            p.extract = params.extract.join(',');
        }
        if (params.filter) {
            p.filter = FormFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort) + ',id';
        } else {
            p.sort = 'id';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'forms', p);
    }

    public async getForm(
        id: string,
        params: GetFormParams
    ): Promise<{
        form: Form;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params['extract'].join(',');
        }
        return this.Do(Method.GET, 'forms/' + encodeURIComponent(id), p);
    }

    public async createForm(body: {
        owner?: string;
        content?: any;
        tags?: Array<string>;
        access?: Access;
        status?: FormStatus;
        groups?: Array<string>;
    }): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.POST, 'forms', {}, body);
    }

    public async updateForm(
        id: string,
        body: {
            owner?: string;
            content?: any;
            groups?: Array<string>;
            tags?: Array<string>;
            access?: Access;
            group?: string;
            status?: FormStatus;
        }
    ): Promise<{
        message: string;
        status: number;
    }> {
        return this.Do(Method.PUT, 'forms/' + encodeURIComponent(id), {}, body);
    }

    public async deleteForm(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'forms/' + encodeURIComponent(id), {});
    }

    // tslint:disable-next-line: cyclomatic-complexity
    // tslint:disable-next-line: max-func-body-length
    public async getTasks(params: GetTasksParams): Promise<{
        tasks: Array<Task>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extract && params.extract.length > 0) {
            p.extract = params.extract.join(',');
        }
        if (params['form.extract'] && params['form.extract'].length > 0) {
            p['form.extract'] = params['form.extract'].join(',');
        }
        if (params.filter) {
            p.filter = TaskFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort) + ',id';
        } else {
            p.sort = 'id';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'tasks', p);
    }

    public async getTask(
        id: string,
        params: GetTaskParams
    ): Promise<{
        task: Task;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params.extract.join(',');
        }
        if (params['form.extract']) {
            p['form.extract'] = params['form.extract'].join(',');
        }
        return this.Do(Method.GET, 'tasks/' + encodeURIComponent(id), p);
    }

    public async createTask(
        formID: string,
        body: {
            content?: any;
            description?: string;
            status?: TaskStatus;
        },
        number?: number,
    ): Promise<{
        ids: Array<string>;
        pins: Array<string>;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (number && number > 0) {
            p.number = '' + number;
        }
        return this.Do(Method.POST, 'forms/' + encodeURIComponent(formID), p, body);
    }

    public async updateTask(
        id: string,
        body: {
            content?: any;
            description?: string;
            status?: TaskStatus;
        }
    ): Promise<{
        message: string;
        status: number;
    }> {
        return this.Do(Method.PUT, 'tasks/' + encodeURIComponent(id), {}, body);
    }

    public async deleteTask(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'tasks/' + encodeURIComponent(id), {});
    }

    public async getElements(
        params: GetElementsParams
    ): Promise<{
        elements: Array<Element>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extract && params.extract.length > 0) {
            p.extract = params.extract.join(',');
        }
        if (params.filter) {
            p.filter = ElementFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort) + ',id';
        } else {
            p.sort = 'id';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'elements', p);
    }

    public async getElement(
        id: string,
        params: GetElementParams
    ): Promise<{
        element: Element;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params.extract.join(',');
        }
        return this.Do(Method.GET, 'elements/' + encodeURIComponent(id), p);
    }

    public async createElement(
        body: {
            owner?: string;
            content?: any;
            groups?: Array<string>;
        }): Promise<{
            id: string;
            status: number;
        }> {
        return this.Do(Method.POST, 'elements', {}, body);
    }

    public async updateElement(
        id: string,
        body: {
            content?: any;
        }
    ): Promise<{
        message: string;
        status: number;
    }> {
        return this.Do(Method.PUT, 'elements/' + encodeURIComponent(id), {}, body);
    }

    public async deleteElement(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'elements/' + encodeURIComponent(id), {});
    }

    public async getPublicForms(
        params: GetPublicFormsParams
    ): Promise<{
        forms: Array<PublicForm>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params.extract.join(',');
        }
        if (params.filter) {
            p.filter = FormFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort) + ',id';
        } else {
            p.sort = 'id';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'public/forms', p);
    }

    public async getPublicForm(
        id: string,
        params: GetPublicFormParams
    ): Promise<{
        form: PublicForm;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params['extract'].join(',');
        }
        return this.Do(Method.GET, 'public/forms/' + encodeURIComponent(id), p);
    }

    public async createPublicTask(
        formID: string,
        content: any,
    ): Promise<{
        message: string;
        status: number;
    }> {
        return this.Do(Method.POST, 'public/forms/' + encodeURIComponent(formID), {}, { content: content });
    }

    public async getPublicTask(
        pin: string,
        params: GetPublicTaskParams
    ): Promise<{
        task: PublicTask;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extract) {
            p.extract = params.extract.join(',');
        }
        if (params['form.extract']) {
            p['form.extract'] = params['form.extract'].join(',');
        }
        return this.Do(Method.GET, 'public/tasks/' + encodeURIComponent(pin), p);
    }

    public async updatePublicTask(
        pin: string,
        content: any,
        submit: boolean
    ): Promise<{
        message: string;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (submit) {
            p.submit = 'true';
        }
        return this.Do(Method.PUT, 'public/tasks/' + encodeURIComponent(pin), p, {
            content: content,
        });
    }

    public async getCSV(formID: string): Promise<string> {
        let data: ArrayBuffer;
        const url = environment.formAPI + 'forms/' + encodeURIComponent(formID) + '/csv';

        try {
            data = await this.httpClient.get(url, this.auth.getHeaders('text', 'text/csv')).toPromise();
        } catch (error) {
            throw new Error(error['message']);
        }

        if (!data) {
            throw new Error('API returned an empty response');
        }
        return <any>data;
    }
}

export interface GetFormsParams {
    fields?: Array<FormField>;
    extract?: Array<string>;
    filter?: FormFilter;
    sort?: FormSort;
    limit?: number;
    offset?: number;
}

export interface GetPublicFormsParams {
    fields?: Array<PublicFormField>;
    extract?: Array<string>;
    filter?: PublicFormFilter;
    sort?: PublicFormSort;
    limit?: number;
    offset?: number;
}

export interface GetFormParams {
    fields?: Array<FormField>;
    extract?: Array<string>;
}

export interface GetPublicFormParams {
    fields?: Array<PublicFormField>;
    extract?: Array<string>;
}

export interface GetTasksParams {
    fields?: Array<TaskField>;
    extract?: Array<string>;
    'form.extract'?: Array<string>;
    filter?: TaskFilter;
    sort?: TaskSort;
    limit?: number;
    offset?: number;
}

export interface GetTaskParams {
    fields?: Array<TaskField>;
    extract?: Array<string>;
    'form.extract'?: Array<string>;
}

export interface GetPublicTaskParams {
    fields?: Array<PublicTaskField>;
    extract?: Array<string>;
    'form.extract'?: Array<string>;
}

export interface GetElementsParams {
    fields?: Array<ElementField>;
    extract?: Array<string>;
    filter?: ElementFilter;
    sort?: ElementSort;
    limit?: number;
    offset?: number;
}

export interface GetElementParams {
    fields?: Array<ElementField>;
    extract?: Array<string>;
}
