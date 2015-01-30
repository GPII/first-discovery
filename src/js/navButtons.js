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
        listeners: {
            "onCreate.bindBack": {
                "this": "{that}.dom.back",
                "method": "click",
                args: ["{that}.onBackClick"]
            },
            "onCreate.bindNext": {
                "this": "{that}.dom.next",
                "method": "click",
                args: ["{that}.onNextClick"]
            }
        },
        invokers: {
            setButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonStates",
                args: ["{that}.model.currentPanelNum", "{that}.options.panelStartNum", "{that}.options.panelTotalNum", "{that}.dom.back", "{that}.dom.next", "{that}.options.strings"]
            },
            setModel: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", "{arguments}.0"]
            },
            onBackClick: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", -1]
            },
            onNextClick: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", 1]
            }
        }
    });

    gpii.firstDiscovery.navButtons.setButtonStates = function (currentPanelNum, panelStartNum, panelTotalNum, backButton, nextButton, strings) {
        if (currentPanelNum === panelStartNum) {
            backButton.prop("disabled", true);
            backButton.hide();
            nextButton.show();
            nextButton.html(strings.start);
        } else {
            backButton.show();
            backButton.prop("disabled", false);
            nextButton.show();
            backButton.html(strings.back);
            nextButton.html(currentPanelNum === panelTotalNum ? strings.finish : strings.next);
        }
    };

    gpii.firstDiscovery.navButtons.setModel = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;

        if (newValue >= that.options.panelStartNum && newValue <= that.options.panelTotalNum) {
            that.applier.change("currentPanelNum", newValue);
        }
    };

})(jQuery, fluid);
