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
            doneIndicator: ".gpiic-fd-doneIndicator"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        modelListeners: {
            "isActive.setState": {
                listener: "gpii.firstDiscovery.icon.setState",
                args: ["{that}", "{change}.value", "{change}.oldValue"]
            }
        }
    });

    gpii.firstDiscovery.icon.setState = function (that, isActive, isActivePrev) {
        that.container.toggleClass(that.options.styles.active, isActive);

        if (isActivePrev && !isActive) {
            that.locate("doneIndicator").addClass(that.options.styles.show);
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
                            args: ["{that}", "{change}.value"]
                        }
                    },
                    // TODO: This listeners block can be removed when switching to use model relay
                    listeners: {
                        "onCreate.updateIconModel": {
                            listener: "gpii.firstDiscovery.navIcons.updateIconModel",
                            args: ["{that}", "{navIcons}.model.currentPanelNum"]
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

    gpii.firstDiscovery.navIcons.updateIconModel = function (icon, currentPanelNum) {
        var position = icon.options.position;
        icon.applier.change("isActive", currentPanelNum === position);
    };

})(jQuery, fluid);
