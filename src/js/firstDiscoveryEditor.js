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
                    gradeNames: ["fluid.prefs.msgLookup"],
                    model: {
                        enabled: true
                    },
                    members: {
                        messageResolver: "{firstDiscoveryEditor}.msgResolver"
                    },
                    strings: {
                        unmuted: "{that}.msgLookup.unmuted",
                        unmutedTooltip: "{that}.msgLookup.unmutedTooltip",
                        muted: "{that}.msgLookup.muted",
                        mutedTooltip: "{that}.msgLookup.mutedTooltip"
                    }
                }
            },
            prefsEditor: {
                container: "{that}.dom.prefsEditor",
                options: {
                    selectors: {
                        panel: "{firstDiscoveryEditor}.options.selectors.panel"
                    },
                    listeners: {
                        onReady: {
                            listener: "{firstDiscoveryEditor}.events.onPrefsEditorReady",
                            args: "{firstDiscoveryEditor}"
                        },
                        onAutoSave: "{that}.saveAndApply"
                    },
                    autoSave: true
                }
            },
            navButtons: {
                type: "gpii.firstDiscovery.navButtons",
                container: "{that}.dom.navButtons",
                createOnEvent: "onCreateNavButtons",
                options: {
                    gradeNames: ["fluid.prefs.msgLookup"],
                    members: {
                        // TODO: when switching to use relay components, the line below to share applier can be removed
                        // applier: "{firstDiscoveryEditor}.applier",
                        messageResolver: "{firstDiscoveryEditor}.msgResolver"
                    },
                    // TODO: when switching to use relay components, rather than sharing the entire model, only the needed model paths need to be shared
                    model: "{firstDiscoveryEditor}.model",
                    strings: {
                        back: "{that}.msgLookup.back",
                        backTooltip: "{that}.msgLookup.backTooltip",
                        next: "{that}.msgLookup.next",
                        nextTooltip: "{that}.msgLookup.nextTooltip",
                        start: "{that}.msgLookup.start",
                        startTooltip: "{that}.msgLookup.startTooltip",
                        finish: "{that}.msgLookup.finish",
                        finishTooltip: "{that}.msgLookup.finishTooltip"
                    },
                    styles: "{firstDiscoveryEditor}.options.styles",
                    panelTotalNum: "{firstDiscoveryEditor}.panels.length"
                }
            },
            navIcons: {
                type: "gpii.firstDiscovery.navIcons",
                container: "{firstDiscoveryEditor}.dom.navIcons",
                options: {
                    members: {
                        // TODO: when switching to use relay components, the line below to share applier can be removed
                        // applier: "{firstDiscoveryEditor}.applier"
                    },
                    // TODO: when switching to use relay components, rather than sharing the entire model, only the needed model paths need to be shared
                    model: "{firstDiscoveryEditor}.model",
                    styles: "{firstDiscoveryEditor}.options.styles"
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
            selfVoicing: ".gpiic-fd-selfVoicing"
        },
        styles: {
            active: "gpii-fd-active",
            show: "gpii-fd-show",
            currentPanel: "gpii-fd-current"
        },
        model: {
            currentPanelNum: 1
        },
        modelListeners: {
            "currentPanelNum": {
                listener: "{that}.showPanel",
                excludeSource: "init"
            }
        },
        events: {
            onPrefsEditorReady: null,
            onCreateNavButtons: null
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
                args: ["{that}.panels", "{that}.model.currentPanelNum", "{that}.options.styles.currentPanel"]
            }
        },
        distributeOptions: {
            source: "{that}.options.tooltipOptions",
            target: "{that gpii.firstDiscovery.attachTooltip}.options.tooltipOptions"
        }
    });

    gpii.firstDiscovery.showPanel = function (panels, toShow, selectorForCurrent) {
        fluid.each(panels, function (panel, index) {
            $(panel).toggleClass(selectorForCurrent, toShow === (index + 1));
        });
    };
})(jQuery, fluid);
