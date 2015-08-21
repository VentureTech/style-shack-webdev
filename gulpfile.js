var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clip = require('gulp-clip-empty-files');
var del = require('del');

var SRC_PATH = './web/src';
var BUILD_PATH = './web/build';
var DESIGN_PATH = '/design';
var JAVASCRIPT_PATH = '/javascript';
var STYLESHEETS_PATH = '/stylesheets';
var BUILD_ADMIN_PATH = BUILD_PATH + '/admin';
var BUILD_FRONTEND_PATH = BUILD_PATH + '/frontend';
var BUILD_STORES_PATH = BUILD_PATH + '/stores';

//Design tasks
gulp.task('design:clean', function(callback) {
	del([
		BUILD_ADMIN_PATH + DESIGN_PATH,
		BUILD_FRONTEND_PATH + DESIGN_PATH,
		BUILD_STORES_PATH + DESIGN_PATH
	], callback);
});

gulp.task('design:build', ['design:clean'], function() {
	return gulp
		.src(SRC_PATH + DESIGN_PATH + '/**/*')
		.pipe(gulp.dest(BUILD_ADMIN_PATH + DESIGN_PATH))
		.pipe(gulp.dest(BUILD_FRONTEND_PATH + DESIGN_PATH))
		.pipe(gulp.dest(BUILD_STORES_PATH + DESIGN_PATH));
});

gulp.task('design', ['design:build']);


//Javascript tasks
gulp.task('javascript:clean', function(callback) {
	del([
		BUILD_ADMIN_PATH + JAVASCRIPT_PATH,
		BUILD_FRONTEND_PATH + JAVASCRIPT_PATH,
		BUILD_STORES_PATH + JAVASCRIPT_PATH
	], callback);
});

gulp.task('javascript:build', ['javascript:clean'], function() {
	return gulp.src(SRC_PATH + JAVASCRIPT_PATH + '/**/*')
		.pipe(gulp.dest(BUILD_ADMIN_PATH + JAVASCRIPT_PATH))
		.pipe(gulp.dest(BUILD_FRONTEND_PATH + JAVASCRIPT_PATH))
		.pipe(gulp.dest(BUILD_STORES_PATH + JAVASCRIPT_PATH));
});

gulp.task('javascript', ['javascript:build']);


//Stylesheet tasks
gulp.task('styles:clean', function(callback) {
	del([
		BUILD_ADMIN_PATH + STYLESHEETS_PATH,
		BUILD_FRONTEND_PATH + STYLESHEETS_PATH,
		BUILD_STORES_PATH + STYLESHEETS_PATH
	], callback);
});

gulp.task('styles:build', ['styles:clean'], function () {
	return gulp.src(SRC_PATH + STYLESHEETS_PATH + '/**/*.scss')
		.pipe(clip())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest(BUILD_ADMIN_PATH + STYLESHEETS_PATH))
		.pipe(gulp.dest(BUILD_FRONTEND_PATH + STYLESHEETS_PATH))
		.pipe(gulp.dest(BUILD_STORES_PATH + STYLESHEETS_PATH));
});

gulp.task('styles', ['styles:build']);

gulp.task('default', ['app:build']);
gulp.task('app:build', ['styles', 'design', 'javascript']);