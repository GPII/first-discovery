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
        gradeNames: ["fluid.viewComponent", "autoInit"],
        position: null,  // must be supplied by integrators
        selectors: {
            activeIndicator: ".gpiic-fd-activeIndicator",
            doneIndicator: ".gpiic-fd-doneIndicator"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        modelListeners: {
            "isActive.setActiveState": {
                listener: "{that}.setActiveState",
                args: ["{change}.value"]
            },
            "isVisited.setVisitedState": {
                listener: "{that}.setVisitedState",
                args: ["{change}.value"]
            }
        },
        invokers: {
            setActiveState: {
                funcName: "gpii.firstDiscovery.icon.setActiveState",
                args: ["{that}", "{arguments}.0"]
            },
            setVisitedState: {
                funcName: "gpii.firstDiscovery.icon.setVisitedState",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    gpii.firstDiscovery.icon.setActiveState = function (that, isActive) {
        var activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            activeIndicator = that.locate("activeIndicator"),
            action = isActive ? "addClass" : "removeClass";

        that.container[action](activeCss);
        activeIndicator[action](showCss);
    };

    gpii.firstDiscovery.icon.setVisitedState = function (that, isVisited) {
        var showCss = that.options.styles.show,
            doneIndicator = that.locate("doneIndicator");

        if (isVisited) {
            doneIndicator.addClass(showCss);
        }
    };

    /*
     * The navigation icons: the wrapper component to help determine the position of each nav icon.
     */
    fluid.defaults("gpii.firstDiscovery.navIcons", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        dynamicComponents: {
            icon: {
                createOnEvent: "onCreateIcon",
                type: "gpii.firstDiscovery.icon",
                container: "{arguments}.0",
                options: {
                    position: "{arguments}.1",
                    styles: "{navIcons}.options.styles",
                    modelListeners: {
                        "{navIcons}.model.currentPanelNum": {
                            listener: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{change}.value", "{change}.oldValue"]
                        }
                    },
                    // This listeners block can be removed when switching to use model relay
                    listeners: {
                        "onCreate.updateIconModel": {
                            listener: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{navIcons}.model.currentPanelNum", null]
                        }
                    }
                }
            }
        },
        selectors: {
            icon: ".gpiic-fd-navIcon"
        },
        events: {
            onCreateIcon: null
        },
        listeners: {
            "onCreate.createIcons": "gpii.firstDiscovery.navIcons.createIcons"
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
        icon.applier.change("isActive", currentPanelNum === position ? true : false);
        icon.applier.change("isVisited", prevPanelNum === position ? true : false);
    };

})(jQuery, fluid);
