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

    fluid.registerNamespace("gpii.firstDiscovery.keyboard");

    fluid.defaults("gpii.firstDiscovery.keyboard.stickyKeysAssessment", {
        gradeNames: ["fluid.modelRelayComponent", "autoInit"],
        model: {
            // input: string, the input value to compare against the expected input.
            // offerAssistance: boolean
        },
        modelRelay: {
            target: "offerAssistance",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    "input": "{that}.model.input",
                    "offerAssistance": "{that}.model.offerAssistance",
                    "requiredInput": "{that}.options.requiredInput"
                },
                func: "gpii.firstDiscovery.keyboard.stickyKeysAssessment.check"
            }
        },
        // A valid string must be supplied by integrator
        requiredInput: ""
    });

    gpii.firstDiscovery.keyboard.stickyKeysAssessment.check = function (model) {
        return model.input ? model.input !== model.requiredInput : model.offerAssistance;
    };

})(jQuery, fluid);
