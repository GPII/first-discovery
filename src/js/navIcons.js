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
     * The navigation icons
     */
    fluid.defaults("gpii.firstDiscovery.navIcons", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            icon: ".gpiic-fd-navIcon",
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
        listeners: {
            // TODO: this listener can be removed when switching to use relay components.
            "onCreate.setInitialIconStates": {
                listener: "{that}.setIconStates",
                args: [null]
            }
        },
        invokers: {
            setIconStates: {
                funcName: "gpii.firstDiscovery.navIcons.setIconStates",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    gpii.firstDiscovery.navIcons.setIconStates = function (that, prevPanelNum) {
        var currentPanelNum = that.model.currentPanelNum,
            icons = that.locate("icon"),
            activeIcon = $(icons[currentPanelNum - 1]),
            activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            activeIndicator = that.options.selectors.activeIndicator,
            doneIndicator = that.options.selectors.doneIndicator;

        icons.removeClass(activeCss);
        activeIcon.addClass(activeCss);
        icons.find(activeIndicator).removeClass(showCss);
        activeIcon.find(activeIndicator).addClass(showCss);

        if (prevPanelNum) {
            $(icons[prevPanelNum - 1]).find(doneIndicator).addClass(showCss);
        }
    };

})(jQuery, fluid);
