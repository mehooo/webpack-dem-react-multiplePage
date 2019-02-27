const path = require('path'); //公共模块
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //生产模式使用分离代码插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //生产模式使用压缩代码插件

module.exports = merge(common, {
    devtool: 'cheap-module-source-map', //生产模式启用代码跟踪 生成一个没有列信息（column-mappings）的SourceMaps文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。
    plugins: [
        new MiniCssExtractPlugin({ //生产模式使用分离代码插件
            filename: process.env.NODE_ENV ? 'css/[name].[chunkhash].css' : 'css/[name].css',
            //https://segmentfault.com/q/1010000017880203
            // chunkFilename : process.env.NODE_ENV ? 'css/[id].[chunkhash].css' : 'js/[id].css',
        }),
        new OptimizeCssAssetsPlugin({ //生产模式使用压缩代码插件
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        })
    ],
    optimization: {// 优化
        splitChunks: {//分割代码
            cacheGroups: {// 缓存组
                //生产打包公共模块 公共的代码  一般是自己写的公共代码
                commons: {
                    chunks: 'initial', //initial表示提取入口文件的公共部分（”initial”, “async” 、 “all”）
                    minChunks: 2, //表示提取公共部分最少的文件数
                    minSize: 0, //表示提取公共部分最小的大小
                    name: 'commons' //提取出来的文件命名
                },
                // vendor:{  // 一般是第三方公共模块
                //     priority:1, // 因为执行是从上往下， 所以设置优先级比上面高  不然上面抽离的话第三方模块也被抽离了
                //     test:/node_modules/ , //匹配node_modules下的公共代码,
                //     chunks:'initial',
                //     minSize:0,
                //     minChunks: 2, //最少被引用2次的模块
                //     name: "vendor"
                // }
            }
        }
    }
});