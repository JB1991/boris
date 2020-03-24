import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import * as Survey from 'survey-angular';
import { init } from './nouislider.js';
import * as Showdown from 'showdown';

@Component({
  selector: 'surveyjs-wrapper',
  template: `<div #surveyjsDiv></div>`
})
export class WrapperComponent implements OnChanges {
  @ViewChild('surveyjsDiv', {static: true}) surveyjsDiv: ElementRef;
  @Input() model: {};
  @Input() mode: string;
  @Input() theme: string;
  @Input() css: {};
  @Input() completedHtml: string;
  @Input() navigateToURL: string;
  @Input() showInvisible = false;
  @Output() public result: EventEmitter<any> = new EventEmitter();
  @Output() public interimResult: EventEmitter<any> = new EventEmitter();

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
    const survey = new Survey.Model(this.model);

    survey.onTextMarkdown.add((s, options) => {
      let str = options.text.split('\n\n').join('<br\><br\>');
      str = converter.makeHtml(str);
      if (str.startsWith('<p>') && str.endsWith('</p>')) {
        str = str.substring(3);
        str = str.substring(0, str.length - 4);
      }
      options.html = converter.makeHtml(str);
    });

    if (this.mode !== undefined) {
      survey.mode = this.mode;
    }
    if (this.completedHtml !== undefined) {
      survey.completedHtml = this.completedHtml;
    }
    if (this.navigateToURL !== undefined) {
      survey.navigateToURL = this.navigateToURL;
    }
    survey.showInvisibleElements = this.showInvisible;
    survey.onComplete.add((s) => {
      this.result.emit(s.data);
    });
    survey.onValueChanged.add((s) => {
      this.interimResult.emit(s.data);
    });

    if (this.css !== undefined) {
      Survey.SurveyNG.render(this.surveyjsDiv.nativeElement, {model: survey, css: this.css});
    } else {
      Survey.SurveyNG.render(this.surveyjsDiv.nativeElement, {model: survey});
    }
  }
}
