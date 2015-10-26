/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.keyboard");

    fluid.defaults("gpii.firstDiscovery.keyboard.stickyKeysAdjuster", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip", "fluid.viewComponent"],
        selectors: {
            description: ".gpiic-fd-keyboard-stickyKeysAdjuster-desc",
            tryButton: ".gpiic-fd-keyboard-stickyKeysAdjuster-try",
            accommodation: ".gpiic-fd-keyboard-stickyKeysAdjuster-accommodation",
            accommodationInstr: ".gpiic-fd-keyboard-stickyKeysAdjuster-accommodationInstr",
            accommodationName: ".gpiic-fd-keyboard-stickyKeysAdjuster-accommodationName",
            accommodationState: ".gpiic-fd-keyboard-stickyKeysAdjuster-accommodationState",
            accommodationToggle: ".gpiic-fd-keyboard-stickyKeysAdjuster-accommodationToggle"
        },
        tooltipContentMap: {
            tryButton: "tryTooltip",
            accommodationToggle: "turnOnTooltip"
        },
        model: {
            tryAccommodation: false
            // stickyKeysEnabled: boolean
        },
        modelRelay: {
            source: "tryAccommodation",
            target: "stickyKeysEnabled",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        },
        modelListeners: {
            tryAccommodation: {
                listener: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.tryAccommodationToggle",
                args: ["{that}", "{change}.value"]
            },
            stickyKeysEnabled: [{
                listener: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.displayState",
                args: ["{that}", "{change}.value"]
            }, {
                listener: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.updateTooltipText",
                args: ["{that}", "{tooltip}", "{change}.value"]
            }]
        },
        listeners: {
            "onCreate.setText": {
                listener: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.renderText",
                args: ["{that}"]
            },
            "onCreate.bindTry": {
                "this": "{that}.dom.tryButton",
                "method": "click",
                "args": ["{that}.toggleTry"]
            },
            "onCreate.bindToggle": {
                "this": "{that}.dom.accommodationToggle",
                "method": "click",
                "args": ["{that}.toggleStickyKeys"]
            }
        },
        invokers: {
            toggleStickyKeys: {
                funcName: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.toggleState",
                args: ["{that}", "stickyKeysEnabled"]
            },
            toggleTry: {
                funcName: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.toggleState",
                args: ["{that}", "tryAccommodation"]
            }
        }
    });

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.renderText = function (that) {
        var resolveFn = that.msgResolver.resolve;

        that.locate("accommodationInstr").text(resolveFn("stickyKeysAccomInstr"));
        that.locate("description").html(resolveFn("stickyKeysInstructions"));
        that.locate("tryButton").text(resolveFn("try"));
        that.locate("accommodationName").text(resolveFn("stickyKeys"));
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.tryAccommodationToggle = function (that, state) {
        that.locate("tryButton").toggle(!state);
        that.locate("accommodation").toggle(state);
        // Close the tooltip for "try it" button otherwise it will linger after the button is hidden
        if (state && that.tooltip) {
            that.tooltip.close();
        }
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.displayState = function (that, state) {
        var stateText = that.msgResolver.resolve(state ? "on" : "off");
        var buttonText = that.msgResolver.resolve(state ? "turnOff" : "turnOn");
        that.locate("accommodationState").text(stateText);
        that.locate("accommodationToggle").text(buttonText);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.updateTooltipText = function (that, tooltip, state) {
        var tooltipText = that.msgResolver.resolve(state ? "turnOffTooltip" : "turnOnTooltip");
        tooltip.applier.change("idToContent." + fluid.allocateSimpleId(that.locate("accommodationToggle")), tooltipText);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.toggleState = function (that, path) {
        that.applier.change(path, !fluid.get(that.model, path));
    };

})(jQuery, fluid);
