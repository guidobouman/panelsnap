module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      //all: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
      all: ['*.js']
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  // grunt.loadNpmTasks('grunt-sample');

  // Default task.
  // grunt.registerTask('default', 'lint sample');

  // Only linting for now.
  grunt.registerTask('default', 'lint');

  // Travis CI task.
  grunt.registerTask('ci', 'default');
};