var objectAssign = require('object-assign');
var locale = require('devextreme/localization').locale;
var dateLocalization = require('devextreme/localization').date;
var firstDayOfWeekData = require('../locale-data/first-day-of-week-data');

var SYMBOLS_TO_REMOVE_REGEX = /[\u200E\u200F]/g;

var getIntlFormatter = function(format) {
    return function(date) {
        return (new Intl.DateTimeFormat(locale(), format)).format(date).replace(SYMBOLS_TO_REMOVE_REGEX, '');
    };
};

var removeLeadingZeroes = function(str) {
    return str.replace(/(\D)0+(\d)/g, '$1$2');
};
var dateStringEquals = function(actual, expected) {
    return removeLeadingZeroes(actual) === removeLeadingZeroes(expected);
};

var intlFormats = {
    day: { day: 'numeric' },
    dayofweek: { weekday: 'long' },
    hour: { hour: 'numeric', hour12: false },
    longdate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    longdatelongtime: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
    longtime: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
    minute: { minute: 'numeric' },
    month: { month: 'long' },
    monthandday: { month: 'long', day: 'numeric' },
    monthandyear: { year: 'numeric', month: 'long' },
    shortdate: {},
    shorttime: { hour: 'numeric', minute: 'numeric' },
    shortyear: { year: '2-digit' },
    year: { year: 'numeric' }
};

Object.defineProperty(intlFormats, 'shortdateshorttime', {
    get: function() {
        var defaultOptions = Intl.DateTimeFormat(locale()).resolvedOptions();

        return { year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric' };
    }
});

var getIntlFormat = function(format) {
    return typeof format === 'string' && intlFormats[format.toLowerCase()];
};

dateLocalization.resetInjection();
dateLocalization.inject({
    getMonthNames: function(format, type) {
        var intlFormats = {
            wide: 'long',
            abbreviated: 'short',
            narrow: 'narrow'
        };

        return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
            var date = new Date(0, monthIndex, 13, 1),
                monthFormat = intlFormats[format || 'wide'];

            if(type === 'format') {
                var text = getIntlFormatter({ day: 'numeric', month: monthFormat })(date),
                    parts = text.indexOf(' ') >= 0 ? text.split(' ') : text.split('13');
                if(parts.length === 2) {
                    if(parts[0].indexOf('13') >= 0) {
                        return parts[1];
                    }
                    if(parts[1].indexOf('13') >= 0) {
                        return parts[0];
                    }
                }
            }

            return getIntlFormatter({ month: monthFormat })(date);
        });
    },

    getDayNames: function(format) {
        var intlFormats = {
            wide: 'long',
            abbreviated: 'short',
            short: 'narrow',
            narrow: 'narrow'
        };

        var getIntlDayNames = function(format) {
            return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                return getIntlFormatter({ weekday: format, timeZone: 'UTC' })(new Date(Date.UTC(0, 0, dayIndex)));
            });
        };

        var result = getIntlDayNames(intlFormats[format || 'wide']);

        return result;
    },

    format: function(date, format) {
        if(!date) {
            return;
        }

        if(!format) {
            return date;
        }

        format = format.type || format;

        var intlFormat = getIntlFormat(format);
        if(intlFormat) {
            return getIntlFormatter(intlFormat)(date);
        }

        var formatType = typeof format;
        if(format.formatter || formatType === 'function' || formatType === 'string') {
            return this.callBase.apply(this, arguments);
        }

        return getIntlFormatter(format)(date);
    },

    parse: function(dateString, format) {
        var SIMPLE_FORMATS = ['shortdate', 'shorttime', 'shortdateshorttime', 'longtime'];
        if(dateString && typeof format === 'string' && SIMPLE_FORMATS.indexOf(format.toLowerCase()) > -1) {
            return this._parseDateBySimpleFormat(dateString, format.toLowerCase());
        }

        return this.callBase(dateString, format);
    },

    _parseDateBySimpleFormat: function(dateString, format) {
        var formatParts = this.getFormatParts(format);
        var dateParts = dateString
            .split(/\D+/)
            .filter(function(part) { return part.length > 0; });

        if(formatParts.length !== dateParts.length) {
            return;
        }

        var dateArgs = this._generateDateArgs(formatParts, dateParts);

        var constructDate = function(dateArgs, ampmShift) {
            var hoursShift = ampmShift ? 12 : 0;
            return new Date(dateArgs.year, dateArgs.month, dateArgs.day, (dateArgs.hours + hoursShift) % 24, dateArgs.minutes, dateArgs.seconds);
        };
        var constructValidDate = function(ampmShift) {
            var parsedDate = constructDate(dateArgs, ampmShift);
            if(dateStringEquals(this.format(parsedDate, format), dateString)) {
                return parsedDate;
            }
        }.bind(this);

        return constructValidDate(false) || constructValidDate(true);
    },

    _generateDateArgs: function(formatParts, dateParts) {
        var currentDate = new Date();
        var dateArgs = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            day: currentDate.getDate(),
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        formatParts.forEach(function(formatPart, index) {
            var datePart = dateParts[index];
            var parsed = parseInt(datePart, 10);

            if(formatPart === 'month') {
                parsed = parsed - 1;
            }

            dateArgs[formatPart] = parsed;
        });

        return dateArgs;
    },

    formatUsesMonthName: function(format) {
        if(typeof format === 'object' && !(format.type || format.format)) {
            return format.month === 'long';
        }

        return this.callBase.apply(this, arguments);
    },

    formatUsesDayName: function(format) {
        if(typeof format === 'object' && !(format.type || format.format)) {
            return format.weekday === 'long';
        }

        return this.callBase.apply(this, arguments);
    },

    getFormatParts: function(format) {
        var utcFormat = objectAssign({}, intlFormats[format.toLowerCase()], { timeZone: 'UTC' });
        var utcDate = new Date(Date.UTC(2001, 2, 4, 5, 6, 7));
        var formattedDate = getIntlFormatter(utcFormat)(utcDate);

        var formatParts = [
            { name: 'year', value: 1 },
            { name: 'month', value: 3 },
            { name: 'day', value: 4 },
            { name: 'hours', value: 5 },
            { name: 'minutes', value: 6 },
            { name: 'seconds', value: 7 }
        ];

        return formatParts
            .map(function(part) {
                return {
                    name: part.name,
                    index: formattedDate.indexOf(part.value)
                };
            })
            .filter(function(part) { return part.index > -1; })
            .sort(function(a, b) { return a.index - b.index; })
            .map(function(part) { return part.name; });
    },

    firstDayOfWeekIndex: function() {
        var index = firstDayOfWeekData[locale()];

        return index === undefined ? 1 : index;
    }
});
