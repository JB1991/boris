/* eslint-disable @typescript-eslint/no-empty-function */
import { CustomWidgetCollection, JsonObject, Question } from 'survey-angular';
import { create } from 'nouislider';

/* eslint-disable complexity */
/* istanbul ignore next */
/**
 * Initializes nouislider widget
 */
export function init(): void {
    const widget = {
        name: 'nouislider',
        title: 'noUiSlider',
        widgetIsLoaded: function () {
            return typeof create !== 'undefined';
        },
        isFit: function (question: Question) {
            return question.getType() === 'nouislider';
        },
        htmlTemplate:
            '<div><div></div></div>',
        activatedByChanged: function (activatedBy: string) {
            JsonObject.metaData.addClass('nouislider', [], undefined, 'rating');
            JsonObject.metaData.addProperties('nouislider', [
                {
                    name: 'step:number',
                    category: 'slider',
                    categoryIndex: 1,
                    default: 1
                },
                {
                    name: 'rangeMin:number',
                    category: 'slider',
                    default: 0
                },
                {
                    name: 'rangeMax:number',
                    category: 'slider',
                    default: 100
                },
                {
                    name: 'pipsMode',
                    category: 'slider',
                    default: 'positions'
                },
                {
                    name: 'pipsDensity:number',
                    category: 'slider',
                    default: 6
                },
                {
                    name: 'orientation:string',
                    category: 'slider',
                    default: 'horizontal'
                },
                {
                    name: 'direction:string',
                    category: 'slider',
                    default: 'ltr'
                },
                {
                    name: 'tooltips:boolean',
                    category: 'slider',
                    default: true
                },
                {
                    name: 'inputbox:boolean',
                    category: 'slider',
                    default: false
                },
                {
                    name: 'double:boolean',
                    category: 'slider',
                    default: false
                },
                {
                    name: 'decimals:number',
                    category: 'slider',
                    default: 2
                },
                {
                    name: 'circa:boolean',
                    category: 'slider',
                    default: false
                }
            ]);
        },
        afterRender: function (question: Question, el: HTMLElement) {
            el.style.paddingBottom = '19px';
            el.style.paddingLeft = '22px';
            el.style.paddingRight = '29px';
            el.style.paddingTop = '44px';

            el = el.children[0] as HTMLElement;
            el.style.marginBottom = '60px';
            if (question['orientation'] === 'vertical') {
                el.style.height = '250px';
            }

            // pips
            question['pipsValues'] = [];
            if (question['pipsDensity'] === 1) {
                question['pipsValues'].splice(0, 0, 0);
            } else if (question['pipsDensity'] === 2) {
                question['pipsValues'].splice(0, 0, 0);
                question['pipsValues'].splice(0, 0, 100);
            } else {
                for (let i = 0; i < question['pipsDensity']; i++) {
                    question['pipsValues'].splice(0, 0, (100 / (question['pipsDensity'] - 1)) * i);
                }
            }

            // double slider option
            let start;
            let connect;
            if (!question['double']) {
                if (typeof question.value !== 'number') {
                    start = (question['rangeMin'] + question['rangeMax']) / 2;
                    question.value = start;
                } else {
                    start = question.value || (question['rangeMin'] + question['rangeMax']) / 2;
                }
                connect = [true, false];
            } else {
                const tmp = (question['rangeMax'] - question['rangeMin']) / 3;
                if (!question.value || question.value.length !== 2) {
                    start = [question['rangeMin'] + tmp, question['rangeMin'] + tmp * 2];
                    question.value = start;
                } else {
                    start = question.value || [question['rangeMin'] + tmp, question['rangeMin'] + tmp * 2];
                }
                connect = [false, true, false];
            }

            const slider = create(el, {
                start: start,
                connect: connect,
                step: question['step'],
                tooltips: question['tooltips'],
                pips: {
                    mode: question['pipsMode'] || 'positions',
                    stepped: true,
                    values: question['pipsValues'].map(function (pVal: any) {
                        return Number(pVal).toFixed(question['decimals']);
                    }),
                    density: 100,
                    format: {
                        to: function (pVal) {
                            return Number(pVal).toFixed(question['decimals']);
                        },
                        from: function (pVal) {
                            return false;
                        }
                    }
                },
                format: {
                    to: function (value) {
                        return Number(value).toFixed(question['decimals']);
                    },
                    from: function (value) {
                        return question['decimals'] > 0 ? parseFloat(value) : parseInt(value, 10);
                    }
                },
                range: {
                    min: Number(question['rangeMin']),
                    max: Number(question['rangeMax'])
                },
                orientation: question['orientation'],
                direction: question['direction']
            });

            slider.on('change', function () {
                question.value = slider.get();
            });

            // modifications
            if (question['inputbox'] || question['circa']) {
                const container = document.createElement('div');
                container.style.marginTop = '-40px';
                container.style.marginBottom = '60px';

                // Circa value
                if (question['circa']) {
                    if (typeof (question.survey as any).getValue(question.name + '-circa') === 'undefined') {
                        (question.survey as any).setValue(question.name + '-circa', false);
                    }
                    const divcirca = document.createElement('div');

                    // create element
                    const divform = document.createElement('div');
                    divform.classList.add('custom-control', 'custom-checkbox');
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = (question.survey as any).getValue(question.name + '-circa') === true;
                    input.classList.add('custom-control-input');
                    input.id = question.id + '-circa';
                    const label = document.createElement('label');
                    label.classList.add('custom-control-label');
                    label.innerText = $localize`Angabe ist ein Schätzwert`;
                    label.htmlFor = question.id + '-circa';

                    // handler
                    input.onchange = function () {
                        (question.survey as any).setValue(question.name + '-circa', input.checked);
                    };

                    // append
                    divform.appendChild(input);
                    divform.appendChild(label);
                    divcirca.appendChild(divform);
                    container.append(divcirca);
                }

                // value input
                if (question['inputbox']) {
                    const divinputbox = document.createElement('div');
                    divinputbox.setAttribute('aria-hidden', 'true');

                    // create element
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = question['rangeMin'];
                    input.max = question['rangeMax'];
                    input.step = question['step'];
                    input.className = 'ml-2';

                    // handler
                    input.onchange = function () {
                        question.value = input.value;
                        slider.set(input.value);
                    };
                    slider.on('update', function () {
                        input.value = slider.get().toString();
                    });

                    // append
                    divinputbox.appendChild(document.createTextNode($localize`Eingabewert`));
                    divinputbox.appendChild(input);
                    container.appendChild(divinputbox);
                }

                // append
                if (el.parentNode) {
                    el.parentNode.insertBefore(container, el.parentNode.firstChild);
                }
            }

            // handler
            const updateValueHandler = function (): void {
                slider.set(question.value);
            };
            const readOnlyChangedCallback = function (): void {
                if (!el.parentNode) {
                    return;
                }
                const childs = Array.from((el.parentNode.firstChild as HTMLElement).getElementsByTagName('input'));
                if (question.isReadOnly) {
                    el.setAttribute('disabled', 'true');
                    for (const input of childs) {
                        input.setAttribute('disabled', 'true');
                    }
                } else {
                    el.removeAttribute('disabled');
                    for (const input of childs) {
                        input.removeAttribute('disabled');
                    }
                }
            };
            updateValueHandler();
            readOnlyChangedCallback();
            question['noUiSlider'] = slider;
            question.valueChangedCallback = updateValueHandler;
            question.readOnlyChangedCallback = readOnlyChangedCallback;
            question.value = slider.get();
        },
        willUnmount: function (question: Question, el: HTMLElement) {
            if (question['noUiSlider']) {
                question['noUiSlider'].destroy();
                question['noUiSlider'] = null;
            }
            question.valueChangedCallback = () => { };
            question.readOnlyChangedCallback = () => { };
        }
    };

    CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
}
