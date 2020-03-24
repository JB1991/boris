import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * HistoryService creates snapshots of the data model to undo and redo changes
 */
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private UndoBuffer: any = [];
  private RedoBuffer: any = [];
  public UndoIndex = 0;
  public RedoIndex = 0;

  constructor(public storage: StorageService) { }

  /**
   * Resets service to empty model
   */
  public ResetService() {
    this.UndoBuffer = [];
    this.RedoBuffer = [];
    this.UndoIndex = 0;
    this.RedoIndex = 0;
  }

  /**
   * Creates history to undo things
   * @param data JSON data
   * @param del True to delete future
   */
  public MakeHistory(data: any, del: boolean = true) {
    this.storage.SetUnsavedChanges(true);
    this.UndoBuffer[this.UndoIndex] = JSON.stringify(data);
    this.UndoIndex++;

    // limit size
    if (this.UndoIndex > 10) {
      this.UndoIndex--;
      delete this.UndoBuffer[0];
    }

    // delete future
    if (del) {
        this.RedoBuffer = [];
        this.RedoIndex = 0;
    }
  }

  /**
   * Creates future to redo things
   * @param data JSON data
   */
  public MakeFuture(data: any) {
    this.storage.SetUnsavedChanges(true);
    this.RedoBuffer[this.RedoIndex] = JSON.stringify(data);
    this.RedoIndex++;

    // limit size
    if (this.RedoBuffer > 10) {
      this.RedoIndex--;
      delete this.RedoBuffer[0];
    }
  }

  /**
   * Undo last change
   * @param data JSON data
   */
  public UndoChanges(): any {
    // check if future exists
    if (this.UndoIndex < 1) {
      return;
    }

    // reduce index
    this.UndoIndex--;
    if (typeof this.UndoBuffer[this.UndoIndex] === 'undefined') {
      throw new Error('History does not exists');
    }

    // restore
    this.MakeFuture(this.storage.model);
    delete this.UndoBuffer[this.UndoIndex + 1];
    this.storage.model = JSON.parse(this.UndoBuffer[this.UndoIndex]);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
  }

  /**
   * Redo last change
   * @param data JSON data
   */
  public RedoChanges(): any {
    // check if history exists
    if (this.RedoIndex < 1) {
      return;
    }

    // reduce index
    this.RedoIndex--;
    if (typeof this.RedoBuffer[this.RedoIndex] === 'undefined') {
      throw new Error('Future does not exists');
    }

    // restore
    this.MakeHistory(this.storage.model, false);
    delete this.RedoBuffer[this.RedoIndex + 1];
    this.storage.model = JSON.parse(this.RedoBuffer[this.RedoIndex]);

    // check if selected page exists
    if (this.storage.selectedPageID >= this.storage.model.pages.length) {
      this.storage.selectedPageID = this.storage.model.pages.length - 1;
    }
  }
}
