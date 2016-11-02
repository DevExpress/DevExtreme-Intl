(function (DX) {
    var getFormatter = function(format) {
        return (new Intl.NumberFormat(DX.config().locale, format)).format;
    };
    
    DX.localization.number.resetInjection();
    DX.localization.number.inject({
        _formatNumberCore: function (value, format, formatConfig) {
            if(format === 'exponential') {
                return this.callBase.apply(this, arguments);
            }
            
            return getFormatter(this._normalizeFormatConfig(format, formatConfig))(value);
        },
        _normalizeFormatConfig: function(format, formatConfig, value) {
            var config;
            
            if(format === "decimal") {
                config = {
                    minimumIntegerDigits: formatConfig.precision || 1,
                    useGrouping: false,
                    maximumFractionDigits: 0,
                    round: value < 0 ? "ceil" : "floor"
                };
            } else {
                config = {
                    minimumFractionDigits: formatConfig.precision || 0,
                    maximumFractionDigits: formatConfig.precision || 0
                };
            }
            
            if(format === "percent") {
                config.style = "percent";
            } else if(format === "currency") {
                config.style = "currency";
                config.currency = formatConfig.currency || DX.config().defaultCurrency;
            } 
            
            return config;
        },
        format: function (value, format) {
            if ("number" !== typeof value) {
                return value;
            }
            
            format = this._normalizeFormat(format);
            
            if (!format || "function" !== typeof format && !format.type && !format.formatter) {
                return getFormatter(format)(value);
            }
            
            return this.callBase.apply(this, arguments);
        },
        parse: function(text, format) {
            if(!text) {
                return;
            }
            
            if(format && format.parser) {
                return format.parser(text);
            }
            
            text = this._normalizeNumber(text, format);
            
            return parseFloat(text);
        },
        _normalizeNumber: function(text, format) {
            var isExponentialRegexp = /^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)+$/,
                legitDecimalSeparator = ".";
            
            if(isExponentialRegexp.test(text)) {
                return text;
            }
            
            const decimalSeparator = this._getDecimalSeparator(format);
            const cleanUpRegexp = new RegExp("[^0-9\\" + decimalSeparator + "]", "g");
            
            return  text.replace(cleanUpRegexp, "").replace(decimalSeparator, legitDecimalSeparator);
        },
        _getDecimalSeparator: function(format) {
            return getFormatter(format)(0.1)[1];
        }
    });
}(DevExpress));