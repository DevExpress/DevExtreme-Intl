var QUnit = require('qunitjs');
var locale = require('devextreme/localization').locale;
var dateLocalization = require('devextreme/localization/date');
var dxVersion = require('devextreme/core/version');
var compareVersions = require('devextreme/core/utils/version').compare;

require('../src/date');

if(Intl.__disableRegExpRestore) {
    Intl.__disableRegExpRestore();
}

var SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;

var locales = [ 'de', 'en', 'ja', 'ru' ];
if(compareVersions(dxVersion, '17.2.3') >= 0) {
    Array.prototype.push.apply(locales, [ 'zh', 'ar', 'hr' ]);
}

if(compareVersions(dxVersion, '17.2.4') >= 0) {
    Array.prototype.push.apply(locales, [ 'el', 'ca' ]);
}

locales.forEach(function(localeId) {
    var getIntlFormatter = function(format) {
        return function(date) {
            return (new Intl.DateTimeFormat(localeId, format)).format(date).replace(SYMBOLS_TO_REMOVE_REGEX, '');
        };
    };

    var formatNumber = function(number) {
        return (new Intl.NumberFormat(localeId)).format(number);
    };

    var localizeDigits = function(string) {
        return string && string.split('').map(function(sign) {
            if(/[0-9]/.test(sign)) {
                return formatNumber(Number(sign));
            }

            return sign;
        }).join('');
    };

    QUnit.module('date - ' + localeId, {
        beforeEach: function() {
            locale(localeId);
        },
        afterEach: function() {
            locale('en');
        }
    });

    QUnit.test('getMonthNames', function(assert) {
        var getIntlMonthNames = function(format) {
            return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
                return getIntlFormatter({ month: format })(new Date(0, monthIndex, 2));
            });
        };

        var monthsWide = getIntlMonthNames('long'),
            monthsAbbr = getIntlMonthNames('short'),
            monthsNarrow = getIntlMonthNames('narrow');

        assert.deepEqual(dateLocalization.getMonthNames(), monthsWide, 'Array of month names without format');
        assert.deepEqual(dateLocalization.getMonthNames('wide'), monthsWide, 'Array of month names (wide format)');
        assert.deepEqual(dateLocalization.getMonthNames('abbreviated'), monthsAbbr, 'Array of month names (abbreviated format)');
        assert.deepEqual(dateLocalization.getMonthNames('narrow'), monthsNarrow, 'Array of month names (narrow format)');
    });

    QUnit.test('getMonthNames non-standalone', function(assert) {
        var expected = {
            de: 'November',
            en: 'November',
            ja: '11月',
            ru: 'ноября',
            zh: '十一月',
            hr: 'studenoga',
            ar: 'نوفمبر',
            el: 'Νοεμβρίου',
            ca: 'novembre'
        };

        assert.equal(dateLocalization.getMonthNames('wide', 'format')[10], expected[localeId], 'Array of non-standalone month names');
    });

    QUnit.test('getDayNames', function(assert) {
        var dayNames = {
            en: { long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
        };
        var getIntlDayNames = function(format) {
            var dayNamesByLocale = dayNames[localeId] && dayNames[localeId][format];

            return dayNamesByLocale || Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                return getIntlFormatter({ weekday: format, timeZone: 'UTC' })(new Date(Date.UTC(0, 0, dayIndex)));
            });
        };

        assert.deepEqual(dateLocalization.getDayNames(),
            getIntlDayNames('long'),
            'Array of day names without format');
        assert.deepEqual(dateLocalization.getDayNames('wide'),
            getIntlDayNames('long'),
            'Array of day names (wide format)');
        assert.deepEqual(dateLocalization.getDayNames('abbreviated'),
            getIntlDayNames('short'),
            'Array of day names (abbreviated format)');
        assert.deepEqual(dateLocalization.getDayNames('short'),
            getIntlDayNames('narrow'),
            'Array of day names (short format)');
        assert.deepEqual(dateLocalization.getDayNames('narrow'),
            getIntlDayNames('narrow'),
            'Array of day names (narrow format)');
    });

    QUnit.test('getTimeSeparator', function(assert) {
        assert.equal(dateLocalization.getTimeSeparator(), ':');
    });

    QUnit.test('formatUsesMonthName', function(assert) {
        assert.equal(dateLocalization.formatUsesMonthName('monthAndDay'), true);
        assert.equal(dateLocalization.formatUsesMonthName('monthAndYear'), true);
        assert.equal(dateLocalization.formatUsesMonthName({ month: 'long', day: 'number', year: '2-digit' }), true);
        assert.equal(dateLocalization.formatUsesMonthName({ month: 'short', day: 'number', year: '2-digit' }), false);
        assert.equal(dateLocalization.formatUsesMonthName({ month: 'narrow', day: 'number', year: '2-digit' }), false);
        assert.equal(dateLocalization.formatUsesMonthName({ day: 'number', year: '2-digit' }), false);
        assert.equal(dateLocalization.formatUsesMonthName('month'), false);
    });

    QUnit.test('formatUsesDayName', function(assert) {
        assert.equal(dateLocalization.formatUsesDayName('dayofweek'), true);
        assert.equal(dateLocalization.formatUsesDayName('longdate'), true);
        assert.equal(dateLocalization.formatUsesDayName('longdatelongtime'), true);
        assert.equal(dateLocalization.formatUsesDayName({ weekday: 'long', day: 'number' }), true);
        assert.equal(dateLocalization.formatUsesDayName({ weekday: 'short', day: 'number' }), false);
        assert.equal(dateLocalization.formatUsesDayName({ weekday: 'narrow', day: 'number' }), false);
        assert.equal(dateLocalization.formatUsesDayName('day'), false);
        assert.equal(dateLocalization.formatUsesDayName('shortDate'), false);
    });

    QUnit.test('getFormatParts', function(assert) {
        assert.deepEqual(dateLocalization.getFormatParts('shortdate').sort(), ['year', 'month', 'day'].sort());
        assert.deepEqual(dateLocalization.getFormatParts('shorttime').sort(), ['hours', 'minutes'].sort());
        assert.deepEqual(dateLocalization.getFormatParts('shortdateshorttime').sort(), ['year', 'month', 'day', 'hours', 'minutes'].sort());
    });

    QUnit.test('format', function(assert) {
        var defaultOptions = Intl.DateTimeFormat(localeId).resolvedOptions();
        var formats = [
            { format: 'day', intlFormat: { day: 'numeric' }},
            { format: 'dayofweek', intlFormat: { weekday: 'long' }},
            { format: 'hour', expected: localizeDigits('13')},
            { format: 'longdate', intlFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }},
            { format: 'longdatelongtime', intlFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }},
            { format: 'longtime', intlFormat: { hour: 'numeric', minute: 'numeric', second: 'numeric' }},
            { format: 'millisecond', expected: localizeDigits('006') },
            { format: 'minute', expected: localizeDigits('04')},
            { format: 'month', intlFormat: { month: 'long' }},
            { format: 'monthandday', intlFormat: { month: 'long', day: 'numeric' }},
            { format: 'monthandyear', intlFormat: { year: 'numeric', month: 'long' }},
            { format: 'shortdate' },
            { format: 'shortdateshorttime', intlFormat: { year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric' }},
            { format: 'shorttime', intlFormat: { hour: 'numeric', minute: 'numeric' }},
            { format: 'shortyear', intlFormat: { year: '2-digit' }},
            { format: 'year', intlFormat: { year: 'numeric' }},
        ];

        var quarterData = [
            {
                date: new Date(2015, 0),
                expected: 'Q1'
            },
            {
                date: new Date(2015, 1),
                expected: 'Q1'
            },
            {
                date: new Date(2015, 2),
                expected: 'Q1'
            },
            {
                date: new Date(2015, 3),
                expected: 'Q2'
            },
            {
                date: new Date(2015, 4),
                expected: 'Q2'
            },
            {
                date: new Date(2015, 5),
                expected: 'Q2'
            },
            {
                date: new Date(2015, 6),
                expected: 'Q3'
            },
            {
                date: new Date(2015, 7),
                expected: 'Q3'
            },
            {
                date: new Date(2015, 8),
                expected: 'Q3'
            },
            {
                date: new Date(2015, 9),
                expected: 'Q4'
            },
            {
                date: new Date(2015, 10),
                expected: 'Q4'
            },
            {
                date: new Date(2015, 11),
                expected: 'Q4'
            }
        ];
        var quarterandyearData = {
            date: new Date(2015, 2, 2, 3, 4, 5, 6),
            expected: 'Q1 2015'
        };
        var testDate = new Date(2015, 2, 2, 13, 4, 5, 6);

        var testFormat = function(format, date, expected) {
            assert.equal(dateLocalization.format(date, format), expected, date + ' in ' + format + ' format');
            assert.equal(dateLocalization.format(date, { type: format }), expected, date + ' in ' + format + ' format (object syntax)');
        };

        formats.forEach(function(data) {
            var expected = data.expected || getIntlFormatter(data.intlFormat)(testDate);

            testFormat(data.format, testDate, expected);
            testFormat(data.format.toUpperCase(), testDate, expected);

            if(data.intlFormat) {
                assert.equal(dateLocalization.format(testDate, data.intlFormat), expected, testDate + ' in Intl representation of ' + data.format + ' format');
            }
        });

        quarterData.forEach(function(data) {
            testFormat('quarter', data.date, localizeDigits(data.expected));
        });

        testFormat('quarterandyear', quarterandyearData.date, localizeDigits(quarterandyearData.expected));

        assert.equal(dateLocalization.format(new Date(2015, 2, 2, 3, 4, 5, 6)), String(new Date(2015, 2, 2, 3, 4, 5)), 'without format');
        assert.notOk(dateLocalization.format(), 'without date');
    });

    QUnit.test('parse', function(assert) {
        var currentDate = new Date();
        var testData = [
            { format: 'shortDate', date: new Date(2016, 10, 17) },
            { format: 'shortDate', date: new Date(2016, 11, 31) },
            { format: 'shortDate', date: new Date(2016, 0, 1) },

            { format: 'shortTime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 4, 22) },
            { format: 'shortTime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 56) },
            { format: 'shortTime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0) },
            { format: 'shortTime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 59) },

            { format: 'shortDateshortTime', date: new Date(2016, 11, 31, 4, 44) },
            { format: 'shortDateshortTime', date: new Date(2016, 11, 31, 12, 32) },
            { format: 'shortDateshortTime', date: new Date(2016, 0, 1, 0, 16) },
            { format: 'shortDateshortTime', date: new Date(2016, 0, 1, 12, 48) },

            { format: 'longtime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 4, 22, 15) },
            { format: 'longtime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 56, 56) },
            { format: 'longtime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0) },
            { format: 'longtime', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 59, 59) },
        ];

        if(compareVersions(dxVersion, '17.2.3') >= 0 && compareVersions(dxVersion, '18.2.4') !== 0) {
            Array.prototype.push.apply(testData, [
                { format: 'longDate', date: new Date(2016, 10, 17) },
                { format: 'longDate', date: new Date(2016, 11, 31) },
                { format: 'longDate', date: new Date(2016, 0, 1) },

                { format: 'longDateLongTime', date: new Date(2016, 11, 31, 4, 44) },
                { format: 'longDateLongTime', date: new Date(2016, 11, 31, 12, 32) },
                { format: 'longDateLongTime', date: new Date(2016, 0, 1, 0, 16) },
                { format: 'longDateLongTime', date: new Date(2016, 0, 1, 12, 48) },

                { format: 'monthAndYear', date: new Date(2016, 9, 1) },
                { format: 'monthAndDay', date: new Date(currentDate.getFullYear(), 9, 17) },

                { format: 'year', date: new Date(2013, 0, 1) },
                { format: 'shortyear', date: new Date(2013, 0, 1) },
                { format: 'month', date: new Date(currentDate.getFullYear(), 9, 1) },
                { format: 'day', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 17) },
                { format: 'hour', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 16) },
                { format: 'minute', date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), 56) }
            ]);
        }

        testData.forEach(function(config) {
            var format = config.format;
            var date = config.date;

            // https://github.com/DevExpress/DevExtreme-Intl/issues/33
            if(compareVersions(dxVersion, '17.2.4') === -1 && localeId.substr(0, 2) === 'zh' && format === 'month') {
                return;
            }

            // https://github.com/DevExpress/DevExtreme-Intl/issues/34
            if(compareVersions(dxVersion, '17.2.4') === -1 && localeId.substr(0, 2) === 'ar' && (format === 'longDate' || format === 'longDateLongTime')) {
                return;
            }

            if(localeId.substr(0, 2) === 'el' && format === 'monthAndYear') {
                return;
            }

            var formattedDate = dateLocalization.format(date, format);
            var parsedDate = dateLocalization.parse(formattedDate, format);

            assert.equal(parsedDate && parsedDate.toString(), date.toString(), 'failed to parse ' + formattedDate + ' by \'' + format + '\'');

            formattedDate = formattedDate.replace(/(\D)0+(\d)/g, '$1$2');

            parsedDate = dateLocalization.parse(formattedDate, format);
            assert.equal(parsedDate && parsedDate.toString(), date.toString(), 'failed to parse ' + formattedDate + ' by \'' + format + '\' without leading zeroes');
        });
    });

    QUnit.test('parse wrong arguments', function(assert) {
        assert.equal(dateLocalization.parse(null, 'shortDate'), undefined);
        assert.equal(dateLocalization.parse(undefined, 'shortDate'), undefined);
        assert.equal(dateLocalization.parse('', 'shortDate'), undefined);
    });

    QUnit.test('parse by a function', function(assert) {
        var expectedDate = new Date(2018, 1, 1);
        var customDateString = 'Custom date string';
        var customParser = function(text) {
            if(text === customDateString) {
                return expectedDate;
            }
        };
        assert.equal(dateLocalization.parse(customDateString, { parser: customParser }).toString(), expectedDate.toString());
    });

    QUnit.test('DevExtreme format uses default locale options', function(assert) {
        var date = new Date();

        var intlFormatted = getIntlFormatter()(date);
        var dateFormatted = dateLocalization.format(date, 'shortdate');
        var dateTimeFormatted = dateLocalization.format(date, 'shortdateshorttime');

        assert.equal(dateFormatted, intlFormatted);
        assert.ok(dateTimeFormatted.indexOf(intlFormatted) > -1, dateTimeFormatted + ' not contain ' + intlFormatted);
    });

    QUnit.test('format/parse by a function', function(assert) {
        var format = {
            formatter: function(date) {
                return 'It was year ' + date.getFullYear() + '.';
            },
            parser: function(text) {
                return new Date(Number(text.substr(12, 4)), 1, 1);
            }
        };
        var someDate = new Date(1999, 1, 1);

        assert.equal(dateLocalization.format(someDate, format), 'It was year 1999.');
        assert.equal(dateLocalization.parse('It was year 2000.', format).getFullYear(), 2000);
    });

    QUnit.test('firstDayOfWeekIndex', function(assert) {
        var expectedValues = {
            de: 1, en: 0, ja: 0, ru: 1, zh: 0, hr: 1, ar: 6, el: 1, ca: 1
        };
        assert.equal(dateLocalization.firstDayOfWeekIndex(), expectedValues[localeId]);
    });
});

QUnit.module('date - browser specific behavior');

// NOTE: Workaroud for the MS Edge bug https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101503/
QUnit.test('formatted value should not contain &lrm & &rlm symbols', function(assert) {
    var unwantedSymbols = '\u200E\u200F';
    var originalDateTimeFormatter = Intl.DateTimeFormat;

    try {
        Intl.DateTimeFormat = function(locale, config) {
            return {
                format: function(date) {
                    return unwantedSymbols + new originalDateTimeFormatter(locale, config).format(date);
                }
            };
        };

        assert.equal(dateLocalization.format(new Date(2000, 0, 1), { month: 'long' }), 'January');
        assert.equal(dateLocalization.getMonthNames()[0], 'January');
        assert.equal(dateLocalization.getDayNames()[0], 'Sunday');
    } finally {
        Intl.DateTimeFormat = originalDateTimeFormatter;
    }
});

// Workaroud for the MS Edge and IE bug https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11907541/
QUnit.test('Format by `hour` and `minute` shortcuts in IE and Edge', function(assert) {
    var originalDateTimeFormatter = Intl.DateTimeFormat;

    var testData = {
        hour: {
            wrongFormat: { hour: 'numeric', hour12: false, minute: 'numeric' },
            expected: '01'
        },
        minute: {
            wrongFormat: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' },
            expected: '02'
        },
    };

    var emulationFormat;
    var wronBrowserBehaviorEmulator = function() {
        return {
            format: function(date) {
                return new originalDateTimeFormatter('en', emulationFormat).format(date);
            }
        };
    };

    try {
        Intl.DateTimeFormat = wronBrowserBehaviorEmulator;

        for(var format in testData) {
            emulationFormat = testData[format].wrongFormat;
            assert.equal(dateLocalization.format(new Date(2000, 0, 1, 1, 2), format), testData[format].expected, 'Format: ' + format);

        }
    } finally {
        Intl.DateTimeFormat = originalDateTimeFormatter;
    }
});
