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
     * The nav icon
     */
    fluid.defaults("gpii.firstDiscovery.icon", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        position: null,  // must be supplied by integrators
        selectors: {
            confirmedIndicator: ".gpiic-fd-confirmedIndicator"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        modelListeners: {
            "isActive": {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.active", "{change}.value"]
            },
            "isConfirmed": {
                listener: "gpii.firstDiscovery.icon.setConfirmedState",
                args: ["{that}", "{change}.value"]
            }
        }
    });

    gpii.firstDiscovery.icon.setConfirmedState = function (that, isConfirmed) {
        if (isConfirmed) {
            that.locate("confirmedIndicator").addClass(that.options.styles.show);
        }
    };

    /*
     * The navigation icons: the wrapper component to help determine the position of each nav icon.
     */
    fluid.defaults("gpii.firstDiscovery.navIcons", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        model: {
            visitedPanelNums: []
        },
        dynamicComponents: {
            icon: {
                createOnEvent: "onCreateIcon",
                type: "gpii.firstDiscovery.icon",
                container: "{arguments}.0",
                options: {
                    position: "{arguments}.1",
                    styles: "{navIcons}.options.styles",
                    listeners: {
                        "{navIcons}.events.onSetIconState": {
                            funcName: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{arguments}.0", "{arguments}.1"]
                        }
                    }
                }
            }
        },
        modelListeners: {
            currentPanelNum: [{
                funcName: "gpii.firstDiscovery.navIcons.saveVisitedPanelNum",
                args: ["{that}", "{change}.value", "{change}.oldValue"]
            }, {
                funcName: "{that}.events.onSetIconState.fire",
                args: ["{change}.value", "{change}.oldValue"]
            }]
        },
        selectors: {
            icon: ".gpiic-fd-navIcon"
        },
        events: {
            onCreateIcon: null,
            onSetIconState: null
        },
        listeners: {
            "onCreate.createIcons": {
                funcName: "gpii.firstDiscovery.navIcons.createIcons",
                priority: 3
            },
            "onCreate.setInitialIconState": {
                funcName: "gpii.firstDiscovery.navIcons.setInitialIconState",
                args: ["{that}"],
                priority: 2
            },
            "onCreate.setInitialActiveState": {
                funcName: "{that}.events.onSetIconState.fire",
                args: ["{that}.model.currentPanelNum", 0],
                priority: 1
            }
        }
    });

    gpii.firstDiscovery.navIcons.createIcons = function (that) {
        var icons = that.locate("icon");
        fluid.each(icons, function (element, index) {
            that.events.onCreateIcon.fire(element, index + 1);
        });
    };

    gpii.firstDiscovery.navIcons.updateIconModel = function (icon, currentPanelNum, prevPanelNum) {
        var position = icon.options.position;
        icon.applier.change("isActive", currentPanelNum === position);
        // The part before "||" is to set confirmed state at the page reload. The part after is to set
        // when users navigate thru panels.
        icon.applier.change("isConfirmed", typeof (prevPanelNum) === "undefined" && currentPanelNum === position || prevPanelNum === position && currentPanelNum > prevPanelNum);
    };

    gpii.firstDiscovery.navIcons.saveVisitedPanelNum = function (that, currentPanelNum, prevPanelNum) {
        var visitedPanelNums = that.model.visitedPanelNums;
        if (currentPanelNum > prevPanelNum && $.inArray(prevPanelNum, visitedPanelNums) === -1) {
            // Cannot fire the change request directly on visitedPanelNums due to this issue: http://issues.fluidproject.org/browse/FLUID-3504
            that.applier.change("visitedPanelNums." + visitedPanelNums.length, prevPanelNum);
        }
    };

    gpii.firstDiscovery.navIcons.setInitialIconState = function (that) {
        if (that.model.visitedPanelNums.length === 0) {
            return;
        }
        fluid.each(that.model.visitedPanelNums, function (panelNum) {
            that.events.onSetIconState.fire(panelNum);
        });
    };

})(jQuery, fluid);
