(function (DX) {
    var getIntlFormatter = function(format) {
        return (new Intl.DateTimeFormat(DX.config().locale, format)).format;
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
                short: "long",
                narrow: "narrow"
            };
            
            var getIntlMonthNames = function(format) {
                return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
                    return getIntlFormatter({ weekday: format })(new Date(0, 0, dayIndex + 1));
                });
            };
            
            var result = getIntlMonthNames(intlFormats[format || "wide"]);
            
            if(format === "short") {
                result = result.map(function(day) { return day.substr(0, 2); });
            }
            
            return result;
        },

//        format: function(date, format) {
//            if(!date) {
//                return;
//            }
//
//            if(!format) {
//                return date;
//            }
//            
//            format = format.type || format;
//            
//            if(format.formatter || $.isFunction(format) || $.inArray(format.toLowerCase(), ["quarter", "quarterandyear"]) > -1) {
//                return this.callBase.apply(this, arguments);
//            }
//            
//            return Globalize.format(date, this.getPatternByFormat(format) || format);
//        },
//        
//        parse: function(text, format) {
//            format = format && format.type || format;
//            
//            if(!format) {
//                return Globalize.parseDate(text);
//            }
//            
//            if(format.parser || $.inArray(format.toLowerCase(), ["quarter", "quarterandyear"]) > -1) {
//                return this.callBase.apply(this, arguments);
//            }
//            
//            return Globalize.parseDate(text, this.getPatternByFormat(format) || format);
//        }
    });
}(DevExpress));