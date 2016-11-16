module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS', 'Chrome'],
        frameworks: ["qunit"],
        files: [
            'node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',

            "node_modules/intl/dist/intl.js",
            "node_modules/intl/locale-data/complete.js",

            "node_modules/jquery/dist/jquery.min.js",
            
            "node_modules/devextreme/dist/js/dx.all.debug.js",
            
            "node_modules/devextreme/dist/js/localization/dx.all.de.js",
            "node_modules/devextreme/dist/js/localization/dx.all.ja.js",
            "node_modules/devextreme/dist/js/localization/dx.all.ru.js",
            
            "dist/devextreme-intl.dev.js",

            "tests/number-tests.js",
            "tests/date-tests.js",
            "tests/message-tests.js"
        ],
        plugins: [
            "karma-qunit",
            "karma-junit-reporter",
            "karma-phantomjs-launcher",
            "karma-chrome-launcher"
        ],
        reporters: [
            "dots",
            "junit"
        ],
        junitReporter: {
            outputDir: 'shippable/testresults/',
            outputFile: 'test-results.xml'
        }
    });
};
