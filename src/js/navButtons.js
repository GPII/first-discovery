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
        gradeNames: ["fluid.viewComponent", "gpii.firstDiscovery.attachTooltip", "autoInit"],
        panelTotalNum: null,   // Must be supplied by integrators
        panelStartNum: 1,
        tooltipContentMap: {
            "back": "back",
            "next": "next"
        },
        selectors: {
            back: "#gpiic-fd-navButtons-back",
            next: "#gpiic-fd-navButtons-next"
        },
        styles: {
            show: "gpii-fd-show"
        },
        strings: {
            back: "Back",
            next: "Next",
            start: "Let's start",
            finish: "Finish"
        },
        // TODO: Uncomment this block when switching to use relay components.
        // modelRelay: {
        //     target: "currentPanelNum",
        //     singleTransform: {
        //         type: "fluid.transforms.limitRange",
        //         input: "{that}.model.currentPanelNum",
        //         min: "{that}.options.panelStartNum",
        //         max: "{that}.options.panelTotalNum"
        //     }
        // },
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
            },
            // TODO: this listener can be removed when switching to use relay components.
            "onCreate.setInitialButtonStates": "{that}.setButtonStates"
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

    gpii.firstDiscovery.navButtons.setButtonStates = function (that) {
        var currentPanelNum = that.model.currentPanelNum,
            strings = that.options.strings,
            backButton = that.locate("back"),
            nextButton = that.locate("next"),
            backButtonId = fluid.allocateSimpleId(backButton),
            nextButtonId = fluid.allocateSimpleId(nextButton),
            showSelector = that.options.styles.show,
            isFirstPanel = currentPanelNum === that.options.panelStartNum,
            nextLabel = isFirstPanel ? strings.start : (currentPanelNum === that.options.panelTotalNum ? strings.finish : strings.next);

        backButton.prop("disabled", isFirstPanel);
        backButton.toggleClass(showSelector, !isFirstPanel);
        backButton.html(strings.back);
        nextButton.html(nextLabel);
        nextButton.addClass(showSelector);
        if (isFirstPanel) {
            that.tooltip.close();  // Close the existing tooltip for the back button otherwise it will linger after the back button becomes hidden
            that.tooltip.applier.fireChangeRequest({path: "idToContent." + backButtonId, type: "DELETE"});
        } else {
            that.tooltip.applier.change("idToContent." + backButtonId, strings.back);
        }
        that.tooltip.applier.change("idToContent." + nextButtonId, nextLabel);
    };

    gpii.firstDiscovery.navButtons.adjustCurrentPanelNum = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;

        // TODO: When switching to use relay components, the if condition can be replaced by the "limitRange" relay at line 50-58
        if (newValue >= that.options.panelStartNum && newValue <= that.options.panelTotalNum) {
            that.applier.change("currentPanelNum", newValue);
        }
    };

})(jQuery, fluid);
