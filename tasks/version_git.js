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
		var done = this.async()
			,fs = require('fs')
			,exec = require('child_process').exec
            //
            ,oData = this.data
            ,aFiles = oData.src
            //
			,aNumNum = {major:0,minor:1,patch:2}
			// set default options
			,oOptions = this.options({
				major: false
				,minor: false
				,patch: false
				,version: false
				,build: 'num'//||hash
				,git: false
				,regex: /\d+\.\d+\.\d+/
			})
			,iFiles = aFiles.length
			,sBump
			//
			,gn = grunt.option
			,oParamMajor = gn('major')||gn('MAJOR')
			,oParamMinor = gn('minor')||gn('MINOR')
			,oParamPatch = gn('patch')||gn('PATCH')
			,oParamVersion = gn('vr')||gn('VR')
			,bParamMajor = oParamMajor!==undefined
			,bParamMinor = oParamMinor!==undefined
			,bParamPatch = oParamPatch!==undefined
			,bParamVersion = oParamVersion!==undefined
		;
		//
		// params
		if (bParamVersion||oOptions.version) {
            var aParamVersion = (oOptions.version||oParamVersion).split('.');
			oOptions.major = aParamVersion[0];
			oOptions.minor = aParamVersion[1];
			oOptions.patch = aParamVersion[2];
        } else if (bParamMajor||bParamMinor||bParamPatch) {
			oOptions.major = bParamMajor?oParamMajor:false;
			oOptions.minor = bParamMinor?oParamMinor:false;
			oOptions.patch = bParamPatch?oParamPatch:false;
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
		// if all options are false simply bump patch
		if (oOptions.major===false&&oOptions.minor===false&&oOptions.patch===false) {
			oOptions.patch = true;
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
            var sHighestVersion = '0.0.0'
                ,iHighestVersion = 0
                ,aProcessedFiles = [];
			aFiles.forEach(function(src) {
				var sSource = fs.readFileSync(src).toString()
					,sVersion
					,aVersionNew
					,sVersionNew
					,bRegexArray = Array.isArray(oOptions.regex)
                    ,iVersion
				;
				if (bRegexArray) {
					var iVersionMax = 0;
					oOptions.regex.forEach(function(regex){
						var sCheck = getSourceVersion(sSource,regex)
							,iCheck = versionToInt(sCheck);
						if (iCheck>iVersionMax) {
							iVersionMax = iCheck;
							sVersion = sCheck;
						}
					});
				} else {
					sVersion = getSourceVersion(sSource,oOptions.regex);
				}
				aVersionNew = getVersionArray(sVersion);
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
                iVersion = versionToInt(sVersionNew);
                if (iVersion>iHighestVersion) {
                    iHighestVersion = iVersion;
                    sHighestVersion = sVersionNew;
                }
                aProcessedFiles.push({
                    version: sVersion
                    ,source: sSource
                    ,src: src
                });
            });
			aProcessedFiles.forEach(function(o,i) {
				var bLastFile = i===iFiles-1
                    ,src = o.src
					,sSource = o.source//fs.readFileSync(src).toString()
					,sVersion = o.version
					,sVersionNew = sHighestVersion
					,bRegexArray = Array.isArray(oOptions.regex)
				;
				//
				// add build
				if (oOptions.git) {
					sVersionNew = sVersionNew+'+'+gitRevision;
				}
				// save file
				if (sVersionNew!==sVersion) {
					if (bRegexArray) {
						oOptions.regex.forEach(function(regex){
							sSource = replaceSource(sSource,regex,sVersionNew);
						});
					} else {
						sSource = replaceSource(sSource,oOptions.regex,sVersionNew);
					}
					fs.writeFileSync(src,sSource);
					grunt.log.writeln('File \''+src+'\' updated from',sVersion,'to',sVersionNew);
					bLastFile&&done(true);
				} else {
					grunt.log.writeln('File \''+src+'\' is up to date',sVersion);
					bLastFile&&done(true);
				}
			});
		}

		function replaceSource(source,regex,version){
			var aMatch = source.match(regex);
			if (aMatch) {
				var iMatch = aMatch.length
					,sReplace = aMatch.pop();
				if (iMatch===2) {
					var sFull = aMatch.pop();
					source = source.replace(sFull,sFull.replace(sReplace,version));
				} else {
					source = source.replace(regex,version);
				}
			}
			return source;
		}

		function getSourceVersion(source,regex){
			var aMatch = source.match(regex);
			return aMatch?aMatch.slice(0).pop():'0.0.0';
		}

		function getVersionArray(version){
			return version.split('.').map(function(s){ return parseInt(s,10); });
		}

		function versionToInt(version){
			var iMax = 1E6
				,iNumber = 0;
			getVersionArray(version).forEach(function (n,i) {
				iNumber += n * Math.pow(iMax,3 - i);
			});
			return iNumber;
		}

		/*function intToVersion(int){
			var iMax = 1E6
				,aVersion = [];
			for (var i=0;i<3;i++) {
				var iNumber = Math.floor(int / Math.pow(iMax,3 - i));
				int -= iNumber * Math.pow(iMax,3 - i);
				aVersion.push(iNumber);
			}
			return aVersion.join('.');
		}*/

		function isBool(o){
			return o===true||o===false;
		}
	});
};