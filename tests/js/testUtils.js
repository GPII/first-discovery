/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.utils");
    fluid.registerNamespace("gpii.tests.firstDiscovery");

    gpii.tests.firstDiscovery.panelNums = {
        first: 1,
        second: 2,
        lang: 1,
        welcome: 2,
        textSize: 3,
        tts: 4,
        contrast: 5,
        secondLast: 5,
        congrats: 6,
        last: 6
    };

    gpii.tests.utils.hasClass = function (elementName, element, selector, expected) {
        var stateMsg = expected ? " has " : " does not have ";
        jqUnit.assertEquals(elementName + stateMsg + selector + " applied", expected, element.hasClass(selector));
    };

})(jQuery, fluid);
