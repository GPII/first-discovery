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
            target: "{that navButtons}.options.modelListeners.isLastPanel",
            record: {
                listener: "demo.firstDiscovery.showNextOnLastPanel.showNextButton",
                args: ["{that}.dom.next", "{change}.value", "{that}.options.styles.show"],
                namespace: "showNextButton",
                priority: "last",
                excludeSource: "init"
            }
        }
    });

    demo.firstDiscovery.showNextOnLastPanel.showNextButton = function (element, isLastPanel, showSelector) {
        if (isLastPanel) {
            element.prop("disabled", !isLastPanel);
            element.toggleClass(showSelector, isLastPanel);
        }
    };

})(jQuery, fluid);
