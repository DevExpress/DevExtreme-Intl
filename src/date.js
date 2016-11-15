(function (DX, $) {
    var getIntlFormatter = function(format) {
        return (new Intl.DateTimeFormat(DX.config().locale, format)).format;
    };

    var intlFormats = {
        day: { day: "numeric" },
        dayofweek: { weekday: "long" },
        hour: { hour: "numeric", hour12: false },
        longdate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        longdatelongtime: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
        longtime: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
        minute: { minute: "numeric" },
        month: { month: "long" },
        monthandday: { month: "long", day: "numeric" },
        monthandyear: { year: 'numeric', month: "long" },
        shortdateshorttime: { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
        shorttime: { hour: 'numeric', minute: 'numeric' },
        shortyear: { year: '2-digit' },
        year: { year: 'numeric' }
    };

    DX.localization.date.resetInjection();
    DX.localization.date.inject({
        getMonthNames: function(format) {
            var intlFormats = {
                wide: "long",
                abbreviated: "short",
                narrow: "narrow"
            };
            
            return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
                return getIntlFormatter({ month: intlFormats[format || "wide"] })(new Date(0, monthIndex, 2));
            });
        },
        
        getDayNames: function(format) {
            var intlFormats = {
                wide: "long",
                abbreviated: "short",
                short: "narrow",
                narrow: "narrow"
            };
            
            var getIntlMonthNames = function(format) {
                return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                    return getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex + 1));
                });
            };
            
            var result = getIntlMonthNames(intlFormats[format || "wide"]);
            
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
           
           if(format.formatter || $.isFunction(format) || $.inArray(format.toLowerCase(), ["quarter", "quarterandyear", "millisecond", "datetime-local"]) > -1) {
               return this.callBase.apply(this, arguments);
           }
           
           return getIntlFormatter(intlFormats[format] || format)(date);
       },

       formatUsesMonthName: function(format) {
            if($.isPlainObject(format) && !(format.type || format.format)) {
                return format.month === "long";
            }

            return this.callBase.apply(this, arguments);
        },

       formatUsesDayName: function(format) {
            if($.isPlainObject(format) && !(format.type || format.format)) {
                return format.weekday === "long";
            }

            return this.callBase.apply(this, arguments)
        },

        getFormatParts: function(format) {
            var utcFormat = $.extend({}, intlFormats[format], { timeZone: 'UTC' });
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
                    }
                })
                .filter(function(part) { return part.index > -1; })
                .sort(function(a, b) { return a.index - b.index; })
                .map(function(part) { return part.name; });
        }
    });
}(DevExpress, jQuery));