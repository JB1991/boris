import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DropResult, ContainerOptions } from 'ngx-smooth-dnd';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { HistoryService } from './history.service';
import { ComponentCanDeactivate } from '@app/fragebogen/pendingchanges.guard';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { FormAPIService } from '../formapi.service';
import { PreviewComponent } from '../surveyjs/preview/preview.component';

@Component({
    selector: 'power-formulars-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    @ViewChild('preview') public preview: PreviewComponent;
    public elementCopy: any;
    public isCollapsedToolBox = false;
    public timerHandle: NodeJS.Timeout;

    constructor(public route: ActivatedRoute,
        public router: Router,
        public titleService: Title,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public storage: StorageService,
        public formapi: FormAPIService,
        public history: HistoryService) {
        this.titleService.setTitle($localize`Formular Editor - POWER.NI`);
        this.storage.resetService();
        this.history.resetService();
    }

    ngOnInit() {
        // get id
        this.loadingscreen.setVisible(true);
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // load data
            this.loadData(id);
        } else {
            // missing id
            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
        }

    }

    ngOnDestroy() {
        // delete auto save method
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
            this.timerHandle = null;
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.z', ['$event']) onUndoHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            this.history.undoChanges();
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.y', ['$event']) onRedoHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            this.history.redoChanges();
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.s', ['$event']) onSaveHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsSave();
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.v', ['$event']) onPasteHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsNewElement('elementcopy');
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.p', ['$event']) onAddPageHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsPageCreate(this.storage.selectedPageID + 1);
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.d', ['$event']) onDelPageHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsPageDelete(this.storage.selectedPageID);
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.arrowleft', ['$event']) onLeftPageHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            if (this.storage.selectedPageID !== 0) {
                this.wsPageSelect(this.storage.selectedPageID - 1);
            }
        }
    }

    /* istanbul ignore next */
    @HostListener('document:keydown.control.arrowright', ['$event']) onRightPageHandler(event: KeyboardEvent) {
        if (this.storage.getAutoSaveEnabled()) {
            if (this.storage.selectedPageID < this.storage.model.pages.length - 1) {
                this.wsPageSelect(this.storage.selectedPageID + 1);
            }
        }
    }

    @HostListener('window:beforeunload') canDeactivate(): boolean {
        // on test environment skip
        if (!environment.production) {
            return true;
        }
        return !this.storage.getUnsavedChanges();
    }

    @HostListener('window:scroll', ['$event']) onScroll(event) {
        const tb = document.getElementById('toolbox').parentElement;
        const fr = document.getElementById('favorites').parentElement;

        // check if not mobile device
        if (window.innerWidth >= 992) {
            // prevent scrolling too far
            if (tb.parentElement.clientHeight < (tb.clientHeight + fr.clientHeight + window.pageYOffset + 12)) {
                return;
            }
            tb.style.marginTop = window.pageYOffset + 'px';
        } else {
            tb.style.marginTop = '0px';
        }
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        // check if not mobile device
        const div = document.getElementById('toolbox').parentElement;
        if (window.innerWidth < 992) {
            div.style.marginTop = '0px';
        }
    }

    /**
     * Load form data
     * @param id Form id
     */
    // tslint:disable-next-line: max-func-body-length
    public async loadData(id: string) {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        try {
            const result = await this.formapi.getInternForm(id);
            this.storage.model = result.content;
            this.loadingscreen.setVisible(false);

            // auto save
            /* istanbul ignore next */
            this.timerHandle = setInterval(() => {
                this.wsSave();
            }, 5 * 60000);
        } catch (error) {
            //     // failed to load form
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            console.log(error);
            return;
        }
    }

    /**
     * Handles drag and drop into pagination zone
     * @param dropResult Event
     */
    public onDropPagination(dropResult: DropResult) {
        if (!dropResult) { return; }
        if (dropResult.addedIndex === null) { return; }
        if (dropResult.addedIndex === dropResult.removedIndex) { return; }

        // order of pages changed
        if (dropResult.payload.from === 'pagination') {
            this.history.makeHistory(this.storage.model);
            moveItemInArray(this.storage.model.pages, dropResult.removedIndex, dropResult.addedIndex);
            this.storage.selectedPageID = dropResult.addedIndex;

            // moved element to other page
        } else if (dropResult.payload.from === 'workspace') {
            if (dropResult.addedIndex >= this.storage.model.pages.length) {
                dropResult.addedIndex = this.storage.model.pages.length - 1;
            }
            if (dropResult.addedIndex === this.storage.selectedPageID) {
                return;
            }
            this.history.makeHistory(this.storage.model);
            transferArrayItem(
                this.storage.model.pages[this.storage.selectedPageID].elements,
                this.storage.model.pages[dropResult.addedIndex].elements,
                dropResult.payload.index,
                0
            );
        }
    }

    /**
     * Handles drag and drop into workspace zone
     * @param dropResult Event
     */
    public onDropWorkspace(dropResult: DropResult) {
        if (!dropResult) { return; }
        if (dropResult.addedIndex === null) { return; }
        if (dropResult.addedIndex === dropResult.removedIndex) { return; }

        // order of elements changed
        if (dropResult.payload.from === 'workspace') {
            this.history.makeHistory(this.storage.model);
            moveItemInArray(this.storage.model.pages[this.storage.selectedPageID].elements,
                dropResult.removedIndex, dropResult.addedIndex);

            // new element dragged into workspace
        } else if (dropResult.payload.from === 'toolbox') {
            let data;
            if (this.storage.FormularFields[dropResult.payload.index]) {
                data = JSON.parse(JSON.stringify(this.storage.FormularFields[dropResult.payload.index].template));
            } else if (this.elementCopy) {
                data = JSON.parse(this.elementCopy);
            } else {
                throw new Error('Could not create new Element');
            }

            this.history.makeHistory(this.storage.model);
            data.name = this.storage.newElementID();
            this.storage.model.pages[this.storage.selectedPageID].elements.splice(dropResult.addedIndex, 0, data);
        }
    }

    /**
     * Returns true if drop down is enabled
     * @param sourceContainerOptions
     * @param payload
     */
    public shouldAcceptDropPagination(sourceContainerOptions: ContainerOptions, payload): boolean {
        // enable drag from pagination and workspace
        if (sourceContainerOptions.groupName === 'pagination') {
            return true;
        } else if (sourceContainerOptions.groupName === 'workspace') {
            return true;
        }
        return false;
    }

    /**
     * Returns true if drop down is enabled
     * @param sourceContainerOptions
     * @param payload
     */
    public shouldAcceptDropWorkspace(sourceContainerOptions: ContainerOptions, payload): boolean {
        // enable drag from toolbox and workspace
        if (sourceContainerOptions.groupName === 'toolbox') {
            return true;
        } else if (sourceContainerOptions.groupName === 'workspace') {
            return true;
        }
        return false;
    }

    /**
     * Sets drop from infos
     * @param index id
     */
    public getPayloadToolbox(index: number): Object {
        return { from: 'toolbox', index: index };
    }

    /**
     * Sets drop from infos
     * @param index id
     */
    public getPayloadPagination(index: number): Object {
        return { from: 'pagination', index: index };
    }

    /**
     * Sets drop from infos
     * @param index id
     */
    public getPayloadWorkspace(index: number): Object {
        return { from: 'workspace', index: index };
    }

    /**
     * Creates new element
     * @param type Element identifier
     */
    public wsNewElement(type: string) {
        // check data
        if (!type) {
            throw new Error('type is required');
        }

        // get template
        let data = this.storage.FormularFields.filter(p => p.type === type)[0];
        if (data) {
            // toolbox element
            data = JSON.parse(JSON.stringify(data.template));
        } else if (type === 'elementcopy' && this.elementCopy) {
            // copied element
            data = JSON.parse(this.elementCopy);
        } else {
            // unkown element
            throw new Error('type is not a known element');
        }

        // create element
        this.history.makeHistory(this.storage.model);
        data.name = this.storage.newElementID();
        this.storage.model.pages[this.storage.selectedPageID].elements.splice(0, 0, data);
    }

    /**
     * Adds new page to the end or after given page
     * @param page Page number
     */
    public wsPageCreate(page: number = this.storage.model.pages.length) {
        // check data
        if (page < 0 || page > this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }

        // add
        this.history.makeHistory(this.storage.model);
        this.storage.model.pages.splice(page, 0, {
            title: {},
            description: {},
            elements: [],
            questionsOrder: 'default',
            visible: true,
            name: this.storage.newPageID()
        });
        this.storage.selectedPageID = page;
    }

    /**
     * Removes page id
     * @param page Page number
     */
    public wsPageDelete(page: number) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }

        // ask user to confirm
        if (!confirm($localize`Möchten Sie diese Seite wirklich löschen?`)) {
            return;
        }

        // delete
        this.history.makeHistory(this.storage.model);
        this.storage.model.pages.splice(page, 1);

        // ensure that at least one page exists
        if (this.storage.model.pages.length < 1) {
            this.storage.model.pages.splice(0, 0, {
                title: {},
                description: {},
                elements: [],
                questionsOrder: 'default',
                visible: true,
                name: 'p1'
            });
        }

        // check if selected page is out of bounds
        if (this.storage.selectedPageID >= this.storage.model.pages.length) {
            this.storage.selectedPageID = this.storage.model.pages.length - 1;
        }
    }

    /**
     * Changes currently selected page
     * @param page Page number
     */
    public wsPageSelect(page: number) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        // check if page is already selected
        if (page === this.storage.selectedPageID) {
            return;
        }
        this.storage.selectedPageID = page;
    }

    /**
     * Saves changes to server
     */
    public wsSave() {
        // check for changes and if saving is enabled
        if (!this.storage.getUnsavedChanges() || !this.storage.getAutoSaveEnabled()) {
            return;
        }

        // saving data
        const id = this.route.snapshot.paramMap.get('id');

        this.formapi.updateInternForm(id, this.storage.model).then(() => {
            // success
            this.storage.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, '');
        }).catch((error: Error) => {
            // failed to save
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, error.toString());
            this.loadingscreen.setVisible(false);

            console.log(error);
            return;
        });
    }

    /**
     * Copies element to clipboard
     * @param element Element number
     * @param page Page number
     */
    public wsElementCopy(element: number, page: number = this.storage.selectedPageID) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }

        // copy
        this.elementCopy = JSON.stringify(this.storage.model.pages[page].elements[element]);
        this.alerts.NewAlert('success', $localize`Erfolgreich kopiert`,
            $localize`Sie finden Ihre Zwischenablage ganz unten in der Toolbox.`);

        // scroll top
        setTimeout(() => {
            const div = document.getElementById('toolbox');
            /* istanbul ignore next */
            if (div) {
                document.getElementById('toolbox').scrollTop = 300;
            }
        }, 100);
    }

    /**
     * Removes element with id
     * @param element Element number
     * @param page Page number
     */
    public wsElementRemove(element: number, page: number = this.storage.selectedPageID) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }

        // ask user to confirm
        if (!confirm($localize`Möchten Sie das Element wirklich löschen?`)) {
            return;
        }

        // delete
        this.history.makeHistory(this.storage.model);
        this.storage.model.pages[page].elements.splice(element, 1);
    }

    /**
     * Moves element up
     * @param element Element number
     * @param page Page number
     */
    public wsElementMoveup(element: number, page: number = this.storage.selectedPageID) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }
        // check if element can move up
        if (element === 0) {
            return;
        }

        // move up
        this.history.makeHistory(this.storage.model);
        moveItemInArray(this.storage.model.pages[page].elements, element, element - 1);
    }

    /**
     * Moves element down
     * @param element Element number
     * @param page Page number
     */
    public wsElementMovedown(element: number, page: number = this.storage.selectedPageID) {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }
        // check if element can move down
        if (element === this.storage.model.pages[page].elements.length - 1) {
            return;
        }

        // move down
        this.history.makeHistory(this.storage.model);
        moveItemInArray(this.storage.model.pages[page].elements, element, element + 1);
    }
}
