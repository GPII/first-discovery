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
            currentPanelNum: {
                listener: "{that}.setIconStates",
                args: ["{change}.oldValue"]
            }
        },
        invokers: {
            setIconStates: {
                funcName: "gpii.firstDiscovery.icon.setIconStates",
                args: ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            // TODO: this listener can be removed when switching to use relay components.
            "onCreate.setIconStates": {
                listener: "{that}.setIconStates",
                args: [null]
            }
        }
    });

    gpii.firstDiscovery.icon.setIconStates = function (that, prevPanelNum) {
        var currentPanelNum = that.model.currentPanelNum,
            position = that.options.position,
            activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            activeIndicator = that.locate("activeIndicator"),
            doneIndicator = that.locate("doneIndicator");

        if (currentPanelNum === position) {
            that.container.addClass(activeCss);
            activeIndicator.addClass(showCss);
        } else {
            that.container.removeClass(activeCss);
            activeIndicator.removeClass(showCss);
        }

        if (position === prevPanelNum) {
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
                    // TODO: when switching to use relay components, the lines below to share applier can be removed
                    members: {
                        applier: "{navIcons}.applier"
                    },
                    // TODO: when switching to use relay components, rather than sharing the entire model, only the needed model paths need to be shared
                    model: "{navIcons}.model",
                    styles: "{navIcons}.options.styles",
                    position: "{arguments}.1"
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

})(jQuery, fluid);
