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
            rangeInstructions: ".gpiic-fd-instructions",
            meter: ".gpiic-fd-range-indicator",
            increase: ".gpiic-fd-range-increase",
            increaseLabel: ".gpiic-fd-range-increaseLabel",
            decrease: ".gpiic-fd-range-decrease",
            decreaseLabel: ".gpiic-fd-range-decreaseLabel"
        },
        selectorsToIgnore: ["meter", "increase", "decrease"],
        tooltipContentMap: {
            "increase": "increaseLabel",
            "decrease": "decreaseLabel"
        },
        protoTree: {
            rangeInstructions: {messagekey: "rangeInstructions"},
            increaseLabel: {messagekey: "increaseLabel"},
            decreaseLabel: {messagekey: "decreaseLabel"}
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
        },
        events: {
            onControlsResized: null
        },
        listeners: {
            onControlsResized: "{prefsEditor}.events.onControlsResized"
        },
        modelListeners: {
            "value": "{that}.events.onControlsResized.fire"
        }
    });

    /*
     * Text to speech panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.speakText", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.speak": {
                "model.speak": "default"
            }
        },
        modelRelay: {
            source: "{that}.model",
            target: "{that}.model.speak",
            singleTransform: {
                type: "fluid.transforms.valueMapper",
                inputPath: "speakChoice",
                options: {
                    "yes": true,
                    "no": {
                        outputValue: false
                    }
                }
            }
        },
        stringArrayIndex: {
            choice: ["speakText-yes", "speakText-no"]
        },
        selectors: {
            choiceRow: ".gpiic-fd-speakText-choiceRow",
            choiceLabel: ".gpiic-fd-speakText-choice-label",
            choiceInput: ".gpiic-fd-speakText-choiceInput",
            instructions: ".gpiic-fd-instructions"
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
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.language": {
                "model.lang": "default",
                "controlValues.lang": "enum"
            }
        },
        components: {
            attachTooltipOnLang: {
                type: "gpii.firstDiscovery.panel.lang.attachTooltipOnLang",
                container: "{lang}.container",
                options: {
                    selectors: "{lang}.options.selectors",
                    listeners: {
                        "{lang}.events.afterRender": {
                            funcName: "gpii.firstDiscovery.panel.lang.populateTooltipContentMap",
                            args: ["{that}", "{lang}"]
                        }
                    }
                }
            }
        },
        controlValues: {
            lang: ["en", "fr", "es", "de", "ne", "sv"]
        },
        stringArrayIndex: {
            lang: ["lang-en", "lang-fr", "lang-es", "lang-de", "lang-ne", "lang-sv"]
        },
        numOfLangPerPage: 3,
        selectors: {
            instructions: ".gpiic-fd-instructions",
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
            "afterRender.setButtonStates": {
                funcName: "gpii.firstDiscovery.panel.lang.setNavKeyStatus",
                args: ["{that}"]
            },
            "afterRender.scrollLangIntoView": {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangIntoView",
                args: ["{that}"]
            },
            "afterRender.preventWrapWithArrowKeys": {
                funcName: "gpii.firstDiscovery.panel.lang.preventWrapWithArrowKeys",
                args: ["{that}"]
            },
            "{prefsEditor}.events.onControlsResized": {
                funcName: "fluid.set",
                args: ["{that}", "buttonTops", undefined]
            }
        }
    });

    // This component is needed for the demands block to be only applied to the language panel (gpii.firstDiscovery.panel.lang).
    // According to http://wiki.fluidproject.org/display/docs/Contexts, if the context component of the demands block was the
    // language panel itself, the demands block would be applied to siblings of the language panel as well. Needs to add another
    // layer of containment to work around this issue.
    // This component and the demands block should be removed when the new framework (http://issues.fluidproject.org/browse/FLUID-5249)
    // is in use.
    fluid.defaults("gpii.firstDiscovery.panel.lang.attachTooltipOnLang", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "autoInit"],
        tooltipContentMap: {
            "prev": "navButtonLabel",
            "next": "navButtonLabel"
        }
    });

    fluid.demands("fluid.tooltip", ["gpii.firstDiscovery.panel.lang.attachTooltipOnLang"], {
        options: {
            styles: {
                tooltip: "gpii-fd-tooltip-lang"
            }
        }
    });

    gpii.firstDiscovery.panel.lang.setNavKeyStatus = function (that) {
        var langArray = that.options.controlValues.lang,
            selectedLang = that.model.lang;

        that.locate("prev").prop("disabled", selectedLang === langArray[0]);
        that.locate("next").prop("disabled", selectedLang === langArray[langArray.length - 1]);
    };

    gpii.firstDiscovery.panel.lang.moveLangFocus = function (that, adjustBy) {
        var langArray = that.options.controlValues.lang,
            nextIndex = langArray.indexOf(that.model.lang) + adjustBy;

        if (nextIndex >= 0 && nextIndex <= langArray.length) {
            that.applier.change("lang", langArray[nextIndex]);
        }
    };

    // find the index of the number in the "numbers" array that's closest to the given "currentNumber"
    gpii.firstDiscovery.panel.lang.findClosestButtonTop = function (currentNumber, numbers) {
        var distance = Math.abs(numbers[0] - currentNumber),
            idx = 0;

        for (var c = 1; c < numbers.length; c++) {
            var cdistance = Math.abs(numbers[c] - currentNumber);
            if (cdistance < distance) {
                idx = c;
                distance = cdistance;
            }
        }
        return numbers[idx];
    };

    // When arrow keys are used to navigate thru language buttons, this function scrolls the select button
    // to the appropriate position to ensure, 1. the selected button is in the view; 2. the top and bottom
    // buttons are not partially shown. To do it, when the page is rendered, the function saves the initial
    // positions of displayed buttons. When another language button is selected, finds the closest saved
    // position for the selected button and moves it to that position.
    gpii.firstDiscovery.panel.lang.scrollLangIntoView = function (that) {
        that.lastMovedHeight = that.lastMovedHeight || 0;

        var buttons = that.locate("langRow"),
            currentLang = that.model.lang,
            currentLangIndex = that.options.controlValues.lang.indexOf(currentLang);

        // Stop proceeding if the model is not set properly. Or, the language panel hasn't been inserted into the actual markup
        // when the first afterRender event is fired. In the latter, the top position of the first button returns a negative value.
        if (!currentLang || !that.buttonTops && $(buttons[0]).position().top <= 0) {
            return;
        }

        var numOfLangPerPage = that.options.numOfLangPerPage;

        // Keep track of the original positions of buttons on display
        if (!that.buttonTops) {
            that.buttonTops = [];
            for (var i = 0; i < numOfLangPerPage; i++) {
                if (buttons[i]) {
                    that.buttonTops[i] = $(buttons[i]).position().top;
                }
            }
        }

        var currentButton = $(buttons[currentLangIndex]),
            controlsDiv = $(that.options.selectors.controlsDiv),
            controlsDivScrollTop = controlsDiv[0].scrollTop,
            // The line below to add "controlsDivScrollTop" rather than using button.offset().top directly is to fix an issue in
            // Chrome and Safari that button.offset().top returns inconsistent value. The returned value sometimes has
            // "controlsDivScrollTop" added, sometimes not. This line ensures consistent top values for the calculation to base upon.
            currentButtonTop = currentButton.offset().top + controlsDivScrollTop,
            closestPosition = gpii.firstDiscovery.panel.lang.findClosestButtonTop(currentButtonTop - that.lastMovedHeight, that.buttonTops),
            heightToMove = currentButtonTop - closestPosition;

        $(that.options.selectors.controlsDiv).animate({scrollTop: heightToMove + "px"}, 0);

        that.lastMovedHeight = heightToMove;
    };

    gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons = function (button, keyCodes) {
        $(button).keydown(function (e) {
            if (keyCodes.indexOf(e.which) !== -1) {
                e.preventDefault();
                return false;
            }
        });
    };

    // When the focus is on the first language button, prevent that the press of up or left arrow keys to move to the last language button;
    // when the focus is on the last language button, prevent that the press of down or right arrow keys to move to the first language button.
    gpii.firstDiscovery.panel.lang.preventWrapWithArrowKeys = function (that) {
        var langButtons = that.locate("langInput");

        gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons(langButtons[0], [$.ui.keyCode.UP, $.ui.keyCode.LEFT]);
        gpii.firstDiscovery.panel.lang.stopArrowBrowseOnEdgeButtons(langButtons[langButtons.length - 1], [$.ui.keyCode.DOWN, $.ui.keyCode.RIGHT]);
    };

    gpii.firstDiscovery.panel.lang.populateTooltipContentMap = function (that, langPanel) {
        var langButtons = that.locate("langRow"),
            langInputs = that.locate("langInput"),
            idToContent = that.tooltip.getTooltipModel();

        fluid.each(langPanel.options.stringArrayIndex.lang, function (msgKey, index) {
            var buttonId = fluid.allocateSimpleId(langButtons[index]),
                inputId = fluid.allocateSimpleId(langInputs[index]),
                msg = langPanel.msgLookup.lookup(msgKey + "-label");

            idToContent[buttonId] = msg;
            idToContent[inputId] = msg;
        });

        that.tooltip.applier.change("idToContent", idToContent);
    };

    /*
     * Contrast panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.contrast", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "fluid.prefs.contrast": {
                "model.value": "default",
                "controlValues.lang": "enum"
            }
        }
    });

    /*
     * Welcome panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.welcome", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.welcome": {}
        },
        selectors: {
            message: ".gpiic-fd-instructions"
        },
        protoTree: {
            message: {
                markup: {messagekey: "welcome"}
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
