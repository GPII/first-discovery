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

    fluid.defaults("gpii.firstDiscovery.nav", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            // currentPanelNum: integer  // must be supplied by integrators
        },
        panelTotalNum: null,    // must be supplied by integrators
        messageBase: null,      // must be supplied by integrators
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show"
        },
        selectors: {
            navButtons: ".gpiic-fd-navButtons",
            navIcons: ".gpiic-fd-navIcons",
            stepCount: ".gpiic-fd-stepCountMsg"
        },
        components: {
            navButtons: {
                type: "gpii.firstDiscovery.navButtons",
                container: "{that}.dom.navButtons",
                options: {
                    model: {
                        currentPanelNum: "{nav}.model.currentPanelNum"
                    },
                    messageBase: "{nav}.options.messageBase",
                    styles: "{nav}.options.styles",
                    panelTotalNum: "{nav}.options.panelTotalNum"
                }
            },
            navIcons: {
                type: "gpii.firstDiscovery.navIcons",
                container: "{nav}.dom.navIcons",
                options: {
                    model: {
                        currentPanelNum: "{nav}.model.currentPanelNum"
                    },
                    styles: "{nav}.options.styles"
                }
            },
            stepCount: {
                type: "gpii.firstDiscovery.stepCount",
                container: "{that}.dom.stepCount",
                options: {
                    messageBase: "{nav}.options.messageBase",
                    model: {
                        currentPanelNum: "{nav}.model.currentPanelNum"
                    },
                    panelTotalNum: "{nav}.options.panelTotalNum"
                }
            }
        }
    });

})();
