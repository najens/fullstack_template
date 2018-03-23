const path = require('path');
const SRC_DIR = path.resolve(__dirname, 'static');
const DIST_DIR = path.resolve(__dirname, 'dist');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // removes/cleans build folders before building
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // minify js
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // bundles css
const CopyWebpackPlugin = require('copy-webpack-plugin'); // copies files/directories to build directory
const HtmlWebpackPlugin = require('html-webpack-plugin'); // generates html5 file with webpack bundles

const config = {
    entry: [
        'tether',
        SRC_DIR + '/js/index.jsx'
    ],
    output: {
        path: DIST_DIR + '/',
        filename: 'static/js/bundle.js'
    },
    devServer: {
        contentBase: DIST_DIR,  // Dist directory for webpack dev server
        // contentBase: DIST_DIR +'/templates',  // (change to templates sub-directory for flask)
        compress: true,
        port: 5000
    },
    // devtool: 'cheap-module-source-map', // Remove for production may need for cross origin
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,  // If doesn't work try without this
                        }
                    }
                ]

            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                use: ['graphql-tag/loader'] // Adds gql'' tag to files
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [precss, autoprefixer];
                                }
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000, // Convert images < 8kb to base64 strings
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.html',
                     '.jpeg', 'png', 'gif', 'svg', '.graphql','.gql']
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            ko: 'knockout',
            tether: 'tether',
            Tether: 'tether',
            'window.Tether': 'tether',
            Popper: ['popper.js', 'default'],
            'window.Tether': 'tether',
            // Bootstrap plugins
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        }),
        new CleanWebpackPlugin([DIST_DIR]),
        new UglifyJsPlugin(),
        new ExtractTextPlugin({
            filename: 'static/css/style.css'
        }),
        new CopyWebpackPlugin([
            {
                from: SRC_DIR + '/img',
                to:'static/img'
            }
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',  // save in dist folder for webpack dev server
            // filename: 'templates/index.html',  // save in templates folder for production
            template: SRC_DIR + '/index.html'
        })
    ]
};

module.exports = config;
