/* jshint node: true */

"use strict";

var path = require("path");

module.exports = {
    context: path.resolve(__dirname + "/src"),
    entry: "./index",
    output: {
        path: path.resolve(__dirname + "/dist"),
        filename: "./devextreme-intl.js",
        libraryTarget: "umd"
    },
    externals: {
        // Required
        "jquery": { root: "jQuery", amd: "jquery", commonjs: "jquery" },
        "devextreme/core/config": { root: [ "DevExpress", "config" ], amd: "devextreme/core/config", commonjs: "devextreme/core/config" },
        "devextreme/localization/number": { root: [ "DevExpress", "localization", "number" ], amd: "devextreme/localization/number", commonjs: "devextreme/localization/number" },
        "devextreme/localization/date": { root: [ "DevExpress", "localization", "date" ], amd: "devextreme/localization/date", commonjs: "devextreme/localization/date" },
        "devextreme/localization/message": { root: [ "DevExpress", "localization", "message" ], amd: "devextreme/localization/message", commonjs: "devextreme/localization/message" }
    },
    devtool: "eval",
    watch: true,
    debug: true
};
