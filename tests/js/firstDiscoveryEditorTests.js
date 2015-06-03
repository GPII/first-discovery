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
            onReady: null
        },
        invokers: {
            assembledPrefsEditorGrade: {
                funcName: "gpii.tests.firstDiscovery.getPrefsEditorGrade"
            }
        },
        resetListeners: {
            "onReset.reload": "fluid.identity"
        },
        distributeOptions: [{
            source: "{that}.options.resetListeners",
            target: "{that prefsEditor}.options.listeners"
        }]
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
    gpii.tests.firstDiscovery.runTest = function (msg, container, panelNum, testFunc, gradeName) {
        var gradeNames = fluid.makeArray(gradeName || []);
        jqUnit.asyncTest(msg, function () {
            gpii.tests.firstDiscovery(container, {
                gradeNames: gradeNames,
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

    gpii.tests.firstDiscovery.verifyStates = function (that, currentPanelNum, visibility) {
        var panelIndex = currentPanelNum - 1,
            prefsEditorContainer = that.locate("prefsEditor"),
            backButton = that.nav.navButtons.locate("back"),
            nextButton = that.nav.navButtons.locate("next"),
            activeCss = that.options.styles.active,
            showCss = that.options.styles.show,
            icons = that.nav.navIcons.locate("icon"),
            activeIcon = icons.eq(panelIndex);

        jqUnit.assertEquals("The model value for \"currentPanelNum\" has been set to " + currentPanelNum, currentPanelNum, that.model.currentPanelNum);
        fluid.each(gpii.tests.utils.firstDiscovery.panels, function (selector, idx) {
            var isVisible = idx === panelIndex;
            gpii.tests.utils.hasClass(selector, prefsEditorContainer.find(selector), that.options.styles.currentPanel, isVisible);
        });

        gpii.tests.utils.hasClass("The back button", backButton, showCss, !!visibility.back);
        gpii.tests.utils.hasClass("The next button", nextButton, showCss, !!visibility.next);
        gpii.tests.utils.hasClass("The active icon", activeIcon, activeCss, !!visibility.active);
    };

    gpii.tests.firstDiscovery.testControls = function (that) {
        jqUnit.expect(79);

        // Test the instantiated sub-components
        jqUnit.assertNotUndefined("The subcomponent \"prefsEditor\" has been instantiated", that.prefsEditor);
        jqUnit.assertNotUndefined("The subcomponent \"selfVoicing\" has been instantiated", that.selfVoicing);
        jqUnit.assertNotUndefined("The subcomponent \"helpButton\" has been instantiated", that.helpButton);
        jqUnit.assertNotUndefined("The subcomponent \"nav\" has been instantiated", that.nav);

        var backButton = that.nav.navButtons.locate("back");
        var nextButton = that.nav.navButtons.locate("next");
        var lastPanel = gpii.tests.utils.firstDiscovery.panels.length;

        gpii.tests.firstDiscovery.verifyStates(that, 1, {next: true, active: true});

        // Clicking the next button leads to the 2nd panel
        nextButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 2, {back: true, next: true, active:true});

        // Clicking the back button brings back the first panel
        backButton.click();
        gpii.tests.firstDiscovery.verifyStates(that, 1, {next: true, active: true});

        // Directs to the congrats page by firing a change request directly
        that.applier.change("currentPanelNum", 4);
        gpii.tests.firstDiscovery.verifyStates(that, 4, {back: true, next: true, active: true});

        // Directs to the last panel by firing a change request directly
        that.applier.change("currentPanelNum", lastPanel);
        gpii.tests.firstDiscovery.verifyStates(that, lastPanel, {back: true, active: true});
    };

    fluid.defaults("gpii.tests.firstDiscovery.TTSHookupTest", {
        ttsUtteranceTest: {
            listener: "jqUnit.assertDeepEq",
            args: [
                "The utterance options should be set correctly",
                {
                    lang: "{prefsEditorLoader}.settings.gpii_firstDiscovery_language",
                    rate: "{prefsEditorLoader}.settings.gpii_firstDiscovery_speechRate"
                },
                "{that}.model.utteranceOpts"
            ]
        },
        distributeOptions: {
            source: "{that}.options.ttsUtteranceTest",
            target: "{that selfVoicing}.options.listeners.onCreate"
        }
    });

    gpii.tests.firstDiscovery.testTTSHookup = function (that) {
        jqUnit.expect(2);

        var expected = that.prefsEditor.gpii_firstDiscovery_panel_speakText.msgResolver.lookup(["instructions"]).template;
        var actual = gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that);

        jqUnit.assertEquals("The instruction text should be sourced from the active panel", expected, actual);
    };

    fluid.defaults("gpii.tests.firstDiscovery.reset", {
        resetListeners: {
            "onReset.reload": {
                listener: "jqUnit.assert",
                args: ["The reset should be triggered"],
                "this": null,
                method: null
            }
        }
    });

    gpii.tests.firstDiscovery.testResetShortcut = function () {
        jqUnit.expect(1);

        var eventObj = {
            which: gpii.firstDiscovery.keyboardShortcut.key.r,
            altKey: true,
            ctrlKey: true
        };

        gpii.tests.utils.simulateKeyEvent("body", "keydown", eventObj);
    };

    gpii.tests.firstDiscovery.runTest("Init and navigation controls", "#gpiic-fd-navControlsTests", 1, gpii.tests.firstDiscovery.testControls);
    gpii.tests.firstDiscovery.runTest("TTS Hookup", "#gpiic-fd-ttsHookupTests", 3, gpii.tests.firstDiscovery.testTTSHookup, "gpii.tests.firstDiscovery.TTSHookupTest");
    gpii.tests.firstDiscovery.runTest("Reset Shortcut", "#gpiic-fd-resetShortcutTests", 1, gpii.tests.firstDiscovery.testResetShortcut, "gpii.tests.firstDiscovery.reset");

    // Test the connection between the top level first discovery editor and the language panel: the language panel resets button positions every
    // time when the panel itself becomes visible to accommodate the possible text or control size changes that cause the shift of button positions.
    fluid.defaults("gpii.tests.firstDiscoveryLang", {
        gradeNames: ["gpii.tests.firstDiscovery", "autoInit"],
        components: {
            prefsEditorLoader: {
                options: {
                    listeners: {
                        "onPanelShown.escalate": "{firstDiscoveryLang}.events.onPanelShown"
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

    gpii.tests.firstDiscovery.testDefaultLocale = function (that) {
        var locale = that.prefsEditorLoader.options.defaultLocale;
        jqUnit.assertEquals("default locale is as expected", "en-US", locale);
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
        },{
            name: "Test locales",
            tests: [{
                expect: 1,
                name: "Default Locale",
                sequence: [{
                    func: "gpii.tests.firstDiscovery.testDefaultLocale",
                    args: ["{firstDiscovery}", "{that}"]
                }]
            }]
        }]
    });

    // Re-calculate the nav icon size at text size change
    fluid.defaults("gpii.tests.firstDiscoveryNavIcons", {
        gradeNames: ["gpii.tests.firstDiscovery", "autoInit"],
        components: {
            prefsEditorLoader: {
                options: {
                    listeners: {
                        "onPrefsEditorReady.escalate": "{firstDiscoveryNavIcons}.events.onPrefsEditorReady"
                    }
                }
            }
        },
        events: {
            onPrefsEditorReady: null,
            onPageShown: null
        },
        navIconsModelListeners: {
            listener: "{firstDiscoveryNavIcons}.events.onPageShown",
            priority: "last"
        },
        distributeOptions: {
            source: "{that}.options.navIconsModelListeners",
            target: "{that gpii.firstDiscovery.navIcons}.options.modelListeners.pageNum"
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery.navIconsTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            firstDiscovery: {
                type: "gpii.tests.firstDiscoveryNavIcons",
                container: "#gpiic-fd-recalculateIconSize",
                createOnEvent: "{navIconsTester}.events.onTestCaseStart"
            },
            navIconsTester: {
                type: "gpii.tests.firstDiscovery.navIconsTester"
            }
        }
    });

    gpii.tests.firstDiscovery.testInitIconWidth = function (firstDiscovery, that) {
        that.initialIconWidth = firstDiscovery.prefsEditorLoader.nav.navIcons.model.iconWidth;
        jqUnit.assertTrue("The initial icon size should have been set", that.initialIconWidth > 0);
    };

    gpii.tests.firstDiscovery.testChangedIconWidth = function (that, initialSize) {
        var newSize = that.prefsEditorLoader.nav.navIcons.model.iconWidth;
        jqUnit.assertTrue("The new icon size should have been re-collected", newSize > initialSize);
    };

    fluid.defaults("gpii.tests.firstDiscovery.navIconsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        initialIconWidth: null,
        modules: [{
            name: "Tests the re-collection of the nav icon size at the text size change",
            tests: [{
                expect: 2,
                name: "Re-collect the nav icon size at the text size change",
                sequence: [{
                    listener: "gpii.tests.firstDiscovery.testInitIconWidth",
                    args: ["{firstDiscovery}", "{that}"],
                    priority: "last",
                    event: "{navIconsTests firstDiscovery}.events.onPrefsEditorReady"
                }, {
                    jQueryTrigger: "click",
                    element: "{firstDiscovery}.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_textSize.dom.increase"
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.applier.change",
                    args: ["currentPanelNum", 8]
                }, {
                    listener: "gpii.tests.firstDiscovery.testChangedIconWidth",
                    args: ["{firstDiscovery}", "{that}.initialIconWidth"],
                    priority: "last",
                    event: "{firstDiscovery}.events.onPageShown"
                }]
            }]
        }]
    });

    // TODO Update this test for the new language panel structure and re-enable
    $(document).ready(function () {
        fluid.test.runTests([
            // "gpii.tests.firstDiscovery.langTests",
            "gpii.tests.firstDiscovery.navIconsTests"
        ]);
    });

})(jQuery, fluid);
