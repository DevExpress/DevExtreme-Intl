var dxConfig = require("devextreme/core/config");
var messageLocalization = require("devextreme/localization/message"); 

messageLocalization.resetInjection();
messageLocalization.inject({
    locale: function(locale) {
        if(!locale) {
            return dxConfig().locale;
        }

        dxConfig({ locale: locale });
    }
});