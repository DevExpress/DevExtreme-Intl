(function (DX) {  
    DX.localization.message.resetInjection();
    DX.localization.message.inject({
        locale: function(locale) {
            if(!locale) {
                return DX.config().locale;
            }

            DX.config({ locale: locale });
        }
    });
}(DevExpress));