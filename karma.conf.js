module.exports = function (config) {
    config.set({
        frameworks: ["qunit"],
        files: [
            "node_modules/jquery/dist/jquery.min.js",
            
            "node_modules/devextreme/dist/js/dx.all.debug.js",
            
            "node_modules/devextreme/dist/js/localization/dx.all.de.js",
            "node_modules/devextreme/dist/js/localization/dx.all.ja.js",
            "node_modules/devextreme/dist/js/localization/dx.all.ru.js",
            
            "src/number.js",
            "src/date.js",
            "src/locale-data.js",
            "src/message.js",

            "tests/number-tests.js",
            "tests/date-tests.js",
            "tests/message-tests.js"
        ],
        plugins: [
            "karma-qunit",
            "karma-chrome-launcher"
        ],
        reporters: ["dots"]
    });
};
