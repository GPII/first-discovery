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
        modelRelay: [{
            target: "value",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.value",
                min: "{that}.options.range.min",
                max: "{that}.options.range.max"
            }
        // TODO: Due to FLUID-5669 the isMax and isMin
        // transformations are performed using the fluid.transforms.free
        // transformation. Once FLUID-5669 has been addressed, it should be
        // possible to simply make use of fluid.transforms.binaryOp.
        }, {
            target: "isMax",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    "value": "{that}.model.value",
                    "limit": "{that}.options.range.max"
                },
                func: "gpii.firstDiscovery.panel.ranged.isAtLimit"
            }
        }, {
            target: "isMin",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    "value": "{that}.model.value",
                    "limit": "{that}.options.range.min"
                },
                func: "gpii.firstDiscovery.panel.ranged.isAtLimit"
            }
        }],
        selectors: {
            rangeInstructions: ".gpiic-fd-range-instructions",
            controls: ".gpiic-fd-range-controls",
            meter: ".gpiic-fd-range-indicator",
            max: ".gpiic-fd-range-max",
            min: ".gpiic-fd-range-min",
            increase: ".gpiic-fd-range-increase",
            decrease: ".gpiic-fd-range-decrease"
        },
        selectorsToIgnore: ["controls", "meter", "increase", "decrease"],
        tooltipContentMap: {
            "increase": "increaseLabel",
            "decrease": "decreaseLabel"
        },
        protoTree: {
            rangeInstructions: {messagekey: "rangeInstructions"},
            max: {messagekey: "maxLabel"},
            min: {messagekey: "minLabel"}
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
            value: {
                listener: "{that}.updateMeter",
                excludeSource: "init"
            }
        }
    });

    gpii.firstDiscovery.panel.ranged.isAtLimit = function (model) {
        return fluid.model.isSameValue(model.limit, model.value);
    };

    gpii.firstDiscovery.panel.ranged.step = function (that, reverse) {
        that.tooltip.close();   // close the existing tooltip before the panel is re-rendered

        var step = reverse ? (that.options.step * -1) : that.options.step;
        var newValue = that.model.value + step;
        that.applier.change("value", newValue);
    };

    gpii.firstDiscovery.panel.ranged.updateButtonState = function (that) {
        that.locate("increase").prop("disabled", that.model.isMax);
        that.locate("decrease").prop("disabled", that.model.isMin);
    };

    gpii.firstDiscovery.panel.ranged.updateMeter = function (that, value) {
        var range = that.options.range;
        var percentage = ((value - range.min) / (range.max - range.min)) * 100;
        that.locate("meter").css("height", percentage + "%");
    };

    fluid.defaults("gpii.firstDiscovery.panel.rangedWithDisabledMsg", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged", "autoInit"],
        selectors: {
            disabledMsg: ".gpiic-fd-range-disabledMsg"
        },
        protoTree: {
            rangeInstructions: {messagekey: "rangeInstructions"},
            max: {messagekey: "maxLabel"},
            min: {messagekey: "minLabel"},
            disabledMsg: {messagekey: "disabledMsg"}
        },
        listeners: {
            "afterRender.toggleDisplay": {
                listener: "{that}.toggleDisplay",
                priority: "first",
                args: ["{that}.model.enabled"]
            }
        },
        invokers: {
            toggleDisplay: {
                funcName: "gpii.firstDiscovery.panel.rangedWithDisabledMsg.toggleDisplay",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    gpii.firstDiscovery.panel.rangedWithDisabledMsg.toggleDisplay = function (that, isEnabled) {
        that.locate("controls").toggle(isEnabled);
        that.locate("disabledMsg").toggle(!isEnabled);
    };

    /*
     * Keyboard Panel
     */

    fluid.defaults("gpii.firstDiscovery.panel.keyboard", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.stickyKeys": {
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
            tryAccommodation: false,
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
                    },
                    // Need to close the tooltip before the DOM elements are removed
                    listeners: {
                        "{keyboard}.events.onRenderTree": "{that}.tooltip.close"
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

    // TODO: Need to add an integration test keyboardTts
    // Will need to construct a mock TTS which will allow for the
    // verification of queued speech.
    // see: https://issues.fluidproject.org/browse/FLOE-370

    fluid.registerNamespace("gpii.firstDiscovery.panel.keyboardTts");

    // Reads the instructions at the various stages of the panels workflow
    fluid.defaults("gpii.firstDiscovery.panel.keyboardTts", {
        invokers: {
            speakStickyKeysState: {
                funcName: "gpii.firstDiscovery.panel.keyboardTts.speakStickyKeysState",
                args: ["{arguments}.0", "{fluid.textToSpeech}.queueSpeech", "{arguments}.1"]
            },
            speakPanelInstructions: "{fluid.textToSpeech}.speakPanelInstructions"
        },
        modelListeners: {
            offerAssistance: {
                func: "{that}.speakPanelInstructions",
                args: [{queue: true}]
            },
            tryAccommodation: {
                listener: "{that}.speakPanelInstructions",
                excludeSource: "init"
            }
        },
        distributeOptions: [{
            target: "{that assistance}.options.modelListeners",
            record: {
                stickyKeysEnabled: {
                    listener: "{keyboardTts}.speakStickyKeysState",
                    namespace: "speakStickyKeysState",
                    args: ["{that}", "{change}.value"]
                }
            }
        }]
    });

    gpii.firstDiscovery.panel.keyboardTts.speakStickyKeysState = function (that, speakFn, state) {
        if (that.model.tryAccommodation) {
            speakFn(state ? that.msgResolver.resolve("enabledMsg") : that.msgResolver.resolve("disabledMsg"));
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
     * Speech rate panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.speechRate", {
        gradeNames: ["gpii.firstDiscovery.panel.rangedWithDisabledMsg", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.speechRate": {
                "model.value": "default",
                "range.min": "minimum",
                "range.max": "maximum",
                "step": "divisibleBy"
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.panel.speechRate.prefsEditorConnection", {
        model: {
            enabled: "{prefsEditor}.model.gpii_firstDiscovery_speak"
        }
    });

    /*
     * The base component for all yes-no-selection panels
     */
    fluid.defaults("gpii.firstDiscovery.panel.yesNo", {
        gradeNames: ["fluid.prefs.panel", "gpii.firstDiscovery.attachTooltip.renderer", "autoInit"],
        modelRelay: [{
            source: "{that}.model.choice",
            target: "{that}.model.value",
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
            source: "{that}.model.choice",
            target: "currentSelectedIndex",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.indexOf",
                array: "{that}.options.controlValues.choice",
                value: "{that}.model.choice"
            }
        }],
        tooltipContentMap: {
            choiceLabel: {
                tooltip: ["yes-tooltip", "no-tooltip"],
                tooltipAtSelect: ["yes-tooltipAtSelect", "no-tooltipAtSelect"]
            },
            choiceInput: {
                tooltip: ["yes-tooltip", "no-tooltip"],
                tooltipAtSelect: ["yes-tooltipAtSelect", "no-tooltipAtSelect"]
            }
        },
        stringArrayIndex: {
            choice: ["yes", "no"]
        },
        selectors: {
            choiceRow: ".gpiic-fd-yesNo-choiceRow",
            choiceLabel: ".gpiic-fd-yesNo-choiceLabel",
            choiceInput: ".gpiic-fd-yesNo-choiceInput",
            instructions: ".gpiic-fd-yesNo-instructions"
        },
        controlValues: {
            choice: ["yes", "no"]
        },
        repeatingSelectors: ["choiceRow"],
        invokers: {
            produceTree: {
                funcName: "gpii.firstDiscovery.panel.yesNo.produceTree",
                args: "{that}"
            }
        }
    });

    gpii.firstDiscovery.panel.yesNo.produceTree = function () {
        // Make sure each derived panel using yesNo grade has a unique
        // selectID, the name used for inputs.
        var selectID = fluid.allocateGuid();
        var protoTree = {
            instructions: {messagekey: "instructions"},
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "choiceRow",
                labelID: "choiceLabel",
                inputID: "choiceInput",
                selectID: selectID,
                tree: {
                    optionnames: "${{that}.msgLookup.choice}",
                    optionlist: "${{that}.options.controlValues.choice}",
                    selection: "${choice}"
                }
            }
        };
        return protoTree;
    };

    /*
     * Text to speech panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.speakText", {
        gradeNames: ["gpii.firstDiscovery.panel.yesNo", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.speak": {
                "model.value": "default"
            }
        }
    });

    /*
     * On screen keyboard panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.onScreenKeyboard", {
        gradeNames: ["gpii.firstDiscovery.panel.yesNo", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.onScreenKeyboard": {
                "model.value": "default"
            }
        }
    });

    /*
     * Captions panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.captions", {
        gradeNames: ["gpii.firstDiscovery.panel.yesNo", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.captions": {
                "model.value": "default"
            }
        }
    });

    /*
     * Show sounds panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.showSounds", {
        gradeNames: ["gpii.firstDiscovery.panel.yesNo", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.showSounds": {
                "model.value": "default"
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
                "controlValues.lang": "enum"
            }
        },
        members: {
            maxDisplayLangIndex: {
                expander: {
                    funcName: "gpii.firstDiscovery.panel.lang.calculateMaxDisplayLangIndex",
                    args: [ "{that}.options.controlValues.lang.length",
                            "{that}.options.numOfLangPerPage" ]
                }
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
                        "langRow": {
                            tooltip: "{lang}.options.stringArrayIndex.tooltip",
                            tooltipAtSelect: "{lang}.options.stringArrayIndex.tooltipAtSelect"
                        }
                    },
                    listeners: {
                        "{lang}.events.afterRender": {
                            funcName: "{that}.tooltip.updateIdToContent"
                        },
                        // Need to close the tooltip before the DOM elements are removed
                        "{lang}.events.onRenderTree": "{that}.tooltip.close"
                    }
                }
            }
        },
        model: {
            selectedLang: undefined,
            // TODO the displayLangIndex model property contains the index
            //      of the top language to display on the panel -- choose
            //      a better name
            displayLangIndex: 0,
            atStartOfLangs: false,
            atEndOfLangs: false
        },
        modelRelay: [{
            target: "displayLangIndex",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.displayLangIndex",
                min: 0,
                max: "{that}.maxDisplayLangIndex"
            }
        }, {
            target: "atStartOfLangs",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.displayLangIndex",
                operator: "===",
                right: 0
            }
        }, {
            target: "atEndOfLangs",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.displayLangIndex",
                operator: "===",
                right: "{that}.maxDisplayLangIndex"
            }
        }],
        modelListeners: {
            selectedLang: {
                listener: "{that}.scrollToSelectedLang"
            },
            displayLangIndex: {
                listener: "{that}.updateDisplayedLangs"
            },
            atStartOfLangs: {
                "this": "{that}.dom.prev",
                method: "prop",
                args: ["disabled", "{that}.model.atStartOfLangs"]
            },
            atEndOfLangs: {
                "this": "{that}.dom.next",
                method: "prop",
                args: ["disabled", "{that}.model.atEndOfLangs"]
            }
        },
        numOfLangPerPage: 3,
        selectors: {
            instructions: ".gpiic-fd-lang-instructions",
            langRow: ".gpiic-fd-lang-row",
            langLabel: ".gpiic-fd-lang-label",
            controlsDiv: ".gpiic-fd-lang-controls",
            prev: ".gpiic-fd-lang-prev",
            next: ".gpiic-fd-lang-next"
        },
        selectorsToIgnore: ["controlsDiv", "prev", "next"],
        repeatingSelectors: ["langRow"],
        protoTree: {
            instructions: {markup: {messagekey: "langInstructions"}}
        },
        markup: {
            langOptions: {
                expander: {
                    func: "gpii.firstDiscovery.panel.lang.buildLangOptionsMarkup",
                    args: [ "{that}.msgLookup.lang",
                            "{that}.options.controlValues.lang",
                            "{that}.options.markup.langOptionTemplate" ]
                }
            },
            langOptionTemplate: "<div class=\"gpiic-fd-lang-row gpiic-fd-tooltip selectable gpii-fd-choice\" role=\"option\" aria-selected=\"false\" lang=\"%langCode\"><span class=\"gpii-fd-indicator gpii-fd-icon\"></span> <span class=\"gpiic-fd-lang-label gpii-fd-lang-label gpii-fd-choice-label\" lang=\"%langCode\">%langName</span></div>"
        },
        invokers: {
            scrollLangsPrev: {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangs",
                args: ["{that}", -1]
            },
            scrollLangsNext: {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangs",
                args: ["{that}", 1]
            },
            scrollToSelectedLang: {
                funcName: "gpii.firstDiscovery.panel.lang.scrollLangIntoView",
                args: ["{that}", "{that}.model.selectedLang"]
            },
            updateDisplayedLangs: {
                funcName: "gpii.firstDiscovery.panel.lang.updateDisplayedLangs",
                args: ["{that}", "{that}.model.displayLangIndex"]
            },
            onActivateLanguage: {
                funcName: "gpii.firstDiscovery.panel.lang.onActivateLanguage",
                args: ["{that}", "{arguments}.0"]
            }
        },
        events: {
            langButtonsReady: null
        },
        listeners: {
            "afterRender.bindPrev": {
                "this": "{that}.dom.prev",
                method: "click",
                args: ["{that}.scrollLangsPrev"]
            },
            "afterRender.bindNext": {
                "this": "{that}.dom.next",
                method: "click",
                args: ["{that}.scrollLangsNext"]
            },
            "afterRender.setPrevButtonStatus": {
                "this": "{that}.dom.prev",
                method: "prop",
                args: ["disabled", "{that}.model.atStartOfLangs"]
            },
            "afterRender.setNextButtonStatus": {
                "this": "{that}.dom.next",
                method: "prop",
                args: ["disabled", "{that}.model.atEndOfLangs"]
            },
            "afterRender.setLangOnHtml": {
                funcName: "gpii.firstDiscovery.panel.lang.setLangOnHtml",
                args: ["{that}.model.lang"]
            },
            "afterRender.setLangOptionsMarkup": {
                "this": "{that}.dom.controlsDiv",
                method: "append",
                args: ["{that}.options.markup.langOptions"],
                priority: 20
            },
            "afterRender.makeLangsSelectable": {
                funcName: "gpii.firstDiscovery.panel.lang.makeLangsSelectable",
                args: ["{that}", "{that}.dom.controlsDiv"],
                priority: 10
            },
            "afterRender.makeLangsActivatable": {
                funcName: "gpii.firstDiscovery.panel.lang.makeLangsActivatable",
                args: ["{that}.dom.langRow", "{that}.onActivateLanguage"],
                priority: 10
            },
            "afterRender.setAriaSelected": {
                funcName: "gpii.firstDiscovery.panel.lang.setAriaSelected",
                args: ["{that}.model.lang", "{that}.dom.langRow"],
                priority: 10
            },
            "afterRender.fireLangButtonsReady": {
                funcName: "gpii.firstDiscovery.panel.lang.fireLangButtonsReady",
                args: ["{that}"],
                priority: 10
            },
            "langButtonsReady.displayActiveLang": {
                funcName: "gpii.firstDiscovery.panel.lang.displayActiveLang",
                args: ["{that}", "{that}.model.lang"]
            }
        }
    });

    gpii.firstDiscovery.panel.lang.calculateMaxDisplayLangIndex = function (numLangs, numLangsPerPage) {
        return Math.max(numLangs - numLangsPerPage, 0);
    };

    gpii.firstDiscovery.panel.lang.buildLangOptionsMarkup = function (langNames, langCodes, langOptionTemplate) {
        var markup = "";
        for (var i=0; i < langNames.length; i++) {
            var langName = langNames[i];
            var langCode = langCodes[i];
            var langOption = fluid.stringTemplate(langOptionTemplate, {
                langName: langName,
                langCode: langCode
            });
            markup += langOption;
        }
        return markup;
    };

    gpii.firstDiscovery.panel.lang.makeLangsSelectable = function (that, controlsDiv) {
        controlsDiv.fluid("tabbable");
        controlsDiv.fluid("selectable", {
            noWrap: true,
            onSelect: function (elem) {
                var selectedLang = $(elem).attr("lang");
                that.applier.change("selectedLang", selectedLang);
            },
            onUnselect: function () {
                that.applier.change("selectedLang", undefined);
            },
            rememberSelectionState: false
        });
    };

    gpii.firstDiscovery.panel.lang.makeLangsActivatable = function (langRows, handler) {
        langRows.fluid("activatable", handler);
        langRows.click(handler);
    };

    gpii.firstDiscovery.panel.lang.onActivateLanguage = function (that, evt) {
        var lang = $(evt.delegateTarget).attr("lang");
        that.applier.change("lang", lang);
    };

    gpii.firstDiscovery.panel.lang.setAriaSelected = function (langCode, langOptions) {
        fluid.each(langOptions, function (langOption) {
            var optionLangCode = $(langOption).attr("lang");
            var ariaSelected = (optionLangCode === langCode ? true : false);
            $(langOption).attr("aria-selected", ariaSelected);
        });
    };

    gpii.firstDiscovery.panel.lang.fireLangButtonsReady = function (that) {
        // TODO: We should investigate the use of setTimeout() here
        //
        // The positions of the language buttons are not ready at
        // afterRender but appear to be ready after a setTimeout()
        // called from afterRender. This was the practice used in the
        // radio buttons version of the language panel and has been
        // continued in the FLOE-333 reworking.
        setTimeout(function () {
            that.events.langButtonsReady.fire();
        });
    };

    gpii.firstDiscovery.panel.lang.scrollLangs = function (that, adjustBy) {
        var newIndex = that.model.displayLangIndex + adjustBy;
        that.applier.change("displayLangIndex", newIndex);
    };

    gpii.firstDiscovery.panel.lang.scrollLangIntoView = function (that, lang) {
        var langIndex = that.options.controlValues.lang.indexOf(lang);
        if (langIndex !== -1) {
            // Test if the language that we want to scroll to is above
            // or below the currently displayed languages. If it is
            // neither, we don't need to scroll.
            var startOfNextPage = that.model.displayLangIndex + that.options.numOfLangPerPage;
            if (langIndex < that.model.displayLangIndex) {
                // the language that we want to scroll to is above
                that.applier.change("displayLangIndex", langIndex);
            } else if (langIndex >= startOfNextPage) {
                // the language that we want to scroll to is below
                var newIndex = langIndex - that.options.numOfLangPerPage + 1;
                that.applier.change("displayLangIndex", newIndex);
            }
        }
    };

    gpii.firstDiscovery.panel.lang.displayActiveLang = function (that, lang) {
        var langIndex = that.options.controlValues.lang.indexOf(lang);
        if (langIndex < that.options.numOfLangPerPage) {
            // if our active language is on the first page, display
            // from the start of the list
            langIndex = 0;
        }
        that.applier.change("displayLangIndex", langIndex);
    };

    gpii.firstDiscovery.panel.lang.updateDisplayedLangs = function (that, langIndex) {
        var buttons = that.locate("langRow");
        if (buttons.length > 0) {
            var firstButtonTop = buttons.offset().top;
            var displayFromButton = $(buttons[langIndex]);
            var scrollTo = displayFromButton.offset().top - firstButtonTop;
            $(that.options.selectors.controlsDiv).scrollTop(scrollTo);
        }
    };

    gpii.firstDiscovery.panel.lang.refreshDisplayedLangsOnShowPanel = function (that, shownPanelId) {
        var langPanelId = that.container.attr("id");
        if (langPanelId === shownPanelId) {
            // reset back to the top of the list and refresh
            that.applier.change("displayLangIndex", 0);
            that.refreshView();
        }
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

    gpii.firstDiscovery.panel.lang.attachTooltipOnLang.setLangAttr = function (that, originalTarget, tooltip) {
        tooltip.attr("lang", $(originalTarget).attr("lang"));
    };

    // Any change to the model causes all panels to be rerendered. If
    // the language panel is rerendered while off-screen, we cannot
    // scroll to the correct position as position information is not
    // available while hidden. Instead, we need to rerender again when
    // the user naviagates back to the language panel.
    fluid.defaults("gpii.firstDiscovery.panel.lang.prefEditorConnection", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        listeners: {
            "{prefsEditor}.events.onPanelShown": {
                funcName: "gpii.firstDiscovery.panel.lang.refreshDisplayedLangsOnShowPanel",
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
