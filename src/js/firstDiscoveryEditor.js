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

    /*
     * The new prefs editor type for the first discovery tool
     */
    fluid.defaults("gpii.firstDiscovery.firstDiscoveryEditor", {
        gradeNames: ["fluid.viewRelayComponent", "fluid.prefs.prefsEditorLoader", "autoInit"],
        selectors: {
            prefsEditor: ".fdc-prefsEditor",
            help: ".fdc-help"
        },
        selectorsToIgnore: [],
        components: {
            prefsEditor: {
                container: "{that}.dom.prefsEditor",
                options: {
                    listeners: {
                        onReady: {
                            listener: "{firstDiscoveryEditor}.events.onPrefsEditorReady",
                            args: "{firstDiscoveryEditor}"
                        }
                    }
                }
            }
        },
        events: {
            onPrefsEditorReady: null
        }
    });

})(jQuery, fluid);
