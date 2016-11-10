(function (DX) {
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
       }
    });
}(DevExpress));