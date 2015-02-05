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

    fluid.registerNamespace("gpii.firstDiscovery.panel");

    fluid.defaults("gpii.firstDiscovery.panel.ranged", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        model: {
            // Preferences Maps should direct the default model state
            // to this model property. The component is configured
            // with the expectation that this is the salient model value.
            value: null
        },
        range: {
            min: 1,
            max: 2
        },
        step: 0.1,
        selectors: {
            instructions: ".gpiic-fd-range-instructions",
            meter: ".gpiic-fd-range-indicator",
            increase: ".gpiic-fd-range-increase",
            increaseLabel: ".gpiic-fd-range-increaseLabel",
            decrease: ".gpiic-fd-range-decrease",
            decreaseLabel: ".gpiic-fd-range-decreaseLabel"
        },
        selectorsToIgnore: ["meter", "increase", "decrease"],
        protoTree: {
            instructions: {messagekey: "instructions"},
            increaseLabel: {messagekey: "increaseLabel"},
            decreaseLabel: {messagekey: "decreaseLabel"}
        },
        invokers: {
            stepUp: {
                funcName: "gpii.firstDiscovery.panel.ranged.step",
                args: ["{that}"]
            },
            stepDown: {
                funcName: "gpii.firstDiscovery.panel.ranged.step",
                args: ["{that}", true]
            },
            updateMeter: {
                funcName: "gpii.firstDiscovery.panel.ranged.updateMeter",
                args: ["{that}", "{that}.model.value"]
            }
        },
        listeners: {
            "afterRender.bindIncrease": {
                "this": "{that}.dom.increase",
                "method": "click",
                "args": ["{that}.stepUp"]
            },
            "afterRender.bindDecrease": {
                "this": "{that}.dom.decrease",
                "method": "click",
                "args": ["{that}.stepDown"]
            },
            "afterRender.updateMeter": "{that}.updateMeter"
        },
        modelListeners: {
            "value": {
                listener: "{that}.updateMeter",
                excludeSource: ["init"]
            }
        }
    });

    gpii.firstDiscovery.panel.ranged.clip = function (value, min, max) {
        if (max > min) {
            return Math.min(max, Math.max(min, value));
        }
    };

    gpii.firstDiscovery.panel.ranged.step = function (that, reverse) {
        var step = reverse ? (that.options.step * -1) : that.options.step;
        var newValue = that.model.value + step;
        newValue = gpii.firstDiscovery.panel.ranged.clip(newValue, that.options.range.min, that.options.range.max);
        that.applier.change("value", newValue);
    };

    gpii.firstDiscovery.panel.ranged.calculatePercentage = function (value, min, max) {
        if (max > min) {
            var clipped = gpii.firstDiscovery.panel.ranged.clip(value, min, max);
            return ((clipped - min) / (max - min)) * 100;
        }
    };

    gpii.firstDiscovery.panel.ranged.updateMeter = function (that, value) {
        var percentage = gpii.firstDiscovery.panel.ranged.calculatePercentage(value, that.options.range.min, that.options.range.max);
        that.locate("meter").css("height", percentage + "%");
    };

    fluid.defaults("gpii.firstDiscovery.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.ranged", "autoInit"],
        preferenceMap: {
            "fluid.prefs.textSize": {
                "model.value": "default",
                "range.min": "minimum",
                "range.max": "maximum",
                "step": "divisibleBy"
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.panel.audio", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.audio": {
                "model.audio": "default",
                "range.min": "minimum",
                "range.max": "maximum"
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.panel.contrast", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.contrast": {
                "model.value": "default",
                "controlValues.theme": "enum"
            }
        }
    });

})(jQuery, fluid);
