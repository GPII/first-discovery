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

    jqUnit.asyncTest("Initialization", function () {
        gpii.tests.firstDiscovery("#gpiic-tool", {
            prefsEditorType: "gpii.firstDiscovery.firstDiscoveryEditor",
            components: {
                prefsEditorLoader: {
                    options: {
                        listeners: {
                            onPrefsEditorReady: function (that) {
                                jqUnit.expect(2);

                                jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
                                jqUnit.assertNotEquals("The prefs editor panels have been rendered", "", that.locate("prefsEditor").html());

                                jqUnit.start();
                            }
                        }
                    }
                }
            }
        });
    });

})(jQuery, fluid);
