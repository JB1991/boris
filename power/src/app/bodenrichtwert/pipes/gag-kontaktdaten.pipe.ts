import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'gagKontaktdaten'
})
export class GagKontaktdatenPipe implements PipeTransform {

    contact = {
        'Gutachterausschuss für Grundstückswerte Lüneburg': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_lueneburg/geschaeftsstelle_gutachterausschuss/kontaktdaten-der-geschaeftsstelle-103466.html',
        'Gutachterausschuss für Grundstückswerte Hameln-Hannover': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_hameln/geschaeftsstelle_gutachterausschuss/geschaeftsstelle-des-gutachterausschusses-103464.html',
        'Gutachterausschuss für Grundstückswerte Verden': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_sulingenverden/geschaeftsstelle_gutachterausschuss/regionaldirektion-sulingen-102120.html',
        'Gutachterausschuss für Grundstückswerte Braunschweig-Wolfsburg': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_braunschweig/geschaeftsstelle_gutachterausschuss/geschaeftsstelle-des-gutachterausschusses-101491.html',
        'Gutachterausschuss für Grundstückswerte Sulingen-Verden': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_sulingenverden/geschaeftsstelle_gutachterausschuss/regionaldirektion-sulingen-102120.html',
        'Gutachterausschuss für Grundstückswerte Osnabrück-Meppen': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_osnabrueck/geschaeftsstelle_gutachterausschuss/ansprechpartner-des-gutachterausschusses-meppen-127400.html',
        'Gutachterausschuss für Grundstückswerte Otterndorf': 'https://www.lgln.niedersachsen.de/rd-ott/geschaeftsstelle_gutachterausschuss/regionaldirektion-otterndorf-rd-otterndorf-101773.html',
        'Gutachterausschuss für Grundstückswerte Aurich': 'https://www.lgln.niedersachsen.de/RD-aur/geschaeftsstellen_gutachterausschuss_und_umlegungsausschuesse/geschaeftsstelle-des-gutachterausschusses-103403.html',
        'Gutachterausschuss für Grundstückswerte Oldenburg-Cloppenburg': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_oldenburg/geschaeftsstelle_gutachterausschuss/geschaeftsstelle-des-gutachterausschusses-103224.html',
        'Gutachterausschuss für Grundstückswerte Northeim': 'https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_northeim/geschaeftsstelle_gutachterausschuss/geschaeftsstelle-des-gutachterausschusses-103480.html',
        'Gutachterausschuss für Grundstückswerte in Bremerhaven': 'https://www.bremerhaven.de/de/verwaltung-politik-sicherheit/buergerservice/adressen-oeffnungszeiten/geschaeftsstelle-des-gutachterausschusses-beim-vermessungs-und-katasteramt.22493.html',
        'Gutachterausschuss für Grunstückswerte in Bremen': 'https://www.gutachterausschuss.bremen.de/aufgaben___dienste-1464'
    };

    transform(value: string, ...args: unknown[]): string {
        return this.contact[value];
    }

}
