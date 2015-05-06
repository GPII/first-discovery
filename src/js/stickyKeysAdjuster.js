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

    fluid.defaults("gpii.firstDiscovery.keyboard.stickyKeysAdjuster", {
        gradeNames: ["fluid.viewRelayComponent", "gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip", "autoInit"],
        selectors: {
            description: ".gpiic-fd-keyboard-stickyKeysAdjuster-desc",
            tryButton: ".gpiic-fd-keyboard-stickyKeysAdjuster-try",
            accomodation: ".gpiic-fd-keyboard-stickyKeysAdjuster-accomodation",
            accomodationInstr: ".gpiic-fd-keyboard-stickyKeysAdjuster-accomodationInstr",
            accomodationName: ".gpiic-fd-keyboard-stickyKeysAdjuster-accomodationName",
            accomodationState: ".gpiic-fd-keyboard-stickyKeysAdjuster-accomodationState",
            accomodationToggle: ".gpiic-fd-keyboard-stickyKeysAdjuster-accomodationToggle"
        },
        tooltipContentMap: {
            tryButton: "tryTooltip",
            accomodationToggle: "turnOnTooltip"
        },
        model: {
            tryAccomodation: false
            // stickyKeysEnabled: boolean
        },
        modelRelay: {
            source: "tryAccomodation",
            target: "stickyKeysEnabled",
            backward: "never",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        },
        modelListeners: {
            tryAccomodation: {
                listener: "gpii.firstDiscovery.keyboard.stickyKeysAdjuster.tryAccomodationToggle",
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
                "this": "{that}.dom.accomodationToggle",
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
                args: ["{that}", "tryAccomodation"]
            }
        }
    });

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.renderText = function (that) {
        var resolveFn = that.msgResolver.resolve;

        that.locate("accomodationInstr").text(resolveFn("stickyKeysAccomInstr"));
        that.locate("description").html(resolveFn("stickyKeysInstructions"));
        that.locate("tryButton").text(resolveFn("try"));
        that.locate("accomodationName").text(resolveFn("stickyKeys"));
        gpii.firstDiscovery.keyboard.stickyKeysAdjuster.displayState(that);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.tryAccomodationToggle = function (that, state) {
        that.locate("tryButton").toggle(!state);
        that.locate("accomodation").toggle(state);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.displayState = function (that, state) {
        var stateText = that.msgResolver.resolve(state ? "on" : "off");
        var buttonText = that.msgResolver.resolve(state ? "turnOff" : "turnOn");
        that.locate("accomodationState").text(stateText);
        that.locate("accomodationToggle").text(buttonText);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.updateTooltipText = function (that, tooltip, state) {
        var tooltipText = that.msgResolver.resolve(state ? "turnOffTooltip" : "turnOnTooltip");
        tooltip.applier.change("idToContent." + fluid.allocateSimpleId(that.locate("accomodationToggle")), tooltipText);
    };

    gpii.firstDiscovery.keyboard.stickyKeysAdjuster.toggleState = function (that, path) {
        that.applier.change(path, !fluid.get(that.model, path));
    };

})(jQuery, fluid);
