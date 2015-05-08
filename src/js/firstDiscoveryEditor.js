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
        gradeNames: ["gpii.firstDiscovery.tts.fdHookup", "fluid.prefs.prefsEditorLoader", "autoInit"],
        components: {
            selfVoicing: {
                container: "{that}.dom.selfVoicing",
                createOnEvent: "onPrefsEditorReady",
                type: "gpii.firstDiscovery.selfVoicing",
                options: {
                    model: {
                        enabled: true
                    },
                    messageBase: "{messageLoader}.resources.prefsEditor.resourceText"
                }
            },
            prefsEditor: {
                container: "{that}.dom.prefsEditor",
                options: {
                    selectors: {
                        panel: "{firstDiscoveryEditor}.options.selectors.panel"
                    },
                    events: {
                        onPanelShown: "{firstDiscoveryEditor}.events.onPanelShown"
                    },
                    listeners: {
                        onReady: {
                            listener: "{firstDiscoveryEditor}.events.onPrefsEditorReady",
                            args: "{firstDiscoveryEditor}"
                        },
                        onAutoSave: "{that}.saveAndApply"
                    },
                    autoSave: true,
                    connectionGradeForLang: "gpii.firstDiscovery.panel.lang.prefEditorConnection",
                    distributeOptions: {
                        source: "{that}.options.connectionGradeForLang",
                        target: "{that > gpii.firstDiscovery.panel.lang}.options.prefsEditorConnection"
                    }
                }
            },
            navButtons: {
                type: "gpii.firstDiscovery.navButtons",
                container: "{that}.dom.navButtons",
                createOnEvent: "onCreateNavButtons",
                options: {
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                    },
                    messageBase: "{messageLoader}.resources.prefsEditor.resourceText",
                    styles: "{firstDiscoveryEditor}.options.styles",
                    panelTotalNum: "{firstDiscoveryEditor}.panels.length"
                }
            },
            navIcons: {
                type: "gpii.firstDiscovery.navIcons",
                container: "{firstDiscoveryEditor}.dom.navIcons",
                options: {
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                    },
                    styles: "{firstDiscoveryEditor}.options.styles"
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
            messageLoader: {
                options: {
                    locale: "{prefsEditorLoader}.settings.gpii_firstDiscovery_language",
                }
            }
        },
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left+70 bottom-70"
            },
            styles: {
                tooltip: "gpii-fd-tooltip"
            }
        },
        selectors: {
            prefsEditor: ".gpiic-fd-prefsEditor",
            panel: ".gpiic-fd-prefsEditor-panel",
            navButtons: ".gpiic-fd-navButtons",
            navIcons: ".gpiic-fd-navIcons",
            selfVoicing: ".gpiic-fd-selfVoicing",
            helpButton: ".gpiic-fd-help"
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
            onCreateNavButtons: null,
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
                listener: "{that}.events.onCreateNavButtons"
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
