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
     * A grade component that is to be attached on components where tooltips are needed
     *
     * To use it: provide the option "tooltipContentMap" that defines the mapping between
     * the names in the selectors block and strings block for dom elements to have tooltips:
     * {
     *     "back": "backLabel"
     * }
     * The left hand side is the name in the selectors block for the element to have the tooltip.
     * The right hand side is the name in the strings block for the content to be shown for that element.
     */
    fluid.defaults("gpii.firstDiscovery.tooltip", {
        gradeNames: ["fluid.tooltip", "autoInit"],
        tooltipOptions: {},
        tooltipContentMap: {},  // Must be provided by integrators
        model: {
            idToContent: {
                expander: {
                    func: "{that}.getTooltipModel"
                }
            }
        },
        invokers: {
            getTooltipModel: {
                funcName: "gpii.firstDiscovery.tooltip.getTooltipModel",
                // Specifying each elements in argument list to force them to resolve.
                args: ["{that}.dom", "{that}.options.strings", "{that}.options.parentBundle", "{that}.options.tooltipContentMap"]
            }
        },
        distributeOptions: {
            source: "{that}.options.tooltipOptions",
            target: "{that}.options"
        }
    });

    gpii.firstDiscovery.tooltip.getTooltipModel = function (domBinder, strings, parentBundle, map) {
        var idToContent = {};

        fluid.each(map, function (string, selector) {
            var id = fluid.allocateSimpleId(domBinder.locate(selector));
            idToContent[id] = strings[string] || parentBundle.resolve(string);
        });

        return idToContent;
    };

})(jQuery, fluid);
