const path = require('path'); //公共模块
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map', //开发模式启用代码跟踪
    devServer: { //开发模式启用服务器 https://www.webpackjs.com/configuration/dev-server/#devserver
        contentBase: '../dist', //将dist目录下的文件(index.html)作为可访问文件, 如果不写这个参数则默认与配置文件同级目录
        port: 8080, //端口号设为8080, 默认也是8080
        compress: true, //启用gzip压缩
        host: '0.0.0.0', //允许局域网中其他设备访问你本地的服务
        proxy: {
            "/api": {
                target: "http://localhost:3000", //http://localhost:3000/api/*
                bypass: function(req, res, proxyOptions) { //对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。
                    if (req.headers.accept.indexOf("html") !== -1) {
                        console.log("Skipping proxy for browser request.");
                        return `${req.path}.html`;
                    }
                }
            }
        }
    }
});