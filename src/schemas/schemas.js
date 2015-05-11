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
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor"],
            "namespace": "gpii.firstDiscovery",
            "templatePrefix": "../src/html/",
            "template": "../src/html/firstDiscovery.html",
            "messagePrefix": "../src/messages/",
            "message": "%prefix/firstDiscovery.json",
            "lang": {
                "type": "gpii.firstDiscovery.language",
                "enactor": {
                    "type": "gpii.firstDiscovery.enactor.lang"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.lang",
                    "container": ".gpiic-fd-prefsEditor-panel-lang",
                    "template": "%prefix/lang.html",
                    "message": "%prefix/lang.json"
                }
            },
            "keyboard": {
                "type": "gpii.firstDiscovery.stickyKeys",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.keyboard",
                    "container": ".gpiic-fd-prefsEditor-panel-keyboard",
                    "template": "%prefix/keyboard.html",
                    "message": "%prefix/keyboard.json"
                }
            },
            "welcome": {
                "type": "gpii.firstDiscovery.welcome",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.welcome",
                    "container": ".gpiic-fd-prefsEditor-panel-welcome",
                    "template": "%prefix/welcomeTemplate.html",
                    "message": "%prefix/welcome.json"
                }
            },
            "textSize": {
                "type": "fluid.prefs.textSize",
                "enactor": {
                    "type": "fluid.prefs.enactor.textSize"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.textSize",
                    "container": ".gpiic-fd-prefsEditor-panel-size",
                    "template": "%prefix/rangeTemplate.html",
                    "message": "%prefix/textSize.json"
                }
            },
            "speakText": {
                "type": "gpii.firstDiscovery.speak",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.speakText",
                    "container": ".gpiic-fd-prefsEditor-panel-speakText",
                    "template": "%prefix/speakText.html",
                    "message": "%prefix/speakText.json"
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
            },
            "congratulations": {
                "type": "gpii.firstDiscovery.congratulations",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.congratulations",
                    "container": ".gpiic-fd-prefsEditor-panel-congratulations",
                    "template": "%prefix/congratulationsTemplate.html",
                    "message": "%prefix/congratulations.json"
                }
            }
        }
    });

    /*******************************************************************************
     * Primary Schema
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.schemas.textSize", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "fluid.prefs.textSize": {
                "type": "number",
                "default": 1,
                "minimum": 0.2,
                "maximum": 1.2,
                "divisibleBy": 0.1
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.language", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.language": {
                "type": "string",
                "default": "en",
                "enum": ["en", "fr", "es", "de", "ne", "sv"],
                "label": ["lang-en", "lang-fr", "lang-es", "lang-de", "lang-ne", "lang-sv"],
                "tooltip": ["lang-en-tooltip", "lang-fr-tooltip", "lang-es-tooltip", "lang-de-tooltip", "lang-ne-tooltip", "lang-sv-tooltip"],
                "tooltipAtSelect": ["lang-en-tooltipAtSelect", "lang-fr-tooltipAtSelect", "lang-es-tooltipAtSelect", "lang-de-tooltipAtSelect", "lang-ne-tooltipAtSelect", "lang-sv-tooltipAtSelect"]
            }
        }
    });

    // TODO: currently to get around an issue where the
    // boolean value needed to be specified as a string in the speak text
    // adjuster, the default is set to "true" instead of true
    fluid.defaults("gpii.firstDiscovery.schemas.speak", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.speak": {
                "type": "boolean",
                "default": true
            }
        }
    });


    fluid.defaults("gpii.firstDiscovery.schemas.stickyKeys", {
        gradeNames: ["autoInit", "fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.stickyKeys": {
                "type": "boolean",
                "default": false
            }
        }
    });
})(jQuery, fluid);
