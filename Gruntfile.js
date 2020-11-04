module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
      copy: {
        main: {
          files: [
            {src: 'node_modules/popper.js/dist/popper.min.js', dest:'src/js/popper.min.js'},
            {src: 'node_modules/bootstrap/dist/js/bootstrap.min.js', dest:'src/js/bootstrap.min.js'},
            {src: 'node_modules/bootstrap/dist/js/bootstrap.min.js.map', dest: 'src/js/bootstrap.min.js.map'},
            {src: 'node_modules/bootstrap/dist/css/bootstrap.min.css', dest:'src/css/bootstrap.min.css'}
          ]
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy']);
  };