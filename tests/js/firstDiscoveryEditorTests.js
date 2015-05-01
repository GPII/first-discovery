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
    // 1. language, 2. welcome, 3. audio, 4. text size, 5. contrast
    gpii.tests.firstDiscovery.runTest = function (msg, container, panelNum, testFunc) {
        jqUnit.asyncTest(msg, function () {
            gpii.tests.firstDiscovery(container, {
                components: {
                    prefsEditorLoader: {
                        options: {
                            model: {
                                currentPanelNum: panelNum
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

    gpii.tests.firstDiscovery.verifyStates = function (that, currentPanelNum, backVisible, nextVisible, activeVisible, panelsVisibility) {
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
        gpii.tests.utils.hasClass("The active icon", activeIcon, activeCss, activeVisible);
    };

    gpii.tests.firstDiscovery.testControls = function (that) {
        jqUnit.expect(49);

        var backButton = that.navButtons.locate("back");
        var nextButton = that.navButtons.locate("next");

        // Test the instantiated sub-components
        jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
        jqUnit.assertNotUndefined("The subcomponent \"navButtons\" has been instantiated", that.navButtons);
        jqUnit.assertNotUndefined("The subcomponent \"navIcons\" has been instantiated", that.navIcons);
        gpii.tests.firstDiscovery.verifyStates(that, gpii.tests.firstDiscovery.panelNums.lang, false, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [".gpiic-fd-prefsEditor-panel-welcome", ".gpiic-fd-prefsEditor-panel-speakText", ".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the next button leads to the 2nd panel
        nextButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, gpii.tests.firstDiscovery.panelNums.welcome, true, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-welcome"],
            notVisible: [".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-lang", ".gpiic-fd-prefsEditor-panel-speakText", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Clicking the back button brings back the first panel
        backButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, gpii.tests.firstDiscovery.panelNums.lang, false, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-lang"],
            notVisible: [".gpiic-fd-prefsEditor-panel-welcome", ".gpiic-fd-prefsEditor-panel-speakText", ".gpiic-fd-prefsEditor-panel-size", ".gpiic-fd-prefsEditor-panel-contrast"]
        });

        // Directs to the last panel by firing a change request directly
        that.applier.change("currentPanelNum", gpii.tests.firstDiscovery.panelNums.contrast);
        gpii.tests.firstDiscovery.verifyStates(that, gpii.tests.firstDiscovery.panelNums.contrast, true, true, true, {
            isVisible: [".gpiic-fd-prefsEditor-panel-contrast"],
            notVisible: [".gpiic-fd-prefsEditor-panel-lang", ".gpiic-fd-prefsEditor-panel-welcome", ".gpiic-fd-prefsEditor-panel-speakText", ".gpiic-fd-prefsEditor-panel-size"]
        });

        // Directs to the congrats page by firing a change request directly
        that.applier.change("currentPanelNum", gpii.tests.firstDiscovery.panelNums.congrats);
        gpii.tests.firstDiscovery.verifyStates(that, gpii.tests.firstDiscovery.panelNums.congrats, true, false, false, {
            isVisible: [".gpiic-fd-prefsEditor-panel-congratulations"],
            notVisible: [".gpiic-fd-prefsEditor-panel-contrast", ".gpiic-fd-prefsEditor-panel-lang", ".gpiic-fd-prefsEditor-panel-welcome", ".gpiic-fd-prefsEditor-panel-speakText", ".gpiic-fd-prefsEditor-panel-size"]
        });
    };

    gpii.tests.firstDiscovery.testTTSHookup = function (that) {
        jqUnit.expect(1);

        var expected = that.prefsEditor.gpii_firstDiscovery_panel_textSize.msgResolver.lookup(["rangeInstructions"]).template;
        var actual = gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that);

        jqUnit.assertEquals("The instruction text should be sourced from the active panel", expected, actual);
    };

    gpii.tests.firstDiscovery.runTest("Init and navigation controls", "#gpiic-fd-navControlsTests", 1, gpii.tests.firstDiscovery.testControls);
    gpii.tests.firstDiscovery.runTest("TTS Hookup", "#gpiic-fd-ttsHookupTests", 3, gpii.tests.firstDiscovery.testTTSHookup);

    // Test the connection between the top level first discovery editor and the language panel: the language panel resets button positions every
    // time when the panel itself becomes visible to accommodate the possible text or control size changes that cause the shift of button positions.
    fluid.defaults("gpii.tests.firstDiscoveryLang", {
        gradeNames: ["gpii.tests.firstDiscovery", "autoInit"],
        components: {
            prefsEditorLoader: {
                options: {
                    listeners: {
                        "onPanelShown.escalate": "{firstDiscoveryLang}.events.onPanelShown"
                    },
                    components: {
                        selfVoicing: {
                            options: {
                                // Override queueSpeech() to work around this issue: http://issues.fluidproject.org/browse/FLOE-304
                                invokers: {
                                    queueSpeech: "fluid.identity"
                                }
                            }
                        }
                    }

                }
            }
        },
        events: {
            onPanelShown: null,
            onButtonTopsReady: null
        },
        langListeners: {
            "onButtonTopsReady.escalate": "{firstDiscoveryLang}.events.onButtonTopsReady"
        },
        distributeOptions: {
            source: "{that}.options.langListeners",
            target: "{that gpii.firstDiscovery.panel.lang}.options.listeners"
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery.langTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            firstDiscovery: {
                type: "gpii.tests.firstDiscoveryLang",
                container: "#gpiic-fd-langTests",
                createOnEvent: "{langTester}.events.onTestCaseStart",
                options: {
                    // The work around for an issue in the IoC testing framework (http://issues.fluidproject.org/browse/FLUID-5633)
                    // that IoCSS-broadcast listeners are not un-bound so that in test sequences, the event reference can use
                    // "{langTests}.events.onButtonTopsReady" instead of the IoCSS reference "{langTests firstDiscoveryLang}.events.onButtonTopsReady"
                    events: {
                        onButtonTopsReady: "{langTests}.events.onButtonTopsReady"
                    }
                }
            },
            langTester: {
                type: "gpii.tests.firstDiscovery.langTester"
            }
        },
        events: {
            onButtonTopsReady: null
        }
    });

    gpii.tests.firstDiscovery.testInitButtonTops = function (that, tester) {
        tester.buttonTops = that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.buttonTops;
        jqUnit.assertNotUndefined("The initial button positions have been collected", tester.buttonTops);
    };

    gpii.tests.firstDiscovery.testUnchangedButtonTops = function (that, initialButtonTops) {
        jqUnit.assertDeepEq("The button positions stay unchanged", initialButtonTops, that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.buttonTops);
    };

    gpii.tests.firstDiscovery.testChangedButtonTops = function (that, initialButtonTops) {
        var newButtonTops = that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.buttonTops;
        fluid.each(newButtonTops, function (newPosition, index){
            jqUnit.assertNotEquals("The position for button #" + index + " has been re-collected", initialButtonTops[index], newPosition);
        });
    };

    fluid.defaults("gpii.tests.firstDiscovery.langTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testData: {
            buttonTops: null
        },
        modules: [{
            name: "Tests the connection between the first discovery editor and the language panel",
            tests: [{
                expect: 5,
                name: "Initialization",
                sequence: [{
                    listener: "gpii.tests.firstDiscovery.testInitButtonTops",
                    args: ["{firstDiscovery}", "{that}"],
                    event: "{langTests}.events.onButtonTopsReady"
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.applier.change",
                    args: ["currentPanelNum", 3]
                }, {
                    listener: "gpii.tests.firstDiscovery.testUnchangedButtonTops",
                    args: ["{firstDiscovery}", "{that}.buttonTops"],
                    event: "{firstDiscovery}.events.onPanelShown"
                }, {
                    jQueryTrigger: "click",
                    element: "{firstDiscovery}.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_textSize.dom.increase"
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.applier.change",
                    args: ["currentPanelNum", 1]
                }, {
                    listener: "gpii.tests.firstDiscovery.testChangedButtonTops",
                    args: ["{firstDiscovery}", "{that}.buttonTops"],
                    event: "{langTests}.events.onButtonTopsReady"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.firstDiscovery.langTests"
        ]);
    });

})(jQuery, fluid);
