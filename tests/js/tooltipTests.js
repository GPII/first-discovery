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

    fluid.defaults("gpii.tests.tooltipWithStrings", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "autoInit"],
        selectors: {
            button1: ".gpiic-button1",
            button2: ".gpiic-button2"
        },
        strings: {
            button1Label: "button1 label in strings block",
            button2Label: "button2 label in strings block"
        },
        tooltipContentMap: {
            "button1": "button1Label",
            "button2": "button2Label"
        }
    });

    fluid.defaults("gpii.tests.tooltipWithMsgResolver", {
        gradeNames: ["gpii.firstDiscovery.attachTooltip", "autoInit"],
        strings: {},
        testMessages: {
            button1Label: "button1 label from the message resolver",
            button2Label: "button2 label from the message resolver"
        },
        parentBundle: {
            expander: {
                funcName: "fluid.messageResolver",
                args: [{messageBase: "{that}.options.testMessages"}]
            }
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

    jqUnit.test("Tooltip with contents from the strings block", function () {
        var that = gpii.tests.tooltipWithStrings(".gpiic-tooltip");
        gpii.tests.verifyTooltip(that, "strings block", that.options.strings);
    });

    jqUnit.test("Tooltip with contents from the message resolver", function () {
        var that = gpii.tests.tooltipWithMsgResolver(".gpiic-tooltip");
        gpii.tests.verifyTooltip(that, "message resolver", that.options.testMessages);
    });

})(jQuery, fluid);
