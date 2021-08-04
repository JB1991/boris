import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { A11yModule } from '@angular/cdk/a11y';

import { GeosearchComponent } from './geosearch/geosearch.component';
import { ModalComponent } from './modal/modal.component';
import { ModalminiComponent } from './modalmini/modalmini.component';
import { TagboxComponent } from './tagbox/tagbox.component';
import { MarkdownInstructionsComponent } from './markdown-instructions/markdown-instructions.component';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { LoadingscreenModule } from './loadingscreen/loadingscreen.module';
import { SvgPipe } from './pipes/svg.pipe';
import { GemarkungPipe } from './pipes/gemarkung.pipe';
import { HyphenatePipe } from './pipes/hyphenate.pipe';
import { ModalminiFooterDirective } from './modalmini/modalmini-footer.directive';
import { FlurstueckSearchComponent } from './advanced-search/flurstueck-search/flurstueck-search.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { BodenrichwertnummerSearchComponent } from './advanced-search/bodenrichwertnummer-search/bodenrichwertnummer-search.component';

@NgModule({
    declarations: [
        GeosearchComponent,
        ModalComponent,
        ModalminiComponent,
        TagboxComponent,
        MarkdownInstructionsComponent,
        SvgPipe,
        GemarkungPipe,
        HyphenatePipe,
        ModalminiFooterDirective,
        FlurstueckSearchComponent,
        AdvancedSearchComponent,
        BodenrichwertnummerSearchComponent
    ],
    exports: [
        GeosearchComponent,
        ModalComponent,
        ModalminiComponent,
        TagboxComponent,
        MarkdownInstructionsComponent,
        AuthModule,
        AlertsModule,
        LoadingscreenModule,
        SvgPipe,
        GemarkungPipe,
        HyphenatePipe,
        ModalminiFooterDirective,
        FlurstueckSearchComponent,
        AdvancedSearchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbTypeaheadModule,
        TabsModule,
        ModalModule.forRoot(),
        A11yModule
    ]
})
export class SharedModule {
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
