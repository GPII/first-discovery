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

    fluid.registerNamespace("gpii.firstDiscovery.tts.tooltipHookup");

    fluid.defaults("gpii.firstDiscovery.tts.tooltipHookup", {
        invokers: {
            speak: {
                func: "{fluid.textToSpeech}.queueSpeech"
            }
        },
        listeners: {
            "afterOpen.tts": {
                listener: "gpii.firstDiscovery.tts.tooltipHookup.speakTooltip",
                args: ["{that}", "{arguments}.2"]
            }
        }
    });

    gpii.firstDiscovery.tts.tooltipHookup.speakTooltip = function (that, tooltip) {
        // setTimeout() is to work around the issue that when tooltip model.idToContent is updated with the
        // content for elements being selected (there are cases of having different tooltip content for unselected
        // and selected states), the updated model info is not accessible in "afterClose".
        setTimeout(function () {
            that.speak(tooltip.text(), {lang: tooltip.attr("lang")});
        });
    };

    fluid.registerNamespace("gpii.firstDiscovery.tts.fdHookup");

    // TODO: Currently this hookup is intended to be added to gpii.firstDiscovery.firstDiscoveryEditor
    // directly. However, it should be reconfigured like the tooltip hookup and placed at the panel level.
    // The issue at the moment is that a given panel doesn't know when this it is visible. All this information
    // is contained at the editor level, which also doesn't really know which panel component is shown.
    fluid.defaults("gpii.firstDiscovery.tts.fdHookup", {
        components: {
            selfVoicing: {
                options: {
                    strings: {
                        panelMsg: "{that}.msgLookup.panelMsg"
                    },
                    invokers: {
                        speakPanelMessage: {
                            funcName: "gpii.firstDiscovery.tts.fdHookup.speakPanelMessage",
                            args: ["{firstDiscoveryEditor}", "{that}.msgLookup.panelMsg", "{that}.queueSpeech", "{arguments}.0"]
                        },
                        speakPanelInstructions: {
                            funcName: "gpii.firstDiscovery.tts.fdHookup.speakPanelInstructions",
                            args: ["{firstDiscoveryEditor}", "{that}.queueSpeech", "{arguments}.0"]
                        }
                    },
                    listeners: {
                        "onCreate.bindKeypress": {
                            listener: "gpii.firstDiscovery.keyboardShortcut.bindShortcut",
                            args: ["body", gpii.firstDiscovery.keyboardShortcut.key.h, [], "{that}.speakPanelInstructions"]
                        }
                    },
                    modelListeners: {
                        "{firstDiscoveryEditor}.model.currentPanelNum": "{that}.speakPanelMessage"
                    }
                }
            }
        },
        panelInstructionsSelector: ".gpiic-fd-instructions"
    });

    gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions = function (that) {
        var panel = that.panels.eq(that.model.currentPanelNum - 1);
        var texts = fluid.transform(panel.find(that.options.panelInstructionsSelector).filter(":visible"), function (elem) {
            return $.text(elem);
        });
        return texts.join(" ");
    };

    gpii.firstDiscovery.tts.fdHookup.speakPanelMessage = function (that, template, speakFn, speakOpts) {
        var currentPanelNum = that.model.currentPanelNum;
        var msg = fluid.stringTemplate(template, {
            currentPanel: currentPanelNum,
            numPanels: that.panels.length,
            instructions: gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that)
        });
        speakFn(msg, speakOpts);
    };

    gpii.firstDiscovery.tts.fdHookup.speakPanelInstructions = function (that, speakFn, speakOpts) {
        var msg = gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that);

        speakFn(msg, speakOpts);
    };

})(jQuery, fluid);
