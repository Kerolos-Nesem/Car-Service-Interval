const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
mode: process.env.NODE_ENV,
entry: '/index.js',
output: {

},
module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },{
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      }
    ]
},
plugins: [new HtmlWebPackPlugin({
    title: 'My App',
    template: 'index.html'
})]
};