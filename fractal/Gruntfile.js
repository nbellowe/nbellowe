module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      main: {
        src:  'fractal.js',
        dest: 'FractalExplorer/www/js/fractal.js'
      },
      threeJsDef:{
          files: [{expand: true, flatten: true, src: ['../../DefinitelyTyped/threejs/**/*'], dest: '../libs/three/', filter: 'isFile'}]
      },
      moveLib:{
          files: [{expand: true, flatten: true, src: '../libs/**/*', dest:'FractalExplorer/www/js/', filter: 'isFile'}]
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['copy:main', 'copy:threeJsDef', 'copy:moveLib']);
};
