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

    fluid.defaults("gpii.firstDiscovery.panel.keyboard", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.stickyKeys": {
                "model.stickyKeys": "default"
            }
        },
        selectors: {
            placeholder: ".gpiic-fd-keyboard-input",
            instructions: ".gpiic-fd-keyboard-instructions",
            assistance: ".gpiic-fd-keyboard-assistance"
        },
        styles: {
            hide: "gpii-fd-keyboard-assistanceHide"
        },
        events: {
            onOfferAssistance: null
        },
        model: {
            // offerAssistance: boolean
        },
        components: {
            assistance: {
                type: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster",
                createOnEvent: "onOfferAssistance",
                container: "{that}.container",
                options: {
                    messageBase: "{keyboard}.options.messageBase",
                    modelRelay: {
                        source: "stickyKeysEnabled",
                        target: "{keyboardInput}.model.stickyKeysEnabled",
                        backward: "liveOnly",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            },
            stickyKeysAssessor: {
                type: "gpii.firstDiscovery.keyboard.stickyKeysAssessment",
                options: {
                    requiredInput: "@",
                    modelRelay: {
                        source: "offerAssistance",
                        target: "{keyboard}.model.offerAssistance",
                        forward: "liveOnly",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            },
            keyboardInput: {
                type: "gpii.firstDiscovery.keyboardInput",
                createOnEvent: "afterRender",
                container: "{that}.dom.placeholder",
                options: {
                    model: {
                        userInput: "{stickyKeysAssessor}.model.input"
                    }
                }
            }
        },
        protoTree: {
            placeholder: {
                decorators: {
                    attrs: {
                        placeholder: "{that}.msgLookup.placeholder"
                    }
                }
            },
            assistance: {
                decorators: {
                    type: "addClass",
                    classes: "{that}.options.styles.hide"
                }
            },
            instructions: {markup: {messagekey: "keyboardInstructions"}}
        },
        modelListeners: {
            offerAssistance: [{
                listener: "gpii.firstDiscovery.panel.keyboard.offerAssistance",
                excludeSource: "init",
                args: ["{that}"]
            }, {
                listener: "{stickyKeysAssessor}.destroy",
                excludeSource: "init"
            }]
        }
    });

    gpii.firstDiscovery.panel.keyboard.offerAssistance = function (that) {
        if (that.model.offerAssistance) {
            that.locate("assistance").removeClass(that.options.styles.hide);
            that.events.onOfferAssistance.fire();
        } else {
            that.locate("instructions").text(that.msgResolver.resolve("successInstructions"));
        }
    };

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

    fluid.defaults("gpii.firstDiscovery.panel.lang", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.language": {
                "model.lang": "default"
            }
        },
        selectors: {
            instructions: ".gpiic-fd-instructions"
        },
        protoTree: {
            instructions: {markup: {messagekey: "langInstructions"}}
        }
    });

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

    fluid.defaults("gpii.firstDiscovery.panel.contrast", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "fluid.prefs.contrast": {
                "model.value": "default",
                "controlValues.theme": "enum"
            }
        }
    });

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
