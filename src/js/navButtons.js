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
        gradeNames: ["fluid.viewRelayComponent", "gpii.firstDiscovery.attachTooltip", "gpii.firstDiscovery.msgLookup", "autoInit"],
        panelTotalNum: null,   // Must be supplied by integrators
        panelStartNum: 1,
        tooltipContentMap: {
            "back": "backTooltip",
            "next": "nextTooltip"
        },
        selectors: {
            back: "#gpiic-fd-navButtons-back",
            backLabel: ".gpiic-fd-navButtons-backLabel",
            next: "#gpiic-fd-navButtons-next",
            nextLabel: ".gpiic-fd-navButtons-nextLabel"
        },
        styles: {
            show: "gpii-fd-show"
        },
        modelRelay: {
            target: "currentPanelNum",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.currentPanelNum",
                min: "{that}.options.panelStartNum",
                max: "{that}.options.panelTotalNum"
            }
        },
        modelListeners: {
            currentPanelNum: {
                listener: "{that}.setButtonStates",
                excludeSource: "init"
            }
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
            },
            "onCreate.setButtonStates": "{that}.setButtonStates"
        },
        invokers: {
            setButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonStates",
                args: ["{that}"]
            },
            adjustCurrentPanelNum: {
                funcName: "gpii.firstDiscovery.navButtons.adjustCurrentPanelNum",
                args: ["{that}", "{arguments}.0"]
            },
            backButtonClicked: {
                funcName: "gpii.firstDiscovery.navButtons.adjustCurrentPanelNum",
                args: ["{that}", -1]
            },
            nextButtonClicked: {
                funcName: "gpii.firstDiscovery.navButtons.adjustCurrentPanelNum",
                args: ["{that}", 1]
            }
        }
    });

    gpii.firstDiscovery.navButtons.indexToDisposition = function (currentPanelNum, panelStartNum, panelTotalNum) {
        return currentPanelNum === panelStartNum ? 0 : (currentPanelNum < panelTotalNum - 1 ? 1 : 2);
    };

    gpii.firstDiscovery.navButtons.setButtonStates = function (that) {
        var currentPanelNum = that.model.currentPanelNum,
            backButton = that.locate("back"),
            nextButton = that.locate("next"),
            nextButtonId = fluid.allocateSimpleId(nextButton),
            showSelector = that.options.styles.show,
            isFirstPanel = currentPanelNum === that.options.panelStartNum,
            isLastPanel = currentPanelNum === that.options.panelTotalNum,
            disposition = gpii.firstDiscovery.navButtons.indexToDisposition(currentPanelNum, that.options.panelStartNum, that.options.panelTotalNum),
            nextLabel = that.msgResolver.resolve(["start", "next", "finish"][disposition]),
            nextTooltipContent = that.msgResolver.resolve(["startTooltip", "nextTooltip", "finishTooltip"][disposition]);

        // Must close the tooltip before disabling buttons because the tooltip is defined not to show for the disabled DOM elements, closing
        // the tooltip after the disabling would cause the tooltip component not able to find the target.
        if (isFirstPanel || isLastPanel) {
            that.tooltip.close();  // Close the existing tooltip otherwise it will linger after the button is hidden
        }

        backButton.prop("disabled", isFirstPanel);
        backButton.toggleClass(showSelector, !isFirstPanel);
        that.locate("backLabel").html(that.msgResolver.resolve("back"));
        that.locate("nextLabel").html(nextLabel);
        nextButton.toggleClass(showSelector, !isLastPanel);
        nextButton.prop("disabled", isLastPanel);

        that.tooltip.applier.change("idToContent." + nextButtonId, nextTooltipContent);
    };

    gpii.firstDiscovery.navButtons.adjustCurrentPanelNum = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;
        that.applier.change("currentPanelNum", newValue);
    };

})(jQuery, fluid);
