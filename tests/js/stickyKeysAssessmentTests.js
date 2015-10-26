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
     * Sticky Keys Assessment *
     **************************/

    fluid.defaults("gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment", {
        gradeNames: ["gpii.firstDiscovery.keyboard.stickyKeysAssessment"],
        requiredInput: "@"
    });

    gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment.checkTestModels = [
        {offerAssistance: false, userInput: undefined, requiredInput: "b", expected: false},
        {offerAssistance: false, userInput: "", requiredInput: "b", expected: false},
        {offerAssistance: false, userInput: "a", requiredInput: undefined, expected: true},
        {offerAssistance: false, userInput: "a", requiredInput: "a", expected: false},
        {offerAssistance: false, userInput: "a", requiredInput: "b", expected: true},
        {offerAssistance: true, userInput: undefined, requiredInput: "b", expected: true},
        {offerAssistance: true, userInput: "", requiredInput: "b", expected: true},
        {offerAssistance: true, userInput: "a", requiredInput: undefined, expected: true},
        {offerAssistance: true, userInput: "a", requiredInput: "a", expected: false},
        {offerAssistance: true, userInput: "a", requiredInput: "b", expected: true},
        {offerAssistance: undefined, userInput: undefined, requiredInput: "b", expected: undefined},
        {offerAssistance: undefined, userInput: "", requiredInput: "b", expected: undefined},
        {offerAssistance: undefined, userInput: "a", requiredInput: undefined, expected: true},
        {offerAssistance: undefined, userInput: "a", requiredInput: "a", expected: false},
        {offerAssistance: undefined, userInput: "a", requiredInput: "b", expected: true}
    ];

    jqUnit.test("gpii.firstDiscovery.keyboard.stickyKeysAssessment.check", function () {
        var msg = "offerAssistance: %offerAssistance, userInput: %userInput, requiredInput: %requiredInput";
        fluid.each(gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment.checkTestModels, function (model) {
            var result = gpii.firstDiscovery.keyboard.stickyKeysAssessment.check(model);
            jqUnit.assertEquals(fluid.stringTemplate(msg, model), model.expected, result);
        });
    });

    jqUnit.test("gpii.firstDiscovery.keyboard.stickyKeysAssessment", function () {
        var that = gpii.tests.firstDiscovery.keyboard.stickyKeysAssessment();

        jqUnit.assertUndefined("Initially offerAssistance should be undefined", that.model.offerAssistance);

        that.applier.change("userInput", "@");
        jqUnit.assertFalse("After entering the expected userInput, offerAssistance should still be false", that.model.offerAssistance);

        that.applier.change("userInput", "2");
        jqUnit.assertTrue("After entering an unexpected userInput, offerAssistance should be true", that.model.offerAssistance);

        that.applier.change("userInput", "@");
        jqUnit.assertFalse("After entering the expected userInput, offerAssistance should be false", that.model.offerAssistance);
    });

})(jQuery, fluid);
