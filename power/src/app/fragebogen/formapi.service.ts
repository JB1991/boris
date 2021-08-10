import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { AuthService } from '@app/shared/auth/auth.service';
import {
    Access, ElementField, ElementFilter, ElementSort,
    Form, FormField, FormFilter, FormSort, FormStatus, GroupTagFilter,
    PublicForm, PublicFormField, PublicFormFilter,
    PublicFormSort, PublicTask, PublicTaskField, Task, TaskField,
    TaskFilter, TaskSort, TaskStatus, User, UserField, UserFilter, UserSort
} from './formapi.model';
import {
    ElementFilterToString,
    FormFilterToString, GroupTagFilterToString,
    SortToString,
    TaskFilterToString,
    UserFilterToString
} from './formapi.converter';
import { Observable } from 'rxjs';

/* eslint-disable-next-line no-shadow */
export enum Method {
    GET,
    POST,
    PUT,
    DELETE,
}

/* eslint-disable max-lines */
@Injectable({
    providedIn: 'root',
})
export class FormAPIService {
    constructor(
        private httpClient: HttpClient,
        public auth: AuthService
    ) { }

    /**
     * Helper function to reduce code duplication
     * @param method Http method
     * @param uri URL
     * @param params Query parameters
     * @param body Body for POST
     * @returns Promise<ArrayBuffer>
     */
    private async Do(method: Method, uri: string, params: Record<string, string>, body?: any) {
        const p = new URLSearchParams(params);
        const url = environment.formAPI + uri + (p.toString() ? '?' + p.toString() : '');

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
        const data = obs.toPromise();
        return data as any;
    }

    /**
     * Returns tag list
     * @param params Params
     * @returns Promise of tag list
     */
    public async getTags(
        params: GetGroupTagParams
    ): Promise<{
        tags: Array<string>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.filter) {
            p.filter = GroupTagFilterToString(params.filter);
        }
        if (params.desc && params.desc === true) {
            p.desc = 'true';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'intern/tags', p);
    }

    /**
     * Returns group list
     * @param params Params
     * @returns Promise of group list
     */
    public async getGroups(
        params: GetGroupTagParams
    ): Promise<{
        groups: Array<string>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.filter) {
            p.filter = GroupTagFilterToString(params.filter);
        }
        if (params.desc && params.desc === true) {
            p.desc = 'true';
        }
        if (params.limit) {
            p.limit = params.limit.toString();
        }
        if (params.offset) {
            p.offset = params.offset.toString();
        }
        return this.Do(Method.GET, 'intern/groups', p);
    }

    /**
     * Returns user list
     * @param params Params
     * @returns Promise of user list
     */
    public async getUsers(
        params: GetUsersParams
    ): Promise<{
        users: Array<User>;
        total: number;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (params.fields && params.fields.length > 0) {
            p.fields = params.fields.join(',');
        }
        if (params.filter) {
            p.filter = UserFilterToString(params.filter);
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
        return this.Do(Method.GET, 'intern/users', p);
    }

    public async getUser(
        id: string,
        fields?: Array<FormField>
    ): Promise<{
        user: User;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (fields) {
            p.fields = fields.join(',');
        }
        return this.Do(Method.GET, 'intern/users/' + encodeURIComponent(id), p);
    }

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
        return this.Do(Method.GET, 'intern/forms', p);
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
        return this.Do(Method.GET, 'intern/forms/' + encodeURIComponent(id), p);
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
        return this.Do(Method.POST, 'intern/forms', {}, body);
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
        return this.Do(Method.PUT, 'intern/forms/' + encodeURIComponent(id), {}, body);
    }

    public async deleteForm(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'intern/forms/' + encodeURIComponent(id), {});
    }

    public async getTasks(params: GetTasksParams): Promise<{ // eslint-disable-line complexity
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
        return this.Do(Method.GET, 'intern/tasks', p);
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
        return this.Do(Method.GET, 'intern/tasks/' + encodeURIComponent(id), p);
    }

    public async createTask(
        formID: string,
        body: {
            content?: any;
            description?: string;
            status?: TaskStatus;
        },
        number?: number // eslint-disable-line id-blacklist
    ): Promise<{
        ids: Array<string>;
        pins: Array<string>;
        status: number;
    }> {
        const p: Record<string, string> = {};
        if (number && number > 0) { // eslint-disable-line id-blacklist
            p.number = '' + number; // eslint-disable-line id-blacklist
        }
        return this.Do(Method.POST, 'intern/forms/' + encodeURIComponent(formID), p, body);
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
        return this.Do(Method.PUT, 'intern/tasks/' + encodeURIComponent(id), {}, body);
    }

    public async deleteTask(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'intern/tasks/' + encodeURIComponent(id), {});
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
        return this.Do(Method.GET, 'intern/elements', p);
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
        return this.Do(Method.GET, 'intern/elements/' + encodeURIComponent(id), p);
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
        return this.Do(Method.POST, 'intern/elements', {}, body);
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
        return this.Do(Method.PUT, 'intern/elements/' + encodeURIComponent(id), {}, body);
    }

    public async deleteElement(
        id: string
    ): Promise<{
        id: string;
        status: number;
    }> {
        return this.Do(Method.DELETE, 'intern/elements/' + encodeURIComponent(id), {});
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
        const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(formID) + '/csv';

        try {
            data = await this.httpClient.get(url, this.auth.getHeaders('text', 'text/csv')).toPromise();
        } catch (error) {
            throw new Error(error['message']);
        }

        if (!data) {
            throw new Error('API returned an empty response');
        }
        return data as any;
    }

    /**
     * Returns translatored error message
     * @param error Error
     */
    public getErrorMessage(error: Error): string { // eslint-disable-line complexity
        let msg = error.toString();
        if (error['error'] && error['error']['message']) {
            msg = error['error']['message'];
        } else if (msg === '[object Object]') {
            msg = $localize`Es trat folgender HTTP-Fehler auf:` + ' ' + error['message'];
        }

        if (msg === 'internal server') {
            return $localize`Server Fehler: Bitte versuchen Sie es erneut, sollte dies nicht helfen senden Sie uns bitte Feedback.`;

        } else if (msg === 'invalid request body') {
            return $localize`Server Fehler: Die Anfrage an den Server war ungültig.`;

        } else if (msg === 'not authorized') {
            return $localize`Um diese Aktion durchzuführen müssen Sie sich einloggen.`;

        } else if (msg === 'too many tags') {
            return $localize`Bitte geben Sie nicht mehr als 5 Tags an.`;

        } else if (msg === 'too many groups') {
            return $localize`Bitte geben Sie nicht mehr als 5 Gruppen an.`;

        } else if (msg.startsWith('element has no title: ')) {
            return $localize`Bitte geben Sie einen Titel an` + ': ' + msg.slice(22);

        } else if (msg.startsWith('unknown group:')) {
            return $localize`Die Gruppe konnte nicht gefunden werden.`;

        } else if (msg.startsWith('user not found:')) {
            return $localize`Das Profil konnte nicht gefunden werden.`;

        } else if (msg.startsWith('user already exists:')) {
            return $localize`Server Fehler: Dieses Profil existiert bereits.`;

        } else if (msg.startsWith('element not found:')) {
            return $localize`Der Favorit konnte nicht gefunden werden.`;

        } else if (msg === 'task not found') {
            return $localize`Die von Ihnen angegebene PIN ist ungültig.`;

        } else if (msg === 'missing pin') {
            return $localize`Bitte geben Sie für diese Aktion eine PIN an.`;

        } else if (msg === 'duplicate pin') {
            return $localize`Server Fehler: Diese PIN ist mehrfach vorhanden.`;

        } else if (msg === 'internal server: duplicate pin') {
            return $localize`Server Fehler: Es wurde eine doppelte PIN generiert.`;

        } else if (msg.startsWith('form is not published yet')) {
            return $localize`Diese Aktion ist nicht möglich, da das Formular noch nicht publiziert wurde.`;

        } else if (msg.startsWith('form is already published')) {
            return $localize`Diese Aktion ist nicht möglich, da das Formular bereits publiziert wurde.`;

        } else if (msg.startsWith('form is already cancelled')) {
            return $localize`Diese Aktion ist nicht möglich, da das Formular bereits geschlossen wurde.`;

        } else if (msg.startsWith('form is not public')) {
            return $localize`Diese Aktion ist mit durch PINs geschützten Formularen nicht möglich.`;

        } else if (msg.startsWith('form is public: no pin needed')) {
            return $localize`Diese Aktion erfordert keine PIN, da das Formular öffentlich ist.`;

        } else if (msg.startsWith('cannot delete form with open tasks')) {
            return $localize`Das Formular kann nicht gelöscht werden, wenn es noch offene Antworten gibt.`;

        } else if (msg.startsWith('cannot create tasks for forms with public access')) {
            return $localize`Diese Aktion ist mit öffentlichen Formularen nicht möglich.`;

        } else if (msg.startsWith('The property type is incorrect in the object')) {
            return $localize`Das Dokument ist kein gültiges Formular.`;
        }

        return msg;
    }
}

export interface GetGroupTagParams {
    filter?: GroupTagFilter;
    desc?: boolean;
    limit?: number;
    offset?: number;
}

export interface GetUsersParams {
    fields?: Array<UserField>;
    filter?: UserFilter;
    sort?: UserSort;
    limit?: number;
    offset?: number;
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
