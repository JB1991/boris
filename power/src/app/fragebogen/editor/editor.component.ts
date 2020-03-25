import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DropResult } from 'ngx-smooth-dnd';

import { AlertsService } from '../alerts/alerts.service';
import { ComponentCanDeactivate } from '../pendingchanges.guard';
import { StorageService } from './storage.service';
import { HistoryService } from './history.service';
import { environment } from '../../../environments/environment';
import { LoadingscreenService } from '../loadingscreen/loadingscreen.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, ComponentCanDeactivate {
  public isCollapsedToolBox = false;
  public isCollapsed: any = [];
  public elementCopy: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private alerts: AlertsService,
              public loadingscreen: LoadingscreenService,
              public storage: StorageService,
              public history: HistoryService) {
      this.titleService.setTitle('Formular Editor - POWER.NI');
      this.storage.ResetService();
      this.history.ResetService();
  }

  ngOnInit() {
    // load formular from server
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadingscreen.setVisible(true);
      this.storage.FormularLoad(id).subscribe((data) => {
        // check for error
        if (!data || data['Error']) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', data['Error']);
          throw new Error('Could not load formular with id: ' + id);
        }

        // store formular
        this.storage.model = data['Form']['data'];
        this.loadingscreen.setVisible(false);
      }, (error: Error) => {
        // failed to load
        this.router.navigate([''], { replaceUrl: true });
        this.loadingscreen.setVisible(false);

        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
        throw error;
      });
    }

    this.ClearCollapsed();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // on test environment skip
    if (!environment.production) return true;
    return !this.storage.GetUnsavedChanges();
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
      this.history.MakeHistory(this.storage.model);
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
      this.history.MakeHistory(this.storage.model);
      this.isCollapsed.splice(dropResult.payload.index, 1);
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
      this.history.MakeHistory(this.storage.model);
      moveItemInArray(this.isCollapsed, dropResult.removedIndex, dropResult.addedIndex);
      moveItemInArray(this.storage.model.pages[this.storage.selectedPageID].elements, dropResult.removedIndex, dropResult.addedIndex);

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

      this.history.MakeHistory(this.storage.model);
      data.name = this.storage.NewElementID();
      this.isCollapsed.splice(dropResult.addedIndex, 0, window.innerWidth <= 767);
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

    this.history.MakeHistory(this.storage.model);
    data.name = this.storage.NewElementID();
    this.isCollapsed.splice(0, 0, window.innerWidth <= 767);
    this.storage.model.pages[this.storage.selectedPageID].elements.splice(0, 0, data);
  }

  /**
   * Adds new page to the end or after given page
   * @param page Page number
   */
  public wsPageCreate(page: number = this.storage.model.pages.length - 1) {
    this.history.MakeHistory(this.storage.model);
    this.storage.model.pages.splice(page + 1, 0,
      {
        title: '',
        description: '',
        elements: [],
        questionsOrder: 'default',
        name: this.storage.NewPageID()
      }
    );
    this.storage.selectedPageID++;
    this.ClearCollapsed();
  }

  /**
   * Removes page id
   * @param page Page number
   */
  public wsPageDelete(page: number) {
    // ask user to confirm
    if (!confirm('Möchten Sie diese Seite wirklich löschen?')) {
      return;
    }
    this.history.MakeHistory(this.storage.model);
    this.storage.model.pages.splice(page, 1);

    // check if selected page is out of bounds
    if (this.storage.selectedPageID >= this.storage.model.pages.length && this.storage.selectedPageID > 0) {
      this.storage.selectedPageID--;
    }
    this.ClearCollapsed();

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
    this.ClearCollapsed();
  }

  /**
   * Saves changes to server
   */
  public wsSave() {
    // check for changes and if saving is enabled
    if (!this.storage.GetUnsavedChanges() || !this.storage.GetAutoSaveEnabled()) {
      return;
    }

    // saving data
    var id = this.route.snapshot.paramMap.get('id');
    this.storage.FormularSave(this.storage.model, id).subscribe((data) => {
      // check for error
      if (!data || data['Error']) {
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', data['Error']);
        throw new Error('Could not save formular with id: ' + id);
      }

      // success
      this.storage.SetUnsavedChanges(false);
      this.alerts.NewAlert('success', 'Speichern erfolgreich', '');

      // redirect to new id
      if (!id) {
        this.router.navigate(['editor', data['Form']['id']], { replaceUrl: true });
      }
    }, (error: Error) => {
      // failed to save
      this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', error['statusText']);
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
    if (!confirm('Möchten Sie das Element wirklich löschen?')) {
      return;
    }
    this.history.MakeHistory(this.storage.model);
    this.isCollapsed.splice(element, 1);
    this.storage.model.pages[page].elements.splice(element, 1);
  }


  /* HELPER FUNCTIONS */

  /**
   * Resets isCollapsed
   */
  public ClearCollapsed() {
    this.isCollapsed = [];

    // check screen width
    for (let i = 0; i < this.storage.model.pages[this.storage.selectedPageID].elements.length; i++) {
      if (window.innerWidth <= 767) {
        this.isCollapsed[i] = true;
      } else {
        this.isCollapsed[i] = false;
      }
    }
  }

  public sortX(): number {
    return 1;
  }

  public getIcon(type: string): string {
    return this.storage.FormularFields.filter(p => p.type === type)[0].icon;
  }
}
