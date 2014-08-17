module.exports = function(grunt) {

    grunt.loadTasks('build_tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: { jshintrc: true },
            all: [
                "./src/**/*.js"
            ]
        },

        generatemocks: {
            options: {
                mocks: "test/mocks"
            }
        },

        browserify: {
            dist: {
                files: {
                    'test/_backbone.base.js': ['./test/bootstrap.js', './test/src/**/*.js']
                }
            },
            options: {
                /*
                shim: {
                    "Backbone": "./vendor/backbone/backbone.js"
                }
                */
            }
        },

        mocha: {
            all: {
                options: {
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html'],
                    bail: false,
                    log: true,
                    logErrors: true
                }
            }
        },

        connect: {
            options: {
                port: 9999,
                hostname: 'localhost'
            },
            test: {
                options: {
                    port: 9999,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test'),
                            mountFolder(connect, './')
                        ];
                    }
                }
            }
        },

        watch: {
            files: ["src/**/*.js", "test/**/*.js"],
            tasks: ['test']
        }
    });

    // Default task(s).
    grunt.registerTask("test", ["generatemocks", "browserify", "connect:test", "mocha" ]);
    //grunt.registerTask("build", ["uiversion","less", "buildtemplates", "buildjs", "clean"]);
    grunt.registerTask("default", [ "jshint", "test"]);

};

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
