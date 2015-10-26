/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.tts.tooltipHookup");

    fluid.defaults("gpii.firstDiscovery.tts.tooltipHookup", {
        invokers: {
            speak: {
                func: "{gpii.firstDiscovery.selfVoicing}.queueSpeech"
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

    // TODO: Currently this hookup is intended to be added to the prefsEditor in gpii.firstDiscovery.firstDiscoveryEditor.
    // However, it should be reconfigured like the tooltip hookup and placed at the panel level (i.e. added to each panel).
    // The issue at the moment is that a given panel doesn't know when it is visible.
    // see: https://issues.fluidproject.org/browse/FLOE-409
    fluid.defaults("gpii.firstDiscovery.tts.prefsEditor", {
        gradeNames: ["gpii.firstDiscovery.msgLookup"],
        invokers: {
            speakPanelMessage: {
                funcName: "gpii.firstDiscovery.tts.prefsEditor.speakPanelMessage",
                args: ["{firstDiscoveryEditor}", "{that}.msgLookup.stepCountMsg", "{that}.msgLookup.panelMsg", "{gpii.firstDiscovery.selfVoicing}.queueSpeech", "{arguments}.0"]
            },
            speakPanelInstructions: {
                funcName: "gpii.firstDiscovery.tts.prefsEditor.speakPanelInstructions",
                args: ["{firstDiscoveryEditor}", "{gpii.firstDiscovery.selfVoicing}.queueSpeech", "{arguments}.0"]
            }
        },
        listeners: {
            "onCreate.bindKeypress": {
                listener: "gpii.firstDiscovery.keyboardShortcut.bindShortcut",
                args: ["body", gpii.firstDiscovery.keyboardShortcut.key.h, [], "{that}.speakPanelInstructions"]
            },
            "onReady.speakPanelMessage": {
                listener: "{that}.speakPanelMessage",
                priority: "last"
            }
        },
        modelRelay: [{
            source: "preferences.gpii_firstDiscovery_speak",
            target: "{gpii.firstDiscovery.selfVoicing}.model.enabled",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        }, {
            source: "preferences.gpii_firstDiscovery_language",
            target: "{gpii.firstDiscovery.selfVoicing}.model.utteranceOpts.lang",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        }, {
            source: "preferences.gpii_firstDiscovery_speechRate",
            target: "{gpii.firstDiscovery.selfVoicing}.model.utteranceOpts.rate",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        }],
        modelListeners: {
            "{firstDiscoveryEditor}.model.currentPanelNum": {
                listener: "{that}.speakPanelMessage",
                excludeSource: "init"
            }
        },
        messageBase: "{messageLoader}.resources.prefsEditor.resourceText",
        panelInstructionsSelector: ".gpiic-fd-instructions"
    });

    gpii.firstDiscovery.tts.prefsEditor.getCurrentPanelInstructions = function (that) {
        var panel = that.panels.eq(that.model.currentPanelNum - 1);
        var texts = fluid.transform(panel.find(that.prefsEditor.options.panelInstructionsSelector).filter(":visible"), function (elem) {
            return $.text(elem);
        });
        return texts.join(" ");
    };

    gpii.firstDiscovery.tts.prefsEditor.speakPanelMessage = function (that, stepCountMsgTemplate, panelMsgTemplate, speakFn, speakOpts) {
        // Prevent this function to run when the model relay happens at the very first time.
        // At then the component has been instantiated, so using 'excludeSource: "init"'
        // does not prevent this function to be triggered as a model listener.
        if (!that.panels) {
            return;
        }

        var currentPanelNum = that.model.currentPanelNum;
        var stepCountMsg = fluid.stringTemplate(stepCountMsgTemplate, {
            currentPanel: currentPanelNum,
            numPanels: that.panels.length
        });
        var msg = fluid.stringTemplate(panelMsgTemplate, {
            stepCountMsg: stepCountMsg,
            instructions: gpii.firstDiscovery.tts.prefsEditor.getCurrentPanelInstructions(that)
        });
        speakFn(msg, speakOpts);
    };

    gpii.firstDiscovery.tts.prefsEditor.speakPanelInstructions = function (that, speakFn, speakOpts) {
        var msg = gpii.firstDiscovery.tts.prefsEditor.getCurrentPanelInstructions(that);

        speakFn(msg, speakOpts);
    };

})(jQuery, fluid);
