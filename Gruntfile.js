module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        src: {
          src: ['src/js/debug.js', 'src/js/cache.js', 'src/js/storage.js', 'src/js/note.js', 'src/js/main.js'],
          dest: 'dist/js/<%= pkg.name %>.js',
        },
      },
      copy: {
          lib: {
              files: [
                {src: 'node_modules/popper.js/dist/popper.min.js', dest:'dist/js/popper.min.js'},
                {src: 'node_modules/bootstrap/dist/js/bootstrap.min.js', dest:'dist/js/bootstrap.min.js'},
                {src: 'node_modules/bootstrap/dist/js/bootstrap.min.js.map', dest: 'dist/js/bootstrap.min.js.map'},
                {src: 'node_modules/bootstrap/dist/css/bootstrap.min.css', dest:'dist/css/bootstrap.min.css'}

              ]
          },
          src: {
            files: [{src: 'src/css/styles.css', dest: 'dist/css/<%= pkg.name %>.css'}]
          }
      },
      watch: {
        src: {
          files: ['src/css/*.css', 'src/js/*.js'],
          tasks: ['src'],
          options: {
            spawn: false,
          },
        },
      },
    });
  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // Default task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('lib', ['copy:lib']);
    grunt.registerTask('src',['copy:src', 'concat:src']);
  };