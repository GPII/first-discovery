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
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "gpii.firstDiscovery.msgLookup", "fluid.textToSpeech", "autoInit"],
        selectors: {
            mute: ".gpiic-fd-selfVoicing-mute",
            muteLabel: ".gpiic-fd-selfVoicing-muteLabel"
        },
        styles: {
            muted: "gpii-fd-selfVoicing-muted",
            unmuted: "gpii-fd-selfVoicing-unmuted"
        },
        model: {
            enabled: false
        },
        tooltipContentMap: {
            "mute": "mutedTooltip"
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
                args: ["{that}.dom.muteLabel", "{that}.msgLookup.unmuted", "{that}.msgLookup.muted", "{that}.model.enabled"]
            },
            setTooltip: {
                funcName: "gpii.firstDiscovery.selfVoicing.setTooltip",
                args: ["{that}", "{that}.model.enabled"]
            },
            setMuteStyle: {
                funcName: "gpii.firstDiscovery.selfVoicing.setMuteStyle",
                args: ["{that}.container", "{that}.options.styles", "{that}.model.enabled"]
            },
            clearQueue: {
                funcName: "gpii.firstDiscovery.selfVoicing.clearQueue",
                args: ["{that}"]
            },
            speakVoiceState: {
                funcName: "gpii.firstDiscovery.selfVoicing.speakVoiceState",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.bindMute": {
                "this": "{that}.dom.mute",
                "method": "click",
                "args": ["{that}.toggleState"]
            },
            // Need to call the handlers onCreate and exclude "init" on the modelListeners
            // because the underlying tooltip widget isn't finished at initialization
            "onCreate.setTooltip": "{that}.setTooltip",
            "onCreate.clearQueue": "{that}.clearQueue"
        },
        modelListeners: {
            "enabled": [
                "{that}.setLabel",
                "{that}.setMuteStyle",
                {
                    listener: "{that}.setTooltip",
                    excludeSource: "init"
                }, {
                    listener: "{that}.clearQueue",
                    excludeSource: "init"
                }, {
                    listener: "{that}.speakVoiceState",
                    excludeSource: "init"
                }
            ]
        }
    });

    gpii.firstDiscovery.selfVoicing.queueSpeech = function (that, text, options) {
        if (that.model.enabled) {
            fluid.textToSpeech.queueSpeech(that, text, true, options);
        }
    };

    gpii.firstDiscovery.selfVoicing.speakVoiceState = function (that, options) {
        var msg = that.msgResolver.resolve(that.model.enabled ? "unmutedMsg" : "mutedMsg");
        // called directly as it needs to be spoken regardless of enabled state.
        fluid.textToSpeech.queueSpeech(that, msg, true, options);
    };

    gpii.firstDiscovery.selfVoicing.toggleState = function (that) {
        that.applier.change("enabled", !that.model.enabled);
    };

    gpii.firstDiscovery.selfVoicing.setLabel = function (elm, unmutedLabel, mutedLabel, isEnabled) {
        var label = isEnabled ? unmutedLabel : mutedLabel;
        elm.text(label);
    };

    gpii.firstDiscovery.selfVoicing.setTooltip = function (that, isEnabled) {
        that.tooltip.close();
        var str = that.msgResolver.resolve(isEnabled ? "unmutedTooltip" : "mutedTooltip");
        var modelPath = "idToContent." + that.locate("mute").attr("id");
        that.tooltip.applier.change(modelPath, str);
    };

    gpii.firstDiscovery.selfVoicing.setMuteStyle = function (elm, styles, isEnabled) {
        elm.toggleClass(styles.unmuted, isEnabled);
        elm.toggleClass(styles.muted, !isEnabled);
    };

    gpii.firstDiscovery.selfVoicing.clearQueue = function (that) {
        if (!that.model.enabled) {
            that.cancel();
        }
    };

})(jQuery, fluid);
