var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var runSequence = require('run-sequence').use(gulp);
gulp.task('less', function() {
    return gulp.src("./css/*.less")
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./public/css'));
});
gulp.task('minify', function() {
    return gulp.src("./public/css/*.css")
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});
gulp.task('watch', function() {
    gulp.watch('./css/*.less', function() { runSequence('less', 'minify') });
})
gulp.task('default', function() {
    runSequence('watch', 'less', 'minify');
});