/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    /************************
     * Language Panel Tests *
     ************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.lang", {
        gradeNames: ["gpii.firstDiscovery.panel.lang", "autoInit"],
        messageBase: {
            "langInstructions": "Select your preferred language",
            "lang-en-US": "English",
            "lang-fr-FR": "Français",
            "lang-es-ES": "Español",
            "lang-de-DE": "Deutsch",
            "lang-nl-NL": "Nederlands",
            "lang-sv-SE": "Svenska",

            "navButtonTooltip": "Select to view more languages",
            "lang-en-US-tooltip": "Select for English",
            "lang-fr-FR-tooltip": "Sélectionnez pour le Français",
            "lang-es-ES-tooltip": "Seleccionar para Español",
            "lang-de-DE-tooltip": "Wählen Sie für die Deutsche",
            "lang-nl-NL-tooltip": "Select for Nederlands",
            "lang-sv-SE-tooltip": "Select for Svenska",

            "lang-en-US-tooltipAtSelect": "English is currently selected",
            "lang-fr-FR-tooltipAtSelect": "Français est actuellement sélectionné",
            "lang-es-ES-tooltipAtSelect": "Español está seleccionado actualmente",
            "lang-de-DE-tooltipAtSelect": "Deutsch gegenwärtig ausgewählt ist",
            "lang-nl-NL-tooltipAtSelect": "Nederlands is currently selected",
            "lang-sv-SE-tooltipAtSelect": "Svenska is currently selected"
        },
        model: {
            lang: "nl-NL"
        },
        numOfLangPerPage: 3,
        controlValues: {
            lang: ["en-US", "fr-FR", "es-ES", "de-DE", "nl-NL", "sv-SE"]
        },
        stringArrayIndex: {
            lang: ["lang-en-US", "lang-fr-FR", "lang-es-ES", "lang-de-DE", "lang-nl-NL", "lang-sv-SE"],
            tooltip: ["lang-en-US-tooltip", "lang-fr-FR-tooltip", "lang-es-ES-tooltip", "lang-de-DE-tooltip", "lang-nl-NL-tooltip", "lang-sv-SE-tooltip"],
            tooltipAtSelect: ["lang-en-US-tooltipAtSelect", "lang-fr-FR-tooltipAtSelect", "lang-es-ES-tooltipAtSelect", "lang-de-DE-tooltipAtSelect", "lang-nl-NL-tooltipAtSelect", "lang-sv-SE-tooltipAtSelect"]
        },
        events: {
            afterTooltipOpen: null
        },
        boilTooltipOpenEvent: {
            listener: "{gpii.tests.firstDiscovery.panel.lang}.events.afterTooltipOpen",
            priority: "last"
        },
        distributeOptions: [{
            source: "{that}.options.boilTooltipOpenEvent",
            target: "{that tooltip}.options.listeners.afterOpen"
        }]
    });

    fluid.defaults("gpii.tests.langPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            lang: {
                type: "gpii.tests.firstDiscovery.panel.lang",
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
                expect: 94,
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
                    funcName: "gpii.tests.langTester.hoverElm",
                    args: ["{lang}.dom.langLabel", 0]
                }, {
                    listener: "gpii.tests.langTester.verifyTooltipLang",
                    args: ["{arguments}.2", "en-US"],
                    event: "{lang}.events.afterTooltipOpen"
                }, {
                    funcName: "gpii.tests.langTester.hoverElm",
                    args: ["{lang}.dom.langLabel", 4]
                }, {
                    listener: "gpii.tests.langTester.verifyTooltipLang",
                    args: ["{arguments}.2", "nl-NL"],
                    event: "{lang}.events.afterTooltipOpen"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.next"
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "sv-SE"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "sv-SE", false, true],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.prev"
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "nl-NL"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "nl-NL", false, false],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    func: "{lang}.applier.change",
                    args: ["lang", "en-US"]
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "en-US"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", "en-US", true, false],
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.langTester.hoverElm = function (elms, idx) {
        $(elms).eq(idx || 0).mouseover();
    };

    gpii.tests.langTester.verifyTooltip = function (that) {
        gpii.tests.utils.verifyTooltipContents("language button row element", that.locate("langLabel"), that.model.lang, that.attachTooltipOnLang.tooltip.model.idToContent, that.options.controlValues.lang, that.options.stringArrayIndex.lang, that.options.messageBase);
        gpii.tests.utils.verifyTooltipContents("language button input element", that.locate("langInput"), that.model.lang, that.attachTooltipOnLang.tooltip.model.idToContent, that.options.controlValues.lang, that.options.stringArrayIndex.lang, that.options.messageBase);
    };

    gpii.tests.langTester.verifyTooltipLang = function (tooltip, expectedLang) {
        jqUnit.assertEquals("The lang attribute should be set correctly for the tooltip.", expectedLang, tooltip.attr("lang"));
    };

    gpii.tests.langTester.verifyRendering = function (that) {
        var messages = that.options.messageBase,
            stringArray = that.options.stringArrayIndex.lang,
            idToContent = that.attachTooltipOnLang.tooltip.model.idToContent;

        jqUnit.assertNotUndefined("The subcomponent \"attachTooltipOnLang\" has been instantiated", that.attachTooltipOnLang);
        jqUnit.assertNotUndefined("The gradechild component \"tooltip\" has been instantiated", that.attachTooltipOnLang.tooltip);

        jqUnit.assertEquals("The instruction has been set correctly.", messages.langInstructions, that.locate("instructions").text());
        fluid.each(that.locate("langRow"), function (langButton, idx) {
            langButton = $(langButton);
            var langLabel = langButton.find(that.options.selectors.langLabel);
            jqUnit.assertEquals("The language button #" + idx + " has the correct label.", messages[stringArray[idx]], langLabel.text());
        });

        jqUnit.assertEquals("The correct language button has been checked", that.model.lang, that.locate("langInput").filter(":checked").val());
        jqUnit.assertEquals("The previous button is enabled", false, that.locate("prev").is(":disabled"));
        jqUnit.assertEquals("The next button is enabled", false, that.locate("next").is(":disabled"));
        jqUnit.assertEquals("The language code has been added to the html \"lang\" attribute", that.model.lang, $("html").attr("lang"));

        gpii.tests.langTester.verifyTooltip(that);

        fluid.each(["prev", "next"], function (selector) {
            jqUnit.assertEquals("The tooltip definition for element " + selector + " has been populated", messages.navButtonTooltip, idToContent[that.locate(selector).attr("id")]);
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
        jqUnit.assertEquals("The correct language button has been selected", that.model.lang, currentButtonInput.val());
        var currentButtonTop = currentButtonInput.closest(that.options.selectors.langRow).position().top,
            controlsDivScrollTop = $(that.options.selectors.controlsDiv)[0].scrollTop,
            movedToTop = currentButtonTop + controlsDivScrollTop - that.lastMovedHeight;
        jqUnit.assertNotEquals("The selected button has been moved to the correct button position", that.buttonTops.indexOf(movedToTop), -1);
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
        jqUnit.assertEquals("The language code has been added to the html \"lang\" attribute", that.model.lang, $("html").attr("lang"));
        gpii.tests.langTester.verifyTooltip(that);
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

    fluid.defaults("gpii.tests.firstDiscovery.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.textSize", "autoInit"],
        messageBase: {
            rangeInstructions: "Text size instructions.",
            increaseLabel: "larger",
            decreaseLabel: "smaller"
        },
        model: {
            value: 1
        },
        modelListeners: {
            // rerenders on modelChange like panel behaves in the prefsEditor
            "value": "{that}.refreshView"
        }
    });

    fluid.defaults("gpii.tests.textSizePanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            textSize: {
                type: "gpii.tests.firstDiscovery.panel.textSize",
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
                expect: 17,
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
                    spec: {path: "isMax", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.applier.change",
                    args: ["value", "{textSize}.options.range.min"]
                }, {
                    listener: "gpii.tests.textSizeTester.verifyButtonStates",
                    args: ["{textSize}", false, true],
                    spec: {path: "isMin", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }, {
                    func: "{textSize}.applier.change",
                    args: ["value", "{that}.options.testOptions.testValue"]
                }, {
                    listener: "gpii.tests.textSizeTester.verifyButtonStates",
                    args: ["{textSize}", false, false],
                    spec: {path: "isMin", priority: "last"},
                    changeEvent: "{textSize}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.textSizeTester.verifyRendering = function (that) {
        var messages = that.options.messageBase;
        jqUnit.assertEquals("The text for instructions should be rendered.", messages.rangeInstructions, that.locate("rangeInstructions").text());

        var increaseId = that.locate("increase").attr("id");
        var decreaseId = that.locate("decrease").attr("id");
        jqUnit.assertEquals("The tooltip model for the increase button has been properly set", that.options.messageBase.increaseLabel, that.tooltip.model.idToContent[increaseId]);
        jqUnit.assertEquals("The tooltip model for the decrease button has been properly set", that.options.messageBase.decreaseLabel, that.tooltip.model.idToContent[decreaseId]);
    };

    gpii.tests.textSizeTester.verifyModel = function (that, expectedModel) {
        jqUnit.assertEquals("The model value " + expectedModel + " should be set correctly", expectedModel, that.model.value);
    };

    gpii.tests.textSizeTester.verifyButtonStates = function (that, increaseDisabled, decreaseDisabled) {
        jqUnit.assertEquals("The isMax model value should be set correctly", increaseDisabled, that.model.isMax);
        jqUnit.assertEquals("The increase button should have the correct enabled/disabled state", increaseDisabled, that.locate("increase").prop("disabled"));

        jqUnit.assertEquals("The isMin model value should be set correctly", decreaseDisabled, that.model.isMin);
        jqUnit.assertEquals("The decrease button should have the correct enabled/disabled state", decreaseDisabled, that.locate("decrease").prop("disabled"));
    };

    /**************************
     * Speak Text Panel Tests *
     **************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.speakText", {
        gradeNames: ["gpii.firstDiscovery.panel.speakText", "autoInit"],
        messageBase: {
            "speakTextInstructions": "Speak text instructions",
            "speakText-no": "no",
            "speakText-yes": "yes",
            "speakText-yes-tooltip": "Select to turn voice on",
            "speakText-no-tooltip": "Select to turn voice off",
            "speakText-yes-tooltipAtSelect": "Voice is on",
            "speakText-no-tooltipAtSelect": "Voice is off"
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
                type: "gpii.tests.firstDiscovery.panel.speakText",
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
                expect: 8,
                name: "The initial rendering of the speak text panel",
                sequence: [{
                    func: "{speakText}.refreshView"
                }, {
                    listener: "gpii.tests.speakTextTester.verifyRendering",
                    event: "{speakText}.events.afterRender"
                }]
            }, {
                expect: 10,
                name: "Selections on the speak text panel",
                sequence: [{
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{speakText}.dom.choiceInput", 1]
                }, {
                    listener: "gpii.tests.speakTextTester.verifyModel",
                    args: ["{speakText}", false],
                    spec: {path: "speak", priority: "last"},
                    changeEvent: "{speakText}.applier.modelChanged"
                }, {
                    func: "{speakText}.refreshView"
                }, {
                    listener: "gpii.tests.speakTextTester.verifyTooltip",
                    args: ["{speakText}"],
                    event: "{speakText}.events.afterRender"
                }, {
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{speakText}.dom.choiceInput", 0]
                }, {
                    listener: "gpii.tests.speakTextTester.verifyModel",
                    args: ["{speakText}", true],
                    spec: {path: "speak", priority: "last"},
                    changeEvent: "{speakText}.applier.modelChanged"
                }, {
                    func: "{speakText}.refreshView"
                }, {
                    listener: "gpii.tests.speakTextTester.verifyTooltip",
                    args: ["{speakText}"],
                    event: "{speakText}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.speakTextTester.verifyTooltip = function (that) {
        gpii.tests.utils.verifyTooltipContents("choice label", that.locate("choiceLabel"), that.model.speakChoice, that.tooltip.model.idToContent, that.options.controlValues.choice, that.options.stringArrayIndex.choice, that.options.messageBase);
        gpii.tests.utils.verifyTooltipContents("choice input", that.locate("choiceInput"), that.model.speakChoice, that.tooltip.model.idToContent, that.options.controlValues.choice, that.options.stringArrayIndex.choice, that.options.messageBase);
    };

    gpii.tests.speakTextTester.verifyRendering = function (that) {
        jqUnit.assertEquals("The instructions should have been set correctly.", that.options.messageBase.speakTextInstructions, that.locate("instructions").text());
        gpii.tests.utils.verifyRadioButtonRendering(that.locate("choiceInput"), that.locate("choiceLabel"), that.options.choiceLabels, that.model.speakChoice);
        gpii.tests.speakTextTester.verifyTooltip(that);
    };

    gpii.tests.speakTextTester.verifyModel = function (that, expectedValue) {
        jqUnit.assertEquals("The model value should have been set correctly", expectedValue, that.model.speak);
    };

    /************************
     * Contrast Panel Tests *
     ************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.contrast", {
        gradeNames: ["gpii.firstDiscovery.panel.contrast", "autoInit"],
        classnameMap: {
            theme: {
                "default": "fl-theme-prefsEditor-default",
                "bw": "fl-theme-prefsEditor-bw fl-theme-bw",
                "wb": "fl-theme-prefsEditor-wb fl-theme-wb"
            }
        },
        model: {
            value: "default"
        },
        messageBase: {
            "instructions": "You can choose a screen colour to make things easier to see.",
            "contrastLabel": "Contrast",
            "contrast-default": "no change",
            "contrast-bw": "black on white",
            "contrast-wb": "white on black",

            "contrast-default-tooltip": "reset to original screen colors",
            "contrast-bw-tooltip": "change the screen color to black on white",
            "contrast-wb-tooltip": "change the screen color to white on black",

            "contrast-default-tooltipAtSelect": "no change is currently selected",
            "contrast-bw-tooltipAtSelect": "black on white is currently selected",
            "contrast-wb-tooltipAtSelect": "white on black is currently selected"
        },
        themeLabels: ["no change", "black on white", "white on black"]
    });

    fluid.defaults("gpii.tests.contrastPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            contrast: {
                type: "gpii.tests.firstDiscovery.panel.contrast",
                container: ".gpiic-fd-contrast"
            },
            contrastTester: {
                type: "gpii.tests.contrastTester"
            }
        }
    });

    fluid.defaults("gpii.tests.contrastTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test the contrast settings panel",
            tests: [{
                expect: 14,
                name: "Rendering",
                sequence: [{
                    func: "{contrast}.refreshView"
                }, {
                    listener: "gpii.tests.contrastTester.verifyRendering",
                    event: "{contrast}.events.afterRender"
                }]
            }, {
                expect: 21,
                name: "Selection",
                sequence: [{
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{contrast}.dom.themeInput", 1]
                }, {
                    listener: "gpii.tests.contrastTester.verifySelection",
                    args: ["{contrast}", "bw"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{contrast}.applier.modelChanged"
                }, {
                    func: "{contrast}.refreshView"
                }, {
                    listener: "gpii.tests.contrastTester.verifyTooltip",
                    args: ["{contrast}"],
                    event: "{contrast}.events.afterRender"
                }, {
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{contrast}.dom.themeInput", 2]
                }, {
                    listener: "gpii.tests.contrastTester.verifySelection",
                    args: ["{contrast}", "wb"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{contrast}.applier.modelChanged"
                }, {
                    func: "{contrast}.refreshView"
                }, {
                    listener: "gpii.tests.contrastTester.verifyTooltip",
                    args: ["{contrast}"],
                    event: "{contrast}.events.afterRender"
                }, {
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{contrast}.dom.themeInput", 0]
                }, {
                    listener: "gpii.tests.contrastTester.verifySelection",
                    args: ["{contrast}", "default"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{contrast}.applier.modelChanged"
                }, {
                    func: "{contrast}.refreshView"
                }, {
                    listener: "gpii.tests.contrastTester.verifyTooltip",
                    args: ["{contrast}"],
                    event: "{contrast}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.contrastTester.verifyTooltip = function (that) {
        gpii.tests.utils.verifyTooltipContents("contrast theme label", that.locate("themeLabel"), that.model.value, that.tooltip.model.idToContent, that.options.controlValues.theme, that.options.stringArrayIndex.theme, that.options.messageBase);
        gpii.tests.utils.verifyTooltipContents("contrast theme input", that.locate("themeInput"), that.model.value, that.tooltip.model.idToContent, that.options.controlValues.theme, that.options.stringArrayIndex.theme, that.options.messageBase);
    };

    gpii.tests.contrastTester.verifyRendering = function (that) {
        var themeInput = that.locate("themeInput");
        var themeLabel = that.locate("themeLabel");

        jqUnit.assertEquals("The instructions should have been set correctly.", that.options.messageBase.instructions, that.locate("instructions").text());
        gpii.tests.utils.verifyRadioButtonRendering(themeInput, themeLabel, that.options.themeLabels, that.model.value);
        themeLabel.each(function (idx, elm) {
            var className = that.options.classnameMap.theme[themeInput.eq(idx).val()];
            jqUnit.assertTrue("The #" + idx + " label should have the '" + className + "' applied.", $(elm).hasClass(className));
        });
        gpii.tests.contrastTester.verifyTooltip(that);
    };

    gpii.tests.contrastTester.verifySelection = function (that, expectedValue) {
        jqUnit.assertEquals("The model value should have been set correctly", expectedValue, that.model.value);
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
                expect: 7,
                name: "Initialization",
                sequence: [{
                    func: "{keyboard}.refreshView"
                }, {
                    listener: "gpii.tests.keyboardTester.verifyInit",
                    args: ["{keyboard}", "keyboardInstructions"],
                    event: "{keyboard}.events.afterRender"
                }]
            }, {
                expect: 7,
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
                expect: 10,
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

    gpii.tests.keyboardTester.verifyInit = function (that, instructions) {
        jqUnit.assertEquals("The instructions should be rendered correctly", that.options.messageBase[instructions], that.locate("instructions").text());
        jqUnit.notVisible("The assistance element should be hidden", that.locate("assistance"));

        jqUnit.exists("The input should be present", that.locate("input"));
        jqUnit.assertEquals("The placeholder text should be set correctly", that.options.messageBase.placeholder, that.locate("input").attr("placeholder"));

        jqUnit.assertUndefined("The assistance subcomponent should not have been created yet", that.assistance);
        jqUnit.assertValue("The stickyKeysAssessor subcomponent should have been created", that.stickyKeysAssessor);
        jqUnit.assertValue("The keyboardInput subcomponent should have been created", that.keyboardInput);
    };

    gpii.tests.keyboardTester.verifyNoAssistance = function (that) {
        jqUnit.assertFalse("The offerAssistance model value should be false", that.model.offerAssistance);
        jqUnit.assertEquals("The instructions should be rendered correctly", that.options.messageBase.successInstructions, that.locate("instructions").text());

        jqUnit.notVisible("The assistance should be hidden", that.locate("assistance"));
        jqUnit.notExists("The input should be removed", that.locate("input"));

        jqUnit.assertUndefined("The assistance subcomponent should not have been created yet", that.assistance);
        jqUnit.assertUndefined("The stickyKeysAssessor subcomponent should have been destroyed", that.stickyKeysAssessor);
        jqUnit.assertValue("The keyboardInput subcomponent should have been created", that.keyboardInput);
    };

    gpii.tests.keyboardTester.verifyOfferAssistance = function (that) {
        jqUnit.assertTrue("The offerAssistance model value should be true", that.model.offerAssistance);
        jqUnit.isVisible("The assistance element should be visible", that.locate("assistance"));
        gpii.tests.keyboard.stickyKeysAdjusterTester.verifyInitialRendering(that.assistance);

        jqUnit.assertValue("The assistance subcomponent should have been created yet", that.assistance);
        jqUnit.assertUndefined("The stickyKeysAssessor subcomponent should have been destroyed", that.stickyKeysAssessor);
        jqUnit.assertValue("The keyboardInput subcomponent should have been created", that.keyboardInput);
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
            "gpii.tests.contrastPanel",
            "gpii.tests.keyboardPanel",
            "gpii.tests.welcomePanel",
            "gpii.tests.congratulationsPanel"
        ]);
    });

})(jQuery, fluid);
