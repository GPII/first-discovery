/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.msgLookup");

    fluid.defaults("gpii.tests.firstDiscovery.msgLookup", {
        gradeNames: ["gpii.firstDiscovery.msgLookup", "fluid.rendererComponent"],
        selectors: {
            text: ".gpiic-msgLookup-text"
        },
        messageBase: {
            renderedText: "Rendered Text",
            unRenderedText: "Unrendered Text"
        },
        renderOnInit: true,
        protoTree: {
            text: {messagekey: "renderedText"}
        },
        lookedupText: "{that}.msgLookup.unRenderedText"
    });

    jqUnit.test("msgLookup", function () {
        var that = gpii.tests.firstDiscovery.msgLookup(".gpiic-msgLookup");

        jqUnit.assertEquals("The msgLookup should be working", that.options.messageBase.unRenderedText, that.options.lookedupText);
        jqUnit.assertEquals("The messagekey should be working", that.options.messageBase.renderedText, that.locate("text").text());
    });

})(jQuery, fluid);
