/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

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

})(jQuery, fluid);
