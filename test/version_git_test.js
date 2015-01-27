'use strict';

var grunt = require('grunt');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

var aFiles = [
		'test/fixtures/set_major.js'
		,'test/fixtures/bump_major.js'
		,'test/fixtures/set_minor.js'
		,'test/fixtures/bump_minor.js'
		,'test/fixtures/set_patch.js'
		,'test/fixtures/bump_patch.js'
		,'test/fixtures/version.js'
		,'test/fixtures/multiple1.js'
		,'test/fixtures/multiple2.js'
		,'test/fixtures/multiple3.js'
		,'test/fixtures/var.js'
		,'test/fixtures/cli_set_major.js'
		,'test/fixtures/cli_bump_major.js'
		,'test/fixtures/cli_set_minor.js'
		,'test/fixtures/cli_bump_minor.js'
		,'test/fixtures/cli_set_patch.js'
		,'test/fixtures/cli_bump_patch.js'
		,'test/fixtures/cli_set_version.js'
	]
	,oVersions = {
		set_major: '7.2.3'
		,bump_major: '2.0.0'
		,set_minor: '1.7.3'
		,bump_minor: '1.3.0'
		,set_patch: '1.2.7'
		,bump_patch: '1.2.4'
		,version: '6.5.4'
		,multiple1: '2.3.3'
		,multiple2: '2.3.3'
		,multiple3: '2.3.3'
		,var: '1.2.4'
		,cli_set_major: '7.2.3'
		,cli_bump_major: '2.0.0'
		,cli_set_minor: '1.7.3'
		,cli_bump_minor: '1.3.0'
		,cli_set_patch: '1.2.7'
		,cli_bump_patch: '1.2.4'
		,cli_set_version: '4.5.6'
	}
	,oExports = {
		setUp: function(done) {
			// setup here if necessary
			done();
		}
	}
;

aFiles.forEach(function(filePath){
	var sKey = filePath.split('/').pop().split('.').shift()
		,sFile = grunt.file.read(filePath)
		,sVersion = sFile.match(/\d+\.\d+\.\d+/).pop()
		,sVLast = sFile.match(/\d+\.\d+\.\d+/g).pop()
		,isVar = sKey==='var'
	;
	oExports[sKey] = function(test) {
		test.expect(isVar?2:1);
		test.equal(sVersion,oVersions[sKey],sKey);
		if (isVar) test.equal(sVLast,oVersions[sKey],sKey);
		test.done();
	};
});

exports.version_git = oExports;

