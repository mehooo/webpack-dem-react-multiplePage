const path = require('path'); //公共模块
const CleanWebpackPlugin = require('clean-webpack-plugin'); //公共插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //公共插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //生产模式使用分离代码插件

const glob = require("glob");
const htmls = glob.sync('src/pages/**/*.html'); //扫描出入口页面模板的路径, 如src/pages/index/index.html, 存放在 htmls 对象里
const entrys = {}; //定义一个 entrys 动态添加入口文件
const htmlCfgs = []; //定义一个 htmlCfg 动态添加入口文件配置

htmls.forEach((filePath) => { //遍历扫描到的页面模板路径
    let path = filePath.split('/'); //分割路径, ['src', 'pages', 'index', 'index.html'], 放进 path 数组里
    let file = path.pop(); //把入口模板页面文件名pop出来, 比如: index.html
    let name = file.split('.')[0]; //把入口页面名分割出来, 取第一个就是 index
    entrys[name] = './src/pages/' + name + '/' + name + '.js'; //动态配置入口文件路径
    htmlCfgs.push( //动态配置入口文件插件
        new HtmlWebpackPlugin({
            template: filePath, //本地模板文件的位置
            chunks: [name , 'commons'], //允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的chunk注入到模板中。在配置多个页面时，每个页面注入的chunk应该是不相同的，需要通过该配置为不同页面注入不同的chunk；
            filename: file  //输出文件的文件名称
        })
    )
});

htmlCfgs.push(new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, '..'),
})); //最后把要使用的插件放进去

console.log('----', process.env.NODE_ENV);

module.exports = {
    mode: process.env.NODE_ENV ? 'production' : 'development',
    entry: entrys,
    output: { //公共output
        path: path.join(__dirname, '../dist'),
        filename: process.env.NODE_ENV ? 'js/[name].[chunkhash].js' : 'js/[name].js', //根据入口文件分为不同出口文件
        // chunkFilename : process.env.NODE_ENV ? 'js/[id].[chunkhash].js' : 'js/[id].js', //根据入口文件分为不同出口文件
    },
    resolve:{
        modules:[path.resolve('node_modules')],  // 数组   可以配置多个  强制指定寻找第三方模块的目录 使得查找更快
        alias:{  //别名配置  import xxx from 'src/xxx' ---> import xxx from '@/xxx'
            '@':path.resolve(__dirname,'./src')
        },
        extensions:['.css','.js','.json','.jsx'] // 自动添加后缀   加载模块时候依次添加后缀 直到找到为止
    },
    module: {
        rules: [ //公共配置加载器
            {
                test: /\.js$/,
                // exclude: /node_modules|packages/,  exclude代表不需要进行 loader 的目录
                include: path.resolve(__dirname, "../src"), //include代表需要进行 loader 的目录
                use: 'babel-loader'
            },
            {
                test: /\.less$/,
                include: path.resolve(__dirname, "../src"), //include代表需要进行 loader 的目录
                use: [
                    process.env.NODE_ENV ? MiniCssExtractPlugin.loader : 'style-loader', //生产模式使用分离代码插件, 开发模式不使用
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    },
    plugins: htmlCfgs
};