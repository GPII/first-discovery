/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.panel");

    /*
     * Ranged panel: used as a grade for text size panel and other panels to adjust their preferences in a range
     */
    fluid.defaults("gpii.firstDiscovery.panel.ranged", {
        gradeNames: ["fluid.prefs.panel", "gpii.firstDiscovery.attachTooltip.renderer", "autoInit"],
        // Preferences Maps should direct the default model state
        // to model.value. The component is configured
        // with the expectation that "value" is the salient model property.
        // model: {
        //     value: number
        // },
        range: {
            min: 1,
            max: 2
        },
        step: 0.1,
        modelRelay: {
            target: "value",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.value",
                min: "{that}.options.range.min",
                max: "{that}.options.prange.max"
            }
        },
        selectors: {
            rangeInstructions: ".gpiic-fd-range-instructions",
            meter: ".gpiic-fd-range-indicator",
            increase: ".gpiic-fd-range-increase",
            decrease: ".gpiic-fd-range-decrease"
        },
        selectorsToIgnore: ["meter", "increase", "decrease"],
        tooltipContentMap: {
            "increase": "increaseLabel",
            "decrease": "decreaseLabel"
        },
        protoTree: {
            rangeInstructions: {messagekey: "rangeInstructions"}
        },
        invokers: {
            stepUp: {
                funcName: "gpii.firstDiscovery.panel.ranged.step",
                args: ["{that}"]
            },
            stepDown: {
                funcName: "gpii.firstDiscovery.panel.ranged.step",
                args: ["{that}", true]
            },
            updateMeter: {
                funcName: "gpii.firstDiscovery.panel.ranged.updateMeter",
                args: ["{that}", "{that}.model.value"]
            }
        },
        listeners: {
            "afterRender.bindIncrease": {
                "this": "{that}.dom.increase",
                "method": "click",
                "args": ["{that}.stepUp"]
            },
            "afterRender.bindDecrease": {
                "this": "{that}.dom.decrease",
                "method": "click",
                "args": ["{that}.stepDown"]
            },
            "afterRender.updateButtonState": {
                listener: "gpii.firstDiscovery.panel.ranged.updateButtonState",
                args: ["{that}"]
            },
            "afterRender.updateMeter": "{that}.updateMeter"
        },
        modelListeners: {
            value: [{
                listener: "{that}.updateMeter",
                excludeSource: "init"
            }, {
                listener: "gpii.firstDiscovery.panel.ranged.updateButtonState",
                excludeSource: "init",
                args: ["{that}"]
            }]
        }
    });

    gpii.firstDiscovery.panel.ranged.step = function (that, reverse) {
        that.tooltip.close();   // close the existing tooltip before the panel is re-rendered

        var step = reverse ? (that.options.step * -1) : that.options.step;
        var newValue = that.model.value + step;
        that.applier.change("value", newValue);
    };

    gpii.firstDiscovery.panel.ranged.updateButtonState = function (that) {
        var isMax = that.model.value >= that.options.range.max;
        var isMin = that.model.value <= that.options.range.min;

        that.locate("increase").prop("disabled", isMax);
        that.locate("decrease").prop("disabled", isMin);
    };

    gpii.firstDiscovery.panel.ranged.updateMeter = function (that, value) {
        var range = that.options.range;
        var percentage = ((value - range.min) / (range.max - range.min)) * 100;
        that.locate("meter").css("height", percentage + "%");
    };

    fluid.defaults("gpii.firstDiscovery.panel.keyboard", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.stickyKeysEnabled": {
                "model.stickyKeysEnabled": "default"
            }
        },
        selectors: {
            input: ".gpiic-fd-keyboard-input",
            instructions: ".gpiic-fd-keyboard-instructions",
            assistance: ".gpiic-fd-keyboard-assistance"
        },
        selectorsToIgnore: ["assistance"],
        events: {
            onOfferAssistance: null,
            onInitInput: null
        },
        model: {
            // offerAssistance: boolean
            // tryAccommodation: boolean
            userInput: ""
        },
        components: {
            assistance: {
                type: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster",
                createOnEvent: "onOfferAssistance",
                container: "{that}.container",
                options: {
                    messageBase: "{keyboard}.options.messageBase",
                    model: {
                        tryAccommodation: "{keyboard}.model.tryAccommodation",
                        stickyKeysEnabled: "{keyboard}.model.stickyKeysEnabled"
                    }
                }
            },
            stickyKeysAssessor: {
                type: "gpii.firstDiscovery.keyboard.stickyKeysAssessment",
                options: {
                    requiredInput: "%",
                    model: {
                        userInput: "{keyboard}.model.userInput",
                        offerAssistance: "{keyboard}.model.offerAssistance"
                    }
                }
            },
            keyboardInput: {
                type: "gpii.firstDiscovery.keyboardInput",
                createOnEvent: "onInitInput",
                container: "{that}.dom.input",
                options: {
                    gradeNames: ["gpii.firstDiscovery.keyboardInputTts"],
                    model: {
                        userInput: "{keyboard}.model.userInput",
                        stickyKeysEnabled: "{keyboard}.model.stickyKeysEnabled"
                    },
                    messageBase: "{keyboard}.options.messageBase"
                }
            }
        },
        protoTree: {
            expander: {
                type: "fluid.renderer.condition",
                condition: "{that}.model.offerAssistance",
                trueTree: {
                    input: {
                        value: "${userInput}",
                        decorators: {
                            attrs: {
                                placeholder: "{that}.msgLookup.placeholder"
                            }
                        }
                    },
                    instructions: {markup: {messagekey: "stickyKeysInstructions"}}
                },
                falseTree: {
                    expander: {
                        type: "fluid.renderer.condition",
                        condition: {
                            funcName: "gpii.firstDiscovery.panel.keyboard.isSet",
                            args: ["{that}.model", "offerAssistance"]
                        },
                        trueTree: {
                            instructions: {markup: {messagekey: "successInstructions"}}
                        },
                        falseTree: {
                            input: {
                                decorators: {
                                    attrs: {
                                        placeholder: "{that}.msgLookup.placeholder"
                                    }
                                }
                            },
                            instructions: {markup: {messagekey: "keyboardInstructions"}}
                        }
                    }
                }
            }
        },
        invokers: {
            toggleAssistance: {
                "this": "{that}.dom.assistance",
                "method": "toggle",
                "args": ["{arguments}.0"]
            }
        },
        listeners: {
            "afterRender.toggleAssistance": {
                func: "{that}.toggleAssistance",
                args: ["{that}.model.offerAssistance"]
            },
            "afterRender.relayEvents": {
                funcName: "gpii.firstDiscovery.panel.keyboard.relayEvents",
                args: ["{that}"]
            }
        },
        modelListeners: {
            offerAssistance: [{
                listener: "{that}.refreshView",
                excludeSource: "init"
            }, {
                listener: "gpii.firstDiscovery.panel.keyboard.destroy",
                args: ["{stickyKeysAssessor}"]
            }]
        }
    });

    gpii.firstDiscovery.panel.keyboard.isSet = function (model, path) {
        var value = fluid.get(model, path);
        return value !== undefined;
    };

    gpii.firstDiscovery.panel.keyboard.relayEvents = function (that) {
        var offerAssistance = that.model.offerAssistance;
        if (offerAssistance !== false) {
            that.events.onInitInput.fire();
            if (offerAssistance) {
                that.events.onOfferAssistance.fire();
            }
        }
    };

    gpii.firstDiscovery.panel.keyboard.destroy = function (that) {
        if (that) {
            that.destroy();
        }
    };

    /*
     * Text size panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged", "autoInit"],
        preferenceMap: {
            "fluid.prefs.textSize": {
                "model.value": "default",
                "range.min": "minimum",
                "range.max": "maximum",
                "step": "divisibleBy"
            }
        }
    });

    /*
     * Text to speech panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.speakText", {
        gradeNames: ["fluid.prefs.panel", "gpii.firstDiscovery.attachTooltip.renderer", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.speak": {
                "model.speak": "default"
            }
        },
        modelRelay: [{
            source: "{that}.model.speakChoice",
            target: "{that}.model.speak",
            // Setup the backward restriction to prevent the component instantiation writes back to
            // the central model that results in wiping out the saved prefs at the page reload.
            forward: "liveOnly",
            singleTransform: {
                type: "fluid.transforms.valueMapper",
                inputPath: "",
                options: {
                    "yes": true,
                    "no": {
                        outputValue: false
                    }
                }
            }
        }, {
            source: "{that}.model.speakChoice",
            target: "currentSelectedIndex",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.indexOf",
                array: "{that}.options.controlValues.choice",
                value: "{that}.model.speakChoice"
            }
        }],
        tooltipContentMap: {
            choiceLabel: {
                tooltip: ["speakText-yes-tooltip", "speakText-no-tooltip"],
                tooltipAtSelect: ["speakText-yes-tooltipAtSelect", "speakText-no-tooltipAtSelect"]
            },
            choiceInput: {
                tooltip: ["speakText-yes-tooltip", "speakText-no-tooltip"],
                tooltipAtSelect: ["speakText-yes-tooltipAtSelect", "speakText-no-tooltipAtSelect"]
            }
        },
        stringArrayIndex: {
            choice: ["speakText-yes", "speakText-no"]
        },
        selectors: {
            choiceRow: ".gpiic-fd-speakText-choiceRow",
            choiceLabel: ".gpiic-fd-speakText-choice-label",
            choiceInput: ".gpiic-fd-speakText-choiceInput",
            instructions: ".gpiic-fd-speakText-instructions"
        },
        controlValues: {
            choice: ["yes", "no"]
        },
        repeatingSelectors: ["choiceRow"],
        protoTree: {
            instructions: {messagekey: "speakTextInstructions"},
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "choiceRow",
                labelID: "choiceLabel",
                inputID: "choiceInput",
                selectID: "choice-radio",
                tree: {
                    optionnames: "${{that}.msgLookup.choice}",
                    optionlist: "${{that}.options.controlValues.choice}",
                    selection: "${speakChoice}"
                }
            }
        }
    });

    /*
     * language panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.lang", {
        gradeNames: ["fluid.prefs.panel", "{that}.options.prefsEditorConnection", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.language": {
                "model.lang": "default",
                "controlValues.lang": "enum",
                "stringArrayIndex.lang": "label",
                "stringArrayIndex.tooltip": "tooltip",
                "stringArrayIndex.tooltipAtSelect": "tooltipAtSelect"
            }
        },
        components: {
            attachTooltipOnLang: {
                type: "gpii.firstDiscovery.panel.lang.attachTooltipOnLang",
                container: "{lang}.container",
                options: {
                    selectors: "{lang}.options.selectors",
                    modelRelay: {
                        source: "{lang}.model.lang",
                        target: "currentSelectedIndex",
                        singleTransform: {
                            type: "fluid.transforms.indexOf",
                            array: "{lang}.options.controlValues.lang",
                            value: "{lang}.model.lang"
                        }
                    },
                    tooltipContentMap: {
                        "prev": "navButtonTooltip",
                        "next": "navButtonTooltip",
                        "langLabel": {
                            tooltip: "{lang}.options.stringArrayIndex.tooltip",
                            tooltipAtSelect: "{lang}.options.stringArrayIndex.tooltipAtSelect"
                        },
                        "langInput": {
                            tooltip: "{lang}.options.stringArrayIndex.tooltip",
                            tooltipAtSelect: "{lang}.options.stringArrayIndex.tooltipAtSelect"
                        }
                    },
                    listeners: {
                        "{lang}.events.afterRender": {
                            funcName: "{that}.tooltip.updateIdToContent"
                        }
                    }
                }
            }
        },
        model: {
            firstLangSelected: false,
            lastLangSelected: false
        },
        modelRelay: [{
            target: "langIndex",
            singleTransform: {
                type: "fluid.transforms.indexOf",
                array: "{that}.options.controlValues.lang",
                value: "{that}.model.lang",
                offset: 1
            }
        }, {
            target: "firstLangSelected",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.langIndex",
                operator: "===",
                right: 1
            }
        }, {
            target: "lastLangSelected",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.langIndex",
                operator: "===",
                right: "{that}.options.controlValues.lang.length"
            }
        }],
        numOfLangPerPage: 3,
        selectors: {
            instructions: ".gpiic-fd-lang-instructions",
            langRow: ".gpiic-fd-lang-row",
            langLabel: ".gpiic-fd-lang-label",
            langInput: ".gpiic-fd-lang-input",
            controlsDiv: ".gpiic-fd-lang-controls",
            prev: ".gpiic-fd-lang-prev",
            next: ".gpiic-fd-lang-next"
        },
        selectorsToIgnore: ["controlsDiv", "prev", "next"],
        repeatingSelectors: ["langRow"],
        protoTree: {
            instructions: {markup: {messagekey: "langInstructions"}},
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "langRow",
                labelID: "langLabel",
                inputID: "langInput",
                selectID: "lang-radio",
                tree: {
                    optionnames: "${{that}.msgLookup.lang}",
                    optionlist: "${{that}.options.controlValues.lang}",
                    selection: "${lang}"
                }
            }
        },
        invokers: {
            bindPrev: {
                funcName: "gpii.firstDiscovery.panel.lang.moveLangFocus",
                args: ["{that}", -1]
            },
            bindNext: {
                funcName: "gpii.firstDiscovery.panel.lang.moveLangFocus",
                args: ["{that}", 1]
            }
        },
        events: {
            onButtonTopsReady: null
        },
        listeners: {
            "afterRender.bindPrev": {
                "this": "{that}.dom.prev",
                method: "click",
                args: ["{that}.bindPrev"]
            },
            "afterRender.bindNext": {
                "this": "{that}.dom.next",
                method: "click",
                args: ["{that}.bindNext"]
            },
            "afterRender.setPrevButtonStatus": {
                "this": "{that}.dom.prev",
                method: "prop",
                args: ["disabled", "{that}.model.firstLangSelected"]
            },
            "afterRender.setNextButtonStatus": {
                "this": "{that}.dom.next",
                method: "prop",
                args: ["disabled", "{that}.model.lastLangSelected"]
            },
            "afterRender.getButtonTops": {
                funcName: "gpii.firstDiscovery.panel.lang.getButtonTops",
                args: ["{that}"]
            },
            // To override the default scrolling behavior from buttons' parent overflow div to make sure when using keyboard to focus
            // on the button, the overflow div scrolls to the calculated position.
            "afterRender.overrideDefaultScroll": {
                funcName: "gpii.firstDiscovery.panel.lang.overrideDefaultScroll",
                args: ["{that}"]
            },
            "afterRender.scrollLangIntoView": {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangIntoView",
                args: ["{that}"]
            },
            "onButtonTopsReady.scrollLangIntoView": {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangIntoView",
                args: ["{that}"]
            },
            "afterRender.preventWrapWithArrowKeys": {
                funcName: "gpii.firstDiscovery.panel.lang.preventWrapWithArrowKeys",
                args: ["{that}"]
            },
            "afterRender.setLangOnHtml": {
                funcName: "gpii.firstDiscovery.panel.lang.setLangOnHtml",
                args: ["{that}.model.lang"]
            }
        }
    });

    gpii.firstDiscovery.panel.lang.moveLangFocus = function (that, adjustBy) {
        var langArray = that.options.controlValues.lang,
            guardNext = fluid.model.transform({}, {
                nextIndex: {
                    transform: {
                        type: "fluid.transforms.limitRange",
                        value: langArray.indexOf(that.model.lang) + adjustBy,
                        min: 0,
                        max: langArray.length
                    }
                }
            }),
            nextIndex = guardNext.nextIndex;

        that.applier.change("lang", langArray[nextIndex]);
    };

    // find the number in the "numbers" array that's closest to the given "currentNumber"
    gpii.firstDiscovery.panel.lang.findClosestNumber = function (currentNumber, numbers) {
        var distance = Infinity,
            idx = -1;

        for (var c = 0; c <= numbers.length - 1; c++) {
            var cdistance = Math.abs(numbers[c] - currentNumber);
            if (cdistance < distance) {
                idx = c;
                distance = cdistance;
            }
        }
        return numbers[idx];
    };

    // When arrow keys are used to navigate thru language buttons, this function scrolls the select button
    // to the appropriate position to ensure,
    // 1. the selected button is in the view;
    // 2. the top and bottom buttons are not partially shown.
    // To achieve this, when the page is rendered, this function saves the initial positions of in-view buttons,
    // and scroll the selected language button to the closest position. When arrow keys are used
    // to move an out-of-view language button into the view, also finds the closest saved position to
    // move the button to.
    gpii.firstDiscovery.panel.lang.scrollLangIntoView = function (that) {
        if (!that.buttonTops) {
            return;
        }

        // TODO: Replace this private variable to some measurement from the DOM (http://issues.fluidproject.org/browse/FLOE-305)
        that.lastMovedHeight = that.lastMovedHeight || 0;

        var buttons = that.locate("langRow"),
            currentLang = that.model.lang,
            currentLangIndex = that.options.controlValues.lang.indexOf(currentLang),
            currentButton = $(buttons[currentLangIndex]),
            controlsDiv = $(that.options.selectors.controlsDiv),
            controlsDivScrollTop = controlsDiv[0].scrollTop,
            // The line below to add the scrolled distance of the parent container, which is "controlsDivScrollTop",
            // rather than using button.offset().top only, is to fix an issue in Chrome and Safari that button.offset().top
            // returns inconsistent value. The returned value sometimes has "controlsDivScrollTop" added, sometimes not.
            // This line ensures consistent top values for the calculation to base upon.
            currentButtonTop = currentButton.offset().top + controlsDivScrollTop,
            closestPosition = gpii.firstDiscovery.panel.lang.findClosestNumber(currentButtonTop - that.lastMovedHeight, that.buttonTops),
            heightToMove = currentButtonTop - closestPosition;

        $(that.options.selectors.controlsDiv).animate({scrollTop: heightToMove + "px"}, 0);

        that.lastMovedHeight = heightToMove;
    };

    gpii.firstDiscovery.panel.lang.getButtonTops = function (that) {
        // setTimeout() is to work around the issue that position() in synchronous calls receives 0 for initial button positions
        // when the panel is in the middle of rendering.
        setTimeout(function () {
            var buttons = that.locate("langRow"),
                numOfLangPerPage = that.options.numOfLangPerPage;

            // Keep track of the original positions of buttons on display
            if (!that.buttonTops) {
                that.buttonTops = [];
                for (var i = 0; i < numOfLangPerPage; i++) {
                    if (buttons[i]) {
                        that.buttonTops[i] = $(buttons[i]).position().top;
                    }
                }
                that.events.onButtonTopsReady.fire();
            }
        });
    };

    gpii.firstDiscovery.panel.lang.resetButtonTops = function (that, shownPanelId) {
        var langPanelId = that.container.attr("id");
        if (langPanelId === shownPanelId) {
            that.buttonTops = undefined;
            that.refreshView();
        }
    };

    gpii.firstDiscovery.panel.lang.overrideDefaultScroll = function (that) {
        that.locate("controlsDiv").scroll(function () {
            gpii.firstDiscovery.panel.lang.scrollLangIntoView(that);
        });
    };

    gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons = function (button, keyCodes) {
        $(button).keydown(function (e) {
            if (keyCodes.indexOf(e.which) !== -1) {
                e.preventDefault();
                return false;
            }
        });
    };

    // When the focus is on the first language button, prevent the press of up or left arrow keys moving to the last language button;
    // when the focus is on the last language button, prevent the press of down or right arrow keys moving to the first language button.
    // TODO: Replace this funciton with fluid.selectable() plugin with noWrap: true when FLUID-5642 (http://issues.fluidproject.org/browse/FLUID-5642)
    // is fixed.
    gpii.firstDiscovery.panel.lang.preventWrapWithArrowKeys = function (that) {
        var langButtons = that.locate("langInput"),
            firstLangButton = langButtons[0],
            lastLangButton = langButtons[langButtons.length];

        gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons(firstLangButton, [$.ui.keyCode.UP, $.ui.keyCode.LEFT]);
        gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons(lastLangButton, [$.ui.keyCode.DOWN, $.ui.keyCode.RIGHT]);
    };

    gpii.firstDiscovery.panel.lang.setLangOnHtml = function (currentLang) {
        $("html").attr("lang", currentLang);
    };

    // This component is needed for the following demands block to be only applied to the language panel "gpii.firstDiscovery.panel.lang".
    // Without this component being the sub-component of the language panel, according to http://wiki.fluidproject.org/display/docs/Contexts,
    // when the context component of the demands block was the language panel itself, the demands block would also be applied to siblings of
    // the language panel. To work around this issue, another layer of containment needs to be added.
    // This component and the demands block should be removed when the new framework (http://issues.fluidproject.org/browse/FLUID-5249)
    // is in use.
    fluid.defaults("gpii.firstDiscovery.panel.lang.attachTooltipOnLang", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "autoInit"]
    });

    fluid.demands("fluid.tooltip", ["gpii.firstDiscovery.panel.lang.attachTooltipOnLang"], {
        options: {
            styles: {
                tooltip: "gpii-fd-tooltip-lang"
            },
            listeners: {
                "afterOpen.setLangAttr": {
                    priority: -2,
                    listener: "gpii.firstDiscovery.panel.lang.attachTooltipOnLang.setLangAttr"
                }
            }
        }
    });

    gpii.firstDiscovery.panel.lang.attachTooltipOnLang.getLangForElm = {
        "LABEL": function (target) {
            return fluid.jById(target.attr("for")).val();
        },
        "INPUT": function (target) {
            return target.val();
        }
    };

    gpii.firstDiscovery.panel.lang.attachTooltipOnLang.setLangAttr = function (that, originalTarget, tooltip) {
        originalTarget = $(originalTarget);
        var tagName = originalTarget.prop("tagName");
        var getLangFn = gpii.firstDiscovery.panel.lang.attachTooltipOnLang.getLangForElm[tagName];

        if (getLangFn) {
            tooltip.attr("lang", getLangFn(originalTarget));
        }
    };

    // To accommodate the possiblity of text/control size change that causes the shift of button positions,
    // re-collect button tops every time when users come back to the language panel. The button positions
    // are only accurate when they are not hidden.
    fluid.defaults("gpii.firstDiscovery.panel.lang.prefEditorConnection", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        listeners: {
            "{prefsEditor}.events.onPanelShown": {
                funcName: "gpii.firstDiscovery.panel.lang.resetButtonTops",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    /*
     * Contrast panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.contrast", {
        gradeNames: ["fluid.prefs.panel", "gpii.firstDiscovery.attachTooltip.renderer", "autoInit"],
        preferenceMap: {
            "fluid.prefs.contrast": {
                "model.value": "default"
            }
        },
        modelRelay: {
            source: "{that}.model.value",
            target: "currentSelectedIndex",
            singleTransform: {
                type: "fluid.transforms.indexOf",
                array: "{that}.options.controlValues.theme",
                value: "{that}.model.value"
            }
        },
        tooltipContentMap: {
            themeLabel: {
                tooltip: "{that}.options.stringArrayIndex.tooltip",
                tooltipAtSelect: "{that}.options.stringArrayIndex.tooltipAtSelect"
            },
            themeInput: {
                tooltip: "{that}.options.stringArrayIndex.tooltip",
                tooltipAtSelect: "{that}.options.stringArrayIndex.tooltipAtSelect"
            }
        },
        selectors: {
            instructions: ".gpiic-fd-instructions",
            themeRow: ".flc-prefsEditor-themeRow",
            themeLabel: ".flc-prefsEditor-theme-label",
            themeInput: ".flc-prefsEditor-themeInput"
        },
        repeatingSelectors: ["themeRow"],
        listeners: {
            "afterRender.style": "{that}.style"
        },
        stringArrayIndex: {
            theme: ["contrast-default", "contrast-bw", "contrast-wb"],
            tooltip: ["contrast-default-tooltip", "contrast-bw-tooltip", "contrast-wb-tooltip"],
            tooltipAtSelect: ["contrast-default-tooltipAtSelect", "contrast-bw-tooltipAtSelect", "contrast-wb-tooltipAtSelect"]
        },
        controlValues: {
            theme: ["default", "bw", "wb"]
        },
        protoTree: {
            instructions: {messagekey: "instructions"},
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "themeRow",
                labelID: "themeLabel",
                inputID: "themeInput",
                selectID: "theme-radio",
                tree: {
                    optionnames: "${{that}.msgLookup.theme}",
                    optionlist: "${{that}.options.controlValues.theme}",
                    selection: "${value}"
                }
            }
        },
        invokers: {
            style: {
                funcName: "gpii.firstDiscovery.panel.contrast.style",
                args: [
                    "{that}.dom.themeLabel",
                    "{that}.options.controlValues.theme",
                    "{that}.options.controlValues.theme.0",
                    "{that}.options.classnameMap.theme"
                ],
                dynamic: true
            }
        }
    });

    gpii.firstDiscovery.panel.contrast.style = function (labels, theme, defaultThemeName, style) {
        // TODO: A potential further improvement would be to use a utility such as the one in the video player to
        // make this automatically model bound.
        // see: https://github.com/fluid-project/videoPlayer/blob/master/js/VideoPlayer_showHide.js
        fluid.each(labels, function (label, index) {
            label = $(label);

            var labelTheme = theme[index];
            label.addClass(style[labelTheme]);
        });
    };

    /*
     * Welcome panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.welcome", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.welcome": {}
        },
        selectors: {
            message: ".gpiic-fd-welcome-instructions"
        },
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            }
        }
    });

    /*
     * Congratulations panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.congratulations", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.congratulations": {}
        },
        selectors: {
            message: ".gpiic-fd-congratulations-message"
        },
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            }
        }
    });

})(jQuery, fluid);
