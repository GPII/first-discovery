/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    fluid.defaults("gpii.firstDiscovery.selfVoicing", {
        gradeNames: ["fluid.textToSpeech", "fluid.resolveRootSingle"],
        singleRootType: "gpii.firstDiscovery.selfVoicing",
        model: {
            enabled: false
        },
        invokers: {
            queueSpeech: {
                funcName: "gpii.firstDiscovery.selfVoicing.queueSpeech",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            queueSpeechImpl: {
                funcName: "fluid.textToSpeech.queueSpeech",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            clearQueue: {
                funcName: "gpii.firstDiscovery.selfVoicing.clearQueue",
                args: ["{that}"]
            }
        },
        modelListeners: {
            "enabled": "{that}.clearQueue"
        }
    });

    gpii.firstDiscovery.selfVoicing.queueSpeech = function (that, text, options, force) {
        if (that.model.enabled || force) {
            that.queueSpeechImpl(text, !fluid.get(options, "queue"), options);
        }
    };

    gpii.firstDiscovery.selfVoicing.clearQueue = function (that) {
        if (!that.model.enabled) {
            that.cancel();
        }
    };

    fluid.defaults("gpii.firstDiscovery.selfVoicingToggle", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip"],
        selectors: {
            mute: ".gpiic-fd-selfVoicingToggle-mute",
            muteLabel: ".gpiic-fd-selfVoicingToggle-muteLabel"
        },
        styles: {
            muted: "gpii-fd-selfVoicingToggle-muted",
            unmuted: "gpii-fd-selfVoicingToggle-unmuted"
        },
        model: {
            enabled: false
        },
        tooltipContentMap: {
            "mute": "mutedTooltip"
        },
        invokers: {
            toggleState: {
                funcName: "gpii.firstDiscovery.selfVoicingToggle.toggleState",
                args: ["{that}"]
            },
            setLabel: {
                funcName: "gpii.firstDiscovery.selfVoicingToggle.setLabel",
                args: ["{that}.dom.muteLabel", "{that}.msgLookup.unmuted", "{that}.msgLookup.muted", "{that}.model.enabled"]
            },
            setTooltip: {
                funcName: "gpii.firstDiscovery.selfVoicingToggle.setTooltip",
                args: ["{that}", "{that}.model.enabled"]
            },
            setMuteStyle: {
                funcName: "gpii.firstDiscovery.selfVoicingToggle.setMuteStyle",
                args: ["{that}.container", "{that}.options.styles", "{that}.model.enabled"]
            },
            setPressedState: {
                "this": "{that}.dom.mute",
                "method": "attr",
                "args": ["aria-pressed", "{arguments}.0"]
            },
            speakVoiceState: {
                funcName: "gpii.firstDiscovery.selfVoicingToggle.speakVoiceState",
                args: ["{that}", "{gpii.firstDiscovery.selfVoicing}.queueSpeech", "{arguments}.0"]
            }
        },
        listeners: {
            "onCreate.bindMute": {
                "this": "{that}.dom.mute",
                "method": "click",
                "args": ["{that}.toggleState"]
            },
            "onCreate.setRole": {
                "this": "{that}.dom.mute",
                "method": "attr",
                "args": ["role", "button"]
            },
            // Need to call the handlers onCreate and exclude "init" on the modelListeners
            // because the underlying tooltip widget isn't finished at initialization
            "onCreate.setTooltip": "{that}.setTooltip"
        },
        modelListeners: {
            "enabled": [
                "{that}.setLabel",
                "{that}.setMuteStyle",
                {
                    listener: "{that}.setPressedState",
                    args: ["{change}.value"]
                },
                {
                    listener: "{that}.setTooltip",
                    excludeSource: "init"
                }, {
                    listener: "{that}.speakVoiceState",
                    excludeSource: "init"
                }
            ]
        }
    });

    gpii.firstDiscovery.selfVoicingToggle.speakVoiceState = function (that, speechFn, options) {
        var msg = that.msgResolver.resolve(that.model.enabled ? "unmutedMsg" : "mutedMsg");
        speechFn(msg, options, true);
    };

    gpii.firstDiscovery.selfVoicingToggle.toggleState = function (that) {
        that.applier.change("enabled", !that.model.enabled);
    };

    gpii.firstDiscovery.selfVoicingToggle.setLabel = function (elm, unmutedLabel, mutedLabel, isEnabled) {
        var label = isEnabled ? unmutedLabel : mutedLabel;
        elm.text(label);
    };

    gpii.firstDiscovery.selfVoicingToggle.setTooltip = function (that, isEnabled) {
        that.tooltip.close();
        var str = that.msgResolver.resolve(isEnabled ? "unmutedTooltip" : "mutedTooltip");
        var modelPath = "idToContent." + that.locate("mute").attr("id");
        that.tooltip.applier.change(modelPath, str);
    };

    gpii.firstDiscovery.selfVoicingToggle.setMuteStyle = function (elm, styles, isEnabled) {
        elm.toggleClass(styles.unmuted, isEnabled);
        elm.toggleClass(styles.muted, !isEnabled);
    };

})(jQuery, fluid);
