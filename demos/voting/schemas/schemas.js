/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("demo.voting");

    /*******************************************************************************
     * Auxiliary Schema for Voting
    *******************************************************************************/

    fluid.defaults("demo.voting.auxSchema", {
        gradeNames: ["fluid.prefs.auxSchema"],
        auxiliarySchema: {
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor", "demo.firstDiscovery.integration.voting"],
            "namespace": "gpii.firstDiscovery",
            "terms": {
                "templatePrefix": "../../src/html/",
                "messagePrefix": "../../src/messages/"
            },
            "template": "./html/firstDiscovery.html",
            "message": "messages/firstDiscovery.json",
            "lang": {
                "type": "gpii.firstDiscovery.language",
                "enactor": {
                    "type": "gpii.firstDiscovery.enactor.lang"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.lang",
                    "container": ".gpiic-fd-prefsEditor-panel-lang",
                    "template": "%templatePrefix/lang.html",
                    "message": "%messagePrefix/lang.json",
                    "gradeNames": ["gpii.firstDiscovery.panel.lang.prefEditorConnection"],
                    "stringArrayIndex": {
                        "lang": ["lang-en-US", "lang-fr-FR", "lang-es-MX", "lang-de-DE", "lang-nl-NL", "lang-sv-SE"],
                        "tooltip": ["lang-en-US-tooltip", "lang-fr-FR-tooltip", "lang-es-MX-tooltip", "lang-de-DE-tooltip", "lang-nl-NL-tooltip", "lang-sv-SE-tooltip"],
                        "tooltipAtSelect": ["lang-en-US-tooltipAtSelect", "lang-fr-FR-tooltipAtSelect", "lang-es-MX-tooltipAtSelect", "lang-de-DE-tooltipAtSelect", "lang-nl-NL-tooltipAtSelect", "lang-sv-SE-tooltipAtSelect"]
                    }
                }
            },
            "welcome": {
                "type": "gpii.firstDiscovery.welcome",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.welcome",
                    "container": ".gpiic-fd-prefsEditor-panel-welcome",
                    "template": "%templatePrefix/welcomeTemplate.html",
                    "message": "messages/welcome.json"
                }
            },
            "contrast": {
                "type": "fluid.prefs.contrast",
                "classes": {
                    "default": "fl-theme-prefsEditor-default",
                    "bw": "fl-theme-prefsEditor-bw fl-theme-bw",
                    "wb": "fl-theme-prefsEditor-wb fl-theme-wb"
                },
                "enactor": {
                    "type": "fluid.prefs.enactor.contrast",
                    "classes": "@contrast.classes"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.contrast",
                    "container": ".gpiic-fd-prefsEditor-panel-contrast",
                    "classnameMap": {"theme": "@contrast.classes"},
                    "template": "%templatePrefix/contrast.html",
                    "message": "%messagePrefix/contrast.json"
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
                    "template": "%templatePrefix/rangeTemplate.html",
                    "message": "%messagePrefix/textSize.json"
                }
            }
        }
    });

})(jQuery, fluid);
