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
        tts: 3,
        contrast: 4,
        textSize: 5,
        onScreenKeyboard: 6,
        keyboard: 7,
        secondLast: 7,
        congrats: 8,
        last: 8
    };

    gpii.tests.utils.hasClass = function (elementName, element, selector, expected) {
        var stateMsg = expected ? " has " : " does not have ";
        jqUnit.assertEquals(elementName + stateMsg + selector + " applied", expected, element.hasClass(selector));
    };

    gpii.tests.utils.triggerRadioButton = function (radioButtons, idx) {
        radioButtons.eq(idx).click();
    };

    gpii.tests.utils.simulateKeyEvent = function (elm, keyEvent, eventObj) {
        $(elm).triggerHandler(jQuery.Event(keyEvent, eventObj));
    };

    gpii.tests.utils.verifyRadioButtonRendering = function (inputs, inputLabels, labelText, selection) {
        fluid.each(inputLabels, function (elm, idx) {
            elm = $(elm);
            jqUnit.assertEquals("Choice #" + idx + " should have the correct label.", labelText[idx], elm.text());
        });
        jqUnit.assertEquals("The correct choice should be checked", selection, inputs.filter(":checked").val());
    };

    gpii.tests.utils.verifyTooltipContents = function (elemName, domElems, currentValue, idToContent, controlValues, stringArray, messages) {
        fluid.each(domElems, function (elem, idx) {
            var tooltipLabelSuffix = controlValues[idx] === currentValue ? "-tooltipAtSelect" : "-tooltip";
            elem = $(elem);
            jqUnit.assertEquals("The tooltip definition for the " + elemName + " #" + idx + " has been populated correctly", messages[stringArray[idx] + tooltipLabelSuffix], idToContent[elem.attr("id")]);
        });
    };

    gpii.tests.utils.verifyYesNoModel = function (that, modelPath, expectedSpeakValue, expectedChoiceValue) {
        jqUnit.assertEquals("The model value for \"" + modelPath + "\" should have been set correctly", expectedSpeakValue, fluid.get(that.model, modelPath));
        jqUnit.assertEquals("The model value for \"choice\" should have been set correctly", expectedChoiceValue, that.model.choice);
    };

})(jQuery, fluid);
