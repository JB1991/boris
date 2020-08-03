import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * HistoryService creates snapshots of the data model to undo and redo changes
 */
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  public undoBuffer: any = [];
  public redoBuffer: any = [];
  public undoIndex = 0;
  public redoIndex = 0;

  constructor(public storage: StorageService) { }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.undoBuffer = [];
    this.redoBuffer = [];
    this.undoIndex = 0;
    this.redoIndex = 0;
  }

  /**
   * Creates history to undo things
   * @param data JSON data
   * @param del True to delete future
   */
  public makeHistory(data: any, del = true) {
    // check data
    if (!data) {
      return;
    }
    this.storage.setUnsavedChanges(true);
    this.undoBuffer[this.undoIndex] = JSON.stringify(data);
    this.undoIndex++;

    // limit size
    if (this.undoIndex > 10) {
      this.undoIndex--;
      this.undoBuffer.splice(0, 1);
    }

    // delete future
    if (del) {
        this.redoBuffer = [];
        this.redoIndex = 0;
    }
  }

  /**
   * Creates future to redo things
   * @param data JSON data
   */
  public makeFuture(data: any) {
    // check data
    if (!data) {
      return;
    }
    this.storage.setUnsavedChanges(true);
    this.redoBuffer[this.redoIndex] = JSON.stringify(data);
    this.redoIndex++;

    // limit size
    if (this.redoIndex > 10) {
      this.redoIndex--;
      this.redoBuffer.splice(0, 1);
    }
  }

  /**
   * Undo last change
   */
  public undoChanges(): boolean {
    // check if future exists
    if (this.undoIndex < 1) {
      return false;
    }

    // reduce index
    this.undoIndex--;
    if (typeof this.undoBuffer[this.undoIndex] === 'undefined') {
      return false;
    }

    // restore
    this.makeFuture(this.storage.model);
    this.storage.model = JSON.parse(this.undoBuffer[this.undoIndex]);
    this.undoBuffer.splice(this.undoIndex, 1);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
    return true;
  }

  /**
   * Redo last change
   */
  public redoChanges(): boolean {
    // check if history exists
    if (this.redoIndex < 1) {
      return false;
    }

    // reduce index
    this.redoIndex--;
    if (typeof this.redoBuffer[this.redoIndex] === 'undefined') {
      return false;
    }

    // restore
    this.makeHistory(this.storage.model, false);
    this.storage.model = JSON.parse(this.redoBuffer[this.redoIndex]);
    this.redoBuffer.splice(this.redoBuffer, 1);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
    return true;
  }
}
