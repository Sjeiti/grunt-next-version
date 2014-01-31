/*
 * grunt-version-git
 * https://github.com/Sjeiti/grunt-version-git
 *
 * Copyright (c) 2014 Ron Valstar
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var aTestFiles = '....'.split('.').map(function(o,i){
		return 'test/fixtures/file'+i+'.js';
	});

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js','tasks/*.js','<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},
		preparetest: {
			foo: {}
		},

		// Configuration to be run (and then tested).
		version_git: {
			default_options: {
				files: {src:'test/fixtures/*'}
			},
			set_major: {
				options: {
					major: '7'
					,revision: false
				},
				files: {src:aTestFiles[1]}
			},
			bump_major: {
				options: {
					major: true
					,revision: false
				},
				files: {src:aTestFiles[2]}
			},
			set_minor: {
				options: {
					minor: '11'
					,revision: false
				},
				files: {src:aTestFiles[3]}
			},
			bump_minor: {
				options: {
					minor: true
					,revision: false
				},
				files: {src:aTestFiles[4]}
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.registerMultiTask('preparetest', '', function() {
		var fs = require('fs')
			,sSource = fs.readFileSync('test/file.js').toString()
		;
		aTestFiles.forEach(function(src,i){
			fs.writeFileSync(src,sSource.replace('0.0.0','1.'+(3*i%5)+'.'+i));
		});
	});


	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test',[
		'clean'
		,'preparetest'
		,'version_git'
		,'nodeunit'
	]);

	// By default, lint and run all tests.
	grunt.registerTask('default',['jshint','test']);

};
