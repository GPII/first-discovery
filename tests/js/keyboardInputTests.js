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

    gpii.tests.firstDiscovery.usKeymap.nonLowerCase = [
        String.fromCharCode(96),    // edge case: character before "a" (97)
        String.fromCharCode(123),   // edge case: character after "z" (122)
        "A"
    ];

    jqUnit.test("usKeymap.isLowerCaseLetter", function () {
        jqUnit.expect(26 + 3);
        var keymap = gpii.firstDiscovery.usKeymap();
        // start by checking all the lower-case letters
        for (var code = gpii.tests.firstDiscovery.charCodeLowerCaseA;
             code <= gpii.tests.firstDiscovery.charCodeLowerCaseZ;
             code++) {
            var ch = String.fromCharCode(code);
            gpii.tests.firstDiscovery.usKeymap.checkIsLowerCaseLetter(keymap, true, ch);
        }
        // next, check some non-lower-case letter characters
        fluid.each(gpii.tests.firstDiscovery.usKeymap.nonLowerCase, function (ch) {
            gpii.tests.firstDiscovery.usKeymap.checkIsLowerCaseLetter(keymap, false, ch);
        });
    });

    gpii.tests.firstDiscovery.usKeymap.shiftTestCases = [
        { ch: "0", canShift: true, shifted: ")" },
        { ch: "/", canShift: true, shifted: "?" },
        { ch: "A", canShift: false },
        { ch: "?", canShift: false}
    ];

    jqUnit.test("usKeymap canShiftChar and getShiftedChar", function () {
        jqUnit.expect((26 * 2) + 4 + 2);
        var keymap = gpii.firstDiscovery.usKeymap();
        // start by checking all the lower-case letters
        for (var code = gpii.tests.firstDiscovery.charCodeLowerCaseA;
             code <= gpii.tests.firstDiscovery.charCodeLowerCaseZ;
             code++) {
            var ch = String.fromCharCode(code);
            gpii.tests.firstDiscovery.usKeymap.checkCanShiftChar(keymap, true, ch);
            gpii.tests.firstDiscovery.usKeymap.checkGetShiftedChar(keymap, ch.toUpperCase(), ch);
        }
        // next, check other test cases
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
        elem.triggerHandler(jQuery.Event("keypress", { which: ch.charCodeAt(0) }));
    };

    gpii.tests.firstDiscovery.triggerKeydown = function (elem, keyCode) {
        elem.triggerHandler(jQuery.Event("keydown", { which: keyCode }));
    };

    gpii.tests.firstDiscovery.checkShiftLatchedClass = function (keyboardInput) {
        var className = keyboardInput.options.styles.shiftLatched;
        var expected = keyboardInput.model.shiftLatched;
        var msg = "hasClass(\"" + className + "\") should be " + expected;
        jqUnit.assertEquals(msg, expected, keyboardInput.container.hasClass(className));
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

    fluid.defaults("gpii.tests.firstDiscovery.keyboardInputTestTree", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            keyboardInput: {
                type: "gpii.firstDiscovery.keyboardInput",
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
                }
            ]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([ "gpii.tests.firstDiscovery.keyboardInputTestTree" ]);
    });

})(jQuery, fluid);
