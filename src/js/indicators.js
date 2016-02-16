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
     * The back and next navigation buttons
     */
    fluid.defaults("gpii.firstDiscovery.indicators", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "gpii.firstDiscovery.attachTooltip", "fluid.viewComponent"],
        tooltipContentMap: {
            "preview": "previewTooltip",
            "keyboard": "keyboardTooltip",
            "warning": "warningTooltip"
        },
        selectors: {
            preview: "#gpiic-fd-indicators-preview",
            previewLabel: ".gpiic-fd-indicators-previewLabel",
            keyboard: "#gpiic-fd-indicators-keyboard",
            keyboardLabel: ".gpiic-fd-indicators-keyboardLabel",
            warning: "#gpiic-fd-indicators-warning",
            warningLabel: ".gpiic-fd-indicators-warningLabel"
        },
        styles: {
            show: "gpii-fd-show"
        },
        listeners: {
            "onCreate.bindPreview": {
                "this": "{that}.dom.preview",
                "method": "click",
                args: ["{that}.previewButtonClicked"]
            },
            "onCreate.bindWarning": {
                "this": "{that}.dom.warning",
                "method": "click",
                args: ["{that}.warningButtonClicked"]
            },
            "onCreate.bindKeyboard": {
                "this": "{that}.dom.keyboard",
                "method": "click",
                args: ["{that}.keyboardButtonClicked"]
            },    
            "onCreate.setButtonLabels": "{that}.setButtonLabels"
        },
        invokers: {
            setButtonLabels: {
                funcName: "gpii.firstDiscovery.indicators.setButtonLabels",
                args: ["{that}"]
            }
        }
    });
    
    gpii.firstDiscovery.indicators.setButtonLabels = function (that) {
        that.locate("previewLabel").html(that.msgResolver.resolve("preview"));
        that.locate("keyboardLabel").html(that.msgResolver.resolve("keyboard"));
        that.locate("warningLabel").html(that.msgResolver.resolve("warning"));
    };

})(jQuery, fluid);
