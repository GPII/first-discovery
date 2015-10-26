/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.tests.firstDiscovery.nav", {
        gradeNames: ["gpii.firstDiscovery.nav"],
        model: {
            currentPanelNum: 3
        },
        panelTotalNum: 10,
        messageBase: {
            "back": "back",
            "backTooltip": "Select to go back to last step",
            "next": "next",
            "nextTooltip": "Select to go to next step",
            "start": "continue",
            "startTooltip": "Select to continue",
            "finish": "finish",
            "finishTooltip": "Select to finish",
            "stepCountMsg": "Step %currentPanel of %numPanels",
            "panelMsg": "This is %stepCountMsg. %instructions Press 'h' for help."
        }
    });

    jqUnit.test("Test the navigation", function () {
        jqUnit.expect(3);
        var that = gpii.tests.firstDiscovery.nav("#gpiic-tests-nav");
        jqUnit.assertNotNull("The subcomponent \"navButtons\" should have been created", that.navButtons);
        jqUnit.assertNotNull("The subcomponent \"navIcons\" should have been created", that.navIcons);
        jqUnit.assertNotNull("The subcomponent \"stepCount\" should have been created", that.stepCount);
    });

})(jQuery, fluid);
