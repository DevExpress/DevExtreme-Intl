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

            "tests/number-tests.js"
        ],
        plugins: [
            "karma-qunit",
            "karma-chrome-launcher"
        ],
        reporters: ["dots"]
    });
};
