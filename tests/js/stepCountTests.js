/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.stepCount", {
        gradeNames: ["gpii.firstDiscovery.stepCount", "autoInit"],
        model: {
            currentPanelNum: 1
        },
        panelTotalNum: 10,
        messageBase: {
            "stepCountMsg": "Step %currentPanel of %numPanels"
        }
    });

    jqUnit.test("stepCount should set the message on its container", function () {
        jqUnit.expect(2);
        var that = gpii.tests.firstDiscovery.stepCount("#gpiic-tests-stepCountMsg");
        var expected = "Step 1 of 10";
        jqUnit.assertEquals("The container text should be \"" + expected + "\"", expected, that.container.text());

        that.applier.change("currentPanelNum", 5);
        expected = "Step 5 of 10";
        jqUnit.assertEquals("The container text should be changed to \"" + expected + "\"", expected, that.container.text());
    });

})(jQuery, fluid);
