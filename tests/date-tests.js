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
                getIntlMonthNames("narrow"),
                "Array of day names (short format)");
            assert.deepEqual(dateLocalization.getDayNames("narrow"),
                getIntlMonthNames("narrow"),
                "Array of day names (narrow format)");
        });
        
        QUnit.test("getTimeSeparator", function(assert) {
            assert.equal(dateLocalization.getTimeSeparator(), ":");
        });
         
        QUnit.test("format by DevExtreme formats", function(assert) {
            var formats = [
                { format: "day", intlFormat: { day: "numeric" }},
                { format: "dayofweek", intlFormat: { weekday: "long" }},
                { format: "hour", intlFormat: { hour: "numeric", hour12: false }},
                { format: "longdate", intlFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }},
                { format: "longdatelongtime", intlFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }},
                { format: "longtime", intlFormat: { hour: 'numeric', minute: 'numeric', second: 'numeric' }},
                { format: "millisecond", expected: "006" },
                { format: "minute", intlFormat: { minute: "numeric" }},
                { format: "month", intlFormat: { month: "long" }},
                { format: "monthandday", intlFormat: { month: "long", day: "numeric" }},
                { format: "monthandyear", intlFormat: { year: 'numeric', month: "long" }},
                { format: "shortdate" },
                { format: "shortdateshorttime", intlFormat: { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }},
                { format: "shorttime", intlFormat: { hour: 'numeric', minute: 'numeric' }},
                { format: "shortyear", intlFormat: { year: '2-digit' }},
                { format: "year", intlFormat: { year: 'numeric' }},
                { format: "datetime-local", expected: "2015-03-02T13:04:05" },
            ];
            
            var quarterData =  [
                {
                    date: new Date(2015, 0),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 1),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 2),
                    expected: "Q1"
                },
                {
                    date: new Date(2015, 3),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 4),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 5),
                    expected: "Q2"
                },
                {
                    date: new Date(2015, 6),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 7),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 8),
                    expected: "Q3"
                },
                {
                    date: new Date(2015, 9),
                    expected: "Q4"
                },
                {
                    date: new Date(2015, 10),
                    expected: "Q4"
                },
                {
                    date: new Date(2015, 11),
                    expected: "Q4"
                }
            ];
            var quarterandyearData = {
                date: new Date(2015, 2, 2, 3, 4, 5, 6),
                expected: "Q1 2015"
            };
            var testDate = new Date(2015, 2, 2, 13, 4, 5, 6);
            
            var testFormat = function(format, date, expected) {
                assert.equal(dateLocalization.format(date, format), expected, date + " in " + format + " format");
                assert.equal(dateLocalization.format(date, { type: format }), expected, date + " in " + format + " format (object syntax)");
            };
            
            $.each(formats, function(_, data) {
                var expected = data.expected || getIntlFormatter(data.intlFormat)(testDate);
                testFormat(data.format, testDate, expected);
            });

            $.each(quarterData, function(_, data) {
                testFormat("quarter", data.date, data.expected);
            });
            
            testFormat("quarterandyear", quarterandyearData.date, quarterandyearData.expected);

            assert.equal(dateLocalization.format(new Date(2015, 2, 2, 3, 4, 5, 6)), String(new Date(2015, 2, 2, 3, 4, 5)), "without format");
            assert.notOk(dateLocalization.format(), "without date");
        });
        
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