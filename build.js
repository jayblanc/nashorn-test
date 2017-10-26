var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');



var babelAndCopy = function (srcFiles, dstPath ) {
  gutil.log("babelAndCopy "+srcFiles+" -> "+dstPath );
  return gulp.src(srcFiles)
  .pipe(babel())
  .pipe(buffer())
  .pipe(gulp.dest(dstPath));
}

/**
* babelify to es5 and notify server
* @return {[type]} [description]
*/
var moveToBuild = function (srcFiles, dstPath ) {
  gutil.log("Move files "+srcFiles+" -> "+dstPath);
  return gulp.src(srcFiles)
  .pipe(gulp.dest(dstPath))
  ;
}


var forBrowser = function( srcFile, dstPath, dstFile, moduleName, externalModules) {
  gutil.log("browserify "+srcFile+" -> "+dstPath+dstFile);
  var src = moduleName ? srcFile+':'+moduleName : srcFile;
  var b = browserify(srcFile);
  if ( moduleName ) b = b.require('./'+srcFile, { expose : moduleName } );
  if ( externalModules ) b  =  b.external(externalModules);

  var stream = b.transform("babelify")
  .bundle()
  .on('error', function(e) {
    gutil.log(e);
  })
  .pipe(source(dstFile))
  .pipe(buffer())
  .pipe(gulp.dest(dstPath))
  return stream;
}

babelAndCopy('lib/*.js', 'build/lib');
forBrowser('lib/main.js', 'build/lib/', 'thenashlib.js');

