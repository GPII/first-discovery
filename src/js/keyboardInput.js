/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function () {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    fluid.defaults("gpii.firstDiscovery.usKeymap", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
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
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        model: {
            stickyKeysEnabled: false,
            shiftLatched: false,
            userInput: ""
        },
        modelListeners: {
            "stickyKeysEnabled.unlatchShift": "{that}.unlatchShift",
            "shiftLatched.updateShiftLatchedClass": "{that}.updateShiftLatchedClass"
        },
        events: {
            shiftKeydown: null
        },
        styles: {
            shiftLatched: "gpii-keyboardInput-shiftLatched"
        },
        invokers: {
            "unlatchShift": {
                funcName: "gpii.firstDiscovery.keyboardInput.unlatchShift",
                args: ["{that}"]
            },
            "updateShiftLatchedClass": {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.shiftLatched", "{that}.model.shiftLatched"]
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
            }
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

    gpii.firstDiscovery.keyboardInput.unlatchShift = function (that) {
        that.applier.change("shiftLatched", false);
    };

    gpii.firstDiscovery.keyboardInput.registerShiftListener = function (that, input, keymap) {
        input.keydown(function (e) {
            if (keymap.isShiftEvent(e)) {
                that.events.shiftKeydown.fire();
                if (that.model.stickyKeysEnabled) {
                    // toggle the shiftLatched state
                    that.applier.change("shiftLatched", !(that.model.shiftLatched));
                }
            }
        });
    };

    gpii.firstDiscovery.keyboardInput.registerKeypressListener = function (that, input, keymap) {
        input.keypress(function (e) {
            e.preventDefault();
            var ch = gpii.firstDiscovery.keyboardInput.charFromKeypress(e);
            if (that.model.stickyKeysEnabled && that.model.shiftLatched) {
                that.unlatchShift();
                if (keymap.canShiftChar(ch)) {
                    ch = keymap.getShiftedChar(ch);
                }
            }
            if (ch !== "") {
                input.val(ch);
                // programmatic change of the input value does not
                // fire a change event, so we trigger it explicitly
                input.triggerHandler("change");
            }
        });
    };

    gpii.firstDiscovery.keyboardInput.registerChangeListener = function (that, input) {
        input.change(function () {
            that.applier.change("userInput", input.val());
        });
    };

})();
