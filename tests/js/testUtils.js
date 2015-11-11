/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.utils.firstDiscovery");

    gpii.tests.utils.firstDiscovery.panels = [
        ".gpiic-fd-prefsEditor-panel-lang",
        ".gpiic-fd-prefsEditor-panel-welcome",
        ".gpiic-fd-prefsEditor-panel-speakText",
        ".gpiic-fd-prefsEditor-panel-speechRate",
        ".gpiic-fd-prefsEditor-panel-contrast",
        ".gpiic-fd-prefsEditor-panel-size",
        ".gpiic-fd-prefsEditor-panel-onScreenKeyboard",
        ".gpiic-fd-prefsEditor-panel-captions",
        ".gpiic-fd-prefsEditor-panel-showSounds",
        ".gpiic-fd-prefsEditor-panel-keyboard",
        ".gpiic-fd-prefsEditor-panel-congratulations"
    ];

    gpii.tests.utils.hasClass = function (elementName, element, selector, expected) {
        var stateMsg = expected ? " has " : " does not have ";
        jqUnit.assertEquals(elementName + stateMsg + selector + " applied", expected, element.hasClass(selector));
    };

    gpii.tests.utils.triggerRadioButton = function (radioButtons, idx) {
        radioButtons.eq(idx).click();
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

    gpii.tests.utils.simulateKeyEvent = function (onElement, keyEvent, keyCode, modifiers) {
        var eventObj = document.createEvent("Events");
        eventObj.initEvent(keyEvent, true, true);
        eventObj.which = keyCode;

        $.extend(eventObj, modifiers);

        onElement = $(onElement)[0];
        onElement.dispatchEvent(eventObj);
    };

    // A grade component that configs the token panel for testing
    // the integration with the preferences server
    fluid.defaults("gpii.tests.utils.panel.tokenConfig", {
        gradeNames: ["fluid.component"],
        members: {
            numOfOnSuccessFired: 0,
            numOfOnErrorFired: 0
        },
        listeners: {
            "onSuccess.count": {
                funcName: "{that}.increaseCount",
                args: ["numOfOnSuccessFired"]
            },
            "onError.count": {
                funcName: "{that}.increaseCount",
                args: ["numOfOnErrorFired"]
            }
        },
        invokers: {
            increaseCount: {
                funcName: "gpii.tests.utils.increaseCount",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    gpii.tests.utils.increaseCount = function (that, path) {
        fluid.set(that, path, that[path] + 1);
    };

    gpii.tests.utils.verifyTokenText = function (that, expectedText, msg) {
        jqUnit.assertEquals("The token text is set properly " + msg, expectedText, that.locate("token").html());
    };

    gpii.tests.utils.verifyEventFiring = function (that, numOfOnSuccessFired, numOfOnErrorFired) {
        jqUnit.assertEquals("The number of times that the onSuccess event is fired should be " + numOfOnSuccessFired, numOfOnSuccessFired, that.numOfOnSuccessFired);
        jqUnit.assertEquals("The number of times that the onError event is fired should be " + numOfOnErrorFired, numOfOnErrorFired, that.numOfOnErrorFired);
    };

    gpii.tests.utils.view = "myOwnApp";
    gpii.tests.utils.userToken = "de305d54-75b4-431b-adb2-eb6b9e546014";

    gpii.tests.utils.mockjaxSuccessConfig = {
        url: "/user?view=" + gpii.tests.utils.view,
        method: "POST",
        dataType: "json",
        response: function (settings) {
            this.responseText = {
                userToken: gpii.tests.utils.userToken,
                requestData: settings.data
            };
        }
    };

    gpii.tests.utils.mockjaxErrorConfig = {
        url: "/user?view=" + gpii.tests.utils.view,
        method: "POST",
        status: 401
    };

    gpii.tests.utils.addMockjax = function (mockjaxConfig) {
        $.mockjax(mockjaxConfig);
    };

    gpii.tests.utils.clearMockjax = function () {
        $.mockjaxClear();
    };

})(jQuery, fluid);
