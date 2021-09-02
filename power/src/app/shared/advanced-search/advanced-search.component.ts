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

    @ViewChild('advancedSearchModal') public modal?: ModalminiComponent;
    @ViewChild('flurstueckForm') public flurstueckForm?: FlurstueckSearchComponent;
    @ViewChild('bodenrichtwertForm') public bodenrichtwertForm?: BodenrichwertnummerSearchComponent;

    @Output() public flurstueckChange = new EventEmitter<FeatureCollection>();
    @Output() public bodenrichtwertChange = new EventEmitter<FeatureCollection>();

    // public title = $localize`Erweiterte Suche`;

    @Input() public title = $localize`Erweiterte Suche`;
    @Input() public stichtag?: string;
    @Input() public teilmarkt?: Teilmarkt;

    @Input() public flurstueckSearchActive = true;
    @Input() public bodenrichtwertSearchActive = true;

    constructor() {
        // This is intentional
    }

    /**
     * onFlurstueckChange emits the current flurstueck-features
     * @param fts features
     */
    public onFlurstueckChange(fts: FeatureCollection): void {
        this.flurstueckChange.emit(fts);
    }

    /**
     * onBodenrichtwertChange emits the current brw-features
     * @param fts features
     */
    public onBodenrichtwertChange(fts: FeatureCollection): void {
        this.bodenrichtwertChange.emit(fts);
    }

    /**
     * closing closes the modal
     */
    public closing(): void {
        this.modal?.close();
    }

    /**
     * Reset flurstueck-search and bodenrichtwertnummern-search onClose
     */
    public onClose(): void {
        if (this.flurstueckSearchActive) {
            this.flurstueckForm?.reset();
        }
        if (this.bodenrichtwertSearchActive) {
            this.bodenrichtwertForm?.reset();
        }
    }
}
