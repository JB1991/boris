/* eslint-disable complexity */
/* istanbul ignore next */
export function init(Survey) {
    const widget = {
        name: 'imageselector',
        title: 'Imageselector',
        iconName: 'icon-imageselector',
        widgetIsLoaded: function () {
            return true;
        },
        isFit: function (question) {
            return question.getType() === 'imageselector';
        },
        htmlTemplate: '<div></div>',
        activatedByChanged: function (activatedBy) {
            Survey.JsonObject.metaData.addClass('imageselector', [], null, 'imagepicker');
        },
        afterRender: function (question, el) {
            // forearch create element
            for (const choice of question.choices) {
                // create container
                const figure = document.createElement('button');
                figure.style.width = question.imageWidth + 'px';
                figure.classList.add('figure', 'align-top', 'm-2', 'p-1');
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
                const img = document.createElement('img');
                img.classList.add('figure-img', 'img-fluid', 'rounded');
                img.src = choice.imageLink;
                img.width = question.imageWidth;
                img.height = question.imageHeight;
                img.style.width = question.imageWidth + 'px';
                img.style.height = question.imageHeight + 'px';
                img.style.objectFit = question.imageFit;
                img.alt = choice.text;

                // create caption
                const figcaption = document.createElement('figcaption');
                figcaption.classList.add('text-left');
                figcaption.innerText = choice.text;

                // append
                figure.appendChild(img);
                figure.appendChild(figcaption);
                el.appendChild(figure);
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
                }
            }

            // readonly callback
            question.readOnlyChangedCallback = function () {
                for (const button of el.getElementsByTagName('button') as HTMLButtonElement[]) {
                    if (question.isReadOnly) {
                        button.disabled = true;
                        button.setAttribute('aria-disabled', 'true');
                    } else {
                        button.disabled = false;
                        button.setAttribute('aria-disabled', 'false');
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

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype');
}
