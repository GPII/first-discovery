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

    fluid.registerNamespace("gpii.firstDiscovery.keyboard");

    fluid.defaults("gpii.firstDiscovery.keyboard.stickyKeys", {
        gradeNames: ["fluid.viewRelayComponent", "gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip", "autoInit"],
        selectors: {
            description: ".gpiic-fd-keyboard-stickyKeys-desc",
            tryButton: ".gpiic-fd-keyboard-stickyKeys-try",
            accomodation: ".gpiic-fd-keyboard-stickyKeys-accomodation",
            accomodationName: ".gpiic-fd-keyboard-stickyKeys-accomodationName",
            accomodationState: ".gpiic-fd-keyboard-stickyKeys-accomodationState",
            accomodationToggle: ".gpiic-fd-keyboard-stickyKeys-accomodationToggle"
        },
        tooltipContentMap: {
            tryButton: "tryTooltip",
            accomodationToggle: "turnOnTooltip"
        },
        model: {
            tryAccomodation: false,
            stickyKeysEnabled: false
        },
        modelListeners: {
            tryAccomodation: {
                listener: "gpii.firstDiscovery.keyboard.stickyKeys.tryAccomodationToggle",
                args: ["{that}", "{change}.value"]
            },
            stickyKeysEnabled: {
                listener: "gpii.firstDiscovery.keyboard.stickyKeys.displayState",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.setText": {
                listener: "gpii.firstDiscovery.keyboard.stickyKeys.renderText",
                args: ["{that}"]
            },
            "onCreate.bindTry": {
                "this": "{that}.dom.tryButton",
                "method": "click",
                "args": ["{that}.toggleTry"]
            },
            "onCreate.bindToggle": {
                "this": "{that}.dom.accomodationToggle",
                "method": "click",
                "args": ["{that}.toggleStickyKeys"]
            }
        },
        invokers: {
            toggleStickyKeys: {
                funcName: "gpii.firstDiscovery.keyboard.stickyKeys.toggleState",
                args: ["{that}", "stickyKeysEnabled"]
            },
            toggleTry: {
                funcName: "gpii.firstDiscovery.keyboard.stickyKeys.toggleState",
                args: ["{that}", "tryAccomodation"]
            }
        }
    });

    gpii.firstDiscovery.keyboard.stickyKeys.renderText = function (that) {
        var resolveFn = that.msgResolver.resolve;

        that.locate("description").html(resolveFn("stickyKeysInstructions"));
        that.locate("tryButton").text(resolveFn("try"));
        that.locate("accomodationName").text(resolveFn("stickyKeys"));
        gpii.firstDiscovery.keyboard.stickyKeys.displayState(that);
    };

    gpii.firstDiscovery.keyboard.stickyKeys.tryAccomodationToggle = function (that, state) {
        that.locate("tryButton").toggle(!state);
        that.locate("accomodation").toggle(state);
    };

    gpii.firstDiscovery.keyboard.stickyKeys.displayState = function (that) {
        var state = that.model.stickyKeysEnabled;
        var stateText = that.msgResolver.resolve(state ? "on" : "off");
        var buttonText = that.msgResolver.resolve(state ? "turnOff" : "turnOn");
        var tooltipText = that.msgResolver.resolve(state ? "turnOffTooltip" : "turnOnTooltip");
        that.locate("accomodationState").text(stateText);
        that.locate("accomodationToggle").text(buttonText);
        if (that.tooltip) {
            that.tooltip.applier.change("idToContent." + fluid.allocateSimpleId(that.locate("accomodationToggle")), tooltipText);
        }
    };

    gpii.firstDiscovery.keyboard.stickyKeys.toggleState = function (that, path) {
        that.applier.change(path, !fluid.get(that.model, path));
    };

})(jQuery, fluid);
