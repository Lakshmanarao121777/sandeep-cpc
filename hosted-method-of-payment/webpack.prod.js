/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const copyPlugin = require('copy-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const terserPlugin = require('terser-webpack-plugin');
//const htmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const compressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    return {
        mode: 'production',
        entry : './src/index.ts',
        output: {
            publicPath: 'dist',
            filename: 'jump-hosted-payment-app-bundle.js',
            path: path.resolve(__dirname, 'dist')
        },    
        plugins: [        
            //new bundleAnalyzerPlugin(),        
            new miniCssExtractPlugin({
                filename: 'assets/css/jump-hosted-payment-app.css'            
            }),        
            new copyPlugin({
                patterns: [            
                    { from: 'index.html', to: '.' },                   
                    { from: './src/template', to: './template' },
                    { from: './src/assets/images', to: './assets/images'},
                    { from: './src/assets/js', to: './assets/js'},
                    { from: 'package.json', to: '.' },
                ],
            }),
            new webpack.DefinePlugin({
                'process.env.CPC_ENV': JSON.stringify(env.environment)
            }),
            new compressionPlugin()        
            // new compressionPlugin({
            //     test: /\.js$/,
            //     algorithm: "gzip"            
            // })
        ],
        module: {        
            rules :[
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader'
                    }
                },
                // {
                //     test: /\.css$/i,
                //     exclude: /node_modules/,
                //     use:[
                //         { loader: "style-loader", options: { injectType: "linkTag" } },
                //         { loader: "file-loader", options: {
                //             name: "[name].css"
                //         } },        
                //     ]
                // },
                
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use:[
                        //"style-loader",                    
                        {
                            loader: miniCssExtractPlugin.loader,                        
                        },
                        'css-loader'
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        optimization: {
            minimize: true,
            minimizer: [
                // new terserPlugin(
                //     {                
                //         test: /\.js(\?.*)?$/i,    
                //         terserOptions: {
                //             compress: {
                //                 pure_funcs: [
                //                     'console.log', 
                //                     'console.info', 
                //                     'console.debug', 
                //                     'console.warn'
                //                 ]
                //             },
                //             format: {
                //                 comments: false
                //             },
                //         },
                //         extractComments: 'all'       
                //     }
                // ),
                new cssMinimizerPlugin({
                    test: /.s?css$/,
                }),
                //new htmlMinimizerPlugin(),
            ],
        }    
    };
};
