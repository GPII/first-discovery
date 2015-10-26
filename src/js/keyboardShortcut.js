/*
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/GPII/first-discovery/master/LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.firstDiscovery.keyboardShortcut");

    gpii.firstDiscovery.keyboardShortcut.key = {
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90
    };

    gpii.firstDiscovery.keyboardShortcut.modfiers = ["altKey", "ctrlKey", "metaKey", "shiftKey"];

    /**
     * elm {Object} - any jQueryable selector referring to the element to bind a keypress to
     * key {Int} - An integer representation of the key to bind as a shortcut (see: gpii.firstDiscovery.keyboardShortcut.key)
     * modifiers {Array} - an array of modifiers required ("altKey", "ctrlKey", "metaKey", "shiftKey")
     * func {Object} - the function to call when the shortcut is triggered.
     */
    gpii.firstDiscovery.keyboardShortcut.bindShortcut = function (elm, key, modifiers, func) {
        modifiers = fluid.arrayToHash(modifiers || []);

        $(elm).keydown(function (e) {
            var checkModifier = function (modKey, current) {
                return current && !!e[modKey] === !!modifiers[modKey]; /* convert to boolean */ /* jshint ignore:line */
            };

            var isCorrectlyModified = fluid.accumulate(gpii.firstDiscovery.keyboardShortcut.modfiers, checkModifier, true);

            if (e.which === key && isCorrectlyModified) {
                func();
            }
        });
    };

})(jQuery, fluid);
