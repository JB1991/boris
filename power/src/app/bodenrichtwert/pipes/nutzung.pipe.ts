import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nutzung',
})
export class NutzungPipe implements PipeTransform {

    art_der_nutzung = {
        'W': $localize`Wohnbaufläche`,
        'WS': $localize`Kleinsiedlungsgebiet`,
        'WR': $localize`Reines Wohngebiet`,
        'WA': $localize`Allgemeines Wohngebiet`,
        'WB': $localize`Besonderes Wohngebiet`,
        'MU': $localize`Urbanes Gebiet`,
        'M': $localize`Gemischte Baufläche`,
        'MD': $localize`Dorfgebiet`,
        'MI': $localize`Mischgebiet`,
        'MK': $localize`Kerngebiet`,
        'G': $localize`Gewerbliche Baufläche`,
        'GE': $localize`Gewerbegebiet`,
        'GI': $localize`Industriegebiet`,
        'S': $localize`Sonderbaufläche`,
        'SE': $localize`Sondergebiet für Erholung`,
        'SO': $localize`Sonstige Sondergebiete`,
        'GB': $localize`Baufläche für Gemeinbedarf`,
        'LW': $localize`Landwirtschaftliche Fläche`,
        'A': $localize`Acker`,
        'GR': $localize`Grünland`,
        'EGA': $localize`Erwerbsgartenanbaufläche`,
        'SK': $localize`Anbaufläche für Sonderkulturen`,
        'WG': $localize`Weingarten`,
        'KUP': $localize`Kurzumtriebsplantagen/Agroforst`,
        'UN': $localize`Unland, Geringstland, Bergweide, Moor`,
        'F': $localize`Forstwirtschaftliche Fläche`,
        'PG': $localize`Private Grünfläche`,
        'KGA': $localize`Kleingartenfläche`,
        'FGA': $localize`Freizeitgartenfläche`,
        'CA': $localize`Campingplatz`,
        'SPO': $localize`Sportfläche`,
        'SG': $localize`Sonstige private Fläche`,
        'FH': $localize`Friedhof`,
        'WF': $localize`Wasserfläche`,
        'FP': $localize`Flughafen, Flugplatz`,
        'PP': $localize`Private Parkplätze, Stellplatzfläche`,
        'LG': $localize`Lagerfläche`,
        'AB': $localize`Abbauland`,
        'GF': $localize`Gemeinbedarfsfläche (kein Bauland)`,
        'SN': $localize`Sondernutzungsfläche`,
    };

    ergaenzende_art_der_nutzung = {
        'EFH': $localize`Ein- und Zweifamilienhäuser`,
        'MFH': $localize`Mehrfamilienhäuser`,
        'GH': $localize`Geschäftshäuser`,
        'WGH': $localize`Wohn- und Geschäftshäuser`,
        'BGH': $localize`Büro- und Geschäftshäuser`,
        'BH': $localize`Bürohäuser`,
        'PL': $localize`Produktion und Logistik`,
        'WO': $localize`Wochenendhäuser`,
        'FEH': $localize`Ferienhäuser`,
        'FZT': $localize`Freizeit und Touristik`,
        'LAD': $localize`Läden (eingeschossig)`,
        'EKZ': $localize`Einkaufszentren`,
        'MES': $localize`Messen, Ausstellungen, Kongresse, Großveranstaltungen aller Art`,
        'BI': $localize`Bildungseinrichtungen`,
        'MED': $localize`Gesundheitseinrichtungen`,
        'HAF': $localize`Hafen`,
        'GAR': $localize`Garagen, Stellplatzanlagen, Parkhäuser`,
        'MIL': $localize`Militär`,
        'LP': $localize`Landwirtschaftliche Produktion`,
        'ASB': $localize`Außenbereich`,
        'OG': $localize`Obstanbaufläche`,
        'GEM': $localize`Gemüseanbaufläche`,
        'BLU': $localize`Blumen- und Zierpflanzenanbaufläche`,
        'BMS': $localize`Baumschulfläche`,
        'SPA': $localize`Spargelanbaufläche`,
        'HPF': $localize`Hopfenanbaufläche`,
        'TAB': $localize`Tabakanbaufläche`,
        'FL': $localize`Weingarten in Flachlage`,
        'HL': $localize`Weingarten in Hanglage`,
        'STL': $localize`Weingarten in Steillage`,
        'SND': $localize`Abbauland von Sand und Kies`,
        'TON': $localize`Abbauland von Ton und Mergel`,
        'TOF': $localize`Abbauland von Torf`,
        'STN': $localize`Steinbruch`,
        'KOH': $localize`Braunkohletagebau`,
    };


    transform(value: any[], ...args: any[]): any {
        if (value === null) {
            return null;
        }

        let res = '';

        for (const nutzung of value) {
            res += this.art_der_nutzung[nutzung['nutz']];
            if (nutzung['enuta'].length > 0) {
                if (nutzung['enuta'][0] === 'G1' || nutzung['enuta'][0] === 'G2' || nutzung['enuta'][0] === 'G3' || nutzung['enuta'][0] === 'G4') {
                    res += '';
                } else {
                    res += ' (' + this.ergaenzende_art_der_nutzung[nutzung['enuta']] + ')';
                };
            }
        }

        return res;
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
