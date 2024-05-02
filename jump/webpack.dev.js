const path = require('path');
const copyPlugin = require("copy-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool:'eval-source-map',
    entry : './src/index.ts',
    output: {
        publicPath: "dist",
        filename: 'jump-web-component-bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        'ConfigData': JSON.stringify({
            CURRENT_CHANNEL_DOMAIN : {URI:'https://common-payment.dev.xfinity.com'},
            ALLOWED_CHANNEL_DOMAIN_LIST : ['xfinity.com','comcast.com','comcast.net','amdocs.com','xfinityprepaid.com','xfinityprepaid.net','cmilvcmdomni','cmilvcmmomni','localhost','illnqw','mwhlvcmd','mwhlvcqdomni','mwhlvcxmomni','mwhlvcmdomni','mwhlvcdpomni','mwhlvcmponi','mwhlvcmmoni','mwhlvcmk','herodigital']
        })
    },
    module: {
        rules :[
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new copyPlugin({
          patterns: [            
            //{ from: "index.html", to: "." },                               
            { from: "./src/assets/css", to: "./assets/css" },
            { from: "./src/lib/native-shim.js", to:"."},
            { from: "package.json", to: "." },
            // { from: "./node_modules/@cpc/hosted-method-of-payment/", to: "./hosted-method-of-payment"}
          ],
        }),
      ],
      optimization: {
        minimize: false,
        minimizer: [
            new terserPlugin(
            {                
                test: /\.js(\?.*)?$/i,  
                terserOptions: {
                    compress: {
                        pure_funcs: [
                            'console.log', 
                            'console.info', 
                            'console.debug', 
                            'console.warn'
                        ]
                    },
                    format: {
                      comments: false
                    },
                  },
                  extractComments: "all"       
            }
            )
    ]
    }    
}
