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

    fluid.registerNamespace("gpii.firstDiscovery");

    /*******************************************************************************
     * Auxiliary Schema
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.auxSchema", {
        gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
        auxiliarySchema: {
            "namespace": "gpii.firstDiscovery",
            "templatePrefix": "../src/html/",
            "template": "../src/html/firstDiscovery.html",
            "messagePrefix": "../src/messages/",
            "message": "%prefix/firstDiscovery.json",
            "audio": {
                "type": "gpii.firstDiscovery.audio",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.audio",
                    "container": ".gpiic-fd-prefsEditor-panel-audio",
                    "template": "%prefix/audio.html",
                    "message": "%prefix/audio.json"
                }
            },
            "textSize": {
                "type": "fluid.prefs.textSize",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.textSize",
                    "container": ".gpiic-fd-prefsEditor-panel-size",
                    "template": "%prefix/rangeTemplate.html",
                    "message": "%prefix/textSize.json"
                }
            },
            "contrast": {
                "type": "gpii.firstDiscovery.contrast",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.contrast",
                    "container": ".gpiic-fd-prefsEditor-panel-contrast",
                    "template": "%prefix/contrast.html",
                    "message": "%prefix/contrast.json"
                }
            }
        }
    });

    /*******************************************************************************
     * Primary schema grades
     *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.schemas.textSize", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.textSize": {
                "type": "number",
                "default": 1,
                "minimum": 1,
                "maximum": 2,
                "divisibleBy": 0.1
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.audio", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.audio": {
                "type": "number",
                "default": 1,
                "minimum": 1,
                "maximum": 2,
                "divisibleBy": 0.1
            }
        }
    });

    fluid.defaults("fluid.prefs.schemas.contrast", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.contrast": {
                "type": "string",
                "default": "default",
                "enum": ["default", "bw", "wb"]
            }
        }
    });

})(jQuery, fluid);
