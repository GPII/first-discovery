/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests.keyboardShortcut");

    gpii.tests.keyboardShortcut.shortcuts = {
        "a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: []
        },
        "alt-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey"]
        },
        "ctrl-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["ctrlKey"]
        },
        "meta-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["metaKey"]
        },
        "shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["shiftKey"]
        },
        "alt-ctrl-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "ctrlKey"]
        },
        "alt-meta-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "metaKey"]
        },
        "alt-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "shiftKey"]
        },
        "ctrl-meta-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["ctrlKey", "metaKey"]
        },
        "ctrl-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["ctrlKey", "shiftKey"]
        },
        "meta-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["metaKey", "shiftKey"]
        },
        "alt-ctrl-meta-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "ctrlKey", "metaKey"]
        },
        "alt-ctrl-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "ctrlKey", "shiftKey"]
        },
        "alt-meta-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "metaKey", "shiftKey"]
        },
        "ctrl-meta-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["ctrlKey", "metaKey", "shiftKey"]
        },
        "alt-ctrl-meta-shift-a": {
            key: gpii.firstDiscovery.keyboardShortcut.key.a,
            modifiers: ["altKey", "ctrlKey", "metaKey", "shiftKey"]
        }
    };

    gpii.tests.keyboardShortcut.modifiersTestCases = [
        // none
        {altKey: false, ctrlKey: false, metaKey: false, shiftKey: false},

        // one
        {altKey: true, ctrlKey: false, metaKey: false, shiftKey: false},
        {altKey: false, ctrlKey: true, metaKey: false, shiftKey: false},
        {altKey: false, ctrlKey: false, metaKey: true, shiftKey: false},
        {altKey: false, ctrlKey: false, metaKey: false, shiftKey: true},

        // two
        {altKey: true, ctrlKey: true, metaKey: false, shiftKey: false},
        {altKey: true, ctrlKey: false, metaKey: true, shiftKey: false},
        {altKey: true, ctrlKey: false, metaKey: false, shiftKey: true},
        {altKey: false, ctrlKey: true, metaKey: true, shiftKey: false},
        {altKey: false, ctrlKey: true, metaKey: false, shiftKey: true},
        {altKey: false, ctrlKey: false, metaKey: true, shiftKey: true},

        // three
        {altKey: true, ctrlKey: true, metaKey: true, shiftKey: false},
        {altKey: true, ctrlKey: true, metaKey: false, shiftKey: true},
        {altKey: true, ctrlKey: false, metaKey: true, shiftKey: true},
        {altKey: false, ctrlKey: true, metaKey: true, shiftKey: true},

        // four
        {altKey: true, ctrlKey: true, metaKey: true, shiftKey: true}
    ];

    gpii.tests.keyboardShortcut.handlerFnCreator = function (fireRecord, recordName) {
        return function () {
            fireRecord[recordName] = (fireRecord[recordName] || 0) + 1;
        };
    };

    jqUnit.test("gpii.firstDiscovery.keyboardShortcut.bindShortcut", function () {
        var elm = $(".keyboardShortcut-test");
        var fireRecord = {};
        var expectedRecord = {
            "a": 1,
            "alt-a": 1,
            "ctrl-a": 1,
            "meta-a": 1,
            "shift-a": 1,
            "alt-ctrl-a": 1,
            "alt-meta-a": 1,
            "alt-shift-a": 1,
            "ctrl-meta-a": 1,
            "ctrl-shift-a": 1,
            "meta-shift-a": 1,
            "alt-ctrl-meta-a": 1,
            "alt-ctrl-shift-a": 1,
            "alt-meta-shift-a": 1,
            "ctrl-meta-shift-a": 1,
            "alt-ctrl-meta-shift-a": 1
        };

        // bind shortcuts
        fluid.each(gpii.tests.keyboardShortcut.shortcuts, function (shortcuts, shortcutName) {
            gpii.firstDiscovery.keyboardShortcut.bindShortcut(elm, shortcuts.key, shortcuts.modifiers, gpii.tests.keyboardShortcut.handlerFnCreator(fireRecord, shortcutName));
        });

        // run through key strokes
        fluid.each(gpii.firstDiscovery.keyboardShortcut.key, function (keyCode) {
            fluid.each(gpii.tests.keyboardShortcut.modifiersTestCases, function (modifiers) {
                gpii.tests.utils.simulateKeyEvent(elm, "keydown", keyCode, modifiers);
            });
        });

        jqUnit.assertDeepEq("The shortcuts should have been triggered the correct number of times", expectedRecord, fireRecord);
    });

})(jQuery, fluid);
