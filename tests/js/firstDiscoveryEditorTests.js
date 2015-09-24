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

    fluid.contextAware.makeChecks({"gpii.tests": true});

    fluid.contextAware.makeAdaptation({
        distributionName: "fluid.tests.prefs.tempStoreDistributor",
        targetName: "fluid.prefs.store",
        adaptationName: "strategy",
        checkName: "test",
        record: {
            contextValue: "{gpii.tests}",
            gradeNames: "fluid.prefs.tempStore"
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery", {
        gradeNames: ["{that}.assembledPrefsEditorGrade", "fluid.viewComponent"],
        prefsEditorType: "gpii.firstDiscovery.firstDiscoveryEditor",
        components: {
            prefsEditorLoader: {
                options: {
                    listeners: {
                        "onPrefsEditorReady.escalate": {
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
            "afterReset.reload": "fluid.identity"
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
                "terms": {
                    "templatePrefix": "../../src/html/",
                    "messagePrefix": "../../src/messages/"
                },
                "template": "../../src/html/firstDiscovery.html"
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
                        priority: "before:startTest"
                    },
                    "onReady.startTest": {
                        listener: "jqUnit.start",
                        priority: "last:testing"
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

    gpii.tests.firstDiscovery.testTTSHookup = function (that) {
        jqUnit.expect(2);

        var expected = {
            lang: that.settings.preferences.gpii_firstDiscovery_language,
            rate: that.settings.preferences.gpii_firstDiscovery_speechRate
        };

        jqUnit.assertDeepEq("The utterance options should be set correctly", expected, that.selfVoicing.model.utteranceOpts);

        var actual = gpii.firstDiscovery.tts.prefsEditor.getCurrentPanelInstructions(that);
        expected = that.prefsEditor.gpii_firstDiscovery_panel_speakText.msgResolver.lookup(["instructions"]).template;

        jqUnit.assertEquals("The instruction text should be sourced from the active panel", expected, actual);
    };

    fluid.defaults("gpii.tests.firstDiscovery.reset", {
        resetListeners: {
            "afterReset.reload": {
                listener: "jqUnit.assert",
                args: ["The reset should be triggered"],
                "this": null,
                method: null
            }
        }
    });

    gpii.tests.firstDiscovery.testResetShortcut = function () {
        jqUnit.expect(1);

        gpii.tests.utils.simulateKeyEvent("body", "keydown", gpii.firstDiscovery.keyboardShortcut.key.r, {ctrlKey: true, altKey: true});
    };

    gpii.tests.firstDiscovery.runTest("Init and navigation controls", "#gpiic-fd-navControlsTests", 1, gpii.tests.firstDiscovery.testControls);
    gpii.tests.firstDiscovery.runTest("TTS Hookup", "#gpiic-fd-ttsHookupTests", 3, gpii.tests.firstDiscovery.testTTSHookup);
    gpii.tests.firstDiscovery.runTest("Reset Shortcut", "#gpiic-fd-resetShortcutTests", 1, gpii.tests.firstDiscovery.testResetShortcut, "gpii.tests.firstDiscovery.reset");

    // Test the connection between the top level first discovery editor and the language panel: the language panel resets button positions every
    // time when the panel itself becomes visible to accommodate the possible text or control size changes that cause the shift of button positions.
    fluid.defaults("gpii.tests.initialModelForLangTests", {
        gradeNames: ["fluid.component"],
        members: {
            initialModel: {
                preferences: {
                    gpii_firstDiscovery_language: "nl-NL"
                }
            }
        }
    });

    fluid.defaults("gpii.tests.firstDiscoveryLang", {
        gradeNames: ["gpii.tests.firstDiscovery"],
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
            langButtonsReady: null
        },
        distributeOptions: [{
            target: "{that gpii.firstDiscovery.panel.lang}.options.listeners",
            record: {
                "langButtonsReady.escalate": "{firstDiscoveryLang}.events.langButtonsReady"
            }
        }, {
            target: "{that > prefsEditorLoader}.options.gradeNames",
            record: "gpii.tests.initialModelForLangTests"
        }]
    });

    fluid.defaults("gpii.tests.firstDiscovery.langTests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            firstDiscovery: {
                type: "gpii.tests.firstDiscoveryLang",
                container: "#gpiic-fd-langTests",
                createOnEvent: "{langTester}.events.onTestCaseStart",
                options: {
                    // The work around for an issue in the IoC testing framework (http://issues.fluidproject.org/browse/FLUID-5633)
                    // that IoCSS-broadcast listeners are not un-bound so that in test sequences, the event reference can use
                    // "{langTests}.events.langButtonsReady" instead of the IoCSS reference "{langTests firstDiscoveryLang}.events.langButtonsReady"
                    events: {
                        langButtonsReady: "{langTests}.events.langButtonsReady"
                    }
                }
            },
            langTester: {
                type: "gpii.tests.firstDiscovery.langTester"
            }
        },
        events: {
            langButtonsReady: null
        }
    });

    gpii.tests.firstDiscovery.testInitialScrolling = function (that, testData) {
        testData.scrollTop = that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.locate("controlsDiv")[0].scrollTop;
        jqUnit.assertTrue("The control div is scrolled", testData.scrollTop > 0);
    };

    gpii.tests.firstDiscovery.testScrollingAtHidden = function (that) {
        var scrollTop = that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.locate("controlsDiv")[0].scrollTop;
        jqUnit.assertTrue("The control div is scrolled", scrollTop === 0);
    };

    gpii.tests.firstDiscovery.testScrollingAtVisible = function (that, testData) {
        var scrollTop = that.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_lang.locate("controlsDiv")[0].scrollTop;
        jqUnit.assertTrue("The control div is scrolled", scrollTop > 0);
        jqUnit.assertFalse("The scrolled distance is different from the initial distance", scrollTop === testData.scrollTop);
    };

    gpii.tests.firstDiscovery.testDefaultLocale = function (that) {
        var locale = that.prefsEditorLoader.options.defaultLocale;
        jqUnit.assertEquals("default locale is as expected", "en-US", locale);
    };

    fluid.defaults("gpii.tests.firstDiscovery.langTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testData: {
            scrollTop: null
        },
        modules: [{
            name: "The language panel",
            tests: [{
                expect: 4,
                name: "Test the connection between the first discovery editor and the language panel",
                sequence: [{
                    listener: "gpii.tests.firstDiscovery.testInitialScrolling",
                    args: ["{firstDiscovery}", "{that}.options.testData"],
                    priority: "last",
                    event: "{langTests}.events.langButtonsReady"
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.applier.change",
                    args: ["currentPanelNum", 2]
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.prefsEditor.gpii_firstDiscovery_panel_textSize.applier.change",
                    args: ["value", 0.2]
                }, {
                    // The controls div cannot be scrolled when it remains hidden
                    listener: "gpii.tests.firstDiscovery.testScrollingAtHidden",
                    args: ["{firstDiscovery}"],
                    event: "{langTests}.events.langButtonsReady"
                }, {
                    func: "{firstDiscovery}.prefsEditorLoader.applier.change",
                    args: ["currentPanelNum", 1]
                }, {
                    // The language panel is re-rendered and the controls div is scrolled when the panel becomes visible
                    listener: "gpii.tests.firstDiscovery.testScrollingAtVisible",
                    args: ["{firstDiscovery}", "{that}.options.testData"],
                    event: "{langTests}.events.langButtonsReady"
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
        gradeNames: ["gpii.tests.firstDiscovery"],
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
        gradeNames: ["fluid.test.testEnvironment"],
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
        gradeNames: ["fluid.test.testCaseHolder"],
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

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.firstDiscovery.langTests",
            "gpii.tests.firstDiscovery.navIconsTests"
        ]);
    });

})(jQuery, fluid);
