/*

 Add persistent bindings between a selector and a model value.  Changes are propagated between the two. See the
 documentation for more details:

 https://github.com/GPII/gpii-binder/

 This code was originally written by Antranig Basman <amb26@ponder.org.uk> and with his advice was updated and
 extended by Tony Atkins <tony@raisingthefloor.org>.

 */
/* global fluid, jQuery */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.binder");

    /**
     *
     * The main function to create bindings between markup and model elements.  See above for usage details.
     *
     * @param that - A fluid viewComponent with `options.bindings` and `options.selectors` defined. Optionally defines `options.bindingOptions`
     *
     *
     */
    gpii.binder.applyBinding = function (that) {
        var bindings = that.options.bindings;
        fluid.each(bindings, function (value, key) {
            var isShortNotation = typeof value === "string" ? true : false;

            var path = typeof value === "string" ? value : value.path;
            var selector = typeof value === "string" ? key : value.selector;
            var unidirectional = false;
            var elementAccessFunction = fluid.value;

            // in short notation, use default bindingOptions if specified on the component
            if (isShortNotation && (typeof that.options.bindingOptions !== "undefined")) {
                unidirectional = typeof that.options.bindingOptions.unidirectional === "undefined" ? unidirectional : that.options.bindingOptions.unidirectional;
                elementAccessFunction = typeof that.options.bindingOptions.method === "undefined" ? elementAccessFunction : fluid.getGlobalValue(that.options.bindingOptions.method);
            } else {
                // In long notation, use the binding specific unidirectional and element access method if provided
                unidirectional = typeof value.unidirectional === "undefined" ? unidirectional : value.unidirectional;
                elementAccessFunction = typeof value.method === "undefined" ? elementAccessFunction : fluid.getGlobalValue(value.method);
            }

            var element = that.locate(selector);

            if (element.length > 0) {
                // Update the model when the form changes unless unidirectional == true
                if (!unidirectional) {
                    element.change(function () {
                        fluid.log("Changing model based on element update.");
                        var elementValue = elementAccessFunction(element);
                        that.applier.change(path, elementValue);
                    });
                }

                // Update the form elements when the model changes
                that.applier.modelChanged.addListener(path, function (change) {
                    fluid.log("Changing value based on model update.");
                    elementAccessFunction(element, change);
                });

                // If we have model data initially, update the form.  Model values win out over markup.
                var initialModelValue = fluid.get(that.model, path);
                if (initialModelValue !== undefined) {
                    elementAccessFunction(element, initialModelValue);
                }
                // If we have no model data, but there are defaults in the markup, using them to update the model.
                else if (!unidirectional) {
                    var initialFormValue = elementAccessFunction(element);
                    if (initialFormValue) {
                        that.applier.change(path, initialFormValue);
                    }
                }
            }
            else {
                fluid.log("Could not locate element using selector '" + element.selector + "'...");
            }
        });
    };
})(jQuery);

