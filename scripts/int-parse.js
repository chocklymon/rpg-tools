"use strict";

/**
 * Returns true if the provided number is a number and not Infinity.
 * @param num
 * @returns {boolean}
 */
function validNumber(num) {
    return !isNaN(num) && isFinite(num)
}

/**
 * Returns true if the provided number is a natural (counting) number.
 *
 * To be a natural number the number must be a non-negative integer (0, 1, 2, 3, ...), not NaN and not Infinity.
 * @param num
 * @returns {boolean}
 */
function naturalNumber(num) {
    return !isNaN(num) && isFinite(num) && num >= 0 && Math.floor(num) === num;
}

/**
 * Returns the provided value as an integer if it can be parsed as an integer, otherwise it returns the value as is.
 * @param value
 * @returns {*}
 */
function parseIntSafe(value) {
    if (typeof value === 'number') {
        return value;
    }

    // Make sure we only have characters that can be a number
    if (/[^0-9\-.]/.test(value)) {
        return value;
    }
    let parsed = parseInt(value, 10);
    if (!validNumber(parsed)) {
        return value;
    }
    return parsed;
}

// Extend
parseIntSafe.parse = parseIntSafe;
parseIntSafe.validNumber = validNumber;
parseIntSafe.naturalNumber = naturalNumber;

module.exports = parseIntSafe;
