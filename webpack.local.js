const projectName='.';
const path = require('path');
const webpack=require('webpack');
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
    resolve: {
        // 设置别名
        alias: {
            '@': resolve('./src'),// 这样配置后 @ 可以指向 src 目录
            '@assets': resolve('./src/assets'),// 这样配置后 @ 可以指向 src 目录
            '@images': resolve('./src/assets/images'),// 这样配置后 @ 可以指向 src 目录
            "@static":resolve('./src/static'),
            "PIXI":resolve("./src/lib/pixi.min.js"),//用本地的js出错。。。下面直接读取node_module中的pixi.js-legacy
            "THREE":resolve("./src/lib/three.min.js"),
        }
    },
    plugins: [
        //提供全局的变量，在模块中使用无需用require引入
        new webpack.ProvidePlugin({
          $:resolve("./src/lib/jquery-3.3.1.min.js"),
          TweenMax:resolve("./src/lib/greensock/TweenMax.js"),
          PIXI: 'pixi.js-legacy',
          THREE: "THREE",
        }),
    ]
}
// exports.ali={
//     resolve: {
//         // 设置别名
//         alias: {
//             '@': resolve(projectName+'/src'),// 这样配置后 @ 可以指向 src 目录
//             '@assets': resolve(projectName+'/src/assets'),// 这样配置后 @ 可以指向 src 目录
//             '@images': resolve(projectName+'/src/assets/images')// 这样配置后 @ 可以指向 src 目录
//         }
//     }
// }