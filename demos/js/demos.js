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

    fluid.registerNamespace("demo.firstDiscovery");

    /*
     * A grade component to show the next button on the last panel. It can be applied to demos where the last panel is not the congratulations.
     */
    fluid.defaults("demo.firstDiscovery.showNextOnLastPanel", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        distributeOptions: {
            target: "{that navButtons}.options.modelListeners.currentPanelNum",
            record: {
                listener: "demo.firstDiscovery.showNextOnLastPanel.showNextButton",
                args: ["{that}", "{change}.value"],
                namespace: "showNextButton",
                priority: "last",
                excludeSource: "init"
            }
        }
    });

    demo.firstDiscovery.showNextOnLastPanel.showNextButton = function (that, currentPanelNum) {
        var nextButton = that.locate("next");
        var isLastPanel = currentPanelNum === that.options.panelTotalNum;
        var secondLastPanel = currentPanelNum === (that.options.panelTotalNum - 1);

        if (isLastPanel) {
            gpii.firstDiscovery.navButtons.toggleButtonSates(nextButton, !isLastPanel, that.options.styles.show);
        } else if (secondLastPanel) {
            var nextButtonID = fluid.allocateSimpleId(nextButton),
                nextLabel = that.msgResolver.resolve("next"),
                nextTooltipContent = that.msgResolver.resolve("nextTooltip");

            that.locate("nextLabel").html(nextLabel);
            that.tooltip.applier.change("idToContent." + nextButtonID, nextTooltipContent);
        }
    };

})(jQuery, fluid);
