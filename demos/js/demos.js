/*

Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery/raw/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("demo.firstDiscovery");

    demo.firstDiscovery.init = function (container, auxSchemaGrade, cookieName) {
        container = $(container);
        var unsupportedText = "This browser is currently not supported. Please try using the latest version of Chrome or Safari.";

        if (fluid.textToSpeech.isSupported()) {
            fluid.prefs.create(container, {
                build: {
                    gradeNames: [auxSchemaGrade]
                },
                prefsEditor: {
                    store: {
                        cookie: {
                            name: cookieName
                        }
                    }
                }
            });
        } else {
            container.text(unsupportedText);
        }
    };

    /*
     * Create a UI Enhancer and add it to the page
     */
    demo.firstDiscovery.addUIE = function (container, options) {
        fluid.prefs.builder({
            gradeNames: [options.auxSchemaName],
            primarySchema: gpii.firstDiscovery.schemas
        });
        gpii.firstDiscovery.uie(container, {
            store: {
                cookie: {
                    name: options.cookieName
                }
            }
        });
    };

    /*
     * A grade component to handle the integration customizations for the demos.
     */
    fluid.defaults("demo.firstDiscovery.integration", {
        gradeNames: ["fluid.component"],
        demoURL: "",
        distributeOptions: [{
            target: "{that navButtons}.options.modelListeners.currentPanelNum",
            record: {
                listener: "demo.firstDiscovery.integration.showNextButton",
                args: ["{that}", "{change}.value"],
                namespace: "showNextButton",
                priority: "last",
                excludeSource: "init"
            }
        }, {
            target: "{that navButtons}.options.invokers.nextButtonClicked",
            record: {
                funcName: "demo.firstDiscovery.integration.nextTrigger",
                args: ["{that}", 1, "{integration}.options.demoURL"]
            }
        }]
    });

    demo.firstDiscovery.integration.showNextButton = function (that, currentPanelNum) {
        var nextButton = that.locate("next");
        var isLastPanel = currentPanelNum === that.options.panelTotalNum;
        var secondLastPanel = currentPanelNum === (that.options.panelTotalNum - 1);

        if (isLastPanel) {
            gpii.firstDiscovery.navButtons.toggleButtonStates(nextButton, !isLastPanel, that.options.styles.show);
        } else if (secondLastPanel) {
            var nextButtonID = fluid.allocateSimpleId(nextButton),
                nextLabel = that.msgResolver.resolve("next"),
                nextTooltipContent = that.msgResolver.resolve("nextTooltip");

            that.locate("nextLabel").html(nextLabel);
            that.tooltip.applier.change("idToContent." + nextButtonID, nextTooltipContent);
        }
    };

    demo.firstDiscovery.integration.nextTrigger = function (that, toChange, demoURL) {
        if (!that.model.isLastPanel) {
            gpii.firstDiscovery.navButtons.adjustCurrentPanelNum(that, 1);
        } else if (demoURL) {
            window.location.href = demoURL;
        }
    };

    /***************************
     * Demo Integration Grades *
     ***************************/

    fluid.defaults("demo.firstDiscovery.integration.voting", {
        gradeNames: ["demo.firstDiscovery.integration"],
        demoURL: "vote.html",
        // remove the step count component
        distributeOptions: [{
            target: "{that nav}.options.components.stepCount",
            record: {
                type: "fluid.emptySubcomponent"
            }
        }]
    });

    fluid.defaults("demo.firstDiscovery.integration.assessment", {
        gradeNames: ["demo.firstDiscovery.integration"],
        demoURL: "math3-2.html"
    });
})(jQuery, fluid);
