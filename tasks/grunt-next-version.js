/*
 * grunt-next-version
 * https://github.com/Sjeiti/grunt-version-git
 *
 * Copyright (c) 2015 Ron Valstar
 * Licensed under the MIT license.
 */
module.exports = grunt=>{
	grunt.registerMultiTask('next_version','Change version numbers in multiple files.',function () {
    var version = require('next-version')
        ,defaultOptions = version.defaultOptions
        ,getParam = grunt.option
        ,params = {}
        ,translate = {
           major:'m'
          ,minor:'i'
          ,patch:'p'
          //,version:'v'
          ,version:'setversion'
          ,build:'b'
          ,git:'q'
          ,regex:'r'
        }
    ;
    for (var s in defaultOptions) {
      //console.log('param',s); // todo: remove log
      //console.log('param',s,translate[s]&&getParam(translate[s])||getParam(s),getParam('pg')); // todo: remove log
      var param = translate[s]&&getParam(translate[s])||getParam(s);
      if (param!==undefined) params[s] = param;
    }
    //console.log('params',this.data.src); // todo: remove log
    //console.log('options',this.options(params)); // todo: remove log
    version(this.data.src,this.options(params),this.async().bind(this));
	});
};