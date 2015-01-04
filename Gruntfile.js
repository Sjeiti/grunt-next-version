/*
 * grunt-version-git
 * https://github.com/Sjeiti/grunt-version-git
 *
 * Copyright (c) 2014 Ron Valstar
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');
	grunt.loadTasks('tasks');

	var sSource = 'test/file.js'
		,sTargetPath = 'test/fixtures/'
		,aFiles = []
		,aTests = [
			'set_major'
			,'bump_major'
			,'set_minor'
			,'bump_minor'
			,'set_patch'
			,'bump_patch'
			,'cli_set_minor'
			,'cli_bump_minor'
		]
	;

	function makeFile(source,target,version){
		var fs = require('fs')
			,sSource = fs.readFileSync(source).toString();
		fs.writeFileSync(target,sSource.replace('0.0.0',version));
		aFiles.push(target);
		return target;
	}
	function wrapMakeFile(name){
		return makeFile(sSource,sTargetPath+name+'.js','1.2.3');
	}
	function getFileName(name){
		return sTargetPath+name+'.js';
	}

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js','tasks/*.js','<%= nodeunit.tests %>'
			]
			,options: {
				jshintrc: '.jshintrc'
			}
		}

		// Before generating any new files, remove any previously-created files.
		,clean: {
			tests: ['tmp']
		}
		,preparetest: {
			foo: {}
		}

		// Configuration to be run (and then tested).
		,version_git: {
			set_major: {
				options: { major: 7 }
				,files: {src:getFileName('set_major')}
			}
			,bump_major: {
				options: { major: true }
				,files: {src:getFileName('bump_major')}
			}
			,set_minor: {
				options: { minor: 7 }
				,files: {src:getFileName('set_minor')}
			}
			,bump_minor: {
				options: { minor: true }
				,files: {src:getFileName('bump_minor')}
			}
			,set_patch: {
				options: { patch: 7 }
				,files: {src:getFileName('set_patch')}
			}
			,bump_patch: {
				options: { patch: true }
				,files: {src:getFileName('bump_patch')}
			}
			// cli
			,cli_set_minor: {
				options: { patch: false }
				,files: {src:getFileName('cli_set_minor')}
			}
			,cli_bump_minor: {
				options: { patch: false }
				,files: {src:getFileName('cli_bump_minor')}
			}
		}

		// command line interface
		,cli: {
			set_minor: { cwd: './', command: 'grunt version_git:cli_set_minor --minor=7', output: true }
			,bump_minor: { cwd: './', command: 'grunt version_git:cli_bump_minor --minor', output: true }
		}

		// Unit tests.
		,nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.registerMultiTask('preparetest', '', function() {
		aTests.forEach(wrapMakeFile.bind(null));
	});

	grunt.registerTask('test',[
		'clean'
		,'preparetest'
		,'version_git'
		,'cli'
		,'nodeunit'
	]);

	grunt.registerTask('default',['jshint','test']);

};
