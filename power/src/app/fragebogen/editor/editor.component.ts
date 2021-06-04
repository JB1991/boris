import {
    Component, OnInit, OnDestroy, HostListener,
    ViewChild, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
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
import { SEOService } from '@app/shared/seo/seo.service';

/* eslint-disable max-lines */
@Component({
    selector: 'power-formulars-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    @ViewChild('preview') public preview: PreviewComponent;
    public elementCopy: any;
    public isCollapsedToolBox = false;
    public timerHandle: NodeJS.Timeout;
    public favorites = [];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public alerts: AlertsService,
        public loadingscreen: LoadingscreenService,
        public storage: StorageService,
        public formapi: FormAPIService,
        public history: HistoryService,
        public cdr: ChangeDetectorRef,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Formular Editor - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Ausfüllen von online Formularen und Anträgen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Formulare, Anträge` });

        this.storage.resetService();
        this.history.resetService();
    }

    ngOnInit(): void {
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

    ngOnDestroy(): void {
        // delete auto save method
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
            this.timerHandle = null;
        }
    }

    /**
     * CTRL+Z event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.z', ['$event']) onUndoHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            this.history.undoChanges();
        }
    }

    /**
     * CTRL+Y event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.y', ['$event']) onRedoHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            this.history.redoChanges();
        }
    }

    /**
     * CTRL+S event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.s', ['$event']) onSaveHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsSave();
        }
    }

    /**
     * CTRL+V event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.v', ['$event']) onPasteHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsNewElement('elementcopy');
        }
    }

    /**
     * CTRL+P event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.p', ['$event']) onAddPageHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsPageCreate(this.storage.selectedPageID + 1);
        }
    }

    /**
     * CTRL+D event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.d', ['$event']) onDelPageHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            event.preventDefault();
            this.wsPageDelete(this.storage.selectedPageID);
        }
    }

    /**
     * Arrow left event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.arrowleft', ['$event']) onLeftPageHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            if (this.storage.selectedPageID !== 0) {
                this.wsPageSelect(this.storage.selectedPageID - 1);
            }
        }
    }

    /**
     * Arrow right event handler
     * @param event Event
     */
    /* istanbul ignore next */
    @HostListener('document:keydown.control.arrowright', ['$event']) onRightPageHandler(event: KeyboardEvent): void {
        if (this.storage.getAutoSaveEnabled()) {
            if (this.storage.selectedPageID < this.storage.model.pages.length - 1) {
                this.wsPageSelect(this.storage.selectedPageID + 1);
            }
        }
    }

    /**
     * canDeactivate event handler
     * @returns True if can leave page
     */
    @HostListener('window:beforeunload') canDeactivate(): boolean {
        // on test environment skip
        if (!environment.production) {
            return true;
        }
        return !this.storage.getUnsavedChanges();
    }

    /**
     * Scroll event handler
     * @param event Event
     */
    @HostListener('window:scroll', ['$event']) onScroll(event: Event): void {
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

    /**
     * Resize event handler
     * @param event Event
     */
    @HostListener('window:resize', ['$event']) onResize(event: Event): void {
        // check if not mobile device
        const div = document.getElementById('toolbox').parentElement;
        if (window.innerWidth < 992) {
            div.style.marginTop = '0px';
        }
    }

    /**
     * Load form data
     * @param id Form id
     * @returns Promise
     */
    public async loadData(id: string): Promise<void> {
        // check data
        if (!id) {
            throw new Error('id is required');
        }

        try {
            const result = await this.formapi.getForm(id, { fields: ['content'] });
            this.storage.model = result.form.content;
            this.migration();

            const elements = await this.formapi.getElements({ fields: ['id', 'content'] });
            this.favorites = elements.elements;
            this.cdr.detectChanges();

            // auto save
            /* istanbul ignore next */
            /* eslint-disable-next-line scanjs-rules/call_setInterval */
            this.timerHandle = setInterval(() => {
                this.wsSave();
            }, 5 * 60000);
            this.loadingscreen.setVisible(false);
        } catch (error) {
            // failed to load form
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, this.formapi.getErrorMessage(error));

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            return;
        }
    }

    /**
     * Migrates survey to newest version
     */
    /* istanbul ignore next */
    /* eslint-disable-next-line complexity */
    private migration(): void {
        for (const page of this.storage.model.pages) {
            for (const element of page.elements) {
                // convert imagepicker to imageselector
                if (element.type === 'imagepicker') {
                    element.type = 'imageselector';
                    this.storage.setUnsavedChanges(true);
                }
            }
        }
    }

    /**
     * Handles drag and drop into pagination zone
     * @param dropResult Event
     */
    public onDropPagination(dropResult: DropResult): void {
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
    public onDropWorkspace(dropResult: DropResult): void {
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

            // favorite dragged into workspace
        } else if (dropResult.payload.from === 'favorites') {
            if (this.favorites[dropResult.payload.index]) {
                this.history.makeHistory(this.storage.model);
                const data = JSON.parse(JSON.stringify(this.favorites[dropResult.payload.index].content));
                data.name = this.storage.newElementID();
                this.storage.model.pages[this.storage.selectedPageID].elements.splice(dropResult.addedIndex, 0, data);
            } else {
                throw new Error('Could not insert favorite');
            }
        }
    }

    /**
     * Returns true if drop down is enabled
     * @param sourceContainerOptions ContainerOptions
     * @param payload Payload
     * @returns True of should drag
     */
    public shouldAcceptDropPagination(sourceContainerOptions: ContainerOptions, payload: any): boolean {
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
     * @param sourceContainerOptions ContainerOptions
     * @param payload Payload
     * @returns True of should drag
     */
    public shouldAcceptDropWorkspace(sourceContainerOptions: ContainerOptions, payload: any): boolean {
        // enable drag from toolbox and workspace
        if (sourceContainerOptions.groupName === 'toolbox') {
            return true;
        } else if (sourceContainerOptions.groupName === 'favorites') {
            return true;
        } else if (sourceContainerOptions.groupName === 'workspace') {
            return true;
        }
        return false;
    }

    /**
     * Sets drop from infos
     * @param index id
     * @returns drag and drop info
     */
    public getPayloadToolbox(index: number): { from: string, index: number } {
        return { from: 'toolbox', index: index };
    }

    /**
     * Sets drop from infos
     * @param index id
     * @returns drag and drop info
     */
    public getPayloadFavorites(index: number): { from: string, index: number } {
        return { from: 'favorites', index: index };
    }

    /**
     * Sets drop from infos
     * @param index id
     * @returns drag and drop info
     */
    public getPayloadPagination(index: number): { from: string, index: number } {
        return { from: 'pagination', index: index };
    }

    /**
     * Sets drop from infos
     * @param index id
     * @returns drag and drop info
     */
    public getPayloadWorkspace(index: number): { from: string, index: number } {
        return { from: 'workspace', index: index };
    }

    /**
     * Creates new element
     * @param type Element identifier
     */
    public wsNewElement(type: string): void {
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
    public wsPageCreate(page: number = this.storage.model.pages.length): void {
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
    public wsPageDelete(page: number): void {
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
    public wsPageSelect(page: number): void {
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
    public wsSave(): void {
        // check for changes and if saving is enabled
        if (!this.storage.getUnsavedChanges() || !this.storage.getAutoSaveEnabled()) {
            return;
        }

        // saving data
        const id = this.route.snapshot.paramMap.get('id');

        this.formapi.updateForm(id, {
            content: this.storage.model,
        }).then(() => {
            // success
            this.storage.setUnsavedChanges(false);
            this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, '');
            this.cdr.detectChanges();
        }).catch((error: Error) => {
            // failed to save
            console.error(error);
            this.loadingscreen.setVisible(false);
            this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Copies element to clipboard
     * @param element Element number
     * @param page Page number
     */
    public wsElementCopy(element: number, page: number = this.storage.selectedPageID): void {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }

        // copy
        this.elementCopy = JSON.stringify(this.storage.model.pages[page].elements[element]);
        this.cdr.detectChanges();
        this.alerts.NewAlert('success', $localize`Erfolgreich kopiert`,
            $localize`Sie finden Ihre Zwischenablage ganz unten in der Toolbox.`);

        // scroll top
        /* eslint-disable-next-line scanjs-rules/call_setTimeout */
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
    public wsElementRemove(element: number, page: number = this.storage.selectedPageID): void {
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
    public wsElementMoveup(element: number, page: number = this.storage.selectedPageID): void {
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
    public wsElementMovedown(element: number, page: number = this.storage.selectedPageID): void {
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

    /**
     * Moves element to other page
     * @param element Element number
     * @param page Page number
     * @param newPage New Page number
     * @param newElement Place to insert element
     */
    public wsElementToPage(element: number, page: number, newPage: number, newElement = 0): void {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (newPage < 0 || newPage >= this.storage.model.pages.length) {
            throw new Error('newPage is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }
        if (newElement < 0 || newElement > this.storage.model.pages[newPage].elements.length) {
            throw new Error('newElement is invalid');
        }
        if (page === newPage) {
            throw new Error('newPage is invalid');
        }

        // move to other page
        this.history.makeHistory(this.storage.model);
        const tmp = this.storage.model.pages[page].elements.splice(element, 1)[0];
        this.storage.model.pages[newPage].elements.splice(newElement, 0, tmp);
    }

    /**
     * Adds favorite to workspace
     * @param i Favorite index
     */
    public insertFavorite(i: number): void {
        // check data
        if (i < 0 || i >= this.favorites.length) {
            throw new Error('i is invalid');
        }

        // add favorite
        this.history.makeHistory(this.storage.model);
        const data = JSON.parse(JSON.stringify(this.favorites[i].content));
        data.name = this.storage.newElementID();
        this.storage.model.pages[this.storage.selectedPageID].elements.splice(0, 0, data);
    }

    /**
     * Adds question as favorite
     * @param element Element number
     * @param page Page number
     */
    public addFavorite(element: number, page: number = this.storage.selectedPageID): void {
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }
        if (!this.storage.model.pages[page].elements[element].title.default) {
            this.alerts.NewAlert('warning', $localize`Kein Titel vorhanden`,
                $localize`Bitte geben Sie erst einen Fragetitel ein, um die Favoritenfunktion mit dieser Frage nutzen zu können.`);
            return;
        }

        // prepare data
        const question = JSON.parse(JSON.stringify(this.storage.model.pages[page].elements[element]));
        question.name = '';

        // add favorite
        this.formapi.createElement({ content: question }).then((data) => {
            data['content'] = question;
            this.favorites.push(data);
            this.cdr.detectChanges();
            this.alerts.NewAlert('success', $localize`Favoriten hinzugefügt`,
                $localize`Die Frage wurde erfolgreich als Favoriten hinzugefügt.`);
        }).catch((error) => {
            console.error(error);
            this.alerts.NewAlert('danger', $localize`Favoriten hinzufügen fehlgeschlagen`, this.formapi.getErrorMessage(error));
        });
    }

    /**
     * Deletes favorite
     * @param element Element number
     * @param page Page number
     */
    public delFavorite(element: number, page: number = this.storage.selectedPageID): void {
        // check data
        if (page < 0 || page >= this.storage.model.pages.length) {
            throw new Error('page is invalid');
        }
        if (element < 0 || element >= this.storage.model.pages[page].elements.length) {
            throw new Error('element is invalid');
        }

        // get id
        const index = this.isFavorite(this.storage.model.pages[page].elements[element]);
        if (!index) {
            return;
        }

        // delete favorite
        this.formapi.deleteElement(this.favorites[index - 1].id)
            .then((data) => {
                this.favorites.splice(index - 1, 1);
                this.cdr.detectChanges();
                this.alerts.NewAlert('success', $localize`Favoriten gelöscht`,
                    $localize`Die Frage wurde erfolgreich aus den Favoriten entfernt.`);
            }).catch((error) => {
                console.error(error);
                this.alerts.NewAlert('danger', $localize`Favorite löschen fehlgeschlagen`, this.formapi.getErrorMessage(error));
            });
    }

    /**
     * Checks if an element is a favorite
     * @param element Question
     * @returns Number of favorite, null if it is not a favorite
     */
    public isFavorite(element: any): number {
        // prepare data
        const question = JSON.parse(JSON.stringify(element));
        question.name = '';

        // check if already present
        for (let i = 0; i < this.favorites.length; i++) {
            if (JSON.stringify(question) === JSON.stringify(this.favorites[i].content)) {
                return i + 1;
            }
        }
        return null;
    }

    /**
     * Returns question svg
     * @param type Question type
     * @returns Icon svg code
     */
    public getIcon(type: string): string {
        return this.storage.FormularFields.filter(p => p.type === type)[0].icon;
    }
}
