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

    fluid.defaults("gpii.firstDiscovery.enactor.lineSpace", {
        gradeNames: ["fluid.prefs.enactor", "fluid.viewComponent"],
        preferenceMap: {
            "fluid.prefs.lineSpace": {
                "model.value": "default"
            }
        },
        fontSizeMap: {},  // must be supplied by implementors
        invokers: {
            set: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.set",
                args: ["{arguments}.0", "{that}", "{that}.getLineHeightMultiplier"]
            },
            getTextSizeInPx: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.getTextSizeInPx",
                args: ["{that}.container", "{that}.options.fontSizeMap"]
            },
            getLineHeight: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.getLineHeight",
                args: "{that}.container"
            },
            getLineHeightMultiplier: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.getLineHeightMultiplier",
                args: [{expander: {func: "{that}.getLineHeight"}}, {expander: {func: "{that}.getTextSizeInPx"}}]
            }
        },
        modelListeners: {
            value: {
                listener: "{that}.set",
                args: ["{change}.value"]
            }
        }
    });

    // Get the line-height of an element
    // In IE8 and IE9 this will return the line-height multiplier
    // In other browsers it will return the pixel value of the line height.
    gpii.firstDiscovery.enactor.lineSpace.getLineHeight = function (container) {
        return container.css("line-height");
    };

    gpii.firstDiscovery.enactor.lineSpace.getLineHeightMultiplier = function (lineHeight, fontSize) {
        // Handle the given "lineHeight" argument is "undefined", which occurs when firefox detects
        // "line-height" css value on a hidden container. (http://issues.fluidproject.org/browse/FLUID-4500)
        if (!lineHeight) {
            return 0;
        }

        // Needs a better solution. For now, "line-height" value "normal" is defaulted to 1.2em
        // according to https://developer.mozilla.org/en/CSS/line-height
        if (lineHeight === "normal") {
            return 1.2;
        }

        // Continuing the work-around of jQuery + IE bug - http://bugs.jquery.com/ticket/2671
        if (lineHeight.match(/[0-9]$/)) {
            return Number(lineHeight);
        }

        return Math.round(parseFloat(lineHeight) / fontSize * 100) / 100;
    };

    gpii.firstDiscovery.enactor.lineSpace.set = function (times, that, getLineHeightMultiplierFunc) {
        // Calculating the initial size here rather than using a members expand because the "line-height"
        // cannot be detected on hidden containers such as separated paenl iframe.
        if (!that.initialSize) {
            that.initialSize = getLineHeightMultiplierFunc();
        }

        // that.initialSize === 0 when the browser returned "lineHeight" css value is undefined,
        // which occurs when firefox detects "line-height" value on a hidden container.
        // @ See getLineHeightMultiplier() & http://issues.fluidproject.org/browse/FLUID-4500
        if (that.initialSize) {
            var targetLineSpace = times * that.initialSize;
            //TODO: this isn't very infusion-y
            $("p").css("line-height", targetLineSpace);
        }
    };

     /**
     * return "font-size" in px
     * @param (Object) container
     * @param (Object) fontSizeMap: the mapping between the font size string values ("small", "medium" etc) to px values
     */
    gpii.firstDiscovery.enactor.lineSpace.getTextSizeInPx = function (container, fontSizeMap) {
        var fontSize = container.css("font-size");

        if (fontSizeMap[fontSize]) {
            fontSize = fontSizeMap[fontSize];
        }

        // return fontSize in px
        return parseFloat(fontSize);
    };

})(jQuery, fluid);
