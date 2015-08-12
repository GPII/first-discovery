/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.tts.fdHookup");

    jqUnit.asyncTest("test 'gpii.firstDiscovery.tts.tooltipHookup.speakTooltip' method", function () {
        jqUnit.expect(4);

        var mockNoLang = {
            speak: function (text, options) {
                jqUnit.assertEquals("The text should be passed in correctly.", "No lang", text);
                jqUnit.assertDeepEq("The options should be set correctly", {lang: undefined}, options);
            }
        };

        var mockLang = {
            speak: function (text, options) {
                jqUnit.assertEquals("The text should be passed in correctly.", "lang set", text);
                jqUnit.assertDeepEq("The options should be set correctly", {lang: "en-US"}, options);
                jqUnit.start();
            }
        };

        gpii.firstDiscovery.tts.tooltipHookup.speakTooltip(mockNoLang, $("#tooltipNoLang"));
        gpii.firstDiscovery.tts.tooltipHookup.speakTooltip(mockLang, $("#tooltipLang"));
    });

    fluid.defaults("gpii.tests.mock.firstDiscoveryEditor", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        selectors: {
            panel: ".gpiic-fd-prefsEditor-panel"
        },
        model: {
            currentPanelNum: 1
        },
        components: {
            selfVoicing: {
                type: "fluid.standardComponent",
                options: {
                    gradeNames: ["gpii.firstDiscovery.msgLookup"],
                    model: {
                        enabled: true
                    },
                    messageBase: {
                        "stepCountMsg": "Step %currentPanel of %numPanels",
                        "panelMsg": "This is %stepCountMsg. %instructions Press 'h' for help."
                    },
                    invokers: {
                        queueSpeech: "{firstDiscoveryEditor}.events.onTestQueueSpeech.fire"
                    }
                }
            }
        },
        events: {
            onTestQueueSpeech: null
        },
        listeners: {
            "onCreate.setPanels": {
                listener: "fluid.set",
                args: ["{that}", "panels", "{that}.dom.panel"],
                priority: "first"
            }
        }
    });

    fluid.defaults("gpii.tests.firstDiscovery.tts.fdHookup", {
        gradeNames: ["gpii.tests.mock.firstDiscoveryEditor", "gpii.firstDiscovery.tts.fdHookup", "autoInit"]
    });

    fluid.defaults("gpii.tests.fdHookupTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            fdHookup: {
                type: "gpii.tests.firstDiscovery.tts.fdHookup",
                container: ".gpiic-tests-firstDiscovery-tts-fdHookup"
            },
            ttsHookupTester: {
                type: "gpii.tests.ttsHookupTester"
            }
        }
    });

    fluid.defaults("gpii.tests.ttsHookupTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the fdHookup component",
            tests: [
                {
                    expect: 3,
                    name: "Test the gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions function",
                    sequence: [
                        {
                            // Panel 1 has a single instruction
                            func: "gpii.tests.ttsHookupTester.verifyGetCurrentPanelInstructions",
                            args: ["{fdHookup}", "Test Instructions"]
                        },
                        {
                            func: "{fdHookup}.applier.change",
                            args: ["currentPanelNum", 2]
                        },
                        {
                            // Panel 2 has multiple instructions
                            func: "gpii.tests.ttsHookupTester.verifyGetCurrentPanelInstructions",
                            args: ["{fdHookup}", "instruction element one. instruction element two"]
                        },
                        {
                            func: "{fdHookup}.applier.change",
                            args: ["currentPanelNum", 3]
                        },
                        {
                            // Panel 3 has no instructions
                            func: "gpii.tests.ttsHookupTester.verifyGetCurrentPanelInstructions",
                            args: ["{fdHookup}", ""]
                        }
                    ]
                },
                {
                    expect: 6,
                    name: "TTS message tests",
                    sequence: [
                        // Move back to the first panel
                        {
                            func: "{fdHookup}.applier.change",
                            args: ["currentPanelNum", 1]
                        },
                        {
                            func: "{fdHookup}.selfVoicing.speakPanelMessage",
                            args: [{queue: false}]
                        },
                        {
                            listener: "gpii.tests.ttsHookupTester.assertSpeak",
                            args: [
                                "message",
                                {
                                    text: "This is Step 1 of 3. Test Instructions Press 'h' for help.",
                                    opts: {queue: false}
                                },
                                {
                                    text: "{arguments}.0",
                                    opts: "{arguments}.1"
                                }
                            ],
                            event: "{fdHookup}.events.onTestQueueSpeech"
                        },
                        {
                            func: "{fdHookup}.selfVoicing.speakPanelInstructions",
                            args: [{queue: false}]
                        },
                        {
                            listener: "gpii.tests.ttsHookupTester.assertSpeak",
                            args: [
                                "instructions",
                                {
                                    text: "Test Instructions",
                                    opts: {queue: false}
                                },
                                {
                                    text: "{arguments}.0",
                                    opts: "{arguments}.1"
                                }
                            ],
                            event: "{fdHookup}.events.onTestQueueSpeech"
                        },
                        {
                            func: "gpii.tests.utils.simulateKeyEvent",
                            args: ["body", "keydown", gpii.firstDiscovery.keyboardShortcut.key.h]
                        },
                        {
                            listener: "gpii.tests.ttsHookupTester.assertSpeak",
                            args: [
                                "instructions",
                                {
                                    text: "Test Instructions"
                                },
                                {
                                    text: "{arguments}.0",
                                    opts: "{arguments}.1"
                                }
                            ],
                            event: "{fdHookup}.events.onTestQueueSpeech"
                        }
                    ]
                }
            ]
        }]
    });

    gpii.tests.ttsHookupTester.verifyGetCurrentPanelInstructions = function (that, expected) {
        jqUnit.assertEquals("The current panel instructions should be retrieved correctly", expected, gpii.firstDiscovery.tts.fdHookup.getCurrentPanelInstructions(that));
    };

    gpii.tests.ttsHookupTester.assertSpeak = function (textType, expected, actual) {
        jqUnit.assertEquals("The correct " + textType + " for the panel should be sent to the TTS", expected.text, actual.text);
        jqUnit.assertDeepEq("The correct " + textType + " for the panel should be sent to the TTS", expected.opts, actual.opts);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.fdHookupTests"
        ]);
    });

})(jQuery, fluid);
