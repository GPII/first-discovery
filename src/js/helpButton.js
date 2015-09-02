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
