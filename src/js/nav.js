/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
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
                        currentPanelNum: "{nav}.model.currentPanelNum",
                        visitedPanelNums: "{nav}.model.visitedPanelNums"
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
