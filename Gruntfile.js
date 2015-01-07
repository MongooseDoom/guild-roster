module.exports = function(grunt) {

  grunt.initConfig({
    sass:{
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'assets/style.css': 'assets/style.scss',
        }
      }
    },
    watch: {
      css: {
        files: 'assets/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
    },
    browserSync: {
        bsFiles: {
            src : 'assets/*.css'
        },
        options: {
            server: {
                baseDir: "./"
            },
            watchTask: true
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['sass','browserSync','watch']);

};