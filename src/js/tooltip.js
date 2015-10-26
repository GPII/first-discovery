/*

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery");

    /*
     * A grade component that is to be attached on components where tooltips are needed
     *
     * To use it: provide the option "tooltipContentMap" that defines the mapping between
     * the names in the selectors block and message bundle for dom elements to have tooltips.
     * Two methods to define mappings:
     *
     * 1. The direct mapping between one element and one label
     * {
     *     "": "containerLabel",
     *     "back": "backLabel"
     * }
     * The left hand side is the name in the selectors block for the element to have the tooltip.
     * Note: the empty string "" at the left hand is to reference the component container itself.
     * The right hand side is the name in the message bundle referencing the tooltip content for that element.
     *
     * 2. The mapping btw one common selector used by multiple DOM elements and their correspondig tooltips.
     * This is typically used by defining tooltips for rendered radio buttons or checkboxes. When
     * "langRow": {
     *     tooltip: ["label1", "label2"...],
     *     tooltipAtSelect: ["label1-at-select", "label2-at-select"...]
     * }
     * The left hand side is same as method 1 to define the name in the selectors block for elements to have tooltips.
     * The right hand side is an object with two paths: tooltip & tooltipAtSelect. Their values are arrays. "tooltip"
     * array contains names in the message bundle to be shown when mapped elements are not selected. "tooltipAtSelect"
     * contains names when elements are selected. The number of elements in these arrays should be same as the number
     * of elements that the left hand selector is attached to.
     */
    fluid.defaults("gpii.firstDiscovery.attachTooltip", {
        gradeNames: ["fluid.viewComponent"],
        tooltipOptions: {},
        tooltipContentMap: {},  // Must be provided by integrators
        model: {
            // currentSelectedIndex: 0  // Must be updated by integrators. The index of the currently selected element
        },
        components: {
            tooltip: {
                type: "fluid.tooltip",
                container: "{attachTooltip}.container",
                options: {
                    gradeNames: ["gpii.firstDiscovery.tts.tooltipHookup"],
                    model: {
                        idToContent: {
                            expander: {
                                func: "{that}.getTooltipModel"
                            }
                        }
                    },
                    invokers: {
                        updateIdToContent: {
                            changePath: "idToContent",
                            value: {
                                expander: {
                                    funcName: "{that}.getTooltipModel"
                                }
                            }
                        },
                        getElementInfo: {
                            funcName: "gpii.firstDiscovery.attachTooltip.getElementInfo",
                            args: ["{fluid.messageResolver}", "{arguments}.0", "{arguments}.1"]
                        },
                        getTooltipModel: {
                            funcName: "gpii.firstDiscovery.attachTooltip.getTooltipModel",
                            // Specifying each elements in the argument list to force them to resolve.
                            args: ["{attachTooltip}.dom", "{attachTooltip}.options.tooltipContentMap", "{that}.getElementInfo", "{attachTooltip}"]
                        }
                    }
                }
            }
        },
        listeners: { // FLOE-375: model may not be present at time of component creation
            "onCreate.updateIdToContent": "{that}.tooltip.updateIdToContent"
        },
        distributeOptions: {
            source: "{that}.options.tooltipOptions",
            target: "{that > tooltip}.options"
        }
    });

    // Return an object the element id and text for the given label
    gpii.firstDiscovery.attachTooltip.getElementInfo = function (msgResolver, element, label) {
        return {
            id: fluid.allocateSimpleId(element),
            msg: msgResolver.resolve(label)
        };
    };

    gpii.firstDiscovery.attachTooltip.getTooltipModel = function (domBinder, map, getElementInfo, attachTooltip) {
        // Passing in "{attachTooltip}" instead of "{attachTooltip}.model" is to avoid attachTooltip.model
        // being instantiated as undefined when it's not supposed to at the tool initialization. It would cause the
        // language enactor to unnecessarily reload the page twice.
        if (!attachTooltip.model) {
            return;
        }

        var idToContent = {};
        var currentSelectedIndex = attachTooltip.model.currentSelectedIndex;

        fluid.each(map, function (labelInfo, selector) {
            var element = domBinder.locate(selector);
            if (fluid.isPrimitive(labelInfo)) {
                var info = getElementInfo(element, labelInfo);
                idToContent[info.id] = info.msg;
            } else {
                fluid.each(element, function (oneElem, index) {
                    var info = getElementInfo(oneElem, (index === currentSelectedIndex && !!labelInfo.tooltipAtSelect) ? labelInfo.tooltipAtSelect[index] : labelInfo.tooltip[index]);
                    idToContent[info.id] = info.msg;
                });
            }
        });

        return idToContent;
    };

    // Updates the tooltip model after rendering to ensure that the mapping
    // between DOM elements and tooltip messages are correct.
    fluid.defaults("gpii.firstDiscovery.attachTooltip.renderer", {
        gradeNames: ["fluid.rendererComponent", "gpii.firstDiscovery.attachTooltip"],
        listeners: {
            "afterRender.updateTooltipModel": "{that}.tooltip.updateIdToContent"
        }
    });

})(jQuery, fluid);
