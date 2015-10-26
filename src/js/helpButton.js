/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("gpii.firstDiscovery.helpButton", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "fluid.viewComponent"],
        listeners: {
            "onCreate.setContent": {
                "this": "{that}.container",
                method: "text",
                args: ["{that}.msgLookup.help"]
            }
        }
    });

})();
