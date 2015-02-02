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
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left+35 bottom-20"
            }
        },
        selectors: {
            back: ".gpiic-firstDiscovery-navButtons-back",
            next: ".gpiic-firstDiscovery-navButtons-next"
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
                args: ["{that}.backButtonClicked"]
            },
            "onCreate.bindNext": {
                "this": "{that}.dom.next",
                "method": "click",
                args: ["{that}.nextButtonClicked"]
            }
        },
        invokers: {
            setButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonStates",
                // Calls on "{that}.backTooltip", "{that}.nextTooltip" to force the instantiate of these sub-components
                args: ["{that}", "{that}.backTooltip", "{that}.nextTooltip"]
            },
            setModel: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", "{arguments}.0"]
            },
            backButtonClicked: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", -1]
            },
            nextButtonClicked: {
                funcName: "gpii.firstDiscovery.navButtons.setModel",
                args: ["{that}", 1]
            }
        },
        components: {
            backTooltip: {
                type: "fluid.tooltip",
                container: "{that}.dom.back",
                options: "{navButtons}.options.tooltipOptions"
            },
            nextTooltip: {
                type: "fluid.tooltip",
                container: "{that}.dom.next",
                options: "{navButtons}.options.tooltipOptions"
            }
        }
    });

    gpii.firstDiscovery.navButtons.setButtonStates = function (that, backTooltip, nextTooltip) {
        var currentPanelNum = that.model.currentPanelNum,
            strings = that.options.strings,
            backButton = that.locate("back"),
            nextButton = that.locate("next"),
            isFirstPanel = currentPanelNum === that.options.panelStartNum,
            nextLabel = isFirstPanel ? strings.start : (currentPanelNum === that.options.panelTotalNum ? strings.finish : strings.next);

        backButton.prop("disabled", isFirstPanel);
        backButton.toggle(!isFirstPanel);
        backButton.html(strings.back);
        nextButton.html(nextLabel);
        backTooltip.updateContent(strings.back);
        nextTooltip.updateContent(nextLabel);
    };

    gpii.firstDiscovery.navButtons.setModel = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;

        if (newValue >= that.options.panelStartNum && newValue <= that.options.panelTotalNum) {
            that.applier.change("currentPanelNum", newValue);
        }
    };

})(jQuery, fluid);
