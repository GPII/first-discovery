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

    /*
     * The new prefs editor type for the first discovery tool
     */
    fluid.defaults("gpii.firstDiscovery.firstDiscoveryEditor", {
        gradeNames: ["fluid.prefs.prefsEditorLoader"],
        defaultLocale: {
            expander: {
                funcName: "fluid.get",
                args: [{
                    expander: {
                        funcName: "fluid.defaults",
                        args: ["gpii.firstDiscovery.schemas.language"]
                    }
                }, ["schema", "properties", "gpii.firstDiscovery.language", "default"]]
            }
        },
        components: {
            selfVoicing: {
                type: "gpii.firstDiscovery.selfVoicing"
            },
            selfVoicingToggle: {
                container: "{that}.dom.selfVoicingToggle",
                createOnEvent: "onPrefsEditorReady",
                type: "gpii.firstDiscovery.selfVoicingToggle",
                options: {
                    model: {
                        enabled: "{prefsEditor}.model.preferences.gpii_firstDiscovery_speak"
                    },
                    messageBase: "{messageLoader}.resources.prefsEditor.resourceText"
                }
            },
            helpButton: {
                type: "gpii.firstDiscovery.helpButton",
                container: "{that}.dom.helpButton",
                createOnEvent: "onPrefsEditorReady",
                options: {
                    messageBase: "{messageLoader}.resources.prefsEditor.resourceText"
                }
            },
            prefsEditor: {
                container: "{that}.dom.prefsEditor",
                options: {
                    gradeNames: ["gpii.firstDiscovery.tts.prefsEditor"],
                    selectors: {
                        panel: "{firstDiscoveryEditor}.options.selectors.panel"
                    },
                    events: {
                        onPanelShown: "{firstDiscoveryEditor}.events.onPanelShown"
                    },
                    model: {
                        // share model with selfVoicing
                        preferences: {
                            gpii_firstDiscovery_speak: "{gpii.firstDiscovery.selfVoicing}.model.enabled",
                            gpii_firstDiscovery_language: "{gpii.firstDiscovery.selfVoicing}.model.utteranceOpts.lang",
                            gpii_firstDiscovery_speechRate: "{gpii.firstDiscovery.selfVoicing}.model.utteranceOpts.rate"
                        }
                    },
                    listeners: {
                        onReady: {
                            listener: "{firstDiscoveryEditor}.events.onPrefsEditorReady",
                            args: "{firstDiscoveryEditor}"
                        },
                        onAutoSave: "{that}.saveAndApply",
                        // the page is reloaded to reset language and etc.
                        "afterReset.reload": {
                            "this": "location",
                            method: "reload",
                            args: true
                        },
                        "onCreate.bindResetShortcut": {
                            listener: "gpii.firstDiscovery.keyboardShortcut.bindShortcut",
                            args: [
                                "body",
                                gpii.firstDiscovery.keyboardShortcut.key.r,
                                ["ctrlKey", "altKey"],
                                "{that}.reset"
                            ]
                        }
                    },
                    autoSave: true,
                    connectionGradeForLang: "gpii.firstDiscovery.panel.lang.prefEditorConnection",
                    distributeOptions: {
                        source: "{that}.options.connectionGradeForLang",
                        target: "{that > gpii.firstDiscovery.panel.lang}.options.prefsEditorConnection"
                    }
                }
            },
            nav: {
                type: "gpii.firstDiscovery.nav",
                container: "{that}.dom.nav",
                createOnEvent: "onCreateNav",
                options: {
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                    },
                    messageBase: "{messageLoader}.resources.prefsEditor.resourceText",
                    styles: "{firstDiscoveryEditor}.options.styles",
                    panelTotalNum: "{firstDiscoveryEditor}.panels.length"
                }
            },
            messageLoader: {
                options: {
                    locale: "{prefsEditorLoader}.settings.preferences.gpii_firstDiscovery_language"
                }
            }
        },
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left bottom",
                at: "right+1 top"
            },
            styles: {
                tooltip: "gpii-fd-tooltip"
            },
            // This class should be applied to any element that will
            // be used to show the tooltip.
            items: ".gpiic-fd-tooltip:not([disabled])"
        },
        selectors: {
            prefsEditor: ".gpiic-fd-prefsEditor",
            panel: ".gpiic-fd-prefsEditor-panel",
            selfVoicingToggle: ".gpiic-fd-selfVoicingToggle",
            helpButton: ".gpiic-fd-help",
            nav: ".gpiic-fd-nav"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show",
            currentPanel: "gpii-fd-current",
            lastPanel: "gpii-fd-lastPanel"
        },
        model: {
            currentPanelNum: 1
        },
        modelListeners: {
            "currentPanelNum": [{
                listener: "{that}.showPanel",
                excludeSource: "init"
            }, {
                listener: "gpii.firstDiscovery.setLastPanelStyle",
                args: ["{that}.container", "{that}.options.styles.lastPanel", "{change}.value", "{firstDiscoveryEditor}.panels.length"]
            }]
        },
        events: {
            onPrefsEditorReady: null,
            onCreateNav: null,
            // onPanelShown is fired with one argument that is the id of the panel being shown
            onPanelShown: null
        },
        listeners: {
            "onPrefsEditorReady.setPanels": {
                listener: "fluid.set",
                args: ["{that}", "panels", "{prefsEditor}.dom.panel"],
                priority: "first"
            },
            "onPrefsEditorReady.showInitialPanel": "{that}.showPanel",
            "onPrefsEditorReady.createNavButtons": {
                listener: "{that}.events.onCreateNav"
            }
        },
        invokers: {
            showPanel: {
                funcName: "gpii.firstDiscovery.showPanel",
                args: ["{that}"]
            }
        },
        distributeOptions: {
            source: "{that}.options.tooltipOptions",
            target: "{that gpii.firstDiscovery.attachTooltip}.options.tooltipOptions"
        }
    });

    gpii.firstDiscovery.showPanel = function (that) {
        var panels = that.panels,
            currentPanelNum = that.model.currentPanelNum,
            selectorForCurrent = that.options.styles.currentPanel;

        fluid.each(panels, function (panel, index) {
            var toShow = currentPanelNum === (index + 1);
            $(panel).toggleClass(selectorForCurrent, toShow);
            if (toShow) {
                var panelId = fluid.allocateSimpleId(panel);
                that.events.onPanelShown.fire(panelId);
            }
        });
    };

    gpii.firstDiscovery.setLastPanelStyle = function (elm, style, currentPanel, panelTotalNum) {
        var isLastPanel = currentPanel === panelTotalNum;
        elm.toggleClass(style, isLastPanel);
    };
})(jQuery, fluid);
