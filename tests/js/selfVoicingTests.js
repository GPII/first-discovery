/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.firstDiscovery.selfVoicing", {
        gradeNames: ["fluid.mock.textToSpeech", "gpii.firstDiscovery.selfVoicing"],
        model: {
            enabled: false
        },
        invokers: {
            queueSpeechImpl: {
                funcName: "fluid.mock.textToSpeech.queueSpeech",
                args: ["{that}", "{that}.handleStart", "{that}.handleEnd", "{that}.speechRecord", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            // Need to manually reapply the mock override of the cancel method,
            // as it was overwritten by the grade merging. Unfortunately both
            // the fluid.mock.textToSpeech and gpii.firstDiscovery.selfVoicing
            // provide overrides for parts of fluid.textToSpeech.
            cancel: {
                funcName: "fluid.mock.textToSpeech.cancel",
                args: ["{that}", "{that}.handleEnd"]
            }
        }
    });

    fluid.defaults("gpii.tests.selfVoicingTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            selfVoicing: {
                type: "gpii.tests.firstDiscovery.selfVoicing"
            },
            selfVoicingTester: {
                type: "gpii.tests.selfVoicingTester"
            }
        }
    });

    fluid.defaults("gpii.tests.selfVoicingTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testOptions: {
            forcedSpeech: {
                text: "forced speech",
                interrupt: true
            },
            enabledSpeech: {
                text: "enabled speech",
                interrupt: true
            },
            queuedSpeech: {
                text: "queueud speech",
                interrupt: false,
                options: {
                    queue: true
                }
            }
        },
        modules: [{
            name: "Tests the selfVoicing component",
            tests: [{
                expect: 4,
                name: "Test queueSpeech",
                sequence: [{
                    func: "{selfVoicing}.queueSpeech",
                    args: ["{that}.options.testOptions.forcedSpeech.text", null, true]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["Speaking should have occured - enabled: false, force: true", "{that}.options.testOptions.forcedSpeech", "{selfVoicing}.speechRecord.0"],
                    event: "{selfVoicing}.events.onStop"
                }, {
                    func: "{selfVoicing}.applier.change",
                    args: ["enabled", true]
                }, {
                    listener: "jqUnit.assertTrue",
                    args: ["The selfVoicing should be enabled", "{selfVoicing}.model.enabled"],
                    spec: {path: "enabled", priority: "last"},
                    changeEvent: "{selfVoicing}.applier.modelChanged"
                }, {
                    func: "{selfVoicing}.queueSpeech",
                    args: ["{that}.options.testOptions.enabledSpeech.text"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["Speaking should have occured - enabled: true", "{that}.options.testOptions.enabledSpeech", "{selfVoicing}.speechRecord.1"],
                    event: "{selfVoicing}.events.onStop"
                }, {
                    func: "{selfVoicing}.queueSpeech",
                    args: ["{that}.options.testOptions.queuedSpeech.text", {queue: true}]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["Speaking should have been queued", "{that}.options.testOptions.queuedSpeech", "{selfVoicing}.speechRecord.2"],
                    event: "{selfVoicing}.events.onStop"
                }]
            }]
        }]
    });

    jqUnit.test("gpii.firstDiscovery.selfVoicingToggle.setLabel", function () {
        var elm = $(".setLabel-test");
        var testStrings = {
            muted: "muted",
            unmuted: "unmuted"
        };

        gpii.firstDiscovery.selfVoicingToggle.setLabel(elm, testStrings.unmuted, testStrings.muted, true);
        jqUnit.assertEquals("The unmute label should be applied", testStrings.unmuted, elm.text());

        gpii.firstDiscovery.selfVoicingToggle.setLabel(elm, testStrings.unmuted, testStrings.muted, false);
        jqUnit.assertEquals("The mute label should be applied", testStrings.muted, elm.text());
    });

    jqUnit.test("gpii.firstDiscovery.selfVoicingToggle.setMuteStyle", function () {
        var elm = $(".setMuteStyle-test");
        var testStyles = {
            muted: ".muted",
            unmuted: ".unmuted"
        };

        gpii.firstDiscovery.selfVoicingToggle.setMuteStyle(elm, testStyles, true);
        jqUnit.assertTrue("The unmuted class should be applied", elm.hasClass(testStyles.unmuted));
        jqUnit.assertFalse("The muted class should not be applied", elm.hasClass(testStyles.muted));

        gpii.firstDiscovery.selfVoicingToggle.setMuteStyle(elm, testStyles, false);
        jqUnit.assertTrue("The muted class should be applied", elm.hasClass(testStyles.muted));
        jqUnit.assertFalse("The unmuted class should not be applied", elm.hasClass(testStyles.unmuted));
    });

    fluid.defaults("gpii.tests.firstDiscovery.selfVoicingToggle", {
        gradeNames: ["gpii.firstDiscovery.selfVoicingToggle"],
        members: {
            speakVoiceStateCalled: false
        },
        model: {
            enabled: false
        },
        messageBase: {
            "unmuted": "turn voice OFF",
            "unmutedTooltip": "Select to turn voice off",
            "unmutedMsg": "voice is on",
            "muted": "turn voice ON",
            "mutedTooltip": "Select to turn voice on",
            "mutedMsg": "voice is off"
        },
        invokers: {
            speakVoiceState: {
                funcName: "fluid.set",
                args: ["{that}", ["speakVoiceStateCalled"], true]
            }
        }
    });

    fluid.defaults("gpii.tests.selfVoicingToggleTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            selfVoicingToggle: {
                type: "gpii.tests.firstDiscovery.selfVoicingToggle",
                container: ".gpiic-fd-selfVoicingToggle"
            },
            selfVoicingTester: {
                type: "gpii.tests.selfVoicingToggleTester"
            }
        }
    });

    fluid.defaults("gpii.tests.selfVoicingToggleTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        invokers: {
            testRendering: {
                funcName: "gpii.tests.selfVoicingTester.testRendering",
                args: ["{selfVoicingToggle}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            testMuted: {
                funcName: "gpii.tests.selfVoicingTester.testMuted",
                args: ["{that}", "{selfVoicingToggle}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        },
        modules: [{
            name: "Tests the selfVoicing component",
            tests: [{
                expect: 5,
                name: "Test Init",
                type: "test",
                func: "{that}.testRendering",
                args: ["{selfVoicingToggle}.options.messageBase.muted", "{selfVoicingToggle}.options.messageBase.mutedTooltip", "{selfVoicingToggle}.options.styles.muted"]
            }, {
                expect: 6,
                name: "Test interaction",
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{selfVoicingToggle}.dom.mute"
                }, {
                    listener: "{that}.testRendering",
                    args: ["{selfVoicingToggle}.options.messageBase.unmuted", "{selfVoicingToggle}.options.messageBase.unmutedTooltip", "{selfVoicingToggle}.options.styles.unmuted"],
                    spec: {path: "enabled", priority: "last"},
                    changeEvent: "{selfVoicingToggle}.applier.modelChanged"
                }, {
                    func: "jqUnit.assertTrue",
                    args: ["The speakVoiceState method should have been called", "{selfVoicingToggle}.speakVoiceStateCalled"]
                }]
            }]
        }]
    });

    gpii.tests.selfVoicingTester.testRendering = function (that, label, tooltipContent, cssClass) {
        var mute = that.locate("mute");
        var muteId = mute.attr("id");
        jqUnit.assertEquals("The label should be set correctly", label, that.locate("muteLabel").text());
        jqUnit.assertEquals("The tooltip text should be set correctly", tooltipContent, that.tooltip.model.idToContent[muteId]);
        jqUnit.assertTrue("The class should be applied to the container", that.container.hasClass(cssClass));
        jqUnit.assertEquals("The aria button role should be set", "button", mute.attr("role"));
        jqUnit.assertEquals("The aria pressed state should be set correctly", that.model.enabled.toString(), mute.attr("aria-pressed"));
    };

    gpii.tests.selfVoicingTester.testMuted = function (that, selfVoicing, label, tooltipContent, cssClass) {
        that.testRendering(label, tooltipContent, cssClass);
        var lastSpokenIdx = selfVoicing.queueRecord.length - 1;
        jqUnit.assertEquals("The muted message should be spoken", selfVoicing.options.messageBase.mutedMsg, selfVoicing.queueRecord[lastSpokenIdx]);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.selfVoicingTest",
            "gpii.tests.selfVoicingToggleTest"
        ]);
    });

})(jQuery, fluid);
