import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nutzung',
})
export class NutzungPipe implements PipeTransform {

  art_der_nutzung = {
    'W': 'Wohnbaufläche',
    'WS' : 'Kleinsiedlungsgebiet',
    'WR' : 'reines Wohngebiet',
    'WA' : 'allgemeines Wohngebiet',
    'WB' : 'besonderes Wohngebiet',
    'MU' : 'urbanes Gebiet',
    'M' : 'gemischte Baufläche',
    'MD' : 'Dorfgebiet',
    'MI' : 'Mischgebiet',
    'MK' : 'Kerngebiet',
    'G' : 'gewerbliche Baufläche',
    'GE' : 'Gewerbegebiet',
    'GI' : 'Industriegebiet',
    'S' : 'Sonderbaufläche',
    'SE' : 'Sondergebiet für Erholung',
    'SO' : 'sonstige Sondergebiete',
    'GB' : 'Baufläche für Gemeinbedarf',
    'LW' : 'landwirtschaftliche Fläche',
    'A' : 'Acker',
    'GR' : 'Grünland',
    'EGA' : 'Erwerbsgartenanbaufläche',
    'SK' : 'Anbaufläche für Sonderkulturen',
    'WG' : 'Weingarten',
    'KUP' : 'Kurzumtriebsplantagen/Agrofrost',
    'UN' : 'Unland, Geringstland, Bergweide, Moor',
    'F' : 'forstwirtschaftliche Fläche',
    'PG' : 'private Grünfläche',
    'KGA' : 'Kleingartenfläche',
    'FGA' : 'Freizeitgartenfläche',
    'CA' : 'Campingplatz',
    'SPO' : 'Sportfläche',
    'SG' : 'sonstige private Fläche',
    'FH' : 'Friedhof',
    'WF' : 'Wasserfläche',
    'FP' : 'Flughafen, Flugplatz',
    'PP' : 'private Parkplätze, Stellplatzfläche',
    'LG' : 'Lagerfläche',
    'AB' : 'Abbauland',
    'GF' : 'Gemeinbedarfsfläche (kein Bauland)',
    'SN' : 'Sondernutzungsfläche',
  };

  ergaenzende_art_der_nutzung = {
    'EFH': 'Ein- und Zweifamilienhäuser',
    'MFH': 'Mehrfamilienhäuser',
    'GH': 'Geschäftshäuser',
    'WGH': 'Wohn- und Geschäftshäuser',
    'BGH': 'Büro- und Geschäftshäuser',
    'BH': 'Bürohäuser',
    'PL': 'Produktion und Logistik',
    'WO': 'Wochenendhäuser',
    'FEH': 'Ferienhäuser',
    'FZT': 'Freizeit und Touristik',
    'LAD': 'Läden (eingeschossig)',
    'EKZ': 'Einkaufszentren',
    'MES': 'Messen, Ausstellungen, Kongresse, Großveranstaltungen aller Art',
    'BI': 'Bildungseinrichtungen',
    'MED': 'Gesundheitseinrichtungen',
    'HAF': 'Hafen',
    'GAR': 'Garagen, Stellplatztanlagen, Parkhäuser',
    'MIL': 'Militär',
    'LP': 'landwirtschaftliche Produktion',
    'ASB': 'Außenbereich',
    'OG': 'Obstanbaufläche',
    'GEM': 'Gemüseanbaufläche',
    'BLU': 'Blumen- und Zierpflanzenanbaufläche',
    'BMS': 'Baumschulfläche',
    'SPA': 'Spargelanbaufläche',
    'HPF': 'Hopfenanbaufläche',
    'TAB': 'Tabakanbaufläche',
    'FL': 'Weingarten in Flachlage',
    'HL': 'Weingarten in Hanglage',
    'STL': 'Weingarten in Steillage',
    'SND': 'Abbauland von Sand und Kies',
    'TON': 'Abbauland von Ton und Mergel',
    'TOF': 'Abbauland von Torf',
    'STN': 'Steinbruch',
    'KOH': 'Braunkohletagebau',
  };


  transform(value: [], args: any[]): string {

    let res = '';

    for (const nutzung of value) {
      console.log(nutzung);
      res += this.art_der_nutzung[nutzung['nutz']];
      if (nutzung['enuta']) {
        res += ' (' + this.ergaenzende_art_der_nutzung[nutzung['enuta']] + ')';
      }
    }

    return res;
  }

}
