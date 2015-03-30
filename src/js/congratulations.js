/*

Copyright 2015 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    fluid.defaults("gpii.firstDiscovery.loader", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        components: {
            templateLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{loader}.events.onTemplatesLoaded"
                    }
                }
            },
            messageLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{loader}.events.onMessagesLoaded"
                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null,
            onMessagesLoaded: null,
            onResourcesLoaded: {
                events: {
                    onTemplatesLoaded: "onTemplatesLoaded",
                    onMessagesLoaded: "onMessagesLoaded"
                }
            }
        },
        distributeOptions: [{
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }, {
            source: "{that}.options.messageLoader",
            removeSource: true,
            target: "{that > messageLoader}.options"
        }]
    });

    fluid.defaults("gpii.firstDiscovery.congratulations", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        selectors: {
            help: ".gpiic-congratulaions-help",
            content: ".gpiic-congratulaions-content",
            close: ".gpiic-congratulations-closeButton",
            closeLabel: ".gpiic-congratulations-closeLabel"
        },
        selectorsToIgnore: ["close"],
        styles: {
            show: "gpii-fd-show"
        },
        strings: {
            "content": "<p>Congratulations!</p><p>Your preferences have been saved to your account.</p>",
            "closeLabel": "close",
            "helpLabel": "help"
        },
        invokers: {
            close: {
                "this": "window",
                "method": "close"
            }
        },
        events: {},
        listeners: {
            "afterRender.bindClose": {
                "this": "{that}.dom.close",
                "method": "click",
                "args": "{that}.close"
            }
        },
        // components: {
        //     msgResolver: {
        //         type: "fluid.messageResolver"
        //     }
        // },
        // rendererOptions: {
        //     messageLocator: "{msgResolver}.resolve"
        // },
        renderOnInit: true,
        protoTree: {
            content: {
                markup: {messagekey: "content"}
            },
            closeLabel: {messagekey: "closeLabel"},
            help: {messagekey: "helpLabel"}
        },
        // distributeOptions: [{
        //     source: "{that}.options.messageBase",
        //     target: "{that > msgResolver}.options.messageBase"
        // }],
        // resources: {
        //     template: {}
        // },
        messageLoader: {}
    });

    fluid.defaults("gpii.firstDiscovery.congratulationsLoader", {
        gradeNames: ["fluid.viewRelayComponent", "gpii.firstDiscovery.loader", "autoInit"],
        components: {
            congratulations: {
                type: "gpii.firstDiscovery.congratulations",
                container: "{that}.container",
                createOnEvent: "onResourcesLoaded",
                options: {
                    // messageBase: "{messageLoader.}",
                    resources: {
                        template: "{templateLoader}.resources.congratulations"
                    }
                }
            }
        },
        listeners: {
            onTemplatesLoaded: {
                listener: "gpii.firstDiscovery.congratulations.consoleLog",
                priority: "first",
                args: ["onTemplatesLoaded", "{that}"]
            },
            onMessagesLoaded: {
                listener: "gpii.firstDiscovery.congratulations.consoleLog",
                priority: "first",
                args: ["onMessagesLoaded", "{that}"]
            },
            onResourcesLoaded: {
                listener: "gpii.firstDiscovery.congratulations.consoleLog",
                priority: "first",
                args: ["onResourcesLoaded", "{that}"]
            }
        },
        distributeOptions: [{
            source: "{that}.options.congratulations",
            removeSource: true,
            target: "{that > congratulations}.options"
        }, {
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }, {
            source: "{that}.options.messageLoader",
            removeSource: true,
            target: "{that > messageLoader}.options"
        }]
    });

    //TODO remove this test console log function
    gpii.firstDiscovery.congratulations.consoleLog = function (msg, obj) {
        console.log(msg, obj);
    };

})(jQuery, fluid);
