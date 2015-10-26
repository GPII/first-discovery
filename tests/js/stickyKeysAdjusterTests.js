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

    /************************
     * Sticky Keys Adjuster *
     ************************/

    fluid.defaults("gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster", {
        gradeNames: ["gpii.firstDiscovery.keyboard.stickyKeysAdjuster"],
        messageBase: {
            "try": "try it",
            "on": "ON",
            "off": "OFF",
            "turnOn": "turn ON",
            "turnOff": "turn OFF",

            "stickyKeysInstructions": "<strong>Sticky Keys</strong> can help with holding two keys down at once.",
            "stickyKeys": "Sticky Keys is",

            "tryTooltip": "Select to turn Sticky Keys on",
            "turnOnTooltip": "Select to turn Sticky Keys on",
            "turnOffTooltip": "Select to turn Sticky Keys off"
        },
        tryButtonTooltipState: null,
        events: {
            afterTooltipOpen: null,
            afterTooltipClose: null
        },
        listeners: {
            "afterTooltipOpen.setState": {
                listener: "gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster.setTooltipState",
                args: ["{that}", "{arguments}.1", true]
            },
            "afterTooltipClose.setState": {
                listener: "gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster.setTooltipState",
                args: ["{that}", "{arguments}.1", false]
            }
        },
        tooltipEvents: {
            afterOpen: "{gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster}.events.afterTooltipOpen",
            afterClose: "{gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster}.events.afterTooltipClose"
        },
        distributeOptions: {
            source: "{that}.options.tooltipEvents",
            target: "{that tooltip}.options.events"
        }
    });

    gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster.setTooltipState = function (that, target, state) {
        if ($(target).attr("id") === that.locate("tryButton").attr("id")) {
            that.options.tryButtonTooltipState = state;
        }
    };

    fluid.defaults("gpii.tests.keyboard.stickyKeysAdjusterTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            stickyKeysAdjuster: {
                type: "gpii.tests.firstDiscovery.keyboard.stickyKeysAdjuster",
                container: ".gpiic-fd-keyboard-stickyKeysAdjuster"
            },
            stickyKeysAdjusterTester: {
                type: "gpii.tests.keyboard.stickyKeysAdjusterTester"
            }
        }
    });

    fluid.defaults("gpii.tests.keyboard.stickyKeysAdjusterTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Tests the sticky keys component",
            tests: [{
                expect: 5,
                name: "Initial Rendering",
                type: "test",
                func: "gpii.tests.keyboard.stickyKeysAdjusterTester.verifyInitialRendering",
                args: ["{stickyKeysAdjuster}"]
            }, {
                expect:27,
                name: "Adjuster Workflow",
                sequence: [{
                    jQueryTrigger: "mouseover",
                    element: "{stickyKeysAdjuster}.dom.tryButton"
                }, {
                    listener: "gpii.tests.keyboard.stickyKeysAdjusterTester.verifyTryButtonTooltip",
                    args: ["{stickyKeysAdjuster}", true],
                    priority: "last",
                    event: "{stickyKeysAdjuster}.events.afterTooltipOpen"
                }, {
                    jQueryTrigger: "click",
                    element: "{stickyKeysAdjuster}.dom.tryButton"
                }, {
                    listener: "gpii.tests.keyboard.stickyKeysAdjusterTester.verifyTry",
                    args: ["{stickyKeysAdjuster}"],
                    spec: {path: "stickyKeysEnabled", priority: "last"},
                    changeEvent: "{stickyKeysAdjuster}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{stickyKeysAdjuster}.dom.accommodationToggle"
                }, {
                    listener: "gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAccommodationToggle",
                    args: ["{stickyKeysAdjuster}", false],
                    spec: {path: "stickyKeysEnabled", priority: "last"},
                    changeEvent: "{stickyKeysAdjuster}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{stickyKeysAdjuster}.dom.accommodationToggle"
                }, {
                    listener: "gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAccommodationToggle",
                    args: ["{stickyKeysAdjuster}", true],
                    spec: {path: "stickyKeysEnabled", priority: "last"},
                    changeEvent: "{stickyKeysAdjuster}.applier.modelChanged"
                }]
            }]
        }]
    });

    gpii.tests.keyboard.stickyKeysAdjusterTester.verifyInitialRendering = function (that) {
        var tryButton = that.locate("tryButton");
        var tryButtonID = tryButton.attr("id");

        jqUnit.assertEquals("The description should be rendered correctly.", that.options.messageBase.stickyKeysInstructions, that.locate("description").html());
        jqUnit.assertEquals("The try button should be rendered correctly", that.options.messageBase["try"], tryButton.text());
        jqUnit.isVisible("The try button should be visible", that.locate("tryButton"));
        jqUnit.notVisible("The sticky keys adjuster should not be visible", that.locate("accommodation"));

        jqUnit.assertEquals("The tooltip for the try button should have the correct content", that.options.messageBase.tryTooltip, that.tooltip.model.idToContent[tryButtonID]);
    };

    gpii.tests.keyboard.stickyKeysAdjusterTester.verifyTryButtonTooltip = function (that, expected) {
        var msg = expected ? "opened" : "closed";
        jqUnit.assertEquals("The tooltip for the try button is " + msg, expected, that.options.tryButtonTooltipState);
    };

    gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAdjusterRendering = function (that, isEnabled) {
        var accommodationToggle = that.locate("accommodationToggle");
        var accommodationToggleID = accommodationToggle.attr("id");

        jqUnit.assertEquals("The description should be rendered correctly.", that.options.messageBase.stickyKeysInstructions, that.locate("description").html());
        jqUnit.assertEquals("The accommodation name should be rendered correctly", that.options.messageBase.stickyKeys, that.locate("accommodationName").text());
        jqUnit.notVisible("The try button should not be visible", that.locate("tryButton"));
        jqUnit.isVisible("The sticky keys adjuster should be visible", that.locate("accommodation"));

        jqUnit.assertEquals("The state should be rendered correctly", that.options.messageBase[isEnabled ? "on" : "off"], that.locate("accommodationState").text());
        jqUnit.assertEquals("The toggle button should be rendered correctly", that.options.messageBase[isEnabled ? "turnOff" : "turnOn"], accommodationToggle.text());
        jqUnit.assertEquals("The tooltip for the accommodation toggle button should have the correct content", that.options.messageBase[isEnabled ? "turnOffTooltip" : "turnOnTooltip"], that.tooltip.model.idToContent[accommodationToggleID]);

    };

    gpii.tests.keyboard.stickyKeysAdjusterTester.verifyTry = function (that) {
        jqUnit.assertTrue("The tryAccommodation model value should be true", that.model.tryAccommodation);
        gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAccommodationToggle(that, true);
        gpii.tests.keyboard.stickyKeysAdjusterTester.verifyTryButtonTooltip(that, false);
    };

    gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAccommodationToggle = function (that, expectedState) {
        jqUnit.assertEquals("The stickyKeysEnabled model value should be set correctly", expectedState, that.model.stickyKeysEnabled);
        gpii.tests.keyboard.stickyKeysAdjusterTester.verifyAdjusterRendering(that, expectedState);
    };

    gpii.tests.keyboard.runTest = function () {
        fluid.test.runTests([
            "gpii.tests.keyboard.stickyKeysAdjusterTest"
        ]);
    };

})(jQuery, fluid);
