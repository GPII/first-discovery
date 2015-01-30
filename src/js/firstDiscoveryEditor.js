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
        selectors: {
            prefsEditor: ".gpiic-prefsEditor",
            panelContainer: ".gpiic-firstDiscovery-panel",
            navButtons: ".gpiic-buttons"
        },
        components: {
            prefsEditor: {
                container: "{that}.dom.prefsEditor",
                options: {
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
                    panelTotalNum: "{firstDiscoveryEditor}.panelTotal",
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                    }
                }
            }
        },
        modelListeners: {
            "currentPanelNum": "{that}.showPanel"
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
            "onPrefsEditorReady.showInitialPanel": {
                listener: "{that}.applier.change",
                args: ["currentPanelNum", 1]
            },
            "onPrefsEditorReady.createNavButtons": {
                listener: "{that}.events.onCreateNavButtons"
            }
        },
        invokers: {
            showPanel: {
                funcName: "gpii.firstDiscovery.showPanel",
                args: ["{that}.panels", "{that}.model.currentPanelNum"]
            }
        }
    });

    gpii.firstDiscovery.getPanelTotal = function (that) {
        that.panels = that.prefsEditor.container.find(that.options.selectors.panelContainer);
        that.panelTotal = that.panels.length;
    };

    gpii.firstDiscovery.showPanel = function (panels, toShow) {
        fluid.each(panels, function (panel, index) {
            $(panel)[toShow === index + 1 ? "show" : "hide"]();
        });
    };
})(jQuery, fluid);
