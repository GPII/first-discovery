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

    fluid.defaults("gpii.firstDiscovery.congratulations", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        selectors: {
            help: ".gpiic-congratulaions-help",
            content: ".gpiic-congratulaions-content",
            close: ".gpiic-congratulations-closeButton",
            closeLabel: ".gpiic-congratulations-closeLabel"
        },
        selectorsToIgnore: ["close"],
        styles: {
            show: "gpii-fd-show"
        },
        strings: {
            "content": "<p>Congratulations!</p><p>Your preferences have been saved to your account.</p>",
            "closeLabel": "close",
            "helpLabel": "help"
        },
        protoTree: {
            content: {
                markup: {messagekey: "content"}
            },
            closeLabel: {messagekey: "closeLabel"},
            help: {messagekey: "helpLabel"}
        },
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
        renderOnInit: true
    });

})(jQuery, fluid);
