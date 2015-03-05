module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      //put style sheets and js files here
      main : {
        src: ['public/client/**/*.js'],
        // src: ['public/client/app.js', 'public/client/router.js',
        //       'public/client/linksView.js'],
        dest: 'public/dist/main.js'
      },
      lib : {
        // src: ['public/lib/**/*.js'],
        src: ['public/lib/jquery.js', 'public/lib/underscore.js',
              'public/lib/backbone.js', 'public/lib/handlebars.js'],
        dest: 'public/dist/lib.js'
      },
      // combo: {
      //   src: ['public/lib/**/*.js', 'public/client/**/*.js'],
      //   dest: 'public/dist/everything.js'
      // },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      main: {
        files: {
          'public/dist/main.min.js' : ['public/dist/main.js']
        }
      },
      lib: {
        files: {
          'public/dist/lib.min.js' : ['public/dist/lib.js']
        }
      },
    },

    jshint: {
      files: ['public/client/**/*.js'],
            options: {
              globals: {
                jQuery: true,
              }
            }
      // options: {
      //   force: 'true',
      //   jshintrc: '.jshintrc',
      //   ignores: [
      //     'public/lib/**/*.js',
      //     // 'public/dist/**/*.js'
      //   ]
      // }
    },

    cssmin: {
      target: {
         files: {
           'public/dist/style.min.css': ['public/style.css']
         }
       }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
  ]);


};
