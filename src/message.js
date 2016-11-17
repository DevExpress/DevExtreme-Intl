var dxConfig = require("devextreme/core/config");
var messageLocalization = require("devextreme/localization/message"); 

messageLocalization.resetInjection();
messageLocalization.inject({
    locale: function() {
        return dxConfig().locale || navigator.language;
    },

    getFormatter: function(key) {
        return this.callBase(key) || this.callBase(key, 'en');
    }
});