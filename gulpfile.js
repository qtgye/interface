var gulp = require('gulp')
var eslint = require('gulp-eslint')
var babel = require('gulp-babel')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var jasmine = require('gulp-jasmine')

var linterConfig = {
	parserOptions : {
		ecmaVersion : 6,
	},
	rules: {
		'semi' : [1, 'never'],
	},
}


var packageScripts = [
	'src/interface.js',
	'src/module.js'
]

var specScripts = ['tests/index.js']


/** Compiles package scripts */
function combinePackageScripts () {
	return new Promise( ( resolve, reject ) => {
		gulp.src(packageScripts)
			.pipe(catchStreamError(sourcemaps.init()))
			.pipe(catchStreamError(eslint(linterConfig)))
			.pipe(catchStreamError(babel({
				'presets' : ['es2015','babili'],
			})))
			.pipe(catchStreamError(concat('interface.min.js')))
			.pipe(catchStreamError(sourcemaps.write('.')))
			.pipe(gulp.dest('dist'))
			.on('error', (err) => reject(err) )
			.on('end', () => resolve(gulp))
	});
}


/** Compiles test scripts */
function combineSpecScripts () {
	return new Promise( ( resolve, reject ) => {
		gulp.src(['dist/*.js', ...specScripts])
			.pipe(catchStreamError(jasmine({ verbose : true, includeStackTrace : true })))
			// .pipe(catchStreamError(jasmineBrowser.specRunner({ console: true })))
			// .pipe(catchStreamError(jasmineBrowser.headless()))
			.on('error', (err) => reject(err) )
			.on('end', () => resolve(gulp))
	});
}


/** Handles error in a gulp stream */
function catchStreamError ( stream, handler ) {
	let errorHandler = ( typeof handler === 'function' ) ? handler : function(err) { console.error(err) }
	stream.on( 'error', errorHandler)
	return stream
}


gulp.task('default', function () {
	combinePackageScripts()
		.then(combineSpecScripts)
		.catch( (err) => console.error(err) )
})

gulp.task('watch', ['default'], function() {
	gulp.watch([ 'src/**/*', 'tests/**/*' ], ['default'])
})