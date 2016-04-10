module.exports = grunt=>{

  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

	var tempFiles = ['./temp/foo.txt','./temp/bar.txt','./temp/baz.txt','./temp/qux.txt'];

	grunt.initConfig({

		jshint: {
			all: ['Gruntfile.js','tasks/*.js','<%= nodeunit.tests %>']
			,options: { jshintrc: '.jshintrc' }
		}

		,clean: { tests: ['tmp'] }

		,next_version: {
      bump_patch: { src: tempFiles }
      ,bump_minor: { src: tempFiles, options:{minor:true} }
      ,bump_major: { src: tempFiles, options:{major:true} }
      //
      ,set_patch: { src: tempFiles, options:{patch:8} }
      ,set_minor: { src: tempFiles, options:{minor:3} }
      ,set_major: { src: tempFiles, options:{major:4} }
      ,set_version: { src: tempFiles, options:{version:'6.5.4'} }
      //
      ,build_release: { src: tempFiles, options:{release:'alpha'} }
      ,build_revision: { src: tempFiles, options:{git:true,patch:true} }
      ,build_build: { src: tempFiles, options:{build:'2345'} }
      ,build_releasebuild: { src: tempFiles, options:{release:'alpha',build:'2345'} }
		}
	});
};
