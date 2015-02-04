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
                "type": "fluid.prefs.speak",
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
                    "template": "%prefix/textSize.html",
                    "message": "%prefix/textSize.json"
                }
            },
            "contrast": {
                "type": "fluid.prefs.contrast",
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
    * Primary Schema
    *******************************************************************************/

    fluid.defaults("fluid.prefs.schemas.speak", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "fluid.prefs.speak": {
                "type": "boolean",
                "default": false
            }
        }
    });

})(jQuery, fluid);
