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
        gradeNames: ["fluid.viewComponent", "{that}.assembledPrefsEditorGrade", "autoInit"],
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
                funcName: "gpii.tests.firstDiscovery.getPrefsEditorGrade"
            }
        }
    });

    gpii.tests.firstDiscovery.getPrefsEditorGrade = function () {
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

    // The mapping between the model value of "currentPanelNum" and actual panels
    // 1. language, 2. audio, 3. text size, 4. contrast
    gpii.tests.firstDiscovery.runTest = function (msg, container, panelNum, testFunc) {
        jqUnit.asyncTest(msg, function () {
            gpii.tests.firstDiscovery(container, {
                components: {
                    prefsEditorLoader: {
                        options: {
                            model: {
                                currentPanelNum: panelNum   // show the text size panel at the page load
                            }
                        }
                    }
                },
                listeners: {
                    "onReady.addTestFunc": {
                        listener: testFunc,
                        priority: "10"
                    },
                    "onReady.startTest": {
                        listener: "jqUnit.start",
                        priority: "last"
                    }
                }
            });
        });
    };

    gpii.tests.firstDiscovery.hasClass = function (elementName, element, selector, hasClass) {
        jqUnit.assertEquals("The visibility of " + elementName + " is " + (hasClass ? "visible" : "invisible"), hasClass, element.hasClass(selector));
    };

    gpii.tests.firstDiscovery.verifyStates = function (that, currentPanelNum, backVisible, nextVisible, panelsVisibility) {
        var prefsEditorContainer = that.locate("prefsEditor"),
            backButton = that.navButtons.locate("back"),
            nextButton = that.navButtons.locate("next"),
            showSelector = that.options.styles.show;

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        fluid.each(panelsVisibility, function (panelSelectors, visibility) {
            fluid.each(panelSelectors, function (selector) {
                var isVisible = visibility === "isVisible" ? true : false;
                gpii.tests.firstDiscovery.hasClass(selector, prefsEditorContainer.find(selector), that.options.styles.currentPanel, isVisible);
            });
        });

        gpii.tests.firstDiscovery.hasClass("the back button", backButton, showSelector, backVisible);
        gpii.tests.firstDiscovery.hasClass("the next button", nextButton, showSelector, nextVisible);
    };

    gpii.tests.firstDiscovery.testNavButtons = function (that) {
        jqUnit.expect(30);

        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        // Test the initial panel
        jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
        jqUnit.assertNotUndefined("The subcomponent \"navButtons\" has been instantiated", that.navButtons);
        gpii.tests.firstDiscovery.verifyStates(that, 1, false, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [".gpiic-fd-prefsEditor-panel-tts", ".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the next button leads to the 2nd panel
        nextButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 2, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-tts"],
            notVisible: [".gpiic-fd-prefsEditor-panel-lang", ".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the back button brings back the first panel
        backButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 1, false, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [".gpiic-fd-prefsEditor-panel-tts", ".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Directs to the last panel by firing a change request directly
        that.applier.change("currentPanelNum", 4);
        gpii.tests.firstDiscovery.verifyStates(that, 4, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-contrast"],
            notVisible: [".gpiic-fd-prefsEditor-panel-lang", ".gpiic-fd-prefsEditor-panel-tts", ".gpiic-fd-prefsEditor-panel-size"]
        });
    };

    gpii.tests.firstDiscovery.testTextSize = function (that) {
        jqUnit.expect(3);

        var initialTextSize = that.container.css("font-size");
        jqUnit.assertNotUndefined("The initial text size has been set", initialTextSize);
        that.prefsEditor.gpii_firstDiscovery_panel_textSize.locate("increase").click();
        var sizeAfterIncrease = that.container.css("font-size");
        jqUnit.assertTrue("Clicking on larger button enlarges the text size", sizeAfterIncrease > initialTextSize);
        that.prefsEditor.gpii_firstDiscovery_panel_textSize.locate("decrease").click();
        var sizeAfterDecrease = that.container.css("font-size");
        jqUnit.assertTrue("Clicking on larger button enlarges the text size", sizeAfterDecrease < sizeAfterIncrease);
    };

    gpii.tests.firstDiscovery.runTest("Init and navigation buttons", "#gpiic-fd-navButtonsTests", 1, gpii.tests.firstDiscovery.testNavButtons);
    gpii.tests.firstDiscovery.runTest("Text Size", "#gpiic-fd-textSizeTests", 3, gpii.tests.firstDiscovery.testTextSize);

})(jQuery, fluid);
