
var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var plugins = [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
        'ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
];
if(process.env.NODE_ENV === 'production'){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}
else{
    plugins.push(new OpenBrowserPlugin({ url: 'http://localhost:8080' }));
}

module.exports = {
    context: path.join(__dirname, './src'),
    entry: {
        js: './app.js',
        html: './index.html',
        favicon: './favicon.ico',
        vendor: ['react', 'react-ace', 'brace', 'react-dom', 'jquery', 'react-redux', 'redux-thunk', 'redux-promise', 'redux-logger', 'marked', 'highlight.js']
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.(html|ico)/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }, {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer!less'
            }, {
                test: /\.css/,
                loader: 'style!css'
            }, {
                test: /\.txt$/,
                loader: 'raw'
            }, {
                test: /\.(png|jpg|gif|otf|eot|svg|ttf|woff)\??/,
                loader: 'url-loader?limit=8192'
            }, {
                test: /\.json/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins,
    devServer: {
        contentBase: './dist',
        hot: true
    }
};