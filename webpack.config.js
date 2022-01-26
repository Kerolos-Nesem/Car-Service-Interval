const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
mode: 'development',
entry: path.resolve(__dirname,'/app.jsx'),
output: {
 path: path.resolve(__dirname,'dist')
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
        test: /\.css$/i,
        use: ["style-loader","css-loader"],
      }
    ]
},
plugins: [new HtmlWebPackPlugin({
    title: 'My App',
    template: path.resolve(__dirname,'index.html')
})],
resolve: {
    extensions: ['', '.js', '.jsx', '.css'],       
},
devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    
}
};