import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets/surveyjs-widgets.js';
import * as Showdown from 'showdown';

@Component({
  selector: 'power-formulars-surveyjs-wrapper',
  template: `<div #surveyjsDiv></div>`
})
export class WrapperComponent implements OnChanges {
  @ViewChild('surveyjsDiv', {static: true}) public surveyjsDiv: ElementRef;
  @Input() public model: {};
  @Input() public data: any = null;
  @Input() public mode: string;
  @Input() public theme: string;
  @Input() public css: {};
  @Input() public showInvisible = false;
  @Output() public submitResult: EventEmitter<any> = new EventEmitter();
  @Output() public interimResult: EventEmitter<any> = new EventEmitter();
  @Output() public changes: EventEmitter<any> = new EventEmitter();

  public survey: Survey.Survey;
  public props: any;

  ngOnChanges() {
    if (this.theme) {
      Survey.StylesManager.applyTheme(this.theme);
    }

    const converter = new Showdown.Converter({
      simpleLineBreaks: true,
      simplifiedAutoLink: true,
      excludeTrailingPunctuationFromURLs: true,
      strikethrough: true,
      tables: true,
      parseImgDimensions: true,
      tasklists: true,
      requireSpaceBeforeHeadingText: true,
      openLinksInNewWindow: true,
      emoji: true,
    });
    converter.setFlavor('github');

    widgets['nouislider'](Survey);
    widgets['sortablejs'](Survey);

    this.survey = new Survey.Model(this.model);

    this.survey.onTextMarkdown.add((s, options) => {
      let str = options.text.split('\n\n').join('<br\><br\>');
      str = converter.makeHtml(str);
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      options.html = str;
    });

    if (this.mode) {
      this.survey.mode = this.mode;
    }
    this.survey.showInvisibleElements = this.showInvisible;

    // build property model
    this.props = {model: this.survey};
    if (this.css) {
      this.props['css'] = this.css;
    }
    if (this.model && this.model['data']) {
      this.props['data'] = this.model['data'];
    } else if (this.data) {
      this.props['data'] = this.data;
    }
    if (this.changes) {
      this.props['onValueChanged'] = (s, _) => {
        this.changes.emit(s.data);
      };
    }
    if (this.interimResult) {
      this.props['onCurrentPageChanged'] = (s, _) => {
        this.interimResult.emit(s.data);
      };
    }
    if (this.submitResult) {
      this.props['onComplete'] = (s, _) => {
        this.submitResult.emit(s.data);
      };
    }

    Survey.SurveyNG.render(this.surveyjsDiv.nativeElement, this.props);
  }
}
