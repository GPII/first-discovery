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
            var char = String.fromCharCode(code);
            jqUnit.assertTrue(char, keymap.isLowerCaseLetter(char));
        }
        fluid.each(gpii.tests.firstDiscovery.usKeymap.nonLowerCase, function (char) {
            jqUnit.assertFalse(char, keymap.isLowerCaseLetter(char));
        });
    });

    gpii.tests.firstDiscovery.usKeymap.shiftTestCases = [
        { char: "0", canShift: true, shifted: ")" },
        { char: "/", canShift: true, shifted: "?" },
        { char: "A", canShift: false },
        { char: "?", canShift: false}
    ];

    jqUnit.test("usKeymap canShiftChar and getShiftedChar", function () {
        jqUnit.expect((26 * 2) + 4 + 2);
        var keymap = gpii.firstDiscovery.usKeymap();
        for (var code = 97; code <= 122; code++) {
            var char = String.fromCharCode(code);
            jqUnit.assertTrue(char, keymap.canShiftChar(char));
            jqUnit.assertEquals(char, char.toUpperCase(), keymap.getShiftedChar(char));
        }
        fluid.each(gpii.tests.firstDiscovery.usKeymap.shiftTestCases, function (testcase) {
            jqUnit.assertEquals(testcase.char, testcase.canShift, keymap.canShiftChar(testcase.char));
            if (testcase.canShift) {
                jqUnit.assertEquals(testcase.char, testcase.shifted, keymap.getShiftedChar(testcase.char));
            }
        });
    });

})(jQuery, fluid);
