var gulp = require('gulp'),
		gutil = require('gulp-util'),
		coffee = require('gulp-coffee'),
		browserify = require('gulp-browserify'),
		connect = require('gulp-connect'),
		compass = require('gulp-compass'),
		concat = require('gulp-concat'),
		cleanDest = require('gulp-clean-dest');

var env,
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development'){
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
	sassComments = true;
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
	sassComments = false;
}

jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]		

sassSources = [
	'components/sass/*.scss'
]

htmlSources = [outputDir + '*.html']

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
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle,
			comments: sassComments
		})
			.on('error', gutil.log))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(cleanDest('css'))
		.pipe(connect.reload())
});

gulp.task('default', ['json', 'html', 'coffee', 'js', 'compass', 'connect', 'watch']);

gulp.task('watch', function(){
	gulp.watch(jsSources, ['js']);
	gulp.watch(sassSources, ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(outputDir + 'js/*.json', ['json']);
});

gulp.task('html', function(){
	gulp.src(htmlSources)
		.pipe(connect.reload())
})

gulp.task('json', function(){
	gulp.src(outputDir + 'js/*.json')
		.pipe(connect.reload())
})

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});