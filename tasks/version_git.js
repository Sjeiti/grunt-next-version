/*
 * grunt-version-git
 * https://github.com/Sjeiti/grunt-version-git
 *
 * Copyright (c) 2014 Ron Valstar
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function (grunt) {
	grunt.registerMultiTask('version_git','Change version numbers in files, including the option to change the revision number to the number of Git commits.',function () {
		var aFiles = [];
		this.files.forEach(function (f) {
			Array.prototype.push.apply(aFiles,f.src);
		});
		var done = this.async()
			,fs = require('fs')
			,exec = require('child_process').exec
			// set default options
			,oOptions = this.options({
				major: false
				,minor: false
				,revision: true
				,git: true
				,regex: /\d+\.\d+\.\d+/
			})
			,iFiles = aFiles.length
		;
		// check if GIT is installed for project
		if (oOptions.git) {
			exec('git rev-list HEAD --count', function(error,stdout){//,stderr
				var aMatch = stdout.match(/\d+/)
					,bGIT = !!aMatch;
				if (bGIT) {
					iterateFiles(aMatch.pop());
				} else {
					console.warn('GIT not found'); // log
					done(false);
				}
			});
		} else {
			iterateFiles();
		}
		// Iterate over all specified file groups.
		function iterateFiles(gitRevision){
			aFiles.forEach(function(src,i) {
				var bLastFile = i===iFiles-1
					,sSource = fs.readFileSync(src).toString()
					// the current version
					,sVersion = sSource.match(oOptions.regex).pop()
					,aVersion = sVersion.split('.')
					,oCurVersion = {
						major: aVersion[0]
						,minor: aVersion[1]
						,revision: aVersion[2]
					}
					// the new version
					,sNewMajor = newNumber('major')
					,sNewMinor = newNumber('minor')
					,sNewRevision = newNumber('revision')
					,bMajor = oCurVersion.major!==sNewMajor
					,bMinor = oCurVersion.minor!==sNewMinor
					,bRevision = oCurVersion.revision!==sNewRevision
				;
				if (oOptions.git) {
					if (oCurVersion.revision!==gitRevision) {
						sNewRevision = gitRevision;
						saveVersion();
					} else if (bMajor||bMinor) {
						saveVersion();
					} else {
						dontSaveVersion();
					}
				} else if (bMajor||bMinor||bRevision) {
					saveVersion();
				} else {
					dontSaveVersion();
				}
				function newNumber(type){
					var oParam = grunt.option(type)
						,oSet = oOptions[type]
						,oCur = oCurVersion[type];
					return oParam!==undefined?oParam:(oSet===true?''+(parseInt(oCur,10)+1):(oSet===false?oCur:oSet));
				}
				function saveVersion(){
					var sNewVersion = sNewMajor+'.'+sNewMinor+'.'+sNewRevision;
					sSource = sSource.replace(oOptions.regex,sNewVersion);
					fs.writeFileSync(src,sSource);
					grunt.log.writeln('File \''+src+'\' updated from',sVersion,'to',sNewVersion);
					bLastFile&&done(true);
				}
				function dontSaveVersion(){
					grunt.log.writeln('File \''+src+'\' is up to date',sVersion);
					bLastFile&&done(true);
				}
			});
		}
	});
};