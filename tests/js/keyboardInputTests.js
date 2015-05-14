/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.usKeymap");
    fluid.registerNamespace("gpii.tests.firstDiscovery.keyboardInput");

    gpii.tests.firstDiscovery.charCodeLowerCaseA = 97;
    gpii.tests.firstDiscovery.charCodeLowerCaseZ = 122;

    gpii.tests.firstDiscovery.usKeymap.checkIsLowerCaseLetter = function (keymap, expected, ch) {
        var msg = "isLowerCaseLetter(\"" + ch + "\") should return " + expected;
        jqUnit.assertEquals(msg, expected, keymap.isLowerCaseLetter(ch));
    };

    gpii.tests.firstDiscovery.usKeymap.checkCanShiftChar = function (keymap, expected, ch) {
        var msg = "canShift(\"" + ch + "\") should return " + expected;
        jqUnit.assertEquals(msg, expected, keymap.canShiftChar(ch));
    };

    gpii.tests.firstDiscovery.usKeymap.checkGetShiftedChar = function (keymap, expected, ch) {
        var msg = "getShiftedChar(\"" + ch + "\") should return \"" + expected + "\"";
        jqUnit.assertEquals(msg, expected, keymap.getShiftedChar(ch));
    };

    jqUnit.test("usKeymap.isShiftEvent", function () {
        var keymap = gpii.firstDiscovery.usKeymap();
        jqUnit.assertTrue("isShiftEvent() should return true for shift",
                          keymap.isShiftEvent({ which: keymap.shiftKeyCode }));
        jqUnit.assertFalse("isShiftEvent() shoud return false for non-shift",
                           keymap.isShiftEvent({ which: 0 }));
    });

    jqUnit.test("usKeymap.isLowerCaseLetter should return true for lower-case", function () {
        jqUnit.expect(26);
        var keymap = gpii.firstDiscovery.usKeymap();
        for (var code = gpii.tests.firstDiscovery.charCodeLowerCaseA;
             code <= gpii.tests.firstDiscovery.charCodeLowerCaseZ;
             code++) {
            var ch = String.fromCharCode(code);
            gpii.tests.firstDiscovery.usKeymap.checkIsLowerCaseLetter(keymap, true, ch);
        }
    });

    gpii.tests.firstDiscovery.usKeymap.nonLowerCase = [
        String.fromCharCode(96),    // boundary case: character before "a" (97)
        String.fromCharCode(123),   // boundary case: character after "z" (122)
        "A"
    ];

    jqUnit.test("usKeymap.isLowerCaseLetter should return false for non-lower-case", function () {
        jqUnit.expect(3);
        var keymap = gpii.firstDiscovery.usKeymap();
        fluid.each(gpii.tests.firstDiscovery.usKeymap.nonLowerCase, function (ch) {
            gpii.tests.firstDiscovery.usKeymap.checkIsLowerCaseLetter(keymap, false, ch);
        });
    });

    jqUnit.test("usKeymap canShiftChar and getShiftedChar on lower-case", function () {
        jqUnit.expect(26 * 2);
        var keymap = gpii.firstDiscovery.usKeymap();
        for (var code = gpii.tests.firstDiscovery.charCodeLowerCaseA;
             code <= gpii.tests.firstDiscovery.charCodeLowerCaseZ;
             code++) {
            var ch = String.fromCharCode(code);
            gpii.tests.firstDiscovery.usKeymap.checkCanShiftChar(keymap, true, ch);
            gpii.tests.firstDiscovery.usKeymap.checkGetShiftedChar(keymap, ch.toUpperCase(), ch);
        }
    });

    gpii.tests.firstDiscovery.usKeymap.shiftTestCases = [
        { ch: "0", canShift: true, shifted: ")" },
        { ch: "/", canShift: true, shifted: "?" },
        { ch: "A", canShift: false },
        { ch: "?", canShift: false}
    ];

    jqUnit.test("usKeymap canShiftChar and getShiftedChar on non-lower-case", function () {
        jqUnit.expect(6);
        var keymap = gpii.firstDiscovery.usKeymap();
        fluid.each(gpii.tests.firstDiscovery.usKeymap.shiftTestCases, function (testcase) {
            gpii.tests.firstDiscovery.usKeymap.checkCanShiftChar(keymap, testcase.canShift,
                                                                 testcase.ch);
            if (testcase.canShift) {
                gpii.tests.firstDiscovery.usKeymap.checkGetShiftedChar(keymap, testcase.shifted,
                                                                       testcase.ch);
            }
        });
    });

    gpii.tests.firstDiscovery.triggerKeypress = function (elem, ch) {
        gpii.tests.utils.simulateKeyEvent(elem, "keypress", { which: ch.charCodeAt(0) });
    };

    gpii.tests.firstDiscovery.triggerKeydown = function (elem, keyCode) {
        gpii.tests.utils.simulateKeyEvent(elem, "keydown", { which: keyCode });
    };

    gpii.tests.firstDiscovery.checkShiftLatchedClass = function (keyboardInput) {
        var className = keyboardInput.options.styles.shiftLatched;
        var expected = keyboardInput.model.shiftLatched;
        var msg = "hasClass(\"" + className + "\") should be " + expected;
        jqUnit.assertEquals(msg, expected, keyboardInput.container.hasClass(className));
    };

    gpii.tests.firstDiscovery.keyboardInput.setUpTooltipTest = function (keyboardInput) {
        // Set the focus and tooltip state to a known starting point
        $("#gpiic-tests-other-input").focus();
        keyboardInput.tooltip.close();
    };

    gpii.tests.firstDiscovery.keyboardInput.checkTooltipMessage = function (keyboardInput) {
        var expected = keyboardInput.options.messageBase.keyboardInputTooltip;
        var actual = keyboardInput.tooltip.model.idToContent[keyboardInput.container.attr("id")];
        jqUnit.assertEquals("The tooltip message should be \"" + expected + "\"", expected, actual);
    };

    gpii.tests.firstDiscovery.keyboardInput.wait = function (keyboardInput, ms) {
        setTimeout(function () {
            keyboardInput.events.waitTimeElapsed.fire();
        }, ms);
    };

    gpii.tests.firstDiscovery.keyboardInput.checkTooltipIsOpen = function (keyboardInput, expected) {
        jqUnit.assertEquals("tooltipIsOpen should be " + expected, expected,
                            keyboardInput.model.tooltipIsOpen);
    };

    gpii.tests.firstDiscovery.keyboardInput.charFromKeypressTestCases = [
        { keyCode: undefined, expected: ""},
        { keyCode: null, expected: "" },
        { keyCode: 33, expected: "!" },
        { keyCode: 48, expected: "0" },
        { keyCode: 65, expected: "A" },
        { keyCode: 97, expected: "a" }
    ];

    jqUnit.test("charFromKeypress", function () {
        fluid.each(gpii.tests.firstDiscovery.keyboardInput.charFromKeypressTestCases, function (testcase) {
            var msg = "keyCode " + testcase.keyCode + " should return \"" + testcase.expected + "\"";
            var actual = gpii.firstDiscovery.keyboardInput.charFromKeypress({ which: testcase.keyCode });
            jqUnit.assertEquals(msg, testcase.expected, actual);
        });
    });

    fluid.defaults("gpii.tests.firstDiscovery.keyboardInput", {
        gradeNames: ["gpii.firstDiscovery.keyboardInput", "autoInit"],
        messageBase: {
            "keyboardInputTooltip": "keyboardInputTooltip message"
        },
        model: {
            tooltipIsOpen: false
        },
        events: {
            tooltipOpen: null,
            tooltipClose: null,
            waitTimeElapsed: null
        },
        listeners: {
            "tooltipOpen": {
                changePath: "tooltipIsOpen",
                value: true
            },
            tooltipClose: {
                changePath: "tooltipIsOpen",
                value: false
            }
        },
        components: {
            tooltip: {
                options: {
                    widgetOptions: {
                        // show and hide without animation
                        show: false,
                        hide: false
                    },
                    events: {
                        afterOpen: "{keyboardInput}.events.tooltipOpen",
                        afterClose: "{keyboardInput}.events.tooltipClose"
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery.keyboardInputTestTree", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            keyboardInput: {
                type: "gpii.tests.firstDiscovery.keyboardInput",
                container: "#gpiic-tests-keyboardInput"
            },
            keyboardInputTester: {
                type: "gpii.tests.firstDiscovery.keyboardInputTester"
            }
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery.keyboardInputTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "keyboardInput tests",
            tests: [
                {
                    name: "Check user input when sticky keys is off",
                    expect: 6,
                    sequence: [
                        {
                            func: "jqUnit.assertFalse",
                            args: ["Sticky Keys should be off",
                                   "{keyboardInput}.model.stickyKeysEnabled"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.checkShiftLatchedClass",
                            args: ["{keyboardInput}"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeypress",
                            args: ["{keyboardInput}.container", "a"]
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            args: ["Pressed \"a\", userInput should be \"a\"",
                                   "a", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container",
                                   "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            event: "{keyboardInput}.events.shiftKeydown",
                            listener: "jqUnit.assert",
                            args: ["Pressed shift, shiftKeydown should have fired"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.checkShiftLatchedClass",
                            args: ["{keyboardInput}"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeypress",
                            args: ["{keyboardInput}.container", "b"]
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            args: ["Pressed \"b\", userInput should be \"b\" (not shifted)",
                                   "b", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        }
                    ]
                },
                {
                    name: "Check user input when sticky keys is on",
                    expect: 8,
                    sequence: [
                        {
                            func: "{keyboardInput}.applier.change",
                            args: ["stickyKeysEnabled", true]
                        },
                        {
                            listener: "jqUnit.assertTrue",
                            args: ["Sticky Keys should be enabled",
                                   "{keyboardInput}.model.stickyKeysEnabled"],
                            spec: {path: "stickyKeysEnabled", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.checkShiftLatchedClass",
                            args: ["{keyboardInput}"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeypress",
                            args: ["{keyboardInput}.container", "a"]
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            args: ["Pressed \"a\", userInput should be \"a\"",
                                   "a", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container",
                                   "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertTrue",
                            args: ["Pressed shift, shiftLatched should be true",
                                   "{keyboardInput}.model.shiftLatched"],
                            spec: {path: "shiftLatched", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.checkShiftLatchedClass",
                            args: ["{keyboardInput}"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeypress",
                            args: ["{keyboardInput}.container", "b"]
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            args: ["Pressed \"b\", userInput should be \"B\" (shifted)",
                                   "B", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.checkShiftLatchedClass",
                            args: ["{keyboardInput}"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeypress",
                            args: ["{keyboardInput}.container", "c"]
                        },
                        {
                            listener: "jqUnit.assertEquals",
                            args: ["Pressed \"c\", userInput should be \"c\" (not shifted)",
                                   "c", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        }
                    ]
                },
                {
                    name: "Pressing shift toggles latching",
                    expect: 3,
                    sequence: [
                        {
                            func: "jqUnit.assertTrue",
                            args: ["Sticky Keys should be enabled",
                                   "{keyboardInput}.model.stickyKeysEnabled"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container",
                                   "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertTrue",
                            args: ["Pressed shift, shiftLatched should be true",
                                   "{keyboardInput}.model.shiftLatched"],
                            spec: {path: "shiftLatched", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container",
                                   "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertFalse",
                            args: ["Pressed shift, shiftLatched should be false",
                                   "{keyboardInput}.model.shiftLatched"],
                            spec: {path: "shiftLatched", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        }
                    ]
                },
                {
                    name: "Check tooltip message",
                    expect: 1,
                    sequence: [
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.checkTooltipMessage",
                            args: ["{keyboardInput}"]
                        }
                    ]
                },
                {
                    name: "Check that the tooltip opens on mouseover and closes on focus",
                    expect: 4,
                    sequence: [
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.setUpTooltipTest",
                            args: ["{keyboardInput}"]
                        },
                        {
                            element: "{keyboardInput}.container",
                            jQueryTrigger: "mouseover"
                        },
                        {
                            event: "{keyboardInput}.events.tooltipOpen",
                            listener: "jqUnit.assert",
                            args: ["Triggered mouseover, tooltipOpen should have fired"]
                        },
                        // Wait for a little time and then check that
                        // tooltipIsOpen has been updated. We verify
                        // that our tooltipIsOpen model updating is
                        // working here so that when we test it to
                        // assert that the tooltip did not open, we
                        // have some assurance that it can be relied
                        // on.
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.wait",
                            args: ["{keyboardInput}", 200]
                        },
                        {
                            event: "{keyboardInput}.events.waitTimeElapsed",
                            listener: "jqUnit.assert",
                            args: ["waitTimeElasped should have fired"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.checkTooltipIsOpen",
                            args: ["{keyboardInput}", true]
                        },
                        {
                            element: "{keyboardInput}.container",
                            jQueryTrigger: "focus"
                        },
                        {
                            event: "{keyboardInput}.events.tooltipClose",
                            listener: "jqUnit.assert",
                            args: ["Focused the keyboardInput, tooltipClose should have fired"]
                        }
                    ]
                },
                {
                    name: "Check that the tooltip does not open on mouseover if the input has focus",
                    expect: 2,
                    sequence: [
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.setUpTooltipTest",
                            args: ["{keyboardInput}"]
                        },
                        {
                            element: "{keyboardInput}.container",
                            jQueryTrigger: "focus"
                        },
                        {
                            element: "{keyboardInput}.container",
                            jQueryTrigger: "mouseover"
                        },
                        // Wait for a little time and then verify that
                        // the tooltip did not open.
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.wait",
                            args: ["{keyboardInput}", 200]
                        },
                        {
                            event: "{keyboardInput}.events.waitTimeElapsed",
                            listener: "jqUnit.assert",
                            args: ["waitTimeElasped should have fired"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.keyboardInput.checkTooltipIsOpen",
                            args: ["{keyboardInput}", false]
                        }
                    ]
                }
            ]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([ "gpii.tests.firstDiscovery.keyboardInputTestTree" ]);
    });

})(jQuery, fluid);
