/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("gpii.firstDiscovery.previewIndicator", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            // currentPanelNum: integer  // must be supplied by integrators
        },
        messageBase: null,  // must be supplied by integrators
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        selectors: {
            indicators: ".gpiic-fd-indicators"
        },
        components: {
            indicators: {
                type: "gpii.firstDiscovery.indicators",
                container: "{that}.dom.indicators",
                options: {
                    messageBase: "{previewIndicator}.options.messageBase"
                }
            }
        }
    });

})();
