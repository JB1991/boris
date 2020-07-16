import { Component, OnInit, Input } from '@angular/core';

import { Bootstrap4_CSS } from '../style';

@Component({
  selector: 'power-formulars-surveyjs-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() public form: any;
  public isOpen = false;
  public surveyjs_style = Bootstrap4_CSS;

  constructor() {
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
