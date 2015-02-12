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

    gpii.tests.verifyActiveState = function (that, iconState, activeIndicatorState) {
        var activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            activeIndicator = that.locate("activeIndicator");

        gpii.tests.utils.hasClass("The active icon", that.container, activeCss, iconState);
        gpii.tests.utils.hasClass("The active indicator", activeIndicator, showCss, activeIndicatorState);
    };

    jqUnit.test("Nav Icon", function () {
        jqUnit.expect(6);

        var that = gpii.firstDiscovery.icon(".gpiic-icon", {
            position: 1
        });

        that.applier.change("isActive", true);
        gpii.tests.verifyActiveState(that, true, true);
        that.applier.change("isActive", false);
        gpii.tests.verifyActiveState(that, false, false);

        that.applier.change("isVisited", true);
        gpii.tests.utils.hasClass("The done indicator is shown", that.locate("doneIndicator"), that.options.styles.show, true);
        that.applier.change("isVisited", false);
        gpii.tests.utils.hasClass("The shown state of the done indicator persists", that.locate("doneIndicator"), that.options.styles.show, true);
    });

    gpii.tests.verifyStates = function (that, currentPanelNum, prevPanelNums) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var icons = that.locate("icon");
        fluid.each(icons, function (icon, index) {
            var iconComponent = that[index === 0 ? "icon" : "icon-" + index],
                activeCss = iconComponent.options.styles.active,
                showCss = iconComponent.options.styles.show,
                position = iconComponent.options.position,
                activeIndicator = iconComponent.locate("activeIndicator"),
                doneIndicator = iconComponent.locate("doneIndicator");

            if (currentPanelNum === index + 1) {
                jqUnit.assertTrue("The model value for isActive has been set to true", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The active icon", iconComponent.container, activeCss, true);
                gpii.tests.utils.hasClass("The active indicator for the active icon", activeIndicator, showCss, true);
            } else {
                jqUnit.assertFalse("The model value for isActive has been set to false", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The inactive icon", iconComponent.container, activeCss, false);
                gpii.tests.utils.hasClass("The active indicator for the inactive icon", activeIndicator, showCss, false);
            }

            if (prevPanelNums.indexOf(position) === -1) {
                jqUnit.assertFalse("The model value for isVisited has been set to false", iconComponent.model.isVisited);
                gpii.tests.utils.hasClass("The done indicator for a not-yet-visited panel", doneIndicator, showCss, false);
            } else {
                gpii.tests.utils.hasClass("The done indicator for a visited panel", doneIndicator, showCss, true);
            }
        });
    };

    jqUnit.test("Nav Icons", function () {
        jqUnit.expect(72);

        var that = gpii.firstDiscovery.navIcons(".gpiic-nav"),
            icons = that.locate("icon");

        fluid.each(icons, function (icon, index) {
            var subcomponentName = index === 0 ? "icon" : "icon-" + index;
            jqUnit.assertNotUndefined("The subcomponent " + subcomponentName + " has been instantiated", that[subcomponentName]);
            jqUnit.assertEquals("The container for the subcomponent " + subcomponentName + " is correct", icon, that[subcomponentName].container[0]);
            jqUnit.assertEquals("The position option for the subcomponent " + subcomponentName + " has been set properly", index + 1, that[subcomponentName].options.position);
        });

        that.applier.change("currentPanelNum", 1);
        gpii.tests.verifyStates(that, 1, []);

        that.applier.change("currentPanelNum", 3);
        gpii.tests.verifyStates(that, 3, [1]);

        that.applier.change("currentPanelNum", 4);
        gpii.tests.verifyStates(that, 4, [1, 3]);
    });

})(jQuery, fluid);