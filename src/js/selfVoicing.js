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

    fluid.registerNamespace("gpii.firstDiscovery");

    fluid.defaults("gpii.firstDiscovery.selfVoicing", {
        gradeNames: ["fluid.viewComponent", "fluid.textToSpeech", "autoInit"],
        selectors: {
            mute: ".gpiic-fd-selfVoicing-mute",
            muteLabel: ".gpiic-fd-selfVoicing-muteLabel"
        },
        strings: {
            muteEnabled: "turn voice OFF",
            muteDisabled: "turn voice ON"
        },
        model: {
            enabled: false
        },
        invokers: {
            queueSpeech: {
                funcName: "gpii.firstDiscovery.selfVoicing.queueSpeech",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            toggleState: {
                funcName: "gpii.firstDiscovery.selfVoicing.toggleState",
                args: ["{that}"]
            },
            setLabel: {
                funcName: "gpii.firstDiscovery.selfVoicing.setLabel",
                args: ["{that}.dom.muteLabel", "{that}.options.strings", "{that}.model.enabled"]
            }
        },
        listeners: {
            "onCreate.bindMute": {
                "this": "{that}.dom.mute",
                "method": "click",
                "args": ["{that}.toggleState"]
            },
            "onCreate.setLabel": "{that}.setLabel",
            "onCreate.clearQueue": {
                listener: "gpii.firstDiscovery.selfVoicing.clearQueue",
                args: ["{that}"]
            }
        },
        modelListeners: {
            "enabled": ["{that}.setLabel", {
                listener: "gpii.firstDiscovery.selfVoicing.clearQueue",
                args: ["{that}"]
            }]
        }
    });

    gpii.firstDiscovery.selfVoicing.queueSpeech = function (that, text, options) {
        if (that.model.enabled) {
            fluid.textToSpeech.queueSpeech(that, text, true, options);
        }
    };

    gpii.firstDiscovery.selfVoicing.toggleState = function (that) {
        that.applier.change("enabled", !that.model.enabled);
    };

    gpii.firstDiscovery.selfVoicing.setLabel = function (muteLabel, strings, isEnabled) {
        var label = isEnabled ? strings.muteEnabled : strings.muteDisabled;
        muteLabel.text(label);
    };

    gpii.firstDiscovery.selfVoicing.clearQueue = function (that) {
        if (!that.model.enabled) {
            that.cancel();
        }
    };

    fluid.defaults("gpii.firstDiscovery.selfVoicing.hookup", {
        invokers: {
            speak: {
                func: "{gpii.firstDiscovery.selfVoicing}.queueSpeech"
            }
        }
    });

    fluid.registerNamespace("gpii.firstDiscovery.selfVoicing.tooltipHookup");

    fluid.defaults("gpii.firstDiscovery.selfVoicing.tooltipHookup", {
        gradeNames: ["gpii.firstDiscovery.selfVoicing.hookup"],
        listeners: {
            "afterOpen.selfVoicing": {
                listener: "gpii.firstDiscovery.selfVoicing.tooltipHookup.speakTooltip",
                args: ["{that}", "{arguments}.2"]
            }
        }
    });

    gpii.firstDiscovery.selfVoicing.tooltipHookup.speakTooltip = function (that, tooltip) {
        that.speak(tooltip.text());
    };

    fluid.registerNamespace("gpii.firstDiscovery.selfVoicing.fdHookup");

    // TODO: Currently this hookup is intended to be added to gpii.firstDiscovery.firstDiscoveryEditor
    // directly. However, it should be reconfigured like the tooltip hookup and placed at the panel level.
    // The issue at the moment is that a given panel doesn't know when this it is visible. All this information
    // is contained at the editor level, which also doesn't really know which panel component is shown.
    fluid.defaults("gpii.firstDiscovery.selfVoicing.fdHookup", {
        components: {
            selfVoicing: {
                type: "gpii.firstDiscovery.selfVoicing",
                options: {
                    gradeNames: ["fluid.prefs.msgLookup"],
                    members: {
                        messageResolver: "{firstDiscoveryEditor}.msgResolver"
                    },
                    strings: {
                        panelMsg: "{that}.msgLookup.panelMsg"
                    },
                    invokers: {
                        speakPanelMessage: {
                            funcName: "gpii.firstDiscovery.selfVoicing.fdHookup.speakPanelMessage",
                            args: ["{firstDiscoveryEditor}", "{that}.msgLookup.panelMsg", "{that}.queueSpeech"]
                        }
                    },
                    listeners: {
                        "onCreate.readPanel": "{that}.speakPanelMessage"
                    },
                    modelListeners: {
                        "{firstDiscoveryEditor}.model.currentPanelNum": "{that}.speakPanelMessage"
                    }
                }
            }
        },
        panelInstructionsSelector: ".gpiic-fd-instructions"
    });

    gpii.firstDiscovery.selfVoicing.fdHookup.speakPanelMessage = function (that, template, speakFn) {
        var currentPanelNum = that.model.currentPanelNum;
        var msg = fluid.stringTemplate(template, {
            currentPanel: currentPanelNum,
            numPanels: that.panels.length,
            instructions: that.panels.eq(currentPanelNum - 1).find(that.options.panelInstructionsSelector).text()
        });
        speakFn(msg);
    };

})(jQuery, fluid);
