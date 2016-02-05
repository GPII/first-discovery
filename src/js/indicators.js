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
            "warning": "warningTooltip"
        },
        selectors: {
            preview: "#gpiic-fd-indicators-preview",
            previewLabel: ".gpiic-fd-indicators-previewLabel",
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
        that.locate("warningLabel").html(that.msgResolver.resolve("warning"));
    };

})(jQuery, fluid);
