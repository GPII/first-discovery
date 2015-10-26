/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    /**************************
     * Language Enactor Tests *
     **************************/

    fluid.defaults("gpii.tests.enactor.lang", {
        gradeNames: ["gpii.firstDiscovery.enactor.lang"],
        model: {
            lang: "en"
        },
        invokers: {
            reloadPage: {
                funcName: "jqUnit.assert",
                args: ["The reloadPage invoker should have fired"],
                // As the configuration for invokers are merged rather than replaced, the lines below are to override
                // the component configuration in the defaults block for gpii.firstDiscovery.enactor.lang
                "this": null,
                method: null
            }
        }
    });

    jqUnit.test("Test Language Enactor", function () {
        jqUnit.expect(3);

        var that = gpii.tests.enactor.lang();
        jqUnit.assertTrue("The first model listener execution has been detected", that.initialLangSet);
        that.applier.change("lang", "fr");
        jqUnit.assertTrue("The member option initialLangSet stays as true", that.initialLangSet);
    });

})(jQuery, fluid);
