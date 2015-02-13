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

    gpii.tests.verifyActiveState = function (that, iconState) {
        gpii.tests.utils.hasClass("The active icon", that.container, that.options.styles.active, iconState);
    };

    jqUnit.test("Nav Icon", function () {
        jqUnit.expect(5);

        var that = gpii.firstDiscovery.icon(".gpiic-icon", {
            position: 1
        });

        that.applier.change("isActive", true);
        gpii.tests.verifyActiveState(that, true);

        that.applier.change("isActive", false);
        gpii.tests.verifyActiveState(that, false);

        var doneIndicator = that.locate("doneIndicator"),
            showCss = that.options.styles.show;

        gpii.tests.utils.hasClass("The done indicator is not shown", doneIndicator, showCss, false);
        that.applier.change("isConfirmed", true);
        gpii.tests.utils.hasClass("The done indicator is shown", doneIndicator, showCss, true);
        that.applier.change("isConfirmed", false);
        gpii.tests.utils.hasClass("The done indicator is still shown", doneIndicator, showCss, true);
    });

    gpii.tests.verifyStates = function (that, currentPanelNum, prevPanelNums) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var icons = that.locate("icon");
        fluid.each(icons, function (icon, index) {
            var iconComponent = that[index === 0 ? "icon" : "icon-" + index],
                activeCss = iconComponent.options.styles.active,
                showCss = iconComponent.options.styles.show,
                position = iconComponent.options.position,
                doneIndicator = iconComponent.locate("doneIndicator");

            if (currentPanelNum === index + 1) {
                jqUnit.assertTrue("The model value for isActive has been set to true", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The active icon", iconComponent.container, activeCss, true);
            } else {
                jqUnit.assertFalse("The model value for isActive has been set to false", iconComponent.model.isActive);
                gpii.tests.utils.hasClass("The inactive icon", iconComponent.container, activeCss, false);
            }

            if (prevPanelNums.indexOf(position) === -1) {
                gpii.tests.utils.hasClass("The done indicator for a not-yet-visited panel", doneIndicator, showCss, false);
            } else {
                gpii.tests.utils.hasClass("The done indicator for a visited panel", doneIndicator, showCss, true);
            }
        });
    };

    jqUnit.test("Nav Icons", function () {
        jqUnit.expect(64);

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

        // going back doesn't trigger the done indicator to show for the previous panel
        that.applier.change("currentPanelNum", 2);
        gpii.tests.verifyStates(that, 2, [1]);

        that.applier.change("currentPanelNum", 4);
        gpii.tests.verifyStates(that, 4, [1, 2]);
    });

})(jQuery, fluid);
