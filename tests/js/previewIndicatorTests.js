/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.previewIndicator", {
        gradeNames: ["gpii.firstDiscovery.previewIndicator"],
        messageBase: {
            "preview": "Preview",
            "previewTooltip": "This is the preview.",
            "warning": "This is not a live website!",
            "warningTooltip": "This is not a live website!"
        }
    });

    jqUnit.test("Test the previewIndicator", function () {
        jqUnit.expect(1);
        var that = gpii.tests.firstDiscovery.previewIndicator("#gpiic-tests-previewIndicator");
        jqUnit.assertNotNull("The subcomponent \"indicators\" should have been created", that.indicators);
    });

})(jQuery, fluid);
