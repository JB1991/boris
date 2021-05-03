import noUiSlider from 'nouislider';

/* eslint-disable complexity */
/* istanbul ignore next */
export function init(Survey) {
    const widget = {
        name: 'nouislider',
        title: 'noUiSlider',
        iconName: 'icon-nouislider',
        widgetIsLoaded: function () {
            return typeof noUiSlider !== 'undefined';
        },
        isFit: function (question) {
            return question.getType() === 'nouislider';
        },
        htmlTemplate:
            '<div><div></div></div>',
        activatedByChanged: function (activatedBy) {
            Survey.JsonObject.metaData.addClass('nouislider', [], null, 'rating');
            Survey.JsonObject.metaData.addProperties('nouislider', [
                {
                    name: 'step:number',
                    category: 'slider',
                    categoryIndex: 1,
                    default: 1,
                },
                {
                    name: 'rangeMin:number',
                    category: 'slider',
                    default: 0,
                },
                {
                    name: 'rangeMax:number',
                    category: 'slider',
                    default: 100,
                },
                {
                    name: 'pipsMode',
                    category: 'slider',
                    default: 'positions',
                },
                {
                    name: 'pipsDensity:number',
                    category: 'slider',
                    default: 6,
                },
                {
                    name: 'orientation:string',
                    category: 'slider',
                    default: 'horizontal',
                },
                {
                    name: 'direction:string',
                    category: 'slider',
                    default: 'ltr',
                },
                {
                    name: 'tooltips:boolean',
                    category: 'slider',
                    default: true,
                },
                {
                    name: 'inputbox:boolean',
                    category: 'slider',
                    default: false,
                },
                {
                    name: 'double:boolean',
                    category: 'slider',
                    default: false,
                },
                {
                    name: 'decimals:number',
                    category: 'slider',
                    default: 2,
                },
            ]);
        },
        afterRender: function (question, el) {
            el.style.paddingBottom = '19px';
            el.style.paddingLeft = '22px';
            el.style.paddingRight = '29px';
            el.style.paddingTop = '44px';
            if (question.inputbox) {
                el.style.paddingTop = '19px';
            }

            el = el.children[0];
            el.style.marginBottom = '60px';
            if (question.orientation === 'vertical') {
                el.style.height = '250px';
            }

            // pips
            question.pipsValues = [];
            if (question.pipsDensity === 1) {
                question.pipsValues.splice(0, 0, 0);
            } else if (question.pipsDensity === 2) {
                question.pipsValues.splice(0, 0, 0);
                question.pipsValues.splice(0, 0, 100);
            } else {
                for (let i = 0; i < question.pipsDensity; i++) {
                    question.pipsValues.splice(0, 0, (100 / (question.pipsDensity - 1)) * i);
                }
            }

            // double slider option
            let start;
            let connect;
            if (!question.double) {
                if (typeof question.value !== 'number') {
                    start = (question.rangeMin + question.rangeMax) / 2;
                    question.value = start;
                } else {
                    start = question.value || (question.rangeMin + question.rangeMax) / 2;
                }
                connect = [true, false];
            } else {
                const tmp = (question.rangeMax - question.rangeMin) / 3;
                if (!question.value || question.value.length !== 2) {
                    start = [question.rangeMin + tmp, question.rangeMin + tmp * 2];
                    question.value = start;
                } else {
                    start = question.value || [question.rangeMin + tmp, question.rangeMin + tmp * 2];
                }
                connect = [false, true, false];
            }

            const slider = noUiSlider.create(el, {
                start: start,
                connect: connect,
                step: question.step,
                tooltips: question.tooltips,
                pips: {
                    mode: question.pipsMode || 'positions',
                    stepped: true,
                    values: question.pipsValues.map(function (pVal) {
                        return Number(pVal).toFixed(question.decimals);
                    }),
                    density: 100,
                    format: {
                        to: function (pVal) {
                            return Number(pVal).toFixed(question.decimals);
                        },
                        from: function (pVal) {
                            return false;
                        }
                    },
                },
                format: {
                    to: function (value) {
                        return Number(value).toFixed(question.decimals);
                    },
                    from: function (value) {
                        return question.decimals > 0 ? parseFloat(value) : parseInt(value, 10);
                    }
                },
                range: {
                    min: Number(question.rangeMin),
                    max: Number(question.rangeMax),
                },
                orientation: question.orientation,
                direction: question.direction,
            });

            slider.on('change', function () {
                question.value = slider.get();
            });

            if (question.inputbox) {
                const container = document.createElement('div');
                container.className = 'mb-5';
                container.setAttribute('aria-hidden', 'true');

                const input = document.createElement('input');
                input.type = 'number';
                input.min = question.rangeMin;
                input.max = question.rangeMax;
                input.step = question.step;
                input.className = 'ml-2';

                container.appendChild(document.createTextNode($localize`Eingabewert`));
                container.appendChild(input);
                el.parentNode.insertBefore(container, el.parentNode.firstChild);

                input.onchange = () => {
                    question.value = input.value;
                    slider.set(input.value);
                };
                slider.on('update', function () {
                    input.value = slider.get().toString();
                });
            }

            const updateValueHandler = function () {
                slider.set(question.value);
            };

            if (question.isReadOnly) {
                el.setAttribute('disabled', true);
            }
            updateValueHandler();
            question.noUiSlider = slider;
            question.valueChangedCallback = updateValueHandler;
            question.readOnlyChangedCallback = function () {
                if (question.isReadOnly) {
                    el.setAttribute('disabled', true);
                } else {
                    el.removeAttribute('disabled');
                }
            };
            question.value = slider.get();
        },
        willUnmount: function (question, el) {
            if (!!question.noUiSlider) {
                question.noUiSlider.destroy();
                question.noUiSlider = null;
            }
            question.valueChangedCallback = null;
            question.readOnlyChangedCallback = null;
        },
        pdfRender: function (_, options) {
            if (options.question.getType() === 'nouislider') {
                const point = options.module.SurveyHelper.createPoint(
                    options.module.SurveyHelper.mergeRects.apply(null, options.bricks)
                );
                point.xLeft += options.controller.unitWidth;
                point.yTop +=
                    options.controller.unitHeight *
                    options.module.FlatQuestion.CONTENT_GAP_VERT_SCALE;
                const rect = options.module.SurveyHelper.createTextFieldRect(
                    point,
                    options.controller
                );
                const textboxBrick = new options.module.TextFieldBrick(
                    options.question,
                    options.controller,
                    rect,
                    true,
                    options.question.id,
                    options.question.value || options.question.defaultValue || '',
                    '',
                    options.question.isReadOnly,
                    false,
                    'text'
                );
                options.bricks.push(textboxBrick);
            }
        },
    };

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
}
