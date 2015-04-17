/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    gpii.firstDiscovery.charFromKeypress = function (e) {
        return e.which ? String.fromCharCode(e.which) : "";
    };

    fluid.defaults("gpii.firstDiscovery.usKeymap", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        invokers: {
            isShiftEvent: {
                funcName: "gpii.firstDiscovery.usKeymap.isShiftEvent",
                args: ["{that}", "{arguments}.0"]
            },
            isLetterChar: {
                funcName: "gpii.firstDiscovery.usKeymap.isLetterChar",
                args: ["{arguments}.0"]
            },
            canShiftChar: {
                funcName: "gpii.firstDiscovery.usKeymap.canShiftChar",
                args: ["{that}.shiftTable", "{arguments}.0"]
            },
            getShiftedChar: {
                funcName: "gpii.firstDiscovery.usKeymap.getShiftedChar",
                args: ["{that}.shiftTable", "{arguments}.0"]
            }
        },
        members: {
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

    gpii.firstDiscovery.usKeymap.isLetterChar = function (char) {
        var charCode = char.charCodeAt(0);
        return charCode >= 97 && charCode <= 122;
    };

    gpii.firstDiscovery.usKeymap.canShiftChar = function (shiftTable, char) {
        return gpii.firstDiscovery.usKeymap.isLetterChar(char) ||
            (shiftTable[char] !== undefined);
    };

    gpii.firstDiscovery.usKeymap.getShiftedChar = function (shiftTable, char) {
        if (gpii.firstDiscovery.usKeymap.isLetterChar(char)) {
            return char.toUpperCase();
        } else {
            return shiftTable[char];
        }
    };

    fluid.defaults("gpii.firstDiscovery.keyboardInput", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        model: {
            stickyKeysEnabled: false,
            shiftLatched: false
        },
        modelListeners: {
            "stickyKeysEnabled.unlatchShift": "{that}.unlatchShift"
        },
        invokers: {
            "unlatchShift": {
                funcName: "gpii.firstDiscovery.keyboardInput.unlatchShift",
                args: ["{that}.model"]
            }
        },
        listeners: {
            "onCreate.registerShiftListener": {
                funcName: "gpii.firstDiscovery.keyboardInput.registerShiftListener",
                args: ["{that}.container", "{that}.model", "{keymap}"]
            },
            "onCreate.registerKeypressListener": {
                funcName: "gpii.firstDiscovery.keyboardInput.registerKeypressListener",
                args: ["{that}.container", "{that}.model", "{keymap}"]
            }
        },
        components: {
            keymap: {
                type: "gpii.firstDiscovery.usKeymap"
            }
        }
    });

    gpii.firstDiscovery.keyboardInput.unlatchShift = function (model) {
        model.shiftLatched = false;
    };

    gpii.firstDiscovery.keyboardInput.registerShiftListener = function (input, model, keymap) {
        input.keydown(function (e) {
            if (model.stickyKeysEnabled && keymap.isShiftEvent(e)) {
                // toggle the shiftLatched state
                model.shiftLatched = !(model.shiftLatched);
            }
        });
    };

    gpii.firstDiscovery.keyboardInput.registerKeypressListener = function (input, model, keymap) {
        input.keypress (function (e) {
            e.preventDefault();
            var char = gpii.firstDiscovery.charFromKeypress(e);
            if (model.stickyKeysEnabled && model.shiftLatched) {
                model.shiftLatched = false;
                if (keymap.canShiftChar(char)) {
                    char = keymap.getShiftedChar(char);
                }
            }
            if (char !== "") {
                input.val(char);
            }
        });
    };

})(jQuery);
