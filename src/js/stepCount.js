/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("gpii.firstDiscovery.stepCount", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "fluid.viewComponent"],
        model: {
            // currentPanelNum: integer  // must be supplied by integrators
        },
        panelTotalNum: null,    // must be supplied by integrators
        modelListeners: {
            "currentPanelNum": {
                "this": "{that}.container",
                method: "text",
                args: [{
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["{that}.msgLookup.stepCountMsg", {
                            currentPanel: "{that}.model.currentPanelNum",
                            numPanels: "{that}.options.panelTotalNum"
                        }]
                    }
                }]
            }
        }
    });

})();
