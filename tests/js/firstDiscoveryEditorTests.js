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

    gpii.tests.verifyStates = function (that, currentPanelNum, panel1Visible, panel2Visible, panel3Visible, backVisible, nextVisible) {
        var prefsEditorContainer = that.locate("prefsEditor");
        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        jqUnit.assertEquals("The visibility of the first panel is " + panel1Visible, panel1Visible, prefsEditorContainer.find(".gpiic-audio").is(":visible"));
        jqUnit.assertEquals("The visibility of the second panel is " + panel2Visible, panel2Visible, prefsEditorContainer.find(".gpiic-size").is(":visible"));
        jqUnit.assertEquals("The visibility of the third panel is " + panel3Visible, panel3Visible, prefsEditorContainer.find(".gpiic-contrast").is(":visible"));

        jqUnit.assertEquals("The visibility of the back button is " + backVisible, backVisible, backButton.is(":visible"));
        jqUnit.assertEquals("The visibility of the next button is " + nextVisible, nextVisible, nextButton.is(":visible"));
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
                                    gpii.tests.verifyStates(that, 1, true, false, false, false, true);

                                    nextButton.click();
                                    gpii.tests.verifyStates(that, 2, false, true, false, true, true);

                                    backButton.click();
                                    gpii.tests.verifyStates(that, 1, true, false, false, false, true);

                                    that.applier.change("currentPanelNum", 3);
                                    gpii.tests.verifyStates(that, 3, false, false, true, true, true);
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
