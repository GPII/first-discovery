/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("demo.assessment");

    /*******************************************************************************
     * Auxiliary Schema for Assessment
    *******************************************************************************/

    fluid.defaults("demo.assessment.auxSchema", {
        gradeNames: ["fluid.prefs.auxSchema"],
        auxiliarySchema: {
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor", "demo.firstDiscovery.showNextOnLastPanel", "demo.firstDiscovery.integration.assessment"],
            "namespace": "gpii.firstDiscovery",
            "terms": {
                "templatePrefix": "../../src/html",
                "messagePrefix": "messages"
            },
            "template": "./html/firstDiscovery.html",
            "message": "%messagePrefix/firstDiscovery.json",
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
                    "message": "%messagePrefix/welcome.json"
                }
            },
            "speakText": {
                "type": "gpii.firstDiscovery.speak",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.speakText",
                    "container": ".gpiic-fd-prefsEditor-panel-speakText",
                    "template": "%templatePrefix/yesNo.html",
                    "message": "%messagePrefix/speakText.json"
                }
            },
            "speechRate": {
                "type": "gpii.firstDiscovery.speechRate",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.speechRate",
                    "container": ".gpiic-fd-prefsEditor-panel-speechRate",
                    "template": "%templatePrefix/rangeWithDisabledMsgTemplate.html",
                    "message": "%messagePrefix/speechRate.json",
                    "gradeNames": ["gpii.firstDiscovery.panel.speechRate.prefsEditorConnection"]
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
            },
            "onScreenKeyboard": {
                "type": "gpii.firstDiscovery.onScreenKeyboard",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.onScreenKeyboard",
                    "container": ".gpiic-fd-prefsEditor-panel-onScreenKeyboard",
                    "template": "%templatePrefix/yesNo.html",
                    "message": "%messagePrefix/onScreenKeyboard.json"
                }
            },
            "captions": {
                "type": "gpii.firstDiscovery.captions",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.captions",
                    "container": ".gpiic-fd-prefsEditor-panel-captions",
                    "template": "%templatePrefix/yesNo.html",
                    "message": "%messagePrefix/captions.json"
                }
            },
            "congratulations": {
                "type": "gpii.firstDiscovery.congratulations",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.congratulations",
                    "container": ".gpiic-fd-prefsEditor-panel-congratulations",
                    "template": "%templatePrefix/congratulationsTemplate.html",
                    "message": "%messagePrefix/congratulations.json"
                }
            }
        }
    });

})(jQuery, fluid);
