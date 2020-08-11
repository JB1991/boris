import { Component, OnInit, Input } from '@angular/core';

import { Bootstrap4_CSS } from '../style';
import { environment } from '@env/environment';

@Component({
  selector: 'power-formulars-surveyjs-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() public form: any;
  @Input() public data: any = null;
  public isOpen = false;
  public surveyjs_style = Bootstrap4_CSS;
  public mode = 'edit';

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Opens full formular preview
   * @param mode Survey mode [edit, display]
   * @param data Survey data
   */
  public Open(mode = 'edit', data?: any) {
    if (!(mode === 'edit' || mode === 'display')) {
      throw new Error('mode is invalid');
    }
    if (data && !this.data) {
      this.data = data;
    }

    document.body.classList.add('overflow-hidden');
    document.body.style.pointerEvents = 'none';
    this.mode = mode;
    this.isOpen = true;
  }

  /**
   * Closes full formular preview
   */
  public Close() {
    document.body.classList.remove('overflow-hidden');
    document.body.style.pointerEvents = 'auto';
    this.isOpen = false;
    this.data = null;
  }

  /**
   * Debug prints result in console
   * @param data Data
   */
  public debugPrint(data: any) {
    if (!environment.production) {
      console.log(data);
    }
  }
}
