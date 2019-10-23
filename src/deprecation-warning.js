var displayed = false;

function isAspNetCompatMode() {
    var globalDevExpress = window.DevExpress;
    return Boolean(globalDevExpress && globalDevExpress.aspnet && window.Globalize);
}

module.exports = function() {
    if(!displayed) {
        if(!isAspNetCompatMode()) {
            // eslint-disable-next-line no-console
            console.log('Since v19.2, Intl localization utilities are included in DevExtreme. Do not use the separate devextreme-intl module.');
        }
        displayed = true;
    }
};
