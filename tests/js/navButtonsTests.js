/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
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

    gpii.tests.firstDiscovery.navButtons.verifyLabels = function (msg, that, labels) {
        var backButton = that.locate("back"),
            backButtonLabel = that.locate("backLabel"),
            backButtonId = backButton.attr("id"),
            nextButton = that.locate("next"),
            nextButtonLabel = that.locate("nextLabel"),
            nextButtonId = nextButton.attr("id");

        if (labels.backLabel) {
            jqUnit.assertEquals(msg + " - The text on the back button is properly set", labels.backLabel, backButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the back button is properly set", labels.backTooltip, that.tooltip.model.idToContent[backButtonId]);
        }

        if (labels.nextLabel) {
            jqUnit.assertEquals(msg + " - The text on the next button is properly set", labels.nextLabel, nextButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the next button is properly set", labels.nextTooltip, that.tooltip.model.idToContent[nextButtonId]);
        }
    };

    gpii.tests.firstDiscovery.navButtons.verifyButtons = function (that, msg, expectedPanelNum, expectedStates, expectedLabels) {
        jqUnit.assertEquals("The model value has been updated", expectedPanelNum, that.model.currentPanelNum);

        gpii.tests.firstDiscovery.navButtons.verifyStates(msg, that, expectedStates);
        gpii.tests.firstDiscovery.navButtons.verifyLabels(msg, that, expectedLabels);
    };

    var back = "back",
        backTooltip = "Select to go back to last step",
        next = "next",
        nextTooltip = "Select to go to next step",
        start = "start",
        startTooltip = "Select to start",
        finish = "finish",
        finishTooltip = "Select to finish";

    gpii.tests.firstDiscovery.navButtons.runTest = function (expectedStates, expectedLabels, gradeNames) {
        var firstPanelNum = 1;
        var secondPanelNum = firstPanelNum + 1;
        var panelTotalNum = gpii.tests.utils.firstDiscovery.panels.length;
        var secondLastPanelNum = panelTotalNum - 1;

        var that = gpii.firstDiscovery.navButtons(".gpiic-nav", {
            gradeNames: gradeNames,
            panelTotalNum: panelTotalNum,
            model: {
                currentPanelNum: null
            },
            messageBase: {
                "back": back,
                "backTooltip": backTooltip,
                "next": next,
                "nextTooltip": nextTooltip,
                "start": start,
                "startTooltip": startTooltip,
                "finish": finish,
                "finishTooltip": finishTooltip
            }
        });

        var backButton = that.locate("back"),
            nextButton = that.locate("next");

        // Test button states of being on the first panel
        that.applier.change("currentPanelNum", firstPanelNum);
        jqUnit.assertNotUndefined("The model for tooltip has been populated", that.tooltip.model.idToContent);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(
            that,
            "On the start panel",
            firstPanelNum,
            expectedStates.startPanel,
            expectedLabels.startPanel);

        // Clicking the next button increases the current panel number and changes button states
        nextButton.click();
        gpii.tests.firstDiscovery.navButtons.verifyButtons(
            that,
            "On a panel in btw the start and the last panels",
            secondPanelNum,
            expectedStates.middlePanel,
            expectedLabels.middlePanel);

        // Clicking the back button decreases the current panel number and brings back the states of being on the first panel
        backButton.click();
        gpii.tests.firstDiscovery.navButtons.verifyButtons(
            that,
            "On the start panel",
            firstPanelNum,
            expectedStates.startPanel,
            expectedLabels.startPanel);

        // Test the button states of being on the second last panel
        that.applier.change("currentPanelNum", secondLastPanelNum);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(
            that,
            "On the second last panel",
            secondLastPanelNum,
            expectedStates.secondLastPanel,
            expectedLabels.secondLastPanel);

        // Test the button states of being on the last panel
        that.applier.change("currentPanelNum", panelTotalNum);
        gpii.tests.firstDiscovery.navButtons.verifyButtons(
            that,
            "On the last panel",
            panelTotalNum,
            expectedStates.lastPanel,
            expectedLabels.lastPanel);
    };

    jqUnit.test("Nav buttons - regular", function () {
        jqUnit.expect(38);

        var expectedStates = {
            "startPanel": {
                back: false,
                next: true
            },
            "lastPanel": {
                back: true,
                next: false
            },
            "secondLastPanel": {
                back: true,
                next: true
            },
            "middlePanel": {
                back: true,
                next: true
            }
        };

        var expectedLabels = {
            "startPanel": {
                backLabel: undefined,
                backTooltip: undefined,
                nextLabel: start,
                nextTooltip: startTooltip
            },
            "lastPanel": {
                backLabel: undefined,
                backTooltip: undefined,
                nextLabel: undefined,
                nextTooltip: undefined
            },
            "secondLastPanel": {
                backLabel: back,
                backTooltip: backTooltip,
                nextLabel: finish,
                nextTooltip: finishTooltip
            },
            "middlePanel": {
                backLabel: back,
                backTooltip: backTooltip,
                nextLabel: next,
                nextTooltip: nextTooltip
            }
        };

        gpii.tests.firstDiscovery.navButtons.runTest(expectedStates, expectedLabels);
    });

})(jQuery, fluid);
