var path = require('path');
var webpack = require('webpack');
require("@babel/register");

module.exports = {
    // Entry
    entry: './src/index.js',
    // Output
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'main.bundle.js',
    },
    resolve:{
        modules: ['node_modules'],
        extensions: ['.js','.less']
    },
    // Loaders
    module: {
        rules : [
            // JavaScript/JSX Files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // CSS Files
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            }
        ]
    },
    watch: true,
    stats: {
        colors: true
    },
    devtool: 'inline-source-map',
    // Plugins
    plugins: [],
};
