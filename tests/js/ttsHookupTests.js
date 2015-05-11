/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.tts.fdHookup");

    jqUnit.test("gpii.firstDiscovery.tts.fdHookup.bindKeypress", function () {
        jqUnit.expect(1);
        var elm = $(".bindKeypress-test");
        var keyCode = 104; // 'h'

        gpii.firstDiscovery.tts.fdHookup.bindKeypress(elm, keyCode, function () {
            jqUnit.assert("The keypress function should have exectued");
        });

        // simulate the keypress
        elm.simulate("keypress", {keyCode: keyCode});
    });

    gpii.tests.firstDiscovery.tts.fdHookup.instructionsTestCases = [
        {
            selector: "#gpiic-tests-no-instructions",
            expected: ""
        },
        {
            selector: "#gpiic-tests-one-instruction",
            expected: "single instruction text"
        },
        {
            selector: "#gpiic-tests-multiple-instructions",
            expected: "instruction element one. instruction element two"
        }
    ];

    jqUnit.test("gpii.firstDiscovery.tts.fdHookup.getVisibleInstructions", function () {
        fluid.each(gpii.tests.firstDiscovery.tts.fdHookup.instructionsTestCases, function (test) {
            var panel = $(test.selector);
            var msg = "should get \"" + test.expected + "\" for panel " + test.selector ;
            var actual = gpii.firstDiscovery.tts.fdHookup.getVisibleInstructions(panel, ".gpiic-fd-instructions");
            jqUnit.assertEquals(msg, test.expected, actual);
        });
    });

})(jQuery, fluid);
