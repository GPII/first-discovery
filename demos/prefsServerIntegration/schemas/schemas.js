/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/fluid-project/first-discovery/raw/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    /*******************************************************************************
     * Auxiliary Schema for integrating with the preferences server
    *******************************************************************************/

    fluid.defaults("gpii.firstDiscovery.auxSchemaForPrefsServerIntegration", {
        gradeNames: ["gpii.firstDiscovery.auxSchema"],
        auxiliarySchema: {
            "loaderGrades": ["gpii.firstDiscovery.firstDiscoveryEditor", "gpii.firstDiscovery.prefsServerIntegration"],
            "terms": {
                "templatePrefix": "../../src/html",
                "messagePrefix": "../../src/messages"
            },
            "template": "../../src/html/firstDiscovery.html",
            "congratulations": {
                "panel": {
                    "message": "messages/congratulations.json"
                }
            }
        }
    });

})(jQuery, fluid);
