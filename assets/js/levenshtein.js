(function() {
    'use strict';

    function levenshtein(a, b) {
        if (a.length === 0) {
            return b.length;
        }
        if (b.length === 0) {
            return a.length;
        }
        var tmp, i, j, prev, val, row;
        // swap to save some memory O(min(a,b)) instead of O(a)
        if (a.length > b.length) {
            tmp = a;
            a = b;
            b = tmp;
        }

        row = new Array(a.length + 1);
        // init the row
        for (i = 0; i <= a.length; i++) {
            row[i] = i
        }

        // fill in the rest
        for (i = 1; i <= b.length; i++) {
            prev = i;
            for (j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    val = row[j - 1]; // match
                } else {
                    val = Math.min(
                        row[j - 1] + 1, // substitution
                        Math.min(
                            prev + 1,   // insertion
                            row[j] + 1  // deletion
                        )
                    );
                }
                row[j - 1] = prev;
                prev = val;
            }
            row[a.length] = prev;
        }
        return row[a.length];
    }

    if (window.angular) {
        // Register as an angular module
        angular.module('co.levenshtein', []).factory('levenshtein', [function() {
            return levenshtein;
        }]);
    } else {
        // Attach to the window
        window.levenshtein = levenshtein;
    }
})();
