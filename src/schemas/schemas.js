/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*******************************************************************************
     * Auxiliary Schema
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.auxSchema", {
        gradeNames: ["fluid.prefs.auxSchema"],
        auxiliarySchema: {
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor"],
            "namespace": "gpii.firstDiscovery",
            "terms": {
                "templatePrefix": "../src/html",
                "messagePrefix": "../src/messages"
            },
            "template": "%templatePrefix/firstDiscovery.html",
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
            "lineSpace": {
                "type": "gpii.firstDiscovery.lineSpace",
                "enactor": {
                    "type": "gpii.firstDiscovery.enactor.lineSpace"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.lineSpace",
                    "container": ".gpiic-fd-prefsEditor-panel-lineSpace",
                    "template": "%templatePrefix/rangeTemplate.html",
                    "message": "%messagePrefix/lineSpace.json"
                }
            },
            "letterSpace": {
                "type": "gpii.firstDiscovery.letterSpace",
                "enactor": {
                    "type": "gpii.firstDiscovery.enactor.letterSpace"
                },
                "panel": {
                    "type": "gpii.firstDiscovery.panel.letterSpace",
                    "container": ".gpiic-fd-prefsEditor-panel-letterSpace",
                    "template": "%templatePrefix/rangeTemplate.html",
                    "message": "%messagePrefix/letterSpace.json"
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
            "showSounds": {
                "type": "gpii.firstDiscovery.showSounds",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.showSounds",
                    "container": ".gpiic-fd-prefsEditor-panel-showSounds",
                    "template": "%templatePrefix/yesNo.html",
                    "message": "%messagePrefix/showSounds.json"
                }
            },
            "keyboard": {
                "type": "gpii.firstDiscovery.stickyKeys",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.keyboard",
                    "container": ".gpiic-fd-prefsEditor-panel-keyboard",
                    "template": "%templatePrefix/keyboard.html",
                    "message": "%messagePrefix/keyboard.json",
                    "gradeNames": ["gpii.firstDiscovery.panel.keyboardTts", "gpii.firstDiscovery.panel.keyboard.prefEditorConnection"],
                    "keyboardInputGradeNames": ["gpii.firstDiscovery.keyboardInputTts"]
                }
            },

            //added for 'confirm' and 'save' panels
            "confirm": {
                         "type": "gpii.firstDiscovery.confirm",
                         "panel": {
                             "type": "gpii.firstDiscovery.panel.confirm",
                             "container": ".gpiic-fd-prefsEditor-panel-confirm",
                             "template": "%templatePrefix/confirmTemplate.html",
                             "message": "%messagePrefix/confirm.json"
                         }
                     },
            "save": {
                          "type": "gpii.firstDiscovery.save",
                          "panel": {
                              "type": "gpii.firstDiscovery.panel.save",
                              "container": ".gpiic-fd-prefsEditor-panel-save",
                              "template": "%templatePrefix/saveTemplate.html",
                              "message": "%messagePrefix/save.json"
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

    /*******************************************************************************
     * Auxiliary Schema for integrating with the preferences server
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.auxSchema.prefsServerIntegration", {
        // using the base auxSchema as the grade inherits everything in there
        gradeNames: ["gpii.firstDiscovery.auxSchema"],

        auxiliarySchema: {

            // add the extra grade to the loader grades
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor", "gpii.firstDiscovery.prefsServerIntegration"],

            // override the original template to add the extra panel placeholder
            "template": "%templatePrefix/firstDiscoveryPrefsServerIntegration.html",

            // customize the text on the congratulations panel
            "congratulations": {
                "panel": {
                    "message": "%messagePrefix/congratulationsPrefsServerIntegration.json"
                }
            },

            // add the token panel
            "token": {
                "type": "gpii.firstDiscovery.token",
                "panel": {
                    "type": "gpii.firstDiscovery.panel.token",
                    "container": ".gpiic-fd-prefsEditor-panel-token",
                    "template": "%templatePrefix/token.html",
                    "message": "%messagePrefix/token.json",
                    "gradeNames": ["gpii.firstDiscovery.panel.token.prefsServerIntegrationConnection"]
                }
            }
        }
    });

    /*******************************************************************************
     * Primary Schema
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.schemas.language", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.language": {
                "type": "string",
                "default": "en-US",
                "enum": ["en-US", "fr-FR", "es-MX", "de-DE", "nl-NL", "sv-SE"]
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.speak", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.speak": {
                "type": "boolean",
                "default": true
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.textSize", {
        gradeNames: ["fluid.prefs.schemas"],
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

    fluid.defaults("gpii.firstDiscovery.schemas.letterSpace", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.letterSpace": {
                "type": "number",
                "default": 0,
                "minimum": 0.5,
                "maximum": 4,
                "divisibleBy": 0.5
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.lineSpace", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.lineSpace": {
                "type": "number",
                "default": 0.9,
                "minimum": 0.8,
                "maximum": 1.3,
                "divisibleBy": 0.1
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.speechRate", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.speechRate": {
                "type": "number",
                "default": 1,
                "minimum": 0.1,
                "maximum": 2, // The spec allows for up to 10, but in chrome 2 seems to be the upper bound.
                "divisibleBy": 0.1
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.onScreenKeyboard", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.onScreenKeyboard": {
                "type": "boolean",
                "default": true
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.captions", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.captions": {
                "type": "boolean",
                "default": true
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.showSounds", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.showSounds": {
                "type": "boolean",
                "default": true
            }
        }
    });

    fluid.defaults("gpii.firstDiscovery.schemas.stickyKeys", {
        gradeNames: ["fluid.prefs.schemas"],
        schema: {
            "gpii.firstDiscovery.stickyKeys": {
                "type": "boolean",
                "default": false
            }
        }
    });

})(jQuery, fluid);
