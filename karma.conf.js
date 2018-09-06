module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['qunit'],
        files: [
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
        junitReporter: {
            outputDir: 'shippable/testresults/',
            outputFile: 'test-results.xml'
        },
        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
