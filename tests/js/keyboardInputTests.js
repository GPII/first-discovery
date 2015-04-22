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

    gpii.tests.firstDiscovery.charFromKeypressTestCases = [
        { keyCode: undefined, expected: ""},
        { keyCode: null, expected: "" },
        { keyCode: 33, expected: "!" },
        { keyCode: 48, expected: "0" },
        { keyCode: 65, expected: "A" },
        { keyCode: 97, expected: "a" }
    ];

    jqUnit.test("charFromKeypress", function () {
        fluid.each(gpii.tests.firstDiscovery.charFromKeypressTestCases, function (testcase) {
            var msg = "keyCode " + testcase.keyCode + " expect \"" + testcase.expected + "\"";
            var actual = gpii.firstDiscovery.charFromKeypress({ which: testcase.keyCode });
            jqUnit.assertEquals(msg, testcase.expected, actual);
        });
    });

    jqUnit.test("usKeymap.isShiftEvent", function () {
        var keymap = gpii.firstDiscovery.usKeymap();
        jqUnit.assertTrue("true for shift", keymap.isShiftEvent({ which: keymap.shiftKeyCode }));
        jqUnit.assertFalse("false for non-shift", keymap.isShiftEvent({ which: 0 }));
    });

    gpii.tests.firstDiscovery.usKeymap.nonLowerCase = [
        String.fromCharCode(96),
        String.fromCharCode(123),
        "A"
    ];

    jqUnit.test("usKeymap.isLowerCaseLetter", function () {
        jqUnit.expect(26 + 3);
        var keymap = gpii.firstDiscovery.usKeymap();
        for (var code = 97; code <= 122; code++) {
            var ch = String.fromCharCode(code);
            jqUnit.assertTrue(ch, keymap.isLowerCaseLetter(ch));
        }
        fluid.each(gpii.tests.firstDiscovery.usKeymap.nonLowerCase, function (ch) {
            jqUnit.assertFalse(ch, keymap.isLowerCaseLetter(ch));
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
        for (var code = 97; code <= 122; code++) {
            var ch = String.fromCharCode(code);
            jqUnit.assertTrue(ch, keymap.canShiftChar(ch));
            jqUnit.assertEquals(ch, ch.toUpperCase(), keymap.getShiftedChar(ch));
        }
        fluid.each(gpii.tests.firstDiscovery.usKeymap.shiftTestCases, function (testcase) {
            jqUnit.assertEquals(testcase.ch, testcase.canShift, keymap.canShiftChar(testcase.ch));
            if (testcase.canShift) {
                jqUnit.assertEquals(testcase.ch, testcase.shifted, keymap.getShiftedChar(testcase.ch));
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
        var msg = "Check class " + className + " " + expected;
        jqUnit.assertEquals(msg, expected, keyboardInput.container.hasClass(className));
    };

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
                            args: ["Sticky Keys is off", "{keyboardInput}.model.stickyKeysEnabled"]
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
                            args: ["a", "a", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container", "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            event: "{keyboardInput}.events.shiftKeydown",
                            listener: "jqUnit.assert",
                            args: ["shiftKeydown fired"]
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
                            args: ["b (not shifted)", "b", "{keyboardInput}.model.userInput"],
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
                            args: ["Sticky Keys is enabled", "{keyboardInput}.model.stickyKeysEnabled"],
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
                            args: ["a", "a", "{keyboardInput}.model.userInput"],
                            spec: {path: "userInput", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container", "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertTrue",
                            args: ["shiftLatched is true", "{keyboardInput}.model.shiftLatched"],
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
                            args: ["B (shifted)", "B", "{keyboardInput}.model.userInput"],
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
                            args: ["c (not shifted)", "c", "{keyboardInput}.model.userInput"],
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
                            args: ["Sticky Keys is enabled", "{keyboardInput}.model.stickyKeysEnabled"]
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container", "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertTrue",
                            args: ["shiftLatched is true", "{keyboardInput}.model.shiftLatched"],
                            spec: {path: "shiftLatched", priority: "last"},
                            changeEvent: "{keyboardInput}.applier.modelChanged"
                        },
                        {
                            func: "gpii.tests.firstDiscovery.triggerKeydown",
                            args: ["{keyboardInput}.container", "{keyboardInput}.keymap.shiftKeyCode"]
                        },
                        {
                            listener: "jqUnit.assertFalse",
                            args: ["shiftLatched is false", "{keyboardInput}.model.shiftLatched"],
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
