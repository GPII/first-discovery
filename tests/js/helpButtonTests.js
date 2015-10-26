/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.helpButton", {
        gradeNames: ["gpii.firstDiscovery.helpButton"],
        messageBase: {
            help: "help message"
        }
    });

    jqUnit.test("helpButton should set the message on its container", function () {
        jqUnit.expect(1);

        var helpButton = gpii.tests.firstDiscovery.helpButton("#gpiic-tests-helpButton");
        var expected = helpButton.options.messageBase.help;
        var actual = helpButton.container.text();
        jqUnit.assertEquals("The container text should be \"" + expected + "\"", expected, actual);
    });

})(jQuery, fluid);
