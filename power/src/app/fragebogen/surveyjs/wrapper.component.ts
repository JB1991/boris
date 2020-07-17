import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import * as Survey from 'survey-angular';
import { init } from './nouislider/nouislider.js';
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
  @Input() public completedHtml: string;
  @Input() public navigateToURL: string;
  @Input() public showInvisible = false;
  @Output() public submitResult: EventEmitter<any> = new EventEmitter();
  @Output() public interimResult: EventEmitter<any> = new EventEmitter();
  @Output() public changes: EventEmitter<any> = new EventEmitter();

  public survey: Survey.Survey;
  public props: any;

  ngOnChanges() {
    if (this.theme !== undefined) {
      Survey.StylesManager.applyTheme(this.theme);
    }

    const classMap = {
      h1: 'd-inline',
      h2: 'd-inline',
      p: 'd-inline'
    };

    const bindings = Object.keys(classMap)
      .map(key => ({
        type: 'output',
        regex: new RegExp(`<${key}(.*)>`, 'g'),
        replace: `<${key} class="${classMap[key]}" $1>`
      }));

    const converter = new Showdown.Converter({
      extensions: [...bindings],
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

    init(Survey);
    this.survey = new Survey.Model(this.model);

    this.survey.onTextMarkdown.add((s, options) => {
      let str = options.text.split('\n\n').join('<br\><br\>');
      str = converter.makeHtml(str);
      if (str.startsWith('<p>') && str.endsWith('</p>')) {
        str = str.substring(3);
        str = str.substring(0, str.length - 4);
      }
      options.html = converter.makeHtml(str);
    });

    if (this.mode !== undefined) {
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
    if (this.completedHtml) {
      this.props['completedHtml'] = this.completedHtml;
    }
    if (this.navigateToURL) {
      this.props['navigateToURL'] = this.navigateToURL;
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
