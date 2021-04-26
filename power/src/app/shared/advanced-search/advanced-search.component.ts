import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Teilmarkt } from '@app/bodenrichtwert/bodenrichtwert-component/bodenrichtwert.component';
import { FeatureCollection } from 'geojson';
import { ModalminiComponent } from '../modalmini/modalmini.component';
import { BodenrichwertnummerSearchComponent } from './bodenrichwertnummer-search/bodenrichwertnummer-search.component';
import { FlurstueckSearchComponent } from './flurstueck-search/flurstueck-search.component';

@Component({
    selector: 'power-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent {

    @ViewChild('advancedSearchModal') public modal: ModalminiComponent;

    @ViewChild('flurstueckForm') public flurstueckForm: FlurstueckSearchComponent;

    @ViewChild('bodenrichtwertForm') public bodenrichtwertForm: BodenrichwertnummerSearchComponent;

    @Output() flurstueckChange = new EventEmitter<FeatureCollection>();

    @Output() bodenrichtwertChange = new EventEmitter<FeatureCollection>();

    public title = $localize`Erweiterte Suche`;

    @Input() stichtag: string;

    @Input() teilmarkt: Teilmarkt;

    constructor() { }

    /**
     * onFlurstueckChange emits the current flurstueck-features
     * @param fts features
     */
    public onFlurstueckChange(fts: FeatureCollection) {
        this.flurstueckChange.emit(fts);
    }

    /**
     * onBodenrichtwertChange emits the current brw-features
     * @param fts features
     */
    public onBodenrichtwertChange(fts: FeatureCollection) {
        this.bodenrichtwertChange.emit(fts);
    }

    /**
     * closing closes the modal
     */
    public closing() {
        this.modal.close();
    }

    /**
     * Reset flurstueck-search and bodenrichtwertnummern-search onClose
     */
    public onClose() {
        this.flurstueckForm.reset();
        this.bodenrichtwertForm.reset();
    }
}
