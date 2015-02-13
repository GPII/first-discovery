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
            decreasedStep: 1.0
        },
        modules: [{
            name: "Test the text sizer settings panel",
            tests: [{
                expect: 5,
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

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.textSizePanel"
        ]);
    });

})(jQuery, fluid);
