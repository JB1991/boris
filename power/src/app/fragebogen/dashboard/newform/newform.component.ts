import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { StorageService } from '../storage.service';

import { FormularTemplate } from '../../editor/data';

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
              private router: Router,
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

    // load template
    if (this.template) {
      this.storage.loadForm(this.template).subscribe((data) => {
        // Check for error
        if (!data || data['error'] || !data['data'] || !data['data']['content']) {
          const alertText = (data['error'] ? data['error'] : this.template);
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);
          throw new Error('Could not load form: ' + alertText);
        }

        // make new form
        this.makeForm(data['data']['content']);
      }, (error: Error) => {
        // Failed to load form
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (error['error']['error'] ? error['error']['error'] : error['statusText']));
        throw error;
      });
      return;
    }

    // make new form
    this.makeForm(JSON.parse(JSON.stringify(FormularTemplate)));
  }

  /**
   * Makes new formular
   * @param template Template SurveyJS
   */
  private makeForm(template: any) {
    template.title = this.title;

    this.storage.createForm(template, this.tagList.join(',')).subscribe((data) => {
      // Check for error
      if (!data || data['error'] || !data['data']) {
        const alertText = (data['error'] ? data['error'] : '');
        this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', alertText);
        throw new Error('Could not create form: ' + alertText);
      }

      // Success
      this.storage.formsList.push(data['data']);
      this.alerts.NewAlert('success', 'Erfolgreich erstellt', 'Das Formular wurde erfolgreich erstellt.');
      this.router.navigate(['/forms/editor', data['data'].id], {replaceUrl: true});
    }, (error: Error) => {
      // Failed to create form
      this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', (error['error']['error'] ? error['error']['error'] : error['statusText']));
      throw error;
    });
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
