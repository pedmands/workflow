var gulp = require('gulp'),
		gutil = require('gulp-util'),
		coffee = require('gulp-coffee'),
		browserify = require('gulp-browserify'),
		compass = require('gulp-compass'),
		concat = require('gulp-concat'),
		cleanDest = require('gulp-clean-dest');
		
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]		

var sassSources = [
	'components/sass/*.scss'
]

gulp.task('coffee', function() {
	gulp.src('components/coffee/tagline.coffee')
		.pipe(coffee({bare:true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded',
			comments: true
		})
			.on('error', gutil.log))
		.pipe(gulp.dest('builds/development/css'))
		.pipe(cleanDest('css'))
});

gulp.task('default', ['coffee', 'js', 'compass']);

gulp.task('watch', function(){
	gulp.watch(jsSources, ['js']);
	gulp.watch(sassSources, ['compass']);
});