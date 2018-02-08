'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	pug = require('gulp-pug'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
        debug = require('gulp-debug-streams'),
        concat = require('gulp-concat'),
        minify = require('gulp-minify'),
        gulpif = require('gulp-if'),
        htmlmin = require('gulp-html-minifier');

const optionDefinitions = [
  { name: 'src', alias:'s', type: String, multiple: false, defaultOption: true },
    { name: 'concat', alias: 'c', type: Boolean }
];
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);
var defaultSrc = '../src/resources.json';

var fs = require('fs');
var json = fs.readFileSync(options.src ? options.src : defaultSrc, 'utf8');
var path = JSON.parse(json);

var json = fs.readFileSync('package.json', 'utf8');
var packageVars = JSON.parse(json);
var pugOptions = {
    pretty: true, 
    basedir : 'www/',
    locals : packageVars
};
console.log('-----------------------------');

gulp.task('pug:build', function () {
	gulp.src(path.source.pug)
		.pipe(pug(pugOptions))
                .pipe(gulpif(options.concat, htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(path.dist.html));
});

gulp.task('js:build', function () {
	gulp.src(path.source.js)
                .pipe(gulpif(options.concat, concat('all.min.js')))
                .pipe(gulpif(options.concat, minify({
                    ext:{
                        src:'-debug.js',
                        min:'.js'
                    }
                })))
		.pipe(gulp.dest(path.dist.js));
});

if (path.source.css) {
    gulp.task('css:build', function () {
            gulp.src(path.source.css)
                    .pipe(cssmin())
                    .pipe(gulpif(options.concat, concat('all.min.css')))
                    .pipe(gulp.dest(path.dist.css));
    });
}

if (path.source.less) {
    gulp.task('less:build', function () {
            gulp.src(path.source.less+'*.less')
                    .pipe(less())
                    .pipe(prefixer('last 2 versions'))
                    .pipe(gulp.dest(path.dist.css))
                    .pipe(cssmin())
                    .pipe(rename({suffix: '.min'}))
                    .pipe(gulpif(options.concat, concat('all.min.css')))
                    .pipe(gulp.dest(path.dist.css+'min/'));
    });
}

gulp.task('libs:build', function() {
	gulp.src(path.source.libs)
		.pipe(gulp.dest(path.dist.libs));
});

gulp.task('image:build', function () {
	gulp.src(path.source.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts:build', function() {
	gulp.src(path.source.fonts)
		.pipe(gulp.dest(path.dist.fonts));
});

gulp.task('data:build', function() {
	gulp.src(path.source.data)
		.pipe(gulp.dest(path.dist.data));
});


gulp.task('other:build', function() {
	gulp.src(path.source.other)
		.pipe(gulp.dest(path.dist.other));
});


gulp.task('clean', function (cb) {
	rimraf('./dist', cb);
});

gulp.task('build', [
	'js:build',
	path.source.css ? 'css:build' : 'less:build',
	'libs:build',
	'fonts:build',
	'data:build',
	'image:build',
	'pug:build',
	'other:build'
]);

gulp.task('watch', function(){
	watch([path.watch.pug], function(event, cb) {
		gulp.start('pug:build');
	});
	watch([path.watch.less], function(event, cb) {
		gulp.start('less:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.libs], function(event, cb) {
		gulp.start('libs:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	watch([path.watch.data], function(event, cb) {
		gulp.start('data:build');
	});
});

gulp.task('default', ['build']);
