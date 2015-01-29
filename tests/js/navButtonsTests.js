/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    jqUnit.test("Nav buttons", function () {
        jqUnit.expect(11);

        var that = gpii.firstDiscovery.navButtons(".gpiic-nav", {
            panelTotalNum: 6
        });

        that.applier.change("currentPanelNum", 1);
        jqUnit.assertFalse("On the start panel - The back button is hidden", that.locate("back").is(":visible"));
        jqUnit.assertTrue("On the start panel - The next button is shown", that.locate("next").is(":visible"));
        jqUnit.assertEquals("On the start panel - The text on the next button is properly set", that.options.strings.start, that.locate("next").html());

        that.applier.change("currentPanelNum", 3);
        jqUnit.assertTrue("On a panel in btw the start and the last panels - The back button is shown", that.locate("back").is(":visible"));
        jqUnit.assertTrue("On a panel in btw the start and the last panels - The next button is shown", that.locate("next").is(":visible"));
        jqUnit.assertEquals("On a panel in btw the start and the last panels - The text on the back button is properly set", that.options.strings.back, that.locate("back").html());
        jqUnit.assertEquals("On a panel in btw the start and the last panels - The text on the next button is properly set", that.options.strings.next, that.locate("next").html());

        that.applier.change("currentPanelNum", 6);
        jqUnit.assertTrue("On the last panel - The back button is shown", that.locate("back").is(":visible"));
        jqUnit.assertTrue("On the last panel - The next button is shown", that.locate("next").is(":visible"));
        jqUnit.assertEquals("On the last panel - The text on the back button is properly set", that.options.strings.back, that.locate("back").html());
        jqUnit.assertEquals("On the last panel - The text on the next button is properly set", that.options.strings.finish, that.locate("next").html());
    });

})(jQuery, fluid);
