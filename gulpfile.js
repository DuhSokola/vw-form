var gulp = require('gulp');
var debug = require('gulp-debug');
var url = require('url');
var proxy = require('proxy-middleware');
var inject = require('gulp-inject');
var wiredep = require('wiredep');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
/**
 * Combined Tasks
 */
gulp.task('serve',['inject', 'browserSync']);
gulp.task('inject',['injectBower','injectSources']);

/**
 * Dependency Injection
 */
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
gulp.task('browserSync', function() {
    //var proxyOptions = url.parse('http://localhost:3002/api/customers');
    //proxyOptions.route = '/api/customers';

    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: 'src'
           // middleware: [proxy(proxyOptions)]
        }
    });
    gulp.watch(['app.js','index.html','index3.html','*.css','i18n/*.json'], {cwd: 'src'}, reload);
});