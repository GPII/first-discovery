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

    fluid.defaults("gpii.firstDiscovery.panel.congratulations", {
        gradeNames: ["fluid.prefs.panel", "gpii.firstDiscovery.attachTooltip.renderer", "autoInit"],
        preferenceMap: {
            "gpii.firstDiscovery.congratulations": {}
        },
        selectors: {
            message: ".gpiic-fd-congratulations-message",
            close: ".gpiic-fd-congratulations-closeButton",
            closeLabel: ".gpiic-fd-congratulations-closeLabel"
        },
        selectorsToIgnore: ["close"],
        invokers: {
            close: {
                "this": "window",
                "method": "close"
            }
        },
        listeners: {
            "afterRender.bindClose": {
                "this": "{that}.dom.close",
                "method": "click",
                "args": "{that}.close"
            }
        },
        tooltipContentMap: {
            "close": "closeLabel"
        },
        protoTree: {
            message: {
                markup: {messagekey: "message"}
            },
            closeLabel: {messagekey: "closeLabel"}
        }
    });

})(jQuery, fluid);
