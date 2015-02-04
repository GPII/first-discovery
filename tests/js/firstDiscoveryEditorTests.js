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
        prefsEditorType: "gpii.firstDiscovery.firstDiscoveryEditor",
        components: {
            prefsEditorLoader: {
                options: {
                    listeners: {
                        onPrefsEditorReady: "{firstDiscovery}.events.onReady"
                    }
                }
            }
        },
        events: {
            onReady: null
        },
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

    gpii.tests.hasClass = function (elementName, element, selector, hasClass) {
        jqUnit.assertEquals("The visibility of " + elementName + " is " + (hasClass ? "visible" : "invisible"), hasClass, element.hasClass(selector));
    };

    gpii.tests.verifyStates = function (that, currentPanelNum, backVisible, nextVisible, panelsVisibility) {
        var prefsEditorContainer = that.locate("prefsEditor"),
            backButton = that.navButtons.locate("back"),
            nextButton = that.navButtons.locate("next"),
            showSelector = that.options.styles.show;

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        fluid.each(panelsVisibility, function (panelSelectors, visibility) {
            fluid.each(panelSelectors, function (selector) {
                var isVisible = visibility === "isVisible" ? true : false;
                gpii.tests.hasClass(selector, prefsEditorContainer.find(selector), that.options.styles.currentPanel, isVisible);
            });
        });

        gpii.tests.hasClass("the back button", backButton, showSelector, backVisible);
        gpii.tests.hasClass("the next button", nextButton, showSelector, nextVisible);
    };

    gpii.tests.testFirstDiscoveryEditor = function (that) {
        jqUnit.expect(26);
        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        // Test the initial panel
        jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
        jqUnit.assertNotUndefined("The subcomponent \"navButtons\" has been instantiated", that.navButtons);
        gpii.tests.verifyStates(that, 1, false, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-audio"],
            notVisible: [".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the next button leads to the 2nd panel
        nextButton.click();
        gpii.tests.verifyStates(that, 2, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-size"],
            notVisible: [".gpiic-fd-prefsEditor-panel-audio", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the back button brings back the first panel
        backButton.click();
        gpii.tests.verifyStates(that, 1, false, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-audio"],
            notVisible: [".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Directs to the last panel by firing a change request directly
        that.applier.change("currentPanelNum", 3);
        gpii.tests.verifyStates(that, 3, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-contrast"],
            notVisible: [".gpiic-fd-prefsEditor-panel-audio", ".gpiic-fd-prefsEditor-panel-size"]
        });
    };

    jqUnit.asyncTest("The first discovery tool editor", function () {
        gpii.tests.firstDiscovery("#gpiic-fd", {
            listeners: {
                "onReady.addTestFunc": {
                    listener: gpii.tests.testFirstDiscoveryEditor,
                    priority: "10"
                },
                "onReady.startTest": {
                    listener: "jqUnit.start",
                    priority: "last"
                }
            }
        });
    });

})(jQuery, fluid);
