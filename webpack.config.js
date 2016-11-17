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
    context: path.resolve(__dirname + '/src'),
    entry: './index',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: './devextreme-intl' + postfix + '.js',
        libraryTarget: 'umd'
    },
    externals: {
        'jquery': { root: 'jQuery', amd: 'jquery', commonjs: 'jquery' },
        'devextreme/core/config': { root: [ 'DevExpress', 'config' ], amd: 'devextreme/core/config', commonjs: 'devextreme/core/config' },
        'devextreme/localization/number': { root: [ 'DevExpress', 'localization', 'number' ], amd: 'devextreme/localization/number', commonjs: 'devextreme/localization/number' },
        'devextreme/localization/date': { root: [ 'DevExpress', 'localization', 'date' ], amd: 'devextreme/localization/date', commonjs: 'devextreme/localization/date' },
        'devextreme/localization/message': { root: [ 'DevExpress', 'localization', 'message' ], amd: 'devextreme/localization/message', commonjs: 'devextreme/localization/message' }
    },
    plugins: plugins,
    devtool: argv.dev ? 'eval' : null,
    watch: argv.dev
};
