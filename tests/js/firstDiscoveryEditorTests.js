/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.firstDiscovery", {
        gradeNames: ["fluid.viewRelayComponent", "{that}.assembledPrefsEditorGrade", "autoInit"],
        invokers: {
            assembledPrefsEditorGrade: {
                funcName: "gpii.tests.getPrefsEditorGrade"
            }
        }
    });

    gpii.tests.getPrefsEditorGrade = function () {
        var builder = fluid.prefs.builder({
            gradeNames: ["gpii.firstDiscovery.auxSchema"],
            auxiliarySchema: {
                "templatePrefix": "../../src/html/",
                "template": "../../src/html/firstDiscovery.html",
                "messagePrefix": "../../src/messages/"
            }
        });
        return builder.options.assembledPrefsEditorGrade;
    };

    gpii.tests.verifyStates = function (that, currentPanelNum, backVisible, nextVisible, panelsVisibility) {
        var prefsEditorContainer = that.locate("prefsEditor");
        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        fluid.each(panelsVisibility, function (panelSelectors, state) {
            fluid.each(panelSelectors, function (selector) {
                jqUnit[state]("The visibility of the panel " + selector + " is " + state, prefsEditorContainer.find(selector));
            })
        });

        jqUnit[backVisible ? "isVisible" : "notVisible"]("The visibility of the back button is " + backVisible, backButton);
        jqUnit[nextVisible ? "isVisible" : "notVisible"]("The visibility of the next button is " + nextVisible, nextButton);
    };

    jqUnit.asyncTest("The first discovery tool editor", function () {
        gpii.tests.firstDiscovery("#gpiic-tool", {
            prefsEditorType: "gpii.firstDiscovery.firstDiscoveryEditor",
            components: {
                prefsEditorLoader: {
                    options: {
                        listeners: {
                            onPrefsEditorReady: {
                                listener: function (that) {
                                    jqUnit.expect(26);
                                    var backButton = that.navButtons.locate("back");
                                    var nextButton = that.navButtons.locate("next");

                                    jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
                                    jqUnit.assertNotUndefined("The subcomponent \"navButtons\" has been instantiated", that.navButtons);
                                    gpii.tests.verifyStates(that, 1, false, true, {
                                        isVisible: [".gpiic-firstDiscovery-panel-audio"],
                                        notVisible: [".gpiic-firstDiscovery-panel-size", ".gpiic-firstDiscovery-panel-contrast"]
                                    });

                                    nextButton.click();
                                    gpii.tests.verifyStates(that, 2, true, true, {
                                        isVisible: [".gpiic-firstDiscovery-panel-size"],
                                        notVisible: [".gpiic-firstDiscovery-panel-audio", ".gpiic-firstDiscovery-panel-contrast"]
                                    });

                                    backButton.click();
                                    gpii.tests.verifyStates(that, 1, false, true, {
                                        isVisible: [".gpiic-firstDiscovery-panel-audio"],
                                        notVisible: [".gpiic-firstDiscovery-panel-size", ".gpiic-firstDiscovery-panel-contrast"]
                                    });

                                    that.applier.change("currentPanelNum", 3);
                                    gpii.tests.verifyStates(that, 3, true, true, {
                                        isVisible: [".gpiic-firstDiscovery-panel-contrast"],
                                        notVisible: [".gpiic-firstDiscovery-panel-audio", ".gpiic-firstDiscovery-panel-size"]
                                    });

                                    jqUnit.start();
                                },
                                priority: "last"
                            }
                        }
                    }
                }
            }
        });
    });

})(jQuery, fluid);
