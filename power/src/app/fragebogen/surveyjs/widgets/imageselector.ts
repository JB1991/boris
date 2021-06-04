import { CustomWidgetCollection, JsonObject } from 'survey-angular';

/* eslint-disable complexity */
/* istanbul ignore next */
/**
 * Initializes nouislider widget
 */
export function init(): void {
    const widget = {
        name: 'imageselector',
        title: 'Imageselector',
        widgetIsLoaded: function () {
            return true;
        },
        isFit: function (question) {
            return question.getType() === 'imageselector';
        },
        htmlTemplate: '<div></div>',
        activatedByChanged: function (activatedBy: string) {
            JsonObject.metaData.addClass('imageselector', [], null, 'imagepicker');
            JsonObject.metaData.addProperties('imageselector', [
                {
                    name: 'mobiletext:boolean',
                    category: 'imageselector',
                    default: false,
                }
            ]);
        },
        afterRender: function (question, el) {
            // check size
            let maring = 'm-2';
            let width = question.imageWidth + 'px';
            if (screen.width < 576) {
                question.imageHeight = 0;
                maring = 'mb-2';
                width = '100%';
            }

            // forearch create element
            let i = 1;
            for (const choice of question.choices) {
                // create container
                const figure = document.createElement('button');
                figure.style.width = width;
                figure.classList.add('figure', 'align-top', maring, 'p-1');
                figure.type = 'button';
                figure.style.fontSize = 'inherit';
                figure.style.fontWeight = 'inherit';
                figure.style.lineHeight = 'inherit';
                figure.style.padding = '0';
                figure.style.color = 'inherit';
                figure.style.backgroundColor = 'inherit';
                figure.title = choice.text;
                figure.value = choice.value;
                figure.setAttribute('role', 'checkbox');
                figure.setAttribute('aria-label', choice.text);
                figure.setAttribute('aria-checked', 'false');
                // figure.setAttribute('aria-describedby', question.ariaTitleId);
                if (!choice.isVisible) {
                    figure.style.display = 'none';
                    figure.setAttribute('aria-hidden', 'true');
                    figure.tabIndex = -1;
                }

                // click event
                /* eslint-disable-next-line scanjs-rules/call_addEventListener */
                figure.addEventListener('click', function (event) {
                    if (!question.multiSelect) {
                        // single value
                        question.value = choice.value;

                        // mark choices as checked / unchecked
                        for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                            if (button.value === question.value) {
                                // checked
                                button.setAttribute('aria-checked', 'true');
                                button.classList.add('imagepicker-checked');
                            } else {
                                // not checked
                                button.setAttribute('aria-checked', 'false');
                                button.classList.remove('imagepicker-checked');
                            }
                        }
                    } else {
                        // multi select
                        const ret = [].concat(question.value);
                        const index = ret.indexOf(choice.value);
                        if (index > -1) {
                            ret.splice(index, 1);
                        } else {
                            ret.push(choice.value);
                        }
                        question.value = ret;

                        // mark choices as checked / unchecked
                        for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                            if (ret.includes(button.value)) {
                                // checked
                                button.setAttribute('aria-checked', 'true');
                                button.classList.add('imagepicker-checked');
                            } else {
                                // not checked
                                button.setAttribute('aria-checked', 'false');
                                button.classList.remove('imagepicker-checked');
                            }
                        }
                    }
                });

                // create image
                if (!question.mobiletext || screen.width >= 576) {
                    const img = document.createElement('img');
                    img.classList.add('figure-img', 'img-fluid', 'rounded');
                    /* eslint-disable-next-line scanjs-rules/assign_to_src */
                    img.src = choice.imageLink;
                    img.style.width = width;
                    if (question.imageHeight) {
                        img.height = question.imageHeight;
                        img.style.height = question.imageHeight + 'px';
                    }
                    img.style.objectFit = question.imageFit;
                    img.alt = choice.text;

                    // create caption
                    const figcaption = document.createElement('figcaption');
                    figcaption.classList.add('text-left');
                    figcaption.innerText = choice.text;

                    // append
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                } else {
                    // mobile without image
                    figure.style.textAlign = 'left';
                    figure.innerText = choice.text;
                }
                el.appendChild(figure);

                // rows
                if (question.colCount > 0 && i % question.colCount === 0) {
                    const divcontainer = document.createElement('div');
                    el.appendChild(divcontainer);
                }
                i++;
            }

            // value changed from surveyjs
            const updateValueHandler = function () {
                // mark choices as checked / unchecked
                if (!question.multiSelect) {
                    // single value
                    for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                        if (button.value === question.value) {
                            // checked
                            button.setAttribute('aria-checked', 'true');
                            button.classList.add('imagepicker-checked');
                        } else {
                            // not checked
                            button.setAttribute('aria-checked', 'false');
                            button.classList.remove('imagepicker-checked');
                        }
                    }
                } else {
                    // multi select
                    for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                        if (question.value.includes(button.value)) {
                            // checked
                            button.setAttribute('aria-checked', 'true');
                            button.classList.add('imagepicker-checked');
                        } else {
                            // not checked
                            button.setAttribute('aria-checked', 'false');
                            button.classList.remove('imagepicker-checked');
                        }
                    }
                }
            };
            updateValueHandler();
            question.valueChangedCallback = updateValueHandler;

            // question is readonly
            if (question.isReadOnly) {
                for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                    button.disabled = true;
                    button.setAttribute('aria-disabled', 'true');
                    button.style.opacity = '0.5';
                    button.style.cursor = 'unset';
                }
            }

            // readonly callback
            question.readOnlyChangedCallback = function () {
                for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                    if (question.isReadOnly) {
                        button.disabled = true;
                        button.setAttribute('aria-disabled', 'true');
                        button.style.opacity = '0.5';
                        button.style.cursor = 'unset';
                    } else {
                        button.disabled = false;
                        button.setAttribute('aria-disabled', 'false');
                        button.style.opacity = '1';
                        button.style.cursor = 'pointer';
                    }
                }
            };

            // visible callback
            question.visibleChoicesChangedCallback = function () {
                for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                    for (const choice of question.choices) {
                        if (choice.value !== button.value) {
                            continue;
                        }

                        if (!choice.isVisible) {
                            button.style.display = 'none';
                            button.setAttribute('aria-hidden', 'true');
                            button.tabIndex = -1;
                        } else {
                            button.style.display = 'inline-block';
                            button.setAttribute('aria-hidden', 'false');
                            button.tabIndex = 0;
                        }
                        break;
                    }
                }
            };
        },
        willUnmount: function (question, el) {
            question.valueChangedCallback = null;
            question.readOnlyChangedCallback = null;
            question.visibleChoicesChangedCallback = null;
        },
        pdfRender: function (_, options) {
            // TODO
        },
    };

    CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
}
