/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.attachTooltip", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip"],
        messageBase: {
            "containerLabel": "container label from the message resolver",
            "button1Label": "button1 label from the message resolver",
            "button2Label": "button2 label from the message resolver",

            "item1-tooltip": "item1 label",
            "item2-tooltip": "item2 label",
            "item3-tooltip": "item3 label",
            "item4-tooltip": "item4 label",

            "item1-tooltipAtSelect": "item1 being selected",
            "item2-tooltipAtSelect": "item2 being selected",
            "item3-tooltipAtSelect": "item3 being selected",
            "item4-tooltipAtSelect": "item4 being selected"
        },
        selectors: {
            button1: ".gpiic-button1",
            button2: ".gpiic-button2",
            item: ".gpiic-item"
        },
        tooltipContentMap: {
            "": "containerLabel",
            "button1": "button1Label",
            "button2": "button2Label",
            "item": {
                tooltip: ["item1-tooltip", "item2-tooltip", "item3-tooltip", "item4-tooltip"],
                tooltipAtSelect: ["item1-tooltipAtSelect", "item2-tooltipAtSelect", "item3-tooltipAtSelect", "item4-tooltipAtSelect"]
            }
        },
        modelListeners: {
            "currentSelectedIndex": "{that}.tooltip.updateIdToContent"
        }
    });

    jqUnit.test("Tooltip with contents from the message resolver", function () {
        var that = gpii.tests.firstDiscovery.attachTooltip(".gpiic-tooltip");
        var expected = {
            tooltipTestsContainer: "container label from the message resolver",
            button1: "button1 label from the message resolver",
            button2: "button2 label from the message resolver",
            item1: "item1 label",
            item2: "item2 label",
            item3: "item3 label",
            item4: "item4 label"
        };

        jqUnit.assertDeepEq("The tooltip model value for idToContent is expected", expected, that.tooltip.model.idToContent);

        var newExpected = $.extend(expected, {item3: "item3 being selected"});
        that.applier.change("currentSelectedIndex", 2);
        jqUnit.assertDeepEq("The tooltip model value for idToContent is expected", newExpected, that.tooltip.model.idToContent);
    });

})(jQuery, fluid);
