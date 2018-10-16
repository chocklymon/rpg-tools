jQuery(function($) {
    // ------------------------------------
    // Define the Forgotten Realms Calendar
    var frCalendar = {
        monthsPerYear: 12,
        daysPerMonth: 30,
        daysPerWeek: 10,
        monthNames: ["Hammer", "Alturiak", "Ches", "Tarsakh", "Mirtul", "Kythorn", "Flamerule", "Eleasis", "Eleint", "Marpenoth", "Uktar", "Nightal"],
        extraDays: {
            // Keyed by the month the extra day follows
            // Note: Months are zero indexed
            0:  "Midwinter (Annual Holiday)",
            3:  "Greengrass (Annual Holiday)",
            6:  "Midsummer (Annual Holiday)",
            8:  "Highharvestide (Annual Holiday)",
            10: "The Feast of the Moon (Annual Holiday)"
        },
        extraDayNum: 31,
        leapDayNum: 32,
        holidays: {
            // Keyed first by the month, and then by the day in that month
            2:  { 19: "Ches 19: Spring Equinox" },
            5:  { 20: "Kythorn 20: Summer Solstice" },
            8:  { 21: "Eleint 21: Autumn Equinox" },
            11: { 20: "Nightal 20: Winter Solstice" }
        },
        calendarYearCycle: 4,
        leapDayMonth: 6, // Leap year day happens at the end of Flamerule
        leapDayName: "Shieldmeet (Once Every Four Years)",
        moonPhases: {
            // Moon phase data by year % 4 (moon phases repeat every four years)
            // 0 means no data, 1-16 represent the various phases
            // Each row represents a month with 32 days
            0: [
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 2, 0,
                2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 2, 0,
                2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0
            ],
            1: [
                2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 2, 0,
                2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0
            ],
            2: [
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 2, 0,
                2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0
            ],
            3: [
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,16,16, 1, 0, 0,
                2, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9,10,10,11,11,12,12,13,14,14,14,15,15,16,16,16, 0,
                1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9,10,10,11,11,11,12,12,13,14,14,15,15,15,16,16, 0, 0
            ]
        },
        rollOfYears: {}, // Defined in year.json
        rollOfYearsStart: 0,
        rollOfYearsEnd: 0
    };

    /**
     * Returns TRUE if the provided year is a leap year.
     * @param {int} year - The year to check.
     * @returns {boolean}
     */
    frCalendar.isLeapYear = function(year) {
        return year % frCalendar.calendarYearCycle === 0;
    };

    /**
     * Returns TRUE if the provided year and month should include the leapday.
     * @param {int} year - The year to check.
     * @param {int} month - The month to check.
     * @returns {boolean}
     */
    frCalendar.includeLeapDay = function(year, month) {
        return frCalendar.isLeapYear(year) && month === frCalendar.leapDayMonth;
    };

    /**
     * Returns the moon phase array for the given year.
     * @param {int} year - The year to get the moon phase for.
     * @param {int} [month] - Optionally only get the phases for a given month.
     * @returns {int[]} A 12x32 matrix of moon phases. Each moon phase is represented by a number in the range of 1 to
     * 16, where 1 is the full moon, 2 is waning gibbous, and so on util 16 for waxing gibbous. Zero represents no data.
     */
    frCalendar.getMoonPhases = function (year, month) {
        var phases = frCalendar.moonPhases[year % frCalendar.calendarYearCycle];
        if (month >= 0 && month < frCalendar.monthsPerYear) {
            phases = phases.slice(month * 32, (month + 1) * 32);
        }
        return phases;
    };

    /**
     * Gets the names of the extra day(s).
     *
     * Extra days are considered to be part of the month preceding them.
     *
     * @param {int} year - The year to get extra days for.
     * @param {int} [month] - The month to get extra days for.
     * @param {int} [day] - The particular day of the month to get the name for.
     * @returns {string[]|string|null} If the day is provided returns the name of the extra day or null if
     * there is no matching extra day. Otherwise, returns an array of extra day names specific to the year and month
     * (if provided).
     * For example: getExtraDayName(0, 0, 31) returns "Midwinter" for the extra day added to the end of of Hammer.
     */
    frCalendar.getExtraDayName = function(year, month, day) {
        var extraDays = [];
        if (day) {
            // Get the extra day for the month
            if (day == frCalendar.extraDayNum && month in frCalendar.extraDays) {
                return frCalendar.extraDays[month];
            } else if (day == frCalendar.leapDayName && frCalendar.includeLeapDay(year, month)) {
                return frCalendar.leapDayName;
            }
        } else if (month) {
            // Get the extra days for the provided month
            if (month in frCalendar.extraDays || month == frCalendar.leapDayMonth) {
                if (month in frCalendar.extraDays) {
                    extraDays.push(frCalendar.extraDays[month]);
                }
                if (frCalendar.includeLeapDay(year, month)) {
                    extraDays.push(frCalendar.leapDayName);
                }
                return extraDays;
            }
        } else if (year) {
            // Get the extra days for this year
            forEach(frCalendar.extraDays, function(name) {
                extraDays.push(name);
            });
            if (frCalendar.isLeapYear(year)) {
                extraDays.push(frCalendar.leapDayName);
            }
            return extraDays;
        }
        return null;
    };

    /**
     * Get a list of holidays with information about the holiday.
     * @param {int} year
     * @param {int} month
     * @returns {object[]}
     */
    frCalendar.getHolidays = function(year, month) {
        var holidays = [];
        if (frCalendar.extraDays[month]) {
            // This month has an extra day
            holidays.push({type: 'extra', day: frCalendar.extraDayNum, name: frCalendar.extraDays[month]});
        }
        if (frCalendar.includeLeapDay(year, month)) {
            // Include the leap day
            holidays.push({type: 'extra', day: frCalendar.leapDayNum, name: frCalendar.leapDayName});
        }
        if (frCalendar.holidays[month]) {
            forEach(frCalendar.holidays[month], function(holiday, day) {
                holidays.push({type: 'holiday', day: day, name: holiday});
            });
        }
        return holidays;
    };

    /**
     * Gets the year name.
     * @param {int} year The year number.
     * @returns {string} The year name from the Roll of Years or an empty string if the year doesn't have a name.
     */
    frCalendar.getYearName = function(year) {
        if (year in frCalendar.rollOfYears) {
            return frCalendar.rollOfYears[year];
        }
        return '';
    };


    // ------------------------------------
    // Define the Notes
    var notes = (function() {
        var MONTHS_KEY = '_months';
        var notesData = {};

        /**
         * Add one string to another with a space between them if the first string is none empty
         * @param {string} str
         * @param {string} add
         * @returns {string}
         */
        function strAppend(str, add) {
            if (str.length > 0) {
                return str + ' ' + add;
            }
            return add;
        }

        /**
         * Format a note into an HTML string for display.
         * @param {string|string[]} note
         * @param {int|null} [year] If provided the year will be prepended to the note. If the month and day are not provided
         * the year name will also be prepended to the name.
         * @param {int|null} [month] If provided the month name will be prepended to the note.
         * @param {int} [day] If provided the day will be prepended to the note.
         * @returns {string}
         */
        function formatNote(note, year, month, day) {
            var normalized = '',
                dateString = '',
                first = true,
                extraDayName;

            // Prepend the date to the note if provided
            if (year != null || month != null || day) {
                if (month >= 0 && day && day > frCalendar.daysPerMonth) {
                    extraDayName = frCalendar.getExtraDayName(year, month, day);
                    if (!extraDayName && month == frCalendar.leapDayMonth && day == frCalendar.leapDayNum) {
                        // Manually include the leap day info if needed
                        extraDayName = frCalendar.leapDayName;
                    }
                }
                if (year != null) {
                    dateString += year;
                    if (!(month || day) && year in frCalendar.rollOfYears) {
                        dateString += ' ' + frCalendar.rollOfYears[year];
                    }
                }
                if (month != null && month in frCalendar.monthNames) {
                    if (!extraDayName) {
                        dateString = strAppend(dateString, frCalendar.monthNames[month]);
                    }
                }
                if (day) {
                    if (extraDayName) {
                        dateString = strAppend(dateString, extraDayName);
                    } else {
                        dateString = strAppend(dateString, day);
                    }
                }
                normalized += '<i>' + dateString + ':</i> ';
            }

            if (Array.isArray(note)) {
                forEach(note, function(txt) {
                    if (first) {
                        normalized = '<p>' + normalized + txt + '</p>';
                        first = false;
                    } else {
                        normalized += '<p>' + txt + '</p>';
                    }
                });
            } else {
                normalized = '<p>' + normalized + note + '</p>';
            }
            return normalized;
        }

        /**
         * Extracts all the notes that should be displayed for the given year and month formatted for display.
         * Returns global notes first, then global month notes, then day specific notes
         * @param {object} notes - The note object to search for notes.
         * @returns {string[]}
         */
        function getAllNotes(notes) {
            var globalNotes = [];
            var yearNotes = [];
            var monthNotes = [];
            var dayNotes = [];

            var addMonthNotes = function(notesForMonth, monthKey, yearKey) {
                forEach(notesForMonth, function (note, dayKey) {
                    if (dayKey[0] === '_') {
                        // Global month note
                        monthNotes.push(formatNote(note, yearKey, monthKey));
                    } else {
                        dayNotes.push(formatNote(note, yearKey, monthKey, dayKey));
                    }
                });
            };

            var addYearNotes = function(notesForYear, yearKey) {
                forEach(notesForYear, function (notesForMonth, monthKey) {
                    if (monthKey[0] === '_') {
                        // Year long note
                        yearNotes.push(formatNote(notesForMonth, yearKey));
                    } else {
                        // Month notes
                        addMonthNotes(notesForMonth, monthKey, yearKey);
                    }
                });
            };

            // Add all year notes
            forEach(notes, function (note, key) {
                if (key === MONTHS_KEY) {
                    // Global month notes
                    forEach(note, function(monthNotes, monthKey) {
                        addMonthNotes(monthNotes, monthKey);
                    });
                } else if (key[0] === '_') {
                    // Global note
                    globalNotes.push(formatNote(note));
                } else {
                    // Year note
                    addYearNotes(note, key);
                }
            });

            return globalNotes.concat(yearNotes.concat(monthNotes.concat(dayNotes)));
        }

        function getCurrentNotesFor(notes, title, currentNotes, year, month) {
            var addNote = function(dest, note) {
                dest.push({ 'title': title, 'note': note });
            };

            var addMonthNotes = function(note) {
                forEach(note, function(n, k) {
                    if (k[0] === '_') {
                        // Global month note
                        addNote(currentNotes.month, n);
                    } else {
                        if (!(k in currentNotes.day)) {
                            currentNotes.day[k] = [];
                        }
                        addNote(currentNotes.day[k], n);
                    }
                });
            };

            if (year in notes) {
                // Have notes for this year
                forEach(notes[year], function(note, key) {
                    if (key[0] === '_') {
                        // Global year note
                        addNote(currentNotes.year, note);
                    } else if (key == month) {
                        // Notes for this month
                        addMonthNotes(note);
                    }
                });
            }
            if (MONTHS_KEY in notes && month in notes[MONTHS_KEY]) {
                addMonthNotes(notes[MONTHS_KEY][month]);
            }

            return currentNotes;
        }

        function getCurrentNotes(year, month) {
            var currentNotes = {
                "year": [],
                "month": [],
                "day": {}
            };

            if ('historical' in notesData) {
                getCurrentNotesFor(notesData.historical, 'Historical Notes', currentNotes, year, month);
            }
            if ('personal' in notesData) {
                getCurrentNotesFor(notesData.personal, 'Personal Notes', currentNotes, year, month);
            }

            return currentNotes;
        }

        function formatNotes(notes) {
            var html = '',
                lastTitle = '';
            forEach(notes, function(note) {
                if (note.title !== lastTitle) {
                    if (html.length > 0) {
                        html += '</ul>';
                    }
                    html += '<h5>' + note.title + '</h5><ul>';
                    lastTitle = note.title;
                }
                html += '<li>' + formatNote(note.note) + '</li>';
            });
            if (html.length > 0) {
                html += '</ul>';
            }
            return html;
        }

        /**
         * Build a function that returns a pre-formatted list notes from a given category.
         * @param {string} category
         * @returns {Function}
         * @constructor
         */
        function GetAllFor(category) {
            return function() {
                if (category in notesData) {
                    return getAllNotes(notesData[category]);
                }
                return [];
            };
        }

        return {
            /**
             * Get a list of all historical notes (pre-formatted).
             * @return {string[]}
             */
            getAllHistoric: GetAllFor('historical'),
            /**
             * Get a list of all personal notes (pre-formatted).
             * @return {string[]}
             */
            getAllPersonal: GetAllFor('personal'),
            getCurrent: getCurrentNotes,
            getFormattedFrom: formatNotes,
            /**
             * Set the notes to use
             * @param {object} notes
             */
            setNotes: function(notes) {
                notesData = notes;
            }
        };
    })();


    // ------------------------------------
    // Define some helpers

    // Contains references to all dialogs as well as code to handle them
    var dialogs = (function() {
        // Create the default options
        var defaultOptions = {
            autoOpen: false,
            height: $(window).height(),
            width: 500,
            position: { my: "left top", at: "left top", of: window },
            show: true,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        };
        if (defaultOptions.height > 650) {
            defaultOptions.height = 650;
        }

        var dialogs = {};

        function createDialog(key, title, contents, options) {
            if (typeof contents !== 'string') {
                options = contents;
                contents = '';
            }
            if (typeof title !== 'string') {
                options = title;
                title = null;
            }
            if (!options) {
                options = {};
            }

            if (title) {
                $('body').append('<div id="dialog-' + key + '" title="' + title + '">' + contents + '</div>');
            }
            dialogs[key] = $('#dialog-' + key).dialog($.extend({}, defaultOptions, options));
        }

        function openDialog(key, title, content) {
            if (key in dialogs) {
                if (title) {
                    dialogs[key].dialog('option', 'title', title)
                }
                if (content) {
                    dialogs[key].html(content);
                }
                dialogs[key].dialog('open');
            }
        }

        return {
            create: createDialog,
            open: openDialog
        };
    })();


    // ------------------------------------
    // Define Global Variables

    // The currently displayed month and year. Modify to change what date is displayed when the page first loads
    var currentMonth = 6;
    var currentYear = 1491;

    // Contains any notes for the current month and year
    var currentNotes = {};


    // ------------------------------------
    // Define Functions

    /** Moves the current month one month back. Adjusting the year as needed. */
    function goToNextMonth() {
        currentMonth++;
        if (currentMonth >= frCalendar.monthsPerYear) {
            // Moved into the next year
            currentMonth = 0;
            goToNextYear();
        }
    }

    /** Moves the current month one month forward. Adjusting the year as needed. */
    function goToPrevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = frCalendar.monthsPerYear - 1;
            goToPrevYear();
        }
    }

    /** Moves the current year forward one year. */
    function goToNextYear() {
        currentYear++;
    }

    /** Moves the current year backward on year. */
    function goToPrevYear() {
        currentYear--;
    }

    function jumpTo() {
        var selectedYear = $('#selectYear').val() * 1;
        if (isFinite(selectedYear) && !isNaN(selectedYear)) {
            currentYear = selectedYear;
            currentMonth = $('#selectMonth').val() * 1;

            updateCalendar();
        }
    }

    /**
     * A generic iterator function.
     * @param {Array|object} obj - The array or object to iterat over.
     * @param {function} func - Function(value, key) The function that will be executed on every object.
     */
    function forEach(obj, func) {
        var i, l;
        if (Array.isArray(obj)) {
            for (i = 0, l = obj.length; i < l; i++) {
                func(obj[i], i);
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    func(obj[i], i);
                }
            }
        }
    }


    // ------------------------------------
    // Run

    // Create the moon phases dialogs
    dialogs.create('moon-phases-help', {
        position: { my: "right top", at: "right top", of: window }
    });
    dialogs.create('moon-phases', 'Phases of Selûne', {
        width: 777,
        height: 385,
        resizable: false,
        classes: {
            "ui-dialog": "dialog-no-pad"
        }
    });

    // Make clicked buttons lose focus after being clicked
    $('.btn-link').on('click', function() {
        // See https://stackoverflow.com/questions/19053181/how-to-remove-focus-around-buttons-on-click
        $(this).blur();
    });

    // Bind to the quick navigation
    $('#selectMonth').on('change', jumpTo);
    $('#selectYear').on('change', jumpTo);
    $('#quickSelect').on('click', false); // Prevents form submission

    // Load the notes and roll of years data
    $.when(
        getJSON('year.json').then(function(rollOfYears) {
            console.log(arguments);
            frCalendar.rollOfYears = rollOfYears;
            frCalendar.rollOfYearsStart = frCalendar.rollOfYears.__START_YEAR;
            frCalendar.rollOfYearsEnd = frCalendar.rollOfYears.__END_YEAR;
        }),
        getJSON('notes.json').then(function(allNotes) {
            notes.setNotes(allNotes);
        }))
        .catch(function(err) {
            // TODO display an error message
            console.log('Error:', err);
        })
        .always(function() {
            // Start, build the calendar and then update to the current month and year
            $('#month').html(buildCalendarTable());

            // Enable the note tooltips
            // TODO make it so that notes can be displayed outside of the tooltip by clicking on the note icon
            $('.note-icon').tooltip({
                content: function() {
                    var $this = $(this);
                    var note = '';

                    if ($this.attr('id')) {
                        if ($this.attr('id') === 'month-note') {
                            note = notes.getFormattedFrom(currentNotes.month);
                        } else {
                            note = notes.getFormattedFrom(currentNotes.year);
                        }
                    } else {
                        var parent = $this.parent();
                        if (!parent.attr('id')) {
                            parent = parent.parent();
                        }
                        var day = parent.attr('id').substring(8);
                        note = notes.getFormattedFrom(currentNotes.day[day]);
                    }
                    return note;
                }
            });

            updateCalendar();

            // Create dialogs //
            // Notes
            var createNotesDialog = function(key, title, notesList) {
                var notesHtml = '<ul>';
                forEach(notesList, function(note) {
                    notesHtml += '<li>' + note + '</li>';
                });
                notesHtml += '</ul>';

                dialogs.create(key, title, notesHtml);
            };
            createNotesDialog('historical-notes', 'Historical Notes', notes.getAllHistoric());
            createNotesDialog('personal-notes', 'Personal Notes', notes.getAllPersonal());

            // Roll of Years
            var rollOfYearsHtml = '<ul class="list-unstyled">';
            for (var year = frCalendar.rollOfYearsStart; year <= frCalendar.rollOfYearsEnd; year++) {
                if (year in frCalendar.rollOfYears) {
                    rollOfYearsHtml += "<li><strong>" + year + ":</strong> " + frCalendar.rollOfYears[year] + "</li>"
                }
            }
            rollOfYearsHtml += '</ul>';
            dialogs.create('roll-of-years', 'Roll of Years', rollOfYearsHtml);
        });


    // ===================================================================================

    function buildCalendarTable() {
        var calendarTable = '<table class="calendar-month"><tbody>';

        // Build the calendar table
        var i, dayOfWeek;
        for (i = 1; i <= frCalendar.daysPerMonth; i++) {
            dayOfWeek = i % frCalendar.daysPerWeek;
            if (dayOfWeek === 1) {
                // Start of week
                calendarTable += '<tr id="frc-week-' + Math.floor(i / frCalendar.daysPerWeek) + '">';
            }
            calendarTable += '<td id="frc-day-' + i + '">' +
                    '<span class="calendar-day-info">' +
                        '<span class="calendar-number">' + i + '</span>' +
                        '<span class="moon-phase"><img src="" alt="" width="18" height="18"/></span>' +
                    '</span>' +
                    '<span class="icon note-icon" title=""></span>' +
                '</td>';
            if (dayOfWeek === 0) {
                // End of week
                calendarTable += '</tr>';
            }
        }

        // Add the extra days and the closing tags
        calendarTable += '<tr id="frc-day-' + frCalendar.extraDayNum + '" class="calendar-extra-day">' +
                    '<td colspan="' + frCalendar.daysPerWeek + '">' +
                        '<span class="calendar-day-info">' +
                            '<span class="moon-phase"><img src="" alt="" width="18" height="18"/></span>' +
                        '</span>' +
                        '<span class="icon note-icon" title=""></span>' +
                        '<p class="calendar-extra-day-name"></p>' +
                    '</td>' +
                '</tr>' +
                '<tr id="frc-day-' + frCalendar.leapDayNum + '" class="calendar-extra-day">' +
                    '<td colspan="' + frCalendar.daysPerWeek + '">' +
                        '<span class="calendar-day-info">' +
                            '<span class="moon-phase"><img src="" alt="" width="18" height="18"/></span>' +
                        '</span>' +
                        '<span class="icon note-icon" title=""></span>' +
                        '<p class="calendar-extra-day-name"></p>' +
                    '</td>' +
                '</tr>' +
            '</tbody></table>';

        return calendarTable;
    }


    // === Open Moon Window ==================================================================

    function showMoonPhases() {
        var moonPhases = frCalendar.getMoonPhases(currentYear);
        var phasesPerMonth = frCalendar.leapDayNum;
        var dayOfMonth;

        var phasesHtml = '<table class="table moon-phases">' +
            '<thead><tr>' +
            '<th>Month</th>';
        for (dayOfMonth = 1; dayOfMonth <= phasesPerMonth; dayOfMonth++) {
            phasesHtml += '<th class="text-center">' + dayOfMonth + '</th>';
        }
        phasesHtml += '</tr></thead><tbody>';

        for (var month = 0; month < frCalendar.monthsPerYear; month++) {
            phasesHtml += '<tr><td>' + frCalendar.monthNames[month] + '</td>';
            for (dayOfMonth = 0; dayOfMonth < phasesPerMonth; dayOfMonth++) {
                phasesHtml += '<td><img src="images/moons/moon_' + moonPhases[(month * 32) + dayOfMonth] + '.jpg"/></td>';
            }
            phasesHtml += '</tr>';
        }
        phasesHtml += '</tbody></table>';

        dialogs.open('moon-phases', 'Phases of Selûne by Month : ' + currentYear + ' DR', phasesHtml);
    }

    // ===================================================================================

    function updateCalendar() {
        function updateHolidays() {
            // Hide the extra days
            $('#frc-day-' + frCalendar.extraDayNum).hide();
            $('#frc-day-' + frCalendar.leapDayNum).hide();

            // Get a list of holiday and update the UI for them
            var html = '';
            var holidays = frCalendar.getHolidays(currentYear, currentMonth);
            if (holidays.length > 0) {
                forEach(holidays, function(holiday) {
                    if (holiday.type === 'extra') {
                        // Show the extra day and set its name
                        $('#frc-day-' + holiday.day).show()
                            .find('.calendar-extra-day-name').text(holiday.name);
                    } else {
                        // Add a row to be displayed as a holiday
                        html += '<div class="row holiday-row type-' + holiday.type + '">' +
                                '<div class="col-xs-12">' +
                                    '<p>' + holiday.name + '</p>' +
                                '</div>' +
                            '</div>'
                    }
                });
            }
            $('#holidays').html(html);
        }

        /**
         * Updates the moon phase images for the current month
         */
        function updateMoonPhases() {
            var phases = frCalendar.getMoonPhases(currentYear, currentMonth);

            forEach(phases, function(phase, i) {
                $('#frc-day-' + (i + 1) + ' .moon-phase img').attr('src', 'images/moons/moon_' + phase + '.jpg');
            });
        }

        function updateNotes() {
            // Reset notes
            $('.note-icon').removeClass('visible');

            // Get the current notes
            currentNotes = notes.getCurrent(currentYear, currentMonth);

            // Enable the note icon for this day
            forEach(currentNotes.day, function(n, day) {
                $('#frc-day-' + day + ' .note-icon').addClass('visible');
            });

            // Turn on the month and year notes as needed
            if (currentNotes.month.length > 0) {
                $('#month-note').addClass('visible');
            }
            if (currentNotes.year.length > 0) {
                $('#year-note').addClass('visible');
            }
        }

        // Set the month an year names
        $('#display-month-title').text(frCalendar.monthNames[currentMonth] + " : " + currentYear);
        $('#display-year-name').text(frCalendar.getYearName(currentYear));

        // Update the holidays, moon phases, and notes
        updateHolidays();
        updateMoonPhases();
        updateNotes();

        // Update the quick select
        $('#selectMonth').val(currentMonth);
        $('#selectYear').val(currentYear);
    }

    // Expose parts used for events
    function HandleUpdateEvent(changeFunc) {
        return function() {
            changeFunc();
            updateCalendar();
        }
    }

    function OpenDialog(key) {
        return function() {
            dialogs.open(key);
        }
    }

    function getJSON(file) {
        var url = file;
        if (file.indexOf("?") > 0) {
            url += "&";
        } else {
            url += '?';
        }
        url += '_no_cache=' + Math.floor(Math.random() * 10000);
        console.log(url);
        var t = $.getJSON(url);
        console.log(t);
        return t;
        // return $.getJSON(url);
    }

    window.frc = {
        goToPrevMonth: HandleUpdateEvent(goToPrevMonth),
        goToNextMonth: HandleUpdateEvent(goToNextMonth),
        goToPrevYear: HandleUpdateEvent(goToPrevYear),
        goToNextYear: HandleUpdateEvent(goToNextYear),
        showMoonPhases: showMoonPhases,
        showMoonPhaseInfo: OpenDialog('moon-phases-help'),
        showHistoric: OpenDialog('historical-notes'),
        showPersonal: OpenDialog('personal-notes'),
        showYears: OpenDialog('roll-of-years')
    };
});
