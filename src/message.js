var dxConfig = require("devextreme/core/config");
var messageLocalization = require("devextreme/localization/message"); 

messageLocalization.resetInjection();
messageLocalization.inject({
    locale: function() {
        return dxConfig().locale || navigator.language;
    }
});