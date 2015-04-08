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

    fluid.defaults("gpii.tests.firstDiscovery.congratulationsLoader", {
        gradeNames: ["gpii.firstDiscovery.congratulationsLoader", "autoInit"],
        templateLoader: {
            resources: {
                congratulations: "../../src/html/congratulationsTemplate.html"
            }
        },
        messageLoader: {
            resources: {
                congratulations: "../../src/messages/congratulations.json"
            }
        },
        components: {
            congratulations: {
                options: {
                    events: {
                        onClose: null
                    },
                    invokers: {
                        close: {
                            "this": null,
                            "method": null,
                            func: "{that}.events.onClose.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.tests.congratulationsTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            congratulationsLoader: {
                type: "gpii.tests.firstDiscovery.congratulationsLoader",
                createOnEvent: "{congratulationsTester}.events.onTestCaseStart",
                container: ".gpiic-congratulations"
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
                expect: 3,
                name: "Initialization",
                sequence: [{
                    listener: "gpii.tests.congratulationsTester.testRendering",
                    args: ["{congratulationsLoader}.congratulations"],
                    event: "{congratulationsTest congratulationsLoader congratulations}.events.afterRender"
                }]
            }, {
                expect: 1,
                name: "Interaction",
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{congratulationsLoader}.congratulations.dom.close"
                }, {
                    listener: "jqUnit.assert",
                    args: ["The close button is wired up to the close invoker"],
                    event: "{congratulationsLoader}.congratulations.events.onClose"
                }]
            }]
        }]
    });

    gpii.tests.congratulationsTester.testRendering = function (that) {
        var expectedContent = $(that.options.messageBase.content).text();
        jqUnit.assertEquals("The description should be rendered correctly", expectedContent, that.locate("content").text());
        jqUnit.assertEquals("The close button should be labeled correctly", that.options.messageBase.closeLabel, that.locate("closeLabel").text());
        jqUnit.assertEquals("The help button should be labeled correctly", that.options.messageBase.helpLabel, that.locate("help").text());
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.congratulationsTest"
        ]);
    });

})(jQuery, fluid);
