var gulp       = require('gulp');
var sass       = require('gulp-sass');
var browserify = require('browserify');
var stringify  = require('stringify');
var source     = require('vinyl-source-stream');
var livereload = require('gulp-livereload');

gulp.task('browserify', function() {
    return browserify()
        .transform(stringify())
        .add('./src/js/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(livereload());
});

gulp.task('sass', function() {
    return gulp.src(['src/sass/app.scss'])
        .pipe(sass({
            includePaths: [
                './bower_components/bootstrap-sass/assets/stylesheets/',
                './bower_components/font-awesome/scss/'
            ]
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(livereload());
});

gulp.task('assets', function() { 
    gulp.src('./bower_components/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./dist/fonts')); 

    gulp.src('./src/img/**.*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./src/js/*.*', ['browserify']);
    gulp.watch('./src/sass/*.scss', ['sass']);
});

gulp.task('default', function() {
    gulp.start('browserify', 'sass', 'assets', 'watch');
});