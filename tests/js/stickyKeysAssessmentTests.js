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
     * Sticky Keys Assessment *
     **************************/

    fluid.defaults("gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment", {
        gradeNames: ["gpii.firstDiscovery.keyboard.stickyKeysAssessment", "autoInit"],
        requiredInput: "@"
    });

    gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment.checkTestModels = [
        {offerAssistance: false, input: "a", requiredInput: "b", expected: true},
        {offerAssistance: true, input: "a", requiredInput: "b", expected: true},
        {offerAssistance: false, input: "a", requiredInput: "a", expected: false},
        {offerAssistance: true, input: "a", requiredInput: "a", expected: true}
    ];

    jqUnit.test("gpii.firstDiscovery.keyboard.stickyKeysAssessment.check", function () {
        var msg = "offerAssistance: %offerAssistance, input: %input, requiredInput: %requiredInput";
        fluid.each(gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment.checkTestModels, function (model) {
            var result = gpii.firstDiscovery.keyboard.stickyKeysAssessment.check(model);
            jqUnit.assertEquals(fluid.stringTemplate(msg, model), model.expected, result);
        });
    });

    jqUnit.test("gpii.firstDiscovery.keyboard.stickyKeysAssessment", function () {
        var that = gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment();

        jqUnit.assertFalse("Initially offerAssistance should be false", that.model.offerAssistance);

        that.applier.change("input", "@");
        jqUnit.assertFalse("After entering the expected input, offerAssistance should still be false", that.model.offerAssistance);

        that.applier.change("input", "2");
        jqUnit.assertTrue("After entering an unexpected input, offerAssistance should be true", that.model.offerAssistance);

        that.applier.change("input", "@");
        jqUnit.assertTrue("After entering the expected input, offerAssistance should still be true", that.model.offerAssistance);
    });

})(jQuery, fluid);
