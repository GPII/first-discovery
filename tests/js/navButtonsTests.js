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

    gpii.tests.verifyStates = function (msg, backButton, nextButton, backDisabled, backVisible, nextDisabled, nextVisible) {
        jqUnit[backDisabled? "assertTrue" : "assertFalse"](msg + " - The back button is disabled", backButton.is(":disabled"));
        jqUnit[backVisible? "assertTrue" : "assertFalse"](msg + " - The back button is hidden", backButton.is(":visible"));
        jqUnit[nextDisabled? "assertTrue" : "assertFalse"](msg + " - The next button is enabled", nextButton.is(":disabled"));
        jqUnit[nextVisible? "assertTrue" : "assertFalse"](msg + " - The next button is shown", nextButton.is(":visible"));
    };

    gpii.tests.verifyButtons = function (that, currentPanelNum) {
        jqUnit.assertEquals("The model value has been updated", currentPanelNum, that.model.currentPanelNum);

        var msg;
        var start = that.options.panelStartNum;
        var end = that.options.panelTotalNum;
        var backButton = that.locate("back");
        var nextButton = that.locate("next");

        if (currentPanelNum === start) {
            msg = "On the start panel";
            gpii.tests.verifyStates(msg, backButton, nextButton, true, false, false, true);
            jqUnit.assertEquals(msg + " - The text on the next button is properly set", that.options.strings.start, nextButton.html());
        }

        if (currentPanelNum > start && currentPanelNum < end) {
            msg = "On a panel in btw the start and the last panels";
            gpii.tests.verifyStates(msg, backButton, nextButton, false, true, false, true);
            jqUnit.assertEquals(msg + " - The text on the back button is properly set", that.options.strings.back, backButton.html());
            jqUnit.assertEquals(msg + " - The text on the next button is properly set", that.options.strings.next, nextButton.html());
        }

        if (currentPanelNum === end) {
            msg = "On the last panel";
            gpii.tests.verifyStates(msg, backButton, nextButton, false, true, false, true);
            jqUnit.assertEquals(msg + " - The text on the back button is properly set", that.options.strings.back, backButton.html());
            jqUnit.assertEquals(msg + " - The text on the next button is properly set", that.options.strings.finish, nextButton.html());
        }
    };

    jqUnit.test("Nav buttons", function () {
        jqUnit.expect(26);

        var that = gpii.firstDiscovery.navButtons(".gpiic-nav", {
            panelTotalNum: 6
        });

        var backButton = that.locate("back");
        var nextButton = that.locate("next");

        that.applier.change("currentPanelNum", 1);
        gpii.tests.verifyButtons(that, 1);

        nextButton.click();
        gpii.tests.verifyButtons(that, 2);

        backButton.click();
        gpii.tests.verifyButtons(that, 1);

        that.applier.change("currentPanelNum", 6);
        gpii.tests.verifyButtons(that, 6);
    });

})(jQuery, fluid);
