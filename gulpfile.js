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
    { name: 'concat', alias: 'c', type: Boolean },
    { name: 'watch', alias: 'w', type: Boolean }
];
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);
var basePath = './';
var defaultSrc = basePath+'src/app.json';

var fs = require('fs');
var json = fs.readFileSync(options.src ? options.src : defaultSrc, 'utf8');
var path = JSON.parse(json);

var json = fs.readFileSync(basePath+'package.json', 'utf8');
var packageVars = JSON.parse(json);
var pugOptions = {
    pretty: true, 
    basedir : 'dist/',
    locals : packageVars
};

console.log('--------------------------------------------------------------------');
console.log('--------------------------------------------------------------------');
console.log('--------------------------------------------------------------------');
console.log('--------------------------------------------------------------------');
console.log('--------------------------------------------------------------------');

var Task = (function (paths) {
    var tasks = [];
    
    var add = function (name, callback, target) {
        var src = name.indexOf(":") > 0 ? name.split(":")[0] : name,
            target = target ? target : src;
        
        if (paths.source[src] && tasks.indexOf(name) < 0) {
            tasks.push(name);
            
            gulp.task(name, function (cb) {
                var pipe = callback();

                if (pipe) {
                    pipe.pipe(gulp.dest(path.dist[target]));
                }
                
                return pipe;
            });
        }
    };
    
    var addGroup = function (name, list) {
        var fList = list.filter(function (a) {
            return tasks.indexOf(a) >= 0;
        });
        
        gulp.task(name, fList);
    };
    
    var build = function (name, list) {
        gulp.task(name, tasks);
    };
    
    
    var watch = function (name) {
        gulp.task(name, function (){
            tasks.map(function (taskName){
                var src = taskName.indexOf(":") > 0 ? taskName.split(":")[0] : taskName,
                    target = taskName;

                if (paths.watch[src]) {
                    gulp.watch(paths.watch[src], function(event, cb) {
                        console.log("UPDATE ["+taskName+"]: " + event.path.substr(event.path.lastIndexOf('/') + 1));
                        gulp.start(taskName);
                    });
                }
            });
        });
    };
    
    return {
        add : add,
        build : build,
        watch : watch
    }
})(path);

Task.add('pug:build', function () {
    return gulp.src(path.source.pug)
            .pipe(pug(pugOptions))
            .pipe(gulpif(options.concat, htmlmin({collapseWhitespace: true})));
}, 'html');

Task.add('html:build', function () {
    return gulp.src(path.source.html)
            .pipe(gulpif(options.concat, htmlmin({collapseWhitespace: true})));
});

Task.add('php:build', function () {
    return gulp.src(path.source.php);
});

Task.add('js:build', function () {
    return gulp.src(path.source.js)
            .pipe(gulpif(options.concat, concat('all.min.js')))
            .pipe(gulpif(options.concat, minify({
                ext:{
                    src:'-debug.js',
                    min:'.js'
                }
            })));
});

Task.add('css:build', function () {
    return gulp.src(path.source.css)
            .pipe(cssmin())
            .pipe(gulpif(options.concat, concat('all.min.css')));
}, 'css');

Task.add('less:build', function () {
    gulp.src(path.source.less+'*.less')
            .pipe(less())
            .pipe(prefixer('last 2 versions'))
            .pipe(gulp.dest(path.dist.css))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulpif(options.concat, concat('all.min.css')))
            .pipe(gulp.dest(path.dist.css+'min/'));
});


Task.add('libs:build', function() {
    return gulp.src(path.source.libs);
});

Task.add('img:build', function() {
    return gulp.src(path.source.img)
            .pipe(imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()],
                    interlaced: true
            }));
});

Task.add('fonts:build', function() {
    return gulp.src(path.source.fonts);
});

Task.add('data:build', function() {
	return gulp.src(path.source.data);
});


Task.add('other:build', function() {
    return gulp.src(path.source.other);
});


Task.add('clean', function (cb) {
	rimraf('./dist', cb);
});

Task.build('build');
Task.watch('watch');

console.log(options);
var defaultTasks = options.watch ? ['build', 'watch'] : ['build'];
gulp.task('default', defaultTasks);

