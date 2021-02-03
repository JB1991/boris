import { Component, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { environment } from '@env/environment';

import { EditorComponent } from './editor.component';
import { StorageService } from './storage.service';
import { HistoryService } from './history.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { SurveyjsModule } from '@app/fragebogen/surveyjs/surveyjs.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormAPIService } from '../formapi.service';

/* eslint-disable max-lines */
describe('Fragebogen.Editor.EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    const formContent = require('../../../assets/fragebogen/form-content.json');
    const getForm = require('../../../assets/fragebogen/get-form.json');
    const getElements = require('../../../assets/fragebogen/get-elements.json');
    const getElement = require('../../../assets/fragebogen/get-element.json');

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                NgxSmoothDnDModule,
                CollapseModule.forRoot(),
                SurveyjsModule,
                SharedModule
            ],
            providers: [
                Title,
                StorageService,
                HistoryService,
                AlertsService,
                LoadingscreenService,
                FormAPIService
            ],
            declarations: [
                EditorComponent,
                MockElementModalComponent,
                MockFormularModalComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;

        spyOn(console, 'log');
        spyOn(component.router, 'navigate');
        spyOn(component.alerts, 'NewAlert');
        spyOn(component.cdr, 'detectChanges');
        fixture.detectChanges();
    }));

    /**
     * ONINIT AND DESTROY
     */
    it('should create', () => {
        expect(component).toBeTruthy();
        spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('123');
        spyOn(component, 'loadData');
        component.ngOnInit();
        expect(component.loadData).toHaveBeenCalledTimes(1);
        expect(component.loadData).toHaveBeenCalledWith('123');
    });

    it('should destroy', () => {
        component.timerHandle = setTimeout(() => null, 100);
        component.ngOnDestroy();
        expect(component.timerHandle).toBeNull();
    });

    /**
     * CAN DEACTIVATE
     */
    it('should not leave page', () => {
        expect(component.canDeactivate()).toBeTrue();
        spyOn(window, 'confirm').and.returnValue(true);

        environment.production = true;
        expect(component.canDeactivate()).toEqual(!component.storage.getUnsavedChanges());
        environment.production = false;
    });

    /**
     * ON SCROLL
     */
    it('should onScroll/onResize', () => {
        const tb = document.getElementById('toolbox').parentElement;

        // small screen, not scrolled
        (window as any).innerWidth = 450;
        component.onScroll(null);
        component.onResize(null);
        expect(tb.style.marginTop).toEqual('0px');

        // wide screen, scrolled
        (window as any).innerWidth = 1024;
        (window as any).pageYOffset = 10000;
        component.onScroll(null);
        component.onResize(null);

        // wide screen, not scrolled
        (window as any).pageYOffset = 0;
        component.onScroll(null);
        expect(tb.style.marginTop).toEqual('0px');
    });

    /**
     * LOAD DATA
     */
    it('should load data', (done) => {
        spyOn(component.formapi, 'getForm').and.returnValue(Promise.resolve(getForm));
        spyOn(component.formapi, 'getElements').and.returnValue(Promise.resolve(getElements));
        component.loadData('123').then(() => {
            clearTimeout(component.timerHandle);
            expect(component.storage.model).toEqual(getForm.form.content);
            done();
        });
    });

    it('should error to load data', (done) => {
        spyOn(component.formapi, 'getForm').and.returnValue(Promise.reject('Failed to load data'));
        component.loadData('123').then(() => {
            expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
            expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Laden fehlgeschlagen',
                'Failed to load data');
            done();
        });
    });

    it('should fail to load data', (done) => {
        // expect crash
        component.loadData(null).catch((error) => {
            expect(error.toString()).toEqual('Error: id is required');
            done();
        });
    });

    /**
     * OnDropPagination
     */
    it('should drag and drop pagination', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('rating');

        // do nothing
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadToolbox(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
        expect(component.storage.model.pages.length).toEqual(1);

        // drag page 1 onto position 0
        component.wsPageCreate();
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadPagination(1) });
        expect(component.storage.model.pages[0].elements.length).toEqual(0);
        expect(component.storage.model.pages[1].elements.length).toEqual(4);

        // drag element into other page
        component.storage.selectedPageID = 1;
        component.onDropPagination({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadWorkspace(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(1);
        expect(component.storage.model.pages[1].elements.length).toEqual(3);

        // drag element into same page as its from
        component.onDropPagination({ removedIndex: 1, addedIndex: 2, payload: component.getPayloadWorkspace(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(1);
        expect(component.storage.model.pages[1].elements.length).toEqual(3);
    });

    it('should not drag and drop', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        component.onDropPagination(null);
        component.onDropPagination({ removedIndex: null, addedIndex: null });
        component.onDropPagination({ removedIndex: 0, addedIndex: 0 });

        component.onDropWorkspace(null);
        component.onDropWorkspace({ removedIndex: null, addedIndex: null });
        component.onDropWorkspace({ removedIndex: 0, addedIndex: 0 });

        expect(component.storage.model.pages[0].elements.length).toEqual(4);
        expect(() => {
            component.onDropWorkspace({ removedIndex: 10, addedIndex: 0, payload: component.getPayloadToolbox(99) });
        }).toThrowError('Could not create new Element');
    });

    it('should not leave page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.canDeactivate()).toBeTrue();
        spyOn(window, 'confirm').and.returnValue(true);

        environment.production = true;
        expect(component.canDeactivate()).toEqual(!component.storage.getUnsavedChanges());
        environment.production = false;
    });

    it('should canDeactivate', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.canDeactivate()).toBeTrue();
    });

    it('should drag and drop', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.shouldAcceptDropPagination({ groupName: 'pagination' }, null)).toBeTrue();
        expect(component.shouldAcceptDropPagination({ groupName: 'workspace' }, null)).toBeTrue();
        expect(component.shouldAcceptDropPagination({ groupName: 'toolbox' }, null)).toBeFalse();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'pagination' }, null)).toBeFalse();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'workspace' }, null)).toBeTrue();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'favorites' }, null)).toBeTrue();
        expect(component.shouldAcceptDropWorkspace({ groupName: 'toolbox' }, null)).toBeTrue();
        expect(component.getPayloadToolbox(1)).toEqual({ from: 'toolbox', index: 1 });
        expect(component.getPayloadPagination(1)).toEqual({ from: 'pagination', index: 1 });
        expect(component.getPayloadWorkspace(1)).toEqual({ from: 'workspace', index: 1 });
    });

    /**
     * wsNewElement
     */
    it('should make new element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(4);

        // add element
        component.wsNewElement('radiogroup');
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(5);

        // add copied element
        component.elementCopy = JSON.stringify({ title: 'A', name: 'x', type: 'comment' });
        component.wsNewElement('elementcopy');
        expect(component.storage.model.pages[component.storage.selectedPageID].elements.length).toEqual(6);
    });

    it('should crash new element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsNewElement('toast');
        }).toThrowError('type is not a known element');
        expect(() => {
            component.wsNewElement('');
        }).toThrowError('type is required');
    });

    /**
     * wsPageCreate
     */

    it('should make new page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.storage.model.pages.length).toEqual(1);
        component.wsPageCreate();
        component.wsPageCreate(0);
        expect(component.storage.model.pages.length).toEqual(3);
    });

    it('should crash new page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsPageCreate(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageCreate(2);
        }).toThrowError('page is invalid');
    });

    /**
     * wsPageDelete
     */
    it('should delete page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        spyOn(window, 'confirm').and.returnValue(true);
        component.wsPageCreate();

        // delete new page
        component.storage.selectedPageID = 0;
        component.wsPageDelete(1);
        expect(component.storage.model.pages.length).toEqual(1);
        expect(component.storage.model.pages[0].elements.length).toEqual(4);

        // delete last page
        component.storage.selectedPageID = 3;
        component.wsPageDelete(0);
        expect(component.storage.selectedPageID).toEqual(0);
        expect(component.storage.model.pages.length).toEqual(1);
        expect(component.storage.model.pages[0].elements.length).toEqual(0);
    });

    it('should not delete page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        spyOn(window, 'confirm').and.returnValue(false);
        component.wsPageCreate();
        component.wsPageDelete(1);
        expect(component.storage.model.pages.length).toEqual(2);
    });

    it('should crash delete page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsPageDelete(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageDelete(1);
        }).toThrowError('page is invalid');
    });

    /**
     * wsPageSelect
     */
    it('should change page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.storage.selectedPageID).toEqual(0);
        component.wsPageCreate();
        component.wsPageSelect(1);
        expect(component.storage.selectedPageID).toEqual(1);

        // select page
        component.wsPageSelect(0);
        expect(component.storage.selectedPageID).toEqual(0);
    });

    it('should crash change page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsPageSelect(-1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsPageSelect(1);
        }).toThrowError('page is invalid');
    });

    /**
     * wsPageCopy
     */
    it('should copy element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        component.wsNewElement('text');
        component.wsElementCopy(0, 0);
        expect(component.elementCopy).toEqual('{"title":{},"description":{},"name":"e1","type":"text","inputType":"text","startWithNewLine":true,"visible":true,"isRequired":true,"requiredErrorText":{}}');
        component.wsElementCopy(0);
        expect(component.elementCopy).toEqual('{"title":{},"description":{},"name":"e1","type":"text","inputType":"text","startWithNewLine":true,"visible":true,"isRequired":true,"requiredErrorText":{}}');
    });

    it('should crash copy element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsElementCopy(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementCopy(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementCopy(-1);
        }).toThrowError('element is invalid');
    });

    /**
     * wsElementRemove
     */
    it('should remove element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        spyOn(window, 'confirm').and.returnValue(true);
        expect(component.storage.model.pages[0].elements.length).toEqual(4);

        // delete element
        component.wsElementRemove(0);
        expect(component.storage.model.pages[0].elements.length).toEqual(3);
    });

    it('should not remove element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        spyOn(window, 'confirm').and.returnValue(false);
        expect(component.storage.model.pages[0].elements.length).toEqual(4);

        // delete element
        component.wsElementRemove(0, 0);
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
    });

    it('should crash remove element', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsElementRemove(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementRemove(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementRemove(-1);
        }).toThrowError('element is invalid');
    });

    /**
     * wsSave
     */
    it('should save formular', fakeAsync(() => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.resolve(getForm));
        component.storage.setUnsavedChanges(true);
        component.wsSave();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('success', 'Speichern erfolgreich', '');
    }));

    it('should fail to save formular', fakeAsync(() => {
        spyOn(component.formapi, 'updateForm').and.returnValue(Promise.reject('Failed to save formular'));
        component.storage.setUnsavedChanges(true);
        component.wsSave();
        tick();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.alerts.NewAlert).toHaveBeenCalledWith('danger', 'Speichern fehlgeschlagen', 'Failed to save formular');
    }));

    it('should not save formular', fakeAsync(() => {
        // no changes
        component.storage.setAutoSaveEnabled(true);
        component.storage.setUnsavedChanges(false);
        component.wsSave();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);

        // autosave disabled
        component.storage.setAutoSaveEnabled(false);
        component.storage.setUnsavedChanges(true);
        component.wsSave();
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(0);
    }));

    /**
     * wsElementMoveup
     */
    it('should move element up', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        component.wsNewElement('comment');
        component.wsElementMoveup(1);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('rating');

        // cant move up
        component.wsElementMoveup(0);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('rating');
    });

    it('should crash move element up', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsElementMoveup(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMoveup(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMoveup(-1);
        }).toThrowError('element is invalid');
    });

    /**
     * wsElementMovedown
     */
    it('should move element down', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        component.wsNewElement('comment');
        component.wsElementMovedown(0);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('rating');

        // cant move down
        component.wsElementMovedown(4);
        expect(component.storage.model.pages[0].elements[4].type).toEqual('comment');
    });

    it('should crash move element down', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));

        expect(() => {
            component.wsElementMovedown(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMovedown(0, 1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementMovedown(-1);
        }).toThrowError('element is invalid');
    });

    /**
     * wsElementToPage
     */
    it('should move element to other page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        component.wsPageCreate();
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
        expect(component.storage.model.pages[1].elements.length).toEqual(0);
        component.wsElementToPage(0, 0, 1, 0);
        expect(component.storage.model.pages[0].elements.length).toEqual(3);
        expect(component.storage.model.pages[1].elements.length).toEqual(1);
        expect(component.storage.model.pages[1].elements[0].type).toEqual('rating');
    });

    it('should crash move element to other page', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        component.wsPageCreate();

        expect(() => {
            component.wsElementToPage(0, -1, 1, 0);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementToPage(0, 2, 1, 0);
        }).toThrowError('page is invalid');
        expect(() => {
            component.wsElementToPage(-1, 0, 1, 0);
        }).toThrowError('element is invalid');
        expect(() => {
            component.wsElementToPage(5, 0, 1, 0);
        }).toThrowError('element is invalid');

        expect(() => {
            component.wsElementToPage(0, 0, -1, 0);
        }).toThrowError('newPage is invalid');
        expect(() => {
            component.wsElementToPage(0, 0, 2, 0);
        }).toThrowError('newPage is invalid');
        expect(() => {
            component.wsElementToPage(0, 0, 1, -1);
        }).toThrowError('newElement is invalid');
        expect(() => {
            component.wsElementToPage(0, 0, 1, 3);
        }).toThrowError('newElement is invalid');

        expect(() => {
            component.wsElementToPage(0, 0, 0);
        }).toThrowError('newPage is invalid');
    });

    /**
     * onDropWorkspace
     */
    it('should drag and drop workspace', () => {
        component.storage.model = JSON.parse(JSON.stringify(formContent));
        expect(component.storage.model.pages[0].elements.length).toEqual(4);
        expect(component.storage.model.pages[0].elements[0].type).toEqual('rating');

        // do nothing
        component.onDropWorkspace({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadPagination(0) });
        expect(component.storage.model.pages[0].elements.length).toEqual(4);

        // drag new element into workspace
        component.onDropWorkspace({ removedIndex: 0, addedIndex: 1, payload: component.getPayloadToolbox(1) });
        expect(component.storage.model.pages[0].elements[1].type).toEqual('comment');
        expect(component.storage.model.pages[0].elements.length).toEqual(5);

        // drag element 1 onto position 0
        component.onDropWorkspace({ removedIndex: 1, addedIndex: 0, payload: component.getPayloadWorkspace(1) });
        expect(component.storage.model.pages[0].elements[0].type).toEqual('comment');
        expect(component.storage.model.pages[0].elements[1].type).toEqual('rating');

        // drag copied element into workspace
        component.elementCopy = JSON.stringify({ title: 'A', name: 'x', type: 'imagepicker' });
        component.onDropWorkspace({ removedIndex: 10, addedIndex: 0, payload: component.getPayloadToolbox(99) });
        expect(component.storage.model.pages[0].elements[0].type).toEqual('imagepicker');
        expect(component.storage.model.pages[0].elements.length).toEqual(6);

        // drag favorite into workspace
        component.favorites = [{ content: { type: 'test' } }];
        component.onDropWorkspace({ removedIndex: 0, addedIndex: 1, payload: component.getPayloadFavorites(0) });
        expect(component.storage.model.pages[0].elements[1].type).toEqual('test');
        expect(component.storage.model.pages[0].elements.length).toEqual(7);
    });

    it('should not drag and drop workspace', () => {
        expect(() => {
            component.onDropWorkspace({ removedIndex: 0, addedIndex: 1, payload: component.getPayloadFavorites(0) });
        }).toThrowError('Could not insert favorite');
    });

    /**
     * Favorites
     */
    it('should check if is favorite', () => {
        component.favorites = [{
            content: {
                title: 'ABC',
                name: ''
            }
        }];

        expect(component.isFavorite({ title: 'ABC', name: '' })).toEqual(1);
        expect(component.isFavorite({ title: 'DEF', name: '' })).toBeNull();
    });

    it('should insert favorite', () => {
        component.favorites = [{
            content: {
                title: 'ABC',
                name: ''
            }
        }];

        expect(component.storage.model.pages[0].elements.length).toEqual(1);
        component.insertFavorite(0);
        expect(component.storage.model.pages[0].elements.length).toEqual(2);
    });

    it('should fail insert favorite', () => {
        expect(() => {
            component.insertFavorite(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.insertFavorite(3);
        }).toThrowError('i is invalid');
    });

    it('should not add favorite', () => {
        spyOn(component.formapi, 'createElement');
        component.storage.model.pages[0].elements[0].title.default = '';
        component.addFavorite(0);
        expect(component.alerts.NewAlert).toHaveBeenCalledTimes(1);
        expect(component.formapi.createElement).toHaveBeenCalledTimes(0);
    });

    it('should add favorite', fakeAsync(() => {
        spyOn(component.formapi, 'createElement').and.returnValue(Promise.resolve(getElement));

        component.addFavorite(0);
        tick();

        expect(component.favorites.length).toEqual(1);
    }));

    it('should fail add favorite', fakeAsync(() => {
        spyOn(component.formapi, 'createElement').and.returnValue(Promise.reject('Failed'));
        component.addFavorite(0);
        tick();

        expect(component.favorites.length).toEqual(0);
    }));

    it('should crash add favorite', () => {
        expect(() => {
            component.addFavorite(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.addFavorite(3);
        }).toThrowError('element is invalid');
        expect(() => {
            component.addFavorite(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.addFavorite(0, 3);
        }).toThrowError('page is invalid');
    });

    it('should del favorite', fakeAsync(() => {
        spyOn(component.formapi, 'deleteElement').and.returnValue(Promise.resolve({ id: '123', status: 200 }));
        component.favorites = [
            { content: JSON.parse(JSON.stringify(component.storage.model.pages[0].elements[0])) }
        ];
        component.favorites[0].content.name = '';
        expect(component.favorites.length).toEqual(1);

        component.delFavorite(0);
        tick();
        expect(component.favorites.length).toEqual(0);
    }));

    it('should fail del favorite', fakeAsync(() => {
        spyOn(component.formapi, 'deleteElement').and.returnValue(Promise.reject('Failed'));
        component.favorites = [
            { content: JSON.parse(JSON.stringify(component.storage.model.pages[0].elements[0])) }
        ];
        component.favorites[0].content.name = '';
        expect(component.favorites.length).toEqual(1);

        component.delFavorite(0);
        tick();
        expect(component.favorites.length).toEqual(1);
    }));

    it('should not del favorite', () => {
        spyOn(component.formapi, 'deleteElement');
        component.delFavorite(0);
        expect(component.formapi.deleteElement).toHaveBeenCalledTimes(0);
    });

    it('should crash del favorite', () => {
        expect(() => {
            component.delFavorite(-1);
        }).toThrowError('element is invalid');
        expect(() => {
            component.delFavorite(3);
        }).toThrowError('element is invalid');
        expect(() => {
            component.delFavorite(0, -1);
        }).toThrowError('page is invalid');
        expect(() => {
            component.delFavorite(0, 3);
        }).toThrowError('page is invalid');
    });
});

@Component({
    selector: 'power-forms-editor-question-settings',
    template: ''
})
class MockElementModalComponent {
    @Input() public model: any;
}
@Component({
    selector: 'power-forms-editor-formular-settings',
    template: ''
})
class MockFormularModalComponent {
    @Input() public model: any;
}
