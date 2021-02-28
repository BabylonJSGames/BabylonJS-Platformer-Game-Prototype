const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const fs = require('fs');

// App directory
const appDirectory = fs.realpathSync(process.cwd());

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(appDirectory, "public"),
        compress: true,
        hot: true,
        publicPath: '/',
        open: true,
    },
});
