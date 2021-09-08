import { Pipe, PipeTransform } from '@angular/core';
import { GemarkungWfsService } from '@app/shared/advanced-search/flurstueck-search/gemarkung-wfs.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'gemarkung'
})
export class GemarkungPipe implements PipeTransform {

    constructor(public gemarkungService: GemarkungWfsService) { }

    /**
     * transforms retrieves asynchronously the gemarkungsname to a given gemarkungsschlüssel
     * @param value gemarkungsschlüssel
     * @returns observable of gemarkungsname
     */
    public transform(value: string | number): Observable<string> {
        return this.gemarkungService.getGemarkungByKey(value.toString()).pipe(
            map((gemarkung) => {
                if (gemarkung['features'][0]?.properties) {
                    return gemarkung['features'][0].properties['gemarkung'];
                }
                return '';
            })
        );
    }

}
