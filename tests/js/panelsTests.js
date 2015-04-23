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

    /************
     * textSize *
     ************/

    fluid.defaults("gpii.tests.prefs.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.textSize", "autoInit"],
        messageBase: {
            rangeInstructions: "Text size instructions.",
            increaseLabel: "larger",
            decreaseLabel: "smaller"
        },
        model: {
            value: 1
        }
    });

    fluid.defaults("gpii.tests.textSizePanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            textSize: {
                type: "gpii.tests.prefs.panel.textSize",
                container: ".gpiic-fd-textSize"
            },
            textSizeTester: {
                type: "gpii.tests.textSizeTester"
            }
        }
    });

    fluid.defaults("gpii.tests.textSizeTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            increasedStep: 1.1,
            decreasedStep: 1.0,
            testValue: 1.5
        },
        modules: [{
            name: "Test the text sizer settings panel",
            tests: [{
                expect: 13,
                name: "Test the rendering of the text size panel",
                sequence: [{
                    func: "{textSize}.refreshView"
                }, {
                    listener: "gpii.tests.textSizeTester.verifyRendering",
                    priority: "last",
                    event: "{textSize}.events.afterRender"
                }, {
                    func: "{textSize}.stepUp"
                }, {
                    listener: "gpii.tests.textSizeTester.verifyModel",
                    args: ["{textSize}", "{that}.options.testOptions.increasedStep"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.stepDown"
                }, {
                    listener: "gpii.tests.textSizeTester.verifyModel",
                    args: ["{textSize}", "{that}.options.testOptions.decreasedStep"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.applier.change",
                    args: ["value", "{textSize}.options.range.max"]
                }, {
                    listener: "gpii.tests.textSizeTester.verifyButtonStates",
                    args: ["{textSize}", true, false],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.applier.change",
                    args: ["value", "{textSize}.options.range.min"]
                }, {
                    listener: "gpii.tests.textSizeTester.verifyButtonStates",
                    args: ["{textSize}", false, true],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.applier.change",
                    args: ["value", "{that}.options.testOptions.testValue"]
                }, {
                    listener: "gpii.tests.textSizeTester.verifyButtonStates",
                    args: ["{textSize}", false, false],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.textSizeTester.verifyRendering = function (that) {
        var messages = that.options.messageBase;
        jqUnit.assertEquals("The text for instructions should be rendered.", messages.rangeInstructions, that.locate("rangeInstructions").text());
        jqUnit.assertEquals("The text for increase button should be rendered.", messages.increaseLabel, that.locate("increaseLabel").text());
        jqUnit.assertEquals("The text for decrease button should be rendered.", messages.decreaseLabel, that.locate("decreaseLabel").text());

        var increaseId = that.locate("increase").attr("id");
        var decreaseId = that.locate("decrease").attr("id");
        jqUnit.assertEquals("The tooltip model for the increase button has been properly set", that.options.messageBase.increaseLabel, that.tooltip.model.idToContent[increaseId]);
        jqUnit.assertEquals("The tooltip model for the decrease button has been properly set", that.options.messageBase.decreaseLabel, that.tooltip.model.idToContent[decreaseId]);
    };

    gpii.tests.textSizeTester.verifyModel = function (that, expectedModel) {
        jqUnit.assertEquals("The model value should be set correctly", expectedModel, that.model.value);
    };

    gpii.tests.textSizeTester.verifyButtonStates = function (that, increaseDisabled, decreaseDisabled) {
        jqUnit.assertEquals("The increase button should have the correct enabled/disabled state", increaseDisabled, that.locate("increase").prop("disabled"));
        jqUnit.assertEquals("The decrease button should have the correct enabled/disabled state", decreaseDisabled, that.locate("decrease").prop("disabled"));
    };

    /*************
     * speakText *
     *************/

    fluid.defaults("gpii.tests.prefs.panel.speakText", {
        gradeNames: ["gpii.firstDiscovery.panel.speakText", "autoInit"],
        messageBase: {
            "speakTextInstructions": "Speak text instructions",
            "speakText-no": "no",
            "speakText-yes": "yes"
        },
        choiceLabels: ["yes", "no"],
        model: {
            speak: true
        }
    });

    fluid.defaults("gpii.tests.speakTextPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            speakText: {
                type: "gpii.tests.prefs.panel.speakText",
                container: ".gpiic-fd-speakText"
            },
            speakTextTester: {
                type: "gpii.tests.speakTextTester"
            }
        }
    });

    fluid.defaults("gpii.tests.speakTextTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test the speak text settings panel",
            tests: [{
                expect: 6,
                name: "Test the rendering of the speak text panel",
                sequence: [{
                    func: "{speakText}.refreshView"
                }, {
                    listener: "gpii.tests.speakTextTester.verifyRendering",
                    event: "{speakText}.events.afterRender"
                }, {
                    func: "gpii.tests.speakTextTester.triggerRadioButton",
                    args: ["{speakText}.dom.choiceInput", 1]
                }, {
                    listener: "gpii.tests.speakTextTester.verifyModel",
                    args: ["{speakText}", false],
                    spec: {path: "speak", priority: "last"},
                    changeEvent: "{speakText}.applier.modelChanged"
                }, {
                    func: "gpii.tests.speakTextTester.triggerRadioButton",
                    args: ["{speakText}.dom.choiceInput", 0]
                }, {
                    listener: "gpii.tests.speakTextTester.verifyModel",
                    args: ["{speakText}", true],
                    spec: {path: "speak", priority: "last"},
                    changeEvent: "{speakText}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.speakTextTester.triggerRadioButton = function (radioButtons, idx) {
        radioButtons.eq(idx).click();
    };

    gpii.tests.speakTextTester.verifyRendering = function (that) {
        jqUnit.assertEquals("The instructions should have been set correctly.", that.options.messageBase.speakTextInstructions, that.locate("instructions").text());
        fluid.each(that.locate("choiceLabel"), function (elm, idx) {
            elm = $(elm);
            jqUnit.assertEquals("Choice #" + idx + " should have the correct label.", that.options.choiceLabels[idx], elm.text());
        });
        jqUnit.assertEquals("The correct choice should be checked", that.model.speakChoice, that.locate("choiceInput").filter(":checked").val());
    };

    gpii.tests.speakTextTester.verifyModel = function (that, expectedValue) {
        jqUnit.assertEquals("The model value should have been set correctly", expectedValue, that.model.speak);
    };

    /************
     * keyboard *
     ************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.keyboard", {
        gradeNames: ["gpii.firstDiscovery.panel.keyboard", "autoInit"],
        messageBase: {
            "keyboardInstructions": "Adjustments can be made to help you with using the keyboard.",
            "placeholder": "Type the @ symbol now",

            "try": "try it",
            "on": "ON",
            "off": "OFF",
            "turnOn": "turn ON",
            "turnOff": "turn OFF",

            "stickyKeysInstructions": "<strong>Sticky Keys</strong> can help with holding two keys down at once.",
            "stickyKeys": "Sticky Keys is",

            "successInstructions": "You don’t appear to need any keyboard adjustments. Please proceed to the next screen.",

            "inputTooltip": "Select to begin typing",
            "tryTooltip": "Select to turn Sticky Keys on",
            "turnOnTooltip": "Select to turn Sticky Keys on",
            "turnOffTooltip": "Select to turn Sticky Keys off"
        }
    });

    fluid.defaults("gpii.tests.keyboardPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            keyboard: {
                type: "gpii.tests.firstDiscovery.panel.keyboard",
                container: ".gpiic-fd-keyboard"
            },
            keyboardTester: {
                type: "gpii.tests.keyboardTester"
            }
        }
    });

    fluid.defaults("gpii.tests.keyboardTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the keyboard panel",
            tests: [{
                expect: 3,
                name: "Initialization",
                sequence: [{
                    func: "{keyboard}.refreshView"
                }, {
                    listener: "gpii.tests.keyboardTester.verifyRendering",
                    args: ["{keyboard}", "keyboardInstructions"],
                    event: "{keyboard}.events.afterRender"
                }]
            }, {
                expect: 4,
                name: "Don't Offer Assistance",
                sequence: [{
                    func: "{keyboard}.applier.change",
                    args: ["offerAssistance", false]
                }, {
                    listener: "gpii.tests.keyboardTester.verifyNoAssistance",
                    args: ["{keyboard}"],
                    spec: {path: "offerAssistance", priority: "last"},
                    changeEvent: "{keyboard}.applier.modelChanged"
                }]
            }, {
                expect: 7,
                name: "Offer Assistance",
                sequence: [{
                    func: "{keyboard}.applier.change",
                    args: ["offerAssistance", true]
                }, {
                    listener: "gpii.tests.keyboardTester.verifyOfferAssistance",
                    args: ["{keyboard}"],
                    spec: {path: "offerAssistance", priority: "last"},
                    changeEvent: "{keyboard}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.keyboardTester.verifyRendering = function (that, instructions) {
        jqUnit.assertEquals("The instructions should be rendered correctly", that.options.messageBase[instructions], that.locate("instructions").text());
        jqUnit.assertEquals("The placeholder text should be set correctly", that.options.messageBase.placeholder, that.locate("placeholder").attr("placeholder"));

        jqUnit.assertTrue("The hide class on the assistance element should be added", that.locate("assistance").hasClass(that.options.styles.hide));
    };

    gpii.tests.keyboardTester.verifyNoAssistance = function (that) {
        jqUnit.assertFalse("The offerAssistance model value should be false", that.model.offerAssistance);
        gpii.tests.keyboardTester.verifyRendering(that, "successInstructions");
    };

    gpii.tests.keyboardTester.verifyOfferAssistance = function (that) {
        jqUnit.assertTrue("The offerAssistance model value should be true", that.model.offerAssistance);
        jqUnit.assertFalse("The hide class on the assistance element should be removed", that.locate("assistance").hasClass(that.options.styles.hide));
        gpii.tests.keyboard.stickyKeysAdjusterTester.verifyInitialRendering(that.assistance);
    };

    /*******************
     * congratulations *
     *******************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.congratulations", {
        gradeNames: ["gpii.firstDiscovery.panel.congratulations", "autoInit"],
        messageBase: {
            "message": "<p>Congratulations!</p><p>Your preferences have been saved to your account.</p>"
        }
    });

    fluid.defaults("gpii.tests.congratulationsPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            congratulations: {
                type: "gpii.tests.firstDiscovery.panel.congratulations",
                container: ".gpiic-fd-congratulations"
            },
            congratulationsTester: {
                type: "gpii.tests.congratulationsTester"
            }
        }
    });

    fluid.defaults("gpii.tests.congratulationsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the congratulations component",
            tests: [{
                expect: 1,
                name: "Initialization",
                sequence: [{
                    func: "{congratulations}.refreshView"
                }, {
                    listener: "gpii.tests.congratulationsTester.testRendering",
                    args: ["{congratulations}"],
                    event: "{congratulations}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.congratulationsTester.testRendering = function (that) {
        var expectedContent = $(that.options.messageBase.message).text();
        jqUnit.assertEquals("The description should be rendered correctly", expectedContent, that.locate("message").text());
    };


    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.textSizePanel",
            "gpii.tests.speakTextPanel",
            "gpii.tests.keyboardPanel",
            "gpii.tests.congratulationsPanel"
        ]);
    });

})(jQuery, fluid);
