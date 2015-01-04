/*
 * grunt-version-git
 * https://github.com/Sjeiti/grunt-version-git
 *
 * Copyright (c) 2014 Ron Valstar
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function (grunt) {
	grunt.registerMultiTask('version_git','Change version numbers in files, including the option to change the patch number to the number of Git commits.',function () {
		var aFiles = [];
		this.files.forEach(function (f) {
			Array.prototype.push.apply(aFiles,f.src);
		});
		var done = this.async()
			,fs = require('fs')
			,exec = require('child_process').exec
			,aNumNum = {major:0,minor:1,patch:2}
			// set default options
			,oOptions = this.options({
				major: false
				,minor: false
				,patch: true
				,build: 'num'//||hash
				,git: false
				,regex: /\d+\.\d+\.\d+/
			})
			,iFiles = aFiles.length
			,sBump
			//
			,oOptionMajor = grunt.option('major')
			,oOptionMinor = grunt.option('minor')
			,oOptionPatch = grunt.option('patch')
			,bOptionMajor = oOptionMajor!==undefined
			,bOptionMinor = oOptionMinor!==undefined
			,bOptionPatch = oOptionPatch!==undefined
		;
		//
		// params
		if (bOptionMajor||bOptionMinor||bOptionPatch) {
			oOptions.major = bOptionMajor?oOptionMajor:false;
			oOptions.minor = bOptionMinor?oOptionMinor:false;
			oOptions.patch = bOptionPatch?oOptionPatch:false;
		} else {
			// reset others if major or minor bumps
			if (oOptions.major===true) {
				oOptions.minor = false;
				oOptions.patch = false;
			} else if (oOptions.minor===true) {
				oOptions.patch = false;
			}
			//
			// reset others if major or minor sets
			if (!isBool(oOptions.major)) {
				if (oOptions.minor===true) oOptions.minor = false;
				if (oOptions.patch===true) oOptions.patch = false;
			} else if (!isBool(oOptions.minor)) {
				if (oOptions.patch===true) oOptions.patch = false;
			}
		}
		//
		// set bump string
		sBump = oOptions.major===true&&'major'||oOptions.minor===true&&'minor'||oOptions.patch===true&&'patch';
		//
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
					,aMatch = sSource.match(oOptions.regex)
					,sVersion = aMatch.slice(0).pop()
					,aVersion = sVersion.split('.').map(function(s){
						return parseInt(s,10);
					})
					,aVersionNew = aVersion.slice(0)
					,sVersionNew
				;
				//
				//
				// bump version
				if (sBump) {
					var iStart = aNumNum[sBump]
						,iLen = 3-iStart
					;
					for (var j=0;j<iLen;j++) {
						var iPos = 3-iLen+j;
						if (j===0) {
							aVersionNew[iPos]++;
						} else {
							aVersionNew[iPos] = 0;
						}
					}
				} else { // set version
					if (!isBool(oOptions.major)) aVersionNew[0] = oOptions.major;
					if (!isBool(oOptions.minor)) aVersionNew[1] = oOptions.minor;
					if (!isBool(oOptions.patch)) aVersionNew[2] = oOptions.patch;
				}
				sVersionNew = aVersionNew.join('.');
//				console.log('__',sVersion,sVersionNew); // log
				//
				// add build
				if (oOptions.git) {
					sVersionNew = sVersionNew+'+'+gitRevision;
				}
				//
				if (sVersionNew!==sVersion) {
					console.log('save',sVersion,sVersionNew); // log
					sSource = sSource.replace(oOptions.regex,sVersionNew);
					fs.writeFileSync(src,sSource);
					grunt.log.writeln('File \''+src+'\' updated from',sVersion,'to',sVersionNew);
					bLastFile&&done(true);
				} else {
					grunt.log.writeln('File \''+src+'\' is up to date',sVersion);
					bLastFile&&done(true);
				}
			});
		}

		function isBool(o){
			return o===true||o===false;
		}
	});
};