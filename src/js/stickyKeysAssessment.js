/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.keyboard");

    fluid.defaults("gpii.firstDiscovery.keyboard.stickyKeysAssessment", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            // userInput: string, the user input value to compare against the requiredInput value.
            // offerAssistance: boolean
        },
        modelRelay: {
            target: "offerAssistance",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    "userInput": "{that}.model.userInput",
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
        return model.userInput ? model.userInput !== model.requiredInput : model.offerAssistance;
    };

})(jQuery, fluid);
