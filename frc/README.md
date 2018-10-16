# Forgotten Realms Calendar Tool

## Notes
You may follow the instructions below to add a note to either the personal or
historical notes section of the calendar tool.

To do so you must open or create the `notes.json` file in your favorite text editor.
You can copy the sample-notes.json file to get started.

### Format
Notes are stored in JSON. See [json.org](https://www.json.org/) and [JSON Formatter](https://jsonformatter.curiousconcept.com/) for help with JSON.

A note object is keyed by year, then by month (months are zero base indexed), and then by day.

For example the following entry would result in a note for Hammer 1 1373 DR:
```json
{
 "1373": {
  "0": {
   "1": "Hello World"
  }
 }
}
```

You can also create notes that are not tied to a specific date.

To create a note tied to a whole month in a given year add an entry to a month and have it start with an underscore.
e.g., `"1372": { "0": { "_1": "Some note" } }` would result in a note for all of Hammer 1372 DR.

You can create a global note for year by adding an entry to a year that starts with an underscore.

Adding a note with an underscore to the root of the personalNotes objects results in a global note.

You can also include notes in a section that start with `"_months"` to create global notes for a month.

Special days are considered to be a continuation of the month they precede. Thus to add a note to these days add
it as a normal day of the month as if the month had extra days. For convenience the day and month of these holidays
is given below:

| Month | Day  | Holiday           |
|:------|:-----|:------------------|
| 0     | 31   | Midwinter         |
| 3     | 31   | Greengrass        |
| 6     | 31   | Midsummer         |
| 6     | 32   | Shieldmeet        |
| 8     | 31   | Highharvesttide   |
| 10    | 31   | Feast of the Moon |

Notes can be a string (enclosed in quotes, e.g., `"this is a string"`) or an array of strings (strings surrounded by
square brackets and separated by commas, e.g., `["string one", "string two"]`). Arrays of strings treat each string as
a separate paragraph for the same note.

See the example below or `sample-notes.json`.

### Personal Notes
Personal notes are kept under the root `"personal"` key.

### Historical Notes
Historical notes are kept under the root `"historical"` key.

### Example
```json
{
  "historical":{
    "_some_note":"A global note",
    "1378":{
      "_1":"Note for the whole year",
      "_2":"Second note for the whole year. This years was also known as the Year of Broken Hearts in the Black Chronology",
      "0":{
        "_1":"Note for all of Hammer 1378",
        "1":"Note for the Hammer 1 1378",
        "31":[
          "Historical Note for Midwinter 1378",
          "If the notes are in an array, then each note is created as its own paragraph. This note will thus have two paragraphs"
        ]
      }
    },
    "_months":{
      "6":{
        "32":"This note will show up for every Shieldmeet"
      }
    }
  },
  "personal":{
    "1478":{
      "8":{
        "5":"My campaign starts (Personal note for Eleint 5, 1478 DR)"
      }
    }
  }
}
```

## Roll of Years
You may, if you wish, modify the Roll of Years file `year.js`.

To add a name for a year:

1. Add the year to json object. This should be a string with the name of the year keyed by the year.
2. Update the start and end year variables as needed.  
   The `__END_YEAR` should be the latest year and `__START_YEAR` should be the oldest year (these dates are inclusive).
   Note that the years in the roll of years don't need to be continuous, so gaps are ok. The start and end variables
   just need to be updated to reflect the highest and lowest years.
3. Save the year.json file to the folder where you found it.


# Copyright

Based off the original tool ([Source](http://archive.wizards.com/default.asp?x=dnd/frx/20050525x)):  
> Forgotten Realms Calendar Tool v1.0 by Mark A Jindra (markjindra at hotmail.com)  
> © 2005 Wizards of the Coast, Inc., a subsidiary of Hasbro, Inc.  
> All Rights Reserved.

Rewritten by Curtis Oakley © 2018

The version found here is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.
Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
