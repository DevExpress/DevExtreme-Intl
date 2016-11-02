(function (QUnit, DX) {
    var dateLocalization = DX.localization.date;
    
    [ "de", "en", "ja", "ru" ].forEach(function(locale) {
        var getIntlFormatter = function(format) {
            return (new Intl.DateTimeFormat(locale, format)).format;
        };
        
        QUnit.module("date - " + locale, {
            beforeEach: function() {
                DX.config({ locale: locale });
            },
            afterEach: function() {
                DX.config({ locale: "en" });
            }
        });

        // TODO: implement or get rid of getPatternByFormat method
        
        QUnit.test("getMonthNames", function(assert) {
            var getIntlMonthNames = function(format) {
                return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
                    return getIntlFormatter({ month: format })(new Date(0, monthIndex, 2));
                });
            };
            
            var monthsWide = getIntlMonthNames("long"),
                monthsAbbr = getIntlMonthNames("short"),
                monthsNarrow = getIntlMonthNames("narrow");
            
            assert.deepEqual(dateLocalization.getMonthNames(), monthsWide, "Array of month names without format");
            assert.deepEqual(dateLocalization.getMonthNames("wide"), monthsWide, "Array of month names (wide format)");
            assert.deepEqual(dateLocalization.getMonthNames("abbreviated"), monthsAbbr, "Array of month names (abbreviated format)");
            assert.deepEqual(dateLocalization.getMonthNames("narrow"), monthsNarrow, "Array of month names (narrow format)");
        });
        
        QUnit.test("getDayNames", function(assert) {
            var getIntlMonthNames = function(format) {
                return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                    return getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex + 1));
                });
            };
            
            assert.deepEqual(dateLocalization.getDayNames(),
                getIntlMonthNames("long"),
                "Array of day names without format");
            assert.deepEqual(dateLocalization.getDayNames("wide"),
                getIntlMonthNames("long"),
                "Array of day names (wide format)");
            assert.deepEqual(dateLocalization.getDayNames("abbreviated"),
                getIntlMonthNames("short"),
                "Array of day names (abbreviated format)");
            assert.deepEqual(dateLocalization.getDayNames("short"),
                getIntlMonthNames("long").map(function(day) { return day.substr(0, 2); }),
                "Array of day names (short format)");
            assert.deepEqual(dateLocalization.getDayNames("narrow"),
                getIntlMonthNames("narrow"),
                "Array of day names (narrow format)");
        });
        
        QUnit.test("getTimeSeparator", function(assert) {
            assert.equal(dateLocalization.getTimeSeparator(), ":");
        });
        
        // TODO: implement firstDayOfWeekIndex method
        // TODO: implement format method
        // TODO: implement parse method
        
        QUnit.test("format/parse by a function", function (assert) {
            var format = {
                formatter: function (date) {
                    return "It was year " + date.getFullYear() + ".";
                },
                parser: function (text) {
                    return new Date(Number(text.substr(12, 4)), 1, 1);
                }
            };
            var someDate = new Date(1999, 1, 1);

            assert.equal(dateLocalization.format(someDate, format), "It was year 1999.");
            assert.equal(dateLocalization.parse("It was year 2000.", format).getFullYear(), 2000);
        });
    });
}(QUnit, DevExpress));