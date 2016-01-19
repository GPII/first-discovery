/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*
     * The nav icon
     */
    fluid.defaults("gpii.firstDiscovery.icon", {
        gradeNames: ["fluid.viewComponent"],
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
        },
        invokers: {
            setIconState: {
                funcName: "gpii.firstDiscovery.icon.setIconState",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    gpii.firstDiscovery.icon.setConfirmedState = function (that, isConfirmed) {
        if (isConfirmed) {
            that.locate("confirmedIndicator").addClass(that.options.styles.show);
        }
    };

    gpii.firstDiscovery.icon.setIconState = function (that, modelPath, panelNum) {
        that.applier.change(modelPath, panelNum === that.options.position);
    };

    /*
     * The navigation icons: the wrapper component to help determine the position of each nav icon.
     */
    fluid.defaults("gpii.firstDiscovery.navIcons", {
        gradeNames: ["fluid.viewComponent"],
        pageSize: 5,
        iconHoles: [2, 8], // a list of all the panel positions which have no nav icons (currently the "welcome" and "congratulations" pages)
        dynamicComponents: {
            icon: {
                createOnEvent: "onCreateIcon",
                type: "gpii.firstDiscovery.icon",
                container: "{arguments}.0",
                options: {
                    position: "{arguments}.1",
                    styles: "{navIcons}.options.styles",
                    listeners: {
                        "{navIcons}.events.onSetConfirmedIcon": {
                            funcName: "{that}.setIconState",
                            args: ["isConfirmed", "{arguments}.0"]
                        },
                        "{navIcons}.events.onSetActiveIcon": {
                            funcName: "{that}.setIconState",
                            args: ["isActive", "{arguments}.0"]
                        }
                    },
                    modelListeners: {
                        "{navIcons}.model.pageNum": {
                            listener: "gpii.firstDiscovery.icon.measure",
                            args: ["{that}", "{navIcons}.applier", "iconWidth"],
                            priority: 10
                        },
                        "{navIcons}.model.currentPanelNum": {
                            listener: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{change}.value", "{change}.oldValue"]
                        }
                    }
                }
            }
        },
        model: {
            pageNum: 0,
            iconWidth: 0,
            visitedPanelNums: []
        },
        modelRelay: {
            source: "currentPanelNum",
            target: "pageNum",
            singleTransform: {
                type: "fluid.transforms.free",
                args: [
                    "{that}.model.currentPanelNum",
                    "{that}.options.pageSize",
                    "{that}.options.iconHoles"
                ],
                func: "gpii.firstDiscovery.navIcons.indexToPage"
            }
        },
        modelListeners: {
            currentPanelNum: {
                funcName: "gpii.firstDiscovery.navIcons.saveVisitedPanelNum",
                args: ["{that}", "{change}.value", "{change}.oldValue"]
            },
            pageNum: {
                listener: "{that}.showIconPage",
                priority: 5
            }
        },
        selectors: {
            icon: ".gpiic-fd-navIcon",
            pager: ".gpii-fd-navIcon-outer"
        },
        events: {
            onCreateIcon: null,
            onSetConfirmedIcon: null,
            onSetActiveIcon: null
        },
        listeners: {
            "onCreate.createIcons": {
                funcName: "gpii.firstDiscovery.navIcons.createIcons"
            },
            "onCreate.setInitialIconState": {
                funcName: "gpii.firstDiscovery.navIcons.setInitialIconState",
                args: ["{that}"],
                priority: "after:createIcons"
            },
            "onCreate.showIconPage": {
                funcName: "{that}.showIconPage",
                priority: "after:createIcons"
            }
        },
        invokers: {
            showIconPage: {
                funcName: "gpii.firstDiscovery.navIcons.showIconPage",
                args: ["{that}.model.pageNum", "{that}.options.pageSize", "{that}.model.iconWidth", "{that}.dom.pager"]
            }
        }
    });

    gpii.firstDiscovery.icon.measure = function (that, applier, field) {
        var width = that.container.outerWidth();
        if (width !== 0) { // avoid storing width of "holes"
            applier.change(field, width);
        }
    };

    gpii.firstDiscovery.navIcons.indexToPage = function (panelNum, pageSize, holes) {
        var pastHoles = 0;
        for (var i = 0; i < holes.length; ++ i) {
            if (panelNum >= holes[i]) {
                ++ pastHoles;
            }
        }
        return Math.floor((panelNum - 1 - pastHoles) / pageSize);
    };

    gpii.firstDiscovery.navIcons.showIconPage = function (pageNum, pageSize, iconWidth, pagerElement) {
        var newLeft = iconWidth * pageNum * pageSize;
        pagerElement.scrollLeft(newLeft);
    };

    gpii.firstDiscovery.navIcons.createIcons = function (that) {
        var icons = that.locate("icon");
        fluid.each(icons, function (element, index) {
            that.events.onCreateIcon.fire(element, index + 1);
        });
    };

    gpii.firstDiscovery.navIcons.updateIconModel = function (icon, currentPanelNum, prevPanelNum) {
        var position = icon.options.position;
        icon.applier.change("isActive", currentPanelNum === position);
        icon.applier.change("isConfirmed", prevPanelNum === position && currentPanelNum > prevPanelNum);
    };

    gpii.firstDiscovery.navIcons.saveVisitedPanelNum = function (that, currentPanelNum, prevPanelNum) {
        var visitedPanelNums = that.model.visitedPanelNums;
        if (currentPanelNum > prevPanelNum && $.inArray(prevPanelNum, visitedPanelNums) === -1 && $.inArray(prevPanelNum, that.options.iconHoles)) {
            // Cannot fire the change request directly on visitedPanelNums due to http://issues.fluidproject.org/browse/FLUID-3504
            that.applier.change("visitedPanelNums." + visitedPanelNums.length, prevPanelNum);
        }
    };

    gpii.firstDiscovery.navIcons.setInitialIconState = function (that) {
        fluid.each(that.model.visitedPanelNums, function (panelNum) {
            that.events.onSetConfirmedIcon.fire(panelNum);
        });
        that.events.onSetActiveIcon.fire(that.model.currentPanelNum);
    };

})(jQuery, fluid);
