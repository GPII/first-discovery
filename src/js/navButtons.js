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
            back: "#gpiic-back",
            next: "#gpiic-next"
        },
        strings: {
            back: "Back",
            next: "Next",
            start: "Let's start",
            finish: "Finish"
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
                exclude: "init"
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
            }
        },
        invokers: {
            setButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonStates",
                // Calls on "{that}.tooltip" to force the instantiate of this sub-components
                args: ["{that}", "{that}.tooltip"]
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
        },
        components: {
            tooltip: {
                type: "fluid.tooltip",
                container: "{navButtons}.container",
                options: {
                    expander: {
                        funcName: "gpii.firstDiscovery.navButtons.getTooltipOptions",
                        args: ["{navButtons}"]
                    }
                }
            }
        }
    });

    gpii.firstDiscovery.navButtons.getTooltipOptions = function (that) {
        that.backButtonId = fluid.allocateSimpleId(that.locate("back"));
        that.nextButtonId = fluid.allocateSimpleId(that.locate("next"));

        var idToContent = {};
        idToContent[that.backButtonId] = that.options.strings.back;
        idToContent[that.nextButtonId] = that.options.strings.next;

        return $.extend(true, {}, that.options.tooltipOptions, {
            model: {
                idToContent: idToContent
            }
        });
    };

    gpii.firstDiscovery.navButtons.setButtonStates = function (that, tooltip) {
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
        tooltip.applier.change("idToContent." + that.backButtonId, strings.back);
        tooltip.applier.change("idToContent." + that.nextButtonId, nextLabel);
    };

    gpii.firstDiscovery.navButtons.adjustCurrentPanelNum = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;
        that.applier.change("currentPanelNum", newValue);
    };

})(jQuery, fluid);
