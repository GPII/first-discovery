/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    jqUnit.test("charFromKeypress", function () {
        var tests = [
            { keyCode: undefined, expected: ""},
            { keyCode: null, expected: "" },
            { keyCode: 33, expected: "!" },
            { keyCode: 48, expected: "0" },
            { keyCode: 65, expected: "A" },
            { keyCode: 97, expected: "a" }
        ];

        fluid.each(tests, function (testcase) {
            var msg = "keyCode " + testcase.keyCode + " expect \"" + testcase.expected + "\"";
            var actual = gpii.firstDiscovery.charFromKeypress({ which: testcase.keyCode });
            jqUnit.assertEquals(msg, testcase.expected, actual);
        });
    });

})(jQuery, fluid);
