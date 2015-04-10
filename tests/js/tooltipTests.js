/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.attachTooltip", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "gpii.firstDiscovery.msgLookup", "autoInit"],
        messageBase: {
            button1Label: "button1 label from the message resolver",
            button2Label: "button2 label from the message resolver"
        },
        selectors: {
            button1: ".gpiic-button1",
            button2: ".gpiic-button2"
        },
        tooltipContentMap: {
            "button1": "button1Label",
            "button2": "button2Label"
        }
    });

    gpii.tests.verifyTooltip = function (that, testType, expectedLabelBlock) {
        fluid.each(that.options.tooltipContentMap, function (labelName, domName) {
            var domId = that.locate(domName).attr("id");
            jqUnit.assertEquals("The tooltip content for " + domName + " matches the text defined in the " + testType, expectedLabelBlock[labelName], that.tooltip.model.idToContent[domId]);
        });
    };

    jqUnit.test("Tooltip with contents from the message resolver", function () {
        var that = gpii.tests.firstDiscovery.attachTooltip(".gpiic-tooltip");
        gpii.tests.verifyTooltip(that, "message resolver", that.options.messageBase);
    });

})(jQuery, fluid);
