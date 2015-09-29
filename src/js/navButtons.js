/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery/raw/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*
     * The back and next navigation buttons
     */
    fluid.defaults("gpii.firstDiscovery.navButtons", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip", "fluid.viewComponent"],
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
        modelRelay: [{
            target: "currentPanelNum",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.currentPanelNum",
                min: "{that}.options.panelStartNum",
                max: "{that}.options.panelTotalNum"
            }
        }, {
            target: "isFirstPanel",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.currentPanelNum",
                operator: "===",
                right: "{that}.options.panelStartNum"
            }
        }, {
            target: "isLastPanel",
            singleTransform: {
                type: "fluid.transforms.binaryOp",
                left: "{that}.model.currentPanelNum",
                operator: "===",
                right: "{that}.options.panelTotalNum"
            }
        }],
        modelListeners: {
            currentPanelNum: {
                listener: "{that}.setButtonLabels",
                excludeSource: "init"
            },
            isFirstPanel: [{
                listener: "{that}.tooltip.close",
                excludeSource: "init",
                priority: 10
            }, {
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.back", "{change}.value"],
                excludeSource: "init",
                priority: 5
            }],
            isLastPanel: [{
                listener: "{that}.tooltip.close",
                excludeSource: "init",
                priority: 10
            }, {
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.next", "{change}.value"],
                excludeSource: "init",
                priority: 5
            }]
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
            "onCreate.setButtonLabels": "{that}.setButtonLabels",
            "onCreate.toggleBackButtonStates": {
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.back", "{that}.model.isFirstPanel"]
            },
            "onCreate.toggleNextButtonStates": {
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.next", "{that}.model.isLastPanel"]
            }
        },
        invokers: {
            setButtonLabels: {
                funcName: "gpii.firstDiscovery.navButtons.setButtonLabels",
                args: ["{that}"]
            },
            toggleButtonStates: {
                funcName: "gpii.firstDiscovery.navButtons.toggleButtonStates",
                args: ["{arguments}.0", "{arguments}.1", "{that}.options.styles.show"]
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
            },
            indexToDisposition: {
                funcName: "gpii.firstDiscovery.navButtons.indexToDisposition",
                args: ["{that}.model.currentPanelNum", "{that}.options.panelStartNum", "{that}.options.panelTotalNum"]
            }
        }
    });

    gpii.firstDiscovery.navButtons.indexToDisposition = function (currentPanelNum, panelStartNum, panelTotalNum) {
        return currentPanelNum === panelStartNum ? 0 : (currentPanelNum < panelTotalNum - 1 ? 1 : 2);
    };

    gpii.firstDiscovery.navButtons.setButtonLabels = function (that) {
        var nextButton = that.locate("next"),
            nextButtonId = fluid.allocateSimpleId(nextButton),
            disposition = that.indexToDisposition(),
            nextLabel = that.msgResolver.resolve(["start", "next", "finish"][disposition]),
            nextTooltipContent = that.msgResolver.resolve(["startTooltip", "nextTooltip", "finishTooltip"][disposition]);

        that.locate("backLabel").html(that.msgResolver.resolve("back"));
        that.locate("nextLabel").html(nextLabel);

        that.tooltip.applier.change("idToContent." + nextButtonId, nextTooltipContent);
    };

    gpii.firstDiscovery.navButtons.toggleButtonStates = function (element, disabled, showSelector) {
        element.prop("disabled", disabled);
        element.toggleClass(showSelector, !disabled);
    };

    gpii.firstDiscovery.navButtons.adjustCurrentPanelNum = function (that, toChange) {
        var newValue = that.model.currentPanelNum + toChange;
        that.applier.change("currentPanelNum", newValue);
    };

    // A grade component for integrating the first discovery tool and the preferences server.
    // It overrides some definitions on "gpii.firstDiscovery.navButtons"
    fluid.defaults("gpii.firstDiscovery.navButtons.prefsServerIntegration", {
        gradeNames: ["fluid.modelComponent"],
        invokers: {
            indexToDisposition: {
                funcName: "gpii.firstDiscovery.navButtons.prefsServerIntegration.indexToDisposition",
                args: ["{that}.model.currentPanelNum", "{that}.options.panelStartNum", "{that}.options.panelTotalNum"]
            }
        },
        modelListeners: {
            isLastPanel: [{
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.next", false],
                excludeSource: "init",
                priority: 3
            }]
        },
        listeners: {
            "onCreate.toggleNextButtonStates": {
                listener: "{that}.toggleButtonStates",
                args: ["{that}.dom.next", false]
            }
        }
    });

    gpii.firstDiscovery.navButtons.prefsServerIntegration.indexToDisposition = function (currentPanelNum, panelStartNum, panelTotalNum) {
        return currentPanelNum === panelStartNum ? 0 : (currentPanelNum < panelTotalNum ? 1 : 2);
    };

})(jQuery, fluid);
