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

    /**************************
     * Language Enactor Tests *
     **************************/

    fluid.defaults("gpii.tests.enactor.lang", {
        gradeNames: ["gpii.firstDiscovery.enactor.lang", "autoInit"],
        model: {
            lang: "en"
        },
        invokers: {
            reloadPage: "gpii.tests.enactor.lang.reloadPage"
        }
    });

    gpii.tests.enactor.lang.reloadPage = function () {
        jqUnit.assert("The reloadPage invoker should have fired");
    };

    jqUnit.test("Test Language Enactor", function () {
        jqUnit.expect(3);

        var that = gpii.tests.enactor.lang();
        jqUnit.assertTrue("The first model listener execution has been detected", that.doneFirstExecution);
        that.applier.change("lang", "fr");
        jqUnit.assertTrue("The member option doneFirstExecution stays as true", that.doneFirstExecution);
    });

})(jQuery, fluid);
