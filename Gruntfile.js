module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dev: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                src: ['src/**/*.js'],
                dest: 'build/dist.js'
            }
        },
        uglify: {
            client: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/dist.min.js.sourcemap'
                },
                files: {
                    'build/dist.min.js': ['build/dist.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['browserify:dev', 'uglify']);
};