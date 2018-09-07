/* global process */
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['qunit'],
        files: [
            { pattern: 'tests/no-intl-mock.js', watched: false },
            'node_modules/intl/dist/Intl.min.js',	
            'node_modules/intl/locale-data/complete.js',
            { pattern: 'tests/index.js', watched: false }
        ],
        preprocessors: {
            'tests/index.js': ['webpack']
        },
        plugins: [
            'karma-webpack',
            'karma-qunit',
            'karma-junit-reporter',
            'karma-chrome-launcher'
        ],
        reporters: [
            'dots',
            'junit'
        ],
        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
