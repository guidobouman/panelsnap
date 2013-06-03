module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      files: ['*.js'],
      options: {
        browser: true
      }
    }
  });
  
  // Load JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Only linting for now.
  grunt.registerTask('default', 'jshint');

  // Travis CI task.
  grunt.registerTask('ci', 'default');
};
