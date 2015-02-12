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
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "fluid.textToSpeech", "autoInit"],
        selectors: {
            mute: ".gpiic-fd-selfVoicing-mute",
            muteLabel: ".gpiic-fd-selfVoicing-muteLabel"
        },
        strings: {
            muted: "turn voice ON",
            unmuted: "turn voice OFF",
            mutedMsg: "voice is off",
            unmutedMsg: "voice is on"
        },
        styles: {
            muted: "gpii-fd-selfVoicing-muted",
            unmuted: "gpii-fd-selfVoicing-unmuted"
        },
        model: {
            enabled: false
        },
        tooltipContentMap: {
            "mute": "muted"
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
            },
            setTooltip: {
                funcName: "gpii.firstDiscovery.selfVoicing.setTooltip",
                args: ["{that}", "{that}.model.enabled"]
            },
            setMuteStyle: {
                funcName: "gpii.firstDiscovery.selfVoicing.setMuteStyle",
                args: ["{that}.container", "{that}.options.styles", "{that}.model.enabled"]
            }
        },
        listeners: {
            "onCreate.bindMute": {
                "this": "{that}.dom.mute",
                "method": "click",
                "args": ["{that}.toggleState"]
            },
            // TODO: The following listeners can be removed after switching to use model relay
            "onCreate.setLabel": "{that}.setLabel",
            "onCreate.setTooltip": "{that}.setTooltip",
            "onCreate.setMuteStyle": "{that}.setMuteStyle",
            "onCreate.clearQueue": {
                listener: "gpii.firstDiscovery.selfVoicing.clearQueue",
                args: ["{that}"]
            }
        },
        modelListeners: {
            "enabled": [
                "{that}.setLabel",
                "{that}.setMuteStyle",
                "{that}.setTooltip",
                {
                    listener: "gpii.firstDiscovery.selfVoicing.clearQueue",
                    args: ["{that}"]
                },
                {
                    listener: "gpii.firstDiscovery.selfVoicing.speakVoiceState",
                    args: ["{that}", "{change}"]
                }
            ]
        }
    });

    gpii.firstDiscovery.selfVoicing.queueSpeech = function (that, text, options) {
        if (that.model.enabled) {
            fluid.textToSpeech.queueSpeech(that, text, true, options);
        }
    };

    // TODO: The manual comparison of old and new model state can be removed after switching to a model relay component
    gpii.firstDiscovery.selfVoicing.speakVoiceState = function (that, change, options) {
        var newVal;
        var oldVal;

        if (typeof(change.value) === "object") {
            newVal = change.value.enabled;
            oldVal = change.oldValue.enabled;
        } else {
            newVal = change.value;
            oldVal = change.oldValue;
        }

        if (newVal !== oldVal) {
            var msg = that.model.enabled ? that.options.strings.unmutedMsg : that.options.strings.mutedMsg;
            // called directly as it needs to be spoken regardless of enabled state.
            fluid.textToSpeech.queueSpeech(that, msg, true, options);
        }
    };

    gpii.firstDiscovery.selfVoicing.toggleState = function (that) {
        that.applier.change("enabled", !that.model.enabled);
    };

    gpii.firstDiscovery.selfVoicing.setLabel = function (elm, strings, isEnabled) {
        var label = isEnabled ? strings.unmuted : strings.muted;
        elm.text(label);
    };

    gpii.firstDiscovery.selfVoicing.setTooltip = function (that, isEnabled) {
        var str = that.options.strings[isEnabled ? "unmuted" : "muted"];
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
