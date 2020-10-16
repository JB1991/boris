/**
 * default template for new formulars
 */
export const defaultTemplate = {
    title: {
        default: 'Neues Formular'
    },
    description: {},
    showTitle: true,
    locale: 'de',
    showQuestionNumbers: 'on',
    questionsOrder: 'initial',
    completedHtml: {},
    logoPosition: 'left',
    logoFit: 'contain',
    showPrevButton: true,
    showPreviewBeforeComplete: 'noPreview',
    showProgressBar: 'bottom',
    progressBarType: 'pages',
    showTimerPanel: 'none',
    showTimerPanelMode: 'all',
    pages: [
        {
            elements: [
                {
                    title: {
                        default: 'Datenschutzerklärung'
                    },
                    description: {
                        default: 'Unsere Datenschutzerklärung finden Sie unter [lgln.niedersachsen.de](https://www.lgln.niedersachsen.de/startseite/wir_uber_uns_amp_organisation/datenschutz/datenschutz-im-lgln-138166.html).'
                    },
                    name: 'e1',
                    type: 'checkbox',
                    valueName: '',
                    choices: [
                        {
                            value: '1',
                            text: {
                                default: 'Ich habe diese gelesen und akzeptiert.'
                            }
                        }
                    ],
                    requiredErrorText: {
                        default: 'Sie müssen die Datenschutzerklärung akzeptieren um fortzufahren.'
                    },
                    commentText: {},
                    colCount: 1,
                    startWithNewLine: true,
                    visible: true,
                    isRequired: true
                }
            ],
            title: {
                default: 'Startseite'
            },
            description: {
                default: 'Zum Ausfüllen dieses Online-Formulars müssen Sie zuerst einige Bedingungen akzeptieren.'
            },
            questionsOrder: 'default',
            visible: true,
            name: 'p1'
        }
    ],
    calculatedValues: []
};

/**
 * List of all formular field with icons and template
 */
export const FormularFields = [
    {
        type: 'text',
        name: $localize`Eingabefeld`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'text',
            inputType: 'text',
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, /*{
        type: 'multipletext',
        name: $localize`Mehrfachtext`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-list-ul" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'multipletext',
            items: [
                {
                    title: { default: 'Vorname' },
                    name: 'name',
                    isRequired: true,
                    inputType: 'text',
                }, {
                    title: { default: 'Nachname' },
                    name: 'surname',
                    isRequired: true,
                    inputType: 'text',
                }
            ],
            colCount: 2,
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    },*/ {
        type: 'comment',
        name: $localize`Kommentarfeld`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat-right-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M2 1h12a1 1 0 0 1 1 1v11.586l-2-2A2 2 0 0 0 11.586 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>\
    <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'comment',
            rows: 4,
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'boolean',
        name: $localize`Ja/Nein`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-toggle-on" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
        <path fill-rule="evenodd" d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>\
      </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'boolean',
            labelTrue: {},
            labelFalse: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'radiogroup',
        name: $localize`Einfachauswahl`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check2-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>\
    <path fill-rule="evenodd" d="M8 2.5A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0 6.5 6.5 0 1 1-3.25-5.63.5.5 0 1 1-.5.865A5.472 5.472 0 0 0 8 2.5z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'radiogroup',
            choices: [
                {
                    value: '1',
                    text: {
                        default: 'Ja'
                    }
                }, {
                    value: '0',
                    text: {
                        default: 'Nein'
                    }
                }
            ],
            colCount: 1,
            choicesOrder: 'none',
            commentText: {},
            otherText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'checkbox',
        name: $localize`Mehrfachauswahl`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check2-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>\
    <path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5V8a.5.5 0 0 0-1 0v5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 3v10z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'checkbox',
            choices: [
                {
                    value: '1',
                    text: {
                        default: 'Ja'
                    }
                }, {
                    value: '0',
                    text: {
                        default: 'Nein'
                    }
                }
            ],
            colCount: 1,
            choicesOrder: 'none',
            commentText: {},
            otherText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'imagepicker',
        name: $localize`Bilderauswahl`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-images" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M12.002 4h-10a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10z"/>\
    <path d="M10.648 8.646a.5.5 0 0 1 .577-.093l1.777 1.947V14h-12v-1l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"/>\
    <path fill-rule="evenodd" d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'imagepicker',
            choices: [
                {
                    value: 'oldenburg-cloppenburg',
                    text: {
                        default: 'RD Oldenburg-Cloppenburg'
                    },
                    imageLink: 'https://www.lgln.niedersachsen.de/assets/image/232/123847'
                }, {
                    value: 'otterndorf',
                    text: {
                        default: 'RD Otterndorf'
                    },
                    imageLink: 'https://www.lgln.niedersachsen.de/assets/image/184052'
                }
            ],
            colCount: 0,
            choicesOrder: 'none',
            showLabel: true,
            imageFit: 'fill',
            imageWidth: 200,
            imageHeight: 150,
            commentText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'rating',
        name: $localize`Bewertung`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'rating',
            rateStep: 1,
            rateMax: 5,
            maxRateDescription: {
                default: 'Sehr gut'
            },
            rateMin: 1,
            minRateDescription: {
                default: 'Sehr schlecht'
            },
            commentText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'nouislider',
        name: $localize`Slider`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-sliders" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M14 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM11.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM4.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9.5 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM11.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>\
    <path fill-rule="evenodd" d="M9.5 4H0V3h9.5v1zM16 4h-2.5V3H16v1zM9.5 14H0v-1h9.5v1zm6.5 0h-2.5v-1H16v1zM6.5 9H16V8H6.5v1zM0 9h2.5V8H0v1z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'nouislider',
            step: 1,
            rangeMin: 0,
            rangeMax: 100,
            decimals: 0,
            commentText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'matrix',
        name: $localize`Likert Skala`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-grid-3x2-gap" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M4 4H2v2h2V4zm1 7V9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 5V9a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 4H7v2h2V4zm5 0h-2v2h2V4zM4 9H2v2h2V9zm5 0H7v2h2V9zm5 0h-2v2h2V9zm-3-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'matrix',
            columns: [
                {
                    value: 0,
                    text: {
                        default: 'Sehr schlecht'
                    }
                }, {
                    value: 1,
                    text: {
                        default: 'Schlecht'
                    }
                }, {
                    value: 2,
                    text: {
                        default: 'Neutral'
                    }
                }, {
                    value: 3,
                    text: {
                        default: 'Gut'
                    }
                }, {
                    value: 4,
                    text: {
                        default: 'Sehr gut'
                    }
                }
            ],
            rows: [
                {
                    value: 'q1',
                    text: {
                        default: 'Titel der Frage'
                    }
                }
            ],
            isAllRowRequired: true,
            hideIfRowsEmpty: true,
            rowsOrder: 'initial',
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'signaturepad',
        name: $localize`Unterschrift`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pen" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'signaturepad',
            width: 600,
            dataFormat: 'image/svg+xml',
            penColor: '#000000',
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }, {
        type: 'file',
        name: $localize`Fileupload`,
        icon: '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cloud-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
    <path fill-rule="evenodd" d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>\
    <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>\
  </svg>',
        template: {
            title: {},
            description: {},
            name: '',
            type: 'file',
            storeDataAsText: true,
            waitForUpload: true,
            allowMultiple: false,
            allowImagesPreview: true,
            acceptedTypes: 'application/pdf',
            imageWidth: 200,
            maxSize: 5242880,
            commentText: {},
            startWithNewLine: true,
            visible: true,
            isRequired: true,
            requiredErrorText: {}
        }
    }
];
