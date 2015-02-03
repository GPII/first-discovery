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

    gpii.tests.verifyStates = function (msg, backButton, nextButton, states) {
        jqUnit.assertEquals(msg + " - The back button is disabled", states.backDisabled, backButton.is(":disabled"));
        jqUnit.assertEquals(msg + " - The back button is hidden", states.backVisible, backButton.is(":visible"));
        jqUnit.assertEquals(msg + " - The next button is enabled", states.nextDisabled, nextButton.is(":disabled"));
        jqUnit.assertEquals(msg + " - The next button is shown", states.nextVisible, nextButton.is(":visible"));
    };

    gpii.tests.verifyLabels = function (msg, that, states) {
        var backButton = that.locate("back"),
            backButtonId = that.backButtonId,
            nextButton = that.locate("next"),
            nextButtonId = that.nextButtonId,
            tooltip = that.tooltip;

        if (states.backLabel) {
            jqUnit.assertEquals(msg + " - The text on the back button is properly set", states.backLabel, backButton.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the back button is properly set", states.backLabel, tooltip.model.idToContent[backButtonId]);
        }
        jqUnit.assertEquals(msg + " - The text on the next button is properly set", states.nextLabel, nextButton.html());
        jqUnit.assertEquals(msg + " - The tooltip content for the next button is properly set", states.nextLabel, tooltip.model.idToContent[nextButtonId]);
    };

    gpii.tests.verifyButtons = function (that, currentPanelNum) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var msg,
            start = that.options.panelStartNum,
            end = that.options.panelTotalNum,
            backButton = that.locate("back"),
            nextButton = that.locate("next");

        if (currentPanelNum === start) {
            msg = "On the start panel";
            gpii.tests.verifyStates(msg, backButton, nextButton, {
                backDisabled: true,
                backVisible: false,
                nextDisabled: false,
                nextVisible: true
            });
            gpii.tests.verifyLabels(msg, that, {
                backLabel: undefined,
                nextLabel: that.options.strings.start
            });
        }

        if (currentPanelNum > start && currentPanelNum < end) {
            msg = "On a panel in btw the start and the last panels";
            gpii.tests.verifyStates(msg, backButton, nextButton, {
                backDisabled: false,
                backVisible: true,
                nextDisabled: false,
                nextVisible: true
            });
            gpii.tests.verifyLabels(msg, that, {
                backLabel: that.options.strings.back,
                nextLabel: that.options.strings.next
            });
        }

        if (currentPanelNum === end) {
            msg = "On the last panel";
            gpii.tests.verifyStates(msg, backButton, nextButton, {
                backDisabled: false,
                backVisible: true,
                nextDisabled: false,
                nextVisible: true
            });
            gpii.tests.verifyLabels(msg, that, {
                backLabel: that.options.strings.back,
                nextLabel: that.options.strings.finish
            });
        }
    };

    jqUnit.test("Nav buttons", function () {
        jqUnit.expect(35);

        var that = gpii.firstDiscovery.navButtons(".gpiic-nav", {
            panelTotalNum: 6
        });

        var backButton = that.locate("back"),
            nextButton = that.locate("next");

        // Test button states of being on the first panel
        that.applier.change("currentPanelNum", 1);
        jqUnit.assertNotUndefined("The id for the back button has been detected", that.backButtonId);
        jqUnit.assertNotUndefined("The id for the next button has been detected", that.nextButtonId);
        jqUnit.assertNotUndefined("The tooltip has been created", that.tooltip);
        gpii.tests.verifyButtons(that, 1);

        // Clicking the next button increases the current panel number and changes button states
        nextButton.click();
        gpii.tests.verifyButtons(that, 2);

        // Clicking the back button decreases the current panel number and brings back the states of being on the first panel
        backButton.click();
        gpii.tests.verifyButtons(that, 1);

        // Test the button states of being on the last panel
        that.applier.change("currentPanelNum", 6);
        gpii.tests.verifyButtons(that, 6);
    });

})(jQuery, fluid);
