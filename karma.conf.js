module.exports = (config) => {
  config.set({
    // ... normal karma configuration
    files: [
      // all files ending in "_test"
      { pattern: 'test/*_test.js', watched: false },
      // each file acts as entry point for the webpack configuration
    ],

    frameworks: ['mocha'],
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],
    autoWatch: false,

    preprocessors: {
      // add webpack as preprocessor
      'test/*_test.js': ['webpack', 'coverage']
    },

    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies
      // webpack configuration
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only',
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    }
  });
};
