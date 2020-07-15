import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'power-formulars-details-maketask',
  templateUrl: './maketask.component.html',
  styleUrls: ['./maketask.component.css']
})
export class MaketaskComponent implements OnInit {
  @ViewChild('modalmaketask') private modal: ModalDirective;
  public amount: number = 1;
  public pinList = [];

  constructor(private modalService: BsModalService,
              private alerts: AlertsService,
              public storage: StorageService) {
  }

  ngOnInit() {
  }

  /**
   * Opens make task modal
   */
  public open() {
    this.amount = 1;
    this.modal.show();
  }

  /**
   * Closes make task modal
   */
  public Close() {
    this.modal.hide();
  }

  /**
   * Generates PINs
   */
  public Generate() {
    // check amount bounds
    if (this.amount < 1 || this.amount > 100) {
      throw new Error('Invalid bounds for variable amount');
    }

    // make pins
    this.storage.createTask(this.storage.form.id).subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data']) {
        this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', (data['error'] ? data['error'] : this.storage.form.id));
        throw new Error('Could not create task: ' + (data['error'] ? data['error'] : this.storage.form.id));
      }

      // success
      this.pinList.push(data['data'].pin);
      this.storage.tasksList.push(data['data']);
    }, (error: Error) => {
        // failed to create task
        this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', (error['error']['error'] ? error['error']['error'] : error['statusText']));
        throw error;
    });
  }
}
