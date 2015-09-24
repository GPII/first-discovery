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

    fluid.registerNamespace("gpii.firstDiscovery.enactor");

    /*
     * Langauge enactor
     */
    fluid.defaults("gpii.firstDiscovery.enactor.lang", {
        gradeNames: ["fluid.prefs.enactor"],
        preferenceMap: {
            "gpii.firstDiscovery.language": {
                "model.lang": "default"
            }
        },
        members: {
            initialLangSet: false
        },
        modelListeners: {
            lang: {
                funcName: "gpii.firstDiscovery.enactor.lang.switchLang",
                args: ["{that}"]
            }
        },
        invokers: {
            reloadPage: {
                "this": "location",
                method: "reload",
                args: true
            }
        }
    });

    gpii.firstDiscovery.enactor.lang.switchLang = function (that) {
        // Do NOT reload the page the first time when the initial language model value is received.
        // excludeSource: "init" does not help because the language model value is passed in via
        // model relay which occurs after "init" takes place.
        if (that.initialLangSet) {
            that.reloadPage();
        }
        that.initialLangSet = true;
    };

})(jQuery, fluid);
