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

var aTestFiles = '....'.split('.').map(function(o,i){
	return 'test/fixtures/file'+i+'.js';
});
function getVa(fileNr){
	return grunt.file.read(aTestFiles[fileNr]).match(/\d+\.\d+\.\d+/).pop().split('.');
}

exports.version_git = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	default_options: function(test) {
		test.expect(1);
		test.notEqual(getVa(0)[2],'0','By default set to git revision #.');
		test.done();
	},
	set_major: function(test) {
		test.expect(1);
		test.equal(getVa(1)[0],'7','Set major version number.');
		test.done();
	},
	bump_major: function(test) {
		test.expect(1);
		test.equal(getVa(2)[0],'2','Bump major version number.');
		test.done();
	},
	set_minor: function(test) {
		test.expect(1);
		test.equal(getVa(3)[1],'11','Set minor version number.');
		test.done();
	},
	bump_minor: function(test) {
		test.expect(1);
		test.equal(getVa(4)[1],'3','Bump minor version number.');
		test.done();
	}
};
