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

    fluid.registerNamespace("gpii.tests.firstDiscovery.panel.ranged.clip");

    gpii.tests.firstDiscovery.assertCalculation = function (calcFn, testCases) {
        fluid.each(testCases, function (testCase) {
            var calculatedVal = calcFn(testCase.value, testCase.min, testCase.max);
            jqUnit.assertEquals("The '" + testCase.name + "' returned the correct value", testCase.expected, calculatedVal);
        });
    };

    gpii.tests.firstDiscovery.panel.ranged.clip.testCases = [{
        name: "within bounds",
        min: 0,
        max: 1,
        value: 0.3,
        expected: 0.3
    }, {
        name: "below bounds",
        min: 1,
        max: 2,
        value: 0.3,
        expected: 1
    }, {
        name: "above bounds",
        min: 0,
        max: 1,
        value: 3,
        expected: 1
    }, {
        name: "invalid range",
        min: 1,
        max: 0,
        value: 0.3,
        expected: undefined
    }];

    jqUnit.test("gpii.firstDiscovery.panel.ranged.clip", function () {
        gpii.tests.firstDiscovery.assertCalculation(gpii.firstDiscovery.panel.ranged.clip, gpii.tests.firstDiscovery.panel.ranged.clip.testCases);
    });

    fluid.registerNamespace("gpii.tests.firstDiscovery.panel.ranged.calculatePercentage");

    gpii.tests.firstDiscovery.panel.ranged.calculatePercentage.testCases = [{
        name: "within bounds",
        min: 0,
        max: 1,
        value: 0.3,
        expected: 30
    }, {
        name: "below bounds",
        min: 1,
        max: 2,
        value: 0.3,
        expected: 0
    }, {
        name: "above bounds",
        min: 0,
        max: 1,
        value: 3,
        expected: 100
    }, {
        name: "invalid range",
        min: 1,
        max: 0,
        value: 0.3,
        expected: undefined
    }];

    jqUnit.test("gpii.firstDiscovery.panel.ranged.calculatePercentage", function () {
        gpii.tests.firstDiscovery.assertCalculation(gpii.firstDiscovery.panel.ranged.calculatePercentage, gpii.tests.firstDiscovery.panel.ranged.calculatePercentage.testCases);
    });

    /***************
     * Panel Tests *
     ***************/

    // A common test panel component to be shared by all panel tests
    fluid.defaults("gpii.tests.panels.defaultTestPanel", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        strings: {},
        testMessages: {},
        parentBundle: {
            expander: {
                funcName: "fluid.messageResolver",
                args: [{messageBase: "{that}.options.testMessages"}]
            }
        }
    });

    /*************************
     * Text Size Panel Tests *
     *************************/

    fluid.defaults("gpii.tests.prefs.panel.textSize", {
        gradeNames: ["gpii.firstDiscovery.panel.textSize", "gpii.tests.panels.defaultTestPanel", "autoInit"],
        testMessages: {
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
                expect: 11,
                name: "Test the rendering of the text size panel",
                sequence: [{
                    func: "{textSize}.refreshView"
                }, {
                    listener: "gpii.tests.textSizeTester.verifyRendering",
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
        fluid.each(that.options.testMessages, function (msg, name) {
            jqUnit.assertEquals("The " + name + " text should be rendered.", msg, that.locate(name).text());
        });
    };

    gpii.tests.textSizeTester.verifyModel = function (that, expectedModel) {
        jqUnit.assertEquals("The model value should be set correctly", expectedModel, that.model.value);
    };

    gpii.tests.textSizeTester.verifyButtonStates = function (that, increaseDisabled, decreaseDisabled) {
        jqUnit.assertEquals("The increase button should have the correct enabled/disabled state", increaseDisabled, that.locate("increase").prop("disabled"));
        jqUnit.assertEquals("The decrease button should have the correct enabled/disabled state", decreaseDisabled, that.locate("decrease").prop("disabled"));
    };

    /************************
     * Language Panel Tests *
     ************************/

    fluid.defaults("gpii.tests.prefs.panel.lang", {
        gradeNames: ["gpii.firstDiscovery.panel.lang", "gpii.tests.panels.defaultTestPanel", "autoInit"],
        testMessages: {
            "langInstructions": "Select your preferred language",
            "lang-en": "English",
            "lang-fr": "Français",
            "lang-es": "Español",
            "lang-de": "Deutsch",
            "lang-ne": "Nederlands",
            "lang-sv": "Svenska",
            "prev": "previous page",
            "next": "next page"
        },
        numOfLangPerPage: 2,
        model: {
            startButtonNum: 0
        }
    });

    fluid.defaults("gpii.tests.langPanel", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            lang: {
                type: "gpii.tests.prefs.panel.lang",
                container: ".gpiic-fd-lang",
                options: {
                    controlValues: {
                        lang: ["en", "fr", "es", "de", "ne", "sv"]
                    },
                    stringArrayIndex: {
                        lang: ["lang-en", "lang-fr", "lang-es", "lang-de", "lang-ne", "lang-sv"]
                    }
                }
            },
            langTester: {
                type: "gpii.tests.langTester"
            }
        }
    });

    fluid.defaults("gpii.tests.langTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            increasedStep: 1.1,
            decreasedStep: 1.0,
            testValue: 1.5
        },
        modules: [{
            name: "Test the language settings panel",
            tests: [{
                expect: 44,
                name: "Test the rendering of the language panel",
                sequence: [{
                    func: "{lang}.refreshView"
                }, {
                    listener: "gpii.tests.langTester.verifyRendering",
                    priority: "last",
                    event: "{lang}.events.afterRender"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.next"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", 1, [1, 2], false, false],
                    spec: {path: "startButtonNum", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{lang}.dom.prev"
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", 0, [0, 1], true, false],
                    spec: {path: "startButtonNum", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "{lang}.applier.change",
                    args: ["startButtonNum", 6]
                }, {
                    listener: "gpii.tests.langTester.verifyButtonStates",
                    args: ["{lang}", 6, [6], false, true],
                    spec: {path: "startButtonNum", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }, {
                    func: "gpii.tests.langTester.clickLangButton",
                    args: ["{lang}", "sv"]
                }, {
                    listener: "gpii.tests.langTester.verifyLangModel",
                    args: ["{lang}", "sv"],
                    spec: {path: "lang", priority: "last"},
                    changeEvent: "{lang}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.langTester.verifyRendering = function (that) {
        var messages = that.options.testMessages;
        jqUnit.assertEquals("The instructions text should be rendered.", messages.langInstructions, that.locate("instructions").text());

        fluid.each(that.locate("langRow"), function (langButton, index) {
            var langCode = that.options.controlValues.lang[index];
            jqUnit.assertEquals("The text for " + langCode + " button should be rendered.", messages[that.options.stringArrayIndex.lang[index]], $(langButton).find(that.options.selectors.langLabel).text());
        });

        gpii.tests.langTester.verifyButtonStates(that, 0, [0, 1], true, false);
    };

    gpii.tests.langTester.clickLangButton = function (that, langCode) {
        var langButtons = that.locate("langRow");
        $(langButtons).find("input[value='" + langCode + "']").click();
    };

    gpii.tests.langTester.verifyButtonStates = function (that, startButtonNum, panelsToShow, prevDisabled, nextDisabled) {
        jqUnit.assertEquals("The model value for the current page number is set correctly", startButtonNum, that.model.startButtonNum);
        var langButtons = that.locate("langRow");
        fluid.each(langButtons, function (button, index) {
            jqUnit.assertEquals("The display of the panel " + index + " is set properly", $.inArray(index, panelsToShow) !== -1, $(button).is(":visible"));
        });

        jqUnit.assertEquals("The disabled state of the previous button is set properly", prevDisabled, that.locate("prev").is(":disabled"));
        jqUnit.assertEquals("The disabled state of the next button is set properly", nextDisabled, that.locate("next").is(":disabled"));
    };

    gpii.tests.langTester.verifyLangModel = function (that, langCode) {
        jqUnit.assertEquals("The model value for the language is set correctly", langCode, that.model.lang);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.textSizePanel",
            "gpii.tests.langPanel"
        ]);
    });

})(jQuery, fluid);
