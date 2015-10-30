var gulp = require('gulp'),
    debug = require('gulp-debug');

/**
 * Combined Tasks
 */
gulp.task('serve',['inject', 'lint', 'browserSync']);
gulp.task('lint',['html','css','js']);
gulp.task('inject',['injectBower','injectSources']);

/**
 * Dependency Injection
 */
var inject = require('gulp-inject'),
    wiredep = require('wiredep');

gulp.task('injectBower', function () {
    wiredep({
        src: './src/index.html',
        directory: './src/bower_components/',
        bowerJson: require('./bower.json')
    });
});
gulp.task('injectSources', function () {
    var target = gulp.src('./src/index.html');

    return target.pipe(inject(gulp.src(
        [
            'app.js',
            '*.css',
            'bootstrap.vw.min.css'
        ],
        {
            read: false,
            cwd: 'src'
        })
    )).pipe(gulp.dest('./src'));
});

/**
 * Server with BrowserSync
 */
var browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
    gulp.watch(['app.js','index.html','index3.html','*.css','i18n/*.json'], {cwd: 'src'}, reload);
});

/**
 * Lint
 */
var htmlhint = require('gulp-htmlhint');
gulp.task('html',function(){
    return gulp.src(['src/index.html'])
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter());
});
    
var csslint = require('gulp-csslint');
gulp.task('css', function() {
    return gulp.src(['src/main.css'])
        .pipe(csslint())
        .pipe(csslint.reporter());
});

var jshint = require('gulp-jshint');
gulp.task('js', function() {
    return gulp.src(['src/app.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

