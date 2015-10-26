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

    fluid.defaults("gpii.firstDiscovery.msgLookup", {
        gradeNames: ["fluid.prefs.msgLookup"],
        components: {
            msgResolver: {
                type: "fluid.messageResolver"
            }
        },
        distributeOptions: {
            source: "{that}.options.messageBase",
            target: "{that > msgResolver}.options.messageBase"
        },
        // only needed for renderer components
        rendererOptions: {
            messageLocator: "{msgResolver}.resolve"
        }
    });

})(jQuery, fluid);
