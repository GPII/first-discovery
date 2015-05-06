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
        gradeNames: ["fluid.prefs.enactor", "autoInit"],
        preferenceMap: {
            "locale": {
                "model.lang": "default"
            }
        },
        members: {
            componentInited: false
        },
        modelListeners: {
            lang: {
                funcName: "gpii.firstDiscovery.enactor.lang.refreshPage",
                args: ["{that}", "{change}.value"]
            }
        }
    });

    gpii.firstDiscovery.enactor.lang.refreshPage = function (that, lang) {
        // Do NOT reload the page at the component instantiation
        if (that.componentInited) {
            location.reload(true);
        }
        that.componentInited = true;
    };

})(jQuery, fluid);
