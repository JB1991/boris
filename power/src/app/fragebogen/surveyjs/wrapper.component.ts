import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { ShowdownConverter } from 'ngx-showdown';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';

@Component({
    selector: 'power-forms-surveyjs-wrapper',
    template: `<div #surveyjsDiv></div>`,
    styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnChanges {
    @ViewChild('surveyjsDiv', { static: true }) public surveyjsDiv: ElementRef;
    @Input() public model: {};
    @Input() public data: any = null;
    @Input() public mode: string;
    @Input() public theme: string;
    @Input() public css: {};
    @Input() public showInvisible = false;
    @Output() public submitResult: EventEmitter<any> = new EventEmitter();
    @Output() public interimResult: EventEmitter<any> = new EventEmitter();
    @Output() public changes: EventEmitter<any> = new EventEmitter();

    public survey: Survey.Survey;
    public props: any;

    constructor(public showdownConverter: ShowdownConverter) {
        // set showdown settings for markdown
        showdownConverter.setFlavor('github');
        showdownConverter.setOptions({
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
    }

    ngOnChanges() {
        if (this.theme) {
            Survey.StylesManager.applyTheme(this.theme);
        }
        Survey.surveyLocalization.defaultLocale = 'de';

        // load custom widgets
        widgets.nouislider(Survey);
        widgets.sortablejs(Survey);

        // create survey
        this.survey = new Survey.Model(this.model);

        // add markdown renderer
        this.survey.onTextMarkdown.add((s, options) => {
            let str = options.text.split('\n\n').join('<br\><br\>');
            str = this.showdownConverter.makeHtml(str);
            if (str.startsWith('<p>')) {
                str = str.substring(3);
                str = str.substring(0, str.length - 4);
            }
            options.html = str;
        });

        // set options
        if (this.mode) {
            this.survey.mode = this.mode;
        }
        this.survey.showInvisibleElements = this.showInvisible;
        this.survey.sendResultOnPageNext = true;
        this.survey.checkErrorsMode = 'onNextPage';
        this.survey.maxTextLength = 5000;
        this.survey.maxOthersLength = 200;

        // fix links
        this.survey.onAfterRenderQuestion.add(function (_, options) {
            const linkEl = options.htmlElement.querySelector('a');
            if (linkEl) {
                /* istanbul ignore next */
                linkEl.onclick = function (e) {
                    e.stopPropagation();
                };
            }
        });

        // build property model
        this.props = { model: this.survey };
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
            this.props['onComplete'] = (s, o) => {
                this.submitResult.emit({ result: s.data, options: o });
            };
        }

        // render survey
        Survey.SurveyNG.render(this.surveyjsDiv.nativeElement, this.props);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
