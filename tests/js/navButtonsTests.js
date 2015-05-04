/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.navButtons");

    gpii.tests.firstDiscovery.navButtons.verifyStates = function (msgPrefix, that, states) {
        fluid.each(states, function (state, selector) {
            gpii.tests.firstDiscovery.navButtons.verifyState(msgPrefix, that, selector, state);
        });
    };

    gpii.tests.firstDiscovery.navButtons.verifyState = function (msgPrefix, that, selector, state) {
        var button = that.locate(selector);
        var stateMsg = state ? "should be" : "should not be";

        jqUnit.assertEquals(msgPrefix + " - The " + selector + " button " + stateMsg + " enabled", state, !button.is(":disabled"));
        jqUnit.assertEquals(msgPrefix + " - The " + selector + " button " + stateMsg + " visible", state, button.hasClass(that.options.styles.show));
    };

    gpii.tests.firstDiscovery.navButtons.verifyLabels = function (msg, that, states) {
        var backButton = that.locate("back"),
            backButtonLabel = that.locate("backLabel"),
            backButtonId = backButton.attr("id"),
            nextButton = that.locate("next"),
            nextButtonLabel = that.locate("nextLabel"),
            nextButtonId = nextButton.attr("id");

        if (states.backLabel) {
            jqUnit.assertEquals(msg + " - The text on the back button is properly set", states.backLabel, backButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the back button is properly set", states.backTooltip, that.tooltip.model.idToContent[backButtonId]);
        }

        if (states.nextLabel) {
            jqUnit.assertEquals(msg + " - The text on the next button is properly set", states.nextLabel, nextButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the next button is properly set", states.nextTooltip, that.tooltip.model.idToContent[nextButtonId]);
        }
    };

    gpii.tests.firstDiscovery.navButtons.verifyButtons = function (that, currentPanelNum) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var msg,
            start = that.options.panelStartNum,
            last = that.options.panelTotalNum;

        if (currentPanelNum === start) {
            msg = "On the start panel";
            gpii.tests.firstDiscovery.navButtons.verifyStates(msg, that, {
                back: false,
                next: true
            });
            gpii.tests.firstDiscovery.navButtons.verifyLabels(msg, that, {
                backLabel: undefined,
                backTooltip: undefined,
                nextLabel: that.options.messageBase.start,
                nextTooltip: that.options.messageBase.startTooltip
            });
        } else if (currentPanelNum === last) {
            msg = "On the last panel";
            gpii.tests.firstDiscovery.navButtons.verifyStates(msg, that, {
                back: true,
                next: false
            });
            gpii.tests.firstDiscovery.navButtons.verifyLabels(msg, that, {
                backLabel: undefined,
                backTooltip: undefined,
                nextLabel: undefined,
                nextTooltip: undefined
            });
        } else if (currentPanelNum === last - 1) {
            msg = "On the second last panel";
            gpii.tests.firstDiscovery.navButtons.verifyStates(msg, that, {
                back: true,
                next: true
            });
            gpii.tests.firstDiscovery.navButtons.verifyLabels(msg, that, {
                backLabel: that.options.messageBase.back,
                backTooltip: that.options.messageBase.backTooltip,
                nextLabel: that.options.messageBase.finish,
                nextTooltip: that.options.messageBase.finishTooltip
            });
        } else {
            msg = "On a panel in btw the start and the last panels";
            gpii.tests.firstDiscovery.navButtons.verifyStates(msg, that, {
                back: true,
                next: true
            });
            gpii.tests.firstDiscovery.navButtons.verifyLabels(msg, that, {
                backLabel: that.options.messageBase.back,
                backTooltip: that.options.messageBase.backTooltip,
                nextLabel: that.options.messageBase.next,
                nextTooltip: that.options.messageBase.nextTooltip
            });
        }


    };

    jqUnit.test("Nav buttons", function () {
        jqUnit.expect(38);
/*
        var firstPanelNum = 1;
        var secondPanelNum = firstPanelNum + 1;
        var panelTotalNum = 6;
        var secondLastPanelNum = panelTotalNum - 1;
*/

        var that = gpii.firstDiscovery.navButtons(".gpiic-nav", {
            panelTotalNum: gpii.tests.firstDiscovery.panelNums.last,
            model: {
                currentPanelNum: null
            },
            messageBase: {
                "back": "back",
                "backTooltip": "Select to go back to last step",
                "next": "next",
                "nextTooltip": "Select to go to next step",
                "start": "start",
                "startTooltip": "Select to start",
                "finish": "finish",
                "finishTooltip": "Select to finish"
            }
        });

        var backButton = that.locate("back"),
            nextButton = that.locate("next");

        // Test button states of being on the first panel
        that.applier.change("currentPanelNum", gpii.tests.firstDiscovery.panelNums.first);
        jqUnit.assertNotUndefined("The model for tooltip has been populated", that.tooltip.model.idToContent);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(that, gpii.tests.firstDiscovery.panelNums.first);

        // Clicking the next button increases the current panel number and changes button states
        nextButton.click();
        gpii.tests.firstDiscovery.navButtons.verifyButtons(that, gpii.tests.firstDiscovery.panelNums.second);

        // Clicking the back button decreases the current panel number and brings back the states of being on the first panel
        backButton.click();
        gpii.tests.firstDiscovery.navButtons.verifyButtons(that, gpii.tests.firstDiscovery.panelNums.first);

        // Test the button states of being on the second last panel
        that.applier.change("currentPanelNum", gpii.tests.firstDiscovery.panelNums.secondLast);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(that, gpii.tests.firstDiscovery.panelNums.secondLast);

        // Test the button states of being on the last panel
        that.applier.change("currentPanelNum", gpii.tests.firstDiscovery.panelNums.last);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(that, gpii.tests.firstDiscovery.panelNums.last);
    });

})(jQuery, fluid);
