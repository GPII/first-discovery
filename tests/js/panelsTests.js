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
            "lang-es-MX": "Español",
            "lang-de-DE": "Deutsch",
            "lang-nl-NL": "Nederlands",
            "lang-sv-SE": "Svenska",

            "navButtonTooltip": "Select to view more languages",
            "lang-en-US-tooltip": "Select for English",
            "lang-fr-FR-tooltip": "Sélectionnez pour le Français",
            "lang-es-MX-tooltip": "Seleccionar para Español",
            "lang-de-DE-tooltip": "Wählen Sie für die Deutsche",
            "lang-nl-NL-tooltip": "Select for Nederlands",
            "lang-sv-SE-tooltip": "Select for Svenska",

            "lang-en-US-tooltipAtSelect": "English is currently selected",
            "lang-fr-FR-tooltipAtSelect": "Français est actuellement sélectionné",
            "lang-es-MX-tooltipAtSelect": "Español está seleccionado actualmente",
            "lang-de-DE-tooltipAtSelect": "Deutsch gegenwärtig ausgewählt ist",
            "lang-nl-NL-tooltipAtSelect": "Nederlands is currently selected",
            "lang-sv-SE-tooltipAtSelect": "Svenska is currently selected"
        },
        model: {
            lang: "nl-NL"
        },
        numOfLangPerPage: 3,
        controlValues: {
            lang: ["en-US", "fr-FR", "es-MX", "de-DE", "nl-NL", "sv-SE"]
        },
        stringArrayIndex: {
            lang: ["lang-en-US", "lang-fr-FR", "lang-es-MX", "lang-de-DE", "lang-nl-NL", "lang-sv-SE"],
            tooltip: ["lang-en-US-tooltip", "lang-fr-FR-tooltip", "lang-es-MX-tooltip", "lang-de-DE-tooltip", "lang-nl-NL-tooltip", "lang-sv-SE-tooltip"],
            tooltipAtSelect: ["lang-en-US-tooltipAtSelect", "lang-fr-FR-tooltipAtSelect", "lang-es-MX-tooltipAtSelect", "lang-de-DE-tooltipAtSelect", "lang-nl-NL-tooltipAtSelect", "lang-sv-SE-tooltipAtSelect"]
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
                expect: 37,
                name: "Test the language panel",
                sequence: [{
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyRendering",
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    listener: "gpii.tests.langTester.verifyTopDisplayedLang",
                    args: ["{lang}", "de-DE"],
                    priority: "last",
                    event: "{lang}.events.langButtonsReady"
                }, {
                    funcName: "gpii.tests.langTester.verifyPrevNextButtonsEnabled",
                    args: ["{lang}", true, false]
                }, {
                    funcName: "gpii.tests.langTester.hoverElm",
                    args: ["{lang}.dom.langRow", 0]
                }, {
                    listener: "gpii.tests.langTester.verifyTooltipLang",
                    args: ["{arguments}.2", "en-US"],
                    event: "{lang}.events.afterTooltipOpen"
                }, {
                    funcName: "gpii.tests.langTester.hoverElm",
                    args: ["{lang}.dom.langRow", 4]
                }, {
                    listener: "gpii.tests.langTester.verifyTooltipLang",
                    args: ["{arguments}.2", "nl-NL"],
                    event: "{lang}.events.afterTooltipOpen"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.prev"
                }, {
                    listener: "gpii.tests.langTester.verifyTopDisplayedLang",
                    args: ["{lang}", "es-MX"],
                    spec: {path: "displayLangIndex", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    funcName: "gpii.tests.langTester.verifyPrevNextButtonsEnabled",
                    args: ["{lang}", true, true]
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.next"
                }, {
                    listener: "gpii.tests.langTester.verifyTopDisplayedLang",
                    args: ["{lang}", "de-DE"],
                    spec: {path: "displayLangIndex", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    funcName: "gpii.tests.langTester.verifyPrevNextButtonsEnabled",
                    args: ["{lang}", true, false]
                }, {
                    funcName: "gpii.tests.langTester.clickLangButton",
                    args: ["{lang}", "fr-FR"]
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "fr-FR"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }
                // TODO Test moving selection with the keyboard
                // TODO Test activation of language with the keyboard
                ]
            }]
        }]
    });

    gpii.tests.langTester.hoverElm = function (elms, idx) {
        $(elms).eq(idx || 0).mouseover();
    };

    gpii.tests.langTester.verifyTooltip = function (that) {
        gpii.tests.utils.verifyTooltipContents("language button row element", that.locate("langRow"), that.model.lang, that.attachTooltipOnLang.tooltip.model.idToContent, that.options.controlValues.lang, that.options.stringArrayIndex.lang, that.options.messageBase);
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
        var numAriaSelectedTrue = 0;
        fluid.each(that.locate("langRow"), function (langButton, idx) {
            langButton = $(langButton);
            var langLabel = langButton.find(that.options.selectors.langLabel);
            jqUnit.assertEquals("The language button #" + idx + " has the correct label.", messages[stringArray[idx]], langLabel.text());
            var langButtonLang = langButton.attr("lang");
            var expectedAriaSelected = "false";
            if (langButtonLang === that.model.lang) {
                expectedAriaSelected = "true";
                numAriaSelectedTrue++;
            }
            jqUnit.assertEquals("The language button #" + idx + " (" + langButtonLang + ") has aria-selected=" + expectedAriaSelected, expectedAriaSelected, langButton.attr("aria-selected"));
        });

        jqUnit.assertEquals("Exactly one language button has aria-selected=true", 1, numAriaSelectedTrue);
        jqUnit.assertEquals("The language code has been added to the html \"lang\" attribute", that.model.lang, $("html").attr("lang"));

        gpii.tests.langTester.verifyTooltip(that);

        fluid.each(["prev", "next"], function (selector) {
            jqUnit.assertEquals("The tooltip definition for element " + selector + " has been populated", messages.navButtonTooltip, idToContent[that.locate(selector).attr("id")]);
        });
    };

    gpii.tests.langTester.verifyTopDisplayedLang = function (that, expectedTopLang) {
        var expectedIndex = that.options.controlValues.lang.indexOf(expectedTopLang);
        var msg = "Language " + expectedTopLang + " (index=" + expectedIndex +
                ") should be displayed top";
        jqUnit.assertEquals(msg, expectedIndex, that.model.displayLangIndex);
    };

    // TODO See if we can get this scrolling position verification working reliably
    // TODO Look at test page markup and CSS
    //
    // gpii.tests.langTester.verifyLangsInView = function (that, expectedVisibleLangs) {
    //     fluid.each(that.locate("langRow"), function(langButton) {
    //         langButton = $(langButton);
    //         var expected = expectedVisibleLangs.indexOf(langButton.attr("lang")) !== -1;
    //         gpii.tests.langTester.assertLangButtonInView(that, langButton, expected);
    //     });
    // };
    //
    // gpii.tests.langTester.assertLangButtonInView = function (that, langButton, expected) {
    //     var msg = "The button for language " + langButton.attr("lang") +
    //             " should be " + (expected ? "visible" : "non-visible");
    //     var langButtonTop = langButton.offset().top;
    //     var controlsDiv = that.locate("controlsDiv");
    //     var controlsDivTop = controlsDiv.offset().top;
    //     var isVisible = (Math.floor(langButtonTop) >= Math.floor(controlsDivTop)) &&
    //             (Math.floor(langButtonTop) < Math.floor(controlsDivTop + controlsDiv.height()));
    //     jqUnit.assertEquals(msg, expected, isVisible);
    // };

    gpii.tests.langTester.verifyPrevNextButtonsEnabled = function (that, prevEnabled, nextEnabled) {
        var prevEnabledMsg = prevEnabled ? "enabled" : "disabled";
        var nextEnabledMsg = nextEnabled ? "enabled" : "disabled";
        jqUnit.assertEquals("The previous button should be " + prevEnabledMsg, prevEnabled, !(that.locate("prev").is(":disabled")));
        jqUnit.assertEquals("The next button should be " + nextEnabledMsg, nextEnabled, !(that.locate("next").is(":disabled")));
    };

    gpii.tests.langTester.clickLangButton = function (that, langCode) {
        var langButtons = that.locate("langRow");
        $(langButtons).find("[lang='" + langCode + "']").click();
    };

    gpii.tests.langTester.verifyLangModel = function (that, expected) {
        jqUnit.assertEquals("The model value for the language is set correctly", expected, that.model.lang);
    };

    /*********************
     * Range panel Tests *
     *********************/

    fluid.defaults("gpii.tests.rangePanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            range: {},
            rangePanelTester: {
                type: "gpii.tests.rangePanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.rangePanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            increasedStep: 1.1,
            decreasedStep: 1.0,
            testValue: 1.5
        },
        expectedModels: {
            increasedStep: {value: "{that}.options.testOptions.increasedStep", isMax: false, isMin: false},
            decreasedStep:{value: "{that}.options.testOptions.decreasedStep", isMax: false, isMin: true}
        },
        modules: [{
            name: "Test the range settings panel",
            tests: [{
                expect: 19,
                name: "Test the rendering of the range panel",
                sequence: [{
                    func: "{range}.refreshView"
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyRendering",
                    priority: "last",
                    event: "{range}.events.afterRender"
                }, {
                    func: "{range}.stepUp"
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyModel",
                    args: ["{range}.model", "{that}.options.expectedModels.increasedStep"],
                    spec: {path: "", priority: "last"},
                    changeEvent: "{range}.applier.modelChanged"
                }, {
                    func: "{range}.stepDown"
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyModel",
                    args: ["{range}.model", "{that}.options.expectedModels.decreasedStep"],
                    spec: {path: "value", priority: "last"},
                    changeEvent: "{range}.applier.modelChanged"
                }, {
                    func: "{range}.applier.change",
                    args: ["value", "{range}.options.range.max"]
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyButtonStates",
                    args: ["{range}", true, false],
                    spec: {path: "isMax", priority: "last"},
                    changeEvent: "{range}.applier.modelChanged"
                }, {
                    func: "{range}.applier.change",
                    args: ["value", "{range}.options.range.min"]
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyButtonStates",
                    args: ["{range}", false, true],
                    spec: {path: "isMin", priority: "last"},
                    changeEvent: "{range}.applier.modelChanged"
                }, {
                    func: "{range}.applier.change",
                    args: ["value", "{that}.options.testOptions.testValue"]
                }, {
                    listener: "gpii.tests.rangePanelTester.verifyButtonStates",
                    args: ["{range}", false, false],
                    spec: {path: "isMin", priority: "last"},
                    changeEvent: "{range}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.rangePanelTester.verifyRendering = function (that) {
        var messages = that.options.messageBase;
        var panelName = that.nickName;
        jqUnit.assertEquals("The text for " + panelName + " instructions should be rendered.", messages.rangeInstructions, that.locate("rangeInstructions").text());
        jqUnit.assertEquals("The upper bound label for the " + panelName + " meter should be rendered.", messages.maxLabel, that.locate("max").text());
        jqUnit.assertEquals("The lower bound label for the " + panelName + " meter should be rendered.", messages.minLabel, that.locate("min").text());

        var increaseId = that.locate("increase").attr("id");
        var decreaseId = that.locate("decrease").attr("id");
        jqUnit.assertEquals("The tooltip model for the " + panelName + " increase button has been properly set", that.options.messageBase.increaseLabel, that.tooltip.model.idToContent[increaseId]);
        jqUnit.assertEquals("The tooltip model for the " + panelName + " decrease button has been properly set", that.options.messageBase.decreaseLabel, that.tooltip.model.idToContent[decreaseId]);
    };

    gpii.tests.rangePanelTester.verifyModel = function (model, expectedModel) {
        jqUnit.assertDeepEq("The model value " + expectedModel.value + " should be set correctly", expectedModel, model);
    };

    gpii.tests.rangePanelTester.verifyButtonStates = function (that, increaseDisabled, decreaseDisabled) {
        var panelName = that.nickName;
        jqUnit.assertEquals("The " + panelName + " isMax model value should be set correctly", increaseDisabled, that.model.isMax);
        jqUnit.assertEquals("The " + panelName + " increase button should have the correct enabled/disabled state", increaseDisabled, that.locate("increase").prop("disabled"));

        jqUnit.assertEquals("The " + panelName + " isMin model value should be set correctly", decreaseDisabled, that.model.isMin);
        jqUnit.assertEquals("The " + panelName + " decrease button should have the correct enabled/disabled state", decreaseDisabled, that.locate("decrease").prop("disabled"));
    };

    /*************************
     * Text Size Panel Tests *
     *************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.textSize", "autoInit"],
        messageBase: {
            rangeInstructions: "Adjust the text and controls to a size you like best.",
            maxLabel: "max",
            minLabel: "min",
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
        gradeNames: ["gpii.tests.rangePanel", "autoInit"],
        components: {
            range: {
                type: "gpii.tests.firstDiscovery.panel.textSize",
                container: ".gpiic-fd-textSize"
            }
        }
    });

    /***************************
     * Speech Rate Panel Tests *
     ***************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.speechRate", {
        gradeNames: ["gpii.firstDiscovery.panel.speechRate", "autoInit"],
        messageBase: {
            rangeInstructions: "Adjust the speed at which items on the screen are read out loud.",
            maxLabel: "fast",
            minLabel: "slow",
            increaseLabel: "faster",
            decreaseLabel: "slower",
            disabledMsg: "disabled message"
        },
        model: {
            enabled: true,
            value: 1
        },
        modelListeners: {
            // rerenders on modelChange like the panel behaves in the prefsEditor
            "value": "{that}.refreshView",
            "enabled": "{that}.refreshView"
        }
    });

    fluid.defaults("gpii.tests.speechRatePanel", {
        gradeNames: ["gpii.tests.rangePanel", "autoInit"],
        components: {
            range: {
                type: "gpii.tests.firstDiscovery.panel.speechRate",
                container: ".gpiic-fd-speechRate"
            },
            speechRatePanelTester: {
                type: "gpii.tests.speechRatePanelTester"
            }
        },
        expectedModels: {
            increasedStep: {value: "{that}.options.testOptions.increasedStep", isMax: false, isMin: false, enabled: true},
            decreasedStep:{value: "{that}.options.testOptions.decreasedStep", isMax: false, isMin: true, enabled: true}
        },
        distributeOptions: [{
            source: "{that}.options.expectedModels",
            target: "{that rangePanelTester}.options.expectedModels"
        }]
    });

    fluid.defaults("gpii.tests.speechRatePanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test the speech rate settings panel",
            tests: [{
                expect: 2,
                name: "Verify the initial rendering of the speech rate panel",
                type: "test",
                func: "gpii.tests.speechRatePanelTester.verifyRendering",
                args: ["{range}", true]
            }, {
                expect: 5,
                name: "Test the rendering of the speech rate panel after model change",
                sequence: [{
                    func: "{range}.applier.change",
                    args: ["enabled", false]
                }, {
                    listener: "gpii.tests.speechRatePanelTester.verifyRendering",
                    args: ["{range}", false],
                    priority: "last",
                    event: "{range}.events.afterRender"
                }, {
                    func: "{range}.applier.change",
                    args: ["enabled", true]
                }, {
                    listener: "gpii.tests.speechRatePanelTester.verifyRendering",
                    args: ["{range}", true],
                    priority: "last",
                    event: "{range}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.speechRatePanelTester.verifyRendering = function (that, isEnabled) {
        var controls = that.locate("controls");
        var disabledMsg = that.locate("disabledMsg");

        if (isEnabled) {
            jqUnit.isVisible("The controls should be visible.", controls);
            jqUnit.notVisible("The disabled message should be hidden.", disabledMsg);
        } else {
            jqUnit.notVisible("The controls should be hidden.", controls);
            jqUnit.isVisible("The disabled message should be visible.", disabledMsg);
            jqUnit.assertEquals("The disabledMsg should be rendered correctly.", that.options.messageBase.disabledMsg, disabledMsg.text());
        }
    };

    /**********************
     * Yes No Panel Tests *
     **********************/

    fluid.defaults("gpii.tests.yesNoTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        expectedModels: {
            choiceYes: {
                choice: "yes",
                currentSelectedIndex: 0,
                value: true
            },
            choiceNo: {
                choice: "no",
                currentSelectedIndex: 1,
                value: false
            }
        },
        modules: [{
            name: "Test the yes and no selection panel",
            tests: [{
                name: "Test the yes no panel",
                expect: 22,
                sequence: [{
                    func: "{yesNo}.refreshView"
                }, {
                    listener: "gpii.tests.yesNoTester.verifyRendering",
                    args: ["{arguments}.0", "{yesNo}.nickName"],
                    event: "{yesNo}.events.afterRender"
                }, {
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{yesNo}.dom.choiceInput", 1]
                }, {
                    listener: "gpii.tests.yesNoTester.verifyModel",
                    args: ["{yesNo}", "{yesNo}.nickName", "{that}.options.expectedModels.choiceNo"],
                    spec: {path: "choice", priority: "last"},
                    changeEvent: "{yesNo}.applier.modelChanged"
                }, {
                    func: "{yesNo}.refreshView"
                }, {
                    listener: "gpii.tests.yesNoTester.verifyTooltip",
                    args: ["{yesNo}", "{yesNo}.nickName"],
                    event: "{yesNo}.events.afterRender"
                }, {
                    func: "gpii.tests.utils.triggerRadioButton",
                    args: ["{yesNo}.dom.choiceInput", 0]
                }, {
                    listener: "gpii.tests.yesNoTester.verifyModel",
                    args: ["{yesNo}", "{yesNo}.nickName", "{that}.options.expectedModels.choiceYes"],
                    spec: {path: "choice", priority: "last"},
                    changeEvent: "{yesNo}.applier.modelChanged"
                }, {
                    func: "{yesNo}.refreshView"
                }, {
                    listener: "gpii.tests.yesNoTester.verifyTooltip",
                    args: ["{yesNo}", "{yesNo}.nickName"],
                    event: "{yesNo}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.yesNoTester.verifyTooltip = function (that, panelName) {
        gpii.tests.utils.verifyTooltipContents(panelName + " panel, choice label", that.locate("choiceLabel"), that.model.choice, that.tooltip.model.idToContent, that.options.controlValues.choice, that.options.stringArrayIndex.choice, that.options.messageBase);
        gpii.tests.utils.verifyTooltipContents(panelName + " panel, choice input", that.locate("choiceInput"), that.model.choice, that.tooltip.model.idToContent, that.options.controlValues.choice, that.options.stringArrayIndex.choice, that.options.messageBase);
    };

    gpii.tests.yesNoTester.verifyRendering = function (that, panelName) {
        var messages = that.options.messageBase;
        var controlValues = that.options.controlValues.choice;
        jqUnit.assertEquals(panelName + ": The instructions should have been set correctly.", messages.instructions, that.locate("instructions").text());
        gpii.tests.utils.verifyRadioButtonRendering(that.locate("choiceInput"), that.locate("choiceLabel"), [messages[controlValues[0]], messages[controlValues[1]]], that.model.choice);
        gpii.tests.yesNoTester.verifyTooltip(that, panelName);
    };

    gpii.tests.yesNoTester.verifyModel = function (that, panelName, expectedModel) {
        fluid.each(expectedModel, function (value, path) {
            jqUnit.assertEquals(panelName + ": The model value for path " + path + " has been set to " + value, value, fluid.get(that.model, path));
        });
    };

    /**************************
     * Speak Text Panel Tests *
     **************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.speakText", {
        gradeNames: ["gpii.firstDiscovery.panel.speakText", "autoInit"],
        messageBase: {
            "instructions": "Do you prefer to have items on the screen read out loud to you?",
            "no": "No",
            "yes": "Yes",
            "yes-tooltip": "Select to turn voice on",
            "no-tooltip": "Select to turn voice off",
            "yes-tooltipAtSelect": "Voice is on",
            "no-tooltipAtSelect": "Voice is off"
        },
        model: {
            value: true
        }
    });

    fluid.defaults("gpii.tests.speakTextPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            yesNo: {
                type: "gpii.tests.firstDiscovery.panel.speakText",
                container: ".gpiic-fd-speakText"
            },
            yesNoTester: {
                type: "gpii.tests.yesNoTester"
            }
        }
    });

    /**********************************
     * On-screen Keyboard Panel Tests *
     **********************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.onScreenKeyboard", {
        gradeNames: ["gpii.firstDiscovery.panel.onScreenKeyboard", "autoInit"],
        messageBase: {
            "instructions": "Do you want to use an on-screen keyboard? This would let you type by selecting letters on the screen.",
            "no": "No",
            "yes": "Yes",
            "yes-tooltip": "Select to turn on the on-screen keyboard",
            "no-tooltip": "Select to turn off the on-screen keyboard",
            "yes-tooltipAtSelect": "On-screen keyboard is turned on",
            "no-tooltipAtSelect": "On-screen keyboard is turned off"
        },
        model: {
            value: true
        }
    });

    fluid.defaults("gpii.tests.onScreenKeyboardPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            yesNo: {
                type: "gpii.tests.firstDiscovery.panel.onScreenKeyboard",
                container: ".gpiic-fd-onScreenKeyboard"
            },
            yesNoTester: {
                type: "gpii.tests.yesNoTester"
            }
        }
    });

    /************************
     * Captions Panel Tests *
     ************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.captions", {
        gradeNames: ["gpii.firstDiscovery.panel.captions", "autoInit"],
        messageBase: {
            "instructions": "Do you want to see text for speech (captions) when playing videos?",
            "no": "No",
            "yes": "Yes",
            "yes-tooltip": "Select to turn video captions on",
            "no-tooltip": "Select to turn video captions off",
            "yes-tooltipAtSelect": "Video captions are on",
            "no-tooltipAtSelect": "Video captions are off"
        },
        model: {
            value: true
        }
    });

    fluid.defaults("gpii.tests.captionsPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            yesNo: {
                type: "gpii.tests.firstDiscovery.panel.captions",
                container: ".gpiic-fd-captions"
            },
            yesNoTester: {
                type: "gpii.tests.yesNoTester"
            }
        }
    });

    /***************************
     * Show Sounds Panel Tests *
     ***************************/

    fluid.defaults("gpii.tests.firstDiscovery.panel.showSounds", {
        gradeNames: ["gpii.firstDiscovery.panel.showSounds", "autoInit"],
        messageBase: {
            "instructions": "Do you want the screen to flash when a sound is played?",
            "no": "No",
            "yes": "Yes",
            "yes-tooltip": "Select to turn on screen-flash for sounds",
            "no-tooltip": "Select to turn off screen-flash for sounds",
            "yes-tooltipAtSelect": "Screen-flash for sounds is on",
            "no-tooltipAtSelect": "Screen-flash for sounds is off"
        },
        model: {
            value: true
        }
    });

    fluid.defaults("gpii.tests.showSoundsPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            yesNo: {
                type: "gpii.tests.firstDiscovery.panel.showSounds",
                container: ".gpiic-fd-showSounds"
            },
            yesNoTester: {
                type: "gpii.tests.yesNoTester"
            }
        }
    });

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
            "gpii.tests.speechRatePanel",
            "gpii.tests.speakTextPanel",
            "gpii.tests.onScreenKeyboardPanel",
            "gpii.tests.captionsPanel",
            "gpii.tests.showSoundsPanel",
            "gpii.tests.contrastPanel",
            "gpii.tests.keyboardPanel",
            "gpii.tests.welcomePanel",
            "gpii.tests.congratulationsPanel"
        ]);
    });

})(jQuery, fluid);
