var Cldr = require("cldrjs");
var locales = require("cldr-core/availableLocales.json").availableLocales.full;
var fs = require("fs");

var DAY_INDEXES = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
};
var DEFAULT_DAY_INDEX = 1;

var result = {};

Cldr.load(require("cldr-core/supplemental/weekData.json"), require("cldr-core/supplemental/likelySubtags.json"));

locales.forEach(function(locale) {
    var firstDay = new Cldr(locale).supplemental.weekData.firstDay(),
        firstDayIndex = DAY_INDEXES[firstDay];

    if(firstDayIndex !== DEFAULT_DAY_INDEX) {
        result[locale] = firstDayIndex; 
    }
});

fs.writeFile('./locale-data/first-day-of-week-data.js', 'module.exports = ' + JSON.stringify(result, null, "    ") + ';');