/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.firstDiscovery.messageResolver");

    fluid.defaults("gpii.tests.firstDiscovery.messageResolver", {
        gradeNames: ["fluid.rendererRelayComponent", "gpii.firstDiscovery.messageResolver", "autoInit"],
        selectors: {
            text: ".gpiic-messageResolver-text"
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

    jqUnit.test("messageResolver", function () {
        var that = gpii.tests.firstDiscovery.messageResolver(".gpiic-messageResolver");

        jqUnit.assertEquals("The msgLookup should be working", that.options.messageBase.unRenderedText, that.options.lookedupText);
        jqUnit.assertEquals("The messagekey should be working", that.options.messageBase.renderedText, that.locate("text").text());
    });

})(jQuery, fluid);
