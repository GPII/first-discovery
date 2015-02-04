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

    fluid.registerNamespace("gpii.firstDiscovery.panel");

    fluid.defaults("gpii.firstDiscovery.panel.tts", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "fluid.prefs.speak": {
                "model.speak": "default"
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.panel.textSize", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "fluid.prefs.textSize": {
                "model.textSize": "default",
                "range.min": "minimum",
                "range.max": "maximum"
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.panel.contrast", {
        gradeNames: ["fluid.prefs.panel", "autoInit"],
        preferenceMap: {
            "fluid.prefs.contrast": {
                "model.value": "default",
                "controlValues.theme": "enum"
            }
        }
    });

})(jQuery, fluid);
