module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
          lib: {
              files: [
                  {src:'node_modules/bootstrap/dist/css/bootstrap.min.css', dest:'css/bootstrap.min.css'}
              ]
          },
          src: {
            files: [
                {src:'src/css/styles.css', dest:'css/<%= pkg.name %>.css'}
            ]
          }

      },
      watch: {
        src: {
          files: ['src/css/*.css', 'src/js/*.js'],
          tasks: ['copy:src'],
          options: {
            spawn: false,
          },
        },
      },
    });
  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // Default task(s).
    grunt.registerTask('default', ['watch']);
  
  };