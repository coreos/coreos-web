'use strict';

var gulp       = require('gulp'),
    fs         = require('fs'),
    del        = require('del'),
    merge      = require('merge-stream'),
    modRewrite = require('connect-modrewrite'),
    liveReload = require('connect-livereload'),
    karma      = require('karma').server,

    runSequence = require('run-sequence'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-sass'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    ngAnnotate   = require('gulp-ng-annotate'),
    ngHtml2Js  = require('gulp-ng-html2js'),
    connect    = require('gulp-connect'),
    eslint     = require('gulp-eslint');

/**
 * Cleaning task, cleans out folders before a build
 */
gulp.task('clean', function(cb) {
  del([
    '.tmp/**',
    '.sass-cache/**',
    'dist/**'
  ], { force: true }, cb);
});

/**
 * Clean post dist files
 */
gulp.task('clean:postdist', function(cb) {
  del([
    'dist/bootstrap.css',
    'dist/font-awesome.css',
    'dist/templates-html.js',
    'dist/templates-svg.js'
  ], cb);
});

/**
 * Karma test
 */
gulp.task('test:unit', ['templates'], function (cb) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb);
});

/**
 * Lint source code
 */
gulp.task('lint', function () {
  return gulp.src([
    'src/**/*.js',
    '!src/**/*.test.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/**
 * Lint tests
 */
gulp.task('lint:tests', function () {
  return gulp.src([
    'src/**/*.test.js'
  ])
    .pipe(eslint({
      env: {
        jasmine: true
      },
      globals: {
        describe: false,
        expect: false,
        it: false,
        beforeEach: false,
        afterEach: false,
        inject: false,
        spyOn: false,
        waitsFor: false,
        runs: false,
        jasmine: false
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/**
 * SASS compile task
 * Uses libsass
 */
gulp.task('sass', function () {
    // CoreOS
    var coreOsStream = gulp.src('src/coreos.scss')
      .pipe(sass({
        includePaths: ['src/sass', 'src/sass/mixin'],
        outputStyle: 'nested'
      }))
      .pipe(gulp.dest('dist'));

    // Fontawesome
    var fontAwesomeStream = gulp.src('ext/style/font-awesome/font-awesome.scss')
      .pipe(sass({
        includePaths: ['bower_components/font-awesome/scss', 'src/sass'],
        outputStyle: 'nested'
      }))
      .pipe(gulp.dest('dist'));

    // Bootstrap
    var bootstrapStream = gulp.src('ext/style/bootstrap/bootstrap.scss')
      .pipe(sass({
        includePaths: ['bower_components/bootstrap-sass/assets/stylesheets/bootstrap', 'src/sass'],
        outputStyle: 'nested'
      }))
      .pipe(gulp.dest('dist'));

    return merge(coreOsStream, fontAwesomeStream, bootstrapStream);
});

/**
 * Uglify task
 */
gulp.task('uglify', ['uglify:annotate'], function() {
  return gulp.src('dist/coreos.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/**
 * ngAnnotate for Angular
 */
gulp.task('uglify:annotate', function() {
  return gulp.src('dist/coreos.js')
    .pipe(ngAnnotate())
    .pipe(rename('coreos.min.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * Concat CSS task
 */
gulp.task('concat:css', ['sass'], function() {
  return gulp.src('dist/*.css')
    .pipe(concat('coreos.css'))
    .pipe(gulp.dest('dist'));
});

/**
 * Concat JS task
 */
gulp.task('concat:js', ['templates'], function() {
  return gulp.src([
    'src/**/*.js',
    '!src/**/*.test.js',
    'dist/*.js'
  ])
  .pipe(concat('coreos.js'))
  .pipe(gulp.dest('dist'));
});

/**
 * Combined concat tasks
 */
gulp.task('concat', ['concat:css', 'concat:js']);

/**
 * Copy fonts
 */
gulp.task('copy:fonts', function() {
  return gulp.src([
    'bower_components/font-awesome/fonts/*',
    'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
    'src/fonts/*'
  ])
    .pipe(gulp.dest('dist/fonts'));
});

/**
 * Copy images
 */
gulp.task('copy:images', function() {
  return gulp.src('src/img/**', {
    base: 'src/img'
  })
    .pipe(gulp.dest('dist/img'));
});

/**
 * Copy SVG files
 */
gulp.task('copy:svg', function() {
  gulp.src('src/svg/**', {
    base: 'src/svg'
  })
    .pipe(gulp.dest('dist/img'));
});

/**
 * Copy SASS files
 */
gulp.task('copy:sass', function() {
  return gulp.src([
    '*.scss',
    'mixin/**/*.scss',
    'compass/**/*.scss'
  ], {
    cwd: 'src/sass',
    base: 'src/sass'
  })
    .pipe(gulp.dest('dist/sass'));
});

/**
 * Copy task (all copy tasks)
 */
gulp.task('copy', ['copy:sass', 'copy:fonts', 'copy:images', 'copy:svg']);

/**
 * Compile HTML templates to JS
 * using Angular's $templateCache
 */
gulp.task('html2js:coreos', function() {
  return gulp.src('src/ui/**/*.html')
    .pipe(ngHtml2Js({
      moduleName: 'coreos-templates-html',
      rename: function(moduleName) {
        return '/coreos.ui/' + moduleName;
      }
    }))
    .pipe(concat('templates-html.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * Compile SVG templates to JS
 * using Angular's $templateCache
 */
gulp.task('html2js:svg', function() {
  return gulp.src('src/svg/*.svg')
    .pipe(ngHtml2Js({
      moduleName: 'coreos-templates-svg',
      rename: function(moduleName) {
        return '/coreos.svg/' + moduleName;
      }
    }))
    .pipe(concat('templates-svg.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * Templates task (both html and svg)
 */
gulp.task('templates', ['html2js:coreos', 'html2js:svg']);

/**
 * Connect task
 * This task will spawn a web server on port 9001
 */
gulp.task('connect', ['watch'], function() {
  connect.server({
    port: 9001,
    host: '0.0.0.0',
    base: '.',
    livereload: true,
    // Middleware fix for using HTML5 push-state
    middleware: function (connect, options) {
      var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
      return [
        liveReload(), // Required until this bug is fixed
                      // https://github.com/AveVlad/gulp-connect/pull/83
        modRewrite(['!(\\..+)$ /example/ [L]'])
      ].concat(
        optBase.map(function(path){ return connect.static(path); }));
    }
  });
});

/**
 * Gulp watcher to notify livereload
 */
gulp.task('watch', function () {
  gulp.watch([
    'example/**/*.js',
    'src/**/*.js'
  ], ['lint']);

  return gulp.watch([
    'example/**',
    'src/**'
  ], ['reload']);
});

/**
 * Reload task
 */
gulp.task('reload', function() {
  gulp.src([
      'example/**',
      'src/**'
    ])
    .pipe(connect.reload());
});

/**
 * Test task
 */
gulp.task('test', ['lint', 'lint:tests', 'test:unit']);

/**
 * Version task
 * Create a version.json file based on the bower config version.
 */
gulp.task('version', function(cb) {
  var bowerFile   = require('./bower.json');
  var versionFile = __dirname + '/dist/version.json';

  // The data to inset into the version file
  var versionInfo = {
    version: bowerFile.version
  };

  fs.mkdirSync(__dirname + '/dist');
  fs.writeFile(versionFile, JSON.stringify(versionInfo, null, 2) + '\n', cb);
});

/**
 * Dev task
 */
gulp.task('dev', ['clean'], function() {
  gulp.start('compile:dev');
});
gulp.task('compile:dev', ['templates', 'copy', 'sass']);

/**
 * Server task
 */
gulp.task('serve', ['lint', 'watch', 'connect']);

/**
 * Compile all prod assets.
 */
gulp.task('compile:prod', ['concat', 'copy', 'version']);

gulp.task('package', function(cb) {
  // run in order
  runSequence(
    'clean',
    'compile:prod',
    'uglify',
    'clean:postdist',
    cb);
});

gulp.task('default', ['package']);
