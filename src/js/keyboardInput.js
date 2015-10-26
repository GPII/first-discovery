/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("gpii.firstDiscovery.usKeymap", {
        gradeNames: ["fluid.component"],
        invokers: {
            isShiftEvent: {
                funcName: "gpii.firstDiscovery.usKeymap.isShiftEvent",
                args: ["{that}", "{arguments}.0"]
            },
            isLowerCaseLetter: {
                funcName: "gpii.firstDiscovery.usKeymap.isLowerCaseLetter",
                args: ["{that}", "{arguments}.0"]
            },
            canShiftChar: {
                funcName: "gpii.firstDiscovery.usKeymap.canShiftChar",
                args: ["{that}", "{arguments}.0"]
            },
            getShiftedChar: {
                funcName: "gpii.firstDiscovery.usKeymap.getShiftedChar",
                args: ["{that}", "{arguments}.0"]
            }
        },
        members: {
            charCodeLowerCaseA: 97,
            charCodeLowerCaseZ: 122,
            shiftKeyCode: 16,
            shiftTable: {
                "`": "~",
                "1": "!",
                "2": "@",
                "3": "#",
                "4": "$",
                "5": "%",
                "6": "^",
                "7": "&",
                "8": "*",
                "9": "(",
                "0": ")",
                "-": "_",
                "=": "+",
                "[": "{",
                "]": "}",
                "\\": "|",
                ";": ":",
                "'": "\"",
                ",": "<",
                ".": ">",
                "/": "?"
            }
        }
    });

    gpii.firstDiscovery.usKeymap.isShiftEvent = function (keymap, e) {
        return e.which === keymap.shiftKeyCode;
    };

    gpii.firstDiscovery.usKeymap.isLowerCaseLetter = function (keymap, ch) {
        var charCode = ch.charCodeAt(0);
        return (charCode >= keymap.charCodeLowerCaseA) &&
            (charCode <= keymap.charCodeLowerCaseZ);
    };

    gpii.firstDiscovery.usKeymap.canShiftChar = function (keymap, ch) {
        return gpii.firstDiscovery.usKeymap.isLowerCaseLetter(keymap, ch) ||
            (keymap.shiftTable[ch] !== undefined);
    };

    gpii.firstDiscovery.usKeymap.getShiftedChar = function (keymap, ch) {
        if (gpii.firstDiscovery.usKeymap.isLowerCaseLetter(keymap, ch)) {
            return ch.toUpperCase();
        } else {
            return keymap.shiftTable[ch];
        }
    };

    fluid.defaults("gpii.firstDiscovery.keyboardInput", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "gpii.firstDiscovery.msgLookup", "fluid.viewComponent"],
        tooltipContentMap: {
            "": "keyboardInputTooltip"  // use "" to select the container
        },
        model: {
            stickyKeysEnabled: false,
            shiftLatched: false,
            userInput: ""
        },
        modelListeners: {
            "stickyKeysEnabled.unlatchShift": "{that}.unlatchShift",
            "stickyKeysEnabled.clearInput": "{that}.clearInput",
            "shiftLatched.updateShiftLatchedClass": "{that}.updateShiftLatchedClass"
        },
        events: {
            shiftKeydown: null,
            keypress: null,
            shiftLatchChange: null
        },
        styles: {
            shiftLatched: "gpii-keyboardInput-shiftLatched"
        },
        invokers: {
            "unlatchShift": {
                changePath: "shiftLatched",
                value: false
            },
            "updateShiftLatchedClass": {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.shiftLatched", "{that}.model.shiftLatched"]
            },
            "clearInput": {
                funcName: "gpii.firstDiscovery.keyboardInput.setElementValueAndTriggerChange",
                args: ["{that}.container", ""]
            },
            "openTooltipIfNotFocused": {
                funcName: "gpii.firstDiscovery.keyboardInput.openTooltipIfNotFocused",
                args: ["{that}", "{that}.container"]
            },
            "toggleShiftLatched": {
                funcName: "gpii.firstDiscovery.keyboardInput.toggleShiftLatched",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.registerShiftListener": {
                funcName: "gpii.firstDiscovery.keyboardInput.registerShiftListener",
                args: ["{that}", "{that}.container", "{keymap}"]
            },
            "onCreate.registerKeypressListener": {
                funcName: "gpii.firstDiscovery.keyboardInput.registerKeypressListener",
                args: ["{that}", "{that}.container", "{keymap}"]
            },
            "onCreate.registerChangeListener": {
                funcName: "gpii.firstDiscovery.keyboardInput.registerChangeListener",
                args: ["{that}", "{that}.container"]
            },
            "keypress.setInputValueAndTriggerChange": {
                funcName: "gpii.firstDiscovery.keyboardInput.setElementValueAndTriggerChange",
                args: ["{that}.container", "{arguments}.0"],
                priority: "last"
            },
            "shiftLatchChange.toggleShiftLatched": "{that}.toggleShiftLatched",
            "onCreate.focusoutHandler": {
                "this": "{that}.container",
                method: "on",
                args: ["focusout.unlatchShift", "{that}.unlatchShift"]
            },
            // begin TOOLTIP HANDLER CONFIGURATION
            //
            // We want to control the tooltip opening ourselves so we
            // remove the existing mouseover and focusin handlers and
            // add our own instead.  We leave the mouseleave and
            // focusout handlers alone as the jQuery Tooltip widget
            // rebinds these each time the tooltip is opened.
            //
            // TODO: once FLUID-5506 has been merged in, use a
            // constraint-based priority rather than fixed numbered
            // see: https://issues.fluidproject.org/browse/FLUID-5506
            "onCreate.removeMouseover": {
                "this": "{that}.container",
                method: "off",
                args: ["mouseover"],
                priority: 2
            },
            "onCreate.removeFocusin": {
                "this": "{that}.container",
                method: "off",
                args: ["focusin"],
                priority: 2
            },
            "onCreate.mouseoverHandler": {
                "this": "{that}.container",
                method: "on",
                args: ["mouseover.openTooltipIfNotFocused", "{that}.openTooltipIfNotFocused"],
                priority: 1
            },
            "onCreate.focusinHandler": {
                "this": "{that}.container",
                method: "on",
                args: ["focusin.closeTooltip", "{that}.tooltip.close"],
                priority: 1
            }
            // END TOOLTIP HANDLER CONFIGURATION
        },
        components: {
            keymap: {
                type: "gpii.firstDiscovery.usKeymap"
            }
        }
    });

    gpii.firstDiscovery.keyboardInput.charFromKeypress = function (e) {
        return e.which ? String.fromCharCode(e.which) : "";
    };

    gpii.firstDiscovery.keyboardInput.registerShiftListener = function (that, input, keymap) {
        input.keydown(function (e) {
            if (keymap.isShiftEvent(e)) {
                that.events.shiftKeydown.fire();
                if (that.model.stickyKeysEnabled) {
                    // TODO: After FLUID-5490 has been implemented
                    // this change notification workflow can be fully
                    // realized via model listener, making use of
                    // source tracking.
                    // see: https://issues.fluidproject.org/browse/FLUID-5490
                    that.events.shiftLatchChange.fire(that);
                }
            }
        });
    };

    gpii.firstDiscovery.keyboardInput.registerKeypressListener = function (that, input, keymap) {
        input.keypress(function (e) {
            e.preventDefault();
            e.stopPropagation();
            var ch = gpii.firstDiscovery.keyboardInput.charFromKeypress(e);
            if (that.model.stickyKeysEnabled && that.model.shiftLatched) {
                that.unlatchShift();
                if (keymap.canShiftChar(ch)) {
                    ch = keymap.getShiftedChar(ch);
                }
            }
            if (ch !== "") {
                that.events.keypress.fire(ch);
            }
        });
    };

    gpii.firstDiscovery.keyboardInput.setElementValueAndTriggerChange = function (elem, value) {
        elem.val(value);
        // programmatic change of the value does not fire a change
        // event, so we trigger it explicitly
        elem.triggerHandler("change");
    };

    gpii.firstDiscovery.keyboardInput.registerChangeListener = function (that, input) {
        input.change(function () {
            that.applier.change("userInput", input.val());
        });
    };

    gpii.firstDiscovery.keyboardInput.openTooltipIfNotFocused = function (that, input) {
        if (!input.is(":focus")) {
            that.tooltip.open();
        }
    };

    gpii.firstDiscovery.keyboardInput.toggleShiftLatched = function (that) {
        that.applier.change("shiftLatched", !(that.model.shiftLatched));
    };

    // The gpii.firstDiscovery.keyboardInputTts mixin grade adds
    // self-voicing to the keyboardInput grade. keyboardInputTts
    // relies on the availablility of a component with the
    // fluid.textToSpeech grade within the component hierarchy to do
    // the actual speaking.
    fluid.defaults("gpii.firstDiscovery.keyboardInputTts", {
        invokers: {
            speak: {
                func: "{gpii.firstDiscovery.selfVoicing}.queueSpeech"
            },
            speakOnFocusMessage: {
                funcName: "gpii.firstDiscovery.keyboardInputTts.speakOnFocusMessage",
                args: ["{that}", "{gpii.firstDiscovery.keyboardInput}.container"]
            },
            speakShiftState: {
                funcName: "gpii.firstDiscovery.keyboardInputTts.speakShiftState",
                args: [
                    "{that}",
                    "{that}.msgLookup.shiftLatched",
                    "{that}.msgLookup.shiftUnlatched"
                ]
            }
        },
        listeners: {
            // This keypress.speak listener has a priority of -10
            // as it needs to happen before the keyboard assessment
            // check is run. That check will cause the panel to be
            // re-rendered and we need to get our speech queued before
            // the re-rendering happens.
            "keypress.speak": {
                listener: "{that}.speak",
                args: ["{arguments}.0"],
                priority: -10
            },
            // This onCreate.registerSpeakOnFocusMessage listener has
            // a priority of 1 as it must happen after the
            // onCreate.removeFocusin listener of keyboardInput
            "onCreate.registerSpeakOnFocusMessage": {
                "this": "{gpii.firstDiscovery.keyboardInput}.container",
                method: "on",
                args: ["focusin.speakOnFocusMessage", "{that}.speakOnFocusMessage"],
                priority: 1
            },
            // The shiftLatchChange.speakShiftState listener has
            // a priority of -10 as it must happen after the model
            // is changed via the shiftLatchChange.toggleShiftLatched listener
            "shiftLatchChange.speakShiftState": {
                listener: "{that}.speakShiftState",
                priority: -10
            }
        }
    });

    fluid.registerNamespace("gpii.firstDiscovery.keyboardInputTts");

    gpii.firstDiscovery.keyboardInputTts.speakOnFocusMessage = function (that, input) {
        var placeholder = input.attr("placeholder");
        if (placeholder && placeholder.length !== 0) {
            that.speak(placeholder);
        }
    };

    gpii.firstDiscovery.keyboardInputTts.speakShiftState = function (that, latchedMsg, unlatchedMsg) {
        var msg = that.model.shiftLatched ? latchedMsg : unlatchedMsg;
        that.speak(msg);
    };

})();
