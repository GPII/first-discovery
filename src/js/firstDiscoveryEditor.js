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
                    modelListeners: {
                        states: {
                            funcName: "{that}.save",
                            excludeSource: "init"
                        },
                        preferences: {
                            funcName: "{that}.saveAndApply",
                            excludeSource: "init"
                        }
                    },
                    model: {
                        states: {
                            currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum"
                        }
                    },
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
                    distributeOptions: [{
                        record: {
                            offerAssistance: "{prefsEditor}.model.states.stickyKey.offerAssistance",
                            tryAccommodation: "{prefsEditor}.model.states.stickyKey.tryAccommodation"
                        },
                        target: "{that > gpii.firstDiscovery.panel.keyboard}.options.model"
                    }]
                }
            },
            nav: {
                type: "gpii.firstDiscovery.nav",
                container: "{that}.dom.nav",
                createOnEvent: "onCreateNav",
                options: {
                    model: {
                        currentPanelNum: "{firstDiscoveryEditor}.model.currentPanelNum",
                        visitedPanelNums: "{prefsEditor}.model.states.visitedPanelNums"
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

    /*
     * To integrate the first discovery tool with the preferences server.
     * This component should be used as an add-on grade component for gpii.firstDiscovery.firstDiscoveryEditor
     */
    fluid.defaults("gpii.firstDiscovery.prefsServerIntegration", {
        gradeNames: ["fluid.modelComponent"],
        styles: {
            lastPanel: "gpii-fd-lastPanel"
        },
        invokers: {
            updateIsLastPanel: {
                funcName: "gpii.firstDiscovery.updateIsLastPanel",
                args: ["{that}"]
            }
        },
        model: {
            // isLastPanel: false  // Boolean value of whether or not the current panel is the last panel
        },
        modelListeners: {
            isLastPanel: {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.lastPanel", "{change}.value"]
            },
            // This model listener cannot be replaced by the model relay because
            // the calculation of model.isLastPanel requires "{that}.panels" to be
            // ready. "{that}.panels" is set when onPrefsEditorReady event is fired.
            // So using model relay is too early.
            currentPanelNum: {
                funcName: "{that}.updateIsLastPanel",
                excludeSource: "init"
            }
        },
        listeners: {
            "onPrefsEditorReady.updateIsLastPanel": "{that}.updateIsLastPanel"
        },
        saveRequestConfig: {
            view: "firstDiscovery"
        },
        distributeOptions: {
            // An example of the "saveRequestConfig" structure:
            // saveRequestConfig: {
            //     url: "/user?view=%view",
            //     method: "POST",
            //     view: "firstDiscovery"  // To define the "%view" used in the url.
            // }
            source: "{that}.options.saveRequestConfig",
            target: "{that gpii.firstDiscovery.panel.token}.options.saveRequestConfig"
        }
    });

    gpii.firstDiscovery.updateIsLastPanel = function (that) {
        var panelTotalNum = that.panels ? that.panels.length : undefined;
        that.applier.change("isLastPanel", that.model.currentPanelNum === panelTotalNum);
    };

})(jQuery, fluid);
