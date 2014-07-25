module.exports = function(config) {

  config.set({

    // Base path, that will be used to resolve files and exclude.
    basePath: __dirname,

    // Test framework to use.
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/underscore/underscore.js',
      'bower_components/underscore.string/lib/underscore.string.js',
      'bower_components/d3/d3.js',
      'bower_components/angular-mocks/angular-mocks.js',

      // Tests & test helper files.
      'test/mock/mocks.js',
      'test/**/*.js',

      // Actual code & tests.
      'src/coreos.js',
      'src/*.js',
      'src/**/*.js',

      // compiled templates
      'dist/templates*.js'
    ],

    reporters: ['progress'],

    // web server port
    port: 8100,

    // cli runner port
    runnerPort: 9100,

    colors: true,

    // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,

    // Continuous Integration mode.
    // If true, it capture browsers, run tests and exit.
    singleRun: true

  });

};
