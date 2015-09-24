/*
Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
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
