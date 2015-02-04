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
        gradeNames: ["fluid.viewRelayComponent", "fluid.prefs.prefsEditorLoader", "autoInit"],
        components: {
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
                        }
                    }
                }
            },
            navButtons: {
                type: "gpii.firstDiscovery.navButtons",
                container: "{that}.dom.navButtons",
                createOnEvent: "onCreateNavButtons",
                options: {
                    gradeNames: ["fluid.prefs.msgLookup"],
                    members: {
                        messageResolver: "{firstDiscoveryEditor}.msgResolver"
                    },
                    strings: {
                        back: "{that}.msgLookup.back",
                        next: "{that}.msgLookup.next",
                        start: "{that}.msgLookup.start",
                        finish: "{that}.msgLookup.finish"
                    },
                    styles: "{firstDiscoveryEditor}.options.styles",
                    panelTotalNum: "{firstDiscoveryEditor}.panelTotal",
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                    }
                }
            }
        },
        selectors: {
            prefsEditor: ".gpiic-fd-prefsEditor",
            panel: ".gpiic-fd-prefsEditor-panel",
            navButtons: ".gpiic-fd-navButtons"
        },
        styles: {
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
            "onPrefsEditorReady.getPanelTotal": {
                listener: "gpii.firstDiscovery.getPanelTotal",
                args: ["{that}"],
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
        }
    });

    gpii.firstDiscovery.getPanelTotal = function (that) {
        that.panels = that.prefsEditor.locate("panel");
        that.panelTotal = that.panels.length;
    };

    gpii.firstDiscovery.showPanel = function (panels, toShow, selectorForCurrent) {
        fluid.each(panels, function (panel, index) {
            $(panel).toggleClass(selectorForCurrent, toShow === (index + 1));
        });
    };
})(jQuery, fluid);
