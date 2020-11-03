import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';

import { FormAPIService } from './formapi.service';
import { AuthService } from '@app/shared/auth/auth.service';
import { ElementFilterToString, FormFilterToString, TaskFilterToString, UserFilterToString } from './formapi.converter';

describe('Fragebogen.FormAPIService', () => {
    let service: FormAPIService;
    let httpTestingController: HttpTestingController;

    const getForms = require('../../assets/fragebogen/get-forms.json');
    const getForm = require('../../assets/fragebogen/get-form.json');
    const formContent = require('../../assets/fragebogen/form-content.json');
    const getTasks = require('../../assets/fragebogen/get-tasks.json');
    const getTask = require('../../assets/fragebogen/get-task.json');
    const taskContent = require('../../assets/fragebogen/task-content.json');
    const getElements = require('../../assets/fragebogen/get-elements.json');
    const getElement = require('../../assets/fragebogen/get-element.json');
    const elementContent = require('../../assets/fragebogen/element-content.json');
    const getTags = require('../../assets/fragebogen/get-tags.json');
    const getGroups = require('../../assets/fragebogen/get-groups.json');
    const getPublicTask = require('../../assets/fragebogen/get-public-task.json');
    const getPublicForms = require('../../assets/fragebogen/get-public-forms.json');
    const getPublicForm = require('../../assets/fragebogen/get-public-form.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                AuthService
            ]
        });
        service = TestBed.inject(FormAPIService);
        httpTestingController = TestBed.inject(HttpTestingController);
        spyOn(console, 'log');
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /*
        SUCCESS
    */

    it('getTags should succeed', (done) => {
        service.getTags().then((value) => {
            expect(value).toEqual(getTags['tags']);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tags',
            'GET', getTags);
    });

    it('getGroups should succeed', (done) => {
        service.getGroups().then((value) => {
            expect(value).toEqual(getGroups['groups']);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'groups',
            'GET', getGroups);
    });

    it('getForms should succeed', (done) => {
        service.getForms({}).then((value) => {
            expect(value).toEqual(getForms);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms?sort=id',
            'GET', getForms);
    });

    it('getForms should succeed', (done) => {
        service.getForms({
            fields: ['id'],
            'owner-fields': ['id'],
            extra: ['title.de', 'title.default'],
            filter: { id: '123' },
            sort: { orderBy: { field: 'content', path: ['title', 'de'] }, alternative: { field: 'content', path: ['title', 'de'] }, order: 'desc' },
            limit: 10,
            offset: 2,
        }).then((value) => {
            expect(value).toEqual(getForms);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms?fields=id&owner-fields=id&extra=title.de%2Ctitle.default&filter=id%3D123&sort=-%28content.title.de%2Ccontent.title.de%29%2Cid&limit=10&offset=2',
            'GET', getForms);
    });

    it('getForm should succeed', (done) => {
        service.getForm('123', {
            fields: ['id'],
            'owner-fields': ['id'],
            extra: ['title.de', 'title.default'],
        }).then((value) => {
            expect(value).toEqual(getForm);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123?fields=id&owner-fields=id&extra=title.de%2Ctitle.default',
            'GET', getForm);
    });

    it('createForm should succeed', (done) => {
        service.createForm({
            fields: ['id'],
            'owner-fields': ['id'],
            extra: ['title.de', 'title.default'],
        }, {
            content: formContent,
        }).then((value) => {
            expect(value).toEqual(getForm);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms?fields=id&owner-fields=id&extra=title.de%2Ctitle.default',
            'POST', getForm);
    });

    it('updateForm should succeed', (done) => {
        service.updateForm('123', {
            fields: ['id'],
            'owner-fields': ['id'],
            extra: ['title.de', 'title.default'],
        }, {
            content: formContent,
        }).then((value) => {
            expect(value).toEqual(getForm);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123?fields=id&owner-fields=id&extra=title.de%2Ctitle.default',
            'PUT', getForm);
    });

    it('deleteForm should succeed', (done) => {
        service.deleteForm('123').then((value) => {
            expect(value).toEqual({ id: '123', status: 200 });
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123',
            'DELETE', { id: '123', status: 200 });
    });

    it('getTasks should succeed', (done) => {
        service.getTasks({}).then((value) => {
            expect(value).toEqual(getTasks);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tasks?sort=pin',
            'GET', getTasks);
    });

    it('getTasks should succeed', (done) => {
        service.getTasks({
            fields: ['id'],
            'form-fields': ['id'],
            'owner-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
            filter: { id: '123' },
            sort: { orderBy: { field: 'content', path: ['e1'] }, alternative: { field: 'content', path: ['e2'] }, order: 'desc' },
            limit: 10,
            offset: 2,
        }).then((value) => {
            expect(value).toEqual(getTasks);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tasks?fields=id&form-fields=id&owner-fields=id&extra=e1&form-extra=title.default&filter=id%3D123&sort=-%28content.e1%2Ccontent.e2%29%2Cpin&limit=10&offset=2',
            'GET', getTasks);
    });

    it('getTask should succeed', (done) => {
        service.getTask('123', {
            fields: ['id'],
            'form-fields': ['id'],
            'owner-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
        }).then((value) => {
            expect(value).toEqual(getTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tasks/123?fields=id&form-fields=id&owner-fields=id&extra=e1&form-extra=title.default',
            'GET', getTask);
    });

    it('createTask should succeed', (done) => {
        service.createTask('123', {
            fields: ['id'],
            'form-fields': ['id'],
            'owner-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
        }, {
            content: taskContent,
        }, 10).then((value) => {
            expect(value).toEqual(getTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123?fields=id&form-fields=id&owner-fields=id&extra=e1&form-extra=title.default&number=10',
            'POST', getTask);
    });

    it('updateTask should succeed', (done) => {
        service.updateTask('123', {
            fields: ['id'],
            'form-fields': ['id'],
            'owner-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
        }, {
            content: taskContent,
        }).then((value) => {
            expect(value).toEqual(getTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tasks/123?fields=id&form-fields=id&owner-fields=id&extra=e1&form-extra=title.default',
            'PUT', getTask);
    });

    it('deleteTask should succeed', (done) => {
        service.deleteTask('123').then((value) => {
            expect(value).toEqual(getTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'tasks/123',
            'DELETE', getTask);
    });

    it('getElements should succeed', (done) => {
        service.getElements({}).then((value) => {
            expect(value).toEqual(getElements);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements?sort=id',
            'GET', getElements);
    });

    it('getElements should succeed', (done) => {
        service.getElements({
            fields: ['id'],
            extra: ['title.de', 'title.default'],
            filter: { id: '123' },
            sort: { orderBy: { field: 'content', path: ['title', 'de'] }, alternative: { field: 'content', path: ['title', 'de'] }, order: 'desc' },
            limit: 10,
            offset: 2,
        }).then((value) => {
            expect(value).toEqual(getElements);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements?fields=id&extra=title.de%2Ctitle.default&filter=id%3D123&sort=-%28content.title.de%2Ccontent.title.de%29%2Cid&limit=10&offset=2',
            'GET', getElements);
    });

    it('getElement should succeed', (done) => {
        service.getElement('123', {
            fields: ['id'],
            extra: ['title.de', 'title.default'],
        }).then((value) => {
            expect(value).toEqual(getElement);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements/123?fields=id&extra=title.de%2Ctitle.default',
            'GET', getElement);
    });

    it('createElement should succeed', (done) => {
        service.createElement({
            fields: ['id'],
            extra: ['title.de', 'title.default'],
        }, {
            content: elementContent,
        }).then((value) => {
            expect(value).toEqual(getElement);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements/?fields=id&extra=title.de%2Ctitle.default',
            'POST', getElement);
    });

    it('updateElement should succeed', (done) => {
        service.updateElement('123', {
            fields: ['id'],
            extra: ['title.de', 'title.default'],
        }, {
            content: elementContent,
        }).then((value) => {
            expect(value).toEqual(getElement);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements/123?fields=id&extra=title.de%2Ctitle.default',
            'PUT', getElement);
    });

    it('deleteElement should succeed', (done) => {
        service.deleteElement('123').then((value) => {
            expect(value).toEqual({ id: '123', status: 200 });
            done();
        });
        answerHTTPRequest(environment.formAPI + 'elements/123',
            'DELETE', { id: '123', status: 200 });
    });

    it('getPublicForms should succeed', (done) => {
        service.getPublicForms({}).then((value) => {
            expect(value).toEqual(getPublicForms);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/forms?sort=id',
            'GET', getPublicForms);
    });

    it('getPublicForms should succeed', (done) => {
        service.getPublicForms({
            fields: ['id'],
            extra: ['title.de', 'title.default'],
            filter: { id: '123' },
            sort: { orderBy: { field: 'content', path: ['title', 'de'] }, order: 'asc' },
            limit: 10,
            offset: 2,
        }).then((value) => {
            expect(value).toEqual(getPublicForms);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/forms?fields=id&extra=title.de%2Ctitle.default&filter=id%3D123&sort=content.title.de%2Cid&limit=10&offset=2',
            'GET', getPublicForms);
    });

    it('getPublicForm should succeed', (done) => {
        service.getPublicForm('123', {
            fields: ['id'],
            extra: ['title.de', 'title.default'],
        }).then((value) => {
            expect(value).toEqual(getPublicForm);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/forms/123?fields=id&extra=title.de%2Ctitle.default',
            'GET', getPublicForm);
    });

    it('createPublicTask should succeed', (done) => {
        service.createPublicTask('123', {
            fields: ['id'],
            extra: ['title.de', 'title.default'],
        }, {}).then((value) => {
            expect(value).toEqual(getPublicTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/forms/123?fields=id&extra=title.de%2Ctitle.default',
            'POST', getPublicTask);
    });

    it('getPublicTask should succeed', (done) => {
        service.getPublicTask('123', {
            fields: ['id'],
            'form-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
        }).then((value) => {
            expect(value).toEqual(getPublicTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/tasks/123?fields=id&form-fields=id&extra=e1&form-extra=title.default',
            'GET', getPublicTask);
    });

    it('updatePublicTask should succeed', (done) => {
        service.updatePublicTask('123', {
            fields: ['id'],
            'form-fields': ['id'],
            extra: ['e1'],
            'form-extra': ['title.default'],
        }, {}, true).then((value) => {
            expect(value).toEqual(getPublicTask);
            done();
        });
        answerHTTPRequest(environment.formAPI + 'public/tasks/123?fields=id&form-fields=id&extra=e1&form-extra=title.default&submit=true',
            'PUT', getPublicTask);
    });

    it('getCSV should succeed', (done) => {
        service.getCSV('123').then((value) => {
            expect(value).toEqual('Toast');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123/csv', 'GET', 'Toast');
    });

    // tslint:disable-next-line: max-func-body-length
    it('FormFilterToString should succeed', () => {
        const out = FormFilterToString({
            and: [
                {
                    or: [
                        {
                            group: 'Hello',
                        },
                        {
                            "group-permission": 'read-form'
                        },
                        {
                            "other-permission": 'update-form'
                        },
                        {
                            content: {
                                path: ['title'],
                                text: {
                                    equals: 'Hello',
                                    lower: true,
                                },
                            }
                        },
                        {
                            content: {
                                path: ['count'],
                                number: {
                                    less: 100
                                },
                            }
                        },
                        {
                            tag: {
                                contains: 'World',
                                lower: false,
                            }
                        },
                        {
                            access: 'public'
                        },
                        {
                            status: 'published'
                        },
                        {
                            created: {
                                before: '2020-10-31T21:26:30Z'
                            }
                        },
                        {
                            updated: {
                                after: '2020-10-31T21:26:30Z'
                            }
                        },
                        {
                            "has-owner-with": {
                                id: '123'
                            }
                        }
                    ]
                },
                {
                    not: {
                        id: '123',
                    }
                },
                {
                    and: [{ tag: { contains: 'Hello', lower: false } }]
                },
                {
                    or: [{ tag: { contains: 'World', lower: false } }]
                }
            ]
        });

        expect(out).toEqual('and(or(group=Hello,group-permission=read-form,other-permission=update-form,content.title-text-lower-equals=Hello,content.count-number-less=100,tag-contains=World,access=public,status=published,created-before=2020-10-31T21:26:30Z,updated-after=2020-10-31T21:26:30Z,has-owner-with(id=123)),not(id=123),tag-contains=Hello,tag-contains=World)');
    });

    // tslint:disable-next-line: max-func-body-length
    it('TaskFilterToString should succeed', () => {
        const out = TaskFilterToString({
            and: [
                {
                    or: [
                        {
                            pin: '123456',
                        },
                        {
                            "description": {
                                contains: "Hello",
                                lower: false,
                            }
                        },
                        {
                            content: {
                                path: ['count'],
                                number: {
                                    greater: 100,
                                },
                            }
                        },
                        {
                            status: 'created'
                        },
                        {
                            created: {
                                before: '2020-10-31T21:26:30Z'
                            }
                        },
                        {
                            updated: {
                                after: '2020-10-31T21:26:30Z'
                            }
                        },
                        {
                            'has-form-with': {
                                id: '123'
                            }
                        }
                    ]
                },
                {
                    not: {
                        id: '123',
                    }
                },
                {
                    and: [{ status: 'submitted' }]
                },
                {
                    or: [{ description: { contains: 'World', lower: false } }]
                }
            ]
        });

        expect(out).toEqual('and(or(pin=123456,description-contains=Hello,content.count-number-greater=100,status=created,created-before=2020-10-31T21:26:30Z,updated-after=2020-10-31T21:26:30Z,has-form-with(id=123)),not(id=123),status=submitted,description-contains=World)');
    });

    // tslint:disable-next-line: max-func-body-length
    it('UserFilterToString should succeed', () => {
        const out = UserFilterToString({
            and: [
                {
                    or: [
                        {
                            name: {
                                contains: 'World',
                                lower: false,
                            }
                        },
                        {
                            "given-name": {
                                contains: 'World',
                                lower: false,
                            }
                        },
                        {
                            "family-name": {
                                contains: 'World',
                                lower: false,
                            }
                        },
                        {
                            group: {
                                contains: 'World',
                                lower: false,
                            }
                        },
                    ]
                },
                {
                    not: {
                        id: '123',
                    }
                },
                {
                    and: [{ name: { contains: 'Hello', lower: false } }]
                },
                {
                    or: [{ group: { contains: 'World', lower: false } }]
                }
            ]
        });

        expect(out).toEqual('and(or(name-contains=World,given-name-contains=World,family-name-contains=World,group-contains=World),not(id=123),name-contains=Hello,group-contains=World)');
    });

    // tslint:disable-next-line: max-func-body-length
    it('ElementFilterToString should succeed', () => {
        const out = ElementFilterToString({
            and: [
                {
                    or: [
                        {
                            content: {
                                path: ['count'],
                                number: {
                                    equals: 100,
                                },
                            }
                        },
                        {
                            created: {
                                before: '2020-10-31T21:26:30Z'
                            }
                        },
                        {
                            updated: {
                                after: '2020-10-31T21:26:30Z'
                            }
                        },
                    ]
                },
                {
                    not: {
                        id: '123',
                    }
                },
                {
                    and: [{ id: '456' }]
                },
                {
                    or: [{ id: '456' }]
                }
            ]
        });

        expect(out).toEqual('and(or(content.count-number-equals=100,created-before=2020-10-31T21:26:30Z,updated-after=2020-10-31T21:26:30Z),not(id=123),id=456,id=456)');
    });

    /*
        HTTP ERRORS
    */

    it('getCSV should fail with empty response', (done) => {
        service.getCSV('123').catch((error) => {
            expect(error.toString()).toEqual('Error: API returned an empty response');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123/csv', 'GET', null);
    });

    it('getCSV should fail with http error', (done) => {
        service.getCSV('123').catch((error) => {
            expect(error.toString()).toEqual('Error: Http failure response for http://localhost:8080/rest/api/forms/123/csv: 404 Not Found');
            done();
        });
        answerHTTPRequest(environment.formAPI + 'forms/123/csv', 'GET', '',
            { status: 404, statusText: 'Not Found' });
    });

    it('getTags should fail', (done) => {
        service.getTags().catch(error => {
            expect(error.status).toEqual(400);
            done();
        });
        const request = httpTestingController.expectOne(environment.formAPI + 'tags');
        request.flush({}, {
            status: 400,
            statusText: 'bad request'
        });
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    function answerHTTPRequest(url, method, body, opts?) {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    }

    function deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();
    });
});
