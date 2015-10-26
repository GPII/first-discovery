/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
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
