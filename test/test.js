var assert = require('assert')
    ,fs = require('fs')
    ,mkdirp = require('mkdirp')
    ,warn = console.warn.bind(console)
    ,childProcess = require('child_process')
    ,exec = childProcess.exec
    ,tempRoot = './temp/'
    ,cliGrunt = 'grunt next_version:'
    ,cliGruntDefault = 'bump_patch'
    ,files = [
      ['foo.txt','0.1.0']
      ,['bar.txt','0.8.2']
      ,['baz.txt','1.0.1']
      ,['qux.txt','0.7.3-alpha+2349']
    ].map(file=>({
      name: file[0]
      ,path: tempRoot+file[0]
      ,contents: file[1]
    }))
    ,version = require('next-version')
;

mkdirp(tempRoot,run);

describe('Grunt',()=>{
  beforeEach(setup);
  describe('bump',()=>{
    it('should bump patch',done=>exec(cliGrunt+'bump_patch',err=>assertFiles(err,done,'1.0.2')));
    it('should bump minor',done=>exec(cliGrunt+'bump_minor',err=>assertFiles(err,done,'1.1.0')));
    it('should bump major',done=>exec(cliGrunt+'bump_major',err=>assertFiles(err,done,'2.0.0')));
  });
  describe('set',()=>{
    it('should set patch',done=>exec(cliGrunt+'set_patch',err=>assertFiles(err,done,'1.0.8')));
    it('should set minor',done=>exec(cliGrunt+'set_minor',err=>assertFiles(err,done,'1.3.1')));
    it('should set major',done=>exec(cliGrunt+'set_major',err=>assertFiles(err,done,'4.0.1')));
    it('should set version',done=>exec(cliGrunt+'set_version',err=>assertFiles(err,done,'6.5.4')));
  });
  describe('build',()=>{
    it('should set release suffix',done=>exec(cliGrunt+'build_release',err=>assertFiles(err,done,'1.0.1-alpha')));
    it('should add revision suffix and bump patch',done=>exec(cliGrunt+'build_revision',err=>assertFilesRegex(err,done,/1\.0\.2\+\d+/)));
    it('should set build suffix',done=>exec(cliGrunt+'build_build',err=>assertFiles(err,done,'1.0.1+2345')));
    it('should set release and build',done=>exec(cliGrunt+'build_releasebuild',err=>assertFiles(err,done,'1.0.1-alpha+2345')));
  });
  afterEach(teardown);
});

describe('Grunt CLI',()=>{
  beforeEach(setup);
  describe('bump',()=>{
    it('should bump patch',done=>exec(cliGrunt+cliGruntDefault,err=>assertFiles(err,done,'1.0.2')));
    it('should bump minor',done=>exec(cliGrunt+cliGruntDefault+' -i',err=>assertFiles(err,done,'1.1.0')));
    it('should bump major',done=>exec(cliGrunt+cliGruntDefault+' -m',err=>assertFiles(err,done,'2.0.0')));
  });
  describe('set',()=>{
    it('should set patch',done=>exec(cliGrunt+cliGruntDefault+' --patch=8',err=>assertFiles(err,done,'1.0.8')));
    it('should set minor',done=>exec(cliGrunt+cliGruntDefault+' --minor=3',err=>assertFiles(err,done,'1.3.1')));
    it('should set major',done=>exec(cliGrunt+cliGruntDefault+' --major=4',err=>assertFiles(err,done,'4.0.1')));
    it('should set version',done=>exec(cliGrunt+cliGruntDefault+' --setversion=6.5.4',err=>assertFiles(err,done,'6.5.4')));
  });
  describe('build',()=>{
    it('should set release suffix',done=>exec(cliGrunt+cliGruntDefault+' --release=alpha',err=>assertFiles(err,done,'1.0.1-alpha')));
    it('should add revision suffix',done=>exec(cliGrunt+cliGruntDefault+' -q',err=>assertFilesRegex(err,done,/1\.0\.1\+\d+/)));
    it('should set build suffix',done=>exec(cliGrunt+cliGruntDefault+' --build=2345',err=>assertFiles(err,done,'1.0.1+2345')));
    it('should set release and build',done=>exec(cliGrunt+cliGruntDefault+' --release=alpha --build=2345',err=>assertFiles(err,done,'1.0.1-alpha+2345')));
  });
  afterEach(teardown);
});

function setup(){
	return Promise.all(files.map(file=>save(file.path,file.contents)));
}

function teardown(){
	return Promise.all(files.map(file=>del(file.path)));
}

function assertFiles(err,done,version){
  assert.equal(!!err,false);
  Promise.all(files.map(file=>read(file.path)))
    .then(results=>results.forEach(result=>assert.equal(result,version)),warn)
    .then(done,done);
}

function assertFilesRegex(err,done,regex){
  assert.equal(!!err,false);
  Promise.all(files.map(file=>read(file.path)))
    .then(results=>results.forEach(result=>assert.equal(regex.test(result),true)),warn)
    .then(done,done);
}

function save(file,data) {
  return new Promise(function(resolve,reject){
    fs.writeFile(file, data, err=>err&&reject(err)||resolve());
  });
}

function del(file) {
  return new Promise(function(resolve,reject){
    fs.unlink(file, err=>err&&reject(err)||resolve());
  });
}

function read(file) {
  return new Promise(function(resolve,reject){
    fs.readFile(file, (err,data)=>err&&reject(err)||resolve(data.toString()));
  });
}