/* eslint-env node */
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    demo: './src/demo.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'grove-react-visjs-graph',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'public')],
    compress: true,
    port: 9000
  }
};
