/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.panel");

    /*
     * Ranged panel: used as a grade for text size panel and other panels to adjust their preferences in a range
     */
    fluid.defaults("gpii.firstDiscovery.panel.ranged", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip.renderer", "fluid.prefs.panel"],
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
        // see: https://issues.fluidproject.org/browse/FLUID-5669
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
        gradeNames: ["gpii.firstDiscovery.panel.ranged"],
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
        gradeNames: ["fluid.prefs.panel"],
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
            },
            destroyAssessor: {
                funcName: "gpii.firstDiscovery.panel.keyboard.destroy",
                args: ["{stickyKeysAssessor}"]
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
            },
            "afterRender.handleAssessor": {
                funcName: "gpii.firstDiscovery.panel.keyboard.handleAssessor",
                args: ["{that}.model.offerAssistance", "{that}.destroyAssessor"]
            }
        },
        modelListeners: {
            offerAssistance: [{
                listener: "{that}.refreshView",
                excludeSource: "init"
            }, {
                listener: "{that}.destroyAssessor"
            }]
        },
        distributeOptions: {
            source: "{that}.options.keyboardInputGradeNames",
            target: "{that > keyboardInput}.options.gradeNames"
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

    gpii.firstDiscovery.panel.keyboard.handleAssessor = function (offerAssistance, destroyAssessorFunc) {
        if (offerAssistance) {
            destroyAssessorFunc();
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
                args: ["{arguments}.0", "{gpii.firstDiscovery.selfVoicing}.queueSpeech", "{arguments}.1"]
            },
            speakPanelInstructions: "{prefsEditor}.speakPanelInstructions"
        },
        modelListeners: {
            offerAssistance: {
                func: "{that}.speakPanelInstructions",
                args: [{queue: true}],
                excludeSource: "init"
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
                    args: ["{that}", "{change}.value"],
                    excludeSource: "init"
                }
            }
        }]
    });

    gpii.firstDiscovery.panel.keyboardTts.speakStickyKeysState = function (that, speakFn, state) {
        if (that.model.tryAccommodation) {
            speakFn(state ? that.msgResolver.resolve("enabledMsg") : that.msgResolver.resolve("disabledMsg"));
        }
    };

    // Delete the model path "offerAssistance" at prefsEditor reset so the keyboard panel can be restored to its
    // initial state. The present of an "offerAssistance" model value triggers a non-start page to render:
    // 1. true value causes the "try it" button to show;
    // 2. false value causes "don't need assistance" page to show.
    fluid.defaults("gpii.firstDiscovery.panel.keyboard.prefEditorConnection", {
        gradeNames: ["fluid.component"],
        listeners: {
            "{prefsEditor}.events.beforeReset": {
                funcName: "gpii.firstDiscovery.panel.keyboard.prefEditorConnection.resetModel",
                args: ["{that}"]
            }
        }
    });

    gpii.firstDiscovery.panel.keyboard.prefEditorConnection.resetModel = function (that) {
        that.applier.fireChangeRequest({path: "offerAssistance", type: "DELETE"});
        that.applier.change("tryAccommodation", false);
    };

    /*
     * Text size panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged"],
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
     * Letter space panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.letterSpace", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged"],
        preferenceMap: {
            "gpii.firstDiscovery.letterSpace": {
                "model.value": "default",
                "range.min": "minimum",
                "range.max": "maximum",
                "step": "divisibleBy"
            }
	}
    });

    /*
     * Line space panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.lineSpace", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged"],
        preferenceMap: {
            "gpii.firstDiscovery.lineSpace": {
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
        gradeNames: ["gpii.firstDiscovery.panel.rangedWithDisabledMsg"],
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
            enabled: "{prefsEditor}.model.preferences.gpii_firstDiscovery_speak"
        }
    });

    /*
     * The base component for all yes-no-selection panels
     */
    fluid.defaults("gpii.firstDiscovery.panel.yesNo", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip.renderer", "fluid.prefs.panel"],
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
        gradeNames: ["gpii.firstDiscovery.panel.yesNo"],
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
        gradeNames: ["gpii.firstDiscovery.panel.yesNo"],
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
        gradeNames: ["gpii.firstDiscovery.panel.yesNo"],
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
        gradeNames: ["gpii.firstDiscovery.panel.yesNo"],
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
        gradeNames: ["gpii.firstDiscovery.attachTooltip.renderer", "fluid.prefs.panel"],
        preferenceMap: {
            "gpii.firstDiscovery.language": {
                "model.lang": "default",
                "controlValues.lang": "enum"
            }
        },
        members: {
            maxViewportFirstLangIndex: {
                expander: {
                    funcName: "gpii.firstDiscovery.panel.lang.calculateMaxViewportFirstLangIndex",
                    args: [ "{that}.options.controlValues.lang.length",
                            "{that}.options.numOfLangPerPage" ]
                }
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
        components: {
            tooltip: {
                options: {
                    listeners: {
                        "afterOpen.setTooltipLang": {
                            listener: "gpii.firstDiscovery.panel.lang.setTooltipLang"
                        }
                    }
                }
            }
        },
        model: {
            selectedLang: undefined,
            // TODO: the viewportFirstLangIndex model property contains the index
            //      of the top language to display on the panel.
            //      see: https://issues.fluidproject.org/browse/FLOE-406
            viewportFirstLangIndex: 0,
            atStartOfLangs: false,
            atEndOfLangs: false
        },
        modelRelay: [{
            target: "viewportFirstLangIndex",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.viewportFirstLangIndex",
                min: 0,
                max: "{that}.maxViewportFirstLangIndex"
            }
        }, {
            target: "atStartOfLangs",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.viewportFirstLangIndex",
                operator: "===",
                right: 0
            }
        }, {
            target: "atEndOfLangs",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.viewportFirstLangIndex",
                operator: "===",
                right: "{that}.maxViewportFirstLangIndex"
            }
        }, {
            source: "lang",
            target: "currentSelectedIndex",
            singleTransform: {
                type: "fluid.transforms.indexOf",
                array: "{that}.options.controlValues.lang",
                value: "{that}.model.lang"
            }
        }],
        modelListeners: {
            selectedLang: {
                listener: "{that}.scrollToSelectedLang"
            },
            viewportFirstLangIndex: {
                listener: "{that}.updateDisplayedLangs"
            },
            atStartOfLangs: [{
                listener: "{that}.tooltip.close",
                priority: 10
            }, {
                "this": "{that}.dom.prev",
                method: "prop",
                args: ["disabled", "{that}.model.atStartOfLangs"],
                priority: 5
            }],
            atEndOfLangs: [{
                listener: "{that}.tooltip.close",
                priority: 10
            }, {
                "this": "{that}.dom.next",
                method: "prop",
                args: ["disabled", "{that}.model.atEndOfLangs"],
                priority: 5
            }]
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
                args: ["{that}", "{that}.model.viewportFirstLangIndex"]
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
            // Need to close the tooltip before the DOM elements are removed
            "onRenderTree.closeTooltip": "{that}.tooltip.close",
            "langButtonsReady.displayActiveLang": {
                funcName: "gpii.firstDiscovery.panel.lang.displayActiveLang",
                args: ["{that}", "{that}.model.lang"]
            }
        }
    });

    gpii.firstDiscovery.panel.lang.calculateMaxViewportFirstLangIndex = function (numLangs, numLangsPerPage) {
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
        // setTimeout() breaks the event firing out of the synchronous flow to
        // ensure the button div scrolling has completed when the event is fired.
        // Otherwise, buttons.offset() used in listeners for this event returns
        // position values before scrolling occurs.
        // see: https://issues.fluidproject.org/browse/FLOE-407
        setTimeout(function () {
            that.events.langButtonsReady.fire();
        });
    };

    gpii.firstDiscovery.panel.lang.scrollLangs = function (that, adjustBy) {
        var newIndex = that.model.viewportFirstLangIndex + adjustBy;
        that.applier.change("viewportFirstLangIndex", newIndex);
    };

    gpii.firstDiscovery.panel.lang.scrollLangIntoView = function (that, lang) {
        var langIndex = that.options.controlValues.lang.indexOf(lang);
        if (langIndex !== -1) {
            // Test if the language that we want to scroll to is above
            // or below the currently displayed languages. If it is
            // neither, we don't need to scroll.
            var startOfNextPage = that.model.viewportFirstLangIndex + that.options.numOfLangPerPage;
            if (langIndex < that.model.viewportFirstLangIndex) {
                // the language that we want to scroll to is above
                that.applier.change("viewportFirstLangIndex", langIndex);
            } else if (langIndex >= startOfNextPage) {
                // the language that we want to scroll to is below
                var newIndex = langIndex - that.options.numOfLangPerPage + 1;
                that.applier.change("viewportFirstLangIndex", newIndex);
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
        that.applier.change("viewportFirstLangIndex", langIndex);
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
            that.applier.change("viewportFirstLangIndex", 0);
            that.refreshView();
        }
    };

    gpii.firstDiscovery.panel.lang.setLangOnHtml = function (currentLang) {
        $("html").attr("lang", currentLang);
    };

    gpii.firstDiscovery.panel.lang.setTooltipLang = function (that, originalTarget, tooltip) {
        tooltip.attr("lang", $(originalTarget).attr("lang"));
    };

    // Any change to the model causes all panels to be rerendered. If
    // the language panel is rerendered while off-screen, we cannot
    // scroll to the correct position as position information is not
    // available while hidden. Instead, we need to rerender again when
    // the user naviagates back to the language panel.
    fluid.defaults("gpii.firstDiscovery.panel.lang.prefEditorConnection", {
        gradeNames: ["fluid.component"],
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
        gradeNames: ["gpii.firstDiscovery.attachTooltip.renderer", "fluid.prefs.panel"],
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
                ]
            }
        }
    });

    gpii.firstDiscovery.panel.contrast.style = function (labels, theme, defaultThemeName, style) {
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
        gradeNames: ["fluid.prefs.panel"],
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
        gradeNames: ["fluid.prefs.panel"],
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

    /*
     * Confirm Panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.confirm", {
        gradeNames: ["fluid.prefs.panel"],
        preferenceMap: {
            "gpii.firstDiscovery.confirm": {}
        },
        selectors: {
            message: ".gpiic-fd-confirm-message",

            language: "languageConfirmation",
            languageLabel: "languageLabel",

            speak: "speakConfirmation",
            speakLabel: "speakLabel",

            speechRate: "speechRateConfirmation",
            speechRateLabel: "speechRateLabel",

            contrast: "contrastConfirmation",
            contrastLabel: "contrastLabel",

            textSize: "textSizeConfirmation",
            textSizeLabel: "textSizeLabel",

            letterSpace: "letterSpaceConfirmation",
            letterSpaceLabel: "letterSpaceLabel",

            lineSpace: "lineSpaceConfirmation",
            lineSpaceLabel: "lineSpaceLabel",

            onScreenKeyboard: "onScreenKeyboardConfirmation",
            onScreenKeyboardLabel: "onScreenKeyboardLabel",

            captions: "captionsConfirmation",
            captionsLabel: "captionsLabel",

            showSounds: "showSoundsConfirmation",
            showSoundsLabel: "showSoundsLabel",

            stickyKeys: "stickyKeysConfirmation",
            stickyKeysLabel: "stickyKeysLabel"

        },
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            }
        },
        modelListeners: {
            "{fluid.prefs.prefsEditor}.model.preferences": {
                funcName: "gpii.firstDiscovery.panel.confirm.updatePreferenceValues",
                args: ["{that}", "{change}"]
            }
        },
        friendlyNames: {
                "en-US": {
                    labels: {
                        language: "Language:",
                        speak: "Text to Speech:",
                        speechRate: "Speech Rate:",
                        contrast: "Contrast:",
                        textSize: "Text Size:",
                        letterSpace: "Letter Spacing:",
                        lineSpace: "Line Spacing:",
                        onScreenKeyboard: "On-Screen Keyboard:",
                        captions: "Captions:",
                        showSounds: "Show Sounds:",
                        stickyKeys: "Sticky Keys:"
                    },
                    values: {
                        onOff: {
                            "true": "On",
                            "false": "Off"
                        },
                        language: "English",
                        contrast:{
                            "default": "Original",
                            "bw": "Black/White",
                            "wb": "White/Black"
                        }
                    }
                },
                "fr-FR": {
                    labels: {
                        language: "Langue:",
                        speak: "Synthèse Vocale:",
                        speechRate: "Débit de Parole:",
                        contrast: "Contraste:",
                        textSize: "Taille du Texte:",
                        letterSpace: "L'espacement des Lettres",
                        lineSpace: "Interligne:",
                        onScreenKeyboard: "Clavier à l'Écran:",
                        captions: "Légendes:",
                        showSounds: "Voir les Sons:",
                        stickyKeys: "Touches Rémanentes:"
                    },
                    values: {
                        onOff: {
                            "true": "Oui",
                            "false": "Non"
                        },
                        language: "Français",
                        contrast: {
                            "default": "Original",
                            "bw": "Noir/Blanc",
                            "wb": "Blanc/Noir"
                        }
                    }
                },
                "es-MX": {
                    labels: {
                        language: "Idioma:",
                        speak: "Texto a Voz:",
                        speechRate: "Nivel de Conversación:",
                        contrast: "Contraste:",
                        textSize: "Tamaño de Texto:",
                        letterSpace: "Espaciado Carta",
                        lineSpace: "Interlineado:",
                        onScreenKeyboard: "Teclado en Pantalla:",
                        captions: "Leyendas:",
                        showSounds: "Mostrar Sonidos:",
                        stickyKeys: "Teclas Pegajosas:"
                    },
                    values: {
                        onOff: {
                            "true": "Sí",
                            "false": "Non"
                        },
                        language: "Español",
                        contrast: {
                            "default": "Original",
                            "bw": "Negro/Blanco",
                            "wb": "Blanco/Negro"
                        }
                    }
                }
            }
    });

    gpii.firstDiscovery.panel.confirm.updatePreferenceValues = function(that, changeContext) {

        //Language
        var languageValue = changeContext.value.gpii_firstDiscovery_language;
        $("#" + that.options.selectors.languageLabel).text(that.options.friendlyNames[languageValue].labels.language);
        $("#" + that.options.selectors.language).text(that.options.friendlyNames[languageValue].values.language);

        //Text to Speech
        $("#" + that.options.selectors.speakLabel).text(that.options.friendlyNames[languageValue].labels.speak);
        var speakValue = changeContext.value.gpii_firstDiscovery_speak;
        $("#" + that.options.selectors.speak).text(that.options.friendlyNames[languageValue].values.onOff[speakValue]);

        //Speech Rate
        $("#" + that.options.selectors.speechRateLabel).text(that.options.friendlyNames[languageValue].labels.speechRate);
        var speechRateValue = (changeContext.value.gpii_firstDiscovery_speechRate);
        var averageWordsPerMinute = 130;
        var wordsPerMinute = Math.round(speechRateValue*averageWordsPerMinute);
        $("#" + that.options.selectors.speechRate).text(wordsPerMinute + "wpm");

        //Contrast
        $("#" + that.options.selectors.contrastLabel).text(that.options.friendlyNames[languageValue].labels.contrast);
        var contrastValue = changeContext.value.fluid_prefs_contrast;
        $("#" + that.options.selectors.contrast).text(that.options.friendlyNames[languageValue].values.contrast[contrastValue]);

        //Text Size
        $("#" + that.options.selectors.textSizeLabel).text(that.options.friendlyNames[languageValue].labels.textSize);
        var textSizeValue = (changeContext.value.fluid_prefs_textSize);
        var roundedTSValue = textSizeValue.toFixed(1);
        $("#" + that.options.selectors.textSize).text(roundedTSValue + "x");

        //Letter Space
        $("#" + that.options.selectors.letterSpaceLabel).text(that.options.friendlyNames[languageValue].labels.letterSpace);
        var letterSpaceValue = (changeContext.value.gpii_firstDiscovery_letterSpace);
        var roundedLetterSpaceValue = letterSpaceValue.toFixed(1);
        $("#" + that.options.selectors.letterSpace).text(roundedLetterSpaceValue + "x");

        //Line Space
        $("#" + that.options.selectors.lineSpaceLabel).text(that.options.friendlyNames[languageValue].labels.lineSpace);
        var lineSpaceValue = (changeContext.value.gpii_firstDiscovery_lineSpace);
        var roundedLineSpaceValue = lineSpaceValue.toFixed(1);
        $("#" + that.options.selectors.lineSpace).text(roundedLineSpaceValue + "x");

        //On-ScreenKeyboard
        $("#" + that.options.selectors.onScreenKeyboardLabel).text(that.options.friendlyNames[languageValue].labels.onScreenKeyboard);
        var onScreenKeyboardValue = changeContext.value.gpii_firstDiscovery_onScreenKeyboard;
        $("#" + that.options.selectors.onScreenKeyboard).text(that.options.friendlyNames[languageValue].values.onOff[onScreenKeyboardValue]);

        //Captions
        $("#" + that.options.selectors.captionsLabel).text(that.options.friendlyNames[languageValue].labels.captions);
        var captionsValue = changeContext.value.gpii_firstDiscovery_captions;
        $("#" + that.options.selectors.captions).text(that.options.friendlyNames[languageValue].values.onOff[captionsValue]);

        //Show Sounds
        $("#" + that.options.selectors.showSoundsLabel).text(that.options.friendlyNames[languageValue].labels.showSounds);
        var showSoundsValue = changeContext.value.gpii_firstDiscovery_showSounds;
        $("#" + that.options.selectors.showSounds).text(that.options.friendlyNames[languageValue].values.onOff[showSoundsValue]);

        //Sticky Keys
        $("#" + that.options.selectors.stickyKeysLabel).text(that.options.friendlyNames[languageValue].labels.stickyKeys);
        var stickyKeysValue = changeContext.value.gpii_firstDiscovery_stickyKeys;
        $("#" + that.options.selectors.stickyKeys).text(that.options.friendlyNames[languageValue].values.onOff[stickyKeysValue]);
    };


    /*
     * Save Panel
     */

    fluid.defaults("gpii.firstDiscovery.panel.save", {
        gradeNames: ["fluid.prefs.panel"],
        preferenceMap: {
            "gpii.firstDiscovery.save": {}
        },
        selectors: {
            message: ".gpiic-fd-save-message"
        },
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            }
        }
    });


    /*
     * Token panel
     */
    fluid.defaults("gpii.firstDiscovery.panel.token", {
        gradeNames: ["fluid.prefs.panel"],
        preferenceMap: {
            "gpii.firstDiscovery.token": {}
        },
        saveRequestConfig: {
            url: "/user?view=%view",
            method: "POST",
            // To define the "%view" used in the url.
            // Leave blank if no view name needs to be specified.
            view: ""
        },
        selectors: {
            message: ".gpiic-fd-token-message",
            token: ".gpiic-fd-token"
        },
        selectorsToIgnore: ["token"],
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            }
        },
        chromeExtensionId: "oaicfgfcklidgbdcpgfkpmgknkfganok",
        events: {
            onSuccess: null,  // argument: the server returned data
            onError: null,
            onCloudSaveSuccess: null
        },
        listeners: {
            "onCloudSaveSuccess.writeToken": {
                funcName: "{that}.savePrefsToUsb",
                args: ["{arguments}.0"]
            },
            "onSuccess.showToken": {
                funcName: "{that}.showTokenText",
                args: ["{arguments}.0.userToken"]
            },
            "onError.showErrorMsg": {
                funcName: "{that}.showTokenText",
                args: ["{that}.msgLookup.error"]
            }
        },
        invokers: {
            showTokenText: {
                "this": "{that}.dom.token",
                method: "html",
                args: ["{arguments}.0"]
            },
            savePrefsToServer: {
                funcName: "gpii.firstDiscovery.panel.token.savePrefsToServer",
                args: ["{that}", "{fluid.prefs.prefsEditor}.model.preferences", "{arguments}.0"]
            },
            savePrefsToUsb: {
                funcName: "gpii.firstDiscovery.panel.token.savePrefsToUsb",
                args: ["{that}", "{arguments}.0"]

            }
        }
    });

    gpii.firstDiscovery.panel.token.savePrefsToUsb = function (that, data) {

        /*
            if not chrome:
                USB is not possible, so just fire success

            if chrome:

                if not extension:
                    USB is not possible so just fire success

                if extension:
                    USB is possible so msg the extension
         */

        // If the plugin hasn't responded in 2 seconds with the version, it is a user without a
        // plugin installed, so show them the token.
        var successTimeoutId = setTimeout(function(){
            that.events.onSuccess.fire(data);
        }, 2000);

        window.chrome.runtime.sendMessage(
            that.options.chromeExtensionId,
            {"message": {"message_type":"request_version"}},
            function onVersionCallback(version){
                // If we got a version, the plugin is installed, so clear the timeout and let the plugin write to usb
                if (version){
                    clearTimeout(successTimeoutId);
                    var message = {
                        message: {
                            message_type: "write_usb",
                            message_body: {
                                userToken: data.userToken,
                                preferences: data.preferences
                            }
                        }
                    };
                    window.chrome.runtime.sendMessage(
                        that.options.chromeExtensionId,
                        message,
                        function onChromeExtensionResponse(response) {
                            if (response.is_successful == "true") {
                                that.events.onSuccess.fire(data);
                            } else {
                                that.events.onError.fire();
                            }
                        });
                }
            });
    };

    gpii.firstDiscovery.panel.token.savePrefsToServer = function (that, data, isReadyToSave) {
        if (!isReadyToSave) {
            return;
        }

        var saveRequestConfig = that.options.saveRequestConfig,
            data = JSON.stringify(data),
            view = saveRequestConfig.view || "",
            url = fluid.stringTemplate(saveRequestConfig.url, {view: view});

        $.ajax({
            url: url,
            method: saveRequestConfig.method,
            contentType: "application/json",
            dataType: "json",
            data: data,
            success: function (data, textStatus, jqXHR) {
                //that.events.onSuccess.fire(data, textStatus, jqXHR);
                that.events.onCloudSaveSuccess.fire(data, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                that.events.onError.fire(jqXHR, textStatus, errorThrown);
            }
        });
    };

    // A grade component to connect "gpii.firstDiscovery.prefsServerIntegration" and
    // the token panel (gpii.firstDiscovery.panel.token). It sends the request to the
    // the first discovery server to save preferences when the token panel becomes visible.
    fluid.defaults("gpii.firstDiscovery.panel.token.prefsServerIntegrationConnection", {
        gradeNames: ["fluid.modelComponent"],
        modelListeners: {
            "{gpii.firstDiscovery.prefsServerIntegration}.model.isLastPanel": {
                funcName: "{that}.savePrefsToServer",
                args: ["{change}.value"]
            }
        }
    });

})(jQuery, fluid);
