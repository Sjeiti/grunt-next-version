/*
 * grunt-next-version
 * https://github.com/Sjeiti/grunt-next-version
 *
 * Copyright (c) 2016 Ron Valstar
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
          //,version:'v' // cannot use
          ,version:'setversion'
          ,build:'b'
          ,git:'q'  // cannot use g
          ,regex:'r'
        }
    ;
    for (var s in defaultOptions) {
      var param = translate[s]&&getParam(translate[s])||getParam(s);
      if (param!==undefined) params[s] = param;
    }
    version(this.data.src,this.options(params),this.async().bind(this));
	});
};