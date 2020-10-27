import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { AuthService, User } from '@app/shared/auth/auth.service';
import {
    Access, ElementField, ElementFilter, ElementSort,
    Form, FormField, FormFilter, FormSort, FormStatus,
    Permission, PublicForm, PublicFormField, PublicFormFilter,
    PublicFormSort, PublicTask, PublicTaskField, Task, TaskField,
    TaskFilter, TaskSort, TaskStatus, UserField
} from './formapi.model';
import { ElementFilterToString, FormFilterToString, SortToString, TaskFilterToString } from './formapi.converter';

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
    // tslint:disable-next-line: max-func-body-length
    private async Do(required: Array<string>, method: Method, uri: string, params: Record<string, string>, body?: any) {
        const p = new URLSearchParams(params);
        const url = environment.formAPI + uri + (p.toString() ? '?' + p.toString() : '');

        console.log(url);

        let data: ArrayBuffer;
        try {
            switch (method) {
                case Method.POST:
                    data = await this.httpClient.post(url, body, this.auth.getHeaders()).toPromise();
                    break;
                case Method.PUT:
                    data = await this.httpClient.put(url, body, this.auth.getHeaders()).toPromise();
                    break;
                case Method.DELETE:
                    data = await this.httpClient.delete(url, this.auth.getHeaders()).toPromise();
                    break;
                default:
                    data = await this.httpClient.get(url, this.auth.getHeaders()).toPromise();
            }
        } catch (error) {
            throw new Error(error['message']);
        }
        // check for error
        if (!data) {
            throw new Error('API returned an empty response');
        }
        if (data['error']) {
            throw new Error('API returned error: ' + data['error']);
        }
        for (const r of required) {
            if (!data[r]) {
                throw new Error('API returned an invalid response');
            }
        }
        return <any>data;
    }

    /**
     * Returns tag list
     */
    public async getTags(): Promise<string[]> {
        return (await this.Do(['tags'], Method.GET, 'tags', {}))['tags'];
    }

    /**
     * Returns group list
     */
    public async getGroups(): Promise<string[]> {
        return (await this.Do(['groups'], Method.GET, 'groups', {}))['groups'];
    }

    // tslint:disable-next-line: cyclomatic-complexity
    public async getForms(
        params: GetFormsParams
    ): Promise<{
        forms: Array<Form>;
        'total-forms': number;
        owners: Record<string, User>;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params['owner-fields'] && params['owner-fields'].length > 0) {
            p['owner-fields'] = params['owner-fields'].join(',');
        }
        if (params.extra && params.extra.length > 0) {
            p.extra = params.extra.join(',');
        }
        if (params.filter) {
            p.filter = FormFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort);
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(['forms', 'owners', 'total-forms'], Method.GET, 'forms', p);
    }

    public async getForm(
        id: string,
        params: GetFormParams
    ): Promise<{
        form: Form;
        owner: User;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params['owner-fields']) {
            p['owner-fields'] = params['owner-fields'].join(',');
        }
        if (params.extra) {
            p.extra = params['extra'].join(',');
        }
        return this.Do(['form', 'owner'], Method.GET, 'forms/' + encodeURIComponent(id), p);
    }

    public async createForm(body: {
        content?: any;
        tags?: Array<string>;
        access?: Access;
        group?: string;
        'group-permissions'?: Array<Permission>;
        'other-permissions'?: Array<Permission>;
    }): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.POST, 'forms/', {}, body);
    }

    public async updateForm(
        id: string,
        body: {
            content?: any;
            tags?: Array<string>;
            access?: Access;
            group?: string;
            'group-permissions'?: Array<Permission>;
            'other-permissions'?: Array<Permission>;
            status?: FormStatus;
        }
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.PUT, 'forms/' + encodeURIComponent(id), {}, body);
    }

    public async deleteForm(
        id: string
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.DELETE, 'forms/' + encodeURIComponent(id), {});
    }

    // tslint:disable-next-line: max-func-body-length
    // tslint:disable-next-line: cyclomatic-complexity
    public async getTasks(
        params: GetTasksParams
    ): Promise<{
        tasks: Array<Task>;
        'total-tasks': number;
        forms: Record<string, Form>;
        owners: Record<string, User>;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params['form-fields'] && params['form-fields'].length > 0) {
            p['form-fields'] = params['form-fields'].join(',');
        }
        if (params['owner-fields'] && params['owner-fields'].length > 0) {
            p['owner-fields'] = params['owner-fields'].join(',');
        }
        if (params.extra && params.extra.length > 0) {
            p.extra = params.extra.join(',');
        }
        if (params['form-extra'] && params['form-extra'].length > 0) {
            p['form-extra'] = params['form-extra'].join(',');
        }
        if (params.filter) {
            p.filter = TaskFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort);
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(['forms', 'tasks', 'owners', 'total-tasks'], Method.GET, 'tasks', p);
    }

    public async getTask(
        id: string,
        params: GetTasksParams
    ): Promise<{
        task: Task;
        form: Form;
        owner: User;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params['form-fields']) {
            p['form-fields'] = params['form-fields'].join(',');
        }
        if (params['owner-fields']) {
            p['owner-fields'] = params['owner-fields'].join(',');
        }
        if (params.extra) {
            p.extra = params.extra.join(',');
        }
        if (params['form-extra']) {
            p['form-extra'] = params['form-extra'].join(',');
        }
        return this.Do(['task', 'form', 'owner'], Method.GET, 'tasks/' + encodeURIComponent(id), p);
    }

    public async createTask(
        formID: string,
        body: {
            content?: any;
            description?: string;
        }
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.POST, 'forms/' + encodeURIComponent(formID), {}, body);
    }

    public async updateTask(
        id: string,
        body: {
            content?: any;
            description?: string;
            status?: TaskStatus;
        }
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.PUT, 'tasks/' + encodeURIComponent(id), {}, body);
    }

    public async deleteTask(
        id: string
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.DELETE, 'tasks/' + encodeURIComponent(id), {});
    }

    public async getElements(
        params: GetElementsParams
    ): Promise<{
        elements: Array<Element>;
        'total-elements': number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.extra && params.extra.length > 0) {
            p.extra = params.extra.join(',');
        }
        if (params.filter) {
            p.filter = ElementFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort);
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(['elements', 'total-elements'], Method.GET, 'elements', p);
    }

    public async getElement(
        id: string,
        params: GetElementParams
    ): Promise<{
        element: Element;
        owner: User;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extra) {
            p.extra = params.extra.join(',');
        }
        return this.Do(['element', 'owner'], Method.GET, 'elements/' + encodeURIComponent(id), p);
    }

    public async createElement(body: {
        content?: any;
    }): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.POST, 'elements/', {}, body);
    }

    public async updateElement(
        id: string,
        body: {
            content?: any;
        }
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.PUT, 'elements/' + encodeURIComponent(id), {}, body);
    }

    public async deleteElement(
        id: string
    ): Promise<{
        id: string;
    }> {
        return this.Do(['id'], Method.DELETE, 'elements/' + encodeURIComponent(id), {});
    }

    public async getPublicForms(
        params: GetPublicFormsParams
    ): Promise<{
        forms: Array<PublicForm>;
        'total-forms': number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extra) {
            p.extra = params.extra.join(',');
        }
        if (params.filter) {
            p.filter = FormFilterToString(params.filter);
        }
        if (params.sort) {
            p.sort = SortToString(params.sort);
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(['forms', 'total-forms'], Method.GET, 'public/forms/', p);
    }

    public async getPublicForm(
        id: string,
        params: GetPublicFormParams
    ): Promise<{
        form: PublicForm;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params.extra) {
            p.extra = params['extra'].join(',');
        }
        return this.Do(['form'], Method.GET, 'public/forms/' + encodeURIComponent(id), p);
    }

    public async createPublicTask(
        formID: string,
        content: any,
    ): Promise<{
        message: string;
    }> {
        return this.Do(['message'], Method.POST, 'public/forms/' + encodeURIComponent(formID), { content: content });
    }

    public async getPublicTask(
        pin: string,
        params: GetPublicTaskParams
    ): Promise<{
        task: PublicTask;
        form: PublicForm;
    }> {
        const p: Record<string, string> = {};
        if (params.fields) {
            p.fields = params.fields.join(',');
        }
        if (params['form-fields']) {
            p['form-fields'] = params['form-fields'].join(',');
        }
        if (params['owner-fields']) {
            p['owner-fields'] = params['owner-fields'].join(',');
        }
        if (params.extra) {
            p.extra = params.extra.join(',');
        }
        if (params['form-extra']) {
            p['form-extra'] = params['form-extra'].join(',');
        }
        return this.Do(['task', 'form'], Method.GET, 'public/tasks/' + encodeURIComponent(pin), p);
    }

    public async updatePublicTask(
        pin: string,
        content: any,
        submit: boolean
    ): Promise<{
        task: PublicTask;
        form: PublicForm;
    }> {
        const p: Record<string, string> = {};
        if (submit) {
            p.submit = 'true';
        }
        return this.Do(['task', 'form'], Method.GET, 'public/tasks/' + encodeURIComponent(pin), p, {
            content: content,
        });
    }

    public async getCSV(formID: string): Promise<string> {
        let data: ArrayBuffer;
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(formID) + '/csv';

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
    fields: Array<FormField>;
    'owner-fields'?: Array<UserField>;
    extra?: Array<string>;
    filter?: FormFilter;
    sort?: FormSort;
    limit?: number;
    offset?: number;
}

export interface GetPublicFormsParams {
    fields: Array<PublicFormField>;
    extra?: Array<string>;
    filter?: PublicFormFilter;
    sort?: PublicFormSort;
    limit?: number;
    offset?: number;
}

export interface GetFormParams {
    fields: Array<FormField>;
    'owner-fields'?: Array<UserField>;
    extra?: Array<string>;
}

export interface GetPublicFormParams {
    fields: Array<PublicFormField>;
    extra?: Array<string>;
}

export interface GetTasksParams {
    fields: Array<TaskField>;
    'form-fields'?: Array<FormField>;
    'owner-fields'?: Array<UserField>;
    extra?: Array<string>;
    'form-extra'?: Array<string>;
    filter?: TaskFilter;
    sort?: TaskSort;
    limit?: number;
    offset?: number;
}

export interface GetTaskParams {
    fields: Array<TaskField>;
    'form-fields'?: Array<FormField>;
    'owner-fields'?: Array<UserField>;
    extra?: Array<string>;
    'form-extra'?: Array<string>;
}

export interface GetPublicTaskParams {
    fields: Array<PublicTaskField>;
    'form-fields'?: Array<PublicFormField>;
    extra?: Array<string>;
    'form-extra'?: Array<string>;
}

export interface GetElementsParams {
    fields: Array<ElementField>;
    extra?: Array<string>;
    filter?: ElementFilter;
    sort?: ElementSort;
    limit?: number;
    offset?: number;
}

export interface GetElementParams {
    fields: Array<ElementField>;
    extra?: Array<string>;
}
