import {
    Component, Input, ElementRef, ViewChild, Output,
    EventEmitter, OnChanges, ChangeDetectionStrategy
} from '@angular/core';
import { ShowdownConverter } from 'ngx-showdown';
import { Model, SurveyNG, StylesManager, surveyLocalization, SurveyModel } from 'survey-angular';
import * as Slider from './widgets/nouislider';
import * as Image from './widgets/imageselector';

@Component({
    selector: 'power-forms-surveyjs-wrapper',
    template: '<div #surveyjsDiv></div>',
    styleUrls: ['./wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WrapperComponent implements OnChanges {
    @ViewChild('surveyjsDiv', { static: true }) public surveyjsDiv: ElementRef;
    @Input() public model: any;
    @Input() public data: any;
    @Input() public mode: 'edit' | 'display' = 'edit';
    @Input() public theme = 'default';
    @Input() public css: any;
    @Input() public showInvisible = false;
    @Output() public submitResult: EventEmitter<any> = new EventEmitter();
    @Output() public interimResult: EventEmitter<any> = new EventEmitter();
    @Output() public changes: EventEmitter<any> = new EventEmitter();

    public survey: Model;
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
        StylesManager.applyTheme(this.theme);
        surveyLocalization.defaultLocale = 'de';

        // load custom widgets
        Slider.init();
        Image.init();

        // create survey
        this.survey = new Model(this.model);

        // add markdown renderer
        this.survey.onTextMarkdown.add((_: SurveyModel, options) => {
            let str = options.text.split('\n\n').join('<br\><br\>');
            str = this.showdownConverter.makeHtml(str);
            /* istanbul ignore else */
            if (str.startsWith('<p>')) {
                str = str.substring(3);
                str = str.substring(0, str.length - 4);
            }
            options.html = str;
        });

        // add handler
        this.survey.onValueChanged.add((sender: SurveyModel, _) => {
            this.changes.emit(sender.data);
        });
        this.survey.onCurrentPageChanged.add((sender: SurveyModel, _) => {
            this.interimResult.emit(sender.data);
        });
        this.survey.onComplete.add((sender: SurveyModel, options) => {
            this.submitResult.emit({ result: sender.data, options: options });
        });

        // set options
        this.survey.mode = this.mode;
        this.survey.showInvisibleElements = this.showInvisible;
        this.survey.sendResultOnPageNext = true;
        this.survey.checkErrorsMode = 'onNextPage';
        this.survey.storeOthersAsComment = false;
        this.survey.maxTextLength = 5000;
        this.survey.maxOthersLength = 200;

        // build property model
        this.props = { model: this.survey, css: this.css };
        if (this.model && this.model['data']) {
            this.props.data = this.model['data'];
        } else if (this.data) {
            this.props.data = this.data;
        }

        // render survey
        SurveyNG.render(this.surveyjsDiv.nativeElement, this.props);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
