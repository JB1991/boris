/**
 * default template for new formulars
 */
export const FormularTemplate = {
  locale: 'de',
  title: 'Neues Formular',
  loadingHtml: 'Das Formular wird geladen <div class=\'spinner-border\' role=\'status\'></div>',
  completedHtml: 'Vielen Dank für das Abschließen von diesem Formular.',
  pages: [
    {
      elements: [
        {
          title: 'Datenschutzerklärung',
          description: 'Unsere Datenschutzerklärung finden sie unter [lgln.niedersachsen.de]\
(https://www.lgln.niedersachsen.de/startseite/wir_uber_uns_amp_organisation/datenschutz/datenschutz-im-lgln-138166.html).',
          name: 'e1',
          type: 'checkbox',
          valueName: '',
          choices: [
            {
              value: '1',
              text: 'Ich habe diese gelesen und akzeptiert'
            }
          ],
          requiredErrorText: 'Sie müssen die Datenschutzerklärung akzeptieren um fortzufahren.',
          colCount: 1,
          isRequired: true
        }
      ],
      title: 'Startseite',
      description: 'Zum Ausfüllen dieses Online-Formulars müssen Sie zuerst einige Bedingungen akzeptieren.',
      name: 'p1'
    }
  ],
  calculatedValues: [
    {
      name: 'preis',
      expression: '50000'
    },
    {
      name: 'kaufjahr',
      expression: '2019'
    }
  ],
  sendResultOnPageNext: true,
  showQuestionNumbers: 'onPage',
  showProgressBar: 'bottom',
  maxTextLength: 1000,
  maxOthersLength: 100,
  storeOthersAsComment: false,
  checkErrorsMode: 'onValueChanged'
};

/**
 * DatabaseMap holds infos for mapping formular elements to database columns
 */
export const DatabaseMap = [
    {text: 'Baujahr', dbvalue: 'baujahr', dbtype: 'int', commentvalue: '', commenttype: ''},
    {text: 'Gebäudeart', dbvalue: 'gebaeudeart', dbtype: 'string', commentvalue: '', commenttype: ''},
];

/**
 * List of all formular field with icons and template
 */
export const FormularFields = [
  {
    type: 'text',
    name: 'Eingabefeld',
    icon: 'fas fa-font',
    template : {
      title: 'Titel der Frage',
      name: '',
      type: 'text',
      valueName: '',
      inputType: 'text',
      isRequired: true
    }
  }, {
    type: 'comment',
    name: 'Kommentarfeld',
    icon: 'fas fa-align-left',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'comment',
      valueName: '',
      rows: 4,
      isRequired: true
    }
  }, {
    type: 'radiogroup',
    name: 'Einfachauswahl',
    icon: 'far fa-check-circle',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'radiogroup',
      valueName: '',
      choices: [
          {
              value: '1',
              text: 'Ja'
          }, {
              value: '0',
              text: 'Nein'
          }
      ],
      colCount: 1,
      isRequired: true
    }
  }, {
    type: 'checkbox',
    name: 'Mehrfachauswahl',
    icon: 'far fa-check-square',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'checkbox',
      valueName: '',
      choices: [
          {
              value: '1',
              text: 'Ja'
          }, {
              value: '0',
              text: 'Nein'
          }
      ],
      colCount: 1,
      isRequired: true
    }
  }, {
    type: 'imagepicker',
    name: 'Bilderauswahl',
    icon: 'far fa-images',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'imagepicker',
      valueName: '',
      choices: [
          {
              value: 'oldenburg-cloppenburg',
              text: 'RD Oldenburg-Cloppenburg',
              imageLink: 'https://www.lgln.niedersachsen.de/assets/image/232/123847'
          }, {
              value: 'otterndorf',
              text: 'RD Otterndorf',
              imageLink: 'https://www.lgln.niedersachsen.de/assets/image/184052'
          }
      ],
      colCount: 0,
      showLabel: true,
      imageFit: 'fill',
      isRequired: true
    }
  }, {
    type: 'rating',
    name: 'Bewertung',
    icon: 'fas fa-star-half-alt',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'rating',
      valueName: '',
      rateMax: 5,
      maxRateDescription: 'Sehr gut',
      rateMin: 1,
      minRateDescription: 'Sehr schlecht',
      isRequired: true
    }
  }, {
    type: 'nouislider',
    name: 'Slider',
    icon: 'fas fa-sliders-h',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'nouislider',
      valueName: '',
      step: 1,
      rangeMin: 0,
      rangeMax: 1000,
      isRequired: true
    }
  }, {
    type: 'matrix',
    name: 'Likert Skala',
    icon: 'fas fa-table',
    template: {
      title: 'Titel der Frage',
      name: '',
      type: 'matrix',
      valueName: '',
      columns: [
          {
              value: 0,
              text: 'Sehr schlecht'
          }, {
              value: 1,
              text: 'Schlecht'
          }, {
              value: 2,
              text: 'Neutral'
          }, {
              value: 3,
              text: 'Gut'
          }, {
              value: 4,
              text: 'Sehr gut'
          }
      ],
      rows: [
          {
              value: 'q1',
              text: 'Titel der Frage'
          }
      ],
      isAllRowRequired: true,
      isRequired: true
    }
  }
];
