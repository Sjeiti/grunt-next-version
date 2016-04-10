# grunt-next-version

> Change version numbers in files, including the option to change the revision number to the number of Git commits.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-next-version --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-next-version');
```

## The "version_git" task

This task changes version numbers in files, including the option to change the revision number to the number of Git commits.
The task can make use of the `git` command and expects it to be globally installed.

### Overview
In your project's Gruntfile, add a section named `version_git` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  version_git: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.major
Type: `Boolean|Number`
Default value: `false`

#### options.minor
Type: `Boolean|Number`
Default value: `false`

#### options.patch
Type: `Boolean|Number`
Default value: `true`

#### options.version
Type: `String`

#### options.git
Type: `Boolean`
Default value: `false`
Appends a build number based on the number of GIT commits, ie: v1.2.3+897.

#### options.regex
Type: `Regexp|Regexp[]`
Default value: `/\d+\.\d+\.\d+/`


### Command line options

Versioning options can be used by CLI, which is very useful for bumping majors and minors. The following overrides the setup from the gruntfile and sets the major version of all files:

`grunt version_git --major=3`

Other options are:

`grunt version_git --minor=3`

`grunt version_git --patch=3`

`grunt version_git --vs="2.3.4"`


### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  version_git: {
    files: ['src/testing/file0.js']
  }
})
```

```js
/*
 * Example
 * @version 1.0.1
 */
(function(){
	'use strict';
	return {};
})();
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  version_git: {
    options: {
    },
    src: ['src/testing', 'src/123']
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
