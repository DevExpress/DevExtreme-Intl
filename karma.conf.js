module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS', 'Chrome'],
        frameworks: ['qunit'],
        files: [
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
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],
        reporters: [
            'dots',
            'junit'
        ],
        junitReporter: {
            outputDir: 'shippable/testresults/',
            outputFile: 'test-results.xml'
        },
        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
