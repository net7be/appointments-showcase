const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const contentBase = path.join(__dirname, 'dist');

const { conf, hwpConf, minifyOptions } = require('./src/config');

const config = {
  entry: {
    app: './src/app.js',
    languageDetection: './src/language-detection.js'
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
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
    ]),
    new webpack.DefinePlugin({
      DEFAULT_LANG: "'" + conf.defaultLanguage + "'"
    })
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
      minify: (argv.mode === 'production') ? minifyOptions : false,
      /* I have to use this whole mess because HtmlWebpackPlugin
       either injects everything in head, or everything in body.
       And I wanted one of each.
       So we're disabling injection and using an ugly helper in the template.
      */
      inject: false,
      chunks: ['languageDetection', 'app'],
      headScript: 'languageDetection',
      bodyScript: 'app',
      lang: conf.defaultLanguage,
      page: 'index',
      absoluteUrl: conf.absoluteUrl,
      pageTitle: 'indexTitle'
    })
  );

  // Add the different pages.
  // I could scan the "pages" directory.
  conf.languages.map(l => {
    config.plugins.push(
      new HtmlPlugin(hwpConf(l, 'index', 'indexTitle', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'free-trial', 'freeTrialTitle', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'contact', 'contactUsTitle', argv.mode))
    );
  });
  
  return config;
};