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
            var binderOpts = gpii.binder.getOptions(that.options.bindingOptions, value, key);
            var element = that.locate(binderOpts.selector);

            if (element.length > 0) {
                // Update the model when the form changes if bidirectional binding
                if (binderOpts.bidirectional) {
                    element.change(function () {
                        fluid.log("Changing model based on element update.");
                        var elementValue = binderOpts.accessFunction(element);
                        that.applier.change(binderOpts.path, elementValue);
                    });
                }

                // Update the form elements when the model changes
                that.applier.modelChanged.addListener(binderOpts.path, function (change) {
                    fluid.log("Changing value based on model update.");
                    binderOpts.accessFunction(element, change);
                });

                // If we have model data initially, update the form.  Model values win out over markup.
                var initialModelValue = fluid.get(that.model, binderOpts.path);
                if (initialModelValue !== undefined) {
                    binderOpts.accessFunction(element, initialModelValue);
                }
                // If we have no model data, but there are defaults in the markup, using them to update the model.
                else if (binderOpts.bidirectional) {
                    var initialFormValue = binderOpts.accessFunction(element);
                    if (initialFormValue) {
                        that.applier.change(binderOpts.path, initialFormValue);
                    }
                }
            }
            else {
                fluid.log("Could not locate element using selector '" + element.selector + "'...");
            }
        });
    };

    /**
     *
     * This function handles short notation and determines path, selector, accessFunction, and binding direction.
     * In short notation, the components default bindingOptions (if any) will be used.
     *
     * @param {Object} bindingOptions - A fluid viewComponent's bindingOptions definition. May be undefined.
     * @param {string} path - The path specified via short notation
     * @param {string} selector - The selector specified via short notation
     *
     * @returns {Object}   binderOptions - The options for this binding
     * @returns {string}   binderOptions.path - model path to be bound
     * @returns {string}   binderOptions.selector - selector for element to be bound
     * @returns {function} binderOptions.accessFunction - function that will set value in element
     * @returns {boolean}  binderOptions.bidirectional - indicates 2 way or 1 way (model->page) databinding
     *
     */
    gpii.binder.getShortOptions = function (bindingOptions, path, selector) {
        var binderOptions = {
            path: path,
            selector: selector
        };

        if (typeof bindingOptions === "undefined") {        // user did not specify, use default 2 way value binding
            binderOptions.accessFunction = fluid.value;
            binderOptions.bidirectional = true;
        } else {
            var methodAndDirection = gpii.binder.getMethodAndDirection(bindingOptions.method);
            binderOptions.accessFunction = methodAndDirection.accessFunction;
            binderOptions.bidirectional = methodAndDirection.bidirectional;
        }

        return binderOptions;
    };

    /**
     *
     * This function handles long notation and determines path, selector, accessFunction, and binding direction.
     * In long notation, the components default bindingOptions (if any) will be ignored.
     *
     * @param {Object} longOptions - A long notation bindings definition from a fluid viewComponent.
     *
     * @returns {Object}   binderOptions - The options for this binding
     * @returns {string}   binderOptions.path - model path to be bound
     * @returns {string}   binderOptions.selector - selector for element to be bound
     * @returns {function} binderOptions.accessFunction - function that will set value in element
     * @returns {boolean}  binderOptions.bidirectional - indicates 2 way or 1 way (model->page) databinding
     *
     */
    gpii.binder.getLongOptions = function (longOptions) {
        var binderOptions = {
            path: longOptions.path,
            selector: longOptions.selector
        };
        var methodAndDirection = gpii.binder.getMethodAndDirection(longOptions.method);

        binderOptions.accessFunction = methodAndDirection.accessFunction;
        binderOptions.bidirectional = methodAndDirection.bidirectional;

        return binderOptions;
    };

    /**
     *
     * This function returns the accessFunction and bidirectional values based on the method string.
     * It is common to both long and short notations.
     *
     * @param {string} method - A string indicating the method to access dom elements during binding
     *
     * @returns {Object}   togo - The options for this binding
     * @returns {function} togo.accessFunction - function that will set value in element
     * @returns {boolean}  togo.bidirectional - indicates 2 way or 1 way (model->page) databinding
     *
     */
    gpii.binder.getMethodAndDirection = function (method) {
        var togo = {};
        if (typeof method === "undefined") {            // not explicitly specified, default of 2 way value data binding will be used
            togo.accessFunction = fluid.value;
            togo.bidirectional = true;
        } else if (method === "text") {          // user explicitly specified text, one way text binding will be used
            togo.accessFunction = fluid.text;
            togo.bidirectional = false;
        } else if (method === "value") {          // user explicitly specified value, 2 way value binding will be used
            togo.accessFunction = fluid.value;
            togo.bidirectional = true;
        } else {
            // accessFunction and bidirectional not set to force failure on databind attempt
            fluid.log("binding method of " + method + " is unsupported");
        }
        return togo;
    };


    /**
     *
     * This function determines path, selector, accessFunction, and binding direction for a binding definition
     *
     *
     * @returns {Object}   binderOptions - The options for this binding
     * @returns {string}   binderOptions.path - model path to be bound
     * @returns {string}   binderOptions.selector - selector for element to be bound
     * @returns {function} binderOptions.accessFunction - function that will set value in element
     * @returns {boolean}  binderOptions.bidirectional - indicates 2 way or 1 way (model->page) databinding
     *
     */
    gpii.binder.getOptions = function (bindingOptions, value, key) {
        var isShortNotation = typeof value === "string" ? true : false;
        var isLongNotation = !isShortNotation;

        if (isShortNotation) {
            return gpii.binder.getShortOptions(bindingOptions, value, key);
        } else if (isLongNotation) {
            return gpii.binder.getLongOptions(value);
        }
    };

})(jQuery);

