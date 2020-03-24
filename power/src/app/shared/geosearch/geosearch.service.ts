import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Feature, FeatureCollection} from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class GeosearchService {

  url = '/geocoding/geosearch/';

  features = new Subject<Feature>();

  constructor(private http: HttpClient) {
  }

  getFeatures(): Observable<Feature> {
    return this.features.asObservable();
  }

  updateFeatures(feature: Feature) {
    this.features.next(feature);
  }

  search(search: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.url, {
      params: new HttpParams().set('query', `text:(${search}) AND typ:haus AND bundesland:Niedersachsen`)
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAdressFromCoordinates(lat, lng): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.url, {
      params: new HttpParams().set('query', 'typ: haus').append('lat', lat).append('lon', lng)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Es ist ein Fehler aufgetreten: ' + error.message);
    } else {
      console.error(
        `Return-Code vom Backend: ${error.status}, ` +
        `Nachricht: ${error.error}`);
    }
    return throwError('Es ist ein Fehler aufgetreten.');
  }
}

// Beispielergebnis von BKG Geocoding Service
/*{
  'type';
:
  'FeatureCollection', 'features';
:
  [{
    'type': 'Feature',
    'bbox': [9.61159674523125, 52.3096452479637, 9.87986852931605, 52.4643022151005],
    'geometry': {'type': 'Point', 'coordinates': [9.73808, 52.37455]},
    'properties': {
      'text': 'Hannover',
      'typ': 'Ort',
      'score': 1.8903222,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.6116, 52.30965], [9.6116, 52.4643], [9.87987, 52.4643], [9.87987, 52.30965], [9.6116, 52.30965]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000, 0324100080080000, 0324100090090000, 0324100100100000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'ort': 'Hannover',
      'ortsteil': ''
    },
    'id': 'DEGAC00000081506'
  }, {
    'type': 'Feature',
    'bbox': [9.75240309496891, 52.3727010499014, 9.77496971278008, 52.3821319065439],
    'geometry': {'type': 'Point', 'coordinates': [9.76085, 52.376]},
    'properties': {
      'text': '30175 Hannover - Zoo',
      'typ': 'Ort',
      'score': 1.8634033,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.7524, 52.3727], [9.7524, 52.38213], [9.77497, 52.38213], [9.77497, 52.3727], [9.7524, 52.3727]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30175',
      'ort': 'Hannover',
      'ortsteil': 'Zoo'
    },
    'id': 'DEGAC00000019244'
  }, {
    'type': 'Feature',
    'bbox': [9.75533740422629, 52.3871868640763, 9.75718959663649, 52.3901590541027],
    'geometry': {'type': 'Point', 'coordinates': [9.75538, 52.38989]},
    'properties': {
      'text': '30177 Hannover - Zoo',
      'typ': 'Ort',
      'score': 1.8634033,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.75534, 52.38719], [9.75534, 52.39016], [9.75719, 52.39016], [9.75719, 52.38719], [9.75534, 52.38719]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30177',
      'ort': 'Hannover',
      'ortsteil': 'Zoo'
    },
    'id': 'DEGAC00000019247'
  }, {
    'type': 'Feature',
    'bbox': [9.75844860643341, 52.3707865291412, 9.76130490474917, 52.3725304628219],
    'geometry': {'type': 'Point', 'coordinates': [9.76005, 52.37164]},
    'properties': {
      'text': '30159 Hannover - Bult',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.75845, 52.37079], [9.75845, 52.37253], [9.7613, 52.37253], [9.7613, 52.37079], [9.75845, 52.37079]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30159',
      'ort': 'Hannover',
      'ortsteil': 'Bult'
    },
    'id': 'DEGAC00000019214'
  }, {
    'type': 'Feature',
    'bbox': [9.73565099788221, 52.3822535555384, 9.75468709143763, 52.391417588007],
    'geometry': {'type': 'Point', 'coordinates': [9.74345, 52.38718]},
    'properties': {
      'text': '30161 Hannover - List',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.73565, 52.38225], [9.73565, 52.39142], [9.75469, 52.39142], [9.75469, 52.38225], [9.73565, 52.38225]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30161',
      'ort': 'Hannover',
      'ortsteil': 'List'
    },
    'id': 'DEGAC00000019218'
  }, {
    'type': 'Feature',
    'bbox': [9.73975152335328, 52.3885079201686, 9.75724905958901, 52.4054741923356],
    'geometry': {'type': 'Point', 'coordinates': [9.74775, 52.39483]},
    'properties': {
      'text': '30163 Hannover - List',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.73975, 52.38851], [9.73975, 52.40547], [9.75725, 52.40547], [9.75725, 52.38851], [9.73975, 52.38851]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30163',
      'ort': 'Hannover',
      'ortsteil': 'List'
    },
    'id': 'DEGAC00000019222'
  }, {
    'type': 'Feature',
    'bbox': [9.76143358861637, 52.3542590265015, 9.78010257135149, 52.3717932138479],
    'geometry': {'type': 'Point', 'coordinates': [9.77037, 52.36454]},
    'properties': {
      'text': '30173 Hannover - Bult',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.76143, 52.35426], [9.76143, 52.37179], [9.7801, 52.37179], [9.7801, 52.35426], [9.76143, 52.35426]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30173',
      'ort': 'Hannover',
      'ortsteil': 'Bult'
    },
    'id': 'DEGAC00000019237'
  }, {
    'type': 'Feature',
    'bbox': [9.76128858676668, 52.3712780483798, 9.77417086201877, 52.3722697809561],
    'geometry': {'type': 'Point', 'coordinates': [9.7631, 52.37148]},
    'properties': {
      'text': '30175 Hannover - Bult',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.76129, 52.37128], [9.76129, 52.37227], [9.77417, 52.37227], [9.77417, 52.37128], [9.76129, 52.37128]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30175',
      'ort': 'Hannover',
      'ortsteil': 'Bult'
    },
    'id': 'DEGAC00000019240'
  }, {
    'type': 'Feature',
    'bbox': [9.75323000612009, 52.3906782998314, 9.78096746206799, 52.4058588361804],
    'geometry': {'type': 'Point', 'coordinates': [9.76952, 52.39893]},
    'properties': {
      'text': '30177 Hannover - List',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.75323, 52.39068], [9.75323, 52.40586], [9.78097, 52.40586], [9.78097, 52.39068], [9.75323, 52.39068]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30177',
      'ort': 'Hannover',
      'ortsteil': 'List'
    },
    'id': 'DEGAC00000019246'
  }, {
    'type': 'Feature',
    'bbox': [9.68779259680736, 52.3925092733871, 9.70357108717149, 52.4136663464995],
    'geometry': {'type': 'Point', 'coordinates': [9.69221, 52.4039]},
    'properties': {
      'text': '30419 Hannover - Burg',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.68779, 52.39251], [9.68779, 52.41367], [9.70357, 52.41367], [9.70357, 52.39251], [9.68779, 52.39251]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30419',
      'ort': 'Hannover',
      'ortsteil': 'Burg'
    },
    'id': 'DEGAC00000019251'
  }, {
    'type': 'Feature',
    'bbox': [9.7794147854047, 52.400103418662, 9.79107942784413, 52.4060504972729],
    'geometry': {'type': 'Point', 'coordinates': [9.78518, 52.40323]},
    'properties': {
      'text': '30655 Hannover - List',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.77941, 52.4001], [9.77941, 52.40605], [9.79108, 52.40605], [9.79108, 52.4001], [9.77941, 52.4001]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30655',
      'ort': 'Hannover',
      'ortsteil': 'List'
    },
    'id': 'DEGAC00000019306'
  }, {
    'type': 'Feature',
    'bbox': [9.82580933510569, 52.4235619684623, 9.83152729320403, 52.426566486845],
    'geometry': {'type': 'Point', 'coordinates': [9.82868, 52.42519]},
    'properties': {
      'text': '30657 Hannover - Lahe',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.82581, 52.42356], [9.82581, 52.42657], [9.83153, 52.42657], [9.83153, 52.42356], [9.82581, 52.42356]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30657',
      'ort': 'Hannover',
      'ortsteil': 'Lahe'
    },
    'id': 'DEGAC00000019310'
  }, {
    'type': 'Feature',
    'bbox': [9.81252459281975, 52.4091723674183, 9.86021546541355, 52.425843412032],
    'geometry': {'type': 'Point', 'coordinates': [9.82658, 52.41821]},
    'properties': {
      'text': '30659 Hannover - Lahe',
      'typ': 'Ort',
      'score': 1.8633273,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.81252, 52.40917], [9.81252, 52.42584], [9.86022, 52.42584], [9.86022, 52.40917], [9.81252, 52.40917]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30659',
      'ort': 'Hannover',
      'ortsteil': 'Lahe'
    },
    'id': 'DEGAC00000019314'
  }, {
    'type': 'Feature',
    'bbox': [9.72483180595803, 52.3674431302262, 9.75166201440595, 52.3833137381307],
    'geometry': {'type': 'Point', 'coordinates': [9.73682, 52.37472]},
    'properties': {
      'text': '30159 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.72483, 52.36744], [9.72483, 52.38331], [9.75166, 52.38331], [9.75166, 52.36744], [9.72483, 52.36744]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30159',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019215'
  }, {
    'type': 'Feature',
    'bbox': [9.73386708294018, 52.3755071636374, 9.7487690686358, 52.3840844738202],
    'geometry': {'type': 'Point', 'coordinates': [9.73981, 52.38057]},
    'properties': {
      'text': '30161 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.73387, 52.37551], [9.73387, 52.38408], [9.74877, 52.38408], [9.74877, 52.37551], [9.73387, 52.37551]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30161',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019219'
  }, {
    'type': 'Feature',
    'bbox': [9.72345672790265, 52.3783411461136, 9.73244623563521, 52.3828761191994],
    'geometry': {'type': 'Point', 'coordinates': [9.72924, 52.38175]},
    'properties': {
      'text': '30167 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.72346, 52.37834], [9.72346, 52.38288], [9.73245, 52.38288], [9.73245, 52.37834], [9.72346, 52.37834]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30167',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019230'
  }, {
    'type': 'Feature',
    'bbox': [9.72810191041614, 52.3644168965934, 9.73660363978614, 52.3753527608002],
    'geometry': {'type': 'Point', 'coordinates': [9.73064, 52.37469]},
    'properties': {
      'text': '30169 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.7281, 52.36442], [9.7281, 52.37535], [9.7366, 52.37535], [9.7366, 52.36442], [9.7281, 52.36442]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30169',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019233'
  }, {
    'type': 'Feature',
    'bbox': [9.74465815713017, 52.3691254380431, 9.75217427240927, 52.3699036232009],
    'geometry': {'type': 'Point', 'coordinates': [9.74906, 52.36936]},
    'properties': {
      'text': '30171 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.74466, 52.36913], [9.74466, 52.3699], [9.75217, 52.3699], [9.75217, 52.36913], [9.74466, 52.36913]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30171',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019235'
  }, {
    'type': 'Feature',
    'bbox': [9.74576183379838, 52.3700260899093, 9.75354419531765, 52.3803990021555],
    'geometry': {'type': 'Point', 'coordinates': [9.74945, 52.37638]},
    'properties': {
      'text': '30175 Hannover - Mitte',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.74576, 52.37003], [9.74576, 52.3804], [9.75354, 52.3804], [9.75354, 52.37003], [9.74576, 52.37003]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30175',
      'ort': 'Hannover',
      'ortsteil': 'Mitte'
    },
    'id': 'DEGAC00000019241'
  }, {
    'type': 'Feature',
    'bbox': [9.6518180756851, 52.3727833386328, 9.67842415429486, 52.3901010175005],
    'geometry': {'type': 'Point', 'coordinates': [9.66327, 52.37702]},
    'properties': {
      'text': '30453 Hannover - Ahlem',
      'typ': 'Ort',
      'score': 1.8632579,
      'bbox': {
        'type': 'Polygon',
        'coordinates': [[[9.65182, 52.37278], [9.65182, 52.3901], [9.67842, 52.3901], [9.67842, 52.37278], [9.65182, 52.37278]]]
      },
      'ags': '03241001',
      'rs': '032410001001',
      'schluessel': '0324100010010000',
      'bundesland': 'Niedersachsen',
      'regbezirk': 'Hannover',
      'kreis': 'Hannover, Region',
      'verwgem': 'Hannover',
      'gemeinde': 'Hannover, Landeshauptstadt',
      'plz': '30453',
      'ort': 'Hannover',
      'ortsteil': 'Ahlem'
    },
    'id': 'DEGAC00000019263'
  }];
}*/

