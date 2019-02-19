const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const contentBase = path.join(__dirname, 'dist');

// Generates config objects for HtmlWebpackPlugin instances:
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: false
}

const config = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: contentBase,
    publicPath: '/',
    filename: '[name][hash:5].js'
  },
  optimization: {
    // We need all that stuff for SASS.
    // I already regret using it.
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            // PostCSS stuff is required by Bootstrap SCSS.
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/[name][contenthash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.pdf$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: 'static/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/'
          }
        }]
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          helperDirs: path.join(__dirname, 'src/helpers'),
          partialDirs: path.join(__dirname, 'src/partials'),
          inlineRequires: '/static/'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name][contenthash:5].css",
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'webroot', to: '' }
    ])
  ],
  devServer: {
    contentBase: contentBase,
    //historyApiFallback: true,
    publicPath: '/',
    port: 8081
  }
};

// I have to do this export a function thingy just because
// I need to determine the environment, and NODE_ENV is not
// just unreliable, it's NOT WORKING AT ALL.
module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  // Add the main index page here:
  config.plugins.push(
    new HtmlPlugin({
      template: './src/pages/index.hbs',
      filename: 'index.html',
      minify: (argv.mode === 'production') ? minifyOptions : false
    })
  );
  
  return config;
};