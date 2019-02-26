const conf = {
  languages: ['en', 'fr', 'nl'],
  // The main index page will be generated using the
  // default language.
  defaultLanguage: 'en',
  // This is passed to the templates and used in some metatags:
  // (no trailing slash)
  absoluteUrl: 'https://remindothers.net7.be/about'
};

// Extra options for HTML Webpack Plugin.
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: false
};

function hwpConf(lang, page, pageTitle, env) {
  return {
    template: './src/pages/' + page + '.hbs',
    filename: lang + '/' + page + '.html',
    minify: (env === 'production') ? minifyOptions : false,
    chunks: ['app'],
    lang: lang,
    page: page,
    absoluteUrl: conf.absoluteUrl,
    pageTitle: pageTitle ? pageTitle : undefined
  };
}

module.exports = {conf, hwpConf, minifyOptions};