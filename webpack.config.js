/*eslint-env node*/

var path = require('path');
var webpack = require('webpack');

var argv = require('yargs')
    .default('dev', false)
    .default('min', false)
    .argv;

var postfix = argv.min && '.min' || argv.dev && '.dev' || '';

var plugins = [
    new webpack.BannerPlugin(
        'DevExtreme-Intl v' + require('./package.json').version
    )
];
if(argv.min) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true },
        mangle: { screw_ie8: true }
    }));
}

module.exports = {
    context: path.resolve(__dirname),
    entry: './src/index',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: './devextreme-intl' + postfix + '.js',
        libraryTarget: 'umd',
        devtoolModuleFilenameTemplate: 'devextreme-intl:///[resource-path]',
        devtoolFallbackModuleFilenameTemplate: 'devextreme-intl:///[resource-path]?[hash]'
    },
    externals: {
        'devextreme/core/config': { root: [ 'DevExpress', 'config' ], amd: 'devextreme/core/config', commonjs2: 'devextreme/core/config' },
        'devextreme/localization': { root: [ 'DevExpress', 'localization' ], amd: 'devextreme/localization', commonjs2: 'devextreme/localization' },
        'devextreme/core/version': { root: [ 'DevExpress', 'VERSION' ], amd: 'devextreme/core/version', commonjs2: 'devextreme/core/version' }
    },
    plugins: plugins,
    devtool: argv.dev ? 'eval' : null,
    watch: argv.dev
};
