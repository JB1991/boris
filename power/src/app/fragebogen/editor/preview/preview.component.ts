import { Component, OnInit, Input } from '@angular/core';

import { StorageService } from '../storage.service';
import { Bootstrap4_CSS } from '../../surveyjs/style';

@Component({
  selector: 'power-formulars-editor-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  public isOpen = false;
  public surveyjs_style = Bootstrap4_CSS;

  constructor(public storage: StorageService) {
  }

  ngOnInit() {
  }

  /**
   * Toggles full formular preview
   */
  public Toggle() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Debug prints result in console
   * @param data Data
   */
  public debugPrint(data: any) {
    console.log(data);
  }
}
