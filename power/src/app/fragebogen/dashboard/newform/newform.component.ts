import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'power-formulars-dashboard-newform',
  templateUrl: './newform.component.html',
  styleUrls: ['./newform.component.css']
})
export class NewformComponent implements OnInit {
  @ViewChild('modalnewform') private modal: ModalDirective;
  public title: string;
  public public: boolean = false;
  public service: string = '';
  public template: string = '';
  public tagInput: string;
  public tagList = [];

  constructor(private modalService: BsModalService,
              private alerts: AlertsService,
              public storage: StorageService) {
  }

  ngOnInit() {
  }

  /**
   * Opens new form modal
   */
  public open() {
    this.modal.show();
  }

  /**
   * Closes new form modal
   */
  public Close() {
    this.modal.hide();
  }

  /**
   * Creates new formular
   */
  public NewForm() {
    // check if form is filled incorrect
    if (document.getElementsByClassName('is-invalid').length > 0) {
      this.alerts.NewAlert('danger', 'Ungültige Einstellungen', 'Einige Einstellungen sind fehlerhaft und müssen zuvor korrigiert werden.');
      return;
    }

    // make new form
    console.log("YES");
  }

  /**
   * Adds tag to list
   */
  public addTag() {
    if (!this.tagInput.trim()) return;
    this.tagList.push(this.tagInput);
    this.tagInput = '';
  }

  /**
   * Removes tag from list
   * @param i Tag number
   */
  public removeTag(i: number) {
    this.tagList.splice(i, 1);
  }
}
