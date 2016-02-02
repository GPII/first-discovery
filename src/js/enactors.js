/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

//TODO: the line and letter spacing values are reverted to default when the
//      textSize is adjusted
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

    /*********************
     * Line Space enactor*
     ********************/
    fluid.defaults("gpii.firstDiscovery.enactor.lineSpace", {
        gradeNames: ["fluid.prefs.enactor", "fluid.viewComponent"],
        preferenceMap: {
            "gpii.firstDiscovery.lineSpace": {
                "model.value": "default"
            }
        },
        members:{
            root:{
                expander:{
                    "this": "{that}.container",
                    "method" : "closest",
                    "args" : ["html"]
                }
            }
        },
        invokers: {
            set: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.set",
                args: ["{arguments}.0", "{that}", "{that}.container", "{that}.getLineHeightMultiplier"]
            },
            getTextSizeInPx: {
                funcName: "gpii.firstDiscovery.enactor.lineSpace.getTextSizeInPx",
                args: ["{that}.container"]
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
        if (!container.css("line-height")){
            return 1;
        }
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

    gpii.firstDiscovery.enactor.lineSpace.set = function (times, that, container, getLineHeightMultiplierFunc) {
        times = times || 1;
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
            // sets line-height for slider and preview
            that.container.css("line-height", targetLineSpace);
            // sets line-height for instruction text
            $("p").css("line-height", targetLineSpace);
            // Sets line-height in a way that voice toggle doesn't
            // trample the setting
            $("#gpiic-fd").css("line-height", targetLineSpace);
        }
    };

     /**
     * return "font-size" in px
     * @param (Object) container
     * @param (Object) fontSizeMap: the mapping between the font size string
     *                  values ("small", "medium" etc) to px values
     */
    gpii.firstDiscovery.enactor.lineSpace.getTextSizeInPx = function (container) {
        var fontSize = container.css("font-size");

        return parseFloat(fontSize);
    };

    /***********************
     * Letter Space enactor*
     **********************/
    fluid.defaults("gpii.firstDiscovery.enactor.letterSpace", {
        gradeNames: ["fluid.prefs.enactor", "fluid.viewComponent"],
        preferenceMap: {
            "gpii.firstDiscovery.letterSpace": {
                "model.value": "default"
            }
        },
        members:{
            root:{
                expander:{
                    "this": "{that}.container",
                    "method" : "closest",
                    "args" : ["html"]
                }
            }
        },
        invokers: {
            set: {
                funcName: "gpii.firstDiscovery.enactor.letterSpace.set",
                args: ["{arguments}.0", "{that}", "{that}.getLetterSpaceMultiplier"]
            },
            getTextSizeInPx: {
                funcName: "gpii.firstDiscovery.enactor.letterSpace.getTextSizeInPx",
                args: ["{that}.container"]
            },
            getLetterSpace: {
                funcName: "gpii.firstDiscovery.enactor.letterSpace.getLetterSpace",
                args: "{that}.container"
            },
            getLetterSpaceMultiplier: {
                funcName: "gpii.firstDiscovery.enactor.letterSpace.getLetterSpaceMultiplier",
                args: [{expander: {func: "{that}.getLetterSpace"}}, {expander: {func: "{that}.getTextSizeInPx"}}]
            }
        },
        modelListeners: {
            value: {
                listener: "{that}.set",
                args: ["{change}.value"]
            }
        }
    });

    gpii.firstDiscovery.enactor.letterSpace.getLetterSpace = function (container) {
        if (!container.css("letter-spacing")){
            return "1";
        }
        return container.css("letter-spacing");
    };

    gpii.firstDiscovery.enactor.letterSpace.getLetterSpaceMultiplier = function (letterSpace, fontSize) {
        if (!letterSpace) {
            return 0;
        }

        if (letterSpace === "normal") {
            return 1;
        }

        // Continuing the work-around of jQuery + IE bug - http://bugs.jquery.com/ticket/2671
        if (letterSpace.match(/[0-9]$/)) {
            return Number(letterSpace);
        }

        return Math.round(parseFloat(letterSpace) / fontSize * 100) / 100;
    };

    gpii.firstDiscovery.enactor.letterSpace.set = function (times, that, getLetterSpaceMultiplierFunc) {
        times = times || 1;
        if (!that.initialSize) {
            that.initialSize = getLetterSpaceMultiplierFunc();
        }

        if (that.initialSize) {
            var targetLetterSpace = times * that.initialSize;
            // Applies to tooltips
            that.container.css("letter-spacing", targetLetterSpace);
            // Applies to instruction text, etc
            $("#gpiic-fd").css("letter-spacing", targetLetterSpace);
        }
    };

     /**
     * return "font-size" in px
     * @param (Object) container
     * @param (Object) fontSizeMap: the mapping between the font size string
     *                  values ("small", "medium" etc) to px values
     */
    gpii.firstDiscovery.enactor.letterSpace.getTextSizeInPx = function (container) {
        var fontSize = container.css("font-size");


        // return fontSize in px
        return parseFloat(fontSize);
    };
})(jQuery, fluid);
