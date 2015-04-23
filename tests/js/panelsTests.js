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

    /************************
     * Language Panel Tests *
     ************************/

    fluid.defaults("gpii.tests.prefs.panel.lang", {
        gradeNames: ["gpii.firstDiscovery.panel.lang", "autoInit"],
        messageBase: {
            "langInstructions": "Select your preferred language",
            "lang-en": "English",
            "lang-fr": "Français",
            "lang-es": "Español",
            "lang-de": "Deutsch",
            "lang-ne": "Nederlands",
            "lang-sv": "Svenska",

            "navButtonTooltip": "Select to view more languages",
            "lang-en-tooltip": "Select for English",
            "lang-fr-tooltip": "Sélectionnez pour le Français",
            "lang-es-tooltip": "Seleccionar para Español",
            "lang-de-tooltip": "Wählen Sie für die Deutsche",
            "lang-ne-tooltip": "Select for Nederlands",
            "lang-sv-tooltip": "Select for Svenska",

            "lang-en-tooltipAtSelect": "English is currently selected",
            "lang-fr-tooltipAtSelect": "Français est actuellement sélectionné",
            "lang-es-tooltipAtSelect": "Español está seleccionado actualmente",
            "lang-de-tooltipAtSelect": "Deutsch gegenwärtig ausgewählt ist",
            "lang-ne-tooltipAtSelect": "Nederlands is currently selected",
            "lang-sv-tooltipAtSelect": "Svenska is currently selected"
        },
        model: {
            lang: "ne"
        },
        numOfLangPerPage: 3,
        controlValues: {
            lang: ["en", "fr", "es", "de", "ne", "sv"]
        },
        stringArrayIndex: {
            lang: ["lang-en", "lang-fr", "lang-es", "lang-de", "lang-ne", "lang-sv"],
            tooltip: ["lang-en-tooltip", "lang-fr-tooltip", "lang-es-tooltip", "lang-de-tooltip", "lang-ne-tooltip", "lang-sv-tooltip"],
            tooltipAtSelect: ["lang-en-tooltipAtSelect", "lang-fr-tooltipAtSelect", "lang-es-tooltipAtSelect", "lang-de-tooltipAtSelect", "lang-ne-tooltipAtSelect", "lang-sv-tooltipAtSelect"]
        }
    });

    fluid.defaults("gpii.tests.langPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            lang: {
                type: "gpii.tests.prefs.panel.lang",
                container: ".gpiic-fd-lang"
            },
            langTester: {
                type: "gpii.tests.langTester"
            }
        }
    });

    fluid.defaults("gpii.tests.langTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test the language settings panel",
            tests: [{
                expect: 53,
                name: "Test the language panel",
                sequence: [{
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyRendering",
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonTopsReady",
                    args: ["{lang}"],
                    priority: "last",
                    event: "{lang}.events.onButtonTopsReady"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.next"
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "sv"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "sv", false, true],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.prev"
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "ne"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "ne", false, false],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    func: "{lang}.applier.change",
                    args: ["lang", "en"]
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "en"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "en", true, false],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    func: "gpii.tests.langTester.clickLangButton",
                    args: ["{lang}", "fr"]
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "fr"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.langTester.verifyRendering = function (that) {
        var messages = that.options.messageBase,
            stringArray = that.options.stringArrayIndex.lang,
            idToContent = that.attachTooltipOnLang.tooltip.model.idToContent;

        jqUnit.assertNotUndefined("The subcomponent \"attachTooltipOnLang\" has been instantiated", that.attachTooltipOnLang);
        jqUnit.assertNotUndefined("The gradechild component \"tooltip\" has been instantiated", that.attachTooltipOnLang.tooltip);

        jqUnit.assertEquals("The instruction has been set correctly.", messages.langInstructions, that.locate("instructions").text());
        fluid.each(that.locate("langRow"), function (langButton, idx) {
            var tooltipLabelSuffix = that.options.controlValues.lang[idx] === that.model.lang ? "-tooltipAtSelect" : "-tooltip";
            langButton = $(langButton);
            var langLabel = langButton.find(that.options.selectors.langLabel),
                langInput = langButton.find(that.options.selectors.langInput);
            jqUnit.assertEquals("The language button #" + idx + " has the correct label.", messages[stringArray[idx]], langLabel.text());
            jqUnit.assertEquals("The tooltip definition for the language button #" + idx + " has been populated correctly", messages[stringArray[idx] + tooltipLabelSuffix], idToContent[langButton.attr("id")]);
            jqUnit.assertEquals("The tooltip definition for the language input #" + idx + " has been populated correctly", messages[stringArray[idx] + tooltipLabelSuffix], idToContent[langInput.attr("id")]);
        });

        jqUnit.assertEquals("The correct language button has been checked", that.model.lang, that.locate("langInput").filter(":checked").val());
        jqUnit.assertEquals("The previous button is enabled", false, that.locate("prev").is(":disabled"));
        jqUnit.assertEquals("The next button is enabled", false, that.locate("next").is(":disabled"));

        fluid.each(["prev", "next"], function (selector) {
            jqUnit.assertEquals("The tooltip definition for element " + selector + " has been populated", messages["navButtonTooltip"], idToContent[that.locate(selector).attr("id")]);
        });
    };

    gpii.tests.langTester.verifyButtonTopsReady = function (that) {
        jqUnit.assertNotUndefined("The button positions have been collected", that.buttonTops);
        jqUnit.assertNotUndefined("The controls div has been scrolled", that.lastMovedHeight);
        gpii.tests.langTester.verifyButtonInView(that);
    };

    gpii.tests.langTester.verifyButtonInView = function (that) {
        jqUnit.assertNotUndefined("The button positions have been collected", that.buttonTops);
        var currentButtonInput = that.locate("langInput").filter(":checked");
        jqUnit.assertEquals("The correct language button has been checked", that.model.lang, currentButtonInput.val());
        var currentButtonTop = currentButtonInput.closest(that.options.selectors.langRow).position().top,
            controlsDivScrollTop = $(that.options.selectors.controlsDiv)[0].scrollTop,
            movedToTop = currentButtonTop + controlsDivScrollTop - that.lastMovedHeight;
        jqUnit.assertNotEquals("The checked button has been moved to the correct button position", that.buttonTops.indexOf(movedToTop), -1);
    };

    gpii.tests.langTester.clickLangButton = function (that, langCode) {
        var langButtons = that.locate("langRow");
        $(langButtons).find("input[value='" + langCode + "']").click();
    };

    gpii.tests.langTester.verifyLangModel = function (that, expected) {
        jqUnit.assertEquals("The model value for the language is set correctly", expected, that.model.lang);
    };

    gpii.tests.langTester.verifyButtonStates = function (that, expectedLang, prevDisabled, nextDisabled) {
        var prevDisabledMsg = prevDisabled ? "disabled" : "enabled";
        var nextDisabledMsg = nextDisabled ? "disabled" : "enabled";
        jqUnit.assertEquals("The model value for the selected language is set correctly", expectedLang, that.model.lang);
        jqUnit.assertEquals("The previous button has been " + prevDisabledMsg, prevDisabled, that.locate("prev").is(":disabled"));
        jqUnit.assertEquals("The next button has been " + nextDisabledMsg, nextDisabled, that.locate("next").is(":disabled"));
        gpii.tests.langTester.verifyButtonInView(that);
    };

    jqUnit.test("Test gpii.firstDiscovery.panel.lang.findClosestNumber()", function () {
        gpii.tests.langTester.testFindClosestNumber(5, [1, 3, 6], 6);
        gpii.tests.langTester.testFindClosestNumber(0, [-1, -0.5, 1], -0.5);
    });

    gpii.tests.langTester.testFindClosestNumber = function (numberToFind, numbers, expected) {
        jqUnit.assertEquals("The closes number for " + numberToFind + " in a number array " + numbers + " is " + expected, expected, gpii.firstDiscovery.panel.lang.findClosestNumber(numberToFind, numbers));
    };

    /*************************
     * Text Size Panel Tests *
     *************************/

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


    /**************************
     * Speak Text Panel Tests *
     **************************/

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

    /***********************
     * Welcome Panel Tests *
     ***********************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.welcome", {
        gradeNames: ["gpii.firstDiscovery.panel.welcome", "autoInit"],
        messageBase: {
            "message": "<p>Welcome!</p> <p>If you need help at any time, press the H key. To continue, select the start button below.</p>"
        }
    });

    fluid.defaults("gpii.tests.welcomePanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            welcome: {
                type: "gpii.tests.firstDiscovery.panel.welcome",
                container: ".gpiic-fd-welcome"
            },
            welcomeTester: {
                type: "gpii.tests.welcomeTester"
            }
        }
    });

    fluid.defaults("gpii.tests.welcomeTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Tests the welcome component",
            tests: [{
                expect: 1,
                name: "Initialization",
                sequence: [{
                    func: "{welcome}.refreshView"
                }, {
                    listener: "gpii.tests.testRendering",
                    args: ["{welcome}"],
                    event: "{welcome}.events.afterRender"
                }]
            }]
        }]
    });

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
                    listener: "gpii.tests.testRendering",
                    args: ["{congratulations}"],
                    event: "{congratulations}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.testRendering = function (that) {
        var expectedContent = $(that.options.messageBase.message).text();
        jqUnit.assertEquals("The description should be rendered correctly", expectedContent, that.locate("message").text());
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.langPanel",
            "gpii.tests.textSizePanel",
            "gpii.tests.speakTextPanel",
            "gpii.tests.welcomePanel",
            "gpii.tests.congratulationsPanel"
        ]);
    });

})(jQuery, fluid);
