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
                        onPrefsEditorReady: {
                            listener: "{firstDiscovery}.events.onReady",
                            priority: "last"
                        }
                    },
                    components: {
                        selfVoicing: {
                            options: {
                                utteranceOpts: {
                                    volume: 0
                                }
                            }
                        }
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

    gpii.tests.firstDiscovery.verifyStates = function (that, currentPanelNum, backVisible, nextVisible, activeIconVisible, panelsVisibility) {
        var prefsEditorContainer = that.locate("prefsEditor"),
            backButton = that.navButtons.locate("back"),
            nextButton = that.navButtons.locate("next"),
            activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            icons = that.navIcons.locate("icon"),
            activeIcon = icons.eq(currentPanelNum - 1);

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        fluid.each(panelsVisibility, function (panelSelectors, visibility) {
            fluid.each(panelSelectors, function (selector) {
                var isVisible = visibility === "isVisible" ? true : false;
                gpii.tests.utils.hasClass(selector, prefsEditorContainer.find(selector), that.options.styles.currentPanel, isVisible);
            });
        });

        gpii.tests.utils.hasClass("The back button", backButton, showCss, backVisible);
        gpii.tests.utils.hasClass("The next button", nextButton, showCss, nextVisible);
        gpii.tests.utils.hasClass("The active icon", activeIcon, activeCss, activeIconVisible);
    };

    gpii.tests.firstDiscovery.testControlss = function (that) {
        jqUnit.expect(43);

        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        // Test the instantiated sub-components
        jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
        jqUnit.assertNotUndefined("The subcomponent \"navButtons\" has been instantiated", that.navButtons);
        jqUnit.assertNotUndefined("The subcomponent \"navIcons\" has been instantiated", that.navIcons);
        gpii.tests.firstDiscovery.verifyStates(that, 1, false, true, true, {

            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [
                ".gpiic-fd-prefsEditor-panel-size",
                ".gpiic-fd-prefsEditor-panel-speakText",
                ".gpiic-fd-prefsEditor-panel-contrast",
                ".gpiic-fd-prefsEditor-panel-keyboard",
                ".gpiic-fd-prefsEditor-panel-congratulations"
            ]
        });

        // Clicking the next button leads to the 2nd panel
        nextButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 2, true, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-size"],
            notVisible: [
                ".gpiic-fd-prefsEditor-panel-lang",
                ".gpiic-fd-prefsEditor-panel-speakText",
                ".gpiic-fd-prefsEditor-panel-contrast",
                ".gpiic-fd-prefsEditor-panel-keyboard",
                ".gpiic-fd-prefsEditor-panel-congratulations"
            ]
        });

        // Clicking the back button brings back the first panel
        backButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 1, false, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [
                ".gpiic-fd-prefsEditor-panel-size",
                ".gpiic-fd-prefsEditor-panel-speakText",
                ".gpiic-fd-prefsEditor-panel-contrast",
                ".gpiic-fd-prefsEditor-panel-keyboard",
                ".gpiic-fd-prefsEditor-panel-congratulations"
            ]
        });

        // Directs to the last panel by firing a change request directly
        that.applier.change("currentPanelNum", 6);
        gpii.tests.firstDiscovery.verifyStates(that, 6, false, false, false, {
            isVisible: [".gpiic-fd-prefsEditor-panel-congratulations"],
            notVisible: [
                ".gpiic-fd-prefsEditor-panel-lang",
                ".gpiic-fd-prefsEditor-panel-size",
                ".gpiic-fd-prefsEditor-panel-speakText",
                ".gpiic-fd-prefsEditor-panel-contrast",
                ".gpiic-fd-prefsEditor-panel-keyboard"
            ]
        });
    };

    gpii.tests.firstDiscovery.getFontSize = function (elm) {
        return parseFloat(elm.css("font-size"));
    };

    gpii.tests.firstDiscovery.testTextSize = function (that) {
        jqUnit.expect(3);

        var initialTextSize = gpii.tests.firstDiscovery.getFontSize(that.container);
        jqUnit.assertNotUndefined("The initial text size has been set", initialTextSize);
        that.prefsEditor.gpii_firstDiscovery_panel_textSize.locate("increase").click();
        var sizeAfterIncrease = gpii.tests.firstDiscovery.getFontSize(that.container);
        jqUnit.assertTrue("Clicking on larger button enlarges the text size", sizeAfterIncrease > initialTextSize);
        that.prefsEditor.gpii_firstDiscovery_panel_textSize.locate("decrease").click();
        var sizeAfterDecrease = gpii.tests.firstDiscovery.getFontSize(that.container);
        jqUnit.assertTrue("Clicking on smaller button shrinks the text size", sizeAfterDecrease < sizeAfterIncrease);
    };

    gpii.tests.firstDiscovery.testTTSHookup = function (that) {
        jqUnit.expect(1);

        var expected = that.prefsEditor.gpii_firstDiscovery_panel_textSize.msgResolver.lookup(["rangeInstructions"]).template;
        var actual = gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that);

        jqUnit.assertEquals("The instruction text should be sourced from the active panel", expected, actual);
    };

    gpii.tests.firstDiscovery.runTest("Init and navigation controls", "#gpiic-fd-navControlsTests", 1, gpii.tests.firstDiscovery.testControlss);
    gpii.tests.firstDiscovery.runTest("Text Size", "#gpiic-fd-textSizeTests", 2, gpii.tests.firstDiscovery.testTextSize);
    gpii.tests.firstDiscovery.runTest("TTS Hookup", "#gpiic-fd-ttsHookupTests", 2, gpii.tests.firstDiscovery.testTTSHookup);

})(jQuery, fluid);
