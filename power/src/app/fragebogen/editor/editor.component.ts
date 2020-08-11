import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DropResult } from 'ngx-smooth-dnd';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { HistoryService } from './history.service';
import { ComponentCanDeactivate } from '@app/fragebogen/pendingchanges.guard';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, ComponentCanDeactivate {
  public elementCopy: any;
  public isCollapsedToolBox = false;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public titleService: Title,
              public alerts: AlertsService,
              public loadingscreen: LoadingscreenService,
              public storage: StorageService,
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

  @HostListener('window:beforeunload') canDeactivate(): Observable<boolean> | boolean {
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
      console.log(tb.parentElement.clientHeight);
      console.log(tb.clientHeight + fr.clientHeight + window.pageYOffset + 12);


      // prevent scrolling too far
      if (tb.parentElement.clientHeight < (tb.clientHeight + fr.clientHeight + window.pageYOffset + 12)) {
        return;
      }
      tb.style.marginTop = window.pageYOffset + 'px';
    } else {
      tb.style.marginTop = '0px';
    }
    document.body.focus();
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
  public loadData(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    this.storage.loadForm(id).subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data'] || !data['data']['content']) {
        const alertText = (data && data['error'] ? data['error'] : id);
        this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

        this.loadingscreen.setVisible(false);
        this.router.navigate(['/forms/dashboard'], {replaceUrl: true});
        console.log('Could not load form: ' + alertText);
        return;
      }

      // store formular
      this.storage.model = data['data']['content'];
      this.loadingscreen.setVisible(false);
    }, (error: Error) => {
      // failed to load form
      this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
      this.loadingscreen.setVisible(false);

      this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
      console.log(error);
      return;
    });
  }

  /**
   * Handles drag and drop into pagination zone
   * @param dropResult Event
   */
  public onDropPagination(dropResult: DropResult) {
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

  public shouldAcceptDropPagination(sourceContainerOptions, payload) {
    // enable drag from pagination and workspace
    if (sourceContainerOptions.groupName === 'pagination') {
      return true;
    } else if (sourceContainerOptions.groupName === 'workspace') {
      return true;
    }
    return false;
  }

  public shouldAcceptDropWorkspace(sourceContainerOptions, payload) {
    // enable drag from toolbox and workspace
    if (sourceContainerOptions.groupName === 'toolbox') {
      return true;
    } else if (sourceContainerOptions.groupName === 'workspace') {
      return true;
    }
    return false;
  }

  public getPayloadToolbox(index: number) {
    return {from: 'toolbox', index};
  }
  public getPayloadPagination(index: number) {
    return {from: 'pagination', index};
  }
  public getPayloadWorkspace(index: number) {
    return {from: 'workspace', index};
  }

  /**
   * Creates new element
   * @param type Element identifier
   */
  public wsNewElement(type: string) {
    let data = this.storage.FormularFields.filter(p => p.type === type)[0];
    if (data) {
      data = JSON.parse(JSON.stringify(data.template));
    } else if (this.elementCopy) {
      data = JSON.parse(this.elementCopy);
    } else {
      throw new Error('Could not create new Element');
    }

    this.history.makeHistory(this.storage.model);
    data.name = this.storage.newElementID();
    this.storage.model.pages[this.storage.selectedPageID].elements.splice(0, 0, data);
  }

  /**
   * Adds new page to the end or after given page
   * @param page Page number
   */
  public wsPageCreate(page: number = this.storage.model.pages.length - 1) {
    this.history.makeHistory(this.storage.model);
    this.storage.model.pages.splice(page + 1, 0,
      {
        title: '',
        description: '',
        elements: [],
        questionsOrder: 'default',
        name: this.storage.newPageID()
      }
    );
    this.storage.selectedPageID++;
  }

  /**
   * Removes page id
   * @param page Page number
   */
  public wsPageDelete(page: number) {
    // ask user to confirm
    if (!confirm($localize`Möchten Sie diese Seite wirklich löschen?`)) {
      return;
    }
    this.history.makeHistory(this.storage.model);
    this.storage.model.pages.splice(page, 1);

    // check if selected page is out of bounds
    if (this.storage.selectedPageID >= this.storage.model.pages.length && this.storage.selectedPageID > 0) {
      this.storage.selectedPageID--;
    }

    // ensure that at least one page exists
    if (this.storage.model.pages.length < 1) {
      this.storage.model.pages.splice(0, 0,
        {
          title: '',
          description: '',
          elements: [],
          questionsOrder: 'default',
          name: 'p1'
        }
      );
    }
  }

  /**
   * Changes currently selected page
   * @param page Page number
   */
  public wsPageSelect(page: number) {
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
    this.storage.saveForm(this.storage.model, id).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, (data['error'] ? data['error'] : id));
        throw new Error('Could not save formular: ' + (data['error'] ? data['error'] : id));
      }

      // success
      this.storage.setUnsavedChanges(false);
      this.alerts.NewAlert('success', $localize`Speichern erfolgreich`, '');

      // redirect to new id
      if (!id) {
        this.router.navigate(['forms', 'editor', encodeURIComponent(data['data']['id'])], { replaceUrl: true });
      }
    }, (error: Error) => {
      // failed to save
      this.alerts.NewAlert('danger', $localize`Speichern fehlgeschlagen`,
                           (error['error']['error'] ? error['error']['error'] : error['statusText']));
      throw error;
    });
  }

  /**
   * Copies element to clipboard
   * @param element Element number
   * @param page Page number
   */
  public wsElementCopy(element: number, page: number = this.storage.selectedPageID) {
    this.elementCopy = JSON.stringify(this.storage.model.pages[page].elements[element]);
  }

  /**
   * Removes element with id
   * @param element Element number
   * @param page Page number
   */
  public wsElementRemove(element: number, page: number = this.storage.selectedPageID) {
    // ask user to confirm
    if (!confirm($localize`Möchten Sie das Element wirklich löschen?`)) {
      return;
    }
    this.history.makeHistory(this.storage.model);
    this.storage.model.pages[page].elements.splice(element, 1);
  }
}
