var dxConfig = require("devextreme/core/config");
var numberLocalization = require("devextreme/localization/number");

var currencyOptionsCache = {},
    detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/,
    getFormatter = function(format) {
        return (new Intl.NumberFormat(dxConfig().locale, format)).format;
    },
    getCurrencyFormatter = function(currency) {
        return (new Intl.NumberFormat(dxConfig().locale, { style: "currency", currency: currency }));
    };

numberLocalization.resetInjection();
numberLocalization.inject({
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
            config.currency = formatConfig.currency || dxConfig().defaultCurrency;
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
        
        var decimalSeparator = this._getDecimalSeparator(format);
        var cleanUpRegexp = new RegExp("[^0-9\\" + decimalSeparator + "]", "g");
        
        return  text.replace(cleanUpRegexp, "").replace(decimalSeparator, legitDecimalSeparator);
    },
    _getDecimalSeparator: function(format) {
        return getFormatter(format)(0.1)[1];
    },
    _getCurrencySymbolInfo: function(currency) {
        var formatter = getCurrencyFormatter(currency);
        return this._extractCurrencySymbolInfo(formatter.format(0));
    },
    _extractCurrencySymbolInfo: function(currencyValueString) {
        var match = detectCurrencySymbolRegex.exec(currencyValueString) || [],
            position = match[1] ? "before" : "after",
            symbol = match[1] || match[4] || "",
            delimiter = match[2] || match[3] || "";

        return {
            position: position,
            symbol: symbol,
            delimiter: delimiter
        };
    },
    _getCurrencyOptions: function(currency) {
        var byCurrencyCache = currencyOptionsCache[dxConfig().locale];
        
        if(!byCurrencyCache) {
            byCurrencyCache = currencyOptionsCache[dxConfig().locale] = {};
        }

        var result = byCurrencyCache[currency];

        if(!result) {
            var formatter = getCurrencyFormatter(currency),
                options = formatter.resolvedOptions(),
                symbolInfo = this._getCurrencySymbolInfo(currency),

            result = byCurrencyCache[currency] = Object.assign(options, {
                currencySymbol: symbolInfo.symbol,
                currencyPosition: symbolInfo.position,
                currencyDelimiter: symbolInfo.delimiter
            });
        }

        return result;
    },
    _repeatCharacter: function(character, times) {
        return Array(times + 1).join(character);
    },
    _createOpenXmlCurrencyFormat: function(options) {
        var result = this._repeatCharacter("0", options.minimumIntegerDigits);

        result += "{0}"; //precision is specified outside

        if(options.useGrouping) {
            result = "#," + this._repeatCharacter("#", 3 - options.minimumIntegerDigits) + result;
        }

        if(options.currencySymbol) {
            if(options.currencyPosition === "before") {
                result = options.currencySymbol + options.currencyDelimiter + result;
            }
            else {
                result += options.currencyDelimiter + options.currencySymbol;
            }
        }

        return result;
    },
    getOpenXmlCurrencyFormat: function(currency) {
        var options = this._getCurrencyOptions(currency);
        return this._createOpenXmlCurrencyFormat(options);
    }
});