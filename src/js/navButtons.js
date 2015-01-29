/*

Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*
     * The back and next navigation buttons
     */
    fluid.defaults("gpii.firstDiscovery.navButtons", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        panelTotalNum: null,   // Must be supplied by integrators
        panelStartNum: 1,
        selectors: {
            back: ".gpiic-back",
            next: ".gpiic-next"
        },
        strings: {
            back: "Back",
            next: "Next",
            start: "Let's start",
            finish: "Finish"
        },
        modelListeners: {
            currentPanelNum: "{that}.setButtonStates"
        },
        invokers: {
            setButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonStates",
                args: ["{that}.model.currentPanelNum", "{that}.options.panelStartNum", "{that}.options.panelTotalNum", "{that}.dom.back", "{that}.dom.next", "{that}.options.strings"]
            }
        }
    });

    gpii.firstDiscovery.navButtons.setButtonStates = function (currentPanelNum, panelStartNum, panelTotalNum, backButton, nextButton, strings) {
        if (currentPanelNum === panelStartNum) {
            backButton.hide();
            nextButton.show();
            nextButton.html(strings.start);
        } else {
            backButton.show();
            nextButton.show();
            backButton.html(strings.back);
            nextButton.html(currentPanelNum === panelTotalNum ? strings.finish : strings.next);
        }
    };

})(jQuery, fluid);
