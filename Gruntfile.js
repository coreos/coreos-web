'use strict';

module.exports = function(grunt) {
  /*jshint maxstatements:false */

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    watch: {
      extCss: {
        files: ['ext/style/**/*.scss'],
        tasks: ['sass:bootstrap', 'sass:fontawesome']
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['sass:coreos']
      },
      html: {
        files: ['src/ui/**/*.html'],
        tasks: ['templates']
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint']
      }
    },

    concurrent: {
      dev: {
        tasks: ['watch', 'test-watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    clean: {
      tmp: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '.sass-cache/**/*'
          ]
        }]
      },
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*'
          ]
        }]
      },
      postDist: {
        files: [{
          dot: true,
          src: [
            'dist/bootstrap.css',
            'dist/font-awesome.css',
            'dist/templates-html.js',
            'dist/templates-svg.js'
          ]
        }]
      }
    },

    // JS code linting.
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        forin: true,
        freeze: true,
        immed: true,
        indent: 2,
        latedef: true,
        maxcomplexity: 10,
        maxdepth: 3,
        maxlen: 80,
        maxparams: 20,
        maxstatements: 200,
        newcap: true,
        noarg: true,
        node: true,
        noempty: true,
        nonew: true,
        nonbsp: true,
        quotmark: 'single',
        strict: true,
        sub: true,
        trailing: true,
        undef: true,
        unused: true
      },
      src: {
        node: false,
        options: {
          globals: {
            angular: true,
            window: true
          }
        },
        files: {
          src: [
            'src/**/*.js',
            '!src/**/*.test.js'
          ]
        }
      },
      tests: {
        options: {
          globals: {
            angular: true,
            describe: true,
            expect: true,
            it: true,
            beforeEach: true,
            afterEach: true,
            inject: true,
            spyOn: true,
            waitsFor: true,
            runs: true,
            jasmine: true
          }
        },
        files: {
          src: [
            'src/**/*.test.js'
          ]
        }
      }
    },

    // Unit tests.
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['Chrome']
      },
      unit: {
        singleRun: true
      },
      dev: {
        browsers: ['Chrome'],
        singleRun: false,
        autoWatch: true
      }
    },

    // Compile SCSS to CSS.
    sass: {
      coreos: {
        options: {
          includePaths: ['src/sass', 'src/sass/mixin'],
          outputStyle: 'nested'
        },
        files: {
          'dist/coreos.css': 'src/coreos.scss'
        }
      },
      fontawesome: {
        options: {
          includePaths: ['bower_components/font-awesome/scss'],
          outputStyle: 'nested'
        },
        files: {
          'dist/font-awesome.css': 'ext/style/font-awesome/font-awesome.scss'
        }
      },
      bootstrap: {
        options: {
          includePaths: ['bower_components/bootstrap-sass/lib'],
          outputStyle: 'nested'
        },
        files: {
          'dist/bootstrap.css': 'ext/style/bootstrap/bootstrap.scss'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/coreos.min.css': ['dist/coreos.css']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true,
        },
        files: {
          'dist/coreos.min.js': ['dist/coreos.min.js']
        }
      }
    },

    concat: {
      css: {
        src: ['dist/*.css'],
        dest: 'dist/coreos.css',
      },
      js: {
        src: [
          'src/**/*.js',
          '!src/**/*.test.js',
          'dist/*.js'
        ],
        dest: 'dist/coreos.js',
      }
    },

    // Make our angular code minification friendly.
    ngmin: {
      dist: {
        files: [{
          src: 'dist/coreos.js',
          dest: 'dist/coreos.min.js'
        }]
      }
    },

    copy: {
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'bower_components/font-awesome/fonts/*',
              'bower_components/bootstrap-sass/fonts/*',
              'src/fonts/*'
            ],
            dest: 'dist/fonts/'
          }
        ]
      },
      images: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**'],
          dest: 'dist/img'
        }]
      },
      svg: {
        files: [{
          expand: true,
          cwd: 'src/svg',
          src: ['**'],
          dest: 'dist/img'
        }]
      },
      'sass': {
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['*.scss', 'mixin/**/*.scss', 'compass/**/*.scss'],
          dest: 'dist/sass'
        }]
      }
    },

    // Precompile html templates into a single javascript file.
    html2js: {
      options: {
        base: 'src/ui',
        rename: function(moduleName) {
          return '/coreos.ui/' + moduleName;
        }
      },
      svg: {
        options: {
          base: 'src/svg',
          rename: function(moduleName) {
            return '/coreos.svg/' + moduleName;
          }
        },
        module: 'coreos-templates-svg',
        src: [
          'src/svg/*.svg'
        ],
        dest: 'dist/templates-svg.js'
      },
      coreos: {
        module: 'coreos-templates-html',
        src: [
          'src/ui/**/*.html'
        ],
        dest: 'dist/templates-html.js'
      }
    }

  });

  grunt.registerTask('test', [
    'templates',
    'karma:unit'
  ]);

  grunt.registerTask('test-watch', [
    'karma:dev'
  ]);

  grunt.registerTask('templates', [
    'html2js'
  ]);

  grunt.registerTask('dev', [
    'clean',
    'jshint',
    'templates',
    'copy:fonts',
    'sass',
    'concurrent:dev'
  ]);

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'templates',
    'test',
    'sass',
    'concat',
    'cssmin',
    'ngmin',
    'uglify',
    'copy:fonts',
    'copy:images',
    'copy:svg',
    'copy:sass',
    'clean:postDist'
  ]);

  grunt.registerTask('default', ['build']);
};
