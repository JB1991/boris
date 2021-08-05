import { Pipe, PipeTransform } from '@angular/core';
import { GemarkungWfsService } from '@app/shared/advanced-search/flurstueck-search/gemarkung-wfs.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'gemarkung'
})
export class GemarkungPipe implements PipeTransform {

    constructor(private gemarkungService: GemarkungWfsService) { }

    /**
     * transforms retrieves asynchronously the gemarkungsname to a given gemarkungsschlüssel
     * @param value gemarkungsschlüssel
     * @returns observable of gemarkungsname
     */
    transform(value: string): Observable<string> {
        return this.gemarkungService.getGemarkungByKey(value).pipe(
            map(gemarkung => gemarkung['features'][0].properties.gemarkung)
        );
    }

}