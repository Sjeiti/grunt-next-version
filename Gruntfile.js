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
			,'version'
			,'multiple1'
			,'multiple2'
			,'multiple3'
			,'var'
			,'cli_set_major'
			,'cli_bump_major'
			,'cli_set_minor'
			,'cli_bump_minor'
			,'cli_set_patch'
			,'cli_bump_patch'
			,'cli_set_version'
		]
	;

	function makeFile(source,target){
		var fs = require('fs')
			,sSource = fs.readFileSync(source).toString();
        //
        if (target.indexOf('multiple')!==-1) {
            var iNr = target.match(/\d/).pop();
            sSource = sSource.replace('1.2.3',['1.3.1','2.3.1','2.3.2'][iNr-1]);
        }
        //
		fs.writeFileSync(target,sSource);
		aFiles.push(target);
		return target;
	}
	function wrapMakeFile(name){
		return makeFile(sSource,sTargetPath+name+'.js');
	}
	function getFileName(name){
		return sTargetPath+name+'.js';
	}

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js','tasks/*.js','<%= nodeunit.tests %>']
			,options: { jshintrc: '.jshintrc' }
		}

		,clean: { tests: ['tmp'] }
		,preparetest: { foo: {} }

		// Configuration to be run (and then tested).
		,version_git: {
			set_major: {
				options: { major: 7 }
				,src: [getFileName('set_major')]
			}
			,bump_major: {
				options: { major: true }
				,src: [getFileName('bump_major')]
			}
			,set_minor: {
				options: { minor: 7 }
				,src: [getFileName('set_minor')]
			}
			,bump_minor: {
				options: { minor: true }
				,src: [getFileName('bump_minor')]
			}
			,set_patch: {
				options: { patch: 7 }
				,src: [getFileName('set_patch')]
			}
			,bump_patch: {
				src: [getFileName('bump_patch')]
			}
			,version: {
				options: { version: '6.5.4' }
				,src: [getFileName('version')]
			}
			,multiple: {
				src: [getFileName('multiple1'),getFileName('multiple2'),getFileName('multiple3')]
			}
			,var: {
				options: { regex: [/\d+\.\d+\.\d+/,/sVersion\s*=\s*'(\d+\.\d+\.\d+)'/] }
				,src: [getFileName('var')]
			}
			// cli
			,cli_set_major: {	src: [getFileName('cli_set_major')]}
			,cli_bump_major: {	src: [getFileName('cli_bump_major')]}
			,cli_set_minor: {	src: [getFileName('cli_set_minor')]}
			,cli_bump_minor: {	src: [getFileName('cli_bump_minor')]}
			,cli_set_patch: {	src: [getFileName('cli_set_patch')]}
			,cli_bump_patch: {	src: [getFileName('cli_bump_patch')]}
			,cli_set_version: {	src: [getFileName('cli_set_version')]}
		}

		// command line interface
		,cli: {
			set_major: { cwd: './', command: 'grunt version_git:cli_set_major --major=7', output: true }
			,bump_major: { cwd: './', command: 'grunt version_git:cli_bump_major --major', output: true }
			,set_minor: { cwd: './', command: 'grunt version_git:cli_set_minor --minor=7', output: true }
			,bump_minor: { cwd: './', command: 'grunt version_git:cli_bump_minor --minor', output: true }
			,set_patch: { cwd: './', command: 'grunt version_git:cli_set_patch --patch=7', output: true }
			,bump_patch: { cwd: './', command: 'grunt version_git:cli_bump_patch --patch', output: true }
			,set_version: { cwd: './', command: 'grunt version_git:cli_set_version --vr=4.5.6', output: true }
		}

		// Unit tests.
		,nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.registerMultiTask('preparetest', '', function() {
		aTests.forEach(wrapMakeFile.bind(null));
	});

	grunt.registerTask('non_cli',[
		'version_git:set_major'
		,'version_git:bump_major'
		,'version_git:set_minor'
		,'version_git:bump_minor'
		,'version_git:set_patch'
		,'version_git:bump_patch'
		,'version_git:version'
		,'version_git:var'
		,'version_git:multiple'
	]);

	grunt.registerTask('test',[
		'clean'
		,'preparetest'
		,'non_cli'
		,'cli'
		,'nodeunit'
	]);

	grunt.registerTask('default',['jshint','test']);

};
