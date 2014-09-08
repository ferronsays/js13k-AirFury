module.exports = function(grunt) {

    var sourceDirectory = 'src';
    var tempDirectory = '.tmp';
    var destinationDirectory = 'build';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: [destinationDirectory]
            },
            tmp: {
                src: [tempDirectory]
            }
        },

        copy: {
            scripts: {
                files: [
                    {expand: true, cwd: sourceDirectory, src: ['assets/{scripts,vendor}/**/*.js'], dest: destinationDirectory}
                ]
            },
            styles: {
                files: [
                    {expand: true, cwd: sourceDirectory, src: ['assets/{styles,vendor}/**/*.css'], dest: destinationDirectory}
                ]
            },
            media: {
                files: [
                    {expand: true, cwd: sourceDirectory, src: ['assets/media/**'], dest: destinationDirectory}
                ]
            },
            html: {
                files: [
                    {expand: true, cwd: sourceDirectory, src: ['**/*.html', '!assets/vendor/**'], dest: destinationDirectory}
                ]
            }
        },

        useminPrepare: {
            options: {
                root: sourceDirectory,
                staging: tempDirectory,
                dest: destinationDirectory
            },
            html: [sourceDirectory + '/**/*.html']
        },

        usemin: {
            html: [destinationDirectory + '/**/*.html']
        },

        cssmin: {
            options: {

            }
        },

        uglify: {
            options: {
                beautify: false,
                mangle: true,
                compress: true,
                preserveComments: false,
                wrap: 'AF'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: destinationDirectory + '/assets/media',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: destinationDirectory + '/assets/media'
                }]
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'build.zip'
                },
                expand: true,
                cwd: destinationDirectory,
                src: ['**'],
                dest: '/'
            }
        },

        watch: {
            media: {
                files: [sourceDirectory + '/assets/media/**'],
                tasks: ['media']
            },
            html: {
                files: [sourceDirectory + '/**/*.html'],
                tasks: ['html']
            },
            styles: {
                files: [sourceDirectory + '/assets/{styles,vendor}/**/*.css'],
                tasks: ['styles']
            },
            scripts: {
                files: [sourceDirectory + '/assets/{scripts,vendor}/**/*.js'],
                tasks: ['scripts']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-usemin');

    var dev = true;

    // Toggle the flag if we want to minify, etc
    dev = !grunt.option('prod');

    if (dev) {
        grunt.registerTask('scripts', ['copy:scripts']);
        grunt.registerTask('styles', ['copy:styles']);
    } else {
        grunt.registerTask('scripts', ['useminPrepare', 'concat', 'uglify', 'usemin']);
        grunt.registerTask('styles', ['useminPrepare', 'concat', 'cssmin', 'usemin']);
    }

    grunt.registerTask('media', ['copy:media', 'imagemin']);
    grunt.registerTask('html', ['copy:html']);
    
    grunt.registerTask('build', ['clean:build', 'media', 'html', 'styles', 'scripts', 'clean:tmp', 'compress']);

    // Run build task if no specific task is specified
    grunt.registerTask('default', ['build']);

    grunt.registerTask('zip', ['compress']);
};
