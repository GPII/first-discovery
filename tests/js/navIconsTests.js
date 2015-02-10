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

    gpii.tests.hasClass = function (elementName, element, selector, expected) {
        jqUnit.assertEquals(elementName + " does " + (expected ? "" : "not") + " have " + selector + " applied", expected, element.hasClass(selector));
    };

    gpii.tests.verifyStates = function (that, currentPanelNum, prevPanelNums) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var icons = that.locate("icon"),
            activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            activeIndicator = that.options.selectors.activeIndicator,
            doneIndicator = that.options.selectors.doneIndicator;

        fluid.each(icons, function (icon, index) {
            var element = $(icons[index]);
            if (index === currentPanelNum - 1) {
                gpii.tests.hasClass("The active icon", element, activeCss, true);
                gpii.tests.hasClass("The active indicator for the active icon", element.find(activeIndicator), showCss, true);
            } else {
                gpii.tests.hasClass("The inactive icon", element, activeCss, false);
                gpii.tests.hasClass("The active indicator for the inactive icon", element.find(activeIndicator), showCss, false);
            }
        });

        // The visited icon states for the previously visited panels should be applied
        for (var i = 0; i < icons.length; i++) {
            var doneIndicatorElem = $(icons[i]).find(doneIndicator);

            if (prevPanelNums.indexOf(i + 1) === -1) {
                gpii.tests.hasClass("The done indicator for a not-yet-visited panel", doneIndicatorElem, showCss, false);
            } else {
                gpii.tests.hasClass("The done indicator for a visited panel", doneIndicatorElem, showCss, true);
            }
        }
    };

    jqUnit.test("Nav Icons", function () {
        jqUnit.expect(39);

        var that = gpii.firstDiscovery.navIcons(".gpiic-nav");

        that.applier.change("currentPanelNum", 1);
        gpii.tests.verifyStates(that, 1, []);

        that.applier.change("currentPanelNum", 3);
        gpii.tests.verifyStates(that, 3, [1]);

        that.applier.change("currentPanelNum", 4);
        gpii.tests.verifyStates(that, 4, [1, 3]);
    });

})(jQuery, fluid);
