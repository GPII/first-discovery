/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.indicators");

    gpii.tests.firstDiscovery.indicators.verifyLabels = function (msg, that, labels) {
        var previewButton = that.locate("preview"),
            previewButtonLabel = that.locate("previewLabel"),
            previewButtonId = previewButton.attr("id"),
            warningButton = that.locate("warning"),
            warningButtonLabel = that.locate("warningLabel"),
            warningButtonId = warningButton.attr("id");

        if (labels.previewLabel) {
            jqUnit.assertEquals(msg + " - The text on the preview button is properly set", labels.previewLabel, previewButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the preview button is properly set", labels.previewTooltip, that.tooltip.model.idToContent[previewButtonId]);
        }

        if (labels.warningLabel) {
            jqUnit.assertEquals(msg + " - The text on the warning button is properly set", labels.warningLabel, warningButtonLabel.html());
            jqUnit.assertEquals(msg + " - The tooltip content for the warning button is properly set", labels.warningTooltip, that.tooltip.model.idToContent[warningButtonId]);
        }
    };

    gpii.tests.firstDiscovery.indicators.verifyButtons = function (that, msg, expectedLabels) {
        gpii.tests.firstDiscovery.indicators.verifyLabels(msg, that, expectedLabels);
    };

    var preview = "Preview",
        previewTooltip = "This is the preview.",
        warning = "This is not a live website!",
        warningTooltip = "This is not a live website!";

    gpii.tests.firstDiscovery.indicators.runTest = function (expectedLabels, gradeNames) {

        var that = gpii.firstDiscovery.indicators("#gpiic-tests-previewIndicator", {
            gradeNames: gradeNames,
            messageBase: {
                "preview": preview,
                "previewTooltip": previewTooltip,
                "warning": warning,
                "warningTooltip": warningTooltip
            }
        });

        var previewButton = that.locate("preview"),
            warningButton = that.locate("warning");

        jqUnit.assertNotUndefined("The model for tooltip has been populated", that.tooltip.model.idToContent);

        // Clicking the preview button shows the tool tip.
        previewButton.click();
        gpii.tests.firstDiscovery.indicators.verifyButtons(
            that,
            "On the top of the preview",
            expectedLabels.previewPanel);

        // Clicking the warning button shows the tool tip.
        warningButton.click();
        gpii.tests.firstDiscovery.indicators.verifyButtons(
            that,
            "On the bottom of the preview",
            expectedLabels.previewPanel);
    };

    jqUnit.test("Nav buttons - regular", function () {
        jqUnit.expect(9);
        
        var expectedLabels = {
            "previewPanel": {
                previewLabel: preview,
                previewTooltip: previewTooltip,
                warningLabel: warning,
                warningTooltip: warningTooltip
            }
        };

        gpii.tests.firstDiscovery.indicators.runTest(expectedLabels);
    });

})(jQuery, fluid);
